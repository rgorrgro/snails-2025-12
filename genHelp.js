// Robert Gorr-Grohmann
// 2025-01-01
//
// Collection of helpful functions
//   Calculating global configuration variables
//   Test handling
//   Error handling
//
"use strict;"
class Help {
  constructor() {
  }
//
//  Error handling
//
  err() {
    let s = "Error "+arguments[0]+": ";
    for (let i=1;i<arguments.length;i++) {
      s += arguments[i]+"|";
    }
    print (s);
  }
  errAut() {
    let s = "AutError "+arguments[0]+": ";
    for (let i=1;i<arguments.length;i++) {
      s += arguments[i]+"|";
    }
    print (s);
  }
}
class Test {
  constructor(name_,bool_,valu_) {
    this.name = name_;
    this.bool = bool_;
    this.valu = valu_;
  }
//
//  Test handling
//
  on() { this.bool = true; }
  off() { this.bool = false; }
  value(valu_) { this.valu = valu_; }
  print(valu_) {
//    if ((this.bool) &&
//        (valu_<this.valu)) {
    if (this.bool) {
      let s = "Tst "+this.name+
          " "+arguments[1]+
          "=>";
      for (let i=2;i<arguments.length;i++) {
        s += arguments[i]+"|";
      }
      print (s);
    }
  }
}
//
// Dialogs Slider and Radio
//
class DialogConfRadio {
  constructor(auto_,name_,obj_) {
    this.type = "radio";
    this.auto = auto_;
    this.name = name_;
    this.obj = obj_;
  }
  makeDivOverview(i,x,y,addx,addy,dst,modifyeve_) {
    y = y+i*addy;
    let dOverX = createDiv();
    let bModi = graphics.makeButton(
      "MODIFY",x,y,"yellow",
      ()=>{this.auto.eveCall(modifyeve_,0,i);});
    let bName = graphics.makeButton(
      this.name,x+addx,y,"white",undefined);
    let bValu = graphics.makeButton(
      ""+this.obj.getName(),x+2*addx,y,
      "white",undefined);
    dOverX.child(bModi);
    dOverX.child(bName);
    dOverX.child(bValu);
    return(dOverX);
  }
  makeDivModify(div_,seteve_,backeve_) {
    print("Radio "+seteve_+" "+backeve_);
    let x = data.buttonsize.getButtonX0();
    let y = data.buttonsize.getButtonY0();
    let addx = data.buttonsize.getButtonAddX();
    let addy = data.buttonsize.getButtonAddY();
    let dist = data.buttonsize.getButtonDist();
    //
    let bName = graphics.makeButton(
      this.name,x,y,
      "white",undefined);
    div_.child(bName);
    y += addy;
    this.bValue = graphics.makeButton(
      " "+this.obj.getName(),x,y,
      "white",undefined);
    div_.child(this.bValue);
    y += addy;
    let bSet = graphics.makeButton(
      "SET",x,y,"yellow",
      () => {this.auto.eveCall(seteve_,0,0);});
    div_.child(bSet);
    let bReset = graphics.makeButton(
      "BACK",x+addx,y,"yellow",
      () => {this.auto.eveCall(backeve_,0,0);});
    div_.child(bReset);
    //
    y += addy;
    this.xType = createRadio(this.obj.getValue());
    this.xType.position(x,y);
    this.xType.size(2*addx-dist);
    for(let i=0;i<this.obj.array.length;i++) {
      this.xType.option(i,this.obj.array[i][1]);
    }
    this.xType.style("background","yellow");
    div_.child(this.xType);
  }
  setValue() {
    let x = this.xType.value();
    this.bValue.html(""+this.obj.array[x][1]);
    this.obj.setValue(x);
  }
}
class DialogConfSlider {
  constructor(auto_,name_,obj_) {
    this.type = "slider";
    this.auto = auto_;
    this.name = name_;
    this.obj = obj_;
  }
  makeDivOverview(i,x,y,addx,addy,dst,modifyeve_) {
    y = y+i*addy;
    let dOverX = createDiv();
    let bModi = graphics.makeButton(
      "MODIFY",x,y,"yellow",
      ()=>{this.auto.eveCall(modifyeve_,0,i);});
    let bName = graphics.makeButton(
      this.name,x+addx,y,"white",undefined);
    let bValu = graphics.makeButton(
      ""+this.obj.getValue(),x+2*addx,y,
      "white",undefined);
    dOverX.child(bModi);
    dOverX.child(bName);
    dOverX.child(bValu);
    return(dOverX);
  }
  makeDivModify(div_,seteve_,backeve_) {
    print("Slider "+seteve_+" "+backeve_);
    let x = data.buttonsize.getButtonX0();
    let y = data.buttonsize.getButtonY0();
    let addx = data.buttonsize.getButtonAddX();
    let addy = data.buttonsize.getButtonAddY();
    let dist = data.buttonsize.getButtonDist();
    //
    let bName = graphics.makeButton(
      this.name,x,y,
      "white",undefined);
      div_.child(bName);
    y += addy;
    this.bValue = graphics.makeButton(
      " "+this.obj.getValue(),x,y,
      "white",undefined);
    div_.child(this.bValue);
    y += addy;
    let bSet = graphics.makeButton(
      "SET",x,y,"yellow",
      () => {this.auto.eveCall(seteve_,0,0);});
    div_.child(bSet);
    let bReset = graphics.makeButton(
      "BACK",x+addx,y,"yellow",
      () => {this.auto.eveCall(backeve_,0,0);});
    div_.child(bReset);
    //
    y += addy;
    let bMin = graphics.makeButton(
      "MIN: "+this.obj.getMin(),x,y,
      "white",undefined);
    div_.child(bMin);
    let bMax = graphics.makeButton(
      "MAX: "+this.obj.getMax(),x+addx,y,
      "white",undefined);
    div_.child(bMax);
    y += addy;
    this.xType = createSlider(
      this.obj.getMin(),
      this.obj.getMax(),this.obj.getValue());
    this.xType.position(x,y);
    div_.child(this.xType);
  }
  setValue() {
    let x = this.xType.value();
    this.bValue.html(""+x);
    this.obj.setValue(x);
  }
}
//
//
//
class Graphics {
  makeCanvas() {
    frameRate(data.frames.getValue());
    canvas = createCanvas(
      data.format.getWidth(), 
      data.format.getHeight());
  }
  makeButton(text_, x_, y_, color_, func_) {
    let button = createButton(text_);
    button.position(x_, y_);
    button.size(data.buttonsize.getButtonW(),
                data.buttonsize.getButtonH());
    let siz = data.buttonsize.getButtonTS() + 'px';
    button.style('font-size', siz);
    button.style("background", color_);
    if (!(func_ == undefined)) {
      button.mousePressed(func_);
    }
    return button;
  }  
}
