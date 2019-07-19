import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { scan, map, startWith, shareReplay, tap, distinctUntilChanged } from 'rxjs/operators';

interface Action<T> {
  eval: (state: any) => T;
  name: string;
}

const nameMap = [];

let data$: Observable<any>;
const actions$ = new EventEmitter<Action<any>>();

data$ = actions$.pipe(
  scan((state: any, action: Action<any>) => {
    console.log('before', state);
    console.log('evaluated action', action.eval(state));
    const freezedEval = Object.freeze(action.eval(state));
    return { ...state, [action.name]: freezedEval };
  }, {}),
  tap(state => console.log('after', state)),
  shareReplay(1)
);

data$.subscribe();


export const useStore = <T>(name: string, initial: T = null) => {

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
    setState: (f: (s: T) => T) => {
      actions$.emit({
        eval: s => f(s[name]),
        name
      });
    },
    useState: (f: (s: T) => any = null) => data$.pipe(
        map(s => s[name]),
        map(s => f ? f(s) : s),
        distinctUntilChanged()
      )
  };
};
