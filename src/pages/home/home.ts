import { Component, ChangeDetectorRef } from '@angular/core';
import { ModalController, NavParams } from 'ionic-angular';
import { EditPage } from '../edit/edit';
import * as moment from 'moment';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
// カスタムサービス
import { RazorBladesLocalStorageService } from '../../services/razor-blades-local-storage-service';
import { Http } from '@angular/http';

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
  glittering = false;
  removingButton = false;
  tremblingButton = false;
  // ngx-translate
  // currentLang: string;
  // availableLangs: Array<string>;
  // tlParams: any = {
  //   param1: 'hoge',
  //   param2: 'fuga'
  // };

  constructor(
    public modalCtrl: ModalController,
    private razorBladesLocalStorageService: RazorBladesLocalStorageService,
    public translate: TranslateService,
    private http: Http,
    private chRef: ChangeDetectorRef,
    private navParams: NavParams
  ) {
    this.date = null;
    this.description = '';
    this.numberOfDaysUsed = 0;
    // // ngx-translate
    // console.log("getDefaultLang=" + translate.getDefaultLang());
    // console.log("currentLang=" + translate.currentLang);
    // this.currentLang = translate.currentLang; // カレント言語
    // this.availableLangs = translate.getLangs(); // 利用可能言語
    // // 同期で翻訳を取得する.翻訳のロードが終わっていない場合はkeyが返されるので注意が必要.
    // console.log("instant=" + translate.instant("test1"));

    // // 非同期で翻訳を取得する.安全に取得できる.
    // translate.get("test2", this.tlParams).subscribe((res: string) => {
    //   console.log(res);
    // });
    // // 言語の変更を検知する.ロード完了後にコールバックが動くので、instantを使ってもいい.
    // translate.onLangChange.subscribe((event: LangChangeEvent) => {
    //   console.log("instant=" + translate.instant("test1"));
    // });

    // // momentJsのテスト -------------------------------------------------------
    // // 月次アラート用のテスト　月末処理について
    // let momentEndOfMonth = moment('2017-02-01');
    // // 2月に31日指定を行ったら日付はどのようになるのか。
    // // →3日分溢れて、3月3日と出力される。
    // let testOutput1 = momentEndOfMonth.date(31).format();
    // console.log('momentjs テスト出力');
    // console.log(testOutput1);
  }

  // 編集ページに遷移
  openEditPage() {
    let ctrl = this;
    // ボタンを震えさせる
    this.tremblingButton = true;
    // しばらく震えさせたあと、ボタンを移動させる
    setTimeout(function () {
      ctrl.tremblingButton = false;
      ctrl.removingButton = true;
      // その後画面遷移する
      setTimeout(function () {
        // 現在日時を渡しながら編集ページに遷移
        let today = moment().format('YYYY-MM-DD');
        // ctrl.navCtrl.push(EditPage, { date: today });
        let editModal = ctrl.modalCtrl.create(EditPage, { date: today }, { 'showBackdrop': true });
        editModal.onDidDismiss(data => {
          if (data.isReplacedRazor) {
            // 光らせる
            ctrl.glittering = true;
            ctrl.ionViewWillEnter();
            setTimeout(function () {
              ctrl.glittering = false;
            }, 15000);
          }
          ctrl.ionViewWillEnter();
        });
        editModal.present();
      }, 150);
    }, 500);
  }
  // 画面遷移前
  ionViewWillEnter() {
    this.removingButton = false;
    this.tremblingButton = false;
    this.razorBladesLocalStorageService.getMostRecentRecord().then((val) => {
      this.date = val.date;
      this.description = val.description;
      this.numberOfDaysUsed = this.calculateNumberOfDaysUsed(this.date);
      this.chRef.detectChanges();
    });
  }
  // 画面遷移後
  ionViewDidEnter() {
    this.glittering = false;
  }
  // 利用日数の計算を行う
  calculateNumberOfDaysUsed(date) {
    var numberOfDays = 0;
    if (date) {
      let previousDateMoment = moment().format('YYYY-MM-DD');
      numberOfDays = moment(previousDateMoment).diff(moment(date), "days") + 1;
    }
    return numberOfDays;
  }

  onSelectLang(lang: string) {
    this.translate.use(lang);
  }
}
