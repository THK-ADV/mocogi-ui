import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { AllModulesComponent } from './all-modules/all-modules.component'
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
import { BackendUrlInterceptor } from './http/backend-url.interceptor'
import { PlainInputComponent } from './form/plain-input/plain-input.component'
import { EditModuleComponent } from './form/edit-module/edit-module.component'
import { ReactiveFormsModule } from '@angular/forms'
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


@NgModule({
  declarations: [
    AppComponent,
    AllModulesComponent,
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
    MultipleEditDialogComponent
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
    MatCardModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BackendUrlInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
