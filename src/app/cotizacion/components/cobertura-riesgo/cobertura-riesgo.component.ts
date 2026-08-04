import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoberturaRiesgoService } from '../../services/cobertura-riesgo.service';
import { CoberturaRiesgo } from '../../models/cobertura-riesgo.model';

@Component({
  selector: 'app-cobertura-riesgo',
  templateUrl: './cobertura-riesgo.component.html',
  styleUrls: ['./cobertura-riesgo.component.css']
})
export class CoberturaRiesgoComponent implements OnInit {
  
  coberturasriesgo: CoberturaRiesgo[] = [];
  registroSeleccionado: CoberturaRiesgo | null = null;
  modo: 'crear' | 'editar' | 'ver' | null = null;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private coberturaRiesgoService: CoberturaRiesgoService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      idCotizacion: ['', Validators.required],
      idCobertura: ['', Validators.required],
      idDeducible: [null],
      primaCobertura: [null, [Validators.required, Validators.min(0.01)]]
    });

    this.coberturaRiesgoService.coberturas$
      .subscribe((lista: CoberturaRiesgo[]) => {
        this.coberturasriesgo = lista;
      });

    this.coberturaRiesgoService.cargarCoberturasRiesgo();
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
  ver(cr: CoberturaRiesgo): void {
    this.modo = 'ver';
    this.registroSeleccionado = cr;
    this.form.patchValue(cr);
    this.form.disable();
  }

  // =========================
  // EDITAR
  // =========================
  editar(cr: CoberturaRiesgo): void {
    this.modo = 'editar';
    this.registroSeleccionado = cr;
    this.form.enable();
    this.form.patchValue(cr);
    // la llave compuesta no se debe modificar en edición
    this.form.get('idCotizacion')?.disable();
    this.form.get('idCobertura')?.disable();
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

    const cobertura: CoberturaRiesgo = this.form.getRawValue();

    if (this.modo === 'crear') {
      this.coberturaRiesgoService.crearCoberturaRiesgo(cobertura)
        .subscribe({
          next: () => {
            this.cancelar();
          },
          error: (error: any) => {
            console.error('Error creando cobertura de riesgo:', error);
          }
        });
    } else if (this.modo === 'editar') {
      this.coberturaRiesgoService.actualizarCoberturaRiesgo(
        this.registroSeleccionado!.idCotizacion,
        this.registroSeleccionado!.idCobertura,
        cobertura
      )
        .subscribe({
          next: () => {
            this.cancelar();
          },
          error: (error: any) => {
            console.error('Error actualizando cobertura de riesgo:', error);
          }
        });
    }
  }

  // =========================
  // ELIMINAR
  // =========================
  eliminar(cr: CoberturaRiesgo): void {
    const confirmar = confirm(
      `¿Desea eliminar la cobertura ${cr.idCobertura} de la cotización ${cr.idCotizacion}?`
    );
    if (!confirmar) {
      return;
    }
    this.coberturaRiesgoService.eliminarCoberturaRiesgo(cr.idCotizacion, cr.idCobertura)
      .subscribe({
        next: () => {
          this.cancelar();
        },
        error: (error: any) => {
          console.error('Error eliminando cobertura de riesgo:', error);
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

  trackById(index: number, item: CoberturaRiesgo): string {
    return `${item.idCotizacion}-${item.idCobertura}`;
  }
}
