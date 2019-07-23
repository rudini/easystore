import { Component, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { useStore } from './store';
import { tap } from 'rxjs/operators';

// state of component
interface CounterState {
  count: number;
}

// state definition
interface State {
  counterState: CounterState;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'easystore';

  onClick$ = new EventEmitter();
  counter$: Observable<number>;

  constructor() {

    const store = useStore<State>('counterState', { count: 0 });

    this.counter$ = store.useState(state => state.count); // .pipe(map(state => state.count), distinctUntilChanged());
    this.onClick$.pipe(
      tap(() => console.log('clicked')))
      .subscribe(() => store.setState(state => ({ ...state, count: state.count + 1})));

    // this.onClick$.pipe(
    //     tap(() => console.log('clicked')))
    //     .subscribe(() => store.setState(state => {
    //       state.count = state.count + 1;
    //       return state;
    //     }));  // throws exception because of changing the state reference!!!!!
  }
}
