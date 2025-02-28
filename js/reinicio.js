// reinicio.js
function reiniciarCalculadora() {
     // Limpiar el contenedor de gastos
     const gastosContainer = document.getElementById('gastos-container');
     if (gastosContainer) {
       gastosContainer.innerHTML = "";
       gastosContainer.style.display = 'none';
     }
     
     // Reiniciar las variables de los sliders (asegúrate de que sean variables globales o accesibles)
     window.sliderCostChanged = false;
     window.sliderTimeChanged = false;
     
     // Deshabilitar y quitar la clase "active" a los botones
     const finalizarButton = document.getElementById('finalizarButton');
     const reiniciarButton = document.getElementById('reiniciarButton');
     if (finalizarButton) {
       finalizarButton.disabled = true;
       finalizarButton.classList.remove('active');
     }
     if (reiniciarButton) {
       reiniciarButton.disabled = true;
       reiniciarButton.classList.remove('active');
     }
     
     // Ocultar el Área B (ícono, sliders y botones) y mostrar la grid
     const iconContainer = document.querySelector('div.container.d-flex.justify-content-center.align-items-center');
     const containers = document.querySelectorAll('div.container');
     let sliderContainer = null;
     containers.forEach(c => {
       if (c !== iconContainer && !sliderContainer) {
         sliderContainer = c;
       }
     });
     const actionButtons = document.querySelector('.action-buttons');
     const gridContainer = document.querySelector('.grid-container-2');
     
     if (iconContainer) iconContainer.style.setProperty('display', 'none', 'important');
     if (sliderContainer) sliderContainer.style.setProperty('display', 'none', 'important');
     if (actionButtons) actionButtons.style.setProperty('display', 'none', 'important');
     if (gridContainer) gridContainer.style.setProperty('display', 'flex', 'important');
     
     // Actualizar el indicador a "Paso 1 de 3"
     const pTabSteps = document.querySelectorAll('.p-tab-next-step');
     pTabSteps.forEach(el => {
       el.innerText = "Paso 1 de 3";
     });
     
     // (Opcional) Limpiar otros campos, por ejemplo, el input de ingresos
     const ingresosInput = document.getElementById('number');
     if (ingresosInput) {
       ingresosInput.value = "";
     }
   }
   
   // Exponer la función globalmente
   window.reiniciarCalculadora = reiniciarCalculadora;
   