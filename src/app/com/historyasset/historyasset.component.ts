import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/services/master.service';
import { Asset, HistoryAsset, HistoryOut } from 'src/app/models';
import { Router, ActivatedRoute } from '@angular/router';
import { TransService } from 'src/app/services/trans.service';

@Component({
  selector: 'app-historyasset',
  templateUrl: './historyasset.component.html',
  styleUrls: ['./historyasset.component.scss']
})
export class HistoryassetComponent implements OnInit {
  histories: Array<HistoryAsset> = new Array<HistoryAsset>();
  historyOut: Array<HistoryOut> = new Array<HistoryOut>();
  assetNo: string = "";
  detailOut: boolean = false;

  outNo: string = "";
  outDate: any = null;
  outProject: string = "";
  outPIC: string = "";
  outKelengkapan: string = "";
  outNotes: string = "";

  constructor(private route: ActivatedRoute, private router: Router, private transService: TransService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['itemno']) {
        this.transService.getHistoryAsset(params['itemno']).subscribe(res => {
          this.histories = res;
        });
        this.assetNo = params['itemno'];
      }
    });
  }
  search() {
    if (this.assetNo !== "") {
      this.transService.getHistoryAsset(this.assetNo).subscribe(res => {
        this.histories = res;
      });
    }
  }
  goDetail(outNo: string) {
    this.transService.getHistoryOut(outNo).subscribe(res => {
      this.historyOut = res;
      if (res.length > 0) {
        if ((res[0] as HistoryOut).OutNo.length > 0) {
          let headerOut = (res[0] as HistoryOut);
          if(headerOut.OutDate)
            this.outDate = headerOut.OutDate.split('T')[0];
          this.outKelengkapan = headerOut.Kelengkapan === ''? '-' : headerOut.Kelengkapan;
          this.outNo = headerOut.OutNo;
          this.outNotes = headerOut.Notes === ''? '-' : headerOut.Notes;
          this.outPIC = headerOut.PIC === ''? '-' : headerOut.PIC;
          this.outProject = headerOut.Project === ''? '-' : headerOut.Project;
        }
      }
      this.detailOut = true;
    });
  }
  goAssetDetail(assetNo: string){
    this.router.navigate(['main/master/maintenance'], { queryParams: { itemno: assetNo } });
  }
}
