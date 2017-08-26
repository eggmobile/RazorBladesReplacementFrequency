import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as moment from 'moment';
import { EditPage } from '../edit/edit';
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
  deleteRecordByIndex(index) {
    this.razorBladesLocalStorageService.deleteRecordByIndex(index).then((val) => {
      this.recordsArray = val;
    });
  }

  // 編集ページに遷移
  openEditPage(date, description, id) {
    let dateMoment = moment(date).format('YYYY-MM-DD');
    this.navCtrl.push(EditPage, { date: dateMoment, description: description, id: id });
  }

  // // 翻訳済みの日付を返す
  // getTranslatedDate(date) {
  //   // 日付のフォーマットを言語によって設定する
  //   return this.translate.get("DATE_FORMAT").subscribe((res: string) => {
  //     let dateTranslated = moment(date).format(res);
  //     return dateTranslated;
  //   });
  // }
}
