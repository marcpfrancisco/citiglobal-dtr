import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectFiltersDialogComponent } from './multi-select-filters-dialog.component';

describe('CategoryFiltersDialogComponent', () => {
  let component: MultiSelectFiltersDialogComponent;
  let fixture: ComponentFixture<MultiSelectFiltersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiSelectFiltersDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectFiltersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
