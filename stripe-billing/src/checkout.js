import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StripeCheckout from 'react-stripe-checkout';

import {
  host,
  port,
  stripe_publishable_key,
} from 'config';

export default class Checkout extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
  }

  curency = 'EUR'

  toCents = amount => amount * 100

  ontokenGenerated = amount => (token) => {
    const requestUrl = `${host}:${port}`;
    fetch(`${requestUrl}/api`, {
      method: 'POST',
      body: JSON.stringify({
        source: token.id,
        currency: this.curency,
        amount: this.toCents(amount),
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then((res) => {
        console.log('res', JSON.stringify(res));
      })
      .catch(); // handle error
  }
  // eslint-disable-next-line lines-between-class-members
  render() {
    const {
      name,
      author,
      amount,
      description,
    } = this.props;
    return (
      <StripeCheckout
        name={name}
        description={description}
        amount={amount}
        token={this.ontokenGenerated(amount, description, author)}
        stripeKey={stripe_publishable_key}
      />
    );
  }
}
