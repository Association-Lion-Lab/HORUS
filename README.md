# HORUS

Application Windows 11 de surveillance vidéo locale construite avec Tauri 2, Rust, React et TypeScript.

## État du premier build

Implémenté et compilé :

- fenêtre native Windows `HORUS` et exécutable x64 ;
- icône de tray, menu Afficher / Paramètres / Quitter et fermeture de fenêtre convertie en masquage ;
- tableau de bord sombre responsive, ajout local à la grille et vue caméra agrandie ;
- validation des URL `rtsp://` et `rtsps://`, avec refus des identifiants intégrés ;
- CSP Tauri restrictive, aucune télémétrie et aucune dépendance cloud.

Pas encore implémenté :

- lecture RTSP/H.264, FFmpeg embarqué et reconnexion ;
- persistance SQLite et secrets Windows Credential Manager ;
- démarrage Windows, raccourci global, état de fenêtre et notifications ;
- ONVIF, Home Assistant, Scrypted et WebRTC ;
- installateur MSI/NSIS et mesures quatre flux CPU/GPU/RAM.

Le tableau de bord indique ces limites dans l’interface. Aucune vidéo fictive n’est présentée comme un flux réel.

## Télécharger HORUS

Les versions Windows sont publiées dans la section **Releases**. Pour une installation classique, télécharger le fichier `HORUS_*_x64-setup.exe`.

La version `0.1.0` est une préversion technique : elle permet d’évaluer l’interface Windows et la gestion locale des caméras, mais ne lit pas encore les flux RTSP.

L’installateur n’est pas encore signé numériquement. Windows SmartScreen peut donc demander une confirmation avant son exécution.

## Développement

Prérequis : Windows 11 x64, Node.js 24+, Rust 1.90+ MSVC, Microsoft C++ Build Tools et WebView2.

```powershell
npm install
npm test
npm run build
npm run tauri dev
```

Vérification Rust seule :

```powershell
cargo test --manifest-path src-tauri/Cargo.toml
cargo check --manifest-path src-tauri/Cargo.toml
```

Build de l’exécutable sans installateur :

```powershell
npm run tauri build -- --no-bundle
```

Résultat : `src-tauri/target/release/horus.exe`.

## Versions vérifiées le 28 octobre 2026

- Tauri 2.12.5 / CLI 2.12.4
- React 19.3.1
- TypeScript 6.0.3
- Vite 8.3.5
- Vitest 5.0.5
- Rust 1.99.1 MSVC
- WebView2 156.0.4314.50
- FFmpeg 8.1.2 présent sur la machine, pas encore distribué avec HORUS

Voir [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) pour la décision de streaming et les limites de validation.
