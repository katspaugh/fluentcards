import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/catch';

import {MassTranslationService} from '../../services/mass-translation';
import {DictionaryService} from '../../services/dictionary';
import {ContentfulService} from '../../services/contentful';
import {SpeechService} from '../../services/speech';

const TARGET_LANG = 'en';
const SKIP_WORDS = [ 'a', 'an', 'the', 'and', 'but', 'of', 'of the', 'not', 'to', 'from', 'in', 'in it', 'as', 'so', 'at', 'on', 'with', 'have', 'has', 'am', 'are', 'is', 'was', 'were', 'it', 'i', 'you', 'he', 'she', 'me', 'him', 'her', 'my', 'your', 'his', 'before', 'after', 'you are' ];

@Component({
    selector: 'story-view',
    styleUrls: [ './story-view.css' ],
    templateUrl: './story-view.html'
})
export class StoryView {

    private sub: any;
    id: string;
    data: any;
    selectedItem: any;
    definitions: any;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private translationService: MassTranslationService,
        private dictionaryService: DictionaryService,
        private contentfulService: ContentfulService,
        private speechService: SpeechService
    ) {
        this.sub = this.route.params.subscribe((params) => {
            this.id = params['id'];

            this.restoreCache() || this.loadEntry(this.id)
                .catch(() => this.router.navigate([ '' ]));
        });

    }
    private restoreCache() {
        let cache = localStorage.getItem(this.id);
        if (!cache) return;
        this.data = JSON.parse(cache);
        return this.data;
    }

    private saveCache() {
        localStorage.setItem(this.id, JSON.stringify(this.data));
    }

    private cleanupWord(text) {
        const PUNCTUATION = /[–,.;:"()!?%&*=\[\]«»<>]+/g;
        return text.replace(PUNCTUATION, '').trim();
    }

    private markDupes(translations) {
        const MAX_DUPE = 4;

        let unique = {};

        translations.forEach((item, index) => {
            if (!item.note) return;

            let note = this.cleanupWord(item.note).toLowerCase();

            if (SKIP_WORDS.indexOf(note) > -1) {
                item.dupe = MAX_DUPE;
                return;
            }

            let key = note + '//' + this.cleanupWord(item.text).toLowerCase();
            if (unique[key]) {
                unique[key] += 1;
            } else {
                unique[key] = 1;
            }

            item.dupe = Math.min(unique[key], MAX_DUPE);
        });

        return translations;
    }

    private transformNewlines(data) {
        data.body = data.body.replace(/\n/g, ' ☙ ');
        return data;
    }

    private loadTranslations(text) {
        this.data.translations = [];
        text.split(' ').forEach((word) => {
            this.data.translations.push(
                { text: word, note: ' ' },
                { text: ' ' }
            );
        });

        this.translationService.detectLanguage(text.slice(0, 200))
            .subscribe((lang) => {
                this.data.lang = lang || TARGET_LANG;
            });

        this.translationService.translate(text, TARGET_LANG)
            .subscribe((data) => {
                this.data.translations = this.markDupes(data.translations);
                this.data.lang = data.lang;

                this.saveCache();
            });
    }

    private loadEntry(id: string) {
        return this.contentfulService.client.getEntry(id)
            .then((data) => this.data = data.fields)
            .then((fields) => this.transformNewlines(fields))
            .then((fields) => this.loadTranslations(fields.body));
    }

    selectWord(item) {
        this.selectedItem = null;
        this.definitions = null;

        let word = this.cleanupWord(item.text);
        if (!word) return;

        this.selectedItem = {
            text: word,
            note: item.note
        };

        this.dictionaryService.lookup(word, this.data.lang, TARGET_LANG)
            .subscribe(
                (data) => this.definitions = data,

                (err) => {
                    if (this.selectedItem.note) return;

                    this.translationService.translate(word, TARGET_LANG)
                        .subscribe((data) => this.selectedItem.note = data.translations[0].note);
                }
            );

        this.speechService.speak(word, this.data.lang);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

}
