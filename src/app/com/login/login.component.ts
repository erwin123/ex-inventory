import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models';
import { InitialService } from 'src/app/services/initial.service';
import { Router, ActivatedRoute } from '@angular/router';
import { StateService } from 'src/app/services/state.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  lock:boolean=false;
  user:User = new User();
  message:string = "";
  returnUrl: string;
  constructor(private router: Router,private route: ActivatedRoute,private initialService:InitialService,private stateService:StateService) { }

  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      this.router.navigate(['/']);
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login(){
    
    if(this.user.Username.length == 0 || this.user.Password.length == 0){
      this.message = "We need all fill to be full filled!";
      return;
    }
    this.lock = true;
    this.initialService.getJSON("user.json").subscribe(res => {
      if((res as User[]).find(x =>x.Username == this.user.Username && x.Password == this.user.Password)){
        this.message = "";
        localStorage.setItem('currentUser', JSON.stringify((res as User[]).find(x =>x.Username == this.user.Username && x.Password == this.user.Password)));
        this.lock = false;
        this.stateService.setCurrentStateLogin("1");
        this.router.navigate(['/main/landing']);
      }else{
        this.message = "Username or Password not matched!";
        this.lock = false;
      }
    });
  }
}