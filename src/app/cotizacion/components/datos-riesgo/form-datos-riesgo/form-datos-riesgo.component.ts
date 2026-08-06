import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatosRiesgoResponse } from '../../../models/datos-riesgos/datosRiesgoResponse.model';
import { DatosRiesgoService } from '../../../services/datos-riesgo.service';
import { TomadorModule } from '../../../models/tomador/tomador.module';
import { TomadorServiceService } from '../../../services/tomador-service.service';
import { MarcaVehiculoService } from '../../../services/marca-vehiculo.service';
import { MarcaVehiculo } from 'src/app/cotizacion/models/marca-vehiculo.model';
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
  tomadores: TomadorModule[] = [];
  marcasVehiculo: MarcaVehiculo[] = [];
  isEditMode: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private datosRiesgoService: DatosRiesgoService,
    private tomadorService: TomadorServiceService,
    private marcaService: MarcaVehiculoService
  ) { }

  ngOnInit(): void {
    this.datosRiesgoForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(50)]],
      matricula: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(7), Validators.pattern(/^[A-Z]{3}-\d{3}$/)]],
      cedula: ['', Validators.required],
      estadoId: [1, Validators.required],
      marcaId: [null, Validators.required],
      modelo: ['', [Validators.required, Validators.maxLength(4)]],
      servicio: ['PARTICULAR', [Validators.required, Validators.maxLength(20)]],
    });

    this.setNextId();
    this.loadTomadores();
    this.loadMarcaVehiculo();
  }

  private setNextId(): void {
    this.datosRiesgoService.getDatosRiesgo().subscribe({
      next: (datosRiesgos) => {
        const nextId = this.generateNextId(datosRiesgos);
        this.datosRiesgoForm.get('id')?.setValue(nextId);
      },
      error: (error) => {
        console.error('Error al obtener el último ID de datos de riesgo:', error);
      }
    });
  }

  private loadTomadores(): void {
    this.tomadorService.getTomadoresPaginados().subscribe({
      next: (response) => {
        this.tomadores = response.content;
      },
      error: (error) => {
        console.error('Error al cargar los tomadores:', error);
      }
    });
  }

  loadMarcaVehiculo(): void {
    this.marcaService.cargarMarcasVehiculo();
    this.marcaService.marcas$.subscribe({
      next: (marcas) => {
        this.marcasVehiculo = marcas;
        console.log('Marcas de vehículo cargadas:', marcas);
      },
      error: (error) => {
        console.error('Error al cargar las marcas de vehículo:', error);
      }
    });
  }

  private generateNextId(datosRiesgos: DatosRiesgoResponse[]): string {
    const currentYear = new Date().getFullYear();
    const prefix = `COT-${currentYear}-`;
    let maxSequence = 0;

    datosRiesgos.forEach(riesgo => {
      const id = riesgo.id || '';
      const regex = new RegExp(`^${prefix.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}(\\d{4})$`);
      const match = id.match(regex);
      if (match) {
        const seq = Number(match[1]);
        if (!Number.isNaN(seq) && seq > maxSequence) {
          maxSequence = seq;
        }
      }
    });

    const nextSequence = maxSequence + 1;
    return `${prefix}${nextSequence.toString().padStart(4, '0')}`;
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
          id: '',
          matricula: '',
          cedula: '',
          estadoId: 1,
          marcaId: null,
          modelo: '',
          servicio: 'PARTICULAR'
        });
        this.datosRiesgoForm.get('id')?.disable();
        this.datosRiesgoForm.updateValueAndValidity();
        this.setNextId();

      }
    }
  }

  onSubmit(): void {
    console.log(this.datosRiesgoForm.value);

    if (this.isEditMode) {
      this.onUpdate();
      return;
    }

    this.datosRiesgoForm.get('estadoId')?.setValue(1);
    const payload = this.datosRiesgoForm.getRawValue();
    this.datosRiesgoService.createDatosRiesgo({
      ...payload,
      fecha: new Date().toISOString(),
    }).subscribe({
      next: (datosRiesgo) => {
        console.log('Datos de riesgo creados:', datosRiesgo);
        this.formSubmit.emit();
        this.datosRiesgoForm.reset({
          id: '',
          matricula: '',
          cedula: '',
          estadoId: 1,
          marcaId: null,
          modelo: '',
          servicio: 'PARTICULAR'
        });
      },
      error: (error) => {
        console.error('Error al crear datos de riesgo:', error);
      }
    });
  }

  getControl(controlName: string) {
    return this.datosRiesgoForm.get(controlName);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.getControl(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
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
        this.datosRiesgoForm.enable();
        this.datosRiesgoForm.reset({
          estadoId: 1,
          servicio: 'PARTICULAR'
        });
        this.datosRiesgoForm.get('id')?.disable();
        this.setNextId();
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
    this.datosRiesgoForm.get('id')?.disable();
    this.setNextId();
    this.cancelEdit.emit();
  }
}
