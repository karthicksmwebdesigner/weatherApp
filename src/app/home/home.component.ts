import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WeatherapiService } from '../services/weatherapi.service';
import { interval } from 'rxjs';
import { Observable, Observer, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { kill } from 'process';

interface item {
  sno: any;
  location: any;
  showSearch: boolean;
  showCard: boolean;
  currentWeather: any;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  weatherForm: FormGroup;
  msg: any;
  currentWeather: any = <any>{};
  cardItems: item;
  cards: Array<item>;
  submitted = false;
  warning = 'black';
  imageSrc = 'assets/images/cloudy.jpg';
  imageSrc1 = 'assets/images/sunny.jfif'
  networkStatus: boolean;

  constructor(private formBuilder: FormBuilder, private weatherService: WeatherapiService) {
    this.weatherForm = this.formBuilder.group({
      location: ['', Validators.required],
    });
  }


  ngOnInit(): void {
    this.createOnline$().subscribe(isOnline => {
      this.networkStatus = isOnline;
    });
    console.log('this.network status', this.networkStatus);
    this.cards = [
      { "sno": "0", "location": "", "showSearch": false, "showCard": false, "currentWeather": {} },
      { "sno": "1", "location": "", "showSearch": false, "showCard": false, "currentWeather": {} },
      { "sno": "2", "location": "", "showSearch": false, "showCard": false, "currentWeather": {} },
      { "sno": "3", "location": "", "showSearch": false, "showCard": false, "currentWeather": {} },
      { "sno": "4", "location": "", "showSearch": false, "showCard": false, "currentWeather": {} },
      { "sno": "5", "location": "", "showSearch": false, "showCard": false, "currentWeather": {} },
      { "sno": "6", "location": "", "showSearch": false, "showCard": false, "currentWeather": {} },
      { "sno": "7", "location": "", "showSearch": false, "showCard": false, "currentWeather": {} },
      { "sno": "8", "location": "", "showSearch": false, "showCard": false, "currentWeather": {} }];

    if (this.networkStatus == false) {
      let offlineData;
      offlineData = localStorage.getItem('offlineData') ? JSON.parse(localStorage.getItem("offlineData")) : undefined;
      console.log("offlineData", offlineData);
      this.cards = offlineData;
    }
    const obs$ = interval(30000);
    obs$.subscribe((d) => {
      this.refresh();
    });
  }

  createOnline$() {
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }));
  }

  refresh() {
    this.msg = '';
    this.currentWeather = {};
    this.cards.forEach(element => {
      if (element.location != "" && element.location != null) {
        this.weatherService.getWeather(element.location)
          .subscribe(res => {
            this.currentWeather = res;
            console.log("currentWeather", this.currentWeather);
            localStorage.setItem('offlineData', JSON.stringify(this.cards));
          }, err => {
            if (err.error && err.error.message) {
              alert(err.error.message);
              this.msg = err.error.message;
              return;
            }
            alert('wrong city name, please enter valid city name');
          }, () => {
          })
      }
    });
  }

  activeSearch(index) {
    this.cards[index].showSearch = true;
    this.cards[index].showCard = true;
  }
  edit(index) {
    this.cards[index].showSearch = false;
    this.cards[index].showCard = false;

  }
  search(index, location) {
    if (location != "" && location != null) {
      this.msg = '';
      this.currentWeather = {};

      this.weatherService.getWeather(location)
        .subscribe(res => {
          this.cards[index].showSearch = false;
          this.cards[index].currentWeather = res;
          this.currentWeather = res;
          console.log("currentWeather", this.currentWeather);
          this.warning = 'black';
          localStorage.setItem('offlineData', JSON.stringify(this.cards));
        }, err => {
          if (err.error && err.error.message) {
            this.warning = 'red';
            alert(err.error.message);
            this.msg = err.error.message;
            return;
          }
        }, () => {
        })
    } else {
      alert('please enter location');
      this.warning = 'red';
    }
  }

}
