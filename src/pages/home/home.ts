import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EditPage } from '../edit/edit';
import * as moment from 'moment';
// カスタムサービス
import { RazorBladesLocalStorageService } from '../../services/razor-blades-local-storage-service';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [RazorBladesLocalStorageService]
})
export class HomePage {

  currentRazorBlade;
  date;
  description;
  numberOfDaysUsed;

  constructor(public navCtrl: NavController, private razorBladesLocalStorageService: RazorBladesLocalStorageService) {
    this.date = null;
    this.description = '';
    this.numberOfDaysUsed = 0;
  }

  // 編集ページに遷移
  openEditPage() {
    // 現在日時を渡しながら編集ページに遷移
    let date = moment().format('YYYY-MM-DD');
    this.navCtrl.push(EditPage, { date: date });
  }

  // 画面遷移時にデータを取得する
  ionViewWillEnter() {
    this.razorBladesLocalStorageService.getMostRecentRecord().then((val) => {
      this.date = val.date;
      this.description = val.description;
      this.numberOfDaysUsed = this.calculateNumberOfDaysUsed(this.date);
    });
  }

  // 利用日数の計算を行う
  calculateNumberOfDaysUsed(date) {
    let previousDateMoment = moment().format('YYYY-MM-DD');
    var numberOfDays = moment(previousDateMoment).diff(moment(date), "days") + 1;
    return numberOfDays;
  }
}
