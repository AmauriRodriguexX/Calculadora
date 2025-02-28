// MARK: - Funcion para la calculadora de mis suenos 
document.addEventListener('DOMContentLoaded', function() {
  // Secciones principales
  const desktop1 = document.getElementById('desktop1');
  const desktop2 = document.getElementById('desktop2');

  // Elementos para actualizar el paso (texto "Paso 1 de 2" / "Paso 2 de 2")
  const pTabSteps = document.querySelectorAll('.p-tab-next-step');

  // En desktop1 definimos dos áreas:
  // Área A: Grid de botones (visible inicialmente)
  const gridContainer = desktop1.querySelector('.grid-container-2');

  // Área B: el resto (ícono, sliders y botones de acción)
  // - Contenedor del ícono: primer div.container con clases d-flex.justify-content-center.align-items-center
  const iconContainer = desktop1.querySelector('div.container.d-flex.justify-content-center.align-items-center');
  // - Contenedor de sliders: el siguiente div.container que NO es iconContainer
  let sliderContainer = null;
  const containers = desktop1.querySelectorAll('div.container');
  containers.forEach(function(c) {
    if (c !== iconContainer && !sliderContainer) {
      sliderContainer = c;
    }
  });
  // - Contenedor de botones de acción: con clase "action-buttons"
  const actionButtons = desktop1.querySelector('.action-buttons');

  // Forzar estado inicial (solo se muestra la grid)
  if (gridContainer) gridContainer.style.setProperty('display', 'flex', 'important');
  if (iconContainer) iconContainer.style.setProperty('display', 'none', 'important');
  if (sliderContainer) sliderContainer.style.setProperty('display', 'none', 'important');
  if (actionButtons) actionButtons.style.setProperty('display', 'none', 'important');
  if (desktop2) desktop2.style.setProperty('display', 'none', 'important');

  // Aseguramos que el texto del paso sea "Paso 1 de 2" al inicio
  // Inicialmente, se muestra el paso 1 de 3
pTabSteps.forEach(el => {
  el.innerText = "Paso 1 de 3";
});


  // Variables para controlar la interacción con los sliders
  let sliderCostChanged = false;
  let sliderTimeChanged = false;

  // Elementos de los sliders y sus displays
  const dreamCost = document.getElementById('dreamCost');
  const costValue = document.getElementById('costValue');
  const dreamTime = document.getElementById('dreamTime');
  const timeValue = document.getElementById('timeValue');

  // Botones de acción
  const finalizarButton = document.getElementById('finalizarButton');
  const reiniciarButton = document.getElementById('reiniciarButton');

  // Función para actualizar el fondo del slider (progreso)
  function updateSliderBackground(slider) {
    let percentage = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.background = `linear-gradient(to right, #EF5292 0%, #EF5292 ${percentage}%, #F0EFEF ${percentage}%, #F0EFEF 100%)`;
  }

  // Configuración de los sliders: al interactuar se actualiza fondo y valor, y se marca que se han modificado
  if (dreamCost) {
    dreamCost.addEventListener('input', function() {
      updateSliderBackground(this);
      if (costValue) {
        costValue.innerText = `$${parseInt(this.value).toLocaleString()}`;
      }
      sliderCostChanged = true;
      checkSliders();
    });
    updateSliderBackground(dreamCost);
  }
  if (dreamTime) {
    dreamTime.addEventListener('input', function() {
      updateSliderBackground(this);
      if (timeValue) {
        timeValue.innerText = `${this.value} años`;
      }
      sliderTimeChanged = true;
      checkSliders();
    });
    updateSliderBackground(dreamTime);
  }

  // Habilitar botones de acción cuando ambos sliders hayan sido modificados
  function checkSliders() {
    if (sliderCostChanged && sliderTimeChanged) {
      if (finalizarButton) {
        finalizarButton.disabled = false;
        finalizarButton.classList.add('active');
      }
      if (reiniciarButton) {
        reiniciarButton.disabled = false;
        reiniciarButton.classList.add('active');
      }
    }
  }

  // Al hacer clic en cualquiera de los botones de la grid (Área A)
  const gastoButtons = desktop1.querySelectorAll('.gasto-btn');
  gastoButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Ocultar la grid y mostrar el área de detalle (sección 1)
      gridContainer.style.setProperty('display', 'none', 'important');
      iconContainer.style.setProperty('display', 'block', 'important');
      sliderContainer.style.setProperty('display', 'block', 'important');
      actionButtons.style.setProperty('display', 'flex', 'important');
  
      // Obtener la opción y actualizar el texto en la sección 1
      const opcion = btn.querySelector('span').innerText;
      const dreamsText = iconContainer.querySelector('.dreams-text');
      if (dreamsText) {
        dreamsText.innerText = opcion;
      }
  
      // Actualizar el ícono según el atributo data-icon o basado en el texto
      const iconImg = iconContainer.querySelector('img');
      let iconFile = btn.getAttribute('data-icon'); // Ejemplo usando data-icon
  
      if (!iconFile) {
        switch (opcion.toLowerCase()) {
          case 'viajes':
            iconFile = 'viaje.png';
            break;
          case 'estudios':
            iconFile = 'estudios.png';
            break;
          case 'ahorro':
            iconFile = 'ahorro.png';
            break;
          case 'casa':
            iconFile = 'casa.png';
            break;
          case 'negocio':
            iconFile = 'negocio.png';
            break;
          case 'otro':
            iconFile = 'otro.png';
            break;
          default:
            iconFile = 'default.png';
        }
      }
  
      if (iconImg && iconFile) {
        iconImg.setAttribute('src', `../assets/images/icons/${iconFile}`);
        iconImg.setAttribute('alt', opcion);
      }
  
      // Actualizar también la sección 2 (resumen)
      const desktop2Dream = document.getElementById('desktop2-dream');
      if (desktop2Dream) {
        const imgDesktop2 = desktop2Dream.querySelector('img');
        const pDesktop2 = desktop2Dream.querySelector('p');
        if (imgDesktop2) {
          imgDesktop2.setAttribute('src', `../assets/images/icons/${iconFile}`);
          imgDesktop2.setAttribute('alt', opcion);
        }
        if (pDesktop2) {
          pDesktop2.innerText = opcion;
        }
      }
  
      // Actualizar el paso a "Paso 2 de 3"
      pTabSteps.forEach(el => {
        el.innerText = "Paso 2 de 3";
      });
    });
  });
  
  
  

  // Acción del botón "Finalizar": si está habilitado, actualizar el paso y enviar a desktop2
