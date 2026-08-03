import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatosRiesgoService } from '../../../services/datos-riesgo.service';
import { DatosRiesgoResponse } from 'src/app/cotizacion/models/datos-riesgos/datosRiesgoResponse.model';

@Component({
  selector: 'app-form-datos-riesgo',
  templateUrl: './form-datos-riesgo.component.html',
  styleUrls: ['./form-datos-riesgo.component.css']
})
export class FormDatosRiesgoComponent implements OnInit, OnChanges {

  // Recibe los datos seleccionados desde el padre
  @Input() datos: DatosRiesgoResponse | null = null;

  datosRiesgoForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private datosRiesgoService: DatosRiesgoService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  // Se ejecuta cada vez que el valor de @Input() datos cambia
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datos'] && this.datos && this.datosRiesgoForm) {
      this.datosRiesgoForm.patchValue({
        id: this.datos.id,
        matricula: this.datos.matricula,
        cedula: this.datos.cedula,
        estadoId: this.datos.estadoId ?? 1,
        modelo: this.datos.modelo,
        servicio: this.datos.TipoServicio ?? 'PARTICULAR'
      });
    }
  }

  private initForm(): void {
    this.datosRiesgoForm = this.formBuilder.group({
      id: ['', Validators.required],
      matricula: ['', Validators.required],
      cedula: ['', Validators.required],
      estadoId: [1, Validators.required],
      modelo: ['', Validators.required],
      servicio: ['PARTICULAR', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.datosRiesgoForm.invalid) {
      this.datosRiesgoForm.markAllAsTouched();
      return;
    }

    console.log(this.datosRiesgoForm.value);

    this.datosRiesgoService.createDatosRiesgo({
      ...this.datosRiesgoForm.value,
      fecha: new Date().toISOString(),
    }).subscribe({
      next: (datosRiesgo) => {
        console.log('Datos de riesgo procesados:', datosRiesgo);
        this.cancelar();
      },
      error: (error) => {
        console.error('Error en la operación:', error);
      }
    });
  }

  cancelar(): void {
    this.datosRiesgoForm.reset({
      estadoId: 1,
      servicio: 'PARTICULAR'
    });
    this.datos = null;
  }
}
