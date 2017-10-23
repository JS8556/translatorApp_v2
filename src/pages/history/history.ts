import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslationHistoryProvider } from '../../providers/translation-history/translation-history';
import { Translation } from '../../model/translation';

import { TextToSpeech } from '@ionic-native/text-to-speech';

@Component({
  selector: 'page-history',
  templateUrl: 'history.html'
})
export class HistoryPage {

  historyArray: Translation[];

  constructor(public navCtrl: NavController, private translationHistory: TranslationHistoryProvider, private tts: TextToSpeech) {

  }

  ionViewWillEnter () {
    this.historyArray = this.translationHistory.getHistoryData();
  }

  public deleteHistory(item:Translation) {
    alert('Item to delete: '+item.translationResult);

    // TODO: delete item from history array
    this.historyArray = this.historyArray.filter(obj => obj !== item);
  }

  public hear(item:Translation){
    // implement text to speech native API
    // pass translationResult to text to speech API
    this.tts.speak(item.translationResult)
    .then(() => console.log('Success: ' + item.translationResult))
    .catch((reason: any) => console.log(reason));
  }
}
