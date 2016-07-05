import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

const apikey = 'trnsl.1.1.20151015T080754Z.fac48f0d13a96c3a.c0c58058288c42ba40de8aec2b36d9d86c3adb1d';
const endpoint = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${ apikey }`;

@Injectable()
export class TranslationService {

    constructor(private http: Http) {}

    translate(vocabs: any[], toLanguage: string) {
        const NL = '\n';

        let text = vocabs.map((vocab) => {
            let word = vocab[1];
            let context = vocab[2];
            let replace = context.replace(new RegExp('\\b' + word + '\\b'), '<b>$&</b>');
            return replace;
        }).join(NL);

        let url = endpoint + '&text=' + encodeURIComponent(text) + '&lang=' + toLanguage;

        return this.http.get(url)
            .map((res) => {
                let data = res.json();
                let lines = data.text[0].split(NL);
                return lines.map((line) => {
                    let match = line.match(/<b>(.+?)<\/b>/);
                    return match ? match[1] : '';
                });
            });
    }

};
