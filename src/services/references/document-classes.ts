import { BehaviorSubject } from 'rxjs';

import { IDropdownOption } from '../../interfaces/fields';
import { API } from '../../settings/constants';
import apiService from '../api';
import uiService from '../ui';

interface IState {
  documentClasses: IDropdownOption[];
}

class DocumentClassesService {
  private documentClassesState$ = new BehaviorSubject<IState>({
    documentClasses: []
  });

  public getDocumentClasses = (cache: boolean = true) => {
    if (!cache || this.documentClassesState$.getValue().documentClasses.length === 0) {
      uiService
        .withUIFeedback(
          apiService.get<{
            documentClasses?: Array<{ documentClass: string; documentUiClass: string }>;
          }>(`${API.reference}/references/document_classes`),
          {
            withToast: false
          }
        )
        .subscribe(xhr => {
          this.documentClassesState$.next({
            documentClasses: (xhr.response.documentClasses || []).map(documentClass => ({
              value: documentClass.documentClass,
              label: documentClass.documentUiClass
            }))
          });
        });
    }

    return this.documentClassesState$.asObservable();
  };
}

const documentClassesService = new DocumentClassesService();
export default documentClassesService;
