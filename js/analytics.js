!(function(){
  window.dataLayer = window.dataLayer || [];

  const EVENT_NAME = 'click_element';
  const FUNNEL =  'Educación Financiera' || window.pageCategory;

  function getCurrentCalc() {
    return document.querySelector('.tabs .tab-item.active')?.textContent.trim() || FUNNEL;
  }

  let selectedDream = '';

  // MARK: STEP 1: Ingresos mensuales o Seleccionar sueño —
  if (window.pageCategory.toLowerCase().includes('sueños')) {
    document.querySelectorAll('.grid-container-2 .gasto-btn')
      .forEach(btn => btn.addEventListener('click', () => {
        selectedDream = btn.querySelector('span')?.innerText.trim() || '';
        dataLayer.push({
          event:    EVENT_NAME,
          CDAction: 'Clic botón',
          CDLabel:  selectedDream,
          CDFunnel: FUNNEL,
          CDValue:  getCurrentCalc()
        });
      }));
  } else {
    document.getElementById('continueButton')
      ?.addEventListener('click', () => {
        const raw = document.getElementById('number').value || '';
        const ingresos = raw.replace(/,/g, '');
        dataLayer.push({
          event:    EVENT_NAME,
          CDAction: 'Clic botón',
          CDLabel:  'Ingresos mensuales',
          CDFunnel: FUNNEL,
          CDValue:  getCurrentCalc(),
          spec_1:   ingresos
        });
      });
  }

  // MARK: STEP 2: Agregar gasto (solo si NO es “sueños”) —
  if (!window.pageCategory.toLowerCase().includes('sueños')) {
    const grid = document.querySelector('.grid-container');
    const container = document.getElementById('gastos-container');

    grid?.addEventListener('click', ev => {
      const btn = ev.target.closest('.gasto-btn');
      if (!btn) return;
      const label = btn.querySelector('span')?.innerText.trim() || '';

      setTimeout(() => {
        const inputs = Array.from(
          container.querySelectorAll('input[type="text"], input[type="number"]')
        );
        const input = inputs[inputs.length - 1];
        if (!input) return;
        input.dataset.gastoLabel = label;

        function emitir() {
          const val = (input.value || '').replace(/,/g, '');
          const idx = window.dataLayer.findIndex(item =>
            item.event    === EVENT_NAME &&
            item.CDAction === 'Clic botón' &&
            item.CDLabel  === label
          );
          if (idx > -1) {
            window.dataLayer[idx].spec_1 = val;
          } else {
            dataLayer.push({
              event:    EVENT_NAME,
              CDAction: 'Clic botón',
              CDLabel:  label,
              CDFunnel: FUNNEL,
              CDValue:  getCurrentCalc(),
              spec_1:   val
            });
          }
        }

        input.removeEventListener('blur', emitir);
        input.removeEventListener('change', emitir);
        input.addEventListener('blur', emitir);
        input.addEventListener('change', emitir);
      }, 0);
    });
  }

  // — STEP 2 & 3: Finalizar + Resultados —
  document.getElementById('finalizarButton')
    ?.addEventListener('click', () => {
        if (window.pageCategory.toLowerCase().includes('sueños')) {
        const costText = document.getElementById('costValue')?.innerText || 'No aplica';
        const timeText = document.getElementById('timeValue')?.innerText || 'No aplica';

        // MARK: Step 2
        dataLayer.push({
          event:    EVENT_NAME,
          CDAction: 'Clic botón',
          CDLabel:  'Finalizar',
          CDFunnel: FUNNEL,
          CDValue:  getCurrentCalc(),
          spec_1:   costText,
          spec_2:   timeText
        });

        // MARK: Step 3
        setTimeout(() => {
          dataLayer.push({
            event:    EVENT_NAME,
            CDAction: 'Clic botón',
            CDLabel:  'Resultados',
            CDFunnel: FUNNEL,
            CDValue:  getCurrentCalc(),
            spec_1:   costText,
            spec_2:   timeText
          });
        }, 100);
      } else {
        setTimeout(() => {
          const tipo = document
            .querySelector('#desktop3 .hormiga-text + h4')
            ?.innerText.trim() || '';
          dataLayer.push({
            event:    EVENT_NAME,
            CDAction: 'Clic botón',
            CDLabel:  'Resultados',
            CDFunnel: FUNNEL,
            CDValue:  getCurrentCalc()
          });
        }, 100);
      }
    });

  // MARK: Clic en las pestañas de calculadora —
  document.querySelectorAll('.tabs .tab-item').forEach(el => {
    el.addEventListener('click', () => {
      const tag = el.tagName.toLowerCase() === 'a' ? 'enlace' : 'botón';
      const label = el.textContent.trim();
      const currentCalc = getCurrentCalc();

      dataLayer.push({
        event:    EVENT_NAME,
        CDAction: `Clic ${tag}`,
        CDLabel:  label,
        CDFunnel: FUNNEL,
        CDValue:  currentCalc
      });
    });
  });

  // MARK: Otras acciones finales —
document.body.addEventListener('click', e => {
  const sel = e.target.closest(
    '#reiniciarButton, #reiniciarButton2, .button-high, .custom-link, #downloadBtn, #facebookBtn, #instagramBtn'
  );
  if (!sel) return;

  const tag = sel.tagName.toLowerCase() === 'a' ? 'enlace' : 'botón';

  const customLabels = {
    downloadBtn:  'Guardar',
    facebookBtn:  'Compartir Facebook',
    instagramBtn: 'Compartir Instagram'
  };

  const label = customLabels[sel.id]
    || sel.textContent.trim()
    || sel.getAttribute('aria-label')
    || sel.id
    || '';

  const currentCalc = getCurrentCalc();

  dataLayer.push({
    event:    EVENT_NAME,
    CDAction: `Clic ${tag}`,
    CDLabel:  label,
    CDFunnel: FUNNEL,
    CDValue:  currentCalc
  });
});
})();
