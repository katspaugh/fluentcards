import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Rx';

import {DictionaryService} from './dictionary';
import {MassTranslationService} from './mass-translation';

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
      .catch(() => this.loadTranslation(vocab, toLanguage))
        .toPromise();
  }

  private detectLanguage(vocab) {
    return this.translationService.detectLanguage(vocab.context);
  }

  // Sequentially load definitions to avoid DoSing the service
  load(vocabs, fromLanguage, toLanguage) {
    let subj = new Subject();

    let load = (index) => {
      let vocab = vocabs[index];
      if (!vocab) {
        subj.complete();
        return;
      }

      return this.loadDicOrTr(vocab, fromLanguage, toLanguage)
        .then((data) => {
          subj.next(data);
          load(index + 1);
        })
    };

    this.detectLanguage(vocabs[0])
      .subscribe((lang) => {
        fromLanguage = lang || fromLanguage;
        load(0);
      });

    return subj;
  }

};
