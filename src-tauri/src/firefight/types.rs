use std::collections::HashMap;

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Ocurrence {
	pub id: String,
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
	pub id: String,
	pub image: String,
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
	pub id: String,
	pub image: String,
	pub state: VehicleState
}

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ActiveOcurrence {
	pub ocurrence_id: String,
	pub staff_ids: Vec<String>,
	pub vehicle_ids: Vec<String>,
}

#[derive(Debug, Default, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DataStore {
	pub active_ocurrences: HashMap<String, ActiveOcurrence>,
	pub ocurrences: HashMap<String, Ocurrence>,
	pub staff: HashMap<String, Staff>,
	pub vehicles: HashMap<String, Vehicle>,
}

pub trait FirefightDataManager {
	fn get_active_ocurrence(&self, ocurrence_id: String) -> anyhow::Result<ActiveOcurrence>;
	fn get_active_ocurrence_by_staff(&self, staff_id: String) -> anyhow::Result<ActiveOcurrence>;
	fn get_active_ocurrence_by_vehicle(&self, vehicle_id: String) -> anyhow::Result<ActiveOcurrence>;
	fn get_active_ocurrence_list(&self) -> anyhow::Result<Vec<ActiveOcurrence>>;
	fn get_active_ocurrence_list_by_ocurrence(&self, ocurrence_id: String) -> anyhow::Result<Vec<ActiveOcurrence>>;
	fn get_ocurrence(&self, ocurrence_id: String) -> anyhow::Result<Ocurrence>;
	fn get_ocurrence_list(&self) -> anyhow::Result<Vec<Ocurrence>>;
	fn get_staff(&self, staff_id: String) -> anyhow::Result<Staff>;
	fn get_staff_list(&self) -> anyhow::Result<Vec<Staff>>;
	fn get_vehicle(&self, vehicle_id: String) -> anyhow::Result<Vehicle>;
	fn get_vehicle_list(&self) -> anyhow::Result<Vec<Vehicle>>;

	fn create_active_ocurrence(&mut self, ocurrence: ActiveOcurrence) -> anyhow::Result<String>;
	fn create_ocurrence(&mut self, ocurrence: Ocurrence) -> anyhow::Result<String>;
	fn create_staff(&mut self, staff: Staff) -> anyhow::Result<String>;
	fn create_vehicle(&mut self, vehicle: Vehicle) -> anyhow::Result<String>;
	
	fn update_active_ocurrence(&mut self, active_ocurrence_id: String, active_ocurrence: ActiveOcurrence) -> anyhow::Result<()>;
	fn update_ocurrence(&mut self, ocurrence_id: String, ocurrence: Ocurrence) -> anyhow::Result<()>;
	fn update_staff(&mut self, staff_id: String, staff: Staff) -> anyhow::Result<()>;
	fn update_vehicle(&mut self, vehicle_id: String, vehicle: Vehicle) -> anyhow::Result<()>;

	fn delete_active_ocurrence(&mut self, active_ocurrence_id: String) -> anyhow::Result<()>;
	fn delete_ocurrence(&mut self, ocurrence_id: String) -> anyhow::Result<()>;
	fn delete_staff(&mut self, staff_id: String) -> anyhow::Result<()>;
	fn delete_vehicle(&mut self, vehicle_id: String) -> anyhow::Result<()>;
}
