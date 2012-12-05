require.define('/js/default.js', function (require, module, exports) {
    "use strict";

    var binding = require('WinJS/Binding');
    binding.optimizeBindingReferences = true;

    require('/pages/overview/index.js');

    var app = require('app');

    //var activation = require('Windows/ApplicationModel/Activation');
    //var nav = require('WinJS/Navigation');
    //var navigator = require('/js/navigator.js');

    //app.onactivated = function (args) {
    //    if (args.detail.kind === activation.ActivationKind.launch) {
    //        if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
    //        } else {
    //        }
    //        if (app.sessionState.history) {
    //            nav.history = app.sessionState.history;
    //        }
    //        if (args.detail.arguments) {
    //            var tileArg = JSON.parse(args.detail.arguments);

    //            var req = window.indexedDB.open('task-board', 3);

    //            req.onsuccess = function (e) {
    //                var db = e.target.result;

    //                var transaction = db.transaction('task');
    //                var store = transaction.objectStore('task');
    //                store.get(tileArg.id).onsuccess = function (e) {
    //                    nav.navigate('/pages/overview/item.html', {
    //                        item: e.target.result
    //                    });
    //                };
    //            };
    //        }

    //        var contentHost = document.getElementById('contenthost');
    //        var pcn = new navigator.PageControlNavigator(contentHost, {
    //             home: '/pages/overview/index'
    //        });

    //        args.setPromise(WinJS.UI.processAll().then(function () {
    //            if (nav.location) {
    //                nav.history.current.initialPlaceholder = true;
    //                return nav.navigate(nav.location, nav.state);
    //            } else {
    //                return nav.navigate(navigator.navigator.home);
    //            }
    //        }));

    //    }
    //};

    //app.oncheckpoint = function (args) {
    //    app.sessionState.history = nav.history;
    //};

    app.start();
});
