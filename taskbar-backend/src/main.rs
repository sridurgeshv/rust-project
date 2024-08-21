use actix_cors::Cors;
use actix_web::{get, post, put, App, HttpServer, Responder, HttpResponse, web, middleware};
use serde::{Serialize, Deserialize};
use chrono::{Local, Datelike, NaiveDate};
use std::sync::Mutex;
use uuid::Uuid;

#[derive(Serialize)]
struct DateResponse {
    day: u32,
    month: u32,
    year: i32,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
struct Task {
    id: Option<u32>,
    title: String,
    date: String,
    completed: bool,
    priority: String,
}

#[derive(Serialize, Deserialize, Clone)]
struct Comment {
    id: Option<u32>,
    title: String,
    content: String,
}

#[derive(Serialize, Deserialize, Clone)] 
struct Goal {
    id: Uuid,
    title: String,
    description: String,
    priority: String,
    due_date: String,
    progress: u8,
    sub_goals: Vec<SubGoal>,
}

#[derive(Serialize, Deserialize, Clone)] 
struct SubGoal {
    id: Uuid,
    title: String,
    completed: bool,
    progress: u8,
}

#[derive(Serialize, Deserialize)]
struct CreateGoal {
    title: String,
    description: String,
    priority: String,
    due_date: String, 
}

#[derive(Serialize, Deserialize)]
struct UpdateProgress {
    progress: u8,
}

struct AppState {
    tasks: Mutex<Vec<Task>>,
    comments: Mutex<Vec<Comment>>,
    goals: Mutex<Vec<Goal>>, // Add this line
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
    println!("Received task: {:?}", task);
    let mut tasks = data.tasks.lock().unwrap();
    let mut new_task = task.into_inner();
    new_task.id = Some(tasks.len() as u32 + 1);
    
    // Convert the user-friendly date to an actual date
    new_task.date = match new_task.date.as_str() {
        "Today" => Local::now().date_naive().to_string(),
        "Tomorrow" => (Local::now().date_naive() + chrono::Duration::days(1)).to_string(),
        "This Week" => (Local::now().date_naive() + chrono::Duration::days(7)).to_string(),
        "This Month" => {
            let today = Local::now().date_naive();
            let next_month = if today.month() == 12 {
                NaiveDate::from_ymd_opt(today.year() + 1, 1, today.day()).unwrap_or(today)
            } else {
                NaiveDate::from_ymd_opt(today.year(), today.month() + 1, today.day()).unwrap_or(today)
            };
            next_month.to_string()
        },
        _ => new_task.date, // Keep the original string if it's not one of the special cases
    };

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

#[get("/goals")]
async fn get_goals(data: web::Data<AppState>) -> impl Responder {
    let goals = data.goals.lock().unwrap();
    HttpResponse::Ok().json(&*goals)
}

#[post("/goals")]
async fn create_goal(data: web::Data<AppState>, goal: web::Json<CreateGoal>) -> impl Responder {
    let mut goals = data.goals.lock().unwrap();
    let new_goal = Goal {
        id: Uuid::new_v4(),
        title: goal.title.clone(),
        description: goal.description.clone(),
        priority: goal.priority.clone(),
        due_date: goal.due_date.clone(), // Use `due_date` here
        progress: 0,
        sub_goals: Vec::new(),
    };
    goals.push(new_goal.clone());
    HttpResponse::Ok().json(new_goal)
}

#[put("/goals/{id}/progress")]
async fn update_progress(
    data: web::Data<AppState>,
    path: web::Path<Uuid>,
    progress: web::Json<UpdateProgress>,
) -> impl Responder {
    let id = path.into_inner(); // Destructure `web::Path` here
    let mut goals = data.goals.lock().unwrap();
    if let Some(goal) = goals.iter_mut().find(|g| g.id == id) {
        goal.progress = progress.progress;
        HttpResponse::Ok().json(goal)
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
        goals: Mutex::new(Vec::new()),
    });

    HttpServer::new(move || {
        App::new()
            .app_data(web::JsonConfig::default().error_handler(|err, _req| {
                actix_web::error::ErrorBadRequest(format!("JSON Error: {}", err))
            }))
            .wrap(middleware::Logger::default())
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
            .service(get_goals)
            .service(create_goal) 
            .service(update_progress) 
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}