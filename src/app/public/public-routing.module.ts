import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  /*{
    path:"",
    component:LayoutComponent,
    children:[
      {
        path:"catalogue",
        component: CatalogueComponent
      }
    ]
  }*/
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
