import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';

import {DictionaryService} from './dictionary';
import {TranslationService} from './translation';

@Injectable()
export class DefinitionsService {

    constructor(
        private dictionaryService: DictionaryService,
        private translationService: TranslationService
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
        return this.translationService.translate(vocab.word, vocab.context, toLanguage)
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

    private detectLanguage(vocab) {
        return this.translationService.detectLanguage(vocab.context);
    }

    load(vocabs, fromLanguage, toLanguage) {
        const delay = 100; // a delay to avoid DoSing the services

        return this.detectLanguage(vocabs[0])
            .flatMap((lang) => {
                fromLanguage = lang || fromLanguage;

                return Observable
                    .from(vocabs)
                    .flatMap((vocab, index) => {
                        return Observable
                            .of(vocab)
                            .delay(delay * index);
                    })
                    .flatMap((vocab) => {
                        return this.loadDictionary(vocab, fromLanguage, toLanguage)
                            .catch(() => this.loadTranslation(vocab, toLanguage));
                    });
            });
    }

};
