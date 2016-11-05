import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

const API_KEY = 'dHJuc2wuMS4xLjIwMTYwNzA5VDExNDkyOFouZDI4OWYyZjA0NDdkNDk3Mi5hOWYzMjVkOWM0ZWMxNWE1NDRmZDVhNzI1MTdjZDdjYTY0M2FhMDNk';
const TRANSLATE_URL = 'https://translate.yandex.net/api/v1.5/tr.json/translate?format=html';
const DETECT_URL = 'https://translate.yandex.net/api/v1.5/tr.json/detect';

const PUNCTUATION = /[–,.;:'"()!?%&*=\[\]«»<>]+/g;
const PUNCTUATION_MINUS_QUOTE = /[–,.;:"()!?%&*=\[\]«»<>]+/g;
const CHUNK_DELIM = '. ';

@Injectable()
export class MassTranslationService {

  constructor(private http: Http) {}

  private makeRequest(url: string, query): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    let body = [];

    query.key = atob(API_KEY);

    for (let key in query) {
      let value = query[key];
      if (value instanceof Array) {
        value.forEach((item) => body.push(key + '=' + String(item)));
      } else {
        body.push(key + '=' + String(value));
      }
    }

    return this.http.post(url, body.join('&'), options)
      .map((res) => res.json());
  }

  private splitChunks(text) {
    let chunks = [];
    text.replace(/.+?([;.\n]|$)+/g, (chunk) => {
      chunks.push(chunk);
    });
    return chunks;
  }

  private splitWords(text) {
    return text.match(/(\s+|\S+)/g);
  }

  private createWordTags(words) {
    return words.map((word, index) => {
      return /\S/.test(word) ?
        `<b ${ index }>${ word }</b>` :
        word;
    });
  }

  private extractTranslations(text) {
    let notes = [];

    text.replace(/<b (\d+)[^>]*>(.+?)<\/b>/g, ($0, index, word) => {
      notes[index] = word;
    });

    return notes;
  }

  private transformTranslations(annotations) {
    annotations.reduce((prev, item) => {
      if (item.text.replace(PUNCTUATION, '') == '') {
        prev.text += item.text;
        item.text = '';
        return prev;
      }
      return item;
    });

    // Merge together subsequent words that correspond to a single
    // translation
    annotations.forEach((item, index) => {
      if (item.note) {
        var delim = annotations[index + 1];
        var next = annotations[index + 2];

        if (next && next.note == item.note && /^\s*$/.test(delim.text)) {
          item.text = item.text + delim.text + next.text;
          delim.text = '';
          next.text = '';
        }
      }
    });

    annotations.forEach((item) => {
      if (item.note) {
        let parts = item.note.split(',');
        item.note = parts[0] || parts[1];
        item.note = item.note.replace(PUNCTUATION_MINUS_QUOTE, '');
      }
    });

    annotations.forEach((item) => {
      const nonWord = new RegExp('^' + PUNCTUATION + '$', 'g');

      if (item.note && nonWord.test(item.note)) {
        delete item.note;
      }
    });

    return annotations.filter((item) => item.text);
  }

  detectLanguage(text: string) {
    return this.makeRequest(DETECT_URL, { text: text })
      .map((data) => data.code == 200 ? data.lang : null);
  }

  translate(text: string, toLanguage: string): Observable<any> {
    let wordLists = this.splitChunks(text).map((chunk) => this.splitWords(chunk));

    let htmlChunks = wordLists.map((words) => {
      let tags = this.createWordTags(words);
      return tags.join('');
    });

    return this.makeRequest(TRANSLATE_URL, { text: htmlChunks, lang: toLanguage })
      .map((data) => {
        if (data.code != 200) throw new Error(data.message);

        let translations = [];

        data.text.forEach((item, index) => {
          let words = wordLists[index];
          let notes = this.extractTranslations(item);

          words.forEach((word, index) => {
            let tr = <any>{ text: words[index] };
            if (notes[index]) tr.note = notes[index];
            translations.push(tr);
          });
        });

        return {
          lang: data.lang.split('-')[0],
          translations: this.transformTranslations(translations)
        };
      });
  }

  /* Translate a single word */
  private encodeLine(text: string, word: string): string {
    let replace = text.replace(new RegExp('\\b' + word + '\\b'), '<b>$&</b>');
    // Languages like Japanese and Chinese don't have written word boundaries.
    if (replace == text) {
      replace = text.replace(word, '<b>$&</b>');
    }
    return replace;
  }

  private decodeLine(text: string): string {
    let match = text.match(/<b>(.+?)<\/b>/);
    let word = match ? match[1] : '';
    return word.replace(/[,.?!():;]/g, '');
  }

  translateWord(word: string, context: string, toLanguage: string): Observable<any> {
    let text = this.encodeLine(context, word);
    return this.makeRequest(TRANSLATE_URL, { text: text, lang: toLanguage })
      .map((data) => {
        if (data.code != 200) throw new Error(data.message);
        return this.decodeLine(data.text[0]);
      });
  }

};
