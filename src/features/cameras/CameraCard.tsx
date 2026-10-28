import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

export interface Camera { id: string; name: string; streamUrl: string; }

export function CameraCard({ camera, onFocus }: { camera: Camera; onFocus: () => void }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    invoke<ArrayBuffer>("capture_rtsp_preview", { streamUrl: camera.streamUrl })
      .then((bytes) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(new Blob([bytes], { type: "image/jpeg" }));
        setPreviewUrl(objectUrl);
      })
      .catch((cause) => {
        if (!cancelled) setPreviewError(String(cause));
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [camera.streamUrl, retryCount]);

  function retryPreview() {
    setPreviewError("");
    setRetryCount((current) => current + 1);
  }

  return (
    <article className="camera-card" onDoubleClick={onFocus}>
      <div className="camera-stage">
        {previewUrl ? (
          <img className="camera-preview" src={previewUrl} alt={`Aperçu de ${camera.name}`} />
        ) : (
          <div className="camera-offline" role="status" aria-live="polite">
            <span className={previewError ? "offline-symbol" : "preview-progress"} aria-hidden="true" />
            <strong>{previewError ? "Aperçu indisponible" : "Connexion à la caméra…"}</strong>
            <span>{previewError || "Capture locale d’une image RTSP"}</span>
            {previewError && (
              <>
                <span>Vérifiez l’adresse, le réseau et FFmpeg.</span>
                <button className="preview-retry" type="button" onClick={retryPreview}>Réessayer</button>
              </>
            )}
          </div>
        )}
        <div className="camera-overlay"><div><span className={`status-dot ${previewUrl ? "ready" : "pending"}`} aria-hidden="true" /><strong>{camera.name}</strong></div><button onClick={onFocus} aria-label={`Agrandir ${camera.name}`}>↗</button></div>
      </div>
    </article>
  );
}
