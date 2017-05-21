# express-rpc

Transform a promise-based module into an express middleware.

```JS
var myPromiseBaseModule = require('my-promise-based-module');
var rpc = require('express-rpc')({
    extract: (req) => ({method: req.path.slice(1), args: JSON.parse(req.body)}),
    success: (res, retVal) => res.status(200).send(retVal),
    error: (res, status, err) => res.status(status).send(err.stack)
});
var rpcMiddleware = rpc(myPromiseBaseModule);

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
