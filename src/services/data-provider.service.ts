import { BaseNetwork } from './base-network.class';
import { Observable, Subject, from, concat } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { LabelsService } from './labels.service';

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

  constructor(private _network: BaseNetwork) {}

  get stream(): Observable<any> {
    return this._stream.asObservable().pipe(debounceTime(200));
  }

  request(params: DataRequestParams): Observable<DataRequestValueAndStatus> {
    // todo if request already exist
      return this._getDataFromServer(params);
  }

  _getDataFromServer(
    data: DataRequestParams
  ): Observable<DataRequestValueAndStatus> {
    const requestId = this._getRequestId(data);
    const dataSelector = () => this._requestValues[requestId];
    return concat(this._getLabelsStep(dataSelector));
  }

  _getLabelsStep(
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

  private _getRequestId(data: DataRequestParams | DataRequestValue): string {
    return data.dateFrom + '-' + data.dateTo;
  }
}
