const http = require('http');
const events = require('events');

module.exports = class Application {
    emitter = new events();
    server = this._createServer();
    middlewares = [];

    addRouter(router) {
        Object.keys(router.endpoints).forEach(path => {
            const endpoint = router.endpoints[path];
            Object.keys(endpoint).forEach(method => {
                this.emitter.on(this._getRouterMask(path, method), (req, res) => {
                    const handler = endpoint[method];
                    handler(req, res);
                })
            });
        });
    }

    listen(port, callback) {
        this.server.listen(port, callback);
    }

    use(middleware) {
        this.middlewares.push(middleware);
    }

    _createServer() {
        return http.createServer((req, res) => {
            let body = '';

            req.on('data', (chunk) => body+= chunk);
            req.on('end', () => {
                if (body) req.body = JSON.parse(body);
                this.middlewares.forEach(middleware => middleware(req, res));
                const emitted = this.emitter.emit(this._getRouterMask(req.pathname, req.method), req, res);
                if (!emitted) {
                    res.end();
                }
            })

        });
    }

    _getRouterMask(path, method) {
        return `[${path}]:[${method}]`;
    }
}