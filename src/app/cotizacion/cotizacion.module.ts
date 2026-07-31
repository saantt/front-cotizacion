import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CotizacionRoutingModule } from './cotizacion-routing.module';
import { DeduciblesComponent } from './components/deducibles/deducibles.component';
import { TomadoresComponent } from './components/tomadores/tomadores.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    DeduciblesComponent,
    TomadoresComponent
  ],
  imports: [
    CommonModule,
    CotizacionRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [
    TomadoresComponent
  ]
})
export class CotizacionModule { }
