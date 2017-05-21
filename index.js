module.exports = function({extract, success, error}) {
    return function(module, options = {}) {
        const _error = res => status => err => {
            if (options.debug) {
                if (!err.stack) err.stack = (new Error()).stack;

                try { error(res, status, err); }
                catch(newErr) { res.sendStatus(500); }
            } else { res.sendStatus(500); }
        };

        const _success = res => retVal => {
            try { success(res, retVal); }
            catch(err) { _error(res)(500)(err); }
        };

        return function middleware(req, res, next) {
            let method, args;

            try {
                ({ method, args } = extract(req));

                if (args instanceof Array === false) args = [args];
            } catch(err) { _error(res)(500)(err); }

            if (!module.hasOwnProperty(method)) return next();
            if (typeof module[method] !== 'function') return _error(res)(501)(new Error('Not Implemented'));

            module[method].call(null, ...args)
                .then(_success(res))
                .catch(_error(res)(502));
        };
    };
};
