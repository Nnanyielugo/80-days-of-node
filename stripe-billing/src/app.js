import React from 'react';

import Checkout from './checkout';

const app = () => (
  <div>
    <div>Hello from webpack</div>
    <div>
      <Checkout
        name={'The name of the wind'}
        author={'Patrick Rothfuss'}
        description={'Book'}
        amount={1}
      />
    </div>
  </div>
);

export default app;
