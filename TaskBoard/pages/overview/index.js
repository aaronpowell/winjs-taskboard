﻿(function () {
    "use strict";
    var nav = WinJS.Navigation;
    var commands = [];

    WinJS.UI.Pages.define("/pages/overview/index.html", {
        ready: function (element) {
            var req = window.indexedDB.open('task-board', 3);
            req.onupgradeneeded = function (e) {
                var db = e.target.result;

                var store = db.createObjectStore('task', { keyPath: 'id', autoIncrement: true });

                store.createIndex('done', 'done', { unique: false });
            };

            req.onsuccess = function (e) {
                var db = req.result;

                var list = new WinJS.Binding.List();
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
                WinJS.UI.setOptions(ctrl.winControl, {
                    groupHeaderTemplate: element.querySelector('.headertemplate'),
                    itemTemplate: element.querySelector('.itemtemplate'),
                    itemDataSource: groupList.dataSource,
                    groupDataSource: groupList.groups.dataSource,
                    selectionMode: WinJS.UI.SelectionMode.single,
                    onselectionchanged: function (e) {
                        var selectedItems = e.target.winControl.selection;
                        var appbar = element.querySelector('#appbar').winControl;
                        if (selectedItems.count()) {
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

                        nav.navigate('/pages/overview/item.html', { item: item });
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
            };

            var cmd = document.getElementById('addCommand').winControl;
            WinJS.UI.setOptions(cmd, {
                icon: WinJS.UI.AppBarIcon.add,
                id: 'add',
                label: 'Add',
                onclick: function (e) {
                    e.preventDefault();
                    nav.navigate('/pages/create/create.html');
                }
            });
            commands.push(cmd);

            cmd = document.getElementById('deleteCommand').winControl;
            WinJS.UI.setOptions(cmd, {
                icon: WinJS.UI.AppBarIcon.delete,
                id: 'delete',
                label: 'Delete',
                onclick: function () {
                    var list = element.querySelector('.list').winControl;
                    var item = list.currentItem;
                    item = list.itemDataSource.list.getAt(item.index);

                    var req = indexedDB.open('task-board', 3);
                    req.onsuccess = function (e) {
                        var db = e.target.result;

                        var transaction = db.transaction('task', 'readwrite');
                        var store = transaction.objectStore('task');

                        store.delete(item.id).onsuccess = function () {
                            list.itemDataSource.remove(list.currentItem.key);
                        };
                    };
                }
            });
            commands.push(cmd);

            cmd = document.getElementById('completeCommand').winControl;
            WinJS.UI.setOptions(cmd, {
                icon: WinJS.UI.AppBarIcon.accept,
                id: 'complete',
                label: 'Complete',
                onclick: function () {
                    var list = element.querySelector('.list').winControl;
                    var item = list.currentItem;
                    item = list.itemDataSource.list.getAt(item.index);
                    item.completed = true;
                    item.done = true;

                    var req = indexedDB.open('task-board', 3);
                    req.onsuccess = function (e) {
                        var db = e.target.result;

                        var transaction = db.transaction('task', 'readwrite');
                        var store = transaction.objectStore('task');

                        store.put(item).onsuccess = function () {
                            list.itemDataSource.remove(list.currentItem.key);
                        };
                    };
                }
            });
            commands.push(cmd);

            document.getElementById('appbar').winControl.hideCommands(commands.filter(function (cmd) {
                 return cmd.section === 'selection';
            }));
        },

        unload: function () {

        },

        updateLayout: function (element, viewState, lastViewState) {

        }
    });
})();
