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
    // storage.set()でストレージにkey, value(JSON)の形式で格納する
    let replacementData = [];
    return this.storage.get('replacementData').then(
      (val) => {
        replacementData = val;
        if (replacementData) {
          // IDを取得する
          return this.storage.get('incrementalNumber').then((val) => {
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
            return true;
          });
        } else {
          let incrementalNumber = 1;
          dataObject.id = incrementalNumber;
          replacementData = [dataObject];
          // インクリメント番号を記録する
          this.storage.set('incrementalNumber', incrementalNumber);
          // データを配列ごと記録する
          this.storage.set('replacementData', replacementData);
          return true;
        }
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
  // 繰り返し通知時間
  setFrequencyTime(hh: string, mm: string) {
    let timeString = hh + ':' + mm;
    this.storage.set('frequencyTime', timeString);
  }
  getFrequencyTime(): any {
    return this.storage.get('frequencyTime').then((val) => {
      let result = val;
      if (!val) {
        result = '07:00';
        this.setFrequencyTime('07', '00');
      }
      return result;
    });
  }
  // 繰り返しタイプ
  // days, weeks, months
  setFrequencyUnit(frequencyUnit: string) {
    this.storage.set('frequencyUnit', frequencyUnit);
  }
  getFrequencyUnit(): any {
    return this.storage.get('frequencyUnit').then((val) => {
      let result = val;
      if (!val) {
        result = 'weeks';
        this.setFrequencyUnit(result);
      }
      return result;
    });
  }
  // 繰り返し数
  setFrequencyNumber(frequencyNumber: number) {
    this.storage.set('frequencyNumber', frequencyNumber);
  }
  getFrequencyNumber(): any {
    return this.storage.get('frequencyNumber').then((val) => {
      let result = val;
      if (!val) {
        result = '3';
        this.setFrequencyNumber(result);
      }
      return result;
    });
  }
  // 繰り返し週　曜日
  setFrequencyWeeklyDay(frequencyWeeklyDay: number) {
    this.storage.set('frequencyWeeklyDay', frequencyWeeklyDay);
  }
  // 繰り返し週　曜日
  getFrequencyWeeklyDay(): any {
    return this.storage.get('frequencyWeeklyDay').then((val) => {
      let result = val;
      if (!val) {
        result = 'Sunday';
        this.setFrequencyWeeklyDay(result);
      }
      return result;
    });
  }
  // 繰り返し月　日  
  setFrequencyMonthlyDate(frequencyMonthlyDate) {
    this.storage.set('frequencyMonthlyDate', frequencyMonthlyDate);
  }
  getFrequencyMonthlyDate(): any {
    return this.storage.get('frequencyMonthlyDate').then((val) => {
      let result = val;
      if (!val) {
        result = 1;
        this.setFrequencyMonthlyDate(result);
      }
      return result;
    });
  }
  // 通知を行うかどうか 
  setIsNotifyReplacement(isNotifyReplacement: boolean) {
    this.storage.set('isNotifyReplacement', isNotifyReplacement);
  }
  getIsNotifyReplacement(): any {
    return this.storage.get('isNotifyReplacement').then((val) => {
      let result = val;
      if (!val) {
        result = false;
        this.setIsNotifyReplacement(result);
      }
      return result;
    });
  }

  // 次回通知日時
  setNextNotificationDateAndTime(nextNotificationDateAndTime: string) {
    this.storage.set('nextNotificationDateAndTime', nextNotificationDateAndTime);
  }
  getNextNotificationDateAndTime(): any {
    return this.storage.get('nextNotificationDateAndTime').then((val) => {
      let result = val;
      if (!val) {
        result = null;
      }
      return result;
    });
  }

  // デバッグ用
  getAllStoragesAsLog() {
    this.storage.forEach((value, key, index) => {
      console.log("This is the value", value);
      console.log("from the key", key);
      console.log("Index is", index);
    })
  }
}