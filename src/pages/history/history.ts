import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as moment from 'moment';
import { EditPage } from '../edit/edit';
// カスタムサービス
import { RazorBladesLocalStorageService } from '../../services/razor-blades-local-storage-service';
import { RazorBladesLocalNotificationService } from '../../services/razor-blades-local-notification-service';

@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
  providers: [RazorBladesLocalStorageService, RazorBladesLocalNotificationService]
})
export class HistoryPage {

  recordsArray;

  constructor(public navCtrl: NavController, 
    private razorBladesLocalStorageService: RazorBladesLocalStorageService,
    private razorBladesLocalNotificationService: RazorBladesLocalNotificationService) {
    this.razorBladesLocalStorageService.getAllRecords().then((val) => {
      this.recordsArray = val;
    });
  }

  // 画面遷移時にデータを取得する
  ionViewWillEnter() {
    this.razorBladesLocalStorageService.getAllRecords().then((val) => {
      this.recordsArray = val;
    });
  }

  // 使用日数を計算する
  calculateNumberOfDaysUsed(date, previousDate) {
    let previousDateMoment = moment(previousDate).format('YYYY-MM-DD');
    if (!previousDate) {
      previousDateMoment = moment().format('YYYY-MM-DD');
    }
    var numberOfDays = moment(previousDateMoment).diff(moment(date), "days") + 1;
    return numberOfDays;
  }

  // 記録を削除する
  deleteRecordByIndex(index) {
    this.razorBladesLocalStorageService.deleteRecordByIndex(index).then((val) => {
      this.recordsArray = val;
      // 通知を更新する
      // 通知を更新する
      this.razorBladesLocalNotificationService.calculateNextNotificationDateAndTime().then((nextNotificationDateAndTime) => {
        // 通知をセットし直す
        this.razorBladesLocalNotificationService.setScheduledNotification(nextNotificationDateAndTime);
      });
    });
  }

  // 編集ページに遷移
  openEditPage(date, description, id) {
    let dateMoment = moment(date).format('YYYY-MM-DD');
    this.navCtrl.push(EditPage, { date: dateMoment, description: description, id: id, isUpdate: true });
  }
}
