use tauri::{AppHandle, LogicalPosition, Manager, WindowBuilder, WindowUrl};

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
		.title("Configurações Firefight Central")
		.inner_size(10.0, 10.0)
		.position(left, top)
		.decorations(true)
		.closable(true)
		.minimizable(false)
		.maximizable(false)
		.resizable(false)
		.transparent(true)
		.build() {
		return Err(err.to_string());
	}

	Ok(())
}
