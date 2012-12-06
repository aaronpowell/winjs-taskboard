require.define('/js/default.js', function (require, module, exports) {
    "use strict";

    var binding = require('WinJS/Binding');
    binding.optimizeBindingReferences = true;

    require('/pages/overview/index.js');
    require('/pages/create/create.js');
    require('/pages/item/item.js');

    var app = require('app');
    var db = require('db');

    app.on('activated', function () {
        db.open({
            server: 'task-board',
            version: 3,
            schema: {
                task: {
                    key: { keyPath: 'id', autoIncrement: true },
                    indexed: {
                        done: { unique: false }
                    }
                }
            }
        });
    });

    app.around(function (callback) {
        var context = this;
        db.open({
            server: 'task-board',
            version: 3,
            schema: {
                task: {
                    key: { keyPath: 'id', autoIncrement: true },
                    indexed: {
                        done: { unique: false }
                    }
                }
            }
        }).done(function (server) {
            context.db = server;
            callback();
        });
    });

    app.start();
});
