require.define('/pages/overview/index.js', function (require, module, exports) {
    "use strict";
    var app = require('app');
    var List = require('WinJS/Binding/List');
    var Presenter = require('Presenter');
    var AppBarViewModel = require('/pages/overview/appbar.js');

    var OverviewPageViewModel = function (context, element) {
        var appBarViewModel = new AppBarViewModel(context, element);

        var list = new List();
        var now = new Date();
        var groupList = list.createGrouped(
            function (item) {
                var diff = Math.round((item.due - now) / (24 * 3600 * 1000));

                if (diff <= 0) {
                    return item.key = 'Overdue';
                }
                if (diff >= 1 && diff <= 3) {
                    return item.key = 'Soon';
                }
                if (diff >= 4 && diff <= 7) {
                    return item.key = 'End of the week';
                }
                return item.key = 'Coming up';
            }, function (item) {
                return {
                    title: item.title,
                    key: item.key
                };
            }, function (leftKey, rightKey) {
                return leftKey.charCodeAt(0) - rightKey.charCodeAt(0);
            });

        var presenter = new Presenter({
            element: element,
            dataContext: {
                list: list,
                groupedList: groupList,
                groupHeaderTemplate: element.querySelector('.headertemplate'),
                itemTemplate: element.querySelector('.itemtemplate')
            },
            events: {
                '.list': {
                    iteminvoked: function (e) {
                        var index = e.detail.itemIndex;
                        var item = groupList.getAt(index);

                        context.app.setLocation('#/item/' + item.id);
                    },
                    selectionchanged: function (e) {
                        var selectedItems = e.target.winControl.selection;
                        var appbar = element.querySelector('#appbar').winControl;
                        var commands = [].slice.call(element.querySelector('#appbar').querySelectorAll('[data-win-control="WinJS.UI.AppBarCommand"]')).map(function (x) { return x.winControl; });
                        
                        if (selectedItems.count()) {
                            if (selectedItems.count() === 1) {
                                selectedItems.getItems().done(function (items) {
                                    var item = items[0];
                                    var pinned = commands.filter(function (cmd) { return cmd.id === 'pinCommand'; })[0];
                                    if (item.data.pinned) {
                                        WinJS.UI.setOptions(pinned, {
                                            icon: WinJS.UI.AppBarIcon.unpin,
                                            label: 'Unpin'
                                        });
                                    } else {
                                        WinJS.UI.setOptions(pinned, {
                                            icon: WinJS.UI.AppBarIcon.pin,
                                            label: 'Pin'
                                        });
                                    }
                                });
                            }

                            appbar.showCommands(commands.filter(function (cmd) { return cmd.section === 'selection'; }));
                            appbar.sticky = true;
                            appbar.show();
                        } else {
                            appbar.hideCommands(commands.filter(function (cmd) { return cmd.section === 'selection'; }));
                            appbar.sticky = false;
                            appbar.hide();
                        }
                    }
                }
            }
        });

        context.db.task.query('done')
            .only('no')
            .execute()
            .done(function (items) {
                list.push.apply(list, items);
            });

        //TODO: work out why this hack is required
        element.querySelector('.list').style.height = '900px';
    };

    app.get('#/', '/pages/overview/index.template', OverviewPageViewModel);
});
