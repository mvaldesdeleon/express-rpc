# express-rpc

Transform a promise-based module into a beeson-based express middleware.

```JS
var myPromiseBaseModule = require('my-promise-based-module');
var rpcMiddleware = require('express-rpc')(myPromiseBaseModule);

// ...

app.use(rpcMiddleware);
// Profit
```

# install
with [npm](https://npmjs.org) do:

```
npm install express-rpc
```

# license

MIT
