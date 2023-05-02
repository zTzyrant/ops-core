import { Component } from '@angular/core';

@Component({
  selector: 'app-calculate-paper-weight',
  templateUrl: 'calculate-paper-weight.html',  
  styles: [`

  `]
})
export class CalculatePaperWeightComponent {
  width = 21
  height = 29.7
  weight = 70
  quantity = 1
  totalWeight: any = 0

  ngOnInit(){
    this.calTotal()
  }
  
  paperDefault(inp: any){
    if(inp === 'A4 100 gr'){
      this.width = 21
      this.height = 29.7
      this.weight = 100
      this.quantity = 1
    } else if (inp === 'A4 80 gr') {
      this.width = 21
      this.height = 29.7
      this.weight = 80
      this.quantity = 1
    } else if (inp === 'A4 70 gr') {
      this.width = 21
      this.height = 29.7
      this.weight = 70
      this.quantity = 1
    } else if (inp === 'F4') {
      this.width = 21
      this.height = 33
      this.weight = 100
      this.quantity = 1
    } else if (inp === 'A1') {
      this.width = 59.4
      this.height = 84.1
      this.weight = 100
      this.quantity = 1
    } else if (inp === 'A2') {
      this.width = 42
      this.height = 59.4
      this.weight = 100
      this.quantity = 1
    } else if (inp === 'A3') {
      this.width = 29.7
      this.height = 42
      this.weight = 100
      this.quantity = 1
    } else if (inp === 'A5') {
      this.width = 21
      this.height = 14.8
      this.weight = 100
      this.quantity = 1
    } else if (inp === 'A6') {
      this.width = 14.8
      this.height = 10.5
      this.weight = 100
      this.quantity = 1
    }
    this.calTotal()
  }

  calTotal(){
    this.totalWeight = (((this.width * this.height) / (100 ** 2)) * this.weight) * this.quantity
  }

  valWidth(an: any){
    this.width = an.target.value;
    this.calTotal()
  }

  valHeight(an: any){
    this.height = an.target.value;
    this.calTotal()
  }

  valWeight(an: any){
    this.weight = an.target.value;
    this.calTotal()
  }

  valQuantity(an: any){
    this.quantity = an.target.value;
    this.calTotal()
  }
}
