/// <reference path="wamd.ts" />
interface route {
    url: string;
    handler: (context) => void;
}

interface routes {
    get: route[];
}

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

    app.onactivated = function (args) {
        handlers.activated.forEach(handler => handler.call(app, args));

        if (args.detail.previousExecutionState !== state.terminated) {
            handlers.launched.forEach(handler => handler.call(app, args));
        }

        args.setPromise(ui.processAll().then(function () {
            var sammy = $.sammy('#contenthost', function () {
                this.use('WinJS');

                routes.get.forEach(route => this.get(route.url, route.handler));
            });

            sammy.run('#/');
        }));
    };

    m.exports = {
        on: function (type: string, handler: (args) => void ) {
            handlers[type].push(handler);
        },
        get: function (url: string, fn: (ctx) => void ) {
            routes.get.push({ url: url, handler: fn });
            return this;
        },
        start: function () {
            app.start();
        }
    };

});