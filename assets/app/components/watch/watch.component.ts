import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';

import {MovieService} from '../../services/movies.service';
import {isNullOrUndefined} from "util";

@Component({
	selector: 'hypertube-watch',
	templateUrl: './watch.component.html',
	styleUrls: ['./watch.component.css']
})
export class WatchComponent {
	@ViewChild('video') video;
	@ViewChild('seeker') seeker;
	private subscription: Subscription;
	movie: any = {
		poster: '',
		src: null
	};
	captions: any[] = [];
	noMovie: boolean = false;
	private hideCursor: boolean = false;
	private hideControls: boolean = false;
	private currentTime: string = '00:00';
	private durationTime: string = '00:00';
	private endTime: string = '00:00';
	private timer = null;

	constructor(
			private activatedRoute: ActivatedRoute,
			private _movieService: MovieService) {
	}

	ngAfterViewInit() {
		this.video = this.video.nativeElement;
		this.seeker = this.seeker.nativeElement;
	}

	getEndTime() {
		let t = new Date(new Date().getTime() + (this.video.duration * 1000) - (this.video.currentTime * 1000));
		this.endTime = `${this.lpad(t.getHours().toString(), 2, '0')}:${this.lpad(t.getMinutes().toString(), 2, '0')}`;
	}

	ngOnInit() {
		// subscribe to router event
		this.subscription = this.activatedRoute.params.subscribe(
			(param: any) => {
				this._movieService.findBySlug(param.name)
					.then(watch => {
						console.log(watch);
						if (isNullOrUndefined(watch)) {
							return this.noMovie = true;
						}
						this.movie = {
							poster: watch.backdrop_path,
							src: `/api/watch/${watch.torrents[0].hash}`,
						};
						this._movieService.getCaptions(watch.yify_id)
							.then(captions => {
								this.captions = captions;
								console.log(captions);
							});
					})
					.catch(err => console.log(err));
			});
	}

	ngOnDestroy() {
		// prevent memory leak by unsubscribing
		this.subscription.unsubscribe();
	}

	mouseMove() {
		if (this.timer !== null) {
			clearTimeout(this.timer);
		}
		if (!this.video.paused) {
			this.timer = setTimeout(() => {
				this.hideControls = true;
				this.hideCursor = true;
			}, 2500);
		}
		this.hideControls = false;
		this.hideCursor = false;
	}

	playPause() {
		if (this.video.paused) {
			this.video.play();
			this.getEndTime();
		} else {
			this.video.pause();
		}
	}

	seek() {
		this.video.currentTime = this.video.duration * (this.seeker.value / 100);
	}

	toTime(time: number) {
		let hour = Math.floor(time / 3600);
		time -= hour * 3600;
		let min = Math.floor(time / 60);
		time -= min * 60;
		let ret = '';
		if (hour) {
			ret += `${hour}:`;
		}
		ret += `${this.lpad(min.toString(), 2, '0')}:${this.lpad(Math.floor(time).toString(), 2, '0')}`;
		return ret;
	}

	lpad(string: string, length: number, padChar: string) {
		while (string.length < length) {
			string = padChar + string;
		}
		return string;
	}

	metaLoaded() {
		this.durationTime = this.toTime(this.video.duration);
		this.getEndTime();
	}

	seekTimeUpdate() {
		this.seeker.value = this.video.currentTime / this.video.duration * 100;
		this.currentTime = this.toTime(this.video.currentTime);
	}

	isFullscreen() {
		return (document.fullscreenElement || document.webkitIsFullScreen);
	}

	toggleFullscreen() {
		if (!this.isFullscreen()) {
			if (this.video.parentNode.requestFullscreen) {
				this.video.parentNode.requestFullscreen()
			} else if (this.video.parentNode.webkitRequestFullscreen) {
				this.video.parentNode.webkitRequestFullscreen();
			}
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			}
		}
	}
}