finalizarButton.addEventListener('click', function() {
  if (!this.disabled) {
    pTabSteps.forEach(el => {
      el.innerText = "Paso 3 de 3";
    });
    desktop1.style.setProperty('display', 'none', 'important');
    if (desktop2) desktop2.style.setProperty('display', 'block', 'important');
  }
});





  // Acción del botón "Reiniciar calculadora": restablece el flujo en desktop1, volviendo a mostrar la grid
  if (reiniciarButton) {
    reiniciarButton.addEventListener('click', function() {
      // Reiniciar el estado de los sliders
      sliderCostChanged = false;
      sliderTimeChanged = false;
      if (finalizarButton) {
        finalizarButton.disabled = true;
        finalizarButton.classList.remove('active');
      }
      if (reiniciarButton) {
        reiniciarButton.disabled = true;
        reiniciarButton.classList.remove('active');
      }
      // Ocultar Área B y mostrar nuevamente la grid (Área A)
      if (iconContainer) iconContainer.style.setProperty('display', 'none', 'important');
      if (sliderContainer) sliderContainer.style.setProperty('display', 'none', 'important');
      if (actionButtons) actionButtons.style.setProperty('display', 'none', 'important');
      if (gridContainer) gridContainer.style.setProperty('display', 'flex', 'important');
      // Regresar el texto del paso a "Paso 1 de 2"
      // En el reinicio, cambiar a:
pTabSteps.forEach(el => {
  el.innerText = "Paso 1 de 3";
});

    });
  }
});


