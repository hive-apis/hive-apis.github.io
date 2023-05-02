/* Quickly navigate from one site to another by searching for a site's abbreviation or part of it */
function displaySites(sites, checked) {
    var buildStyles = function(styles) {
        return Object.keys(styles).map(function(style) {
            return style + ":" + styles[style];
        }).join(";");
    };

    var addSites = function(site = "") {
        var inner = document.getElementById("input");
        var br = document.getElementsByClassName("paramInput")[0];
        var input = _WF.utils.createElement(
            '<input class="siteList" style="width:100%; cursor:pointer; padding:10px;" value="' + site + '" readonly></input>' +
            '<br>'
        );
        input.addEventListener("click", (evt) => {
            if (checked) {
                window.open(evt.target.value);
            } else {
                location.href = evt.target.value;
            }
        });

        if (br != undefined) {
            inner.appendChild(_WF.utils.createElement("<br>"));
        }
        inner.appendChild(input);
    };

    var createOverlay = function() {
        var overlay = getOverlay;
        document.body.style.overflow = "hidden";
        var isM = _WF.utils.isDesktop() ? 0 : 1;
        var overlayStlyes = { position: "fixed", top: "0", left: "0", width: "100%", height: window.innerHeight + "px", "z-index": "2147483647", "background-color": "rgba(0,0,0,0.5)" };
        var innerStlyes = { "font-size": "small", "margin-left": "auto", "margin-right": "auto", padding: isM ? "8px" : "32px", "background-color": "whitesmoke", position: "relative", top: isM ? "10%" : "5%", width: isM ? "95%" : "50%", height: isM ? "80%" : "90%", overflow: "scroll", border: "1px solid black" };

        var css = 'input.siteList:hover{ background-color: #00ff00 }';
        var style = document.createElement('style');

        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        document.getElementsByTagName('head')[0].appendChild(style);
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

        sites.forEach(site => {
            addSites(site);
        });

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
}

async function MyPrompt() {
    return new Promise((resolve, reject) => {
        let dialog = document.createElement("dialog");
        dialog.setAttribute("id", "dialog");
        dialog.innerHTML = `
          <form>
            <label for="abrText">Site Abbreviation:</label>
            <br>
            <input id=abrText type="text" autofocus>
            <br>
            <button type="submit">Go</button>
            <button style="margin-left:10px"; type="button" onclick="(function(){document.getElementById('dialog').remove();})();")>Exit</button>
            <br>
            <label for="newWindow">Open in new window </label>
            <input id="newWindow" type="checkbox">
          </form>`;
        document.body.appendChild(dialog);
        dialog.showModal();
        dialog.querySelector("form").addEventListener("submit", (e) => {
            e.preventDefault();
            let checked = document.getElementById("newWindow").checked;
            let input = document.getElementById("abrText").value;
            dialog.remove();
            resolve({ abbrv: input, checked: checked });
        });
    });
}

(async function() {

    const sitesArr = [{
            site: "https://www.hooch.net",
            abbreviation: "hn",
        },
        {
            site: "https://www.trend-chaser.com",
            abbreviation: "tc",
        },
        {
            site: "https://www.desafiomundial.com",
            abbreviation: "dm",
        },
        {
            site: "https://www.idolator.com",
            abbreviation: "id",
        },
        {
            site: "https://www.giveitlove.com",
            abbreviation: "gl",
        },
        {
            site: "https://www.buzznet.com",
            abbreviation: "bn",
        },
        {
            site: "https://www.postfun.com",
            abbreviation: "pu",
        },
        {
            site: "https://www.pastfactory.com",
            abbreviation: "pa",
        },
        {
            site: "https://www.dadpatrol.com",
            abbreviation: "dp",
        },
        {
            site: "https://www.tacorelish.com",
            abbreviation: "tr",
        },
        {
            site: "https://www.moneypop.com",
            abbreviation: "mp",
        },
        {
            site: "https://www.healthygem.com",
            abbreviation: "hg",
        },
        {
            site: "https://www.quizscape.com",
            abbreviation: "qs",
        },
        {
            site: "https://www.bleacherbreaker.com",
            abbreviation: "bb",
        },
        {
            site: "https://www.purevolume.com",
            abbreviation: "pv",
        },
        {
            site: "https://www.gamedaynews.com",
            abbreviation: "gn",
        },
        {
            site: "https://www.bavardist.com",
            abbreviation: "bv",
        },
        {
            site: "https://www.themystique.com",
            abbreviation: "my",
        },
        {
            site: "https://www.brakeforit.com",
            abbreviation: "bi",
        },
        {
            site: "https://www.lifestylelatino.com",
            abbreviation: "ll",
        },
        {
            site: "https://www.vidabrilhante.com",
            abbreviation: "vb",
        },
        {
            site: "https://www.thisiswhyimsingle.com",
            abbreviation: "ts",
        },
        {
            site: "https://www.factable.com",
            abbreviation: "fa",
        },
        {
            site: "https://www.exploredplanet.com",
            abbreviation: "ep",
        },
        {
            site: "https://www.dailyfunny.com",
            abbreviation: "df",
        },
        {
            site: "https://www.japacrunch.com",
            abbreviation: "jp",
        },
        {
            site: "https://www.decoist.com",
            abbreviation: "dc",
        },
        {
            site: "https://www.exploredhistory.com",
            abbreviation: "eh",
        },
        {
            site: "https://www.cuteemergency.com",
            abbreviation: "ce",
        },
        {
            site: "https://www.editorchoice.com",
            abbreviation: "ec",
        },
        {
            site: "https://www.manmadediy.com",
            abbreviation: "mm",
        },
        {
            site: "https://www.thecouplething.com",
            abbreviation: "co",
        },
        {
            site: "https://www.bngcomedy.com",
            abbreviation: "bc",
        },
        {
            site: "https://www.lvtimes.com",
            abbreviation: "lv",
        },
        {
            site: "https://www.modernhomelife.com",
            abbreviation: "ml",
        },
        {
            site: "https://www.hareal.com",
            abbreviation: "hr",
        },
        {
            site: "https://www.abandonedspaces.com",
            abbreviation: "as",
        },
        {
            site: "https://www.outdoorrevival.com",
            abbreviation: "or",
        },
        {
            site: "https://www.tankroar.com",
            abbreviation: "to",
        },
        {
            site: "https://www.ilovewwiiplanes.com",
            abbreviation: "ip",
        },
        {
            site: "https://www.warhistoryonline.com",
            abbreviation: "who",
        },
        {
            site: "https://www.thevintagenews.com",
            abbreviation: "tvn",
        },
        {
            site: "https://www.higherperspectives.com",
            abbreviation: "hp",
        },
        {
            site: "https://www.slowrobot.com",
            abbreviation: "sr",
        },
        {
            site: "https://www.iwastesomuchtime.com",
            abbreviation: "iwsmt",
        },
    ];

    var abbrv, checked;
    var getDialog = document.getElementById("dialog");
    var getOverlay = document.getElementById("param__overlay");

    if (getOverlay || getDialog) {
        var y = getOverlay || getDialog;
        document.body.style.overflow = "";
        y.parentElement.removeChild(y);
    } else {
        const res = await MyPrompt();
        abbrv = res.abbrv;
        checked = res.checked;

        const sites = [];
        let found = false;
        sitesArr.forEach((site) => {
            if (abbrv && site.abbreviation == abbrv.toLowerCase()) {
                if (checked) {
                    window.open(site.site);
                } else {
                    location.href = site.site;
                }
                found = true;
                return;
            } else if (abbrv && String(site.abbreviation).indexOf(abbrv.toLowerCase()) !== -1) {
                sites.push(site.site);
            } else if (abbrv == "") {
                sites.push(site.site);
            }
        });
        if (sites.length > 0) {
            if (typeof(_WF) !== "undefined") {
                if (sites.length === 1) {
                    if (checked) {
                        window.open(sites[0]);
                    } else {
                        location.href = sites[0];
                    }
                } else {
                    displaySites(sites, checked);
                }
            } else {
                alert("Exact match not found.");
            }
        } else if (!found) {
            alert("No results found.");
        }
    }
})();