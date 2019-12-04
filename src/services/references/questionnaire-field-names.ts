import { BehaviorSubject } from 'rxjs';

import { IDropdownOption } from '../../interfaces/fields';
import { API } from '../../settings/constants';
import apiService from '../api';
import uiService from '../ui';

interface IState {
  questionnaireFieldNames: IDropdownOption[];
}

class QuestionnaireFieldNameService {
  private questionnaireFieldNamesState$ = new BehaviorSubject<IState>({
    questionnaireFieldNames: []
  });

  public getQuestionnaireFieldNames = (cache: boolean = true) => {
    if (
      !cache ||
      this.questionnaireFieldNamesState$.getValue().questionnaireFieldNames.length === 0
    ) {
      uiService
        .withUIFeedback(
          apiService.get<{ names: string[] }>(
            `${API.reference}/references/questionnaire_field_names`
          ),
          {
            withToasty: false
          }
        )
        .subscribe(xhr => {
          this.questionnaireFieldNamesState$.next({
            questionnaireFieldNames: (xhr.response.names || []).map(name => ({
              value: name,
              label: name
            }))
          });
        });
    }

    return this.questionnaireFieldNamesState$.asObservable();
  };
}

const questionnaireFieldNamesService = new QuestionnaireFieldNameService();
export default questionnaireFieldNamesService;
