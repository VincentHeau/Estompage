// --- 1) Fond OSM visible partout ---

// --- 2) Flux comparés ---
const leftLayer = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: "https://raw.githubusercontent.com/VincentHeau/mini-server-carto/refs/heads/main/tuiles-simon/{z}/{x}/{y}.png",
    attributions: "Flux perso (GitHub)",
  }),
});

const rightLayer = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: "https://raw.githubusercontent.com/VincentHeau/mini-server-carto/refs/heads/main/tuiles_vincent/{z}/{x}/{y}.png",
    attributions: "© contributeurs OpenStreetMap",
  }),
});

// --- 3) Carte et vue partagée ---
const map = new ol.Map({
  target: "map",
  layers: [
    // baseLayer, // fond
    rightLayer, // comparé à droite
    leftLayer, // comparé à gauche
  ],
  view: new ol.View({
    center: [660556.0, 5652186.1],
    zoom: 14,
    projection: "EPSG:3857",
  }),
});

// --- 4) Logique de découpe (swipe) ---
const slider = document.getElementById("slider");
const divider = document.getElementById("divider");

function updateClip() {
  const size = map.getSize();
  if (!size) return;
  const widthPx = size[0];
  const clipPx = Math.round(widthPx * (Number(slider.value) / 100));

  divider.style.left = clipPx + "px";
  map.render();
}

leftLayer.on("prerender", function (e) {
  const size = map.getSize();
  if (!size) return;
  const widthPx = size[0];
  const heightPx = size[1];
  const clipPx = Math.round(widthPx * (Number(slider.value) / 100));

  const ctx = e.context;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, clipPx, heightPx);
  ctx.clip();
});

leftLayer.on("postrender", function (e) {
  e.context.restore();
});

slider.addEventListener("input", updateClip);
window.addEventListener("resize", updateClip);
map.once("postrender", updateClip);

document.getElementById("leftLabel").textContent = "Gauche : Projet GDAL";
document.getElementById("rightLabel").textContent = "Droite : Projet QGIS";

let zones = {};

// Chargement des zones depuis le fichier JSON
fetch("./zones.json")
  .then((response) => response.json())
  .then((data) => {
    zones = data;

    // conversion des coordonnées extent de chaque couche de chaque zone de EPSG:3857 à EPSG:4326
    Object.keys(zones).forEach((key) => {
      Object.keys(zones[key].layers).forEach((layerKey) => {
        const layer = zones[key].layers[layerKey];
        if (layer.extent && Array.isArray(layer.extent)) {
          layer.extent4326 = layer.extent.map((coord) =>
            proj4("EPSG:3857", "EPSG:4326", coord)
          );
        } else {
          console.error(
            `La couche ${layerKey} dans la zone ${key} ne contient pas de propriété 'extent' valide.`
          );
        }
      });
    });

    const firstZone = Object.keys(zones)[2];
    console.log(firstZone);
    updateLayersForZone(firstZone);

    const layerControl = new LayerControl(zones[firstZone].layers);
    map.addControl(layerControl, "bottom-right");

    const zoneNavigationControl = new ZoneNavigationControl();
    zoneNavigationControl.setLayerControl(layerControl);
    map.addControl(zoneNavigationControl, "top-left");
  })
  .catch((error) => console.error("Erreur de chargement des zones:", error));

// Gestion des couches
class LayerControl {
  constructor(layers) {
    this.layers = layers;
  }

  updateLayerVisibility(map, layerKey, isVisible) {
    const layerId = `${layerKey}-layer`;
    if (map.getLayer(layerId)) {
      map.setLayoutProperty(
        layerId,
        "visibility",
        isVisible ? "visible" : "none"
      );
    }
  }

  onAdd(map) {
    this.map = map;
    this.container = document.createElement("div");
    this.container.className = "maplibregl-ctrl";
    this.container.style.backgroundColor = "rgba(248, 249, 250, 0.8)";
    this.container.style.padding = "8px";
    this.container.style.borderRadius = "4px";
    this.container.style.fontFamily = "Segoe UI, sans-serif";

    this.renderControls();
    return this.container;
  }

  renderControls() {
    this.container.innerHTML = `
            ${Object.keys(this.layers)
              .map(
                (layerKey) => `
                <label>
                    <input class="form-check-input" type="checkbox" id="${layerKey}-layer-toggle" checked>
                    <strong>${layerKey.toUpperCase()}</strong>
                </label><br>
                <label class="text-muted" for="${layerKey}-opacity">Opacité:</label>
                <input type="range" id="${layerKey}-opacity" min="0" max="1" step="0.01" value="${
                  this.layers[layerKey].opacity || 0.5
                }">
                <span id="${layerKey}-opacity-value">${
                  this.layers[layerKey].opacity || 0.5
                }</span><br>
            `
              )
              .join("")}
        `;

    Object.keys(this.layers).forEach((layerKey) => {
      const opacitySlider = this.container.querySelector(
        `#${layerKey}-opacity`
      );
      const opacityValue = this.container.querySelector(
        `#${layerKey}-opacity-value`
      );
      opacitySlider.addEventListener("input", (e) => {
        opacityValue.textContent = e.target.value;
        this.updateLayerOpacity(this.map, layerKey, parseFloat(e.target.value));
      });

      this.container
        .querySelector(`#${layerKey}-layer-toggle`)
        .addEventListener("change", (e) => {
          this.updateLayerVisibility(this.map, layerKey, e.target.checked);
        });
    });
  }

  updateLayerOpacity(map, layerKey, opacity) {
    const layerId = `${layerKey}-layer`;
    if (map.getLayer(layerId)) {
      map.setPaintProperty(layerId, "raster-opacity", opacity);
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

map.on("load", () => {
  if (Object.keys(zones).length > 0) {
    const firstZone = Object.keys(zones)[2];
    Object.entries(zones[firstZone].layers).forEach(([layerKey, layer]) => {
      map.addSource(layerKey, {
        type: "image",
        url: layer.url,
        coordinates: layer.extent4326,
      });

      map.addLayer({
        id: `${layerKey}-layer`,
        type: "raster",
        source: layerKey,
        paint: { "raster-opacity": layer.opacity || 0.5 },
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

  fetch("style/style_bati.json")
    .then((response) => response.json())
    .then((style) => {
      // Ajouter chaque couche de `toponymes.json` au-dessus de la carte existante
      style.layers.forEach((layer) => {
        if (layer.id && layer.source) {
          if (layer.type === "fill") {
            layer.paint = {
              ...layer.paint,
              "fill-opacity": 0.5,
            };
          }
          map.addLayer(layer);
        }
      });

      // Ajout des toponymes en dernier
      fetch("style/topo_du_standard.json")
        .then((response) => response.json())
        .then((style) => {
          style.layers.forEach((layer) => {
            if (layer.id && layer.source) {
              map.addLayer(layer);
            }
          });
        })
        .catch((error) => {
          console.error(
            "Erreur lors du chargement du style des toponymes:",
            error
          );
        });
    })
    .catch((error) => {
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
        coordinates: layer.extent4326,
      });
    } else {
      console.warn(`La source "${layerKey}" n'existe pas pour la carte.`);
    }
  });
}
