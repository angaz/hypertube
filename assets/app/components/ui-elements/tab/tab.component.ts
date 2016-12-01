import { Component, Input, OnInit } from '@angular/core';
import { TabsComponent } from "../tabs/tabs.component";

@Component ({
    selector: 'tab',
    templateUrl: 'tab.component.html',
    styleUrls: ['tab.component.css']
})
export class TabComponent implements OnInit{
    active: boolean;

    @Input() TabTitle: string;

    constructor(tabs: TabsComponent) {
        tabs.addTab(this)
    }

    ngOnInit(){
    }
}