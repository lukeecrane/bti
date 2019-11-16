import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Index, Scripture, Sub} from "../../../_models";
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {IndicesService} from "../../../_services/indices.service";
import {BibleService} from "../../../_services/bibleverse.service";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-scripture-modal-index',
  templateUrl: './scripture-modal-index.component.html',
  styleUrls: ['./scripture-modal-index.component.scss']
})
export class ScriptureModalIndexComponent implements OnInit {

  @Input() index:Index;

  @Input() scripture:Scripture;

  //current_Index:Index;

  selected_scripture:Scripture;

  @Input() display_only_new:boolean;

  @Output() result= new EventEmitter<Index>();
  closeResult: string;

  errorMessage:string='';

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '4rem',
    minHeight: '4rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    uploadUrl: 'v1/images', // if needed
  };
  constructor(private modalService: NgbModal,private indicesService: IndicesService,private bibleService: BibleService) {}

  open_edit(content,scripture:Scripture) {
    this.selected_scripture=scripture;
    this.modalService.open(content, {ariaLabelledBy: 'modal-edit-scripture'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  open_new(content, index:Index) {
    this.selected_scripture=new Scripture();
    this.modalService.open(content, {ariaLabelledBy: 'modal-new-scripture'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  open_delete(content,scripture:Scripture) {
    this.selected_scripture=scripture;
    this.modalService.open(content, {ariaLabelledBy: 'modal-delete-scripture'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getEntireVerse(verse:string) {
    let self=this;
    this.bibleService.getVerse(verse).pipe(first()).subscribe(kjvText => {
        this.selected_scripture.entireKJV_text=kjvText;
      },
      err => {
        console.log(err)
        self.errorMessage = "Unable to save this new Scripture."

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

  private add_scripture(scripture:Scripture) {   //create scripture
                                                 //If the sub is valid then update sub instead of index
    let self=this;
    let foundIndex=-1;

      foundIndex=self.index.scriptures.findIndex( x=> x._id==scripture._id);


    if (foundIndex!=-1) {  //Make sure scripture does not already exist
      self.errorMessage="Unable to save this scripture"
    } else {
       self.index.scriptures.push(scripture);
      this.indicesService
        .update(self.index)
        .pipe(first())
        .subscribe(index => {
            //console.log("*********TOPICS BEFORE EMIT**********" + index.main_heading);
            self.result.emit(index);
            //console.log("*********TOPICS AFTER EMIT**********" + index.main_heading);
            self.modalService.dismissAll();
          },
          err => {
            console.log(err)
            self.errorMessage = "Unable to save this new Scripture."

          });
    }
  }
  private delete_this(scripture:Scripture) {
    let self=this;
    let foundIndex=-1;

      foundIndex=self.index.scriptures.findIndex( x=> x._id==scripture._id);

    if (foundIndex==-1) {
      self.errorMessage="Unable to delete this Scripture."
    } else {
      self.index.scriptures.splice(foundIndex,1);
      //index.scriptures.splice(foundIndex,1);
      this.indicesService
        .update(self.index)
        .pipe(first())
        .subscribe(index => {
          console.log("*********TOPICS BEFORE EMIT**********" + index.main_heading);
          self.result.emit(index);
          console.log("*********TOPICS AFTER EMIT**********" + index.main_heading);
          self.modalService.dismissAll();
        });
    }
  }

  //Not a neccessary function
  private update_scripture(scripture:Scripture) {
    let self=this;
    let foundIndex=-1;

    foundIndex=self.index.scriptures.findIndex( x=> x._id==scripture._id);
    console.log(self.index)
    console.log(scripture)
    if (foundIndex==-1) {
      self.errorMessage="Unable to update this Scripture."
    } else {
       self.index.scriptures[foundIndex]=scripture;
      this.indicesService
        .update(self.index)
        .pipe(first())
        .subscribe(index => {
          self.result.emit(index);
          self.modalService.dismissAll();
        });
    }
  }

  ngOnInit() {
  }

}
