import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CotizacionRoutingModule } from './cotizacion-routing.module';
import { DeducibleComponent } from './components/deducibles/deducibles.component';
import { DatosRiesgoComponent } from './components/datos-riesgo/datos-riesgo.component';
import { FormDatosRiesgoComponent } from './components/datos-riesgo/form-datos-riesgo/form-datos-riesgo.component';
import { ListDatosRiesgosComponent } from './components/datos-riesgo/list-datos-riesgo/list-datos-riesgo.component';
import { TomadoresComponent } from './components/tomadores/tomadores.component';
import { CoverageComponent } from './components/coverages/coverage.component';


@NgModule({
  declarations: [
    DeducibleComponent,
    DatosRiesgoComponent,
    FormDatosRiesgoComponent,
    ListDatosRiesgosComponent,
    TomadoresComponent,
    CoverageComponent
  ],
  imports: [
    CommonModule,
    CotizacionRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  exports: [
    DatosRiesgoComponent,
    TomadoresComponent,
    DeducibleComponent,
    CoverageComponent
  ]
})
export class CotizacionModule { }
