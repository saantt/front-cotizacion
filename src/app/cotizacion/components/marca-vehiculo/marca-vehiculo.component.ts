import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarcaVehiculoService } from '../../services/marca-vehiculo.service';
import { MarcaVehiculo } from '../../models/marca-vehiculo.model';

@Component({
  selector: 'app-marca-vehiculo',
  templateUrl: './marca-vehiculo.component.html',
  styleUrls: ['./marca-vehiculo.component.css']
})
export class MarcaVehiculoComponent implements OnInit {

  marcavehiculo: MarcaVehiculo[] = [];
  registroSeleccionado: MarcaVehiculo | null = null;
  modo: 'crear' | 'editar' | 'ver' = 'crear';
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private marcaVehiculoService: MarcaVehiculoService
  ) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      nombre_marca_vehiculo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      pais_origen_vehiculo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      abreviatura_vehiculo: ['', [Validators.required, Validators.pattern(/^[A-Za-z]{3}$/)]]
    });

    this.marcaVehiculoService.marcas$
      .subscribe(lista => {
        this.marcavehiculo = lista;
      });
    this.marcaVehiculoService.cargarMarcasVehiculo();
  }

  // =========================
  // NUEVO
  // =========================

  nuevo(): void {
    this.modo = 'crear';
    this.registroSeleccionado = null;
    this.form.reset();
    this.form.enable();
  }

  // =========================
  // VER
  // =========================

  ver(mv: MarcaVehiculo): void {
    this.modo = 'ver';
    this.registroSeleccionado = mv;
    this.form.patchValue(mv);
    this.form.disable();
  }

  // =========================
  // EDITAR
  // =========================

  editar(mv: MarcaVehiculo): void {
    this.modo = 'editar';
    this.registroSeleccionado = mv;
    this.form.enable();
    this.form.patchValue(mv);
  }

  // =========================
  // GUARDAR
  // POST / PUT
  // =========================

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const marca: MarcaVehiculo = {
      id_marca_vehiculo: this.registroSeleccionado?.id_marca_vehiculo ?? 0,
      ...this.form.value
    };

    if (this.modo === 'crear') {
      this.marcaVehiculoService.crearMarcaVehiculo(marca)
        .subscribe({
          next: () => {
            this.cancelar();
          },
          error: (error) => {
            console.error('Error creando marca:', error);
          }
        });
    } else if (this.modo === 'editar') {
      this.marcaVehiculoService.actualizarMarcaVehiculo(
        marca.id_marca_vehiculo,
        marca
      )
        .subscribe({
          next: () => {
            this.cancelar();
          },
          error: (error) => {
            console.error('Error actualizando marca:', error);
          }
        });
    }
  }

  // =========================
  // ELIMINAR
  // =========================

  eliminar(mv: MarcaVehiculo): void {
    if (!mv.id_marca_vehiculo) {
      return;
    }

    const confirmar = confirm(
      `¿Desea eliminar la marca ${mv.nombre_marca_vehiculo}?`
    );

    if (!confirmar) {
      return;
    }

    this.marcaVehiculoService.eliminarMarcaVehiculo(mv.id_marca_vehiculo)
      .subscribe({
        next: () => {
          this.cancelar();
        },
        error: (error) => {
          console.error('Error eliminando marca:', error);
        }
      });
  }

  // =========================
  // CANCELAR
  // =========================

  cancelar(): void {
    this.modo = null;
    this.registroSeleccionado = null;
    this.form.reset();
    this.form.enable();
  }

  trackById(index: number, item: MarcaVehiculo): number {
    return item.id_marca_vehiculo;
  }

}
