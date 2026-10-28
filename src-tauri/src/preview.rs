use std::{
    process::{Command, Stdio},
    time::Duration,
};

use tauri::ipc::Response;
use url::Url;
use wait_timeout::ChildExt;

fn validate_stream_url(stream_url: &str) -> Result<(), String> {
    let url = Url::parse(stream_url).map_err(|_| "Adresse RTSP invalide".to_string())?;
    if !matches!(url.scheme(), "rtsp" | "rtsps") || url.host_str().is_none() {
        return Err("Adresse RTSP invalide".to_string());
    }
    if !url.username().is_empty() || url.password().is_some() {
        return Err("Les identifiants intégrés à l’URL sont refusés".to_string());
    }
    Ok(())
}

fn ffmpeg_args(stream_url: &str, output_path: &str) -> Vec<String> {
    [
        "-hide_banner",
        "-loglevel",
        "error",
        "-rtsp_transport",
        "tcp",
        "-rw_timeout",
        "5000000",
        "-i",
        stream_url,
        "-map",
        "0:v:0",
        "-frames:v",
        "1",
        "-vf",
        "scale=1280:-2:force_original_aspect_ratio=decrease",
        "-q:v",
        "3",
        "-y",
        output_path,
    ]
    .into_iter()
    .map(str::to_string)
    .collect()
}

fn capture_frame(stream_url: &str) -> Result<Vec<u8>, String> {
    validate_stream_url(stream_url)?;
    let output = tempfile::Builder::new()
        .suffix(".jpg")
        .tempfile()
        .map_err(|_| "Impossible de préparer l’aperçu".to_string())?
        .into_temp_path();
    let output_text = output.to_string_lossy().into_owned();
    let mut child = Command::new("ffmpeg")
        .args(ffmpeg_args(stream_url, &output_text))
        .stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .map_err(|_| "FFmpeg est introuvable sur cette machine".to_string())?;

    let status = child
        .wait_timeout(Duration::from_secs(8))
        .map_err(|_| "Impossible d’attendre FFmpeg".to_string())?;
    let Some(status) = status else {
        let _ = child.kill();
        let _ = child.wait();
        return Err("La caméra ne répond pas dans le délai prévu".to_string());
    };
    if !status.success() {
        return Err("Flux RTSP inaccessible ou incompatible".to_string());
    }

    std::fs::read(&output).map_err(|_| "FFmpeg n’a produit aucune image".to_string())
}

#[tauri::command]
pub(crate) async fn capture_rtsp_preview(stream_url: String) -> Result<Response, String> {
    tauri::async_runtime::spawn_blocking(move || capture_frame(&stream_url))
        .await
        .map_err(|_| "La capture RTSP a été interrompue".to_string())?
        .map(Response::new)
}

#[cfg(test)]
mod tests {
    use super::{ffmpeg_args, validate_stream_url};

    #[test]
    fn builds_a_bounded_single_frame_rtsp_capture() {
        let args = ffmpeg_args("rtsp://192.168.1.40/live", "preview.jpg");

        assert!(
            args.windows(2)
                .any(|pair| pair == ["-rtsp_transport", "tcp"])
        );
        assert!(args.windows(2).any(|pair| pair == ["-frames:v", "1"]));
        assert!(
            args.windows(2)
                .any(|pair| pair == ["-i", "rtsp://192.168.1.40/live"])
        );
        assert_eq!(args.last().map(String::as_str), Some("preview.jpg"));
    }

    #[test]
    fn rejects_credentials_and_non_rtsp_urls() {
        assert!(validate_stream_url("https://camera.local/live").is_err());
        assert!(validate_stream_url("rtsp://admin:secret@camera.local/live").is_err());
        assert!(validate_stream_url("rtsp://camera.local/live").is_ok());
    }
}
