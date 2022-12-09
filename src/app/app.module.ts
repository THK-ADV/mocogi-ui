import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { AllModulesComponent } from './all-modules/all-modules.component'
import { HttpClientModule } from '@angular/common/http'
import { MatListModule } from '@angular/material/list'
import { OwnModulesComponent } from './own-modules/own-modules.component'

@NgModule({
  declarations: [
    AppComponent,
    AllModulesComponent,
    OwnModulesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
