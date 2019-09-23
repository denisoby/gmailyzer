import { BaseNetwork } from './base-network.class';
import { Observable, Subject, from, concat } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';
import { LabelsService } from './labels.service';
import { MessagesService } from './messages.service';

export interface MessageListDecision {
  include: boolean;
  continueProcessing: boolean;
}

export interface DataRequestParams {
  dateFrom: string;
  dateTo: string;
  // compareWithPreviousPeriod: boolean;
}

export interface DataRequestValue extends DataRequestParams {
  labels: { [id: string]: any };
  data: [];
}

export interface DataRequestStatus {
  statusMessage: string;
  progressValue?: string;
  progressEstimated?: string;
}

export interface DataRequestValueAndStatus {
  value: DataRequestValue;
  status?: DataRequestStatus;
}

export class DataProviderService {
  _stream: Subject<any> = new Subject<any>();
  _requestValues: { [index: string]: DataRequestValue } = {};
  _requestStatus: { [index: string]: DataRequestStatus } = {};

  _labelsService = new LabelsService(this._network);
  _messagesService = new MessagesService(this._network);

  constructor(private _network: BaseNetwork) {}

  get stream(): Observable<any> {
    return this._stream.asObservable().pipe(debounceTime(200));
  }

  request(params: DataRequestParams): Observable<DataRequestValueAndStatus> {
    // todo if request already exist
    return this._getDataFromServer(params);
  }

  private _getDataFromServer(
    data: DataRequestParams
  ): Observable<DataRequestValueAndStatus> {
    const requestId = this._getRequestId(data);
    const dataSelector = () => this._requestValues[requestId];

    // todo check Date
    let messagesCounter = 0;
    const messagesInBatch = 500;

    const dataObservable = concat(
      this._getLabelsStep(dataSelector),
      this._getMessagesStep(dataSelector, message => ({
        include: true,
        continueProcessing: messagesCounter++ <= messagesInBatch
      }))
    );

    dataObservable.subscribe(
      ({ value }) => (this._requestValues[requestId] = value)
    );

    return dataObservable;
  }

  private _getLabelsStep(
    valueSelector: () => DataRequestValue
  ): Observable<DataRequestValueAndStatus> {
    return from(this._labelsService.list()).pipe(
      map(labels => ({
        value: {
          ...valueSelector(),
          labels
        }
      }))
    );
  }

  private _getMessagesStep(
    valueSelector: () => DataRequestValue,
    messageChecker: (message: any) => MessageListDecision
  ): Observable<DataRequestValueAndStatus> {
    const dataSubject = new Subject<DataRequestValueAndStatus>();
    const self = this;

    // todo handle this correctly
    const result = new Observable<DataRequestValueAndStatus>(function(
      observer
    ) {
      getMessagesList();
      dataSubject.subscribe(value => observer.next(value));
    });

    function getMessagesList(pageToken: string = '') {
      // todo find why messages duplicates ???
      self._messagesService.list().then(({ messages, nextPageToken }) => {
        return getNextMessageMetadata({ messages, nextPageToken });
      });
    }

    function getNextMessageMetadata(
      { messages, nextPageToken }: any,
      index: number = 0
    ) {
      self._messagesService.getMetadata(messages[index].id).then(message => {
        const data = valueSelector();
        const whatToDoNext = messageChecker(message);
        if (whatToDoNext.include) {
          updateLabelsCount(message, data);
        }
        if (whatToDoNext.continueProcessing) {
          const nextIndex = index + 1;
          if (nextIndex < messages.length) {
            return getNextMessageMetadata(
                {messages, nextPageToken},
                nextIndex
            );
          } else {
            //todo get next messages page
            alert('todo get next messages page');
          }
        }
      });
    }

    function updateLabelsCount(message: any, data: any) {
      message.labelIds.forEach((label: string) => {
        if (data.labels[label]) {
          const newData = {
            ...data
          };
          newData.labels[label].count++;
          dataSubject.next({
            value: newData
          });
        }
      });
    }

    return result;
    // return result.asObservable().pipe(tap(_ => {
    //     debugger;
    //     getMessagesList();
    // }));
  }

  private _getRequestId(data: DataRequestParams | DataRequestValue): string {
    return data.dateFrom + '-' + data.dateTo;
  }
}
