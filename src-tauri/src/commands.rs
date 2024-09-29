use std::cmp::Ordering;
use std::collections::HashMap;
use std::fs::File;
use std::io::BufReader;
use std::ops::DerefMut;
use std::time;
use std::{borrow::BorrowMut, future::IntoFuture};

use futures::future::try_join_all;
use rodio::{Decoder, OutputStream};
use tauri::{
    async_runtime::Mutex, AppHandle, LogicalPosition, Manager, State, Window, WindowBuilder,
    WindowUrl,
};

use crate::firefight::{audio, events::*, local_store::*, types::*};
use crate::polly;

const VEHICLE_SPEECH: &str = "Veículo";
const STAFF_SPEECH: &str = "Guarnição";

#[tauri::command]
pub async fn get_version(app_handle: AppHandle) -> String {
    app_handle.package_info().version.to_string()
}

#[tauri::command]
pub async fn get_store(state: State<'_, Mutex<LocalStore>>) -> Result<DataStore, String> {
    let mut state_mutex = state.lock().into_future().await;
    let state_mutex_ref = state_mutex.borrow_mut();
    let state = state_mutex_ref.deref_mut();

    Ok(get_data_store(state))
}

#[tauri::command]
pub async fn create_active_occurrence(
    app_handle: AppHandle,
    state: State<'_, Mutex<LocalStore>>,
    mut active_occurrence: ActiveOccurrence,
) -> Result<(), String> {
    let mut state_mutex = state.lock().into_future().await;
    let state_mutex_ref = state_mutex.borrow_mut();
    let state = state_mutex_ref.deref_mut();

    active_occurrence.creation_time = Some(time::UNIX_EPOCH.elapsed().unwrap().as_millis());
    let create_result = state.create_active_occurrence(active_occurrence);
    if let Err(create_error) = create_result {
        return Err(create_error.to_string());
    }

    let _ = app_handle.emit_all(STATE_UPDATED, get_data_store(state));
    Ok(())
}

#[tauri::command]
pub async fn create_occurrence(
    app_handle: AppHandle,
    state: State<'_, Mutex<LocalStore>>,
    occurrence: Occurrence,
) -> Result<(), String> {
    let mut state_mutex = state.lock().into_future().await;
    let state_mutex_ref = state_mutex.borrow_mut();
    let state = state_mutex_ref.deref_mut();

    let audible_occurrence_label = occurrence.name.clone();
    let occurrence_id = state.create_occurrence(occurrence);
    if let Err(create_error) = occurrence_id {
        return Err(create_error.to_string());
    }

    let _ = app_handle.emit_all(STATE_UPDATED, get_data_store(state));

    let audio_synthesizer = polly::client::create_polly_client().await;
    let audio_resouce = polly::synthesize::synthesize(
        &audio_synthesizer,
        &polly::synthesize::Synthesizable::Occurrence(audible_occurrence_label),
    )
    .await;
    if audio_resouce.is_err() {
        return Err(audio_resouce.unwrap_err().to_string());
    }
    let _ = audio::put_audio_cache(
        &app_handle,
        &occurrence_id.unwrap(),
        audio_resouce.unwrap().to_vec().borrow_mut(),
    );

    Ok(())
}

#[tauri::command]
pub async fn create_staff(
    app_handle: AppHandle,
    state: State<'_, Mutex<LocalStore>>,
    staff: Staff,
) -> Result<(), String> {
    let mut state_mutex = state.lock().into_future().await;
    let state_mutex_ref = state_mutex.borrow_mut();
    let state = state_mutex_ref.deref_mut();

    let audible_staff_label = staff.label.clone();
    let staff_id = state.create_staff(staff);
    if staff_id.is_err() {
        return Err(staff_id.unwrap_err().to_string());
    }

    let _ = app_handle.emit_all(STATE_UPDATED, get_data_store(state));

    let audio_synthesizer = polly::client::create_polly_client().await;
    let audio_resouce = polly::synthesize::synthesize(
        &audio_synthesizer,
        &polly::synthesize::Synthesizable::Staff(audible_staff_label),
    )
    .await;
    if audio_resouce.is_err() {
        return Err(audio_resouce.unwrap_err().to_string());
    }
    let _ = audio::put_audio_cache(
        &app_handle,
        &staff_id.unwrap(),
        audio_resouce.unwrap().to_vec().borrow_mut(),
    );

    Ok(())
}

