let origImages = [
    {
        "src": "ressources/Zone1/MNSLHD-Cosia-Bati-Route.png",
        "label": "🗖"
    },
    {
        "src": "ressources/Zone1/MNTLHD-Cosia-Bati-Route.png",
        "label": "🗖"
    }
];

let origOptions = {
    "makeResponsive": true,
    "showLabels": true,
    "mode": "horizontal",
    "showCredits": false,
    "animate": true,
    "startingPosition": "60"
};

const juxtaposeSelector = "#juxtapose-embed";
const transientSelector = "#juxtapose-hidden";
var slider;

function replaceImage(LeftRight) {
    let leftImage = {
        label: "Description",
        credit: "LoremFlickr"
    };
    let rightImage = {
        label: "Description",
        credit: "LoremFlickr",
    };
    if (LeftRight === "Left") {
        leftImage.src = "ressources/Zone2/MNS-Cosia_3.png";
        rightImage.src = slider.imgAfter.image.src;
    } else if (LeftRight === "Right") {
        leftImage.src = slider.imgBefore.image.src;
        rightImage.src = "ressources/Zone2/MNS-OCSGE.png";
    }
    let images = [leftImage, rightImage];
    let options = slider.options;
    options.callback = function(obj) {
        var newNode = document.getElementById(obj.selector.substring(1));
        var oldNode = document.getElementById(juxtaposeSelector.substring(1));
        oldNode.replaceChild(newNode.children[0], oldNode.children[0]);
        newNode.removeChild(newNode.children[0]);
    };
    options.startingPosition = slider.sliderPosition;
    slider = new juxtapose.JXSlider(transientSelector, images, options);
};

function replaceLeft(e) {
    e.preventDefault();
    replaceImage("Left");
}

function replaceRight(e) {
    e.preventDefault();
    replaceImage("Right");
}

(function() {
    slider = new juxtapose.JXSlider(
        juxtaposeSelector, origImages, origOptions);
    document.getElementById("left-button").onclick = replaceLeft;
    document.getElementById("right-button").onclick = replaceRight;
})();




// Récupération des éléments
const buttons = document.querySelectorAll(".zone-btn"); // Les boutons de sélection des zones
const leftImageSelect = document.getElementById("left-image-select");
const rightImageSelect = document.getElementById("right-image-select");

// Les boutons des zones
const zone1Button = document.getElementById("zone1-label");
const zone2Button = document.getElementById("zone2-label");
const zone3Button = document.getElementById("zone3-label");

// Données des images pour chaque zone
const imageData = {
    "Zone 1": ["MNSLHD-Cosia-Bati-Route.png", "MNTLHD-Cosia-Bati-Route.png"],
    "Zone 2": ["MNS-Cosia_3.png", "MNS-OCSGE.png"],
    "Zone 3": ["MNS-Cosia_2.png", "MNS-Cosia.png"]
};

// // Zone actuelle
// let currentZone = "Zone 1"; // Zone par défaut

// // Fonction pour mettre à jour les options du menu déroulant et les images
// const updateSelectOptions = (zone) => {
//     const options = imageData[zone] || [];
//     leftImageSelect.innerHTML = "";
//     rightImageSelect.innerHTML = "";

//     // Ajout des options dans les menus déroulants
//     options.forEach(image => {
//     const leftOption = document.createElement("option");
//     const rightOption = document.createElement("option");

//     leftOption.value = image;
//     rightOption.value = image;

//     leftOption.textContent = image;
//     rightOption.textContent = image;

//     leftImageSelect.appendChild(leftOption);
//     rightImageSelect.appendChild(rightOption);
//     });

//     // Par défaut, sélectionner les premières images
//     if (options.length > 0) {
//     image1.src = `ressources/${zone}/${options[0]}`;
//     image2.src = `ressources/${zone}/${options[1]}`;
//     leftImageSelect.value = options[0];
//     rightImageSelect.value = options[1];
//     }
// };

// // Initialiser avec Zone 1
// updateSelectOptions(currentZone);

// // Fonction pour copier le texte dans le presse-papier
// const copyTextToClipboard = (text) => {
//     navigator.clipboard.writeText(text).then(() => {
//     alert("Texte copié dans le presse-papier : " + text);
//     }).catch((err) => {
//     console.error("Erreur lors de la copie dans le presse-papier: ", err);
//     });
// };

// // Gestionnaire d'événements pour changer de zone
// buttons.forEach(button => {
//     button.addEventListener("click", () => {
//     currentZone = button.getAttribute("data-zone"); // Récupérer la zone
//     updateSelectOptions(currentZone); // Mettre à jour les images

//     // Désélectionner les autres boutons (pour éviter les conflits visuels)
//     buttons.forEach(btn => btn.classList.remove("active"));
//     button.classList.add("active");

//     // Rafraîchir l'effet juxtapose
//     window.juxtapose.scanPage();
//     });
// });

// // Mettre à jour les images en fonction des sélections dans les menus déroulants
// leftImageSelect.addEventListener("change", () => {
//     image1.src = `ressources/${currentZone}/${leftImageSelect.value}`;
//     window.juxtapose.scanPage();
// });

// rightImageSelect.addEventListener("change", () => {
//     image2.src = `ressources/${currentZone}/${rightImageSelect.value}`;
//     window.juxtapose.scanPage();
// });

// // Gestionnaire d'événements pour copier les coordonnées de chaque zone
// zone1Button.addEventListener("click", () => {
//     const textToCopy = "(45.580527 , 6.151173)";
//     copyTextToClipboard(textToCopy);
// });

// zone2Button.addEventListener("click", () => {
//     const textToCopy = "(45.580123 , 6.151456)";
//     copyTextToClipboard(textToCopy);
// });

// zone3Button.addEventListener("click", () => {
//     const textToCopy = "(45.580789 , 6.152321)";
//     copyTextToClipboard(textToCopy);
// });









// // Fonction pour charger les descriptions depuis le fichier JSON
// async function loadDescriptions() {
// const response = await fetch('ressources/description.json');
// const descriptions = await response.json();
// return descriptions;
// }

// // Fonction pour mettre à jour la description en fonction de l'image sélectionnée
// function updateDescription(zone, imageName) {
// loadDescriptions().then(descriptions => {
//     const zoneData = descriptions[zone];
//     const imageData = zoneData.find(item => item.image === imageName);
//     if (imageData) {
//     document.getElementById('info-btn').textContent = imageData.description;
//     }
// });
// }

// // Ajout de l'événement pour mettre à jour la description lors de la sélection de l'image
// document.getElementById('left-image-select').addEventListener('change', function() {
// const zone = document.querySelector('input[name="zone"]:checked').id;
// const selectedImage = this.value; // Valeur de l'image sélectionnée
// updateDescription(zone, selectedImage);
// });

// // Initialiser la description avec l'image par défaut
// document.addEventListener('DOMContentLoaded', function() {
// updateDescription('Zone 1', 'MNSLHD-Cosia-Bati-Route.png');
// });