// MARK: - Funcion botones finalizar cambien de posicion en el seciton del id Desktop 2
document.addEventListener('DOMContentLoaded', function () {
  // Verificamos si el ancho de la ventana es de 768px o menor
  if (window.matchMedia("(max-width: 768px)").matches) {
    const buttonsContainer = document.querySelector('#desktop2 .action-buttons');
    
    // Configuración inicial: posición absoluta
    buttonsContainer.style.position = 'unset';
    buttonsContainer.style.bottom = '24px';
    buttonsContainer.style.left = '16px';
    buttonsContainer.style.right = '16px';
    
    // Seleccionamos el botón "+ agregar"
    const agregarBtn = document.querySelector('.btn-agregar');
    
    // Al hacer click en el botón, cambiamos la posición a "unset"
    if (agregarBtn) {
      agregarBtn.addEventListener('click', function() {
        buttonsContainer.style.position = 'unset';
      });
    }
  }
});


// MARK: - Función para mostrar una sección en particular y actualizar el paso
function mostrarSeccion(numero) {
  // Oculta todas las secciones
  document.querySelectorAll('.calculadora-section').forEach(seccion => {
    seccion.style.display = 'none';
  });
  // Muestra la sección indicada
  document.getElementById(`desktop${numero}`).style.display = 'block';

  // Actualiza el texto de los pasos en los elementos con clase "p-tab-next-step"
  document.querySelectorAll('.p-tab-next-step').forEach(el => {
    el.innerText = `Paso ${numero} de 3`;
  });
}

document.addEventListener('DOMContentLoaded', function () {
  // Mostrar inicialmente la sección 1 y actualizar el paso
  mostrarSeccion(1);

  const finalizarButton = document.getElementById('finalizarButton');
  const continueButton = document.getElementById('continueButton');

  // Event para el botón Continuar (de la sección 1 a la 2)
  continueButton.addEventListener('click', function () {
    mostrarSeccion(2);
  });

  // Al hacer clic en un botón de gasto se habilita y activa el botón Finalizar
  const gastoBtns = document.querySelectorAll('.gasto-btn');
  gastoBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      finalizarButton.disabled = false;
      finalizarButton.classList.add('active');
    });
  });

  // Al hacer clic en Finalizar, se pasa a la sección 3 si el botón está habilitado
  finalizarButton.addEventListener('click', function () {
    if (!finalizarButton.disabled) {
      mostrarSeccion(3);
    }
  });

  // Botón Reiniciar en la sección 3: limpia los campos y vuelve a la sección 1
  // Botón Reiniciar en la sección 3 (o en desktop2, según corresponda)
const reiniciarBtnDesktop2 = document.querySelector('#desktop2 #reiniciarButton');
reiniciarBtnDesktop2.addEventListener('click', function () {
  reiniciarCalculadora();
  mostrarSeccion(1);
});


});



