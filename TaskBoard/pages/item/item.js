require.define('/pages/item/item.js', function (require, module, exports) {
    "use strict";

    var app = require('app');

    var Presenter = require('Presenter');

    var ItemPageViewModel = function (element) {
        var context = this;
        var db = context.db;
        var transaction = db.transaction('task');
        var store = transaction.objectStore('task');

        store.get(parseInt(context.params['id'], 10)).onsuccess = function (e) {
            var item = e.target.result;
            item.dueDate = new Date(item.due);

            var presenter = new Presenter({
                element: element,
                dataContext: item
            });
        };
    };

    app.get('#/item/:id', '/pages/item/item.template', ItemPageViewModel);

    app.post('#/item/edit', function (context) {
        var transaction = this.db.transaction('task', 'readwrite');
        var store = transaction.objectStore('task');

        var req = store.put({
            id: parseInt(context.params['id'], 10),
            title: context.params['title'],
            description: context.params['description'],
            due: context.params['due'].getTime(),
            completed: context.params['completed'],
            done: context.params['completed'] ? 'yes' : 'no',
            updated: Date.now()
        });

        req.onsuccess = function (e) {
            context.app.setLocation('#/');
        };
    });
});
