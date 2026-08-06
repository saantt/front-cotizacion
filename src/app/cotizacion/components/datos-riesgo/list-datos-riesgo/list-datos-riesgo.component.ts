import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DatosRiesgoService } from '../../../services/datos-riesgo.service';
import { DatosRiesgoResponse } from 'src/app/cotizacion/models/datos-riesgos/datosRiesgoResponse.model';
import { MarcaVehiculoService } from 'src/app/cotizacion/services/marca-vehiculo.service';
import { MarcaVehiculo } from 'src/app/cotizacion/models/marca-vehiculo.model';

@Component({
  selector: 'app-list-datos-riesgos',
  templateUrl: './list-datos-riesgo.component.html',
  styleUrls: ['./list-datos-riesgo.component.css']
})
export class ListDatosRiesgosComponent implements OnInit {

  @Output() edit = new EventEmitter<any>();

  datosRiesgos: DatosRiesgoResponse[] = [];
  marcasVehiculo: MarcaVehiculo[] = [];

  constructor(
    private datosRiesgoService: DatosRiesgoService,
    private marcaService: MarcaVehiculoService
) { }

  ngOnInit(): void {
    this.cargarDatosRiesgos();
    this.loadMarcaVehiculo();
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

  editDatosRiesgo(datosRiesgo: any): void {
    this.edit.emit(datosRiesgo);
  }

  getMarcaNombre(marcaId: number): string {
    const marca = this.marcasVehiculo.find(marca => marca.id_marca_vehiculo === marcaId);
    return marca ? marca.nombre_marca_vehiculo : 'Desconocida';
  }

  loadMarcaVehiculo(): void {
    this.marcaService.cargarMarcasVehiculo();
    this.marcaService.marcas$.subscribe({
      next: (marcas) => {
        this.marcasVehiculo = marcas;
        console.log('Marcas de vehículo cargadas:', marcas);
      },
      error: (error) => {
        console.error('Error al cargar las marcas de vehículo:', error);
      }
    });
  }
}