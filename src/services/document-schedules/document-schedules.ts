import { isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { IDocumentScheduleRequest, IDocumentScheduleResponse } from '../../interfaces/models/document-schedules';
import { API } from '../../settings/constants';
import apiService, { IResponse } from '../api';
import State from '../state';
import uiService from '../ui';

class DocumentSchedulesService extends State<IDocumentScheduleResponse[]> {
  private handleDocumentSchedule$ = new Subject<IResponse<IDocumentScheduleResponse>>();

  constructor() {
    super();

    this.onGetDocumentSchedules();
  }

  public getDocumentSchedules = (force: boolean = true) => {
    this.next(null, force);
  };

  public listenDocumentSchedule = () => {
    return this.handleDocumentSchedule$.asObservable();
  };

  public createDocumentSchedule = (document: IDocumentScheduleRequest) => {
    uiService
      .withUIFeedback(
        apiService.post<IDocumentScheduleResponse>(`${API.document}/documents/schedules`, document)
      )
      .subscribe(response => this.handleDocumentSchedule$.next(response));
  };

  public updateDocumentSchedule = (document: IDocumentScheduleRequest) => {
    uiService
      .withUIFeedback(
        apiService.patch<IDocumentScheduleResponse>(
          `${API.document}/documents/schedules/${document.documentScheduleId}`,
          document
        )
      )
      .subscribe(response => this.handleDocumentSchedule$.next(response));
  };

  public deleteDocumentSchedule = (documentScheduleId: number) => {
    uiService
      .withUIFeedback(
        apiService.delete(`${API.document}/documents/schedules/${documentScheduleId}`, {})
      )
      .subscribe(response => this.handleDocumentSchedule$.next(response));
  };

  private onGetDocumentSchedules = () => {
    this.onNext()
      .pipe(
        tap(() => this.setLoadingState(true)),
        switchMap(() =>
          uiService.withSnackbarFeedback(
            apiService.get<{ schedules?: IDocumentScheduleResponse[] }>(
              `${API.document}/documents/schedules`
            )
          )
        )
      )
      .subscribe(xhr => {
        this.setState({
          loading: false,
          error: xhr.error,
          empty: isEmpty(xhr.response.schedules),
          payload: xhr.response.schedules || []
        });
      });
  };
}

const documentSchedulesService = new DocumentSchedulesService();
export default documentSchedulesService;
