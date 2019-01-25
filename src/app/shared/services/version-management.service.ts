import { Injectable } from '@angular/core';

import { AppSettings } from '../app.settings';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '$env';
import { ModalsService } from '$modals';

interface VersionApi {
  assembly: string;
  db: string;
  host: string;
  machine: string;
  port: number;
  release: string;
  runtime: string;
  version: string;
}

@Injectable({
  providedIn: 'root',
})
export class VersionManagementService {
  /** Notify subscribers of update available */
  public hasUpdate$ = new BehaviorSubject<boolean>(false);
  /** Update at this frequency */
  private pollInterval = 5 * 60 * 1000; // 5 minutes

  constructor(private settings: AppSettings, private http: HttpClient, private modals: ModalsService) {}

  /**
   * Start version checking
   */
  public versionCheckStart() {
    this.versionCheck(
      this.http.get<VersionApi>(environment.endpoints.apiUrl + environment.endpoints.version),
      this.settings,
    );
  }

  /**
   * Recusive method to poll for version changes
   * If found, updates settings and notifies subscribers of update available which promps to refresh app
   * @param appVersionLocations
   */
  private versionCheck(versionHttp: Observable<VersionApi>, settings: AppSettings, pollInterval = this.pollInterval) {
    const sub = versionHttp.subscribe(
      res => {
        const version = res.version;

        let hasUpdate = false;
        // If app version has not been set
        if (!settings.version) {
          settings.version = version;
        } else if (settings.version !== version) {
          // New version found, update version in settings and set hasupdate flag
          settings.version = version;
          hasUpdate = true;
        }

        // If no update is found, poll
        if (!hasUpdate) {
          setTimeout(() => {
            this.versionCheck(versionHttp, settings);
          }, pollInterval);
        } else {
          // If update found, stop polling and update behavior subject
          this.hasUpdate$.next(true);
          // Pop modal to ask user to refresh app
          this.modalOpen();
        }
        sub.unsubscribe();
      },
      // On error, resume polling anyway
      () => {
        setTimeout(() => {
          this.versionCheck(versionHttp, settings);
        }, pollInterval);
      },
    );
  }

  /**
   * Open a confirmation modal asking the user to reload the app
   */
  public modalOpen() {
    this.modals
      .open(
        'ConfirmationModalComponent',
        false,
        'sm',
        'A new version of this application has just been released, would you like to refresh?',
      )
      .afterClosed()
      .subscribe(closed => {
        if (closed) {
          // Reset ui state to clear out any breaking changes
          this.settings.ui = null;
          // Reload page
          location.reload();
        }
      });
  }
}
