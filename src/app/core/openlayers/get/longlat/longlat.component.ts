import { Component } from '@angular/core';
import {Feature, Map, View} from 'ol/index.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {useGeographic} from 'ol/proj.js';
import Swal from 'sweetalert2';
import { CurdApiService } from 'src/app/secure/curd.api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-longlat',
  templateUrl: './longlat.html',
  styles: [
  ]
})
export class LonglatComponent {
  map: any
  
  ngOnInit(){
    this.showOpenLayers()
  }

  showOpenLayers(){
    useGeographic();

    const map = new Map({
      target: 'map23',
      view: new View({
        center: [115.17304948447453, -8.657215099032996],
        zoom: 12,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        })
      ],
    });

    map.on('click', function(evt){
      console.info((evt.coordinate));
      var coords = (evt.coordinate);
      var lat = coords[1];
      var lon = coords[0];
      // coords is a div in HTML below the map to display
      Swal.fire({
        title: 'Your Selected Location',
        icon: 'info',
        html: `Longitude: <kbd>${lon}</kbd><br>Latitude: <kbd>${lat}</kbd>`,
        showCloseButton: false,
        showCancelButton: false,
        focusConfirm: false,
      })
    })

      
  }
}