#[tauri::command]
pub async fn create_team(
    app_handle: AppHandle,
    state: State<'_, Mutex<LocalStore>>,
    team: Team,
) -> Result<(), String> {
    let mut state_mutex = state.lock().into_future().await;
    let state_mutex_ref = state_mutex.borrow_mut();
    let state = state_mutex_ref.deref_mut();

    let audible_team_label = team.label.clone();
    let team_id = state.create_team(team);
    if team_id.is_err() {
        return Err(team_id.unwrap_err().to_string());
    }

    let _ = app_handle.emit_all(STATE_UPDATED, get_data_store(state));

    let audio_synthesizer = polly::client::create_polly_client().await;
    let audio_resouce = polly::synthesize::synthesize(
        &audio_synthesizer,
        &polly::synthesize::Synthesizable::Team(audible_team_label),
    )
    .await;
    if audio_resouce.is_err() {
        return Err(audio_resouce.unwrap_err().to_string());
    }
    let _ = audio::put_audio_cache(
        &app_handle,
        &team_id.unwrap(),
        audio_resouce.unwrap().to_vec().borrow_mut(),
    );

    Ok(())
}

#[tauri::command]
pub async fn create_vehicle(
    app_handle: AppHandle,
    state: State<'_, Mutex<LocalStore>>,
    vehicle: Vehicle,
) -> Result<(), String> {
    let mut state_mutex = state.lock().into_future().await;
    let state_mutex_ref = state_mutex.borrow_mut();
    let state = state_mutex_ref.deref_mut();

    let audible_vehicle_label = vehicle.label.clone();
    let vehicle_id = state.create_vehicle(vehicle);
    if let Err(create_error) = vehicle_id {
        return Err(create_error.to_string());
    }

    let _ = app_handle.emit_all(STATE_UPDATED, get_data_store(state));

    let audio_synthesizer = polly::client::create_polly_client().await;
    let audio_resouce = polly::synthesize::synthesize(
        &audio_synthesizer,
        &polly::synthesize::Synthesizable::Vehicle(audible_vehicle_label),
    )
    .await;
    if audio_resouce.is_err() {
        return Err(audio_resouce.unwrap_err().to_string());
    }
    let _ = audio::put_audio_cache(
        &app_handle,
        &vehicle_id.unwrap(),
        audio_resouce.unwrap().to_vec().borrow_mut(),
    );

    Ok(())
}

#[tauri::command]
pub async fn update_active_occurrence(
    app_handle: AppHandle,
    state: State<'_, Mutex<LocalStore>>,
    active_occurrence: ActiveOccurrence,
) -> Result<(), String> {
    let mut state_mutex = state.lock().into_future().await;
    let state_mutex_ref = state_mutex.borrow_mut();
    let state = state_mutex_ref.deref_mut();

    let update_result =
        state.update_active_occurrence(&active_occurrence.internal_id.clone(), active_occurrence);
    if let Err(update_error) = update_result {
        return Err(update_error.to_string());
    }

    let _ = app_handle.emit_all(STATE_UPDATED, get_data_store(state));
    Ok(())
}

