import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

import { DictionaryService } from './dictionary';
import { MassTranslationService } from './mass-translation';
import { WordsApiService } from './words-api';
import { JishoService } from './jisho';

@Injectable()
export class DefinitionsService {

  constructor(
    private dictionaryService: DictionaryService,
    private translationService: MassTranslationService,
    private jishoService: JishoService,
    private wordsApiService: WordsApiService
  ) {}

  private loadDictionary(vocab, fromLanguage, toLanguage) {
    return this.dictionaryService.lookup(vocab.baseForm, fromLanguage, toLanguage)
      .map(data => {
        let def = data[0];
        return {
          vocab: vocab,
          translation: def.tr[0].text,
          definition: def,
          gender: def.gen,
          fl: def.fl
        };
      });
  }

  private loadTranslation(vocab, toLanguage) {
    return this.translationService.translateWord(vocab.word, vocab.context, toLanguage)
      .map(data => ({
        vocab: vocab,
        translation: data
      }));
  }

  private loadDicOrTr(vocab, fromLanguage, toLanguage) {
    return this.loadDictionary(vocab, fromLanguage, toLanguage);
  }

  private loadJapanese(vocab) {
    return this.jishoService.lookup(vocab.word)
      .map(data => ({
        vocab: vocab,
        translation: data.meaning,
        reading: data.reading
      }));
  }

  private loadWordsApi(vocab) {
    return this.wordsApiService.lookup(vocab.baseForm)
      .map(data => {
        const result = data.results[0];

        if (!vocab.context && result.examples) {
          vocab.context = result.examples[0];
        }

        return {
          vocab: vocab,
          translation: data.results[0].definition,
          reading: data.pronunciation ?
            data.pronunciation[result.partOfSpeech] || data.pronunciation.all : ''
        };
      });
  }

  private detectLanguage(vocabs) {
    const text = vocabs.slice(0, 20)
      .map(v => v.context || v.word)
      .join('\n');
    return this.translationService.detectLanguage(text);
  }

  // Sequentially load definitions to avoid DoSing the service
  load(vocabs, fromLanguage, toLanguage) {
    return Observable.create(observer => {
      let load = (index) => {
        let vocab = vocabs[index];

        if (!vocab) {
          observer.complete();
          return;
        }

        let req;

        if (fromLanguage === 'en' && toLanguage === 'en') {
          req = this.loadWordsApi(vocab);
        }
        else if (fromLanguage === 'ja' && toLanguage === 'en') {
          req = this.loadJapanese(vocab);
        }
        else {
          req = this.loadDicOrTr(vocab, fromLanguage, toLanguage);
        }

        req
          .catch(() => this.loadTranslation(vocab, toLanguage))
          .subscribe(data => {
            observer.next(data);
            load(index + 1);
          });
      };

      this.detectLanguage(vocabs)
        .subscribe((lang) => {
          fromLanguage = lang || fromLanguage;
          load(0);
        });
    });
  }

};
