import {Component, ViewChild, Input, OnChanges, SimpleChanges, EventEmitter, Output} from '@angular/core';

@Component ({
    selector: 'progress-bar',
    templateUrl: 'progress-bar.component.html',
    styleUrls: ['progress-bar.component.css']
})
export class ProgressBarComponent implements OnChanges{
	@ViewChild('downloaded') downloadedBar;
	@ViewChild('thumb') thumb;
	@ViewChild('container') container;

	private ctx = null;
	private imageData = null;
	private mouseDown: boolean = false;

	@Input('length') length: number = 3600;
	@Input('downloaded') downloaded: [number];
	@Input('value') value: number;
	@Output() seeked = new EventEmitter<number>();

	constructor() {
	}

	ngAfterViewInit() {
		this.downloadedBar = this.downloadedBar.nativeElement;
		this.thumb = this.thumb.nativeElement;
		this.container = this.container.nativeElement;
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.hasOwnProperty('length') && this.length > 0) {
			this.ctx = this.downloadedBar.getContext('2d');
			this.ctx.canvas.width = this.length;
			this.ctx.strokeStyle = '#5A7AA7';
			this.imageData = this.ctx.createImageData(this.length, 1);
		}

		if (changes.hasOwnProperty('downloaded') && this.downloaded !== null && this.downloaded !== undefined) {
			console.log(changes);
			if (!changes['downloaded'].previousValue) {
				this.downloaded.forEach(() => {

				});
			} else {
				this.drawPiece(456);
			}
		}

		if (changes.hasOwnProperty('value') && this.value !== undefined && this.value > 0) {
			this.thumb.style.left = `${this.value}%`;
		}
	}

	drawPiece(pieceNumber) {
		pieceNumber *= 4;
		this.imageData.data[pieceNumber + 0] = 135;
		this.imageData.data[pieceNumber + 1] = 163;
		this.imageData.data[pieceNumber + 2] = 200;
		this.imageData.data[pieceNumber + 3] = 255;
		this.ctx.putImageData(this.imageData, 0, 0);
	}

	scrub(event) {
		if (this.mouseDown) {
			this.thumb.style.left = `${event.offsetX / this.container.offsetWidth * 100}%`;
		}
	}

	setScrub(event) {
		this.mouseDown = false;
		if (event.target.closest('#container')) {
			let value = event.offsetX / this.container.offsetWidth * 100;
			this.thumb.style.left = `${value}%`;
			this.seeked.emit(value);
		}
	}
}