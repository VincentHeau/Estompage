document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".zone-btn");
    const leftImageSelect = document.getElementById("left-image-select");
    const rightImageSelect = document.getElementById("right-image-select");
    const image1 = document.getElementById("image1");
    const image2 = document.getElementById("image2");
  
    let currentZone = "Zone 1"; // Zone par défaut
    const imageData = {
        "Zone 1": ["MNSLHD-Cosia-Bati-Route.png", "MNTLHD-Cosia-Bati-Route.png"],
        "Zone 2": ["MNS-Cosia_3.png", "MNS-OCSGE.png"],
        "Zone 3": ["MNS-Cosia_2.png", "MNS-Cosia.png"]
      };
    
  
    // Fonction pour mettre à jour les options du menu déroulant
    const updateSelectOptions = (zone) => {
      const options = imageData[zone] || [];
      leftImageSelect.innerHTML = "";
      rightImageSelect.innerHTML = "";
  
      options.forEach(image => {
        const leftOption = document.createElement("option");
        const rightOption = document.createElement("option");
  
        leftOption.value = image;
        rightOption.value = image;
  
        leftOption.textContent = image;
        rightOption.textContent = image;
  
        leftImageSelect.appendChild(leftOption);
        rightImageSelect.appendChild(rightOption);
      });
  
      // Par défaut, sélectionner la première image
      if (options.length > 0) {
        image1.src = `ressources/${zone}/${options[0]}`;
        image2.src = `ressources/${zone}/${options[1]}`;
        leftImageSelect.value = options[0];
        rightImageSelect.value = options[1];
      }
    };
  
    // Initialiser avec Zone 1
    updateSelectOptions(currentZone);
  
    // Changer de zone
    buttons.forEach(button => {
      button.addEventListener("click", () => {
        currentZone = button.getAttribute("data-zone");
        updateSelectOptions(currentZone);
        window.juxtapose.scanPage();
      });
    });
  
    // Changer les images en fonction des sélections
    leftImageSelect.addEventListener("change", () => {
      image1.src = `ressources/${currentZone}/${leftImageSelect.value}`;
      window.juxtapose.scanPage();
    });
  
    rightImageSelect.addEventListener("change", () => {
      image2.src = `ressources/${currentZone}/${rightImageSelect.value}`;
      window.juxtapose.scanPage();
    });
  });
  