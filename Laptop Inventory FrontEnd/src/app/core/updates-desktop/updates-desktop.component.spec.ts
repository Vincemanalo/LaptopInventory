import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatesDesktopComponent } from './updates-desktop.component';

describe('UpdatesDesktopComponent', () => {
  let component: UpdatesDesktopComponent;
  let fixture: ComponentFixture<UpdatesDesktopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatesDesktopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatesDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
