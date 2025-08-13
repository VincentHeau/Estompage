// map.js
document.addEventListener('DOMContentLoaded', () => {

    // Initialisation de la carte centrée sur la France
    const map = L.map('map').setView([46.6, 2.5], 6);

    // Ajouter le fond de carte OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Charger le GeoJSON depuis le dossier ressources
    fetch('ressources/mes_zones.geojson')
        .then(response => response.json())
        .then(data => {
            const geojsonLayer = L.geoJSON(data, {
                style: feature => ({
                    color: feature.properties.Couleur || '#3388ff', // couleur par défaut si manquante
                    weight: 2,
                    fillOpacity: 0.5
                }),
                onEachFeature: (feature, layer) => {
                    if (feature.properties.Description) {
                        layer.bindPopup(`<b>Description :</b> ${feature.properties.Description}`);
                    }
                }
            }).addTo(map);

            // Ajuster la vue pour inclure toutes les entités
            map.fitBounds(geojsonLayer.getBounds());
        })
        .catch(err => console.error("Erreur chargement GeoJSON :", err));

});
