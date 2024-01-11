use std::collections::HashMap;
use anyhow::Context;
use tauri::AppHandle;
use tauri_plugin_store::StoreBuilder;

use super::types::{DataStore, Vehicle, ActiveIncident, Staff, Incident, FirefightDataManager};

pub type LocalStore = tauri_plugin_store::Store<tauri::Wry>;

pub fn create_store(app_handle: AppHandle) -> LocalStore {
	let store_path = app_handle.path_resolver().app_local_data_dir().unwrap().join("data_store.dat");
	let mut firefight_store = StoreBuilder::new(app_handle, store_path).build();
	
	if let Err(load_error) = firefight_store.load() {
		println!("Store not found {:?} - Using default.", load_error);

		let default_store = DataStore::default();
		if let Err(update_error) = firefight_store.insert(String::from("active_incidents"), serde_json::json!(default_store.active_incidents)) { println!("Failed to update store: {}", update_error); }
		if let Err(update_error) = firefight_store.insert(String::from("incidents"), serde_json::json!(default_store.incidents)) { println!("Failed to update store: {}", update_error); }
		if let Err(update_error) = firefight_store.insert(String::from("staff"), serde_json::json!(default_store.staff)) { println!("Failed to update store: {}", update_error); }
		if let Err(update_error) = firefight_store.insert(String::from("vehicles"), serde_json::json!(default_store.vehicles)) { println!("Failed to update store: {}", update_error); }
		
		if let Err(save_error) = firefight_store.save() { println!("Failed to save store: {}", save_error); }
	}

	firefight_store
}

pub fn get_data_store(state: &mut LocalStore) -> DataStore {
	DataStore {
		active_incidents: serde_json::from_value(state.get("active_incidents").unwrap().clone()).unwrap(),
		incidents: serde_json::from_value(state.get("incidents").unwrap().clone()).unwrap(),
		staff: serde_json::from_value(state.get("staff").unwrap().clone()).unwrap(),
		vehicles: serde_json::from_value(state.get("vehicles").unwrap().clone()).unwrap(),
	}
}

impl FirefightDataManager for LocalStore {
    fn get_active_incident(&self, incident_id: String) -> anyhow::Result<ActiveIncident> {
		let active_incidents_value = self.get("active_incidents").with_context(|| format!("Unable to read active incidents from store"))?.clone();
		let active_incident_store = serde_json::from_value::<HashMap<String, ActiveIncident>>(active_incidents_value).with_context(|| format!("Failed to deserialize active incidents"))?;

		let found_value = active_incident_store.get(&incident_id).cloned().with_context(|| format!("No active incident found with id: {}", incident_id))?;
		Ok(found_value)
    }

    fn get_active_incident_by_staff(&self, staff_id: String) -> anyhow::Result<ActiveIncident> {
		let active_incidents_value = self.get("active_incidents").with_context(|| format!("Unable to read active incidents from store"))?.clone();
		let active_incident_store = serde_json::from_value::<HashMap<String, ActiveIncident>>(active_incidents_value).with_context(|| format!("Failed to deserialize active incidents"))?;

		let found_value = active_incident_store.values()
			.find(|active_incident| active_incident.staff_id.contains(&staff_id))
			.cloned()
			.with_context(|| format!("No active incident found with staff id: {}", staff_id))?;

		Ok(found_value)
    }

    fn get_active_incident_by_vehicle(&self, vehicle_id: String) -> anyhow::Result<ActiveIncident> {
		let active_incidents_value = self.get("active_incidents").with_context(|| format!("Unable to read active incidents from store"))?.clone();
		let active_incident_store = serde_json::from_value::<HashMap<String, ActiveIncident>>(active_incidents_value).with_context(|| format!("Failed to deserialize active incidents"))?;

		let found_value = active_incident_store.values()
			.find(|active_incident| active_incident.vehicle_ids.contains(&vehicle_id))
			.cloned()
			.with_context(|| format!("No active incident found with vehicle id: {}", vehicle_id))?;

		Ok(found_value)
	}

    fn get_active_incident_list(&self) -> anyhow::Result<Vec<ActiveIncident>> {
		let active_incidents_value = self.get("active_incidents").with_context(|| format!("Unable to read active incidents from store"))?.clone();
		let active_incident_store = serde_json::from_value::<HashMap<String, ActiveIncident>>(active_incidents_value).with_context(|| format!("Failed to deserialize active incidents"))?;

		Ok(active_incident_store.values().cloned().collect())
	}

    fn get_active_incident_list_by_incident(&self, incident_id: String) -> anyhow::Result<Vec<ActiveIncident>> {
		let active_incidents_value = self.get("active_incidents").with_context(|| format!("Unable to read active incidents from store"))?.clone();
		let active_incident_store = serde_json::from_value::<HashMap<String, ActiveIncident>>(active_incidents_value).with_context(|| format!("Failed to deserialize active incidents"))?;

		let found_values = active_incident_store.values()
			.filter(|active_incident| active_incident.incident_id == incident_id)
			.cloned()
			.collect::<Vec<ActiveIncident>>();

		Ok(found_values)
    }

