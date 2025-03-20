/*
Code permettant de lancer le démonstrateur
11/12/2024

*/

// Projections
proj4.defs("EPSG:3857", "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs");
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");


const map = new maplibregl.Map({
    container: 'map',
    style: 'style/sanstoponyme.json',
    center: [1.1425, 44.8171], 
    zoom: 14,
});

map.addControl(new maplibregl.NavigationControl());
map.addControl(new MaplibreExportControl.MaplibreExportControl({
    PageSize: MaplibreExportControl.Size.A4,
    PageOrientation: MaplibreExportControl.PageOrientation.Landscape,
    Format: MaplibreExportControl.Format.PNG,
    DPI: MaplibreExportControl.DPI[300],
    Crosshair: true,
    PrintableArea: true,
    Local: 'en',
    northIconOptions: {
        visibility: "none"  
    }
}), 'top-right');


/* Zones de travail 
- Mettre à jour le fichier zone.json
*/

let zones = {};

// Chargement des zones depuis le fichier JSON
fetch('./zones.json')
  .then(response => response.json())
  .then(data => {
    zones = data;

    // conversion des coordonnées extent de chaque couche de chaque zone de EPSG:3857 à EPSG:4326
    Object.keys(zones).forEach(key => {
        Object.keys(zones[key].layers).forEach(layerKey => {
            const layer = zones[key].layers[layerKey];
            if (layer.extent && Array.isArray(layer.extent)) {
                layer.extent4326 = layer.extent.map(coord => proj4("EPSG:3857", "EPSG:4326", coord));
            } else {
                console.error(`La couche ${layerKey} dans la zone ${key} ne contient pas de propriété 'extent' valide.`);
            }
        });
    });

    const firstZone = Object.keys(zones)[2];
    console.log(firstZone)
    updateLayersForZone(firstZone);

    const layerControl = new LayerControl(zones[firstZone].layers);
    map.addControl(layerControl, 'bottom-right');

    const zoneNavigationControl = new ZoneNavigationControl();
    zoneNavigationControl.setLayerControl(layerControl);
    map.addControl(zoneNavigationControl, 'top-left');
  })
  .catch(error => console.error('Erreur de chargement des zones:', error));


// Gestion des couches
class LayerControl {
    constructor(layers) {
        this.layers = layers;
    }

    updateLayerVisibility(map, layerKey, isVisible) {
        const layerId = `${layerKey}-layer`;
        if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, 'visibility', isVisible ? 'visible' : 'none');
        }
    }

    onAdd(map) {
        this.map = map;
        this.container = document.createElement('div');
        this.container.className = 'maplibregl-ctrl';
        this.container.style.backgroundColor = 'rgba(248, 249, 250, 0.8)';
        this.container.style.padding = '8px';
        this.container.style.borderRadius = '4px';
        this.container.style.fontFamily = 'Segoe UI, sans-serif';

        this.renderControls();
        return this.container;
    }

    renderControls() {
        this.container.innerHTML = `
            ${Object.keys(this.layers).map(layerKey => `
                <label>
                    <input class="form-check-input" type="checkbox" id="${layerKey}-layer-toggle" checked>
                    <strong>${layerKey.toUpperCase()}</strong>
                </label><br>
                <label class="text-muted" for="${layerKey}-opacity">Opacité:</label>
                <input type="range" id="${layerKey}-opacity" min="0" max="1" step="0.01" value="${this.layers[layerKey].opacity || 0.5}">
                <span id="${layerKey}-opacity-value">${this.layers[layerKey].opacity || 0.5}</span><br>
            `).join('')}
        `;

        Object.keys(this.layers).forEach(layerKey => {
            const opacitySlider = this.container.querySelector(`#${layerKey}-opacity`);
            const opacityValue = this.container.querySelector(`#${layerKey}-opacity-value`);
            opacitySlider.addEventListener('input', (e) => {
                opacityValue.textContent = e.target.value;
                this.updateLayerOpacity(this.map, layerKey, parseFloat(e.target.value));
            });

            this.container.querySelector(`#${layerKey}-layer-toggle`).addEventListener('change', (e) => {
                this.updateLayerVisibility(this.map, layerKey, e.target.checked);
            });
        });
    }

    updateLayerOpacity(map, layerKey, opacity) {
        const layerId = `${layerKey}-layer`;
        if (map.getLayer(layerId)) {
            map.setPaintProperty(layerId, 'raster-opacity', opacity);
        }
    }

    updateLayers(layers) {
        this.layers = layers;
        this.renderControls();
    }

    onRemove() {
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
    }
}

// Navigation entre zones
// class ZoneNavigationControl {
//     onAdd(map) {
//         this.map = map;

//         this.container = document.createElement('div');
//         this.container.className = 'maplibregl-ctrl dropdown';

//         const dropdownButton = document.createElement('button');
//         dropdownButton.className = 'btn btn-secondary dropdown-toggle';
//         dropdownButton.type = 'button';
//         dropdownButton.id = 'dropdownMenuButton';
//         dropdownButton.setAttribute('data-bs-toggle', 'dropdown');
//         dropdownButton.setAttribute('aria-expanded', 'false');
//         dropdownButton.textContent = 'Choix de la zone';

