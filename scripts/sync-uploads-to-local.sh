#!/bin/bash

# ===========================================
# Sync Uploads from Production to Local
# ===========================================

set -e

# ---- CONFIGURATION ----
SERVER_USER="root"
SERVER_HOST="31.97.54.106"
PROD_APP_CONTAINER="e8k0oogg0kkskg448wc8c8gw-085803242797"
PROJECT_DIR="/Users/jordanbastin/Developer/PRO/marieleroy"
# ---- FIN CONFIGURATION ----

echo "🚀 Sync uploads prod -> local"

# 1. Copie les uploads du container vers /tmp sur le serveur
echo "📦 Extraction des uploads du container..."
ssh ${SERVER_USER}@${SERVER_HOST} "rm -rf /tmp/uploads_backup && docker cp ${PROD_APP_CONTAINER}:/app/uploads /tmp/uploads_backup"

# 2. Telecharge en local
echo "📥 Telechargement..."
rm -rf ${PROJECT_DIR}/uploads
scp -r ${SERVER_USER}@${SERVER_HOST}:/tmp/uploads_backup ${PROJECT_DIR}/uploads

# 3. Cleanup serveur
ssh ${SERVER_USER}@${SERVER_HOST} "rm -rf /tmp/uploads_backup"

echo ""
echo "✅ Uploads syncronises dans ${PROJECT_DIR}/uploads"
echo "   $(find ${PROJECT_DIR}/uploads -type f 2>/dev/null | wc -l) fichiers"
