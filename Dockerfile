# Production image: builds the SPA and serves it with nginx (non-root) and strict security headers.
# The API (/api/v1) and the identity provider are served by the reverse proxy in front of this container.
FROM node:22.23-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npx ng build --configuration production
# Allow exactly the inline scripts of this build (the theme bootstrap) in the CSP.
RUN node -e " \
      const fs = require('fs'), crypto = require('crypto'); \
      const html = fs.readFileSync('dist/artemisappsec/browser/index.html', 'utf8'); \
      const hashes = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)] \
        .map((m) => \"'sha256-\" + crypto.createHash('sha256').update(m[1]).digest('base64') + \"'\"); \
      const conf = fs.readFileSync('nginx/security-headers.conf', 'utf8').replaceAll('__SCRIPT_HASHES__', hashes.join(' ')); \
      fs.writeFileSync('security-headers.conf', conf);"

FROM nginxinc/nginx-unprivileged:1.30-alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/security-headers.conf /etc/nginx/artemis/security-headers.conf
COPY --from=build /app/dist/artemisappsec/browser /usr/share/nginx/html
EXPOSE 8080
