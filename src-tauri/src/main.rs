// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod firefight;
mod polly;

use tauri::{async_runtime::Mutex, Manager};

#[cfg(dev)]
#[tauri::command]
fn get_environment() -> String { String::from("development") }
#[cfg(not(dev))]
#[tauri::command]
fn get_environment() -> String { String::from("production") }

fn main() {
    tauri::Builder::default()
        .on_window_event(|event| {
            if let tauri::WindowEvent::Destroyed = event.event() {
                let window = event.window();

                if window.label() == "main" {
                    println!("Main window destroyed, exiting...");
                    std::process::exit(0);
                }
            }
        })
        .setup(|app| {
            let store = firefight::local_store::create_store(app.app_handle());
            app.manage(Mutex::new(store));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_environment,
            commands::alarm,
            commands::alert,
            commands::get_store,
            commands::create_active_occurrence,
            commands::create_occurrence,
            commands::create_staff,
            commands::create_vehicle,
            commands::update_active_occurrence,
            commands::update_occurrence,
            commands::update_staff,
            commands::update_vehicle,
            commands::set_staff_shift,
            commands::delete_active_occurrence,
            commands::delete_occurrence,
            commands::delete_staff,
            commands::delete_vehicle,
            commands::clear_audio_cache,
            commands::rebuild_audio_cache,
            commands::open_fvp,
            commands::open_settings,
            commands::set_fullscreen
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
