import React, { Component } from "react";
import { Col, Table, Modal } from "react-bootstrap";
import _ from "lodash";

export default class MatchTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      content: null
    };
  }

  close() {
    this.setState({ showModal: false });
  }

  open(content) {
    this.setState({
      showModal: true,
      content
    });
  }

  render() {
    const { matches, limit } = this.props;
    const sorted_matches = _.orderBy(matches, "time", "desc");
    if (sorted_matches.length > limit) sorted_matches.length = limit;
    const list = _.map(sorted_matches, (match, idx) => (
      <tr key={idx} onClick={() => this.open(match)}>
        <th style={{ color: "blue" }}>{match.time}</th>
        <th>{match.price}</th>
        <th>{match.quantity}</th>
      </tr>
    ));
    const modal_content_table = !this.state.content
      ? null
      : _.map(this.state.content, (val, key) => (
          <tr key={val}>
            <th>{key}</th>
            <th>{val}</th>
          </tr>
        ));

    return (
      <Col md={4}>
        <Table>
          <thead style={{ backgroundColor: "#f1f1f1" }}>
            <tr>
              <th>time</th>
              <th>price</th>
              <th>quantity</th>
            </tr>
          </thead>
          <tbody>{list}</tbody>
        </Table>
        <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Match info</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table>
              <tbody>{modal_content_table}</tbody>
            </Table>
          </Modal.Body>
        </Modal>
      </Col>
    );
  }
}
