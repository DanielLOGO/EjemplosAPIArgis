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
        loadModules(['esri/Map','esri/views/MapView',
          "esri/layers/FeatureLayer"], {
            css: true
          })
          .then(([ArcGISMap, MapView, MapImageLayer,            
            FeatureLayer]) => {
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
            let layer = new MapImageLayer({
              url: "https://procesosags.sigsa.info/server/rest/services/Francisco_Lopez/MarginacionMexico/MapServer"
            });
            map.add(layer);  // adds the layer to the map
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