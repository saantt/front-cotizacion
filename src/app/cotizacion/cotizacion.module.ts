import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CotizacionRoutingModule } from './cotizacion-routing.module';
import { DeduciblesComponent } from './components/deducibles/deducibles.component';
import { DatosRiesgoComponent } from './components/datos-riesgo/datos-riesgo.component';
import { FormDatosRiesgoComponent } from './components/datos-riesgo/form-datos-riesgo/form-datos-riesgo.component';
import { ListDatosRiesgosComponent } from './components/datos-riesgo/list-datos-riesgo/list-datos-riesgos.component';


@NgModule({
  declarations: [
    DeduciblesComponent,
    DatosRiesgoComponent,
    FormDatosRiesgoComponent,
    ListDatosRiesgosComponent
  ],
  imports: [
    CommonModule,
    CotizacionRoutingModule,
    ReactiveFormsModule
  ],
  exports: [
    DatosRiesgoComponent,
    DeduciblesComponent
  ]
})
export class CotizacionModule { }
