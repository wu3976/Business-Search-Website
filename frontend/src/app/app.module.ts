import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs'

import { AppComponent } from './app.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { BookingsPageComponent } from './components/bookings-page/bookings-page.component';
import { ResultTableComponent } from './components/result-table/result-table.component';
import { EmptyResultBannerComponent } from './components/empty-result-banner/empty-result-banner.component';
import { DetailCardComponent } from './components/detail-card/detail-card.component';
import { routing } from './app-routing';

const appRoutes = [
  {"path": 'search', "component": SearchPageComponent},
  {"path": 'bookings', "component": BookingsPageComponent},
  //{"path": '', redirctTo: '/search', pathMatch: 'full'}
  {"path": '', pathMatch: 'full', redirectTo: '/search'}
];

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    SearchFormComponent,
    SearchPageComponent,
    BookingsPageComponent,
    ResultTableComponent,
    EmptyResultBannerComponent,
    DetailCardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    routing,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    GoogleMapsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
