import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AppUser } from 'shared/models/app-user';
import { UserService } from 'shared/services/user.service';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

@Injectable()
export class AuthService {
  user$: Observable<firebase.User>;

  constructor(
    private userService: UserService,
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute
  ) {
    this.user$ = afAuth.authState;
  }

  login() {
    // tslint:disable-next-line:prefer-const
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('return', returnUrl);

    this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  get appUser$(): Observable<AppUser> {
    return this.user$.switchMap(user => {
      // tslint:disable-next-line:curly
      if (user) return this.userService.get(user.uid);

      return Observable.of(null);
    });
  }
}
