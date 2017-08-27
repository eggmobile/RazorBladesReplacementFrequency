import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';
// カスタムサービス
import { RazorBladesLocalStorageService } from '../../services/razor-blades-local-storage-service';
// ローカル通知
import { LocalNotifications } from '@ionic-native/local-notifications';
// プラットフォーム検知
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [RazorBladesLocalStorageService, LocalNotifications]
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
    private localNotifications: LocalNotifications,
    public plt: Platform) {
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
    this.setScheduledNotification();
  }

  setScheduledNotification() {
    // Schedule a single notification
    this.localNotifications.schedule({
      id: 1,
      at: new Date(new Date().getTime()),
      text: 'Single ILocalNotification'
    });
  }
}
