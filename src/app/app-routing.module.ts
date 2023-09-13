import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { OwnModulesComponent } from './own-modules/own-modules.component'
import { CreateOrUpdateModuleComponent } from './create-or-update-module/create-or-update-module.component'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'
import { ModuleCompendiumHtmlComponent } from './module-compendium-html/module-compendium-html.component'
import { ModuleComponent } from './module/module.component'
import { requireRoles } from './keycloak/auth.guard'
import { MyModulesPageComponent } from './routes/my-modules-page/my-modules-page.component'
import { UpdateModulePageComponent } from './routes/update-module-page/update-module-page.component'

const routes: Routes = [
  {
    path: '',
    component: ModuleComponent,
  },
  {
    path: 'modules',
    component: OwnModulesComponent,
    ...requireRoles(['professor', 'employee'], 'any'),
  },
  {
    path: 'my-modules',
    component: MyModulesPageComponent,
    ...requireRoles(['professor', 'employee'], 'any'),
  },
  {
    path: 'modules/:id',
    component: ModuleCompendiumHtmlComponent,
  },
  {
    path: 'modules/:id/edit',
    component: UpdateModulePageComponent,
    ...requireRoles(['professor', 'employee'], 'any'),
  },
  {
    path: 'edit',
    component: CreateOrUpdateModuleComponent,
  },
  {
    path: 'show',
    component: ModuleCompendiumHtmlComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