#[tauri::command]
pub async fn update_occurrence(
    app_handle: AppHandle,
    state: State<'_, Mutex<LocalStore>>,
    occurrence: Occurrence,
) -> Result<(), String> {
    let mut state_mutex = state.lock().into_future().await;
    let state_mutex_ref = state_mutex.borrow_mut();
    let state = state_mutex_ref.deref_mut();

    let audible_occurrence_label = occurrence.name.clone();
    let update_result = state.update_occurrence(&occurrence.internal_id.clone(), occurrence);
    if let Err(update_error) = update_result {
        return Err(update_error.to_string());
    }

    let _ = app_handle.emit_all(STATE_UPDATED, get_data_store(state));

    if let Ok(Some(previous_occurrence)) = update_result {
        if audible_occurrence_label != previous_occurrence.name {
            let audio_synthesizer = polly::client::create_polly_client().await;
            let audio_resouce = polly::synthesize::synthesize(
                &audio_synthesizer,
                &polly::synthesize::Synthesizable::Occurrence(audible_occurrence_label),
            )
            .await;
            if audio_resouce.is_err() {
                return Err(audio_resouce.unwrap_err().to_string());
            }
            let _ = audio::put_audio_cache(
                &app_handle,
                &previous_occurrence.internal_id,
                audio_resouce.unwrap().to_vec().borrow_mut(),
            );
        }
    }

    Ok(())
}

#[tauri::command]
pub async fn update_staff(
    app_handle: AppHandle,
    state: State<'_, Mutex<LocalStore>>,
    staff: Staff,
) -> Result<(), String> {
    let mut state_mutex = state.lock().into_future().await;
    let state_mutex_ref = state_mutex.borrow_mut();
    let state = state_mutex_ref.deref_mut();

    let audible_staff_label = staff.label.clone();
    let update_result = state.update_staff(&staff.internal_id.clone(), staff);
    if let Err(update_error) = update_result {
        return Err(update_error.to_string());
    }

    let _ = app_handle.emit_all(STATE_UPDATED, get_data_store(state));

    if let Ok(Some(previous_staff)) = update_result {
        if audible_staff_label != previous_staff.label {
            let audio_synthesizer = polly::client::create_polly_client().await;
            let audio_resouce = polly::synthesize::synthesize(
                &audio_synthesizer,
                &polly::synthesize::Synthesizable::Staff(audible_staff_label),
            )
            .await;
            if audio_resouce.is_err() {
                return Err(audio_resouce.unwrap_err().to_string());
            }
            let _ = audio::put_audio_cache(
                &app_handle,
                &previous_staff.internal_id,
                audio_resouce.unwrap().to_vec().borrow_mut(),
            );
        }
    }

    Ok(())
}


#[tauri::command]
pub async fn update_team(
    app_handle: AppHandle,
    state: State<'_, Mutex<LocalStore>>,
    team: Team,
) -> Result<(), String> {
    let mut state_mutex = state.lock().into_future().await;
    let state_mutex_ref = state_mutex.borrow_mut();
    let state = state_mutex_ref.deref_mut();

    let audible_team_label = team.label.clone();
    let update_result = state.update_team(&team.internal_id.clone(), team);
    if let Err(update_error) = update_result {
        return Err(update_error.to_string());
    }

    let _ = app_handle.emit_all(STATE_UPDATED, get_data_store(state));

    if let Ok(Some(previous_team)) = update_result {
        if audible_team_label != previous_team.label {
            let audio_synthesizer = polly::client::create_polly_client().await;
            let audio_resouce = polly::synthesize::synthesize(
                &audio_synthesizer,
                &polly::synthesize::Synthesizable::Staff(audible_team_label),
            )
            .await;
            if audio_resouce.is_err() {
                return Err(audio_resouce.unwrap_err().to_string());
            }
            let _ = audio::put_audio_cache(
                &app_handle,
                &previous_team.internal_id,
                audio_resouce.unwrap().to_vec().borrow_mut(),
            );
        }
    }

    Ok(())
}

