import { BaseNetwork } from './base-network.class';

export class MessagesService {
  constructor(private _network: BaseNetwork) {}

  listRaw(options: { pageToken?: string } = {}): Promise<any> {
    return this._network.fetch('messages', {
      maxResults: 500,
      ...options
    });
  }

  list(options: { pageToken?: string } = {}) {
    return this.listRaw(options); // .then(({labels}) => this._convertArrToObject(labels));
  }

  getMetadata(id: string): Promise<any> {
    const cachedId = `m_${id}`;
    return new Promise<any>((resolve, reject) => {
      chrome.storage.local.get([cachedId], info => {
        const cachedMessage = info[cachedId];
        // todo remove debug
        if (cachedMessage) {
          resolve(JSON.parse(cachedMessage));
          return;
        }

        resolve(
          this.getMetadataWithoutCache(id)
            .then(message => this._extractNecessaryFields(message))
            .then(message => this._doCache(message, cachedId))
        );
      });
    });
  }

  // todo modify or get rid of this tough caching
  getMetadataWithoutCache(id: string): Promise<any> {
    return this._network.fetch(`messages/${id}`, {
      format: 'metadata',
      metadataHeaders: 'labels'
    });
  }

  _extractNecessaryFields(message: any): any {
    return {
      id: message.id,
      labelIds: message.labelIds,
      internalDate: message.internalDate
    };
  }

  _doCache(message: any, cacheId: string): any {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set(
        {
          [cacheId]: JSON.stringify(message)
        },
        () => resolve(message)
      );
    });
  }
}
