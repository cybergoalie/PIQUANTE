import { NgModule } from '@angular/core'; //  import statements that import the necessary modules and components from Angular and the application.
import { Routes, RouterModule } from '@angular/router';
import { SauceListComponent } from './sauce-list/sauce-list.component';
import { SauceFormComponent } from './sauce-form/sauce-form.component';
import { SingleSauceComponent } from './single-sauce/single-sauce.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './services/auth-guard.service';

const routes: Routes = [
  { path: 'signup', component: SignupComponent }, // signup and login routes point to the SignupComponent and LoginComponent respectively, which handle the signup and login functionality.
  { path: 'login', component: LoginComponent },
  { path: 'sauces', component: SauceListComponent, canActivate: [AuthGuard] }, // sauces route points to the SauceListComponent, which displays the list of sauces. The canActivate property specifies that the AuthGuard service should be used to guard access to this route.
  { path: 'sauce/:id', component: SingleSauceComponent, canActivate: [AuthGuard] }, // sauce/:id route points to the SingleSauceComponent, which displays the details of a single sauce item. The :id parameter represents the unique identifier of the sauce.
  { path: 'new-sauce', component: SauceFormComponent, canActivate: [AuthGuard] }, // new-sauce and modify-sauce/:id routes point to the SauceFormComponent, which is responsible for creating or modifying a sauce item. The canActivate property ensures that only authenticated users can access these routes.
  { path: 'modify-sauce/:id', component: SauceFormComponent, canActivate: [AuthGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'sauces'}, // The empty path '' redirects to the 'sauces' route by default, ensuring that when the application starts, the user is redirected to the sauce list.
  { path: '**', redirectTo: 'sauces' } // The ** route catches any undefined or invalid routes and redirects them to the 'sauces' route.
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
