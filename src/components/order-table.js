import React, { Component } from "react";
import { Col, Table } from "react-bootstrap";
import _ from "lodash";

export default class OrderTable extends Component {
  render() {
    const { orderType, orders, limit } = this.props;
    const is_buy = orderType === "buy";
    const title = is_buy ? "Bid" : "Ask";
    const color = is_buy ? "green" : "red";
    const order = is_buy ? "desc" : "asc"; // task requires opposite, but example and logic made me did this
    const sorted_orders = _.orderBy(orders, "price", order);
    if (sorted_orders.length > limit) sorted_orders.length = limit;
    const list = _.map(sorted_orders, ({ id, quantity, price }, idx) => (
      <tr key={idx}>
        <th style={{ color }}>{id}</th>
        <th>{price}</th>
        <th>{quantity}</th>
      </tr>
    ));

    return (
      <Col md={4}>
        <Table>
          <thead style={{ backgroundColor: "#f1f1f1" }}>
            <tr>
              <th>{title}</th>
              <th>price</th>
              <th>quantity</th>
            </tr>
          </thead>
          <tbody>{list}</tbody>
        </Table>
      </Col>
    );
  }
}
