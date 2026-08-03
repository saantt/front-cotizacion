import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DatosRiesgoService } from '../../../services/datos-riesgo.service';
import { DatosRiesgoResponse } from 'src/app/cotizacion/models/datos-riesgos/datosRiesgoResponse.model';

@Component({
  selector: 'app-list-datos-riesgos',
  templateUrl: './list-datos-riesgo.component.html',
  styleUrls: ['./list-datos-riesgo.component.css']
})
export class ListDatosRiesgosComponent implements OnInit {

  @Output() edit = new EventEmitter<DatosRiesgoResponse>();
  datosRiesgos: DatosRiesgoResponse[] = [];

  constructor(private datosRiesgoService: DatosRiesgoService) { }

  ngOnInit(): void {
    this.cargarDatosRiesgos();
  }

  cargarDatosRiesgos(): void {
    this.datosRiesgoService.getDatosRiesgo().subscribe({
      next: (datosRiesgos) => {
        this.datosRiesgos = datosRiesgos;
        console.log('Datos de riesgos cargados:', datosRiesgos);
      },
      error: (error) => {
        console.error('Error al cargar datos de riesgos:', error);
      }
    });
  }

  editDatosRiesgo(riesgo: DatosRiesgoResponse): void {
    this.edit.emit(riesgo);
  }

  deleteDatosRiesgo(id: string): void {
    this.datosRiesgoService.deleteDatosRiesgo(id).subscribe({
      next: () => {
        console.log('Datos de riesgo eliminados con éxito');
        this.cargarDatosRiesgos();
      },
      error: (error) => {
        console.error('Error al eliminar datos de riesgo:', error);
      }
    });
  }

}