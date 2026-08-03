import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeducibleComponent } from './components/deducibles/deducibles.component';
import { TomadoresComponent } from './components/tomadores/tomadores.component';

const routes: Routes = [
  { path: '', component: DeducibleComponent },
  { path: 'tomadores', component: TomadoresComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CotizacionRoutingModule { }
