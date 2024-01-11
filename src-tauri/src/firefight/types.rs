use std::collections::HashMap;

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Incident {
	pub id: String,
	pub name: String,
	pub image: String
}

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum StaffState {
	Available,
	Unavailable,
	Dispatched
}

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Staff {
	pub id: u8,
	pub name: String,
	pub image: String
}

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum VehicleState {
	Available,
	Unavailable,
	Dispatched
}

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Vehicle {
	pub id: String,
	pub image: String,
	pub state: String
}

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ActiveIncident {
	pub incident_id: String,
	pub staff_id: Vec<String>,
	pub vehicle_ids: Vec<String>,
}

#[derive(Debug, Default, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DataStore {
	pub active_incidents: HashMap<String, ActiveIncident>,
	pub incidents: HashMap<String, Incident>,
	pub staff: HashMap<String, Staff>,
	pub vehicles: HashMap<String, Vehicle>,
}

pub trait FirefightDataManager {
	fn get_active_incident(&self, incident_id: String) -> anyhow::Result<ActiveIncident>;
	fn get_active_incident_by_staff(&self, staff_id: String) -> anyhow::Result<ActiveIncident>;
	fn get_active_incident_by_vehicle(&self, vehicle_id: String) -> anyhow::Result<ActiveIncident>;
	fn get_active_incident_list(&self) -> anyhow::Result<Vec<ActiveIncident>>;
	fn get_active_incident_list_by_incident(&self, incident_id: String) -> anyhow::Result<Vec<ActiveIncident>>;
	fn get_incident(&self, incident_id: String) -> anyhow::Result<Incident>;
	fn get_incident_list(&self) -> anyhow::Result<Vec<Incident>>;
	fn get_staff(&self, staff_id: String) -> anyhow::Result<Staff>;
	fn get_staff_list(&self) -> anyhow::Result<Vec<Staff>>;
	fn get_vehicle(&self, vehicle_id: String) -> anyhow::Result<Vehicle>;
	fn get_vehicle_list(&self) -> anyhow::Result<Vec<Vehicle>>;

	fn create_active_incident(&mut self, incident: ActiveIncident) -> anyhow::Result<String>;
	fn create_incident(&mut self, incident: Incident) -> anyhow::Result<String>;
	fn create_staff(&mut self, staff: Staff) -> anyhow::Result<String>;
	fn create_vehicle(&mut self, vehicle: Vehicle) -> anyhow::Result<String>;
	
	fn update_active_incident(&mut self, active_incident_id: String, active_incident: ActiveIncident) -> anyhow::Result<()>;
	fn update_incident(&mut self, incident_id: String, incident: Incident) -> anyhow::Result<()>;
	fn update_staff(&mut self, staff_id: String, staff: Staff) -> anyhow::Result<()>;
	fn update_vehicle(&mut self, vehicle_id: String, vehicle: Vehicle) -> anyhow::Result<()>;

	fn delete_active_incident(&mut self, active_incident_id: String) -> anyhow::Result<()>;
	fn delete_incident(&mut self, incident_id: String) -> anyhow::Result<()>;
	fn delete_staff(&mut self, staff_id: String) -> anyhow::Result<()>;
	fn delete_vehicle(&mut self, vehicle_id: String) -> anyhow::Result<()>;
}
