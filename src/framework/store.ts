import { EventEmitter } from '@angular/core';
import { Observable, Subject, noop } from 'rxjs';
import {
  scan,
  map,
  shareReplay,
  distinctUntilChanged,
  takeUntil} from 'rxjs/operators';

export type CommandFunction<S> = (s: S) => Partial<S>
export type EffectFunction<S> = () => Observable<CommandFunction<S>>

interface Action<T> {
  eval: (state: T) => T
  actionName: string
}

let data$: Observable<any>
const actions$ = new EventEmitter<Action<any>>()

data$ = actions$.pipe(
  scan((state: any, action: Action<any>) => {
    console.log(`${action.actionName}: previous state`, state);
    console.log(`${action.actionName}: payload`, action.eval(state))
    const nextState = {
      ...state,
      ...action.eval(state)
    }
    console.log(`${action.actionName}: next state`, nextState)
    return nextState;
  }, {}),
  shareReplay(1)
);

data$.subscribe()

// to use and initialize state, use "useState('storeName', { someData: {} })"

export const useStore = <S>(
  initial: S = null
) => {
  if (initial) {
    actions$.emit({
      actionName: 'setInitialState',
      eval: () => initial
    })
  }
  return {
    setState: (f: CommandFunction<S> | Partial<S>) => {
      if (f instanceof Function) {
        actions$.emit({
          eval: s => f(Object.freeze(s)),
          actionName: f.name
        });
      } else {
        actions$.emit({
          eval: () => f,
          actionName: 'state'
        })
      }
    },
    useState: <O = S[keyof S]>(f: (s: S) => O = null): Observable<O> =>
      data$.pipe(
        map(s => (f ? f(s) : s)),
        distinctUntilChanged()
      ),
    useEffect: (effect: EffectFunction<S>) => {
      const completed$ = new Subject();
      effect().pipe(takeUntil(completed$)).subscribe(f => {
        actions$.emit({
          eval: s => f(Object.freeze(s)),
          actionName: f.name || effect.name
        });
      }, noop, () => {
        completed$.next();
        completed$.complete();
      });
    }
  }
};
