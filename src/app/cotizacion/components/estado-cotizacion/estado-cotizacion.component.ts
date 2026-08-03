import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstadoCotizacion } from '../../models/estado-cotizacion.model';
import { EstadoCotizacionService } from '../../services/estado-cotizacion.service';

@Component({
  selector: 'estado-cotizacion',
  templateUrl: './estado-cotizacion.component.html'
})
export class EstadoCotizacionComponent implements OnInit {

  estados_cotizacion: EstadoCotizacion[] = [];
  form!: FormGroup;

  // controla si el panel derecho está en modo ver / editar / crear
  modo: 'ver' | 'editar' | 'crear' | null = null;
  registroSeleccionado: EstadoCotizacion | null = null;

  constructor(
    private fb: FormBuilder,
    private estadoCotizacionService: EstadoCotizacionService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.listarEstadosCotizacion();
  }

  initForm(): void {
    this.form = this.fb.group({
      descripcion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      estado: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      fec_inicio: ['', [Validators.required]],
      fec_fin: ['', [Validators.required]]
    });
  }

  listarEstadosCotizacion(): void {
    this.estadoCotizacionService.getAll().subscribe({
      next: (data: EstadoCotizacion[]) => this.estados_cotizacion = data,
      error: (err: any) => console.error('Error al listar estados cotización', err)
    });
  }

  nuevo(): void {
    this.modo = 'crear';
    this.registroSeleccionado = null;
    this.form.reset({ descripcion: '', estado: '', fec_inicio: '', fec_fin: '' });
  }

  ver(estadoCotizacion: EstadoCotizacion): void {
    this.modo = 'ver';
    this.registroSeleccionado = estadoCotizacion;
    this.form.patchValue(estadoCotizacion);
    this.form.disable();
  }

  editar(estadoCotizacion: EstadoCotizacion): void {
    this.modo = 'editar';
    this.registroSeleccionado = estadoCotizacion;
    this.form.enable();
    this.form.patchValue(estadoCotizacion);
  }

  eliminar(estadoCotizacion: EstadoCotizacion): void {
    this.estadoCotizacionService.delete(estadoCotizacion.id_estado).subscribe({
      next: () => this.listarEstadosCotizacion(),
      error: (err: any) => console.error('Error al eliminar estado cotización', err)
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request = this.form.value;

    if (this.modo === 'crear') {
      this.estadoCotizacionService.create(request).subscribe({
        next: () => {
          this.listarEstadosCotizacion();
          this.cancelar();
        },
        error: (err: any) => console.error('Error al crear estado cotización', err)
      });
    } else if (this.modo === 'editar' && this.registroSeleccionado) {
      this.estadoCotizacionService.update(this.registroSeleccionado.id_estado, request).subscribe({
        next: () => {
          this.listarEstadosCotizacion();
          this.cancelar();
        },
        error: (err: any) => console.error('Error al actualizar estado cotización', err)
      });
    }
  }

  cancelar(): void {
    this.modo = null;
    this.registroSeleccionado = null;
    this.form.reset({ descripcion: '', estado: '', fec_inicio: '', fec_fin: '' });
    this.form.enable();
  }
}