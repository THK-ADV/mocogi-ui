export const environment = {
  production: false,
  backendUrl: 'https://module.gm.th-koeln.de/api',
  // backendUrl: 'http://localhost:3000',
  keycloak: {
    url: 'https://auth.gm.fh-koeln.de:8444/auth',
    realm: 'schedule',
    clientId: 'frontend-dev',
  },
}
