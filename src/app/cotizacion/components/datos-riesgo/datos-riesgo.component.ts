import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-datos-riesgo',
  templateUrl: './datos-riesgo.component.html',
  styleUrls: ['./datos-riesgo.component.css']
})
export class DatosRiesgoComponent implements OnInit {

  // Variable para almacenar la información del registro seleccionado
  riesgoSeleccionado: any = null;

  constructor() { }

  ngOnInit(): void {
  }

  // Método que recibe los datos emitidos desde el componente de la lista
  onRiesgoSeleccionado(riesgo: any): void {
    this.riesgoSeleccionado = riesgo;
  }

}
