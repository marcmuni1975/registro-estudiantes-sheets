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

## 🛠️ Configuración de Google Sheets (¡Método Autoinstalable Automático!)

Para activar el almacenamiento de datos automático en tu cuenta de Google Drive, sigue estos sencillos pasos:

### Paso 1: Configurar Google Apps Script (De forma independiente)
1. Ve a [Google Apps Script](https://script.google.com) (inicia sesión con tu cuenta de Google).
2. Haz clic en el botón azul **Nuevo proyecto** (New project).
3. Borra todo el código autogenerado del editor y pega el siguiente script:

```javascript
function doPost(e) {
  var props = PropertiesService.getScriptProperties();
  var sheetId = props.getProperty("SHEET_ID");
  var ss;
  
  try {
    // 1. Si es la primera vez, el script crea la hoja automáticamente en tu Google Drive
    if (!sheetId) {
      ss = SpreadsheetApp.create("Registro de Estudiantes Automático");
      var firstSheet = ss.getActiveSheet();
      
      // Escribimos los encabezados de forma automática
      firstSheet.appendRow([
        "Fecha", 
        "Nombre Completo", 
        "Curso/Grado", 
        "Nombre del Apoderado", 
        "Teléfono de Contacto", 
        "Correo Electrónico", 
        "Observaciones"
      ]);
      
      // Guardamos el ID de la hoja en la memoria del script para futuros registros
      props.setProperty("SHEET_ID", ss.getId());
    } else {
      // Si ya existe, simplemente la abrimos por su ID guardado
      ss = SpreadsheetApp.openById(sheetId);
    }
    
    var sheet = ss.getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // 2. Insertamos la información del estudiante
    sheet.appendRow([
      new Date(),
      data.nombreCompleto,
      data.curso,
      data.apoderado,
      data.telefono,
      data.email,
      data.observaciones || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      "status": "success",
      "message": "Datos guardados correctamente",
      "sheetUrl": ss.getUrl()
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

// Soporte para solicitudes CORS preflight
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
```

4. Haz clic en el icono del **Disco Floppy 💾 (Guardar)** en la parte superior.

### Paso 2: Desplegar la Web App (API)
1. En la esquina superior derecha, haz clic en **Implementar** (Deploy) -> **Nueva implementación** (New deployment).
2. Haz clic en el icono de engranaje al lado de *Seleccionar tipo* y selecciona **Aplicación web** (Web app).
3. Rellena las opciones de configuración:
    *   **Descripción:** `API Registro Autoinstalable`
    *   **Ejecutar como:** `Tú (tu-correo-de-google@gmail.com)`
    *   **Quién tiene acceso:** `Cualquiera` (Anyone).
4. Haz clic en el botón azul **Implementar**.
5. Google te solicitará **Autorizar acceso**. Haz clic en él, selecciona tu cuenta, luego haz clic en *Configuración Avanzada* (Advanced) -> *Ir a Proyecto (no seguro)* y concede los permisos requerimos para que el script pueda crear archivos en tu Drive.
6. Copia la **URL de la aplicación web** generada (debe terminar en `/exec`).

### Paso 3: Enlazar con el Frontend
1. Abre el archivo `index.html` en tu navegador.
2. Haz clic en el icono del **Engranaje ⚙️ (Configuración)** en la esquina superior derecha.
3. Pega la URL copiada y haz clic en **Guardar Configuración**.
4. ¡Listo! El banner se volverá verde. En tu primer envío, el script creará automáticamente una hoja de cálculo llamada **"Registro de Estudiantes Automático"** en tu Google Drive y empezará a llenarla. No necesitas hacer nada manual en Sheets.

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
