import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectModalIndexComponent } from './redirect-modal-index.component';

describe('RedirectModalIndexComponent', () => {
  let component: RedirectModalIndexComponent;
  let fixture: ComponentFixture<RedirectModalIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedirectModalIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedirectModalIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
