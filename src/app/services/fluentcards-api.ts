import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

const API_URL = 'https://d2k6yi97s180ty.cloudfront.net';

@Injectable()
export class FluentcardsApiService {

  constructor(private http: Http) {}

  create(id: string, data) {
    return this.http.request(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        id: id,
        vocab: data
      })
    }).map((res) => res.json());
  }

  list() {
    return this.http.request(API_URL, {
      method: 'GET'
    }).map((res) => res.json());
  }

  get(id: string) {
    return this.http.request(`${ API_URL }/${ id }`, {
      method: 'GET'
    }).map((res) => res.json());
  }

  update(id: string, data) {
    return this.http.request(`${ API_URL }/${ id }`, {
      method: 'PUT',
      body: JSON.stringify({
        vocab: data
      })
    }).map((res) => res.json());
  }

  delete(id: string) {
    return this.http.request(`${ API_URL }/${ id }`, {
      method: 'DELETE'
    }).map((res) => res.json());
  }

};
