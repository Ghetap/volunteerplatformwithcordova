import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyannouncementPage } from './myannouncement.page';

describe('MyannouncementPage', () => {
  let component: MyannouncementPage;
  let fixture: ComponentFixture<MyannouncementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyannouncementPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyannouncementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
