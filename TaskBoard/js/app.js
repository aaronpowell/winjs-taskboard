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
                    _this.get(route.url, function (context) {
                        context.app.swap('');
                        context.render(route.template).appendTo(context.$element()).then(route.viewModel.bind(context));
                    });
                });
                routes.post.forEach(function (route) {
                    return _this.post(route.url, route.handler);
                });
                aroundHandlers.forEach(function (handler) {
                    return _this.around(handler);
                });
                this.before({
                    only: {
                        verb: 'post'
                    }
                }, function (context) {
                    var form = $(context.target);
                    var winControls = form.find('[data-win-control]');
                    winControls.each(function () {
                        var ctrlType = $(this).data('winControl');
                        var val;
                        switch(ctrlType) {
                            case 'WinJS.UI.DatePicker': {
                                val = this.winControl.current;
                                break;

                            }
                            case 'WinJS.UI.ToggleSwitch': {
                                val = this.winControl.checked;
                                break;

                            }
                        }
                        context.params[this.name || this.id] = val;
                    });
                });
            });
            sammy.run('#/');
        }));
    };
    m.exports = {
        on: function (type, handler) {
            handlers[type].push(handler);
        },
        get: function (url, template, fn) {
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
        around: function (fn) {
            aroundHandlers.push(fn);
            return this;
        },
        post: function (url, fn) {
            routes.post.push({
                url: url,
                handler: fn
            });
        }
    };
});
//@ sourceMappingURL=app.js.map
