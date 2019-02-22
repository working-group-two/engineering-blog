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
