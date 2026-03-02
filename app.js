// Initial Default State
const DEFAULT_DATA = {
    tabs: [
        { id: 't1', name: 'माझे व्यवसाय', icon: 'fas fa-briefcase', subTabs: [] },
        { id: 't2', name: 'नोकरी', icon: 'fas fa-laptop', subTabs: [] },
        { id: 't3', name: 'व्यायाम', icon: 'fas fa-dumbbell', subTabs: [] },
        { id: 't4', name: 'ध्यान धारणा', icon: 'fas fa-om', subTabs: [] },
        { id: 't5', name: 'माझी मनोवृत्ती', icon: 'fas fa-brain', subTabs: [] },
        { id: 't6', name: 'माझी बचत', icon: 'fas fa-piggy-bank', subTabs: [] },
        { id: 't7', name: 'माझे कुटुंब', icon: 'fas fa-house', subTabs: [] }
    ]
};

// State Variables
let appData = JSON.parse(localStorage.getItem('milindCorpData')) || DEFAULT_DATA;
let currentPath = [];

// DOM Elements
const appTitle = document.getElementById('app-title');
const appSubtitle = document.getElementById('app-subtitle');
const appContent = document.getElementById('app-content');
const backBtn = document.getElementById('back-btn');
const homeBtn = document.getElementById('home-btn');

// Modal Elements
const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalInput = document.getElementById('modal-input');
const iconPicker = document.getElementById('icon-picker');
const modalCloseIcon = document.getElementById('modal-close-icon');
const modalSave = document.getElementById('modal-save');
const iconElements = document.querySelectorAll('.icon-box');

let modalCallback = null;
let selectedIcon = 'fas fa-briefcase';

// Utility
const saveData = () => localStorage.setItem('milindCorpData', JSON.stringify(appData));
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

// Event Listeners
homeBtn.addEventListener('click', goHome);
backBtn.addEventListener('click', goBack);

modalCloseIcon.addEventListener('click', () => {
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
        modalInput.focus();
    }
});

iconElements.forEach(icon => {
    icon.addEventListener('click', (e) => {
        iconElements.forEach(i => i.classList.remove('selected'));
        const el = e.target.closest('.icon-box');
        el.classList.add('selected');
        selectedIcon = el.getAttribute('data-icon');
    });
});

function goHome() { currentPath = []; render(); }
function goBack() { if (currentPath.length > 0) { currentPath.pop(); render(); } }

window.addEventListener('popstate', (e) => {
    if (currentPath.length === 0) {
        if (!confirm('तुम्हाला खात्री आहे की तुम्ही बाहेर पडू इच्छिता?')) {
            history.pushState(null, null, window.location.href);
        } else {
            window.history.back();
        }
    } else { goBack(); }
});

function render() {
    history.pushState(null, null, window.location.href);
    appContent.innerHTML = '';
    window.scrollTo(0, 0);

    if (currentPath.length === 0) renderMasterTabs();
    else if (currentPath.length === 1) renderSubTabs();
    else if (currentPath.length === 2) renderInterfaces();
    else if (currentPath.length === 3) renderInterfaceDetail();
}

