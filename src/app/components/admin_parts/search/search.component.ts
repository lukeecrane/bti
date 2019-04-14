import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';

import {debounceTime, distinctUntilChanged, first, map} from "rxjs/operators";
import {Index, Sub} from "../../../_models";

import {Observable} from "rxjs/index";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  //Input the array of indexes
  @Input() topics: Array<Index> = [];

  //What search are displayed
  @Input() add_subs_search:Boolean = true;
  @Input() add_mains_search:Boolean =true;

  //Emit a list of Indexes or Subs
  @Output() main_result= new EventEmitter<Index[]>();
  @Output() sub_result= new EventEmitter<Sub[]>();

  //Mains info
  public mains: any;        //Current search text
  main_searches: Array<string> = [];  //Text needed for dropdowns
  filtered_main_topics: Index[];  //Filtered List
  main_topics: Index[] = [];  //The full list
  last_main_searches: Array<string>=[];   //for last button

  //sub searches
  public subs: any;                 //Current search text
  sub_searches: Array<string> = [];  //Text needed for dropdowns
  filtered_sub_topics: Sub[] = [];  //Filtered List
  sub_topics: Sub[] = [];    //The full list
  last_sub_searches: Array<string>=[];   //for last button
  //sub searches

  search_mains = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(
        term => term.length < 2
          ? []
          : this.main_searches
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
          : this.sub_searches
            .filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
            .slice(0, 10)
      )
    );

  constructor( ) {

  }
 ngOnInit() {

 }


  ngOnChanges(changes: SimpleChanges) {
    let self = this;
    if (changes['topics']) {
      self.sub_topics=[];
      self.main_searches=[];
      self.sub_searches=[];
      self.main_topics=changes.topics.currentValue; //Set main topics to topics when it changes
      this.main_topics.forEach(function (index) {
          self.main_searches.push(index.main_heading.toUpperCase());
          if (index.subs) {
            index.subs.forEach(function (sub) {
              self.sub_searches.push(sub.sub_heading);   //Add this to lookup text
              let temp_sub=sub;
              temp_sub.main_heading=index.main_heading;
              self.sub_topics.push(temp_sub);
            })
          }

      });
    }
  }




  filter_mains(event) {
    this.filtered_sub_topics=[];  // Blank out all filtered list
    this.filtered_main_topics = [];
    let self = this;
    if (this.main_topics.length>0) {
      this.main_topics.forEach(function (index) {
        if (
          event.toLowerCase() === index.main_heading.slice(0, event.length).toLowerCase()
        ) {
          self.filtered_main_topics.push(index);
        }
      });
      this.main_result.emit(this.filtered_main_topics);
      this.mains = event;
      this.subs = "";
    }
  }



  onBlur(event) {
    //Calling this function fixes problen
  }

  //Sub stufff


  filter_subs(event) {
    this.filtered_sub_topics=[];  // Blank out all filtered list
    this.filtered_main_topics = [];
    let self = this;
    this.sub_topics.forEach(function (sub) {
      if (
        event.toLowerCase() === sub.sub_heading.slice(0, event.length).toLowerCase()
      ) {

        self.filtered_sub_topics.push(sub);
      } else if (sub.sub_heading.toLocaleLowerCase().includes(event.toLowerCase())) {
        self.filtered_sub_topics.push(sub);
      }



    });
    this.subs=event;
    this.mains="";
    this.sub_result.emit(this.filtered_sub_topics)
  }

  savetosubSearch() {
    if (this.subs) {
      this.last_sub_searches.push(this.subs)
    }
  }


  savetomainSearch() {
    if (this.mains) {
      this.last_main_searches.push(this.mains)
    }
  }

  reset_mains() {
    this.mains = "";
    this.filter_mains("");
    this.last_main_searches = [];
  }

  reset_subs() {
    this.subs = "";
    this.filter_subs("");
    this.last_sub_searches = [];
  }


}


