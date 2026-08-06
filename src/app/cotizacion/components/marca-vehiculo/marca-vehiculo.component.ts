import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarcaVehiculoService } from '../../services/marca-vehiculo.service';
import { MarcaVehiculo } from '../../models/marca-vehiculo.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-marca-vehiculo',
  templateUrl: './marca-vehiculo.component.html',
  styleUrls: ['./marca-vehiculo.component.css']
})
export class MarcaVehiculoComponent implements OnInit {

  /*==========================
    FORMULARIO Y VALIDACIONES
  ==========================*/
  showForm = false;
  form!: FormGroup;
  registroSeleccionado: MarcaVehiculo | null = null;
  modo: 'crear' | 'editar' | 'ver' = 'crear';

  closeForm() {
    this.showForm = false;
  }

  /*===========
    PAGINACIÓN
  ============*/
  pageSize = 7;
  currentPage = 1;
  paginatedCoverages: MarcaVehiculo[] = [];
  pages: number[] = [];

  changePage(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.paginatedCoverages = this.marcavehiculo.slice(start, end);

    this.pages = Array.from(
      { length: this.totalPages() },
      (_, index) => index + 1
    );
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
  
  totalPages(): number {
    return Math.ceil(this.marcavehiculo.length / this.pageSize);
  }
  
  goToPage(page: number): void {
    this.currentPage = page;
    this.changePage();
  }


  marcavehiculo: MarcaVehiculo[] = [];
 
  constructor(
    private fb: FormBuilder,
    private marcaVehiculoService: MarcaVehiculoService
  ) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      nombre_marca_vehiculo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      pais_origen_vehiculo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      abreviatura_vehiculo: ['', [Validators.required, Validators.pattern(/^[A-Za-z]{3}$/)]]
    });

    this.marcaVehiculoService.marcas$
      .subscribe(lista => {
        this.marcavehiculo = lista;
        this.currentPage = 1;
        this.changePage();
      });
    this.marcaVehiculoService.cargarMarcasVehiculo();
  }

  // =========================
  // NUEVO
  // =========================

  nuevo(): void {
    this.showForm = true;
    this.modo = 'crear';
    this.registroSeleccionado = null;
    this.form.reset();
    this.form.enable();
  }

  // =========================
  // VER
  // =========================

  ver(mv: MarcaVehiculo): void {
    this.showForm = true;
    this.modo = 'ver';
    this.registroSeleccionado = mv;
    this.form.patchValue(mv);
    this.form.disable();
  }

  // =========================
  // EDITAR
  // =========================

  editar(mv: MarcaVehiculo): void {
    this.showForm = true;
    this.modo = 'editar';
    this.registroSeleccionado = mv;
    this.form.enable();
    this.form.patchValue(mv);
  }

  // =========================
  // GUARDAR
  // POST / PUT
  // =========================

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const marca: MarcaVehiculo = {
      id_marca_vehiculo: this.registroSeleccionado?.id_marca_vehiculo ?? 0,
      ...this.form.value
    };

    if (this.modo === 'crear') {
      this.marcaVehiculoService.crearMarcaVehiculo(marca)
        .subscribe({
          next: () => {
            this.marcaVehiculoService.cargarMarcasVehiculo();
            this.form.reset();
            this.form.enable();
            this.showForm = false;
            Swal.fire({
              title: 'Guardado',
              text: 'La marca de vehículo fue creada correctamente.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (error) => {
            console.error('Error creando marca:', error);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo crear la marca de vehículo.',
              icon: 'error'
            });
          }
        });
    } else if (this.modo === 'editar') {
      this.marcaVehiculoService.actualizarMarcaVehiculo(
        marca.id_marca_vehiculo,
        marca
      )
        .subscribe({
          next: () => {
            this.marcaVehiculoService.cargarMarcasVehiculo();
            this.form.reset();
            this.form.enable();
            this.showForm = false;
            Swal.fire({
              title: 'Actualizado',
              text: 'La marca de vehículo fue actualizada correctamente.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (error) => {
            console.error('Error actualizando marca:', error);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo actualizar la marca de vehículo.',
              icon: 'error'
            });
          }
        });
    }
  }

  // =========================
  // ELIMINAR
  // =========================

  eliminar(mv: MarcaVehiculo): void {
    if (!mv.id_marca_vehiculo) {
      return;
    }

    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Desea eliminar la marca ${mv.nombre_marca_vehiculo}?`,
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

      this.marcaVehiculoService.eliminarMarcaVehiculo(mv.id_marca_vehiculo)
        .subscribe({
          next: () => {
            this.marcaVehiculoService.cargarMarcasVehiculo();
            Swal.fire({
              title: 'Eliminado',
              text: 'La marca de vehículo fue eliminada correctamente.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (error) => {
            console.error('Error eliminando marca:', error);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar la marca de vehículo.',
              icon: 'error'
            });
          }
        });
    });
  }

  trackById(index: number, item: MarcaVehiculo): number {
    return item.id_marca_vehiculo;
  }

}
