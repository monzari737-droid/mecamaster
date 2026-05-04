[app]
# Titre de l'application
title = Meca Master

# Nom du package (pas d'espaces, minuscules)
package.name = mecamaster

# Domaine du package
package.domain = com.mecamaster.app

# Version de l'application
version = 1.0.0

# Description
source.include_exts = py,png,jpg,kv,atlas,ttf,json
source.exclude_exts = spec

# Dossier source
source.dir = .

# Icônes de l'application
# (optionnel - si pas fourni, utiliser un placeholder)
# icon.filename = %(source.dir)s/icon.png
# presplash.filename = %(source.dir)s/presplash.png

# Orientation
orientation = portrait

# Permissions Android
android.permissions = INTERNET,ACCESS_NETWORK_STATE,ACCESS_FINE_LOCATION,ACCESS_COARSE_LOCATION,CALL_PHONE

# API Android
android.api = 33
android.minapi = 21
android.sdk = 33
android.ndk = 25b

# ABI - architectures supportées
android.archs = arm64-v8a, armeabi-v7a

# Mode de compilation
android.build_tools = 33.0.0

# Options
android.allow_backup = True

# Requirements (dépendances Python)
requirements = python3,kivy==2.2.1,kivymd,pillow,requests,urllib3,chardet,certifi,idna

# Services
# (optionnel)

[buildozer]
# Log level
log_level = 2

# Build directory
build_dir = ./.buildozer

# Bin directory
bin_dir = ./bin

# Commande pour compiler
# buildozer android debug
# buildozer android release
