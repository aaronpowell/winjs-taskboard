(function () {
    "use strict";
    var nav = WinJS.Navigation;

    WinJS.UI.Pages.define("/pages/overview/index.html", {
        ready: function (element) {
            var req = window.indexedDB.open('task-board', 2);
            req.onupgradeneeded = function (e) {
                var db = e.target.result;
                
                db.createObjectStore('task', { keyPath: 'id', autoIncrement: true });
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
                        if (diff >= 1 && diff <= 3) {
                            return item.key = 'Soon';
                        }
                        if(diff >= 4 && diff <= 7) {
                            return item.key = 'End of the week';
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

            var cmd = new WinJS.UI.AppBarCommand(document.createElement('button'));
            WinJS.UI.setOptions(cmd, {
                icon: WinJS.UI.AppBarIcon.add,
                label: 'Add'
            });
            
            cmd.element.addEventListener('click', function(e) {
                e.preventDefault();
                nav.navigate('/pages/create/create.html');
            }, false);

            document.getElementById('appbar').winControl.commands = [cmd];
        },

        unload: function () {

        },

        updateLayout: function (element, viewState, lastViewState) {

        }
    });
})();
