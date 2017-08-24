import { Component } from '@angular/core';

import { HistoryPage } from '../history/history';
import { HomePage } from '../home/home';
import { SettingsPage } from '../settings/settings';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = HistoryPage;
  tab3Root = SettingsPage;

  constructor() {

  }
}
