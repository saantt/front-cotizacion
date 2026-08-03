import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatosRiesgoService } from '../../../services/datos-riesgo.service';

@Component({
  selector: 'app-form-datos-riesgo',
  templateUrl: './form-datos-riesgo.component.html',
  styleUrls: ['./form-datos-riesgo.component.css']
})
export class FormDatosRiesgoComponent implements OnInit {

  datosRiesgoForm!: FormGroup;

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

  onSubmit(): void {
    console.log(this.datosRiesgoForm.value);

    this.datosRiesgoService.createDatosRiesgo({
      ...this.datosRiesgoForm.value,
      fecha: new Date().toISOString(),
    }).subscribe({
      next: (datosRiesgo) => {
        console.log('Datos de riesgo creados:', datosRiesgo);
      },
      error: (error) => {
        console.error('Error al crear datos de riesgo:', error);
      }
    });
  }
}