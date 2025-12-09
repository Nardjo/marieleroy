#!/bin/bash

# ===========================================
# Sync Production to Local
# ===========================================
# A executer depuis ton Mac

set -e

# ---- CONFIGURATION ----
SERVER_USER="root"
SERVER_HOST="srv1067933"  # ou l'IP de ton serveur
PROD_DB_CONTAINER="mssg4osgswgswcsgwos0w48k"
PROD_APP_CONTAINER="e8k0oogg0kkskg448wc8c8gw-085803242797"

# Local PostgreSQL (adapte selon ton .env)
LOCAL_DB_HOST="localhost"
LOCAL_DB_PORT="5432"
LOCAL_DB_USER="postgres"
LOCAL_DB_NAME="postgres"
LOCAL_DB_PASSWORD=""  # Laisse vide si pas de password

# Dossier local du projet
PROJECT_DIR="/Users/jordanbastin/Developer/PRO/marieleroy"
# ---- FIN CONFIGURATION ----

echo "🚀 Sync prod -> local"

# 1. Dump la DB prod sur le serveur
echo "📦 Dump DB prod sur le serveur..."
ssh ${SERVER_USER}@${SERVER_HOST} "docker exec ${PROD_DB_CONTAINER} pg_dump -U postgres postgres" > /tmp/prod_db.sql
echo "✅ DB dump telecharge ($(wc -l < /tmp/prod_db.sql) lignes)"

# 2. Telecharge les uploads
echo "📦 Telechargement des uploads..."
ssh ${SERVER_USER}@${SERVER_HOST} "docker cp ${PROD_APP_CONTAINER}:/app/uploads /tmp/uploads_backup" 2>/dev/null || true
scp -r ${SERVER_USER}@${SERVER_HOST}:/tmp/uploads_backup ${PROJECT_DIR}/uploads 2>/dev/null || echo "⚠️ Pas d'uploads"
ssh ${SERVER_USER}@${SERVER_HOST} "rm -rf /tmp/uploads_backup" 2>/dev/null || true

# 3. Restore DB locale
echo "🔄 Restore DB locale..."
if [ -n "$LOCAL_DB_PASSWORD" ]; then
    export PGPASSWORD=$LOCAL_DB_PASSWORD
fi

psql -h $LOCAL_DB_HOST -p $LOCAL_DB_PORT -U $LOCAL_DB_USER -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" $LOCAL_DB_NAME
psql -h $LOCAL_DB_HOST -p $LOCAL_DB_PORT -U $LOCAL_DB_USER $LOCAL_DB_NAME < /tmp/prod_db.sql

# 4. Cleanup
rm -f /tmp/prod_db.sql

echo ""
echo "✨ Sync termine!"
echo "   - DB locale mise a jour"
echo "   - Uploads copies dans ${PROJECT_DIR}/uploads"
