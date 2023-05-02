/* Clears local storage and puts the user into a paid desktop SPL session */
(function() {
    if (typeof(_WF) !== "undefined") {
        let utmSource = _WF.apis_config && _WF.apis_config.snippets_config["desktop_spl_source"] || _WF.SINGLEPAGELAYOUTSOURCES[0] || "fz";
        const log = localStorage.hmk_logging;
        localStorage.clear();
        if (log) {
            localStorage.hmk_logging = log;
        }
        localStorage.hmk_apis_is_logging = 'h';
        document.location = document.location.protocol + "//" + document.location.host + document.location.pathname + `?utm_source=${utmSource}&utm_campaign=qa&utm_content=qa&utm_medium=qa`;
    }
})();