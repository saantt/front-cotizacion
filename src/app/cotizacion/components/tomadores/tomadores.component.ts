import { Component, OnInit } from '@angular/core';
import { TomadorModule } from '../../models/tomador/tomador.module';
import { TomadorServiceService } from '../../services/tomador-service.service';

@Component({
  selector: 'app-tomadores',
  templateUrl: './tomadores.component.html',
  styleUrls: ['./tomadores.component.css']
})
export class TomadoresComponent implements OnInit {

  tomadores: TomadorModule[] = [];

  tomador: TomadorModule = {
    ccTomador: 0,
    nombreTomador: '',
    email: '',
    telefono: '',
    fecNacimiento: new Date(),
    ocupacion: '',
    direccion: '',
    genero: '',
    tipPersona: ''
  };

  editando = false;

  constructor(private tomadorService: TomadorServiceService) { }

  ngOnInit(): void {
    this.cargarTomadores();
  }

  cargarTomadores(): void {
    this.tomadorService.getTomadores().subscribe(data => {
      console.log(data);
      this.tomadores = data;
    });
  }

  guardar(): void {

    if (this.editando) {

      this.tomadorService.updateTomador(this.tomador.ccTomador, this.tomador)
        .subscribe(() => {
          alert('Tomador actualizado correctamente');
          this.limpiarFormulario();
          this.cargarTomadores();
        });

    } else {

      this.tomadorService.crearTomador(this.tomador)
        .subscribe(() => {
          alert('Tomador creado correctamente');
          this.limpiarFormulario();
          this.cargarTomadores();
        });

    }

  }

  editar(t: TomadorModule): void {

    this.tomador = { ...t };
    this.editando = true;

  }

  eliminar(t: TomadorModule): void {

    if (confirm('¿Desea eliminar este tomador?')) {

      this.tomadorService.deleteTomador(t)
        .subscribe(() => {

          alert('Tomador eliminado');

          this.cargarTomadores();

        });

    }

  }

  limpiarFormulario(): void {

    this.tomador = {
      ccTomador: 0,
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

  }

  bloquearTeclasInvalidas(event: KeyboardEvent) {
  if (['e', 'E', '+', '-', '.',','].includes(event.key)) {
    event.preventDefault();
  }
  }

}
