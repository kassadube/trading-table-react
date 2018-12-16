import React, { Component } from "react";
import { Jumbotron, Button } from "react-bootstrap";

export default class Header extends Component {
  render() {
    return (
      <Jumbotron style={{ marginTop: "20px" }}>
        <h1>Btc.com</h1>
        <Button bsStyle="primary" onClick={this.props.onBtnClick}>
          Reset
        </Button>
      </Jumbotron>
    );
  }
}
