#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::{Child, Command};
use std::sync::Mutex;
use tauri::Manager;

struct ServerProcess(Mutex<Option<Child>>);

fn start_server() -> Option<Child> {
    #[cfg(target_os = "windows")]
    let child = Command::new("node")
        .arg("server.js")
        .current_dir(std::env::current_exe().ok()?.parent()?.parent()?.parent()?)
        .spawn()
        .ok();

    #[cfg(not(target_os = "windows"))]
    let child = Command::new("node")
        .arg("server.js")
        .current_dir(std::env::current_exe().ok()?.parent()?.parent()?.join("Resources"))
        .spawn()
        .ok();

    child
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let server = start_server();
            app.manage(ServerProcess(Mutex::new(server)));

            // Give server time to start
            std::thread::sleep(std::time::Duration::from_millis(500));
            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::Destroyed = event {
                if let Some(server) = window.app_handle().try_state::<ServerProcess>() {
                    if let Ok(mut guard) = server.0.lock() {
                        if let Some(ref mut child) = *guard {
                            let _ = child.kill();
                        }
                    }
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
