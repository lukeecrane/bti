import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptureModalSubComponent } from './scripture-modal-sub.component';

describe('ScriptureModalSubComponent', () => {
  let component: ScriptureModalSubComponent;
  let fixture: ComponentFixture<ScriptureModalSubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScriptureModalSubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptureModalSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
