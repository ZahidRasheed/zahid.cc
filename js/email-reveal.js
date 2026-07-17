(function () {
    "use strict";

    var HOLD_MS = 1200;

    function decodeEmail(encoded) {
        try {
            return atob(encoded);
        } catch (e) {
            return "";
        }
    }

    function initEmailReveal(el) {
        var email = decodeEmail(el.getAttribute("data-email-reveal"));
        if (!email) {
            return;
        }

        var maskEl = el.querySelector(".email-reveal__mask");
        var timer = null;
        var holding = false;
        var revealed = false;

        function revealEmail() {
            revealed = true;
            holding = false;
            window.clearTimeout(timer);
            maskEl.textContent = email;
            el.classList.remove("is-holding");
            el.classList.add("is-revealed");
            el.setAttribute("aria-label", "Email address: " + email);
        }

        function startHold() {
            if (revealed || holding) {
                return;
            }
            holding = true;
            el.classList.add("is-holding");
            timer = window.setTimeout(function () {
                if (holding) {
                    revealEmail();
                }
            }, HOLD_MS);
        }

        function endHold() {
            if (revealed) {
                return;
            }
            holding = false;
            window.clearTimeout(timer);
            el.classList.remove("is-holding");
        }

        el.addEventListener("mousedown", function (e) {
            if (revealed) {
                return;
            }
            e.preventDefault();
            startHold();
        });
        el.addEventListener("touchstart", function () {
            if (!revealed) {
                startHold();
            }
        }, {passive: true});
        el.addEventListener("mouseup", endHold);
        el.addEventListener("mouseleave", endHold);
        el.addEventListener("touchend", endHold);
        el.addEventListener("touchcancel", endHold);
        el.addEventListener("keydown", function (e) {
            if (revealed) {
                return;
            }
            if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                startHold();
            }
        });
        el.addEventListener("keyup", function (e) {
            if (e.key === " " || e.key === "Enter") {
                endHold();
            }
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        var nodes = document.querySelectorAll("[data-email-reveal]");
        for (var i = 0; i < nodes.length; i++) {
            initEmailReveal(nodes[i]);
        }
    });
})();
