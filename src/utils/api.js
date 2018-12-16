import { Subject, interval, from } from "rxjs";
import { retry, switchMap, tap } from "rxjs/operators";

import { getInitState, createMatchRecord } from "./helpers";
import { calculateNewState } from "./state-logic";

let api_marker_start = 0;
let state = getInitState();
const state_subject = new Subject();

export const resetState = () => {
  api_marker_start = 0;
  state_subject.next((state = getInitState()));
  return fetch("http://localhost:5001/reset");
};

export const getStateStream = () => {
  interval(1000)
    .pipe(
      retry(),
      switchMap(() =>
        from(
          fetch(
            `http://localhost:5001/listOrders?start=${api_marker_start}&size=200`
          )
        )
      ),
      switchMap(data => from(data.json())),
      switchMap(data => from(data)),
      tap(order => {
        api_marker_start = order.id;
        state = calculateNewState(order, state);
        state_subject.next(state);
      })
    )
    .subscribe();

  return state_subject;
};
