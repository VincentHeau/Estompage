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
        `https://maplibre.org/maplibre-gl-js/docs/assets/radar${
            currentImage
        }.gif`
    );
}


map.on('load', () => {
    
    map.addSource('radar', {
        type: 'image',
        url: getPath(),
        coordinates: [
            [2.5775748, 48.8483687],
            [2.5911511, 48.8483687],
            [2.5912497, 48.8393901],
            [2.5776194, 48.8393241]
        ]
    });
    map.addLayer({
        id: 'radar-layer',
        'type': 'raster',
        'source': 'radar',
        'paint': {
            'raster-fade-duration': 0
        }
    });

    setInterval(() => {
        currentImage = (currentImage + 1) % frameCount;
        //map.getSource('radar').updateImage({url: getPath()});
        map.getSource('radar').updateImage({url: 'http://localhost:8000/grande_echelle/geotiffs/mns.png'});
    }, 200);

    map.addSource('shadow', {
        type: 'image',
        url: 'http://localhost:8000/grande_echelle/geotiffs/shadow.png', 
        coordinates: [
            [2.5775748, 48.8483687],
            [2.5911511, 48.8483687],
            [2.5912497, 48.8393901],
            [2.5776194, 48.8393241]
        ]
    });

    
    map.addLayer({
        id: 'shadow-layer',
        type: 'raster',
        source: 'shadow',
        paint: {
            'raster-fade-duration': 0
        }
    });


    fetch('style/toponymes.json')
        .then(response => response.json())
        .then(style => {
            // Ajouter chaque couche de `toponymes.json` au-dessus de la carte existante
            style.layers.forEach(layer => {
                // Ajout de chaque couche du fichier toponymes.json
                if (layer.id && layer.source) {
                    map.addLayer(layer); // Ajoute la couche telle quelle
                }
            });
        })
        .catch(error => {
            console.error("Erreur lors du chargement du style des toponymes:", error);
        });
});