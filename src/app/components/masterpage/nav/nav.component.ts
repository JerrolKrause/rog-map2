import { Component } from '@angular/core';
import { AuthService, AppSettings, VersionManagementService } from '$shared';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ModalsService } from '$modals';

const startCase = require('lodash/startCase');
const toLower = require('lodash/toLower');

@Component({
  selector: 'app-nav',
  styleUrls: ['./nav.component.scss'],
  templateUrl: './nav.component.html',
})
export class NavComponent {
  /** Is the dropdown menu open on mobile */
  public isOpen = false;
  /** Turn the username into title case */
  public userName = startCase(toLower(this.settings.userName));
  /**   Does the app have an update */
  public hasUpdate$ = this.vm.hasUpdate$;
  /** App version */
  public version = this.settings.version;

  constructor(
    private auth: AuthService,
    private settings: AppSettings,
    public modals: ModalsService,
    private vm: VersionManagementService,
    private router: Router,
  ) {
    // On route change, if mobile nav is open close it
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      if (this.isOpen) {
        this.isOpen = false;
      }
    });
  }

  public updateApp() {
    this.vm.modalOpen();
  }

  public logOut() {
    this.auth.logOut(true);
  }
}
