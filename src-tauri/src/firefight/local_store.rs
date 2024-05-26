use std::collections::HashMap;
use anyhow::Context;
use tauri::AppHandle;
use tauri_plugin_store::StoreBuilder;

use super::types::{ActiveOccurrence, DataStore, FirefightDataManager, Occurrence, Staff, StaffState, Vehicle, VehicleState};

pub type LocalStore = tauri_plugin_store::Store<tauri::Wry>;

pub fn create_store(app_handle: AppHandle) -> LocalStore {
	let store_path = app_handle.path_resolver().app_local_data_dir().unwrap().join("data_store.dat");
	let mut firefight_store = StoreBuilder::new(app_handle, store_path).build();
	
	if let Err(load_error) = firefight_store.load() {
		println!("Store not found {:?} - Using default.", load_error);

		let default_store = DataStore::default();
		if let Err(update_error) = firefight_store.insert(String::from("active_occurrences"), serde_json::json!(default_store.active_occurrences)) { println!("Failed to update store: {}", update_error); }
		if let Err(update_error) = firefight_store.insert(String::from("occurrences"), serde_json::json!(default_store.occurrences)) { println!("Failed to update store: {}", update_error); }
		if let Err(update_error) = firefight_store.insert(String::from("staff"), serde_json::json!(default_store.staff)) { println!("Failed to update store: {}", update_error); }
		if let Err(update_error) = firefight_store.insert(String::from("vehicles"), serde_json::json!(default_store.vehicles)) { println!("Failed to update store: {}", update_error); }
		
		if let Err(save_error) = firefight_store.save() { println!("Failed to save store: {}", save_error); }
	}

	firefight_store
}

pub fn get_data_store(state: &mut LocalStore) -> DataStore {
	DataStore {
		active_occurrences: serde_json::from_value(state.get("active_occurrences").unwrap().clone()).unwrap(),
		occurrences: serde_json::from_value(state.get("occurrences").unwrap().clone()).unwrap(),
		staff: serde_json::from_value(state.get("staff").unwrap().clone()).unwrap(),
		vehicles: serde_json::from_value(state.get("vehicles").unwrap().clone()).unwrap(),
	}
}

impl FirefightDataManager for LocalStore {
    fn get_active_occurrence(&self, occurrence_id: &String) -> anyhow::Result<ActiveOccurrence> {
		let active_occurrences_value = self.get("active_occurrences").with_context(|| "Unable to read active occurrences from store".to_string())?.clone();
		let active_occurrence_store = serde_json::from_value::<HashMap<String, ActiveOccurrence>>(active_occurrences_value).with_context(|| "Failed to deserialize active occurrences".to_string())?;

		let found_value = active_occurrence_store.get(occurrence_id).cloned().with_context(|| format!("No active occurrence found with id: {}", occurrence_id))?;
		Ok(found_value)
    }

    fn get_active_occurrence_by_staff(&self, staff_id: &String) -> anyhow::Result<ActiveOccurrence> {
		let active_occurrences_value = self.get("active_occurrences").with_context(|| "Unable to read active occurrences from store".to_string())?.clone();
		let active_occurrence_store = serde_json::from_value::<HashMap<String, ActiveOccurrence>>(active_occurrences_value).with_context(|| "Failed to deserialize active occurrences".to_string())?;

		let found_value = active_occurrence_store.values()
			.find(|active_occurrence| active_occurrence.staff_ids.contains(staff_id))
			.cloned()
			.with_context(|| format!("No active occurrence found with staff id: {}", staff_id))?;

		Ok(found_value)
    }

    fn get_active_occurrence_by_vehicle(&self, vehicle_id: &String) -> anyhow::Result<ActiveOccurrence> {
		let active_occurrences_value = self.get("active_occurrences").with_context(|| "Unable to read active occurrences from store".to_string())?.clone();
		let active_occurrence_store = serde_json::from_value::<HashMap<String, ActiveOccurrence>>(active_occurrences_value).with_context(|| "Failed to deserialize active occurrences".to_string())?;

		let found_value = active_occurrence_store.values()
			.find(|active_occurrence| active_occurrence.vehicle_ids.contains(vehicle_id))
			.cloned()
			.with_context(|| format!("No active occurrence found with vehicle id: {}", vehicle_id))?;

		Ok(found_value)
	}

