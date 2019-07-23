import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import {
  scan,
  map,
  shareReplay,
  tap,
  distinctUntilChanged
} from 'rxjs/operators';

interface Action<T, K extends keyof T> {
  eval: (state: T[K]) => T[K];
  name: K;
}

const nameMap = [];

let data$: Observable<any>;
const actions$ = new EventEmitter<Action<any, any>>();

data$ = actions$.pipe(
  scan((state: any, action: Action<any, any>) => {
    console.log('before', state);
    console.log('evaluated action', action.eval(state));
    return { ...state, [action.name]: { ...state[action.name], ...action.eval(state) }};
  }, {}),
  tap(state => console.log('after', state)),
  shareReplay(1)
);

data$.subscribe();

export const useStore = <T, S = T[keyof T]>(
  name: keyof T,
  initial: S = null
) => {
  // if store not initialized, throw error
  if (!nameMap.includes(name) && initial === null) {
    throw new Error(`store: ${name} must be initialized first!!`);
  }

  // if store already exists, don't initialize
  if (!nameMap.includes(name)) {
    actions$.emit({
      eval: state => initial,
      name: name
    });
    nameMap.push(name);
  }
  return {
    setState: (f: ((s: S) => Partial<S>) | Partial<S>) => {
      if (f instanceof Function) {
        actions$.emit({
          eval: s => f(Object.freeze(s[name])),
          name
        });
      } else {
        actions$.emit({
          eval: () => f,
          name
        });
      }
    },
    useState: <O = S[keyof S]>(f: (s: S) => O = null): Observable<O> =>
      data$.pipe(
        map(s => s[name]),
        map(s => (f ? f(s) : s)),
        distinctUntilChanged()
      )
  };
};
