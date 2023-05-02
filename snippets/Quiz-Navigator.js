/* Navigate through quizzes (start, select answer, next question) while persisting query parameters automatically with a single click */
(() => {
    if (!_WF.utils.isQuizPost()) { return; }
    const button = document.querySelector("[class='button']"),
        newHref = button && button.href ? button.href + window.location.search : '',
        answer = document.querySelector("[class~='answer']");
    if (!button) { return; }
    if (answer) {
        if (answer.classList.contains("aio-click")) {
            button.click();
        } else {
            answer.classList.add("aio-click");
            answer.click();
            button.href = newHref;
        }
    } else {
        button.href = newHref;
        button.click();
    }
})();