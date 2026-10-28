export interface CameraDraft {
  name: string;
  streamUrl: string;
}

export function parseCameraDraft(input: CameraDraft): CameraDraft {
  const name = input.name.trim();
  const streamUrl = input.streamUrl.trim();

  if (!name) throw new Error("Le nom de la caméra est requis");

  let url: URL;
  try {
    url = new URL(streamUrl);
  } catch {
    throw new Error("L’adresse du flux est invalide");
  }

  if (url.protocol !== "rtsp:" && url.protocol !== "rtsps:") {
    throw new Error("Le flux doit utiliser RTSP");
  }
  if (url.username || url.password) {
    throw new Error("Saisissez les identifiants séparément de l’URL");
  }

  return { name, streamUrl };
}
