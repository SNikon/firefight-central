use std::collections::HashMap;
use anyhow::Context;
use tauri::AppHandle;
use tauri_plugin_store::StoreBuilder;

use super::types::{DataStore, Vehicle, ActiveOcurrence, Staff, Ocurrence, FirefightDataManager};

pub type LocalStore = tauri_plugin_store::Store<tauri::Wry>;

pub fn create_store(app_handle: AppHandle) -> LocalStore {
	let store_path = app_handle.path_resolver().app_local_data_dir().unwrap().join("data_store.dat");
	let mut firefight_store = StoreBuilder::new(app_handle, store_path).build();
	
	if let Err(load_error) = firefight_store.load() {
		println!("Store not found {:?} - Using default.", load_error);

		let default_store = DataStore::default();
		if let Err(update_error) = firefight_store.insert(String::from("active_ocurrences"), serde_json::json!(default_store.active_ocurrences)) { println!("Failed to update store: {}", update_error); }
		if let Err(update_error) = firefight_store.insert(String::from("ocurrences"), serde_json::json!(default_store.ocurrences)) { println!("Failed to update store: {}", update_error); }
		if let Err(update_error) = firefight_store.insert(String::from("staff"), serde_json::json!(default_store.staff)) { println!("Failed to update store: {}", update_error); }
		if let Err(update_error) = firefight_store.insert(String::from("vehicles"), serde_json::json!(default_store.vehicles)) { println!("Failed to update store: {}", update_error); }
		
		if let Err(save_error) = firefight_store.save() { println!("Failed to save store: {}", save_error); }
	}

	firefight_store
}

pub fn get_data_store(state: &mut LocalStore) -> DataStore {
	DataStore {
		active_ocurrences: serde_json::from_value(state.get("active_ocurrences").unwrap().clone()).unwrap(),
		ocurrences: serde_json::from_value(state.get("ocurrences").unwrap().clone()).unwrap(),
		staff: serde_json::from_value(state.get("staff").unwrap().clone()).unwrap(),
		vehicles: serde_json::from_value(state.get("vehicles").unwrap().clone()).unwrap(),
	}
}

impl FirefightDataManager for LocalStore {
    fn get_active_ocurrence(&self, ocurrence_id: String) -> anyhow::Result<ActiveOcurrence> {
		let active_ocurrences_value = self.get("active_ocurrences").with_context(|| format!("Unable to read active ocurrences from store"))?.clone();
		let active_ocurrence_store = serde_json::from_value::<HashMap<String, ActiveOcurrence>>(active_ocurrences_value).with_context(|| format!("Failed to deserialize active ocurrences"))?;

		let found_value = active_ocurrence_store.get(&ocurrence_id).cloned().with_context(|| format!("No active ocurrence found with id: {}", ocurrence_id))?;
		Ok(found_value)
    }

    fn get_active_ocurrence_by_staff(&self, staff_id: String) -> anyhow::Result<ActiveOcurrence> {
		let active_ocurrences_value = self.get("active_ocurrences").with_context(|| format!("Unable to read active ocurrences from store"))?.clone();
		let active_ocurrence_store = serde_json::from_value::<HashMap<String, ActiveOcurrence>>(active_ocurrences_value).with_context(|| format!("Failed to deserialize active ocurrences"))?;

		let found_value = active_ocurrence_store.values()
			.find(|active_ocurrence| active_ocurrence.staff_ids.contains(&staff_id))
			.cloned()
			.with_context(|| format!("No active ocurrence found with staff id: {}", staff_id))?;

		Ok(found_value)
    }

    fn get_active_ocurrence_by_vehicle(&self, vehicle_id: String) -> anyhow::Result<ActiveOcurrence> {
		let active_ocurrences_value = self.get("active_ocurrences").with_context(|| format!("Unable to read active ocurrences from store"))?.clone();
		let active_ocurrence_store = serde_json::from_value::<HashMap<String, ActiveOcurrence>>(active_ocurrences_value).with_context(|| format!("Failed to deserialize active ocurrences"))?;

		let found_value = active_ocurrence_store.values()
			.find(|active_ocurrence| active_ocurrence.vehicle_ids.contains(&vehicle_id))
			.cloned()
			.with_context(|| format!("No active ocurrence found with vehicle id: {}", vehicle_id))?;

		Ok(found_value)
	}

    fn get_active_ocurrence_list(&self) -> anyhow::Result<Vec<ActiveOcurrence>> {
		let active_ocurrences_value = self.get("active_ocurrences").with_context(|| format!("Unable to read active ocurrences from store"))?.clone();
		let active_ocurrence_store = serde_json::from_value::<HashMap<String, ActiveOcurrence>>(active_ocurrences_value).with_context(|| format!("Failed to deserialize active ocurrences"))?;

		Ok(active_ocurrence_store.values().cloned().collect())
	}

