import { Injectable } from '@angular/core';
import * as moment from 'moment';
// カスタムサービス
import { RazorBladesLocalStorageService } from './razor-blades-local-storage-service';
// ローカル通知
import { LocalNotifications } from '@ionic-native/local-notifications';
// 翻訳
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class RazorBladesLocalNotificationService {

  constructor(
    private razorBladesLocalStorageService: RazorBladesLocalStorageService,
    private localNotifications: LocalNotifications,
    private translateService: TranslateService) {
  }

  // 通知をスケジュールする
  // 通知は複数持たない。設定の度に一度クリアする。
  setScheduledNotification(nextNotificationDateAndTime: string) {
    // 一度スケジュールを全部消す
    this.localNotifications.clearAll().then(() => {
      // 通知を全部消す
      let scheduleDate = moment(nextNotificationDateAndTime).toDate();
      // 新規スケジュールを追加
      this.razorBladesLocalStorageService.getIsNotifyReplacement().then((val) => {
        this.translateService.get('ITS_THE_TIME_TO_CHANGE_YOUR_RAZOR_BLADE').subscribe(
          value => {
            // value is our translated string
            let notificationMessage = value;
            if (val) {
              this.localNotifications.schedule({
                id: 1,
                at: scheduleDate,
                text: notificationMessage
              });
            }
          }
        )
      });
    });
  }

  // 設定値を登録する
  setNotificationParam(key: string, value: any): any {
    switch (key) {
      case 'isNotifyReplacement':
        this.razorBladesLocalStorageService.setIsNotifyReplacement(value);
        break;
      case 'frequencyUnit':
        this.razorBladesLocalStorageService.setFrequencyUnit(value);
        break;
      case 'frequencyNumber':
        this.razorBladesLocalStorageService.setFrequencyNumber(value);
        break;
      case 'frequencyMonthlyDate':
        let dateNum = moment(value).date();
        this.razorBladesLocalStorageService.setFrequencyMonthlyDate(dateNum);
        break;
      case 'frequencyWeeklyDay':
        this.razorBladesLocalStorageService.setFrequencyWeeklyDay(value);
        break;
      case 'frequencyTime':
        let hh = moment(value).format('HH').toString();
        let mm = moment(value).format('mm').toString();
        this.razorBladesLocalStorageService.setFrequencyTime(hh, mm);
        break;
    }
    // 次回通知日次を計算する
    return this.calculateNextNotificationDateAndTime().then((nextNotificationDateAndTime) => {
      // 通知をセットし直す
      this.setScheduledNotification(nextNotificationDateAndTime);
      // 次回通知日時を返す
      console.log(nextNotificationDateAndTime);
      return nextNotificationDateAndTime;
    });
  }

  // 次回通知日時を計算する
  calculateNextNotificationDateAndTime(): any {
    // 最新のレコードを取得
    return this.razorBladesLocalStorageService.getMostRecentRecord().then((mostRecentRecord) => {
      return this.razorBladesLocalStorageService.getFrequencyTime().then((frequencyTime) => {
        let frequencyTimeHh = Number(moment(frequencyTime, 'HH:mm').format('H'));
        let frequencyTimeMm = Number(moment(frequencyTime, 'HH:mm').format('m'));
        let baseDate = moment(mostRecentRecord.date).hours(frequencyTimeHh).minutes(frequencyTimeMm).seconds(0).milliseconds(0);
        if (!mostRecentRecord.date) {
          // 最新のレコードがない場合は本日日付を設定する
          baseDate = moment().hours(frequencyTimeHh).minutes(frequencyTimeMm).seconds(0).milliseconds(0);
        }
        let formatedDate = baseDate.format();
        return this.razorBladesLocalStorageService.getFrequencyUnit().then((frequencyUnit) => {
          switch (frequencyUnit) {
            case 'days':
              // 日次のとき
              // baseDateにfrequencyNumber分の日数を加算する
              return this.razorBladesLocalStorageService.getFrequencyNumber().then((frequencyNumber) => {
                let nextNotificationDateAndTimeMoment = baseDate.add(frequencyNumber, 'days');
                // nextNotificationDateAndTimeが過去の場合、未来日になるまでfrequencyNumber日分の加算を繰り返す
                while (moment().isAfter(nextNotificationDateAndTimeMoment)) {
                  nextNotificationDateAndTimeMoment = baseDate.add(frequencyNumber, 'days');
                }
                let nextNotificationDateAndTime = nextNotificationDateAndTimeMoment.format();
                this.razorBladesLocalStorageService.setNextNotificationDateAndTime(nextNotificationDateAndTime);
                return nextNotificationDateAndTime;
              });
            case 'weeks':
              // 週次のとき
              // 設定曜日の番号を取得
              return this.razorBladesLocalStorageService.getFrequencyWeeklyDay().then((frequencyWeeklyDay) => {
                // 設定した週の指定曜日を取得
                let weekNum = this.getWeekNumber(frequencyWeeklyDay);
                let baseDateDesignatedWeek = baseDate.day(weekNum);
                // 指定の数だけ週数を加算
                return this.razorBladesLocalStorageService.getFrequencyNumber().then((frequencyNumber) => {
                  let nextNotificationDateAndTimeMoment = baseDateDesignatedWeek.add(frequencyNumber, 'weeks');
                  // nextNotificationDateAndTimeが過去の場合、未来日になるまでfrequencyNumber週分の加算を繰り返す
                  while (moment().isAfter(nextNotificationDateAndTimeMoment)) {
                    nextNotificationDateAndTimeMoment = baseDateDesignatedWeek.add(frequencyNumber, 'weeks');
                  }
                  let nextNotificationDateAndTime = nextNotificationDateAndTimeMoment.format();
                  this.razorBladesLocalStorageService.setNextNotificationDateAndTime(nextNotificationDateAndTime);
                  return nextNotificationDateAndTime;
                });
              });
            case 'months':
              // 月次のとき
              return this.razorBladesLocalStorageService.getFrequencyMonthlyDate().then((frequencyMonthlyDateNum) => {
                let isNotifyThisMonth = frequencyMonthlyDateNum - baseDate.date();
                let startOfNotificationMonth = baseDate.startOf('month').hours(frequencyTimeHh).minutes(frequencyTimeMm).seconds(0).milliseconds(0);
                // 通知日が当月に存在するか確認する(2月31日となってしまう場合は、2月末に変更する)
                if (frequencyMonthlyDateNum >= 29) {
                  let endOfDateInNotificationMonthNum = startOfNotificationMonth.endOf('date').date();
                  let dateDifference = endOfDateInNotificationMonthNum - frequencyMonthlyDateNum;
                  if (frequencyMonthlyDateNum < 0) {
                    frequencyMonthlyDateNum = endOfDateInNotificationMonthNum;
                  }
                }
                // 指定の数だけ月数を加算
                return this.razorBladesLocalStorageService.getFrequencyNumber().then((frequencyNumber) => {
                  let nextNotificationDateAndTimeMoment = startOfNotificationMonth.date(frequencyMonthlyDateNum).add(frequencyNumber, 'months');
                  // nextNotificationDateAndTimeが過去の場合、未来日になるまでfrequencyNumber月分の加算を繰り返す
                  while (moment().isAfter(nextNotificationDateAndTimeMoment)) {
                    nextNotificationDateAndTimeMoment = startOfNotificationMonth.date(frequencyMonthlyDateNum).add(frequencyNumber, 'months');
                  }
                  let nextNotificationDateAndTime = nextNotificationDateAndTimeMoment.format();
                  this.razorBladesLocalStorageService.setNextNotificationDateAndTime(nextNotificationDateAndTime);
                  return nextNotificationDateAndTime;
                });
              });
          }
        });
      });
    });
  }

  // 曜日を番号に変換
  getWeekNumber(dayString: string): number {
    switch (dayString) {
      case 'Sunday':
        return 0;
      case 'Monday':
        return 1;
      case 'Tuesday':
        return 2;
      case 'Wednesday':
        return 3;
      case 'Thursday':
        return 4;
      case 'Friday':
        return 5;
      case 'Saturday':
        return 6;
    }
  }
}