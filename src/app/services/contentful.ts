import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';

const API_KEY = 'f432147e456896bb8bc564da9ce2c04c3c3859702f4093772987fbcb494366ae';
const SPACE_ID = 'yqbw2youdyfv';

@Injectable()
export class ContentfulService {
  client: any;

  constructor(@Inject('Window') private window: Window) {
    this.client = window.contentful.createClient({
      accessToken: API_KEY,
      space: SPACE_ID
    })
  }

  getEntries(params: any) {
    return Observable.fromPromise(Promise.resolve(this.client.getEntries(params)));
  }

  getEntry(id: string) {
    return Observable.fromPromise(Promise.resolve(this.client.getEntry(id)));
  }

};
