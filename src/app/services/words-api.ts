import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

const endpoint = 'https://dphk13sebjka5.cloudfront.net';

@Injectable()
export class WordsApiService {

  constructor(private http: Http) {}

  lookup(word) {
    return this.http.request(`${ endpoint }/${ word }`)
      .map((res) => res.json());
  }

};
