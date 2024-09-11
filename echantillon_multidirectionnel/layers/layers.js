var wms_layers = [];

var lyr_GEBCO_0 = new ol.layer.Image({
                            opacity: 1,
                            title: "GEBCO",
                            
                            
                            source: new ol.source.ImageStatic({
                               url: "./layers/GEBCO_0.png",
    attributions: ' ',
                                projection: 'EPSG:3857',
                                alwaysInRange: true,
                                imageExtent: [-1669792.361899, 3503549.843504, 2226389.815865, 7361866.113051]
                            })
                        });
var lyr_TeintesOcans_1 = new ol.layer.Image({
                            opacity: 1,
                            title: "Teintes Océans",
                            
                            
                            source: new ol.source.ImageStatic({
                               url: "./layers/TeintesOcans_1.png",
    attributions: ' ',
                                projection: 'EPSG:3857',
                                alwaysInRange: true,
                                imageExtent: [-1669792.361899, 3503549.843504, 2226389.815865, 7361866.113051]
                            })
                        });
var lyr_GEBCOTerrainSculptor_2 = new ol.layer.Image({
                            opacity: 1,
                            title: "GEBCO - Terrain Sculptor",
                            
                            
                            source: new ol.source.ImageStatic({
                               url: "./layers/GEBCOTerrainSculptor_2.png",
    attributions: ' ',
                                projection: 'EPSG:3857',
                                alwaysInRange: true,
                                imageExtent: [-1669792.361899, 3503549.843504, 2226389.815866, 7361866.113051]
                            })
                        });
var lyr_TeintesPE_3 = new ol.layer.Image({
                            opacity: 1,
                            title: "Teintes PE",
                            
                            
                            source: new ol.source.ImageStatic({
                               url: "./layers/TeintesPE_3.png",
    attributions: ' ',
                                projection: 'EPSG:3857',
                                alwaysInRange: true,
                                imageExtent: [-1669792.361899, 3503549.843504, 2226389.815865, 7361866.113051]
                            })
                        });
var lyr_TerrainSculptorKarika_4 = new ol.layer.Image({
                            opacity: 1,
                            title: "TerrainSculptor&Karika",
                            
                            
                            source: new ol.source.ImageStatic({
                               url: "./layers/TerrainSculptorKarika_4.png",
    attributions: ' ',
                                projection: 'EPSG:3857',
                                alwaysInRange: true,
                                imageExtent: [667905.812811, 5621505.743252, 779247.567502, 5780365.245341]
                            })
                        });
var lyr_Karika50_5 = new ol.layer.Image({
                            opacity: 1,
                            title: "Karika 50",
                            
                            
                            source: new ol.source.ImageStatic({
                               url: "./layers/Karika50_5.png",
    attributions: ' ',
                                projection: 'EPSG:3857',
                                alwaysInRange: true,
                                imageExtent: [667905.812811, 5621505.743252, 779247.567502, 5780365.245341]
                            })
                        });
var lyr_Karika20_6 = new ol.layer.Image({
                            opacity: 1,
                            title: "Karika 20",
                            
                            
                            source: new ol.source.ImageStatic({
                               url: "./layers/Karika20_6.png",
    attributions: ' ',
                                projection: 'EPSG:3857',
                                alwaysInRange: true,
                                imageExtent: [667901.483719, 5621499.621006, 779251.896593, 5780371.477326]
                            })
                        });
var lyr_SRTM_30m_7 = new ol.layer.Image({
                            opacity: 1,
                            title: "SRTM_30m",
                            
                            
                            source: new ol.source.ImageStatic({
                               url: "./layers/SRTM_30m_7.png",
    attributions: ' ',
                                projection: 'EPSG:3857',
                                alwaysInRange: true,
                                imageExtent: [667901.483719, 5621499.621006, 779251.896593, 5780371.477326]
                            })
                        });
var lyr_Teintes_8 = new ol.layer.Image({
                            opacity: 1,
                            title: "Teintes",
                            
                            
                            source: new ol.source.ImageStatic({
                               url: "./layers/Teintes_8.png",
    attributions: ' ',
                                projection: 'EPSG:3857',
                                alwaysInRange: true,
                                imageExtent: [667905.812811, 5621505.743252, 779247.567502, 5780365.245341]
                            })
                        });
var format_NationalesAutoroutesbis_9 = new ol.format.GeoJSON();
var features_NationalesAutoroutesbis_9 = format_NationalesAutoroutesbis_9.readFeatures(json_NationalesAutoroutesbis_9, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_NationalesAutoroutesbis_9 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_NationalesAutoroutesbis_9.addFeatures(features_NationalesAutoroutesbis_9);
var lyr_NationalesAutoroutesbis_9 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_NationalesAutoroutesbis_9, 
                style: style_NationalesAutoroutesbis_9,
                popuplayertitle: "NationalesAutoroutesbis",
                interactive: false,
                title: '<img src="styles/legend/NationalesAutoroutesbis_9.png" /> NationalesAutoroutesbis'
            });
