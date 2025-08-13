// Initialisation de la carte
const map = L.map('map').setView([46.6, 2.5], 6); // Centrée sur la France

// Ajouter un fond de carte OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Exemple de zones traitées (polygone)
const zone = L.polygon([
    [48.8566, 2.3522], // Paris
    [43.6047, 1.4442], // Toulouse
    [45.7640, 4.8357]  // Lyon
], {color: 'red'}).addTo(map);

// Popup sur la zone
zone.bindPopup("Zone traitée");
