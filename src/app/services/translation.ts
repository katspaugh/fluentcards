import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';

const apikey = 'trnsl.1.1.20151015T080754Z.fac48f0d13a96c3a.c0c58058288c42ba40de8aec2b36d9d86c3adb1d';
const endpoint = `https://translate.yandex.net/api/v1.5/tr.json/translate?format=html&key=${ apikey }`;

@Injectable()
export class TranslationService {

    constructor(private http: Http) {}

    translate(vocabs: any[], toLanguage: string) {
        let lines = vocabs.map((vocab) => {
            let word = vocab[1];
            let context = vocab[2];
            let replace = context.replace(new RegExp('\\b' + word + '\\b'), '<b>$&</b>');
            return replace;
        });

        let url = endpoint + '&lang=' + toLanguage;
        let body = lines.map((line) => 'text=' + encodeURIComponent(line)).join('&');

        return this.http.request(url, {
            method: 'POST',
            body: body,
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        })
            .map((res) => {
                let data = res.json();
                let lines = data.text;
                return lines.map((line) => {
                    let match = line.match(/<b>(.+?)<\/b>/);
                    return match ? match[1] : '';
                });
            });
    }

};
