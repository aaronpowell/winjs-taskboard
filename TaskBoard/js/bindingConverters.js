require.define('/js/bindingConverters.js', function(require, module, exports) {
    'use strict';

    var converter = require('WinJS/Binding').converter;

    module.exports = {
        friendlyDate: converter(function(date) {
            date = new Date(date);
            var day = date.getDate();
            var month = date.getMonth();
            var year = date.getFullYear();

            return day + '/' + (month + 1) + '/' + year;
        })
    };
});