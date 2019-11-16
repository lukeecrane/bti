import {Component, Input, OnInit} from '@angular/core';
import {Index, Scripture, Sub} from "../../../_models/index";

@Component({
  selector: 'app-scripture-list',
  templateUrl: './scripture-list.component.html',
  styleUrls: ['./scripture-list.component.scss']
})
export class ScriptureListComponent implements OnInit {

  @Input() index:Index;

  @Input() admin:boolean=false;  //If it is admin then display admin functions

  @Input() sub:Sub;  //If it is sub, the should be assumed that sub is the primary problem

  @Input() subIndex:number=-1;

  constructor() { }

  ngOnInit() {
  }

}
