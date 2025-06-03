document.addEventListener('DOMContentLoaded', () => {
  // MARK: — Referencias al DOM
  const dreamCost   = document.getElementById('dreamCost');
  const dreamTime   = document.getElementById('dreamTime');
  const costValueEl = document.getElementById('costValue');
  const timeValueEl = document.getElementById('timeValue');
  const finalizeBtn = document.getElementById('finalizarButton');
  const section1    = document.getElementById('desktop1');
  const section2    = document.getElementById('desktop2');
  const stepTexts   = document.querySelectorAll('.p-tab-next-step');
  const restartBtns = document.querySelectorAll('.reiniciar-btn');
  const dreamBtns   = document.querySelectorAll('.gasto-btn');
  const totalSteps  = 3;

  // MARK: — Valores iniciales de los sliders
  const defaultCost = parseFloat(dreamCost.value, 10);
  const defaultTime = parseInt(dreamTime.value, 10);

  // MARK: — Maneja cualquier cambio en sliders (coste o tiempo)
  function onSliderInput() {
    // Actualiza los textos junto al slider
    costValueEl.innerText = `$${Number(dreamCost.value).toLocaleString()}`;
    timeValueEl.innerText = `${dreamTime.value} años`;
    // Habilita el botón y avanza al paso 2
    finalizeBtn.disabled = false;
    finalizeBtn.classList.add('active');
    showStep(2);
  }
  dreamCost.addEventListener('input', onSliderInput);
  dreamTime.addEventListener('input', onSliderInput);

  // MARK: — Muestra/oculta secciones según el paso actual
  function showStep(step) {
    stepTexts.forEach(el => el.innerText = `Paso ${step} de ${totalSteps}`);
    if (step === 1) {
      section1.style.display = 'block';
      section2.style.display = 'none';
      document.querySelector('.action-buttons').style.display = 'none';
    } else if (step === 2) {
      section1.style.display = 'block';
      section2.style.display = 'none';
      document.querySelector('.action-buttons').style.display = 'flex';
    } else if (step === 3) {
      section1.style.display = 'none';
      section2.style.display = 'block';
    }
  }

  // MARK: — Calcula el resumen de ahorro diario/semanal/anual
  function calculateSummary() {
    const cost  = parseFloat(dreamCost.value);
    const years = parseInt(dreamTime.value, 10);
    const daily  = cost / (years * 365);
    const monthly = cost / (years * 12);  
    const annual = cost / years;

    // Actualiza coste y tiempo en la sección 2
    const costSpans = section2.querySelectorAll('.cost-label span');
    costSpans[0].innerText = `$${cost.toLocaleString()}`;
    costSpans[1].innerText = `${years} años`;

    // Actualiza montos de ahorro
    const savings = section2.querySelectorAll('.savings-box .savings-amount');
    savings[0].innerText = `$${daily.toFixed(2)}`;
    savings[1].innerText = `$${monthly.toFixed(2)}`;
    savings[2].innerText = `$${annual.toFixed(2)}`;
  }

  // MARK: — Reinicia recargando la página
  function reset() {
    window.location.reload();
  }

  // MARK: — Configuración inicial: textos y estados de botones
  timeValueEl.innerText = `${defaultTime} años`;
  finalizeBtn.disabled = true;
  finalizeBtn.classList.remove('active');
  dreamBtns.forEach(btn => btn.classList.remove('active'));
  section1.querySelectorAll('.dream-icon')
          .forEach(icon => icon.parentElement.style.display = 'none');
  showStep(1);

  // MARK: — Eventos de finalizar y reiniciar
  finalizeBtn.addEventListener('click', () => {
    if (finalizeBtn.disabled) return;
    calculateSummary();
    showStep(3);
  });
  restartBtns.forEach(btn => btn.addEventListener('click', reset));
});
