import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Index, Redirect, Scripture} from "../../../_models/index";
import {first} from "rxjs/operators";
import {IndicesService} from "../../../_services/indices.service";
import {Sub} from "../../../_models";


@Component({
  selector: 'app-redirect-modal-index',
  templateUrl: './redirect-modal-index.component.html',
  styleUrls: ['./redirect-modal-index.component.scss']
})
export class RedirectModalIndexComponent implements OnInit, OnChanges {

  @Input() index:Index;
  @Input() indices:Index[];



  redirect_topics:Redirect[]=[];

  //filtered_indicies:Index[]; //remove in a second
  possible_titles:String[];
  filtered_possible_titles:String[];

  selected_redirect_topic:Redirect;  //Not sure why I really need to seperate variable, but it is more readable

  errorMessage:string='';

  @Output() result= new EventEmitter<Index>();

  closeResult: string;

  constructor(private modalService: NgbModal,private indicesService: IndicesService) {}



  indexChanges(index) {
    this.filtered_possible_titles=this.filter_the_possible_titles(index,this.possible_titles);
    this.redirect_topics=index.redirect_topics.sort(function(a, b){
      var titleA=a.title.toLowerCase(), titleB=b.title.toLowerCase()
      if (titleA < titleB) //sort string ascending
        return -1
      if (titleA > titleB)
        return 1
      return 0 //default return value (no sorting)
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (typeof changes['indices'] !== "undefined") {  //In case of global changes to indicies
      this.possible_titles=this.make_possible_titles(changes.indices.currentValue);
      this.indexChanges(this.index)
    }

    this.errorMessage='';  //Remove error messages on changes
  }

  private titleCase(str:String):String {
    var splitStr = str.trim().toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
  }

  private make_possible_titles(indices:Index[]):String[] {  //only needs to be called with indexs are changed
    let result:Array<String>=[];
    indices.forEach((index)=> {
      result.push(this.titleCase(index.main_heading))
    })
    return result;
  }


  private filter_the_possible_titles(index:Index,possible_titles:String[]):String[] {
    let result:Array<String>=[];
    let difference:Array<String>=[];
    index.redirect_topics.forEach((redirect) => {
      result.push(this.titleCase(redirect.title));
    });
    difference=possible_titles.filter(function(item) {
      let  index_of=result.indexOf(item)
      if(index_of==-1) {
        return true;
      }
    });
    return difference;
  }
  open_edit(content,redirect:Redirect) {
    this.errorMessage='';
    this.selected_redirect_topic=redirect;
    this.indexChanges(this.index);
    this.modalService.open(content, {ariaLabelledBy: 'modal-edit-redirect'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  open_new(content, index:Index) {
    this.errorMessage='';
    this.indexChanges(this.index);
    this.selected_redirect_topic=new Redirect();
    this.modalService.open(content, {ariaLabelledBy: 'modal-new-redirect'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  open_delete(content,redirect:Redirect) {
    this.errorMessage='';
    this.selected_redirect_topic=redirect;
    //this.filtered_possible_titles=this.filter_the_possible_titles(this.index,this.possible_titles);
    this.modalService.open(content, {ariaLabelledBy: 'modal-delete-redirect'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  private save_redirect(index:Index,redirect:Redirect) {
    let self=this;
    let foundIndex=-1;
    foundIndex=self.index.redirect_topics.findIndex( x=> x.title==redirect.title);

    if (foundIndex!=-1) {
      self.errorMessage="Unable to add this Redirect as it is already added."
    } else {
      self.index.redirect_topics.push(redirect);
      this.indicesService
        .update(index)
        .pipe(first())
        .subscribe(index => {
            self.result.emit(index);
            self.index=index;
            self.indexChanges(index)
            self.modalService.dismissAll();
          },
          err => {
            console.log(err)
            self.errorMessage = "Unable to save this new Topic: Topic must be unique."

          });
    }
  }
  private delete_this(index:Index,redirect:Redirect) {
    let self=this;
    let foundIndex=-1;
    foundIndex=self.index.redirect_topics.findIndex( x=> x.title==redirect.title);

    if (foundIndex==-1) {
      self.errorMessage="Unable to delete this Redirect: "
    } else {
      index.redirect_topics.splice(foundIndex,1);
      this.indicesService
        .update(index)
        .pipe(first())
        .subscribe(index => {
          self.indexChanges(index)
          self.modalService.dismissAll();
        });
    }
  }




  ngOnInit() {
  }

}

