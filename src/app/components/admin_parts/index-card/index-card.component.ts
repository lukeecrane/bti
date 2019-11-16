import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Index} from "../../../_models/index";

@Component({
  selector: 'app-index-card',
  templateUrl: './index-card.component.html',
  styleUrls: ['./index-card.component.scss']
})
export class IndexCardComponent implements OnInit {

  @Input() index:Index;

  @Input() display_indices: Index[]=[];

  @Output() result= new EventEmitter<Index>();

  constructor() { }

  ngOnInit() {
  }

  indexChanged(index) {
    this.result.emit(index);
  }
}
