import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Index, Redirect, Scripture} from "../../../_models/index";
import {first} from "rxjs/operators";
import {IndicesService} from "../../../_services/indices.service";
import {Sub} from "../../../_models";

@Component({
  selector: 'app-redirect-modal-sub',
  templateUrl: './redirect-modal-sub.component.html',
  styleUrls: ['./redirect-modal-sub.component.scss']
})
export class RedirectModalSubComponent implements OnInit, OnChanges {

  @Input() index:Index;
  @Input() indices:Index[];

  @Input() sub:Sub;
  @Input() subIndex:number;

  redirect_topics:Redirect[]=[];

  //filtered_indicies:Index[]; //remove in a second
  possible_titles:String[];
  filtered_possible_titles:String[];

  selected_redirect_topic:Redirect;  //Not sure why I really need to seperate variable, but it is more readable

  errorMessage:string='';

  @Output() result= new EventEmitter<Index>();

  closeResult: string;

  constructor(private modalService: NgbModal,private indicesService: IndicesService) {}


  subChanges(sub) {
    let result=((sub === undefined)!)
    //console.log("************SUB CHANGES********"+result)
    //console.log(sub);
    if (sub === undefined) {
      //sub=new Sub();
      //console.log("UNDEFINED SUB")
    } else {

      console.log(sub)
      this.filtered_possible_titles = this.filter_the_possible_titles_sub(sub, this.possible_titles);

      this.redirect_topics = sub.redirect_topics.sort(function (a, b) {
        var titleA = a.title.toLowerCase(), titleB = b.title.toLowerCase()
        if (titleA < titleB) //sort string ascending
          return -1
        if (titleA > titleB)
          return 1
        return 0 //default return value (no sorting)
      });
      this.subIndex=this.index.subs.findIndex( x=> x._id==sub._id);  //Make sure and get this number again
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    //console.log("*****CHANGES*******"+typeof changes['indices']+"********"+this.subIndex+typeof changes['sub'])
    //console.log(changes);
    if (typeof changes['indices'] !== "undefined") {  //In case of global changes to indicies
      this.possible_titles=this.make_possible_titles(changes.indices.currentValue);

        //this.index.displayed_sub=this.index.subs[this.subIndex]
        this.subChanges(this.index.subs[this.subIndex])

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
    //console.log("POSSIBLE TITLES")
    let result:Array<String>=[];
    indices.forEach((index)=> {
      result.push(this.titleCase(index.main_heading))
    })
    //console.log(result);
    return result;
  }
  private filter_the_possible_titles_sub(sub:Sub,possible_titles:String[]):String[] {
    let result:Array<String>=[];
    let difference:Array<String>=[];
    sub.redirect_topics.forEach((redirect) => {
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
    this.subChanges(this.sub)
    this.modalService.open(content, {ariaLabelledBy: 'modal-edit-redirect'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  open_new(content, index:Index) {
    this.errorMessage='';
    this.subChanges(this.sub)
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
    foundIndex=self.sub.redirect_topics.findIndex( x=> x.title==redirect.title);  //Does it exist in sub scriptures directory
    console.log(self.index);
    if (foundIndex!=-1) {
      self.errorMessage="Unable to add this Redirect as it is already added."
    } else {
      //console.log("*******SAVE REDIRECT*******"+foundIndex+"DF"+redirect.title)
      //console.log(index.subs[self.subIndex])
      //if (index.subs[self.subIndex].redirect_topics===undefined) {
      //  index.subs[self.subIndex].redirect_topics=[];
      //}
      index.subs[self.subIndex].redirect_topics.push(redirect);
      this.indicesService
        .update(index)
        .pipe(first())
        .subscribe(index => {
            //self.result.emit(index);
            self.index=index;
            self.index.displayed_sub=self.index.subs[self.subIndex]
            self.subChanges(self.index.subs[self.subIndex])
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
    foundIndex=self.sub.redirect_topics.findIndex( x=> x.title==redirect.title);  //Does it exist in sub scriptures directory

    if (foundIndex==-1) {
      self.errorMessage="Unable to delete this Redirect: "
    } else {
      index.subs[self.subIndex].redirect_topics.splice(foundIndex,1);
      this.indicesService
        .update(index)
        .pipe(first())
        .subscribe(index => {
          //self.result.emit(index);
          self.index=index;
          self.subIndex=self.index.subs.findIndex( x=> x.sub_heading==self.sub.sub_heading);
          self.index.displayed_sub=self.index.subs[self.subIndex]
          self.subChanges(self.index.subs[self.subIndex])

          self.modalService.dismissAll();
        });
    }
  }




  ngOnInit() {
  }

}