    fn get_incident(&self, incident_id: String) -> anyhow::Result<Incident> {
		let incidents_value = self.get("incidents").with_context(|| format!("Unable to read incidents from store"))?.clone();
		let incident_store = serde_json::from_value::<HashMap<String, Incident>>(incidents_value).with_context(|| format!("Failed to deserialize incidents"))?;

		let found_value = incident_store.get(&incident_id).cloned().with_context(|| format!("No incident found with id: {}", incident_id))?;
		Ok(found_value)
    }

    fn get_incident_list(&self) -> anyhow::Result<Vec<Incident>> {
		let incidents_value = self.get("incidents").with_context(|| format!("Unable to read incidents from store"))?.clone();
		let incident_store = serde_json::from_value::<HashMap<String, Incident>>(incidents_value).with_context(|| format!("Failed to deserialize incidents"))?;

		Ok(incident_store.values().cloned().collect())
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

    fn create_active_incident(&mut self, incident: ActiveIncident) -> anyhow::Result<String> {
		let active_incidents_value = self.get("active_incidents").with_context(|| format!("Unable to read active incidents from store"))?.clone();
		let mut active_incident_store = serde_json::from_value::<HashMap<String, ActiveIncident>>(active_incidents_value).with_context(|| format!("Failed to deserialize active incidents"))?;

		let active_incident_id = uuid::Uuid::new_v4().to_string();
		active_incident_store.insert(active_incident_id.clone(), incident);

		self.insert(String::from("active_incidents"), serde_json::json!(active_incident_store)).with_context(|| format!("Failed to create active incident {} with value {:?}", &active_incident_id, active_incident_store.get(&active_incident_id)))?;
		self.save().with_context(|| format!("Failed to save store while creating active incident"))?;

		Ok(active_incident_id)
    }

    fn create_incident(&mut self, incident: Incident) -> anyhow::Result<String> {
		let incidents_value = self.get("incidents").with_context(|| format!("Unable to read incidents from store"))?.clone();
		let mut incident_store = serde_json::from_value::<HashMap<String, Incident>>(incidents_value).with_context(|| format!("Failed to deserialize incidents"))?;

		let incident_id = uuid::Uuid::new_v4().to_string();
		incident_store.insert(incident_id.clone(), incident);

		self.insert(String::from("incidents"), serde_json::json!(incident_store)).with_context(|| format!("Failed to create incident {} with value {:?}", &incident_id, incident_store.get(&incident_id)))?;
		self.save().with_context(|| format!("Failed to save store while creating incident"))?;

		Ok(incident_id)
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

    fn update_active_incident(&mut self, active_incident_id: String, active_incident: ActiveIncident) -> anyhow::Result<()> {
		let active_incidents_value = self.get("active_incidents").with_context(|| format!("Unable to read active incidents from store"))?.clone();
		let mut active_incident_store = serde_json::from_value::<HashMap<String, ActiveIncident>>(active_incidents_value).with_context(|| format!("Failed to deserialize active incidents"))?;

		active_incident_store.insert(active_incident_id.clone(), active_incident);

		self.insert(String::from("active_incidents"), serde_json::json!(active_incident_store)).with_context(|| format!("Failed to update active incident {} with value {:?}", active_incident_id, active_incident_store.get(&active_incident_id).unwrap()))?;
		self.save().with_context(|| format!("Failed to save store while updating active incident"))?;

		Ok(())
    }

    fn update_incident(&mut self, incident_id: String, incident: Incident) -> anyhow::Result<()> {
		let incident_value = self.get("incidents").with_context(|| format!("Unable to read incidents from store"))?.clone();
		let mut incident_store = serde_json::from_value::<HashMap<String, Incident>>(incident_value).with_context(|| format!("Failed to deserialize incidents"))?;

		incident_store.insert(incident_id.clone(), incident);

		self.insert(String::from("incidents"), serde_json::json!(incident_store)).with_context(|| format!("Failed to update incident {} with value {:?}", &incident_id, incident_store.get(&incident_id).unwrap()))?;
		self.save().with_context(|| format!("Failed to save store while updating incident"))?;

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

    fn delete_active_incident(&mut self, active_incident_id: String) -> anyhow::Result<()> {
		let active_incident_value = self.get("active_incidents").with_context(|| format!("Unable to read active incidents from store"))?.clone();
		let mut active_incident_store = serde_json::from_value::<HashMap<String, ActiveIncident>>(active_incident_value).with_context(|| format!("Failed to deserialize active incidents"))?;

		active_incident_store.remove(&active_incident_id);

		self.insert(String::from("active_incidents"), serde_json::json!(active_incident_store)).with_context(|| format!("Failed to delete active incident {}", active_incident_id))?;
		self.save().with_context(|| format!("Failed to save store while deleting active incident"))?;

		Ok(())
    }

    fn delete_incident(&mut self, incident_id: String) -> anyhow::Result<()> {
		let incident_value = self.get("incidents").with_context(|| format!("Unable to read incidents from store"))?.clone();
		let mut incident_store = serde_json::from_value::<HashMap<String, Incident>>(incident_value).with_context(|| format!("Failed to deserialize incidents"))?;

		incident_store.remove(&incident_id);

		self.insert(String::from("incidents"), serde_json::json!(incident_store)).with_context(|| format!("Failed to delete incident {}", incident_id))?;
		self.save().with_context(|| format!("Failed to save store while deleting incident"))?;

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
