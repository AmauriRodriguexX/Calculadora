function getCategoriesData() {
  // MARK: Define mapeo de colores por categoría
  const colorMap = {
    renta: "#008FFB",
    servicios: "#00E396",
    salud: "#FFB01A",
    gastosHormiga: "#FF4560",
    diversion: "#775DD0",
    comidas: "#AA00FF",
    educacion: "#FF00AA",
    transporte: "#00FFAA",
    creditos: "#AAFF00",
    despensa: "#00AAFF",
    ropa: "#FFAA00",
    cuidadoPersonal: "#FF0000",
    otros: "#CCCCCC"
  };

  // MARK: Recolecta datos de cada sección de gasto existente
  return Array.from(
    document.querySelectorAll('#gastos-container .input-seciont-add:not(#total-block)')
  ).map(div => {
    const id    = div.id.replace('gasto-', '');                        
    const raw   = (document.getElementById(`input-${id}`)?.value || '0').replace(/,/g, '');
    const value = parseFloat(raw) || 0;                                
    const name  = div.querySelector('.info-input span')?.innerText || id; 
    const color = colorMap[id] || '#CCCCCC';                           
    return { id, name, value, color };
  });
}

function updateDonutChart() {
  const categories = getCategoriesData();                                
  const total      = categories.reduce((sum, c) => sum + c.value, 0); 

  if (total <= 0) {
    //Si no hay gastos, limpia gradiente y etiquetas
    document.documentElement.style.removeProperty('--donut-gradient');
    const labelsEmpty = document.querySelector('.percent-labels');
    if (labelsEmpty) labelsEmpty.innerHTML = '';
    return;
  }

  // MARK: Construye gradiente CSS para el donut chart
  let gradient = '';
  let acc      = 0;
  const gap    = 0;

  categories.forEach((cat, idx) => {
    if (cat.value <= 0) return;
    const pct   = (cat.value / total) * 100;
    const start = acc + (idx > 0 ? gap : 0);
    const end   = start + pct - gap;
    gradient   += `${cat.color} ${start}% ${end}%, white ${end}% ${end + gap}%, `;
    acc = end + gap;
  });

  gradient = gradient.slice(0, -2);                                     
  document.documentElement.style.setProperty('--donut-gradient', gradient);

  // MARK: Genera y posiciona etiquetas de porcentaje alrededor del donut
  const labelsContainer = document.querySelector('.percent-labels');
  if (labelsContainer) {
    labelsContainer.innerHTML = '';
    const placed     = [];
    const cx         = 100, cy = 100;      // Centro del donut en px
    const baseRadius = 80;                 // Radio base para etiquetas
    const minGap     = 20;                 // Distancia mínima entre etiquetas
    const offsetStep = 10;                 // Incremento de radio si colisionan
    let accLabel     = 0;

    categories.forEach(cat => {
      if (cat.value <= 0) return;
      const pct   = (cat.value / total) * 100;
      const mid   = accLabel + pct / 2;
      const angle = (mid / 100) * 360 - 90;                             
      const rad   = angle * Math.PI / 180;

      let radius = pct < 3 ? baseRadius * 1.2 : baseRadius;             
      let x = Math.cos(rad) * radius + cx;
      let y = Math.sin(rad) * radius + cy;

      // MARK: Ajusta posición si está muy cerca de otra etiqueta
      for (let other of placed) {
        while (Math.hypot(x - other.x, y - other.y) < minGap) {
          radius += offsetStep;
          x = Math.cos(rad) * radius + cx;
          y = Math.sin(rad) * radius + cy;
        }
      }

      const label = document.createElement('div');
      label.className       = 'percent-label';
      label.style.left      = `${x}px`;
      label.style.top       = `${y}px`;
      label.style.transform = 'translate(-50%, -50%)';
      label.textContent     = `${pct.toFixed(1)}%`;

      labelsContainer.appendChild(label);
      placed.push({ x, y });
      accLabel += pct;
    });
  }

  // MARK: Actualiza leyenda después de dibujar el donut
  if (typeof updateLegend === 'function') updateLegend();
}

function updateLegend() {
  const cats = getCategoriesData().filter(c => c.value > 0);          
  const container = document.getElementById('legend');
  if (!container) return;
  container.innerHTML = '';

  cats.forEach(cat => {
    const item   = document.createElement('div');
    const swatch = document.createElement('span');
    swatch.className            = 'color';
    swatch.style.backgroundColor = cat.color;                          
    item.appendChild(swatch);
    item.append(' ' + cat.name);                                       
    container.appendChild(item);
  });
}

document.addEventListener('DOMContentLoaded', updateDonutChart);
