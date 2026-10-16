export const environment = {
  apiUrl: 'http://localhost:8080/api/v1',
  auth: {
    authority: 'https://auth.artemisappsec.localhost:9443/realms/artemisappsec',
    clientId: 'artemisappsec-web',
    scope: 'openid profile email',
    // Local Keycloak (behind Caddy) uses a self-signed certificate the browser must accept once.
    localCertificate: true,
  },
};
