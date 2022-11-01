#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[cfg(windows)]
use std::os::windows::process::CommandExt;

use serde::Deserialize;
use std::{fs::read_to_string, path::Path, process::Command};
use tauri::{api::path, CustomMenuItem, Menu, RunEvent, Submenu};

#[derive(Deserialize, Debug)]
#[allow(non_snake_case)]
struct Settings {
    teamNumber: u32,
}

fn main() {
    let mut team_number = None;
    let mut command = Command::new("pynetworktables2js");
    if let Some(dir) = path::cache_dir() {
        let settings_path = dir.join(Path::new("Sand")).join(Path::new("settings.json"));
        if let Ok(settings) = read_to_string(settings_path) {
            if let Ok(settings) = serde_json::from_str::<Settings>(&settings) {
                team_number = Some(settings.teamNumber);
            }
        }
    }

    if let Some(team_number) = team_number {
        command.arg(format!("--team={}", team_number));
    } else {
        command.arg("--dashboard");
    }
    #[cfg(windows)]
    command.creation_flags(0x08000000);
    let mut command = command.spawn().ok();

    if let None = command {
        println!("Could not spawn pynetworktables2js");
    } else if let Some(team_number) = team_number {
        println!(
            "Succesfully launched pynetworktables2js for team {}",
            team_number
        );
    } else {
        println!("Succesfully launched pynetworktables2js in dashboard mode");
    }

    let context = tauri::generate_context!();
    let mut menu = tauri::Menu::os_default(&context.package_info().name);

    let file_menu_index = if cfg!(target_os = "macos") { 1 } else { 0 };
    menu.items[file_menu_index] = tauri::MenuEntry::Submenu(Submenu::new(
        "File",
        Menu::new()
            .add_item(CustomMenuItem::new("open", "Open").accelerator("cmdOrControl+O"))
            .add_item(CustomMenuItem::new("save", "Save").accelerator("cmdOrControl+S"))
            .add_item(CustomMenuItem::new("saveas", "Save As").accelerator("cmdOrControl+shift+S")),
    ));

    tauri::Builder::default()
        .menu(menu)
        .on_menu_event(|event| {
            match event.window().emit(event.menu_item_id(), {}) {
                Err(e) => println!("Error emitting menu event to window: {}", e),
                _ => {}
            };
        })
        .build(context)
        .expect("error while running tauri application")
        .run(move |_, event| match event {
            RunEvent::ExitRequested { api: _, .. } => {
                if let Some(child) = &mut command {
                    child
                        .kill()
                        .expect("Failed to shutdown pynetworktables2js.");
                    println!("pynetworktables2js gracefully shutdown.");
                }
            }
            _ => {}
        })
}
