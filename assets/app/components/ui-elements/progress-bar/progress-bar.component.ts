import {Component, ViewChild} from '@angular/core';

@Component ({
    selector: 'progress-bar',
    templateUrl: 'progress-bar.component.html',
    styleUrls: ['progress-bar.component.css']
})
export class TabComponent {
	@ViewChild('downloaded') downloaded;

	private ctx = null;
	private imageData = null;
	private length = 0;

	constructor() {
	}

	ngAfterViewInit() {
		this.ctx = this.downloaded.nativeElement.getContext('2d');
		this.ctx.strokeStyle = '#5A7AA7';
	}

	initProgressBar(length, downloaded: [number]) {
		this.length = length;
		this.ctx.canvas.width = length;
		this.imageData = this.ctx.createImageData(length, 1);
		downloaded.forEach(() => {

		});
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
		console.log(event);
	}
}