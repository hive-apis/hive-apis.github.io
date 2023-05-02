/* Clears local storage and all UTMs, putting the user into an organic session */
(function() {
    if (typeof(_WF) !== 'undefined') {
        const log = localStorage.hmk_logging;
        localStorage.clear();
        if (log) {
            localStorage.hmk_logging = log;
        }
        localStorage.hmk_apis_is_logging = 'h';
        document.location = document.location.protocol + "//" + document.location.host + document.location.pathname;
    }
})();