    fn get_active_occurrence_list(&self) -> anyhow::Result<Vec<ActiveOccurrence>> {
		let active_occurrences_value = self.get("active_occurrences").with_context(|| "Unable to read active occurrences from store".to_string())?.clone();
		let active_occurrence_store = serde_json::from_value::<HashMap<String, ActiveOccurrence>>(active_occurrences_value).with_context(|| "Failed to deserialize active occurrences".to_string())?;

		Ok(active_occurrence_store.values().cloned().collect())
	}

    fn get_active_occurrence_list_by_occurrence(&self, occurrence_id: &String) -> anyhow::Result<Vec<ActiveOccurrence>> {
		let active_occurrences_value = self.get("active_occurrences").with_context(|| "Unable to read active occurrences from store".to_string())?.clone();
		let active_occurrence_store = serde_json::from_value::<HashMap<String, ActiveOccurrence>>(active_occurrences_value).with_context(|| "Failed to deserialize active occurrences".to_string())?;

		let found_values = active_occurrence_store.values()
			.filter(|active_occurrence| active_occurrence.occurrence_id == *occurrence_id)
			.cloned()
			.collect::<Vec<ActiveOccurrence>>();

		Ok(found_values)
    }

    fn get_occurrence(&self, occurrence_id: &String) -> anyhow::Result<Occurrence> {
		let occurrences_value = self.get("occurrences").with_context(|| "Unable to read occurrences from store".to_string())?.clone();
		let occurrence_store = serde_json::from_value::<HashMap<String, Occurrence>>(occurrences_value).with_context(|| "Failed to deserialize occurrences".to_string())?;

		let found_value = occurrence_store.get(occurrence_id).cloned().with_context(|| format!("No occurrence found with id: {}", occurrence_id))?;
		Ok(found_value)
    }

	fn get_occurrence_name(&self, occurrence_id: &String) -> anyhow::Result<String> {
		let occurrences_value = self.get("occurrences").with_context(|| "Unable to read occurrences from store".to_string())?.clone();
		let occurrence_store = serde_json::from_value::<HashMap<String, Occurrence>>(occurrences_value).with_context(|| "Failed to deserialize occurrences".to_string())?;

		let found_value = occurrence_store.get(occurrence_id).with_context(|| format!("No occurrence found with id: {}", occurrence_id))?.name.clone();
		Ok(found_value)
    }

    fn get_occurrence_list(&self) -> anyhow::Result<Vec<Occurrence>> {
		let occurrences_value = self.get("occurrences").with_context(|| "Unable to read occurrences from store".to_string())?.clone();
		let occurrence_store = serde_json::from_value::<HashMap<String, Occurrence>>(occurrences_value).with_context(|| "Failed to deserialize occurrences".to_string())?;

		Ok(occurrence_store.values().cloned().collect())
	}

    fn get_staff(&self, staff_id: &String) -> anyhow::Result<Staff> {
		let staff_value = self.get("staff").with_context(|| "Unable to read staff from store".to_string())?.clone();
		let staff_store = serde_json::from_value::<HashMap<String, Staff>>(staff_value).with_context(|| "Failed to deserialize staff".to_string())?;

		let found_value = staff_store.get(staff_id).cloned().with_context(|| format!("No staff found with id: {}", staff_id))?;
		Ok(found_value)
    }

	fn get_staff_label(&self, staff_id: &String) -> anyhow::Result<String> {
		let staff_value = self.get("staff").with_context(|| "Unable to read staff from store".to_string())?.clone();
		let staff_store = serde_json::from_value::<HashMap<String, Staff>>(staff_value).with_context(|| "Failed to deserialize staff".to_string())?;

		let found_value = staff_store.get(staff_id).with_context(|| format!("No staff found with id: {}", staff_id)).map(|staff| staff.label.clone())?;
		Ok(found_value)
    }
	

    fn get_staff_list(&self) -> anyhow::Result<Vec<Staff>> {
		let staff_value = self.get("staff").with_context(|| "Unable to read staff from store".to_string())?.clone();
		let staff_store = serde_json::from_value::<HashMap<String, Staff>>(staff_value).with_context(|| "Failed to deserialize staff".to_string())?;

		Ok(staff_store.values().cloned().collect())
	}

