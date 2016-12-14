import {Component, ViewChild, Input, OnChanges, EventEmitter, Output} from '@angular/core';

@Component ({
    selector: 'progress-bar',
    templateUrl: 'progress-bar.component.html',
    styleUrls: ['progress-bar.component.css']
})
export class ProgressBarComponent {
	@ViewChild('downloaded') downloadedBar;
	@ViewChild('thumb') thumb;
	@ViewChild('container') container;
	@ViewChild('played') played;

	private ctx = null;
	private imageData = null;
	private mouseDown: boolean = false;
	@Output() seeked = new EventEmitter<number>();

	ngAfterViewInit() {
		this.downloadedBar = this.downloadedBar.nativeElement;
		this.thumb = this.thumb.nativeElement;
		this.container = this.container.nativeElement;
		this.played = this.played.nativeElement;
	}

	setValue(value) {
		value = `${value}%`;
		this.thumb.style.left = value;
		this.played.style.width = value;
	}

	drawPiece(pieceNumber) {
		if (this.imageData) {
			pieceNumber *= 4;
			this.imageData.data[pieceNumber++] = 135;
			this.imageData.data[pieceNumber++] = 163;
			this.imageData.data[pieceNumber++] = 200;
			this.imageData.data[pieceNumber] = 255;
			this.ctx.putImageData(this.imageData, 0, 0);
		}
	}

	drawAllPieces(pieceNumbers, totalPieces) {
		this.resetPieces();
		this.ctx = this.downloadedBar.getContext('2d');
		this.downloadedBar.width = totalPieces;
		this.ctx.strokeStyle = '#5A7AA7';
		this.imageData = this.ctx.createImageData(totalPieces, 1);
		pieceNumbers.forEach(pieceNumber => {
			pieceNumber *= 4;
			this.imageData.data[pieceNumber++] = 135;
			this.imageData.data[pieceNumber++] = 163;
			this.imageData.data[pieceNumber++] = 200;
			this.imageData.data[pieceNumber] = 255;
		});
		this.ctx.putImageData(this.imageData, 0, 0);
	}

	resetPieces() {
		if (this.ctx) {
			this.ctx.clearRect(0, 0, this.downloadedBar.width, this.downloadedBar.height);
		}
		if (this.imageData) {
			this.imageData.data.fill(0);
		}
		this.ctx = null;
		this.imageData = null;
	}

	scrub(event) {
		if (this.mouseDown) {
			this.setValue(event.offsetX / this.container.offsetWidth * 100);
		}
	}

	setScrub(event) {
		this.mouseDown = false;
		if (event.target.closest('#container')) {
			let value = event.offsetX / this.container.offsetWidth * 100;
			this.setValue(value);
			this.seeked.emit(value);
		}
	}
}