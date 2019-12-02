import { isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { IDocumentTemplateRequest, IDocumentTemplateResponse } from '../../interfaces/models/document-templates';
import { API } from '../../settings/constants';
import apiService, { IResponse } from '../api';
import State from '../state';
import uiService from '../ui';

class DocumentTemplatesService extends State<IDocumentTemplateResponse[]> {
  private handleDocumentTemplate$ = new Subject<IResponse<IDocumentTemplateResponse>>();

  constructor() {
    super();

    this.onGetDocumentTemplates();
  }

  public getDocumentTemplates = (force: boolean = true) => {
    this.next(null, force);
  };

  public listenDocumentTemplate = () => {
    return this.handleDocumentTemplate$.asObservable();
  };

  public createDocumentTemplate = (document: IDocumentTemplateRequest) => {
    uiService
      .withUIFeedback(
        apiService.post<IDocumentTemplateResponse>(`${API.document}/documents/templates`, document)
      )
      .subscribe(response => this.handleDocumentTemplate$.next(response));
  };

  public updateDocumentTemplate = (document: IDocumentTemplateRequest) => {
    uiService
      .withUIFeedback(
        apiService.patch<IDocumentTemplateResponse>(
          `${API.document}/documents/templates/${document.documentId}`,
          document
        )
      )
      .subscribe(response => this.handleDocumentTemplate$.next(response));
  };

  private onGetDocumentTemplates = () => {
    this.onNext()
      .pipe(
        tap(() => this.setLoadingState(true)),
        switchMap(() =>
          uiService.withSnackbarFeedback(
            apiService.get<{ templates?: IDocumentTemplateResponse[] }>(
              `${API.document}/documents/templates`
            )
          )
        )
      )
      .subscribe(xhr => {
        this.setState({
          loading: false,
          error: xhr.error,
          empty: isEmpty(xhr.response.templates),
          payload: xhr.response.templates || []
        });
      });
  };
}

const documentTemplatesService = new DocumentTemplatesService();
export default documentTemplatesService;
