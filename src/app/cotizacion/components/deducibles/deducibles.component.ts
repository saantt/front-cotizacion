import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Deducible } from '../../models/deducible.model';
import { DeducibleService } from '../../services/deducible-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'deducible',
  templateUrl: './deducibles.component.html',
  styleUrls: ['./deducibles.component.css']
})
export class DeducibleComponent implements OnInit, OnDestroy {

  /*==========================
    FORMULARIO Y VALIDACIONES
  ==========================*/
  showForm = false;
  form!: FormGroup;
  modo: 'ver' | 'editar' | 'crear' | null = null;
  registroSeleccionado: Deducible | null = null;
  toastMessage: string | null = null;
  toastType: 'success' | 'error' = 'success';
  isLoading = false;
  porcentajeErrorMessage: string | null = null;
  montoMinimoErrorMessage: string | null = null;
  private toastTimeoutId: number | null = null;

  closeForm() {
    this.showForm = false;
  }

  /*===========
    PAGINACIÓN (server-side)
  ============*/
  deducibles: Deducible[] = [];   // elementos de la página actual (ya vienen paginados del backend)
  currentPage = 0;                // 0-based, como espera Spring Pageable
  pageSize = 2;                   // tamaño de página que pides al backend
  totalPages = 0;
  totalElements = 0;

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  get isFirstPage(): boolean {
    return this.currentPage === 0;
  }

  get isLastPage(): boolean {
    return this.currentPage >= this.totalPages - 1;
  }

  nextPage(): void {
    if (!this.isLastPage) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (!this.isFirstPage) {
      this.goToPage(this.currentPage - 1);
    }
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.listarDeducibles();
  }

  constructor(
    private fb: FormBuilder,
    private deducibleService: DeducibleService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.modo = 'crear';
    this.listarDeducibles();
  }

  ngOnDestroy(): void {
    if (this.toastTimeoutId !== null) {
      window.clearTimeout(this.toastTimeoutId);
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      porcentaje: [0, [Validators.required, this.minValueValidator(1), this.maxValueValidator(100), this.maxDigitsValidator(3)]],
      monto_minimo: [0, [Validators.required, this.minValueValidator(0), this.maxDigitsValidator(10), this.minDigitsValidator(4), this.positiveValueValidator()]]
    });

