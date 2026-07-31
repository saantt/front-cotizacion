import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CotizacionRoutingModule } from './cotizacion-routing.module';
import { DeduciblesComponent } from './components/deducibles/deducibles.component';


@NgModule({
  declarations: [
    DeduciblesComponent
  ],
  imports: [
    CommonModule,
    CotizacionRoutingModule
  ]
})
export class CotizacionModule { }
