(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/overview/index.html", {
        ready: function (element, options) {
            var req = window.indexedDB.open('task-board');
            req.onupgradeneeded = function (e) {
                var db = e.target.result;

                db.createObjectStore('task', { keyPath: 'id' });
            };

            req.onsuccess = function (e) {
                var db = req.result;

                var list = new WinJS.Binding.List();
                var groupList = list.createGrouped(
                    function(item) {
                        return item.title.charAt(0);
                    }, function(item) {
                        return {
                            title: item.title
                        };
                    }, function(leftKey, rightKey) {
                        return leftKey.charCodeAt(0) - rightKey.charCodeAt(0);
                    });

                var ctrl = document.querySelector('.list');
                WinJS.UI.setOptions(ctrl.winControl, {
                    headerTemplate: document.querySelector('.headertemplate'),
                    itemTemplate: document.querySelector('.itemtemplate'),
                    itemDataSource: list.dataSource,
                    groupDataSource: groupList.groups.dataSource
                });
                list.push({
                    id: 0,
                    title: 'foo',
                    description: 'bar',
                    completed: new Date()
                });

                var transaction = db.transaction('task');
                var store = transaction.objectStore('task');

                store.openCursor().onsuccess = function (e) {
                    var cursor = e.target.result;
                    if (cursor) {
                        list.push(cursor.value);
                        cursor.continue();
                    }
                };
            };
        },

        unload: function () {

        },

        updateLayout: function (element, viewState, lastViewState) {

        }
    });
})();
