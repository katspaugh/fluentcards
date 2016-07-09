import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/retry';

const apikey = 'trnsl.1.1.20160709T114928Z.d289f2f0447d4972.a9f325d9c4ec15a544fd5a72517cd7ca643aa03d';
const endpoint = `https://translate.yandex.net/api/v1.5/tr.json/translate?format=html&key=${ apikey }`;

@Injectable()
export class TranslationService {

    constructor(private http: Http) {}

    private makeRequest(url, body): Promise<any> {
        return this.http.request(url, {
            method: 'POST',
            body: body,
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        })
            .retry(3)
            .toPromise()
            .then((res) => res.json())
            .then((data) => {
                if (data.code != 200) throw new Error(data.message);
                return data;
            })
            .catch((error) => {
                let err = error.message ? error :
                    new Error(error.status ? `${error.status} - ${error.statusText}` : 'Server error');
                throw err;
            });
    }

    private encodeLine(text: string, word: string): string {
        return text.replace(new RegExp('\\b' + word + '\\b'), '<b>$&</b>');
    }

    private decodeLine(text: string): string {
        let match = text.match(/<b>(.+?)<\/b>/);
        return match ? match[1] : '';
    }

    translate(vocabs: any[], toLanguage: string): Observable<any> {
        const PER_PAGE = 100;

        let url = endpoint + '&lang=' + toLanguage;
        let origLines = vocabs.map((vocab) => this.encodeLine(vocab[2], vocab[1]));
        let translatedWords = [];
        let resultOberserver = new Subject();

        let request = (skip) => {
            let lines = origLines.slice(skip, skip + PER_PAGE);
            let body = lines.map((line) => 'text=' + encodeURIComponent(line)).join('&');

            return this.makeRequest(url, body)
                .then((data) => {
                    translatedWords = translatedWords.concat(data.text.map(this.decodeLine));

                    resultOberserver.next({
                        language: data.lang.split('-')[0],
                        translations: translatedWords
                    })
                });
        };

        let requests = [];
        for (let i = 0; i < origLines.length; i += PER_PAGE) {
            requests.push(() => request(i));
        }

        requests.slice(1).reduce((acc, next) => acc.then(next), requests[0]())
            .then(() => {
                resultOberserver.complete();
                resultOberserver.unsubscribe();
            })
            .catch((err) => resultOberserver.error(err));

        return resultOberserver;
    }

};
