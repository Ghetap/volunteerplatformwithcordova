import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AnnouncementDetailPage } from './announcement-detail.page';

describe('AnnouncementDetailPage', () => {
  let component: AnnouncementDetailPage;
  let fixture: ComponentFixture<AnnouncementDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnouncementDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AnnouncementDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
