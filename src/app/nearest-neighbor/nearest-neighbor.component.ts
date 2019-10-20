import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nearest-neighbor',
  templateUrl: './nearest-neighbor.component.html',
  styleUrls: ['./nearest-neighbor.component.css']
})
export class NearestNeighborComponent implements OnInit {

  // x1a1 = 2.8; x1a2= 10;
  // x2a1 = 4; x2a2= 7.8;
  // x3a1 = 8.8; x3a2= 6;
  // x4a1 = 12; x4a2= 11.8;
  // x5a1 = 13.8; x5a2= 9;

  // x1a1 = 21; x1a2= 10;
  // x2a1 = 23; x2a2= 13;
  // x3a1 = 5; x3a2= 12;
  // x4a1 = 25; x4a2= 12;
  // x5a1 = 4; x5a2= 10;

  x1a1 = 2; x1a2= 10;
  x2a1 = 4; x2a2= 7;
  x3a1 = 8; x3a2= 6;
  x4a1 = 12; x4a2= 11;
  x5a1 = 13; x5a2= 9;

  inputData = [
    [this.x1a1, this.x1a2],
    [this.x2a1, this.x2a2],
    [this.x3a1, this.x3a2],
    [this.x4a1, this.x4a2],
    [this.x5a1, this.x5a2]
  ];

  stepObj1 = {
    'distMatrix' : [[],[],[],[],[]],
    'minI' : 0,
    'minJ' : 0,
    'minVal' : Number.MAX_VALUE,
    'title' : ['1','2','3','4','5']

  };

  stepObj2 = {
    'distMatrix' :  [[{},{},{},{}],
                    [{},{},{},{}],
                    [{},{},{},{}],
                    [{},{},{},{}]],
    'minI' : 0,
    'minJ' : 0,
    'minVal' : Number.MAX_VALUE

  };

  stepObj3 = {
    'distMatrix' :  [[{},{},{}],
                    [{},{},{}],
                    [{},{},{}]],
    'minI' : 0,
    'minJ' : 0,
    'minVal' : Number.MAX_VALUE

  };

  stepObj4 = {
    'distMatrix' :  [[{},{}],
                    [{},{}]],
    'minI' : 0,
    'minJ' : 0,
    'minVal' : Number.MAX_VALUE

  };

  titles = [];

  calculationsComplete = false;


  calcDistanceMatrix(stepObj, arr){

    let minI = 0, minJ =0;
    let minVal = Number.MAX_VALUE;

    for(let i = 0; i < arr.length; i++){
      for(let j = 0; j < arr.length; j++){
        if(i!=j){
          let value = Math.pow(Math.pow(arr[i][0]-arr[j][0], 2) + Math.pow(arr[i][1]-arr[j][1], 2), 0.5);

          stepObj.distMatrix[i][j]= {'value':value};

          if(value < minVal) {
            minVal = value;
            minI = i;
            minJ = j;
          }
        } else {
          stepObj.distMatrix[i][j] = {'value':0};
        }
      }
    }
    stepObj.distMatrix[minI][minJ].isMin = true;
    stepObj.distMatrix[minJ][minI].isMin = true;
    stepObj.minI =minI;
    stepObj.minJ =minJ;

    this.addClusterToMatrix(this.stepObj1, this.stepObj2);
    this.addClusterToMatrix(this.stepObj2, this.stepObj3);
    this.addClusterToMatrix(this.stepObj3, this.stepObj4);
  }

  
  addClusterToMatrix(prevStep, curStep){

    const prevMatrix = prevStep.distMatrix;
    const prevMinI = prevStep.minI;
    const prevMinJ = prevStep.minJ;

    let masterCounter = 0;
    for(let i = 0, ii = 0; i<prevStep.distMatrix.length; i++){
      if(i != prevStep.minI && i != prevStep.minJ){
        for(let j = 0, jj = 0; j<prevStep.distMatrix.length; j++){
          if(j != prevStep.minJ && j != prevStep.minI){
            curStep.distMatrix[ii][jj].value = prevStep.distMatrix[i][j].value;
            jj++;
          } 
        }
        ii++;
        masterCounter ++;
      }
    }
    for(let i = 0, ii = 0; i<prevStep.distMatrix.length; i++){
      if(i != prevStep.minI) {
        if(ii != masterCounter){
          let value = 0.5 * (( prevMatrix[i][prevMinI].value + prevMatrix[i][prevMinJ].value ) -
                      (0.5 * Math.abs(prevMatrix[i][prevMinI].value - prevMatrix[i][prevMinJ].value)));  
          curStep.distMatrix[ii][masterCounter].value = curStep.distMatrix[masterCounter][ii].value = value;
          ii++;
        } else {curStep.distMatrix[masterCounter][masterCounter].value = 0}
      }
    }
    this.findMin(curStep);
    this.generateTitle(prevStep, curStep)

  }

  findMin(stepObj){

    let minI = 0, minJ = 0;
    let minVal = Number.MAX_VALUE;

    for(let i = 0; i< stepObj.distMatrix.length; i++){
      for(let j = 0; j< stepObj.distMatrix.length; j++){
        if(stepObj.distMatrix[j][i].value < minVal && i != j) {
          minVal = stepObj.distMatrix[i][j].value;
          minI = i;
          minJ = j;
        }
      }
    }

    stepObj.distMatrix[minI][minJ].isMin = true;
    stepObj.distMatrix[minJ][minI].isMin = true;
    stepObj.minI =minI;
    stepObj.minJ =minJ;
  }

  getColor(value){
    return value.isMin ? 'yellow' : 'white';
  }

  generateTitle(prevStep, curStep){
    curStep.title = [];
    for(let i = 0; i< prevStep.title.length; i++){
      if(i != prevStep.minI && i != prevStep.minJ){
        curStep.title.push(prevStep.title[i]) 
      }
    }
    curStep.title.push('('+prevStep.title[prevStep.minI]+', '+prevStep.title[prevStep.minJ]+')')
  }

  constructor() { }

  ngOnInit() {
  }

}
