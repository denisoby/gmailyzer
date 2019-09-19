import React from 'react';
import styles from './Popup.module.css';
import {FoldersListItem} from "../FoldersListItem/FoldersListItem";

// todo future typing
type FormProps = {};
type FormState = {};

export class FoldersList extends React.Component<FormProps, FormState> {
  render() {
      const items = (new Array(5)).fill({
          name: 'Paid Time off',
          count: 382
      });

    return (
      <React.Fragment>
        <h2 className="v-space-small">{ `Folders (${ items.length })` }</h2>
        <div className="list">
            { items.map(({ name, count }) => <FoldersListItem name={name} count={count}/>) }
        </div>
      </React.Fragment>
    );
  }
}
