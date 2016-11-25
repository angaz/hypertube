import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import { AppComponent } from '../components/app/app.component';
import { NavComponent } from '../components/nav/nav.component';
import { PageNotFoundComponent } from '../components/404/404.component';
import { SigninComponent } from '../components/signin/signin.component';
import { SignupComponent } from '../components/signup/signup.component';
import { LogoutComponent } from "../components/logout/logout.component";
import { HomeComponent } from '../components/home/home.component';
import { MoviesComponent } from '../components/movies/movies.component';
import { SeriesComponent } from '../components/series/series.component';
import { FooterComponent } from "../components/footer/footer.component";
import { MoviesInfoComponent } from "../components/movies-info/movies-info.component";
import { WatchComponent } from "../components/watch/watch.component";
import { AuthService } from "../services/auth.service";

const appRoutes: Routes = [
    { path: 'signin', component: SigninComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'movies', component: MoviesComponent },
    { path: 'series', component: SeriesComponent },
    { path: 'watch/:name', component: WatchComponent},
    { path: '', component: HomeComponent },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        SigninComponent,
        SignupComponent,
        LogoutComponent,
        SeriesComponent,
        MoviesComponent,
        MoviesInfoComponent,
        HomeComponent,
        PageNotFoundComponent,
        NavComponent,
        FooterComponent,
        WatchComponent
    ],
    imports: [
        RouterModule.forRoot(appRoutes),
        BrowserModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        BrowserModule
    ],
    providers: [AuthService],
    bootstrap: [AppComponent]

})
export class AppModule{

}