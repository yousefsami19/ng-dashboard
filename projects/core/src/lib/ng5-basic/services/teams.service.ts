import { Injectable } from '@angular/core';
import { Team, INotification, IGeneralUserResponse } from '../definitions';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ConfigurationService } from './configuration.service';
import { AuthPublicService } from '../../auth/auth-public.service';
import { IResponse } from 'response-type';
import { IsSuccessEntity } from './common';
import { CookiesService } from 'ngx-universal-cookies';

/**
 * @description Manages your teams in the application
 * In your app.module, import this service. For pushing changes, use SetTeams
 */
@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  public TeamsStore: BehaviorSubject<Team[]> = new BehaviorSubject([]);
  private team = null;

  constructor(
    private config: ConfigurationService,
    private auth: AuthPublicService,
    private cookie: CookiesService
  ) {
    const team2 = this.cookie.get('team');
    if (team2) {
      this.team = +team2;
    }

    this.TeamsStore.subscribe((teams) => {
      this.config.Teams.next(teams);
    });

    this.config.SelectedTeam.subscribe((team) => {
      if (!team || !team.id) {
        return;
      }
      this.SelectTeam(team.id);

      this.TeamsStore.next(
        this.state.map(($team) => {
          return {
            ...$team,
            $selected: $team.id === team.id ? true : false,
          };
        })
      );
      this.team = team.id;
    });

    this.auth.events.subscribe((authEvent: any) => {
      if (
        (authEvent.type === 'LOGIN_SUCCESS' ||
          authEvent.type === 'SIGNUP_SUCCESS') &&
        authEvent.payload.teams
      ) {
        this.SetTeams(authEvent.payload.teams);
        const id = authEvent.payload.teams[0].id;
        this.SelectTeam(id);
      }
      if (authEvent.type === 'REVOKE') {
        this.ClearTeams();
      }
    });
  }

  public ClearTeams() {
    this.cookie.put('team', null);
    this.team = null;
  }

  public SelectTeam(teamId) {
    this.team = teamId;
    this.cookie.put('team', teamId);
  }

  public get CurrentSelectedTeam() {
    const team = this.team;
    return team;
  }

  public SetTeams(teams: Array<any>) {
    const payload = teams.map((team) => {
      return {
        ...team,
        $selected: team.id === this.CurrentSelectedTeam ? true : false,
      };
    });

    if (payload.every((t) => !t.$selected)) {
      payload[0].$selected = true;
    }
    this.TeamsStore.next(payload);
  }

  private get state() {
    return this.TeamsStore.value;
  }

  public DeleteTeam(id: number) {
    this.TeamsStore.next(this.state.filter((t) => t.id !== +id));
  }

  public RemoveMemberFromTeam(teamId: number, teamMemberId: number) {
    this.TeamsStore.next(
      this.state.map((team) => {
        if (team.id === teamId) {
          team.members = team.members.filter(
            /* tslint:disable */
            (member) => member['teamMemberId'] === teamMemberId
            /* tslint:enable */
          );
        }

        return team;
      })
    );
  }

  public InsertTeam(team: Team) {
    this.TeamsStore.next([...this.state, team]);
  }
}

export function UpdateNotificationByTempKey(
  notifications: Array<INotification> = []
) {
  let items = this.config.Notifications.value;
  items = items.map((item) => {
    const findNew = notifications.find((t) => t.$temp_key === item.id);
    if (!findNew) {
      return item;
    }
    return {
      ...item,
      ...findNew,
    };
  });
  this.config.Notifications.next(items);
}