    fn get_active_ocurrence_list_by_ocurrence(&self, ocurrence_id: String) -> anyhow::Result<Vec<ActiveOcurrence>> {
		let active_ocurrences_value = self.get("active_ocurrences").with_context(|| format!("Unable to read active ocurrences from store"))?.clone();
		let active_ocurrence_store = serde_json::from_value::<HashMap<String, ActiveOcurrence>>(active_ocurrences_value).with_context(|| format!("Failed to deserialize active ocurrences"))?;

		let found_values = active_ocurrence_store.values()
			.filter(|active_ocurrence| active_ocurrence.ocurrence_id == ocurrence_id)
			.cloned()
			.collect::<Vec<ActiveOcurrence>>();

		Ok(found_values)
    }

    fn get_ocurrence(&self, ocurrence_id: String) -> anyhow::Result<Ocurrence> {
		let ocurrences_value = self.get("ocurrences").with_context(|| format!("Unable to read ocurrences from store"))?.clone();
		let ocurrence_store = serde_json::from_value::<HashMap<String, Ocurrence>>(ocurrences_value).with_context(|| format!("Failed to deserialize ocurrences"))?;

		let found_value = ocurrence_store.get(&ocurrence_id).cloned().with_context(|| format!("No ocurrence found with id: {}", ocurrence_id))?;
		Ok(found_value)
    }

    fn get_ocurrence_list(&self) -> anyhow::Result<Vec<Ocurrence>> {
		let ocurrences_value = self.get("ocurrences").with_context(|| format!("Unable to read ocurrences from store"))?.clone();
		let ocurrence_store = serde_json::from_value::<HashMap<String, Ocurrence>>(ocurrences_value).with_context(|| format!("Failed to deserialize ocurrences"))?;

		Ok(ocurrence_store.values().cloned().collect())
	}

    fn get_staff(&self, staff_id: String) -> anyhow::Result<Staff> {
		let staff_value = self.get("staff").with_context(|| format!("Unable to read staff from store"))?.clone();
		let staff_store = serde_json::from_value::<HashMap<String, Staff>>(staff_value).with_context(|| format!("Failed to deserialize staff"))?;

		let found_value = staff_store.get(&staff_id).cloned().with_context(|| format!("No staff found with id: {}", staff_id))?;
		Ok(found_value)
    }

    fn get_staff_list(&self) -> anyhow::Result<Vec<Staff>> {
		let staff_value = self.get("staff").with_context(|| format!("Unable to read staff from store"))?.clone();
		let staff_store = serde_json::from_value::<HashMap<String, Staff>>(staff_value).with_context(|| format!("Failed to deserialize staff"))?;

		Ok(staff_store.values().cloned().collect())
	}

    fn get_vehicle_list(&self) -> anyhow::Result<Vec<Vehicle>> {
		let vehicles_value = self.get("vehicles").with_context(|| format!("Unable to read vehicles from store"))?.clone();
		let vehicle_store = serde_json::from_value::<HashMap<String, Vehicle>>(vehicles_value).with_context(|| format!("Failed to deserialize vehicles"))?;

		Ok(vehicle_store.values().cloned().collect())
	}

    fn get_vehicle(&self, vehicle_id: String) -> anyhow::Result<Vehicle> {
		let vehicles_value = self.get("vehicles").with_context(|| format!("Unable to read vehicles from store"))?.clone();
		let vehicle_store = serde_json::from_value::<HashMap<String, Vehicle>>(vehicles_value).with_context(|| format!("Failed to deserialize vehicles"))?;

		let found_value = vehicle_store.get(&vehicle_id).cloned().with_context(|| format!("No vehicle found with id: {}", vehicle_id))?;
		Ok(found_value)
	}

    fn create_active_ocurrence(&mut self, ocurrence: ActiveOcurrence) -> anyhow::Result<String> {
		let active_ocurrences_value = self.get("active_ocurrences").with_context(|| format!("Unable to read active ocurrences from store"))?.clone();
		let mut active_ocurrence_store = serde_json::from_value::<HashMap<String, ActiveOcurrence>>(active_ocurrences_value).with_context(|| format!("Failed to deserialize active ocurrences"))?;

		let active_ocurrence_id = uuid::Uuid::new_v4().to_string();
		active_ocurrence_store.insert(active_ocurrence_id.clone(), ocurrence);

		self.insert(String::from("active_ocurrences"), serde_json::json!(active_ocurrence_store)).with_context(|| format!("Failed to create active ocurrence {} with value {:?}", &active_ocurrence_id, active_ocurrence_store.get(&active_ocurrence_id)))?;
		self.save().with_context(|| format!("Failed to save store while creating active ocurrence"))?;

		Ok(active_ocurrence_id)
    }

