import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectModalSubComponent } from './redirect-modal-sub.component';

describe('RedirectModalSubComponent', () => {
  let component: RedirectModalSubComponent;
  let fixture: ComponentFixture<RedirectModalSubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedirectModalSubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedirectModalSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
