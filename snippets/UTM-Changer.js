//Change UTM Source, enable logging, and clear localStorage
function MyPrompt() {
    return new Promise((resolve, reject) => {
        let dialog = document.createElement("dialog");
        dialog.setAttribute("id", "dialog");
        dialog.innerHTML = `
			<form>
				<label for="ptext">New UTM Source (leave this blank to keep current querystring):</label>
				<input class="text_input" type="text" value="" style="border:1px solid black" id="newUtmSource" />
				<br>
				<label for="shouldEnableLogging">Enable console logging: </label>
				<input class="radio_input" type="Checkbox" id="shouldEnableLogging" />
				<br>
				<label for="shouldClearLocalStorage">Clear localStorage: </label>
				<input class="radio_input" type="Checkbox" id="shouldClearLocalStorage" checked/>
				<br>
				<label for="shouldReload">Reload page on submit: </label>
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
            setTimeout(function() { rebuildUrl(url) }, 200);
        } else {
            if (newSettings.newUtmSource) {
                _WF.cache.setItem(_WF.KEYS.UTMSOURCE, newSettings.newUtmSource).asPersistent();
                _WF.cache.setItem(_WF.KEYS.UTMCAMPAIGN, "qa").asPersistent();
            }
        }
    };
    updateSettings(newSettings);
})();