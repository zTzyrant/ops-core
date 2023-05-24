import { Component } from '@angular/core';
import {Feature, Map, View} from 'ol/index.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Point} from 'ol/geom.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {useGeographic} from 'ol/proj.js';
import {Icon, Style, Text} from 'ol/style';
import Fill from 'ol/style/Fill';
import Swal from 'sweetalert2';
import { CurdApiService } from 'src/app/secure/curd.api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-openlayers',
  templateUrl: './openlayers.html',
  styleUrls: ['./openlayers.css']
})
export class OpenlayersComponent {
  map: any
  arr_merchant: any
  text = 'sfas'
  
  constructor(
    private curd: CurdApiService, 
    private router: Router
  ){
    this.curd.get_merchant_longlat().subscribe((res: any) => {
      if(res.statusQuo === '1'){
        this.arr_merchant = res.result
        this.showOpenLayers()
      } else {
        Swal.fire({
          title: '<strong>Error Cannot Reach Backend</strong>',
          icon: 'error',
          html:
            'If you see this message please email me at <a href="mailto:ztzyrant@gmail.com">ztzyrant@gmail.com</a>'+
            '<br>Or you can use this website locally on your computer ! <br>' +
            'Read At <a href="https://github.com/zTzyrant/ops-core">OPS-Core</a>',
          showCloseButton: false,
          showCancelButton: false,
          focusConfirm: false,
          showDenyButton: false,
          allowEscapeKey: false,
          allowOutsideClick: false,
          confirmButtonText: 'Great !',
        })
      }
    }, (err: any) => {
      Swal.fire({
        title: '<strong>Error Cannot Reach Backend</strong>',
        icon: 'error',
        html:
          'If you see this message please email me at <a href="mailto:ztzyrant@gmail.com">ztzyrant@gmail.com</a>'+
          '<br>Or you can use this website locally on your computer ! <br>' +
          'Read At <a href="https://github.com/zTzyrant/ops-core">OPS-Core</a>',
        showCloseButton: false,
        showCancelButton: false,
        focusConfirm: false,
        showDenyButton: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        confirmButtonText: 'Great !',
      })
    })
  }

  showOpenLayers(){
    if(!this.arr_merchant){
      return
    }
    useGeographic();
    let pl = [{latlong: [115.17304948447453, -8.657215099032996], name: 'Home'}, {latlong: [115.22657220809987, -8.673237918724602], name: 'M1'}]

    let fin_merch_point = []
    for (let xl = 0; xl < this.arr_merchant.length; xl++) {
      let point = new Point([this.arr_merchant[xl].longitude, this.arr_merchant[xl].latitude]);
      let ft = new Feature(point)
      ft.set('name', `${this.arr_merchant[xl].name}`)
      ft.setStyle(
        new Style({
          image: new Icon({
            src: 'assets/img/printer.png',
            scale: 0.5,
            anchor: [0.5, 0]
          }),
          text: new Text({
            text: `${this.arr_merchant[xl].name}`,
            scale: 1.5,
            font: 'bold 12px serif',
            padding: [2, 2, 2, 2],
            backgroundFill: new Fill({
              color: [168, 50, 153, 0.6],
            }),
            textAlign: 'center',
            offsetY: -12,
            overflow: true
          }),
        })
      )
      ft.addEventListener
      fin_merch_point.push(ft)
    }
    const map = new Map({
      target: 'map',
      view: new View({
        center: [115.17304948447453, -8.657215099032996],
        zoom: 11,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: new VectorSource({
            features: fin_merch_point,
          })
        }),
      ], 
    });
   
    map.on('pointermove', function(e){
      var pixel = map.getEventPixel(e.originalEvent);
      var hit = map.hasFeatureAtPixel(pixel);
      map.getViewport().style.cursor = hit ? 'pointer' : '';
      map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
        map.getViewport().title = `View ${feature.get('name')} Products`;
      });
    });

    const oute_to_merchant = (dat: any) =>{
      this.router.navigate(['/search/'+dat])
    }

    map.on('click', function (e){
      map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
        oute_to_merchant(feature.get('name'))
      })
    })
      
  }
}

