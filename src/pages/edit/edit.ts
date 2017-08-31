import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
// カスタムサービス
import { RazorBladesLocalStorageService } from '../../services/razor-blades-local-storage-service';
import { RazorBladesLocalNotificationService } from '../../services/razor-blades-local-notification-service';

@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html',
  providers: [RazorBladesLocalStorageService, RazorBladesLocalNotificationService]
})
export class EditPage {

  date;
  description;
  id;
  isUpdate;

  constructor(public navCtrl: NavController, navParams: NavParams,
    private razorBladesLocalStorageService: RazorBladesLocalStorageService,
    private razorBladesLocalNotificationService: RazorBladesLocalNotificationService) {
    this.date = navParams.get('date');
    this.description = navParams.get('description');
    this.id = navParams.get('id');
    this.isUpdate = navParams.get('isUpdate');
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
          // 元の画面に戻る
          this.navCtrl.pop();
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
          // 通知を更新する
          this.razorBladesLocalNotificationService.calculateNextNotificationDateAndTime().then((nextNotificationDateAndTime) => {
            // 通知をセットし直す
            console.log(nextNotificationDateAndTime);
            this.razorBladesLocalNotificationService.setScheduledNotification(nextNotificationDateAndTime);
          });
          // 元の画面に戻る
          this.navCtrl.pop();
        }
      });
    }
  }
  clearAll() {
    this.razorBladesLocalStorageService.clearAll();
  }
}