    fn get_vehicle_list(&self) -> anyhow::Result<Vec<Vehicle>> {
		let vehicles_value = self.get("vehicles").with_context(|| "Unable to read vehicles from store".to_string())?.clone();
		let vehicle_store = serde_json::from_value::<HashMap<String, Vehicle>>(vehicles_value).with_context(|| "Failed to deserialize vehicles".to_string())?;

		Ok(vehicle_store.values().cloned().collect())
	}

    fn get_vehicle(&self, vehicle_id: &String) -> anyhow::Result<Vehicle> {
		let vehicles_value = self.get("vehicles").with_context(|| "Unable to read vehicles from store".to_string())?.clone();
		let vehicle_store = serde_json::from_value::<HashMap<String, Vehicle>>(vehicles_value).with_context(|| "Failed to deserialize vehicles".to_string())?;

		let found_value = vehicle_store.get(vehicle_id).cloned().with_context(|| format!("No vehicle found with id: {}", vehicle_id))?;
		Ok(found_value)
	}

	fn get_vehicle_capacity(&self, vehicle_id: &String) -> anyhow::Result<Option<u8>> {
		let vehicles_value = self.get("vehicles").with_context(|| "Unable to read vehicles from store".to_string())?.clone();
		let vehicle_store = serde_json::from_value::<HashMap<String, Vehicle>>(vehicles_value).with_context(|| "Failed to deserialize vehicles".to_string())?;

		let found_value = vehicle_store.get(vehicle_id).with_context(|| format!("No vehicle found with id: {}", vehicle_id)).map(|vehicle| vehicle.capacity)?;
		Ok(found_value)
    }
	
	fn get_vehicle_label(&self, vehicle_id: &String) -> anyhow::Result<String> {
		let vehicles_value = self.get("vehicles").with_context(|| "Unable to read vehicles from store".to_string())?.clone();
		let vehicle_store = serde_json::from_value::<HashMap<String, Vehicle>>(vehicles_value).with_context(|| "Failed to deserialize vehicles".to_string())?;

		let found_value = vehicle_store.get(vehicle_id).with_context(|| format!("No vehicle found with id: {}", vehicle_id)).map(|vehicle| vehicle.label.clone())?;
		Ok(found_value)
    }

    fn create_active_occurrence(&mut self, mut occurrence: ActiveOccurrence) -> anyhow::Result<String> {
		let active_occurrences_value = self.get("active_occurrences").with_context(|| "Unable to read active occurrences from store".to_string())?.clone();
		let mut active_occurrence_store = serde_json::from_value::<HashMap<String, ActiveOccurrence>>(active_occurrences_value).with_context(|| "Failed to deserialize active occurrences".to_string())?;

		// Validate other active ocurrences
		active_occurrence_store.iter_mut().for_each(|(_, active_occurrence)| {
			active_occurrence.staff_ids.iter().any(|staff_id| occurrence.staff_ids.contains(staff_id)).then(|| {
				active_occurrence.staff_ids.retain(|staff_id| !occurrence.staff_ids.contains(staff_id));
			});
			active_occurrence.vehicle_ids.iter().any(|vehicle_id| occurrence.vehicle_ids.contains(vehicle_id)).then(|| {
				active_occurrence.vehicle_ids.retain(|vehicle_id| !occurrence.vehicle_ids.contains(vehicle_id));
			});
		});

		// Create active ocurrence and update store
		let active_occurrence_id = uuid::Uuid::new_v4().to_string();
		occurrence.internal_id = active_occurrence_id.clone();
		active_occurrence_store.insert(active_occurrence_id.clone(), occurrence.clone());
				
		self.insert(String::from("active_occurrences"), serde_json::json!(active_occurrence_store)).with_context(|| format!("Failed to create active occurrence {} with value {:?}", &active_occurrence_id, active_occurrence_store.get(&active_occurrence_id)))?;
		
		// Update vehicles
		let vehicles_value = self.get("vehicles").with_context(|| "Unable to read vehicles from store".to_string())?.clone();
		let mut vehicle_store = serde_json::from_value::<HashMap<String, Vehicle>>(vehicles_value).with_context(|| "Failed to deserialize vehicles".to_string())?;
		
		occurrence.vehicle_ids.iter().for_each(|vehicle_id| {
			let vehicle = vehicle_store.get_mut(vehicle_id).with_context(|| format!("Failed to get vehicle with id: {}", vehicle_id)).unwrap();
			vehicle.state = VehicleState::Dispatched;
		});

		self.insert(String::from("vehicles"), serde_json::json!(vehicle_store)).with_context(|| format!("Failed to update vehicles with value {:?}", vehicle_store))?;

		// Update staff
		let staff_value = self.get("staff").with_context(|| "Unable to read staff from store".to_string())?.clone();
		let mut staff_store = serde_json::from_value::<HashMap<String, Staff>>(staff_value).with_context(|| "Failed to deserialize staff".to_string())?;

		occurrence.staff_ids.iter().for_each(|staff_id| {
			let staff = staff_store.get_mut(staff_id).with_context(|| format!("Failed to get staff with id: {}", staff_id)).unwrap();
			staff.state = StaffState::Dispatched;
		});

		self.insert(String::from("staff"), serde_json::json!(staff_store)).with_context(|| format!("Failed to update staff with value {:?}", staff_store))?;

		self.save().with_context(|| "Failed to save store while creating active occurrence".to_string())?;
		Ok(active_occurrence_id)
    }

