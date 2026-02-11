// ============================================
// FINTRACK — Income & Expense Calculator
// Full CRUD + Local Storage + Animations
// ============================================

// ============ STATE ============
let entries = [];
let editingId = null;
let currentFilter = 'all';
let clearConfirmPending = false;
let clearConfirmTimer = null;

// ============ DOM REFERENCES ============
const entryForm = document.getElementById('entryForm');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeIncomeRadio = document.getElementById('typeIncome');
const typeExpenseRadio = document.getElementById('typeExpense');
const submitBtn = document.getElementById('submitBtn');
const submitBtnText = document.getElementById('submitBtnText');
const resetBtn = document.getElementById('resetBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const formTitle = document.getElementById('formTitle');
const entriesList = document.getElementById('entriesList');
const emptyState = document.getElementById('emptyState');
const netBalanceEl = document.getElementById('netBalance');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpensesEl = document.getElementById('totalExpenses');
const incomeBar = document.getElementById('incomeBar');
const expenseBar = document.getElementById('expenseBar');
const entryCount = document.getElementById('entryCount');
const filterRadios = document.querySelectorAll('input[name="filter"]');
const toastContainer = document.getElementById('toastContainer');
const clearAllBtn = document.getElementById('clearAllBtn');

// ============ LOCAL STORAGE ============

/**
 * Saves entries array to browser's localStorage
 */
function saveToLocalStorage() {
  localStorage.setItem('fintrackEntries', JSON.stringify(entries));
}

/**
 * Loads entries from browser's localStorage
 * @returns {Array} Array of saved entry objects
 */
function loadFromLocalStorage() {
  const data = localStorage.getItem('fintrackEntries');
  return data ? JSON.parse(data) : [];
}

// ============ HELPERS ============

/**
 * Generates a unique ID string
 * @returns {string} Unique identifier
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
}

/**
 * Formats number as Indian Rupee currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted string like "₹1,234.00"
 */
function formatCurrency(amount) {
  return '₹' + Math.abs(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Formats timestamp to readable date
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted date string
 */
function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Validates description — must contain at least one letter
 * Blocks pure number inputs
 * @param {string} text - The description text to validate
 * @returns {boolean} True if valid, false if invalid
 */
function isValidDescription(text) {
  const hasLetters = /[a-zA-Z]/.test(text);
  const isOnlyNumbers = /^[0-9\s.,-]+$/.test(text);
  return hasLetters && !isOnlyNumbers;
}

// ============ UPDATE BALANCE OVERVIEW ============

/**
 * Recalculates and updates all balance displays and progress bar
 */
function updateBalanceOverview() {
  const totalIncome = entries
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpense = entries
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const net = totalIncome - totalExpense;
  const total = totalIncome + totalExpense;

  // Update text
  totalIncomeEl.textContent = '+ ' + formatCurrency(totalIncome);
  totalExpensesEl.textContent = '- ' + formatCurrency(totalExpense);

  // Net balance with color
  if (net >= 0) {
    netBalanceEl.textContent = formatCurrency(net);
    netBalanceEl.className = 'balance-main-amount' + (net > 0 ? ' positive' : '');
  } else {
    netBalanceEl.textContent = '- ' + formatCurrency(net);
    netBalanceEl.className = 'balance-main-amount negative';
  }

  // Progress bar
  if (total > 0) {
    const incomePct = (totalIncome / total) * 100;
    const expensePct = (totalExpense / total) * 100;
    incomeBar.style.width = incomePct + '%';
    expenseBar.style.width = expensePct + '%';
  } else {
    incomeBar.style.width = '50%';
    expenseBar.style.width = '50%';
  }

  // Pop animation on numbers
  [netBalanceEl, totalIncomeEl, totalExpensesEl].forEach(el => {
    el.classList.remove('pop');
    void el.offsetWidth;
    el.classList.add('pop');
  });
}

// ============ RENDER ENTRIES (READ) ============

/**
 * Renders filtered entry list to the DOM
 */
function renderEntries() {
  const filtered = currentFilter === 'all'
    ? entries
    : entries.filter(e => e.type === currentFilter);

  entriesList.innerHTML = '';

  // Update count badge
  entryCount.textContent = filtered.length;

  // Show/hide empty state
  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
  }

  // Build each entry element
  filtered.forEach((entry, index) => {
    const el = document.createElement('div');
    el.classList.add('entry-item', entry.type === 'income' ? 'income-entry' : 'expense-entry');
    el.dataset.id = entry.id;
        el.style.animationDelay = `${index * 0.04}s`;

    el.innerHTML = `
      <div class="entry-dot"></div>
      <div class="entry-info">
        <div class="entry-desc" title="${entry.description}">${entry.description}</div>
        <div class="entry-meta">${formatDate(entry.createdAt)}</div>
      </div>
      <div class="entry-amount">
        ${entry.type === 'income' ? '+' : '-'} ${formatCurrency(entry.amount)}
      </div>
      <div class="entry-actions">
        <button class="act-btn act-btn-edit" title="Edit" onclick="editEntry('${entry.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button class="act-btn act-btn-delete" title="Delete" onclick="deleteEntry('${entry.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
        </button>
      </div>
    `;

    entriesList.appendChild(el);
  });
}

// ============ CREATE — ADD NEW ENTRY ============

/**
 * Creates a new entry and adds it to the list
 * @param {string} type - 'income' or 'expense'
 * @param {string} description - Entry description text
 * @param {number} amount - Entry amount value
 */
function addEntry(type, description, amount) {
  const newEntry = {
    id: generateId(),
    type: type,
    description: description.trim(),
    amount: parseFloat(amount),
    createdAt: Date.now()
  };

  entries.unshift(newEntry);
  saveToLocalStorage();
  updateBalanceOverview();
  renderEntries();
  showToast('✅', `${type === 'income' ? 'Income' : 'Expense'} added!`, 'toast-success');
}

// ============ UPDATE — EDIT EXISTING ENTRY ============

/**
 * Fills the form with existing entry data for editing
 * @param {string} id - ID of the entry to edit
 */
function editEntry(id) {
  const entry = entries.find(e => e.id === id);
  if (!entry) return;

  // Set editing state
  editingId = id;

  // Fill form with entry data
  descriptionInput.value = entry.description;
  amountInput.value = entry.amount;

  if (entry.type === 'income') {
    typeIncomeRadio.checked = true;
  } else {
    typeExpenseRadio.checked = true;
  }

  // Switch UI to edit mode
  formTitle.textContent = 'Edit Transaction';
  submitBtnText.textContent = 'Update';
  submitBtn.classList.add('edit-mode');
  cancelEditBtn.style.display = 'flex';

  // Scroll to form smoothly
  document.querySelector('.form-card').scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });

  // Focus description input after scroll
  setTimeout(() => descriptionInput.focus(), 400);
}

