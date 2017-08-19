import { Injectable } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';
import { Storage } from '@ionic/storage';


@Injectable()
export class RazorBladesLocalStorageService {
  constructor(private storage: Storage) {
  }
  // データを新規に追加する
  addNewRecord(dataObject): any {
    // storage.set()でストレージにkey, value(JSON)の形式で格納する
    let replacementData = [];
    return this.storage.get('replacementData').then(
      (val) => {
        replacementData = val;
        if (replacementData) {
          // IDを取得する
          this.storage.get('incrementalNumber').then((val) => {
            // IDをインクリメントして記録する
            let incrementalNumber = val + 1;
            dataObject.id = incrementalNumber;
            this.storage.set('incrementalNumber', incrementalNumber);
            // データを追加
            replacementData.unshift(dataObject);
            console.log(replacementData);
            // ソートする
            replacementData.sort(function (a, b) {
              if (a.date > b.date) return -1;
              if (a.date < b.date) return 1;
              return 0;
            });
            // データを配列ごと記録する
            this.storage.set('replacementData', replacementData);
          });
        } else {
          let incrementalNumber = 0;
          dataObject.id = incrementalNumber;
          replacementData = [dataObject];
          // データを配列ごと記録する
          this.storage.set('incrementalNumber', incrementalNumber);
        }
        return true;
      }, (reason) => {
        this.initRecords();
        return false;
      }
    );
  }
  // 指定データを削除する
  deleteRecord(index): any {
    // ローカルストレージから配列を取得
    return this.storage.get('replacementData').then(
      (val) => {
        // 配列から指定データを削除
        val.splice(index, 1);
        let recordsArray = val;
        return this.storage.set('replacementData', recordsArray).then(() => {
          // 配列を返す
          console.log("recordsArray");
          console.log(recordsArray);
          return recordsArray;
        });
      });
  }
  // 指定データを更新する
  updateRecord(id): boolean {
    // ソートしてから配列全体をローカルストレージに保存し直す
    return true;
  }
  // ローカルストレージから指定データを取得する
  getRecord(id): object {
    // 時間はISO8601
    let object = {
      'id': 0,
      'date': '2017-08-16T14:40:10+0900',
      'description': 'ジレット　フュージョン　5+1'
    };
    return object;
  }
  // 全てのデータを取得する
  getAllRecords(): any {
    return this.storage.get('replacementData').then(
      (val) => {
        return val;
      }
    );
  }
  // 配列を日付順にソートして保存し直す
  sortDataByDate() {
    // 新規追加、更新、削除を行う度に実行する
  }
  // データを初期化
  initRecords() {
    // 空の配列を配置する
    this.storage.clear().then(() => {
      this.storage.set('replacementData', []);
    });
  }
  // 最新のレコードを取得
  getMostRecentRecord(): any {
    return this.getAllRecords().then((val) => {
      let mostRecentRecord = {};
      if (val) {
        mostRecentRecord = val[0];
      }
      return mostRecentRecord;
    });
  }
  // 全消去
  clearAll() {
    this.storage.clear();
  }
}