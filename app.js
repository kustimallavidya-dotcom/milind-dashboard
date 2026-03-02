// Initial Default State
const DEFAULT_DATA = {
    tabs: [
        { id: 't1', name: 'माझे व्यवसाय', icon: 'fas fa-briefcase', subTabs: [] },
        { id: 't2', name: 'नोकरी', icon: 'fas fa-laptop', subTabs: [] },
        { id: 't3', name: 'व्यायाम', icon: 'fas fa-dumbbell', subTabs: [] },
        { id: 't4', name: 'ध्यान धारणा', icon: 'fas fa-om', subTabs: [] },
        { id: 't5', name: 'माझी मनोवृत्ती', icon: 'fas fa-brain', subTabs: [] },
        { id: 't6', name: 'माझी बचत', icon: 'fas fa-piggy-bank', subTabs: [] },
        { id: 't7', name: 'माझे कुटुंब', icon: 'fas fa-home', subTabs: [] }
    ]
};

// State Variables
let appData = JSON.parse(localStorage.getItem('milindCorpData')) || DEFAULT_DATA;
let currentPath = []; // [] = Home, ['t1'] = inside Master, ['t1', 'st1'] = inside SubTab, etc.

// DOM Elements
const appTitle = document.getElementById('app-title');
const appContent = document.getElementById('app-content');
const backBtn = document.getElementById('back-btn');
const homeBtn = document.getElementById('home-btn');

// Modal Elements
const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalInput = document.getElementById('modal-input');
const iconPicker = document.getElementById('icon-picker');
const modalCancel = document.getElementById('modal-cancel');
const modalSave = document.getElementById('modal-save');
const iconElements = document.querySelectorAll('.icon-grid i');

let modalCallback = null;
let selectedIcon = 'fas fa-briefcase';

// Utility to Save Data
const saveData = () => localStorage.setItem('milindCorpData', JSON.stringify(appData));
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

// Setup Event Listeners
homeBtn.addEventListener('click', goHome);
backBtn.addEventListener('click', goBack);

modalCancel.addEventListener('click', () => {
    modalOverlay.classList.add('hidden');
    modalInput.blur();
});

modalSave.addEventListener('click', () => {
    const val = modalInput.value.trim();
    if (val) {
        if (modalCallback) modalCallback(val, selectedIcon);
        modalOverlay.classList.add('hidden');
    } else {
        alert('कृपया नाव लिहा.');
    }
});

iconElements.forEach(icon => {
    icon.addEventListener('click', (e) => {
        iconElements.forEach(i => i.classList.remove('selected'));
        e.target.classList.add('selected');
        selectedIcon = e.target.getAttribute('data-icon');
    });
});

// Navigation Functions
function goHome() {
    currentPath = [];
    render();
}

function goBack() {
    if (currentPath.length > 0) {
        currentPath.pop();
        render();
    }
}

// Android Back Button / PWA History support
window.addEventListener('popstate', (e) => {
    if (currentPath.length === 0) {
        if (!confirm('तुम्हाला खात्री आहे की तुम्ही बाहेर पडू इच्छिता? (Are you sure you want to exit?)')) {
            history.pushState(null, null, window.location.href);
        } else {
            // Let the device exit
            window.history.back();
        }
    } else {
        goBack();
    }
});

// Render Main Loop
function render() {
    // push history state for intercepting back button
    history.pushState(null, null, window.location.href);

    appContent.innerHTML = '';
    window.scrollTo(0, 0);

    if (currentPath.length === 0) {
        renderMasterTabs();
    } else if (currentPath.length === 1) {
        renderSubTabs();
    } else if (currentPath.length === 2) {
        renderInterfaces();
    } else if (currentPath.length === 3) {
        renderInterfaceDetail();
    }
}

