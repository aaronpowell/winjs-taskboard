require.define('app', function (require, m, exports) {
    var app = require('WinJS/Application');
    var ui = require('WinJS/UI');
    var state = require('Windows/ApplicationModel/Activation/ApplicationExecutionState');
    var $ = require('jQuery');
    var sammy_winjs = require('sammy.winjs');
    var handlers = {
        activated: [],
        launched: []
    };
    var routes = {
        get: []
    };
    var aroundHandlers = [];
    app.onactivated = function (args) {
        handlers.activated.forEach(function (handler) {
            return handler.call(app, args);
        });
        if(args.detail.previousExecutionState !== state.terminated) {
            handlers.launched.forEach(function (handler) {
                return handler.call(app, args);
            });
        }
        args.setPromise(ui.processAll().then(function () {
            var sammy = $.sammy('#contenthost', function () {
                var _this = this;
                this.use('WinJS');
                routes.get.forEach(function (route) {
                    return _this.get(route.url, route.handler);
                });
                aroundHandlers.forEach(function (handler) {
                    return _this.around(handler);
                });
            });
            sammy.run('#/');
        }));
    };
    m.exports = {
        on: function (type, handler) {
            handlers[type].push(handler);
        },
        get: function (url, fn) {
            routes.get.push({
                url: url,
                handler: fn
            });
            return this;
        },
        start: function () {
            app.start();
        },
        around: function (fn) {
            aroundHandlers.push(fn);
            return this;
        }
    };
});
