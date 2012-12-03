(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/overview/index.html", {
        ready: function (element, options) {
            var req = window.indexedDB.open('task-board');
            req.onupgradeneeded = function(e) {
                var db = e.target.result;

                db.createObjectStore('task', { keyPath: 'id' });
            };

            req.onsuccess = function(e) {
                var db = req.result;

                var transaction = db.transaction('task');
                var store = transaction.objectStore('task');
                var now = new Date();
                
                var list = new WinJS.Binding.List([{
                    id: 0,
                    title: 'foo',
                    description: 'bar',
                    completed: false,
                    due: new Date()
                }]);
                var groups = list.createGrouped(function(item) {
                    var dateDiff = Math.floor((item.due - 1) / (24 * 3600 * 1000));
                    
                    if(dateDiff <= 0) {
                        return 'Overdue';
                    }
                    if (dateDiff >= 1 && dateDiff <= 3) {
                        return 'Shortly';
                    }
                    if (dateDiff >= 4 & dateDiff <= 7) {
                        return 'This week';
                    }
                    return 'In due time';
                }, function() {

                }, function() {

                });
                store.openCursor().onsuccess = function(e) {
                    var cursor = e.target.result;
                    if(cursor) {
                        list.push(cursor.value);
                    } else {
                        var ctrl = document.querySelector('.list');
                        
                        WinJS.UI.setOptions(ctrl.winControl, {
                            headerTemplate: document.querySelector('.headertemplate'),
                            itemTemplate: document.querySelector('.itemtemplate'),
                            itemDataSource: list.dataSource,
                            groupDataSource: groups.dataSource
                        });
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
