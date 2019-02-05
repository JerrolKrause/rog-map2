import { Injectable } from '@angular/core';
import { Map, Marker } from 'mapbox-gl';
import { Geometry, Feature } from 'geojson';
import { Mapbox } from '../mapbox';

@Injectable()
export class MapObjectsService {
  constructor() {}

  /**
   * Add markers to a map instance
   * @param map
   * @param locations
   */
  public markersAdd(map: Map, markers: Marker[]) {
    if (map && markers && markers.length) {
      markers.forEach(marker => marker.addTo(map));
    }
  }

  /**
   * Add a heatmap to the map
   * @param map
   * @param locations
   */
  public heatMapAdd(map: Map, locations: Map.Location[]) {
    // Turn the locations into the format needed by the heatmap layer
    map.addSource('heatmap', this.markersConvertToGeoJSON(locations));
    // Add heatmap layer
    map.addLayer(
      {
        id: 'heatmap',
        type: 'heatmap',
        source: 'heatmap',
        // maxzoom: 9,
        paint: {
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(33,102,172,0)',
            0.2,
            'rgb(103,169,207)',
            0.4,
            'rgb(209,229,240)',
            0.6,
            'rgb(253,219,199)',
            0.8,
            'rgb(239,138,98)',
            1,
            'rgb(178,24,43)',
          ],
          'heatmap-weight': [
            'interpolate',
            ['exponential', 1.5],
            ['zoom'],
            0,
            ['interpolate', ['linear'], ['get', 'density'], 0, 0, 25, 1],
            18.1,
            ['interpolate', ['linear'], ['get', 'density'], 0, 0, 15, 1],
          ],
          // Adjust the heatmap radius by zoom level
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0,
            0.25,
            0.99,
            1,
            1,
            0.25,
            1.99,
            1,
            2,
            0.25,
            2.99,
            1,
            3,
            0.25,
            3.99,
            1,
            4,
            0.25,
            4.99,
            1,
            5,
            0.25,
            5.99,
            1,
            6,
            0.25,
            6.99,
            1,
            7,
            0.25,
            7.99,
            1,
            8,
            0.25,
            8.99,
            1,
            9,
            0.25,
            9.99,
            1,
            10,
            0.25,
            10.99,
            1,
            11,
            0.25,
            11.99,
            1,
            12,
            0.25,
            18.99,
            2,
          ],
          'heatmap-opacity': ['interpolate', ['exponential', 1.5], ['zoom'], 16, 1, 18.1, 0.6],
        },
      },
      'water',
    );
  }

  /**
   * Remove the existing heatmap layer
   * @param map
   */
  public heatMapRemove(map: Map) {
    if (!map) {
      return;
    }
    // Check if heatmap layer already exists, remove it if so
    const hasMap = map.getLayer('heatmap');
    if (typeof hasMap !== 'undefined') {
      // Remove map layer & source.
      map.removeLayer('heatmap');
      map.removeSource('heatmap');
    }
  }

  /**
   * Add a clustering layer to the map
   * @param map
   * @param locations
   * https://docs.mapbox.com/mapbox-gl-js/example/cluster/
   */
  public clusterLayerAdd(map: Map, locations: Map.Location[]) {
    // Remove any prexisting cluster layer
    this.clusterLayerRemove(map);
    // Create a data source by convert locations to geoJson
    map.addSource('clusters', {
      ...this.markersConvertToGeoJSON(locations),
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
    });

    map.addLayer({
      id: 'cluster-layer',
      type: 'circle',
      source: 'clusters',
      filter: ['has', 'point_count'],
      paint: {
        // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
        // with three steps to implement three types of circles:
        //   * Blue, 20px circles when point count is less than 100
        //   * Yellow, 30px circles when point count is between 100 and 750
        //   * Pink, 40px circles when point count is greater than or equal to 750
        'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#f28cb1'],
        'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
      },
    });

    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'clusters',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12,
      },
    });

    map.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'clusters',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#11b4da',
        'circle-radius': 4,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff',
      },
    });

    // When the cluster layer is clicked
    map.on('click', 'cluster-layer', function(e) {
      const features = map.queryRenderedFeatures(e.point, { layers: ['cluster-layer'] });
      const clusterId = features[0].properties.cluster_id;
      // This method not properly typed
      (<any>map).getSource('clusters').getClusterExpansionZoom(clusterId, (err: any, zoom: any) => {
        if (err) {
          return;
        }
        // Zoom in
        map.flyTo({
          center: (<any>features[0]).geometry.coordinates,
          zoom: zoom,
        });
      });
    });
    // Change cursor
    map.on('mouseenter', 'clusters', function() {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', function() {
      map.getCanvas().style.cursor = '';
    });
  }

  /**
   * Remove the clustering layer
   * @param map
   */
  public clusterLayerRemove(map: Map) {
    if (!map) {
      return;
    }
    const hasLayer3 = map.getLayer('unclustered-point');
    if (typeof hasLayer3 !== 'undefined') {
      map.removeLayer('unclustered-point');
    }
    const hasLayer2 = map.getLayer('cluster-count');
    if (typeof hasLayer2 !== 'undefined') {
      map.removeLayer('cluster-count');
    }
    const hasLayer = map.getLayer('cluster-layer');
    if (typeof hasLayer !== 'undefined') {
      // Remove map layer & source.
      map.removeLayer('cluster-layer');
      map.removeSource('clusters');
    }
  }

  /**
   * Convert a location array to a geo JSON
   * @param locations
   */
  public markersConvertToGeoJSON(locations: Map.Location[]) {
    return <mapboxgl.GeoJSONSourceRaw>{
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
        features: locations.map(location => {
          return <Feature<Geometry>>{
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [location.longitude, location.latitude],
            },
          };
        }),
      },
    };
  }

  /**
   * Fit the map to container the markers
   * @param map
   * @param markers
   */
  public mapFitBounds(map: Map, markers: Marker[]) {
    if (map && markers && markers.length) {
      setTimeout(() => {
        // Rotate to 0
        map.rotateTo(0, { duration: 500 });
        // After rotation is finished, go to bounds
        setTimeout(() => {
          const bounds = new (<any>window).mapboxgl.LngLatBounds();
          markers.forEach(feature => {
            bounds.extend(feature.getLngLat());
          });
          map.fitBounds(bounds);
        }, 500);
      }, 100);
    }
  }

  /**
   * Fly to a location on a map
   * @param map
   * @param coords
   */
  public flyToLocation(
    map: Map,
    coords: [number, number],
    options?: { zoom?: number; pitch?: number; speed?: number; curve?: number },
  ) {
    setTimeout(() => {
      map.rotateTo(0, { duration: 500 });
      setTimeout(() => {
        map.flyTo({
          center: coords,
          zoom: 10,
          pitch: 0,
          speed: 2.2,
          curve: 1.42,
          easing(t: any) {
            return t;
          },
          ...options,
        });
      }, 500);
    }, 100);
  }

  /**
   * Create a map marker and add to map
   * @param map
   * @param locations
   */
  public markersCreate(locations: Map.Location[]) {
    return locations.map(location => {
      if (location.latitude && location.longitude) {
        const el = document.createElement('div');
        el.className = location.metadata && location.metadata.iconClass ? location.metadata.iconClass : 'marker';
        // make a marker for each feature and add to the map
        const marker: Mapbox.MarkerWithLocation = new (<any>window).mapboxgl.Marker(el).setLngLat([
          location.longitude,
          location.latitude,
        ]);
        // If metadata available, create popup
        if (location.metadata && location.metadata.title) {
          // this.createPopup(marker, location);
        }
        // Attach previous location data
        marker.location = { ...location };
        return marker;
      }
    });
  }

  /**
   * Add a popup to a marker if metadata is available
   * @param marker
   * @param location
   */
  public createPopup(marker: any, location: Map.Location) {
    // Hold html string for building
    let html = '';
    // Add title if available
    if (location.metadata && location.metadata.title) {
      html += '<h3>' + location.metadata.title + '</h3>';
    }
    // Add description if available
    if (location.metadata && location.metadata.description) {
      html += '<div>' + location.metadata.description + '</div>';
    }
    // add popups
    marker.setPopup(new (<any>window).mapboxgl.Popup({ offset: 25 }).setHTML(html));
  }
}
