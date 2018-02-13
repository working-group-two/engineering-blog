document.querySelector(".mobile-menu-trigger").addEventListener("click", function(e) {
    e.stopPropagation();
    document.querySelector(".nav-menu").classList.toggle("open");
});

["click", "touchend"].forEach(function(eventType) {
    document.body.addEventListener(eventType, function(e) {
        document.querySelector(".nav-menu").classList.remove("open")
    });
});
