/// <reference path="wamd.ts" />
interface route {
    url: string;
    handler: (context) => void;
    viewModel: any;
}

interface routes {
    get: route[];
    post: route[];
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
        get: [],
        post: []
    };

    var aroundHandlers = [];

    app.onactivated = function (args) {
        handlers.activated.forEach(handler => handler.call(app, args));

        if (args.detail.previousExecutionState !== state.terminated) {
            handlers.launched.forEach(handler => handler.call(app, args));
        }

        args.setPromise(ui.processAll().then(function () {
            var sammy = $.sammy('#contenthost', function () {
                this.use('WinJS');

                routes.get.forEach(route => {
                    this.get(route.url, function (context) {
                        context.app.swap('');

                        context.render(route.template)
                            .appendTo(context.$element())
                            .then(element => new route.viewModel(context, element));
                    });
                });

                routes.post.forEach(route => this.post(route.url, route.handler));

                aroundHandlers.forEach(handler => this.around(handler));

                this.before({
                    only: {
                        verb: 'post'
                    }
                }, (context) => {
                    var form = $(context.target);

                    var winControls = form.find('[data-win-control]');

                    winControls.each(function() {
                        var ctrlType = $(this).data('winControl');
                        var val;

                        switch(ctrlType) {
                            case 'WinJS.UI.DatePicker':
                                val = this.winControl.current;
                                break;
                            case 'WinJS.UI.ToggleSwitch':
                                val = this.winControl.checked;
                                break;
                        }

                        context.params[this.name || this.id] = val;
                    });
                });
            });

            sammy.run('#/');
        }));
    };

    m.exports = {
        on: function (type: string, handler: (args) => void ) {
            handlers[type].push(handler);
        },
        get: function (url: string, template: string, fn: (ctx) => void ) {
            routes.get.push({
                url: url,
                template: template,
                viewModel: fn
            });
            return this;
        },
        start: function () {
            app.start();
        },
        around: function (fn: (callback) => void ) {
            aroundHandlers.push(fn)
            return this;
        },
        post: function (url: string, fn: (callback) => void ) {
            routes.post.push({
                url: url,
                handler: fn
            });
        }
    };
});