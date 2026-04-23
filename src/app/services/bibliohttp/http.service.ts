import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) {}


  get(url:string) {
    const token=localStorage.getItem('token_session');
    return this.http.get<any>(
      url,
      {
        headers: {  Authorization: `Bearer ${token}`  }
      }
    );
  }
  delete(url:string) {
    const token=localStorage.getItem('token_session');
    return this.http.delete<any>(
      url,
      {
        headers: {  Authorization: `Bearer ${token}`  }
      }
    );
  }
  post(url:string,payload:any) {
    const token=localStorage.getItem('token_session');
    return this.http.post<any>(
      url,
      payload,
      {
        headers: {  Authorization: `Bearer ${token}`  }
      }
    );
  }
 }
