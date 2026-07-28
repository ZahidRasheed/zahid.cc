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
            map[String(list[i].code).toUpperCase()] = list[i];
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

    function globeSize(mountWidth) {
        var width = mountWidth || 640;
        var isMobile = window.matchMedia("(max-width: 767px)").matches;
        if (isMobile) {
            // Keep the full globe visible in a phone viewport.
            var mobileHeight = Math.max(260, Math.min(340, Math.round(width * 0.88)));
            return { width: width, height: mobileHeight };
        }
        // Desktop / tablet: ~1.5x the original canvas size.
        var height = Math.max(480, Math.min(690, Math.round(width * 0.71)));
        return { width: width, height: height };
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
        var size = globeSize(mount.clientWidth);
        var pointCountries = countries.filter(function (item) {
            return typeof item.lat === "number" && typeof item.lng === "number";
        });

        fetch("data/countries-110m.geojson")
            .then(function (res) {
                if (!res.ok) {
                    throw new Error("Failed to load countries");
                }
                return res.json();
            })
            .then(function (geojson) {
                var presentCodes = {};
                for (var i = 0; i < geojson.features.length; i++) {
                    presentCodes[geojson.features[i].properties.ISO_A2] = true;
                }

                // Marker fallback for tiny countries missing from the polygon set.
                var points = pointCountries.filter(function (item) {
                    return !presentCodes[item.code];
                });

                var world = Globe()
                    .width(size.width)
                    .height(size.height)
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
                        var entry = visited[d.properties.ISO_A2];
                        var name = (entry && entry.name) || d.properties.NAME || d.properties.ISO_A2;
                        if (entry) {
                            return '<div class="travel-tooltip"><b>' + name + '</b><br>Visited</div>';
                        }
                        return '<div class="travel-tooltip">' + name + '</div>';
                    })
                    .pointsData(points)
                    .pointLat("lat")
                    .pointLng("lng")
                    .pointAltitude(0.02)
                    .pointRadius(0.45)
                    .pointColor(function () { return accent; })
                    .pointLabel(function (d) {
                        return '<div class="travel-tooltip"><b>' + d.name + '</b><br>Visited</div>';
                    })
                    (mount);

                world.controls().autoRotate = true;
                world.controls().autoRotateSpeed = 0.45;
                world.controls().enableZoom = false;
                world.pointOfView({ lat: 25, lng: 20, altitude: 1.55 }, 0);

                var resizeTimer = null;
                window.addEventListener("resize", function () {
                    window.clearTimeout(resizeTimer);
                    resizeTimer = window.setTimeout(function () {
                        var next = globeSize(mount.clientWidth);
                        world.width(next.width);
                        world.height(next.height);
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
