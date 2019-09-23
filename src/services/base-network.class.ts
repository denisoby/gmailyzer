import { API_KEY } from './api-constants';
import { Observable, Subject } from 'rxjs';

export class BaseNetwork {
  private _authLostSubject = new Subject<void>();
  private _authObtainedSubject = new Subject<void>();

  get initObject() {
    return {
      headers: {
        Authorization: 'Bearer ' + this._token,
        'Content-Type': 'application/json'
      }
    };
  }

  get authLost(): Observable<void> {
    return this._authLostSubject.asObservable();
  }

  get authObtained(): Observable<void> {
    return this._authObtainedSubject.asObservable();
  }

  constructor(private _token?: string, private _id?: string) {}

  updateTokenAndId(token: string, id: string) {
    this._token = token;
    this._id = id;
  }

  fetch(url: string, params?: {[name: string]: any}) {
    params = {
      key: API_KEY,
      ...params
    };

    const paramsSerialized = Object.entries(params)
        .filter(([key, value]) => !!value)
        .map((keyValue: (string|number)[]) => keyValue.join('='))
        .join('&');

    return (
      fetch(
        `https://www.googleapis.com/gmail/v1/users/${this._id}/${url}?${paramsSerialized}`,
        this.initObject
      )
        // .catch(err => {
        //   // todo handle network errors
        //   err;
        //   debugger;
        // })
        .then(response => {
          if (response.status === 401) {
            this._authLostSubject.next();
            return null;
          }

          return response.json();
        })
    );
  }
}
