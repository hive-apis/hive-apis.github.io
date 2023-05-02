// Set/Update Location with cookies
function MyPrompt() {
    return new Promise((resolve, reject) => {
        let dialog = document.createElement("dialog");
        dialog.setAttribute("id", "dialog");
        dialog.innerHTML = `
<form>
    <label for="newUtmSource">UTM Source:</label>
    <input class="text_input" type="text" value="" style="border:1px solid black" id="newUtmSource"/>
    <br>
    <label for="newGeo">GEO (us || de || jp):</label>
    <input class="text_input" type="text" value="" style="border:1px solid black" id="newGeo" required/>
    <br>
    <label for="newState">State:</label>
    <input class="text_input" type="text" value="CA" style="border:1px solid black" id="newState"/>
    <br>
    <label for="shouldSetLiveramp">Set Liveramp </label>
    <input class="radio_input" type="Checkbox" id="shouldSetLiveramp" />
    <br>
    <label for="shouldSetQuantcast">Set Quantcast </label>
    <input class="radio_input" type="Checkbox" id="shouldSetQuantcast"/>
    <br>
    <label for="shouldEnableLogging">Enable console logging </label>
    <input class="radio_input" type="Checkbox" id="shouldEnableLogging"/>
    <br>
    <label for="shouldClearLocalStorage">Clear localStorage </label>
    <input class="radio_input" type="Checkbox" id="shouldClearLocalStorage" checked/>
    <br>
    <label for="shouldReload">Reload page on submit </label>
    <input class="radio_input" type="Checkbox" id="shouldReload" checked/>
    <br>
    <br>
    <button type="submit">Submit</button>
    <button style="margin-left:10px"; type="button" onclick="(function(){document.getElementById('dialog').remove();})();")>Exit</button>
</form>`;
        document.body.appendChild(dialog);
        dialog.showModal();
        dialog.querySelector("form").addEventListener("submit", (e) => {
            e.preventDefault();
            dialog.remove();
            var inputs = {};
            [...dialog.querySelectorAll("input")].forEach(input => inputs[input.id] = (input.type == "text" ? input.value : input.checked));
            resolve(inputs);
        });
    });
}
(async function() {
    var newSettings = await MyPrompt();

    function qaLog(msg, obj) {
        obj = obj || '';
        console.log('QA> ', msg, obj);
    }

    function enableLogging() {
        localStorage.hmk_logging = "*";
    }

    function rebuildUrl(url) {
        document.location = url;
    }
    var updateSettings = function(newSettings) {
        if (newSettings.shouldClearLocalStorage) {
            localStorage.clear();
        }
        if (newSettings.newGeo) {
            if (newSettings.newState) {
                setGeo(newSettings.newGeo.toLowerCase(), newSettings.newState);
            } else {
                setGeo(newSettings.newGeo.toLowerCase());
            }
        }
        if (newSettings.shouldEnableLogging) {
            setTimeout(enableLogging, 100);
        }
        if (newSettings.shouldReload) {
            var url = document.location.protocol + "//" + document.location.host + document.location.pathname;
            if (newSettings.newUtmSource) {
                url += "?utm_source=" + newSettings.newUtmSource + "&utm_campaign=qa";
            } else {
                url += document.location.search;
            }
            if (newSettings.shouldSetLiveramp) {
                url += "&cmp_ab=liveramp";
            } else if (newSettings.shouldSetQuantcast) {
                url += "&cmp_ab=quantcast";
            }
            setTimeout(function() { rebuildUrl(url) }, 200);
        } else {
            if (newSettings.newUtmSource) {
                _WF.cache.setItem(_WF.KEYS.UTMSOURCE, newSettings.newUtmSource).asPersistent();
                _WF.cache.setItem(_WF.KEYS.UTMCAMPAIGN, "qa").asPersistent();
            }
            if (newSettings.shouldSetLiveramp) {
                _WF.cache.setItem(_WF.KEYS.TAGMAN_PREFIX + "cmp_ab", "liveramp", true).asPersistent()
            } else if (newSettings.shouldSetQuantcast) {
                _WF.cache.setItem(_WF.KEYS.TAGMAN_PREFIX + "cmp_ab", "quantcast", true).asPersistent()
            }
        }
    };

    function setGeo(geo, state) {
        const loc = {
            us: {
                city: 'SANDIEGO',
                country_code: 'US',
                country_name: '00',
                ip: '0.0.0.0',
                latitude: 0,
                longitude: 0,
                metro_code: 825,
                region_code: 'CA',
                region_name: '00',
                time_zone: '00',
                zip_code: '92101'
            },
            de: {
                city: 'NURNBERG',
                country_code: 'DE',
                country_name: '00',
                ip: '0.0.0.0',
                latitude: 0,
                longitude: 0,
                metro_code: 0,
                region_code: 'BY',
                region_name: '00',
                time_zone: '00',
                zip_code: '00000'
            },
            jp: {
                city: 'TOKYO',
                country_code: 'JP',
                country_name: '00',
                ip: '0.0.0.0',
                latitude: 0,
                longitude: 0,
                metro_code: 0,
                region_code: 'JP',
                region_name: '00',
                time_zone: '00',
                zip_code: '00000'
            }
        };
        if (state) {
            loc[geo].region_code = state.toUpperCase();
        }
        const locationInfo = loc[geo] || loc["us"];
        const locationString = `cityCode=${locationInfo.city}; zipCode=${locationInfo.zip_code}; metroCode=${locationInfo.metro_code}; regionCode=${locationInfo.region_code}; countryCode=${locationInfo.country_code}`;
        const locationSegments = locationString.split("; ");
        const locationPairs = locationSegments.map(str => str.split("="));
        locationPairs.forEach(([k, v]) => _WF.cookieStore.removeItem(k));
        locationPairs.forEach(([k, v]) => _WF.cookieStore.setItem(k, v));
        delete localStorage.gdprDisplayed;
        _WF.cache.removeItem('hmk_cmp_result');
        locationInfo != loc[geo] ? qaLog("Invalid GEO, using US") : qaLog('set loc>', loc[geo]);
    }
    updateSettings(newSettings);
})();