import React, { Component } from "react";

import { Grid, Row } from "react-bootstrap";
import Header from "../components/header";
import OrderTable from "../components/order-table";
import MatchTable from "../components/match-table";

import { getStateStream, resetState } from "../utils/api";
import { getInitState } from "../utils/helpers";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { state: getInitState() };
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      subscription: getStateStream().subscribe(state =>
        this.setState({ ...this.state, state })
      )
    });
  }

  componentWillUnmount() {
    this.state.subscription.unsubscribe();
  }

  render() {
    const { buy_orders, sell_orders, matches } = this.state.state;
    return (
      <Grid>
        <Header onBtnClick={resetState} />
        <Row>
          <OrderTable orderType={"buy"} orders={buy_orders} limit={20} />
          <OrderTable orderType={"sell"} orders={sell_orders} limit={20} />
          <MatchTable matches={matches} limit={30} />
        </Row>
      </Grid>
    );
  }
}
