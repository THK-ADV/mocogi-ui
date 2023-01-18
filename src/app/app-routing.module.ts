import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { OwnModulesComponent } from './own-modules/own-modules.component'
import { CreateOrUpdateModuleComponent } from './create-or-update-module/create-or-update-module.component'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'

const routes: Routes = [
  {
    path: '',
    component: OwnModulesComponent
  },
  {
    path: 'edit',
    component: CreateOrUpdateModuleComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
