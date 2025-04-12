// 获取画布和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏配置
const gridSize = 20; // 网格大小
const tileCount = canvas.width / gridSize; // 网格数量

// 蛇的初始配置
let snake = {
    x: 10,
    y: 10,
    dx: 0,
    dy: 0,
    cells: [],
    maxCells: 4
};

// 食物的位置
let food = {
    x: 15,
    y: 15
};

// 游戏状态
let score = 0;
let gameRunning = true;

// 初始化游戏
function startGame() {
    // 重置蛇的位置和状态
    snake.x = 10;
    snake.y = 10;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = 0;
    snake.dy = 0;
    
    // 重置分数
    score = 0;
    updateScore();
    
    // 随机生成食物
    generateFood();
    
    // 隐藏游戏结束界面
    document.getElementById('gameOver').style.display = 'none';
    
    // 重置游戏状态
    gameRunning = true;
    
    // 开始游戏循环
    requestAnimationFrame(gameLoop);
}

// 生成随机食物位置
function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    
    // 确保食物不会生成在蛇身上
    for (let cell of snake.cells) {
        if (food.x === cell.x && food.y === cell.y) {
            generateFood();
            break;
        }
    }
}

// 更新分数显示
function updateScore() {
    document.getElementById('score').textContent = `分数：${score}`;
    document.getElementById('finalScore').textContent = score;
}

// 游戏结束处理
function gameOver() {
    gameRunning = false;
    document.getElementById('gameOver').style.display = 'block';
}

// 游戏主循环
function gameLoop() {
    if (!gameRunning) return;
    
    requestAnimationFrame(gameLoop);
    
    // 控制游戏速度
    const now = Date.now();
    if (now - lastTime < 100) return;
    lastTime = now;
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 更新蛇的位置
    snake.x += snake.dx;
    snake.y += snake.dy;
    
    // 边界检查
    if (snake.x < 0 || snake.x >= tileCount || snake.y < 0 || snake.y >= tileCount) {
        gameOver();
        return;
    }
    
    // 记录蛇的移动轨迹
    snake.cells.unshift({x: snake.x, y: snake.y});
    
    // 保持蛇的长度
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }
    
    // 绘制食物
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    
    // 绘制蛇
    ctx.fillStyle = 'green';
    snake.cells.forEach((cell, index) => {
        ctx.fillRect(cell.x * gridSize, cell.y * gridSize, gridSize - 2, gridSize - 2);
        
        // 检查是否吃到自己
        if (index > 0 && cell.x === snake.x && cell.y === snake.y) {
            gameOver();
            return;
        }
    });
    
    // 检查是否吃到食物
    if (snake.x === food.x && snake.y === food.y) {
        snake.maxCells++;
        score += 10;
        updateScore();
        generateFood();
    }
}

// 键盘控制
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    
    // 左方向键
    if (e.key === 'ArrowLeft' && snake.dx === 0) {
        snake.dx = -1;
        snake.dy = 0;
    }
    // 右方向键
    else if (e.key === 'ArrowRight' && snake.dx === 0) {
        snake.dx = 1;
        snake.dy = 0;
    }
    // 上方向键
    else if (e.key === 'ArrowUp' && snake.dy === 0) {
        snake.dx = 0;
        snake.dy = -1;
    }
    // 下方向键
    else if (e.key === 'ArrowDown' && snake.dy === 0) {
        snake.dx = 0;
        snake.dy = 1;
    }
});

// 记录上次更新时间
let lastTime = 0;

// 开始游戏
startGame();