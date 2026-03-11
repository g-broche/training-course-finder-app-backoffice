I'd like a deploy bash script that would work so that from a vps connection i could pull the newest code and update back-office that this Angular project implements. There is currently no docker-file involved but it's fine to add one if necessary.

This backoffice works in conjunction with a backend that has its own deploy implementation as this whole project is separated into two sub project. We will assume that the SSH connection has already ran these commands beforehand (comments are partially in french because they come from a local documentation, please assume i want everything generated to be in english):

1.  overall VPS setup:

    ```
    “ssh root@<vps_ip_address>”: connexion au VPS de façon sécurisée via ssh, insérer le mot de passe de connexion suite à la commande.

    “apt update && apt upgrade” : mise à jour du gestionnaire de paquets.

    “sudo apt-get install -y ca-certificates curl gnupg lsb-release” : installation des packages qui vont être nécessaire.

    “sudo mkdir -p /etc/apt/keyrings curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu jammy stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null” : Ajout clé GPG de Docker.

    “sudo apt-get install -y docker-ce docker-ce-cli containerd.io” : installation de docker via le gestionnaire de paquet APT.

    “url -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash nvm install 20 nvm use 20” : installation de node pour le back office.

    ```

2.  backend setup :

    ```
    “mkdir -p /opt/backend” : création du dossier contenant le projet backend

    “git clone <repository_url> /opt/backend/current” : clonage du repo de la branche main sur le vps.

    “cp /opt/backend/current/.env.example /opt/backend/current/.env” : copie du fichier d’environnement d’exemple en vue de créer le fichier d’environnement réel.

    “nano /opt/backend/current/.env” : ouverture en écriture du fichier d’environnement pour indiquer les valeurs réelles en production.

    “scp deploy.sh root@<vps_ip>:/opt/backend/” : copie du script de déploiement de la machine locale vers le vps.

    “chmod +x /opt/backend/deploy.sh” : donne permission d’execution au script.

    “bash /opt/backend/deploy.sh” : execution du script.
    ```

