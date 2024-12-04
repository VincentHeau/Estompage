let imageData = {}; // le json des images

const leftImageSelect = document.getElementById("left-image-select");
const rightImageSelect = document.getElementById("right-image-select");
const leftInfoButton = document.getElementById("left-info-btn");
const rightInfoButton = document.getElementById("right-info-btn");
const empriseBtn = document.getElementById('emprise-btn');
const mapDiv = document.getElementById('map');
const juxtaposeDiv = document.getElementById('juxtapose-embed');
const imageSelectors = document.querySelector('.row.mb-4');

// Variables pour les éléments
const toggleViewBtn = document.getElementById('toggle-view-btn');
const sideBySideView = document.getElementById('side-by-side-view');
const leftImage = document.getElementById('left-image');
const rightImage = document.getElementById('right-image');


const juxtaposeSelector = "#juxtapose-embed";
let slider;
let currentZone = "Zone1"; // Zone par défaut à l'ouverture


// Slider Juxtapose en ligne
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

    // maj
    const container = document.querySelector(juxtaposeSelector);
    container.innerHTML = ""; 

    slider = new juxtapose.JXSlider(juxtaposeSelector, images, options);
}


/* Fonction pour maj les options du menu déroulant et afficher la description*/

function updateSelectOptions(zone) {
    const options = imageData[zone] || [];
    leftImageSelect.innerHTML = ""; 
    rightImageSelect.innerHTML = ""; 

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

    // initialisation juxtapose
    if (options.length > 0) {
        const leftSrc = `ressources/${zone}/${options[0].src}`;
        const rightSrc = `ressources/${zone}/${options[1].src}`;
        initializeJuxtapose(leftSrc, rightSrc);

        // description
        const leftDescription = options[0].description || "Description indisponible";
        const rightDescription = options[1]?.description || "Description indisponible";

        leftInfoButton.title = leftDescription;
        rightInfoButton.title = rightDescription;

        leftImageSelect.value = options[0].src;
        rightImageSelect.value = options[1].src;
    }
}

// gérer les boutons
document.querySelectorAll('input[name="zone"]').forEach(radio => {
    radio.addEventListener("change", () => {
        if (radio.checked) {
            const zoneId = radio.id.replace("zone", "Zone"); // convertir ID en nom de zone
            currentZone = zoneId;
            updateSelectOptions(currentZone); // maj les menus déroulants et le slider
            if (isSideBySide) {
              updateSideBySideImages();
            }
        }
    });
});

// maj du menu déroulant
leftImageSelect.addEventListener("change", () => {
    if (isSideBySide) {
        updateSideBySideImages();
      } else {
        const selectedImage = imageData[currentZone].find(
            image => image.src === leftImageSelect.value
        );
        const leftSrc = `ressources/${currentZone}/${leftImageSelect.value}`;
        const rightSrc = slider.imgAfter.image.src;
        initializeJuxtapose(leftSrc, rightSrc);


        
        const leftDescription = selectedImage?.description || "Description indisponible";
        leftInfoButton.title = leftDescription;
      }
});

// Même chose pour l'image de gauche
rightImageSelect.addEventListener("change", () => {
    if (isSideBySide) {
        updateSideBySideImages();
      } else {
        const selectedImage = imageData[currentZone].find(
            image => image.src === rightImageSelect.value
        );
        const rightSrc = `ressources/${currentZone}/${rightImageSelect.value}`;
        const leftSrc = slider.imgBefore.image.src; 
        initializeJuxtapose(leftSrc, rightSrc);

       
        const rightDescription = selectedImage?.description || "Description indisponible";
        rightInfoButton.title = rightDescription;
      }
});

// charger les données JSON et initialiser la page
fetch("ressources/description.json")
    .then(response => response.json())
    .then(data => {
        imageData = data; 
        updateSelectOptions(currentZone);
    })
    .catch(error => {
        console.error("Erreur lors du chargement des données JSON :", error);
    });


// Gestion de la carte de l'emprise

  let mapInitialized = false;
  let map;

  empriseBtn.addEventListener('click', () => {
    if (mapDiv.style.display === 'none') {
      mapDiv.style.display = 'block';
      juxtaposeDiv.style.display = 'none';
      imageSelectors.style.display = 'none';
      sideBySideView.style.display = 'none';
      empriseBtn.textContent = 'Masquer la carte';

      // Initialiser la carte si ce n'est pas encore fait
      if (!mapInitialized) {
        initializeMap();
        mapInitialized = true;
      }
    } else {
      mapDiv.style.display = 'none';
      juxtaposeDiv.style.display = 'block';
      sideBySideView.style.display = 'block';
      imageSelectors.style.display = 'flex';
      empriseBtn.textContent = 'Carte';
    }
  });

  function initializeMap() {
    map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM(), 
        }),
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([6.1, 45.68]), 
        zoom: 11, 
      }),
    });

    // fetch du geojson
    fetch('ressources/emprises.geojson')
      .then(response => response.json())
      .then(data => {
        const geojsonSource = new ol.source.Vector({
          features: new ol.format.GeoJSON().readFeatures(data, {
            featureProjection: 'EPSG:3857', // Projection Web Mercator = soucis avec le lambert
          }),
        });

        const geojsonLayer = new ol.layer.Vector({
          source: geojsonSource,
          style: feature => {
            const style = new ol.style.Style({
              fill: new ol.style.Fill({
                color: 'rgba(0, 123, 255, 0.2)', 
              }),
              stroke: new ol.style.Stroke({
                color: '#007bff',
                width: 2,
              }),
              text: new ol.style.Text({
                text: feature.get('nom') || '', 
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



/* Mise à jour option images juxtaposée ou côte côte*/


// variable pour savoir quel mode est actif
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


// Clics pour le bouton de bascule
toggleViewBtn.addEventListener('click', () => {
    console.log(isSideBySide);
  if (isSideBySide) {
    
    sideBySideView.style.display = 'none'; 
    juxtaposeDiv.style.display = 'block'; 
    toggleViewBtn.textContent = 'Côte à côte';

    leftImage.style.display = 'none';
    rightImage.style.display = 'none';
    
    const sliderContainer = document.querySelector(juxtaposeSelector);
    sliderContainer.innerHTML = ''; 
    
    const leftSrc = leftImageSelect.value ? `ressources/${currentZone}/${leftImageSelect.value}` : '';
    const rightSrc = rightImageSelect.value ? `ressources/${currentZone}/${rightImageSelect.value}` : '';
    if (leftSrc && rightSrc) {
      initializeJuxtapose(leftSrc, rightSrc); 
    }
    
  } else {
    updateSideBySideImages(); 
    sideBySideView.style.display = 'flex';
    juxtaposeDiv.style.display = 'none'; 
    toggleViewBtn.textContent = 'Slider';
    
    const sliderContainer = document.querySelector(juxtaposeSelector);
    sliderContainer.innerHTML = '';
    leftImage.style.display = 'block';
    rightImage.style.display = 'block';
  }

  
  isSideBySide = !isSideBySide;
});


