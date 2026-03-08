<script lang="ts">
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';

    export let dataPoints: number[] = [];
    
    let canvasElement: HTMLCanvasElement;
    let chartInstance: Chart;

    // Reactively update the chart when FastAPI sends new data
    $: if (chartInstance && dataPoints) {
        chartInstance.data.labels = dataPoints.map((_, index) => `Point ${index + 1}`);
        chartInstance.data.datasets[0].data = dataPoints;
        chartInstance.update();
    }

    onMount(() => {
        chartInstance = new Chart(canvasElement, {
            type: 'line',
            data: {
                labels: dataPoints.map((_, index) => `Point ${index + 1}`),
                datasets: [{
                    label: 'DLSCA Leakage Trace',
                    data: dataPoints,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 1, // 👈 Thinner line for dense data
                    pointRadius: 0, // 👈 Hide individual dots to save huge amounts of memory
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false, // 👈 Turn off animations so the browser doesn't freeze with 10,000+ points
                plugins: { legend: { display: true } },
                elements: {
                    point: { radius: 0 } // Double-enforce no dots
                }
            }
        });

        return () => chartInstance.destroy();
    });
</script>

<div class="chart-container">
    <canvas bind:this={canvasElement}></canvas>
</div>

<style>
    .chart-container {
        position: relative;
        height: 300px;
        width: 100%;
        margin-top: 1.5rem;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 1rem;
        box-sizing: border-box;
    }
</style>