    this.form.get('porcentaje')?.valueChanges.subscribe(() => this.actualizarErroCampo('porcentaje'));
    this.form.get('monto_minimo')?.valueChanges.subscribe(() => this.actualizarErroCampo('monto_minimo'));
  }

  private minValueValidator(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === '' || control.value === undefined) {
        return null;
      }
      const value = Number(control.value);
      return !Number.isNaN(value) && value < min ? { min: true } : null;
    };
  }

  private maxValueValidator(max: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === '' || control.value === undefined) {
        return null;
      }
      const value = Number(control.value);
      return !Number.isNaN(value) && value > max ? { max: true } : null;
    };
  }

  private positiveValueValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === '' || control.value === undefined) {
        return null;
      }
      const value = Number(control.value);
      return !Number.isNaN(value) && value <= 0 ? { positive: true } : null;
    };
  }

  private minDigitsValidator(minDigits: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === '' || control.value === undefined) {
        return null;
      }
      const digitsOnly = String(control.value).replace(/\D/g, '');
      return digitsOnly.length < minDigits ? { minDigits: true } : null;
    };
  }

  private maxDigitsValidator(maxDigits: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === '' || control.value === undefined) {
        return null;
      }
      const digitsOnly = String(control.value).replace(/\D/g, '');
      return digitsOnly.length > maxDigits ? { maxDigits: true } : null;
    };
  }

  listarDeducibles(): void {
    this.isLoading = true;
    this.deducibleService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.deducibles = data.content || [];
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
        this.isLoading = false;
        console.log('Total de páginas:', this.totalPages);
        console.log('Deducibles cargados:', data);
      },
      error: (err: any) => {
        console.error('Error al listar deducibles', err);
        this.isLoading = false;
        this.showToast('No se pudieron cargar los deducibles.', 'error');
      }
    });
  }

  nuevo(): void {
    this.showForm = true;
    this.modo = 'crear';
    this.registroSeleccionado = null;
    this.form.reset({ porcentaje: 0, monto_minimo: 0 });
    this.form.enable();
    this.porcentajeErrorMessage = null;
    this.montoMinimoErrorMessage = null;
  }

  ver(deducible: Deducible): void {
    this.showForm = true;
    this.modo = 'ver';
    this.registroSeleccionado = deducible;
    this.form.patchValue(deducible);
    this.form.disable();
    this.porcentajeErrorMessage = null;
    this.montoMinimoErrorMessage = null;
  }

  editar(deducible: Deducible): void {
    this.showForm = true;
    this.modo = 'editar';
    this.registroSeleccionado = deducible;
    this.form.enable();
    this.form.patchValue(deducible);
  }

  confirmarEliminacion(deducible: Deducible): void {
    const confirmado = window.confirm(`¿Desea eliminar el deducible seleccionado?`);

    if (!confirmado) {
      return;
    }

    this.eliminar(deducible);
  }

  eliminar(deducible: Deducible): void {
    if (!deducible?.id_deducible) {
      return;
    }

    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Desea eliminar el deducible ${deducible.porcentaje}% ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2563EB',
      cancelButtonColor: '#6B7280'
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.isLoading = true;
      this.deducibleService.delete(deducible.id_deducible).subscribe({
        next: () => {
          if (this.registroSeleccionado?.id_deducible === deducible.id_deducible) {
            this.cancelar();
            this.closeForm();
          }

          // Si eliminamos el último elemento de la página actual (y no es la primera), retrocede una página
          if (this.deducibles.length === 1 && this.currentPage > 0) {
            this.currentPage--;
          }

          this.listarDeducibles();
          this.isLoading = false;
          Swal.fire({
            title: 'Eliminado',
            text: 'Deducible eliminado correctamente.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (err: any) => {
          console.error('Error al eliminar deducible', err);
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: this.getErrorMessage(err),
            icon: 'error'
          });
        }
      });
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.isLoading = false;
      this.showToast('Revisa los campos, hay datos inválidos.', 'error');
      return;
    }

    if (this.modo !== 'crear' && !(this.modo === 'editar' && this.registroSeleccionado)) {
      this.isLoading = false;
      this.showToast('Primero debe crear o seleccionar un registro para guardar.', 'error');
      return;
    }

    const request = {
      porcentaje: Number(this.form.value.porcentaje),
      monto_minimo: Number(this.form.value.monto_minimo)
    };

    this.isLoading = true;

    if (this.modo === 'crear') {
      this.deducibleService.create(request).subscribe({
        next: () => {
          this.listarDeducibles();
          this.cancelar();
          this.closeForm();
          this.isLoading = false;
          Swal.fire({
            title: 'Guardado',
            text: 'Deducible creado correctamente.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (err: any) => {
          console.error('Error al crear deducible', err);
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: this.getErrorMessage(err),
            icon: 'error'
          });
        }
      });
    } else if (this.modo === 'editar' && this.registroSeleccionado) {
      this.deducibleService.update(this.registroSeleccionado.id_deducible, request).subscribe({
        next: () => {
          this.listarDeducibles();
          this.cancelar();
          this.closeForm();
          this.isLoading = false;
          Swal.fire({
            title: 'Actualizado',
            text: 'Deducible actualizado correctamente.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (err: any) => {
          console.error('Error al actualizar deducible', err);
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: this.getErrorMessage(err),
            icon: 'error'
          });
        }
      });
    }
  }

  cancelar(): void {
    this.showForm = false;
    this.modo = null;
    this.registroSeleccionado = null;
    this.form.reset({ porcentaje: 0, monto_minimo: 0 });
    this.form.enable();
    this.porcentajeErrorMessage = null;
    this.montoMinimoErrorMessage = null;
  }

  onPorcentajeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 3);
    const parsedValue = Number(digits || 0);
    this.form.get('porcentaje')?.setValue(parsedValue, { emitEvent: false });
    this.form.get('porcentaje')?.updateValueAndValidity();
    this.actualizarErroCampo('porcentaje');
  }

  onMontoMinimoInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 10);
    const parsedValue = Number(digits || 0);
    this.form.get('monto_minimo')?.setValue(parsedValue, { emitEvent: false });
    this.form.get('monto_minimo')?.updateValueAndValidity();
    this.actualizarErroCampo('monto_minimo');
  }

  private actualizarErroCampo(controlName: 'porcentaje' | 'monto_minimo'): void {
    const control = this.form.get(controlName);
    if (!control || this.modo === 'ver') {
      return;
    }

    if (control.invalid) {
      control.markAsTouched();
    }

    if (controlName === 'porcentaje') {
      this.porcentajeErrorMessage = this.getControlErrorMessage(control, controlName);
      return;
    }

    this.montoMinimoErrorMessage = this.getControlErrorMessage(control, controlName);
  }

  private getControlErrorMessage(control: AbstractControl, controlName: 'porcentaje' | 'monto_minimo'): string | null {
    if (!control || this.modo === 'ver' || (!control.touched && !control.dirty) || control.valid) {
      return null;
    }

    if (control.hasError('required')) {
      return controlName === 'porcentaje' ? 'El porcentaje es obligatorio' : 'El monto mínimo es obligatorio';
    }

    if (control.hasError('min')) {
      return 'El porcentaje no puede ser menor a 0';
    }

    if (control.hasError('max')) {
      return 'El porcentaje no puede ser mayor a 100';
    }

    if (control.hasError('positive')) {
      return 'El monto mínimo debe ser mayor que cero';
    }

    if (control.hasError('minDigits')) {
      return 'Debe tener al menos 4 dígitos';
    }

    if (control.hasError('maxDigits')) {
      return controlName === 'porcentaje' ? 'Solo puede tener hasta 3 dígitos.' : 'Solo puede tener hasta 10 dígitos.';
    }

    return 'Valor inválido.';
  }

  private getErrorMessage(error: any): string {
    const messages = this.getErrorMessages(error);
    return messages.length > 0 ? messages.join(' ') : 'No se pudo completar la operación.';
  }

  private getErrorMessages(error: any): string[] {
    const messages: string[] = [];
    const addMessage = (value: unknown) => {
      if (typeof value === 'string' && value.trim()) {
        messages.push(value.trim());
      }
    };

    const backendMessage = error?.error?.message;
    const backendErrors = error?.error?.errors;
    const detail = error?.error?.detail;
    const errorMessage = error?.message;

    addMessage(backendMessage);
    addMessage(detail);
    addMessage(errorMessage);

    if (Array.isArray(backendErrors)) {
      backendErrors.forEach((item: any) => {
        if (typeof item === 'string') {
          addMessage(item);
          return;
        }

        addMessage(item?.message);
        addMessage(item?.defaultMessage);
        addMessage(item?.error);
        addMessage(item?.field ? `${item.field}: ${item.message || item.defaultMessage || ''}` : undefined);
      });
    }

    if (Array.isArray(error?.error?.error)) {
      error.error.error.forEach((item: any) => {
        addMessage(item?.message);
        addMessage(item?.defaultMessage);
      });
    }

    return messages.filter((message, index) => messages.indexOf(message) === index);
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;

    if (this.toastTimeoutId !== null) {
      window.clearTimeout(this.toastTimeoutId);
    }

    this.toastTimeoutId = window.setTimeout(() => {
      this.toastMessage = null;
    }, 3000);
  }
}