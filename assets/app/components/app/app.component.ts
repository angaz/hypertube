import { Component } from '@angular/core';
import { MovieService } from "../../services/movies.service";
import { SearchService } from "../../services/search.service";
import { UserService } from "../../services/user.service";

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [MovieService, SearchService, UserService]
})
export class AppComponent {
}
