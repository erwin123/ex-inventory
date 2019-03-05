import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/app/services/state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLogin:boolean= false;
  constructor(private stateService:StateService,private router: Router) { }

  ngOnInit() {
    this.stateService.currentStateLogin.subscribe(res => {
      this.isLogin = res;
    });
  }
  logout(){
    setTimeout(() => {
      localStorage.clear();
      this.stateService.setCurrentStateLogin("0");
      window.location.reload();
    }, 500);
  }
}
