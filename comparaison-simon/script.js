// Initialisation carte
const map = new ol.Map({
  target: 'map1',
  view: new ol.View({
    center: ol.proj.fromLonLat([55.53064, -21.113682]), // Réunion
    zoom: 14,
    minZoom: 5,
    maxZoom: 20
  }),
  layers: []
});

// Indicateur de zoom
function updateZoomIndicator(map) {
  const zoomIndicator = document.getElementById('zoom-indicator');
  map.getView().on('change:resolution', () => {
    zoomIndicator.innerText = `Zoom: ${Math.round(map.getView().getZoom())}`;
  });
}
updateZoomIndicator(map);

// Définition des couches
const couches = {
  wmtsIGN: new ol.layer.Tile({
    source: new ol.source.WMTS({
      url: 'https://data.geopf.fr/wmts',
      layer: 'ELEVATION.CONTOUR.LINE',
      matrixSet: 'PM_6_18',
      format: 'image/png',
      projection: 'EPSG:3857',
      style: 'normal',
      tileGrid: new ol.tilegrid.WMTS({
        origin: [-20037508, 20037508],
        resolutions: Array.from({length: 19}, (_, z) => 156543.03392804097 / Math.pow(2, z)),
        matrixIds: Array.from({length: 19}, (_, z) => z.toString())
      }),
      attributions: '<a href="https://www.ign.fr/">IGN</a>'
    })
  }),

  V1: new ol.layer.Vector({
    source: new ol.source.Vector({
      url: './data/version1.geojson',
      format: new ol.format.GeoJSON()
    }),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'red',
        width: 2
      })
    })
  }),

  V2: new ol.layer.Vector({
    source: new ol.source.Vector({
      url: './data/version2.geojson',
      format: new ol.format.GeoJSON()
    }),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'blue',
        width: 1
      })
    })
  })
};

// Gestion du changement de couche
document.getElementById('layer-selector').addEventListener('change', (e) => {
  const value = e.target.value;
  map.getLayers().clear(); // Supprimer toutes les couches
  map.addLayer(couches[value]); // Ajouter la nouvelle
});

// Couche initiale
map.addLayer(couches['wmtsIGN']);
