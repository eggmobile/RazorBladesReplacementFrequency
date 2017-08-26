import { Component } from '@angular/core';

import { HistoryPage } from '../history/history';
import { HomePage } from '../home/home';
import { SettingsPage } from '../settings/settings';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = HistoryPage;
  tab3Root = SettingsPage;
  tabTitleHome = 'Home';
  tabTitleHistory = 'History';
  tabTitleSettings = 'Settings';

  constructor(public translate: TranslateService) {
    translate.get("HOME").subscribe((res: string) => {
      this.tabTitleHome = res;
    });
    translate.get("HISTORY").subscribe((res: string) => {
      this.tabTitleHistory = res;
    });
    translate.get("SETTINGS").subscribe((res: string) => {
      this.tabTitleSettings = res;
    });
  }
}
