import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Deducible } from '../../models/deducible.model';
import { DeducibleService } from '../../services/deducible-service.service';


@Component({
  selector: 'deducible',
  templateUrl: './deducibles.component.html',
  styleUrls: ['./deducibles.component.css']
})

export class DeducibleComponent implements OnInit {

  deducibles: Deducible[] = [];
  form!: FormGroup;

  // controla si el panel derecho está en modo ver / editar / crear
  modo: 'ver' | 'editar' | 'crear' | null = null;
  registroSeleccionado: Deducible | null = null;

  constructor(
    private fb: FormBuilder,
    private deducibleService: DeducibleService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.listarDeducibles();
  }

  initForm(): void {
    this.form = this.fb.group({
      porcentaje: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      monto_minimo: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  listarDeducibles(): void {
    this.deducibleService.getAll().subscribe({
      next: (data: Deducible[]) => this.deducibles = data,
      error: (err: any) => console.error('Error al listar deducibles', err)
    });
  }

  nuevo(): void {
    this.modo = 'crear';
    this.registroSeleccionado = null;
    this.form.reset({ porcentaje: 0, monto_minimo: 0 });
  }

  ver(deducible: Deducible): void {
    this.modo = 'ver';
    this.registroSeleccionado = deducible;
    this.form.patchValue(deducible);
    this.form.disable();
  }

  editar(deducible: Deducible): void {
    this.modo = 'editar';
    this.registroSeleccionado = deducible;
    this.form.enable();
    this.form.patchValue(deducible);
  }

  eliminar(deducible: Deducible): void {
    this.deducibleService.delete(deducible.id_deducible).subscribe({
      next: () => this.listarDeducibles(),
      error: (err: any) => console.error('Error al eliminar deducible', err)
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request = this.form.value;

    if (this.modo === 'crear') {
      this.deducibleService.create(request).subscribe({
        next: () => {
          this.listarDeducibles();
          this.cancelar();
        },
        error: (err: any) => console.error('Error al crear deducible', err)
      });
    } else if (this.modo === 'editar' && this.registroSeleccionado) {
      this.deducibleService.update(this.registroSeleccionado.id_deducible, request).subscribe({
        next: () => {
          this.listarDeducibles();
          this.cancelar();
        },
        error: (err: any) => console.error('Error al actualizar deducible', err)
      });
    }
  }

  cancelar(): void {
    this.modo = null;
    this.registroSeleccionado = null;
    this.form.reset({ porcentaje: 0, monto_minimo: 0 });
    this.form.enable();
  }
}
