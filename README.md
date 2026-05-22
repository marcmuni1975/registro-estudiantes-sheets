# Colegio Académico - Registro Digital de Estudiantes 🏫✨

Un frontend moderno, elegante y totalmente responsivo diseñado para realizar el registro de datos de estudiantes y sus respectivos contactos escolares. Esta interfaz se conecta de forma directa, en tiempo real y sin intermediarios (serverless) a una hoja de cálculo en tu cuenta personal de **Google Sheets** utilizando **Google Apps Script**.

---

## 🌟 Características Principales

*   **Diseño Premium ("Rich Aesthetics"):** Estética moderna con colores armoniosos, tipografías elegantes (Outfit & Plus Jakarta Sans) y efectos visuales de alta calidad como glassmorphism (`backdrop-filter`).
*   **Modo Oscuro Nactivo:** Sistema inteligente que detecta las preferencias de tu sistema operativo y permite alternar manualmente con un botón flotante con transiciones súper suaves.
*   **Sincronización en Tiempo Real:** Envío de datos asíncronos mediante `fetch` directamente a la hoja de cálculo de Google.
*   **Modo Demo Integrado:** Si no has configurado tu Google Sheet, la aplicación funciona de forma local almacenando los registros de forma segura en el `localStorage` del navegador.
*   **Panel de Configuración Integrado:** Panel interactivo (modal `<dialog>`) en la propia interfaz de usuario para que puedas ingresar o quitar tu URL de conexión en cualquier momento.
*   **Validación Avanzada:** Validación de campos en tiempo real mediante pseudo-clases CSS modernas y retroalimentación interactiva con notificaciones flotantes (Toasts).
*   **Totalmente Responsivo:** Diseñado con Mobile-First y CSS Grid/Flexbox, adaptándose a teléfonos móviles, tablets y computadoras de escritorio.

---

## 📂 Estructura del Proyecto

```text
bbdd/
├── index.html     # Estructura semántica HTML5 y componentes del sistema.
├── style.css      # Hoja de estilos CSS premium (Vanilla CSS con variables CSS).
├── app.js         # Lógica interactiva, persistencia y conexión API (fetch).
└── README.md      # Documentación del proyecto y guías de configuración.
```

---

## 🛠️ Configuración Paso a Paso de Google Sheets

Para activar el almacenamiento de datos automático en tu cuenta personal de Google Sheets, sigue estos sencillos pasos:

### Paso 1: Crear la Hoja de Cálculo
1. Ve a [Google Sheets](https://sheets.google.com) y crea una hoja de cálculo en blanco con el nombre: `Registro de Estudiantes`.
2. En la primera fila (Fila 1), crea los siguientes encabezados en orden exacto:
    *   **A1**: `Fecha`
    *   **B1**: `Nombre Completo`
    *   **C1**: `Curso/Grado`
    *   **D1**: `Nombre del Apoderado`
    *   **E1**: `Teléfono de Contacto`
    *   **F1**: `Correo Electrónico`
    *   **G1**: `Observaciones`

### Paso 2: Configurar Google Apps Script
1. En el menú superior de la hoja de cálculo, haz clic en **Extensiones** -> **Apps Script**.
2. Borra todo el código autogenerado del editor y pega el siguiente script:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  try {
    var data = JSON.parse(e.postData.contents);
    
    // Validar datos mínimos
    if (!data.nombreCompleto) {
      return ContentService.createTextOutput(JSON.stringify({
        "status": "error",
        "message": "Falta el nombre completo del estudiante"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Agregar fila a la hoja
    sheet.appendRow([
      new Date(), // Fecha y hora del registro
      data.nombreCompleto,
      data.curso,
      data.apoderado,
      data.telefono,
      data.email,
      data.observaciones || ""
    ]);
    
    // Configurar cabeceras CORS
    return ContentService.createTextOutput(JSON.stringify({
      "status": "success",
      "message": "Datos guardados correctamente"
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST");
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      "status": "error",
      "message": error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST");
  }
}

// Habilitar soporte para CORS preflight (OPTIONS)
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
```

3. Guarda los cambios haciendo clic en el icono de **Guardar (disco)** en la parte superior.

### Paso 3: Desplegar la Web App (API)
1. En la parte superior derecha del editor, haz clic en **Implementar** (Deploy) -> **Nueva implementación** (New deployment).
2. Haz clic en el icono de engranaje al lado de *Seleccionar tipo* y selecciona **Aplicación web** (Web app).
3. Rellena las opciones de configuración:
    *   **Descripción:** `API Registro Colegio`
    *   **Ejecutar como:** `Tú (tu-correo-de-google@gmail.com)`
    *   **Quién tiene acceso:** `Cualquiera` *(Esto permite que el formulario se conecte de forma remota sin requerir inicio de sesión de Google de cada usuario).*
4. Haz clic en el botón azul **Implementar**.
5. Google te solicitará **Autorizar acceso**. Haz clic en él, selecciona tu cuenta, luego haz clic en *Configuración Avanzada* (Advanced) -> *Ir a Proyecto (no seguro)* y concede los permisos requerimos para administrar tus hojas de cálculo.
6. Una vez completado, copia la **URL de la aplicación web** generada (debe terminar en `/exec`).

### Paso 4: Enlazar con el Frontend
1. Abre el archivo `index.html` en tu navegador de forma local.
2. Haz clic en el icono de **Configuración (engranaje)** en la esquina superior derecha de la interfaz.
3. Pega la URL copiada de Google Apps Script y haz clic en **Guardar Configuración**.
4. ¡Listo! El banner superior cambiará a color verde indicando que el sistema está conectado. Todos tus registros a partir de ese momento se almacenarán directamente en tu Google Sheet.

---

## 🚀 Cómo Ejecutar Localmente

No se requiere ningún servidor complejo para esta prueba:
1. Simplemente haz doble clic sobre el archivo `index.html` para abrirlo en cualquier navegador (Chrome, Safari, Firefox, Edge).
2. O si utilizas Visual Studio Code, puedes hacer clic derecho y seleccionar **Open with Live Server** para simular una experiencia de hosting real.

---

## 📦 Respaldar e Integrar en tu GitHub

Si deseas subir y respaldar este proyecto en tu propia cuenta de GitHub, sigue estos sencillos pasos desde la terminal de tu máquina en esta misma carpeta:

1.  **Inicializar Git:**
    ```bash
    git init
    ```
2.  **Añadir Archivos:**
    ```bash
    git add .
    ```
3.  **Hacer Primer Commit:**
    ```bash
    git commit -m "feat: primer commit - registro de estudiantes premium"
    ```
4.  **Enlazar a Repositorio en GitHub:**
    *(Crea un repositorio nuevo vacío en la web de GitHub y copia su URL)*
    ```bash
    git remote add origin https://github.com/tu-usuario/nombre-repositorio.git
    git branch -M main
    ```
5.  **Subir Cambios:**
    ```bash
    git push -u origin main
    ```