// MARK: - Validacion campo numerico
document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.getElementById("number");
  const continueButton = document.getElementById("continueButton");

  inputField.addEventListener("input", function () {
    // Guarda la posición actual del cursor en el campo
    let cursorPosition = inputField.selectionStart;
    let currentValue = inputField.value;

    // Remueve cualquier carácter que no sea dígito
    let digitsOnly = currentValue.replace(/[^\d]/g, "");

    // Si no hay dígitos, limpia el input y deshabilita el botón
    if (digitsOnly === "") {
      inputField.value = "";
      continueButton.classList.remove("active");
      continueButton.setAttribute("disabled", "true");
      return;
    }

    // Cuenta cuántos dígitos había antes del cursor en el valor actual
    let digitsBeforeCursor = currentValue.slice(0, cursorPosition).replace(/[^\d]/g, "").length;

    // Convierte la cadena de dígitos a número y formatea con comas
    let numberValue = parseInt(digitsOnly, 10);
    let formattedValue = numberValue.toLocaleString("en-US");

    // Recalcula la posición del cursor en la cadena formateada
    let newCursorPosition = 0;
    let digitCount = 0;
    while (newCursorPosition < formattedValue.length && digitCount < digitsBeforeCursor) {
      if (/\d/.test(formattedValue[newCursorPosition])) {
        digitCount++;
      }
      newCursorPosition++;
    }

    // Actualiza el valor del input y reposiciona el cursor
    inputField.value = formattedValue;
    inputField.setSelectionRange(newCursorPosition, newCursorPosition);

    // Valida el contenido para habilitar o deshabilitar el botón
    if (digitsOnly.trim() !== "" && !isNaN(numberValue) && numberValue > 0) {
      continueButton.classList.add("active");
      continueButton.removeAttribute("disabled");
    } else {
      continueButton.classList.remove("active");
      continueButton.setAttribute("disabled", "true");
    }
  });

  // Permite únicamente dígitos y algunas teclas de control para evitar caracteres no deseados
  inputField.addEventListener("keydown", function (event) {
    const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"];
    if (!/[\d]/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  });
});


// MARK: - next stape 
document.addEventListener('DOMContentLoaded', function() {
 // Obtenemos los elementos necesarios
 const ingresosInput = document.getElementById('number');
 const continueButton = document.getElementById('continueButton');
 const section1 = document.getElementById('desktop1');
 const section2 = document.getElementById('desktop2');

 // Función para validar el campo de ingresos
 function validarIngreso() {
   const valor = ingresosInput.value.trim();
   continueButton.disabled = valor === '';
 }

 // Escucha el evento 'input' en el campo para habilitar/deshabilitar el botón
 ingresosInput.addEventListener('input', validarIngreso);

 // Manejar el clic en el botón "Continuar"
 continueButton.addEventListener('click', function() {
   // Oculta la sección 1 y muestra la sección 2
   section1.style.display = 'none';
   section2.style.display = 'block';
 });
});


