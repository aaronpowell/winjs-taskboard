(function () {
    "use strict";

    var nav = WinJS.Navigation;

    WinJS.UI.Pages.define("/pages/create/create.html", {
        ready: function (element, options) {
            element.querySelector('form').addEventListener('submit', function (e) {
                e.preventDefault();

                var req = indexedDB.open('task-board', 3);
                req.onsuccess = function (e) {
                    var db = e.target.result;
                    var transaction = db.transaction('task', 'readwrite');
                    var store = transaction.objectStore('task');

                    var req = store.add({
                        title: element.querySelector('#title').value,
                        description: element.querySelector('#desc').value,
                        due: element.querySelector('#due').winControl.current.getTime(),
                        completed: element.querySelector('#completed').winControl.checked,
                        done: element.querySelector('#completed').winControl.checked ? 'yes' : 'no',
                        created: Date.now()
                    });

                    req.onsuccess = function (e) {
                        nav.navigate('/pages/overview/index.html');
                    };
                };
            });
        },

        unload: function () {
        },

        updateLayout: function (element, viewState, lastViewState) {
        }
    });
})();
