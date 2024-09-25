import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Route,
  Router,
  RouterStateSnapshot,
} from '@angular/router'
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular'
import { NonEmptyArray } from '../types/non-empty-array'

export type RoleCheckingCondition = 'any' | 'all'

export type AuthRole = 'employee' | 'professor' | 'student'

export function requireRoles(
  roles: NonEmptyArray<AuthRole>,
  condition: RoleCheckingCondition,
): Route {
  return { canActivate: [AuthGuard], data: { roles, condition } }
}

export function requireAuthenticationOnly(): Route {
  return { canActivate: [AuthGuard] }
}

@Injectable({
  providedIn: 'root',
})
class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService,
  ) {
    super(router, keycloak)
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) {
    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin + state.url,
      })
    }

    const requiredRoles: AuthRole[] = route.data['roles']
    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
      return true
    }

    const condition: RoleCheckingCondition = route.data['condition']
    return this.checkRoles(requiredRoles, condition)
  }

  private checkRoles = (
    roles: AuthRole[],
    condition: RoleCheckingCondition,
  ): boolean => {
    switch (condition) {
      case 'any':
        return roles.some((role) => this.roles.includes(role))
      case 'all':
        return roles.every((role) => this.roles.includes(role))
    }
  }
}
