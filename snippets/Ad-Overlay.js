/* Displays basic advertisement information below ad units */
    (function(D) {
        function createOverlay(id, info, unfilled) {
            let old = D.getElementById(id + "-smwyg-overlay");
            if (old) { old.parentNode.removeChild(old); }
            const ad = D.getElementById(id);
            if (ad) {
                const overlay = D.createElement("div");
                const unitWrapper = D.getElementById(id + "-wrapper");
                let height = "100%";
                if (unfilled && unitWrapper) {
                    height = unitWrapper.clientHeight + "px ";
                }
                overlay.id = id + "-smwyg-overlay";
                overlay.style.margin = unfilled ? "10px auto 0 " : "0 auto";
                overlay.style.height = height;
                overlay.style.width = "100% ";
                overlay.style.backgroundColor = "aquamarine ";
                overlay.style.textAlign = "center ";
                overlay.style.maxWidth = "fit-content ";
                overlay.innerText = info.join(" |  ");
                ad.appendChild(overlay);
            } else { console.log("QA>", `Unfilled Info: ${info}`); }
        };
        Object.keys(_WF.winners)?.forEach(adUnitCode => {
            const winner = _WF.winners[adUnitCode];
            const overlayVals = [
                adUnitCode,
                winner.bidder,
                "$" + winner.value,
                winner.option ? "cached" : "fresh"
            ];
            if (adUnitCode != winner.sourceadunit) {
                overlayVals.push(`twist: ${winner.sourceadunit}`);
            }
            const unfilled = winner.bidder == "unfilled";
            createOverlay(adUnitCode, overlayVals, unfilled);
        });
    })(document);