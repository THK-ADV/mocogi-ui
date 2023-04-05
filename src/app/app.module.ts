import { isDevMode, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { ModuleComponent } from './module/module.component'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { MatListModule } from '@angular/material/list'
import { OwnModulesComponent } from './own-modules/own-modules.component'
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
import { EditModuleComponent } from './form/edit-module/edit-module.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module'
import { CreateOrUpdateModuleComponent } from './create-or-update-module/create-or-update-module.component'
import { MatDialogModule } from '@angular/material/dialog'
import { OptionsInputComponent } from './form/options-input/options-input.component'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MultipleOptionsInputComponent } from './form/multiple-options-input/multiple-options-input.component'
import { MatSelectModule } from '@angular/material/select'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { ReadOnlyInputComponent } from './form/read-only-input/read-only-input.component'
import { AssessmentMethodDialogComponent } from './form/assessment-method-dialog/assessment-method-dialog.component'
import { MatCardModule } from '@angular/material/card'
import { MultipleEditDialogComponent } from './form/multiple-edit-dialog/multiple-edit-dialog.component'
import { BooleanInputComponent } from './form/boolean-input/boolean-input.component'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { ParticipantsComponent } from './form/participants/participants.component'
import { ModuleRelationComponent } from './form/module-relation/module-relation.component'
import { ConfirmationDialogComponent } from './generic-ui/confirmation-dialog/confirmation-dialog.component'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'
import { ModuleCompendiumHtmlComponent } from './module-compendium-html/module-compendium-html.component'
import { UnsafeHtmlPipe } from './pipe/unsafe-html.pipe'
import { AlertComponent } from './alert/alert.component'
import { PipelineErrorPipe } from './pipe/pipeline-error.pipe'
import { ModuleListComponent } from './module/module-list/module-list.component'
import { StoreModule } from '@ngrx/store'
import { moduleReducer } from './state/reducer/module.reducer'
import { EffectsModule } from '@ngrx/effects'
import { ModuleEffects } from './state/effects/module.effects.service'
import { ModuleFilterComponent } from './module/module-filter/module-filter.component'
import { moduleFilterReducer } from './state/reducer/module-filter.reducer'
import { NavigationEffects } from './state/effects/navigation.effects'
import { ModuleFilterEffects } from './state/effects/module-filter.effects.service'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { StudyProgramFilterComponent } from './module/module-filter/study-program-filter/study-program-filter.component'
import { AbstractModuleFilterComponent } from './module/module-filter/abstract-module-filter/abstract-module-filter.component'
import { SemesterFilterComponent } from './module/module-filter/semester-filter/semester-filter.component'
import { CoordinatorFilterComponent } from './module/module-filter/coordinator-filter/coordinator-filter.component';
import { ModuleListSearchComponent } from './module/module-list-search/module-list-search.component'
import { MatTabsModule } from '@angular/material/tabs'

@NgModule({
  declarations: [
    AppComponent,
    ModuleComponent,
    OwnModulesComponent,
    NavComponent,
    HeaderComponent,
    LineComponent,
    PlainInputComponent,
    EditModuleComponent,
    CreateOrUpdateModuleComponent,
    OptionsInputComponent,
    MultipleOptionsInputComponent,
    ReadOnlyInputComponent,
    AssessmentMethodDialogComponent,
    MultipleEditDialogComponent,
    BooleanInputComponent,
    ParticipantsComponent,
    ModuleRelationComponent,
    ConfirmationDialogComponent,
    PageNotFoundComponent,
    ModuleCompendiumHtmlComponent,
    UnsafeHtmlPipe,
    AlertComponent,
    PipelineErrorPipe,
    ModuleListComponent,
    ModuleFilterComponent,
    StudyProgramFilterComponent,
    AbstractModuleFilterComponent,
    ModuleFilterComponent,
    SemesterFilterComponent,
    CoordinatorFilterComponent,
    ModuleListSearchComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatListModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatSortModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatPaginatorModule,
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
    StoreModule.forRoot({module: moduleReducer, moduleFilter: moduleFilterReducer}, {}),
    EffectsModule.forRoot([ModuleEffects, NavigationEffects, ModuleFilterEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 15,
    }),
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: !isDevMode()}),
    FormsModule,
    MatTabsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorDecorator,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
