#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{CustomMenuItem, Menu, Submenu};

fn main() {
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
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
