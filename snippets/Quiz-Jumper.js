/*Jump between quiz slides while persisting search params*/
(() => {
    function setLS(key, value) {
        localStorage[key] = value;
    }

    function setBucket(pageNumber) {
        const prefix = "hmk_quiz";
        let postId = _WF.cache.getItem(_WF.KEYS.POSTID),
            attemptedKey = `${prefix}_attempted:${postId}`,
            /* [0]; */
            resultsKey = `${prefix}_bucket_results:${postId}`,
            attempted = pageNumber - 2;
        /* ["[0,0,0,0]"]; */
        if (pageNumber == 0 || pageNumber == 1) {
            attempted = 0;
        }
        setLS(resultsKey, _WF.utils.stringifyJSON([`[${pageNumber}, 0, 0, 0]`]));
        setLS(attemptedKey, _WF.utils.stringifyJSON([attempted]));

        _WF.cache.setItem(_WF.KEYS.QUIZATTEMPTED + ':' + postId, attempted).asPersistent();
        _WF.cache.setItem(_WF.KEYS.QUIZBUCKETRESULTS + ':' + postId, _WF.utils.stringifyJSON([`[${pageNumber}, 0, 0, 0]`])).asPersistent();
        _WF.cache.setItem(_WF.KEYS.PAGENUMBER, pageNumber).asPersistent();
    }

    function navToPage(pageNumber) {
        pageNumber = pageNumber == 0 ? 1 : pageNumber;
        let url = _WF.postContent && _WF.postContent.pages[pageNumber] && _WF.postContent.pages[pageNumber].url || "";
        let search = window.location.search || "";
        if (url.length > 1) window.location.href = url + search;
    }

    function prompt(text) {
        if (document.getElementById("jumpOut")) {
            document.getElementById("jumpOut").remove();
            return false;
        };
        let module = document.createElement("div");
        module.id = "jumpOut";
        module.style = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 9999;";
        module.innerHTML = `<div  style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 320px; height: 225px; background-color: white; border: 1px solid black;">
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 50px; background-color: #f1f1f1; border-bottom: 1px solid black;">
            <div style="position: absolute; top: 50%; left: 55%; transform: translate(-50%, -50%); font-size: 20px; font-weight: bold; width: 100%;">${text}</div>
        </div>
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; height: 100px;">
            <input required type="text" id="pageNumInput" style="position: absolute; top: 0; left: 0; width: 100%; height: 50px; font-size: 20px; text-align: center; border: 1px solid black; border-radius: 5px;">
            <button id="goButton" style="position: absolute; top: 60px; left: 0; width: 100%; height: 50px; font-size: 20px; border: 1px solid black; border-radius: 5px;">Submit</button>
            <button id="exitButton" style="position: absolute; top: 110px; left: 0; width: 100%; height: 50px; font-size: 20px; border: 1px solid black; border-radius: 5px;">Exit</button>
        </div>
    </div>`;
        document.body.appendChild(module);
        return true;
    }

    function addListeners() {
        let button = document.getElementById("goButton");
        button.addEventListener("click", function() {
            let input = document.getElementById("pageNumInput");
            let value = input.value;
            if (value) {
                init(_WF.utils.parseInt(value));
            }
        });
        let module = document.getElementById("jumpOut");
        document.getElementById("exitButton").addEventListener("click", function(e) {
            module.remove();
        });
    }

    function init(pageNumber) {
        let postPages = _WF.postContent && _WF.postContent.pages || {},
            totalSlides = Object.keys(postPages).length;
        if (pageNumber || pageNumber == 0) {
            if (pageNumber > totalSlides) {
                pageNumber = totalSlides;
            } else if (pageNumber < 1) {
                pageNumber = 0;
            }
            setBucket(pageNumber);
            navToPage(pageNumber);
        }
    }
    if (_WF.utils.isQuizPost() && prompt("Enter slide number to jump to:")) {
        addListeners();
    }
})();