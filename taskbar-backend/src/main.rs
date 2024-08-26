use actix_cors::Cors;
use actix_web::{get, post, put, delete, App, HttpServer, Responder, HttpResponse, web, middleware};
use serde::{Serialize, Deserialize};
use chrono::{Local, Datelike, NaiveDate};
use std::sync::Mutex;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Clone, Debug)]
struct User {
    username: String,
    password: String,
    phone: Option<String>,
    focus_area: Option<String>,
    availability_status: Option<String>,
    notifications: Notifications,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
struct Notifications {
    task_reminders: bool,
    deadline_alerts: bool,
    team_updates: bool,
    email_notifications: bool,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
struct SignInResponse {
    success: bool,
    message: String,
}

#[derive(Deserialize)]
struct UpdateUser {
    username: String,
    password: String,
    phone: Option<String>,
    focus_area: Option<String>,
    availability_status: Option<String>,
    notifications: Notifications,
}

#[derive(Default)]
struct UserState {
    users: Mutex<Vec<User>>,
}

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
struct TrackedTask {
    id: Option<u32>,
    title: String,
    time: u32,  // Time in minutes
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

#[derive(Serialize, Deserialize, Clone, Debug)]
struct BotTask {
    id: Option<u32>,
    title: String,
    completed: bool,
    is_pomodoro: bool,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
struct BotGoal {
    id: Option<Uuid>,
    title: String,
    progress: u32,
}

#[derive(Serialize, Deserialize, Clone)]
struct Link {
    id: Option<u32>,
    title: String,
    url: String,
}

// Music endpoint
#[derive(Serialize)]
struct MusicResponse {
    url: String,
}

struct AppState {
    tasks: Mutex<Vec<Task>>,
    comments: Mutex<Vec<Comment>>,
    goals: Mutex<Vec<Goal>>, // Add this line
    tracked_tasks: Mutex<Vec<TrackedTask>>,  // State for tracked tasks
    links: Mutex<Vec<Link>>,
}

pub struct BotAppState {
    tasks: Mutex<Vec<BotTask>>,
    goals: Mutex<Vec<BotGoal>>,
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

#[put("/tasks/{id}")]
async fn update_task(task_id: web::Path<u32>, task: web::Json<Task>, data: web::Data<AppState>) -> impl Responder {
    let mut tasks = data.tasks.lock().unwrap();
    let task_id = task_id.into_inner();
    
    if let Some(existing_task) = tasks.iter_mut().find(|t| t.id == Some(task_id)) {
        existing_task.title = task.title.clone();
        existing_task.date = task.date.clone();
        existing_task.priority = task.priority.clone();
        existing_task.completed = task.completed;
        HttpResponse::Ok().json(existing_task.clone())
    } else {
        HttpResponse::NotFound().finish()
    }
}

#[delete("/tasks/{id}")]
async fn delete_task(task_id: web::Path<u32>, data: web::Data<AppState>) -> impl Responder {
    let mut tasks = data.tasks.lock().unwrap();
    let task_id = task_id.into_inner();
    
    let initial_len = tasks.len();
    tasks.retain(|t| t.id != Some(task_id));
    
    if tasks.len() < initial_len {
        HttpResponse::Ok().finish()
    } else {
        HttpResponse::NotFound().finish()
    }
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

#[get("/tracked-tasks")]
async fn get_tracked_tasks(data: web::Data<AppState>) -> impl Responder {
    let tracked_tasks = data.tracked_tasks.lock().unwrap();
    HttpResponse::Ok().json(tracked_tasks.clone())
}

#[post("/tracked-tasks")]
async fn add_tracked_task(tracked_task: web::Json<TrackedTask>, data: web::Data<AppState>) -> impl Responder {
    let mut tracked_tasks = data.tracked_tasks.lock().unwrap();
    let mut new_tracked_task = tracked_task.into_inner();
    new_tracked_task.id = Some(tracked_tasks.len() as u32 + 1);
    tracked_tasks.push(new_tracked_task.clone());
    HttpResponse::Ok().json(new_tracked_task)
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

// Bot routes
#[get("/bot/tasks")]
async fn get_bot_tasks(data: web::Data<BotAppState>) -> impl Responder {
    let tasks = data.tasks.lock().unwrap();
    HttpResponse::Ok().json(tasks.clone())
}

#[post("/bot/tasks")]
async fn add_bot_task(task: web::Json<BotTask>, data: web::Data<BotAppState>) -> impl Responder {
    let mut tasks = data.tasks.lock().unwrap();
    let mut new_task = task.into_inner();
    new_task.id = Some(tasks.len() as u32 + 1);
    tasks.push(new_task.clone());
    HttpResponse::Ok().json(new_task)
}

// Update bot task
#[put("/bot/tasks/{id}")]
async fn update_bot_task(
    path: web::Path<u32>,
    task: web::Json<BotTask>,
    data: web::Data<BotAppState>
) -> impl Responder {
    let id = path.into_inner();
    let mut tasks = data.tasks.lock().unwrap();
    
    // Find the task with the provided ID and update it
    if let Some(existing_task) = tasks.iter_mut().find(|t| t.id == Some(id)) {
        existing_task.title = task.title.clone();
        existing_task.completed = task.completed;
        existing_task.is_pomodoro = task.is_pomodoro;
        HttpResponse::Ok().json(existing_task.clone())
    } else {
        HttpResponse::NotFound().finish()
    }
}

#[post("/bot/tasks/complete/{id}")]
async fn complete_bot_task(task_id: web::Path<u32>, data: web::Data<BotAppState>) -> impl Responder {
    let mut tasks = data.tasks.lock().unwrap();
    let task_id = task_id.into_inner();
    
    if let Some(task) = tasks.iter_mut().find(|task| task.id == Some(task_id)) {
        task.completed = true;
        HttpResponse::Ok().json(task.clone())
    } else {
        HttpResponse::NotFound().finish()
    }
}

#[get("/bot/goals")]
async fn get_bot_goals(data: web::Data<BotAppState>) -> impl Responder {
    let goals = data.goals.lock().unwrap();
    HttpResponse::Ok().json(goals.clone())
}

#[post("/bot/goals")]
async fn add_bot_goal(
    goal: web::Json<BotGoal>,
    data: web::Data<BotAppState>
) -> impl Responder {
    let mut goals = data.goals.lock().unwrap();
    let mut new_goal = goal.into_inner();
    new_goal.id = Some(Uuid::new_v4()); // Assign a new UUID
    goals.push(new_goal.clone());
    HttpResponse::Ok().json(new_goal)
}

#[delete("/bot/tasks/{id}")]
async fn delete_bot_task(task_id: web::Path<u32>, data: web::Data<BotAppState>) -> impl Responder {
    let mut tasks = data.tasks.lock().unwrap();
    let task_id = task_id.into_inner();
    if tasks.iter().position(|task| task.id == Some(task_id)).is_some() {
        tasks.retain(|task| task.id != Some(task_id));
        HttpResponse::Ok().finish()
    } else {
        HttpResponse::NotFound().finish()
    }
}

#[post("/signup")]
async fn signup(user: web::Json<User>, data: web::Data<UserState>) -> impl Responder {
    let mut users = data.users.lock().unwrap();
    if users.iter().any(|u| u.username == user.username) {
        return HttpResponse::BadRequest().json(SignInResponse {
            success: false,
            message: "Username already exists".to_string(),
        });
    }
    users.push(user.into_inner());
    HttpResponse::Ok().json(SignInResponse {
        success: true,
        message: "User registered successfully".to_string(),
    })
}


#[post("/signin")]
async fn signin(user: web::Json<User>, data: web::Data<UserState>) -> impl Responder {
    let users = data.users.lock().unwrap();
    if users.iter().any(|u| u.username == user.username && u.password == user.password) {
        HttpResponse::Ok().json(SignInResponse {
            success: true,
            message: "Signin successful".to_string(),
        })
    } else {
        HttpResponse::Unauthorized().json(SignInResponse {
            success: false,
            message: "Invalid username or password".to_string(),
        })
    }
}

#[post("/update-user")]
async fn update_user(user: web::Json<UpdateUser>, data: web::Data<UserState>) -> impl Responder {
    let mut users = data.users.lock().unwrap();
    if let Some(existing_user) = users.iter_mut().find(|u| u.username == user.username) {
        existing_user.password = user.password.clone();
        existing_user.phone = user.phone.clone();
        existing_user.focus_area = user.focus_area.clone();
        existing_user.availability_status = user.availability_status.clone();
        existing_user.notifications = user.notifications.clone();
        return HttpResponse::Ok().json(SignInResponse {
            success: true,
            message: "User details updated successfully".to_string(),
        });
    }
    HttpResponse::BadRequest().json(SignInResponse {
        success: false,
        message: "User not found".to_string(),
    })
}

#[get("/links")]
async fn get_links(data: web::Data<AppState>) -> impl Responder {
    let links = data.links.lock().unwrap();
    HttpResponse::Ok().json(links.clone())
}

#[post("/links")]
async fn add_link(link: web::Json<Link>, data: web::Data<AppState>) -> impl Responder {
    let mut links = data.links.lock().unwrap();
    let mut new_link = link.into_inner();
    new_link.id = Some(links.len() as u32 + 1);
    links.push(new_link.clone());
    HttpResponse::Ok().json(new_link)
}

#[get("/api/music/{category}")]
async fn get_music(category: web::Path<String>) -> impl Responder {
    // Map categories to music URLs
    let url = match category.as_str() {
        "Relax" => "https://ritika12df.github.io/ritikaaudio/relax.mp3",
        "Focus" => "https://ritika12df.github.io/ritikaaudio/focus.mp3",
        "Energize" => "https://ritika12df.github.io/ritikaaudio/energize.mp3",
        "Sleep" => "https://ritika12df.github.io/ritikaaudio/sleep.mp3",
        "Meditate" => "https://ritika12df.github.io/ritikaaudio/meditate.mp3",
        _ => "https://ritika12df.github.io/ritikaaudio/default.mp3",
    };

    HttpResponse::Ok().json(MusicResponse { url: url.to_string() })
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let app_state = web::Data::new(AppState {
        tasks: Mutex::new(vec![]),
        links: Mutex::new(vec![]),
        tracked_tasks: Mutex::new(vec![]), // Initialize tracked_tasks state
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

    let bot_state = web::Data::new(BotAppState {
        tasks: Mutex::new(vec![]),
        goals: Mutex::new(vec![]),
    });

    let user_state = web::Data::new(UserState::default());
    HttpServer::new(move || {
        App::new()
            .app_data(web::JsonConfig::default().error_handler(|err, _req| {
                actix_web::error::ErrorBadRequest(format!("JSON Error: {}", err))
            }))
            .app_data(app_state.clone())
            .app_data(bot_state.clone())
            .app_data(user_state.clone())
            .wrap(middleware::Logger::default())
            .wrap(
            Cors::default()
                .allow_any_origin()
                .allow_any_method()
                .allow_any_header()
                .supports_credentials()
            )
            .app_data(app_state.clone())
            .service(current_date)
            .service(get_tasks)
            .service(add_task)
            .service(complete_task)
            .service(update_task)
            .service(delete_task)
            .service(get_tracked_tasks) 
            .service(add_tracked_task)  
            .service(get_comments)
            .service(add_comment)
            .service(update_comment)
            .service(get_goals)
            .service(create_goal) 
            .service(update_progress) 
            .service(get_bot_tasks)
            .service(add_bot_task)
            .service(update_bot_task)
            .service(complete_bot_task)
            .service(delete_bot_task)
            .service(get_bot_goals)
            .service(add_bot_goal)
            .service(get_links)
            .service(add_link)
            .service(get_music)
            .service(signup) 
            .service(signin) 
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}