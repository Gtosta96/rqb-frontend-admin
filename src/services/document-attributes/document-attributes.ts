import { isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { IDocumentAttributesRequest, IDocumentAttributesResponse } from '../../interfaces/models/document-attributes';
import { API } from '../../settings/constants';
import apiService, { IResponse } from '../api';
import State from '../state';
import uiService from '../ui';

class DocumentAttributesService extends State<IDocumentAttributesResponse[]> {
  private handleDocumentAttribute$ = new Subject<IResponse<IDocumentAttributesResponse>>();

  constructor() {
    super();

    this.onGetDocumentAttributes();
  }

  public getDocumentAttributes = (force: boolean = true) => {
    this.next(null, force);
  };

  public listenDocumentAttribute = () => {
    return this.handleDocumentAttribute$.asObservable();
  };

  public createDocumentAttribute = (document: IDocumentAttributesRequest) => {
    uiService
      .withUIFeedback(
        apiService.post<IDocumentAttributesResponse>(
          `${API.document}/documents/attributes`,
          document
        )
      )
      .subscribe(response => this.handleDocumentAttribute$.next(response));
  };

  public updateDocumentAttribute = (document: IDocumentAttributesRequest) => {
    uiService
      .withUIFeedback(
        apiService.patch<IDocumentAttributesResponse>(
          `${API.document}/documents/attributes`,
          document
        )
      )
      .subscribe(response => this.handleDocumentAttribute$.next(response));
  };

  public deleteDocumentAttribute = (clientDocument: IDocumentAttributesResponse) => {
    const payload = {
      binderId: clientDocument.binderId,
      documentClass: clientDocument.documentClass,
      jsonPathName: clientDocument.tagName
    };

    uiService
      .withUIFeedback(apiService.delete(`${API.document}/documents/attributes`, payload))
      .subscribe(response => this.handleDocumentAttribute$.next(response));
  };

  private onGetDocumentAttributes = () => {
    this.onNext()
      .pipe(
        tap(() => this.setLoadingState(true)),
        switchMap(() =>
          uiService.withSnackbarFeedback(
            apiService.get<{ attributes?: IDocumentAttributesResponse[] }>(
              `${API.document}/documents/attributes`
            )
          )
        )
      )
      .subscribe(xhr => {
        this.setState({
          loading: false,
          error: xhr.error,
          empty: isEmpty(xhr.response.attributes),
          payload: xhr.response.attributes || []
        });
      });
  };
}

const clientDocumentsService = new DocumentAttributesService();
export default clientDocumentsService;
