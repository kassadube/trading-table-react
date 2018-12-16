import React, { Component } from "react";
import { Grid, Row } from "react-bootstrap";

import Header from "../components/header";
import OrderTable from "../components/order-table";
import MatchTable from "../components/match-table";

import { withStream } from "../utils/provider";
import { store$, restart$ } from "../utils/api";

class App extends Component {
  componentDidMount() {
    restart$.next(1000);
  }

  render() {
    const { buyOrders = [], sellOrders = [], matches = [] } = this.props.store;
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

export default withStream(App)(store$);
