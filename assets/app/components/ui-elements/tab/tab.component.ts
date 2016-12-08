import {Component, Input} from '@angular/core';
import {TabsComponent} from "../tabs/tabs.component";

@Component ({
    selector: 'tab',
    templateUrl: 'tab.component.html',
    styleUrls: ['tab.component.css']
})
export class TabComponent {
	@Input() TabTitle;

	constructor(tabs: TabsComponent) {
		tabs.addTab(this)
	}
}