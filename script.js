// Data Storage
let transactions = [];
let customers = [];
let orders = [];

// DOM Elements
const customerForm = document.getElementById('customerForm');
const orderForm = document.getElementById('orderForm');
const transactionForm = document.getElementById('transactionForm');
const transactionTable = document.getElementById('transactionTable').getElementsByTagName('tbody')[0];
const totalBalance = document.getElementById('totalBalance');
const unpaidOrders = document.getElementById('unpaidOrders');
const totalTransactions = document.getElementById('totalTransactions');
const searchInput = document.getElementById('searchInput');
const totalDeposits = document.getElementById('totalDeposits');
const totalWithdrawals = document.getElementById('totalWithdrawals');
const totalTransfers = document.getElementById('totalTransfers');
const ctx = document.getElementById('transactionChart').getContext('2d');

// Save customers to localStorage
function saveCustomers() {
  localStorage.setItem('customers', JSON.stringify(customers));
}

// Load customers from localStorage
function loadCustomers() {
  const storedCustomers = localStorage.getItem('customers');
  if (storedCustomers) {
    customers = JSON.parse(storedCustomers);
  }
}

// Register Customer
customerForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('customerName').value;
  const contact = document.getElementById('customerContact').value;
  const email = document.getElementById('customerEmail').value;
  const address = document.getElementById('customerAddress').value;
  const balance = parseFloat(document.getElementById('initialBalance').value);

  const customer = { name, contact, email, address, balance };
  customers.push(customer);

  // Save to localStorage
  saveCustomers();

  // Reset the form
  customerForm.reset();

  // Notify the user
  alert('Customer registered successfully!');
});

// Add Order
orderForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const supplierName = document.getElementById('supplierName').value;
  const orderType = document.getElementById('orderType').value;
  const orderAmount = parseFloat(document.getElementById('orderAmount').value);
  const orderRate = parseFloat(document.getElementById('orderRate').value);
  const paidAmount = parseFloat(document.getElementById('paidAmount').value);
   // Customer Management System
   let customers = [];
   let backupCustomers = [];
   let selectedCustomer = null;

   // Form elements
   const formTitle = document.getElementById('formTitle');
   const registerButton = document.getElementById('registerButton');
   const updateButton = document.getElementById('updateCustomerButton');
   const cancelButton = document.getElementById('cancelEditButton');
   const message = document.getElementById('message');

   // Customer Search and Selection
   const searchInput = document.getElementById('searchInput');
   const searchResults = document.getElementById('searchResults');
   const customerBalanceSection = document.getElementById('customerBalanceSection');
   const customerNameDisplay = document.getElementById('customerNameDisplay');
   const customerBalanceDisplay = document.getElementById('customerBalanceDisplay');

   searchInput.addEventListener('input', function () {
     const query = this.value.toLowerCase();
     searchResults.innerHTML = '';

     if (query.length > 0) {
       const filteredCustomers = customers.filter(customer =>
         customer.name.toLowerCase().includes(query) || customer.contact.includes(query)
       );

       filteredCustomers.forEach(customer => {
         const div = document.createElement('div');
         div.className = 'search-result-item';
         div.textContent = `${customer.name} (${customer.contact}) - Balance: $${customer.balance.toFixed(2)}`;
         div.addEventListener('click', () => selectCustomer(customer));
         searchResults.appendChild(div);
       });
     }
   });

   function selectCustomer(customer) {
     selectedCustomer = customer;
     customerBalanceSection.style.display = 'block';
     customerNameDisplay.textContent = customer.name;
     customerBalanceDisplay.textContent = `$${customer.balance.toFixed(2)}`;
   }

   // Edit Customer
   document.getElementById('editCustomerButton').addEventListener('click', () => {
     if (!selectedCustomer) return;

     // Populate form with customer data
     document.getElementById('customerName').value = selectedCustomer.name;
     document.getElementById('customerContact').value = selectedCustomer.contact;
     document.getElementById('customerEmail').value = selectedCustomer.email;
     document.getElementById('customerAddress').value = selectedCustomer.address;
     document.getElementById('initialBalance').value = selectedCustomer.balance;

     // Switch to edit mode
     formTitle.textContent = 'Edit Customer';
     registerButton.style.display = 'none';
     updateButton.style.display = 'inline-block';
     cancelButton.style.display = 'inline-block';
   });

   // Update Customer
   updateButton.addEventListener('click', (e) => {
     e.preventDefault();
     if (!selectedCustomer) return;

     // Update customer data
     selectedCustomer.name = document.getElementById('customerName').value;
     selectedCustomer.contact = document.getElementById('customerContact').value;
     selectedCustomer.email = document.getElementById('customerEmail').value;
     selectedCustomer.address = document.getElementById('customerAddress').value;
     selectedCustomer.balance = parseFloat(document.getElementById('initialBalance').value);

     showMessage('Customer updated successfully!', 'green');
     resetForm();
   });

   // Restore Backup
   document.getElementById('restoreCustomerButton').addEventListener('click', () => {
     if (backupCustomers.length > 0) {
       customers = [...backupCustomers];
       showMessage('Last backup restored!', 'blue');
     }
   });

   // Cancel Edit
   cancelButton.addEventListener('click', resetForm);

   // Register Customer
   document.getElementById('customerForm').addEventListener('submit', (e) => {
     e.preventDefault();

     const customer = {
       name: document.getElementById('customerName').value,
       contact: document.getElementById('customerContact').value,
       email: document.getElementById('customerEmail').value,
       address: document.getElementById('customerAddress').value,
       balance: parseFloat(document.getElementById('initialBalance').value),
     };

     customers.push(customer);
     showMessage('Customer registered successfully!', 'green');
     resetForm();
   });

   function resetForm() {
     document.getElementById('customerForm').reset();
     formTitle.textContent = 'Register Customer';
     registerButton.style.display = 'inline-block';
     updateButton.style.display = 'none';
     cancelButton.style.display = 'none';
     selectedCustomer = null;
   }

   function showMessage(text, color) {
     message.style.color = color;
     message.textContent = text;
     message.style.display = 'block';
     setTimeout(() => message.style.display = 'none', 3000);
   }

   // Backup system (save state before critical operations)
   setInterval(() => {
     backupCustomers = [...customers];
   }, 10000); // Auto-backup every 10 seconds

  const order = {
    supplierName,
    orderType,
    orderAmount,
    orderRate,
    paidAmount,
    status: paidAmount < orderAmount * orderRate ? 'Unpaid' : 'Paid'
  };
  orders.push(order);

  updateUnpaidOrders();
  orderForm.reset();
});

