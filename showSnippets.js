const oldManifest = getManifest();
document.body.appendChild(createElement(oldManifest));
const manifest = await fetch("snippets-manifest.json"),
    manifestObj = await manifest.json();
if (JSON.stringify(oldManifest) !== JSON.stringify(manifestObj)) {
    setManifest(manifestObj);
    updateElement(manifestObj);
}

function getManifest() {
    try {
        return JSON.parse(localStorage.getItem("manifest") || {});
    } catch (e) {
        return {};
    }
}

function setManifest(manifestObj) {
    localStorage.setItem("manifest", JSON.stringify(manifestObj));
}

function updateElement(manifestObj) {
    const newObj = createElement(manifestObj);
    document.body.removeChild(document.getElementById("manifest"));
    document.body.appendChild(newObj);
}

function createElement(manifestObj) {
    const manifestNode = document.createElement("ul");
    manifestNode.setAttribute("id", "manifest");

    Object.keys(manifestObj).forEach((name) => {
        const li = document.createElement("li"),
            a = document.createElement("a"),
            span = document.createElement("span");
        a.innerHTML = `${name}`;
        span.innerHTML = `${manifestObj[name]}`;
        li.appendChild(a);
        li.appendChild(span);
        li.addEventListener("click", () => {
            span.classList.toggle("show");
            a.classList.toggle("selected");
        });
        manifestNode.appendChild(li);
    });
    return manifestNode;
}

document.getElementById("switchPage").addEventListener("click", () => {
    setTimeout(() => {
        window.location.href = "/report-a-bug.html";
    }, 500);
});