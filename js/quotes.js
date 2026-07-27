(function ($) {
    "use strict";

    var QUOTES = [
        { text: "If you ask the grass, the zebra is the monster and the lion is the protector", author: "Anonymous" },
        { text: "You may hate gravity, but gravity doesn't care", author: "Clayton M. Christensen" },
        { text: "Any person capable of angering you becomes your master", author: "Epictetus" },
        { text: "There is only one way to happiness and that is to cease worrying about things which are beyond the power of our will.", author: "Epictetus" },
        { text: "Life is a journey to be experienced, not a problem to be solved.", author: "Final Words of the Wood" },
        { text: "Was it one of those days when everything was going to be 'all right'?", author: "Small Smackerel" },
        { text: "I'm telling you. People come and go. Some say they'll be there, and then they're not.", author: "Eeyore" },
        { text: "If you can't find the sunshine, be the sunshine.", author: "Unknown" },
        { text: "Some people are worth melting for.", author: "Olaf (Frozen)" },
        { text: "It's okay to be grumpy sometimes, as long as you aren't mean.", author: "Oscar the Grouch" },
        { text: "If you're looking for a helping hand, you'll find one at the end of your arm.", author: "Muppet Wisdom" },
        { text: "Dream as if you'll live forever. Live as if you'll die today.", author: "James Dean" },
        { text: "If you have good thoughts, they will shine out of your face like sunbeams and you will always look lovely.", author: "Roald Dahl" },
        { text: "A person's a person, no matter how small.", author: "Dr. Seuss" },
        { text: "You can't go back and change the beginning, but you can start where you are and change the ending.", author: "C.S. Lewis" },
        { text: "People will forget what you said, people will forget what you did, but people will never forget how you made them feel.", author: "Maya Angelou" },
        { text: "Keep your face always toward the sunshine, and shadows will fall behind you.", author: "Walt Whitman" },
        { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
        { text: "We are all stories in the end. Just make it a good one, eh?", author: "The Doctor" },
        { text: "Life moves pretty fast. If you don't stop and look around once in a while, you could miss it.", author: "Ferris Bueller" },
        { text: "Not all treasure is silver and gold, mate.", author: "Jack Sparrow" },
        { text: "There is some good in this world, and it's worth fighting for.", author: "Samwise Gamgee" },
        { text: "All we have to decide is what to do with the time that is given us.", author: "Gandalf" },
        { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
        { text: "Just keep swimming.", author: "Dory (Finding Nemo)" },
        { text: "Always be yourself. Unless you can be a Muppet. Then always be a Muppet.", author: "Miss Piggy" },
        { text: "The two most important days in your life are the day you are born and the day you find out why.", author: "Mark Twain" },
        { text: "Do one thing every day that scares you.", author: "Eleanor Roosevelt" },
        { text: "If you're going through hell, keep going.", author: "Winston Churchill" },
        { text: "Nothing is a line. Everything everywhere is always moving forever. Get used to it.", author: "Logan (Succession)" }
    ];

    function shuffle(list) {
        var items = list.slice();
        for (var i = items.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = items[i];
            items[i] = items[j];
            items[j] = temp;
        }
        return items;
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function applyThemeAccent() {
        var accent = getComputedStyle(document.documentElement).getPropertyValue("--theme-primary").trim();
        if (!accent) {
            accent = $("#loading").css("background-color");
        }
        if (!accent || accent === "rgba(0, 0, 0, 0)" || accent === "transparent") {
            accent = $(".btn.waves-effect").first().css("background-color") || "#1976D2";
        }
        document.documentElement.style.setProperty("--quotes-accent", accent);
    }

    function renderSlides($wrapper, quotes) {
        var html = "";
        for (var i = 0; i < quotes.length; i++) {
            html +=
                '<div class="swiper-slide">' +
                    '<blockquote class="quotes-blockquote">' +
                        '<p>' + escapeHtml(quotes[i].text) + '</p>' +
                        '<cite>&mdash; ' + escapeHtml(quotes[i].author) + '</cite>' +
                    '</blockquote>' +
                '</div>';
        }
        $wrapper.html(html);
    }

    function initQuotesCarousel() {
        var $root = $("#quotes");
        var $wrapper = $("#quotes-wrapper");
        if (!$root.length || !$wrapper.length || typeof Swiper === "undefined") {
            return;
        }

        applyThemeAccent();
        renderSlides($wrapper, shuffle(QUOTES));

        var swiper = new Swiper(".swiper-container-quotes", {
            nextButton: ".quotes-next",
            prevButton: ".quotes-prev",
            loop: true,
            autoHeight: true,
            speed: 700,
            autoplay: 7000,
            autoplayDisableOnInteraction: false,
            a11y: true,
            keyboardControl: true,
            simulateTouch: true
        });

        $root.on("mouseenter focusin", function () {
            if (swiper && swiper.stopAutoplay) {
                swiper.stopAutoplay();
            }
        }).on("mouseleave focusout", function () {
            if (swiper && swiper.startAutoplay) {
                swiper.startAutoplay();
            }
        });
    }

    $(document).on("ready", initQuotesCarousel);
}(jQuery));
