import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
const apiKey: string = environment.apiKey;

@Injectable({
  providedIn: 'root'
})
export class WeatherapiService {

  constructor(private http: HttpClient) { }
  getWeather(location: string) {
    return this.http.get(`${environment.apiUrl}/weather?q=${location}&appid=${apiKey}`)
  }
}
