import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewAnnouncementPage } from './new-announcement.page';

describe('NewAnnouncementPage', () => {
  let component: NewAnnouncementPage;
  let fixture: ComponentFixture<NewAnnouncementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAnnouncementPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewAnnouncementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
