import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';

const apikey = 'dHJuc2wuMS4xLjIwMTYwNzA5VDExNDkyOFouZDI4OWYyZjA0NDdkNDk3Mi5hOWYzMjVkOWM0ZWMxNWE1NDRmZDVhNzI1MTdjZDdjYTY0M2FhMDNk';
const endpoint = `https://translate.yandex.net/api/v1.5/tr.json/translate?format=html&key=${ atob(apikey) }`;

@Injectable()
export class TranslationService {

    constructor(private http: Http) {}

    private makeRequest(query): Observable<any> {
        let params: URLSearchParams = new URLSearchParams();

        for (let key in query) {
            params.set(key, String(query[key]));
        }

        return this.http.request(endpoint, {
            method: 'GET',
            search: params
        }).map((res) => res.json());
    }

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

    translate(word: string, context: string, toLanguage: string): Observable<any> {
        let text = this.encodeLine(context, word);
        return this.makeRequest({ text: text, lang: toLanguage })
            .map((data) => {
                if (data.code != 200) throw new Error(data.message);
                return this.decodeLine(data.text[0]);
            });
    }

};
