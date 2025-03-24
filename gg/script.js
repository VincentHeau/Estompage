const attributions =
  '<div id="intro-message" style="font-size: 16px; font-family: Arial, sans-serif; text-align: left; padding: 15px; border: 1px solid rgb(179, 197, 212); border-radius: 8px; background-color: rgba(255, 255, 255, 0.75); max-width: 95%; margin: 5px auto; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">' +
  '<p style="margin: 0;">Démonstrateur pour le Plan IGN Lidar. Ce site vous permet d’explorer des versions tuilées du prototype. Vous pouvez ajuster l’apparence de la carte selon vos préférences en choisissant l’un des styles proposés.</p>' +
  '</div>';


function createMap(targetId) {
  return new ol.Map({
    target: targetId, 
    layers: [
      new ol.layer.Tile({
        source: new ol.source.XYZ({
          attributions: attributions,
          url: 'https://raw.githubusercontent.com/VincentHeau/server-carto-lidarHD/refs/heads/main/tuilesMNS50cmGG/{z}/{x}/{y}.png', 
        }),
      }),
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([-0.071851,47.699051]), // Centre de la carte
      zoom: 14, // Zoom initial
      minZoom: 5,
      maxZoom: 20,
    }),
  });
}
// Fonction pour mettre à jour l'indicateur de zoom
function updateZoomIndicator(map) {
  const zoomIndicator = document.getElementById('zoom-indicator');
  let timeout;
  map.getView().on('change:resolution', function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const zoom = map.getView().getZoom();
      zoomIndicator.innerHTML = 'Zoom: ' + Math.round(zoom);
    }, 150);
  });
}
// Fonction pour mettre à jour l'URL d'une couche
function updateLayerURL(map, newLayer) {
  map.getLayers().forEach(layer => {
    map.removeLayer(layer);
  });
  map.addLayer(newLayer);
}
// Fonction pour obtenir les détails des couches
function getLayerDetails(selectedValue) {
  switch (selectedValue) {
    case 'plan-ign':
      return {
        url: 'https://data.geopf.fr/wmts',
        isVector: false,
        layerType: 'WMTS',
      };
    case 'mns50cm':
      return {
        url: 'https://cdn.jsdelivr.net/gh/VincentHeau/server-carto-lidarHD@main/tuilesMNS50cmGG/{z}/{x}/{y}.png',
        isVector: false,
        layerType: 'XYZ',
      };
    case 'mns20cm':
      return {
        url: 'https://raw.githubusercontent.com/VincentHeau/server-carto-lidarHD/refs/heads/main/tuilesMNS20cmGG/{z}/{x}/{y}.png',
        isVector: false,
        layerType: 'XYZ',
      };
    case 'mns20cmV2':
      return {
        url: 'https://cdn.jsdelivr.net/gh/VincentHeau/server-carto-lidarHD@main/tuilesMNS20cmGGV2/{z}/{x}/{y}.png',
        isVector: false,
        layerType: 'XYZ',
      };
    default:
      return {
        url: 'https://cdn.jsdelivr.net/gh/VincentHeau/server-carto-lidarHD@main/tuilesMNS50cmGG/{z}/{x}/{y}.png',
        isVector: false,
        layerType: 'XYZ',
      };
  }
}
// Fonction pour créer une couche OpenLayers
function createLayer(url, isVector, layerType) {
  if (layerType === 'WMTS') {
    const resolutions = [];
    const matrixIds = [];
    const proj3857 = ol.proj.get('EPSG:3857');
    const maxResolution = ol.extent.getWidth(proj3857.getExtent()) / 256;
    for (let i = 0; i < 20; i++) {
      matrixIds[i] = i.toString();
      resolutions[i] = maxResolution / Math.pow(2, i);
    }
    const tileGrid = new ol.tilegrid.WMTS({
      origin: [-20037508, 20037508],
      resolutions: resolutions,
      matrixIds: matrixIds,
    });
    return new ol.layer.Tile({
      source: new ol.source.WMTS({
        url: url,
        layer: 'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2',
        matrixSet: 'PM',
        format: 'image/png',
        projection: 'EPSG:3857',
        tileGrid: tileGrid,
        style: 'normal',
        attributions:
          '<a href="https://www.ign.fr/" target="_blank">' +
          '<img src="https://data.geopf.fr/annexes/ressources/logos/ign.gif" title="Institut national de l\'information géographique et forestière" alt="IGN"></a>',
      }),
    });
  } else if (isVector) {
    return new ol.layer.VectorTile({
      source: new ol.source.VectorTile({
        format: new ol.format.MVT(),
        url: url,
      }),
    });
  } else {
    return new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: url,
      }),
    });
  }
}

// Initialisation de la carte
const map = createMap('map1');

// Mise à jour de l'indicateur de zoom
updateZoomIndicator(map);

// Gestion de la sélection des couches
document.getElementById('layer-selector').addEventListener('change', (event) => {
  const selectedValue = event.target.value;
  const { url, isVector, layerType } = getLayerDetails(selectedValue);
  const newLayer = createLayer(url, isVector, layerType);
  updateLayerURL(map, newLayer);
});
