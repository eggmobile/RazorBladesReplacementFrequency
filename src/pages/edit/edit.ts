import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
// カスタムサービス
import { RazorBladesLocalStorageService } from '../../services/razor-blades-local-storage-service';

@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html',
  providers: [RazorBladesLocalStorageService]
})
export class EditPage {

  date;
  description;

  constructor(public navCtrl: NavController, navParams: NavParams, private razorBladesLocalStorageService: RazorBladesLocalStorageService) {
    let dateMoment = navParams.get("date");
    this.date = dateMoment;
    this.description = navParams.get("description");
  }

  // データを追加する
  addRazorBladeData() {
    // // 全部消す
    // this.razorBladesLocalStorageService.clearAll();
    if (!this.description) {
      this.description = '';
    }
    let razorBladeData = {
      'date': this.date,
      'description': this.description
    };
    console.log(razorBladeData);
    this.razorBladesLocalStorageService.addNewRecord(razorBladeData).then((val) => {
      if (val) {
        // 元の画面に戻る
        this.navCtrl.pop();
      }
    });
  }
}