// 1. Render Master Tabs
function renderMasterTabs() {
    appTitle.innerText = "लाइफ डॅशबोर्ड";
    backBtn.classList.add('hidden');

    const grid = document.createElement('div');
    grid.className = 'grid-container';

    appData.tabs.forEach((tab, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <i class="${tab.icon || 'fas fa-folder'}"></i>
            <h3>${tab.name}</h3>
            <button class="action-menu edit" onclick="event.stopPropagation(); editMasterTab('${tab.id}', '${tab.name}', '${tab.icon}')" title="Rename"><i class="fas fa-edit"></i></button>
            <button class="action-menu" style="right: 5px; color:var(--danger)" onclick="event.stopPropagation(); deleteMasterTab('${tab.id}', '${tab.name}')" title="Delete"><i class="fas fa-trash"></i></button>
        `;
        card.onclick = () => { currentPath.push(tab.id); render(); };
        grid.appendChild(card);
    });

    appContent.appendChild(grid);
    addFAB(() => openModal('नवीन टॅब जोडा', true, (name, icon) => {
        appData.tabs.push({ id: generateId(), name, icon: icon || 'fas fa-folder', subTabs: [] });
        saveData(); render();
    }));
}

// 2. Render Sub Tabs
function renderSubTabs() {
    const tabId = currentPath[0];
    const tab = appData.tabs.find(t => t.id === tabId);
    if (!tab) return goHome();

    appTitle.innerText = tab.name;
    backBtn.classList.remove('hidden');

    if (!tab.subTabs) tab.subTabs = [];

    const grid = document.createElement('div');
    grid.className = 'grid-container';

    if (tab.subTabs.length === 0) {
        appContent.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding: 50px 20px;">येथे काहीही नाही. नवीन सब-टॅब जोडण्यासाठी + बटणावर क्लिक करा.</p>';
    }

    tab.subTabs.forEach(sub => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <i class="${sub.icon || 'fas fa-file'}"></i>
            <h3>${sub.name}</h3>
            <button class="action-menu edit" onclick="event.stopPropagation(); editSubTab('${sub.id}', '${sub.name}', '${sub.icon}')" title="Rename"><i class="fas fa-edit"></i></button>
            <button class="action-menu" style="right: 5px; color:var(--danger)" onclick="event.stopPropagation(); deleteSubTab('${sub.id}', '${sub.name}')" title="Delete"><i class="fas fa-trash"></i></button>
        `;
        card.onclick = () => { currentPath.push(sub.id); render(); };
        grid.appendChild(card);
    });
    appContent.appendChild(grid);

    addFAB(() => openModal('नवीन सब-टॅब जोडा', true, (name, icon) => {
        tab.subTabs.push({
            id: generateId(), name, icon: icon || 'fas fa-file',
            interfaces: [
                { id: generateId(), name: 'प्लॅनिंग (Planning)', type: 'text', content: '' },
                { id: generateId(), name: 'संविधान (Rules)', type: 'text', content: '' },
                { id: generateId(), name: 'To-Do List', type: 'todo', content: [] }
            ]
        });
        saveData(); render();
    }));
}

