<template>
  <div id="viewDiv" class="balt-theme"></div>
</template>
<script>
  /* eslint-disable */
  import { loadModules } from 'esri-loader';
  export default {
    mounted() {
      this.loadMap();
    },
    methods: {
      loadMap() {
        loadModules(['esri/Map','esri/views/MapView',"esri/layers/MapImageLayer",
        "esri/rest/identify","esri/rest/support/IdentifyParameters",
        "esri/widgets/Search","esri/layers/FeatureLayer"], {
            css: true
          })
          .then(([ArcGISMap, MapView, MapImageLayer,
          identify,IdentifyParameters,
          Search,FeatureLayer]) => {
            // create map with the given options
            const map = new ArcGISMap({
              basemap: 'topo-vector' //topo-vector.-.-.-.-..streets-navigation-vector
            });
            // assign map to this view
            const view = new MapView({
              container: "viewDiv",
              map: map,
              center: [-99, 19],
              zoom: 6
            });
            // points to the states layer in a service storing U.S. census data
            const edoDiv = {
              type: "simple", // autocasts as new SimpleRenderer()
              symbol: {
                type: "simple-fill", // autocasts as new SimpleFillSymbol()
                style: "none",
                outline: {
                  width: 1,
                  color: "blue"
                }
              },
              label: "Edo Div"
            };
            const munDiv = {
              type: "simple", // autocasts as new SimpleRenderer()
              symbol: {
                type: "simple-fill", // autocasts as new SimpleFillSymbol()
                style: "none",
                outline: {
                  width: 1,
                  color: "red"
                }
              },
              label: "Mun Div"
            };
            const layer = new MapImageLayer({
              url: "https://procesosags.sigsa.info/server/rest/services/Francisco_Lopez/MarginacionMexico/MapServer",
              sublayers:[
                {
                  id: 0,
                  renderer: edoDiv,
                  opacity: 0.5,
                  minScale: 9250000,
                  // labelingInfo autocasts to an array of LabelClass objects
                  labelingInfo: [
                    {
                      labelExpression: "[ENTIDAD]",
                      labelPlacement: "always-horizontal",
                      symbol: {
                        type: "text", // autocasts as new TextSymbol()
                        color: [255, 255, 255, 0.7],
                        haloColor: [0, 0, 0, 0.7],
                        haloSize: 1,
                        font: {
                          size: 11
                        }
                      },
                      minScale: 2400000,
                      maxScale: 73000
                    }
                  ]
                },
                {
                  id: 1,
                  renderer: munDiv,
                  opacity: 0.5,
                  minScale: 9250000,
                  // labelingInfo autocasts to an array of LabelClass objects
                  labelingInfo: [
                    {
                      labelExpression: "[ENTIDAD]",
                      labelPlacement: "always-horizontal",
                      symbol: {
                        type: "text", // autocasts as new TextSymbol()
                        color: [255, 255, 255, 0.7],
                        haloColor: [0, 0, 0, 0.7],
                        haloSize: 1,
                        font: {
                          size: 11
                        }
                      },
                      minScale: 2400000,
                      maxScale: 73000
                    }
                  ]
                }
              ]
            });
            map.add(layer);  // adds the layer to the map
                //popup prueba
                  var params;
                  // URL to the map service where the identify will be performed
                  var identifyURL = "https://procesosags.sigsa.info/server/rest/services/Francisco_Lopez/MarginacionMexico/MapServer";
                  view.when(function() {
                    // executeIdentify() is called each time the view is clicked
                    view.on("click", executeIdentify);
                    // Set the parameters for the identify
                    params = new IdentifyParameters();
                    params.tolerance = 3;
                    params.layerIds = [0, 1, 2, 3, 4];
                    params.layerOption = "top";
                    params.width = view.width;
                    params.height = view.height;
                  });
                  function executeIdentify(event) {
                    // Set the geometry to the location of the view click
                    params.geometry = event.mapPoint;
                    params.mapExtent = view.extent;
                    document.getElementById("viewDiv").style.cursor = "wait";

                    // This function returns a promise that resolves to an array of features
                    // A custom popupTemplate is set for each feature based on the layer it
                    // originates from
                    identify.identify(identifyURL, params).then(function(response) {
                        var results = response.results;

                        return results.map(function(result) {
                          var feature = result.feature;
                          var layerName = result.layerName;

                          feature.attributes.layerName = layerName;
                            feature.popupTemplate = {
                              // autocasts as new PopupTemplate()
                              title: layerName,
                              content: "<b id=''>Estado: </b> {ENTIDAD}"+
                                "<br><b>Marginacion: </b> {GRA_MARG}"
                            };
                          return feature;
                        });
                      })
                      .then(showPopup); // Send the array of features to showPopup()

                    // Shows the results of the identify in a popup once the promise is resolved
                    function showPopup(response) {
                      if (response.length > 0) {
                        view.popup.open({
                          features: response,
                          //location: event.mapPoint
                        });
                      }
                      document.getElementById("viewDiv").style.cursor = "auto";
                    }
                  }
                //popup prueba
                //prueba serch
                const searchEdo = new Search({
                  view: view,
                  allPlaceholder: "Marginacion de Estados",
                  includeDefaultSources: false,
                  locationEnabled: false,
                  minSuggestCharacters: 5,
                  sources: [
                    {
                      layer: new FeatureLayer({
                        url: "https://procesosags.sigsa.info/server/rest/services/Francisco_Lopez/MarginacionMexico/MapServer/0",
                        outFields: ["*"]
                      }),
                      searchFields: ["ENTIDAD"], // ,"NOM_MUN"
                      suggestionTemplate:"{ENTIDAD}",
                      exactMatch: false,
                      outFields: ["*"],
                      placeHolder: "PUEBLA",
                      popupTemplate: {
                        title: "{ENTIDAD}",
                        content: "<p>Tiene una Area Territoreal de , <b>{AREA} Km</b>, y" +
                                  " Perimetro de <b>{PERIMETER} Km</b></p>" +
                                  "<ul><li>Estado: <b>{ENTIDAD}</b></li>" +
                                  "<li>Capital: <b>{CAPITAL}</b></li>" +
                                  "<li>Marginacion: <b>{GRA_MARG}</b></li>"+
                                  "<li>Total de Poblacion(2010): <b>{POB_TOT10}</b></li>"+
                                  "<li>Indicador de Marginada(2010): <b>{IND_MARG} %</b></li><ul>"
                      }
                    },
                    {
                    layer: new FeatureLayer({
                      url: "https://procesosags.sigsa.info/server/rest/services/Francisco_Lopez/MarginacionMexico/MapServer/1",
                      outFields: ["*"]
                    }),
                    searchFields: ["NOM_MUN"], // ,"NOM_MUN"
                    suggestionTemplate:"{NOM_MUN}",
                    exactMatch: false,
                    outFields: ["*"],
                    placeHolder: "PUEBLA",
                    popupTemplate: {
                      title: "{NOM_MUN}",
                      content: "<p>Tiene una Area Territoreal de , <b>{AREA} Km</b>, y" +
                                " Perimetro de <b>{PERIMETER} Km</b></p>" +
                                "<ul><li>Estado: <b>{NOM_MUN}</b></li>" +
                                "<li>Marginacion: <b>{GRA_MARG}</b></li>"+
                                "<li>Total de Poblacion(2010): <b>{POB_TOT10}</b></li>"+
                                "<li>Indicador de Marginada(2010): <b>{IND_MARG} %</b></li><ul>"
                    }
                  }
                  ]
                });        
                // Add the search widget to the top right corner of the view
                view.ui.add(searchEdo, {
                  position: "top-right"
                });                
                //prueba serch
          });
      }
    }
  }
</script>
<style>
  /* esri styles */
  @import url('https://js.arcgis.com/4.22/esri/themes/light/main.css');
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  #viewDiv {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
      .esri-popup .esri-popup-header .esri-title {
        font-size: 18px;
        font-weight: bolder;
      }

      .esri-popup .esri-popup-body .esri-popup-content {
        font-size: 14px;
      }
</style>