import { useState } from "react";
import "./App.css";
import { AddCameraForm } from "./features/cameras/AddCameraForm";
import { CameraCard, type Camera } from "./features/cameras/CameraCard";

const navItems = ["Caméras", "Événements", "Sources", "Paramètres"];

function App() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const visibleCameras = focusedId ? cameras.filter((camera) => camera.id === focusedId) : cameras;

  function addCamera(camera: Camera) {
    setCameras((current) => [...current, camera]);
    setIsAdding(false);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Navigation principale">
        <div className="brand" aria-label="HORUS"><span className="brand-mark" aria-hidden="true">H</span><span>HORUS</span></div>
        <nav>
          {navItems.map((item, index) => (
            <button className={index === 0 ? "nav-item active" : "nav-item"} disabled={index !== 0} key={item} title={index === 0 ? undefined : "Prévu dans une phase suivante"}>
              <span className="nav-dot" aria-hidden="true" />{item}
            </button>
          ))}
        </nav>
        <div className="privacy-note"><span className="status-dot ready" aria-hidden="true" />Local uniquement</div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div><p className="eyebrow">SURVEILLANCE LOCALE</p><h1>{focusedId ? "Vue caméra" : "Toutes les caméras"}</h1></div>
          <div className="topbar-actions">
            {focusedId && <button className="secondary-button" onClick={() => setFocusedId(null)}>Retour à la grille</button>}
            <button className="primary-button" onClick={() => setIsAdding(true)}><span aria-hidden="true">＋</span> Ajouter</button>
          </div>
        </header>

        <section className="summary" aria-label="État des caméras">
          <div><strong>{cameras.length}</strong><span>configurée{cameras.length > 1 ? "s" : ""}</span></div>
          <div><strong>0</strong><span>en direct</span></div>
          <div><strong>—</strong><span>dernier événement</span></div>
          <p>Lecture RTSP et stockage SQLite : prochain incrément technique.</p>
        </section>

        {visibleCameras.length === 0 ? (
          <section className="empty-grid" aria-labelledby="empty-title">
            <div className="empty-state">
              <div className="empty-icon" aria-hidden="true"><span /></div>
              <p className="eyebrow">AUCUNE SOURCE</p><h2 id="empty-title">Ajoutez votre première caméra</h2>
              <p>HORUS acceptera un flux RTSP local H.264 sans envoyer d’image vers Internet.</p>
              <button className="primary-button" onClick={() => setIsAdding(true)}>Configurer une caméra</button>
            </div>
          </section>
        ) : (
          <section className={`camera-grid count-${visibleCameras.length}`} aria-label="Grille des caméras">
            {visibleCameras.map((camera) => <CameraCard camera={camera} key={camera.id} onFocus={() => setFocusedId(camera.id)} />)}
          </section>
        )}
      </main>

      {isAdding && <AddCameraForm onAdd={addCamera} onClose={() => setIsAdding(false)} />}
    </div>
  );
}

export default App;