    fn create_ocurrence(&mut self, ocurrence: Ocurrence) -> anyhow::Result<String> {
		let ocurrences_value = self.get("ocurrences").with_context(|| format!("Unable to read ocurrences from store"))?.clone();
		let mut ocurrence_store = serde_json::from_value::<HashMap<String, Ocurrence>>(ocurrences_value).with_context(|| format!("Failed to deserialize ocurrences"))?;

		let ocurrence_id = uuid::Uuid::new_v4().to_string();
		ocurrence_store.insert(ocurrence_id.clone(), ocurrence);

		self.insert(String::from("ocurrences"), serde_json::json!(ocurrence_store)).with_context(|| format!("Failed to create ocurrence {} with value {:?}", &ocurrence_id, ocurrence_store.get(&ocurrence_id)))?;
		self.save().with_context(|| format!("Failed to save store while creating ocurrence"))?;

		Ok(ocurrence_id)
    }

    fn create_staff(&mut self, staff: Staff) -> anyhow::Result<String> {
		let staff_value = self.get("staff").with_context(|| format!("Unable to read staff from store"))?.clone();
		let mut staff_store = serde_json::from_value::<HashMap<String, Staff>>(staff_value).with_context(|| format!("Failed to deserialize staff"))?;

		let staff_id = uuid::Uuid::new_v4().to_string();
		staff_store.insert(staff_id.clone(), staff);

		self.insert(String::from("staff"), serde_json::json!(staff_store)).with_context(|| format!("Failed to create staff {} with value {:?}", &staff_id, staff_store.get(&staff_id)))?;
		self.save().with_context(|| format!("Failed to save store while creating staff"))?;

		Ok(staff_id)
	}

    fn create_vehicle(&mut self, vehicle: Vehicle) -> anyhow::Result<String> {
		let vehicles_value = self.get("vehicles").with_context(|| format!("Unable to read vehicles from store"))?.clone();
		let mut vehicle_store = serde_json::from_value::<HashMap<String, Vehicle>>(vehicles_value).with_context(|| format!("Failed to deserialize vehicles"))?;

		let vehicle_id = uuid::Uuid::new_v4().to_string();
		vehicle_store.insert(vehicle_id.clone(), vehicle);

		self.insert(String::from("vehicles"), serde_json::json!(vehicle_store)).with_context(|| format!("Failed to create vehicle {} with value {:?}", &vehicle_id, vehicle_store.get(&vehicle_id).unwrap()))?;
		self.save().with_context(|| format!("Failed to save store while creating vehicle"))?;

		Ok(vehicle_id)
	}

    fn update_active_ocurrence(&mut self, active_ocurrence_id: String, active_ocurrence: ActiveOcurrence) -> anyhow::Result<()> {
		let active_ocurrences_value = self.get("active_ocurrences").with_context(|| format!("Unable to read active ocurrences from store"))?.clone();
		let mut active_ocurrence_store = serde_json::from_value::<HashMap<String, ActiveOcurrence>>(active_ocurrences_value).with_context(|| format!("Failed to deserialize active ocurrences"))?;

		active_ocurrence_store.insert(active_ocurrence_id.clone(), active_ocurrence);

		self.insert(String::from("active_ocurrences"), serde_json::json!(active_ocurrence_store)).with_context(|| format!("Failed to update active ocurrence {} with value {:?}", active_ocurrence_id, active_ocurrence_store.get(&active_ocurrence_id).unwrap()))?;
		self.save().with_context(|| format!("Failed to save store while updating active ocurrence"))?;

		Ok(())
    }

    fn update_ocurrence(&mut self, ocurrence_id: String, ocurrence: Ocurrence) -> anyhow::Result<()> {
		let ocurrence_value = self.get("ocurrences").with_context(|| format!("Unable to read ocurrences from store"))?.clone();
		let mut ocurrence_store = serde_json::from_value::<HashMap<String, Ocurrence>>(ocurrence_value).with_context(|| format!("Failed to deserialize ocurrences"))?;

		ocurrence_store.insert(ocurrence_id.clone(), ocurrence);

		self.insert(String::from("ocurrences"), serde_json::json!(ocurrence_store)).with_context(|| format!("Failed to update ocurrence {} with value {:?}", &ocurrence_id, ocurrence_store.get(&ocurrence_id).unwrap()))?;
		self.save().with_context(|| format!("Failed to save store while updating ocurrence"))?;

		Ok(())
    }

