export const environment = {
  apiUrl: 'http://localhost:8080/api/v1',
  auth: {
    authority: 'https://auth.artemis.localhost:9443',
    clientId: 'artemis-web',
    scope: 'openid profile email groups',
    // Local Authelia uses a self-signed certificate the browser must accept once.
    localCertificate: true,
  },
};
