import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';
// カスタムサービス
import { RazorBladesLocalStorageService } from '../../services/razor-blades-local-storage-service';
import { RazorBladesLocalNotificationService } from '../../services/razor-blades-local-notification-service';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [RazorBladesLocalStorageService, RazorBladesLocalNotificationService]
})
export class SettingsPage {

  isNotifyReplacement;
  frequencyUnit;
  frequencyNumber;
  frequencyMonthlyDate;
  frequencyWeeklyDay;
  frequencyTime;
  nextNotificationDateAndTime;

  constructor(public navCtrl: NavController, navParams: NavParams,
    private razorBladesLocalStorageService: RazorBladesLocalStorageService,
    private razorBladesLocalNotificationService: RazorBladesLocalNotificationService,
    private chRef: ChangeDetectorRef) {
  }

  ionViewWillEnter() {
    this.getInitialData();
  }

  // 設定を初期化
  getInitialData() {
    this.razorBladesLocalStorageService.getIsNotifyReplacement().then((val => {
      this.isNotifyReplacement = val;
      this.chRef.detectChanges();
    }));
    this.razorBladesLocalStorageService.getFrequencyNumber().then((val => {
      this.frequencyNumber = val;
      this.chRef.detectChanges();
    }));
    this.razorBladesLocalStorageService.getFrequencyUnit().then((val => {
      this.frequencyUnit = val;
      this.chRef.detectChanges();
    }));
    this.razorBladesLocalStorageService.getFrequencyMonthlyDate().then((val => {
      this.frequencyMonthlyDate = moment().startOf('year').date(val).format();
      this.chRef.detectChanges();
    }));
    this.razorBladesLocalStorageService.getFrequencyWeeklyDay().then((val => {
      this.frequencyWeeklyDay = val;
      this.chRef.detectChanges();
    }));
    this.razorBladesLocalStorageService.getFrequencyTime().then((val => {
      // 本日の日付を元にDateObjectに変更する
      let timeObj = moment(val, 'hh:mm').format();
      this.frequencyTime = timeObj;
      this.chRef.detectChanges();
    }));
    this.getNextNotificationDateAndTime();
    // ログを確認
    this.razorBladesLocalStorageService.getAllStoragesAsLog();
  }
  // 通知予定日を取得する
  getNextNotificationDateAndTime() {
    this.razorBladesLocalStorageService.getNextNotificationDateAndTime().then((nextNotificationDateAndTime) => {
      console.log(nextNotificationDateAndTime);
      if (moment(nextNotificationDateAndTime).isValid()) {
        this.nextNotificationDateAndTime = nextNotificationDateAndTime;
        this.chRef.detectChanges();
      }
    });
  }

  // 通知設定の各パラメータを登録する
  setNotificationParam(key: string, value: any) {
    this.razorBladesLocalNotificationService.setNotificationParam(key, value).then((nextNotificationDateAndTime)=>{
      if (moment(nextNotificationDateAndTime).isValid()) {
        this.nextNotificationDateAndTime = nextNotificationDateAndTime;
        this.chRef.detectChanges();
      }
    });
    this.chRef.detectChanges();
  }
}
