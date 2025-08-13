// Initialisation de la carte centrée sur la France
const map = L.map('map').setView([46.6, 2.5], 6);

// Fond de carte OSM
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let zonesList = [];

// Chargement du GeoJSON
fetch('ressources/mes_zones.geojson')
    .then(res => res.json())
    .then(data => {
        L.geoJSON(data, {
            style: feature => ({
                color: feature.properties.Couleur || "#000000",
                weight: 2,
                fillOpacity: 0.5
            }),
            onEachFeature: (feature, layer) => {
                // Popup au clic
                layer.bindPopup(`<b>${feature.properties.Nom}</b><br>${feature.properties.Description}`);
                // Ajout à la liste pour le menu
                zonesList.push({
                    name: feature.properties.Nom,
                    bounds: layer.getBounds()
                });
            }
        }).addTo(map);

        addZoneSelector();
    });

// Fonction pour ajouter un menu déroulant
function addZoneSelector() {
    const ZoneControl = L.Control.extend({
        onAdd: function () {
            const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
            div.style.backgroundColor = 'white';
            div.style.padding = '5px';

            const select = L.DomUtil.create('select', '', div);
            select.innerHTML = `<option value="">-- Choisir une zone --</option>`;

            zonesList.forEach((z, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = z.name;
                select.appendChild(option);
            });

            select.addEventListener('change', function () {
                if (this.value !== "") {
                    const z = zonesList[this.value];
                    map.fitBounds(z.bounds);
                }
            });

            L.DomEvent.disableClickPropagation(div); // Empêche le menu de déplacer la carte
            return div;
        }
    });

    map.addControl(new ZoneControl({ position: 'topright' }));
}
