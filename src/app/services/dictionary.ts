import {Injectable} from '@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';

const apiKeys = [
    'ZGljdC4xLjEuMjAxNTA4MTdUMDgxMTAzWi43YWM4YTUzODk0OTFjYTE1LjkxNjQwNjQwNzEyM2Y2MDlmZDBiZjkzYzEyMjE5MGQ1NmFmNjM1OWM=',
    'ZGljdC4xLjEuMjAxNDA4MTBUMTgwODQyWi40YzA1ZmEyMzkyOWQ4OTFiLjA5Y2QzOTUyZDQ4Njk2YzYzOWIxNjRhNzcxZjY5NDU2N2IwNGJkZWY=',
    'ZGljdC4xLjEuMjAxNDExMjJUMTIwMzA2Wi40ZTQ2NzY1ZGQyMDYwMTBhLjNlNGExYjE4MmRmNWQ4OTJmZDc0ZGQzZTQ0ZjM4OWIwZTVhZWVhMjQ='
];
const endpoint = `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?&flags=4`;

@Injectable()
export class DictionaryService {

    constructor(private http: Http) {}

    private makeRequest(query: any): Observable<any> {
        let params: URLSearchParams = new URLSearchParams();

        for (let key in query) {
            params.set(key, String(query[key]));
        }

        return this.http.request(endpoint, {
            method: 'GET',
            search: params
        }).map((res) => res.json());
    }

    lookup(word, fromLang, toLang) {
        return this.makeRequest({
            text: word,
            lang: `${ fromLang }-${ toLang }`,
            key: atob(apiKeys[~~(Math.random() * apiKeys.length)])
        })
            .map((data) => {
                if (data.def.length > 0) return data.def;
                throw new Error('No definition found.');
            });
    }

};
