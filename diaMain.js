//
// Robert Gorr-Grohmann
// September 2025
// Main dialog to steer the program flow
//
"use strict";
class DialogMain {
  constructor() {
    this.tst = new Test("diamain", true, 1);
    this.tst.off();
    this.auto = new Automat2(this.tst, "diamain", 1);
    this.createAutomat();
    this.auto.eveShift();
  }
  createAutomat() {
    this.auto.setState(["STA","MAIN","CFG","MOD",
                        "RUN"]);
    this.auto.setEvent(["TRG","RUN","CFG+",
                        "CFG-","MOD","SET","BCK"]);
    //  ENr  0: TRG Sketch trigger
    //  ENr  1: RUN RUN button clicked
    //  ENr  2: CFG+ CONFIG button clicked
    //  ENr  3: CFG- CONFIG dialog finished
    //  ENr  4: MOD MODIFY button number i clicked
    //  ENr  5: SET SET Button clicked
    //  ENr  6: BCK BACK Button clicked
    let next = [
    // SNr 0 STA START
    //   ENr 0: display main menu => NSNr 1
    [[1,1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],
    // SNr 1 MAIN
    //   ENr 0: set background color
    //   ENr 1: start RUN dialog => NSNr 3
    //   ENr 2: start CONFIG dialog => NSNr 2
    //   ENr 4: start MODIFY dialog Nr i => NSNr 4 
    [[1,0],[4,2],[2,3],[-1,-1],[3,5],[-1,-1],[-1,-1]],
    // SNr 2 CFG CONFIG 
    //   ENr 0: do nothing
    //   ENr 3: del CONFIG dialog;
    //          show MAIN dialog => NSNr 1
    [[2,0],[-1,-1],[-1,-1],[1,4],[-1,-1],[-1,-1],[-1,-1]],
    // SNr 3 MOD MODUS
    //   ENr 0: do nothing
    //   ENr 5: SET set Value Nr i
    //   ENr 6: BCK del MODIFY dialog;
    //          show MAIN dialog => NSNr 1
    [[3,0],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[3,6],[1,7]],
    // SNr 4 RUN
    [[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],
      ];
    this.auto.setNext(next);
    let aFunction = [
      // 0
      () => {},
      // 1
      () => {
        this.divMain = createDiv();
        this.makeDivMain();
        this.divMain.style("display", "block");
      },
      // 2
      () => {
        this.divMain.style("display", "none");
        stateRunning = true;
        dialogRun = new DialogRun();
      },
      // 3
      () => {
        this.divMain.style("display", "none");
        dialogConf = new DialogConf();
        dialogConf.init();
      },
      // 4
      () => {
        dialogConf = undefined;
        this.divMain = createDiv();
        this.makeDivMain();
        this.divMain.style("display", "block");
      },
      // 5
      (p0_) => {
        this.elenr = p0_;
        this.divMain.style("display","none");
        this.divMain = undefined;
        this.divMainModify = createDiv();
        this.cfgArray[this.elenr].makeDivModify(
          this.divMainModify,5,6);
        this.divMainModify.style("display","block");
      }, 
      // 6
      /*() => {
        dialogModus = undefined;
        this.divMain = createDiv();
        this.makeDivMain();
        this.divMain.style("display", "block");
      },
      // 7
      () => {
      },*/
    // 6
      () => {
        this.cfgArray[this.elenr].setValue();},
    // 7
      () => {
        this.divMainModify.style("display","none");
        this.divMainModify = undefined;
        this.divMain = createDiv();
        this.makeDivMain();
        this.divMain.style("display","block");
      },
    ];
    this.auto.setFunction(aFunction);
  }
  makeDivMain() {
    this.cfgArray = [];
    this.cfgArray.push(new DialogConfRadio(
      this.auto,"Modus",data.modus));
    this.cfgArray.push(new DialogConfRadio(
      this.auto,"DisplayFormat",data.format));
    this.cfgArray.push(new DialogConfSlider(
      this.auto,"Rectsize",data.rectsize));
    this.cfgArray.push(new DialogConfRadio(
      this.auto,"Bgcolor",data.bgcolor));
    let x = data.buttonsize.getButtonX0();
    let y = data.buttonsize.getButtonY0();
    let addx = data.buttonsize.getButtonAddX(); //25;
    let addy = data.buttonsize.getButtonAddY(); //25;
    let dst = data.buttonsize.getButtonDist();

    let bMain = graphics.makeButton(
      "MAIN", x, y, "white");
    this.divMain.child(bMain);
    let bRun = graphics.makeButton(
      "RUN", x+addx,y,"yellow", 
      () => {this.auto.eveCall(1,0,0);});
    this.divMain.child(bRun);
    y = y+addy;
    for(let i=0;i<this.cfgArray.length;i++) {
      let div = this.cfgArray[i].makeDivOverview(
        i,x,y,addx,addy,dst,4);
      this.divMain.child(div);
    }
    y = y+4*addy;
    let bConfig = graphics.makeButton(
      "CONFIG", x, y,"yellow",
      () => {this.auto.eveCall(2,0,0);}
    );
    this.divMain.child(bConfig);
    this.divMain.style("display", "none");
  }
}
