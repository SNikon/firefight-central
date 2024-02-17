use tauri::{AppHandle, LogicalPosition, Manager, Window, WindowBuilder, WindowUrl};

#[tauri::command(async)]
pub fn clear_audio_cache(app_handle: AppHandle) -> Result<(), String> {
	match crate::torii::audio::clear_cache(&app_handle) {
		Ok(_) => Ok(()),
		Err(err) => Err(err.to_string())
	}
}

#[tauri::command(async)]
pub fn open_fvp(app_handle: AppHandle) -> Result<(), String> {
	// Already open?
	if let Some(wnd) = app_handle.get_window("fvp") {
		if let Err(show_error) = wnd.show() {
			return Err(show_error.to_string());
		}
		if let Err(focus_error) = wnd.set_focus() {
			return Err(focus_error.to_string());
		}
	// Else try create
	} else if let Err(err) = WindowBuilder::new(&app_handle, "fvp",	WindowUrl::App("src/fvp/index.html".into()))
		.title("Firefight Central - Painel de recursos")
		.inner_size(800.0, 600.0)
		.closable(true)
		.decorations(true)
		.maximizable(true)
		.maximized(true)
		.minimizable(true)
		.resizable(true)
		.transparent(false)
		.build() {
		return Err(err.to_string());
	}

	Ok(())
}


#[tauri::command(async)]
pub fn open_settings(app_handle: AppHandle, left: f64, top: f64) -> Result<(), String> {
	// Already open?
	if let Some(wnd) = app_handle.get_window("settings") {
		if let Err(position_error) = wnd.set_position(tauri::Position::Logical(LogicalPosition { x: left, y: top })) {
			return Err(position_error.to_string());
		}
		if let Err(show_error) = wnd.show() {
			return Err(show_error.to_string());
		}
		if let Err(focus_error) = wnd.set_focus() {
			return Err(focus_error.to_string());
		}
	// Else try create
	} else if let Err(err) = WindowBuilder::new(&app_handle, "settings",	WindowUrl::App("src/settings/index.html".into()))
		.title("Firefight Central - Configurações")
		.inner_size(200.0, 200.0)
		.position(left, top)
		.decorations(true)
		.closable(true)
		.minimizable(false)
		.maximizable(false)
		.resizable(false)
		.transparent(false)
		.build() {
		return Err(err.to_string());
	}

	Ok(())
}

#[tauri::command(async)]
pub fn set_fullscreen(window: Window, fullscreen: bool) -> Result<(), String> {
	if let Err(err) = window.set_fullscreen(fullscreen) {
		return Err(err.to_string());
	}

	Ok(())
}
