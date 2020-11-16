import { Component, EventEmitter } from '@angular/core'
import { Observable } from 'rxjs'
import { dispatch, select, dispatchEffect } from './app.state'
import { incrementCounterAction } from './app.action'
import { loadCounterEffect } from './app.effect'


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

    this.counter$ = select(state => state.count) // .pipe(map(state => state.count), distinctUntilChanged())
    this.onClick$
      // .pipe(tap(() => console.log('clicked')))
      .subscribe(() => dispatch(incrementCounterAction))

    dispatchEffect(loadCounterEffect) // effect must complete

    // this.onClick$.pipe(
    //     tap(() => console.log('clicked')))
    //     .subscribe(() => store.setState(state => {
    //       console.log('state', state);
    //       state.count = state.count + 1;
    //       return state;
    //     }));  // throws exception because of changing the state reference!!!!!
  }
}


