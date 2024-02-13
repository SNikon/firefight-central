use std::borrow::BorrowMut;
use std::ops::DerefMut;
use std::sync::Mutex;
use std::time;

use tauri::{AppHandle, Manager, State};

use super::events::STATE_UPDATED;
use super::types::{Vehicle, FirefightDataManager, DataStore, Occurrence, ActiveOccurrence, Staff};
use super::local_store::{get_data_store, LocalStore};

#[tauri::command(async)]
pub fn get_store(
	state: State<'_, Mutex<LocalStore>>
) -> Result<DataStore, String> {
    let mut state_mutex = state.lock().unwrap();
    let state_mutex_ref = state_mutex.borrow_mut();
    let state = state_mutex_ref.deref_mut();

    Ok(get_data_store(state))
}

#[tauri::command(async)]
pub fn create_active_occurrence(
    app_handle: AppHandle,
	state: State<'_, Mutex<LocalStore>>,
	mut active_occurrence: ActiveOccurrence
) -> Result<(), String> {
	let mut state_mutex = state.lock().unwrap();
	let state_mutex_ref = state_mutex.borrow_mut();
	let state = state_mutex_ref.deref_mut();

	active_occurrence.creation_time = Some(time::UNIX_EPOCH.elapsed().unwrap().as_millis());
	let create_result = state.create_active_occurrence(active_occurrence);
	if let Err(create_error) = create_result { return Err(create_error.to_string()); }

	let _ = app_handle.emit_all(STATE_UPDATED, get_data_store(state));
	Ok(())
}

#[tauri::command(async)]
pub fn create_occurrence(
    app_handle: AppHandle,
	state: State<'_, Mutex<LocalStore>>,
	occurrence: Occurrence
) -> Result<(), String> {
	let mut state_mutex = state.lock().unwrap();
	let state_mutex_ref = state_mutex.borrow_mut();
	let state = state_mutex_ref.deref_mut();

	let create_result = state.create_occurrence(occurrence);
	if let Err(create_error) = create_result { return Err(create_error.to_string()); }

	let _ = app_handle.emit_all(STATE_UPDATED, get_data_store(state));
	Ok(())
}

#[tauri::command(async)]
pub fn create_staff(
    app_handle: AppHandle,
	state: State<'_, Mutex<LocalStore>>,
	staff: Staff
) -> Result<(), String> {
	let mut state_mutex = state.lock().unwrap();
	let state_mutex_ref = state_mutex.borrow_mut();
	let state = state_mutex_ref.deref_mut();

	let create_result = state.create_staff(staff);
	if let Err(create_error) = create_result { return Err(create_error.to_string()); }

	let _ = app_handle.emit_all(STATE_UPDATED, get_data_store(state));
	Ok(())
}

#[tauri::command(async)]
pub fn create_vehicle(
    app_handle: AppHandle,
	state: State<'_, Mutex<LocalStore>>,
    vehicle: Vehicle
) -> Result<(), String> {
    let mut state_mutex = state.lock().unwrap();
    let state_mutex_ref = state_mutex.borrow_mut();
    let state = state_mutex_ref.deref_mut();

    let create_result = state.create_vehicle(vehicle);
    if let Err(create_error) = create_result { return Err(create_error.to_string()); }

	let _ = app_handle.emit_all(STATE_UPDATED, get_data_store(state));
	Ok(())
}

#[tauri::command(async)]
pub fn update_active_occurrence(
    app_handle: AppHandle,
	state: State<'_, Mutex<LocalStore>>,
	active_occurrence: ActiveOccurrence
) -> Result<(), String> {
	let mut state_mutex = state.lock().unwrap();
	let state_mutex_ref = state_mutex.borrow_mut();
	let state = state_mutex_ref.deref_mut();

	let update_result = state.update_active_occurrence(active_occurrence.internal_id.clone(), active_occurrence);
	if let Err(update_error) = update_result { return Err(update_error.to_string()); }

	let _ = app_handle.emit_all(STATE_UPDATED, get_data_store(state));
	Ok(())
}

#[tauri::command(async)]
pub fn update_occurrence(
    app_handle: AppHandle,
	state: State<'_, Mutex<LocalStore>>,
	occurrence: Occurrence
) -> Result<(), String> {
	let mut state_mutex = state.lock().unwrap();
	let state_mutex_ref = state_mutex.borrow_mut();
	let state = state_mutex_ref.deref_mut();

	let update_result = state.update_occurrence(occurrence.internal_id.clone(), occurrence);
	if let Err(update_error) = update_result { return Err(update_error.to_string()); }

	let _ = app_handle.emit_all(STATE_UPDATED, get_data_store(state));
	Ok(())
}

