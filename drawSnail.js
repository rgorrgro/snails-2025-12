// R. Gorr-Grohmann
// September 2025
// Snail Drawing 
//   T1: Step by Step
//   T2: All at Once
//
"use strict";
class SnailTX {
  constructor(
    mom_,
    nr_,
    snail_,
    cyclesPerRect_,
    randStartSnail_,
    lineSize_,
    lineColor_,
    name_
    ) {
    this.mom = mom_;
    this.nr = nr_;
    this.bSnail = snail_;
    this.className = name_;
    this.tst = new Test(this.className, true, 1);
    this.tst.off();
    this.cyclesPerRectangle = cyclesPerRect_;
    this.randStartSnail = randStartSnail_;
    this.lineSize = lineSize_;
    this.lineColor = lineColor_;
    this.tst.print(
      1,
      "const Nr|Step|cPR|rSC|linSiz|linCol",
      this.nr,
      this.bSnail.steps.length,
      this.cyclesPerRectangle,
      this.randStartSnail,
      this.lineSize,
      this.lineColor
    );
    //this.auto = new Automat1(this.tst, name_, this.nr);
    //this.createAutomat1();
    this.auto = new Automat2(this.tst, name_, this.nr);
    this.createAutomat2();
    //this.auto.evePush(1, 0);
    this.cyclePoint = -1;
    this.cycleStep = 0;
  }
  createAutomat2() {
    this.auto.setState(["STA", "WA1", "RUN",
                        "WA2","DEL"]);
    this.auto.setEvent(["TRI", "ALO", "RUN", "FIN", 
                        "DEL","RES"]);
    // ENr 0: TRI Trigger
    //// ENr 1: class constructor & Snails
    // ENr 1: ALO Snails event "allow running"
    // ENr 2: RUN Int event "free running slot"
    // ENr 3: FIN Int event "drawing finished"
    // ENr 4: DEL Snails event "rewind snail"
    // ENr 5: Snails event "allow deletion"
    // ENr 6: Internal event "deletion completed""
    let next = [
      [[0,1],[1,0],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],
    // SNr 0 STA START
    //    ENr 0: TRI Count 0- and 1+
    //    ENr 1: ALO do nothing => NSNr 1
      [[1,2],[-1,-1],[2,3],[-1,-1],[-1,-1],[-1,-1]],
    // SNr 1 WA1 Wait for running slot
    //    ENr 0: TRI if free slot:
    //            Count 1- and 2+; 
    //            Create int event RUN
    //    ENr 2: RUN init drawing => NSNr 2 
      [[2,4],[-1,-1],[-1,-1],[3,5],[-1,-1],[-1,-1]],
    // SNr 2 RUN Draw snail
    //    ENr 0: TRI draw and if drawing done:
    //            Create event 3
    //    ENr 3: FIN Count 2- and 3+; 
      [[3,0],[-1,-1],[-1,-1],[-1,-1],[4,6],[-1,-1]],
    // SNr 3 WA2 Wait for deletion event
    //    ENr 0: TRI do nothing
    //    ENr 4: DEL Init deletion of snail => NSNr 4
      [[4,7],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[5,8]],
    // SNr 4 DEL Deleting snail
    //    ENr 0: TRI delete and if deleting done:
    //            Create event 5
    //    ENr 5: HLT Count 3- and 4+ => NSNr 5
      [[5,0],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],
    // SNr 5 HLT Waiting for restart
    //    ENr 0: TRI do nothing
    ];
    this.auto.setNext(next);
    let afunction = [
      // 0
      () => {},
      // 1
      () => {
        this.mom.stateIncr(0, false);
        this.mom.stateIncr(1, true);
      },
      // 2
      () => {
        if (this.mom.stateLessThanMaxNumberOfRunningSnail()) {
          if (random(this.randStartSnail) < 1) {
            this.mom.stateIncr(1, false);
            this.mom.stateIncr(2, true);
            this.auto.evePush(2, 0);
          }
        }
      },
      // 3
      () => {
        this.cyclePoint = -1;
        this.cycleStep = 0;
        this.step = this.bSnail.steps[0];
      },
      // 4
      () => {
        if (!this.drawSnail()) {
          this.auto.evePush(3, 0);
        }
      },
      // 5
      () => {
        this.mom.stateIncr(2, false);
        this.mom.stateIncr(3, true);
      },
      // 6
      () => {
        this.cyclePoint = -1;
        this.cycleStep = 0;
        this.step = this.bSnail.steps[0];
      },
      // 7
      () => {
        if (this.deleteSnail()) {
          this.auto.evePush(5, 0);
        }
      },
      // 8
      () => {
        this.mom.stateIncr(3, false);
        this.mom.stateIncr(4, true);
      },
    ];
    this.auto.setFunction(afunction);
  }
  /*
  XcreateAutomat2() {
    this.auto.setState(["STA", "INI", "WAI", "RUN", 
                        "HLT"]);
    // ENr 0: Snails trigger
    // ENr 1: class constructor & Snails
    // ENr 2: Snails event "prepare for running"
    // ENr 3: Internal event of state 2 "run"
    // ENr 4: Internal event of state 3 "halt"
    this.auto.setEvent(["TRI", "INI", "PRE", "RUN", 
                        "HLT"]);
    let next = [
    // SNr 0 STA START
    //    ENr 0: do nothing
    //    ENr 1: Count 0- and 1+ => NSNr 1
      [[1,1],[1,1],[-1,-1],[-1,-1],[-1,-1]],
    // SNr 1 INI Prepared for Running
    //    ENr 0: do nothing
    //    ENr 2: Count 1- and 2+ => NSNr 2
      [[1,0],[-1,-1],[2,2],[-1,-1],[-1,-1]],
    // SNr 2 WAI Wait for running slot
    //    ENr 0: if free slot:
    //            Count 2- and 3+; 
    //            Create event 3
    //    ENr 3: init drawing 
      [[2,3],[-1,-1],[-1,-1],[3,4],[-1,-1]],
    // SNr 3 RUN Draw snail
    //    ENr 0: draw and if drawing done:
    //            Create event 4
    //    ENr 4: Count 3- and 4+; 
      [[3,5],[-1,-1],[-1,-1],[-1,-1],[4,6]],
    // SNr 4 HLT Finished
    //    ENr 0: do nothing
    //    ENr 1: Count 0- and 1+; 
      [[4,0],[1,7],[-1,-1],[-1,-1],[-1,-1]],
    ];
    this.auto.setNext(next);
    let afunction = [
      // 0
      () => {},
      // 1
      () => {
        this.mom.stateIncr(0, false);
        this.mom.stateIncr(1, true);
      },
      // 2
      () => {
        this.mom.stateIncr(1, false);
        this.mom.stateIncr(2, true);
      },
      // 3
      () => {
        if (this.mom.stateLessThanMaxNumberOfRunningSnail()) {
          if (random(this.randStartSnail) < 1) {
            this.mom.stateIncr(2, false);
            this.mom.stateIncr(3, true);
            this.auto.evePush(3, 0);
          }
        }
      },
      // 4
      () => {
        this.cyclePoint = -1;
        this.cycleStep = 0;
        this.step = this.bSnail.steps[0];
      },
      // 5
      () => {
        if (!this.drawSnail()) {
          this.auto.evePush(4, 0);
        }
      },
      // 6
      () => {
        this.mom.stateIncr(3, false);
        this.mom.stateIncr(4, true);
      },
      // 7
      () => {
        this.mom.stateIncr(0, false);
        this.mom.stateIncr(1, true);
      },
    ];
    this.auto.setFunction(afunction);
  }
*/
  trigger() {
    this.auto.evePush(0, 0); // TRIGGER event
    this.auto.eveShift();
  }
  drawPoint() { }
  deleteSnail() { return(true); }
  drawSnailAtOnce(color_) {
    for (let i = 0; i < this.bSnail.steps.length; i++) {
      this.step = this.bSnail.steps[i];
      let t = 0;
      let tadd = 1 / this.cyclesPerRectangle;
      for (let j=0; j<this.cyclesPerRectangle; j++) {
        this.step.drawBezierPoint(
          t,color_,this.lineSize);
        t += tadd;
      }
    }
    return false;
  }
}
class SnailT0 extends SnailTX {
  constructor(
    mom_,
    nr_,
    snail_,
    cyclesPerRect_,
    randStartSnail_,
    lineSize_,
    lineColor_
  ) {
    super(mom_,
    nr_,
    snail_,
    cyclesPerRect_,
    randStartSnail_,
    lineSize_,
    lineColor_,
    "SnailT0"
    );
    this.tst = new Test("snail0", true, 1);
  }
  drawSnail() {
    return false;
  }
}
class SnailT1 extends SnailTX {
  constructor(
    mom_,
    nr_,
    snail_,
    cyclesPerRect_,
    randStartSnail_,
    lineSize_,
    lineColor_
  ) {
    super(mom_,
    nr_,
    snail_,
    cyclesPerRect_,
    randStartSnail_,
    lineSize_,
    lineColor_,
    "SnailT1"
    );
    this.tst = new Test("snail1", true, 1);
  }
  drawSnail() {
    let t = 0;
    this.cyclePoint += 1;
    if (this.cyclePoint < this.cyclesPerRectangle) {
      t = this.cyclePoint / this.cyclesPerRectangle;
    } else {
      this.cyclePoint = 0;
      this.cycleStep += 1;
      if (this.cycleStep < this.bSnail.steps.length) {
        t = 0;
        this.step = this.bSnail.steps[this.cycleStep];
      } else {
        return false;
      }
    }
    this.step.drawBezierPoint(t, this.lineColor, this.lineSize);
    return true;
  }
}
class SnailT2 extends SnailTX {
  constructor(
    mom_,
    nr_,
    snail_,
    cyclesPerRect_,
    randStartSnail_,
    lineSize_,
    lineColor_
  ) {
    super(mom_,
    nr_,
    snail_,
    cyclesPerRect_,
    randStartSnail_,
    lineSize_,
    lineColor_,
    "SnailT2"
    );
    this.tst = new Test("snail2", true, 1);
  }
  drawSnail() {
    return(this.drawSnailAtOnce(this.lineColor));
    /*
    for (let i = 0; i < this.bSnail.steps.length; i++) {
      this.step = this.bSnail.steps[i];
      let t = 0;
      let tadd = 1 / this.cyclesPerRectangle;
      for (let j = 0; j < this.cyclesPerRectangle; j++) {
        this.step.drawBezierPoint(t, this.lineColor, this.lineSize);
        t += tadd;
      }
    }
    return false;
    */
  }
}