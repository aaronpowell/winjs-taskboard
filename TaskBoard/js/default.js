require.define('/js/default.js', function (require, module, exports) {
    "use strict";

    var binding = require('WinJS/Binding');
    binding.optimizeBindingReferences = true;

    require('/pages/overview/index.js');

    var app = require('app');

    app.on('activated', function() {
        var req = window.indexedDB.open('task-board', 3);
        req.onupgradeneeded = function (e) {
            var db = e.target.result;

            var store = db.createObjectStore('task', { keyPath: 'id', autoIncrement: true });

            store.createIndex('done', 'done', { unique: false });
        };
        req.onsuccess = function(e) {
            //do nothing for now
        };
    });

    app.around(function (callback) {
        var context = this;
        var req = window.indexedDB.open('task-board', 3);
        req.onsuccess = function(e) {
            context.db = req.result;
            callback();
        };
    });

    app.start();
});
