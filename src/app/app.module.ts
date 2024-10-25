import { APP_INITIALIZER, isDevMode, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppComponent } from './app.component'
import { ModuleComponent } from './components/module/module.component'
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http'
import { MatListModule } from '@angular/material/list'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatTableModule } from '@angular/material/table'
import { MatInputModule } from '@angular/material/input'
import { MatSortModule } from '@angular/material/sort'
import { MatButtonModule } from '@angular/material/button'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatIconModule } from '@angular/material/icon'
import { MatPaginatorModule } from '@angular/material/paginator'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { NavComponent } from './structure/nav/nav.component'
import { RouterOutlet } from '@angular/router'
import { HeaderComponent } from './structure/header/header.component'
import { MatToolbarModule } from '@angular/material/toolbar'
import { LineComponent } from './structure/line/line.component'
import { HttpInterceptorDecorator } from './http/http-interceptor-decorator.service'
import { PlainInputComponent } from './form/plain-input/plain-input.component'
import { ModuleFormComponent } from './form/module-form/module-form.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module'
import { MatDialogModule } from '@angular/material/dialog'
import { OptionsInputComponent } from './form/options-input/options-input.component'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MultipleOptionsInputComponent } from './form/multiple-options-input/multiple-options-input.component'
import { MatSelectModule } from '@angular/material/select'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { ReadOnlyInputComponent } from './form/read-only-input/read-only-input.component'
import { MatCardModule } from '@angular/material/card'
import { MultipleEditDialogComponent } from './form/multiple-edit-dialog/multiple-edit-dialog.component'
import { BooleanInputComponent } from './form/boolean-input/boolean-input.component'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { ParticipantsComponent } from './form/participants/participants.component'
import { ModuleRelationComponent } from './form/module-relation/module-relation.component'
import { ConfirmationDialogComponent } from './generic-ui/confirmation-dialog/confirmation-dialog.component'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'
import { ModuleDetailComponent } from './components/module-detail/module-detail.component'
import { AlertComponent } from './alert/alert.component'
import { ModuleListComponent } from './components/module/module-list/module-list.component'
import { StoreModule } from '@ngrx/store'
import { moduleReducer } from './state/reducer/module.reducer'
import { EffectsModule } from '@ngrx/effects'
import { ModuleEffects } from './state/effects/module.effects.service'
import { ModuleFilterComponent } from './components/module/module-filter/module-filter.component'
import { moduleFilterReducer } from './state/reducer/module-filter.reducer'
import { NavigationEffects } from './state/effects/navigation.effects'
import { ModuleFilterEffects } from './state/effects/module-filter.effects.service'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { StudyProgramFilterComponent } from './components/module/module-filter/study-program-filter/study-program-filter.component'
import { AbstractModuleFilterComponent } from './components/module/module-filter/abstract-module-filter/abstract-module-filter.component'
import { SemesterFilterComponent } from './components/module/module-filter/semester-filter/semester-filter.component'
import { CoordinatorFilterComponent } from './components/module/module-filter/coordinator-filter/coordinator-filter.component'
import { ModuleListSearchComponent } from './components/module/module-list-search/module-list-search.component'
import { MatTabsModule } from '@angular/material/tabs'
import { MatChipsModule } from '@angular/material/chips'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular'
import { initializeKeycloak } from './keycloak/keycloak-init'
import { ThKoelnBarComponent } from './components/th-koeln-bar/th-koeln-bar.component'
import { MatSidenavModule } from '@angular/material/sidenav'
import { AppRailComponent } from './components/app-rail/app-rail.component'
import { NavBarComponent } from './components/nav-bar/nav-bar.component'
import { LoaderComponent } from './components/loader/loader.component'
import { MyModulesPageComponent } from './routes/my-modules-page/my-modules-page.component'
import { MatMenuModule } from '@angular/material/menu'
import { UpdateModulePageComponent } from './routes/update-module-page/update-module-page.component'
import { MatStepperModule } from '@angular/material/stepper'
import { MatExpansionModule } from '@angular/material/expansion'
import { myModulesReducer } from './state/reducer/my-modules.reducer'
import { MyModuleEffects } from './state/effects/my-modules-effects.service'
import { MyModulesListComponent } from './routes/my-modules-page/my-modules-list/my-modules-list.component'
import { UpdateModuleEffects } from './state/effects/update-module.effects'
import { NewModulePageComponent } from './routes/new-module-page/new-module-page.component'
import { NewModuleEffects } from './state/effects/new-module-page.effects'
import { ModuleApprovalsPageComponent } from './routes/module-approvals-page/module-approvals-page.component'
import { ElectiveModulesListsPageComponent } from './routes/elective-modules-lists-page/elective-modules-lists-page.component'
import { ModuleCompendiumsPageComponent } from './routes/module-compendiums-page/module-compendiums-page.component'
import { ModuleCompendiumListsListComponent } from './components/catalogs/module-compendium-lists-list/module-compendium-lists-list.component'
import { ElectiveModulesListsListComponent } from './components/catalogs/elective-modules-lists-list/elective-modules-lists-list.component'
import { updateModuleReducer } from './state/reducer/update-module.reducer'
import { ModuleApprovalPageComponent } from './routes/module-review-page/module-approval-page.component'
import { ListOfChangesComponent } from './components/list-of-changes/list-of-changes.component'
import { ModuleFormActionsComponent } from './components/module-form-actions/module-form-actions.component'
import { ModuleReviewActionsComponent } from './components/module-review-actions/module-review-actions.component'
import { ModuleApprovalEffects } from './state/effects/module-approval-page.effects.service'
import { ListOfCommentsComponent } from './components/list-of-comments/list-of-comments.component'
import { PermissionsDialogComponent } from './components/permissions-dialog/permissions-dialog.component'
import { PermissionsDialogEffects } from './state/effects/permissions-dialog.effects.service'
import { permissionsDialogReducer } from './state/reducer/permissions-dialog.reducer'
import { ModuleCompendiumsFilterComponent } from './components/module-compendiums-filter/module-compendiums-filter.component'
import { moduleCatalogsReducer } from './state/reducer/module-catalogs.reducer'
import { ModuleCompendiumEffects } from './state/effects/module-catalogs.effects.service'
import { moduleCompendiumsFilterReducer } from './state/reducer/module-compendiums-filter.reducer'
import { ModuleCompendiumsFilterEffects } from './state/effects/module-compendiums-filter.service'
import { ElectivesCatalogsEffects } from './state/effects/electives-catalogues.effects.service'
import { electiveCatalogsReducer } from './state/reducer/electives-catalogs.reducer'
import { ElectivesCatalogsFilterComponent } from './components/electives-catalogs-filter/electives-catalogs-filter.component'
import { electivesCatalogsFilterReducer } from './state/reducer/electives-catalogs-filter.reducer'
import { ElectivesCatalogsFilterEffects } from './state/effects/electives-catalogs-filter.effects.service'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { newModuleReducer } from './state/reducer/new-module.reducer'
import { UnsafeHtmlPipe } from './pipe/unsafe-html.pipe'
import { StudyProgramPipe } from './pipe/study-program.pipe'
import { PreviewPageComponent } from './routes/preview-page/preview-page.component'
import { ModuleDetailHtmlComponent } from './components/module-detail/module-detail-html/module-detail-html.component'

