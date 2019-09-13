import { isEmpty } from 'lodash';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

interface IState<T> {
  payload: T | null;
  loading: boolean;
  error: boolean;
  empty: boolean;
}

interface INext {
  payload: any;
  force: boolean;
}

class State<T> {
  protected stateHandler$ = new Subject<any>();

  private state$ = new BehaviorSubject<IState<T>>({
    payload: null,
    loading: false,
    error: false,
    empty: false
  });

  protected next = (payload: any, force: boolean) => {
    return this.stateHandler$.next({ payload, force } as INext);
  };

  protected onNext = () => {
    return this.stateHandler$.pipe(
      filter((next: INext) => {
        const state = this.getStateValues();
        return next.force || (isEmpty(state.payload) && state.empty === false);
      }),
      map((next: INext) => next.payload)
    );
  };

  public listenState = () => {
    return this.state$.asObservable();
  };

  protected setLoadingState = (loading: boolean) => {
    this.setInternal("loading", loading);
  };

  protected setErrorState = (error: boolean) => {
    this.setInternal("error", error);
  };

  protected setPayloadState = (payload: T) => {
    this.setInternal("payload", payload);
  };

  protected setEmptyState = (empty: boolean) => {
    this.setInternal("empty", empty);
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
