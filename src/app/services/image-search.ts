import {Injectable} from '@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

const endpoint = 'https://api.cognitive.microsoft.com/bing/v5.0/images/search';
const apiKeys = [
  'NzkxMWMyMDRhMzg3NDlhY2JhMTlkMjZlNmJiMmU3NjM=',
  'NTNlMWE4OWVjYTBlNGI3NTkyMTU5Yjg5MzJiZWIyNGQ=',
  'NDAwNDU3ZDBmMzUzNDc3YWEzNmY4ODJiYjg0NDRjYjU=',
  'MjQ1NWEzMTQzYmY2NDYwMmFmZDdlNWI2ZmQ2OTdlZDU=',
  'OWM3ZWFlN2VmNDkwNGEzOWIzNTU4M2QwZjYzNDQ1ZmE='
];

const notFoundError = 'No images found.'
const imagesCount = 15;

@Injectable()
export class ImageSearchService {

  constructor(private http: Http) {}

  private makeRequest(query: any): Observable<any> {
    let params: URLSearchParams = new URLSearchParams();

    for (let key in query) {
      params.set(key, String(query[key]));
    }

    return this.http.request(endpoint, {
      method: 'GET',
      search: params,
      headers: new Headers({
        'Ocp-Apim-Subscription-Key': atob(apiKeys[ ~~(Math.random() * apiKeys.length) ])
      })
    })
      .map((res) => res.json());
  }

  getImages(word: string, language: string) {
    let mkt = language + '-' + language.toUpperCase();
    return this.makeRequest({ q: word, count: imagesCount, mkt: mkt })
      .map((data) => {
        if (!data.value.length) throw new Error(notFoundError);

        return data.value.map((item) => {
          return {
            thumbnail: item.thumbnailUrl,
            full: item.contentUrl
          };
        });
      });
  }

  getSingleImage(word: string, language: string) {
    let mkt = language + '-' + language.toUpperCase();
    return this.makeRequest({ q: word, count: 1, mkt: mkt })
      .map((data) => {
        let item = data.value[0];

        if (!item) throw new Error(notFoundError);

        return {
          thumbnail: item.thumbnailUrl,
          full: item.contentUrl
        };
      });
  }

};
