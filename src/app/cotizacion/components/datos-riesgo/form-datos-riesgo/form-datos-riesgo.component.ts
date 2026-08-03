import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatosRiesgoService } from '../../../services/datos-riesgo.service';
import { DatosRiesgoResponse } from '../../../models/datos-riesgos/datosRiesgoResponse.model';

@Component({
  selector: 'app-form-datos-riesgo',
  templateUrl: './form-datos-riesgo.component.html',
  styleUrls: ['./form-datos-riesgo.component.css']
})
export class FormDatosRiesgoComponent implements OnInit, OnChanges {

  @Input() datosRiesgo?: DatosRiesgoResponse | null;
  @Output() saved = new EventEmitter<void>();

  datosRiesgoForm!: FormGroup;
  isEditMode = false;

  constructor(
    private formBuilder: FormBuilder,
    private datosRiesgoService: DatosRiesgoService
  ) { }

  ngOnInit(): void {

    this.buildForm();

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.datosRiesgo) {

      if (!this.datosRiesgoForm) {

        this.buildForm();
      }

      if (this.datosRiesgo) {

        this.isEditMode = true;

        this.datosRiesgoForm.patchValue({
          id: this.datosRiesgo.id,
          matricula: this.datosRiesgo.matricula,
          cedula: this.datosRiesgo.cedula,
          estadoId: this.datosRiesgo.estadoId,
          modelo: this.datosRiesgo.modelo,
          servicio: (this.datosRiesgo as any).servicio || (this.datosRiesgo as any).TipoServicio || 'PARTICULAR',
        });

      } else {

        this.resetForm();
      }
    }
  }

  buildForm(): void {

    this.datosRiesgoForm = this.formBuilder.group({
      id: ['', Validators.required],
      matricula: ['', Validators.required],
      cedula: ['', Validators.required],
      estadoId: [1, Validators.required],
      modelo: ['', Validators.required],
      servicio: ['PARTICULAR', Validators.required],
    });
  }

  resetForm(): void {

    if (!this.datosRiesgoForm) {

      this.buildForm();

      return;
    }

    this.isEditMode = false;

    this.datosRiesgoForm.reset({
      id: '',
      matricula: '',
      cedula: '',
      estadoId: 1,
      modelo: '',
      servicio: 'PARTICULAR',
    });
  }

  onSubmit(): void {

    if (!this.datosRiesgoForm.valid) {

      return;
    }

    const payload = {
      ...this.datosRiesgoForm.value,
      fecha: new Date().toISOString(),
    };

    if (this.isEditMode && this.datosRiesgo) {

      this.datosRiesgoService.updateDatosRiesgo(this.datosRiesgo.id, payload).subscribe({
        next: () => {
          console.log('Datos de riesgo actualizados');
          this.afterSave();
        },
        error: (error) => {
          console.error('Error al actualizar datos de riesgo:', error);
        }
      });

    } else {
      
      this.datosRiesgoService.createDatosRiesgo(payload).subscribe({
        next: () => {
          console.log('Datos de riesgo creados');
          this.afterSave();
        },
        error: (error) => {
          console.error('Error al crear datos de riesgo:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.datosRiesgo = undefined;
    this.resetForm();
  }

  private afterSave(): void {
    this.saved.emit();
    this.datosRiesgo = undefined;
    this.resetForm();
  }
}