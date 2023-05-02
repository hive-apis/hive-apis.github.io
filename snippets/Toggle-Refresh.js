/* Ability to pause and resume ad refresh on the current page for debugging */
(() => {
    if (!window.hasOwnProperty('apisRefreshSlots')) { window.apisRefreshSlots = _WF.prebid.refreshSlots; }
    if (!window.hasOwnProperty('apisRefreshAllSlots')) { window.apisRefreshAllSlots = _WF.prebid.refreshAllSlots; }
    if (!window.hasOwnProperty('apisRefreshStack')) { window.apisRefreshStack = []; }
    if (!window.hasOwnProperty('apisIsPausedRefresh')) { window.apisIsPausedRefresh = false; }

    function toggleRefresh(isPausedRefresh = false) {
        if (isPausedRefresh) {
            isPausedRefresh = false;
            resumeRefresh();
            alert("Refresh Resumed");
        } else {
            isPausedRefresh = true;
            pauseRefresh();
            alert("Refresh Paused");
        }
        return isPausedRefresh;
    }

    function pauseRefresh() {
        _WF.prebid.refreshSlots = function(divIds, c) {
            apisRefreshStack.push(divIds);
        };
        _WF.prebid.refreshAllSlots = function() {
            const divIds = googletag.pubads().getSlots().map(slot => slot.div);
            _WF.prebid.refreshSlots(divIds);
        };
    }

    function resumeRefresh() {
        const deDuped = [];
        for (queuedRefresh of apisRefreshStack) {
            deDuped.push(...(queuedRefresh.filter(slot => deDuped.indexOf(slot) === -1)));
        }
        apisRefreshStack = [];
        apisRefreshSlots(deDuped);
        _WF.prebid.refreshSlots = apisRefreshSlots;
        _WF.prebid.refreshAllSlots = apisRefreshAllSlots;
    }

    apisIsPausedRefresh = toggleRefresh(apisIsPausedRefresh);
})();