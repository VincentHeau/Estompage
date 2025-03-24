// Fonction pour créer une carte OpenLayers avec vos tuiles GitHub
function createMap(targetId) {
  return new ol.Map({
    target: targetId, // ID du conteneur HTML pour la carte
    layers: [
      new ol.layer.Tile({
        source: new ol.source.XYZ({
          url: 'https://raw.githubusercontent.com/VincentHeau/server-carto-lidarHD/refs/heads/main/tuilesMNSReunion/{z}/{x}/{y}.png',
          
        }),
      }),
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([55.3, -20.94]), // Centre de la carte
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
    if (layer !== geojsonLayer) { // Ne pas supprimer la couche GeoJSON
      map.removeLayer(layer);
    }
  });
  map.addLayer(newLayer);

  // Réajouter la couche GeoJSON si elle existe déjà
  if (geojsonLayer && !map.getLayers().getArray().includes(geojsonLayer)) {
    map.addLayer(geojsonLayer);
  }
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
        url: 'https://raw.githubusercontent.com/VincentHeau/server-carto-lidarHD/refs/heads/main/tuilesMNSReunion/{z}/{x}/{y}.png',
        isVector: false,
        layerType: 'XYZ',
      };
    case 'mns50cmcosia':
      return {
        url: 'https://raw.githubusercontent.com/VincentHeau/server-carto-lidarHD/refs/heads/main/tuileMNSReunionCosia/{z}/{x}/{y}.png',
        isVector: false,
        layerType: 'XYZ',
      };
    case 'mns20cm':
      return {
        url: 'https://raw.githubusercontent.com/VincentHeau/server-carto-lidarHD/refs/heads/main/tuilesMNS20cmReunion/{z}/{x}/{y}.png',
        isVector: false,
        layerType: 'XYZ',
      };
    case 'mnt50cm':
      return {
        url: 'https://raw.githubusercontent.com/VincentHeau/server-carto-lidarHD/refs/heads/main/tuilesMNTReunion/{z}/{x}/{y}.png',
        isVector: false,
        layerType: 'XYZ',
      };
    case 'mnt50cmcosia':
      return {
        url: 'https://raw.githubusercontent.com/VincentHeau/server-carto-lidarHD/refs/heads/main/tuilesMNTReunionCosia/{z}/{x}/{y}.png',
        isVector: false,
        layerType: 'XYZ',
      };
    default:
      return {
        url: 'https://raw.githubusercontent.com/VincentHeau/server-carto-lidarHD/refs/heads/main/tuilesMNSReunion/{z}/{x}/{y}.png',
        isVector: false,
        layerType: 'XYZ',
      };
  }
}


function addToponymLayer(map, useAlternativeStyle) {
  
  map.getLayers().getArray().forEach(layer => {
    if (layer.get('isToponymLayer')) {
      map.removeLayer(layer);
    }
  });

  const styleUrl = useAlternativeStyle
    ? 'https://raw.githubusercontent.com/VincentHeau/server-carto-lidarHD/refs/heads/main/style_toponyme.json'
    : 'https://raw.githubusercontent.com/VincentHeau/server-carto-lidarHD/refs/heads/main/style.json';

  // Source pour les tuiles vectorielles
  const vectorTileSource = new ol.source.VectorTile({
    format: new ol.format.MVT(),
    url: 'https://wxs.ign.fr/essentiels/geoportail/tms/1.0.0/PLAN.IGN/{z}/{x}/{y}.pbf',
  });

  // Calque pour les tuiles vectorielles
  const vectorTileLayer = new ol.layer.VectorTile({
    source: vectorTileSource,
  });

  // Appliquer le style JSON
  fetch(styleUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erreur lors du chargement du style : ${response.status}`);
      }
      return response.json();
    })
    .then((styleJson) => {
      olms.applyStyle(vectorTileLayer, styleJson).catch((error) => {
        console.error('Erreur lors de l’application du style :', error);
      });
    })
    .catch((error) => {
      console.error('Erreur lors du chargement du style JSON :', error);
    });

  vectorTileLayer.setZIndex(1000);
  vectorTileLayer.set('isToponymLayer', true);
  console.log("test")
  map.addLayer(vectorTileLayer);
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


// Fonction pour ajouter un objet GeoJSON (un carré englobant Mafate)
function addGeoJSONLayer(map) {
  const geojsonObject = {
    'type': 'Feature',
    'geometry': {
      'type': 'Polygon',
      'coordinates': [
        [
          [55.3228, -21.0829], // Coin inférieur gauche
          [55.4416, -21.0829], // Coin inférieur droit
          [55.4416, -20.9728], // Coin supérieur droit
          [55.3228, -20.9728], // Coin supérieur gauche
          [55.3228, -21.0829],
        ],
        [
          [55.2598, -20.9728], // Coin inférieur gauche
          [55.3228, -20.9728], // Coin inférieur droit
          [55.3228, -20.9138], // Coin supérieur droit
          [55.2598, -20.9138], // Coin supérieur gauche
          [55.2598, -20.9728], // Retour au coin supérieur gauche
        ],
        [
          [55.6500, -21.3], // Coin inférieur gauche (approximatif)
          [55.8000, -21.3], // Coin inférieur droit
          [55.8000, -21.2], // Coin supérieur droit
          [55.6500, -21.2], // Coin supérieur gauche
          [55.6500, -21.3]  // Retour au point de départ
        ]
      ]
    }
  };

  // Création de la source GeoJSON
  const geojsonSource = new ol.source.Vector({
    features: new ol.format.GeoJSON().readFeatures(geojsonObject, {
      featureProjection: 'EPSG:3857' // Projection en EPSG:3857 pour OpenLayers
    })
  });

  // Style pour l'objet GeoJSON (carré avec contour et remplissage)
  const geojsonStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(0, 255, 0, 0)', // Remplissage vert transparent
    }),
    stroke: new ol.style.Stroke({
      color: 'black', // Bordure verte
      width: 2,
    }),
  });

  // Couche vectorielle pour afficher l'objet GeoJSON
  geojsonLayer = new ol.layer.Vector({
    source: geojsonSource,
    style: geojsonStyle,
  });

  geojsonLayer.setZIndex(1000);

  // Ajouter la couche GeoJSON au-dessus des autres couches
  map.addLayer(geojsonLayer);
}

// Initialisation de la carte
const map = createMap('map1');

// Mise à jour de l'indicateur de zoom
updateZoomIndicator(map);


// Ajout de la couche GeoJSON
addGeoJSONLayer(map);

// Ajout de la couche de toponymes
addToponymLayer(map, true);

// Gestion de la sélection des couches
document.getElementById('layer-selector').addEventListener('change', (event) => {
  const selectedValue = event.target.value;
  const { url, isVector, layerType } = getLayerDetails(selectedValue);
  const newLayer = createLayer(url, isVector, layerType);
  updateLayerURL(map, newLayer);
  if (selectedValue !== 'plan-ign') {
    const useAlternativeStyle = (selectedValue === 'mns50cm' || selectedValue === 'mns50cmcosia' || selectedValue === 'mns20cm'|| selectedValue === 'mnt50cmcosia'|| selectedValue === 'mnt50cm');
    addToponymLayer(map, useAlternativeStyle);
  }
  else{
    map.getLayers().getArray().forEach(layer => {
      if (layer.get('isToponymLayer')) {
        map.removeLayer(layer);
      }
    });
  }
});