#[tauri::command]
pub async fn update_vehicle(
    app_handle: AppHandle,
    state: State<'_, Mutex<LocalStore>>,
    vehicle: Vehicle,
) -> Result<(), String> {
    let mut state_mutex = state.lock().into_future().await;
    let state_mutex_ref = state_mutex.borrow_mut();
    let state = state_mutex_ref.deref_mut();

    let audible_vehicle_label = vehicle.label.clone();
    let update_result = state.update_vehicle(&vehicle.internal_id.clone(), vehicle);
    if let Err(update_error) = update_result {
        return Err(update_error.to_string());
    }

    let _ = app_handle.emit_all(STATE_UPDATED, get_data_store(state));

    if let Ok(Some(previous_vehicle)) = update_result {
        if audible_vehicle_label != previous_vehicle.label {
            let audio_synthesizer = polly::client::create_polly_client().await;
            let audio_resouce = polly::synthesize::synthesize(
                &audio_synthesizer,
                &polly::synthesize::Synthesizable::Vehicle(audible_vehicle_label),
            )
            .await;
            if audio_resouce.is_err() {
                return Err(audio_resouce.unwrap_err().to_string());
            }
            let _ = audio::put_audio_cache(
                &app_handle,
                &previous_vehicle.internal_id,
                audio_resouce.unwrap().to_vec().borrow_mut(),
            );
        }
    }

    Ok(())
}

#[tauri::command]
pub async fn delete_active_occurrence(
    app_handle: AppHandle,
    state: State<'_, Mutex<LocalStore>>,
    active_occurrence_id: String,
) -> Result<(), String> {
    let mut state_mutex = state.lock().into_future().await;
    let state_mutex_ref = state_mutex.borrow_mut();
    let state = state_mutex_ref.deref_mut();

    let delete_result = state.delete_active_occurrence(&active_occurrence_id);
    if let Err(delete_error) = delete_result {
        return Err(delete_error.to_string());
    }

    let _ = app_handle.emit_all(STATE_UPDATED, get_data_store(state));
    Ok(())
}

#[tauri::command]
pub async fn delete_occurrence(
    app_handle: AppHandle,
    state: State<'_, Mutex<LocalStore>>,
    occurrence_id: String,
) -> Result<(), String> {
    let mut state_mutex = state.lock().into_future().await;
    let state_mutex_ref = state_mutex.borrow_mut();
    let state = state_mutex_ref.deref_mut();

    let delete_result = state.delete_occurrence(&occurrence_id);
    if let Err(delete_error) = delete_result {
        return Err(delete_error.to_string());
    }

    let _ = app_handle.emit_all(STATE_UPDATED, get_data_store(state));
    let _ = audio::delete_audio_cache(&app_handle, &occurrence_id);

    Ok(())
}

#[tauri::command]
pub async fn delete_staff(
    app_handle: AppHandle,
    state: State<'_, Mutex<LocalStore>>,
    staff_id: String,
) -> Result<(), String> {
    let mut state_mutex = state.lock().into_future().await;
    let state_mutex_ref = state_mutex.borrow_mut();
    let state = state_mutex_ref.deref_mut();

    let delete_result = state.delete_staff(&staff_id);
    if let Err(delete_error) = delete_result {
        return Err(delete_error.to_string());
    }

    let _ = app_handle.emit_all(STATE_UPDATED, get_data_store(state));
    let _ = audio::delete_audio_cache(&app_handle, &staff_id);

    Ok(())
}

#[tauri::command]
pub async fn delete_team(
    app_handle: AppHandle,
    state: State<'_, Mutex<LocalStore>>,
    team_id: String,
) -> Result<(), String> {
    let mut state_mutex = state.lock().into_future().await;
    let state_mutex_ref = state_mutex.borrow_mut();
    let state = state_mutex_ref.deref_mut();

    let delete_result = state.delete_team(&team_id);
    if let Err(delete_error) = delete_result {
        return Err(delete_error.to_string());
    }

    let _ = app_handle.emit_all(STATE_UPDATED, get_data_store(state));
    let _ = audio::delete_audio_cache(&app_handle, &team_id);

    Ok(())
}

