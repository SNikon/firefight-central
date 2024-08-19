use std::collections::HashMap;

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Occurrence {
    pub internal_id: String,
    pub image: String,
    pub name: String,
}

#[derive(Clone, Debug, Eq, PartialEq, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum StaffRank {
    Rank0,
    Rank1,
    Rank2,
    Rank3,
    Rank4,
    Rank5,
    Rank6,
    Rank7,
    Rank8,
    Unknown,
}

#[derive(Clone, Debug, Eq, PartialEq, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum StaffState {
    Available,
    Dispatched,
    Inactive,
    SickLeave,
    Unavailable,
}

#[derive(Clone, Debug, Eq, PartialEq, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum StaffPermission {
    All,
    Shift,
    Own,
    None
}

fn default_permission() -> StaffPermission {
    StaffPermission::Own
}

fn default_rank() -> StaffRank {
    StaffRank::Unknown
}

fn default_national_id() -> String {
    String::from("")
}

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Staff {
    pub internal_id: String,
    pub image: String,
    pub label: String,
    pub name: String,
    #[serde(default = "default_national_id")]
    pub national_id: String,
    #[serde(default = "default_permission")]
    pub permission: StaffPermission,
    #[serde(default = "default_rank")]
    pub rank: StaffRank,
    pub state: StaffState,
}

#[derive(Clone, Debug, Eq, PartialEq, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum VehicleState {
    Available,
    Dispatched,
    Unavailable,
}

#[derive(Clone, Debug, Eq, PartialEq, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum VehicleCategory {
    Ambulances,
    Command,
    FireFight,
    Support,
    Trailers,
    Vessels,
    Unknown,
}

fn default_category() -> VehicleCategory {
    VehicleCategory::Unknown
}

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Vehicle {
    pub internal_id: String,
    pub capacity: Option<u8>,
    #[serde(default = "default_category")]
    pub category: VehicleCategory,
    pub image: String,
    pub label: String,
    pub license_plate: Option<String>,
    pub state: VehicleState,
}

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ActiveOccurrence {
    pub address: Option<String>,
    pub codu_number: Option<String>,
    pub creation_time: Option<u128>,
    pub description: Option<String>,
    pub internal_id: String,
    pub location: Option<String>,
    pub occurrence_id: String,
    pub reference_point: Option<String>,
    pub staff_ids: Vec<String>,
    #[serde(default)]
    pub vehicle_assignment_map: HashMap<String, Vec<String>>,
    pub vehicle_ids: Vec<String>,
    pub vmer_siv: Option<bool>,
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
    fn get_active_occurrence(&self, occurrence_id: &String) -> anyhow::Result<ActiveOccurrence>;
    fn get_active_occurrence_by_staff(&self, staff_id: &String)
        -> anyhow::Result<ActiveOccurrence>;
    fn get_active_occurrence_by_vehicle(
        &self,
        vehicle_id: &String,
    ) -> anyhow::Result<ActiveOccurrence>;
    fn get_active_occurrence_list(&self) -> anyhow::Result<Vec<ActiveOccurrence>>;
    fn get_active_occurrence_list_by_occurrence(
        &self,
        occurrence_id: &String,
    ) -> anyhow::Result<Vec<ActiveOccurrence>>;
    fn get_occurrence(&self, occurrence_id: &String) -> anyhow::Result<Occurrence>;
    fn get_occurrence_name(&self, occurrence_id: &String) -> anyhow::Result<String>;
    fn get_occurrence_list(&self) -> anyhow::Result<Vec<Occurrence>>;
    fn get_staff(&self, staff_id: &String) -> anyhow::Result<Staff>;
    fn get_staff_label(&self, staff_id: &String) -> anyhow::Result<String>;
    fn get_staff_list(&self) -> anyhow::Result<Vec<Staff>>;
    fn get_vehicle(&self, vehicle_id: &String) -> anyhow::Result<Vehicle>;
    fn get_vehicle_capacity(&self, vehicle_id: &String) -> anyhow::Result<Option<u8>>;
    fn get_vehicle_label(&self, vehicle_id: &String) -> anyhow::Result<String>;
    fn get_vehicle_list(&self) -> anyhow::Result<Vec<Vehicle>>;

    fn create_active_occurrence(&mut self, occurrence: ActiveOccurrence) -> anyhow::Result<String>;
    fn create_occurrence(&mut self, occurrence: Occurrence) -> anyhow::Result<String>;
    fn create_staff(&mut self, staff: Staff) -> anyhow::Result<String>;
    fn create_vehicle(&mut self, vehicle: Vehicle) -> anyhow::Result<String>;

    fn update_active_occurrence(
        &mut self,
        active_occurrence_id: &String,
        active_occurrence: ActiveOccurrence,
    ) -> anyhow::Result<Option<ActiveOccurrence>>;
    fn update_occurrence(
        &mut self,
        occurrence_id: &String,
        occurrence: Occurrence,
    ) -> anyhow::Result<Option<Occurrence>>;
    fn update_staff(&mut self, staff_id: &String, staff: Staff) -> anyhow::Result<Option<Staff>>;
    fn update_vehicle(
        &mut self,
        vehicle_id: &String,
        vehicle: Vehicle,
    ) -> anyhow::Result<Option<Vehicle>>;

    fn delete_active_occurrence(&mut self, active_occurrence_id: &String) -> anyhow::Result<()>;
    fn delete_occurrence(&mut self, occurrence_id: &String) -> anyhow::Result<()>;
    fn delete_staff(&mut self, staff_id: &String) -> anyhow::Result<()>;
    fn delete_vehicle(&mut self, vehicle_id: &String) -> anyhow::Result<()>;

    fn set_staff_shift(&mut self, available_staff: Vec<String>) -> anyhow::Result<()>;
}