#[tauri::command(async)]
pub fn update_staff(
    app_handle: AppHandle,
	state: State<'_, Mutex<LocalStore>>,
	staff: Staff
) -> Result<(), String> {
	let mut state_mutex = state.lock().unwrap();
	let state_mutex_ref = state_mutex.borrow_mut();
	let state = state_mutex_ref.deref_mut();

	let update_result = state.update_staff(staff.internal_id.clone(), staff);
	if let Err(update_error) = update_result { return Err(update_error.to_string()); }

	let _ = app_handle.emit_all(STATE_UPDATED, get_data_store(state));
	Ok(())
}

#[tauri::command(async)]
pub fn update_vehicle(
    app_handle: AppHandle,
	state: State<'_, Mutex<LocalStore>>,
	vehicle: Vehicle
) -> Result<(), String> {
	let mut state_mutex = state.lock().unwrap();
	let state_mutex_ref = state_mutex.borrow_mut();
	let state = state_mutex_ref.deref_mut();

	let update_result = state.update_vehicle(vehicle.internal_id.clone(), vehicle);
	if let Err(update_error) = update_result { return Err(update_error.to_string()); }

	let _ = app_handle.emit_all(STATE_UPDATED, get_data_store(state));
	Ok(())
}

#[tauri::command(async)]
pub fn delete_active_occurrence(
    app_handle: AppHandle,
	state: State<'_, Mutex<LocalStore>>,
	active_occurrence_id: String
) -> Result<(), String> {
	let mut state_mutex = state.lock().unwrap();
	let state_mutex_ref = state_mutex.borrow_mut();
	let state = state_mutex_ref.deref_mut();

	let delete_result = state.delete_active_occurrence(active_occurrence_id);
	if let Err(delete_error) = delete_result { return Err(delete_error.to_string()); }

	let _ = app_handle.emit_all(STATE_UPDATED, get_data_store(state));
	Ok(())
}

#[tauri::command(async)]
pub fn delete_occurrence(
    app_handle: AppHandle,
	state: State<'_, Mutex<LocalStore>>,
	occurrence_id: String
) -> Result<(), String> {
	let mut state_mutex = state.lock().unwrap();
	let state_mutex_ref = state_mutex.borrow_mut();
	let state = state_mutex_ref.deref_mut();

	let delete_result = state.delete_occurrence(occurrence_id);
	if let Err(delete_error) = delete_result { return Err(delete_error.to_string()); }

	let _ = app_handle.emit_all(STATE_UPDATED, get_data_store(state));
	Ok(())
}

#[tauri::command(async)]
pub fn delete_staff(
    app_handle: AppHandle,
	state: State<'_, Mutex<LocalStore>>,
	staff_id: String
) -> Result<(), String> {
	let mut state_mutex = state.lock().unwrap();
	let state_mutex_ref = state_mutex.borrow_mut();
	let state = state_mutex_ref.deref_mut();

	let delete_result = state.delete_staff(staff_id);
	if let Err(delete_error) = delete_result { return Err(delete_error.to_string()); }

	let _ = app_handle.emit_all(STATE_UPDATED, get_data_store(state));
	Ok(())
}

#[tauri::command(async)]
pub fn delete_vehicle(
    app_handle: AppHandle,
	state: State<'_, Mutex<LocalStore>>,
	vehicle_id: String
) -> Result<(), String> {
	let mut state_mutex = state.lock().unwrap();
	let state_mutex_ref = state_mutex.borrow_mut();
	let state = state_mutex_ref.deref_mut();

	let delete_result = state.delete_vehicle(vehicle_id);
	if let Err(delete_error) = delete_result { return Err(delete_error.to_string()); }

	let _ = app_handle.emit_all(STATE_UPDATED, get_data_store(state));
	Ok(())
}

#[tauri::command(async)]
pub fn set_staff_shift(
	app_handle: AppHandle,
	state: State<'_, Mutex<LocalStore>>,
	available_staff: Vec<String>
) -> Result<(), String> {
	let mut state_mutex = state.lock().unwrap();
	let state_mutex_ref = state_mutex.borrow_mut();
	let state = state_mutex_ref.deref_mut();

	let update_result = state.set_staff_shift(available_staff);
	if let Err(update_error) = update_result { return Err(update_error.to_string()); }

	let _ = app_handle.emit_all(STATE_UPDATED, get_data_store(state));
	Ok(())
}
