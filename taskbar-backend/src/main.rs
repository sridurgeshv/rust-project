use actix_cors::Cors;
use actix_web::{get, post, put, App, HttpServer, Responder, HttpResponse, web};
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

#[derive(Serialize, Deserialize, Clone)]
struct Comment {
    id: Option<u32>,
    title: String,
    content: String,
}

struct AppState {
    tasks: Mutex<Vec<Task>>,
    comments: Mutex<Vec<Comment>>,
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

#[get("/comments")]
async fn get_comments(data: web::Data<AppState>) -> impl Responder {
    let comments = data.comments.lock().unwrap();
    HttpResponse::Ok().json(comments.clone())
}

#[post("/comments")]
async fn add_comment(comment: web::Json<Comment>, data: web::Data<AppState>) -> impl Responder {
    let mut comments = data.comments.lock().unwrap();
    let mut new_comment = comment.into_inner();
    new_comment.id = Some(comments.len() as u32 + 1);
    comments.push(new_comment.clone());
    HttpResponse::Ok().json(new_comment)
}

#[put("/comments/{id}")]
async fn update_comment(
    path: web::Path<u32>,
    comment: web::Json<Comment>,
    data: web::Data<AppState>
) -> impl Responder {
    let id = path.into_inner();
    let mut comments = data.comments.lock().unwrap();
    if let Some(existing_comment) = comments.iter_mut().find(|c| c.id == Some(id)) {
        *existing_comment = comment.into_inner();
        existing_comment.id = Some(id);
        HttpResponse::Ok().json(existing_comment.clone())
    } else {
        HttpResponse::NotFound().finish()
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let app_state = web::Data::new(AppState {
        tasks: Mutex::new(vec![]),
        comments: Mutex::new(vec![
            Comment {
                id: Some(1),
                title: "Market research".to_string(),
                content: "Find my keynote attached...".to_string(),
            },
            Comment {
                id: Some(2),
                title: "Market research".to_string(),
                content: "I've added the data...".to_string(),
            },
        ]),
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
            .service(get_comments)
            .service(add_comment)
            .service(update_comment)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}