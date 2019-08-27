import { Component, EventEmitter } from '@angular/core'
import { Observable } from 'rxjs'
import { useStore } from './store'
import { tap } from 'rxjs/operators'

// state of component
interface CounterState {
  count: number
  notChangedNumber: number
}

// state definition
interface State {
  counterState: CounterState
}

const incrementCounter = state => ({ count: state.count + 1 })

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
    const store = useStore<State>('counterState', {
      count: 0,
      notChangedNumber: 100
    })

    this.counter$ = store.useState(state => state.count) // .pipe(map(state => state.count), distinctUntilChanged())
    this.onClick$
      .pipe(tap(() => console.log('clicked')))
      .subscribe(() => store.setState(incrementCounter))

    // this.onClick$.pipe(
    //     tap(() => console.log('clicked')))
    //     .subscribe(() => store.setState(state => {
    //       console.log('state', state);
    //       state.count = state.count + 1;
    //       return state;
    //     }));  // throws exception because of changing the state reference!!!!!
  }
}


const useEffect = (action: Function) => {

}
