import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSummary } from './edit-summary';

describe('EditSummary', () => {
  let component: EditSummary;
  let fixture: ComponentFixture<EditSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
