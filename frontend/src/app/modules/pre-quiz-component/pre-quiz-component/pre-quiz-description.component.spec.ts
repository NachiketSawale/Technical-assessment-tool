import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreQuizDescriptionComponent } from './pre-quiz-description.component';

describe('PreQuizComponent', () => {
  let component: PreQuizDescriptionComponent;
  let fixture: ComponentFixture<PreQuizDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreQuizDescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreQuizDescriptionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
