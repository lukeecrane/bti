import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptureModalIndexComponent } from './scripture-modal-index.component';

describe('ScriptureModalIndexComponent', () => {
  let component: ScriptureModalIndexComponent;
  let fixture: ComponentFixture<ScriptureModalIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScriptureModalIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptureModalIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