    fn create_occurrence(&mut self, mut occurrence: Occurrence) -> anyhow::Result<String> {
		let occurrences_value = self.get("occurrences").with_context(|| "Unable to read occurrences from store".to_string())?.clone();
		let mut occurrence_store = serde_json::from_value::<HashMap<String, Occurrence>>(occurrences_value).with_context(|| "Failed to deserialize occurrences".to_string())?;

		let occurrence_id = uuid::Uuid::new_v4().to_string();
		occurrence.internal_id = occurrence_id.clone();
		occurrence_store.insert(occurrence_id.clone(), occurrence);

		self.insert(String::from("occurrences"), serde_json::json!(occurrence_store)).with_context(|| format!("Failed to create occurrence {} with value {:?}", &occurrence_id, occurrence_store.get(&occurrence_id)))?;
		self.save().with_context(|| "Failed to save store while creating occurrence".to_string())?;

		Ok(occurrence_id)
    }

    fn create_staff(&mut self, mut staff: Staff) -> anyhow::Result<String> {
		let staff_value = self.get("staff").with_context(|| "Unable to read staff from store".to_string())?.clone();
		let mut staff_store = serde_json::from_value::<HashMap<String, Staff>>(staff_value).with_context(|| "Failed to deserialize staff".to_string())?;

		let staff_id = uuid::Uuid::new_v4().to_string();
		staff.internal_id = staff_id.clone();
		staff_store.insert(staff_id.clone(), staff);

		self.insert(String::from("staff"), serde_json::json!(staff_store)).with_context(|| format!("Failed to create staff {} with value {:?}", &staff_id, staff_store.get(&staff_id)))?;
		self.save().with_context(|| "Failed to save store while creating staff".to_string())?;

		Ok(staff_id)
	}

    fn create_vehicle(&mut self, mut vehicle: Vehicle) -> anyhow::Result<String> {
		let vehicles_value = self.get("vehicles").with_context(|| "Unable to read vehicles from store".to_string())?.clone();
		let mut vehicle_store = serde_json::from_value::<HashMap<String, Vehicle>>(vehicles_value).with_context(|| "Failed to deserialize vehicles".to_string())?;

		let vehicle_id = uuid::Uuid::new_v4().to_string();
		vehicle.internal_id = vehicle_id.clone();
		vehicle_store.insert(vehicle_id.clone(), vehicle);

		self.insert(String::from("vehicles"), serde_json::json!(vehicle_store)).with_context(|| format!("Failed to create vehicle {} with value {:?}", &vehicle_id, vehicle_store.get(&vehicle_id).unwrap()))?;
		self.save().with_context(|| "Failed to save store while creating vehicle".to_string())?;

		Ok(vehicle_id)
	}

