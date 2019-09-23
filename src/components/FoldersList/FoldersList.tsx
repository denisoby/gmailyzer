import React from 'react';
import { FoldersListItem } from '../FoldersListItem/FoldersListItem';

// todo future typing
type FoldersListProps = {
    folders: {
        name: string;
        count: number;
    }[]
};
type FormState = {};

export class FoldersList extends React.Component<FoldersListProps, FormState> {
  render() {
    const items = Object.values(this.props.folders || {});

    return (
      <React.Fragment>
        <h2 className="v-space-small">{`Folders (${items.length})`}</h2>
        <div className="list">
          {items.map(({ name, count }) => (
            <FoldersListItem key={name} name={name} count={count} />
          ))}
        </div>
      </React.Fragment>
    );
  }
}
