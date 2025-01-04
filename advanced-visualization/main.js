// Canvas 설정
const canvas = document.getElementById('visualChart');
const ctx = canvas.getContext('2d');

// 테스트용 데이터
const data = [30, 50, 80, 45, 65, 85, 40];

// 차트 그리기 함수
function drawChart() {
    // Canvas 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 차트 설정
    const barWidth = 40;
    const spacing = 20;
    const startX = 50;
    const bottomY = canvas.height - 50;
    
    // 막대 그래프 그리기
    data.forEach((value, index) => {
        const x = startX + (barWidth + spacing) * index;
        const height = value * 3;
        
        // 막대 그리기
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(x, bottomY - height, barWidth, height);
        
        // 값 표시
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(value, x + barWidth/2, bottomY - height - 10);
    });
}

// 초기 렌더링
drawChart();
