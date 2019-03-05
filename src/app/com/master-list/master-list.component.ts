import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/services/master.service';
import { Asset } from 'src/app/models';
import { Router } from '@angular/router';
import * as async from 'async';
import * as globalVar from '../../global';

@Component({
  selector: 'app-master-list',
  templateUrl: './master-list.component.html',
  styleUrls: ['./master-list.component.scss']
})
export class MasterListComponent implements OnInit {
  listAssets: Array<Asset> = new Array<Asset>();
  toBePrint: string[] = [];
  urlPrintOut: string = globalVar.global_api + "/asset/printqr/";
  urlPrintOutManual: string = globalVar.global_api + "/asset/printqrbycode/";
  manualPrintItem: string = "";
  constructor(private router: Router, private masterService: MasterService) { }

  ngOnInit() {
    this.masterService.getAllAssets().subscribe(res => {
      this.listAssets = res;
    });
  }

  goDetail(itemNo: string) {
    this.router.navigate(['main/master/maintenance'], { queryParams: { itemno: itemNo } });
  }

  goHistory(itemNo: string) {
    this.router.navigate(['main/history'], { queryParams: { itemno: itemNo } });
  }

  printOut() {
    let qryString: string = "";
    async.eachSeries(this.toBePrint, (item, callback) => {
      //toBePrintAll = [...toBePrintAll, item.Id];
      qryString += item + "|";
      callback();
    }, (err) => {
      if (qryString !== "") {
        let qryClean = qryString.substring(0, qryString.length - 1);
        window.open(this.urlPrintOut + qryClean, "_blank");
      }


    });
  }

  printOutAll() {
    //let toBePrintAll:string[]=[];
    let qryString: string = "";
    async.eachSeries(this.listAssets, (item, callback) => {
      //toBePrintAll = [...toBePrintAll, item.Id];
      qryString += item.Id + "|";
      callback();
    }, (err) => {
      if (qryString !== "") {
        let qryClean = qryString.substring(0, qryString.length - 1);
        window.open(this.urlPrintOut + qryClean, "_blank");
      }
    });
  }

  printManual() {
    if (this.manualPrintItem !== "") {
      window.open(this.urlPrintOutManual + this.manualPrintItem, "_blank");
    }
  }
}
