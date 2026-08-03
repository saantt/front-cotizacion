import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CotizacionRoutingModule } from './cotizacion-routing.module';
import { DeduciblesComponent } from './components/deducibles/deducibles.component';
import { CoberturaRiesgoComponent } from './components/cobertura-riesgo/cobertura-riesgo.component';


@NgModule({
  declarations: [
    DeduciblesComponent,
    CoberturaRiesgoComponent
  ],
  imports: [
    CommonModule,
    CotizacionRoutingModule,
    ReactiveFormsModule
  ],
  exports: [
    CoberturaRiesgoComponent
  ]
})
export class CotizacionModule { }
