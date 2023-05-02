/* Adds a background color to the cc_ab overlay */
(function() {
    if (typeof(_WF) !== "undefined") {
        if (_WF.utils.isTesting('cc_ab')) {
            _WF.utils.createDynamicStyleSheet('.primary-ad-widget:before, .secondary-ad-widget:before, #anchored-P1:before {background-color: rgb(0, 51, 0); opacity: .5;}', '');
        }
    }
}());