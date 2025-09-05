var zoom = 2,
  center = [0, 0];

// Set up the Tile Server layer
var myTileServer = new ol.layer.Tile({
  preload: Infinity,
  source: new ol.source.OSM({
    crossOrigin: null,
    url: "osm_tiles/{z}/{x}/{y}.png",
  }),
});

// Set up the OSM layer
var openStreetMap = new ol.layer.Tile({
  preload: Infinity,
  source: new ol.source.OSM({
    crossOrigin: null,
    url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  }),
});

if (window.location.hash !== "") {
  var hash = window.location.hash.replace("#", "");
  var parts = hash.split(";");
  if (parts.length === 3) {
    zoom = parseInt(parts[0], 10);
    center = [parseFloat(parts[2]), parseFloat(parts[1])];
  }
}

// Set up the default view
var myTileView = new ol.View({
  center: ol.proj.transform(center, "EPSG:4326", "EPSG:3857"),
  zoom: zoom,
});

// Create the map
var map = new ol.Map({
  layers: [myTileServer, openStreetMap],
  loadTilesWhileInteracting: true,
  target: "map",
  controls: ol.control.defaults().extend([
    new ol.control.ScaleLine(),
    new ol.control.Zoom(),
    new ol.control.ZoomSlider(),
    new ol.control.ZoomToExtent(),
    new ol.control.FullScreen({
      className: "ol-fullscreen ol-custom-fullscreen",
    }),
    new ol.control.OverviewMap({
      className: "ol-overviewmap ol-custom-overviewmap",
    }),
    new ol.control.MousePosition({
      className: "ol-mouse-position ol-custom-mouse-position3857",
      coordinateFormat: ol.coordinate.createStringXY(4),
      projection: "EPSG:3857",
      undefinedHTML: "&nbsp;",
    }),
    new ol.control.MousePosition({
      coordinateFormat: function (coord) {
        return ol.coordinate.toStringHDMS(coord);
      },
      projection: "EPSG:4326",
      className: "ol-mouse-position ol-custom-mouse-positionHDMS",
      target: document.getElementById("mouse-position"),
      undefinedHTML: "&nbsp;",
    }),
    new ol.control.MousePosition({
      className: "ol-mouse-position ol-custom-mouse-positionXY",
      coordinateFormat: ol.coordinate.createStringXY(4),
      projection: "EPSG:4326",
      undefinedHTML: "&nbsp;",
    }),
  ]),
  view: myTileView,
});
map.on("moveend", function () {
  var view = map.getView();
  var center = ol.proj.transform(view.getCenter(), "EPSG:3857", "EPSG:4326");
  var zoom = view.getZoom();
  var zoomInfo = "Zoom level = " + zoom;
  document.getElementById("ZoomElement").innerHTML = zoomInfo;
  window.location.hash =
    view.getZoom() +
    ";" +
    Math.round(center[1] * 1000000) / 1000000 +
    ";" +
    Math.round(center[0] * 1000000) / 1000000;
});

var swipe = document.getElementById("swipe");

openStreetMap.on("precompose", function (event) {
  var ctx = event.context;
  var width = ctx.canvas.width * (swipe.value / 100);

  ctx.save();
  ctx.beginPath();
  ctx.rect(width, 0, ctx.canvas.width - width, ctx.canvas.height);
  ctx.clip();
});

openStreetMap.on("postcompose", function (event) {
  var ctx = event.context;
  ctx.restore();
});

swipe.addEventListener(
  "input",
  function () {
    map.render();
  },
  false
);
