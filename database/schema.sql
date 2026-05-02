-- ===================================================
-- SCRIPT SQL PARA TASK MANAGER
-- Base de datos MySQL con tablas de usuarios y tareas
-- ===================================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS task_manager_db;
USE task_manager_db;

-- ===================================================
-- TABLA DE USUARIOS
-- ===================================================
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  KEY idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
-- TABLA DE TAREAS
-- ===================================================
CREATE TABLE tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority ENUM('baja', 'media', 'alta') DEFAULT 'media',
  status ENUM('pendiente', 'en_progreso', 'completada') DEFAULT 'pendiente',
  dueDate DATE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_tasks_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  
  KEY idx_user_id (userId),
  KEY idx_status (status),
  KEY idx_priority (priority),
  KEY idx_dueDate (dueDate),
  KEY idx_user_status (userId, status),
  KEY idx_user_priority (userId, priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
-- DATOS DE PRUEBA
-- ===================================================

INSERT INTO users (email, password, firstName, lastName) VALUES 
(
  'test@example.com',
  '$2a$10$e0MYzqF4Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8', 
  'Juan',
  'Pérez'
);

INSERT INTO tasks (userId, title, description, priority, status, dueDate) VALUES
(1, 'Completar informe mensual', 'Terminar el informe de vendidas del mes', 'alta', 'pendiente', DATE_ADD(CURDATE(), INTERVAL 3 DAY)),
(1, 'Revisar propuestas', 'Revisar las propuestas de clientes nuevos', 'media', 'en_progreso', DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(1, 'Actualizar documentación', 'Actualizar docs del proyecto', 'baja', 'pendiente', DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
(1, 'Reunión con el equipo', 'Sincronización semanal con el equipo de desarrollo', 'media', 'pendiente', DATE_ADD(CURDATE(), INTERVAL 2 DAY)),
(1, 'Implementar feature de filtros', 'Agregar filtros avanzados al dashboard', 'alta', 'en_progreso', DATE_ADD(CURDATE(), INTERVAL 10 DAY));

-- ===================================================
-- VISTA ÚTIL
-- ===================================================

CREATE VIEW user_task_stats AS
SELECT 
  u.id,
  u.email,
  u.firstName,
  u.lastName,
  COUNT(t.id) as total_tasks,
  SUM(CASE WHEN t.status = 'completada' THEN 1 ELSE 0 END) as completed_tasks,
  SUM(CASE WHEN t.status = 'pendiente' THEN 1 ELSE 0 END) as pending_tasks,
  SUM(CASE WHEN t.status = 'en_progreso' THEN 1 ELSE 0 END) as in_progress_tasks,
  SUM(CASE WHEN t.priority = 'alta' THEN 1 ELSE 0 END) as high_priority_tasks
FROM users u
LEFT JOIN tasks t ON u.id = t.userId
GROUP BY u.id, u.email, u.firstName, u.lastName;