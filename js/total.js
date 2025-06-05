(function() {
  //MARK: Función pública para volver al estado inicial de la calculadora
  window.reiniciarCalculadora = function() {
    const ingresosInput = document.getElementById('number');
    const continueBtn   = document.getElementById('continueButton');
    
    if (ingresosInput) ingresosInput.value = '';               
    if (continueBtn) {
      continueBtn.disabled = true;                             
      continueBtn.classList.remove('active');
    }

    const gastosContainer = document.getElementById('gastos-container');
    if (gastosContainer) {
      //Elimina todas las secciones de gasto (menos el total)
      gastosContainer.querySelectorAll('.input-seciont-add:not(#only-tatal)').forEach(n => n.remove());
      gastosContainer.style.display = 'none';                   
    }

    const btnAgregar = document.querySelector('.btn-agregar');
    if (btnAgregar) {
      btnAgregar.style.display = 'block';                      
      btnAgregar.innerText = '+ agregar';
    }

    actualizarTotal();                                         
  };

  

  //MARK: Recalcula la suma de todos los inputs de gasto y actualiza el elemento #total-total
  function actualizarTotal() {
    const gastosContainer = document.getElementById('gastos-container');
    const totalEl = document.getElementById('total-total');
    if (!gastosContainer || !totalEl) return;
    let suma = 0;
    gastosContainer.querySelectorAll('input[id^="input-"]').forEach(input => {
      const raw = input.value.replace(/,/g, '');
      suma += parseFloat(raw) || 0;
    });
    totalEl.innerText = `$${suma.toLocaleString('en-US',{ minimumFractionDigits:2, maximumFractionDigits:2 })}`;
  }

  //MARK: Compara ingresos vs. gastos y muestra un mensaje positivo o negativo
  function actualizarResumen() {
    const ingresosRaw = (document.getElementById('number')?.value || '').replace(/,/g, '');
    const ingresos = parseFloat(ingresosRaw) || 0;

    let totalGastos = 0;
    document.querySelectorAll('#gastos-container input[id^="input-"]').forEach(i => {
      totalGastos += parseFloat(i.value.replace(/,/g, '')) || 0;
    });

    const balance = ingresos - totalGastos;
    const formattedBalance = `$${balance.toLocaleString('en-US',{ minimumFractionDigits:2, maximumFractionDigits:2 })}`;

    const container = document.querySelector('#desktop3 .responsive-text');
    if (!container) return;


    let titulo, mensaje;

    if (balance > 0) {
      titulo = 'Positivo';
      mensaje = '<strong>¡Felicidades eres muy bueno organizando tus finanzas!</strong><br><br>Tus ingresos son mayores a tus gastos.';
    }
    else if (balance < 0) {
      titulo = 'Negativo';
      mensaje = '<strong>¡No te preocupes! Puedes mejorar la forma en que organizas tus finanzas.</strong><br><br>Actualmente tus gastos son mayores que tus ingresos.';
    }
    else {
      // Caso neutro: balance === 0
      titulo = 'Neutro';
      mensaje = '<strong>¡Perfecto!</strong><br><br>Tus ingresos y gastos están equilibrados.';
    }

    container.innerHTML = `
      <p class="hormiga-text">Tienes un saldo:</p>
      <h4 class="fw-bold">${titulo}</h4>
      <p class="text-variant-01">${mensaje}</p>
      <p class="text-variant-01">Tu balance:</p>
      <h4 class="fw-bold">${formattedBalance}</h4>
      <p class="text-variant-01">de tus ingresos mensuales.</p>
    `;

    // Actualiza gráficos si existen
    if (typeof updateDonutChart === 'function') {
      updateDonutChart();
    }
    if (typeof updateLegend === 'function') {
      updateLegend();
    }
  }

  //MARK: Inicialización de listeners al cargar el DOM
  document.addEventListener('DOMContentLoaded', function() {
    const gastosContainer = document.getElementById('gastos-container');
    if (gastosContainer) {

      // Recalcula total al cambiar valores o al añadir/eliminar inputs
      gastosContainer.addEventListener('input', e => {
        if (e.target.matches('input[id^="input-"]')) actualizarTotal();
      });
      new MutationObserver(muts => {
        if (muts.some(m => m.type === 'childList')) actualizarTotal();
      }).observe(gastosContainer, { childList: true });
    }

    // Botones de reinicio
    document.querySelectorAll('#reiniciarButton').forEach(btn => {
      btn.addEventListener('click', () => {
        window.reiniciarCalculadora();
        if (typeof mostrarSeccion === 'function') mostrarSeccion(1);
      });
    });

    // Botón finalizar dispara el resumen
    const finalizarBtn = document.getElementById('finalizarButton');
    if (finalizarBtn) {
      finalizarBtn.addEventListener('click', function() {
        if (!this.disabled) actualizarResumen();
      });
    }

    actualizarTotal();
  });


  // MARK: bloquear letras y más de un punto
document.addEventListener('DOMContentLoaded', () => {
  const gastos = document.getElementById('gastos-container');
  if (!gastos) return;

  // 1) Keydown: sólo dígitos y punto (siempre que no exista ya uno)
  gastos.addEventListener('keydown', e => {
    if (!e.target.matches('input[id^="input-"]')) return;
    const k = e.key;
    const val = e.target.value;
    if (/[0-9]/.test(k)) return;
    if (k === '.' && !val.includes('.')) return;
    if (
      k === 'Backspace' ||
      k === 'Delete' ||
      k === 'ArrowLeft' ||
      k === 'ArrowRight' ||
      e.ctrlKey
    ) return;
    e.preventDefault();
  });

  gastos.addEventListener('input', e => {
    if (!e.target.matches('input[id^="input-"]')) return;
    let v = e.target.value
      .replace(/[^0-9.]/g, '')
      .replace(/\.(?=.*\.)/g, '');
    e.target.value = v;
  });
});


})();
