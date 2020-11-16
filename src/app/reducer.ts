// import { Observable, of } from 'rxjs';
// import { EventEmitter } from '@angular/core';

// export interface Action {
//   type: string;
// }
// export interface Type<T> extends Function {
//   new (...args: any[]): T;
// }

// const reducers: [<Store>(store: Store, action: Action) => Store] = [];

// // let data$: Observable<any>;
// // const actions$ = new EventEmitter<Action>();




// //K in keyof SelectorTypes

// export const useReducer = <Store, State = Store[keyof Store]>(
//   name: keyof Store, reducer: Reducer<Store>, initial: State) => {

//     const _reducer = reducer as unknown as InternalReducer<State>;
//     const built = (store: Store, action: Action) =>
//       _reducer.build(initial)(store[name] as any, action);

//   return {
//     /// state$ = any
//     dispatch: (action: Action) => {
//       return null;
//     }
//   };
// };

// export interface Reducer<State> {
//   on: <T extends Action>(actionType: Type<T>,
//     handler: (state: State, action: T) => State) => Reducer<State>;
// }

// interface InternalReducer<State> extends Reducer<State> {
//   build(initial: State): (state: State, action: Action) => State;
// }

// export const createReducer = <State>(): Reducer<State> => {
//   const subscribers: { [action: string]: (state: State, action: Action) => State } = {};
//   const that = {
//     on: <T extends Action>(
//         actionType: Type<T>,
//         handler: (state: State, action: T) => State,
//     ) => {
//         subscribers[new actionType().type] = handler;
//         return that;
//     },
//     build(initial: State): (state: State, action: Action) => State {
//       return (state: State = initial, action: Action) =>
//           (this.subscribers[action.type] && this.subscribers[action.type](state, action)) || state;
//     }
//   };
//   return that;
// };
