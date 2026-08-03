import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ImpuestoCotizacion,
  ImpuestoCotizacionRequest
} from '../../models/impuesto-cotizacion/impuesto-cotizacion.model';
import { ImpuestoCotizacionService } from '../../services/impuesto-cotizacion.service';

@Component({
  selector: 'app-impuesto-cotizacion',
  templateUrl: './impuesto-cotizacion.component.html',
  styleUrls: ['./impuesto-cotizacion.component.css']
})
export class ImpuestoCotizacionComponent implements OnInit {

  impuestos: ImpuestoCotizacion[] = [];
  form!: FormGroup;
  cargando = false;
  guardando = false;
  error = '';
  mensaje = '';

  modo: 'ver' | 'editar' | 'crear' | null = null;
  registroSeleccionado: ImpuestoCotizacion | null = null;

  constructor(
    private fb: FormBuilder,
    private impuestoCotizacionService: ImpuestoCotizacionService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.listarImpuestos();
  }

  initForm(): void {
    this.form = this.fb.group({
      idCotizacion: ['', [Validators.required, Validators.maxLength(50)]],
      concepto: ['', [Validators.required, Validators.maxLength(50)]],
      valor: [null, [Validators.required, Validators.min(0.01)]]
    });
  }

  listarImpuestos(): void {
    this.cargando = true;
    this.error = '';

    this.impuestoCotizacionService.getAll().subscribe({
      next: (data: ImpuestoCotizacion[]) => {
        this.impuestos = data;
        this.cargando = false;
      },
      error: (err: any) => {
        this.error = 'No se pudieron cargar los impuestos de cotizacion.';
        this.cargando = false;
        console.error('Error al listar impuestos de cotizacion', err);
      }
    });
  }

  nuevo(): void {
    this.modo = 'crear';
    this.registroSeleccionado = null;
    this.mensaje = '';
    this.error = '';
    this.form.enable();
    this.form.reset({ idCotizacion: '', concepto: '', valor: null });
  }

  ver(impuesto: ImpuestoCotizacion): void {
    this.modo = 'ver';
    this.registroSeleccionado = impuesto;
    this.mensaje = '';
    this.error = '';
    this.form.patchValue(impuesto);
    this.form.disable();
  }

  editar(impuesto: ImpuestoCotizacion): void {
    this.modo = 'editar';
    this.registroSeleccionado = impuesto;
    this.mensaje = '';
    this.error = '';
    this.form.enable();
    this.form.patchValue(impuesto);
  }

  eliminar(impuesto: ImpuestoCotizacion): void {
    const confirmado = confirm(`Deseas eliminar el impuesto "${impuesto.concepto}"?`);

    if (!confirmado) {
      return;
    }

    this.error = '';
    this.mensaje = '';

    this.impuestoCotizacionService.delete(impuesto.idImpuestoCot).subscribe({
      next: () => {
        this.mensaje = 'Impuesto eliminado correctamente.';
        this.listarImpuestos();

        if (this.registroSeleccionado?.idImpuestoCot === impuesto.idImpuestoCot) {
          this.cancelar();
        }
      },
      error: (err: any) => {
        this.error = 'No se pudo eliminar el impuesto.';
        console.error('Error al eliminar impuesto de cotizacion', err);
      }
    });
  }

  guardar(): void {
    this.mensaje = '';
    this.error = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request: ImpuestoCotizacionRequest = this.form.value;
    this.guardando = true;

    if (this.modo === 'crear') {
      this.impuestoCotizacionService.create(request).subscribe({
        next: () => {
          this.mensaje = 'Impuesto creado correctamente.';
          this.listarImpuestos();
          this.cancelar();
        },
        error: (err: any) => {
          this.error = 'No se pudo crear el impuesto.';
          this.guardando = false;
          console.error('Error al crear impuesto de cotizacion', err);
        }
      });
    } else if (this.modo === 'editar' && this.registroSeleccionado) {
      this.impuestoCotizacionService.update(this.registroSeleccionado.idImpuestoCot, request).subscribe({
        next: () => {
          this.mensaje = 'Impuesto actualizado correctamente.';
          this.listarImpuestos();
          this.cancelar();
        },
        error: (err: any) => {
          this.error = 'No se pudo actualizar el impuesto.';
          this.guardando = false;
          console.error('Error al actualizar impuesto de cotizacion', err);
        }
      });
    } else {
      this.guardando = false;
    }
  }

  cancelar(): void {
    this.modo = null;
    this.registroSeleccionado = null;
    this.guardando = false;
    this.form.reset({ idCotizacion: '', concepto: '', valor: null });
    this.form.enable();
  }
}
