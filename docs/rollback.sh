#!/bin/bash
# =============================================================================
# rollback.sh
# =============================================================================
# Purpose:
#   Manually restore the back-office to the version saved in /opt/backoffice/old
#   (the backup created by the last successful deploy.sh run).
#
# Usage from the VPS terminal:
#   bash /opt/backoffice/rollback.sh
# =============================================================================

set -e

# ─── Paths ───────────────────────────────────────────────────────────────────
APP_DIR="/opt/backoffice"
CURRENT_DIR="$APP_DIR/current"
OLD_DIR="$APP_DIR/old"
LOG_DIR="$APP_DIR/logs"
LOG_FILE="$LOG_DIR/rollback-$(date +%Y%m%d-%H%M%S).log"

# ─── Helpers ─────────────────────────────────────────────────────────────────
log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

# =============================================================================
# 0. Setup
# =============================================================================
mkdir -p "$LOG_DIR"
log "=== Manual rollback started ==="

# =============================================================================
# 1. Sanity checks
# =============================================================================
if [ ! -d "$OLD_DIR" ]; then
    log "ERROR: No backup found at $OLD_DIR. Nothing to roll back to."
    exit 1
fi

if [ ! -d "$CURRENT_DIR" ]; then
    log "WARNING: $CURRENT_DIR does not exist — skipping container shutdown."
else
    log "Stopping current container ..."
    cd "$CURRENT_DIR"
    docker compose down --remove-orphans 2>>"$LOG_FILE" || true
    log "Container stopped."
fi

# =============================================================================
# 2. Swap current for old
# =============================================================================
log "Replacing $CURRENT_DIR with backup from $OLD_DIR ..."
rm -rf "$CURRENT_DIR"
cp -r "$OLD_DIR" "$CURRENT_DIR"
log "Backup restored to $CURRENT_DIR."

# =============================================================================
# 3. Rebuild the Angular app from the restored source
# =============================================================================
log "Rebuilding Angular app from restored source ..."

export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd "$CURRENT_DIR"
npm ci --prefer-offline 2>>"$LOG_FILE"
npm run build -- --configuration production 2>>"$LOG_FILE"
log "Build complete."

# =============================================================================
# 4. Start the container from the restored image
# =============================================================================
log "Starting container from restored version ..."
cd "$CURRENT_DIR"
docker compose up --build -d 2>>"$LOG_FILE"
log "Container started."

# =============================================================================
# 5. Done
# =============================================================================
log "=== Rollback successful ==="
log "The back-office is now running the version that was in $OLD_DIR."
log "Note: $OLD_DIR still contains that same backup — it has not been cleared."
