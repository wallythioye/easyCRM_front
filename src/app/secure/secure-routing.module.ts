import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "./layout/layout.component";
import {ContactsComponent} from "./pages/contacts/contacts.component";
import {FacturesComponent} from "./pages/factures/factures.component";
import {OpportunitesComponent } from './pages/opportunites/opportunites.component';
import { LigneFactureComponent } from './pages/ligne-facture/ligne-facture.component';

const routes: Routes = [
  {
    path:"",
    component:LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'contacts',
        pathMatch: 'full'
      },
      
      {
        path: 'contacts',
        component: ContactsComponent
      },
      
      {
        path: 'factures',
        component: FacturesComponent,
      },
      {
        path: 'opportunites',
        component: OpportunitesComponent,
      },
      
      ]

  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecureRoutingModule { }
