import {Component} from '@angular/core';
import {YtsService} from "../../services/yts.service";

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [YtsService]
})
export class AppComponent {

}
