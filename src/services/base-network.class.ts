import { API_KEY } from './api-constants';
import { Observable, Subject } from 'rxjs';

export class BaseNetwork {
  private _authLostSubject = new Subject<void>();

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

  constructor(private _token?: string, private _id?: string) {}

  updateToken(token: string) {
    this._token = token;
  }

  updateId(id: string) {
    this._id = id;
  }

  fetch(url: string) {
    return (
      fetch(
        `https://www.googleapis.com/gmail/v1/users/${this._id}/${url}?key=${API_KEY}`,
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
