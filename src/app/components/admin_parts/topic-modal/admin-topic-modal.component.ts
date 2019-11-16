import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Index, Redirect} from "../../../_models/index";
import {IndicesService} from "../../../_services/indices.service";
import {first} from "rxjs/operators";
import { NgbAccordion} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-admin-topic-modal',
  templateUrl: './admin-topic-modal.component.html',
  styleUrls: ['./admin-topic-modal.component.css']
})
export class AdminTopicModalComponent implements OnInit {

  @Input() index:Index;
  current_Index:Index;

  @Input() display_only_new:boolean;
  //@Input() collapse:NgbAccordion;

  @Output() result= new EventEmitter<Index>();
  closeResult: string;

  errorMessage:string='';

  constructor(private modalService: NgbModal,private indicesService: IndicesService) {}

  open(content,index:Index) {
    this.current_Index=index;
    this.errorMessage='';
    this.modalService.open(content, {ariaLabelledBy: 'modal-edit'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  open_new(content) {
    this.current_Index=new Index();
    this.errorMessage='';
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  open_delete(content) {
    this.current_Index=this.index;
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

  private save_index(index:Index) {
    let self=this;
    this.indicesService
      .save(index)
      .pipe(first())
      .subscribe(index => {

        console.log("*********TOPICS BEFORE EMIT**********" + index.main_heading);
        self.result.emit(index);
        console.log("*********TOPICS AFTER EMIT**********" + index.main_heading);
        self.modalService.dismissAll();
      },
        err => {
          self.errorMessage="Unable to save this new Topic: Topic must be unique."

        });
  }
  private update_index(index:Index) {
    let self=this;
    this.indicesService
      .update(index)
      .pipe(first())
      .subscribe(index => {
        console.log("*********TOPICS BEFORE EMIT**********" + index.main_heading);
        self.result.emit(index);
        console.log("*********TOPICS AFTER EMIT**********" + index.main_heading);
        self.modalService.dismissAll();
      });
  }

  private delete_index(index:Index) {
    let self=this;
    this.indicesService
      .delete(index)
      .pipe(first())
      .subscribe(index => {

        console.log("*********TOPICS BEFORE DELETE EMIT**********" + index.main_heading);
        self.result.emit(index);
        console.log("*********TOPICS AFTER DELETE EMIT**********" + index.main_heading);
        self.modalService.dismissAll();
      });
  }
  ngOnInit() {
  }

}
