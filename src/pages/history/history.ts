import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslationHistoryProvider } from '../../providers/translation-history/translation-history';
import { Translation } from '../../model/translation';

@Component({
  selector: 'page-history',
  templateUrl: 'history.html'
})
export class HistoryPage {

  historyArray: Translation[];

  constructor(public navCtrl: NavController, private translationHistory: TranslationHistoryProvider) {

  }

  ionViewWillEnter () {
    this.historyArray = this.translationHistory.getHistoryData();
  }

  public deleteHistory(item:Translation) {
    alert('Item to delete: '+item.translationResult);

    // TODO: delete item from history array
  }

  public hear(item:Translation){
    // implement text to speech native API
    // pass translationResult to text to speech API
  }
}
