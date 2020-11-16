import { CounterState } from './app.state';

export const incrementCounterAction = (state: CounterState): Partial<CounterState> => ({ count: state.count + 1 })