#[tauri::command]
pub async fn delete_vehicle(
    app_handle: AppHandle,
    state: State<'_, Mutex<LocalStore>>,
    vehicle_id: String,
) -> Result<(), String> {
    let mut state_mutex = state.lock().into_future().await;
    let state_mutex_ref = state_mutex.borrow_mut();
    let state = state_mutex_ref.deref_mut();

    let delete_result = state.delete_vehicle(&vehicle_id);
    if let Err(delete_error) = delete_result {
        return Err(delete_error.to_string());
    }

    let _ = app_handle.emit_all(STATE_UPDATED, get_data_store(state));
    let _ = audio::delete_audio_cache(&app_handle, &vehicle_id);

    Ok(())
}

#[tauri::command]
pub async fn set_staff_shift(
    app_handle: AppHandle,
    state: State<'_, Mutex<LocalStore>>,
    available_staff: Vec<String>,
) -> Result<(), String> {
    let mut state_mutex = state.lock().into_future().await;
    let state_mutex_ref = state_mutex.borrow_mut();
    let state = state_mutex_ref.deref_mut();

    let update_result = state.set_staff_shift(available_staff, HashMap::new());
    if let Err(update_error) = update_result {
        return Err(update_error.to_string());
    }

    let _ = app_handle.emit_all(STATE_UPDATED, get_data_store(state));
    Ok(())
}

