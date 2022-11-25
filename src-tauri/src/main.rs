#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{CustomMenuItem, Menu, Submenu};

fn main() {
    let context = tauri::generate_context!();
    let mut menu = tauri::Menu::os_default(&context.package_info().name);

    let file_menu_index = if cfg!(target_os = "macos") { 1 } else { 0 };
    menu.items[file_menu_index] = tauri::MenuEntry::Submenu(Submenu::new(
        "File",
        Menu::new()
            .add_item(CustomMenuItem::new("open", "Open").accelerator("cmdOrControl+O"))
            .add_item(
                CustomMenuItem::new("import", "Import Shuffleboard").accelerator("cmdOrControl+I"),
            )
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
        .run(context)
        .expect("error while running tauri application");
}
