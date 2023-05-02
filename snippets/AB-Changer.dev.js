//Set/Modify AB tests that do not exist in the AB portal
function MyPrompt() {
    return new Promise((resolve, reject) => {
        let dialog = document.createElement("dialog");
        dialog.setAttribute("id", "dialog");
        dialog.innerHTML = `
          <form>
            <label for="ptext">AB Test Name:</label>
            <input class="text_input" type="text" required value="${localStorage.abDebug ? localStorage.abDebug : ''}" onclick="this.select()"/>
            <br>
            <label for="ptext">AB Test Value(s):</label>
            <input class="text_input" type="text"/>
            <br>
            <button type="submit">Save</button>
            <button style="margin-left:10px"; type="button" onclick="(function(){document.getElementById('dialog').remove();})();")>Exit</button>
          </form>`;
        document.body.appendChild(dialog);
        dialog.showModal();
        dialog.querySelector("form").addEventListener("submit", (e) => {
            e.preventDefault();
            dialog.remove();
            var inputs = dialog.getElementsByClassName("text_input"),
                names = [].map.call(inputs, function(input) {
                    return input.value;
                });
            resolve(names);
        });
    });
}
(async function() {
    var newAB = await MyPrompt();
    var setAB = function(values) {
        localStorage.abDebug = values[0];
        _WF.cache
            .setItem(_WF.KEYS.TAGMAN_PREFIX + values[0], values[1], true)
            .asPersistent();
        location.reload();
    };
    setAB(newAB);
})();