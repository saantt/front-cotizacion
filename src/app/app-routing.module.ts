import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeducibleComponent } from './cotizacion/components/deducibles/deducibles.component';
import { TomadoresComponent } from './cotizacion/components/tomadores/tomadores.component';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: 'deducibles', component: DeducibleComponent },
  { path: 'tomadores', component: TomadoresComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