    fn update_active_occurrence(&mut self, active_occurrence_id: &String, active_occurrence: ActiveOccurrence) -> anyhow::Result<Option<ActiveOccurrence>> {
		let active_occurrences_value = self.get("active_occurrences").with_context(|| "Unable to read active occurrences from store".to_string())?.clone();
		let mut active_occurrence_store = serde_json::from_value::<HashMap<String, ActiveOccurrence>>(active_occurrences_value).with_context(|| "Failed to deserialize active occurrences".to_string())?;
		
		let previous_active_occurrence = active_occurrence_store.insert(active_occurrence_id.clone(), active_occurrence.clone()).unwrap();
		self.insert(String::from("active_occurrences"), serde_json::json!(active_occurrence_store)).with_context(|| format!("Failed to update active occurrence {} with value {:?}", active_occurrence_id, active_occurrence_store.get(active_occurrence_id).unwrap()))?;

		let removed_vehicles = previous_active_occurrence.vehicle_ids.iter().filter(|vehicle_id| !active_occurrence.vehicle_ids.contains(vehicle_id)).collect::<Vec<&String>>();
		let removed_staff = previous_active_occurrence.staff_ids.iter().filter(|staff_id| !active_occurrence.staff_ids.contains(staff_id)).collect::<Vec<&String>>();

		// Update vehicles
		let vehicles_value = self.get("vehicles").with_context(|| "Unable to read vehicles from store".to_string())?.clone();
		let mut vehicle_store = serde_json::from_value::<HashMap<String, Vehicle>>(vehicles_value).with_context(|| "Failed to deserialize vehicles".to_string())?;
		
		removed_vehicles.iter().for_each(|vehicle_id| {
			let vehicle = vehicle_store.get_mut(*vehicle_id).with_context(|| format!("Failed to get vehicle with id: {}", vehicle_id)).unwrap();
			vehicle.state = VehicleState::Available;
		});

		active_occurrence.vehicle_ids.iter().for_each(|vehicle_id| {
			let vehicle = vehicle_store.get_mut(vehicle_id).with_context(|| format!("Failed to get vehicle with id: {}", vehicle_id)).unwrap();
			vehicle.state = VehicleState::Dispatched;
		});

		self.insert(String::from("vehicles"), serde_json::json!(vehicle_store)).with_context(|| format!("Failed to update vehicles with value {:?}", vehicle_store))?;

		// Update staff
		let staff_value = self.get("staff").with_context(|| "Unable to read staff from store".to_string())?.clone();
		let mut staff_store = serde_json::from_value::<HashMap<String, Staff>>(staff_value).with_context(|| "Failed to deserialize staff".to_string())?;

		removed_staff.iter().for_each(|staff_id| {
			let staff = staff_store.get_mut(*staff_id).with_context(|| format!("Failed to get staff with id: {}", staff_id)).unwrap();
			staff.state = StaffState::Available;
		});

		active_occurrence.staff_ids.iter().for_each(|staff_id| {
			let staff = staff_store.get_mut(staff_id).with_context(|| format!("Failed to get staff with id: {}", staff_id)).unwrap();
			staff.state = StaffState::Dispatched;
		});
		self.insert(String::from("staff"), serde_json::json!(staff_store)).with_context(|| format!("Failed to update staff with value {:?}", staff_store))?;
		
		self.save().with_context(|| "Failed to save store while updating active occurrence".to_string())?;

		Ok(Some(previous_active_occurrence))
    }

    fn update_occurrence(&mut self, occurrence_id: &String, occurrence: Occurrence) -> anyhow::Result<Option<Occurrence>> {
		let occurrence_value = self.get("occurrences").with_context(|| "Unable to read occurrences from store".to_string())?.clone();
		let mut occurrence_store = serde_json::from_value::<HashMap<String, Occurrence>>(occurrence_value).with_context(|| "Failed to deserialize occurrences".to_string())?;

		let prev_ocurrence = occurrence_store.insert(occurrence_id.clone(), occurrence);

		self.insert(String::from("occurrences"), serde_json::json!(occurrence_store)).with_context(|| format!("Failed to update occurrence {} with value {:?}", occurrence_id, occurrence_store.get(occurrence_id).unwrap()))?;
		self.save().with_context(|| "Failed to save store while updating occurrence".to_string())?;

		Ok(prev_ocurrence)
    }

    fn update_staff(&mut self, staff_id: &String, staff: Staff) -> anyhow::Result<Option<Staff>> {
		let staff_value = self.get("staff").with_context(|| "Unable to read staff from store".to_string())?.clone();
		let mut staff_store = serde_json::from_value::<HashMap<String, Staff>>(staff_value).with_context(|| "Failed to deserialize staff".to_string())?;

		let prev_staff = staff_store.insert(staff_id.clone(), staff);

		self.insert(String::from("staff"), serde_json::json!(staff_store)).with_context(|| format!("Failed to update staff {} with value {:?}", staff_id, staff_store.get(staff_id).unwrap()))?;
		self.save().with_context(|| "Failed to save store while updating staff".to_string())?;

		Ok(prev_staff)
    }

