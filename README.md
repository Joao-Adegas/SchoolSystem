# 📚 Academic Management System

A complete system for managing professors, courses, and room reservations, developed with Django and Django Rest Framework.

## 🎯 Project Objective

Develop a management system for professors, courses, and room reservations, using Django for the back-end. The system will allow **Managers** to register, update, and delete information about professors, their courses, and room reservations. Additionally, the system will offer authentication features to ensure that only managers can perform these operations, while **Professors** will have restricted access to view information relevant to their activities.

## 🚀 Features

### 👥 Professor Management
- ✅ **Professor Registration**: Register new professors with essential information
- 📋 **Professor Listing**: View complete list of registered professors
- ✏️ **Professor Updates**: Modify contact data and assigned courses
- ❌ **Professor Deletion**: Remove professors from the system

### 📖 Course Management
- ➕ **Course Creation**: Register new courses and link to professors
- 👀 **Course Listing**: View all courses with responsible professor information
- 🔄 **Course Updates**: Modify details like name, workload, and responsible professor
- 🗑️ **Course Deletion**: Remove courses from the system

### 🏫 Room Reservation Management
- 📅 **Reservation Creation**: Make room reservations including date, time, and room
- 📊 **Reservation Listing**: View reservations with room details, schedule, and responsible professor
- 🔧 **Reservation Deletion**: Cancel room reservations

### 🔐 Authentication and Authorization System
- 🛡️ **JWT Authentication**: Token-based authentication system
- 👨‍💼 **Manager Profile**: Full access to CRUD operations
- 👨‍🏫 **Professor Profile**: Restricted access to view linked courses and reservations

## 📊 Data Model

### Professor
| Field | Type | Description |
|-------|------|-------------|
| ID | Integer | Unique identifier |
| Name | String | Professor's full name |
| Email | String | Email address |
| Phone | String | Phone number |
| Birth date | Date | Date of birth |
| Hire date | Date | Hiring date |
| Assigned courses | Relationship | Relationship with courses |

### Course
| Field | Type | Description |
|-------|------|-------------|
| Name | String | Course name |
| Program | String | Program it belongs to |
| Workload | Integer | Course workload |
| Description | Text | Course description |
| Responsible professor | ForeignKey | Relationship with professor |

### Room Reservation
| Field | Type | Description |
|-------|------|-------------|
| Start date | DateTime | Start date and time |
| End date | DateTime | End date and time |
| Period | Choice | Morning, Afternoon, or Evening |
| Reserved room | String | Room identification |
| Responsible professor | ForeignKey | Relationship with professor |
| Associated course | ForeignKey | Relationship with course |

## 🛠️ Technologies Used

- **Backend**: Django + Django Rest Framework
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Documentation**: Swagger/Postman

## 📋 Prerequisites

- Python 3.8+
- MySQL 8.0+
- pip (Python package manager)

## ⚙️ Installation and Configuration

### 1. Environment Setup
```bash
# Clone the repository
git clone https://github.com/your-username/academic-management-system.git
cd academic-management-system

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows

# Install dependencies
pip install django djangorestframework djangorestframework-simplejwt mysqlclient

```

### 2. MySQL Database Configuration

```bash
-- Create database
CREATE DATABASE academic_management_system;
CREATE USER 'django_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON academic_management_system.* TO 'django_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Django Configuration

# Configure settings.py file with MySQL credentials
# Create and apply migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

# Create superuser
```bash
python manage.py createsuperuser
```

# Run server
```bash
python manage.py runserver
```
### 🔧 Project Structure

```
SchoolSystem/
├── BackEnd/
│   ├── Projeto/
|   |    ├── __pycache__   
|   |    ├── __init__.py   
|   |    ├── asgi.py   
|   |    ├── settings.py   
|   |    ├── urls.py
|   |    └── wsgi.py   
│   ├── app/
│   ├── .gitignore
│   ├── Documnetation.txt
│   ├── Formativa.pdf
│   └── manage.py
└── FrontEnd/
    ├── models.py
    ├── serializers.py
    ├── views.py
    └── urls.py

```



