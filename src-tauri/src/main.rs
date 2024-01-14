// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod firefight;
mod polly;
mod torii;

use anyhow::Result;
use firefight::types::DataStore;
use polly::client::create_polly_client;
use polly::synthesize::synthesize_text;
use rodio::{Decoder, OutputStream};
use tauri::{AppHandle, Manager, State};
use torii::audio;
use std::{io::BufReader, fs::File, sync::Mutex, borrow::BorrowMut, ops::DerefMut};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn alarm(
    app_handle: AppHandle,
    ocurrence: String,
    staff: Option<Vec<String>>,
    vehicles: Vec<String>,
) -> Result<(), String> {
    println!("Alarm command received, vehicles: {:?}, ocurrence: {}", vehicles, ocurrence);
    let ocurrence_value = String::from(ocurrence.trim());

    let mut sorted_vehicles = vehicles.iter().map(|v| v.trim().to_uppercase()).collect::<Vec<String>>();
    sorted_vehicles.sort_unstable();

    let mut ocurrence_key_comp = vec![String::from("-sit-"), ocurrence_value.clone()];
    let mut audio_key_comp = sorted_vehicles.clone();
    audio_key_comp.append(&mut ocurrence_key_comp);
    let audio_key = audio::get_string_hash(&audio_key_comp.join("-"));

    let mut cache_audio_result = audio::get_audio_from_cache(&app_handle, &audio_key);

    if cache_audio_result.is_err() {
        println!("Audio not found in cache, synthesizing...");

        let polly_client = create_polly_client().await;

        let vehicles_cue = sorted_vehicles.into_iter().map(|v| format!("<say-as interpret-as=\"spell-out\">{}</say-as>", v)).collect::<Vec<String>>().join(", ");
        let audio_cue = format!("<speak>Saída de {} para {}.</speak>", vehicles_cue, ocurrence_value);
        
        let synthesize_result = synthesize_text(&polly_client, &audio_cue).await;
        if synthesize_result.is_err() {
            return Err(format!("Failed to synthesize speech, err: {}", synthesize_result.err().unwrap()));
        }

        let mut audio_data = synthesize_result.unwrap().to_vec();
        if let Err(cache_error) = audio::cache_audio(&app_handle, &audio_key, &mut audio_data) {
            return Err(format!("Failed to cache audio, err: {}", cache_error));
        }

        // Re-fetch from cache
        cache_audio_result = audio::get_audio_from_cache(&app_handle, &audio_key);
    } else {
        println!("Audio found in cache, playing...");
    }

    // Get a output stream handle to the default physical sound device
    let (_stream, stream_handle) = OutputStream::try_default().unwrap();
    let sink = rodio::Sink::try_new(&stream_handle).unwrap();
    let file: BufReader<File> = BufReader::new(cache_audio_result.unwrap());
    // Decode that sound file into a source
    let source = Decoder::new(file).unwrap();
    // Play the sound directly on the device
    sink.append(source);
    sink.sleep_until_end();

    Ok(())
}

#[tauri::command]
async fn get_store(state: State<'_, Mutex<firefight::local_store::LocalStore>>) -> Result<DataStore, String> {
    let mut state_mutex = state.lock().unwrap();
    let state_mutex_ref = state_mutex.borrow_mut();
    let state = state_mutex_ref.deref_mut();

    Ok(firefight::local_store::get_data_store(state))
}

#[cfg(dev)]
#[tauri::command]
fn get_environment() -> String { String::from("development") }
#[cfg(not(dev))]
#[tauri::command]
fn get_environment() -> String { String::from("production") }

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let store = firefight::local_store::create_store(app.app_handle());
            app.manage(store);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            alarm,
            get_environment,
            get_store
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
