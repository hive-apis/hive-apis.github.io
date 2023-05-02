/* Outputs All Providers on Current Page */
function s2s(o) {
    return Object.keys(o).map(function(k) {
        return `${k}:${o[k]}`;
    }).join(`;`);
}

function close(overlay) {
    document.body.style.overflow = "";
    overlay.parentElement.removeChild(overlay);
}

function render(overlay, overlayid) {
    document.body.style.overflow = "hidden";
    var smallify = _WF.utils.isDesktop() ? 0 : 1;
    var lineStyles = {
        "color": "darkgrey",
        "display": "block"
    };
    var keyStyles = {
        "color": "chocolate"
    };
    var valStyles = {
        "color": "cadetblue"
    };
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
        "border": "1px solid black"
    };
    var filterStyles = {
        "height": "5%",
        "width": "100%"
    };
    var viewStyles = {
        "overflow": "scroll",
        "position": "relative",
        "width": "100%",
        "height": "94%"
    };
    var inputStyles = {
        "border": "1px solid black",
        "background-color": "lightblue"
    };

    var providers = _WF.cache.getItem(_WF.KEYS.PROVIDERS);
    var output = [];
    Object.keys(providers).sort().forEach(provider => {
        var ls = lineStyles,
            ks = keyStyles,
            vs = valStyles;
        if (providers[provider] == "none" || providers[provider] == "no filter match") {
            ks = {}, vs = {};
        }
        output.push(`<li class="view-item" style="${s2s(ls)}">{ <span style="${s2s(ks)}">${provider}</span> : <span style="${s2s(vs)}">${providers[provider]}</span> }</li>`);
    });
    output = output.join(``);

    overlay = _WF.utils.createElement(`<div id="${overlayid}" style="${s2s(overlayStyles)}">
                                        <div style="${s2s(innerlayStyles)}">
                                            <div id="view-filter" style="${s2s(filterStyles)}">
                                                <input id="view-input" style="${s2s(inputStyles)}" type="text" placeholder="Filter..." onkeyup="filterView()" autofocus></input>
                                            </div>
                                            <ul id="view-output" style="${s2s(viewStyles)}">
                                                ${output}
                                            </ul>
                                        </div>
                                       </div>`);
    overlay.onclick = function() {
        close(overlay);
    };
    document.body.appendChild(overlay);
    overlay.firstElementChild.onclick = function(e) {
        e.stopPropagation();
        e.preventDefault();
    };
}

function init() {
    var overlayid = "ab_spy_overlay";
    var overlay = document.getElementById(overlayid);
    if (overlay) {
        close(overlay);
        return;
    } else {
        render(overlay, overlayid);
    }
}

function filterView() {
    var input, filter, txtValue, output;
    input = document.getElementById('view-input');
    output = document.getElementById('view-output');
    items = output.getElementsByClassName("view-item");
    filter = input.value.toUpperCase();
    for (let item of items) {
        txtValue = item.innerText || "";
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    }
}

init();