function renderMasterTabs() {
    appTitle.innerText = "MilindCorp";
    appSubtitle.innerText = "तुमचा अतिसुंदर लाइफ डॅशबोर्ड";
    backBtn.classList.add('hidden');

    const grid = document.createElement('div');
    grid.className = 'grid-container';

    appData.tabs.forEach(tab => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="action-group">
                <button class="action-btn edit" onclick="event.stopPropagation(); editMasterTab('${tab.id}', '${tab.name}', '${tab.icon}')"><i class="fas fa-pen"></i></button>
                <button class="action-btn delete" onclick="event.stopPropagation(); deleteMasterTab('${tab.id}', '${tab.name}')"><i class="fas fa-trash"></i></button>
            </div>
            <div class="icon-wrapper"><i class="${tab.icon || 'fas fa-folder'} main-icon"></i></div>
            <h3>${tab.name}</h3>
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

function renderSubTabs() {
    const tabId = currentPath[0];
    const tab = appData.tabs.find(t => t.id === tabId);
    if (!tab) return goHome();

    appTitle.innerText = tab.name;
    appSubtitle.innerText = "काय काम करायचे आहे?";
    backBtn.classList.remove('hidden');

    if (!tab.subTabs) tab.subTabs = [];

    const grid = document.createElement('div');
    grid.className = 'grid-container';

    if (tab.subTabs.length === 0) {
        appContent.innerHTML = '<div style="text-align:center; margin-top: 40px;"><img src="https://cdni.iconscout.com/illustration/premium/thumb/folder-is-empty-illustration-download-in-svg-png-gif-file-formats--no-data-record-file-miscellaneous-pack-illustrations-3312480.png" width="200" style="opacity:0.6"/><p style="color:var(--text-muted); font-size:1.1rem; margin-top:15px; font-weight:500;">येथे काहीही नाही. <br>खालील <b>+</b> बटण दाबून सुरुवात करा.</p></div>';
    }

    tab.subTabs.forEach(sub => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="action-group">
                <button class="action-btn edit" onclick="event.stopPropagation(); editSubTab('${sub.id}', '${sub.name}', '${sub.icon}')"><i class="fas fa-pen"></i></button>
                <button class="action-btn delete" onclick="event.stopPropagation(); deleteSubTab('${sub.id}', '${sub.name}')"><i class="fas fa-trash"></i></button>
            </div>
            <div class="icon-wrapper"><i class="${sub.icon || 'fas fa-file'} main-icon"></i></div>
            <h3>${sub.name}</h3>
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

function renderInterfaces() {
    const tabId = currentPath[0];
    const subTabId = currentPath[1];
    const tab = appData.tabs.find(t => t.id === tabId);
    const subTab = tab?.subTabs.find(st => st.id === subTabId);

    if (!subTab) return goBack();

    appTitle.innerText = subTab.name;
    appSubtitle.innerText = "नियोजन आणि कार्य";
    backBtn.classList.remove('hidden');

    if (!subTab.interfaces) subTab.interfaces = [];

    const list = document.createElement('div');
    subTab.interfaces.forEach(intf => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div>
                <i class="${intf.type === 'todo' ? 'fas fa-list-check' : 'fas fa-align-left'} item-icon"></i>
                <h3>${intf.name}</h3>
            </div>
            <div class="list-actions">
                <button class="action-btn edit" onclick="event.stopPropagation(); editInterface('${intf.id}', '${intf.name}')"><i class="fas fa-pen"></i></button>
                <button class="action-btn delete" onclick="event.stopPropagation(); deleteInterface('${intf.id}', '${intf.name}')"><i class="fas fa-trash"></i></button>
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

function renderInterfaceDetail() {
    const tabId = currentPath[0];
    const subTabId = currentPath[1];
    const intfId = currentPath[2];

    const tab = appData.tabs.find(t => t.id === tabId);
    const subTab = tab?.subTabs.find(st => st.id === subTabId);
    const intf = subTab?.interfaces.find(i => i.id === intfId);

    if (!intf) return goBack();

    appTitle.innerText = intf.name;
    appSubtitle.innerText = intf.type === 'text' ? 'तुमचे विचार लिहा' : 'महत्वाची कामे';
    backBtn.classList.remove('hidden');

    if (intf.type === 'text') {
        const textarea = document.createElement('textarea');
        textarea.className = 'editor-area';
        textarea.value = intf.content || '';
        textarea.placeholder = "येथे तुमचे विचार आणि योजना सविस्तर लिहा...";
        let timeout = null;
        textarea.oninput = (e) => {
            intf.content = e.target.value;
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
        <button class="todo-add-btn" id="add-todo-btn"><i class="fas fa-plus"></i></button>
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
        container.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding:30px; font-weight:500;">सध्या कोणतेही काम नाही. वरून नवीन काम जोडा.</p>';
        return;
    }

    intf.content.forEach((task, index) => {
        const item = document.createElement('div');
        item.className = `todo-item ${task.done ? 'done' : ''}`;
        item.innerHTML = `
            <div class="todo-check ${task.done ? 'done' : ''}" onclick="toggleTodo('${intf.id}', ${index})">
                <i class="fas fa-check" style="${task.done ? 'font-size:0.9rem;' : 'display:none;'}"></i>
            </div>
            <span onclick="toggleTodo('${intf.id}', ${index})">${task.text}</span>
            <button class="action-btn delete" onclick="deleteTodo('${intf.id}', ${index})"><i class="fas fa-xmark"></i></button>
        `;
        container.appendChild(item);
    });
}

window.toggleTodo = (intfId, index) => {
    const intf = getCurrentInterface(intfId);
    intf.content[index].done = !intf.content[index].done;
    saveData(); refreshTodoList(intf);
}
window.deleteTodo = (intfId, index) => {
    if (confirm('हे काम डिलीट करायचे आहे का?')) {
        const intf = getCurrentInterface(intfId);
        intf.content.splice(index, 1);
        saveData(); refreshTodoList(intf);
    }
}
function getCurrentInterface(intfId) {
    const tabId = currentPath[0];
    const subTabId = currentPath[1];
    return appData.tabs.find(t => t.id === tabId).subTabs.find(st => st.id === subTabId).interfaces.find(i => i.id === intfId);
}

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
    }

    modalCallback = callback;
    modalOverlay.classList.remove('hidden');
    setTimeout(() => modalInput.focus(), 100);
}

window.editMasterTab = (id, oldName, oldIcon) => {
    openModal('नाव बदला (Master Tab)', true, (newName, newIcon) => {
        const tab = appData.tabs.find(t => t.id === id);
        tab.name = newName; tab.icon = newIcon;
        saveData(); render();
    }, oldName, oldIcon);
}
window.deleteMasterTab = (id, name) => {
    if (confirm(`खरेच '${name}' डिलीट करायचे आहे का? सर्व माहिती नष्ट होईल.`)) {
        appData.tabs = appData.tabs.filter(t => t.id !== id);
        saveData(); render();
    }
}

window.editSubTab = (id, oldName, oldIcon) => {
    openModal('नाव बदला (Sub Tab)', true, (newName, newIcon) => {
        const tab = appData.tabs.find(t => t.id === currentPath[0]);
        const subTab = tab.subTabs.find(st => st.id === id);
        subTab.name = newName; subTab.icon = newIcon;
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
        intf.name = newName; saveData(); render();
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

window.onload = render;
