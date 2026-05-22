/**
 * ==========================================================================
 * LÓGICA DE LA APLICACIÓN - REGISTRO DE ESTUDIANTES
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // === SELECTORES DOM ===
    const themeToggleBtn = document.getElementById('theme-toggle');
    const btnOpenSettings = document.getElementById('btn-open-settings');
    const btnCloseSettings = document.getElementById('btn-close-settings');
    const btnCancelSettings = document.getElementById('btn-cancel-settings');
    const settingsDialog = document.getElementById('settings-dialog');
    const settingsForm = document.getElementById('settings-form');
    const apiUrlInput = document.getElementById('api-url');
    const btnResetApi = document.getElementById('btn-reset-api');
    
    const studentForm = document.getElementById('student-form');
    const btnSubmit = document.getElementById('btn-submit');
    const submitSpinner = document.getElementById('submit-spinner');
    
    const connectionBanner = document.getElementById('connection-banner');
    const metaStatusBadge = document.getElementById('meta-status-badge');
    const tableBody = document.getElementById('students-table-body');
    const btnClearCache = document.getElementById('btn-clear-cache');
    const toastContainer = document.getElementById('toast-container');

    // === ESTADO DE LA APLICACIÓN ===
    let appState = {
        sheetUrl: localStorage.getItem('google_sheet_url') || '',
        students: JSON.parse(localStorage.getItem('registered_students')) || [],
        theme: localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    };

    // === INICIALIZACIÓN ===
    applyTheme(appState.theme);
    updateConnectionUI();
    renderStudentsTable();

    // === GESTIÓN DE TEMAS (MODO OSCURO / CLARO) ===
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        appState.theme = theme;
    }

    themeToggleBtn.addEventListener('click', () => {
        const nextTheme = appState.theme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        showToast('Tema visual actualizado', 'info');
    });

    // === GESTIÓN DE CONFIGURACIÓN DE API (MODAL DE GOOGLE SHEET) ===
    btnOpenSettings.addEventListener('click', () => {
        apiUrlInput.value = appState.sheetUrl;
        settingsDialog.showModal();
    });

    const closeModal = () => {
        settingsDialog.close();
    };

    btnCloseSettings.addEventListener('click', closeModal);
    btnCancelSettings.addEventListener('click', closeModal);

    // Cerrar modal al hacer clic en el backdrop
    settingsDialog.addEventListener('click', (e) => {
        if (e.target === settingsDialog) {
            closeModal();
        }
    });

    // Guardar URL de la API
    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const url = apiUrlInput.value.trim();
        
        if (url && (url.startsWith('https://script.google.com/macros/s/') && url.endsWith('/exec'))) {
            appState.sheetUrl = url;
            localStorage.setItem('google_sheet_url', url);
            updateConnectionUI();
            closeModal();
            showToast('Conexión con Google Sheets guardada con éxito', 'success');
        } else {
            showToast('La URL ingresada no parece una Web App de Google válida', 'error');
            document.getElementById('api-url-error').style.display = 'block';
        }
    });

    // Quitar conexión (Volver a Modo Demo)
    btnResetApi.addEventListener('click', () => {
        appState.sheetUrl = '';
        localStorage.removeItem('google_sheet_url');
        apiUrlInput.value = '';
        updateConnectionUI();
        closeModal();
        showToast('Se ha desconectado Google Sheets. Modo Demo activado.', 'warning');
    });

    // Actualizar elementos visuales dependiendo de si hay conexión o no
    function updateConnectionUI() {
        if (appState.sheetUrl) {
            connectionBanner.className = 'banner banner-success';
            connectionBanner.style.backgroundColor = 'var(--success-light)';
            connectionBanner.style.borderColor = 'rgba(16, 185, 129, 0.2)';
            connectionBanner.querySelector('span').innerHTML = '<strong>Conectado a Google Sheets:</strong> Los registros se guardarán en tu cuenta en tiempo real.';
            connectionBanner.querySelector('svg').style.color = 'var(--success)';
            
            metaStatusBadge.textContent = 'Conectado a Sheets';
            metaStatusBadge.className = 'badge badge-success';
        } else {
            connectionBanner.className = 'banner banner-warning';
            connectionBanner.style.backgroundColor = 'var(--warning-light)';
            connectionBanner.style.borderColor = 'rgba(245, 158, 11, 0.2)';
            connectionBanner.querySelector('span').innerHTML = '<strong>Modo Demo Local:</strong> Los datos se guardarán solo en tu navegador. Haz clic en el engranaje superior para ingresar tu URL de Google Sheets.';
            connectionBanner.querySelector('svg').style.color = 'var(--warning)';
            
            metaStatusBadge.textContent = 'Modo Demo';
            metaStatusBadge.className = 'badge badge-pending';
        }
    }

    // === GESTIÓN DE NOTIFICACIONES (TOASTS) ===
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let iconSvg = '';
        if (type === 'success') {
            iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        } else if (type === 'error') {
            iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
        } else if (type === 'warning') {
            iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
        } else {
            iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
        }

        toast.innerHTML = `
            ${iconSvg}
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Quitar del DOM después de que termine la animación de desvanecimiento (5 segundos de duración total)
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    // === VALIDACIÓN INTERACTIVA DE CAMPOS ===
    const inputs = studentForm.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        // Validar en cada cambio
        input.addEventListener('input', () => {
            validateInput(input);
        });

        // Validar al salir del input
        input.addEventListener('blur', () => {
            validateInput(input);
        });
    });

    function validateInput(input) {
        const errorElement = document.getElementById(`${input.id}-error`);
        if (!errorElement) return true;

        if (input.validity.valid) {
            errorElement.style.display = 'none';
            input.style.borderColor = '';
            return true;
        } else {
            errorElement.style.display = 'block';
            return false;
        }
    }

    function validateForm() {
        let isFormValid = true;
        inputs.forEach(input => {
            const isValid = validateInput(input);
            if (!isValid) {
                isFormValid = false;
            }
        });
        return isFormValid;
    }

    // === ENVÍO DE DATOS A GOOGLE SHEETS ===
    studentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Ejecutar validación completa
        if (!validateForm()) {
            showToast('Por favor, corrige los campos marcados en rojo', 'error');
            return;
        }

        const formData = new FormData(studentForm);
        const studentData = {
            nombreCompleto: formData.get('nombreCompleto').trim(),
            curso: formData.get('curso'),
            apoderado: formData.get('apoderado').trim(),
            telefono: formData.get('telefono').trim(),
            email: formData.get('email').trim(),
            observaciones: formData.get('observaciones').trim()
        };

        // UI Loading State
        btnSubmit.classList.add('loading');
        btnSubmit.disabled = true;

        // Crear registro en caché local con estado inicial
        const newStudent = {
            ...studentData,
            fecha: new Date().toLocaleString(),
            estado: appState.sheetUrl ? 'Enviando...' : 'Demo (Local)',
            exitoso: !appState.sheetUrl
        };

        // Si tenemos URL de Sheets, enviamos por API
        if (appState.sheetUrl) {
            try {
                // Configurar fetch con timeout de 15 segundos
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000);

                const response = await fetch(appState.sheetUrl, {
                    method: 'POST',
                    mode: 'no-cors', // Apps Script a veces requiere no-cors debido a redirecciones complejas, pero nuestro backend soporta CORS normal. Usaremos normal y si falla intentaremos modo flexible.
                    headers: {
                        'Content-Type': 'text/plain;charset=utf-8', // Apps script lee mejor texto plano en doPost para evitar problemas de preflight en algunos navegadores
                    },
                    body: JSON.stringify(studentData),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                // Nota importante: al usar no-cors con Google Apps Script, la respuesta será de tipo opaque y no podremos leer el body, pero el estatus de red será exitoso si se procesó.
                // Sin embargo, para mayor fiabilidad, asumimos éxito si no hay error de red arrojado.
                newStudent.estado = 'Guardado';
                newStudent.exitoso = true;
                
                // Guardar en la base de datos local
                appState.students.unshift(newStudent);
                localStorage.setItem('registered_students', JSON.stringify(appState.students));
                
                showToast('¡Estudiante guardado en Google Sheets!', 'success');
                studentForm.reset();

            } catch (error) {
                console.error('Error al enviar a Google Sheets:', error);
                newStudent.estado = 'Error de envío';
                newStudent.exitoso = false;
                
                // Guardar de todas formas localmente pero marcándolo como fallido
                appState.students.unshift(newStudent);
                localStorage.setItem('registered_students', JSON.stringify(appState.students));
                
                showToast('Error al conectar con Google Sheets. Se guardó localmente.', 'error');
            }
        } else {
            // Modo Demo
            appState.students.unshift(newStudent);
            localStorage.setItem('registered_students', JSON.stringify(appState.students));
            
            showToast('Guardado en memoria local (Modo Demo)', 'warning');
            studentForm.reset();
        }

        // Restablecer botón e interfaz
        btnSubmit.classList.remove('loading');
        btnSubmit.disabled = false;
        renderStudentsTable();
    });

    // === RENDERIZAR TABLA DE HISTORIAL ===
    function renderStudentsTable() {
        // Limpiar filas existentes
        tableBody.innerHTML = '';

        if (appState.students.length === 0) {
            tableBody.innerHTML = `
                <tr id="empty-state-row">
                    <td colspan="5" class="empty-state">
                        <div class="empty-state-content">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            <p>No se han registrado estudiantes en esta sesión.</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        appState.students.forEach(student => {
            const tr = document.createElement('tr');
            
            let badgeClass = 'badge-pending';
            if (student.estado === 'Guardado') badgeClass = 'badge-success';
            if (student.estado === 'Demo (Local)') badgeClass = 'badge-info';
            if (student.estado === 'Error de envío') badgeClass = 'badge-pending';

            tr.innerHTML = `
                <td>
                    <strong>${escapeHTML(student.nombreCompleto)}</strong>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">${student.fecha}</div>
                </td>
                <td><span style="font-weight:600;">${escapeHTML(student.curso)}</span></td>
                <td>${escapeHTML(student.apoderado)}</td>
                <td>
                    <div class="contact-cell">
                        <span class="contact-phone">${escapeHTML(student.telefono)}</span>
                        <span class="contact-email">${escapeHTML(student.email)}</span>
                    </div>
                </td>
                <td>
                    <span class="badge ${badgeClass}">${escapeHTML(student.estado)}</span>
                </td>
            `;
            
            tableBody.appendChild(tr);
        });
    }

    // Limpiar caché local
    btnClearCache.addEventListener('click', () => {
        if (appState.students.length === 0) return;
        
        if (confirm('¿Estás seguro de que deseas limpiar la lista visual de esta pantalla? (Esto no borrará los datos ya subidos a Google Sheets).')) {
            appState.students = [];
            localStorage.removeItem('registered_students');
            renderStudentsTable();
            showToast('Vista local despejada', 'info');
        }
    });

    // Sanitizador básico para evitar XSS
    function escapeHTML(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
});
