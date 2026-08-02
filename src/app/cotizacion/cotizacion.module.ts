import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CotizacionRoutingModule } from './cotizacion-routing.module';
import { DeduciblesComponent } from './components/deducibles/deducibles.component';
import { ImpuestoCotizacionComponent } from './components/impuesto-cotizacion/impuesto-cotizacion.component';


@NgModule({
  declarations: [
    DeduciblesComponent,
    ImpuestoCotizacionComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CotizacionRoutingModule
  ],
  exports: [
    ImpuestoCotizacionComponent
  ]
})
export class CotizacionModule { }
