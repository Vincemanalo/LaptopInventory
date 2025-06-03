import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalinfoServerComponent } from './modalinfo-server.component';

describe('ModalinfoServerComponent', () => {
  let component: ModalinfoServerComponent;
  let fixture: ComponentFixture<ModalinfoServerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalinfoServerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalinfoServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
