document.addEventListener('DOMContentLoaded', () => {
    const compararBtn = document.getElementById('compararBtn');
    const countdownDiv = document.createElement('div'); // Crear el div para el countdown
    countdownDiv.style.color = 'yellow';
    countdownDiv.style.marginTop = '10px';
    countdownDiv.style.display = 'none'; // Ocultarlo inicialmente
    compararBtn.parentNode.insertBefore(countdownDiv, compararBtn.nextSibling); // Insertar debajo del botón

    let chartInstance = null; // Global variable to store the chart instance
    let countdownStarted = false; // Flag to track if the countdown has started

    compararBtn.addEventListener('click', () => {
        if (countdownStarted) {
            return; // Prevent further actions if countdown is active
        }

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

        // Enviar datos al servidor
        fetch('http://127.0.0.1:5000/comparar_inversiones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ years, opcion1, opcion2, investment })
        })
            .then(response => {
                if (response.status === 429) {
                    // Si el servidor devuelve un error 429 (Too Many Requests)
                    const retryAfter = response.headers.get('Retry-After'); // Obtener el tiempo de espera del encabezado
                    const waitTime = retryAfter ? parseInt(retryAfter, 10) : 60; // Usar el valor del encabezado o un valor predeterminado
                    startCountdown(waitTime);
                    throw new Error('Límite de peticiones alcanzado.');
                }
                return response.json();
            })
            .then(data => {
                const { filtered_result, last_value1, last_value2 } = data;

                const labels = filtered_result.map(entry => entry.Fecha);
                const data1 = filtered_result.map(entry => entry[opcion1]);
                const data2 = filtered_result.map(entry => entry[opcion2]);

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
                    firstValueElement.textContent = `$ ${last_value1.toFixed(2)}`;
                }

                if (secondValueElement) {
                    secondValueElement.textContent = `$ ${last_value2.toFixed(2)}`;
                }
            })
            .catch(error => {
                console.error('Error al comparar:', error);
                if (error.message !== 'Límite de peticiones alcanzado.') {
                    alert('Hubo un error al hacer la comparación.');
                }
            });
    });

    function startCountdown(seconds) {
        countdownStarted = true; // Set the flag to indicate the countdown has started
        countdownDiv.style.display = 'block'; // Mostrar el div
        let remainingTime = seconds;

        const updateCountdown = () => {
            countdownDiv.textContent = `Para poder seguir comparando, esperar ${remainingTime} segundos.`;
            if (remainingTime > 0) {
                remainingTime--;
                setTimeout(updateCountdown, 1000); // Actualizar cada segundo
            } else {
                countdownDiv.style.display = 'none'; // Ocultar el div cuando termine el tiempo
                countdownStarted = false; // Reset the flag when the countdown ends
            }
        };

        updateCountdown();
    }
});