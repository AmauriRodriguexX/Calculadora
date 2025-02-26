
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

  // Al hacer clic en "+ agregar": mostrar la grid y ocultar el botón.
  const btnAgregar = document.querySelector('.btn-agregar');
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
      // Asegurarse de mostrar el contenedor de gastos.
      document.getElementById('gastos-container').style.display = 'block';
    });
  });

  // Función para crear el bloque de gasto (si no existe ya).
  function crearCampoGasto(nombre, id) {
    // Evitar duplicados
    if (document.getElementById(`gasto-${id}`)) return;

    const gastosContainer = document.getElementById('gastos-container');
    const iconMap = {
      cafes: 'coffe.png',
      plataformas: 'play.png',
      compras: 'clic.png',
      refrescos: 'bebidas.png',
      cigarros: 'cigarrete.png',
      otros: 'car.png'
    };

    // Crear el bloque de ingreso para la categoría con la estructura completa.
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
          <input type="text" id="input-${id}" placeholder=" " value="0.00" min="0" max="100" />
          <label for="input-${id}">Gasto diario</label>
          <span>$</span>
        </div>
        <img src="../assets/images/icons/delete.png" alt="Eliminar" class="trash-icon"
          onclick="eliminarGasto('${id}')">
      </div>
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

    // Si ya existe el bloque total general, insertar este bloque antes; de lo contrario, agregar al final.
    const totalBlock = document.getElementById('total-block');
    if (totalBlock) {
      gastosContainer.insertBefore(expenseDiv, totalBlock);
    } else {
      gastosContainer.appendChild(expenseDiv);
    }

    // Si aún no se agregó el bloque "Total" para todos los gastos, crearlo.
    if (!document.getElementById('total-block')) {
      const totalDiv = document.createElement('div');
      totalDiv.classList.add('input-seciont-add');
      totalDiv.id = 'total-block';
      totalDiv.innerHTML = `
        <div class="total-section">
          <div class="total-seciton-p">
            <div class="total-section">
              <p><strong>Total</strong></p>
            </div>
            <div class="number-section">
              <p>Semanal: <span id="semanal-total">$0.00</span></p>
              <p>Mensual: <span id="mensual-total">$0.00</span></p>
              <p>Anual: <span id="anual-total">$0.00</span></p>
            </div>
          </div>
        </div>
      `;
      gastosContainer.appendChild(totalDiv);
    }

    // Activar el botón de reiniciar al tener al menos un gasto.
    document.getElementById('reiniciarButton').disabled = false;
  }

  // Función para eliminar un bloque de gasto.
  window.eliminarGasto = function(id) {
    const expenseDiv = document.getElementById(`gasto-${id}`);
    if(expenseDiv) {
      expenseDiv.remove();
    }
    // Si no quedan bloques de gasto (excluyendo el bloque total), se quita el total y se desactiva el botón.
    const remainingExpenses = document.querySelectorAll('#gastos-container .input-seciont-add:not(#total-block)');
    if (remainingExpenses.length === 0) {
      const totalBlock = document.getElementById('total-block');
      if(totalBlock) totalBlock.remove();
      document.getElementById('reiniciarButton').disabled = true;
    }
  };

  // Reiniciar calculadora: limpiar los bloques, ocultar la grid, mostrar el botón "+ agregar"
  // y enviar al usuario a la sección "desktop1" (restableciendo el flujo).
  document.getElementById('reiniciarButton').addEventListener('click', function() {
    document.getElementById('gastos-container').innerHTML = '';
    // Asegurarse de ocultar la grid si está visible.
    document.querySelector('.grid-container').style.display = 'none';
    // Mostrar nuevamente el botón "+ agregar".
    btnAgregar.style.display = 'block';
    // Desactivar el botón de reiniciar.
    this.disabled = true;
    // Ir a la sección "desktop1" y quitarle la clase "hide" para que se muestre.
    const desktop1 = document.getElementById('desktop1');
    if (desktop1) {
      desktop1.classList.remove('hide');
      desktop1.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
