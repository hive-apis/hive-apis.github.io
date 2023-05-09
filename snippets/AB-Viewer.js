/* Outputs all AB test states on current page */
function s2s(o) {
    return Object.keys(o).map(function(k) {
        return `${k}:${o[k]}`;
    }).join(`;`);
}

function close(overlay) {
    document.body.style.overflow = "";
    overlay.parentElement.removeChild(overlay);
}

function render(overlayid) {
    document.body.style.overflow = "hidden";
    const smallify = _WF.utils.isDesktop() ? 0 : 1;
    const lineStyles = {
        "color": "darkgrey",
        "display": "block",
        "border": "1px solid transparent"
    };
    const keyStyles = {
        "color": "chocolate"
    };
    const valStyles = {
        "color": "cadetblue"
    };
    const overlayStyles = {
        "position": "fixed",
        "top": "0",
        "left": "0",
        "width": "100%",
        "height": `${window.innerHeight}px`,
        "z-index": "2147483647",
        "background-color": "rgba(0,0,0,0.5)",
        "display": "flex",
        "flex-direction": "column"
    };
    const innerlayStyles = {
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
    const filterStyles = {
        "width": "100%"
    };
    const viewStyles = {
        "overflow": "scroll",
        "position": "relative",
        "width": "100%",
        "height": "94%",
        "padding": "0px"
    };
    const inputStyles = {
        "border": "1px solid black",
        "background-color": "lightblue",
        "display": "flex",
        "flex-grow": "1",
        "width": "100%",
        "padding": "5px",
    };
    const labelStyles = {
        "margin": "auto 5px",
        "font-weight": "bold",
        "user-select": "none",
        "padding": "5px",
        "padding-left": "0px"
    };
    const toolTipStyles = s2s({
        "position": "absolute",
        "top": "50%",
        "left": "50%",
        "transform": "translate(-50%, -50%)",
        "background-color": "black",
        "color": "white",
        "padding": "10px",
        "border-radius": "5px",
        "border": "1px solid white",
        "z-index": "2147483647"
    });
    const dump = _WF.cache.dump();
    const output = Object.keys(dump).filter(function(key) {
        return key.indexOf("ab_active") == 0;
    }).map(function(test) {
        const [, name] = test.split(`:`);
        return [name, dump[test]];
    }).sort().reduce(function(out, treatment) {
        const [name, value] = treatment;
        let ls = lineStyles,
            ks = keyStyles,
            vs = valStyles,
            active = "active";
        if (value == "none" || ~value.indexOf("control")) {
            ks = {}, vs = {}, active = "inactive";
        }
        out.push(`<li class="view-item ${active}" style="${s2s(ls)}">{ <span style="${s2s(ks)}">${name}</span> : <span style="${s2s(vs)}">${value}</span> }</li>`);
        return out;
    }, []).join(``);
    const overlay = _WF.utils.createElement(`<div id="${overlayid}" style="${s2s(overlayStyles)}">
                                        <div style="${s2s(innerlayStyles)}">
                                            <div id="view-filter" style="${s2s(filterStyles)}">
                                                <input id="view-input" style="${s2s(inputStyles)}" type="text" placeholder="Filter..." onkeyup="filterView()" autofocus></input>
                                                <div style="display: flex; flex-direction: row;">
                                                    <label style="${s2s(labelStyles)}" for="view-cb-active">Active: </label>
                                                    <input name="view-cb-active" id="view-cb-active" type="checkbox" checked onclick="filterView()">
                                                    <label style="${s2s(labelStyles)}" for="view-cb-inactive">Inactive: </label>
                                                    <input name="view-cb-inactive" id="view-cb-inactive" type="checkbox" onclick="filterView()">
                                                    <label style="${s2s(labelStyles)}" for="view-cb-copy">Toggle Copy: </label>
                                                    <input name="view-cb-copy" id="view-cb-copy" type="checkbox">
                                                </div>
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
    };
    const toggleCopy = document.getElementById("view-cb-copy");
    toggleCopy.addEventListener("click", (e) => {
        copyHandler(overlay, toggleCopy.checked, toolTipStyles);
    });

    addCopyTooltip(overlay, toolTipStyles);

    filterView();
}

function init() {
    const overlayid = "ab_spy_overlay";
    const overlay = document.getElementById(overlayid);
    if (overlay) {
        close(overlay);
        return;
    } else {
        render(overlayid);
    }
}

function filterView() {
    const input = document.getElementById('view-input'),
        filter = input.value.toUpperCase(),
        output = document.getElementById('view-output'),
        items = output.getElementsByClassName("view-item"),
        active = document.getElementById('view-cb-active'),
        inactive = document.getElementById('view-cb-inactive');

    for (const item of items) {
        const txtValue = item.innerText || "";
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            if (active.checked && item.classList.contains("active") || inactive.checked && item.classList.contains("inactive")) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        } else {
            item.style.display = "none";
        }
    }
}

function addCopyTooltip(overlay, toolTipStyles) {
    /* when view-cb-copy is hovered, add tool tip message */
    const copyCheckbox = document.getElementById("view-cb-copy");
    const message = document.createElement("div");
    message.innerText = "Click to toggle copy to clipboard on click";
    message.style = toolTipStyles;
    copyCheckbox.onmouseover = () => {
        overlay.appendChild(message);
        setTimeout(function() {
            if (overlay.contains(message)) {
                overlay.removeChild(message);
            }
        }, 4000);
    };

    copyCheckbox.onmouseleave = () => {
        setTimeout(function() {
            if (overlay.contains(message)) {
                overlay.removeChild(message);
            }
        }, 200);
    }

}


function copyHandler(overlay, checked, toolTipStyles) {
    const viewItems = document.querySelectorAll(".view-item");
    for (const item of viewItems) {
        item.onmouseover = () => {
            item.style.border = !checked ? "1px solid transparent" : "1px solid red";
        };
        item.onmouseleave = () => {
            item.style.border = "1px solid transparent";
        };
        item.onclick = !checked ? undefined : (e) => {
            e.stopPropagation();
            e.preventDefault();
            const text = item.innerText;
            const input = document.createElement("input");
            input.value = text;
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            /*display "text copied" message for 1 second after click*/
            const message = document.createElement("div");
            message.innerText = "Text copied to clipboard";
            message.style = toolTipStyles;
            overlay.appendChild(message);
            setTimeout(function() {
                overlay.removeChild(message);
            }, 800);

            document.body.removeChild(input);
        };
    }
}

init();