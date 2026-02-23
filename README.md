# 💰 FinTrack — Income & Expense Calculator

A fully functional, beautifully designed **Income & Expense Calculator** built with pure **HTML**, **CSS** and **JavaScript**. Track your finances with full CRUD operations, smart filtering and persistent local storage.

---

## 🌐 Live Demo

🔗 **[View Live App](https://income-expense-calculators.netlify.app/)**

---

### 📊 Dashboard

- Glassmorphism dark themed UI
- Animated gradient mesh background
- Real-time balance overview with progress bar
- Smooth card hover effects with shine sweep

### ✏️ Transaction Form

- Neon radio toggle for Income/Expense selection
- Animated focus lines on input fields
- Edit mode with golden accent theme
- Toast notifications for every action

---

## 🎮 How to Use

| Step | Action |
| :--- | :--- |
| 1️⃣ | Select **Income** or **Expense** type |
| 2️⃣ | Enter a **description** (e.g., "Salary", "Groceries") |
| 3️⃣ | Enter the **amount** in ₹ |
| 4️⃣ | Click **Add Transaction** to save |
| 5️⃣ | Use **filter pills** to view All / Income only / Expense only |
| 6️⃣ | Hover on any entry → Click ✏️ to **edit** or 🗑️ to **delete** |
| 7️⃣ | Click **Reset** to clear the form |
| 8️⃣ | Data is **auto-saved** to your browser and come back anytime! |
| 9️⃣ | Click **Clear All** to permanently delete all history and reset the balance |

---

## ✨ Features

- 📊 **Financial Dashboard** — Net Balance, Total Income and Total Expenses at a glance.
- 📈 **Visual Progress Bar** — Income vs Expense ratio with shimmer animation.
- ➕ **Create** — Add new income or expense entries instantly.
- 📋 **Read** — View all transactions in a dynamic, filterable list.
- ✏️ **Update** — Edit any existing entry with pre-filled form and golden edit mode.
- 🗑️ **Delete** — Remove entries with smooth slide-out animation.
- 🔍 **Smart Filters** — Radio button pills to filter All, Income or Expense.
- 💾 **Local Storage** — Data persists across browser sessions automatically.
- 🔒 **Input Validation** — Description blocks numbers, amount requires valid positive values.
- 🔔 **Toast Notifications** — Instant feedback for every add, edit, delete and reset action.
- 📱 **Fully Responsive** — Optimized for Desktop, Tablet, and Mobile.
- 🌌 **Premium UI** — Glassmorphism cards, animated aurora background and cyber grid overlay.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) | Page structure and semantics |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) | Styling, animations and responsive design |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | CRUD logic, DOM manipulation and Local Storage |


---

## 📁 Project Structure

```text
Income-Expense-Calculator/
│
├── index.html     # Main HTML layout
├── style.css      # Glassmorphism styles & animations
├── script.js      # CRUD logic & state management
└── README.md      # Documentation

```

---
### ⚙️ Setup & Installation

1. Clone the repository:
    git clone https://github.com/dhanushs8681-del/Income-Expense-Calculator

2. Navigate into the folder:
    cd Income-Expense-Calculator

3. Open index.html in your browser:
- Double-click the file, OR
- Right-click → Open with → Chrome/Firefox, OR
- Use the Live Server extension in VS Code.
  
✅ No build tools or dependencies required!

---

### 🔄 CRUD Operations
| Operation | Action | Trigger |
| :--- | :--- | :--- |
| **Create** | Add new income/expense entry | Submit form |
| **Read** | Display all entries dynamically | Page load + filters |
| **Update** | Edit existing entry via form | Click ✏️ button |
| **Delete** | Remove entry with animation | Click 🗑️ button |

---

### 🔍 Filter System
| Filter | Radio Button | Shows |
| :--- | :--- | :--- |
| **All** | `filterAll` | Every transaction |
| **Income** | `filterIncome` | Only income entries |
| **Expense** | `filterExpense` | Only expense entries |

---

### 📱 Responsive Breakpoints
| Device | Screen Width | Layout | Status |
| :--- | :--- | :--- | :--- |
| 🖥️ **Desktop** | `> 640px` | 2-column balance grid | ✅ |
| 📱 **Tablet** | `≤ 640px` | Stacked layout | ✅ |
| 📱 **Mobile** | `≤ 420px` | Single column, full width | ✅ |

---

### 🚀 Deployment
This project is live and open-source:

| Platform | Link |
| :--- | :--- |
| 🌐 **Live Site** | [Netlify](https://income-expense-calculators.netlify.app/) |
| 💻 **Source Code** | [GitHub](https://github.com/dhanushs8681-del/Income-Expense-Calculator) |

---

### 🎨 Color Palette
| Color | Hex | Usage |
| :--- | :--- | :--- |
| 🔵 **Primary** | `#4a7cdb` | Buttons, borders, focus states |
| 🟣 **Accent** | `#7c5cbf` | Gradients, submit button |
| 🟢 **Income** | `#2eae6d` | Income entries, progress bar |
| 🔴 **Expense** | `#c44d63` | Expense entries, delete actions |
| 🟡 **Gold** | `#b8922e` | Edit mode, edit button hover |
| ⬛ **Dark BG** | `#0b1120` | Main background |
| 🟫 **Card BG** | `#0e162a` | Card and input backgrounds |

---

### 💾 Data Persistence
> All data is stored in the browser's Local Storage and no backend required.

*   **Auto Save**: Every add, edit, and delete saves instantly.
*   **Page Refresh**: Data survives refresh and nothing is lost.
*   **Browser Close**: Data persists even after closing the browser.
*   **Cross Session**: Come back days later and your data is still there.

---

### 🔒 Input Validation
The description field is protected with **3 layers of validation**:

*   **Keydown Blocking**: Number keys (0-9) are blocked in real-time while typing.
*   **Paste Protection**: Any numbers in pasted text are automatically removed.
*   **Submit Validation**: Final check ensures description contains letters, not just numbers.
*   **Amount Validation**: Requires a valid positive number greater than zero.

---

### 📝 Key JavaScript Functions
> The core logic of the app is handled by these primary functions:

*   **`addEntry()`**: Creates a new income or expense transaction and saves to storage.
*   **`editEntry()`**: Populates the form with existing entry data for editing.
*   **`updateEntry()`**: Saves the edited transaction and re-renders the list.
*   **`deleteEntry()`**: Removes an entry with slide-out animation and updates totals.
*   **`renderEntries()`**: Dynamically builds the filtered transaction list in the DOM.
*   **`updateBalanceOverview()`**: Recalculates net balance, totals, and progress bar.
*   **`saveToLocalStorage()`**: Persists all entries to the browser's local storage.
*   **`loadFromLocalStorage()`**: Retrieves saved data on every page load.
*   **`isValidDescription()`**: Validates that description contains letters, not just numbers.
*   **`resetForm()`**: Clears all input fields and exits edit mode.
*   **`showToast()`**: Displays animated notification popups for user feedback.

---

### 📄 License
This project is open-source and available under the **MIT License**.

