/*
ENSG
LNG MIN 2.5640172
LAT MIN 48.8392545
LNG MAX 2.5911272
LAT MAX 48.8573389

*/

const coordinates = [
    [2.5640172, 48.8573389],  // Coin nord-ouest
    [2.5911272, 48.8573389],  // Coin sud-ouest
    [2.5911272, 48.8392545],  // Coin sud-est
    [2.5640172, 48.8392545]   // Coin nord-est
];



const map = new maplibregl.Map({
    container: 'map',
    style: 'style/sanstoponyme.json',
    center: [2.6, 48.82], 
    zoom: 13 
});

map.addControl(new maplibregl.NavigationControl());

const frameCount = 5;
let currentImage = 0;

    
function getPath() {
    return (
        `https://maplibre.org/maplibre-gl-js/docs/assets/ombre${
            currentImage
        }.gif`
    );
}


map.on('load', () => {

    map.addSource('geotiff-tiles', {
        type: 'raster',
        tiles: [
            './tuiles/{z}/{x}/{y}.png' // Chemin vers vos tuiles
        ],
        tileSize: 256, // Taille des tuiles
        maxzoom: 16, // Zoom maximal des tuiles (ajustez en fonction de votre export)
    });

    // Ajouter la couche raster pour afficher les tuiles
    map.addLayer(
        {
            id: 'geotiff-layer',
            type: 'raster',
            source: 'geotiff-tiles',
            paint: {
                'raster-opacity': 0.7 // Ajustez l'opacité si nécessaire
            }
        }
    );
    
    // // URL de l'image PNG
    // const imageUrl = './geotiffs/ENSG.png'; // Remplacez ceci par l'URL réelle

    // // Ajouter l'image comme une source
    // map.addSource('custom-image', {
    //     type: 'image',
    //     url: imageUrl,
    //     coordinates: coordinates
    // });

    // // Ajouter le calque qui utilise cette image
    // map.addLayer({
    //     id: 'custom-image-layer',
    //     type: 'raster',
    //     source: 'custom-image',
    //     paint: {
    //         'raster-opacity': 0.9 // Ajustez l'opacité si nécessaire
    //     }
    // });


    // map.addSource('ombre', {
    //     type: 'image',
    //     url: getPath(),
    //     coordinates: [
    //         [2.5775748, 48.8483687],
    //         [2.5911511, 48.8483687],
    //         [2.5912497, 48.8393901],
    //         [2.5776194, 48.8393241]
    //     ]
    // });
    // map.addLayer({
    //     id: 'ombre-layer',
    //     'type': 'raster',
    //     'source': 'ombre',
    //     'paint': {
    //         'raster-fade-duration': 0
    //     }
    // });

    // setInterval(() => {
    //     currentImage = (currentImage + 1) % frameCount;
    //     //map.getSource('ombre').updateImage({url: getPath()});
    //     map.getSource('ombre').updateImage({url: './geotiffs/mns.png'});
    // }, 200);

    // map.addSource('shadow', {
    //     type: 'image',
    //     url: './geotiffs/ENSG.png', 
    //     coordinates: [
    //         [2.5775748, 48.8483687],
    //         [2.5911511, 48.8483687],
    //         [2.5912497, 48.8393901],
    //         [2.5776194, 48.8393241]
    //     ]
    // });

    
    // map.addLayer({
    //     id: 'shadow-layer',
    //     type: 'raster',
    //     source: 'shadow',
    //     paint: {
    //         'raster-fade-duration': 0
    //     }
    // });

    // setInterval(() => {
    //     currentImage = (currentImage + 1) % frameCount;
    //     //map.getSource('shadow').updateImage({url: getPath()});
    //     map.getSource('shadow').updateImage({url: './geotiffs/ENSG.png'});
    // }, 200);

    // fetch('style/style.json')
    //     .then(response => response.json())
    //     .then(style => {
    //         // Appliquer une transparence générale de 30 % à toutes les couches
    //         style.layers.forEach(layer => {
    //             if (!layer.paint) layer.paint = {};
    
    //             // Appliquer une opacité générale pour tous les types de couches
    //             for (const key in layer.paint) {
    //                 if (key.endsWith('-opacity')) {
    //                     layer.paint[key] *= 0.7; // Réduit l'opacité à 70 % (30 % de transparence)
    //                 }
    //             }
    //         });
    
    //         // Ajouter les couches avec transparence à la carte
    //         style.layers.forEach(layer => {
    //             if (layer.id && layer.source) {
    //                 map.addLayer(layer);
    //             }
    //         });
    //     })
    //     .catch(error => {
    //         console.error("Erreur lors du chargement du style des toponymes :", error);
    //     });

        // fetch('style/toponymes.json')
        // .then(response => response.json())
        // .then(style => {
        //     // Ajouter chaque couche de `toponymes.json` au-dessus de la carte existante
        //     style.layers.forEach(layer => {
        //         // Ajout de chaque couche du fichier toponymes.json
        //         if (layer.id && layer.source) {
        //             map.addLayer(layer); // Ajoute la couche telle quelle
        //         }
        //     });
        // })
        // .catch(error => {
        //     console.error("Erreur lors du chargement du style des toponymes:", error);
        // });
    
});