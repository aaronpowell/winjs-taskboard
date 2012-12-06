/// <reference path="../../js/wamd.ts" />
require.define('sammy.winjs', function (require, m, exports) {
    var sammy = require('sammy');
    var handlebars = require('handlebars');
    var pages = require('WinJS/UI/Pages');
    var processAll = require('WinJS/UI').processAll;
    var $ = require('jQuery');

    sammy.WinJS = function (app, method_alias = 'template') {
        var template = function (template, data? = {}, name? = template) {
            var tmpl = handlebars.compile(template);

            var rendered = tmpl(data);

            var element = document.createElement("div");
            element.style.width = "100%";
            element.style.height = "100%";

            element.innerHTML = rendered;

            processAll(element).then(() => {
                var forms = element.querySelectorAll('form');
                var form, method, action;
                for (var i = 0, il = forms.length; i < il; i += 1) {
                    form = $(forms[i]);
                    method = form.data('formMethod');
                    action = form.data('formAction');

                    form.attr('action', action);
                    form.attr('method', method);

                    form.find('[data-form-name]').each(function () {
                        this.name = $(this).data('formName');
                    });
                }
            });
            
            return element.firstChild;
        }

        app.helper(method_alias, template);
    };
});