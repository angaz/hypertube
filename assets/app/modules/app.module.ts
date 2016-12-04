import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { InfiniteScrollModule } from 'angular2-infinite-scroll';

import { AppComponent } from '../components/app/app.component';
import { NavComponent } from '../components/nav/nav.component';
import { PageNotFoundComponent } from '../components/404/404.component';
import { SigninComponent } from '../components/signin/signin.component';
import { SignupComponent } from '../components/signup/signup.component';
import { ResetComponent } from '../components/reset/reset.component';
import { HomeComponent } from '../components/home/home.component';
import { MoviesComponent } from '../components/movies/movies.component';
import { SeriesComponent } from '../components/series/series.component';
import { FooterComponent } from "../components/footer/footer.component";
import { MoviesInfoComponent } from "../components/movies-info/movies-info.component";
import { WatchComponent } from "../components/watch/watch.component";
import { SearchComponent } from "../components/search/search.component";
import { AuthService } from "../services/auth.service";
import {UserProfileComponent} from "../components/user-profile/user-profile.component";
import {TabComponent} from "../components/ui-elements/tab/tab.component";
import {TabsComponent} from "../components/ui-elements/tabs/tabs.component";

const appRoutes: Routes = [
	{ path: 'users/signup', component: SignupComponent },
	{ path: 'users/signin', component: SigninComponent },
	{ path: 'users/reset', component: ResetComponent },
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
		ResetComponent,
		SeriesComponent,
		MoviesComponent,
		MoviesInfoComponent,
		HomeComponent,
		PageNotFoundComponent,
		NavComponent,
		FooterComponent,
		WatchComponent,
		SearchComponent,
		UserProfileComponent,
		TabComponent,
		TabsComponent
	],
	imports: [
		RouterModule.forRoot(appRoutes),
		BrowserModule,
		FormsModule,
		HttpModule,
		ReactiveFormsModule,
		BrowserModule,
		InfiniteScrollModule
	],
	providers: [AuthService],
	bootstrap: [AppComponent]
})
export class AppModule{

}