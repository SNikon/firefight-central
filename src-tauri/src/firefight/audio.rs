use std::{hash::Hasher, io::Write};

pub fn get_string_hash(string: &String) -> String {
    let mut hasher = std::collections::hash_map::DefaultHasher::new();
    hasher.write(string.as_bytes());
    hasher.finish().to_string()
}

pub fn get_audio_resource(
    app_handle: &tauri::AppHandle,
    resource_name: &str,
) -> anyhow::Result<std::fs::File> {
    let audio_resource_path = app_handle
        .path_resolver()
        .resolve_resource(format!("resources/audio/{}.mp3", resource_name))
        .unwrap();
    if !std::path::Path::exists(&audio_resource_path) {
        return Err(anyhow::anyhow!("Audio resource not found"));
    }

    Ok(std::fs::File::open(audio_resource_path)?)
}

fn get_audio_cache_dir(app_handle: &tauri::AppHandle) -> anyhow::Result<std::path::PathBuf> {
    let audio_cache_path = app_handle
        .path_resolver()
        .app_local_data_dir()
        .unwrap()
        .join("audio_cache");
    if !std::path::Path::exists(&audio_cache_path) {
        std::fs::create_dir_all(&audio_cache_path).unwrap();
    }
    Ok(audio_cache_path)
}

pub fn get_audio_cache(
    app_handle: &tauri::AppHandle,
    resource_name: &String,
) -> anyhow::Result<std::fs::File> {
    let audio_resource_path = get_audio_cache_dir(app_handle)
        .unwrap()
        .join(format!("{}.ogg", resource_name));
    if !std::path::Path::exists(&audio_resource_path) {
        return Err(anyhow::anyhow!("Audio resource not found in cache"));
    }

    Ok(std::fs::File::open(audio_resource_path)?)
}

pub fn put_audio_cache(
    app_handle: &tauri::AppHandle,
    resource_name: &String,
    bytes: &[u8],
) -> anyhow::Result<()> {
    let audio_resource_path = get_audio_cache_dir(app_handle)
        .unwrap()
        .join(format!("{}.ogg", resource_name));

    let mut file = std::fs::File::create(audio_resource_path).unwrap();
    file.write_all(bytes).unwrap();

    Ok(())
}

pub fn delete_audio_cache(
    app_handle: &tauri::AppHandle,
    resource_name: &String,
) -> anyhow::Result<()> {
    let audio_resource_path = get_audio_cache_dir(app_handle)
        .unwrap()
        .join(format!("{}.ogg", resource_name));
    std::fs::remove_file(&audio_resource_path)?;

    Ok(())
}

pub fn clear_audio_cache(app_handle: &tauri::AppHandle) -> anyhow::Result<()> {
    let audio_cache_path = get_audio_cache_dir(app_handle)?;
    std::fs::remove_dir_all(&audio_cache_path)?;
    std::fs::create_dir_all(&audio_cache_path)?;
    Ok(())
}