//         this.container.appendChild(dropdownButton);

//         const dropdownMenu = document.createElement('ul');
//         dropdownMenu.className = 'dropdown-menu';
//         dropdownMenu.setAttribute('aria-labelledby', 'dropdownMenuButton');

//         Object.keys(zones).forEach(zoneKey => {
//             const zone = zones[zoneKey];
    
//             const dropdownItem = document.createElement('li');
//             const itemButton = document.createElement('button');
//             itemButton.className = 'dropdown-item';
//             itemButton.textContent = `${zoneKey}`;
//             itemButton.addEventListener('click', () => {
//                 this.navigateToZone(zoneKey, zone);
//             });
    
//             dropdownItem.appendChild(itemButton);
//             dropdownMenu.appendChild(dropdownItem);
//         });
    
//         this.container.appendChild(dropdownMenu);
    
//         return this.container;
//     }
    

//     navigateToZone(zoneKey, zone) {
//         this.map.flyTo({ center: zone.center, zoom: zone.zoom });

//         Object.entries(zone.layers).forEach(([layerKey, layer]) => {
//             const sourceId = layerKey;
//             const layerId = `${layerKey}-layer`;
            
//             if (this.map.getSource(sourceId)) {
                
//                 this.map.getSource(sourceId).updateImage({
//                     url: layer.url,
//                     coordinates: layer.extent4326
//                 });
//             } else {
//                 this.map.addSource(sourceId, {
//                     type: 'image',
//                     url: layer.url,
//                     coordinates: layer.extent4326
//                 });

//                 this.map.addLayer({
//                     id: layerId,
//                     type: 'raster',
//                     source: sourceId,
//                     paint: { 'raster-opacity': layer.opacity || 0.5 }
//                 });
//             }
//         });

//         if (this.layerControl) {
//             this.layerControl.updateLayers(zone.layers);
//         }
//     }

//     setLayerControl(layerControl) {
//         this.layerControl = layerControl;
//     }

//     onRemove() {
//         this.container.parentNode.removeChild(this.container);
//         this.map = undefined;
//     }
// }

map.on('load', () => {
    if (Object.keys(zones).length > 0) {
        const firstZone = Object.keys(zones)[2];
        Object.entries(zones[firstZone].layers).forEach(([layerKey, layer]) => {
            map.addSource(layerKey, {
                type: 'image',
                url: layer.url,
                coordinates: layer.extent4326
            });

            map.addLayer({
                id: `${layerKey}-layer`,
                type: 'raster',
                source: layerKey,
                paint: { 'raster-opacity': layer.opacity || 0.5 }
            });
        });
    }

    // //URL de la couche WMTS pour les courbes de niveau
    // const wmtsUrl = 'https://data.geopf.fr/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=ELEVATION.CONTOUR.LINE&STYLE=normal&TILEMATRIXSET=PM&TileMatrix={z}&TileRow={y}&TileCol={x}&FORMAT=image/png';

    // map.addSource('wmts-courbes-niveau', {
    //     type: 'raster',
    //     tiles: [wmtsUrl],  
    //     tileSize: 256
    // });

    // map.addLayer({
    //     id: 'wmts-courbes-niveau-layer',
    //     type: 'raster',
    //     source: 'wmts-courbes-niveau',
    //     paint: {
    //     'raster-opacity': 0.7 
    //     }
    // });

    fetch('style/style_bati.json')
        .then(response => response.json())
        .then(style => {
            // Ajouter chaque couche de `toponymes.json` au-dessus de la carte existante
            style.layers.forEach(layer => {
                if (layer.id && layer.source) {
                    if (layer.type === 'fill') {
                        layer.paint = {
                          ...layer.paint, 
                          'fill-opacity': 0.5 
                        };
                    }
                    map.addLayer(layer); 
                }
            });
            
            // Ajout des toponymes en dernier
            fetch('style/topo_du_standard.json')
            .then(response => response.json())
            .then(style => {
                style.layers.forEach(layer => {
                    if (layer.id && layer.source) {
                        map.addLayer(layer); 
                    }
                });
            })
            .catch(error => {
                console.error("Erreur lors du chargement du style des toponymes:", error);
            });
        })
        .catch(error => {
            console.error("Erreur lors du chargement du style des toponymes:", error);
        });

    
});


// Mise à jour des couches en fonction de la zone
function updateLayersForZone(zoneKey) {
    const zone = zones[zoneKey];

    if (!zone) {
        console.error(`Zone "${zoneKey}" non définie.`);
        return;
    }

    Object.entries(zone.layers).forEach(([layerKey, layer]) => {
        const source = map.getSource(layerKey);
        console.log(layerKey);
        if (source) {
            source.updateImage({
                url: layer.url,
                coordinates: layer.extent4326
            });
        } else {
            console.warn(`La source "${layerKey}" n'existe pas pour la carte.`);
        }
    });
}



// // Ombre rotative - à développer dans un second temps
// // const frameCount = 5;
// // let currentImage = 0;

    
// // function getPath() {
// //     return (
// //         `https://maplibre.org/maplibre-gl-js/docs/assets/ombre${
// //             currentImage
// //         }.gif`
// //     );
// // }
