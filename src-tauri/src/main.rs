// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use tauri::api::process::{Command, CommandEvent};
use std::net::TcpListener;

#[tauri::command]
fn get_backend_port(port: tauri::State<BackendPort>) -> u16 {
    port.0
}

struct BackendPort(u16);

fn main() {
    // Find an available port
    let listener = TcpListener::bind("127.0.0.1:0").expect("Failed to bind random port");
    let port = listener.local_addr().unwrap().port();
    drop(listener); // Free the port so Node.js can use it

    tauri::Builder::default()
        .manage(BackendPort(port))
        .invoke_handler(tauri::generate_handler![get_backend_port])
        .setup(move |app| {
            let app_handle = app.handle();
            let app_data_dir = app_handle.path_resolver().app_data_dir().unwrap();
            
            // Ensure app data dir exists
            std::fs::create_dir_all(&app_data_dir).unwrap();
            
            let data_dir_str = app_data_dir.to_str().unwrap().to_string();
            let port_str = port.to_string();
            
            // Spawn the sidecar
            let (mut rx, _child) = Command::new_sidecar("bazi_backend")
                .expect("failed to create `bazi_backend` binary command")
                .args(&["--port", &port_str, "--data-dir", &data_dir_str])
                .spawn()
                .expect("Failed to spawn sidecar");
            
            tauri::async_runtime::spawn(async move {
                while let Some(event) = rx.recv().await {
                    if let CommandEvent::Stdout(line) = event {
                        println!("backend: {}", line);
                    }
                    if let CommandEvent::Stderr(line) = event {
                        println!("backend err: {}", line);
                    }
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
