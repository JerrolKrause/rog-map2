import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  AfterViewInit,
  ViewEncapsulation,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { Map } from 'mapbox-gl';
import { MapObjectsService } from '../services/map-objects.service';
import { Mapbox } from '../mapbox';

const scriptSrc = 'https://api.mapbox.com/mapbox-gl-js/v0.52.0/mapbox-gl.js';
const apiKey = 'pk.eyJ1Ijoicm9ndXNlciIsImEiOiJjanB1YzFrMmwwZjZnNDNxbGkwY28wdnI5In0.Xe4QgRnvsvP3WAncobSxqg';

@Component({
  selector: 'app-map-mapbox',
  templateUrl: './map-mapbox.component.html',
  styleUrls: ['../../../../../node_modules/mapbox-gl/dist/mapbox-gl.css', './map-mapbox.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MapObjectsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapMapboxComponent implements OnInit, AfterViewInit, OnChanges {
  /** Any locations such as pushpins or circles */
  @Input() locations: Map.Location[];
  /** Mapbox Api key */
  @Input() apiKey = apiKey;
  /** Default zoom level. 15.5 is optimical for 3d buildings */
  @Input() zoom = 15.5;
  /**Show/hide heatmap on default */
  @Input() style = 'streets';
  /**Show/hide heatmap on default */
  @Input() heatmap = false;
  /** If set, show map circle clustering at the specified zoom level and below. Range is 2-20ish */
  @Input() clusterMapAt: number;
  /** Fly and zoom to this location, coords should be lat long */
  @Input() flyTo: { zoom: number; coords: [number, number] };
  /** When a pin is clicked on */
  @Output() pinClicked = new EventEmitter<any>();

  /** Has script loaded  */
  public isLoaded = false;
  /** Map reference */
  public map: Map;

  /** Randomly generated uniqueID for the div that holds the map. Allows for multiple map per page  */
  public uniqueId = 'map-box' + Math.floor(Math.random() * 1000000);
  /** Keep track of the last zoom level. Used to determine when to toggle the cluster map */
  private zoomLast: number;

  private isRotating = true;
  /** Holds a reference to any created markers. Used to remove */
  private markers: Mapbox.MarkerWithLocation[];

  constructor(private mapObjects: MapObjectsService) {}

  ngOnInit() {}

  ngOnChanges(model: any) {
    // On style changes
    if (model.style && this.isLoaded) {
      this.map.setStyle(`mapbox://styles/mapbox/${this.style}-v9`);
    }

    if (this.isLoaded) {
      this.mapDisplayData();
    }

      /** 
    // If locations change
    if (model.locations && this.isLoaded) {
      if (this.heatmap) {
        this.heatMapAdd();
      } else {
        this.isRotating = false;
        this.locationsAdd();
      }
    }

    // If heatmap toggle changes
    // TODO: Fix ugly nested if statements
    if (model.heatmap && this.isLoaded) {
      if (this.heatmap) {
        this.heatMapAdd();
      } else {
        // Remove any preexisting heatmap
        this.mapObjects.heatMapRemove(this.map);
        if (this.locations) {
          this.locationsAdd();
        }
      }
    }
*/
    // If flyto is passed down, jump the map to that location
    if (model.flyTo && this.isLoaded) {
      this.isRotating = false;
      this.mapObjects.flyToLocation(this.map, this.flyTo.coords, { zoom: 15, speed: 3 });
    }
  }

  /**
   * 
   */
  public mapDisplayData() {

    // If no locations or empty locations array
    if (!this.locations || !this.locations.length) {
      // Plot initial location
      const initialLocation = (lat: number, long: number) => {
        const myLocation: Map.Location = {
          latitude: lat,
          longitude: long,
        };
        this.locations = [myLocation];
        this.locationsAdd(false);
      };

      // Create location
      navigator.geolocation.getCurrentPosition(
        val => initialLocation(val.coords.latitude, val.coords.longitude),
        error => {
          console.log(error);
          initialLocation(-115.172813, 36.114647);
        },
      );
      
    } else 
    // If heatmap specified
    if (this.heatmap && this.locations) {
      this.heatMapAdd();
    } else 
    // No heatmap
    if (!this.heatmap) {
      // Remove existing heatmap if any
      this.mapObjects.heatMapRemove(this.map);
      // If map clustering is specified
      if (this.clusterMapAt) {
        // Get zoom level
        const zoom = this.map.getZoom();
        // If zoom level is less than the minimum supplied by the input prop
        if (zoom < this.clusterMapAt) {
          // Remove any existing markers
          this.locationsRemove();
          // Add clustering layer
          this.mapObjects.clusterLayerAdd(this.map, this.locations);
        } else {
          this.mapObjects.clusterLayerRemove(this.map);
          this.locationsAdd(false);
        }
      } else {
        this.mapObjects.clusterLayerRemove(this.map);
        this.locationsAdd(false);
      }

    }
  }

  ngAfterViewInit() {
    this.scriptsLoad();
  }

  /**
   * Check if map js is loaded, if not, load it then initialize the map in this component
   */
  public scriptsLoad() {
    if ((<any>window).mapboxgl) {
      this.mapInit(); // Mapbox already loaded, init map
      this.isLoaded = true;
    } else {
      // Dynamically load mapbox js
      const script = document.createElement('script');
      script.type = 'text/javascript';
      // Callback query param will fire after mapbox maps successfully loads
      script.src = scriptSrc;
      script.onload = () => {
        this.mapInit();
      }; // After load, init chart
      document.head.appendChild(script);
    }
  }

  /**
   * Create the map and set intial view and properties
   */
  private mapInit() {
    if (!this.map && document.getElementById(this.uniqueId)) {
      (<any>window).mapboxgl.accessToken = this.apiKey;
      // Get user's lat long to set initial position
      navigator.geolocation.getCurrentPosition(
        () => {
          // Confirm that lat and long were passed
          this.mapCreate();
        },
        error => {
          console.log(error);
          this.mapCreate();
        },
      );
    }
  }

  /**
   * Create the map after getting user coords
   * @param coords
   */
  private mapCreate() {
    // Create new map
    this.map = new (<any>window).mapboxgl.Map({
      container: this.uniqueId,
      style: `mapbox://styles/mapbox/${this.style}-v9`, // basic-v9
      zoom: this.zoom,
      center: [-115.156665, 36.1383415], // 36.1383415,"display_lng":-115.156665
      // center: coords,
      // For rotation
      pitch: 60,
      // center: [-114.9775958, 36.0080202],
    });

    // When a use clicks on the map the first time only
    // Stop the rotation and fit bounds
    const resetMap = () => {
      this.isRotating = false;
      setTimeout(() => {
        this.mapObjects.mapFitBounds(this.map, this.markers);
      }, 100);
    };
    this.map.once('click', resetMap);

    // When the map finishes loading
    this.map.on('load', () => {
      // Start rotation
      this.rotateTo(0);
     
      // Set last zoom level
      this.zoomLast = this.map.getZoom(); 

      this.map.on('easeend', () => {
        console.log('ease end')
      })

      // On zoom end
      this.map.on('zoomend', () => {
        
        // Get current map zoom level
        const zoomNew = this.map.getZoom();
        // Only update map when the clusterMapAt threshold is crossed
        // Lower number is zooming out
        if (
          (zoomNew >= this.clusterMapAt && this.zoomLast <= this.clusterMapAt) ||
          (zoomNew <= this.clusterMapAt && this.zoomLast >= this.clusterMapAt)
        ) {
          this.mapDisplayData();
        }
        // console.log('zoomend', this.clusterMapAt, this.zoomLast, zoomNew);
        this.zoomLast = zoomNew;
      });

       // Determine what data to display on the map
       this.mapDisplayData();

      // Add 3D layer
      this.map.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        // minzoom: 15,
        paint: {
          'fill-extrusion-color': '#aaa',
          // use an 'interpolate' expression to add a smooth transition effect to the
          // buildings as the user zooms in
          'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'height']],
          'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'min_height']],
          'fill-extrusion-opacity': 0.6,
        },
      });
      // End 3d layer

      // Mark as loaded
      this.isLoaded = true;
    });
  }

  /**
   * Add the heatmap
   */
  private heatMapAdd() {
    // Remove any markers/locations on the map
    this.locationsRemove();
    // Remove any preexisting heatmap
    this.mapObjects.heatMapRemove(this.map);
    // Add existing heatmap
    this.mapObjects.heatMapAdd(this.map, this.locations);
    // Create map makers but do NOT add them to the map
    this.markers = this.mapObjects.markersCreate(this.locations);
    // Pass map markers to fit bounds to recenter the map on the heatmap
    this.mapObjects.mapFitBounds(this.map, this.markers);
  }

  /**
   * Add locations to the map
   */
  private locationsAdd(fitBounds = true) {
    // If locations passed, add markers
    if (this.locations && this.locations.length) {
      // Remove any existing markers
      this.locationsRemove();
      // Create markers
      this.markers = this.mapObjects.markersCreate(this.locations);
      // Add click event for markers, emits up via pinClicked
      this.markers.forEach(marker => {
        marker.getElement().addEventListener('click', (e: MouseEvent) => {
          this.isRotating = false;
          // this.mapObjects.mapFitBounds(this.map, this.markers);
          this.pinClicked.emit(marker.location);
          e.stopPropagation();
        });
      });

      // Add markers to map
      this.mapObjects.markersAdd(this.map, this.markers);
      if (fitBounds) {
        // Recenter and zoom map to fit markers
        this.mapObjects.mapFitBounds(this.map, this.markers);
      }
    } else {
      this.locationsRemove();
    }
  }

  /** Remove all created markers */
  private locationsRemove() {
    if (this.markers && this.markers.length) {
      this.markers.forEach(marker => marker.remove());
    }
  }

  /**
   * Slowly rotate the map
   * https://www.mapbox.com/mapbox-gl-js/example/animate-camera-around-point/
   */
  private rotateTo = (timestamp: number) => {
    // clamp the rotation between 0 -360 degrees
    // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
    this.map.rotateTo((timestamp / 300) % 360, { duration: 0 });
    if (this.isRotating) {
      // Request the next frame of the animation.
      requestAnimationFrame(this.rotateTo);
    }
  }
}
