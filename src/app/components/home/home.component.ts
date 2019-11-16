import { Component, OnInit, OnChanges } from "@angular/core";
import { first } from "rxjs/operators";

import { User } from "../../_models/user";
import { UserService } from "../../_services/user.service";
import { IndicesService } from "../../_services/indices.service";
import {Index, Sub} from "../../_models/index";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { NgbAccordion, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  public model: any;
  modalexpand_verse: String;
  modalexpand_entire: String;
  topics: Array<string> = [];
  indices: Index[] = [];
  display_indices: Index[] = [];
  sort_filter: String = '';
  subset_of_display_indices: Index[];
  error_message: String;
  collection_size: number;

  pageSize: number = 25;

  page: number = 0;

  searches: Array<string> = [];

  //sub searches
  display_only_subs: Boolean = false;
  sub_searches: Array<string> = [];
  public sub_model: any;
  subset_of_display_subs: Sub[];
  display_subs: Sub[] = [];
  sub_page: number = 0;
  sub_topics: Array<string> = [];
  //sub searches

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(
        term => term.length < 2
          ? []
          : this.topics
            .filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
            .slice(0, 10)
      )
    );

  search_subs = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(
        term => term.length < 2
          ? []
          : this.sub_topics
            .filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
            .slice(0, 10)
      )
    );

  constructor(
    private userService: UserService,
    private indicesService: IndicesService,
    private modalService: NgbModal,
    config: NgbPaginationConfig
  ) {
    config.boundaryLinks = true;
    config.rotate = true;

  }

  ngOnInit() {
    let self = this; //This function is so weird
    this.indicesService
      .getAll()
      .pipe(first())
      .subscribe(indices => {
        this.indices = indices;
        this.display_indices = indices;  //Create a copy
        this.indices.forEach(function (index) {

          self.topics.push(index.main_heading.toUpperCase());
          if (index.subs) {
            //console.log(index.subs)
            index.subs.forEach(function (sub) {
              self.sub_topics.push(sub.sub_heading);
            })
          }
        });
        this.newPage(1);
      });
  }


  filter(event, acc: NgbAccordion) {
    this.display_only_subs = false;
    acc.collapseAll();
    this.sort_filter = event;
    this.display_indices = [];
    let self = this;
    this.indices.forEach(function (index) {
      if (
        event.toLowerCase() === index.main_heading.slice(0, event.length).toLowerCase()
      ) {
        self.display_indices.push(index);
      }
    });
    this.newPage(1);
    this.model=event;
    this.sub_model="";
  }

  savetoSearch() {
    if (this.model) {
      this.searches.push(this.model)
    }
  }


  //Please remove this function at a latter date
  goto(topic, acc: NgbAccordion) {
    let self = this;
    //acc.expandAll();
    this.subset_of_display_indices = [];  //blank out the display
    console.log("**************GOTO******************" + topic);
    this.indices.forEach(function (index, key) {
      if (
        topic.toLowerCase() === index.main_heading.slice(0, topic.length).toLowerCase()
      ) {
        self.subset_of_display_indices.push(index);
        acc.expandAll();
      }
    });


  }

  goto_sub(topic: Index, sub: Sub, acc: NgbAccordion) {
    let self = this;
    console.log(sub)
    topic.displayed_sub = sub;
    // this.subset_of_display_indices.forEach(function(index,key) {
    //  if (
    //    topic_id === index._id
    //  ) {
    //   self.subset_of_display_indices[key].displayed_sub=sub;
    // }
    //});
  }

  goto_redirect(topic: Index, redirect, acc: NgbAccordion) {
    this.indices.forEach(function (index, key) {
      if (
        redirect.title.toLowerCase().trim() === index.main_heading.toLowerCase().trim()
      ) {
        topic.displayed_redirect = index;
        console.log(index.redirect_topics);
      } else if (redirect.title.toLowerCase() === index.main_heading.slice(0, redirect.title.length).toLowerCase()) {
        topic.displayed_redirect = index;
        console.log(index.redirect_topics);
      }

    });
  }

  goto_redirect_sub(sub: Sub, redirect, acc: NgbAccordion) {
    console.log("GOTO REDIRECT SUBS************")
    this.indices.forEach(function (index, key) {
      if (
        redirect.title.toLowerCase().trim() === index.main_heading.toLowerCase().trim()
      ) {
        sub.displayed_redirect=index;
      }
    });
  }

  jumpto(topic, errormodal) {
    let self = this;
    let rollback = this.display_indices;
    this.display_indices = [];
    this.indices.forEach(function (index, key) {
      if (
        topic.toLowerCase() === index.main_heading.slice(0, topic.length).toLowerCase()
      ) {
        self.display_indices.push(index);
      }
    });
    if (this.display_indices.length == 0) {
      //Display error message
      this.error_message = "This topic cannot be found in the database."
      this.modalService.open(errormodal, {ariaLabelledBy: 'modal-error'}).result.then((result) => {

      }, (reason) => {

      });
      //Revert Back
      this.display_indices = rollback;
    }

  }

  reset(acc: NgbAccordion) {

    this.model = "";
    this.filter("", acc);
    this.searches = [];
  }

  open(content, verse, text) {
    this.modalexpand_verse = verse;
    this.modalexpand_entire = (text ? text : "No scripture could be found.");
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'sm'}).result.then((result) => {

    }, (reason) => {

    });
  }

  newPage(event) {
    this.page = event;
    let curr_index = Math.round((this.pageSize) * (this.page - 1));
    this.subset_of_display_indices = this.display_indices.slice(curr_index, curr_index + this.pageSize);
  }

  onBlur(event) {
    //Calling this function fixes problen
  }

  //Sub stufff
  reset_sub(acc: NgbAccordion) {

    this.sub_model = "";
    this.filter_sub("", acc);
    this.sub_searches = [];
  }

  filter_sub(event, acc: NgbAccordion) {
    this.display_only_subs = true;
    acc.collapseAll();
    //this.sort_filter=event;
    this.display_subs = [];
    let self = this;
    this.indices.forEach(function (index) {
      console.log("**********SUBS**************" + event)
      if (index.subs) {
        //console.log(index.subs)
        index.subs.forEach(function (sub) {
          console.log(sub)
          if (
            event.toLowerCase() === sub.sub_heading.slice(0, event.length).toLowerCase()
          ) {
            sub.main_heading=index.main_heading;
            self.display_subs.push(sub);
          } else if (sub.sub_heading.toLocaleLowerCase().includes(event.toLowerCase())) {
            sub.main_heading=index.main_heading;
            self.display_subs.push(sub);
          }
        })
      }

    });
    this.sub_model=event;
    this.model="";
    this.newsubPage(1);
  }

  savetosubSearch() {
    if (this.sub_model) {
      this.sub_searches.push(this.sub_model)
    }
  }

  newsubPage(event) {
    this.sub_page = event;
    let curr_sub_index = Math.round((this.pageSize) * (this.sub_page - 1));
    this.subset_of_display_subs = this.display_subs.slice(curr_sub_index, curr_sub_index + this.pageSize);
  }
}

