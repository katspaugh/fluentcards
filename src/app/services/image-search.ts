import {Injectable} from '@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

const endpoint = 'https://api.cognitive.microsoft.com/bing/v5.0/images/search';
const apiKeys = [
  'Nzk1YTQyYzM3YTYyNDJkODg2N2YyOTdjZWFjZTI3MGQ=',
  'MTFiM2M0MjM2YzI2NDM5NzlkYTM5MzA1MmRjOGExNmM=',
  'NmY0MDM3YmNiMjdmNGNiNzg0OThiMGQ5YzllYmFjZTQ=',
  'N2I5OWMzNGU1Y2E2NGE4ZDg3YWZiZjEzNDMyMDY0NzM=',
  'N2I5OWMzNGU1Y2E2NGE4ZDg3YWZiZjEzNDMyMDY0NzM=',
  'OTAyZjUwZjljZTdkNDIzMjg5ZDU2Y2FkODJjNWNlNTA=',
  'N2I5OWMzNGU1Y2E2NGE4ZDg3YWZiZjEzNDMyMDY0NzM=',
  'ZjRiMTA4Nzg2M2U5NDk2YTk4MGEzOWU0ODc1NGU3MTU=',
  'ZWEwYzY5YzRlYWI5NGYwNzkzN2NkNDc0YzlmNWFjN2M=',
  'NTI2MDUxZmUyMjYzNDMxNWE1ZTFiODU3NzMxMDRmYmU='
];

const notFoundError = 'No images found.'

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
    return this.makeRequest({ q: word, count: 10, mkt: mkt })
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
