import React, { Component } from 'react';
import './App.css';
import { Popup } from './components/Popup/Popup';
import { Dashboard } from './components/Dashboard/Dashboard';
import { LabelsService } from './services/labels.service';
import { BaseNetwork } from './services/base-network.class';
import { Subscription } from 'rxjs';

type AppProps = {
  isAuthorized: boolean;
  authToken: string;
  user: {
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
    user: null
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
      this._network.authLost.subscribe(_ =>
        this.setState({
          authToken: '',
          isAuthorized: false
        })
      )
    );

    chrome.storage.local.get(
      ['authToken', 'userInfo'],
      ({ authToken, userInfo }) => {
        this.setState({
          authToken,
          isAuthorized: !!authToken
        });

        this._network.updateToken(authToken);
        this._network.updateId(userInfo.email);

        this._labelsService.list().then(data => {
          debugger;
          console.log(data);
          alert('_labelsService: ' + JSON.stringify(data));
        });
      }
    );
  }

  componentWillUnmount() {
    this._subscriptions.forEach(s => s.unsubscribe());
  }

  render() {
    let componentToDisplay = this.state.isAuthorized
      ? null
      : this._contentComponent;

    return <div className="App">{}</div>;
  }
}

export default App;