@NgModule({
  declarations: [
    AppComponent,
    ModuleComponent,
    NavComponent,
    HeaderComponent,
    LineComponent,
    PlainInputComponent,
    ModuleFormComponent,
    OptionsInputComponent,
    MultipleOptionsInputComponent,
    ReadOnlyInputComponent,
    MultipleEditDialogComponent,
    BooleanInputComponent,
    ParticipantsComponent,
    ModuleRelationComponent,
    ConfirmationDialogComponent,
    PageNotFoundComponent,
    ModuleDetailComponent,
    UnsafeHtmlPipe,
    AlertComponent,
    ModuleListComponent,
    ModuleFilterComponent,
    StudyProgramFilterComponent,
    AbstractModuleFilterComponent,
    ModuleFilterComponent,
    SemesterFilterComponent,
    CoordinatorFilterComponent,
    ModuleListSearchComponent,
    AppRailComponent,
    NavBarComponent,
    LoaderComponent,
    MyModulesPageComponent,
    UpdateModulePageComponent,
    MyModulesListComponent,
    NewModulePageComponent,
    ModuleApprovalsPageComponent,
    ElectiveModulesListsPageComponent,
    ModuleCompendiumsPageComponent,
    ModuleCompendiumListsListComponent,
    ElectiveModulesListsListComponent,
    ModuleApprovalPageComponent,
    ListOfChangesComponent,
    ModuleFormActionsComponent,
    ModuleReviewActionsComponent,
    ListOfCommentsComponent,
    PermissionsDialogComponent,
    ModuleCompendiumsFilterComponent,
    ElectivesCatalogsFilterComponent,
    StudyProgramPipe,
    PreviewPageComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    MatStepperModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatListModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatSortModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressBarModule,
    NgbModule,
    RouterOutlet,
    MatToolbarModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    StoreModule.forRoot(
      {
        module: moduleReducer,
        moduleFilter: moduleFilterReducer,
        myModules: myModulesReducer,
        updateModule: updateModuleReducer,
        newModule: newModuleReducer,
        permissionDialog: permissionsDialogReducer,
        moduleCatalogs: moduleCatalogsReducer,
        moduleCompendiumsFilter: moduleCompendiumsFilterReducer,
        electivesCatalogs: electiveCatalogsReducer,
        electivesCatalogsFilter: electivesCatalogsFilterReducer,
      },
      {},
    ),
    EffectsModule.forRoot([
      ModuleEffects,
      NavigationEffects,
      ModuleFilterEffects,
      MyModuleEffects,
      UpdateModuleEffects,
      NewModuleEffects,
      ModuleApprovalEffects,
      PermissionsDialogEffects,
      ModuleCompendiumEffects,
      ModuleCompendiumsFilterEffects,
      ElectivesCatalogsEffects,
      ElectivesCatalogsFilterEffects,
    ]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: !isDevMode(),
      connectInZone: true,
    }),
    FormsModule,
    MatTabsModule,
    MatChipsModule,
    KeycloakAngularModule,
    ThKoelnBarComponent,
    MatSidenavModule,
    MatMenuModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    ModuleDetailHtmlComponent,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorDecorator,
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
