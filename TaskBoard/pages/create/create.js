require.define('/pages/create/create.js', function (require, module, exports) {
    "use strict";

    var app = require('app');

    app.get('#/create', function (context) {
        context.app.swap('');

        context.render('/pages/create/create.template')
            .appendTo(context.$element())
            .then(ready.bind(context));
    });

    var nav = require('WinJS/Navigation');

    var ready = function (element) {
        var context = this;
        var db = context.db;
        element.querySelector('form').addEventListener('submit', function (e) {
            e.preventDefault();

            var transaction = db.transaction('task', 'readwrite');
            var store = transaction.objectStore('task');

            var req = store.add({
                title: element.querySelector('input[type="text"]').value,
                description: element.querySelector('textarea').value,
                due: element.querySelector('#due').winControl.current.getTime(),
                completed: element.querySelector('#completed').winControl.checked,
                done: element.querySelector('#completed').winControl.checked ? 'yes' : 'no',
                created: Date.now()
            });

            req.onsuccess = function () {
                context.app.setLocation('#/');
            };
        });
    };
});
