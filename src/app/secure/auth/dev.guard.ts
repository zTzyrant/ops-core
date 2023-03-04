import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CurdApiService } from '../curd.api.service';
import { DevService } from './dev.service';

@Injectable({
  providedIn: 'root'
})
export class DevGuard implements CanActivate {
  constructor(
    private curdService: CurdApiService,
    private devServices: DevService,
    private router: Router
  ){  }
  retValue = false
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if(localStorage.getItem('__$DEV__TOKEN__'))
      return true
    else
      return this.router.navigate(['/developer/login'])
  }
}
