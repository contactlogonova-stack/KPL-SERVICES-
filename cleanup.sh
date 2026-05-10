#!/bin/bash
# Nettoyage code mort KPL Services

# admin/src/pages/ (pages publiques inutiles dans l'admin)
rm -rf admin/src/pages/

# admin/src/components inutiles
rm -f admin/src/components/layout/Footer.tsx
rm -f admin/src/components/layout/Navbar.tsx
rm -f admin/src/components/layout/index.ts
rmdir admin/src/components/layout/ 2>/dev/null
rm -f admin/src/components/sections/index.ts
rmdir admin/src/components/sections/ 2>/dev/null
rm -f admin/src/components/ui/WhatsAppButton.tsx

# src/ racine (monolithe obsolète)
rm -rf src/

# Scripts de migration obsolètes
rm -f check.mjs cleanup.mjs fix-imports.mjs restructure.mjs restructure2.mjs restructure3.mjs

echo "Nettoyage terminé ✅"
