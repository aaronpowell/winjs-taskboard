require.define('/js/default.js', function (require, module, exports) {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = require('WinJS/Application');
    var activation = require('Windows/ApplicationModel/Activation');
    var nav = WinJS.Navigation;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
            } else {
            }
            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }
            if (args.detail.arguments) {
                var tileArg = JSON.parse(args.detail.arguments);

                var req = window.indexedDB.open('task-board', 3);

                req.onsuccess = function (e) {
                    var db = e.target.result;

                    var transaction = db.transaction('task');
                    var store = transaction.objectStore('task');
                    store.get(tileArg.id).onsuccess = function (e) {
                        nav.navigate('/pages/overview/item.html', {
                            item: e.target.result
                        });
                    };
                };
            }
            args.setPromise(WinJS.UI.processAll().then(function () {
                if (nav.location) {
                    nav.history.current.initialPlaceholder = true;
                    return nav.navigate(nav.location, nav.state);
                } else {
                    return nav.navigate(Application.navigator.home);
                }
            }));
        }
    };

    app.oncheckpoint = function (args) {
        app.sessionState.history = nav.history;
    };

    app.start();
});
