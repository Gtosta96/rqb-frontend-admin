import { isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { IDocumentClauseRequest, IDocumentClauseResponse } from '../../interfaces/models/document-clauses';
import { API } from '../../settings/constants';
import apiService, { IResponse } from '../api';
import State from '../state';
import uiService from '../ui';

class DocumentClausesService extends State<IDocumentClauseResponse[]> {
  private handleDocumentClause$ = new Subject<IResponse<IDocumentClauseResponse>>();

  constructor() {
    super();

    this.onGetDocumentClauses();
  }

  public getDocumentClauses = (force: boolean = true) => {
    this.next(null, force);
  };

  public listenDocumentClause = () => {
    return this.handleDocumentClause$.asObservable();
  };

  public createDocumentClause = (document: IDocumentClauseRequest) => {
    uiService
      .withUIFeedback(
        apiService.post<IDocumentClauseResponse>(`${API.document}/documents/clauses`, document)
      )
      .subscribe(response => this.handleDocumentClause$.next(response));
  };

  public updateDocumentClause = (document: IDocumentClauseRequest) => {
    uiService
      .withUIFeedback(
        apiService.patch<IDocumentClauseResponse>(
          `${API.document}/documents/clauses/${document.documentId}`,
          document
        )
      )
      .subscribe(response => this.handleDocumentClause$.next(response));
  };

  private onGetDocumentClauses = () => {
    this.onNext()
      .pipe(
        tap(() => this.setLoadingState(true)),
        switchMap(() =>
          uiService.withSnackbarFeedback(
            apiService.get<{ documentClausesList?: IDocumentClauseResponse[] }>(
              `${API.document}/documents/clauses`
            )
          )
        )
      )
      .subscribe(xhr => {
        this.setState({
          loading: false,
          error: xhr.error,
          empty: isEmpty(xhr.response.documentClausesList),
          payload: xhr.response.documentClausesList || []
        });
      });
  };
}

const documentClausesService = new DocumentClausesService();
export default documentClausesService;
