import { RouterModule, Routes } from "@angular/router";
import { BookingsPageComponent } from "./components/bookings-page/bookings-page.component";
import { SearchPageComponent } from "./components/search-page/search-page.component";

const appRoutes : Routes = [
    {"path": 'search', "component": SearchPageComponent},
    {"path": 'bookings', "component": BookingsPageComponent},
    //{"path": '', redirctTo: '/search', pathMatch: 'full'}
    {"path": '', pathMatch: 'full', redirectTo: '/search'}
];

export const routing = RouterModule.forRoot(appRoutes);