import { BehaviorSubject } from 'rxjs';

import { IDropdownOption } from '../../interfaces/fields';
import { API } from '../../settings/constants';
import apiService from '../api';
import uiService from '../ui';

interface IState {
  questionnaires: IDropdownOption[];
}

class QuestionnairesService {
  private questionnairesState$ = new BehaviorSubject<IState>({
    questionnaires: []
  });

  public getQuestionnaires = (cache: boolean = true) => {
    if (!cache || this.questionnairesState$.getValue().questionnaires.length === 0) {
      uiService
        .withUIFeedback(
          apiService.get<{
            questionnaires?: Array<{ questionnaireId: string; questionnaireUiTitle: string }>;
          }>(`${API.questionnaire}/questionnaire`),
          {
            withToasty: false
          }
        )
        .subscribe(xhr => {
          this.questionnairesState$.next({
            questionnaires: (xhr.response.questionnaires || []).map(state => ({
              value: state.questionnaireId,
              label: state.questionnaireUiTitle
            }))
          });
        });
    }

    return this.questionnairesState$.asObservable();
  };
}

const questionnairesService = new QuestionnairesService();
export default questionnairesService;
