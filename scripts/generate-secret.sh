#!/bin/bash

# Script pour générer un secret sécurisé pour NUXT_SESSION_PASSWORD

echo "==================================="
echo "Générateur de secret pour Coolify"
echo "==================================="
echo ""
echo "Votre NUXT_SESSION_PASSWORD:"
echo ""

# Générer un secret de 32 bytes encodé en base64
openssl rand -base64 32

echo ""
echo "Copiez ce secret dans vos variables d'environnement Coolify"
echo "Variable: NUXT_SESSION_PASSWORD"
echo ""
