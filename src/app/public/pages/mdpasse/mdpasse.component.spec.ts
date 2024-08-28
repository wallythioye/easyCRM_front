/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MdpasseComponent } from './mdpasse.component';

describe('MdpasseComponent', () => {
  let component: MdpasseComponent;
  let fixture: ComponentFixture<MdpasseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MdpasseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MdpasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
