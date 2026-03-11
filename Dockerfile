# =============================================================================
# Dockerfile
# =============================================================================
# Prerequisites: the Angular app must be built before running docker build.
#   npm ci && npm run build -- --configuration production
#
# This image simply packages the compiled output into a minimal nginx container.
# The Angular app is built on the VPS (Node 20 is available from the VPS setup).
# =============================================================================

FROM nginx:alpine

# Remove the default nginx config and install the custom one
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/backoffice.conf

# Copy compiled Angular output (dist/backoffice/browser for Angular 17+)
COPY dist/backoffice/browser/ /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
