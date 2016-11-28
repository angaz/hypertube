import { Component, Input } from '@angular/core';
import {TabComponent} from "../tab/tab.component";

@Component ({
    selector: 'tabs',
    templateURL: './tabs.component.html',
    styleUrls: ['./tabs.component.css']
})
export class TabsComponent {
    tabs: TabComponent[] = [];
    addTab(tab:TabComponent) {
        this.tabs.push(tab);
    }
}