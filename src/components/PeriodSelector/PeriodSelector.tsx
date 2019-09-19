import React, { Component } from 'react';

export interface PeriodSelectorProps {
  periodCount: number;
}

export class PeriodSelector extends Component<PeriodSelectorProps, {}> {
  render() {
    return (
      <div className="box inline chamfer-mini v-space-large">
        <p>{this.props.periodCount} requests</p>
        <div className="g-select">
          <select>
            <option>Yesterday</option>
            <option>This week</option>
            <option>Last week</option>
            <option>This month</option>
            <option>Last month</option>
            <option>This year</option>
          </select>
        </div>
      </div>
    );
  }
}
