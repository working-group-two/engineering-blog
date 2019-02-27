document.querySelector(".menu-trigger").addEventListener("click", function (e) {
    document.querySelector(".sidebar").classList.add("open");
});

document.querySelector(".sidebar-overlay").addEventListener("click", function (e) {
    document.querySelector(".sidebar").classList.remove("open");
});

document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        document.querySelector(".sidebar").classList.remove("open");
        setTimeout(() => window.location = e.target.href, 200);
    })
});

function getColor(tag) { // this very silly function is used to get color for tags for blogposts, we should probably hardcode something instead
    let cs = tag.length / 3; // chunk size
    let charValue = {e: 20, t: 63, a: 84, o: 93, i: 101, n: 109, s: 123, r: 128, h: 130, d: 164, l: 172, u: 195, c: 199, m: 201, f: 207, y: 211, w: 212, g: 213, p: 217, b: 224, v: 232, k: 241, x: 252, q: 254, j: 254, z: 255};
    let stringValue = str => str.split("").map(c => (charValue[c] || 150) / str.length).reduce((sum, x) => sum + x, 0); // map to char value (weighted on string length) and sum
    let rgb = [tag.substring(0, cs), tag.substring(cs, cs * 2), tag.substring(cs * 2, cs * 3)].map(stringValue); // split string in 3 and map to string value
    let strong = rgb.indexOf(Math.max.apply(Math, rgb));
    let weak = rgb.indexOf(Math.min.apply(Math, rgb));
    let medium = [0, 1, 2].find(it => it !== strong && it !== weak);
    while (rgb[strong] < 210) rgb[strong]++; // the strong get stronger
    while (rgb[weak] > 80) rgb[weak] /= 2; // the weak get weaker
    if (tag.length % 2 === 0) {
        while (rgb[medium] > 90) rgb[medium] /= 2; // the medium can get weaker
    } else {
        while (rgb[medium] < 170) rgb[medium]++; // or stronger, it depends on the mod
    }
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

document.querySelectorAll(".blogpost .tag").forEach(el => {
    let tagName = el.className.substr(4);
    el.style.background = getColor(tagName);
});
