require.define('/pages/create/create.js', function (require, module, exports) {
    "use strict";

    var app = require('app');
    
    var Presenter = require('Presenter');

    var CreatePageViewModel = function (context, element) {
        var presenter = new Presenter({
            element: element
        });

        ready.call(context, presenter.element);
    };

    app.get('#/create', '/pages/create/create.template', CreatePageViewModel);

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
