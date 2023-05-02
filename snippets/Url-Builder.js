/* Builds URLs for sharing AB states and layouts with the option to encode/decode them */
(() => {
    let buildUI = function() {
        let overlayid = "build_spy_overlay";
        let overlay = document.getElementById(overlayid);
        if (overlay) {
            close(overlay);
            return;
        } else {
            render(overlayid);
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

    function getStyles() {
        const smallify = _WF.utils.isDesktop() ? 0 : 1;
        let css = `input::placeholder { color: black; }`,
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');
        head.appendChild(style);
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        return {
            overlayStyles: {
                "position": "fixed",
                "top": "0",
                "left": "0",
                "width": "100%",
                "height": `${window.innerHeight}px`,
                "z-index": "2147483647",
                "background-color": "rgba(0,0,0,0.5)"
            },
            innerlayStyles: {
                "font-size": "small",
                "margin-left": "auto",
                "margin-right": "auto",
                "padding": smallify ? "8px" : "32px",
                "background-color": "whitesmoke",
                "overflow": "hidden",
                "position": "relative",
                "top": smallify ? "10%" : "5%",
                "width": smallify ? "95%" : "50%",
                "height": smallify ? "80%" : "90%",
                "border": "1px solid black",
                "display": "flex",
                "flex-direction": "column",
                "justify-content": "space-evenly"
            },
            groupStyles: {
                "margin-left": "auto",
                "margin-right": "auto",
                "overflow-y": "scroll",
                "width": "100%",
                "height": "80%",
                "border": "1px solid black",
                "list-style-type": "none",
                "padding": smallify ? "8px" : "32px"
            },
            inputListStyles: {
                "width": "100%",
                "margin-bottom": "10px",
                "border": "2px solid transparent",
                "display": "inline-flex",
                "align-items": "center"
            },
            inputStyles: {
                "background-color": "whitesmoke",
                "border": "1px solid black",
                "padding": "5px",
                "flex-grow": "1"
            },
            buttonDivsStyles: {
                "width": "100%",
                "display": "flex",
                "justify-content": "space-between",
                "flex-wrap": "wrap",
                "flex-direction": "column"
            },
            divButtonStyles: {
                "display": "flex",
                "flex-grow": "1",
                "width": "100%"
            },
            buttonStyles: {
                "min-height": "40px",
                "padding": "5px"
            },
            selectStyles: {
                "min-height": "30px",
                "padding": "5px",
                "border": "1px solid black",
                "flex-grow": ".5",
                "margin": "5px",
                "max-width": "49%"
            },
            hiddenStyles: {
                "display": "none",
                "text-align": "center",
                "width": "100%",
                "position": "absolute",
                "color": "red",
                "top": "50%",
                "-webkit-text-stroke": "1px black",
                "z-index": "2147483647"
            },
            h1Styles: {
                "margin-bottom": "5px"
            },
            urlTextStyles: {
                "width": "100%",
                "padding": "5px",
                "min-height": "5%",
                "height": "unset",
                "border": "1px solid black"
            },
            growStyles: {
                "flex-grow": "1",
                "margin": "5px"
            }
        };
    }

    function getDecodedSearch(encoded) {
        var qsObject = _WF.utils.processQueryString(encoded) || {},
            decoded = encoded;
        if (qsObject.hasOwnProperty(_WF.KEYS.EXTERNALSHARE)) {
            var externalURI = decodeURI(qsObject[_WF.KEYS.EXTERNALSHARE]) || "",
                n = _WF.cache.getItem(_WF.KEYS.BLOGNAME).length * -1,
                decoded = atob(externalURI);
            decoded = _WF.utils.rot(decoded, n);
        }
        return decoded;
    }

    function getEncodedSearch(input) {
        let search = input || window.location.search,
            encoded,
            encodedSearch = search,
            n = _WF.cache.getItem(_WF.KEYS.BLOGNAME).length,
            res = [];
        if (search.indexOf("?") == 0) {
            encodedSearch = search.split("");
            encodedSearch.shift(); /* remove "?" */
            encodedSearch = encodedSearch.join("");
        }
        if (encodedSearch.indexOf(_WF.KEYS.EXTERNALSHARE) == -1) {
            encodedSearch = encodedSearch.split("&");
            encodedSearch.forEach(val => {
                if (val.split("=")[1] != "1") {
                    res.push(val);
                }
            });
            encodedSearch = res.join("&");
            encoded = _WF.utils.rot(encodedSearch, n);
            if (encoded.length > 0) {
                encodedSearch = `${_WF.KEYS.EXTERNALSHARE}=${btoa(encoded)}`;
            }
        } else {
            encodedSearch;
        }
        return encodedSearch;
    }

    function buildUrl() {
        document.getElementById("build-url-button").click();
    }

    function buildInputBlock(styles, overrides = {}) {
        let override = Object.keys(overrides).length > 0;
        let inputBlock = _WF.utils.createElement(`
            <li ${override ? "class=build-override" : ""} style="${s2s(styles.inputListStyles)}"></li>
        `);

        let testNameListName = !override ? "testNamesList" : "utmList";
        let placeholder = !override ? "Test Name..." : "UTMs";

        let testDatalist = _WF.utils.createElement(`<datalist id="${testNameListName}"></datalist>`);
        let treatmentDatalist = _WF.utils.createElement(`<datalist id=""></datalist>`);

        let testName = _WF.utils.createElement(`<input type="text" list="${testNameListName}" class="build-input-text" style="${s2s(styles.inputStyles)}; max-width: 40%; margin-bottom: unset;" placeholder="${placeholder}"></input>`);
        let treatment = _WF.utils.createElement(`<input type="text" list="" class="build-input-text" style="${s2s(styles.inputStyles)}; max-width: 40%; margin-bottom: unset;" placeholder="Treatments..."></input>`);
        let removeButton = _WF.utils.createElement(`<button class="build_remove_button" style="${s2s(styles.inputStyles)}; max-width: 20%; color: black; font-size: small; margin-left: 15px; min-height: 34px;">Remove</button>`);

        if (override) {
            testName.value = overrides.type;
            /*treatment.value = overrides.value;*/
            let options = ["qa", "tb", "fz", "ft"];
            options.forEach(option => {
                let testOption = _WF.utils.createElement(`<option value="${option}">${option}</option>`);
                treatmentDatalist.appendChild(testOption);
            });
            treatmentDatalist.setAttribute("id", "utmOptions");
            treatment.setAttribute("list", "utmOptions");
            inputBlock.insertBefore(treatmentDatalist, treatment.nextSibling);
        } else {
            let activeTests = _WF.cache.getItem(_WF.KEYS.TAGMAN).ab_allocation.ab_tests;
            const testNames = [];
            activeTests.forEach(testObj => {
                /*Test Data list is the same across all inputs*/
                let testId = testObj.name;
                if (testNames.indexOf(testId) > -1) { /*Duplicate tests*/
                    testId = testObj.name + " ";
                }
                testNames.push(testId);
                let testOption = _WF.utils.createElement(`<option value="${testId}">${testId == testObj.name ? testObj.name : ""}</option>`);
                testDatalist.appendChild(testOption);
                /*Treatment Data list is different depending on which test is selected*/
                treatmentDatalist = _WF.utils.createElement(`<datalist id="${testId}"></datalist>`);
                testObj.groups.forEach(treatObj => {
                    let treatOption = _WF.utils.createElement(`<option value="${treatObj.name}">${treatObj.name}</option>`);
                    treatmentDatalist.appendChild(treatOption);
                });
                inputBlock.insertBefore(treatmentDatalist, treatment.nextSibling);
            });
            inputBlock.insertBefore(testDatalist, testName.nextSibling);
        }
        
        testName.addEventListener("change", (evt) => {
            treatment.setAttribute("list", evt.target.value);
            buildUrl();
        });
        
        testName.addEventListener("keyup", () => {
            buildUrl();
        });

        treatment.addEventListener("keyup", () => {
            buildUrl();
        });

        removeButton.onclick = function removeLine(event) {
            let liElement = event.target.parentElement;
            let liParent = liElement.parentElement;
            liParent.removeChild(liElement);
            buildUrl();
        };
        removeButton.addEventListener('mouseenter', e => {
            let button = e.target;
            button.parentElement.style.border = "2px solid red";
            button.style.cursor = "pointer";
        });
        removeButton.addEventListener('mouseleave', e => {
            let button = e.target;
            button.parentElement.style.border = "2px solid transparent";
            button.style.cursor = "unset";
        });
        inputBlock.insertBefore(removeButton, inputBlock.children[0]);
        inputBlock.insertBefore(treatment, inputBlock.children[0]);
        inputBlock.insertBefore(testName, inputBlock.children[0]);
        return inputBlock;
    }

    function handleSelect(styles) {
        let select = document.getElementById("build-select");
        let options = ["utm_source", "utm_medium", "utm_campaign", "All"];
        let optEl;
        options.forEach(option => {
            optEl = _WF.utils.createElement(`<option>${option}</opiton>`);
            select.appendChild(optEl);
        });
        select.addEventListener('change', e => {
            let group = document.getElementById("build-group");
            let val = e.target.value.toLowerCase();
            switch (val) {
                case "all":
                    options.forEach(option => {
                        if (option != "All") {
                            let overrides = {
                                override: "build-true",
                                type: option,
                                value: "qa"
                            };
                            group.appendChild(buildInputBlock(styles, overrides));
                        }
                    });
                    break;
                default:
                    let overrides = {
                        override: "build-true",
                        type: val,
                        value: "qa"
                    };
                    group.appendChild(buildInputBlock(styles, overrides));
                    break;
            }
            buildUrl();
            select.options[0].selected = true;
        });
    }

    function handleOnClicks(overlay, styles) {
        overlay.firstElementChild.onclick = function(e) {
            e.stopPropagation();
            e.preventDefault();
        };

        document.getElementById("build-copy-button").onclick = function(e) {
            let textArea = document.getElementById("build-url");
            let textAreaValue = textArea.value;
            let url = window.location.origin + window.location.pathname;
            if (textAreaValue.indexOf(url) > -1) {
                url = "";
            }
            textArea.select();
            navigator.clipboard.writeText(`${url}${textAreaValue}`).then(
                function(success) {},
                function(fail) {
                    document.execCommand('copy');
                });
            let copy = document.getElementById("copy-message");
            copy.style.display = "block";
            setTimeout(() => { copy.style.display = "none" }, 2000);
        };

        document.getElementById("build-exit-button").onclick = function(e) {
            close(overlay);
        };

        document.getElementById("build-url-button").onclick = function(e) {
            let ul = document.getElementById("build-group");
            let textArea = document.getElementById("build-url");
            let liElements = ul.getElementsByTagName("li");
            let url = window.location.origin + window.location.pathname;
            let search = "";
            let utms = [];
            let overrideKey = `${_WF.KEYS.ABOVERRIDE}=`;
            let overrides = [];
            for (let el of liElements) {
                let children = el.getElementsByTagName("input");
                let name = children[0].value;
                let treat = children[1].value;
                if (name && treat) {
                    if (el.classList.contains("build-override")) {
                        utms.push(`${name}=${treat}`);
                    } else {
                        overrides.push(`${name}-${treat}`);
                    }
                }
            }
            utms = utms.join("&");
            if (utms.length > 0) { /* utms were added */
                if (overrides.length == 0) { /* no AB overrides */
                    search = utms;
                } else { /* AB overrides */
                    overrides = overrideKey + overrides.join("~");
                    search = `${utms}&${overrides}`;
                }
            } else { /* no utms */
                if (overrides.length === 0) { /* no overrides */
                    search = "";
                } else {
                    overrides = overrideKey + overrides.join("~");
                    search = overrides;
                }
            }
            while (search.length > 0 && (search.lastIndexOf("~") === search.length - 1 || search.lastIndexOf("&") === search.length - 1)) {
                search = search.split("");
                search.pop(); /* remove trailing ~ and & */
                search = search.join("");
            }
            let output = search ? `${url}?${encodeURI(search)}` : url;
            textArea.value = output;
        };

        document.getElementById("build-add").onclick = function(e) {
            buildUrl();
            let group = document.getElementById("build-group");
            let inputBlock = buildInputBlock(styles);
            group.appendChild(inputBlock);
        };

        document.getElementById("build-reload-button").onclick = function(e) {
            let textArea = document.getElementById("build-url");
            let textAreaValue = textArea.value;
            textAreaValue = textAreaValue.split("?");
            if (textAreaValue.length > 1) {
                window.location.search = textAreaValue[textAreaValue.length - 1];
            } else {
                window.location.reload();
            }
        };


        document.getElementById("build-encode-button").onclick = function(e) {
            let textArea = document.getElementById("build-url");
            let textSplit = textArea.value.split("?");
            let search;
            if (textSplit.length > 1) {
                textSplit[1] = getEncodedSearch(textSplit[1]);
                search = textSplit.join("?");
            } else {
                search = textSplit[0];
            }
            textArea.value = search;
        };

        document.getElementById("build-decode-button").onclick = function(e) {
            let textArea = document.getElementById("build-url");
            let textSplit = textArea.value.split("?");
            let search;
            if (textSplit.length > 1) {
                textSplit[1] = getDecodedSearch(textSplit[1]);
                search = textSplit.join("?");
            } else {
                search = textSplit[0];
            }
            textArea.value = search;
        };

    }

    function render(overlayid) {
        document.body.style.overflow = "hidden";
        const styles = getStyles();
        overlay = _WF.utils.createElement(
            `<div id="${overlayid}" style="${s2s(styles.overlayStyles)};">
                <div style="${s2s(styles.innerlayStyles)};">
                    <h1 id="" style="${s2s(styles.h1Styles)};">Url Builder:</h1>
                    <h1 id="copy-message" style="${s2s(styles.hiddenStyles)};">Copied!</h1>
                    <textArea id="build-url" style="${s2s(styles.urlTextStyles)};" rows="10">${window.location.origin + window.location.pathname}</textArea>
                    <ul id="build-group" style="${s2s(styles.groupStyles)};"></ul>
                    <div style="${s2s(styles.buttonDivsStyles)};">
                        <div id="build-add-buttons" class="build-button-div" style="${s2s(styles.divButtonStyles)};">
                            <button style="${s2s(styles.buttonStyles)}; ${s2s(styles.growStyles)};" id="build-add">Add Test</button>
                            <select style="${s2s(styles.selectStyles)};" id="build-select">
                                <option value="" disabled selected>Add UTMs</option>
                            </select>
                        </div>
                        <div id="build-page-buttons" class="build-button-div" style="${s2s(styles.divButtonStyles)};">
                            <button style="${s2s(styles.buttonStyles)}; ${s2s(styles.growStyles)};" id="build-encode-button">Encode Url</button>
                            <button style="${s2s(styles.buttonStyles)}; ${s2s(styles.growStyles)};" id="build-decode-button">Decode Url</button>
                        </div>
                        <div id="build-page-buttons" class="build-button-div" style="${s2s(styles.divButtonStyles)};">
                            <button style="${s2s(styles.buttonStyles)}; ${s2s(styles.growStyles)};" id="build-url-button">Build Url</button>
                            <button style="${s2s(styles.buttonStyles)}; ${s2s(styles.growStyles)};" id="build-copy-button">Copy Link</button>
                            <button style="${s2s(styles.buttonStyles)}; ${s2s(styles.growStyles)};" id="build-reload-button">Reload</button>
                            <button style="${s2s(styles.buttonStyles)}; ${s2s(styles.growStyles)};" id="build-exit-button">Exit</button>
                        </div>
                    </div>
                </div>
            </div>`
        );
        overlay.onclick = function() {
            close(overlay);
        };
        document.body.appendChild(overlay);
        handleOnClicks(overlay, styles);
        handleSelect(styles);
    }

    buildUI();
})();