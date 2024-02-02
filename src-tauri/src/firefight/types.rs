use std::collections::HashMap;

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Occurrence {
	pub internal_id: String,
	pub image: String,
	pub name: String
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
	pub internal_id: String,
	pub image: String,
	pub label: String,
	pub name: String,
	pub state: StaffState
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
	pub internal_id: String,
	pub image: String,
	pub label: String,
	pub state: VehicleState
}

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ActiveOccurrence {
	pub internal_id: String,
	pub occurrence_id: String,
	pub staff_ids: Vec<String>,
	pub vehicle_ids: Vec<String>,
}

#[derive(Clone, Debug, Default, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DataStore {
	pub active_occurrences: HashMap<String, ActiveOccurrence>,
	pub occurrences: HashMap<String, Occurrence>,
	pub staff: HashMap<String, Staff>,
	pub vehicles: HashMap<String, Vehicle>,
}

pub trait FirefightDataManager {
	fn get_active_occurrence(&self, occurrence_id: String) -> anyhow::Result<ActiveOccurrence>;
	fn get_active_occurrence_by_staff(&self, staff_id: String) -> anyhow::Result<ActiveOccurrence>;
	fn get_active_occurrence_by_vehicle(&self, vehicle_id: String) -> anyhow::Result<ActiveOccurrence>;
	fn get_active_occurrence_list(&self) -> anyhow::Result<Vec<ActiveOccurrence>>;
	fn get_active_occurrence_list_by_occurrence(&self, occurrence_id: String) -> anyhow::Result<Vec<ActiveOccurrence>>;
	fn get_occurrence(&self, occurrence_id: String) -> anyhow::Result<Occurrence>;
	fn get_occurrence_list(&self) -> anyhow::Result<Vec<Occurrence>>;
	fn get_staff(&self, staff_id: String) -> anyhow::Result<Staff>;
	fn get_staff_list(&self) -> anyhow::Result<Vec<Staff>>;
	fn get_vehicle(&self, vehicle_id: String) -> anyhow::Result<Vehicle>;
	fn get_vehicle_list(&self) -> anyhow::Result<Vec<Vehicle>>;

	fn create_active_occurrence(&mut self, occurrence: ActiveOccurrence) -> anyhow::Result<String>;
	fn create_occurrence(&mut self, occurrence: Occurrence) -> anyhow::Result<String>;
	fn create_staff(&mut self, staff: Staff) -> anyhow::Result<String>;
	fn create_vehicle(&mut self, vehicle: Vehicle) -> anyhow::Result<String>;
	
	fn update_active_occurrence(&mut self, active_occurrence_id: String, active_occurrence: ActiveOccurrence) -> anyhow::Result<()>;
	fn update_occurrence(&mut self, occurrence_id: String, occurrence: Occurrence) -> anyhow::Result<()>;
	fn update_staff(&mut self, staff_id: String, staff: Staff) -> anyhow::Result<()>;
	fn update_vehicle(&mut self, vehicle_id: String, vehicle: Vehicle) -> anyhow::Result<()>;

	fn delete_active_occurrence(&mut self, active_occurrence_id: String) -> anyhow::Result<()>;
	fn delete_occurrence(&mut self, occurrence_id: String) -> anyhow::Result<()>;
	fn delete_staff(&mut self, staff_id: String) -> anyhow::Result<()>;
	fn delete_vehicle(&mut self, vehicle_id: String) -> anyhow::Result<()>;
}
