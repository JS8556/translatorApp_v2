import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslationHistoryProvider } from '../../providers/translation-history/translation-history';
import { Translation } from '../../model/translation';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  historyArray: Translation[];

  constructor(public navCtrl: NavController, private translationHistory: TranslationHistoryProvider) {

  }

  ionViewWillEnter () {
    this.historyArray = this.translationHistory.getHistoryData();
  }

}
