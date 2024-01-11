// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod polly;
mod torii;

use anyhow::Result;
use polly::client::create_polly_client;
use polly::synthesize::synthesize_text;
use rodio::{Decoder, OutputStream};
use tauri::AppHandle;
use torii::audio;
use std::{io::{BufReader}, fs::{File}};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn alarm(
    app_handle: AppHandle,
    vehicles: Vec<String>,
    situation: String
) -> Result<(), String> {
    println!("Alarm command received, vehicles: {:?}, situation: {}", vehicles, situation);
    let situation_value = String::from(situation.trim());

    let mut sorted_vehicles = vehicles.iter().map(|v| v.trim().to_uppercase()).collect::<Vec<String>>();
    sorted_vehicles.sort_unstable();

    let mut situation_key_comp = vec![String::from("-sit-"), situation_value.clone()];
    let mut audio_key_comp = sorted_vehicles.clone();
    audio_key_comp.append(&mut situation_key_comp);
    let audio_key = audio::get_string_hash(&audio_key_comp.join("-"));

    let mut cache_audio_result = audio::get_audio_from_cache(&app_handle, &audio_key);

    if cache_audio_result.is_err() {
        println!("Audio not found in cache, synthesizing...");

        let polly_client = create_polly_client().await;

        let vehicles_cue = sorted_vehicles.into_iter().map(|v| format!("<say-as interpret-as=\"spell-out\">{}</say-as>", v)).collect::<Vec<String>>().join(", ");
        let audio_cue = format!("<speak>Saída de {} para {}.</speak>", vehicles_cue, situation_value);
        
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
        .invoke_handler(tauri::generate_handler![
            alarm,
            get_environment
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
