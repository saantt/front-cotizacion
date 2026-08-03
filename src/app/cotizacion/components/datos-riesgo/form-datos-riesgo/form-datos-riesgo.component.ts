import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatosRiesgoService } from '../../../services/datos-riesgo.service';

@Component({
  selector: 'app-form-datos-riesgo',
  templateUrl: './form-datos-riesgo.component.html',
  styleUrls: ['./form-datos-riesgo.component.css']
})
export class FormDatosRiesgoComponent implements OnInit {

  @Input() selectedDatosRiesgo: any;
  @Output() cancelEdit = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<void>();

  datosRiesgoForm!: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private datosRiesgoService: DatosRiesgoService
  ) { }

  ngOnInit(): void {
    this.datosRiesgoForm = this.formBuilder.group({
      id: ['', Validators.required],
      matricula: ['', Validators.required],
      cedula: ['', Validators.required],
      estadoId: [1, Validators.required],
      modelo: ['', Validators.required],
      servicio: ['PARTICULAR', Validators.required],
    });
  }

  ngOnChanges(changes: any): void {
    if (changes.selectedDatosRiesgo && this.datosRiesgoForm) {

      const value = changes.selectedDatosRiesgo.currentValue;

      if (value) {

        this.datosRiesgoForm.patchValue(value);
        this.isEditMode = true;
        this.datosRiesgoForm.get('id')?.disable();

      } else {

        this.isEditMode = false;
        this.datosRiesgoForm.reset({
          estadoId: 1,
          servicio: 'PARTICULAR'
        });
        this.datosRiesgoForm.get('id')?.enable();

      }
    }
  }

  onSubmit(): void {
    console.log(this.datosRiesgoForm.value);

    if (this.isEditMode) {
      this.onUpdate();
      return;
    }

    this.datosRiesgoService.createDatosRiesgo({
      ...this.datosRiesgoForm.value,
      fecha: new Date().toISOString(),
    }).subscribe({
      next: (datosRiesgo) => {
        console.log('Datos de riesgo creados:', datosRiesgo);
        this.formSubmit.emit();
      },
      error: (error) => {
        console.error('Error al crear datos de riesgo:', error);
      }
    });
  }

  onUpdate(): void {
    console.log(this.datosRiesgoForm.value);

    const payload = this.datosRiesgoForm.getRawValue(); // Get the raw value including disabled fields

    if (!payload.id) {
      console.error('No hay id para actualizar');
      return;
    }

    this.datosRiesgoService.updateDatosRiesgo(payload.id, {
      ...payload,
      fecha: new Date().toISOString(),
    }).subscribe({
      next: (datosRiesgo) => {
        console.log('Datos de riesgo actualizados:', datosRiesgo);
        this.isEditMode = false;
        this.datosRiesgoForm.enable(); // Enable the id field for future edits
        this.datosRiesgoForm.reset({
          estadoId: 1, 
          servicio: 'PARTICULAR'
        }); 
        this.formSubmit.emit();
      },
      error: (error) => {
        console.error('Error al actualizar datos de riesgo:', error);
      }
    });
  }

  onCancel(): void {
    this.isEditMode = false;
    this.datosRiesgoForm.enable();
    this.datosRiesgoForm.reset({
      estadoId: 1,
      servicio: 'PARTICULAR'
    });
    this.cancelEdit.emit();
  }
}