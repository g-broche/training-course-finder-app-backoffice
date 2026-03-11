# Back-office — Deployment Guide

This document describes how to deploy the Angular back-office to a VPS.
It assumes the overall VPS setup and the backend deployment described in `deploy-implementation.md` have already been completed.

---

## Overview

The back-office is an Angular application compiled into static files and served by **nginx inside a Docker container**.

```
/opt/backoffice/
├── current/      ← git repository (source + Dockerfile + docker-compose.yml)
├── old/          ← automatic backup of the previous deployment
├── logs/         ← per-deployment log files
└── deploy.sh     ← deployment script (copied from the repo root)
```

The container exposes nginx on port **80** and the host binds it to port **4200**
(`docker-compose.yml` → `"4200:80"`).  Change this mapping if you need a
different host port (e.g. behind a reverse proxy on port 80/443).

---

## Files added to the repository

| File | Purpose |
|---|---|
| `Dockerfile` | Multi-stage build: Node 20 compiles the app, nginx 1.27 serves it |
| `nginx.conf` | SPA routing (`try_files … /index.html`) + asset caching rules |
| `docker-compose.yml` | Single-service compose file for the back-office container |
| `.dockerignore` | Keeps `node_modules/`, `dist/`, `.angular/` etc. out of the image |
| `deploy.sh` | Automated pull → build → restart → health-check → rollback script |

---

## First-time setup on the VPS

These steps only need to be run once, after the overall VPS setup is done.

```bash
# 1. Create the application directory
mkdir -p /opt/backoffice

# 2. Clone the repository
git clone <backoffice_repository_url> /opt/backoffice/current

# 3. Copy the deploy script to the application root
cp /opt/backoffice/current/deploy.sh /opt/backoffice/deploy.sh

# 4. Make the script executable
chmod +x /opt/backoffice/deploy.sh

# 5. Run the first deployment
bash /opt/backoffice/deploy.sh
```

If you prefer to copy the deploy script from your local machine instead of
copying it from the cloned repo on the VPS:

```bash
# From your local machine
scp deploy.sh root@<vps_ip>:/opt/backoffice/deploy.sh
ssh root@<vps_ip> "chmod +x /opt/backoffice/deploy.sh"
```

---

## Deploying an update

Once the first-time setup is done, every subsequent deployment is a single
command from the VPS:

```bash
bash /opt/backoffice/deploy.sh
```

What the script does, step by step:

1. **Prerequisite checks** — verifies `docker`, `git`, and `curl` are available.
2. **Backup** — copies `/opt/backoffice/current` to `/opt/backoffice/old`.
3. **Git pull** — fetches and merges the latest commits from the remote.
4. **Stop** — brings the running container down with `docker compose down`.
5. **Build & start** — rebuilds the Docker image and starts the new container.
6. **Health check** — polls `http://localhost:4200` up to 10 times (5 s apart).
   If the app never responds the script triggers an automatic rollback.
7. **Cleanup** — prunes dangling Docker images to reclaim disk space.

On **success** the previous version remains in `/opt/backoffice/old` and a
timestamped log is written to `/opt/backoffice/logs/`.

On **failure** the script automatically stops the broken container, restores
the backup, and rebuilds the previous image.

---

## Manual rollback

If you need to roll back outside of a failed deployment:

```bash
# Stop the current container
cd /opt/backoffice/current
docker compose down --remove-orphans

# Restore the previous version
rm -rf /opt/backoffice/current
cp -r /opt/backoffice/old /opt/backoffice/current

# Restart from the restored source
cd /opt/backoffice/current
docker compose up --build -d
```

---

## Configuration

### Changing the host port

Edit `docker-compose.yml` in the repository:

```yaml
ports:
  - "80:80"   # expose on port 80 instead of 4200
```

Then re-deploy for the change to take effect.

### Reverse proxy (nginx / Caddy / Traefik)

If a reverse proxy already handles TLS on the VPS, point it to
`http://localhost:4200` (or whichever host port you chose) and let the
container remain on the internal network.

Example nginx reverse-proxy snippet:

```nginx
server {
    listen 443 ssl;
    server_name backoffice.yourdomain.com;

    # ... TLS config ...

    location / {
        proxy_pass http://localhost:4200;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Viewing logs

```bash
# Latest deployment log
ls -t /opt/backoffice/logs/ | head -1 | xargs -I{} cat /opt/backoffice/logs/{}

# Live container logs
docker logs -f backoffice
```
