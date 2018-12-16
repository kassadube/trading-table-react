import React, { Component } from "react";

export const withStream = WrappedComponent => stream =>
  class extends Component {
    _subscription = null;

    constructor(props) {
      super(props);
      this.state = {
        store: {}
      };
    }

    componentWillMount() {
      this._subscription = stream.subscribe(this.handleUpdate);
    }

    componentWillUnmount() {
      this._subscription &&
        this._subscription.unsubscribe &&
        this._subscription.unsubscribe();
    }

    handleUpdate = store => {
      this.setState(() => ({
        store
      }));
    };

    render() {
      return <WrappedComponent store={this.state.store} {...this.props} />;
    }
  };
