require.define('/pages/item/item.js', function (require, module, exports) {
    "use strict";

    var app = require('app');

    var Presenter = require('Presenter');

    var ItemPageViewModel = function (context, element) {
        context.db.task.get(parseInt(context.params['id'], 10)).done(function (item) {
            item.dueDate = new Date(item.due);

            var presenter = new Presenter({
                element: element,
                dataContext: item
            });
        });
    };

    app.get('#/item/:id', '/pages/item/item.template', ItemPageViewModel);

    app.post('#/item/edit', function (context) {
        this.db.task
            .update({
                id: parseInt(context.params['id'], 10),
                title: context.params['title'],
                description: context.params['description'],
                due: context.params['due'].getTime(),
                completed: context.params['completed'],
                done: context.params['completed'] ? 'yes' : 'no',
                updated: Date.now()
            }).done(function() {
                context.app.setLocation('#/');
            });
    });
});
