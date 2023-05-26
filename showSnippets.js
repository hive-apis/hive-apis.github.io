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
            span = document.createElement("span"),
            img = document.createElement("img");
        let cleanName = name.replace(".dev", "");
        cleanName = cleanName.replace(".js", "");
        cleanName = cleanName.replace(/-/g, " ");
        a.innerHTML = `${cleanName}`;
        span.innerHTML = `${manifestObj[name]}`;
        li.appendChild(a);
        li.appendChild(span);
        li.appendChild(img);
        li.addEventListener("click", () => {
            img.setAttribute("src", `./demo/${cleanName}.gif`);
            span.classList.toggle("show");
            img.classList.toggle("show");
            a.classList.toggle("selected");
            img.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
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