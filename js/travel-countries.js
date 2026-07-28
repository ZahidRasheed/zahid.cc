/* Visited countries for the travel globe.
 * Use ISO 3166-1 alpha-2 codes.
 * Optional:
 *   visits — distinct trips (shown as "(n)" when > 1)
 *   lat/lng — marker for tiny countries missing from polygons (e.g. Singapore)
 */
window.TRAVEL_COUNTRIES = [
    { code: "AT", name: "Austria" },
    { code: "AU", name: "Australia" },
    { code: "CZ", name: "Czech Republic" },
    { code: "DK", name: "Denmark" },
    { code: "EG", name: "Egypt" },
    { code: "FR", name: "France", visits: 2 },
    { code: "DE", name: "Germany", visits: 2 },
    { code: "GR", name: "Greece" },
    { code: "HU", name: "Hungary" },
    { code: "IT", name: "Italy", visits: 3 },
    { code: "MY", name: "Malaysia", visits: 3 },
    { code: "NL", name: "Netherlands", visits: 4 },
    { code: "NO", name: "Norway" },
    { code: "PK", name: "Pakistan" },
    { code: "PL", name: "Poland" },
    { code: "PT", name: "Portugal" },
    { code: "SA", name: "Saudi Arabia" },
    { code: "SG", name: "Singapore", visits: 2, lat: 1.3521, lng: 103.8198 },
    { code: "ES", name: "Spain", visits: 3 },
    { code: "SE", name: "Sweden", visits: 2 },
    { code: "CH", name: "Switzerland" },
    { code: "TH", name: "Thailand" },
    { code: "TR", name: "Turkey", visits: 7 },
    { code: "GB", name: "United Kingdom", visits: 4 },
    { code: "US", name: "United States", visits: 3 }
];
