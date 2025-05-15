document.addEventListener('DOMContentLoaded', () => {
    const compararBtn = document.getElementById('compararBtn');
    let chartInstance = null; // Global variable to store the chart instance

    compararBtn.addEventListener('click', () => {
        const yearsInput = document.getElementById('wt1-years');
        const investmentInput = document.getElementById('wt1-investment');
        const years = parseInt(yearsInput.textContent.trim()) || yearsInput.dataset.default;
        const investment = parseFloat(investmentInput.textContent.trim()) || investmentInput.dataset.default;

        const selector1 = document.querySelector('#investmentSelector .selected');
        const selector2 = document.querySelector('#investmentSelector2 .selected');

        const opcion1 = selector1 ? selector1.querySelector('.title').textContent.trim() : null;
        const opcion2 = selector2 ? selector2.querySelector('.title').textContent.trim() : null;

        if (!opcion1 || !opcion2) {
            alert('Selecciona dos opciones para comparar.');
            return;
        }

        fetch('http://127.0.0.1:5000/valores_cuota', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({years, opcion1, opcion2})
        })
            .then(response => response.json())
            .then(data => {
                // Find the last date in the dataset
                const lastDate = new Date(data[data.length - 1].Fecha.split('/').reverse().join('-'));

                // Calculate the start date based on the input years
                const startDate = new Date(lastDate);
                startDate.setFullYear(startDate.getFullYear() - years);

                // Filter data to include only entries between the start date and the last date
                const filteredData = data.filter(entry => {
                    const entryDate = new Date(entry.Fecha.split('/').reverse().join('-'));
                    return entryDate >= startDate && entryDate <= lastDate;
                });

                // Sort data in ascending order by date
                const sortedData = filteredData.sort((a, b) => {
                    const dateA = new Date(a.Fecha.split('/').reverse().join('-'));
                    const dateB = new Date(b.Fecha.split('/').reverse().join('-'));
                    return dateA - dateB; // Ascending order
                });

                let previousCuota1 = null;
                let previousCuota2 = null;
                let previousInvestment1 = investment;
                let previousInvestment2 = investment;

                const result = sortedData.map((entry, index) => {
                    const cuota1 = entry[opcion1] || 0;
                    const cuota2 = entry[opcion2] || 0;

                    const adjusted1 = index === 0
                        ? (cuota1 / cuota1) * investment
                        : (cuota1 / previousCuota1) * previousInvestment1;

                    const adjusted2 = index === 0
                        ? (cuota2 / cuota2) * investment
                        : (cuota2 / previousCuota2) * previousInvestment2;

                    previousCuota1 = cuota1;
                    previousCuota2 = cuota2;
                    previousInvestment1 = adjusted1;
                    previousInvestment2 = adjusted2;

                    return {
                        Fecha: entry.Fecha,
                        [opcion1]: adjusted1,
                        [opcion2]: adjusted2
                    };
                });

                // Filter data based on the input years
                let interval = 2; // Default interval (weekly)
                if (years === 5) {
                    interval = 8; // Every 3 weeks
                } else if (years === 10) {
                    interval = 12; // Every 6 weeks
                } else if (years === 15) {
                    interval = 20; // Every 2 months (approx. 8 weeks)
                }

                const filteredResult = result.filter((_, index) => index % interval === 0);

                // Get the last values
                const lastValue1 = result[result.length - 1]?.[opcion1] || 0;
                const lastValue2 = result[result.length - 1]?.[opcion2] || 0;

                const labels = filteredResult.map(entry => entry.Fecha);
                const data1 = filteredResult.map(entry => entry[opcion1]);
                const data2 = filteredResult.map(entry => entry[opcion2]);

                // Destroy the previous chart instance if it exists
                if (chartInstance) {
                    chartInstance.destroy();
                }

                // Create a new chart
                const ctx = document.getElementById('comparisonChart').getContext('2d');
                chartInstance = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels, // Dates as labels
                        datasets: [
                            {
                                label: opcion1,
                                data: data1,
                                borderColor: 'rgb(236,255,0)',
                                borderWidth: 2,
                                fill: false,
                                pointRadius: 0, // Remove points
                                pointHoverRadius: 0 // Remove hover effect on points
                            },
                            {
                                label: opcion2,
                                data: data2,
                                borderColor: 'rgb(255,255,255)',
                                borderWidth: 2,
                                fill: false,
                                pointRadius: 0, // Remove points
                                pointHoverRadius: 0 // Remove hover effect on points
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                                labels: {
                                    color: 'white', // Set legend text color to white
                                }
                            },
                            title: {
                                display: true,
                                text: 'Comparación de Inversiones a lo Largo del Tiempo',
                                color: 'white', // Set title text color to white
                                font: {
                                    size: 16 // Optional: Adjust font size
                                }
                            }
                        },
                        interaction: {
                            mode: 'nearest', // Ensure interaction is based on proximity
                            intersect: false // Allow interaction without intersecting a point
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Fechas',
                                    color: 'white', // Set x-axis title color to white
                                },
                                ticks: {
                                    color: 'white', // Set x-axis tick labels color to white
                                },
                                grid: {
                                    display: false // Remove grid lines on y-axis
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Valor de la Inversión ($)',
                                    color: 'white', // Set y-axis title color to white
                                },
                                ticks: {
                                    color: 'white', // Set y-axis tick labels color to white
                                },
                                grid: {
                                    display: false // Remove grid lines on y-axis
                                }
                            }
                        }
                    }
                });
                // Update the HTML elements
                const firstValueElement = document.querySelector('.final_values div:nth-child(2)');
                const secondValueElement = document.querySelector('.final_values2 div:nth-child(2)');

                if (firstValueElement) {
                    firstValueElement.textContent = `$ ${lastValue1.toFixed(2)}`;
                }

                if (secondValueElement) {
                    secondValueElement.textContent = `$ ${lastValue2.toFixed(2)}`;
                }

            })
            .catch(error => {
                console.error('Error al comparar:', error);
                alert('Hubo un error al hacer la comparación.');
            });
    });
});