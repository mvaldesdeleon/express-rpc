const { serialize, deserialize } = require('beeson');
const { raw } = require('body-parser');

module.exports = function(module, options = {}) {
    const parser = raw({
        limit: typeof options.limit === 'undefined' ? '10mb' : options.limit,
        type: () => true
    });

    const error = status => res => err => {
        if (options.debug) {
            if (!err.stack) err.stack = (new Error()).stack;

            res.status(status).send(err.stack);
        } else { res.sendStatus(500); }
    };

    const success = res => retVal => {
        try { res.status(200).send(serialize(retVal)); }
        catch(err) { error(500)(res)(err); }
    };

    function middleware(req, res) {
        let method, args;

        try {
            method = req.path.split('/')[1];
            args = deserialize(req.body);

            if (args instanceof Array === false) args = [args];
        } catch(err) { error(500)(res)(err); }

        if (!module.hasOwnProperty(method)) return error(404)(res)(new Error('Not Found'));
        if (typeof module[method] !== 'function') return error(501)(res)(new Error('Not Implemented'));

        module[method].call(null, ...args)
            .then(success(res))
            .catch(error(502)(res));
    }

    return function(req, res, next) {
        if (req.body) middleware(req, res, next);
        else parser(req, res, middleware);
    };
};
