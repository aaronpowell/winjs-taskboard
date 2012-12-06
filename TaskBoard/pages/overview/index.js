require.define('/pages/overview/index.js', function (require, module, exports) {
    "use strict";
    var binding = require('/js/bindingConverters.js');
    var ns = require('WinJS/Namespace');
    var setOptions = require('WinJS/UI').setOptions;
    var List = require('WinJS/Binding/List');
    var Presenter = require('Presenter');

    var OverviewPageViewModel = function(context) {
        var presenter = new Presenter({
            element: context.$element()
        });

        ready(presenter.element);
    };

    var commands = [];

    var app = require('app');

    ns.define('bindingHelpers', binding);

    app.get('#/', '/pages/overview/index.template', OverviewPageViewModel);

    var ready = function (element) {
        var db = this.db;
        var context = this;
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

        var ctrl = element.querySelector('.list');
        setOptions(ctrl.winControl, {
            groupHeaderTemplate: element.querySelector('.headertemplate'),
            itemTemplate: element.querySelector('.itemtemplate'),
            itemDataSource: groupList.dataSource,
            groupDataSource: groupList.groups.dataSource,
            selectionMode: WinJS.UI.SelectionMode.single,
            onselectionchanged: function (e) {
                var selectedItems = e.target.winControl.selection;
                var appbar = element.querySelector('#appbar').winControl;
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
            },
            oniteminvoked: function (e) {
                var index = e.detail.itemIndex;
                var item = groupList.getAt(index);

                context.app.setLocation('#/item/' + item.id);
            }
        });

        var transaction = db.transaction('task');
        var store = transaction.objectStore('task');
        var index = store.index('done');

        index.openCursor(IDBKeyRange.only('no')).onsuccess = function (e) {
            var cursor = e.target.result;
            if (cursor) {
                list.push(cursor.value);
                cursor.continue();
            }
        };
        setupCommands(context);
    };

    var setupCommands = function (context) {
        var db = context.db;

        var cmd = document.getElementById('addCommand').winControl;
        setOptions(cmd, {
            icon: WinJS.UI.AppBarIcon.add,
            id: 'add',
            label: 'Add',
            onclick: function (e) {
                e.preventDefault();
                context.app.setLocation('#/create');
            }
        });
        commands.push(cmd);

        cmd = document.getElementById('deleteCommand').winControl;
        var deleteHandler = function () {
            var list = element.querySelector('.list').winControl;
            var item = list.currentItem;
            item = list.itemDataSource.list.getAt(item.index);

            var transaction = db.transaction('task', 'readwrite');
            var store = transaction.objectStore('task');

            store.delete(item.id).onsuccess = function () {
                list.itemDataSource.remove(list.currentItem.key);
            };
        };
        setOptions(cmd, {
            icon: WinJS.UI.AppBarIcon.delete,
            id: 'delete',
            label: 'Delete',
            onclick: deleteHandler
        });
        commands.push(cmd);

        cmd = document.getElementById('completeCommand').winControl;
        var completeHandler = function () {
            var list = element.querySelector('.list').winControl;
            var item = list.currentItem;
            item = list.itemDataSource.list.getAt(item.index);
            item.completed = true;
            item.done = true;

            var transaction = db.transaction('task', 'readwrite');
            var store = transaction.objectStore('task');

            store.put(item).onsuccess = function () {
                list.itemDataSource.remove(list.currentItem.key);
            };
        };
        setOptions(cmd, {
            icon: WinJS.UI.AppBarIcon.accept,
            id: 'complete',
            label: 'Complete',
            onclick: completeHandler
        });
        commands.push(cmd);

        cmd = document.getElementById('pinCommand').winControl;
        var pinHandler = function () {
            var list = element.querySelector('.list').winControl;
            var item = list.currentItem;
            item = list.itemDataSource.list.getAt(item.index);
            if (this.winControl.icon === WinJS.UI.AppBarIcon.pin) {
                item.pinned = true;
            } else {
                item.pinned = false;
            }

            var transaction = db.transaction('task', 'readwrite');
            var store = transaction.objectStore('task');

            store.put(item).onsuccess = function () {
                var tile = new Windows.UI.StartScreen.SecondaryTile('item.' + item.id);
                if (item.pinned) {

                    tile.foregroundText = Windows.UI.StartScreen.ForegroundText.dark;
                    tile.backgroundColor = Windows.UI.Colors.darkRed;
                    tile.shortName = tile.displayName = item.title;
                    tile.arguments = JSON.stringify({
                        id: item.id
                    });
                    tile.logo = new Windows.Foundation.Uri("ms-appx:///images/logo.png");

                    tile.requestCreateAsync();
                } else {
                    tile.requestDeleteAsync();
                }
            };
        };
        setOptions(cmd, {
            icon: WinJS.UI.AppBarIcon.pin,
            id: 'pin',
            label: 'Pin',
            onclick: pinHandler
        });
        commands.push(cmd);

        document.getElementById('appbar').winControl.hideCommands(commands.filter(function (cmd) {
            return cmd.section === 'selection';
        }));
    };
});
