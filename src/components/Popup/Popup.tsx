import React, { Component } from 'react';
import styles from './Popup.module.css';
import { FoldersList } from '../FoldersList/FoldersList';
import { PeriodSelector } from '../PeriodSelector/PeriodSelector';

// todo future typing
type FormProps = {};
type FormState = {};

export class Popup extends Component<FormProps, FormState> {
  render() {
    const periodCount = 123;

    return (
      <div className={`${styles.Popup} container elevated chamfer`}>
        <div className="inline-distributed v-space-medium">
          <h1>Request Aggregator</h1>
          <img src="./img/cross.svg" className="action close"></img>
        </div>
        <PeriodSelector periodCount={periodCount} />
        <FoldersList></FoldersList>
        <a
          href="#"
          className="switch"
          onClick={_ => {
            debugger;
            chrome.tabs.create({
              url: chrome.extension.getURL('index.html') + '#dashboard'
            });
          }}
        >
          show dashboard
        </a>
      </div>
    );
  }
}
