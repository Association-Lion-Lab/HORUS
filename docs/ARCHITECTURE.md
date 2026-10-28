# Architecture HORUS

## Décision MVP

Le frontend React reste un client non privilégié dans WebView2. Le cœur Rust contrôle le cycle de vie Windows, le tray, le stockage et les processus vidéo. Les interfaces entre les deux passent uniquement par des commandes Tauri typées et des capacités explicitement autorisées.

Le moteur retenu pour le prochain incrément est FFmpeg :

1. entrée RTSP en TCP avec délais et reconnexion contrôlés par Rust ;
2. copie H.264 vers HLS fragmenté lorsque le codec le permet, transcodage matériel seulement si mesuré nécessaire ;
3. serveur éphémère lié à `127.0.0.1` sur un port aléatoire ;
4. lecture intégrée via Media Source/HLS dans WebView2 ;
5. arrêt du processus FFmpeg dès que la fenêtre ou la caméra n’est plus visible.

Cette voie exploite FFmpeg 8.1.2 déjà installé et évite GStreamer, absent de la machine. Elle doit encore être validée avec un vrai flux RTSP H.264 ; le build actuel ne contient pas ce moteur.

## Modules prévus

- `app`, `tray`, `windows` : cycle de vie Windows et ressources ;
- `cameras`, `storage`, `security` : catalogue SQLite et secrets Credential Manager ;
- `streaming`, `providers/rtsp` : sessions FFmpeg et lecteur local ;
- `providers/onvif`, `providers/scrypted`, `providers/homeassistant`, `providers/webrtc` : connecteurs indépendants ;
- `events`, `notifications` : événements normalisés et alertes Windows.

## Frontières de sécurité

- les URL sont validées côté interface puis devront être revalidées côté Rust ;
- les identifiants intégrés aux URL sont déjà refusés ;
- aucun mot de passe ne sera écrit dans SQLite ou les logs ;
- le futur serveur vidéo écoutera uniquement sur `127.0.0.1` avec un jeton de session aléatoire ;
- la CSP interdit les scripts, cadres et connexions externes non déclarés.

## Validation actuelle

- tests TypeScript : validation RTSP, 3 scénarios ;
- test Rust : routage des actions du tray ;
- rendu réel : 320 px, formulaire invalide/valide, carte configurée, console sans erreur ;
- build release et lancement de `horus.exe` vérifiés ;
- tray cliqué, caméra réelle, consommation et reconnexion : non vérifiés.
