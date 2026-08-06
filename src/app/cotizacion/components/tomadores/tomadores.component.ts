import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TomadorModule } from '../../models/tomador/tomador.module';
import { TomadorServiceService } from '../../services/tomador-service.service';
import Swal from 'sweetalert2';
import { Page } from '../../models/page.model';

@Component({
  selector: 'app-tomadores',
  templateUrl: './tomadores.component.html',
  styleUrls: ['./tomadores.component.css']
})
export class TomadoresComponent implements OnInit {

  /*==========================
    FORMULARIO Y VALIDACIONES
  ==========================*/
  formError = '';
  showForm = false;
  editando = false;
  vista = false;
  mode: 'view' | 'edit' | 'create' | null = null;
  seleccionarRegistro: TomadorModule | null = null;

  closeForm() {
    this.showForm = false;
    this.formError = '';
    this.limpiarFormulario();
  }

  /*===========
    PAGINACIÓN
  ============*/
  tomadoresPage!: Page<TomadorModule>;
  currentPage = 0;
  pageSize = 10;
  pages: number[] = [];

  tomadores: TomadorModule[] = [];

  tomador: TomadorModule = {
    ccTomador: '',
    nombreTomador: '',
    email: '',
    telefono: '',
    fecNacimiento: new Date(),
    ocupacion: '',
    direccion: '',
    genero: '',
    tipPersona: ''
  };

  constructor(
    private tomadorService: TomadorServiceService
  ) { }

  ngOnInit(): void {
    this.mode = 'create';
    this.cargarTomadores();
  }

  cargarTomadores(): void {
  this.tomadorService.getTomadoresPaginados(this.currentPage, this.pageSize).subscribe({
    next: (data) => {
      console.log('Respuesta del backend:', data);
      this.tomadoresPage = data;
    },
    error: (err) => console.error('Error al consultar tomadores:', err)
  });
}

  cambiarPagina(nuevaPagina: number): void {
    this.currentPage = nuevaPagina;
    this.cargarTomadores();
  }

  ver(t: TomadorModule): void {
    this.showForm = true;
    this.formError = '';
    this.mode = 'view';
    this.seleccionarRegistro = t;
    this.tomador = { ...t, ccTomador: t.ccTomador.toString() };
    this.editando = false;
    this.vista = true;
  }

  guardar(tomadorForm: NgForm): void {
    if (tomadorForm.invalid) {
      tomadorForm.form.markAllAsTouched();
      this.formError = 'Faltan campos por llenar o contienen errores.';
      return;
    }

    this.formError = '';

    if (this.editando) {

      this.tomadorService.updateTomador(Number(this.tomador.ccTomador), {
        ...this.tomador,
        ccTomador: Number(this.tomador.ccTomador)
      } as TomadorModule)
        .subscribe({
          next: () => {
            this.cargarTomadores();
            this.limpiarFormulario();
            this.showForm = false;
            Swal.fire({
              title: 'Actualizado',
              text: 'Tomador actualizado correctamente',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (err) => {
            console.error('Error actualizando tomador:', err);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo actualizar el tomador.',
              icon: 'error'
            });
          }
        });

    } else {

      const payload = {
        ...this.tomador,
        ccTomador: Number(this.tomador.ccTomador)
      } as TomadorModule;

      this.tomadorService.crearTomador(payload)
        .subscribe({
          next: () => {
            this.cargarTomadores();
            this.limpiarFormulario();
            this.showForm = false;
            Swal.fire({
              title: 'Guardado',
              text: 'Tomador creado correctamente',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (err) => {
            console.error('Error creando tomador:', err);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo crear el tomador.',
              icon: 'error'
            });
          }
        });

    }

  }

  editar(t: TomadorModule): void {
    this.showForm = true;
    this.formError = '';
    this.mode = 'edit';
    this.seleccionarRegistro = t;
    this.tomador = { ...t, ccTomador: t.ccTomador.toString() };
    this.editando = true;
    this.vista = false;
  }

  eliminar(t: TomadorModule): void {

    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Desea eliminar el tomador ${t.nombreTomador}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2563EB',
      cancelButtonColor: '#6B7280'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tomadorService.deleteTomador(Number(t.ccTomador)).subscribe({
          next: () => {
            this.cargarTomadores();
            Swal.fire({
              title: 'Eliminado',
              text: 'El tomador fue eliminado correctamente',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (err) => {
            console.error('Error eliminando tomador:', err);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar el tomador.',
              icon: 'error'
            });
          }
        });
      }
    });
  }

  nuevoTomador(): void {
    this.showForm = true;
    this.formError = '';

    this.mode = 'create';
    this.seleccionarRegistro = null;
    this.editando = false;
    this.vista = false;
    this.tomador = {
      ccTomador: '',
      nombreTomador: '',
      email: '',
      telefono: '',
      fecNacimiento: new Date(),
      ocupacion: '',
      direccion: '',
      genero: '',
      tipPersona: ''
    };
  }

  limpiarFormulario(): void {
    this.formError = '';
    this.tomador = {
      ccTomador: '',
      nombreTomador: '',
      email: '',
      telefono: '',
      fecNacimiento: new Date(),
      ocupacion: '',
      direccion: '',
      genero: '',
      tipPersona: ''
    };

    this.editando = false;
    this.vista = false;
    this.seleccionarRegistro = null;
    this.mode = 'create';
  }

  bloquearTeclasInvalidas(event: KeyboardEvent) {
    if (['e', 'E', '+', '-', '.', ','].includes(event.key)) {
      event.preventDefault();
    }
  }

  limpiarCaracteresInvalidos(event: Event) {
    const input = event.target as HTMLInputElement;
    // Reemplaza cualquier carácter que no sea un número (0-9)
    input.value = input.value.replace(/[^0-9]/g, '');
  }



}
