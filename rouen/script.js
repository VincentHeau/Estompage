// Fonction pour créer une carte OpenLayers avec vos tuiles GitHub
function createMap(targetId) {
  return new ol.Map({
    target: targetId, // ID du conteneur HTML pour la carte
    layers: [
      new ol.layer.Tile({
        source: new ol.source.XYZ({
          url: 'https://cdn.jsdelivr.net/gh/VincentHeau/server-carto-lidarHD@main/tuilesMNSRouen/{z}/{x}/{y}.png', // Vos tuiles GitHub
        }),
      }),
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([1.0985, 49.4144]), // Centre de la carte
      zoom: 14, // Zoom initial
      minZoom: 5,
      maxZoom: 18,
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
        url: 'https://cdn.jsdelivr.net/gh/VincentHeau/server-carto-lidarHD@main/tuilesMNSRouen/{z}/{x}/{y}.png',
        isVector: false,
        layerType: 'XYZ',
      };
    case 'mns20cm':
      return {
        url: 'https://cdn.jsdelivr.net/gh/VincentHeau/server-carto-lidarHD@main/tuilesMNSRouen20cm/{z}/{x}/{y}.png',
        isVector: false,
        layerType: 'XYZ',
      };
    case 'mnt50cm':
      return {
        url: 'https://cdn.jsdelivr.net/gh/VincentHeau/server-carto-lidarHD@main/tuilesMNTRouen/{z}/{x}/{y}.png',
        isVector: false,
        layerType: 'XYZ',
      };
    default:
      return {
        url: 'https://cdn.jsdelivr.net/gh/VincentHeau/server-carto-lidarHD@main/tuilesMNSRouen/{z}/{x}/{y}.png',
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
