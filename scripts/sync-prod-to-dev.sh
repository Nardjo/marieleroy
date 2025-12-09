#!/bin/bash

# ===========================================
# Sync Production to Development - Coolify
# ===========================================
# Ce script copie la DB et les uploads de prod vers dev
# A executer sur le serveur Coolify

set -e

# ---- CONFIGURATION ----
PROD_APP_CONTAINER="e8k0oogg0kkskg448wc8c8gw-085803242797"
PROD_DB_CONTAINER="mssg4osgswgswcsgwos0w48k"
DEV_APP_CONTAINER="jsog4kosg8gkcco0cgc80ssc-101932372702"
DEV_DB_CONTAINER="bwkk0c0k8ko8cwcgogws0cos"

# Credentials PostgreSQL (adapte si different)
DB_USER="postgres"
DB_NAME="postgres"

# Dossier temporaire pour les backups
BACKUP_DIR="/tmp/marieleroy-sync"
# ---- FIN CONFIGURATION ----

echo "🚀 Debut de la synchronisation prod -> dev"

# Creer le dossier de backup
mkdir -p $BACKUP_DIR

# ---- 1. BACKUP DATABASE ----
echo "📦 Backup de la base de donnees prod..."
docker exec $PROD_DB_CONTAINER pg_dump -U $DB_USER $DB_NAME > $BACKUP_DIR/db_backup.sql
echo "✅ Database backup OK ($(wc -l < $BACKUP_DIR/db_backup.sql) lignes)"

# ---- 2. BACKUP UPLOADS ----
echo "📦 Backup des uploads prod..."
docker cp $PROD_APP_CONTAINER:/app/uploads $BACKUP_DIR/uploads 2>/dev/null || echo "⚠️  Pas de dossier uploads trouve"
if [ -d "$BACKUP_DIR/uploads" ]; then
    echo "✅ Uploads backup OK ($(find $BACKUP_DIR/uploads -type f | wc -l) fichiers)"
fi

# ---- 3. RESTORE DATABASE ----
echo "🔄 Restoration de la base de donnees sur dev..."
# Drop et recreate pour avoir une copie propre
docker exec $DEV_DB_CONTAINER psql -U $DB_USER -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" $DB_NAME
docker exec -i $DEV_DB_CONTAINER psql -U $DB_USER $DB_NAME < $BACKUP_DIR/db_backup.sql
echo "✅ Database restore OK"

# ---- 4. RESTORE UPLOADS ----
if [ -d "$BACKUP_DIR/uploads" ]; then
    echo "🔄 Restoration des uploads sur dev..."
    docker cp $BACKUP_DIR/uploads $DEV_APP_CONTAINER:/app/
    echo "✅ Uploads restore OK"
fi

# ---- 5. CLEANUP ----
echo "🧹 Nettoyage des fichiers temporaires..."
rm -rf $BACKUP_DIR

echo ""
echo "✨ Synchronisation terminee avec succes!"
echo "   - Database: copiee"
echo "   - Uploads: copies"
echo ""
echo "⚠️  N'oublie pas de redemarrer le container dev si necessaire:"
echo "   docker restart $DEV_APP_CONTAINER"
