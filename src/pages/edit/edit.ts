import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
// カスタムサービス
import { RazorBladesLocalStorageService } from '../../services/razor-blades-local-storage-service';
import { RazorBladesLocalNotificationService } from '../../services/razor-blades-local-notification-service';
// AdMob
import { AdMobPro } from '@ionic-native/admob-pro';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html',
  providers: [RazorBladesLocalStorageService, RazorBladesLocalNotificationService, AdMobPro]
})
export class EditPage {

  date;
  description;
  id;
  isUpdate;

  constructor(
    public navCtrl: NavController, navParams: NavParams,
    private razorBladesLocalStorageService: RazorBladesLocalStorageService,
    private razorBladesLocalNotificationService: RazorBladesLocalNotificationService,
    private admob: AdMobPro,
    private platform: Platform,
    public viewCtrl: ViewController
  ) {
    this.date = navParams.get('date');
    this.description = navParams.get('description');
    this.id = navParams.get('id');
    this.isUpdate = navParams.get('isUpdate');
    this.initAd();
  }

  // データを追加する
  addRazorBladeData() {
    if (!this.description) {
      this.description = '';
    }
    // idがある場合は更新、ない場合は新規追加する
    if (this.id) {
      // 更新する
      this.razorBladesLocalStorageService.updateRecord(this.date, this.description, this.id).then((val) => {
        if (val) {
          // 通知を更新して元の画面に戻る
          this.updateNotificationThenBackPage(false);
        }
      });
    } else {
      // 新規追加する
      let razorBladeData = {
        'date': this.date,
        'description': this.description
      };
      this.razorBladesLocalStorageService.addNewRecord(this.date, this.description).then((val) => {
        if (val) {
          // 通知を更新して元の画面に戻る
          this.updateNotificationThenBackPage(true);
        }
      });
    }
  }
  // ストレージを全て空にする(デバッグ用)
  clearAll() {
    this.razorBladesLocalStorageService.clearAll();
  }
  // 通知を更新して元の画面に戻る
  updateNotificationThenBackPage(isNewData:boolean) {
    // 通知を更新する
    this.razorBladesLocalNotificationService.calculateNextNotificationDateAndTime().then((nextNotificationDateAndTime) => {
      // 通知をセットし直す
      this.razorBladesLocalNotificationService.setScheduledNotification(nextNotificationDateAndTime);
      // インタースティシャル広告を出す
      if (this.admob) this.admob.showInterstitial();
      // 元の画面に戻る
      if(isNewData){
        this.dismiss(isNewData);
        return;
      }else{
        this.navCtrl.pop();
        return;
      }
    });
  }

  ionViewDidLoad() {
    this.admob.onAdDismiss()
      .subscribe(() => { console.log('User dismissed ad'); });
  }

  ionViewWillEnter() {
    this.viewCtrl.showBackButton(false);
  }

  // インタースティシャル広告を表示する
  initAd() {
    let adId;
    if (this.platform.is('android')) {
      adId = 'ca-app-pub-1851198495819784/1364018682';
      // adId = { // for Android
      //   banner: 'ca-app-pub-1851198495819784/8013187519',
      //   interstitial: 'ca-app-pub-1851198495819784/1364018682'
      // };
    } else if (this.platform.is('ios')) {
      adId = 'ca-app-pub-1851198495819784/3665860344';
      // adId = { // for iOS
      //   banner: 'ca-app-pub-1851198495819784/9764364834',
      //   interstitial: 'ca-app-pub-1851198495819784/3665860344'
      // };
    }
    // 広告を準備しとく
    this.admob.prepareInterstitial({ adId: adId, autoShow: false });
  }

  // モーダルを閉じる
  dismiss(isReplacedRazor) {
    let data = { 'isReplacedRazor': isReplacedRazor };
    this.viewCtrl.dismiss(data);
  }
}
