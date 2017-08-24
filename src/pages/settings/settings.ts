import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';
// カスタムサービス
import { RazorBladesLocalStorageService } from '../../services/razor-blades-local-storage-service';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [RazorBladesLocalStorageService]
})
export class SettingsPage {

  isNotifyReplacement;
  frequencyUnit;
  frequencyNumber;
  frequencyMonthlyDate;
  frequencyWeeklyDay;
  frequencyTime;
  nextNotificationDateAndTime;

  constructor(public navCtrl: NavController, navParams: NavParams, private razorBladesLocalStorageService: RazorBladesLocalStorageService) {
  }


  // 画面遷移時に画面に表示しているデータを更新する
  ionViewWillEnter() {
    this.razorBladesLocalStorageService.getMostRecentRecord().then((val) => {
      this.isNotifyReplacement = false;
      this.frequencyNumber = '3';
      this.frequencyUnit = 'weeks';
      this.frequencyMonthlyDate = moment().format();
      this.frequencyWeeklyDay = moment().format('dddd');
      this.frequencyTime = moment().format();
      this.nextNotificationDateAndTime = moment().format();
    });
  }
}
