import {Injectable} from '@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

const endpoint = 'https://api.cognitive.microsoft.com/bing/v5.0/images/search';
const apikey = '795a42c37a6242d8867f297ceace270d';
const count = 10;

@Injectable()
export class ImageSearchService {

    constructor(private http: Http) {}

    private makeRequest(query: any): Observable<any> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('count', String(count));

        for (let key in query) {
            params.set(key, String(query[key]));
        }

        return this.http.request(endpoint, {
            method: 'GET',
            search: params,
            headers: new Headers({
                'Ocp-Apim-Subscription-Key': apikey
            })
        })
            .map((res) => res.json())
            .catch((error) => {
                let err = error.message ? error :
                    new Error(error.status ? `${error.status} - ${error.statusText}` : 'Server error');
                return Observable.throw(err);
            });
    }

    getImages(word: string) {
        return this.makeRequest({ q: word })
            .map((data) => {
                return data.value.map((item) => {
                    return {
                        thumbnail: item.thumbnailUrl,
                        full: item.contentUrl
                    };
                });
            });
    }

};
