import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicCsvTable } from './dynamic-csv-table';

describe('DynamicCsvTable', () => {
  let component: DynamicCsvTable;
  let fixture: ComponentFixture<DynamicCsvTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicCsvTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicCsvTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
