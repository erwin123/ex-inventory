import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor() { }
  private stateLogin = new BehaviorSubject<boolean>(localStorage.getItem('currentUser') ? true : false);
  currentStateLogin = this.stateLogin.asObservable();
  public setCurrentStateLogin(val?: string) {
    if (val) {
      var state = val == "1"? true:false;
      this.stateLogin.next(state);
    }
    else {
      if (localStorage.getItem('currentUser'))
        this.stateLogin.next(true);
    }
  }
}
