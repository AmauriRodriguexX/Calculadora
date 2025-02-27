document.addEventListener('DOMContentLoaded', function() {
  // MARK: Chart pie
  function updateChart(income, expenses) {
    const total = income + expenses;
    if (total === 0) return;
    const incomePercentage = (income / total) * 100;
    // Asigna el porcentaje como variable CSS
    document.documentElement.style.setProperty('--income-percentage', `${incomePercentage}%`);
  }

  // Cargar datos desde localStorage (o valores por defecto)
  const income = parseFloat(localStorage.getItem('income')) || 3000;
  const expenses = parseFloat(localStorage.getItem('expenses')) || 1000;
  updateChart(income, expenses);

  // MARK: Chart Donut
  function updateDonutChart() {
    // Ejemplo: 5 categorías que suman 100
    const categories = [
      { name: "Renta",             value: 25, color: "#008FFB" },
      { name: "Pago de servicios",  value: 25, color: "#00E396" },
      { name: "Salud",             value: 20, color: "#FFB01A" },
      { name: "Gastos hormiga",    value: 15, color: "#FF4560" },
      { name: "Diversión",         value: 15, color: "#775DD0" }
    ];

    // Suma total de valores (debe ser 100 para un donut completo)
    const total = categories.reduce((sum, cat) => sum + cat.value, 0);
    let gradient = "";
    let accumulatedPercent = 0;
    // Gap entre secciones
    const gapSm = 0.5;

    // Generar el conic-gradient
    categories.forEach((cat, index) => {
      const percent = (cat.value / total) * 100;
      const start = accumulatedPercent + (index > 0 ? gapSm : 0);
      const end = start + percent - gapSm;
      gradient += `${cat.color} ${start}% ${end}%, white ${end}% ${end + gapSm}%, `;
      accumulatedPercent = end + gapSm;
    });
    // Eliminar la última coma y espacio
    gradient = gradient.slice(0, -2);
    // Asigna el gradiente a la variable CSS
    document.documentElement.style.setProperty('--donut-gradient', gradient);

    // Posicionar los porcentajes (solo si existe el contenedor)
    const labelsContainer = document.querySelector('.percent-labels');
    if (labelsContainer) {
      labelsContainer.innerHTML = ''; // Limpiar antes de renderizar
      accumulatedPercent = 0;
      categories.forEach(cat => {
        const catPercent = (cat.value / total) * 100;
        const midPercent = accumulatedPercent + catPercent / 2;
        const angle = (midPercent / 100) * 360 - 90;
        // Calcular coordenadas para ubicar la etiqueta
        const x = Math.cos(angle * (Math.PI / 180)) * 80 + 100;
        const y = Math.sin(angle * (Math.PI / 180)) * 80 + 100;
        const label = document.createElement("div");
        label.className = 'percent-label';
        label.style.left = `${x}px`;
        label.style.top = `${y}px`;
        label.textContent = `${catPercent.toFixed(1)}%`;
        labelsContainer.appendChild(label);
        accumulatedPercent += catPercent;
      });
    }
  }
  // Inicializar la gráfica donut (si existe la estructura, de lo contrario no hace nada)
  updateDonutChart();

  // MARK: Progress Bar
  function updateSliderBackground(slider) {
    let percentage = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.background = `linear-gradient(to right, #EF5292 0%, #EF5292 ${percentage}%, #F0EFEF ${percentage}%, #F0EFEF 100%)`;
  }

  const dreamCost = document.getElementById('dreamCost');
  const dreamTime = document.getElementById('dreamTime');
  const costValue = document.getElementById('costValue');
  const timeValue = document.getElementById('timeValue');

  if (dreamCost && costValue) {
    dreamCost.addEventListener('input', function() {
      updateSliderBackground(this);
      costValue.innerText = `$${parseInt(this.value).toLocaleString()}`;
    });
    // Inicializar slider
    updateSliderBackground(dreamCost);
  } else {
    console.error("No se encontró 'dreamCost' o 'costValue'");
  }

  if (dreamTime && timeValue) {
    dreamTime.addEventListener('input', function() {
      updateSliderBackground(this);
      timeValue.innerText = `${this.value} años`;
    });
    updateSliderBackground(dreamTime);
  } else {
    console.error("No se encontró 'dreamTime' o 'timeValue'");
  }
});
