use tauri::{
    App, AppHandle, Emitter, Manager,
    menu::{MenuBuilder, MenuItemBuilder},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
};

#[derive(Debug, PartialEq)]
enum TrayAction {
    Show,
    Settings,
    Quit,
}

fn menu_action(id: &str) -> Option<TrayAction> {
    match id {
        "show" => Some(TrayAction::Show),
        "settings" => Some(TrayAction::Settings),
        "quit" => Some(TrayAction::Quit),
        _ => None,
    }
}

fn show_window(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.set_focus();
    }
}

fn toggle_window(app: &AppHandle) {
    let Some(window) = app.get_webview_window("main") else {
        return;
    };

    if window.is_visible().unwrap_or(false) {
        let _ = window.hide();
    } else {
        let _ = window.show();
        let _ = window.set_focus();
    }
}

pub fn install(app: &mut App) -> tauri::Result<()> {
    let show = MenuItemBuilder::with_id("show", "Afficher HORUS").build(app)?;
    let settings = MenuItemBuilder::with_id("settings", "Paramètres").build(app)?;
    let quit = MenuItemBuilder::with_id("quit", "Quitter complètement").build(app)?;
    let menu = MenuBuilder::new(app)
        .items(&[&show, &settings, &quit])
        .build()?;

    // Source: https://v2.tauri.app/learn/system-tray/
    let mut builder = TrayIconBuilder::with_id("horus-tray")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .tooltip("HORUS")
        .on_menu_event(|app, event| match menu_action(event.id().as_ref()) {
            Some(TrayAction::Show) => show_window(app),
            Some(TrayAction::Settings) => {
                show_window(app);
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.emit("horus:navigate", "settings");
                }
            }
            Some(TrayAction::Quit) => app.exit(0),
            None => {}
        })
        .on_tray_icon_event(|tray, event| {
            if matches!(
                event,
                TrayIconEvent::Click {
                    button: MouseButton::Left,
                    button_state: MouseButtonState::Up,
                    ..
                }
            ) {
                toggle_window(tray.app_handle());
            }
        });

    if let Some(icon) = app.default_window_icon() {
        builder = builder.icon(icon.clone());
    }
    builder.build(app)?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::{TrayAction, menu_action};

    #[test]
    fn maps_known_menu_ids_and_ignores_unknown_ids() {
        assert_eq!(menu_action("show"), Some(TrayAction::Show));
        assert_eq!(menu_action("settings"), Some(TrayAction::Settings));
        assert_eq!(menu_action("quit"), Some(TrayAction::Quit));
        assert_eq!(menu_action("unexpected"), None);
    }
}
