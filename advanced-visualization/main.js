const CHART_CONFIG = {
    width: 600,
    height: 400,
    barWidth: 40,
    spacing: 20,
    startX: 70,
    startY: 50,
    bottomMargin: 70,
    rightMargin: 70,
    animationDuration: 1000
};

const canvas = document.getElementById('visualChart');
canvas.width = CHART_CONFIG.width;
canvas.height = CHART_CONFIG.height;
const ctx = canvas.getContext('2d');

let chartState = {
    data: [30, 50, 80, 45, 65, 85, 40],
    maxDataPoints: 9,  // 최대 데이터 포인트 수
    isAutoUpdating: false  // 자동 업데이트 상태 추적 플래그 변수
};


/**
 * 차트 그리기
 */
function drawChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const chartWidth = canvas.width - (CHART_CONFIG.startX + CHART_CONFIG.rightMargin);
    const chartHeight = canvas.height - (CHART_CONFIG.startY + CHART_CONFIG.bottomMargin);
    
    // 축 그리기를 먼저 수행
    drawAxes();
    
    chartState.data.forEach((value, index) => {
        const x = CHART_CONFIG.startX + (CHART_CONFIG.barWidth + CHART_CONFIG.spacing) * index;
        const height = (value / Math.max(...chartState.data)) * chartHeight;
        const y = canvas.height - CHART_CONFIG.bottomMargin - height;
        
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(x, y, CHART_CONFIG.barWidth, height);
        
        ctx.fillStyle = '#000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(value, x + CHART_CONFIG.barWidth/2, y - 10);
        
        ctx.fillText(index + 1, x + CHART_CONFIG.barWidth/2, canvas.height - CHART_CONFIG.bottomMargin + 20);
    });
}

/**
 * 축 그리기
 */
function drawAxes() {
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    // Y축
    ctx.moveTo(CHART_CONFIG.startX, CHART_CONFIG.startY);
    ctx.lineTo(CHART_CONFIG.startX, canvas.height - CHART_CONFIG.bottomMargin);
    
    // X축
    ctx.moveTo(CHART_CONFIG.startX - 5, canvas.height - CHART_CONFIG.bottomMargin);  // 시작점 약간 확장
    ctx.lineTo(canvas.width - CHART_CONFIG.rightMargin + 5, canvas.height - CHART_CONFIG.bottomMargin);  // 끝점 약간 확장
    
    ctx.stroke();
    
    // 눈금 그리기
    drawGridLines();
}

/**
 *  눈금 그리기
 */
function drawGridLines() {
    ctx.beginPath();
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    // Y축 눈금선
    const maxValue = Math.max(...chartState.data);
    const gridCount = 5;
    const gridStep = maxValue / gridCount;
    
    for(let i = 1; i <= gridCount; i++) {
        const y = canvas.height - CHART_CONFIG.bottomMargin - 
                 (i * gridStep / maxValue) * 
                 (canvas.height - CHART_CONFIG.startY - CHART_CONFIG.bottomMargin);
        
        ctx.moveTo(CHART_CONFIG.startX, y);
        ctx.lineTo(canvas.width - CHART_CONFIG.rightMargin, y);
        
        // 눈금 값 표시
        ctx.fillStyle = '#666';
        ctx.textAlign = 'right';
        ctx.fillText(Math.round(i * gridStep), CHART_CONFIG.startX - 10, y + 4);
    }
    
    ctx.stroke();
}

/**
 * 차트 초기화
 */
function initChart() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    ctx.scale(dpr, dpr);
    
    drawChart();
}

function setupEventListeners() {
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
}

function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
}

function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
}

initChart();
setupEventListeners();
window.addEventListener('resize', initChart);

//-----
//이벤트 리스너

document.getElementById('randomizeData').addEventListener('click', () => {
    chartState.data = chartState.data.map(() => Math.floor(Math.random() * 100));
    drawChart();
});

/**
 * 데이터 추가
 */
function addData() {
    if (chartState.data.length < chartState.maxDataPoints) {
        chartState.data.push(Math.floor(Math.random() * 100));
        drawChart();
    } else {
        alert('최대 9개의 데이터만 표시할 수 있습니다.');
    }
}

document.getElementById('addData').addEventListener('click', addData);

document.getElementById('removeData').addEventListener('click', () => {
    chartState.data.pop();
    drawChart();
});

/**
 * 실시간 업데이트 기능
 */
function toggleAutoUpdate() {
    chartState.isAutoUpdating = !chartState.isAutoUpdating;
    
    if (chartState.isAutoUpdating) {
        startAutoUpdate();
        document.getElementById('autoUpdate').textContent = '자동 업데이트 중지';
    } else {
        stopAutoUpdate();
        document.getElementById('autoUpdate').textContent = '자동 업데이트 시작';
    }
}

function startAutoUpdate() {
    function update() {
        if (chartState.isAutoUpdating) {
            // 랜덤하게 하나의 데이터 업데이트
            const randomIndex = Math.floor(Math.random() * chartState.data.length);
            chartState.data[randomIndex] = Math.floor(Math.random() * 100);
            drawChart();
            requestAnimationFrame(update);
        }
    }
    requestAnimationFrame(update);
}

function stopAutoUpdate() {
    chartState.isAutoUpdating = false;
}

document.getElementById('autoUpdate').addEventListener('click', toggleAutoUpdate);
