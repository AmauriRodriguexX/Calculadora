(function(){
  // MARK: Convierte cualquier string con símbolos en un número flotante válido
  function parseNumber(value) {
    return parseFloat(value.toString().replace(/[^0-9.-]+/g, "")) || 0;
  }

  document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('pieChart');
    if (!canvas) return;                                       
    const ctx = canvas.getContext('2d');

    // MARK: Inicializa el gráfico de tipo 'pie' con datos iniciales
    Chart.overrides.pie.plugins.tooltip = { enabled: false }; 

    Chart.defaults.elements.arc.offset = 0;
    
    window.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Gastos', 'Restante'],
        datasets: [{
          data: [0, 1],
          backgroundColor: ['#FFA301', '#C30054'],
          borderWidth: 0,
          offset: [30, 0] 
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: 0,
        plugins: {
          legend: { display: false }
        }
      }
    });

    // MARK: Función que recalcula valores y actualiza el gráfico
    function refreshChart() {
      const monthlyEl    = document.getElementById('mensual-total');
      const incomeInput  = document.getElementById('number');
      const totalMonthly = monthlyEl   ? parseNumber(monthlyEl.innerText) : 0;
      const incomeMonthly= incomeInput ? parseNumber(incomeInput.value) : 0;
    
      let restante = incomeMonthly - totalMonthly;
      const dataset = pieChart.data.datasets[0];
    
      if (incomeMonthly <= 0) {
        dataset.data = [1];
        dataset.backgroundColor = ['#999999'];
        dataset.offset = [0];
      } else if (restante <= 0) {
        dataset.data = [1]; 
        dataset.backgroundColor = ['#FF0000'];
        dataset.offset = [0];
      } else {
        dataset.data = [totalMonthly, restante];
        dataset.backgroundColor = ['#FFA301', '#C30054'];
        dataset.offset = [30, 0];
      }
    
      pieChart.update();
    }
    
    

    refreshChart();                                           

    const gastosContainer = document.getElementById('gastos-container');
    if (gastosContainer) {
      gastosContainer.addEventListener('input', refreshChart);
    }

    //Tras reiniciar la calculadora, refresca el chart con retraso breve
    document.querySelectorAll('#reiniciarButton').forEach(btn => {
      btn.addEventListener('click', () => setTimeout(refreshChart, 50));
    });
  });
})();
