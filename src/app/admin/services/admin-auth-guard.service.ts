import { Injectable } from '@angular/core';
import { AuthService } from 'shared/services/auth.service';
import { CanActivate } from '@angular/router';
import { UserService } from 'shared/services/user.service';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private auth: AuthService, private userService: UserService) {}

  canActivate(): Observable<boolean> {
    return this.auth.appUser$.map((appUser: any) => appUser.isAdmin);
  }
}
