function reiniciarCalculadora() {

  const gastosContainer = document.getElementById('gastos-container');
     if (gastosContainer) {
       gastosContainer.innerHTML = "";
       gastosContainer.style.display = 'none';
     }
     
     window.sliderCostChanged = false;
     window.sliderTimeChanged = false;
     
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
     
     const pTabSteps = document.querySelectorAll('.p-tab-next-step');
     pTabSteps.forEach(el => {
       el.innerText = "Paso 1 de 3";
     });
     
     const ingresosInput = document.getElementById('number');
     if (ingresosInput) {
       ingresosInput.value = "";
     }
   }
   
   window.reiniciarCalculadora = reiniciarCalculadora;
   