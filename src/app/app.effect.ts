import { of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { CounterState } from './app.state';

const loadCounterFromServerAction = () => of(10);
const errorLoadingCountAction = (error: Error) => () => ({ error: error, loading: false })
const loadingIndicatorAction = () => ({ loading: true })

export const loadCounterEffect = () => loadCounterFromServerAction()
  .pipe(
    map((value) =>
    (state: CounterState) => ({count: value, loading: false})),
    catchError(err => of(errorLoadingCountAction(err))),
    startWith(loadingIndicatorAction)
  )
