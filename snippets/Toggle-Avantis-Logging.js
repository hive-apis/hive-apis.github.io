/* Toggles Avantis debug logging */
(function() {
    if (localStorage.getItem('avantis_logging_level') == null) {
        localStorage.setItem('avantis_logging_level', 'debug');
    } else {
        localStorage.removeItem('avantis_logging_level');
    }
    document.location.reload()
})();