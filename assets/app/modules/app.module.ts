import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule, Routes } from '@angular/router';

import { AppComponent } from '../components/app/app.component';
import { NavComponent } from '../components/nav/nav.component';
import { PageNotFoundComponent } from '../components/404/404.component';
import { SigninComponent } from '../components/signin/signin.component';
import { SignupComponent } from '../components/signup/signup.component';
import { HomeComponent } from '../components/home/home.component';
import { MoviesComponent } from '../components/movies/movies.component';
import { SeriesComponent } from '../components/series/series.component';
import {FooterComponent} from "../components/footer/footer.component";

const appRoutes: Routes = [
    { path: 'signin', component: SigninComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'movies', component: MoviesComponent },
    { path: 'series', component: SeriesComponent },
    { path: '', component: HomeComponent },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        SigninComponent,
        SignupComponent,
        SeriesComponent,
        MoviesComponent,
        HomeComponent,
        PageNotFoundComponent,
        NavComponent,
        FooterComponent
    ],
    imports: [
        RouterModule.forRoot(appRoutes),
        BrowserModule
    ],
    bootstrap: [AppComponent]

})
export class AppModule{

}