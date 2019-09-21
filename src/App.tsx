import React, { Component } from 'react';
import './App.css';
import { Popup } from './components/Popup/Popup';
import { Dashboard } from './components/Dashboard/Dashboard';
import { LabelsService } from './services/labels.service';
import { BaseNetwork } from './services/base-network.class';
import { Subscription } from 'rxjs';
import { StartScreen } from './components/StartScreen/StartScreen';

type AppProps = {
  isAuthorized: boolean;
  authToken: string;
  userInfo: {
    id: string;
    email: string;
    verified_email: boolean;
    picture: string;
    hd: string;
  };
};
type AppState = {};

class App extends Component<AppProps, AppState> {
  _network = new BaseNetwork();
  _labelsService = new LabelsService(this._network);
  _subscriptions: Subscription[] = [];

  state = {
    isAuthorized: false,
    userInfo: null
  };

  get _contentComponent() {
    let { location } = window;

    return location.hash === '#dashboard' ? (
      <Dashboard></Dashboard>
    ) : (
      <Popup></Popup>
    );
  }

  componentDidMount() {
    this._subscriptions.push(
      this._network.authLost.subscribe(_ => {
        this.setState({
          authToken: '',
          isAuthorized: false,
          userInfo: null
        });
      })
    );

    debugger;
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
          return;
        }

        this.setState({
          authToken,
          isAuthorized: authToken && userInfo,
          userInfo
        });

        this._network.updateToken(authToken);
        this._network.updateId(userInfo.email);

        debugger;
        this._labelsService.list().then(data => {
          debugger;
          console.log(data);
          if (data) {
            alert('_labelsService: ' + JSON.stringify(data));
          }
        });
      }
    );
  }

  componentWillUnmount() {
    this._subscriptions.forEach(s => s.unsubscribe());
  }

  render() {
    let componentToDisplay = this.state.isAuthorized ? (
      this._contentComponent
    ) : (
      <StartScreen doLogin={() => this._doLogin()} />
    );

    return <div className="App">{componentToDisplay}</div>;
  }

  private _doLogin() {
    chrome.identity.getAuthToken(
      {
        interactive: true
      },
      token => {
        if (chrome.runtime.lastError) {
          alert(chrome.runtime.lastError.message);
          return;
        }

        this._getUserInfo(token).then(userInfo => {
          // todo through background script - do open extension popup
          this.setState({
            authToken: token,
            isAuthorized: true,
            userInfo
          });

          chrome.storage.local.set({
            userInfo: JSON.stringify(userInfo),
            authToken: token
          });
        });
      }
    );
  }

  private _getUserInfo(token: string) {
    return fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`,
      this._network.initObject
    ).then(response => response.json());
  }
}

export default App;