// 3. Render Interfaces
function renderInterfaces() {
    const tabId = currentPath[0];
    const subTabId = currentPath[1];
    const tab = appData.tabs.find(t => t.id === tabId);
    const subTab = tab?.subTabs.find(st => st.id === subTabId);

    if (!subTab) return goBack();

    appTitle.innerText = subTab.name;
    backBtn.classList.remove('hidden');

    if (!subTab.interfaces) subTab.interfaces = [];

    const list = document.createElement('div');
    subTab.interfaces.forEach(intf => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <h3><i class="${intf.type === 'todo' ? 'fas fa-list-check' : 'fas fa-align-left'}" style="margin-right:8px; color:var(--primary)"></i> ${intf.name}</h3>
            <div class="list-actions">
                <button class="icon-btn text-muted" onclick="event.stopPropagation(); editInterface('${intf.id}', '${intf.name}')"><i class="fas fa-edit"></i></button>
                <button class="icon-btn text-danger" onclick="event.stopPropagation(); deleteInterface('${intf.id}', '${intf.name}')"><i class="fas fa-trash"></i></button>
            </div>
        `;
        item.onclick = () => { currentPath.push(intf.id); render(); };
        list.appendChild(item);
    });
    appContent.appendChild(list);

    addFAB(() => openModal('नवीन इंटरफेस जोडा (Text)', false, (name) => {
        subTab.interfaces.push({ id: generateId(), name, type: 'text', content: '' });
        saveData(); render();
    }));
}

// 4. Render Interface Detail
function renderInterfaceDetail() {
    const tabId = currentPath[0];
    const subTabId = currentPath[1];
    const intfId = currentPath[2];

    const tab = appData.tabs.find(t => t.id === tabId);
    const subTab = tab?.subTabs.find(st => st.id === subTabId);
    const intf = subTab?.interfaces.find(i => i.id === intfId);

    if (!intf) return goBack();

    appTitle.innerText = intf.name;
    backBtn.classList.remove('hidden');

    if (intf.type === 'text') {
        const textarea = document.createElement('textarea');
        textarea.className = 'editor-area';
        textarea.value = intf.content || '';
        textarea.placeholder = "येथे तुमचे विचार आणि योजना लिहा...";
        let timeout = null;
        textarea.oninput = (e) => {
            intf.content = e.target.value;
            // auto save debounce
            clearTimeout(timeout);
            timeout = setTimeout(() => saveData(), 500);
        };
        appContent.appendChild(textarea);
    } else if (intf.type === 'todo') {
        renderTodoList(intf);
    }
}

function renderTodoList(intf) {
    if (!Array.isArray(intf.content)) intf.content = [];

    const inputGroup = document.createElement('div');
    inputGroup.className = 'todo-input-group';
    inputGroup.innerHTML = `
        <input type="text" id="new-todo-input" placeholder="नवीन काम जोडा...">
        <button class="btn primary-btn" id="add-todo-btn">जोडा</button>
    `;

    const container = document.createElement('div');
    container.className = 'todo-container';
    container.id = 'todo-list-container';

    appContent.appendChild(inputGroup);
    appContent.appendChild(container);

    const inputEl = document.getElementById('new-todo-input');
    const addBtn = document.getElementById('add-todo-btn');

    const addTask = () => {
        const text = inputEl.value.trim();
        if (text) {
            intf.content.push({ id: generateId(), text, done: false });
            saveData();
            refreshTodoList(intf);
            inputEl.value = '';
        }
    };

    addBtn.onclick = addTask;
    inputEl.onkeypress = (e) => { if (e.key === 'Enter') addTask(); };

    refreshTodoList(intf);
}

function refreshTodoList(intf) {
    const container = document.getElementById('todo-list-container');
    if (!container) return;
    container.innerHTML = '';

    if (intf.content.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:var(--text-muted); margin-top: 20px;">कोणतेही काम नाही. वरून नवीन काम जोडा.</p>';
        return;
    }

    intf.content.forEach((task, index) => {
        const item = document.createElement('div');
        item.className = `todo-item ${task.done ? 'done' : ''}`;
        item.innerHTML = `
            <div class="todo-check ${task.done ? 'done' : ''}" onclick="toggleTodo('${intf.id}', ${index})">
                <i class="fas fa-check"></i>
            </div>
            <span onclick="toggleTodo('${intf.id}', ${index})">${task.text}</span>
            <button class="icon-btn text-danger" onclick="deleteTodo('${intf.id}', ${index})"><i class="fas fa-times"></i></button>
        `;
        container.appendChild(item);
    });
}

// Global actions for Todo
window.toggleTodo = (intfId, index) => {
    const intf = getCurrentInterface(intfId);
    intf.content[index].done = !intf.content[index].done;
    saveData();
    refreshTodoList(intf);
}
window.deleteTodo = (intfId, index) => {
    if (confirm('खरेच हे काम डिलीट करायचे आहे का?')) {
        const intf = getCurrentInterface(intfId);
        intf.content.splice(index, 1);
        saveData();
        refreshTodoList(intf);
    }
}
function getCurrentInterface(intfId) {
    const tabId = currentPath[0];
    const subTabId = currentPath[1];
    return appData.tabs.find(t => t.id === tabId).subTabs.find(st => st.id === subTabId).interfaces.find(i => i.id === intfId);
}

// UI Helpers
function addFAB(onClickAction) {
    const fab = document.createElement('button');
    fab.className = 'fab';
    fab.innerHTML = '<i class="fas fa-plus"></i>';
    fab.onclick = onClickAction;
    appContent.appendChild(fab);
}

function openModal(title, showIconPicker, callback, defaultName = '', defaultIcon = '') {
    modalTitle.innerText = title;
    modalInput.value = defaultName;
    iconPicker.classList.toggle('hidden', !showIconPicker);

    if (showIconPicker && defaultIcon) {
        selectedIcon = defaultIcon;
        iconElements.forEach(i => {
            if (i.getAttribute('data-icon') === defaultIcon) i.classList.add('selected');
            else i.classList.remove('selected');
        });
    } else {
        selectedIcon = 'fas fa-briefcase';
        iconElements.forEach((i, idx) => {
            if (idx === 0) i.classList.add('selected');
            else i.classList.remove('selected');
        });
    }

    modalCallback = callback;
    modalOverlay.classList.remove('hidden');
    setTimeout(() => modalInput.focus(), 100);
}

// Edit & Delete Overrides
window.editMasterTab = (id, oldName, oldIcon) => {
    openModal('नाव बदला (Master Tab)', true, (newName, newIcon) => {
        const tab = appData.tabs.find(t => t.id === id);
        tab.name = newName;
        tab.icon = newIcon;
        saveData(); render();
    }, oldName, oldIcon);
}
window.deleteMasterTab = (id, name) => {
    if (confirm(`खरेच '${name}' डिलीट करायचे आहे का? मधील सर्व माहिती नष्ट होईल.`)) {
        appData.tabs = appData.tabs.filter(t => t.id !== id);
        saveData(); render();
    }
}

window.editSubTab = (id, oldName, oldIcon) => {
    openModal('नाव बदला (Sub Tab)', true, (newName, newIcon) => {
        const tab = appData.tabs.find(t => t.id === currentPath[0]);
        const subTab = tab.subTabs.find(st => st.id === id);
        subTab.name = newName;
        subTab.icon = newIcon;
        saveData(); render();
    }, oldName, oldIcon);
}
window.deleteSubTab = (id, name) => {
    if (confirm(`खरेच '${name}' डिलीट करायचे आहे का?`)) {
        const tab = appData.tabs.find(t => t.id === currentPath[0]);
        tab.subTabs = tab.subTabs.filter(st => st.id !== id);
        saveData(); render();
    }
}

window.editInterface = (id, oldName) => {
    openModal('नाव बदला (Interface)', false, (newName) => {
        const tab = appData.tabs.find(t => t.id === currentPath[0]);
        const subTab = tab.subTabs.find(st => st.id === currentPath[1]);
        const intf = subTab.interfaces.find(i => i.id === id);
        intf.name = newName;
        saveData(); render();
    }, oldName);
}
window.deleteInterface = (id, name) => {
    if (confirm(`खरेच '${name}' डिलीट करायचे आहे का?`)) {
        const tab = appData.tabs.find(t => t.id === currentPath[0]);
        const subTab = tab.subTabs.find(st => st.id === currentPath[1]);
        subTab.interfaces = subTab.interfaces.filter(i => i.id !== id);
        saveData(); render();
    }
}

// Initial render wrapper
window.onload = render;
