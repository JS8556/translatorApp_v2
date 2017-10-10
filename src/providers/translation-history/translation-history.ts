import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Translation } from '../../model/translation';

/*
  Generated class for the TranslationHistoryProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TranslationHistoryProvider {

  private historyArray: Translation[];

  constructor(public http: Http) {
    console.log('Hello TranslationHistoryProvider Provider');
    this.historyArray = [];
  }

  pushToHistory (text, result) {
    let transObj = new Translation(text, result);
    this.historyArray.unshift(transObj);
  }

  getHistoryData():Array<Translation> {
    return this.historyArray;
  }

}
