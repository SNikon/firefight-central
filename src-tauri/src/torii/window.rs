use tauri::{AppHandle, Manager, WindowBuilder, WindowUrl, LogicalPosition};
use windows::Win32::{UI::WindowsAndMessaging::WindowFromPoint, Foundation::POINT};

pub fn render_snap_slots(app_handle: AppHandle) {
    let window_map = app_handle.windows();
    
    #[cfg(debug_assertions)] // only include this code on debug builds
    {
        let _bound_set = window_map
            .iter()
            .map(|(wnd_name, wnd)| {
                println!("Found window: {}", wnd_name);

                let _pos = wnd.outer_position();
                let _size = wnd.outer_size();
            });
    }
    

    unsafe {
        let pt = POINT { x: 123, y: 123 };
        let _target_handle = WindowFromPoint(pt);
    }
}

fn open_settings(app_handle: &AppHandle, left: f64, top: f64) -> Result<(), String> {
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
    } else if let Err(err) = WindowBuilder::new(app_handle, "settings",	WindowUrl::App("src/settings/index.html".into()))
		.title("Settings")
        .inner_size(1.0, 1.0)
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