/**
 * Updates an existing entry with new values
 * @param {string} id - ID of entry to update
 * @param {string} type - Updated type ('income' or 'expense')
 * @param {string} description - Updated description
 * @param {number} amount - Updated amount
 */
function updateEntry(id, type, description, amount) {
  const index = entries.findIndex(e => e.id === id);
  if (index === -1) return;

  entries[index] = {
    ...entries[index],
    type: type,
    description: description.trim(),
    amount: parseFloat(amount),
    updatedAt: Date.now()
  };

  saveToLocalStorage();
  updateBalanceOverview();
  renderEntries();
  showToast('📝', 'Transaction updated!', 'toast-edit');
}

// ============ DELETE — REMOVE ENTRY ============

/**
 * Deletes an entry by ID with slide-out animation
 * @param {string} id - ID of entry to delete
 */
function deleteEntry(id) {
  const entryEl = document.querySelector(`.entry-item[data-id="${id}"]`);

  if (entryEl) {
    // Add removing animation
    entryEl.classList.add('removing');

    // Wait for animation, then remove from data
    setTimeout(() => {
      entries = entries.filter(e => e.id !== id);
      saveToLocalStorage();
      updateBalanceOverview();
      renderEntries();
      showToast('🗑️', 'Transaction deleted!', 'toast-delete');
    }, 350);
  } else {
    // Fallback: just remove directly
    entries = entries.filter(e => e.id !== id);
    saveToLocalStorage();
    updateBalanceOverview();
    renderEntries();
    showToast('🗑️', 'Transaction deleted!', 'toast-delete');
  }

  // If editing this entry, cancel edit mode
  if (editingId === id) {
    cancelEdit();
  }
}

// ============ RESET FORM ============

/**
 * Clears all input fields and resets form to default "Add" state
 */
function resetForm() {
  entryForm.reset();
  typeIncomeRadio.checked = true;
  descriptionInput.value = '';
  amountInput.value = '';
  cancelEdit();
}

// ============ CANCEL EDIT MODE ============

/**
 * Exits edit mode and returns form to "Add" state
 */
function cancelEdit() {
  editingId = null;
  formTitle.textContent = 'New Transaction';
  submitBtnText.textContent = 'Add Transaction';
  submitBtn.classList.remove('edit-mode');
  cancelEditBtn.style.display = 'none';
}

// ============ TOAST NOTIFICATIONS ============

/**
 * Shows a temporary toast notification
 * @param {string} icon - Emoji icon for the toast
 * @param {string} message - Notification message
 * @param {string} type - CSS class for toast style
 */