var format_hotelsdeprefecturesfrhotels_de_prefectures_FR_10 = new ol.format.GeoJSON();
var features_hotelsdeprefecturesfrhotels_de_prefectures_FR_10 = format_hotelsdeprefecturesfrhotels_de_prefectures_FR_10.readFeatures(json_hotelsdeprefecturesfrhotels_de_prefectures_FR_10, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_hotelsdeprefecturesfrhotels_de_prefectures_FR_10 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_hotelsdeprefecturesfrhotels_de_prefectures_FR_10.addFeatures(features_hotelsdeprefecturesfrhotels_de_prefectures_FR_10);
var lyr_hotelsdeprefecturesfrhotels_de_prefectures_FR_10 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_hotelsdeprefecturesfrhotels_de_prefectures_FR_10, 
                style: style_hotelsdeprefecturesfrhotels_de_prefectures_FR_10,
                popuplayertitle: "hotels-de-prefectures-fr — hotels_de_prefectures_FR",
                interactive: false,
                title: '<img src="styles/legend/hotelsdeprefecturesfrhotels_de_prefectures_FR_10.png" /> hotels-de-prefectures-fr — hotels_de_prefectures_FR'
            });
var group_Karitra = new ol.layer.Group({
                                layers: [lyr_TerrainSculptorKarika_4,lyr_Karika50_5,lyr_Karika20_6,lyr_SRTM_30m_7,lyr_Teintes_8,],
                                fold: "open",
                                title: "Karitra"});

lyr_GEBCO_0.setVisible(true);lyr_TeintesOcans_1.setVisible(true);lyr_GEBCOTerrainSculptor_2.setVisible(true);lyr_TeintesPE_3.setVisible(true);lyr_TerrainSculptorKarika_4.setVisible(true);lyr_Karika50_5.setVisible(true);lyr_Karika20_6.setVisible(true);lyr_SRTM_30m_7.setVisible(true);lyr_Teintes_8.setVisible(true);lyr_NationalesAutoroutesbis_9.setVisible(true);lyr_hotelsdeprefecturesfrhotels_de_prefectures_FR_10.setVisible(true);
var layersList = [lyr_GEBCO_0,lyr_TeintesOcans_1,lyr_GEBCOTerrainSculptor_2,lyr_TeintesPE_3,group_Karitra,lyr_NationalesAutoroutesbis_9,lyr_hotelsdeprefecturesfrhotels_de_prefectures_FR_10];
lyr_NationalesAutoroutesbis_9.set('fieldAliases', {'ID_RTE500': 'ID_RTE500', 'VOCATION': 'VOCATION', 'NB_CHAUSSE': 'NB_CHAUSSE', 'NB_VOIES': 'NB_VOIES', 'ETAT': 'ETAT', 'ACCES': 'ACCES', 'RES_VERT': 'RES_VERT', 'SENS': 'SENS', 'NUM_ROUTE': 'NUM_ROUTE', 'RES_EUROPE': 'RES_EUROPE', 'LONGUEUR': 'LONGUEUR', 'CLASS_ADM': 'CLASS_ADM', });
lyr_hotelsdeprefecturesfrhotels_de_prefectures_FR_10.set('fieldAliases', {'DeptNum': 'DeptNum', 'Nom': 'Nom', 'Commune': 'Commune', 'DeptNom': 'DeptNom', 'LatDD': 'LatDD', 'LonDD': 'LonDD', });
lyr_NationalesAutoroutesbis_9.set('fieldImages', {'ID_RTE500': '', 'VOCATION': '', 'NB_CHAUSSE': '', 'NB_VOIES': '', 'ETAT': '', 'ACCES': '', 'RES_VERT': '', 'SENS': '', 'NUM_ROUTE': '', 'RES_EUROPE': '', 'LONGUEUR': '', 'CLASS_ADM': '', });
lyr_hotelsdeprefecturesfrhotels_de_prefectures_FR_10.set('fieldImages', {'DeptNum': 'TextEdit', 'Nom': 'TextEdit', 'Commune': 'TextEdit', 'DeptNom': 'TextEdit', 'LatDD': 'TextEdit', 'LonDD': 'TextEdit', });
lyr_NationalesAutoroutesbis_9.set('fieldLabels', {'ID_RTE500': 'no label', 'VOCATION': 'no label', 'NB_CHAUSSE': 'no label', 'NB_VOIES': 'no label', 'ETAT': 'no label', 'ACCES': 'no label', 'RES_VERT': 'no label', 'SENS': 'no label', 'NUM_ROUTE': 'no label', 'RES_EUROPE': 'no label', 'LONGUEUR': 'no label', 'CLASS_ADM': 'no label', });
lyr_hotelsdeprefecturesfrhotels_de_prefectures_FR_10.set('fieldLabels', {'DeptNum': 'inline label - visible with data', 'Nom': 'header label - always visible', 'Commune': 'no label', 'DeptNom': 'no label', 'LatDD': 'no label', 'LonDD': 'no label', });
lyr_hotelsdeprefecturesfrhotels_de_prefectures_FR_10.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});