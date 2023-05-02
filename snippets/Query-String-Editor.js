// Add, remove, or update query string parameters on the current page and trims unnecessary queries
(function() {
    if (window._WF) {
        var buildStyles = function(styles) {
            return Object.keys(styles).map(function(style) {
                return style + ":" + styles[style];
            }).join(";");
        };

        var addQueryField = function(query = "", param = "") {
            var inner = document.getElementById("input");
            var br = document.getElementsByClassName("paramInput")[0];
            var input = _WF.utils.createElement(
                '<span class="paramInput" style="">{ <span style="">' +
                '<input placeholder="hmab_debug" style="width:40%;" class="query" value="' + query + '"></input>' +
                '</span> = <span style="">' +
                '<input placeholder="exampleTest-exampleBucket" style="width:40%;" class="param" value="' + param + '"></input>' +
                '</span> }</span>' +
                '<br>');

            if (br != undefined) {
                inner.appendChild(_WF.utils.createElement("<br>"));
            }
            inner.appendChild(input);
        };

        var rebuildUrl = function(url) {
            document.location = url;
        };

        var copy = function(qs) {
            var inputs = [];
            [...document.getElementsByClassName("paramInput")].forEach(input => {
                var temp = "";
                var first = true;
                [...input.querySelectorAll("input")].forEach(val => {
                    if (val.innerHTML || val.value) {
                        temp += ((val.innerHTML ? val.innerHTML : val.value) + (first ? "=" : ""));
                        first = false;
                    } else {
                        if (!first) {
                            temp = temp.slice(0, -1);
                        }
                    }
                });
                if (temp) {
                    inputs.push(temp);
                }
            });
            var query = inputs.join("&");
            query.charAt(0) === "?" ? void(0) : query = "?" + query;
            var url = document.location.protocol + "//" + document.location.host + document.location.pathname + query;
            navigator.clipboard.writeText(qs ? query : url);
            alert(`${qs ? "Query" : "Url"} Copied!`, url);
        };

        var submit = function() {
            var inputs = [];
            [...document.getElementsByClassName("paramInput")].forEach(input => {
                var temp = "";
                var first = true;
                [...input.querySelectorAll("input")].forEach(val => {
                    if (val.innerHTML || val.value) {
                        temp += ((val.innerHTML ? val.innerHTML : val.value) + (first ? "=" : ""));
                        first = false;
                    } else {
                        if (!first) {
                            temp = temp.slice(0, -1);
                        }
                    }
                });
                if (temp) {
                    inputs.push(temp);
                }
            });
            var query = inputs.join("&");
            query.charAt(0) === "?" ? void(0) : query = "?" + query;
            var url = document.location.protocol + "//" + document.location.host + document.location.pathname + query;
            rebuildUrl(url);
        };

        var createButton = function(text, onclick = "", qs = false) {
            var btn = document.createElement("button");
            btn.style = buildStyles({ "min-width": "165px", margin: "5px 1px", padding: 0 });
            btn.innerHTML = text;
            btn.addEventListener("click", function() {
                switch (onclick) {
                    case "copy":
                        copy(qs);
                        break;
                    case "query":
                        addQueryField();
                        break;
                    case "submit":
                        submit();
                        break;
                    default:
                        void(0);
                        break;
                }
            });
            return btn;
        };

        var createOverlay = function() {
            var overlay = getOverlay;
            document.body.style.overflow = "hidden";
            var isM = _WF.utils.isDesktop() ? 0 : 1;
            var overlayStlyes = { position: "fixed", top: "0", left: "0", width: "100%", height: window.innerHeight + "px", "z-index": "2147483647", "background-color": "rgba(0,0,0,0.5)" };
            var innerStlyes = { "font-size": "small", "margin-left": "auto", "margin-right": "auto", padding: isM ? "8px" : "32px", "background-color": "whitesmoke", position: "relative", top: isM ? "10%" : "5%", width: isM ? "95%" : "50%", height: isM ? "80%" : "90%", overflow: "scroll", border: "1px solid black" };

            overlay = _WF.utils.createElement(
                '<div id="param__overlay" style="' +
                buildStyles(overlayStlyes) +
                '"><div id="inner" style="' +
                buildStyles(innerStlyes) +
                '"><div id="input"></div></div></div>'
            );

            overlay.onclick = function() {
                var c = overlay;
                document.body.style.overflow = "";
                c.parentElement.removeChild(c);
            };
            document.body.appendChild(overlay);

            var params = document.location.search;
            var paramArr = params.split("&");
            paramArr.forEach((param) => {
                var query = param.split("=");
                if (query[1] != "1") {
                    addQueryField(query[0], query[1]);
                }
            });

            var qButton = createButton("Add query", "query");
            var copyURLButton = createButton("Copy Link", "copy");
            var copyQSButton = createButton("Copy Query", "copy", true);
            var sButton = createButton("Reload", "submit");
            document.getElementById("inner").appendChild(qButton);
            document.getElementById("inner").appendChild(copyURLButton);
            document.getElementById("inner").appendChild(copyQSButton);
            document.getElementById("inner").appendChild(sButton);
            overlay.firstElementChild.onclick = function(c) {
                c.stopPropagation();
                c.preventDefault();
            };
        };

        var getOverlay = document.getElementById("param__overlay");

        if (getOverlay) {
            var y = getOverlay;
            document.body.style.overflow = "";
            y.parentElement.removeChild(y);
        } else {
            createOverlay();
        }
    };
})();