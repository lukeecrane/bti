import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Index, Sub} from "../../../_models/index";

@Component({
  selector: 'app-sub-card',
  templateUrl: './sub-card.component.html',
  styleUrls: ['./sub-card.component.scss']
})
export class SubCardComponent implements OnInit {

  @Input() sub:Sub;
  @Input() subIndex:number;

  @Input() index:Index;

  @Input() indicies: Index[]=[];

  @Output() result= new EventEmitter<Index>();

  constructor() { }

  ngOnInit() {
  }

  indexChanged(index) {
    console.log("********SUB CHANGED**************")
    console.log(index)
    this.result.emit(index);
  }
}
