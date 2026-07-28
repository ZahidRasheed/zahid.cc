(function () {
    "use strict";

    function themeColor() {
        var value = getComputedStyle(document.documentElement)
            .getPropertyValue("--theme-primary")
            .trim();
        return value || "#06A763";
    }

    function visitedMap(list) {
        var map = {};
        for (var i = 0; i < list.length; i++) {
            map[String(list[i].code).toUpperCase()] = list[i].name || list[i].code;
        }
        return map;
    }

    function renderLegend(el, list) {
        if (!el) {
            return;
        }
        var sorted = list.slice().sort(function (a, b) {
            return String(a.name).localeCompare(String(b.name));
        });
        var chips = sorted.map(function (item) {
            return '<li>' + escapeHtml(item.name) + '</li>';
        }).join("");
        el.innerHTML =
            '<p class="travel-count"><strong>' + sorted.length + '</strong> countries visited</p>' +
            '<ul class="travel-chip-list">' + chips + '</ul>';
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function hexToRgba(hex, alpha) {
        var raw = String(hex).replace("#", "");
        if (raw.length === 3) {
            raw = raw[0] + raw[0] + raw[1] + raw[1] + raw[2] + raw[2];
        }
        if (raw.length !== 6) {
            return "rgba(6, 167, 99, " + alpha + ")";
        }
        var r = parseInt(raw.slice(0, 2), 16);
        var g = parseInt(raw.slice(2, 4), 16);
        var b = parseInt(raw.slice(4, 6), 16);
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    }

    function supportsWebGL() {
        try {
            var canvas = document.createElement("canvas");
            return !!(window.WebGLRenderingContext &&
                (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
        } catch (e) {
            return false;
        }
    }

    function initGlobe() {
        var mount = document.getElementById("travel-globe");
        var legend = document.getElementById("travel-legend");
        var countries = window.TRAVEL_COUNTRIES || [];
        renderLegend(legend, countries);

        if (!mount) {
            return;
        }
        if (!supportsWebGL() || typeof Globe === "undefined") {
            mount.innerHTML = '<p class="travel-fallback">Open this page on a WebGL-capable browser to explore the globe.</p>';
            return;
        }

        var visited = visitedMap(countries);
        var accent = themeColor();
        var width = mount.clientWidth || 640;
        var height = Math.max(320, Math.min(460, Math.round(width * 0.72)));

        fetch("data/countries-110m.geojson")
            .then(function (res) {
                if (!res.ok) {
                    throw new Error("Failed to load countries");
                }
                return res.json();
            })
            .then(function (geojson) {
                var world = Globe()
                    .width(width)
                    .height(height)
                    .backgroundColor("rgba(0,0,0,0)")
                    .showGlobe(true)
                    .showAtmosphere(true)
                    .atmosphereColor(accent)
                    .atmosphereAltitude(0.18)
                    .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-night.jpg")
                    .polygonsData(geojson.features)
                    .polygonAltitude(function (d) {
                        return visited[d.properties.ISO_A2] ? 0.07 : 0.01;
                    })
                    .polygonCapColor(function (d) {
                        return visited[d.properties.ISO_A2]
                            ? accent
                            : "rgba(180, 180, 180, 0.22)";
                    })
                    .polygonSideColor(function (d) {
                        return visited[d.properties.ISO_A2]
                            ? hexToRgba(accent, 0.45)
                            : "rgba(120, 120, 120, 0.15)";
                    })
                    .polygonStrokeColor(function (d) {
                        return visited[d.properties.ISO_A2]
                            ? hexToRgba(accent, 0.95)
                            : "rgba(255, 255, 255, 0.12)";
                    })
                    .polygonLabel(function (d) {
                        var name = d.properties.NAME || d.properties.ISO_A2;
                        if (visited[d.properties.ISO_A2]) {
                            return '<div class="travel-tooltip"><b>' + name + '</b><br>Visited</div>';
                        }
                        return '<div class="travel-tooltip">' + name + '</div>';
                    })
                    (mount);

                world.controls().autoRotate = true;
                world.controls().autoRotateSpeed = 0.55;
                world.controls().enableZoom = false;
                world.pointOfView({ lat: 28, lng: 25, altitude: 2.15 }, 0);

                var resizeTimer = null;
                window.addEventListener("resize", function () {
                    window.clearTimeout(resizeTimer);
                    resizeTimer = window.setTimeout(function () {
                        var nextWidth = mount.clientWidth || width;
                        var nextHeight = Math.max(320, Math.min(460, Math.round(nextWidth * 0.72)));
                        world.width(nextWidth);
                        world.height(nextHeight);
                    }, 150);
                });
            })
            .catch(function () {
                mount.innerHTML = '<p class="travel-fallback">Could not load the travel globe right now.</p>';
            });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initGlobe);
    } else {
        initGlobe();
    }
}());
