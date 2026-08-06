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
      next: (data: EstadoCotizacion[]) => {
        console.log('Listado estados cotizacion (raw):', data);
        // Normalize backend shape to the component's expected shape
        this.estados_cotizacion = data.map(d => this.normalizeEstado(d));
      },
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
    this.form.patchValue({
      ...estadoCotizacion,
      fec_inicio: this.formatDateForInput((estadoCotizacion as any).fec_inicio ?? (estadoCotizacion as any).fecInicio ?? (estadoCotizacion as any).fecInicio),
      fec_fin: this.formatDateForInput((estadoCotizacion as any).fec_fin ?? (estadoCotizacion as any).fecFin ?? (estadoCotizacion as any).fecFin)
    });
    this.form.disable();
  }

  editar(estadoCotizacion: EstadoCotizacion): void {
    this.modo = 'editar';
    this.registroSeleccionado = this.normalizeEstado(estadoCotizacion as any);
    this.form.enable();
    this.form.patchValue({
      ...this.registroSeleccionado,
      fec_inicio: this.formatDateForInput((this.registroSeleccionado as any).fec_inicio),
      fec_fin: this.formatDateForInput((this.registroSeleccionado as any).fec_fin)
    });
  }

  private normalizeEstado(d: any): EstadoCotizacion {
    const id = d?.idEstado ?? d?.id_estado ?? d?.id ?? d?.idEstado;
    const fecInicioRaw = d?.fecInicio ?? d?.fec_inicio ?? d?.fecInicio ?? d?.fecInicio;
    const fecFinRaw = d?.fecFin ?? d?.fec_fin ?? d?.fecFin ?? d?.fecFin;

    return {
      id_estado: id ?? null,
      descripcion: d?.descripcion ?? d?.descripcion ?? '',
      estado: d?.estado ?? d?.estado ?? '',
      fec_inicio: this.formatDateForInput(fecInicioRaw),
      fec_fin: this.formatDateForInput(fecFinRaw)
    } as EstadoCotizacion;
  }

  private formatDateForInput(value: string | undefined | null): string {
    if (!value) return '';
    // If already in yyyy-mm-dd
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value as string;
    // If ISO datetime, take first 10 chars
    if (typeof value === 'string' && value.length >= 10) return value.substring(0, 10);
    return '';
  }

  private toBackendDate(value: string | null | undefined): string | null {
    if (!value) return null;
    // If already like 'YYYY-MM-DDTHH:mm:ss' or has 'T' keep as-is (trim seconds if needed)
    if (typeof value === 'string' && value.indexOf('T') >= 0) {
      // remove trailing Z if present
      return value.endsWith('Z') ? value.substring(0, value.length - 1) : value;
    }
    // If date-only 'yyyy-mm-dd', append time
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value + 'T00:00:00';
    // Fallback: try to take first 19 chars
    if (typeof value === 'string' && value.length >= 10) return value.substring(0, 19);
    return null;
  }

  eliminar(estadoCotizacion: EstadoCotizacion | number): void {
    const id = typeof estadoCotizacion === 'number'
      ? estadoCotizacion
      : (estadoCotizacion as any).id_estado ?? (estadoCotizacion as any).id ?? (estadoCotizacion as any).idEstado;

    if (id === undefined || id === null) {
      console.error('No se pudo eliminar: id undefined en', estadoCotizacion);
      return;
    }

    this.estadoCotizacionService.delete(id).subscribe({
      next: () => this.listarEstadosCotizacion(),
      error: (err: any) => console.error('Error al eliminar estado cotización', err)
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value as any;
    const fecInicio = this.toBackendDate(raw.fec_inicio ?? raw.fecInicio);
    const fecFin = this.toBackendDate(raw.fec_fin ?? raw.fecFin);

    const payload: any = {
      descripcion: raw.descripcion,
      estado: raw.estado,
      // primary: camelCase expected by backend
      fecInicio,
      fecFin,
      // also include snake_case in case backend maps differently
      fec_inicio: fecInicio,
      fec_fin: fecFin
    };

    console.log('Guardar request payload (backend):', this.modo, payload);

    if (this.modo === 'crear') {
      this.estadoCotizacionService.create(payload).subscribe({
        next: () => {
          this.listarEstadosCotizacion();
          this.cancelar();
        },
        error: (err: any) => console.error('Error al crear estado cotización', err)
      });
    } else if (this.modo === 'editar' && this.registroSeleccionado) {
      const selected = this.registroSeleccionado as any;
      const id = selected?.id_estado ?? selected?.id ?? selected?.idEstado;
      if (id === undefined || id === null) {
        console.error('No se pudo actualizar: id undefined en registroSeleccionado', this.registroSeleccionado);
        return;
      }

      this.estadoCotizacionService.update(id, payload).subscribe({
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