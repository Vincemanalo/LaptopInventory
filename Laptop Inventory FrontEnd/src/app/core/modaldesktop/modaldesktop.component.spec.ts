import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDesktopComponent } from './modaldesktop.component';

describe('ModalComponent', () => {
  let component: ModalDesktopComponent;
  let fixture: ComponentFixture<ModalDesktopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDesktopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
