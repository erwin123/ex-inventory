import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as globalVar from '../global';
import { Asset, Out, Back, SiblingOut, HistoryAsset, HistoryOut } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TransService {
  private url = globalVar.global_api;  // URL to web api
  private _headers = new HttpHeaders().set('Content-Type', 'application/json');
  private token: any;
  constructor(private httpClient: HttpClient) {
  }

  getSiblingOut(assetNo:string): Observable<SiblingOut[]> {
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url = globalVar.global_api + "/out/sibling/";
    return this.httpClient.get<SiblingOut[]>(url+assetNo,  { headers: headers }).pipe(map(res => { return res; }));
  }

  postOut(out:Out):Observable<any> {
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url = globalVar.global_api + "/out/";
    return this.httpClient.post<any>(url, out, { headers: headers }).pipe(map(res => { return res; }));
  }

  putOut(out:Out):Observable<any>{
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url = globalVar.global_api + "/out/";
    return this.httpClient.put<any>(url, out, { headers: headers }).pipe(map(res => { return res; }));
  }

  postBack(back:Back):Observable<any> {
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url = globalVar.global_api + "/back/";
    return this.httpClient.post<any>(url, back, { headers: headers }).pipe(map(res => { return res; }));
  }

  postUpdateStatusBack(assetNo:string):Observable<any> {
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url = globalVar.global_api + "/out/updatestatus/";
    return this.httpClient.post<any>(url, {AssetNo:assetNo}, { headers: headers }).pipe(map(res => { return res; }));
  }
  postUpdateDetailStatusBack(outNo:string):Observable<any> {
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url = globalVar.global_api + "/out/updatedetailstatus/";
    return this.httpClient.post<any>(url, {OutNo:outNo}, { headers: headers }).pipe(map(res => { return res; }));
  }

  //--------report----------
  getHistoryAsset(assetNo:string): Observable<HistoryAsset[]> {
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url = globalVar.global_api + "/asset/historyasset/";
    return this.httpClient.get<HistoryAsset[]>(url+assetNo,  { headers: headers }).pipe(map(res => { return res; }));
  }
  getHistoryOut(outNo:string): Observable<HistoryOut[]> {
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url = globalVar.global_api + "/asset/historyout/";
    return this.httpClient.get<HistoryOut[]>(url+outNo,  { headers: headers }).pipe(map(res => { return res; }));
  }
}
