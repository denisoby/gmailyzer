import React, { Component } from 'react';

export interface FoldersListDetailedItemProps {
  name: string;
  count: number;
  change: number;
}

export class FoldersListDetailedItem extends Component<
  FoldersListDetailedItemProps
> {
  render() {
    const { change, count, name } = this.props;

    const plusSignIfNeeded = change > 0 ? '+' : '';

    let signStyle = {
      colorClass: '',
      arrow: ''
    };

    if (change) {
      signStyle =
        change > 0
          ? { colorClass: 'red', arrow: 'up' }
          : { colorClass: 'green', arrow: 'down' };
    }

    return (
      <div className="item">
        <div className="inline">
          <div className="indicator"></div>
          <input type="checkbox" />
          <p>{name}</p>
        </div>
        <div className="box chamfer">
          <div className="inline">
            <h1>{count}</h1>
            <p className="label">requests</p>
          </div>
          <div className={`hint ${signStyle.colorClass}`}>
            <img src={`img/arrow/${signStyle.arrow}.svg`} />
            <p>
              {plusSignIfNeeded}
              {change || 0}% from last week
            </p>
          </div>
        </div>
      </div>
    );
  }
}
