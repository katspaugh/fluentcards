import {Injectable} from '@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

const endpoint = 'https://mtvj4vwn56.execute-api.eu-west-1.amazonaws.com/dev/';


@Injectable()
export class JishoService {

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

  lookup(word) {
    return this.makeRequest({ keyword: word })
      .map(json => {
        return json.data[0] ? {
          meaning: json.data[0].senses[0].english_definitions.slice(0, 3).join('; '),
          reading: json.data[0].japanese[0].reading
        } : {
          meaning: '',
          reading: ''
        }
      });
  }

};
