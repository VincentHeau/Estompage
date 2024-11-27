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
    const selectedImage = imageData[currentZone].find(
        image => image.src === leftImageSelect.value
    );
    const leftSrc = `ressources/${currentZone}/${leftImageSelect.value}`;
    const rightSrc = slider.imgAfter.image.src; // Garder l'image de droite actuelle
    initializeJuxtapose(leftSrc, rightSrc);


    // Mettre à jour le tooltip du bouton de gauche
    const leftDescription = selectedImage?.description || "Description indisponible";
    leftInfoButton.title = leftDescription;
});

rightImageSelect.addEventListener("change", () => {
    const rightSrc = `ressources/${currentZone}/${rightImageSelect.value}`;
    const leftSrc = slider.imgBefore.image.src; // Garder l'image de gauche actuelle
    initializeJuxtapose(leftSrc, rightSrc);

    // Mettre à jour le tooltip du bouton de droite
    const rightDescription = selectedImage?.description || "Description indisponible";
    rightInfoButton.title = rightDescription;
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
