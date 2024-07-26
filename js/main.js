const menu = document.querySelector(".fa-bars");
const ul = document.querySelector(".links ul");
const short = document.querySelector("button");
const input = document.querySelector("input");
const url = document.querySelector(".url");
const listUrl = document.querySelector(".shorts");
let arr = [];

menu.addEventListener("click", function() {
    ul.classList.toggle("show");
});

document.addEventListener("click", function(e) {
    if (e.target != menu && e.target != ul) {
        ul.classList.remove("show");
    }
});

function getLocal() {
    if (localStorage.getItem("url")) {
        arr = JSON.parse(localStorage.getItem("url"));
        create(arr);
    }
}

function local(arr) {
    localStorage.setItem("url", JSON.stringify(arr));
}

function create(arr) {
    listUrl.textContent = '';
    for (let i = 0; i < arr.length; i++) {
        const li = document.createElement("li");
        const p = document.createElement("p");
        const button = document.createElement("button");
        button.textContent = "copy";
        p.textContent = arr[i];
        li.appendChild(p);
        li.appendChild(button);
        listUrl.appendChild(li);
    }
    local(arr);
    copyToClipboard();
}

short.addEventListener("click", async function() {
    if (input.value == '') {
        getLocal();
        deleteSpan();
        const span = document.createElement("span");
        span.textContent = "Please add a link";
        styleSpan(span);
        url.appendChild(span);
    } else {
        input.style = `border:none;margin:0;`;
        deleteSpan();
        const regExp = /(https?:\/\/)?(www\.)?(\w)*\.(((\w)*.)?)(\w{2,})(\/(\w)*\/(\w)*-?(\w)*\/?)?/ig;
        if (regExp.test(input.value)) {
            const shortenedURL = await shortenURL(input.value);
            if (shortenedURL) {
                getLocal();
                arr.push(shortenedURL);
                create(arr);
                input.value = '';
            } else {
                const span = document.createElement("span");
                span.textContent = "Failed to shorten the link";
                styleSpan(span);
                url.appendChild(span);
            }
        } else {
            const span = document.createElement("span");
            span.textContent = "Please add a valid link";
            styleSpan(span);
            url.appendChild(span);
        }
    }
});

function styleSpan(sp) {
    sp.style = `color:hsl(0, 87%, 67%); position:absolute; font-size: 10px;top:13px;left: 25%; transform:translate(-80%,56px)`;
    input.style = `border:2px solid hsl(0, 87%, 67%); margin:12px 0;`;
}

function deleteSpan() {
    const span = document.querySelector(".url span");
    if (span != null) {
        span.remove();
    }
}

function copyToClipboard() {
    const copy = document.querySelectorAll(".shorts button");
    copy.forEach(cp => {
        cp.onclick = function() {
            if (!(cp.classList.contains("done"))) {
                copy.forEach(el => {
                    el.classList.remove("done");
                    el.textContent = 'copy';
                });
                const url = this.parentNode;
                const p = url.querySelector("p");
                navigator.clipboard.writeText(p.textContent);
                cp.textContent = 'copied!';
                cp.classList.add("done");
            }
        };
    });
}

async function shortenURL(url) {
    try {
        const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
        if (response.ok) {
            const data = await response.text();
            return data;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

getLocal();
