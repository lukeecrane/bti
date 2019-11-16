import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptureListComponent } from './scripture-list.component';

describe('ScriptureListComponent', () => {
  let component: ScriptureListComponent;
  let fixture: ComponentFixture<ScriptureListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScriptureListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