    fn update_staff(&mut self, staff_id: String, staff: Staff) -> anyhow::Result<()> {
		let staff_value = self.get("staff").with_context(|| format!("Unable to read staff from store"))?.clone();
		let mut staff_store = serde_json::from_value::<HashMap<String, Staff>>(staff_value).with_context(|| format!("Failed to deserialize staff"))?;

		staff_store.insert(staff_id.clone(), staff);

		self.insert(String::from("staff"), serde_json::json!(staff_store)).with_context(|| format!("Failed to update staff {} with value {:?}", &staff_id, staff_store.get(&staff_id).unwrap()))?;
		self.save().with_context(|| format!("Failed to save store while updating staff"))?;

		Ok(())
    }

    fn update_vehicle(&mut self, vehicle_id: String, vehicle: Vehicle) -> anyhow::Result<()> {
		let vehicles_value = self.get("vehicles").with_context(|| format!("Unable to read vehicles from store"))?.clone();
		let mut vehicle_store = serde_json::from_value::<HashMap<String, Vehicle>>(vehicles_value).with_context(|| format!("Failed to deserialize vehicles"))?;

		vehicle_store.insert(vehicle_id.clone(), vehicle);

		self.insert(String::from("vehicles"), serde_json::json!(vehicle_store)).with_context(|| format!("Failed to update vehicle {} with value {:?}", &vehicle_id, vehicle_store.get(&vehicle_id)))?;
		self.save().with_context(|| format!("Failed to save store while updating vehicle"))?;

		Ok(())
    }

    fn delete_active_ocurrence(&mut self, active_ocurrence_id: String) -> anyhow::Result<()> {
		let active_ocurrence_value = self.get("active_ocurrences").with_context(|| format!("Unable to read active ocurrences from store"))?.clone();
		let mut active_ocurrence_store = serde_json::from_value::<HashMap<String, ActiveOcurrence>>(active_ocurrence_value).with_context(|| format!("Failed to deserialize active ocurrences"))?;

		active_ocurrence_store.remove(&active_ocurrence_id);

		self.insert(String::from("active_ocurrences"), serde_json::json!(active_ocurrence_store)).with_context(|| format!("Failed to delete active ocurrence {}", active_ocurrence_id))?;
		self.save().with_context(|| format!("Failed to save store while deleting active ocurrence"))?;

		Ok(())
    }

    fn delete_ocurrence(&mut self, ocurrence_id: String) -> anyhow::Result<()> {
		let ocurrence_value = self.get("ocurrences").with_context(|| format!("Unable to read ocurrences from store"))?.clone();
		let mut ocurrence_store = serde_json::from_value::<HashMap<String, Ocurrence>>(ocurrence_value).with_context(|| format!("Failed to deserialize ocurrences"))?;

		ocurrence_store.remove(&ocurrence_id);

		self.insert(String::from("ocurrences"), serde_json::json!(ocurrence_store)).with_context(|| format!("Failed to delete ocurrence {}", ocurrence_id))?;
		self.save().with_context(|| format!("Failed to save store while deleting ocurrence"))?;

		Ok(())
	}

    fn delete_staff(&mut self, staff_id: String) -> anyhow::Result<()> {
		let staff_value = self.get("staff").with_context(|| format!("Unable to read staff from store"))?.clone();
		let mut staff_store = serde_json::from_value::<HashMap<String, Staff>>(staff_value).with_context(|| format!("Failed to deserialize staff"))?;

		staff_store.remove(&staff_id);

		self.insert(String::from("staff"), serde_json::json!(staff_store)).with_context(|| format!("Failed to delete staff {}", staff_id))?;
		self.save().with_context(|| format!("Failed to save store while deleting staff"))?;

		Ok(())
    }

    fn delete_vehicle(&mut self, vehicle_id: String) -> anyhow::Result<()> {
		let vehicles_value = self.get("vehicles").with_context(|| format!("Unable to read vehicles from store"))?.clone();
		let mut vehicle_store = serde_json::from_value::<HashMap<String, Vehicle>>(vehicles_value).with_context(|| format!("Failed to deserialize vehicles"))?;

		vehicle_store.remove(&vehicle_id);

		self.insert(String::from("vehicles"), serde_json::json!(vehicle_store)).with_context(|| format!("Failed to delete vehicle {}", vehicle_id))?;
		self.save().with_context(|| format!("Failed to save store while deleting vehicle"))?;

		Ok(())
    }
}
