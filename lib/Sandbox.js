(function () {
    'use strict';

    var defaultAction;
    var bucket = window.location.href;
    var pos = bucket.lastIndexOf('/');
    if (pos > 0 && pos < (bucket.length - 1)) {
        bucket = bucket.substring(pos + 1);
    }

    function hideLoading() {
        document.getElementById('loadingPanel').style.display = "none";
    }

    HTMLElement.prototype.insertHTMLBefore = function (html,node) {
        var divTemp = document.createElement("div"),
            nodes = null,
            fragment = document.createDocumentFragment();
        divTemp.innerHTML = html;
        nodes = divTemp.childNodes;
        for (var i = 0, length = nodes.length; i < length; i += 1) {
            fragment.appendChild(nodes[i].cloneNode(true));
        }
        this.insertBefore(fragment,node);
        nodes = null;
        fragment = null;
    };

    window.onload = () => {
        var loadingDom = `<div id ="loadingPanel" class="loadingContainer">
            <section>
            <div class="loader loader-1">
                <div class="loader-outter"></div>
                <div class="loader-inner"></div>
            </div>
            </section> 
        </div>`;
        document.body.insertHTMLBefore(loadingDom, document.body.firstChild);
    }
 
    window.Sandbox = {
        bucket: bucket,
        declare: function () {},
        highlight: function () {},
        registered: [],
        finishedLoading: function () {
            window.Sandbox.reset();

            if (defaultAction) {
                window.Sandbox.highlight(defaultAction);
                defaultAction();
                defaultAction = undefined;
            }

            document.body.className = document.body.className.replace(/(?:\s|^)sandcastle-loading(?:\s|$)/, ' ');
            hideLoading();

        },
        addToggleButton: function (text, checked, onchange, toolbarID) {
            window.Sandbox.declare(onchange);
            var input = document.createElement('input');
            input.checked = checked;
            input.type = 'checkbox';
            input.style.pointerEvents = 'none';
            var label = document.createElement('label');
            label.appendChild(input);
            label.appendChild(document.createTextNode(text));
            label.style.pointerEvents = 'none';
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'cesium-button';
            button.appendChild(label);

            button.onclick = function () {
                window.Sandbox.reset();
                window.Sandbox.highlight(onchange);
                input.checked = !input.checked;
                onchange(input.checked);
            };

            document.getElementById(toolbarID || 'toolbar').appendChild(button);
        },
        addToolbarButton: function (text, onclick, toolbarID) {
            window.Sandbox.declare(onclick);
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'cesium-button';
            button.onclick = function () {
                window.Sandbox.reset();
                window.Sandbox.highlight(onclick);
                onclick();
            };
            button.textContent = text;
            document.getElementById(toolbarID || 'toolbar').appendChild(button);
        },
        addDefaultToolbarButton: function (text, onclick, toolbarID) {
            window.Sandbox.addToolbarButton(text, onclick, toolbarID);
            defaultAction = onclick;
        },
        addDefaultToolbarMenu: function (options, toolbarID) {
            window.Sandbox.addToolbarMenu(options, toolbarID);
            defaultAction = options[0].onselect;
        },
        addToolbarMenu: function (options, toolbarID) {
            var menu = document.createElement('select');
            menu.className = 'cesium-button';
            menu.onchange = function () {
                window.Sandbox.reset();
                var item = options[menu.selectedIndex];
                if (item && typeof item.onselect === 'function') {
                    item.onselect();
                }
            };
            document.getElementById(toolbarID || 'toolbar').appendChild(menu);

            if (!defaultAction && typeof options[0].onselect === 'function') {
                defaultAction = options[0].onselect;
            }

            for (var i = 0, len = options.length; i < len; ++i) {
                var option = document.createElement('option');
                option.textContent = options[i].text;
                option.value = options[i].value;
                menu.appendChild(option);
            }
        },
        reset: function () {}
    };

    if (window.location.protocol === 'file:') {
        if (window.confirm("You must host this app on a web server.\nSee contributor's guide for more info?")) {
            window.location = '';
        }
    }
}());