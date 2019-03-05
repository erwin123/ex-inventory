export class User {
    Username:string="";
    Password:string="";
}

export class Brand {
    Name:string="";
    Description:string="";
}

export class Asset {
    Id:number=0;
    ItemNo:string="";
    ItemNoSystem:string="";
    Brand:string="";
    Type:string="";
    Processor:string="";
    DivisionDedicate:string="";
    RAM:string="";
    HDD:string="";
    VGA:string="";
    Notes:string="";
    Name:string="";
    BoughtDate:any=null;
    MotherBoard:string="";
    MonitorNo:string="";
    Status:number=0;
}

export class Out {
    Id:number=0;
    OutNo:string="";
    AssetNo:string="";
    Kelengkapan:string="";
    Notes:string="";
    OutDate:any=null;
    Project:string="";
    PIC:string="";
    Detail:Array<OutDetail> = new Array<OutDetail>();
}

export class OutDetail {
    Id:number=0;
    OutNo:string="";
    AssetNo:string="";
    OutDetailNo:string="";
    Back:number=0;
}

export class Back {
    Id:number=0;
    OutNo:string="";
    OutBackNo:string="";
    AssetNo:string="";
    Kelengkapan:string="";
    Notes:string="";
    BackDate:any=null;
    PIC:string="";
    Receiver:string="";
    
}

export class Opname {
    Id:number=0;
    ScanNo:string="";
    ScanDate:string="";
    PeriodeYear:string="";
    AssetNo:string="";
    Notes:string="";
    Status:string="";
    PIC:string="";
}

export class SiblingOut{
    Id:number=0;
    AssetNo:string="";
    OutNo:string="";
    OutDetailNo:string="";
    Project:string="";
    PIC:string="";
    Kelengkapan:string="";
    OutDate:any=null;
}

export class HistoryAsset{
    OutNo:string="";
    KelengkapanOut:string="";
    NotesOut:string="";
    OutDate:any=null;
    Project:string="";
    PICOut:string="";
    OutBackNo:string="";
    KelengkapanBack:string="";
    NoteBack:string="";
    PICBack:string="";
    Receiver:string="";
    BackDate:any=null;
}

export class HistoryOut{
    OutNo:string="";
    Kelengkapan:string="";
    Notes:string="";
    OutDate:any=null;
    Project:string="";
    PIC:string="";
    OutDetailNo:string="";
    AssetNoDetail:string="";
}