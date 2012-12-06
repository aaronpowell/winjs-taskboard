require.define('/pages/create/create.js', function (require, module, exports) {
    "use strict";

    var app = require('app');
    
    var Presenter = require('Presenter');

    var CreatePageViewModel = function (context, element) {
        var presenter = new Presenter({
            element: element
        });
    };

    app.get('#/create', '/pages/create/create.template', CreatePageViewModel);

    app.post('#/create', function(context) {
        this.db.add({
            title: context.params['title'],
            description: context.params['description'],
            due: context.params['due'].getTime(),
            completed: context.params['completed'],
            done: context.params['completed'] ? 'yes' : 'no',
            updated: Date.now(),
            created: Date.now()
        }).done(function () {
            context.app.setLocation('#/');
        });
    });
});
