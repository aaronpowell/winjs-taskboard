require.define('/pages/overview/appbar.js', function (require, module, exports) {
    var Presenter = require('Presenter');

    var AppBarViewModel = function (context, element) {
        var db = context.db;
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
        var pinHandler = function () {
            var list = element.querySelector('.list').winControl;
            var item = list.currentItem;
            item = list.itemDataSource.list.getAt(item.index);
            item.pinned = this.winControl.icon === WinJS.UI.AppBarIcon.pin;

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

        var presenter = new Presenter({
            element: element,
            ui: {
                commands: [{
                    id: 'addCommand',
                    icon: WinJS.UI.AppBarIcon.add,
                    label: 'Add',
                    onclick: function () {
                        context.app.setLocation('#/create');
                    }
                }, {
                    id: 'deleteCommand',
                    icon: WinJS.UI.AppBarIcon.delete,
                    label: 'Delete',
                    section: 'selection',
                    onclick: deleteHandler
                }, {
                    id: 'completeCommand',
                    icon: WinJS.UI.AppBarIcon.accept,
                    label: 'Complete',
                    section: 'selection',
                    onclick: completeHandler
                }, {
                    icon: WinJS.UI.AppBarIcon.pin,
                    id: 'pinCommand',
                    label: 'Pin',
                    onclick: pinHandler
                }]
            }
        });
    };

    module.exports = AppBarViewModel;
});