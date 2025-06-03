import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Modalinfo_desktopComponent } from './modalinfo-desktop.component';

describe('ModalinfoComponent', () => {
  let component: Modalinfo_desktopComponent;
  let fixture: ComponentFixture<Modalinfo_desktopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Modalinfo_desktopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Modalinfo_desktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
