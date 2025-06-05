// MARK: - Inicio

(function() {
    // Parsea un valor de texto a número (elimina comas, símbolos, etc.)
    function parseNumber(value) {
      return parseFloat(value.toString().replace(/[^0-9.-]+/g, "")) || 0;
    }
  
    // Formatea un número como moneda USD con separadores de miles y dos decimales
    function formatCurrency(num) {
      return '$' + num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
  
    // Contenedor que agrupa todos los campos de gasto
    const gastosContainer = document.getElementById('gastos-container');
  
    // MARK: - Actualiza los cálculos
    function updateFieldCalculations(id) {
      const inputEl = document.getElementById(`input-${id}`);
      const daily = parseNumber(inputEl.value);
      const weekly = daily * 7;
      const monthly = daily * 30;
      const annually = daily * 365;
      const weeklyEl = document.getElementById(`semanal-${id}`);
      const monthlyEl = document.getElementById(`mensual-${id}`);
      const annualEl = document.getElementById(`anual-${id}`);
  
      if (weeklyEl) weeklyEl.innerText = formatCurrency(weekly);
      if (monthlyEl) monthlyEl.innerText = formatCurrency(monthly);
      if (annualEl) annualEl.innerText = formatCurrency(annually);
    }
  
    // Suma todos los gastos y actualiza los totales generales y la clasificación
    function updateTotals() {
      let totalWeekly = 0;
      let totalMonthly = 0;
      let totalAnnual = 0;
  
      // Suma valores de cada gasto
      const expenseDivs = gastosContainer.querySelectorAll('.input-seciont-add:not(#total-block)');
      expenseDivs.forEach(div => {
        const id = div.id.replace('gasto-', '');
        const daily = parseNumber(document.getElementById(`input-${id}`).value);
        totalWeekly += daily * 7;
        totalMonthly += daily * 30;
        totalAnnual += daily * 365;
      });
  
      // Actualiza totales en la UI
      const weeklyTotalEl = document.getElementById('semanal-total');
      const monthlyTotalEl = document.getElementById('mensual-total');
      const annualTotalEl = document.getElementById('anual-total');
      if (weeklyTotalEl) weeklyTotalEl.innerText = formatCurrency(totalWeekly);
      if (monthlyTotalEl) monthlyTotalEl.innerText = formatCurrency(totalMonthly);
      if (annualTotalEl) annualTotalEl.innerText = formatCurrency(totalAnnual);
  
      // --- Lógica de clasificación según porcentaje de gastos mensuales ---
      const incomeInput = document.getElementById('number');
      const incomeMonthly = incomeInput ? parseNumber(incomeInput.value) : 0;
      const percent = incomeMonthly > 0 ? (totalMonthly / incomeMonthly) * 100 : 0;
      const percentRounded = Math.round(percent);
  
      // MARK: - Actualiza categoría y porcentaje en sección de resumen
      const h4s = document.querySelectorAll('#desktop3 .responsive-text h4.fw-bold');
      if (h4s.length >= 2) {
        let category = '';
        if (percent <= 4) {
          category = 'Ahorradora';
        } else if (percent <= 8) {
          category = 'Consumidora';
        } else {
          category = 'Gastalona';
        }
        h4s[0].innerText = category;
        h4s[1].innerText = `${percentRounded}%`;
  
        // Actualiza texto descriptivo según categoría
        const descParas = document.querySelectorAll('#desktop3 .responsive-text .text-variant-01');
        if (descParas.length) {
          let message = '';
          if (percent <= 4) {
            message = '¡Felicidades! Tus gastos hormiga son una parte muy pequeña de tus ingresos.';
          } else if (percent <= 8) {
            message = '¡Échale muchas ganas! Gastas un poco más de lo recomendado.';
          } else {
            message = '¡Fumiga estos gastos!<br>Tus gastos hormiga están elevados';
          }
          descParas[0].innerHTML = message;
        }
      }
    }
    if (typeof updateChart === 'function') {
        updateChart(totalMonthly, incomeMonthly);
      }

    
      // MARK: bloquear letras y más de un punto
      gastosContainer.addEventListener('input', function(e) {
        if (!(e.target && e.target.matches('input[id^="input-"]'))) return;
      
        let v = e.target.value.replace(/[^0-9.]/g, '');
        const parts = v.split('.');
        if (parts.length > 2) {
          v = parts[0] + '.' + parts.slice(1).join('');
        }
        if (v !== e.target.value) {
          e.target.value = v;
        }
      
        const id = e.target.id.replace('input-', '');
        updateFieldCalculations(id);
        updateTotals();
      });
      
  
    // Inicializa al cargar
    document.addEventListener('DOMContentLoaded', updateTotals);

    // MARK: - Reiniciar Calculadora
    window.reiniciarCalculadora = function() {

    gastosContainer.innerHTML = '';

    document.getElementById('gastos-container').style.display = 'none';

    const incomeInput = document.getElementById('number');
    if (incomeInput) {
      incomeInput.value = '';
      const continueBtn = document.getElementById('continueButton');
      if (continueBtn) {
        continueBtn.disabled = true;
        continueBtn.classList.remove('active');
      }
    }

    updateTotals();
    if (typeof updateChart === 'function') {
      updateChart(0, incomeMonthly);
    }
  };
  })();