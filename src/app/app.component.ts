import { Component, EventEmitter } from '@angular/core'
import { Observable, of } from 'rxjs'
import { useStore } from './store'
import { tap, map, catchError, startWith } from 'rxjs/operators'

// state of component
interface CounterState {
  count: number
  notChangedNumber: number,
  error: Error,
  loading: boolean
}

// state definition
interface State {
  counterState: CounterState
}

const initialCounterState = {
  count: 0,
  notChangedNumber: 100,
  loading: false,
  error: null
}
const incrementCounter = (state: CounterState) => ({ count: state.count + 1 })

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'easystore'

  onClick$ = new EventEmitter()
  counter$: Observable<number>

  constructor() {
    const store = useStore<State>('counterState', initialCounterState)

    this.counter$ = store.useState(state => state.count) // .pipe(map(state => state.count), distinctUntilChanged())
    this.onClick$
      .pipe(tap(() => console.log('clicked')))
      .subscribe(() => store.setState(incrementCounter))

    store.useEffect(loadCounterEffect)

    // this.onClick$.pipe(
    //     tap(() => console.log('clicked')))
    //     .subscribe(() => store.setState(state => {
    //       console.log('state', state);
    //       state.count = state.count + 1;
    //       return state;
    //     }));  // throws exception because of changing the state reference!!!!!
  }
}

const loadCounterFromServer = () => of(10); // stub function

const setLoadedCount = (state: CounterState) => ({ count: state.count, loading: false })
const setError = (error: Error) => () => ({ error: error, loading: false })
const setLoading = () => ({ loading: true })

const loadCounterEffect = () => loadCounterFromServer()
  .pipe(
    map(() => setLoadedCount),
    catchError(err => of(setError(err))),
    startWith(setLoading)
  )