// Add Transaction
transactionForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const customerName = document.getElementById('transactionCustomer').value;
  const transactionType = document.getElementById('transactionType').value;
  const transactionMethod = document.getElementById('transactionMethod').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const receiver = document.getElementById('receiverName').value;

  // Validate receiver for transfers
  if (transactionType === 'Transfer' && !receiver) {
    alert('Please enter a receiver name for transfers.');
    return;
  }

  // Update customer balances
  const sender = customers.find(c => c.name === customerName);
  const receiverCustomer = customers.find(c => c.name === receiver);

  if (transactionType === 'Deposit') {
    sender.balance += amount;
  } else if (transactionType === 'Withdrawal') {
    if (sender.balance < amount) {
      alert('Insufficient balance for withdrawal.');
      return;
    }
    sender.balance -= amount;
  } else if (transactionType === 'Transfer') {
    if (sender.balance < amount) {
      alert('Insufficient balance for transfer.');
      return;
    }
    sender.balance -= amount;
    receiverCustomer.balance += amount;
  }

  // Add to transactions
  const transaction = {
    date: new Date().toLocaleDateString(),
    customerName,
    type: transactionType,
    method: transactionMethod,
    amount,
    receiverName: transactionType === 'Transfer' ? receiver : null
  };
  transactions.push(transaction);

  // Update UI
  updateTransactionTable();
  updateBalance();
  updateReport();
  transactionForm.reset();
});

// Update Unpaid Orders
function updateUnpaidOrders() {
  const unpaid = orders.filter(order => order.status === 'Unpaid').length;
  unpaidOrders.textContent = unpaid;
}

// Update Transaction Table
function updateTransactionTable() {
  transactionTable.innerHTML = '';
  transactions.forEach((transaction) => {
    const row = transactionTable.insertRow();
    row.innerHTML = `
      <td>${transaction.date}</td>
      <td>${transaction.customerName}</td>
      <td>${transaction.type}</td>
      <td>${transaction.method}</td>
      <td>$${transaction.amount.toFixed(2)}</td>
      <td>${transaction.receiverName || '-'}</td>
    `;
  });
}

// Update Balance
function updateBalance() {
  const balance = customers.reduce((total, customer) => total + customer.balance, 0);
  totalBalance.textContent = `$${balance.toFixed(2)}`;
}

// Update Report
function updateReport() {
  const deposits = transactions.filter(t => t.type === 'Deposit').reduce((sum, t) => sum + t.amount, 0);
  const withdrawals = transactions.filter(t => t.type === 'Withdrawal').reduce((sum, t) => sum + t.amount, 0);
  const transfers = transactions.filter(t => t.type === 'Transfer').reduce((sum, t) => sum + t.amount, 0);

  totalDeposits.textContent = `$${deposits.toFixed(2)}`;
  totalWithdrawals.textContent = `$${withdrawals.toFixed(2)}`;
  totalTransfers.textContent = `$${transfers.toFixed(2)}`;

  updateChart();
}

// Chart for Analysis
let transactionChart;
function updateChart() {
  const labels = ['Deposits', 'Withdrawals', 'Transfers'];
  const data = [
    transactions.filter(t => t.type === 'Deposit').length,
    transactions.filter(t => t.type === 'Withdrawal').length,
    transactions.filter(t => t.type === 'Transfer').length
  ];

  if (transactionChart) {
    transactionChart.destroy();
  }

  transactionChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Transaction Types',
        data: data,
        backgroundColor: ['#4CAF50', '#FF5252', '#FFC107'],
        borderWidth: 1
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

// Initial Load
loadCustomers(); // Load customers from localStorage
updateTransactionTable();
updateBalance();
updateReport();
updateUnpaidOrders();