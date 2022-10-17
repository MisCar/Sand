#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[cfg(windows)]
use std::os::windows::process::CommandExt;

use std::process::Command;
use tauri::{CustomMenuItem, Menu, RunEvent, Submenu};

fn main() {
    let mut command = Command::new("pynetworktables2js");
    command.arg("--dashboard");
    #[cfg(windows)]
    command.creation_flags(0x08000000);
    let mut command = command.spawn().ok();

    if let None = command {
        println!("Could not spawn pynetworktables2js");
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
