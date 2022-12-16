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


@NgModule({
  declarations: [
    AppComponent,
    AllModulesComponent,
    OwnModulesComponent,
    NavComponent,
    HeaderComponent,
    LineComponent
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
    MatToolbarModule
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
