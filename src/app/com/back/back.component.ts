import { Component, OnInit, ViewChild } from '@angular/core';
import { MasterService } from 'src/app/services/master.service';
import { Asset, Back, SiblingOut } from 'src/app/models';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { ToastrService } from 'ngx-toastr';
import { TransService } from 'src/app/services/trans.service';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import * as async from 'async';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-back',
  templateUrl: './back.component.html',
  styleUrls: ['./back.component.scss']
})
export class BackComponent implements OnInit {

  listAssets: Array<Asset> = new Array<Asset>();
  searchListAssets: Array<Asset> = new Array<Asset>();
  searchItem: string = "";
  back: Back = new Back();
  toBeBack: any[] = [];
  @ViewChild('scanner')
  scanner: ZXingScannerComponent;

  hasCameras = false;
  qrResultString: string;

  availableDevices: MediaDeviceInfo[];
  selectedDevice: MediaDeviceInfo;
  alert: boolean = false;
  alertMessage: string = "";
  orderOutDate:string="";
  orderNumber:string="";
  orderProject:string="";
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
  constructor(private route: ActivatedRoute,private masterService: MasterService, private toastr: ToastrService, private transService: TransService) { }

  ngOnInit() {
    this.fetchData();
    this.route.queryParams.subscribe(params => {
      if (params['itemno']) {
        // if (this.listAssets.find(f => f.ItemNo === params['itemno'])) {
        //   let assetUpdate = this.listAssets.find(f => f.ItemNo === params['itemno']);
        //   if (assetUpdate.BoughtDate !== null) {
        //     let date = assetUpdate.BoughtDate.split('T')[0];
        //     let deadlineview: any = { date: { year: +date.split('-')[0], month: +date.split('-')[1], day: +date.split('-')[2] } };
        //     assetUpdate.BoughtDate = deadlineview;
        //   }
        //   this.selectSearch(assetUpdate);
        // }
      }
    });
    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.hasCameras = true;

      console.log('Devices: ', devices);
      this.availableDevices = devices;

      // selects the devices's back camera by default
      for (const device of devices) {
        if (/back|rear|environment/gi.test(device.label)) {
          this.scanner.changeDevice(device);
          this.selectedDevice = device;
          break;
        }

        if (/webcam/gi.test(device.label)) {
          this.scanner.changeDevice(device);
          this.selectedDevice = device;
          break;
        }
      }
    });

    this.scanner.camerasNotFound.subscribe((devices: MediaDeviceInfo[]) => {
      console.error('An error has occurred when trying to enumerate your video-stream-enabled devices.');
    });
  }

  fetchData() {
    this.masterService.getAllAssets().subscribe(res => {
      this.listAssets = res.filter(f => f.Status === 2);
    });
  }
  eventHandlerSearch(event) {
    this.searchListAssets = new Array<Asset>();
    if (this.searchItem.trim() !== "") {
      setTimeout(() => {
        this.searchListAssets = this.listAssets.filter(f => f.ItemNo.toLowerCase().indexOf(this.searchItem.toLowerCase()) > -1);
      }, 200);
    }
  }
  onDateChanged(event: IMyDateModel) {
    console.log('onDateChanged(): ', event.date, ' - jsdate: ', new Date(event.jsdate).toLocaleDateString(), ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
  }
  closeSearch() {
    this.searchListAssets = new Array<Asset>();
    this.searchItem = "";
  }

  selectSearch(asset: Asset) {
    this.searchListAssets = new Array<Asset>();
    this.searchItem = "";
    this.transService.getSiblingOut(asset.ItemNo).subscribe(res => {
      res.forEach(i => {
        this.toBeBack = [...this.toBeBack, i.AssetNo];
      });
      this.setDataBack(res[0]);
    });
  }

  handleQrCodeResult(resultString: string) {
    setTimeout(() => {
      if (this.toBeBack.indexOf(resultString.toLowerCase()) === -1) {
        console.log('Result: ', resultString);
        if (this.listAssets.find(f => f.ItemNo.toLowerCase().indexOf(resultString.toLowerCase()) > -1)) {
          this.transService.getSiblingOut(resultString).subscribe(res => {
            res.forEach(i => {
              this.toBeBack = [...this.toBeBack, i.AssetNo];
            });
            this.setDataBack(res[0]);
          });
        } else {
          this.alert = true;
          this.alertMessage = resultString + " not found or status already free!"
        }
      }
    }, 500);

  }

  setDataBack(obj: SiblingOut) {
    this.back.Kelengkapan = obj.Kelengkapan;
    this.back.OutNo = obj.OutNo;
    this.back.PIC = obj.PIC;
    this.orderNumber = obj.OutNo;
    this.orderProject = obj.Project;
    if (obj.OutDate !== null) {
      let date = obj.OutDate.split('T')[0];
      // let deadlineview: any = { date: { year: +date.split('-')[0], month: +date.split('-')[1], day: +date.split('-')[2] } };
      // this.orderOutDate = deadlineview;
      this.orderOutDate = date;
    }
  }

  submit() {
    if (this.back.BackDate === null) {
      this.toastr.warning('', 'Tanggal terima harus terisi!');
      return;
    }
    if (this.toBeBack.length === 0) {
      this.toastr.warning('', 'Belum ada asset terpilih!');
      return;
    }
    if (this.back.Receiver === "") {
      this.toastr.warning('', 'PIC Penerima harus terisi!');
      return;
    }
    let month = "0" + this.back.BackDate.date.month;
    let day = "0" + this.back.BackDate.date.day;
    this.back.BackDate = this.back.BackDate.date.year + "-" + month.substr(month.length - 2) + "-" + day.substr(day.length - 2);

    this.transService.postBack(this.back).subscribe(res => {
      this.transService.postUpdateDetailStatusBack(this.orderNumber).subscribe();
      if ((res[0] as Back).Id > 0) {
        async.eachSeries(this.toBeBack, (item, callback) => {
          this.transService.postUpdateStatusBack(item).subscribe(up => {
            callback();
          });
        },
          (err) => {
            this.toastr.success('', 'Data berhasil disimpan!');
            this.cancel();
            this.fetchData();
          });

      }
    });
  }
  cancel() {
    this.back = new Back();
    this.toBeBack = [];
    this.orderOutDate = "";
    this.orderProject = "";
  }
}
