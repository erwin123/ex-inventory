import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as globalVar from '../global';
import { Asset } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  private url = globalVar.global_api;  // URL to web api
  private _headers = new HttpHeaders().set('Content-Type', 'application/json');
  private token: any;
  constructor(private httpClient: HttpClient) {
  }

  getAllAssets(): Observable<Asset[]> {
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url = globalVar.global_api + "/asset/";
    return this.httpClient.get<Asset[]>(url,  { headers: headers }).pipe(map(res => { return res; }));
  }

  postAssets(asset:Asset):Observable<any> {
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url = globalVar.global_api + "/asset/";
    return this.httpClient.post<any>(url, asset, { headers: headers }).pipe(map(res => { return res; }));
  }

  putAssets(asset:Asset):Observable<any>{
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url = globalVar.global_api + "/asset/";
    return this.httpClient.put<any>(url, asset, { headers: headers }).pipe(map(res => { return res; }));
  }

  deleteAssets(asset:Asset):Observable<any>{
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url = globalVar.global_api + "/asset/";
    return this.httpClient.delete<any>(url+asset.ItemNo, { headers: headers }).pipe(map(res => { return res; }));
  }
}