#[tauri::command(async)]
pub fn clear_audio_cache(app_handle: AppHandle) -> Result<(), String> {
    match audio::clear_audio_cache(&app_handle) {
        Ok(_) => Ok(()),
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
pub async fn rebuild_audio_cache(
    app_handle: AppHandle,
    state: State<'_, Mutex<LocalStore>>,
) -> Result<(), String> {
    let mut state_mutex = state.lock().into_future().await;
    let state_mutex_ref = state_mutex.borrow_mut();
    let state = state_mutex_ref.deref_mut();

    if let Err(clear_error) = audio::clear_audio_cache(&app_handle) {
        return Err(clear_error.to_string());
    }

    let audio_synthesizer = polly::client::create_polly_client().await;
    let audio_synthesizer_ref = &audio_synthesizer;
    let app_handle_ref = &app_handle;

    let vs_str = VEHICLE_SPEECH.to_string();
    let vs_hash_value = audio::get_string_hash(&vs_str);
    if let Ok(vs_resource) = polly::synthesize::synthesize(
        audio_synthesizer_ref,
        &polly::synthesize::Synthesizable::Pattern(vs_str),
    )
    .await
    {
        let _ = audio::put_audio_cache(
            app_handle_ref,
            &vs_hash_value,
            vs_resource.to_vec().borrow_mut(),
        );
    }

    let ss_str = STAFF_SPEECH.to_string();
    let ss_hash_value = audio::get_string_hash(&ss_str);
    if let Ok(ss_resource) = polly::synthesize::synthesize(
        audio_synthesizer_ref,
        &polly::synthesize::Synthesizable::Pattern(ss_str),
    )
    .await
    {
        let _ = audio::put_audio_cache(
            app_handle_ref,
            &ss_hash_value,
            ss_resource.to_vec().borrow_mut(),
        );
    }

    let occurrence_list = state.get_occurrence_list();
    if occurrence_list.is_ok() {
        let _occurrence_cache: Result<Vec<()>, ()> = try_join_all(
            occurrence_list
                .unwrap()
                .into_iter()
                .map(|occurrence| async move {
                    let audio_resouce = polly::synthesize::synthesize(
                        audio_synthesizer_ref,
                        &polly::synthesize::Synthesizable::Occurrence(occurrence.name),
                    )
                    .await;
                    if let Ok(audio_data) = audio_resouce {
                        let _ = audio::put_audio_cache(
                            app_handle_ref,
                            &occurrence.internal_id,
                            audio_data.to_vec().borrow_mut(),
                        );
                    }

                    Ok(())
                }),
        )
        .await;
    }

    let vehicle_list = state.get_vehicle_list();
    if vehicle_list.is_ok() {
        let _vehicle_cache: Result<Vec<()>, ()> =
            try_join_all(vehicle_list.unwrap().into_iter().map(|vehicle| async move {
                let audio_resouce = polly::synthesize::synthesize(
                    audio_synthesizer_ref,
                    &polly::synthesize::Synthesizable::Vehicle(vehicle.label),
                )
                .await;
                if let Ok(audio_data) = audio_resouce {
                    let _ = audio::put_audio_cache(
                        app_handle_ref,
                        &vehicle.internal_id,
                        audio_data.to_vec().borrow_mut(),
                    );
                }

                Ok(())
            }))
            .await;
    }

    let staff_list = state.get_staff_list();
    if staff_list.is_ok() {
        let _staff_cache: Result<Vec<()>, ()> =
            try_join_all(staff_list.unwrap().into_iter().map(|staff| async move {
                let audio_resouce = polly::synthesize::synthesize(
                    audio_synthesizer_ref,
                    &polly::synthesize::Synthesizable::Staff(staff.label),
                )
                .await;
                if let Ok(audio_data) = audio_resouce {
                    let _ = audio::put_audio_cache(
                        app_handle_ref,
                        &staff.internal_id,
                        audio_data.to_vec().borrow_mut(),
                    );
                }

                Ok(())
            }))
            .await;
    }

    Ok(())
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
    } else if let Err(err) = WindowBuilder::new(
        &app_handle,
        "fvp",
        WindowUrl::App("src/fvp/index.html".into()),
    )
    .title("Firefight Central - Painel de recursos")
    .inner_size(800.0, 600.0)
    .closable(true)
    .decorations(true)
    .maximizable(true)
    .maximized(true)
    .minimizable(true)
    .resizable(true)
    .transparent(false)
    .build()
    {
        return Err(err.to_string());
    }

    Ok(())
}

#[tauri::command(async)]
pub fn open_settings(app_handle: AppHandle, left: f64, top: f64) -> Result<(), String> {
    // Already open?
    if let Some(wnd) = app_handle.get_window("settings") {
        if let Err(position_error) = wnd.set_position(tauri::Position::Logical(LogicalPosition {
            x: left,
            y: top,
        })) {
            return Err(position_error.to_string());
        }
        if let Err(show_error) = wnd.show() {
            return Err(show_error.to_string());
        }
        if let Err(focus_error) = wnd.set_focus() {
            return Err(focus_error.to_string());
        }
    // Else try create
    } else if let Err(err) = WindowBuilder::new(
        &app_handle,
        "settings",
        WindowUrl::App("src/settings/index.html".into()),
    )
    .title("Firefight Central - Configurações")
    .inner_size(200.0, 200.0)
    .position(left, top)
    .decorations(true)
    .closable(true)
    .minimizable(false)
    .maximizable(false)
    .resizable(false)
    .transparent(false)
    .build()
    {
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

/**
 * Audio Section
 */

async fn synthesize_pattern(
    app_handle: &AppHandle,
    syntherizer: &aws_sdk_polly::Client,
    str_value: &String,
) -> anyhow::Result<File> {
    let hash_value = audio::get_string_hash(str_value);
    let mut audio_data = audio::get_audio_cache(app_handle, &hash_value);

    if audio_data.is_err() {
        let audio_resource = polly::synthesize::synthesize(
            syntherizer,
            &polly::synthesize::Synthesizable::Pattern(str_value.clone()),
        )
        .await?;
        let _ = audio::put_audio_cache(
            app_handle,
            &hash_value,
            audio_resource.to_vec().borrow_mut(),
        );
        audio_data = audio::get_audio_cache(app_handle, &hash_value);
    }

    audio_data
}

#[tauri::command]
pub async fn alert(
    app_handle: AppHandle,
    state: State<'_, Mutex<LocalStore>>,
    occurrence_id: String,
    vehicle_assignment_map: HashMap<String, Vec<String>>,
) -> Result<(), String> {
    println!(
        "Alert command received, vehicle_staff_assignment {:?}, occurrenceId: {}",
        vehicle_assignment_map, occurrence_id
    );

    let mut state_mutex = state.lock().into_future().await;
    let state_mutex_ref = state_mutex.borrow_mut();
    let state = state_mutex_ref.deref_mut();

    let audio_synthesizer_ref = &polly::client::create_polly_client().await;
    let state_ref = &state;
    let app_handle_ref = &app_handle;

    // Prepare an list of sorted vehicles and respective staff
    let mut vehicle_sets = vehicle_assignment_map
        .into_iter()
        .map(|entry| {
            let (vehicle_id, mut staff_ids) = entry;

            // Sort staff within while mapping
            staff_ids.sort_by(|a, b| {
                let a_value = state
                    .get_staff_label(a)
                    .unwrap_or_default()
                    .parse::<i32>()
                    .unwrap_or_default();
                let b_value = state
                    .get_staff_label(b)
                    .unwrap_or_default()
                    .parse::<i32>()
                    .unwrap_or_default();

                if a_value == b_value {
                    a.cmp(b)
                } else {
                    a_value.cmp(&b_value)
                }
            });

            (vehicle_id, staff_ids)
        })
        .collect::<Vec<(String, Vec<String>)>>();

    vehicle_sets.sort_by(|(a, _sa), (b, _sb)| {
        let a_cap = state.get_vehicle_capacity(a).unwrap_or_default();
        let b_cap = state.get_vehicle_capacity(b).unwrap_or_default();

        if a_cap.is_some() && b_cap.is_none() {
            return Ordering::Less;
        }
        if b_cap.is_some() && a_cap.is_none() {
            return Ordering::Greater;
        }

        let a_cap = a_cap.unwrap_or_default();
        let b_cap = b_cap.unwrap_or_default();

        // Larger capacity first, so b_cap cmp with a_cap
        if a_cap != b_cap {
            return b_cap.cmp(&a_cap);
        }

        let mut a_value = state
            .get_vehicle_label(a)
            .unwrap_or_default()
            .to_uppercase();
        a_value.retain(|c| !c.is_whitespace());

        let mut b_value = state.get_staff_label(b).unwrap_or_default().to_uppercase();
        b_value.retain(|c| !c.is_whitespace());

        a_value.cmp(&b_value)
    });

    // Prepare audio audio
    let audio_cues = try_join_all(vehicle_sets.into_iter().map(
        |(vehicle_id, staff_ids)| async move {
            let mut vehicle_audio_data = audio::get_audio_cache(app_handle_ref, &vehicle_id);
            // Try to synthesize and cache
            if vehicle_audio_data.is_err() {
                let mut vehicle_label = state_ref.get_vehicle_label(&vehicle_id)?.clone();
                vehicle_label.retain(|c| !c.is_whitespace());

                let audio_resouce = polly::synthesize::synthesize(
                    audio_synthesizer_ref,
                    &polly::synthesize::Synthesizable::Vehicle(vehicle_label),
                )
                .await?;
                let _ =
                    audio::put_audio_cache(app_handle_ref, &vehicle_id, &audio_resouce.to_vec());
                vehicle_audio_data = audio::get_audio_cache(app_handle_ref, &vehicle_id)
            }

            // Still failed? Give up
            if vehicle_audio_data.is_err() {
                return Err(vehicle_audio_data.unwrap_err());
            }

            let staff_audio_data = try_join_all(staff_ids.into_iter().map(|staff_id| async move {
                let mut staff_audio_data = audio::get_audio_cache(app_handle_ref, &staff_id);
                // Try to synthesize and cache
                if staff_audio_data.is_err() {
                    let staff_label = state_ref.get_staff_label(&staff_id)?;

                    let audio_resouce = polly::synthesize::synthesize(
                        audio_synthesizer_ref,
                        &polly::synthesize::Synthesizable::Staff(staff_label),
                    )
                    .await?;
                    let _ =
                        audio::put_audio_cache(app_handle_ref, &staff_id, &audio_resouce.to_vec());
                    staff_audio_data = audio::get_audio_cache(app_handle_ref, &staff_id)
                }

                staff_audio_data
            }))
            .await;

            if staff_audio_data.is_err() {
                return Err(staff_audio_data.unwrap_err());
            }

            let vehicle_audio_data = vehicle_audio_data.unwrap();
            let staff_audio_data = staff_audio_data.unwrap();

            Ok((vehicle_audio_data, staff_audio_data))
        },
    ))
    .await;
    if audio_cues.is_err() {
        return Err(audio_cues.unwrap_err().to_string());
    }
    let audio_cues = audio_cues.unwrap();

    // Prepare occurrence audio
    let mut occurrence_cue = audio::get_audio_cache(&app_handle, &occurrence_id);
    if occurrence_cue.is_err() {
        let occurrence_label = state.get_occurrence_name(&occurrence_id);
        if occurrence_label.is_err() {
            return Err(occurrence_label.unwrap_err().to_string());
        }
        let occurrence_entry = occurrence_label.unwrap();

        let audio_resource = polly::synthesize::synthesize(
            audio_synthesizer_ref,
            &polly::synthesize::Synthesizable::Occurrence(occurrence_entry),
        )
        .await;
        if audio_resource.is_err() {
            return Err(audio_resource.unwrap_err().to_string());
        }
        let audio_resource = audio_resource.unwrap();

        let _ = audio::put_audio_cache(&app_handle, &occurrence_id, &audio_resource.to_vec());
        occurrence_cue = audio::get_audio_cache(&app_handle, &occurrence_id)
    }
    if occurrence_cue.is_err() {
        return Err(occurrence_cue.unwrap_err().to_string());
    }
    let occurrence_cue = occurrence_cue.unwrap();

    // Prepare linking audio
    let alert_cue = audio::get_audio_resource(&app_handle, "alert");
    if alert_cue.is_err() {
        return Err(alert_cue.unwrap_err().to_string());
    }
    let alert_cue = alert_cue.unwrap();

    let which_vehicle_cue = synthesize_pattern(
        app_handle_ref,
        audio_synthesizer_ref,
        &String::from(VEHICLE_SPEECH),
    )
    .await;
    if which_vehicle_cue.is_err() {
        return Err(which_vehicle_cue.unwrap_err().to_string());
    }
    let which_staff_cue = synthesize_pattern(
        app_handle_ref,
        audio_synthesizer_ref,
        &String::from(STAFF_SPEECH),
    )
    .await;
    if which_staff_cue.is_err() {
        return Err(which_staff_cue.unwrap_err().to_string());
    }

    // Get a output stream handle to the default physical sound device
    let (_stream, stream_handle) = OutputStream::try_default().unwrap();
    let sink = rodio::Sink::try_new(&stream_handle).unwrap();

    // Enqueue
    // Alert
    sink.append(Decoder::new(BufReader::new(alert_cue)).unwrap());
    sink.append(Decoder::new(BufReader::new(occurrence_cue)).unwrap());

    audio_cues
        .into_iter()
        .for_each(|(vehicle_cue, staff_cues)| {
            let vehicle_start = audio::get_audio_cache(
                &app_handle,
                &audio::get_string_hash(&String::from(VEHICLE_SPEECH)),
            )
            .unwrap();
            sink.append(Decoder::new(BufReader::new(vehicle_start)).unwrap());
            sink.append(Decoder::new(BufReader::new(vehicle_cue)).unwrap());

            if !staff_cues.is_empty() {
                let staff_start = audio::get_audio_cache(
                    &app_handle,
                    &audio::get_string_hash(&String::from(STAFF_SPEECH)),
                )
                .unwrap();
                sink.append(Decoder::new(BufReader::new(staff_start)).unwrap());

                staff_cues.into_iter().for_each(|staff_cue| {
                    sink.append(Decoder::new(BufReader::new(staff_cue)).unwrap())
                });
            }
        });

    sink.sleep_until_end();

    Ok(())
}
