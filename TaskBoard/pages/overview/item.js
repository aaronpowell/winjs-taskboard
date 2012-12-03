(function () {
    "use strict";

    var nav = WinJS.Navigation;

    WinJS.UI.Pages.define("/pages/overview/item.html", {
        ready: function (element, options) {
            WinJS.Binding.processAll(element, options.item);

            element.querySelector('#due').winControl.current = new Date(options.item.due);
            element.querySelector('#completed').winControl.checked = options.item.completed;

            element.querySelector('form').addEventListener('submit', function(e) {
                e.preventDefault();
                
                var req = indexedDB.open('task-board', 2);
                req.onsuccess = function (e) {
                    var db = e.target.result;
                    var transaction = db.transaction('task', 'readwrite');
                    var store = transaction.objectStore('task');

                    var req = store.put({
                        id: options.item.id,
                        title: element.querySelector('#title').value,
                        description: element.querySelector('#desc').value,
                        due: element.querySelector('#due').winControl.current.getTime(),
                        completed: element.querySelector('#completed').winControl.checked,
                        created: Date.now()
                    });

                    req.onsuccess = function (e) {
                        nav.navigate('/pages/overview/index.html');
                    };
                };
            }, false);
        },

        unload: function () {
        },

        updateLayout: function (element, viewState, lastViewState) {
        }
    });
})();
