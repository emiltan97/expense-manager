import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAccountPage } from './manage-account.page';

describe('ManageAccountPage', () => {
  let component: ManageAccountPage;
  let fixture: ComponentFixture<ManageAccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAccountPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
