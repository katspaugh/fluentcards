import {Injectable, Inject} from '@angular/core';

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

};
