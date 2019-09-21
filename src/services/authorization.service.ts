import {UserAndToken, UserInfo} from '../types/google-apis';
import { BaseNetwork } from './base-network.class';


export class AuthorizationService {
  constructor(private _network: BaseNetwork) {}

  getAuthFromLocalStorage(): Promise<{
    authToken: string;
    userInfo: UserInfo;
  }> {
    return new Promise<UserAndToken>(
      (resolve, reject) => {
        chrome.storage.local.get(
          ['authToken', 'userInfo'],
          ({ authToken, userInfo }) => {
            try {
              userInfo = JSON.parse(userInfo);
            } catch (e) {
              console.error(
                'Cannot parse user info from localstorage: ',
                userInfo,
                e
              );
            }

            if (!authToken || !userInfo) {
              reject();
              return;
            }

            resolve({ authToken, userInfo });
          }
        );
      }
    );
  }

  doLogin(){
      return new Promise<UserAndToken>((resolve, reject) => {
          chrome.identity.getAuthToken(
              {
                  interactive: true
              },
              authToken => {
                  if (chrome.runtime.lastError) {
                      reject(chrome.runtime.lastError.message);
                      return;
                  }

                  this.getUserInfo(authToken).then(userInfo => {
                      this.putAuthToLocalStorage(userInfo, authToken);

                      resolve({
                          authToken,
                          userInfo
                      });

                      // todo through background script - do open extension popup
                  });
              }
          );
      })
  }

    putAuthToLocalStorage(userInfo: UserInfo | null, authToken: string) {
        chrome.storage.local.set({
            userInfo: JSON.stringify(userInfo),
            authToken: authToken
        });
    }

    logoutFromLocalStorage(){
        this.putAuthToLocalStorage(null, '');
    }

    getUserInfo(token: string) {
    return fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`,
      this._network.initObject
    ).then(response => response.json());
  }
}
