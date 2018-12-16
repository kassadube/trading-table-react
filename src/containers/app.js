import React, { Component } from "react";

import { Grid, Row } from "react-bootstrap";
import Header from "../components/header";
import OrderTable from "../components/order-table";
import MatchTable from "../components/match-table";

import { store$, restart$ } from "../utils/api";
import { getInitState } from "../utils/helpers";

export default class App extends Component {
  _subscription = null;

  constructor(props) {
    super(props);
    this.state = { store: getInitState() };
  }

  componentDidMount() {
    this._subscription = store$.subscribe(store => {
      this.setState({ store });
    });
    restart$.next(1000);
  }

  componentWillUnmount() {
    this._subscription.unsubscribe();
  }

  render() {
    const { buyOrders, sellOrders, matches } = this.state.store;
    return (
      <Grid>
        <Header
          onBtnClick={() => {
            restart$.next(1000);
          }}
        />
        <Row>
          <OrderTable orderType={"buy"} orders={buyOrders} limit={20} />
          <OrderTable orderType={"sell"} orders={sellOrders} limit={20} />
          <MatchTable matches={matches} limit={30} />
        </Row>
      </Grid>
    );
  }
}
