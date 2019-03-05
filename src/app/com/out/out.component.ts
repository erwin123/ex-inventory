import { Component, OnInit, ViewChild } from '@angular/core';
import { MasterService } from 'src/app/services/master.service';
import { Asset, Out, OutDetail } from 'src/app/models';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { ToastrService } from 'ngx-toastr';
import * as async from 'async';
import { TransService } from 'src/app/services/trans.service';

@Component({
  selector: 'app-out',
  templateUrl: './out.component.html',
  styleUrls: ['./out.component.scss']
})
export class OutComponent implements OnInit {
  listAssets: Array<Asset> = new Array<Asset>();
  searchListAssets: Array<Asset> = new Array<Asset>();
  searchItem: string = "";
  out: Out = new Out();
  toBeOut: any[] = [];
  @ViewChild('scanner')
  scanner: ZXingScannerComponent;

  hasCameras = false;
  qrResultString: string;

  availableDevices: MediaDeviceInfo[];
  selectedDevice: MediaDeviceInfo;
  alert: boolean = false;
  alertMessage: string = "";
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
  constructor(private masterService: MasterService, private toastr: ToastrService, private transService: TransService) { }

  ngOnInit() {
    this.fetchData();
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
      this.listAssets = res.filter(f => f.Status === 0);
    });
  }

  onDateChanged(event: IMyDateModel) {
    console.log('onDateChanged(): ', event.date, ' - jsdate: ', new Date(event.jsdate).toLocaleDateString(), ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
  }

  eventHandlerSearch(event) {
    this.searchListAssets = new Array<Asset>();
    if (this.searchItem.trim() !== "") {
      setTimeout(() => {
        this.searchListAssets = this.listAssets.filter(f => f.ItemNo.toLowerCase().indexOf(this.searchItem.toLowerCase()) > -1);
      }, 200);
    }
  }

  closeSearch() {
    this.searchListAssets = new Array<Asset>();
    this.searchItem = "";
  }

  selectSearch(asset: Asset) {
    this.searchListAssets = new Array<Asset>();
    this.searchItem = "";
    this.toBeOut = [...this.toBeOut, asset.ItemNo];
  }

  handleQrCodeResult(resultString: string) {
    setTimeout(() => {
      if (this.toBeOut.indexOf(resultString.toLowerCase()) === -1) {
        console.log('Result: ', resultString);
        if (this.listAssets.find(f => f.ItemNo.toLowerCase().indexOf(resultString.toLowerCase()) > -1)) {
          this.toBeOut = [...this.toBeOut, resultString];
        } else {
          this.alert = true;
          this.alertMessage = resultString + " not found or status not free!"
        }
      }
    }, 500);
  }

  submit() {
    if (this.out.OutDate === null) {
      this.alert = true;
      this.alertMessage = "Tanggal keluar harus terisi!";
      return;
    }
    if (this.toBeOut.length === 0) {
      this.toastr.warning('', 'Belum ada asset terpilih!');
      return;
    }
    if (this.out.PIC === "") {
      this.toastr.warning('', 'PIC harus terisi!');
      return;
    }
    let month = "0" + this.out.OutDate.date.month;
    let day = "0" + this.out.OutDate.date.day;
    this.out.OutDate = this.out.OutDate.date.year + "-" + month.substr(month.length - 2) + "-" + day.substr(day.length - 2);
    let uniqueOut = Array.from(new Set(this.toBeOut.map(item => item)));
    async.eachSeries(uniqueOut, (item, callback) => {
      let oDetail: OutDetail = new OutDetail();
      oDetail.AssetNo = item;
      this.out.Detail.push(oDetail);
      callback();
    }, (err) => {
      this.transService.postOut(this.out).subscribe(res => {
        if ((res[0] as Out).Id > 0) {
          this.toastr.success('', 'Data berhasil disimpan!');
          this.fetchData();
          this.clear();
        }
      });
    });

  }

  clear(){
    this.out = new Out();
    this.toBeOut = [];
  }
}
