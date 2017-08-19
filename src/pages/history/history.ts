import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as moment from 'moment';
// カスタムサービス
import { RazorBladesLocalStorageService } from '../../services/razor-blades-local-storage-service';


@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
  providers: [RazorBladesLocalStorageService]
})
export class HistoryPage {

  recordsArray;

  constructor(public navCtrl: NavController, private razorBladesLocalStorageService: RazorBladesLocalStorageService) {
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
  deleteRecord(index) {
    this.razorBladesLocalStorageService.deleteRecord(index).then((val) => {
      this.recordsArray = val;
    });
  }
}
