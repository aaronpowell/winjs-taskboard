require.define('sammy.winjs', function (require, m, exports) {
    var sammy = require('sammy');
    var handlebars = require('handlebars');
    var pages = require('WinJS/UI/Pages');
    var processAll = require('WinJS/UI').processAll;
    sammy.WinJS = function (app, method_alias) {
        if (typeof method_alias === "undefined") { method_alias = 'template'; }
        var template = function (template, data, name) {
            if (typeof data === "undefined") { data = {
            }; }
            if (typeof name === "undefined") { name = template; }
            var tmpl = handlebars.compile(template);
            var rendered = tmpl(data);
            var element = document.createElement("div");
            element.style.width = "100%";
            element.style.height = "100%";
            element.innerHTML = rendered;
            processAll(element);
            return element;
        };
        app.helper(method_alias, template);
    };
});
