import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsLivreModalComponent } from './details-livre-modal.component';

describe('DetailsLivreModalComponent', () => {
  let component: DetailsLivreModalComponent;
  let fixture: ComponentFixture<DetailsLivreModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsLivreModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsLivreModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