3.  backend deploy script:

    ```
    #!/bin/bash
    # =============================================================================
    # deploy.sh
    # =============================================================================
    # Purpose:
    #   Pull the latest source code from git, rebuild the Docker images via
    #   docker compose, restart the application stack, and verify it is healthy.
    #   If anything goes wrong after the previous version has been replaced, the
    #   script restores the backup automatically.
    #
    # Prerequisites (must be present on the VPS):
    #   - docker (with the compose plugin, i.e. "docker compose")
    #   - git
    #   - curl
    #   - A valid /opt/backend/current/.env file (used by docker-compose.yml at runtime)
    #
    # Expected directory layout on the VPS:
    #   /opt/backend/
    #   ├── current/      ← git repository (source code + docker-compose.yml)
    #   ├── old/          ← auto-created backup of the previous deployment
    #   ├── backups/      ← auto-created database dump directory
    #   ├── logs/         ← auto-created deployment log directory
    #   ├── deploy.sh     ← this script
    #   └── rollback.sh   ← manual rollback script
    #
    # Usage from the VPS terminal:
    #   bash /opt/backend/deploy.sh
    # =============================================================================

    set -e

    # ─── Paths ───────────────────────────────────────────────────────────────────
    APP_DIR="/opt/backend"
    CURRENT_DIR="$APP_DIR/current"
    OLD_DIR="$APP_DIR/old"
    DB_BACKUPS_DIR="$APP_DIR/backups"
    LOG_DIR="$APP_DIR/logs"
    LOG_FILE="$LOG_DIR/deploy-$(date +%Y%m%d-%H%M%S).log"

    # ─── Health-check settings ───────────────────────────────────────────────────
    HEALTH_RETRIES=5          # number of attempts
    HEALTH_INTERVAL=5          # seconds between attempts

    # ─── Helpers ─────────────────────────────────────────────────────────────────
    log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

    # Read a variable from the .env file (strips surrounding quotes if any)
    get_env_var() {
    grep -E "^${1}=" "$CURRENT_DIR/.env" 2>/dev/null \
        | head -1 \
        | cut -d'=' -f2- \
        | tr -d '"' \
        | tr -d "'"
    }

    # ─── State tracking (for rollback-on-failure) ────────────────────────────────
    BACKUP_DONE=false
    STACK_STOPPED=false

    # ─── Trap: executed on any error ─────────────────────────────────────────────
    on_error() {
    log "ERROR: Deployment failed at line $LINENO."

    if [ "$BACKUP_DONE" = true ]; then
        log "Rolling back to previous version from $OLD_DIR ..."

        # Stop the (potentially broken) new stack
        cd "$CURRENT_DIR"
        docker compose down --remove-orphans 2>>"$LOG_FILE" || true

        # Restore the backup
        rm -rf "$CURRENT_DIR"
        cp -r "$OLD_DIR" "$CURRENT_DIR"
        log "Backup restored to $CURRENT_DIR."

        # Restart with the old code — rebuild from restored source to ensure the
        # image matches the old codebase (the new build may have overwritten the tag)
        cd "$CURRENT_DIR"
        log "Rebuilding and restarting previous stack ..."
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
    mkdir -p "$DB_BACKUPS_DIR"
    log "=== Deployment started ==="

    # =============================================================================
    # 1. Prerequisite checks
    # =============================================================================
    log "Checking prerequisites ..."

    for cmd in docker git curl; do
    if ! command -v "$cmd" &>/dev/null; then
        log "ERROR: '$cmd' is not installed or not in PATH."
        exit 1
    fi
    done

    # Verify docker compose (plugin syntax)
    if ! docker compose version &>/dev/null; then
    log "ERROR: 'docker compose' plugin is not available."
    exit 1
    fi

    if [ ! -d "$CURRENT_DIR" ]; then
    log "ERROR: $CURRENT_DIR does not exist. Clone the repository there first."
    exit 1
    fi

    if [ ! -f "$CURRENT_DIR/.env" ]; then
    log "ERROR: $CURRENT_DIR/.env is missing. Create it before deploying."
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
    # 3. Backup the database through pg_dump inside the live db container
    # =============================================================================
    DB_NAME=$(get_env_var "DB_NAME")
    DB_USER=$(get_env_var "DB_USER")
    DB_DUMP_FILE="$DB_BACKUPS_DIR/backup_${DB_NAME}_$(date +%Y%m%d-%H%M%S).sql"

    log "Backing up database '$DB_NAME' to $DB_DUMP_FILE ..."
    docker exec retriever-db pg_dump -U "$DB_USER" "$DB_NAME" > "$DB_DUMP_FILE"
    log "Database backup done."

    # =============================================================================
    # 4. Pull latest source code
    # =============================================================================
    log "Pulling latest code ..."
    cd "$CURRENT_DIR"
    git pull 2>>"$LOG_FILE"
    log "Git pull complete. Current commit: $(git rev-parse --short HEAD)"

    # =============================================================================
    # 5. Stop the current stack
    # =============================================================================
    log "Stopping current stack ..."
    cd "$CURRENT_DIR"
    docker compose down --remove-orphans 2>>"$LOG_FILE"
    STACK_STOPPED=true
    log "Stack stopped."

    # =============================================================================
    # 6. Rebuild images and start the new stack
    # =============================================================================
    log "Building images and starting new stack ..."
    cd "$CURRENT_DIR"
    docker compose up --build -d 2>>"$LOG_FILE"
    log "Stack started."

    # =============================================================================
    # 7. Health check
    # =============================================================================
    API_PORT=$(get_env_var "API_PORT")
    if [ -z "$API_PORT" ]; then
    log "WARNING: API_PORT not found in .env — defaulting to 8080."
    API_PORT=8080
    fi
    HEALTH_URL="http://localhost:${API_PORT}/api/health"

    log "Waiting for application to become healthy at $HEALTH_URL ..."

    for i in $(seq 1 "$HEALTH_RETRIES"); do
    log "Health check attempt $i/$HEALTH_RETRIES ..."
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" || echo "000")

    if [ "$HTTP_STATUS" = "200" ]; then
        log "Application is healthy (HTTP $HTTP_STATUS)."
        break
    fi

    if [ "$i" -eq "$HEALTH_RETRIES" ]; then
        log "ERROR: Application did not become healthy after $HEALTH_RETRIES attempts (last status: HTTP $HTTP_STATUS)."
        # The trap will handle the rollback
        exit 1
    fi

    log "Not ready yet (HTTP $HTTP_STATUS). Retrying in ${HEALTH_INTERVAL}s ..."
    sleep "$HEALTH_INTERVAL"
    done

    # =============================================================================
    # 8. Done
    # =============================================================================
    log "=== Deployment successful ==="
    log "Previous version is preserved in $OLD_DIR."
    log "Database backup saved to $DB_DUMP_FILE."
    ```

The backend project is in its own /opt/backend directory, the back office will be in /opt/backoffice
