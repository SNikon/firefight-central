// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod firefight;
mod polly;
mod torii;

use anyhow::Result;
use polly::client::create_polly_client;
use polly::synthesize::synthesize_text;
use rodio::{Decoder, OutputStream};
use tauri::{AppHandle, Manager};
use torii::audio;
use std::{io::BufReader, fs::File, sync::Mutex};

static SLOW_PROSODY_START: &str = "<prosody rate=\"slow\" volume=\"x-loud\"><amazon:effect name=\"drc\">";
static X_SLOW_PROSODY_START: &str = "<prosody rate=\"x-slow\" volume=\"x-loud\"><amazon:effect name=\"drc\">";
static PROSODY_END: &str = "</amazon:effect></prosody>";

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn alarm(
    app_handle: AppHandle,
    occurrence: String,
    staff: Option<Vec<String>>,
    vehicles: Vec<String>,
) -> Result<(), String> {
    println!("Alert command received, vehicles: {:?}, staff: {:?}, occurrence: {}", vehicles, staff, occurrence);
    let mut sorted_staff = staff.unwrap_or(vec![])
        .iter()
        .map(|s| s.trim_start_matches("0").to_uppercase())
        .collect::<Vec<String>>();
    
    sorted_staff.sort_by(|a, b| {
        let a_value = a.parse::<i32>().unwrap_or_default();
        let b_value = b.parse::<i32>().unwrap_or_default();

        if a_value == b_value {
            return a.cmp(b);
        }    
        
        return a_value.cmp(&b_value);
    });

    let mut sorted_vehicles = vehicles
        .iter()
        .map(|v| {
            let mut v = v.clone();
            v.retain(|c| !c.is_whitespace());
            v
        })
        .collect::<Vec<String>>();
    sorted_vehicles.sort_unstable();

    let mut staff_key_comp = if sorted_staff.len() > 0 { vec![String::from("-staff-"), sorted_staff.join("-")] } else { vec![] };
    let mut occurrence_key_comp = vec![String::from("-sit-"), occurrence.clone()];
        
    let mut audio_key_comp = sorted_vehicles.clone();
    audio_key_comp.append(&mut staff_key_comp);
    audio_key_comp.append(&mut occurrence_key_comp);

    let audio_key = audio::get_string_hash(&audio_key_comp.join("-"));

    let mut cache_audio_result = audio::get_audio_from_cache(&app_handle, &audio_key);

    if cache_audio_result.is_err() {
        println!("Audio not found in cache, synthesizing...");

        let polly_client = create_polly_client().await;

        let vehicles_cue = sorted_vehicles.into_iter().map(|v| format!("{}<say-as interpret-as=\"spell-out\">{}</say-as>{}", X_SLOW_PROSODY_START, v, PROSODY_END)).collect::<Vec<String>>().join(", ");
        let staff_cue = if sorted_staff.len() > 0 { format!("<s>{}Guarnição <break strength=\"weak\" /> {}{}{}{}</s>", SLOW_PROSODY_START, PROSODY_END, X_SLOW_PROSODY_START, sorted_staff.join("<break strength=\"medium\" />"), PROSODY_END) } else { String::from("") };        
        let audio_cue = format!("<speak><s>{}Saída de {}{}{} para {}{}</s> {}</speak>", SLOW_PROSODY_START, PROSODY_END, vehicles_cue, SLOW_PROSODY_START, occurrence, PROSODY_END, staff_cue);
        
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
            app.manage(Mutex::new(store));

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            alarm,
            get_environment,
            firefight::commands::get_store,
            firefight::commands::create_active_occurrence,
            firefight::commands::create_occurrence,
            firefight::commands::create_staff,
            firefight::commands::create_vehicle,
            firefight::commands::update_active_occurrence,
            firefight::commands::update_occurrence,
            firefight::commands::update_staff,
            firefight::commands::update_vehicle,
            firefight::commands::delete_active_occurrence,
            firefight::commands::delete_occurrence,
            firefight::commands::delete_staff,
            firefight::commands::delete_vehicle,
            torii::commands::open_settings
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
