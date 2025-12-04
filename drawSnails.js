// R. Gorr-Grohmann
// September 2025
// Snails Drawings
//
"use strict";
class DrawSnails {
  constructor() {
    this.tst = new Test("snails", true, 1);
    this.tst.off();
    this.stateNumbers = [];
    this.auto = new Automat2(this.tst, "snails", 0);
    this.createAutomat();
  }
  createAutomat() {
    this.auto.setState(["STA","SNA",
                        "RUN","DEL","WAI"]);
    this.auto.setEvent(["TRI","SNA","ALO",
                        "DEL","WAI","RES"]);
    // ENr 0: TRI Sketch trigger
    // ENr 1: SNA int event "Cre bezier based snails"
    // ENr 2: ALO int event "All snails created"
    // ENr 3: DEL int event "All snails finished"
    // ENr 4: WAI int event "All snails deleted"
    // ENr 5: RES int event "Wait time over"
    let next = [
    [[0,1],[1,2],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],
    // State SNr 0 STA Start: 
    //   TRI: create bezier snails; Create SNA 
    //   SNA: create bezier based snails
    [[1,3],[-1,-1],[2,4],[-1,-1],[-1,-1],[-1,-1]],
    // State SNr 1 SNA Snails being created
    //   TRI: if snails created: push internal ENr ALO
    //   ALO: allow running of snails by snail.ENr 1
    [[2,5],[-1,-1],[-1,-1],[3,6],[-1,-1],[-1,-1]],
    // State SNr 2 RUN Snails are running
    //   TRI: if snails finished: push int ENr DEL
    //   DEL: delete snails by snail.ENr 4
    [[3,7],[-1,-1],[-1,-1],[-1,-1],[4,8],[-1,-1]],
    // State SNr 3 DEL deleting snails
    //   TRI: if all snails deleted: push int ENr WAI
    //   WAI: set timer
    [[4,9],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[1,2]],
    // State SNr 4 WAI Some time to wait
    //   TRI: if time over: push int ENr RES
    //   RES: creating of bezier based snails
    ];
    this.auto.setNext(next);
    let afunction = [
      // 0
      () => { },
      // 1
      () => {
        // Create new bezier snails
        this.snails0 = [];
        this.initSnails0();
        this.lineSize = data.linesize.getValue();
        this.prelinecolor = [0,0,0];
        this.curlinecolor = [0,0,0];
        this.isSnailColored = [];
        for (let i=0; i<this.snails0.length;i++) {
          this.isSnailColored.push(false);
        }
        this.auto.evePush(1, 0);
      },
      // 2
      () => {
        this.snails1 = [];
        this.stateInit(6, this.snails0.length);
        this.statePrint();
        //  ???
        if (this.snails1!=undefined) {
          let k = this.snails1.length-1;
          for (let i = k; i >= 0; i--) {
            this.snails1[i] = undefined;
            this.snails1.splice(i,1);
          }
        }
        //
        // store values for refresh after restart
        this.prelinecolor = 
          this.curlinecolor.slice(0);
        data.linecolor.setValueRandomly();
        this.curlinecolor = data.linecolor.getValue();
        //
        // Select which snail should be displayed how
        this.typcnt = [0,0,0];
        let x = data.modus.getNoneGrowAtOn()[1]/100;
        this.typcnt[1] = int(x*this.snails0.length);
        x = data.modus.getNoneGrowAtOn()[2]/100;
        this.typcnt[2] = int(x*this.snails0.length);
        this.typcnt[0] = 
          this.snails0.length
          -this.typcnt[1]
          -this.typcnt[2];
        tst.print(0,"CntSnails|T0T1T2",
                  this.snails0.length,
                  this.typcnt);
        this.initSnails1()
        this.statePrint();
      },
      // 3
      () => {
        this.statePrint();
        if(this.stateNumbers[1]==this.snails1.length) {
          this.auto.evePush(2, 0);
        }
      },
      // 4
      () => {
        for (let i=0; i<this.snails1.length; i++) {
          this.snails1[i].auto.evePush(1, 0);
        }
      },
      // 5
      () => {
        this.statePrint();
        if (this.stateNumbers[3] == this.snails1.length) {
          this.auto.evePush(3, 0);
        }
      },
      // 6
      () => {
        for (let i=0; i<this.snails1.length; i++) {
          this.snails1[i].auto.evePush(4, 0);
        }
      },
      // 7
      () => {
        this.statePrint();
        if (this.stateNumbers[4] == this.snails1.length) {
          this.auto.evePush(4, 0);
        }
      },
      // 8
      () => {
        this.timer = data.frames.getValue() * 3;
      },
      // 9
      () => {
        this.statePrint();
        this.timer -= 1;
        if (this.timer < 0 ) {
          this.auto.evePush(5, 0);
        }
      },
    ];
    this.auto.setFunction(afunction);
  }
  //
  //  Help Functions
  //
  initSnails0() {
    let baseSnails = new BaseSnails(
      data.rectsize.getValue(),
      data.rectsize.getCentralizer(),
      data.rectsize.getX(),
      data.rectsize.getY()
    );
    //this.tst.print(1, 
    //               "create BaseSnails",
    //               baseSnails.toString());
    //
    let bSnails = new BezierSnails(
      baseSnails,
      data.rectsize.getValue(),
      data.rectsize.getCentralizer(),
    );
    //print(bSnails.toString());
    /*
    this.tst.print(1, 
                   "const params SLen", 
                   bSnails.arr.length);
    this.tst.print(1, 
                   "create BezierSnails",
                   bSnails.toString());
    */
    this.snails0 = bSnails.arr.slice(0);
  }
  initSnails1() {
    this.snails1 = [];
    for (let i=0; i<this.snails0.length;i++) {
      this.snails1.push(undefined)
    }
    //
    for (let i=0; i<3; i++) {
      for (let j=0; j<this.typcnt[i]; j++) {
        let notfound = true;
        while (notfound) {
          let rand = int(random(this.snails1.length));
          if (this.snails1[rand]==undefined) {
            switch (i) {
            case 0: 
              this.snails1[rand] = 
                new SnailT0(
                  this,
                  rand,
                  this.snails0[rand],
                  // number of points per rectangle
                  40,
                  // mean nr of cycles to start a snail
                  24, 
                  data.linesize.getValue(),
                  [0,0,0,255]
                  );
            break;
            case 1: 
              this.snails1[rand] = 
                new SnailT1(
                  this,
                  rand,
                  this.snails0[rand],
                  40,
                  24, 
                  data.linesize.getValue(),
                  this.curlinecolor
                  );
            break;
            case 2: 
              this.snails1[rand] = 
                new SnailT2(
                  this,
                  rand,
                  this.snails0[rand],
                  40,
                  24, 
                  data.linesize.getValue(),
                  this.curlinecolor
                  );
              break;
            }
            notfound = false;
          } else {
            rand = (rand+1<this.snails1.length
                   ?rand+1:0);
          }
        }
      }
    }
    //
    for (let i=0;i<this.snails1.length;i++) {
      if (this.snails1[i].className=="SnailT0") {
        this.snails1[i].drawSnailAtOnce(
          data.bgcolor.getValue());  
      }
    }
    for (let i=0;i<this.snails1.length;i++) {
      if (this.snails1[i].className!="SnailT0") {
        if (this.isSnailColored[i]) {
          this.snails1[i].drawSnailAtOnce(
            this.prelinecolor);  
        }
      }
    }
    this.isSnailColored = [];
    for (let i=0; i<this.snails1.length;i++) {
      if (this.snails1[i].className=="SnailT0") {
        this.isSnailColored.push(false);
      } else {
        this.isSnailColored.push(true);
      }
    }
  }
  //
  trigger() {
    this.auto.evePush(0, 0); // TRIGGER event
    this.auto.eveShift();
    if (this.snails1!=undefined) {
      for (let i = 0; i < this.snails1.length; i++) {
        this.snails1[i].trigger();
      }
    }
  }
  triggerSnails(snails_) {
    for (let i = 0; i < snails_.length; i++) {
      snails_[i].drawTrigger();
    }
  }
  //
  // State counting
  //
  stateInit(len_, cnt_) {
    this.stateTimer = data.frames.getValue();
    this.stateNumbers = [];
    for (let i = 0; i < len_; i++) {
      this.stateNumbers[i] = 0;
    }
    this.stateNumbers[0] = cnt_;
  }
  stateIncr(s_, b_) {
    this.stateNumbers[s_] += b_ ? 1 : -1;
  }
  stateLessThanMaxNumberOfRunningSnail() {
    // max number of parallel running snails: 8
    let ret = this.stateNumbers[2]<8 ?true :false;
    return ret;
  }
  statePrint() {
    this.stateTimer -= 1;
    if (this.stateTimer < 0) {
      print("stateCounter:" + this.stateNumbers);
      this.stateTimer = data.frames.getValue();
    }
  }
}