// MARK: Mostrar la grid al hacer clic en "+ agregar" (paso 2)
document.addEventListener('DOMContentLoaded', function() {
  // Estado inicial: ocultar la grid y el contenedor de gastos.
  document.querySelector('.grid-container').style.display = 'none';
  document.getElementById('gastos-container').style.display = 'none';

  // Seleccionamos el botón "+ agregar"
  const btnAgregar = document.querySelector('.btn-agregar');
  // Aseguramos que tenga el texto inicial al cargar
  btnAgregar.innerText = '+ agregar';

  // Al hacer clic en "+ agregar": mostrar la grid y ocultar el botón.
  btnAgregar.addEventListener('click', function() {
    document.querySelector('.grid-container').style.display = 'flex';
    this.style.display = 'none';
  });

  // Asignar evento a cada botón de gasto de la grid.
  document.querySelectorAll('.gasto-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const nombre = this.querySelector('span').innerText;
      const id = this.dataset.gasto;
      crearCampoGasto(nombre, id);
      // Luego de seleccionar una opción:
      document.querySelector('.grid-container').style.display = 'none';
      btnAgregar.style.display = 'block';
      btnAgregar.innerText = '+ agregar otro'; // Actualiza el texto al agregar un elemento.
      // Mostrar el contenedor de gastos.
      document.getElementById('gastos-container').style.display = 'block';
    });
  });

  // Función para crear el bloque de gasto (si no existe ya).
  function crearCampoGasto(nombre, id) {
    // Evitar duplicados.
    if (document.getElementById(`gasto-${id}`)) return;
    
    const gastosContainer = document.getElementById('gastos-container');
    const iconMap = {
      cafes: 'coffe.png',
      plataformas: 'play.png',
      compras: 'clic.png',
      refrescos: 'bebidas.png',
      cigarros: 'cigarrete.png',
      otros: 'car.png',
      renta: 'renta.png',
      comidas: 'comidas.png',
      servicios: 'servicios.png',
      educacion: 'educacion.png',
      transporte: 'transporte.png',
      creditos: 'creditos.png',
      despensa: 'despensa.png',
      diversion: 'diversion.png',
      ropa: 'ropa.png',
      cuidadoPersonal: 'cuidado-personal.png',
      salud: 'salud.png',
      gastosHormiga: 'gastos-hormiga.png'
    };
  
    let labelText = "Gasto diario";
    if (!window.location.pathname.includes("calculadora-gastos-hormiga")) {
      labelText = document.getElementById('only-tatal') ? "Gastos mensual" : "Gasto diario";
    }
  
    let detallesGasto = '';
    if (!document.getElementById('only-tatal')) {
      detallesGasto = `
        <div class="total-section">
          <div class="total-seciton-p">
            <div class="number-section">
              <p>Semanal: <span id="semanal-${id}">$0.00</span></p>
              <p>Mensual: <span id="mensual-${id}">$0.00</span></p>
              <p>Anual: <span id="anual-${id}">$0.00</span></p>
            </div>
          </div>
        </div>
      `;
    }
  
    const expenseDiv = document.createElement('div');
    expenseDiv.classList.add('input-seciont-add');
    expenseDiv.id = `gasto-${id}`;
    expenseDiv.innerHTML = `
      <div class="d-flex align-items-center">
        <div class="info-input">
          <img src="../assets/images/icons/${iconMap[id]}" alt="${nombre}" width="30">
          <span>${nombre}</span>
        </div>
        <div class="outlined-text-field currency-wrapper">
          <input type="text" id="input-${id}" placeholder=" " value="0.00" min="0" max="100">
          <label for="input-${id}">${labelText}</label>
          <span>$</span>
        </div>
        <img src="../assets/images/icons/delete.png" alt="Eliminar" class="trash-icon" onclick="eliminarGasto('${id}')">
      </div>
      ${detallesGasto}
    `;
  
    const totalBlock = document.getElementById('total-block');
    if (totalBlock) {
      gastosContainer.insertBefore(expenseDiv, totalBlock);
    } else {
      gastosContainer.appendChild(expenseDiv);
    }
  
    if (!document.getElementById('total-block')) {
      const totalDiv = document.createElement('div');
      totalDiv.classList.add('input-seciont-add');
      totalDiv.id = 'total-block';
      if (document.getElementById('only-tatal')) {
        totalDiv.innerHTML = `
          <div class="total-section">
            <div class="total-seciton-p">
              <p><strong>Total:</strong> <span id="total-total">$0.00</span></p>
            </div>
          </div>
        `;
      } else {
        totalDiv.innerHTML = `
          <div class="total-section">
            <div class="total-seciton-p">
              <div class="total-section">
                <p><strong>Total</strong></p>
              </div>
              <div class="number-section">
                <p class="color-total-day">Semanal: <span id="semanal-total">$0.00</span></p>
                <p class="color-total-day">Mensual: <span id="mensual-total">$0.00</span></p>
                <p class="color-total-day">Anual: <span id="anual-total">$0.00</span></p>
              </div>
            </div>
          </div>
        `;
      }
      gastosContainer.appendChild(totalDiv);
    }
    document.getElementById('reiniciarButton').disabled = false;
  }
  
  window.eliminarGasto = function(id) {
    const expenseDiv = document.getElementById(`gasto-${id}`);
    if (expenseDiv) {
      expenseDiv.remove();
    }
    const remainingExpenses = document.querySelectorAll('#gastos-container .input-seciont-add:not(#total-block)');
    if (remainingExpenses.length === 0) {
      const totalBlock = document.getElementById('total-block');
      if (totalBlock) totalBlock.remove();
      document.getElementById('reiniciarButton').disabled = true;
    }
  };

  
});
