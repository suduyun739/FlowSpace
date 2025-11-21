// 数据存储管理
class DataManager {
    constructor() {
        this.initializeData();
    }

    initializeData() {
        if (!localStorage.getItem('workflow-projects')) {
            localStorage.setItem('workflow-projects', JSON.stringify([]));
        }
        if (!localStorage.getItem('workflow-tasks')) {
            localStorage.setItem('workflow-tasks', JSON.stringify([]));
        }
        if (!localStorage.getItem('workflow-journal')) {
            localStorage.setItem('workflow-journal', JSON.stringify([]));
        }
        if (!localStorage.getItem('workflow-planner')) {
            localStorage.setItem('workflow-planner', JSON.stringify([]));
        }
    }

    getProjects() {
        return JSON.parse(localStorage.getItem('workflow-projects') || '[]');
    }

    saveProjects(projects) {
        localStorage.setItem('workflow-projects', JSON.stringify(projects));
    }

    getTasks() {
        return JSON.parse(localStorage.getItem('workflow-tasks') || '[]');
    }

    saveTasks(tasks) {
        localStorage.setItem('workflow-tasks', JSON.stringify(tasks));
    }

    getJournalEntries() {
        return JSON.parse(localStorage.getItem('workflow-journal') || '[]');
    }

    saveJournalEntries(entries) {
        localStorage.setItem('workflow-journal', JSON.stringify(entries));
    }

    getPlannerTasks() {
        return JSON.parse(localStorage.getItem('workflow-planner') || '[]');
    }

    savePlannerTasks(tasks) {
        localStorage.setItem('workflow-planner', JSON.stringify(tasks));
    }
}

// 全局数据管理器实例
const dataManager = new DataManager();

// 工具函数
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getTodayString() {
    return formatDate(new Date());
}

// 仪表板功能
function updateDashboardStats() {
    const projects = dataManager.getProjects();
    const plannerTasks = dataManager.getPlannerTasks();
    const today = getTodayString();
    
    const activeProjects = projects.filter(p => p.status !== 'completed').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const todayTasks = plannerTasks.filter(t => t.date === today);
    const completedTodayTasks = todayTasks.filter(t => t.completed).length;
    
    // 更新统计数字
    const activeProjectsEl = document.getElementById('active-projects');
    const completedProjectsEl = document.getElementById('completed-projects');
    const todayTasksEl = document.getElementById('today-tasks');
    const completedTasksEl = document.getElementById('completed-tasks');
    
    if (activeProjectsEl) activeProjectsEl.textContent = activeProjects;
    if (completedProjectsEl) completedProjectsEl.textContent = completedProjects;
    if (todayTasksEl) todayTasksEl.textContent = todayTasks.length;
    if (completedTasksEl) completedTasksEl.textContent = completedTodayTasks;
    
    // 更新今日任务列表
    updateTodayTasksPreview();
}

