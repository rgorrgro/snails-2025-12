// R. Gorr-Grohmann
// September 2025
// Sub dialog of the main dialog for the
// configuration of global variables
//
"use strict";
class DialogConf {
  constructor() {
    this.tst = new Test("diaconf", false, 1);
    //
    this.auto = new Automat2(this.tst,"diaconf",0);
    this.createAutomat();
    //
    this.cfgArray = [];
    this.cfgArray.push(new DialogConfSlider(
      this.auto,"Frames",data.frames));
    this.cfgArray.push(new DialogConfSlider(
      this.auto,"SnailMaxRun",data.smr));
    this.cfgArray.push(new DialogConfSlider(
      this.auto,"SnailMinLen",data.sml));
    this.cfgArray.push(new DialogConfRadio(
      this.auto,"Linecolor",data.linecolor));
    this.cfgArray.push(new DialogConfSlider(
      this.auto,"Linesize",data.linesize));
    //
    this.elenr = 0;
  }
  init() {    
    this.auto.eveCall(0,0,0);
  }
  createAutomat() {
    this.auto.setState(["STA","OVR","CFG","HALT"]);
    this.auto.setEvent(["INI","MOD","SET","RES",
                        "BAC"]);
    //  ENr  0: class constructor
    //  ENr  1: MODIFY button number i clicked
    //  ENr  2: SET button clicked
    //  ENr  3: MODIFY/BACK button clicked
    //  ENr  4: OVERVIEW/BACK button clicked
    let next = [
    // SNr 0 STA START
    //    ENr 0: display overview menu => NSNr 1
      [[1,1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],
    // SNr 1 OVR OVERVIEW
    //    ENr 1: display MODIFY dialog => NSNr 2
    //    ENr 4: delete overview; 
    //           push main event ENr 3=> NSNr 3
      [[-1,-1],[2,3],[-1,-1],[-1,-1],[3,2]],
    // SNr 2 CFG CONFIG
    //    ENr 2: set value, 
    //           display OVERVIEW dialog => NSNr 1
    //    ENr 3: display OVERVIEW dialog => NSNr 1
      [[-1,-1],[-1,-1],[2,4],[1,5],[-1,-1]],
    // SNr 3 HALT
      [[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]]
    ];
    this.auto.setNext(next);
    let aFunction = [
    // 0
      () => {},
    // 1
      () => {
        this.divShowOverview = createDiv();
        this.makeShowOverview();
        this.divShowOverview.style("display","block");
      },
    // 2
      () => {
        this.divShowOverview.style("display","none");
        this.divShowOverview = undefined;
        dialogMain.auto.eveCall(3,0,0);
      }, 
    // 3
      (p0_) => {
        this.elenr = p0_;
        this.divShowOverview.style("display","none");
        this.divShowOverview = undefined;
        this.divShowModify = createDiv();
        this.cfgArray[this.elenr].makeDivModify(
          this.divShowModify,2,3);
        this.divShowModify.style("display","block");
      }, 
    // 4
      () => {this.cfgArray[this.elenr].setValue();},
    // 5
      () => {
        this.divShowModify.style("display","none");
        this.divShowModify = undefined;
        this.divShowOverview = createDiv();
        this.makeShowOverview();
        this.divShowOverview.style("display","block");
      },
    ];
    this.auto.setFunction(aFunction);
  }
  //
  // Overview Nenue
  //
  makeShowOverview() {
    let x = data.buttonsize.getButtonX0();
    let y = data.buttonsize.getButtonY0();
    let addx = data.buttonsize.getButtonAddX();
    let addy = data.buttonsize.getButtonAddY();
    let dst = data.buttonsize.getButtonDist();
    let bConf = graphics.makeButton(
      "CONFIG",x,y,"white",undefined);
    this.divShowOverview.child(bConf);
    let bBack = graphics.makeButton(
      "BACK",x+addx,y,"yellow",
      ()=>{this.auto.eveCall(4,0,this.elenr);});
    this.divShowOverview.child(bBack);
    y = y+addy;
    for(let i=0;i<this.cfgArray.length;i++) {
      let div = this.cfgArray[i].makeDivOverview(
        i,x,y,addx,addy,dst,1);
      this.divShowOverview.child(div);
    }
  }
}
