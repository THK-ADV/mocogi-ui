import { KeycloakService } from 'keycloak-angular'
import { environment } from '../../environments/environment'

export function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: environment.keycloak,
      initOptions: {
        enableLogging: true,
        checkLoginIframe: false,
        // onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html'
      }
    })
}
