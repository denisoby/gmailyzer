import React, { Component } from 'react';
import './App.css';
import { Popup } from './components/Popup/Popup';
import { Dashboard } from './components/Dashboard/Dashboard';
import { BaseNetwork } from './services/base-network.class';
import { Subscription } from 'rxjs';
import { StartScreen } from './components/StartScreen/StartScreen';
import { UserInfo } from './types/google-apis';
import { AuthorizationService } from './services/authorization.service';
import { DataProviderService } from './services/data-provider.service';

type AppState = {
  authToken: string;
  userInfo: UserInfo | null;
  isAuthorized: boolean;
  data: {
    labels: {
      [id: string]: {
        id: string;
        name: string;
        count: number
      };
    };
  };
  status: any;
};

type AppProps = {};

class App extends Component<AppProps, AppState> {
  _network = new BaseNetwork();
  _authorizationService = new AuthorizationService(this._network);
  _dataProviderService = new DataProviderService(this._network);
  _subscriptions: Subscription[] = [];

  state = {
    isAuthorized: false,
    authToken: '',
    userInfo: null,
    data: {
      labels: {}
    },
    status: null
  };

  get _contentComponent() {
    let { location } = window;

    return location.hash === '#dashboard' ? (
      <Dashboard {...this.state.data}></Dashboard>
    ) : (
      <Popup {...this.state.data}></Popup>
    );
  }

  componentDidMount() {
    // todo remove debug
    window['logoutFromLocalStorage'] = () =>
      this._authorizationService.logoutFromLocalStorage();

    this._subscriptions.push(
      this._network.authLost.subscribe(_ => this._setLoginState('', null))
    );

    this._authorizationService
      .getAuthFromLocalStorage()
      .then(({ authToken, userInfo }) =>
        this._setLoginState(authToken, userInfo)
      );
  }

  componentDidUpdate(
    prevProps: Readonly<AppProps>,
    prevState: Readonly<AppState>,
    snapshot?: any
  ): void {
    if (this.state.isAuthorized && !prevState.isAuthorized) {
      this._updateData();
    }
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

  private _updateData() {
    const dataStream = this._dataProviderService.request({
      dateFrom: 'today',
      dateTo: 'today'
    });

    const dataSubscription = dataStream.subscribe(({ value, status }) => {
      debugger;
      this.setState({
        data: value,
        status
      });
    });

    this._subscriptions.push(dataSubscription);
  }

  private _doLogin() {
    this._authorizationService
      .doLogin()
      .then(({ authToken, userInfo }) =>
        this._setLoginState(authToken, userInfo)
      )
      .catch(error => alert(error));
  }

  private _setLoginState(authToken: string, userInfo: UserInfo | null) {
    this._network.updateTokenAndId(authToken, userInfo ? userInfo.email : '');

    this.setState({
      authToken,
      userInfo,
      isAuthorized: !!(authToken && userInfo)
    });
  }
}

export default App;