    fn update_vehicle(&mut self, vehicle_id: &String, vehicle: Vehicle) -> anyhow::Result<Option<Vehicle>> {
		let vehicles_value = self.get("vehicles").with_context(|| "Unable to read vehicles from store".to_string())?.clone();
		let mut vehicle_store = serde_json::from_value::<HashMap<String, Vehicle>>(vehicles_value).with_context(|| "Failed to deserialize vehicles".to_string())?;

		let previous_vehicle = vehicle_store.insert(vehicle_id.clone(), vehicle);

		self.insert(String::from("vehicles"), serde_json::json!(vehicle_store)).with_context(|| format!("Failed to update vehicle {} with value {:?}", vehicle_id, vehicle_store.get(vehicle_id)))?;
		self.save().with_context(|| "Failed to save store while updating vehicle".to_string())?;

		Ok(previous_vehicle)
    }

    fn delete_active_occurrence(&mut self, active_occurrence_id: &String) -> anyhow::Result<()> {
		let active_occurrence_value = self.get("active_occurrences").with_context(|| "Unable to read active occurrences from store".to_string())?.clone();
		let mut active_occurrence_store = serde_json::from_value::<HashMap<String, ActiveOccurrence>>(active_occurrence_value).with_context(|| "Failed to deserialize active occurrences".to_string())?;

		if let Some(active_ocurrence) = active_occurrence_store.remove(active_occurrence_id) {
			self.insert(String::from("active_occurrences"), serde_json::json!(active_occurrence_store)).with_context(|| format!("Failed to delete active occurrence {}", active_occurrence_id))?;

			// Update vehicles
			let vehicles_value = self.get("vehicles").with_context(|| "Unable to read vehicles from store".to_string())?.clone();
			let mut vehicle_store = serde_json::from_value::<HashMap<String, Vehicle>>(vehicles_value).with_context(|| "Failed to deserialize vehicles".to_string())?;
			
			active_ocurrence.vehicle_ids.iter().for_each(|vehicle_id| {
				if let Some(vehicle) = vehicle_store.get_mut(vehicle_id) {
					vehicle.state = VehicleState::Available;
				}
			});

			self.insert(String::from("vehicles"), serde_json::json!(vehicle_store)).with_context(|| format!("Failed to update vehicles with value {:?}", vehicle_store))?;

			// Update staff
			let staff_value = self.get("staff").with_context(|| "Unable to read staff from store".to_string())?.clone();
			let mut staff_store = serde_json::from_value::<HashMap<String, Staff>>(staff_value).with_context(|| "Failed to deserialize staff".to_string())?;

			active_ocurrence.staff_ids.iter().for_each(|staff_id| {
				if let Some(staff) = staff_store.get_mut(staff_id) {
					staff.state = StaffState::Available;
				}
			});

			self.insert(String::from("staff"), serde_json::json!(staff_store)).with_context(|| format!("Failed to update staff with value {:?}", staff_store))?;

			self.save().with_context(|| "Failed to save store while deleting active occurrence".to_string())?;
		}

		Ok(())
    }

    fn delete_occurrence(&mut self, occurrence_id: &String) -> anyhow::Result<()> {
		let occurrence_value = self.get("occurrences").with_context(|| "Unable to read occurrences from store".to_string())?.clone();
		let mut occurrence_store = serde_json::from_value::<HashMap<String, Occurrence>>(occurrence_value).with_context(|| "Failed to deserialize occurrences".to_string())?;

		occurrence_store.remove(occurrence_id);

		self.insert(String::from("occurrences"), serde_json::json!(occurrence_store)).with_context(|| format!("Failed to delete occurrence {}", occurrence_id))?;
		self.save().with_context(|| "Failed to save store while deleting occurrence".to_string())?;

		Ok(())
	}

