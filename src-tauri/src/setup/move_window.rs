use tauri::{PhysicalPosition, WebviewWindow};


pub fn position_window_bottom_right(window: &WebviewWindow) -> Result<(), tauri::Error>{
    let monitor = window.current_monitor()?.unwrap();
    let monitor_size = monitor.size();
    let window_size = window.outer_size()?;
    let x = monitor_size.width as i32 - window_size.width as i32 - 20;
    let y = monitor_size.height as i32 - window_size.height as i32 - 60;
    window.set_position(PhysicalPosition::new(x, y))?;
    
    Ok(())
}