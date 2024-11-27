// script.js
document.addEventListener("DOMContentLoaded", () => {
    const slider = document.querySelector(".slider");
    const imageAfter = document.querySelector(".image-after");
    const zoneButtons = document.querySelectorAll(".zone-btn");
  
    // Slider pour effet avant-après
    slider.addEventListener("input", (e) => {
      const sliderValue = e.target.value;
      imageAfter.style.clipPath = `inset(0 ${100 - sliderValue}% 0 0)`;
    });
  
    // Gestion du changement de zone
    zoneButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const zone = e.target.dataset.zone;
        // Charger les images pour la zone sélectionnée
        document.querySelector(".image-before").src = `zone${zone}_avant.jpg`;
        document.querySelector(".image-after").src = `zone${zone}_apres.jpg`;
      });
    });
  });
  