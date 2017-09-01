import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { TranslateService } from '@ngx-translate/core';
// ローカル通知
import { LocalNotifications } from '@ionic-native/local-notifications';
// カスタムサービス
import { RazorBladesLocalStorageService } from '../services/razor-blades-local-storage-service';
import { RazorBladesLocalNotificationService } from '../services/razor-blades-local-notification-service';
// FirebaseAnalytics
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';


@Component({
  templateUrl: 'app.html',
  providers: [RazorBladesLocalStorageService, RazorBladesLocalNotificationService]
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private translate: TranslateService,
    private localNotifications: LocalNotifications,
    private razorBladesLocalNotificationService: RazorBladesLocalNotificationService) {
    console.log("getBrowserCultureLang=" + translate.getBrowserCultureLang()); // en-US
    console.log("getBrowserLang=" + translate.getBrowserLang());

    translate.setDefaultLang("en");
    translate.use(translate.getBrowserLang());
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      // 通知のコールバック
      this.localNotifications.on('click', (notification, state) => {
        // 通知を更新する
        this.razorBladesLocalNotificationService.calculateNextNotificationDateAndTime().then((nextNotificationDateAndTime) => {
          // 通知をセットし直す
          this.razorBladesLocalNotificationService.setScheduledNotification(nextNotificationDateAndTime);
        });
      })
    });
  }
}
