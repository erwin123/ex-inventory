import { Component, OnInit, Input } from '@angular/core';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { Asset, Brand } from 'src/app/models';
import { MasterService } from 'src/app/services/master.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InitialService } from 'src/app/services/initial.service';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit {
  searchItem: string = "";
  asset: Asset = new Asset();
  brands:Array<string> = new Array<string>();
  divs:Array<string> = new Array<string>();
  devices:Array<object> = new Array<object>();
  listAssets: Array<Asset> = new Array<Asset>();
  searchListAssets: Array<Asset> = new Array<Asset>();
  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'yyyy-mm-dd',
    sunHighlight: true,
    inline: false,
    satHighlight: true,
    editableDateField: false,
    selectorHeight: "255px",
    selectorWidth: "275px",
    openSelectorOnInputClick: true
  };
  alert: boolean = false;
  alertMessage: string = "";
  constructor(private toastr: ToastrService, private route: ActivatedRoute, private masterService: MasterService, private initialService: InitialService) { }

  ngOnInit() {
    this.initialService.getJSON("brand.json").subscribe(brand => {
      for (let i = 0; i < brand.length; i++) {
        this.brands.push(brand[i].Name);
      }
      this.brands = this.brands.sort((a: any, b: any) => {
        if (a < b) {
          return -1;
        } else if (a > b) {
          return 1;
        } else {
          return 0;
        }
      });
      this.brands.unshift("None");
    });

    this.initialService.getJSON("divisi.json").subscribe(divisi=> {
      for (let i = 0; i < divisi.length; i++) {
        this.divs.push(divisi[i].Name);
      }
      this.divs = this.divs.sort((a: any, b: any) => {
        if (a < b) {
          return -1;
        } else if (a > b) {
          return 1;
        } else {
          return 0;
        }
      });
      this.divs.unshift("-");
    });

    this.initialService.getJSON("device.json").subscribe(device=> {
      for (let i = 0; i < device.length; i++) {
        this.devices.push(device[i]);
      }
      this.devices = this.devices.sort((a: any, b: any) => {
        if (a.Name < b.Name) {
          return -1;
        } else if (a > b) {
          return 1;
        } else {
          return 0;
        }
      });
    });

    this.masterService.getAllAssets().subscribe(res => {
      this.listAssets = res;
      this.route.queryParams.subscribe(params => {
        if (params['itemno']) {
          if (this.listAssets.find(f => f.ItemNo === params['itemno'])) {
            let assetUpdate = Object.assign({}, this.listAssets.find(f => f.ItemNo === params['itemno']));
            if (assetUpdate.BoughtDate !== null) {
              let date = assetUpdate.BoughtDate.split('T')[0];
              let deadlineview: any = { date: { year: +date.split('-')[0], month: +date.split('-')[1], day: +date.split('-')[2] } };
              assetUpdate.BoughtDate = deadlineview;
            }
            this.selectSearch(assetUpdate);
          }

        }
      });
    });

  }

  fetchData() {
    this.masterService.getAllAssets().subscribe(res => {
      this.listAssets = res;
    });
  }
  onDateChanged(event: IMyDateModel) {
    console.log('onDateChanged(): ', event.date, ' - jsdate: ', new Date(event.jsdate).toLocaleDateString(), ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
  }

  submit() {
    if (this.asset.BoughtDate === null) {
      this.alert = true;
      this.alertMessage = "Receive Date (Buying date) cannot be empty!";
      return;
    }
    if (this.asset.ItemNo === "") {
      this.alert = true;
      this.alertMessage = "Asset Number cannot be empty!";
      return;
    }

    let month = "0" + this.asset.BoughtDate.date.month;
    let day = "0" + this.asset.BoughtDate.date.day;
    this.asset.BoughtDate = this.asset.BoughtDate.date.year + "-" + month.substr(month.length - 2) + "-" + day.substr(day.length - 2)

    if (this.asset.Id === 0) { //insert
      if (this.listAssets.find(f => f.ItemNo === this.asset.ItemNo)) {
        this.toastr.error('', 'Nomor asset ' + this.asset.ItemNo + ' sudah terdaftar!');
        return;
      }
      this.masterService.postAssets(this.asset).subscribe(res => {
        if ((res[0] as Asset).Id > 0) {

          this.asset = new Asset();
          this.searchItem = "";
          this.toastr.success('', 'Inventory berhasil tersimpan');
          this.fetchData();
        } else {
          this.toastr.warning('', 'Inventory gagal tersimpan');
        }
      });
    } else { //update
      if (this.asset.Status == 1 && this.listAssets.find(f => f.ItemNo === this.asset.ItemNo).Status == 2) {
        this.alert = true;
        this.alertMessage = "Asset masih berstatus keluar, buat pengembalian sebelum ubah status rusak!";
        return;
      }
      this.masterService.putAssets(this.asset).subscribe(res => {
        if (res.affectedRows > 0) {
          this.asset = new Asset();
          this.searchItem = "";
          this.toastr.success('', 'Inventory berhasil tersimpan');
          this.fetchData();
        }
      });
    }
  }

  eventHandlerSearch(event) {
    this.searchListAssets = new Array<Asset>();
    if (this.searchItem.trim() !== "") {
      setTimeout(() => {
        this.searchListAssets = this.listAssets.filter(f => f.ItemNo.toLowerCase().indexOf(this.searchItem.toLowerCase()) > -1);
      }, 500);
    }
  }

  closeSearch() {
    this.searchListAssets = new Array<Asset>();
    this.searchItem = "";
  }

  selectSearch(asset: Asset) {
    this.asset = asset;
    this.searchListAssets = new Array<Asset>();
    this.searchItem = asset.ItemNo;
  }

  delete() {
    if (this.asset.Id > 0) { //insert
      this.masterService.deleteAssets(this.asset).subscribe(res => {
        if (res.affectedRows > 0) {
          this.asset = new Asset();
          this.searchItem = "";
          this.toastr.success('', 'Inventory berhasil dihapus');
          this.fetchData();
        }
      });
    }
  }
}


