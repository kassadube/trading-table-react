import { Subject, timer, from } from "rxjs";
import {
  retry,
  switchMap,
  map,
  tap,
  takeUntil,
  withLatestFrom
} from "rxjs/operators";

import { getInitState } from "./helpers";
import { getNewState } from "./state-logic";

const endpoint = "http://localhost:5001";
const apiStartMarker$ = new Subject(0);
export const restart$ = new Subject();
export const orders$ = new Subject();
export const store$ = new Subject(getInitState());

restart$
  .pipe(
    switchMap(interval =>
      timer(0, interval).pipe(
        takeUntil(restart$),
        withLatestFrom(apiStartMarker$),
        map(([_, s]) => `${endpoint}/listOrders?start=${s}&size=200`),
        switchMap(uri =>
          from(fetch(uri)).pipe(
            retry(),
            switchMap(data => from(data.json())),
            switchMap(data => from(data)),
            tap(({ id }) => apiStartMarker$.next(id))
          )
        )
      )
    )
  )
  .subscribe(orders$);

restart$
  .pipe(
    tap(() => fetch(`${endpoint}/reset`)),
    tap(() => apiStartMarker$.next(0)),
    tap(() => store$.next(getInitState()))
  )
  .subscribe();

orders$
  .pipe(
    withLatestFrom(store$),
    map(([order, prevState]) => getNewState(order, prevState))
  )
  .subscribe(store$);