    fn delete_staff(&mut self, staff_id: &String) -> anyhow::Result<()> {
		let staff_value = self.get("staff").with_context(|| "Unable to read staff from store".to_string())?.clone();
		let mut staff_store = serde_json::from_value::<HashMap<String, Staff>>(staff_value).with_context(|| "Failed to deserialize staff".to_string())?;

		let removed_entry = staff_store.remove(staff_id);
		self.insert(String::from("staff"), serde_json::json!(staff_store)).with_context(|| format!("Failed to delete staff {}", staff_id))?;
		
		if let Some(remove_staff) = removed_entry {
			if remove_staff.state == StaffState::Dispatched {
				// Update active occurrence
				let active_occurrence_value = self.get("active_occurrences").with_context(|| "Unable to read active occurrences from store".to_string())?.clone();
				let mut active_occurrence_store = serde_json::from_value::<HashMap<String, ActiveOccurrence>>(active_occurrence_value).with_context(|| "Failed to deserialize active occurrences".to_string())?;

				if let Some(active_occurrence) = active_occurrence_store.values_mut().find(|active_occurrence| active_occurrence.staff_ids.contains(&staff_id)) {
					let staff_idx = active_occurrence.staff_ids.iter().position(|id| id == staff_id);
					active_occurrence.staff_ids.swap_remove(staff_idx.unwrap());
					active_occurrence.vehicle_assignment_map.iter_mut().for_each(|(_, vehicle_staff_ids)| {
						let vehicle_staff_idx = vehicle_staff_ids.iter().position(|id| id == staff_id);
						if let Some(vehicle_staff_idx) = vehicle_staff_idx {
							vehicle_staff_ids.swap_remove(vehicle_staff_idx);
						}
					});
				}
				
				self.insert(String::from("active_occurrences"), serde_json::json!(active_occurrence_store)).with_context(|| format!("Failed to update active occurrences with value {:?}", active_occurrence_store))?;
			}
		}
	
		self.save().with_context(|| "Failed to save store while deleting staff".to_string())?;

		Ok(())
    }

    fn delete_vehicle(&mut self, vehicle_id: &String) -> anyhow::Result<()> {
		let vehicles_value = self.get("vehicles").with_context(|| "Unable to read vehicles from store".to_string())?.clone();
		let mut vehicle_store = serde_json::from_value::<HashMap<String, Vehicle>>(vehicles_value).with_context(|| "Failed to deserialize vehicles".to_string())?;

		let removed_entry = vehicle_store.remove(vehicle_id);
		self.insert(String::from("vehicles"), serde_json::json!(vehicle_store)).with_context(|| format!("Failed to delete vehicle {}", vehicle_id))?;
		
		if let Some(removed_vehicle) = removed_entry {
			if removed_vehicle.state == VehicleState::Dispatched {
				// Update active occurrence
				let active_occurrence_value = self.get("active_occurrences").with_context(|| "Unable to read active occurrences from store".to_string())?.clone();
				let mut active_occurrence_store = serde_json::from_value::<HashMap<String, ActiveOccurrence>>(active_occurrence_value).with_context(|| "Failed to deserialize active occurrences".to_string())?;

				if let Some(active_occurrence) = active_occurrence_store.values_mut().find(|active_occurrence| active_occurrence.vehicle_ids.contains(&vehicle_id)) {
					let vehicle_idx = active_occurrence.vehicle_ids.iter().position(|id| id == vehicle_id);
					active_occurrence.vehicle_ids.swap_remove(vehicle_idx.unwrap());
					active_occurrence.vehicle_assignment_map.remove(vehicle_id);
				}
				
				self.insert(String::from("active_occurrences"), serde_json::json!(active_occurrence_store)).with_context(|| format!("Failed to update active occurrences with value {:?}", active_occurrence_store))?;
			}
		}
		
		self.save().with_context(|| "Failed to save store while deleting vehicle".to_string())?;

		Ok(())
    }

    fn set_staff_shift(&mut self, available_staff: Vec<String>) -> anyhow::Result<()> {
		let staff_value = self.get("staff").with_context(|| "Unable to read staff from store".to_string())?.clone();
		let mut staff_store = serde_json::from_value::<HashMap<String, Staff>>(staff_value).with_context(|| "Failed to deserialize staff".to_string())?;

		staff_store.iter_mut().for_each(|(_, staff)| {
			if (staff.state == StaffState::Available) || (staff.state == StaffState::Unavailable) {
				staff.state = if available_staff.contains(&staff.internal_id) { StaffState::Available } else { StaffState::Unavailable }
			}
		});

		self.insert(String::from("staff"), serde_json::json!(staff_store)).with_context(|| format!("Failed to update staff with value {:?}", staff_store))?;
		self.save().with_context(|| "Failed to save store while setting staff shift".to_string())?;

		Ok(())
    }
}
