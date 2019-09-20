import React, { Component } from 'react';
import {
  FoldersListDetailedItem,
  FoldersListDetailedItemProps
} from '../FoldersListDetailedItem/FoldersListDetailedItem';
import styles from './FoldersListDetailed.module.css';

export interface FoldersListDetailedProps {
  requests: FoldersListDetailedItemProps[];
}

export class FoldersListDetailed extends Component<FoldersListDetailedProps> {
  render() {
    return (
      <div className={styles.FoldersListDetailed}>
        <div className="heading">
          <h2>Folders ({this.props.requests.length})</h2>
          <div className="inline actions">
            <a>Select All</a>
            <p>|</p>
            <a>Clear All</a>
          </div>
        </div>
        <div className="list inline">
          {this.props.requests.map(({ name, count, change }) => (
            <FoldersListDetailedItem
              key={name}
              name={name}
              count={count}
              change={change}
            />
          ))}
        </div>
      </div>
    );
  }
}
