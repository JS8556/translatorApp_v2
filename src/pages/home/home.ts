import { Component, Output } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslationData } from '../../providers/translation-data';
import { Translation } from '../../model/translation';

import { SpeechRecognition } from '@ionic-native/speech-recognition';

import { TextToSpeech } from '@ionic-native/text-to-speech';

import { TranslationHistoryProvider } from '../../providers/translation-history/translation-history';

import { Storage } from '@ionic/storage';

// Zone for updating UI
import { NgZone } from '@angular/core';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private speechToTextEnabled = false;

  private textForTranslation:string = '';
  private cardContent:string = '';

  private checkTts:boolean;

  constructor(public navCtrl: NavController, private translation: TranslationData, private speechRecognition: SpeechRecognition, private translationHistory: TranslationHistoryProvider, private zone:NgZone, private tts: TextToSpeech, private storage: Storage) {

    // test if speech to text is enabled
    this.speechRecognition.isRecognitionAvailable()
    .then((available: boolean) => this.speechToTextEnabled = available);

    //load data from local storage
    this.storage.get('ttsChecked').then((val:boolean) => {
      console.log('Tts checked: ' + val);
      if(val != null)
      {
        this.checkTts = val;
      }else{
        this.checkTts = false;
      }
    });

    

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
      // could be run outside of this NgZone, run it always inside, for refresh UI
        this.cardContent = result.responseData.translatedText;

        this.translationHistory.pushToHistory(this.textForTranslation, result.responseData.translatedText);

        if(this.checkTts){
          this.tts.speak(result.responseData.translatedText)
          .then(() => console.log('Success: ' + result.responseData.translatedText))
          .catch((reason: any) => console.log(reason));
        }

    });
  }


  public updateTts(){
    console.log('Tts changed to: ' + this.checkTts);
    this.storage.set('ttsChecked', this.checkTts);
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
       this.zone.run(() => {
        this.translateClick(text);
       });
      },
      (onerror) => console.log('error:', onerror)
    );
  }

}
