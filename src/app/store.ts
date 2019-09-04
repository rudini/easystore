import { EventEmitter } from '@angular/core';
import { Observable, Subject, noop } from 'rxjs';
import {
  scan,
  map,
  shareReplay,
  tap,
  distinctUntilChanged,
  takeUntil
} from 'rxjs/operators';

export type CommandFunction<S> = (s: S) => Partial<S>
export type EffectFunction<S> = () => Observable<CommandFunction<S>>

interface Action<T, K extends keyof T> {
  eval: (state: T[K]) => T[K]
  featureStoreName: K
  actionName: string
}

const featureStoreMap = []

let data$: Observable<any>
const actions$ = new EventEmitter<Action<any, any>>()

data$ = actions$.pipe(
  scan((state: any, action: Action<any, any>) => {
    console.log(`${action.actionName}: previous state`, state);
    console.log(`${action.actionName}: payload`, action.eval(state))
    const nextState = {
      ...state,
      [action.featureStoreName]: typeof action.eval(state) === 'object'
        ? { ...state[action.featureStoreName], ...action.eval(state) }
        : action.eval(state)}
    console.log(`${action.actionName}: next state`, nextState)
    return nextState;
  }, {}),
  shareReplay(1)
);

data$.subscribe()

// the useStore function can be used, when you want to share the state between component
// and not store derived data to the store.

// to inject shared state to a component, use "useStore('storeName')" without initial state
// to use and initialize state, use "useState('storeName', { someData: {} })"

export const useStore = <T, S = T[keyof T]>(
  featureStoreName: keyof T,
  initial: S = null
) => {
  // if store not initialized, throw error
  if (!featureStoreMap.includes(featureStoreName) && initial === null) {
    throw new Error(`store: ${featureStoreName} must be initialized first!!`)
  }

  // if store already exists, don't initialize
  if (!featureStoreMap.includes(featureStoreName)) {
    actions$.emit({
      eval: state => initial,
      featureStoreName: featureStoreName,
      actionName: 'initial action'
    });
    featureStoreMap.push(featureStoreName)
  }
  return {
    setState: (f: CommandFunction<S> | Partial<S>) => {
      if (f instanceof Function) {
        actions$.emit({
          eval: s => f(Object.freeze(s[featureStoreName])),
          featureStoreName: featureStoreName,
          actionName: f.name
        });
      } else {
        actions$.emit({
          eval: () => f,
          featureStoreName: featureStoreName,
          actionName: 'state'
        })
      }
    },
    useState: <O = S[keyof S]>(f: (s: S) => O = null): Observable<O> =>
      data$.pipe(
        map(s => s[featureStoreName]),
        map(s => (f ? f(s) : s)),
        distinctUntilChanged()
      ),
    useEffect: (effect: EffectFunction<S>) => {
      const completed$ = new Subject();
      effect().pipe(takeUntil(completed$)).subscribe(f => {
        actions$.emit({
          eval: s => f(Object.freeze(s[featureStoreName])),
          featureStoreName: featureStoreName,
          actionName: f.name
        });
      }, noop, () => {
        completed$.next();
        completed$.complete();
      });
    }
  }
};
