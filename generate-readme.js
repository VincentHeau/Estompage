const fs = require('fs');
const path = require('path');

// Chemin vers le fichier description.json
const descriptionsPath = path.join(__dirname, 'description.json');
const readmePath = path.join(__dirname, 'README.md');

// Lire le fichier description.json
fs.readFile(descriptionsPath, 'utf-8', (err, data) => {
  if (err) {
    console.error('Erreur lors de la lecture de description.json:', err);
    return;
  }

  const descriptions = JSON.parse(data);

  let readmeContent = `# Documentation des Zones et Images\n\nVoici les descriptions des images pour chaque zone.\n`;

  // Parcourir les zones et leurs images
  for (const zone in descriptions) {
    readmeContent += `## ${zone}\n\n`;

    descriptions[zone].forEach(image => {
      readmeContent += `![${image.src}](ressources/${zone}/${image.src})\n\n`;
      readmeContent += `### Description :\n${image.description}\n\n`;
    });
  }

  // Écrire le contenu dans README.md
  fs.writeFile(readmePath, readmeContent, (err) => {
    if (err) {
      console.error('Erreur lors de l\'écriture dans README.md:', err);
    } else {
      console.log('README.md mis à jour avec les descriptions des images.');
    }
  });
});
