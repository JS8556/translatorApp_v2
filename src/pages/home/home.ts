import { Component, Output } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslationData } from '../../providers/translation-data';

import { SpeechRecognition } from '@ionic-native/speech-recognition';

import { TranslationHistoryProvider } from '../../providers/translation-history/translation-history';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private speechToTextEnabled = false;

  private textForTranslation:string = '';
  private cardContent:string = '';

  constructor(public navCtrl: NavController, private translation: TranslationData, private speechRecognition: SpeechRecognition, private translationHistory: TranslationHistoryProvider) {

    // test if speech to text is enabled
    this.speechRecognition.isRecognitionAvailable()
    .then((available: boolean) => this.speechToTextEnabled = available)
  }

  /**
   * user input
   * @param tText 
   */
  public translateClick(tText:string){
    this.textForTranslation = tText;

    console.log(this.textForTranslation);

    // pass text for translation to translation service
    this.translation.getTranslation(this.textForTranslation).subscribe( (result) => {
      this.cardContent = result.responseData.translatedText;

      this.translationHistory.pushToHistory(this.textForTranslation, result.responseData.translatedText);
    });
  }

  /**
   *  Event handler for speech recognition
   */
  public speechToText() {
    if(this.speechToTextEnabled){
      // speech recognition is available
      
      // at first, check we have permissions
      this.speechRecognition.hasPermission()
      .then((hasPermission: boolean) => {

        if(hasPermission){
          // we have permissions, lets go
          this.recogniseSpeech();
        } else {
          // request permissions
          this.speechRecognition.requestPermission()
          .then(
            () => {
              // permissions granted
              this.recogniseSpeech();
            },
            () => {
              // permissions denied

          });
        }

      });
    
      
    } else {
      // speech recognition is disabled
      console.log('Speech recognition not available.');
    }
  }

  private recogniseSpeech(){

    let options = {
      language: "cs-CZ",
      matches: 1
    }

    // start recognition
    this.speechRecognition.startListening(options)
    .subscribe(
      (matches: Array<string>) => {
        // we get array of recognized words, lets join them and trigger the translation
       let text = matches.join(' ');
       //this.translateClick(text);

       this.cardContent = text;
      },
      (onerror) => console.log('error:', onerror)
    );
  }

}
