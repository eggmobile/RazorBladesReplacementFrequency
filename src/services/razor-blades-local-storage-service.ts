import { Injectable } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';
import { Storage } from '@ionic/storage';


@Injectable()
export class RazorBladesLocalStorageService {
  constructor(private storage: Storage) {
  }
  // データを新規に追加する
  addNewRecord(date, description): any {
    let dataObject = {
      'date': date,
      'description': description,
      'id': null
    }
    console.log("aaaaaaa");
    // storage.set()でストレージにkey, value(JSON)の形式で格納する
    let replacementData = [];
    return this.storage.get('replacementData').then(
      (val) => {
        console.log("bbbbbbbb");
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
          console.log("ccccccccc");
          let incrementalNumber = 1;
          dataObject.id = incrementalNumber;
          replacementData = [dataObject];
          // インクリメント番号を記録する
          this.storage.set('incrementalNumber', incrementalNumber);
          // データを配列ごと記録する
          this.storage.set('replacementData', replacementData);
        }
        return true;
      }, (reason) => {
        this.initRecords();
        return false;
      }
    );
  }
  // 指定データを削除する
  deleteRecordByIndex(index): any {
    // ローカルストレージから配列を取得
    return this.storage.get('replacementData').then((val) => {
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
  updateRecord(date, description, id): any {
    if (!id) {
      return false;
    }
    let record = {
      'date': date,
      'description': description,
      'id': id
    }
    // ローカルストレージから配列を取得
    return this.storage.get('replacementData').then((recordsArray) => {
      if (recordsArray) {
        for (var i = 0; i < recordsArray.length; i++) {
          if (recordsArray[i].id === record.id) {
            recordsArray[i] = record;
            recordsArray.splice(i, 1, record);
            this.storage.set('replacementData', recordsArray);
            break;
          }
        }
      }
      // ソートする
      recordsArray.sort(function (a, b) {
        if (a.date > b.date) return -1;
        if (a.date < b.date) return 1;
        return 0;
      });
      return true;
    });
  }
  // ローカルストレージから指定データを取得する
  getRecordById(id): object {
    return this.storage.get('replacementData').then((recordsArray) => {
      if (!recordsArray) {
        return null;
      }
      let specificRecord = recordsArray.filter(record => record.id === id);
      return specificRecord;
    });
  }
  // 全てのデータを取得する
  getAllRecords(): any {
    return this.storage.get('replacementData').then(
      (val) => {
        return val;
      }
    );
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