export interface Camera { id: string; name: string; streamUrl: string; }

export function CameraCard({ camera, onFocus }: { camera: Camera; onFocus: () => void }) {
  return (
    <article className="camera-card" onDoubleClick={onFocus}>
      <div className="camera-stage">
        <div className="camera-offline" role="status">
          <span className="offline-symbol" aria-hidden="true" /><strong>Flux non démarré</strong>
          <span>Le moteur RTSP sera relié au prochain incrément.</span>
        </div>
        <div className="camera-overlay"><div><span className="status-dot pending" aria-hidden="true" /><strong>{camera.name}</strong></div><button onClick={onFocus} aria-label={`Agrandir ${camera.name}`}>↗</button></div>
      </div>
    </article>
  );
}
