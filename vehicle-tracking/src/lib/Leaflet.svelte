<script lang="ts">
  // example: https://svelte.dev/playground/e1d146cf3f964533a1a296dc5e08436c?version=5.27.0

  import 'leaflet/dist/leaflet.css';
  import { CircleMarker, LeafletMap, Marker, Polygon, Popup, TileLayer, Tooltip } from 'svelte-leafletjs';
  import { onMount } from 'svelte';
  import { type Coordinates } from './types';
  import { type Msg, wsconnect } from '@nats-io/nats-core';
  import type { LatLngExpression } from 'leaflet';

  const options = { enableHighAccuracy: true, timeout: 2000, maximumAge: 0 };
  const natsOps = { name: 'demo', maxReconnectAttempts: -1, reconnectTimeWait: 2000 };
  const servers = ['wss://demo.nats.io:8443'];

  const TestData = {
    sentosaPolygon: [[1.2605024, 103.804856], [1.2595155, 103.8058001], [1.2572416, 103.8080317], [1.2555254, 103.808418], [1.2549247, 103.8096625], [1.2527365, 103.8122374], [1.2507629, 103.8157565], [1.2486177, 103.8189322], [1.2460862, 103.8224942], [1.2419673, 103.8262707], [1.2378055, 103.8309485], [1.2371619, 103.8328797], [1.2374194, 103.8341242], [1.2383204, 103.8351113], [1.2383204, 103.8356263], [1.238063, 103.8371712], [1.2398221, 103.8398749], [1.241195, 103.841334], [1.2435977, 103.8437373], [1.2460004, 103.8454539], [1.2487035, 103.8477713], [1.2523075, 103.8492304], [1.2535517, 103.8473851], [1.2536805, 103.845883], [1.2531227, 103.844381], [1.2528653, 103.8425786], [1.2541953, 103.8420636], [1.2540666, 103.8404757], [1.2545386, 103.838287], [1.2538092, 103.8371283], [1.2537234, 103.8350684], [1.255225, 103.8321501], [1.2550534, 103.829189], [1.2556112, 103.8254124], [1.2581855, 103.8233954], [1.2601591, 103.8198763], [1.2608027, 103.8168294], [1.2596443, 103.8136965], [1.2605024, 103.804856]]
  };

  const mapOptions = {
    center: [21.144306574927402, -86.78792794787886],
    zoom: 13
  };
  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const tileLayerOptions = {
    minZoom: 0,
    maxZoom: 20,
    maxNativeZoom: 19,
    attribution: '© OpenStreetMap contributors'
  };

  let leafletMap;
  let currentPosition: LatLngExpression = [1.282375, 103.864273];

  onMount(async () => {
    // remove leaflet legend-->
    const elements = document.getElementsByClassName('leaflet-bottom leaflet-right');
    while (elements.length > 0) {
      // @ts-ignore-->
      elements[0].parentNode.removeChild(elements[0]);
    }

    const nats = await wsconnect({ servers, ...natsOps });

    const getGPSLocation = async (err: any, msg: Msg) => {
      const data = msg.json();
      const { lat, lng } = data as Coordinates;
      console.log(data);

      currentPosition = [lat, lng];
    };

    nats.subscribe('gps.location', { callback: getGPSLocation });
  });
</script>
<div class="example">
  <LeafletMap bind:this={leafletMap} options={mapOptions}>
    <TileLayer url={tileUrl} options={tileLayerOptions}/>
    <Marker latLng={currentPosition}>
      <Popup>Gardens by the Bay</Popup>
      <Tooltip>Gardens by the Bay</Tooltip>
    </Marker>
  </LeafletMap>
</div>
<style>
  /* NOTE: Typically not imported from here, see documentation for more information. */
  /*@import "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/leaflet.css";*/

  .example {
    width: 1000px;
    height: 600px;
  }
</style>