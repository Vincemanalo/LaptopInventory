import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalserverComponent } from './modalserver.component';

describe('ModalserverComponent', () => {
  let component: ModalserverComponent;
  let fixture: ComponentFixture<ModalserverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalserverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalserverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
