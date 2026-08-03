import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ListDatosRiesgosComponent } from './list-datos-riesgo/list-datos-riesgo.component';

@Component({
  selector: 'app-datos-riesgo',
  templateUrl: './datos-riesgo.component.html',
  styleUrls: ['./datos-riesgo.component.css']
})
export class DatosRiesgoComponent implements OnInit {

  @ViewChild(ListDatosRiesgosComponent) listDatosRiesgosComponent!: ListDatosRiesgosComponent;

  selectedDatosRiesgo: any;

  constructor() { }

  ngOnInit(): void {
    
  }

  onEdit(datosRiesgo: any): void {
    this.selectedDatosRiesgo = datosRiesgo;
  }
  
  onCancelEdit(): void {
    this.selectedDatosRiesgo = null
  }

  onFormSubmit(): void {
    this.selectedDatosRiesgo = null;

    if (this.listDatosRiesgosComponent) {
      this.listDatosRiesgosComponent.cargarDatosRiesgos();
    }

  }

}
