import { ReplaySubject } from 'rx-lite';
import config from '../../config';

const localStorage = window.localStorage;
const { apiUrl } = config;
const subject = new ReplaySubject(1);

let userData = null;

export default class User {
  static subject;

  static get() {
    return userData;
  }

  static set(data) {
    userData = data;
    subject.onNext(userData);
    this.save();
  }

  static save() {
    return localStorage.setItem('user', JSON.stringify(userData));
  }

  static restore() {
    return JSON.parse(localStorage.getItem('user'));
  }

  static requestToken(code, csrf) {
    return fetch(new Request(`${ apiUrl }/auth`, {
      mode: 'cors',
      method: 'POST',
      body: JSON.stringify({ code, csrf })
    }))
      .then(resp => resp.json());
  }

  static requestAppId() {
    return fetch(new Request(`${ apiUrl }/credentials`, {
      mode: 'cors'
    }))
      .then(resp => resp.json());
  }

  static updateScore(scores) {
    if (!userData) return;

    userData.scores = scores;

    this.save();

    return fetch(new Request(`${ apiUrl }/scores`, {
      mode: 'cors',
      method: 'PUT',
      body: JSON.stringify(userData)
    }))
      .then(resp => resp.json());
  }
}

User.subject = subject;
// Restore from the localStorage
User.set(User.restore());
