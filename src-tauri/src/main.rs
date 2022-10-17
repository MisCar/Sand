#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::process::{Child, Command};

use tauri::{CustomMenuItem, Menu, RunEvent, Submenu};

fn main() {
    let mut command: Option<Child> = Command::new("pynetworktables2js")
        // .arg(format!("--team={}", s))
        .arg("--dashboard")
        .spawn()
        .ok();

    tauri::Builder::default()
        .menu(
            Menu::new().add_submenu(Submenu::new(
                "File",
                Menu::new()
                    .add_item(CustomMenuItem::new("open", "Open").accelerator("cmdOrControl+O"))
                    .add_item(CustomMenuItem::new("save", "Save").accelerator("cmdOrControl+S"))
                    .add_item(
                        CustomMenuItem::new("saveas", "Save As")
                            .accelerator("cmdOrControl+shift+S"),
                    ),
            )),
        )
        .on_menu_event(|event| {
            match event.window().emit(event.menu_item_id(), {}) {
                Err(e) => println!("Error emitting menu event to window: {}", e),
                _ => {}
            };
        })
        .build(tauri::generate_context!())
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
