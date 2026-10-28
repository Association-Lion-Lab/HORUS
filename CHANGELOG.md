# Journal des versions

## Non publié

### Ajouté

- capture locale d’une image d’aperçu depuis un flux RTSP sans identifiants intégrés.

## 0.1.0 — 28 octobre 2026

Première préversion technique de HORUS.

### Ajouté

- application Windows native basée sur Tauri 2 ;
- icône de zone de notification avec affichage, paramètres et fermeture ;
- tableau de bord responsive et ajout local de caméras ;
- validation des adresses `rtsp://` et `rtsps://` ;
- politique CSP restrictive, sans télémétrie ni dépendance cloud.

### Limites connues

- aucune lecture vidéo RTSP/H.264 ;
- aucune persistance des caméras ou des identifiants ;
- aucun démarrage automatique avec Windows ;
- intégrations ONVIF, Home Assistant, Scrypted et WebRTC absentes.
- installateur Windows non signé, susceptible de déclencher un avertissement SmartScreen.
