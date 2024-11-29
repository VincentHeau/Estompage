let imageData = {}; // Objet pour stocker les données JSON

const leftImageSelect = document.getElementById("left-image-select");
const rightImageSelect = document.getElementById("right-image-select");
const leftInfoButton = document.getElementById("left-info-btn");
const rightInfoButton = document.getElementById("right-info-btn");

const juxtaposeSelector = "#juxtapose-embed";
let slider;
let currentZone = "Zone1"; // Zone par défaut


// Fonction pour initialiser le slider Juxtapose
function initializeJuxtapose(leftSrc, rightSrc) {
    const images = [
        { src: leftSrc, label: "" },
        { src: rightSrc, label: "" }
    ];

    const options = {
        makeResponsive: true,
        showLabels: true,
        mode: "horizontal",
        animate: true,
        startingPosition: "50"
    };

    // Détruire l'ancien slider s'il existe
    const container = document.querySelector(juxtaposeSelector);
    container.innerHTML = ""; // Nettoyer le conteneur

    slider = new juxtapose.JXSlider(juxtaposeSelector, images, options);
}

// Fonction pour mettre à jour les options du menu déroulant et afficher la description
function updateSelectOptions(zone) {
    const options = imageData[zone] || [];
    leftImageSelect.innerHTML = ""; // Effacer les options existantes
    rightImageSelect.innerHTML = ""; // Effacer les options existantes

    // Ajouter les nouvelles options
    options.forEach(image => {
        const leftOption = document.createElement("option");
        const rightOption = document.createElement("option");

        leftOption.value = image.src;
        rightOption.value = image.src;

        leftOption.textContent = image.src;
        rightOption.textContent = image.src;

        leftImageSelect.appendChild(leftOption);
        rightImageSelect.appendChild(rightOption);
    });

    // Initialiser Juxtapose avec les premières options par défaut
    if (options.length > 0) {
        const leftSrc = `ressources/${zone}/${options[0].src}`;
        const rightSrc = `ressources/${zone}/${options[1].src}`;
        initializeJuxtapose(leftSrc, rightSrc);

        // Afficher la description de l'image gauche par défaut
        const leftDescription = options[0].description || "Description indisponible";
        const rightDescription = options[1]?.description || "Description indisponible";

        leftInfoButton.title = leftDescription;
        rightInfoButton.title = rightDescription;

        // Pré-sélectionner les premières options
        leftImageSelect.value = options[0].src;
        rightImageSelect.value = options[1].src;
    }
}

// Gestionnaire de changement pour les boutons radio des zones
document.querySelectorAll('input[name="zone"]').forEach(radio => {
    radio.addEventListener("change", () => {
        if (radio.checked) {
            const zoneId = radio.id.replace("zone", "Zone"); // Convertir ID en nom de zone
            currentZone = zoneId;
            updateSelectOptions(currentZone); // Mettre à jour les menus déroulants et le slider
        }
    });
});

// Gestionnaire de changement pour les menus déroulants
leftImageSelect.addEventListener("change", () => {
    if (isSideBySide) {
        updateSideBySideImages();
      } else {
        const selectedImage = imageData[currentZone].find(
            image => image.src === leftImageSelect.value
        );
        const leftSrc = `ressources/${currentZone}/${leftImageSelect.value}`;
        const rightSrc = slider.imgAfter.image.src; // Garder l'image de droite actuelle
        initializeJuxtapose(leftSrc, rightSrc);


        // Mettre à jour le tooltip du bouton de gauche
        const leftDescription = selectedImage?.description || "Description indisponible";
        leftInfoButton.title = leftDescription;
      }
});

rightImageSelect.addEventListener("change", () => {
    if (isSideBySide) {
        updateSideBySideImages();
      } else {
        const selectedImage = imageData[currentZone].find(
            image => image.src === rightImageSelect.value
        );
        const rightSrc = `ressources/${currentZone}/${rightImageSelect.value}`;
        const leftSrc = slider.imgBefore.image.src; // Garder l'image de gauche actuelle
        initializeJuxtapose(leftSrc, rightSrc);

        // Mettre à jour le tooltip du bouton de droite
        const rightDescription = selectedImage?.description || "Description indisponible";
        rightInfoButton.title = rightDescription;
      }
});

// Charger les données JSON et initialiser la page
fetch("ressources/description.json")
    .then(response => response.json())
    .then(data => {
        imageData = data; // Stocker les données dans la variable globale
        updateSelectOptions(currentZone); // Initialiser avec Zone 1
    })
    .catch(error => {
        console.error("Erreur lors du chargement des données JSON :", error);
    });


// Gestion de la carte de l'emprise

