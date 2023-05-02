/* Creates a sharable url that will put users into the same AB Tests currently running on the page set by the AB Portal */
(() => {
    let setQS = function(newQS) {

        let search = document.location.search;
        if (search.length != 0) {
            let split = search.split("?");
            search = split.length > 1 ? split[1] : search;
            let queries = search.split("&");
            queries.forEach((query) => {
                if (query.indexOf("hmab_debug") < 0 && query.indexOf("bucket_id") < 0 && query.length > 0 && query.split("=")[1] != "1") { /*don't add previous debug, empty queries, or advertiser info*/
                    newQS += `&${query}`;
                }
            });
        }
        let url = document.location.origin + document.location.pathname + "?" + newQS;
        navigator.clipboard.writeText(url);
        alert("Shareable URL Copied");
    };
    let getBucketIdQS = function() {
        let bId = localStorage.hmk_bucket_id;
        if (bId.indexOf("[") > -1) {
            bId = JSON.parse(bId)[0];
        }
        return `bucket_id=${bId}`;
    };
    setQS(getBucketIdQS());
})();