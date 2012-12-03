(function() {
    'use strict';

    WinJS.Namespace.define('TaskBoard', {
        binding: {
            friendlyDate: WinJS.Binding.converter(function (date) {
                date = new Date(date);
                var day = date.getDate();
                var month = date.getMonth();
                var year = date.getFullYear();

                return day + '/' + (month + 1) + '/' + year;
            })
        }
    });
})();