/*View and modify which active AB tests run on the current page*/
(function() {
        var buildStyles = function(styles) {
            return Object.keys(styles).map(function(style) {
                return style + ":" + styles[style];
            }).join(";");
        };

        var createButton = function(text) {
            var btn = document.createElement("button");
            btn.style = buildStyles({ "min-width": "165px", margin: "5px 1px", padding: 0 });
            btn.innerHTML = text;
            return btn;
        };

        var createInput = function(type, id, value, checked = false) {
            var div = document.createElement("div");
            var input = document.createElement("input");
            var label = document.createElement("label");
            label.htmlFor = id;
            label.innerHTML = value;
            input.type = type;
            input.style.margin = "5px";
            input.style.verticalAlign = "bottom";
            input.id = id;
            input.checked = checked === "true" ? true : false;
            label.appendChild(input);
            div.appendChild(label);
            return div;
        };

        var buildABTests = function() {
            let abString = _WF.cache.getItem(_WF.KEYS.BUCKETID).split("-");
            let activeBuckets = abString[1] || _WF.GLOBALS.DEFAULTBUCKETSTRING;
            let inner = document.getElementById("inner");
            let testsArr = _WF.cache.getItem(_WF.KEYS.TAGMAN).ab_allocation;
            let abVersion = testsArr.version || '000';
            testsArr = testsArr.ab_tests;
            let titleString = _WF.utils.createElement(`<h3 id="ab-version" version="${abVersion}">AB Version: ${abVersion}</h3>`);
            if (_WF.utils.isMobile()) { titleString.style.textAlign = "center"; }
            inner.appendChild(titleString);

            testsArr.forEach((test, index) => {
                let blockWidth = { "display": "block", "width": "100%" };
                let testDiv = document.createElement("div");
                let label = document.createElement("label");
                let select = document.createElement("select");
                let filter = handleFilters(test.when, true);
                let except = handleFilters(test.except, false);
                select.setAttribute("style", buildStyles(blockWidth));
                blockWidth["font-weight"] = "bold";
                label.setAttribute("style", buildStyles(blockWidth));
                select.style.border = "1px solid black";
                label.htmlFor = select;
                label.innerHTML = `[${test.name}]:${filter}${except}`;
                let fallback = document.createElement("option");
                fallback.value = test.fallback;
                fallback.innerHTML = `Fallback: ${test.fallback}`;
                fallback.style.fontWeight = 'bold';
                select.appendChild(fallback);

                test.groups.forEach(bucket => {
                    let option = document.createElement("option");
                    option.value = bucket.name;
                    option.innerHTML = `${bucket.name} : ${bucket.allocation}%`;
                    select.appendChild(option);
                });
                select.selectedIndex = activeBuckets[index] || 0;
                testDiv.appendChild(label);
                testDiv.appendChild(select);
                inner.appendChild(testDiv);
            });

            let reload = createButton("Reload"),
                exit = createButton("Exit"),
                reset = createInput("checkbox", "toggleClear", "Clear Session Storage on Reload", localStorage.apis_clear);
            reset.style.margin = "10px";
            inner.appendChild(reload);
            inner.appendChild(exit);
            inner.appendChild(reset);

            reload.addEventListener("click", () => {
                let bucketID = "";
                let overlay = document.getElementById("param__overlay") || document;
                overlay.querySelectorAll("select").forEach(selected => bucketID += selected.selectedIndex);
                while (bucketID.length < 6) bucketID += "0";
                let abVersion = document.getElementById("ab-version").getAttribute("version");
                bucketId = abVersion + "-" + bucketID;
                _WF.cache.setItem(_WF.KEYS.BUCKETID, bucketId).asPersistent();
                if (localStorage.apis_clear == "true") {
                    clearSessionStorage();
                }
                location.reload();
            });
            document.getElementById("toggleClear").addEventListener("change", (e) => {
                localStorage.apis_clear = e.target.checked ? true : false;
            });
            exit.addEventListener("click", () => {
                var y = document.getElementById("param__overlay");
                document.body.style.overflow = "";
                y.parentElement.removeChild(y);
            });
        };

        function handleFilters(type, isFilter) {
            let filterText = "";
            if (type && type.length && type.length > 0) {
                filterText += "{ ";
                type.forEach((filter, index) => {
                    let filterName = filter.key.toString();
                    let filterValues = filter.values.toString();
                    filterText += `${filterName}: ${filterValues}${index < type.length - 1 ? " | ": " }"}`;
                });
                filterText = `<br/><span style="color:${isFilter ? "deepskyblue": "red"};">${isFilter ? "F": "E"} : ${filterText}</span>`;
            }
            return filterText;
        }

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
                '"></div></div>'
            );

            overlay.onclick = function() {
                var c = overlay;
                c.remove();
            };
            document.body.appendChild(overlay);

            document.getElementById("inner").onclick = function(c) {
                c.stopPropagation();
            };
        };

        function clearSessionStorage() {
            let log = localStorage.hmk_logging ? localStorage.hmk_logging : "h",
                clear = localStorage.apis_clear ? localStorage.apis_clear : "true";
            localStorage.clear();
            localStorage.hmk_logging = log;
            localStorage.apis_clear = clear;
        }

        var getOverlay = document.getElementById("param__overlay");

        if (getOverlay) {
            var y = getOverlay;
            document.body.style.overflow = "";
            y.parentElement.removeChild(y);
        } else {
            createOverlay();
            buildABTests();
        }
})();