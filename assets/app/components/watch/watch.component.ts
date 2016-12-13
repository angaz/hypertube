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
	private subscription: Subscription;
	private movie: any = {
		poster: '',
		src: ''
	};
	private movieSrc = null;
	private captions: any[] = [];
	private noMovie: boolean = false;
	private hideCursor: boolean = false;
	private hideControls: boolean = false;
	private currentTime: string = '00:00';
	private durationTime: string = '00:00';
	private endTime: string = '00:00';
	private currentTimeInt: number = 0;
	private timer = null;

	constructor(
			private activatedRoute: ActivatedRoute,
			private _movieService: MovieService) {
	}

	ngAfterViewInit() {
		this.video = this.video.nativeElement;
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
						let srcs = [];
						watch.torrents.forEach(torrent => {
							if (torrent.hash) {
								if ((torrent.size / 1073741824) > 1) { // 1024^3 - GB
									torrent.humanReadableSize = `${(torrent.size / 1073741824).toFixed(2)}GB`;
								} else if ((torrent.size / 1048576) > 1) { // 1024^2 - MB
									torrent.humanReadableSize = `${(torrent.size / 1048576).toFixed(2)}MB`;
								} else if ((torrent.size / 1024) > 1) { // 1024 - KB
									torrent.humanReadableSize = `${(torrent.size / 1024).toFixed(2)}KB`;
								} else {
									torrent.humanReadableSize = `${torrent.size}B`;
								}
								srcs.push(torrent);
							}
						});
						this.movie = {
							poster: watch.backdrop_path,
							srcs: srcs,
						};
						this.selectVideo(0);
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

	seek(time) {
		console.log(time);
		console.log(this.video.duration);
		console.log(this.video.duration * (time / 100));
		if (this.video.duration > 0) {
			this.video.currentTime = this.video.duration * (time / 100);
		}
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
		this.getEndTime();
		this.currentTimeInt = this.video.currentTime / this.video.duration * 100;
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
		this.getEndTime();
	}

	selectTrack(index) {
		console.log(this.video.textTracks);
		let tracks = this.video.textTracks;
		for (let i = 0; i < tracks.length; ++i) {
			if (i == index) {
				tracks[i].mode = 'showing';
			} else {
				tracks[i].mode = 'disabled';
			}
		}
	}

	selectVideo(index) {
		let currentTime = this.video.currentTime;
		this.movieSrc = `/api/watch/${this.movie.srcs[index].hash}`;
		this.video.load();
		this.video.play();
		this.video.currentTime = currentTime;
	}
}