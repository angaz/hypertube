import {Component} from '@angular/core';
import {YtsService} from "../../services/movies.service";
import {SearchService} from "../../services/search.service";

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [YtsService, SearchService]
})
export class AppComponent {
}
