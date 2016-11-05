import {Injectable, Inject} from '@angular/core';

@Injectable()
export class SpeechService {

  constructor(
    @Inject('Window') private window: Window
  ) {}

  speak(text, lang) {
    let speech = new this.window.SpeechSynthesisUtterance();
    speech.text = text;
    speech.lang = lang;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  }

};
