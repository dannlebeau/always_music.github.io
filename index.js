const { Client } = require('pg');
const readline = require('readline');

// Configuración de la conexión a la base de datos
const client = new Client({
    host: "localhost",
    port: 5432,
    database: "aalways_music",
    user: "postgres",
    password: "3022",
});

// Función para agregar un nuevo estudiante
async function agregarEstudiante(client) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Nombre: ', async (nombre) => {
        rl.question('Rut: ', async (rut) => {
            rl.question('Curso: ', async (curso) => {
                rl.question('Nivel: ', async (nivel) => {
                    try {
                        await client.connect();
                        await client.query('INSERT INTO estudiantes (nombre, rut, curso, nivel) VALUES ($1, $2, $3, $4)', [nombre, rut, curso, nivel]);
                        console.log('Estudiante agregado correctamente');
                    } catch (error) {
                        console.error('Error al agregar estudiante:', error);
                    } finally {
                        rl.close();
                        await client.end();
                    }
                });
            });
        });
    });
}

// Función para obtener un estudiante por su rut
async function obtenerEstudiantePorRut(client, rut) {
    try {
        await client.connect();
        const result = await client.query('SELECT * FROM estudiantes WHERE rut = $1', [rut]);
        console.log('Estudiante encontrado:', result.rows[0]);
    } catch (error) {
        console.error('Error al obtener estudiante por rut:', error);
    } finally {
        await client.end();
    }
}

// Función para obtener todos los estudiantes
async function obtenerTodosLosEstudiantes(client) {
    try {
        await client.connect();
        const result = await client.query('SELECT * FROM estudiantes');
        console.log('Todos los estudiantes:', result.rows);
    } catch (error) {
        console.error('Error al obtener todos los estudiantes:', error);
    } finally {
        await client.end();
    }
}

// Función para actualizar los datos de un estudiante
async function actualizarEstudiante(client, id, nombre, rut, curso, nivel) {
    try {
        await client.connect();
        await client.query('UPDATE estudiantes SET nombre = $1, rut = $2, curso = $3, nivel = $4 WHERE id = $5', [nombre, rut, curso, nivel, id]);
        console.log('Estudiante actualizado correctamente');
    } catch (error) {
        console.error('Error al actualizar estudiante:', error);
    } finally {
        await client.end();
    }
}

// Función para eliminar un estudiante por su id
async function eliminarEstudiante(client, id) {
    try {
        await client.connect();
        await client.query('DELETE FROM estudiantes WHERE id = $1', [id]);
        console.log('Estudiante eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar estudiante:', error);
    } finally {
        await client.end();
    }
}

// Conexión a la base de datos y ejecución de las funciones según los argumentos de línea de comandos
async function main() {
    const operacion = process.argv[2];

    switch (operacion) {
        case 'agregar':
            await agregarEstudiante(client);
            break;
        case 'consultarPorRut':
            await obtenerEstudiantePorRut(client, process.argv[3]);
            break;
        case 'consultarTodos':
            await obtenerTodosLosEstudiantes(client);
            break;
        case 'actualizar':
            await actualizarEstudiante(client, ...process.argv.slice(3));
            break;
        case 'eliminar':
            await eliminarEstudiante(client, process.argv[3]);
            break;
        default:
            console.log('Operación no reconocida');
    }
}

main();