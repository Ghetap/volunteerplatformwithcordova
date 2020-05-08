import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditAnnouncementPage } from './edit-announcement.page';

describe('EditAnnouncementPage', () => {
  let component: EditAnnouncementPage;
  let fixture: ComponentFixture<EditAnnouncementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAnnouncementPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditAnnouncementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
