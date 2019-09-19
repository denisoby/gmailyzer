import React from 'react';
import styles from './Popup.module.css';

// todo future typing
type FoldersListItemProps = {
    name: string;
    count: number;
};
type FormState = {};

export class FoldersListItem extends React.Component<FoldersListItemProps, FormState> {
  render() {
    return (
        <div className="item">
            <div className="inline-distributed">
                <div className="inline">
                    <div className="indicator"></div>
                    <p>{ this.props.name }</p>
                </div>
                <div className="inline">
                    <h2>{ this.props.count }</h2>
                    <p className="label">requests</p>
                </div>
            </div>
        </div>
    );
  }
}
