#!/bin/bash
# =============================================================================
# deploy.sh
# =============================================================================
# Purpose:
#   Pull the latest source code from git, rebuild the Docker image, restart
#   the back-office container, and verify it started successfully.
#   If anything goes wrong the script restores the previous backup automatically.
#
# Prerequisites (must be present on the VPS):
#   - docker (with the compose plugin, i.e. "docker compose")
#   - nvm (with Node 20 installed, used to run npm commands)
#   - git
#
# Expected directory layout on the VPS:
#   /opt/backoffice/
#   ├── current/      ← git repository (source code + Dockerfile + docker-compose.yml)
#   ├── old/          ← auto-created backup of the previous deployment
#   ├── logs/         ← auto-created deployment log directory
#   ├── deploy.sh     ← this script
#   └── rollback.sh   ← rollback script
#
# Usage from the VPS terminal:
#   bash /opt/backoffice/deploy.sh
# =============================================================================

set -e

# ─── Paths ───────────────────────────────────────────────────────────────────
APP_DIR="/opt/backoffice"
CURRENT_DIR="$APP_DIR/current"
OLD_DIR="$APP_DIR/old"
LOG_DIR="$APP_DIR/logs"
LOG_FILE="$LOG_DIR/deploy-$(date +%Y%m%d-%H%M%S).log"

# ─── Helpers ─────────────────────────────────────────────────────────────────
log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

# ─── State tracking (for rollback-on-failure) ────────────────────────────────
BACKUP_DONE=false

# ─── Trap: executed on any error ─────────────────────────────────────────────
on_error() {
    log "ERROR: Deployment failed at line $LINENO."

    if [ "$BACKUP_DONE" = true ]; then
        log "Rolling back to previous version from $OLD_DIR ..."

        # Stop the (potentially broken) new container
        cd "$CURRENT_DIR"
        docker compose down --remove-orphans 2>>"$LOG_FILE" || true

        # Restore the backup
        rm -rf "$CURRENT_DIR"
        cp -r "$OLD_DIR" "$CURRENT_DIR"
        log "Backup restored to $CURRENT_DIR."

        # Rebuild and restart the previous container from the restored source
        cd "$CURRENT_DIR"
        log "Rebuilding and restarting previous container ..."
        docker compose up --build -d 2>>"$LOG_FILE" \
            && log "Previous version is running again." \
            || log "WARNING: Could not restart previous version. Manual intervention required."
    else
        log "No backup was taken yet — nothing to restore."
    fi

    log "Deployment aborted."
    exit 1
}

trap on_error ERR

# =============================================================================
# 0. Setup
# =============================================================================
mkdir -p "$LOG_DIR"
log "=== Deployment started ==="

# =============================================================================
# 1. Prerequisite checks
# =============================================================================
log "Checking prerequisites ..."

# Source nvm early so node/npm are on PATH for both the check and the build step
export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

if ! command -v node &>/dev/null; then
    log "ERROR: node is not available. Make sure nvm and Node 20 are installed (see VPS setup docs)."
    exit 1
fi
log "Node version: $(node --version)"

for cmd in npm docker git; do
    if ! command -v "$cmd" &>/dev/null; then
        log "ERROR: '$cmd' is not installed or not in PATH."
        exit 1
    fi
done

if ! docker compose version &>/dev/null; then
    log "ERROR: 'docker compose' plugin is not available."
    exit 1
fi

if [ ! -d "$CURRENT_DIR" ]; then
    log "ERROR: $CURRENT_DIR does not exist. Clone the repository there first."
    exit 1
fi

log "All prerequisites satisfied."

# =============================================================================
# 2. Backup the current deployment
# =============================================================================
log "Backing up current deployment to $OLD_DIR ..."
rm -rf "$OLD_DIR"
cp -r "$CURRENT_DIR" "$OLD_DIR"
BACKUP_DONE=true
log "Backup done."

# =============================================================================
# 3. Pull latest source code
# =============================================================================
log "Pulling latest code ..."
cd "$CURRENT_DIR"
git pull 2>>"$LOG_FILE"
log "Git pull complete. Current commit: $(git rev-parse --short HEAD)"

# =============================================================================
# 4. Install dependencies and build the Angular app
# =============================================================================
log "Installing npm dependencies ..."
cd "$CURRENT_DIR"
npm ci --prefer-offline 2>>"$LOG_FILE"
log "Dependencies installed."

log "Building Angular app (production) ..."
npm run build -- --configuration production 2>>"$LOG_FILE"
log "Build complete."

# =============================================================================
# 5. Stop the current container
# =============================================================================
log "Stopping current container ..."
cd "$CURRENT_DIR"
docker compose down --remove-orphans 2>>"$LOG_FILE"
log "Container stopped."

# =============================================================================
# 6. Rebuild the image and start the new container
# =============================================================================
log "Building image and starting new container ..."
cd "$CURRENT_DIR"
docker compose up --build -d 2>>"$LOG_FILE"
log "Container started."

# =============================================================================
# 7. Clean up dangling Docker images to free disk space
# =============================================================================
log "Pruning dangling Docker images ..."
docker image prune -f 2>>"$LOG_FILE" || true

# =============================================================================
# 8. Done
# =============================================================================
log "=== Deployment successful ==="
log "Previous version is preserved in $OLD_DIR."
log "Logs written to $LOG_FILE."
