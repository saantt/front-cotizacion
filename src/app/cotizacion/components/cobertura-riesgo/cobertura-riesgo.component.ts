import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CoberturaRiesgo, CoberturaRiesgoRequest } from '../../models/cobertura-riesgo.model';
import { CoberturaRiesgoService } from '../../services/cobertura-riesgo.service';
import { DatosRiesgoService } from '../../services/datos-riesgo.service';
import { DatosRiesgoResponse } from '../../models/datos-riesgos/datosRiesgoResponse.model';
import { CoverageService } from '../../services/coverage.service';
import { Coverage } from '../../models/coverage.model';
import { DeducibleService } from '../../services/deducible-service.service';
import { Deducible } from '../../models/deducible.model';

@Component({
  selector: 'app-cobertura-riesgo',
  templateUrl: './cobertura-riesgo.component.html',
  styleUrls: ['./cobertura-riesgo.component.css']
})
export class CoberturaRiesgoComponent implements OnInit, OnDestroy {

  coberturasRiesgo: CoberturaRiesgo[] = [];
  datosRiesgo: DatosRiesgoResponse[] = [];
  coberturas: Coverage[] = [];
  deducibles: Deducible[] = [];
  pageSize = 7;
  currentPage = 1;
  paginatedCoberturasRiesgo: CoberturaRiesgo[] = [];
  pages: number[] = [];

