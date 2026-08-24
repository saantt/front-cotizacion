import { Component, OnInit, ViewChild } from '@angular/core';
import { ListDatosRiesgosComponent } from './list-datos-riesgo/list-datos-riesgo.component';
import { DatosRiesgoResponse } from '../../models/datos-riesgos/datosRiesgoResponse.model';

@Component({
  selector: 'app-datos-riesgo',
  templateUrl: './datos-riesgo.component.html',
  styleUrls: ['./datos-riesgo.component.css']
})
export class DatosRiesgoComponent implements OnInit {

  @ViewChild(ListDatosRiesgosComponent) listDatosRiesgosComponent!: ListDatosRiesgosComponent;

  selectedDatosRiesgo: DatosRiesgoResponse | null = null;

  constructor() { }

  ngOnInit(): void { }

  onEdit(datosRiesgo: DatosRiesgoResponse): void {
    this.selectedDatosRiesgo = datosRiesgo;
  }

  onCancelEdit(): void {
    this.selectedDatosRiesgo = null;
  }

  onFormSubmit(): void {
    this.selectedDatosRiesgo = null;
    if (this.listDatosRiesgosComponent) {
      this.listDatosRiesgosComponent.cargarDatosRiesgos();
    }
  }

}
