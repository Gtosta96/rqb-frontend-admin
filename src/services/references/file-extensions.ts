import { BehaviorSubject } from 'rxjs';

import { IDropdownOption } from '../../interfaces/fields';
import { API } from '../../settings/constants';
import apiService from '../api';
import uiService from '../ui';

interface IState {
  fileExtensions: IDropdownOption[];
}

class FileExtensionsService {
  private fileExtensionsState$ = new BehaviorSubject<IState>({
    fileExtensions: []
  });

  public getFileExtensions = (cache: boolean = true) => {
    if (!cache || this.fileExtensionsState$.getValue().fileExtensions.length === 0) {
      uiService
        .withUIFeedback(
          apiService.get<{ fileExtensions?: Array<{ mimeType: string; fileExtension: string }> }>(
            `${API.reference}/references/file_extensions`
          ),
          {
            withToast: false
          }
        )
        .subscribe(xhr => {
          this.fileExtensionsState$.next({
            fileExtensions: (xhr.response.fileExtensions || []).map(state => ({
              value: state.fileExtension,
              label: state.fileExtension
            }))
          });
        });
    }

    return this.fileExtensionsState$.asObservable();
  };
}

const fileExtensionsService = new FileExtensionsService();
export default fileExtensionsService;