  form!: FormGroup;
  modo: 'ver' | 'editar' | 'crear' | null = null;
  registroSeleccionado: CoberturaRiesgo | null = null;
  toastMessage: string | null = null;
  toastType: 'success' | 'error' = 'success';
  isLoading = false;
  primaErrorMessage: string | null = null;
  private toastTimeoutId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private coberturaRiesgoService: CoberturaRiesgoService,
    private datosRiesgoService: DatosRiesgoService,
    private coverageService: CoverageService,
    private deducibleService: DeducibleService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.listarCoberturasRiesgo();
    this.cargarDatosRiesgo();
    this.cargarCoberturas();
    this.cargarDeducibles();
  }

  ngOnDestroy(): void {
    if (this.toastTimeoutId !== null) {
      window.clearTimeout(this.toastTimeoutId);
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      idCotizacion: ['', Validators.required],
      idCobertura: ['', Validators.required],
      idDeducible: [null],
      primaCobertura: [null, [Validators.required, this.positiveValueValidator(), this.formatoPrimaValidator()]]
    });

    this.form.get('primaCobertura')?.valueChanges.subscribe(() => this.actualizarErrorPrima());
  }

  private positiveValueValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === '' || control.value === undefined) return null;
      const value = Number(control.value);
      return !Number.isNaN(value) && value <= 0 ? { positive: true } : null;
    };
  }

  private formatoPrimaValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === '' || control.value === undefined) return null;
      const regex = /^\d{1,10}(\.\d{1,2})?$/;
      return regex.test(String(control.value)) ? null : { formato: true };
    };
  }

  listarCoberturasRiesgo(): void {
    this.isLoading = true;
    this.coberturaRiesgoService.coberturas$.subscribe({
      next: (lista: CoberturaRiesgo[]) => {
        this.coberturasRiesgo = lista;
        this.changePage();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.showToast('No se pudieron cargar las coberturas de riesgo.', 'error');
      }
    });
    this.coberturaRiesgoService.cargarCoberturasRiesgo();
  }

  cargarDatosRiesgo(): void {
    this.datosRiesgoService.getDatosRiesgo().subscribe({
      next: (data) => this.datosRiesgo = data,
      error: (err) => console.error('Error al cargar datos de riesgo:', err)
    });
  }

  cargarCoberturas(): void {
    this.coverageService.getAll().subscribe({
      next: (data) => this.coberturas = data,
      error: (err) => console.error('Error al cargar coberturas:', err)
    });
  }

  cargarDeducibles(): void {
    this.deducibleService.getAll().subscribe({
      next: (data) => this.deducibles = data.content,
      error: (err) => console.error('Error al cargar deducibles:', err)
    });
  }

  nuevo(): void {
    this.modo = 'crear';
    this.registroSeleccionado = null;
    this.form.reset({ idCotizacion: '', idCobertura: '', idDeducible: null, primaCobertura: null });
    this.form.enable();
    this.primaErrorMessage = null;
  }

  ver(cr: CoberturaRiesgo): void {
    this.modo = 'ver';
    this.registroSeleccionado = cr;
    this.form.patchValue(cr);
    this.form.disable();
    this.primaErrorMessage = null;
  }

  editar(cr: CoberturaRiesgo): void {
    this.modo = 'editar';
    this.registroSeleccionado = cr;
    this.form.enable();
    this.form.patchValue(cr);
    // la llave compuesta no se debe modificar en edición
    this.form.get('idCotizacion')?.disable();
    this.form.get('idCobertura')?.disable();
  }

  confirmarEliminacion(cr: CoberturaRiesgo): void {
    const confirmado = window.confirm(`¿Desea eliminar la cobertura ${cr.idCobertura} de la cotización ${cr.idCotizacion}?`);
    if (!confirmado) return;
    this.eliminar(cr);
  }

  eliminar(cr: CoberturaRiesgo): void {
    this.isLoading = true;
    this.coberturaRiesgoService.eliminarCoberturaRiesgo(cr.idCotizacion, cr.idCobertura).subscribe({
      next: () => {
        this.isLoading = false;
        this.cancelar();
        this.showToast('Cobertura de riesgo eliminada correctamente.', 'success');
      },
      error: (err) => {
        this.isLoading = false;
        this.showToast(this.getErrorMessage(err), 'error');
      }
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showToast('Revisa los campos, hay datos inválidos.', 'error');
      return;
    }

    const request: CoberturaRiesgoRequest = this.form.getRawValue();
    this.isLoading = true;

    if (this.modo === 'crear') {
      this.coberturaRiesgoService.crearCoberturaRiesgo(request).subscribe({
        next: () => {
          this.isLoading = false;
          this.cancelar();
          this.showToast('Cobertura de riesgo creada correctamente.', 'success');
        },
        error: (err) => {
          this.isLoading = false;
          this.showToast(this.getErrorMessage(err), 'error');
        }
      });
    } else if (this.modo === 'editar' && this.registroSeleccionado) {
      this.coberturaRiesgoService.actualizarCoberturaRiesgo(
        this.registroSeleccionado.idCotizacion,
        this.registroSeleccionado.idCobertura,
        request
      ).subscribe({
        next: () => {
          this.isLoading = false;
          this.cancelar();
          this.showToast('Cobertura de riesgo actualizada correctamente.', 'success');
        },
        error: (err) => {
          this.isLoading = false;
          this.showToast(this.getErrorMessage(err), 'error');
        }
      });
    }
  }

  cancelar(): void {
    this.modo = null;
    this.registroSeleccionado = null;
    this.form.reset({ idCotizacion: '', idCobertura: '', idDeducible: null, primaCobertura: null });
    this.form.enable();
    this.primaErrorMessage = null;
  }

  private actualizarErrorPrima(): void {
    const control = this.form.get('primaCobertura');
    if (!control || this.modo === 'ver' || (!control.touched && !control.dirty) || control.valid) {
      this.primaErrorMessage = null;
      return;
    }
    if (control.hasError('required')) this.primaErrorMessage = 'La prima de cobertura es obligatoria';
    else if (control.hasError('positive')) this.primaErrorMessage = 'La prima debe ser mayor a cero';
    else if (control.hasError('formato')) this.primaErrorMessage = 'Máximo 10 dígitos enteros y 2 decimales';
    else this.primaErrorMessage = 'Valor inválido';
  }

  trackById(index: number, item: CoberturaRiesgo): string {
    return `${item.idCotizacion}-${item.idCobertura}`;
  }
  changePage(): void {
  const total = this.totalPages();
  if (total === 0) {
    this.paginatedCoberturasRiesgo = [];
    this.pages = [];
    return;
  }
  if (this.currentPage > total) this.currentPage = total;
  const start = (this.currentPage - 1) * this.pageSize;
  const end = start + this.pageSize;
  this.paginatedCoberturasRiesgo = this.coberturasRiesgo.slice(start, end);
  this.pages = Array.from({ length: total }, (_, i) => i + 1);
}

totalPages(): number {
  return Math.ceil(this.coberturasRiesgo.length / this.pageSize);
}

nextPage(): void {
  if (this.currentPage < this.totalPages()) {
    this.currentPage++;
    this.changePage();
  }
}

previousPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.changePage();
  }
}

goToPage(page: number): void {
  if (page >= 1 && page <= this.totalPages()) {
    this.currentPage = page;
    this.changePage();
  }
}

  private getErrorMessage(error: any): string {
    const messages = this.getErrorMessages(error);
    return messages.length > 0 ? messages.join(' ') : 'No se pudo completar la operación.';
  }

  private getErrorMessages(error: any): string[] {
    const messages: string[] = [];
    const addMessage = (value: unknown) => {
      if (typeof value === 'string' && value.trim()) messages.push(value.trim());
    };

    // El backend responde { mensaje, errores: { campo: mensaje } }
    addMessage(error?.error?.mensaje);
    const backendErrores = error?.error?.errores;
    if (backendErrores && typeof backendErrores === 'object') {
      Object.values(backendErrores).forEach((value) => addMessage(value as string));
    }

    return messages.filter((message, index) => messages.indexOf(message) === index);
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    if (this.toastTimeoutId !== null) window.clearTimeout(this.toastTimeoutId);
    this.toastTimeoutId = window.setTimeout(() => { this.toastMessage = null; }, 3000);
  }
}