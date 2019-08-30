import { BehaviorSubject, Subject } from 'rxjs';

interface IState<T> {
  payload: T | null;
  loading: boolean;
  error: boolean;
}

class State<T> {
  protected stateHandler$ = new Subject<boolean>();

  protected state$ = new BehaviorSubject<IState<T>>({
    payload: null,
    loading: false,
    error: false
  });

  public listenState() {
    return this.state$.asObservable();
  }

  protected setLoadingState = (loading: boolean) => {
    this.setInternal("loading", loading);
  };

  protected setErrorState = (error: boolean) => {
    this.setInternal("error", error);
  };

  protected setPayloadState = (payload: T) => {
    this.setInternal("payload", payload);
  };

  protected setState = (next: IState<T>) => {
    this.state$.next({
      ...this.getStateValues(),
      ...next
    });
  };

  protected getStateValues() {
    return this.state$.getValue();
  }

  private setInternal = (property: keyof IState<T>, value: boolean | T) => {
    this.state$.next({
      ...this.getStateValues(),
      [property]: value
    });
  };
}

export default State;
