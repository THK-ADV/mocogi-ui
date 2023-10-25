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
import { NewModulePageComponent } from './routes/new-module-page/new-module-page.component'
import {
  ElectiveModulesListsPageComponent,
} from './routes/elective-modules-lists-page/elective-modules-lists-page.component'
import {
  ModuleCompendiumListsPageComponent,
} from './routes/module-compendium-lists-page/module-compendium-lists-page.component'
import { ModuleReviewsPageComponent } from './routes/module-reviews-page/module-reviews-page.component'
import { ModuleReviewPageComponent } from './routes/module-review-page/module-review-page.component'

const routes: Routes = [
  {
    path: '',
    component: ModuleComponent,
  },
  {
    path: 'elective-modules-lists',
    component: ElectiveModulesListsPageComponent,
  },
  {
    path: 'module-compendium-lists',
    component: ModuleCompendiumListsPageComponent,
  },
  {
    path: 'module-reviews',
    component: ModuleReviewsPageComponent,
  },
  {
    path: 'module-reviews/:moduleId',
    component: ModuleReviewPageComponent,
    ...requireRoles(['professor', 'employee'], 'any'),
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
    path: 'modules/new',
    component: NewModulePageComponent,
    ...requireRoles(['professor', 'employee'], 'any'),
  },
  {
    path: 'modules/:moduleId',
    component: ModuleCompendiumHtmlComponent,
  },
  {
    path: 'modules/:moduleId/edit',
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
