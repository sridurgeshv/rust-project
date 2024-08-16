use actix_cors::Cors;
use actix_web::{get, post, App, HttpServer, Responder, HttpResponse, web};
use serde::{Serialize, Deserialize};
use chrono::{Local, Datelike};
use std::sync::Mutex;

#[derive(Serialize)]
struct DateResponse {
    day: u32,
    month: u32,
    year: i32,
}

#[derive(Serialize, Deserialize, Clone)]
struct Task {
    id: Option<u32>,
    title: String,
    date: String,
    completed: bool,
}

struct AppState {
    tasks: Mutex<Vec<Task>>,
}

#[get("/current-date")]
async fn current_date() -> impl Responder {
    let now = Local::now();
    let date = DateResponse {
        day: now.day(),
        month: now.month(),
        year: now.year(),
    };
    HttpResponse::Ok().json(date)
}

#[get("/tasks")]
async fn get_tasks(data: web::Data<AppState>) -> impl Responder {
    let tasks = data.tasks.lock().unwrap();
    HttpResponse::Ok().json(tasks.clone())
}

#[post("/tasks")]
async fn add_task(task: web::Json<Task>, data: web::Data<AppState>) -> impl Responder {
    let mut tasks = data.tasks.lock().unwrap();
    let mut new_task = task.into_inner();
    new_task.id = Some(tasks.len() as u32 + 1);
    tasks.push(new_task.clone());
    HttpResponse::Ok().json(new_task)
}


#[post("/tasks/complete/{id}")]
async fn complete_task(task_id: web::Path<u32>, data: web::Data<AppState>) -> impl Responder {
    let mut tasks = data.tasks.lock().unwrap();
    let task_id = task_id.into_inner();
    
    // Use `filter` to unwrap the Option and compare
    if let Some(task) = tasks.iter_mut().find(|task| task.id == Some(task_id)) {
        task.completed = true;
    }
    
    HttpResponse::Ok().json(tasks.clone())
}


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let app_state = web::Data::new(AppState {
        tasks: Mutex::new(vec![]),
    });

    HttpServer::new(move || {
        App::new()
            .wrap(Cors::default()
                .allow_any_origin()
                .allow_any_method()
                .allow_any_header()
            )
            .app_data(app_state.clone())
            .service(current_date)
            .service(get_tasks)
            .service(add_task)
            .service(complete_task)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
