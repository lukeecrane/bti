import { Component, OnInit, OnChanges } from "@angular/core";
import { first } from "rxjs/operators";

import { User } from "../../../_models/user";
import { UserService } from "../../../_services/user.service";
import { IndicesService } from "../../../_services/indices.service";
import {Index, Redirect, Scripture} from "../../../_models/index";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import {NgbAccordion, NgbModal, NgbPaginationConfig, NgbTabsetConfig} from "@ng-bootstrap/ng-bootstrap";
import {Sub} from "../../../_models/index";




@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"]
})
export class AdminComponent implements OnInit {
  public model: any;
  modalexpand_verse:String;
  modalexpand_entire: String;
  topics: Array<string> = [];
  indices: Index[] = [];
  display_indices: Index[]=[];
  sort_filter: String='';
  public current_index:Index;
  public current_redirect:Redirect;
  public current_scripture: Scripture;

  pageSize:number=25;

  page:number=0;

  subset_of_display_indices:Index[];
  error_message:String;
  collection_size:number;



  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(
        term =>
          term.length < 2
            ? []
            : this.topics
              .filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10)
      )
    );

  constructor(
    private userService: UserService,
    private indicesService: IndicesService,
    private modalService: NgbModal
    ,
    config: NgbPaginationConfig
  ) {
    config.boundaryLinks = true;
    config.rotate=true;



  }

  ngOnInit() {
    let self = this; //This function is so weird
    this.indicesService
      .getAll()
      .pipe(first())
      .subscribe(indices => {
        this.indices = indices;
        this.display_indices=indices;  //Create a copy
        this.indices.forEach(function(index) {
          self.topics.push(index.main_heading.toUpperCase());
        });
        this.newPage(1);
      });
  }

  filter(event, acc: NgbAccordion) {
    acc.collapseAll();
    this.sort_filter=event;
    this.display_indices=[];
    let self = this;
    this.indices.forEach(function(index) {
      if (
        event.toLowerCase() === index.main_heading.slice(0, event.length).toLowerCase()
      ) {
        self.display_indices.push(index);
      }
    });
  }
  goto(topic, acc: NgbAccordion) {
    let self = this;
    //acc.expandAll();
    this.subset_of_display_indices=[];  //blank out the display
    console.log("**************GOTO******************"+topic);
    this.indices.forEach(function(index,key) {
      if (
        topic.toLowerCase() === index.main_heading.slice(0, topic.length).toLowerCase()
      ) {
        self.subset_of_display_indices.push(index);
        acc.expandAll();
      }
    });


  }
  reset(acc: NgbAccordion) {

    this.model=this.sort_filter;
    this.filter(this.sort_filter,acc);
  }

  main_results_update(event) {
    this.display_indices=event;
    this.newPage(1)
  }
  newPage(event) {
    this.page=event;
    let curr_index=Math.round((this.pageSize)*(this.page-1));
    this.subset_of_display_indices=this.display_indices.slice(curr_index,curr_index+this.pageSize);
  }
 // Is a global events so we need to chain it
  indexChanged(event:Index,acc: NgbAccordion) {
    let self=this;
    console.log("**********INDEX HAS BEEN CHANGED*************"+event._id)
    let foundIndex=this.indices.findIndex( x=> x._id==event._id);
    console.log("**********INDEX THAT WAS CHANGED HAS BEEN FOUND*************"+foundIndex)
    if (foundIndex==-1) {  //Okay a new topic has been added!!!!!!!!!!
      this.indices.push(event);
      this.indices.sort(function(a, b){
        //console.log("***************SORT*************"+JSON.stringify(a)+"***********"+JSON.stringify(b))
        var titleA=a.main_heading.toLowerCase(), titleB=b.main_heading.toLowerCase()
        if (titleA < titleB) //sort string ascending
          return -1
        if (titleA > titleB)
          return 1
        return 0 //default return value (no sorting)
      });
      this.newPage(this.page)
    } else {

        self.indices[foundIndex] = event; //Index has been found so either this is a delete or modification
        console.log(event)
      if (event.deleted) {
        event.main_heading="THIS HAS BEEN DELETED!!"
        self.indices[foundIndex] = event;
        self.indices.splice(foundIndex,1);
        self.display_indices.splice(foundIndex,1);
        this.newPage(this.page);
        acc.collapseAll();
      } else {
        self.indices[foundIndex] = event;
      }

    }





  }

  goto_sub(topic:Index,sub:Sub, acc: NgbAccordion) {
    let self=this;
    console.log(sub)
    topic.displayed_sub=sub;

  }

}
