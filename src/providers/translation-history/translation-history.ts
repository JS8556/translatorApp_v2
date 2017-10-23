import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Translation } from '../../model/translation';

import { Storage } from '@ionic/storage';

/*
  Generated class for the TranslationHistoryProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TranslationHistoryProvider {

  private historyArray: Translation[];

  constructor(public http: Http, private storage: Storage) {
    console.log('Hello TranslationHistoryProvider Provider');

    this.storage.get('historyAll').then((val:Translation[]) => {
      console.log('History: ' + val);
      if(val != null)
      {
        this.historyArray = val;
      }else{
        this.historyArray = [];
      }
      
    });

    //this.historyArray = [];
  }

  pushToHistory (text, result) {
    let transObj = new Translation(text, result);
    this.historyArray.unshift(transObj);
    this.storage.set('historyAll', this.historyArray);
  }

  getHistoryData():Array<Translation> {
    return this.historyArray;
  }

  setHistoryData(hArray:Translation[]){
    this.historyArray = hArray;
    this.storage.set('historyAll', this.historyArray);
  }

}
