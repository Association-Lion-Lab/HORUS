import { useEffect, useRef, useState, type FormEvent } from "react";
import { parseCameraDraft } from "./camera";
import type { Camera } from "./CameraCard";

interface Props { onAdd: (camera: Camera) => void; onClose: () => void; }

export function AddCameraForm({ onAdd, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [name, setName] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { dialogRef.current?.showModal(); }, []);

  function submit(event: FormEvent) {
    event.preventDefault();
    try {
      const draft = parseCameraDraft({ name, streamUrl });
      onAdd({ id: crypto.randomUUID(), ...draft });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Configuration invalide");
    }
  }

  return (
    <dialog ref={dialogRef} className="camera-dialog" onClose={onClose}>
      <form onSubmit={submit}>
        <div className="dialog-header"><div><p className="eyebrow">NOUVELLE SOURCE</p><h2>Ajouter une caméra RTSP</h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="Fermer">×</button></div>
        <label htmlFor="camera-name">Nom de la caméra</label>
        <input id="camera-name" value={name} onChange={(event) => setName(event.target.value)} autoFocus placeholder="Entrée" />
        <label htmlFor="stream-url">Adresse du flux</label>
        <input id="stream-url" value={streamUrl} onChange={(event) => setStreamUrl(event.target.value)} placeholder="rtsp://192.168.1.40/live" spellCheck={false} />
        <p className="field-note">Ce build refuse les identifiants intégrés à l’URL pour éviter leur stockage en clair.</p>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="dialog-actions"><button type="button" className="secondary-button" onClick={onClose}>Annuler</button><button className="primary-button" type="submit">Ajouter à la grille</button></div>
      </form>
    </dialog>
  );
}
