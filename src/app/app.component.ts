import { Component, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { useStore } from './store';
import { tap } from 'rxjs/operators';

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

    const store = useStore<number>('counter');

    this.counter$ = store.useState(0);
    this.onClick$.pipe(
      tap(() => console.log('clicked')))
      .subscribe(() => store.setState(count => count + 1));
  }

  do() {
    alert();
  }
}

