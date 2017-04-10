import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

import { DictionaryService } from './dictionary';
import { MassTranslationService } from './mass-translation';

@Injectable()
export class DefinitionsService {

  constructor(
    private dictionaryService: DictionaryService,
    private translationService: MassTranslationService
  ) {}

  private loadDictionary(vocab, fromLanguage, toLanguage) {
    return this.dictionaryService.lookup(vocab.baseForm, fromLanguage, toLanguage)
      .map((data) => {
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
      .map((data) => {
        return {
          vocab: vocab,
          translation: data,
          definition: null,
          gender: null,
          fl: null
        };
      });
  }

  private loadDicOrTr(vocab, fromLanguage, toLanguage) {
    return this.loadDictionary(vocab, fromLanguage, toLanguage)
      .catch(() => this.loadTranslation(vocab, toLanguage));
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

        this.loadDicOrTr(vocab, fromLanguage, toLanguage)
          .subscribe(
            (data) => {
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
