(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/overview/index.html", {
        ready: function (element) {
            var req = window.indexedDB.open('task-board');
            req.onupgradeneeded = function (e) {
                var db = e.target.result;

                db.createObjectStore('task', { keyPath: 'id' });
            };

            req.onsuccess = function (e) {
                var db = req.result;

                var list = new WinJS.Binding.List();
                var now = new Date();
                var groupList = list.createGrouped(
                    function(item) {
                        var diff = Math.round((item.due - now) / (24 * 3600 * 1000));
                        
                        if(diff <= 0) {
                            return item.key = 'Overdue';
                        }
                        return item.key = 'Coming up';
                   }, function(item) {
                        return {
                            title: item.title,
                            key: item.key
                        };
                    }, function(leftKey, rightKey) {
                        return leftKey.charCodeAt(0) - rightKey.charCodeAt(0);
                    });

                var ctrl = element.querySelector('.list');
                WinJS.UI.setOptions(ctrl.winControl, {
                    groupHeaderTemplate: element.querySelector('.headertemplate'),
                    itemTemplate: element.querySelector('.itemtemplate'),
                    itemDataSource: groupList.dataSource,
                    groupDataSource: groupList.groups.dataSource
                });
                list.push({
                    id: 0,
                    title: 'foo',
                    description: 'bar',
                    due: new Date(),
                    completed: false
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
