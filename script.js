let appState = {
    user: JSON.parse(localStorage.getItem('siadit_user')) || null,
    transactions: JSON.parse(localStorage.getItem('siadit_tx')) || [],
    sidebarCollapsed: false,
    tempTxType: 'in'
};

function toggleAuth(isReg) {
    document.getElementById('login-container').classList.toggle('hidden', isReg);
    document.getElementById('register-container').classList.toggle('hidden', !isReg);
}

function toggleSidebar() {
    appState.sidebarCollapsed = !appState.sidebarCollapsed;
    document.body.classList.toggle('sidebar-hidden', appState.sidebarCollapsed);
}

function doAuth(e, type) {
    e.preventDefault();
    if(type === 'register') {
        appState.user = {
            bizName: document.getElementById('reg-biz').value,
            owner: document.getElementById('reg-owner').value,
            email: document.getElementById('reg-email').value,
            bizType: document.getElementById('reg-type').value,
            phone: document.getElementById('reg-phone').value,
            address: document.getElementById('reg-address').value,
            founded: document.getElementById('reg-date').value
        };
    } else {
        appState.user = {
            bizName: "Toko Contoh Utama",
            owner: "Ahmad Bisnis",
            bizType: "Retail",
            email: document.getElementById('auth-email').value
        };
    }
    localStorage.setItem('siadit_user', JSON.stringify(appState.user));
    initApp();
}

function logout() {
    localStorage.removeItem('siadit_user');
    location.reload();
}

function showPage(pageId) {
    document.querySelectorAll('.page-content').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
    document.getElementById('page-' + pageId).classList.remove('hidden');
    const navItem = document.getElementById('nav-' + pageId);
    if(navItem) navItem.classList.add('active');
    window.scrollTo(0,0);
    if(pageId === 'dash') renderChart();
    if(pageId === 'cash') renderTable();
}

function openTxModal(type) {
    appState.tempTxType = type;
    document.getElementById('modal-title').innerText = type === 'in' ? 'Tambah Pemasukan' : 'Tambah Pengeluaran';
    document.getElementById('modal-tx').classList.remove('hidden');
}

function closeTxModal() { document.getElementById('modal-tx').classList.add('hidden'); }

function saveTransaction(e) {
    e.preventDefault();
    const tx = {
        id: Date.now(),
        date: new Date().toLocaleDateString('id-ID'),
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        desc: document.getElementById('tx-desc').value,
        in: appState.tempTxType === 'in' ? parseInt(document.getElementById('tx-amt').value) : 0,
        out: appState.tempTxType === 'out' ? parseInt(document.getElementById('tx-amt').value) : 0
    };
    appState.transactions.unshift(tx);
    localStorage.setItem('siadit_tx', JSON.stringify(appState.transactions));
    updateStats();
    closeTxModal();
}

function updateStats() {
    const saldo = appState.transactions.reduce((acc, curr) => acc + (curr.in - curr.out), 0);
    document.getElementById('stat-saldo').innerText = 'Rp ' + saldo.toLocaleString('id-ID');
}

function renderTable() {
    const container = document.getElementById('tx-history-body');
    document.getElementById('no-tx-hint').classList.toggle('hidden', appState.transactions.length > 0);
    container.innerHTML = appState.transactions.map(t => `
        <tr class="border-b-2 border-slate-100">
            <td class="p-5 text-[#1C0770] font-black">${t.date}</td>
            <td class="p-5 text-[#1C0770] font-black">${t.desc}</td>
            <td class="p-5 text-right text-green-600 font-black">+ ${t.in.toLocaleString()}</td>
            <td class="p-5 text-right text-red-600 font-black">- ${t.out.toLocaleString()}</td>
            <td class="p-5 text-center"><span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs border border-green-800">OK</span></td>
        </tr>
    `).join('');
}

function renderChart() {
    const ctx = document.getElementById('dash-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
            datasets: [{
                label: 'Cash In',
                data: [12, 19, 3, 5, 2, 3, 9],
                borderColor: '#1C0770',
                borderWidth: 4,
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function goToCheckout() {
    document.getElementById('premium-pricing').classList.add('hidden');
    document.getElementById('premium-checkout').classList.remove('hidden');
}
function goToVerify() {
    document.getElementById('premium-checkout').classList.add('hidden');
    document.getElementById('premium-verify').classList.remove('hidden');
}
function startScanning() {
    const scanLine = document.getElementById('scan-animation');
    scanLine.classList.remove('hidden');
    setTimeout(() => {
        scanLine.classList.add('hidden');
        document.getElementById('verify-icon').innerText = "✅";
        alert("Verifikasi Berhasil! Selamat Datang di SiAdit Pro.");
        showPage('dash');
    }, 3000);
}

function initApp() {
    if(appState.user) {
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        document.getElementById('display-owner-name').innerText = appState.user.owner;
        document.getElementById('display-biz-name').innerText = appState.user.bizName;
        document.getElementById('display-biz-type').innerText = appState.user.bizType || "Retail";
        updateStats();
        showPage('dash');
    }
}

window.onload = initApp;
