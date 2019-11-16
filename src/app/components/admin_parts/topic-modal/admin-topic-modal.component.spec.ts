import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTopicModalComponent } from './admin-topic-modal.component';

describe('AdminTopicModalComponent', () => {
  let component: AdminTopicModalComponent;
  let fixture: ComponentFixture<AdminTopicModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTopicModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTopicModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
