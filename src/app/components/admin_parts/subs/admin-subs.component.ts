import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Index, Sub} from "../../../_models";
import {first} from "rxjs/operators";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {IndicesService} from "../../../_services/indices.service";

@Component({
  selector: 'app-admin-subs',
  templateUrl: './admin-subs.component.html',
  styleUrls: ['./admin-subs.component.scss']
})
export class AdminSubsComponent implements OnInit, OnChanges {

  @Input() index:Index;

  @Input() indicies:Index[]=[];

  @Input() current_sub:Sub;  //Values needed to be passed down to card sub
  current_sub_Index:number=-1;

  currently_editing_sub:Sub; //Temporary sub

  errorMessage:string='';

  @Output() result= new EventEmitter<Index>();

  closeResult: string;

  constructor(private modalService: NgbModal, private indicesService:IndicesService) {}

   ngOnInit() {


  }
  ngOnChanges(changes: SimpleChanges) {
    //console.log("*****CHANGES*******"+typeof changes['indices']+"********"+this.subIndex+typeof changes['sub'])
    console.log("************ADMIN SUBS************")
    console.log(this.current_sub)
    console.log(changes);
    //if ((typeof changes['current_sub'] !== "undefined") && (typeof changes.current_sub.currentValue !=="undefined")) {  //In case of global changes to indicies
     // console.log("*******CURRENT SUB CHANGE*****")
     // this.goto_sub(changes.current_sub.currentValue);
    //}

    this.errorMessage='';  //Remove error messages on changes
  }
 subChanged(event) {
    console.log("ADMIN SUB*************")
   console.log(event);
      this.goto_sub(event)
 }
  goto_sub(sub:Sub) {
    this.current_sub=sub;
    var self=this;
    //Find index
    this.index.subs.forEach(function(sub_ptr,key) {
        if (
          self.current_sub._id === sub_ptr._id
        ) {
         self.current_sub_Index=key;
      }
    });
    this.index.displayed_sub=sub;
    console.log("********GOTO SUB***********"+this.current_sub_Index+"*******")
    console.log(this.current_sub);

  }
  open_edit(content,sub:Sub) {
    this.currently_editing_sub=sub;
    this.errorMessage='';
    this.modalService.open(content, {ariaLabelledBy: 'modal-edit'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  open_new(content) {
    this.currently_editing_sub=new Sub();
    this.currently_editing_sub.redirect_topics=[];
    this.errorMessage='';
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  open_delete(content,sub:Sub) {
    console.log("CONTENT");
    console.log(content);
    this.currently_editing_sub=sub;
    this.errorMessage='';
    this.modalService.open(content, {ariaLabelledBy: 'modal-delete-title'}).result.then((result) => {
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

  private save_sub(index:Index,sub:Sub) {

    let self=this;
    let last_sub_index=0;
    if( index.subs!=null) {
      last_sub_index=index.subs.length;
    } else {
      index.subs=[];
    }
    sub.redirect_topics=[];
    sub.scriptures=[];
    index.subs.push(sub)
    this.indicesService
      .update(index)
      .pipe(first())
      .subscribe(index => {
          console.log("*********TOPICS BEFORE EMIT**********" + index.main_heading);
          console.log(index.subs[last_sub_index]);
          //self.result.emit(index);
          this.current_sub=index.subs[last_sub_index];
          this.index.displayed_sub=sub;
          self.modalService.dismissAll();
        },
        err => {
          self.errorMessage="Unable to save this new Topic: Topic must be unique."

        });
  }
  private update_sub(index:Index,sub:Sub) {
    let self=this;
    let foundIndex=this.index.subs.findIndex( x=> x._id==sub._id);
    if (foundIndex!==-1) {
      index.subs[foundIndex]=sub;
      this.indicesService
        .update(index)
        .pipe(first())
        .subscribe(index => {
          console.log("*********TOPICS BEFORE EMIT**********" + index.main_heading);
          this.index=index;
          this.index.displayed_sub=index.subs[foundIndex];
          self.result.emit(index);
          console.log("*********TOPICS AFTER EMIT**********" + index.main_heading);
          self.modalService.dismissAll();
        });
    } else {
      self.errorMessage="Unable to save edits to this Sub Topic."
    }
  }

  private delete_sub(index:Index,sub:Sub) {
    let self=this;
    //Remove sub from sub_topics
    let foundIndex=this.index.subs.findIndex( x=> x._id==sub._id);
    if (foundIndex!==-1) {
      index.subs.splice(foundIndex,1);  //Delete it from the record
      this.indicesService
        .update(index)
        .pipe(first())
        .subscribe(index => {
          this.current_sub=null;
          this.index=index;
          console.log("*********TOPICS BEFORE DELETE EMIT**********" + index.main_heading);
          self.result.emit(index);
          console.log("*********TOPICS AFTER DELETE EMIT**********" + index.main_heading);
          self.modalService.dismissAll();
        });
    } else {
      self.errorMessage="Unable to delete this new Sub Topic."
    }
  }
}
