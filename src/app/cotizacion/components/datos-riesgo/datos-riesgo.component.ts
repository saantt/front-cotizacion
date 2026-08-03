import { Component, OnInit } from '@angular/core';
import { DatosRiesgoResponse } from '../../models/datos-riesgos/datosRiesgoResponse.model';

@Component({
  selector: 'app-datos-riesgo',
  templateUrl: './datos-riesgo.component.html',
  styleUrls: ['./datos-riesgo.component.css']
})
export class DatosRiesgoComponent implements OnInit {

  selectedDatosRiesgo?: DatosRiesgoResponse | null;

  constructor() { }

  ngOnInit(): void {
  }

  onEdit(datosRiesgo: DatosRiesgoResponse): void {
    this.selectedDatosRiesgo = datosRiesgo;
  }

  onSaved(): void {
    this.selectedDatosRiesgo = undefined;
  }

}