function updateTodayTasksPreview() {
    const container = document.getElementById('today-tasks-list');
    if (!container) return;
    
    const plannerTasks = dataManager.getPlannerTasks();
    const today = getTodayString();
    const todayTasks = plannerTasks.filter(t => t.date === today).slice(0, 5); // 只显示前5个
    
    if (todayTasks.length === 0) {
        container.innerHTML = `
            <div class="text-center text-gray-400 py-8">
                <i class="fas fa-calendar-check text-4xl mb-2"></i>
                <p>今天还没有安排任务</p>
                <p class="text-sm mt-1">点击上方"添加任务"开始规划今天的工作</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = todayTasks.map(task => `
        <div class="flex items-center justify-between p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
            <div class="flex items-center space-x-3">
                <input type="checkbox" ${task.completed ? 'checked' : ''} 
                       onchange="toggleTaskStatus('${task.id}')"
                       class="w-5 h-5 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500">
                <div>
                    <p class="font-medium ${task.completed ? 'line-through text-gray-500' : ''}">${task.name}</p>
                    ${task.description ? `<p class="text-sm text-gray-400">${task.description}</p>` : ''}
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <span class="priority-${task.priority} px-2 py-1 text-xs rounded-full bg-slate-700">
                    ${task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                </span>
                ${task.time ? `<span class="text-sm text-gray-400">${task.time}</span>` : ''}
            </div>
        </div>
    `).join('');
}

// 项目管理功能
function openProjectModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.getElementById('project-name').focus();
    }
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        // 清空表单
        document.getElementById('project-name').value = '';
        document.getElementById('project-description').value = '';
        document.getElementById('project-priority').value = 'medium';
    }
}

function createProject(event) {
    event.preventDefault();
    
    const name = document.getElementById('project-name').value;
    const description = document.getElementById('project-description').value;
    const priority = document.getElementById('project-priority').value;
    
    const project = {
        id: generateId(),
        name,
        description,
        priority,
        status: 'active',
        createdAt: new Date().toISOString(),
        tasks: []
    };
    
    const projects = dataManager.getProjects();
    projects.push(project);
    dataManager.saveProjects(projects);
    
    closeProjectModal();
    updateDashboardStats();
    
    // 显示成功消息
    showNotification('项目创建成功！', 'success');
}

// 任务管理功能
function openTaskModal() {
    const modal = document.getElementById('task-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.getElementById('task-name').focus();
    }
}

function closeTaskModal() {
    const modal = document.getElementById('task-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        // 清空表单
        document.getElementById('task-name').value = '';
        document.getElementById('task-description').value = '';
        document.getElementById('task-priority').value = 'medium';
        document.getElementById('task-time').value = '';
    }
}

function createTask(event) {
    event.preventDefault();
    
    const name = document.getElementById('task-name').value;
    const description = document.getElementById('task-description').value;
    const priority = document.getElementById('task-priority').value;
    const time = document.getElementById('task-time').value;
    
    const task = {
        id: generateId(),
        name,
        description,
        priority,
        time,
        completed: false,
        date: window.selectedDate || getTodayString(),
        createdAt: new Date().toISOString()
    };
    
    const tasks = dataManager.getPlannerTasks();
    tasks.push(task);
    dataManager.savePlannerTasks(tasks);
    
    closeTaskModal();
    updateDashboardStats();
    
    if (window.location.pathname.includes('planner.html')) {
        loadPlannerTasks();
        updatePlannerStats();
    }
    
    showNotification('任务添加成功！', 'success');
}

function toggleTaskStatus(taskId) {
    const tasks = dataManager.getPlannerTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        dataManager.savePlannerTasks(tasks);
        updateDashboardStats();
        
        if (window.location.pathname.includes('planner.html')) {
            loadPlannerTasks();
            updatePlannerStats();
        }
    }
}

function deleteTask(taskId) {
    const tasks = dataManager.getPlannerTasks();
    const filteredTasks = tasks.filter(t => t.id !== taskId);
    dataManager.savePlannerTasks(filteredTasks);
    
    updateDashboardStats();
    if (window.location.pathname.includes('planner.html')) {
        loadPlannerTasks();
        updatePlannerStats();
    }
    
    showNotification('任务已删除', 'info');
}

// 每日计划功能
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
window.selectedDate = getTodayString();

function initCalendar() {
    updateCalendarTitle();
    renderCalendar();
    updateSelectedDate();
}

function updateCalendarTitle() {
    const titleEl = document.getElementById('calendar-title');
    if (titleEl) {
        const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', 
                           '7月', '8月', '9月', '10月', '11月', '12月'];
        titleEl.textContent = `${currentYear}年 ${monthNames[currentMonth]}`;
    }
}

function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    if (!grid) return;
    
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    const todayStr = formatDate(today);
    
    grid.innerHTML = '';
    
    // 空白天数
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'h-8';
        grid.appendChild(emptyDay);
    }
    
    // 月份天数
    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        const dateStr = formatDate(new Date(currentYear, currentMonth, day));
        
        dayEl.className = 'calendar-day h-8 flex items-center justify-center text-sm cursor-pointer rounded';
        dayEl.textContent = day;
        dayEl.onclick = () => selectDate(dateStr);
        
        if (dateStr === todayStr) {
            dayEl.classList.add('today');
        }
        if (dateStr === window.selectedDate) {
            dayEl.classList.add('selected');
        }
        
        grid.appendChild(dayEl);
    }
}

function selectDate(dateStr) {
    window.selectedDate = dateStr;
    renderCalendar();
    updateSelectedDate();
    loadPlannerTasks();
    updatePlannerStats();
}

function updateSelectedDate() {
    const dateEl = document.getElementById('selected-date');
    if (dateEl) {
        const date = new Date(window.selectedDate);
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();
        
        if (isToday) {
            dateEl.textContent = '今天';
        } else {
            dateEl.textContent = `${date.getMonth() + 1}月${date.getDate()}日`;
        }
    }
}

function changeMonth(direction) {
    currentMonth += direction;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
    updateCalendarTitle();
}

function loadPlannerTasks() {
    const container = document.getElementById('tasks-container');
    if (!container) return;
    
    const tasks = dataManager.getPlannerTasks();
    const dayTasks = tasks.filter(t => t.date === window.selectedDate);
    
    if (dayTasks.length === 0) {
        container.innerHTML = `
            <div class="text-center text-gray-400 py-12">
                <i class="fas fa-clipboard-list text-4xl mb-4"></i>
                <p class="text-lg">暂无任务</p>
                <p class="text-sm mt-2">点击"添加任务"开始规划您的一天</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = dayTasks.map(task => `
        <div class="task-item flex items-center justify-between p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors priority-${task.priority}">
            <div class="flex items-center space-x-4">
                <input type="checkbox" ${task.completed ? 'checked' : ''} 
                       onchange="toggleTaskStatus('${task.id}')"
                       class="w-6 h-6 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500">
                <div class="flex-1">
                    <p class="font-medium text-lg ${task.completed ? 'line-through text-gray-500' : ''}">${task.name}</p>
                    ${task.description ? `<p class="text-gray-400 mt-1">${task.description}</p>` : ''}
                    <div class="flex items-center space-x-3 mt-2">
                        <span class="priority-${task.priority} px-2 py-1 text-xs rounded-full bg-slate-700">
                            ${task.priority === 'high' ? '高优先级' : task.priority === 'medium' ? '中优先级' : '低优先级'}
                        </span>
                        ${task.time ? `<span class="text-sm text-gray-400"><i class="fas fa-clock mr-1"></i>${task.time}</span>` : ''}
                    </div>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <button onclick="deleteTask('${task.id}')" class="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-slate-600 transition-colors">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function filterTasks(filter) {
    const tasks = document.querySelectorAll('.task-item');
    const buttons = document.querySelectorAll('.filter-btn');
    
    // 更新按钮状态
    buttons.forEach(btn => {
        btn.classList.remove('active', 'bg-blue-600', 'text-white');
        btn.classList.add('bg-slate-600', 'text-gray-300');
    });
    
    event.target.classList.add('active', 'bg-blue-600', 'text-white');
    event.target.classList.remove('bg-slate-600', 'text-gray-300');
    
    // 过滤任务
    tasks.forEach(task => {
        const checkbox = task.querySelector('input[type="checkbox"]');
        const isCompleted = checkbox.checked;
        
        let show = true;
        if (filter === 'pending') {
            show = !isCompleted;
        } else if (filter === 'completed') {
            show = isCompleted;
        }
        
        task.style.display = show ? 'flex' : 'none';
    });
}

function updatePlannerStats() {
    const tasks = dataManager.getPlannerTasks();
    const dayTasks = tasks.filter(t => t.date === window.selectedDate);
    
    const totalEl = document.getElementById('total-tasks');
    const completedEl = document.getElementById('completed-count');
    const pendingEl = document.getElementById('pending-count');
    
    if (totalEl) totalEl.textContent = dayTasks.length;
    if (completedEl) completedEl.textContent = dayTasks.filter(t => t.completed).length;
    if (pendingEl) pendingEl.textContent = dayTasks.filter(t => !t.completed).length;
}

// 通知系统
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
    
    const colors = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        info: 'bg-blue-600',
        warning: 'bg-yellow-600'
    };
    
    notification.classList.add(colors[type] || colors.info);
    notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    // 更新仪表板统计
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        updateDashboardStats();
    }
    
    // 初始化日历
    if (window.location.pathname.includes('planner.html')) {
        initCalendar();
        loadPlannerTasks();
        updatePlannerStats();
    }
    
    // 添加页面动画
    anime({
        targets: '.glass-effect',
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(100),
        duration: 800,
        easing: 'easeOutQuart'
    });
});

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + N 新建项目
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            openProjectModal();
        }
    }
    
    // Ctrl/Cmd + T 新建任务
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || 
            window.location.pathname.includes('planner.html')) {
            openTaskModal();
        }
    }
    
    // Escape 关闭模态框
    if (e.key === 'Escape') {
        closeProjectModal();
        closeTaskModal();
    }
});

// 导出全局函数
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;
window.createProject = createProject;
window.openTaskModal = openTaskModal;
window.closeTaskModal = closeTaskModal;
window.createTask = createTask;
window.toggleTaskStatus = toggleTaskStatus;
window.deleteTask = deleteTask;
window.selectDate = selectDate;
window.changeMonth = changeMonth;
window.filterTasks = filterTasks;