import { BehaviorSubject } from 'rxjs';

import { IDropdownOption } from '../../interfaces/fields';
import { API } from '../../settings/constants';
import apiService from '../api';
import uiService from '../ui';

interface IState {
  countries: IDropdownOption[];
}

class CountriesService {
  private countriesState$ = new BehaviorSubject<IState>({
    countries: []
  });

  public getCountries = (cache: boolean = true) => {
    if (!cache || this.countriesState$.getValue().countries.length === 0) {
      uiService
        .withUIFeedback(
          apiService.get<{ countries?: string[] }>(`${API.reference}/references/countries`),
          {
            withToasty: false
          }
        )
        .subscribe(xhr => {
          this.countriesState$.next({
            countries: (xhr.response.countries || []).map(country => ({
              value: country,
              label: country
            }))
          });
        });
    }

    return this.countriesState$.asObservable();
  };
}

const countriesService = new CountriesService();
export default countriesService;
