import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { scan, map, startWith, shareReplay, tap } from 'rxjs/operators';

// type Action<T> = (state: T) => T;
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
    console.log('action', action);
    console.log('evaluated action', action.eval(state));
    return { ...state, [action.name]: action.eval(state) };
  }, {}),
  tap(state => console.log('after', state)),
  shareReplay(1)
);

data$.subscribe();

export const useState = <T>(
  initial: T = null,
  storeName: string = 'global'
) => {
  if (initial && storeName in nameMap) {
    throw new Error(`name ${storeName} already defined!!`);
  }

  nameMap.push(storeName);
  console.log('storeName', storeName);
  console.log('type', typeof initial);
  actions$.emit({
    eval: state => initial,
    name: storeName
  });
  return data$.pipe(
    map(s => s[storeName]),
    startWith(initial)
  );
};

const setState = <T>(f: (s: T) => T, storeName: string = 'global') => {
  actions$.emit({
    eval: s => f(s[storeName]),
    name: storeName
  });
};

export const useStore = <T>(name: string) => ({
  setState: (f: (s: T) => T) => {
    actions$.emit({
      eval: s => f(s[name]),
      name
    });
  },
  useState: (initial: T = null) => {
    actions$.emit({
      eval: state => initial,
      name: name
    });
    return data$.pipe(
      map(s => s[name]),
      startWith(initial)
    );
  }
});