const empriseBtn = document.getElementById('emprise-btn');
  const mapDiv = document.getElementById('map');
  const juxtaposeDiv = document.getElementById('juxtapose-embed');
  const imageSelectors = document.querySelector('.row.mb-4');

  let mapInitialized = false;
  let map;

  empriseBtn.addEventListener('click', () => {
    if (mapDiv.style.display === 'none') {
      mapDiv.style.display = 'block';
      juxtaposeDiv.style.display = 'none';
      imageSelectors.style.display = 'none';
      empriseBtn.textContent = 'Masquer la carte';

      // Initialiser la carte si ce n'est pas encore fait
      if (!mapInitialized) {
        initializeMap();
        mapInitialized = true;
      }
    } else {
      mapDiv.style.display = 'none';
      juxtaposeDiv.style.display = 'block';
      imageSelectors.style.display = 'flex';
      empriseBtn.textContent = 'Carte';
    }
  });

  function initializeMap() {
    map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM(), // Fond de carte OSM
        }),
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([6.1, 45.68]), // Coordonnées approximatives pour Tahiti
        zoom: 11, // Niveau de zoom
      }),
    });

    // Ajouter la couche GeoJSON
    fetch('ressources/emprises.geojson')
      .then(response => response.json())
      .then(data => {
        const geojsonSource = new ol.source.Vector({
          features: new ol.format.GeoJSON().readFeatures(data, {
            featureProjection: 'EPSG:3857', // Projection Web Mercator
          }),
        });

        const geojsonLayer = new ol.layer.Vector({
          source: geojsonSource,
          style: feature => {
            const style = new ol.style.Style({
              fill: new ol.style.Fill({
                color: 'rgba(0, 123, 255, 0.2)', // Couleur des zones
              }),
              stroke: new ol.style.Stroke({
                color: '#007bff',
                width: 2,
              }),
              text: new ol.style.Text({
                text: feature.get('nom') || '', // Remplacer 'name' par le champ contenant l'étiquette
                font: 'bold 12px Arial',
                fill: new ol.style.Fill({
                  color: '#000',
                }),
                stroke: new ol.style.Stroke({
                  color: '#fff',
                  width: 2,
                }),
              }),
            });
            return style;
          },
        });

        map.addLayer(geojsonLayer);
      })
      .catch(error => console.error('Erreur lors du chargement du GeoJSON :', error));
  }



// Mise à jour option images juxtaposée ou côte côte:
// Variables pour les éléments
const toggleViewBtn = document.getElementById('toggle-view-btn');
const sideBySideView = document.getElementById('side-by-side-view');
const leftImage = document.getElementById('left-image');
const rightImage = document.getElementById('right-image');

// Flag pour savoir quel mode est actif
let isSideBySide = false;

// Fonction pour mettre à jour les images dans la vue côte à côte
function updateSideBySideImages() {
    const leftImageUrl = leftImageSelect.value
      ? `ressources/${currentZone}/${leftImageSelect.value}`
      : null;
    const rightImageUrl = rightImageSelect.value
      ? `ressources/${currentZone}/${rightImageSelect.value}`
      : null;
  
    if (leftImageUrl) {
      leftImage.src = leftImageUrl;
    } 
  
    if (rightImageUrl) {
      rightImage.src = rightImageUrl;
    }
  }


// Gestionnaire de clics pour le bouton de bascule
toggleViewBtn.addEventListener('click', () => {
    console.log(isSideBySide);
  if (isSideBySide) {
    // Passer au mode slider
    sideBySideView.style.display = 'none'; // Masquer la vue côte à côte
    juxtaposeDiv.style.display = 'block'; // Afficher le slider
    toggleViewBtn.textContent = 'Côte à côte';
    
    // Masquer les images pour la vue côte à côte
    leftImage.style.display = 'none';
    rightImage.style.display = 'none';
    
    // Réinitialiser le slider
    const sliderContainer = document.querySelector(juxtaposeSelector);
    sliderContainer.innerHTML = ''; // Réinitialiser le slider pour éviter les doublons
    
    // Recréer le slider
    const leftSrc = leftImageSelect.value ? `ressources/${currentZone}/${leftImageSelect.value}` : '';
    const rightSrc = rightImageSelect.value ? `ressources/${currentZone}/${rightImageSelect.value}` : '';
    if (leftSrc && rightSrc) {
      initializeJuxtapose(leftSrc, rightSrc); // Re-créer le slider avec les nouvelles images
    }
    
  } else {
    // Passer au mode côte à côte
    updateSideBySideImages(); // Mettre à jour les images pour le mode côte à côte
    sideBySideView.style.display = 'flex'; // Afficher la vue côte à côte
    juxtaposeDiv.style.display = 'none'; // Masquer le slider
    toggleViewBtn.textContent = 'Slider';
    
    // Masquer le slider
    const sliderContainer = document.querySelector(juxtaposeSelector);
    sliderContainer.innerHTML = ''; // Réinitialiser le slider

    leftImage.style.display = 'block';
    rightImage.style.display = 'block';
  }

  // Inverser le flag pour savoir quel mode est actif
  isSideBySide = !isSideBySide;
});


