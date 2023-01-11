import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { OwnModulesComponent } from './own-modules/own-modules.component'
import { CreateOrUpdateModuleComponent } from './create-or-update-module/create-or-update-module.component'

const routes: Routes = [
  {
    path: '',
    component: OwnModulesComponent
  },
  {
    path: 'edit',
    component: CreateOrUpdateModuleComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
