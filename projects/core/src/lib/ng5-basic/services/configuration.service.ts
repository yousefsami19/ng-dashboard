import { Injectable, Inject, EventEmitter } from '@angular/core';
import {
  NgBasicConfig,
  INavigation,
  InteractiveButton,
  Team,
  TeamsConfig,
  DockedMenu
} from '../definitions';
import { BehaviorSubject } from 'rxjs';
import { IAuthConfig } from '../../auth/definitions';
@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  public language = new BehaviorSubject('en');
  public NavbarInteractiveButtons: BehaviorSubject<
    InteractiveButton[]
  > = new BehaviorSubject([]);

  public SearchTerms: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  public NavigationItems: BehaviorSubject<
    Array<INavigation>
  > = new BehaviorSubject([]);
  public SelectedTeam: BehaviorSubject<Team> = new BehaviorSubject(null);
  public DockedMenu: BehaviorSubject<Array<DockedMenu>> = new BehaviorSubject(
    []
  );
  public TeamsConfig: BehaviorSubject<TeamsConfig> = new BehaviorSubject({});
  public Teams: BehaviorSubject<Array<Team>> = new BehaviorSubject([]);

  public translationsDictionary = {};
  public get Config(): IAuthConfig {
    return this.config.auth || {};
  }

  public SetInteractiveButtons(buttons: InteractiveButton[]) {
    this.NavbarInteractiveButtons.next(buttons);
  }

  constructor(@Inject('config') public config: NgBasicConfig) {}

  private hasChangedSinceLastRefresh(data: any, key: string) {
    let cached;
    let raw;
    try {
      raw = localStorage.getItem(`change_detect_values_${key}`);
      cached = JSON.parse(raw);
    } catch (error) {}
    localStorage.setItem(`change_detect_values_${key}`, JSON.stringify(data));

    if (!cached || JSON.stringify(data) !== raw) {
      return true;
    }
    return false;
  }

  public getNavigationItems(): INavigation[] {
    const programDefaultNaviation = this.NavigationItems.value;

    if (
      this.hasChangedSinceLastRefresh(programDefaultNaviation, 'navigation')
    ) {
      localStorage.setItem(
        `sidebar_items`,
        JSON.stringify(programDefaultNaviation)
      );
      return programDefaultNaviation;
    }

    let menu;
    try {
      menu = JSON.parse(localStorage.getItem(`sidebar_items`));
    } catch (error) {}

    if (menu) {
      return menu;
    }
    return programDefaultNaviation;
  }

  public API(affix): string {
    return (this.config.api || '') + affix;
  }
  public get Github(): boolean {
    return this.config.github;
  }
  public get Navigation(): INavigation[] {
    return this.config.navigation;
  }
}
