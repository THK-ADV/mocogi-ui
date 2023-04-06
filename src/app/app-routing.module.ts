import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { OwnModulesComponent } from './own-modules/own-modules.component'
import { CreateOrUpdateModuleComponent } from './create-or-update-module/create-or-update-module.component'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'
import { ModuleCompendiumHtmlComponent } from './module-compendium-html/module-compendium-html.component'
import { ModuleComponent } from './module/module.component'

const routes: Routes = [
  {
    path: '',
    component: ModuleComponent
  },
  {
    path: 'modules',
    component: OwnModulesComponent
  },
  {
    path: 'edit',
    component: CreateOrUpdateModuleComponent
  },
  {
    path: 'show',
    component: ModuleCompendiumHtmlComponent
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
