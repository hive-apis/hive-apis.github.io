/* Creates a sharable url that will put users into the same active AB tests currently running on the page */
(() => {
    let buildURL = function(newQS) {
        let search = document.location.search;
        let blacklist = ["hmab_debug", "bucket_id", "utm_source", "utm_campaign", "utm_medium", "utm_content", "csplit", "view-all", "hm_external"];
        let queries = [];
        if (search) {
            search = search.split("?")[1] || "";
            queries = search.split("&");
        }
        queries = queries.filter(query => !blacklist.some(item => ~query.search(RegExp(item)))); /* Remove blacklisted items from user queries */
        /* Add/Set UTMs */
        queries.push(`utm_source=${_WF.cache.getItem(_WF.KEYS.UTMSOURCE) || "organic"}`);
        queries.push(`utm_campaign=${_WF.cache.getItem(_WF.KEYS.UTMCAMPAIGN) || "qa"}`);
        queries.push(`utm_content=${_WF.cache.getItem(_WF.KEYS.UTMCONTENT) || "qa"}`);
        queries.push(`utm_medium=${_WF.cache.getItem(_WF.KEYS.UTMMEDIUM) || "qa"}`);
        queries.forEach((query) => {
            if (query.length > 0 && query.split("=")[1] != "1") { /*don't add empty queries or advertiser info*/
                newQS += `&${query}`;
            }
        });
        let url = document.location.origin + document.location.pathname + "?" + newQS;
        url = encodeURI(url);
        buildUI(url);
    };
    let buildABDebug = function(abObj) {
        const activeTests = abObj;
        let qsMulti = _WF.KEYS.ABOVERRIDE;
        let first = true;
        Object.keys(activeTests).forEach((testName) => {
            if (testName.indexOf("none_") === -1) {
                qsMulti += `${first ? "=" : "~"}${testName}-${activeTests[testName]}`;
                first = false;
            }
        });
        return qsMulti;
    };

    let buildUI = function(output) {
        var overlayid = "share_spy_overlay";
        var overlay = document.getElementById(overlayid);
        if (overlay) {
            close(overlay);
            return;
        } else {
            render(overlayid, output);
        }
    };

    function s2s(o) {
        return Object.keys(o).map(function(k) {
            return `${k}:${o[k]}`;
        }).join(`;`);
    }

    function close(overlay) {
        document.body.style.overflow = "";
        overlay.parentElement.removeChild(overlay);
    }

    function render(overlayid, output) {
        document.body.style.overflow = "hidden";
        var smallify = _WF.utils.isDesktop() ? 0 : 1;
        var overlayStyles = {
            "position": "fixed",
            "top": "0",
            "left": "0",
            "width": "100%",
            "height": `${window.innerHeight}px`,
            "z-index": "2147483647",
            "background-color": "rgba(0,0,0,0.5)"
        };
        var innerlayStyles = {
            "font-size": "small",
            "margin-left": "auto",
            "margin-right": "auto",
            "padding": smallify ? "8px" : "32px",
            "background-color": "whitesmoke",
            "position": "relative",
            "top": smallify ? "10%" : "5%",
            "width": smallify ? "95%" : "50%",
            "height": smallify ? "80%" : "90%",
            "overflow": "scroll",
            "border": "1px solid black",
            "display": "flex",
            "flex-direction": "column",
            "justify-content": "space-between"
        };
        var innerInnerlayStyles = {
            "font-size": "small",
            "margin-left": "auto",
            "margin-right": "auto",
            "padding": smallify ? "8px" : "32px",
            "background-color": "whitesmoke",
            "top": smallify ? "10%" : "5%",
            "width": "100%",
            "height": smallify ? "80%" : "90%",
            "border": "1px solid black"
        };
        var buttonDivStyles = {
            "width": "100%",
            "display": "flex"
        };
        var buttonStyles = {
            "width": "50%",
            "margin": "auto",
            "min-height": "30px"
        };
        overlay = _WF.utils.createElement(
            `<div id="${overlayid}" style="${s2s(overlayStyles)}">
                <div style="${s2s(innerlayStyles)}">
                    <textArea id="share-text" style="${s2s(innerInnerlayStyles)}" readonly>${output}</textArea>
                    <div style="${s2s(buttonDivStyles)}">
                    <button style="${s2s(buttonStyles)}" id="share-copy">Copy</button>
                    <button style="${s2s(buttonStyles)}" id="share-exit">Exit</button>
                    </div>
                </div>
            </div>`
        );
        overlay.onclick = function() {
            close(overlay);
        };
        document.body.appendChild(overlay);
        overlay.firstElementChild.onclick = function(e) {
            e.stopPropagation();
            e.preventDefault();
        };
        document.getElementById("share-copy").onclick = function(e) {
            document.getElementById("share-text").select();
            navigator.clipboard.writeText(output).then(
                function(success) {},
                function(fail) {
                    document.execCommand('copy');
                });
            alert("Url Copied!");
        };
        document.getElementById("share-exit").onclick = function(e) {
            close(overlay);
        };
    }

    let getAllAbActiveTests = function() {
        let dump = _WF.cache.dump();
        let map = [];
        Object.keys(dump).forEach(val => {
            if (val.indexOf("ab_active") > -1) {
                let test = val.split(":")[1];
                map[test] = dump[val];
            }
        });
        return map;
    };
    let allAbActives = getAllAbActiveTests();
    let abDebug = buildABDebug(allAbActives);
    buildURL(abDebug);
})();