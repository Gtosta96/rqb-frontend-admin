import { isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { IClientDocumentRequest, IClientDocumentResponse } from '../../interfaces/models/client-documents';
import { API } from '../../settings/constants';
import apiService, { IResponse } from '../api';
import State from '../state';
import uiService from '../ui';

class ClientDocumentsService extends State<IClientDocumentResponse[]> {
  private handleClientDocument$ = new Subject<IResponse<IClientDocumentResponse>>();

  constructor() {
    super();

    this.onGetClientDocuments();
  }

  public getClientDocuments = (force: boolean = true) => {
    this.next(null, force);
  };

  public listenClientDocument = () => {
    return this.handleClientDocument$.asObservable();
  };

  public createClientDocument = (document: IClientDocumentRequest) => {
    uiService
      .withUIFeedback(
        apiService.post<IClientDocumentResponse>(`${API.document}/documents/upload_menu`, document)
      )
      .subscribe(response => this.handleClientDocument$.next(response));
  };

  public updateClientDocument = (document: IClientDocumentRequest) => {
    uiService
      .withUIFeedback(
        apiService.patch<IClientDocumentResponse>(`${API.document}/documents/upload_menu`, document)
      )
      .subscribe(response => this.handleClientDocument$.next(response));
  };

  public deleteClientDocument = (clientDocument: IClientDocumentResponse) => {
    uiService
      .withUIFeedback(apiService.delete(`${API.document}/documents/upload_menu`, {}))
      .subscribe(response => this.handleClientDocument$.next(response));
  };

  private onGetClientDocuments = () => {
    this.onNext()
      .pipe(
        tap(() => this.setLoadingState(true)),
        switchMap(() =>
          uiService.withSnackbarFeedback(
            apiService.get<{ clientDocuments?: IClientDocumentResponse[] }>(
              `${API.document}/documents/upload_menu`
            )
          )
        )
      )
      .subscribe(xhr => {
        this.setState({
          loading: false,
          error: xhr.error,
          empty: isEmpty(xhr.response.clientDocuments),
          payload: xhr.response.clientDocuments || []
        });
      });
  };
}

const clientDocumentsService = new ClientDocumentsService();
export default clientDocumentsService;
