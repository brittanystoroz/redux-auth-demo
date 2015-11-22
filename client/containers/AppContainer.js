import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { pushState } from 'redux-router';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { logout } from '../actions/auth';
import { getAuthState, isLoggedIn } from '../reducers/auth';
import { App } from '../components';

@connect(
  (state) => ({
    auth: getAuthState(state),
    isLoggedIn: isLoggedIn(state)
  }),
  { pushState }
)
export default class AppContainer extends Component {
  static contextTypes = {
    store: PropTypes.any
  };

  static propTypes = {
    auth: ImmutablePropTypes.map.isRequired,
    children: PropTypes.any,
    isLoggedIn: PropTypes.bool.isRequired,
    pushState: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.onLogout = this.onLogout.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.auth.get('token') && nextProps.auth.get('token')) {
      this.props.pushState(null, '/account'); // login
    } else if (this.props.auth.get('token') && !nextProps.auth.get('token')) {
      this.props.pushState(null, '/'); // logout
    }
  }

  onLogout(e) {
    e.preventDefault();
    const { dispatch } = this.context.store;
    dispatch(logout());
  }

  render() {
    const { isLoggedIn, children } = this.props;
    const props = { isLoggedIn, children, onLogout: this.onLogout };

    return (
     <App { ...props } />
    );
  }
};