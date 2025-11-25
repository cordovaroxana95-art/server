
const API_URL = 'http://localhost:3000/api/users';

document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
    document.getElementById('user-form').addEventListener('submit', handleFormSubmit);
});

// --- Funciones CRUD de la API ---

async function fetchUsers() {
    try {
        const response = await fetch(API_URL);
        const users = await response.json();
        renderUsers(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        alert('Error al conectar con la API.');
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    clearMessages();

    const id = document.getElementById('user-id').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const age = document.getElementById('age').value ? parseInt(document.getElementById('age').value) : undefined;
    
    const userData = { name, email, age };

    if (id) {
        // Modo Edición (PUT)
        await updateAPIUser(parseInt(id), userData);
    } else {
        // Modo Creación (POST)
        await createAPIUser(userData);
    }
}

async function createAPIUser(userData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Usuario creado con éxito!');
            resetForm();
            fetchUsers();
        } else {
            // Manejo de errores de validación del backend
            displayValidationErrors(result.validationErrors || [{ msg: result.error || 'Error al crear usuario.' }]);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function updateAPIUser(id, userData) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Usuario actualizado con éxito!');
            resetForm();
            fetchUsers();
        } else {
            displayValidationErrors(result.validationErrors || [{ msg: result.error || 'Error al actualizar usuario.' }]);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function deleteAPIUser(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.status === 204) {
            alert('Usuario eliminado con éxito!');
            fetchUsers();
        } else {
            const error = await response.json();
            alert('Error al eliminar: ' + (error.error || 'Desconocido'));
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// --- Funciones de Interfaz de Usuario (UI) ---

function renderUsers(users) {
    const tableBody = document.querySelector('#user-table tbody');
    tableBody.innerHTML = ''; 

    if (users.length === 0) {
        document.getElementById('no-users').style.display = 'block';
        return;
    }
    document.getElementById('no-users').style.display = 'none';


    users.forEach(user => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.age || '-'}</td>
            <td>
                <button class="action-btn edit-btn" onclick="prepareEdit(${user.id}, '${user.name}', '${user.email}', ${user.age})">Editar</button>
                <button class="action-btn delete-btn" onclick="deleteAPIUser(${user.id})">Eliminar</button>
            </td>
        `;
    });
}

function prepareEdit(id, name, email, age) {
    // Rellena el formulario con los datos del usuario
    document.getElementById('user-id').value = id;
    document.getElementById('name').value = name;
    document.getElementById('email').value = email;
    document.getElementById('age').value = age || '';
    
    // Cambia el texto del formulario
    document.querySelector('#user-form-section h2').textContent = `Editar Usuario #${id}`;
    document.getElementById('submit-btn').textContent = 'Guardar Cambios';
    window.scrollTo(0, 0); // Desplaza al inicio para ver el formulario
    clearMessages();
}

function resetForm() {
    document.getElementById('user-form').reset();
    document.getElementById('user-id').value = '';
    document.querySelector('#user-form-section h2').textContent = 'Crear Nuevo Usuario';
    document.getElementById('submit-btn').textContent = 'Crear Usuario';
    clearMessages();
}

function clearMessages() {
    document.getElementById('form-messages').innerHTML = '';
}

function displayValidationErrors(errors) {
    const msgDiv = document.getElementById('form-messages');
    msgDiv.classList.add('error');
    msgDiv.innerHTML = '<strong>Errores de Validación:</strong><ul>' + 
        errors.map(err => `<li>${err.msg}</li>`).join('') +
        '</ul>';
}