function showToast(icon, message, type) {
  const toast = document.createElement('div');
  toast.classList.add('toast', type);
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============ CLEAR ALL BUTTON ============

/**
 * Resets the Clear All button back to its default state
 */
function resetClearButton() {
  clearConfirmPending = false;
  clearAllBtn.classList.remove('confirm');
  clearAllBtn.innerHTML = `
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
    <span>Clear All</span>
  `;
}

/**
 * Handles Clear All button click with double-click confirmation
 * First click: Shows warning "Click again to confirm"
 * Second click: Actually deletes everything
 */
clearAllBtn.addEventListener('click', function () {
  // If no entries exist, show message
  if (entries.length === 0) {
    showToast('📭', 'No transactions to clear!', 'toast-info');
    return;
  }

  // First click — ask for confirmation
  if (!clearConfirmPending) {
    clearConfirmPending = true;
    clearAllBtn.classList.add('confirm');
    clearAllBtn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      </svg>
      <span>Confirm?</span>
    `;
    showToast('⚠️', 'Click again to delete all transactions!', 'toast-delete');

    // Reset back to normal after 3 seconds if not confirmed
    clearConfirmTimer = setTimeout(() => {
      resetClearButton();
    }, 3000);

    return;
  }

  // Second click — actually clear everything
  clearTimeout(clearConfirmTimer);

  entries = [];
  saveToLocalStorage();
  updateBalanceOverview();
  renderEntries();
  cancelEdit();
  resetForm();
  resetClearButton();

  showToast('🗑️', 'All transactions cleared!', 'toast-delete');
});

// ============ EVENT LISTENERS ============

/**
 * Block number keys in description field
 * Allows: letters, spaces, backspace, arrows, delete, tab
 * Blocks: number keys (0-9)
 */
descriptionInput.addEventListener('keydown', function (e) {
  // Allow control keys
  const allowedKeys = [
    'Backspace', 'Delete', 'Tab', 'Escape',
    'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
    'Home', 'End'
  ];

  if (allowedKeys.includes(e.key)) {
    return;
  }

  // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
  if (e.ctrlKey || e.metaKey) {
    return;
  }

  // Block number keys (both main keyboard and numpad)
  if (/^[0-9]$/.test(e.key)) {
    e.preventDefault();
    showToast('⚠️', 'Numbers not allowed in description!', 'toast-info');
  }
});

/**
 * Block pasting numbers into description field
 */
descriptionInput.addEventListener('paste', function (e) {
  setTimeout(() => {
    const value = descriptionInput.value;
    const cleaned = value.replace(/[0-9]/g, '');

    if (cleaned !== value) {
      descriptionInput.value = cleaned;
      showToast('⚠️', 'Numbers removed from description!', 'toast-info');
    }
  }, 10);
});

/**
 * Form submit — handles both Add and Update operations
 */
entryForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // Get form values
  const type = document.querySelector('input[name="entryType"]:checked').value;
  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);

  // Validation — Empty description
  if (!description) {
    descriptionInput.focus();
    showToast('⚠️', 'Please enter a description', 'toast-info');
    return;
  }

  // Validation — Description must contain letters
  if (!isValidDescription(description)) {
    descriptionInput.focus();
    descriptionInput.value = '';
    showToast('⚠️', 'Description must contain letters, not just numbers!', 'toast-info');
    return;
  }

  // Validation — Valid amount
  if (isNaN(amount) || amount <= 0) {
    amountInput.focus();
    showToast('⚠️', 'Please enter a valid amount', 'toast-info');
    return;
  }

  // Check if editing or adding
  if (editingId) {
    updateEntry(editingId, type, description, amount);
    cancelEdit();
  } else {
    addEntry(type, description, amount);
  }

  // Clear form after submit
  entryForm.reset();
  typeIncomeRadio.checked = true;
  descriptionInput.focus();
});

/**
 * Reset button — clears all form fields
 */
resetBtn.addEventListener('click', function () {
  resetForm();
  showToast('🔄', 'Form cleared!', 'toast-info');
});

/**
 * Cancel edit button — exits edit mode
 */
cancelEditBtn.addEventListener('click', function () {
  resetForm();
  showToast('❌', 'Edit cancelled', 'toast-info');
});

/**
 * Filter radio buttons — filters the transaction list
 */
filterRadios.forEach(radio => {
  radio.addEventListener('change', function () {
    currentFilter = this.value;
    renderEntries();
  });
});

// ============ INITIALIZE APP ============

/**
 * Loads saved data and renders the app on page load
 */
function init() {
  // Load entries from local storage
  entries = loadFromLocalStorage();

  // Render everything
  updateBalanceOverview();
  renderEntries();
}

// Start the app!
init();