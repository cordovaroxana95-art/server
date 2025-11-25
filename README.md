🚀 Gestión de Usuarios API & Frontend
Este proyecto implementa una solución completa para la gestión de usuarios que consta de un backend (API) modular construida con Node.js/Express y un frontend simple, responsivo e independiente utilizando HTML, CSS y JavaScript puro.

✨ Características Principales
Módulo,Característica,Detalle
API (Backend),CRUD Completo,"Puntos finales para Crear (POST), Leer (GET), Actualizar (PUT) y Eliminar (DELETE) usuarios."

API (Backend),Middleware Implementado,Incluye un middleware de Logging y manejo de CORS.

API (Backend),Validación Avanzada,"Utiliza express-validator para reglas robustas, incluyendo validación de formato (email, edad) y unicidad del correo electrónico."

Arquitectura,Modular y Limpia,"Separación clara de responsabilidades en carpetas: routes, middlewares y data."

Frontend,Interfaz Responsiva,Interfaz de usuario adaptativa diseñada con HTML y CSS (Media Queries).

Frontend,Consumo de API,Lógica en JavaScript para interactuar con todos los puntos finales CRUD del backend.

🗂️ Estructura del Proyecto
El proyecto está dividido en dos directorios principales:

/user-management-app
|-- backend/    <-- Servidor API (Node.js/Express)
|   |-- data/
|   |-- middlewares/
|   |-- routes/
|   |-- server.js
|
|-- frontend/   <-- Interfaz de Usuario (HTML/CSS/JS)
|   |-- assets/
|   |-- index.html


🛠️ Configuración y Ejecución
Sigue estos pasos para levantar el backend (API) y el frontend.

1. Requisitos
Node.js (versión 14 o superior)

npm (incluido con Node.js)

2. Configuración del Backend
Navega al directorio del backend:

Bash

cd backend

Instala las dependencias necesarias:

Bash

npm install express express-validator cors
Ejecuta el servidor:

Bash

# Puedes necesitar instalar nodemon globalmente o usar 'npm start' si lo configuraste
node server.js
El API se ejecutará en: http://localhost:3000

3. Configuración del Frontend
El frontend es estático y no requiere dependencias de Node.js, pero necesita ser servido a través de HTTP para evitar problemas de CORS/seguridad con el backend.

Abre el archivo frontend/index.html en tu navegador web. O

Si estás usando Visual Studio Code, puedes usar la extensión Live Server para abrir el index.html. El frontend se ejecutará típicamente en http://127.0.0.1:5500.

🌐 Puntos Finales de la API
La API maneja todas las solicitudes bajo el prefijo /api/users.
Método,URL,Descripción
GET,/api/users,Obtiene la lista completa de usuarios.
GET,/api/users/:id,Obtiene un usuario específico por ID.
POST,/api/users,Crea un nuevo usuario. Requiere validación.
PUT,/api/users/:id,Actualiza un usuario existente por ID. Requiere validación.
DELETE,/api/users/:id,Elimina un usuario por ID.

Ejemplo de Solicitud (POST)
Para crear un nuevo usuario con cURL:

Bash

curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -d '{"name": "Eva Green", "email": "eva@test.com", "age": 35}'

     Ejemplo de Validación
Si el correo electrónico ya existe o el formato es incorrecto (en POST o PUT), la API devolverá un código de estado 400 Bad Request con un objeto que contendrá la clave validationErrors.

Respuesta de Error de Validación:
JSON:
{
  "validationErrors": [
    {
      "msg": "El correo electrónico ya está registrado.",
      "param": "email",
      "location": "body"
    }
  ]
}

🧑‍💻 Desarrollado con
Backend: Node.js, Express, express-validator

Frontend: HTML5, CSS3, JavaScript (Vanilla JS)


