document.addEventListener('DOMContentLoaded', function () {
  let customers = [];
  let totalBalance = 0;
  let totalDeposits = 0;
  let totalWithdrawals = 0;
  let totalTransfers = 0;
  let transactions = [];

  // Function to update the total balance
  function updateTotalBalance() {
    document.getElementById('totalBalance').textContent = '$' + totalBalance.toFixed(2);
  }

  // Function to display customer balances
  function displayCustomerBalances() {
    const customerBalanceList = document.getElementById('customerBalanceList');
    customerBalanceList.innerHTML = ''; // Clear existing list

    customers.forEach(customer => {
      const listItem = document.createElement('li');
      listItem.textContent = `${customer.name}: $${customer.balance.toFixed(2)}`;
      customerBalanceList.appendChild(listItem);
    });
  }

  // Function to add a transaction to the table
  function addTransactionToTable(transaction) {
    const transactionTableBody = document.getElementById('transactionTableBody');
    const newRow = transactionTableBody.insertRow();

    const dateCell = newRow.insertCell(0);
    const customerCell = newRow.insertCell(1);
    const typeCell = newRow.insertCell(2);
    const methodCell = newRow.insertCell(3);
    const amountCell = newRow.insertCell(4);
    const receiverCell = newRow.insertCell(5);

    dateCell.textContent = new Date().toLocaleDateString();
    customerCell.textContent = transaction.customerName;
    typeCell.textContent = transaction.type;
    methodCell.textContent = transaction.method;
    amountCell.textContent = '$' + transaction.amount.toFixed(2);
    receiverCell.textContent = transaction.receiverName || 'N/A';
  }

  // Function to update the transaction report
  function updateTransactionReport() {
    document.getElementById('totalDeposit').textContent = '$' + totalDeposits.toFixed(2);
    document.getElementById('totalTransfer').textContent = '$' + totalTransfers.toFixed(2);
    document.getElementById('totalWithdraw').textContent = '$' + totalWithdrawals.toFixed(2);
  }

  // Function to render the chart
  function renderChart() {
    const transactionChart = document.getElementById('transactionChart').getContext('2d');
    new Chart(transactionChart, {
      type: 'bar',
      data: {
        labels: ['Deposits', 'Withdrawals', 'Transfers'],
        datasets: [{
          label: 'Transaction Amounts',
          data: [totalDeposits, totalWithdrawals, totalTransfers],
          backgroundColor: [
            'rgba(75, 192, 192, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 205, 86, 0.2)'
          ],
          borderColor: [
            'rgb(75, 192, 192)',
            'rgb(255, 99, 132)',
            'rgb(255, 205, 86)'
          ],
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

  // Customer Registration/Edit Form buttons
  document.getElementById('registerButton').addEventListener('click', function () {
    const customerName = document.getElementById('customerName').value;
    const customerContact = document.getElementById('customerContact').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const customerAddress = document.getElementById('customerAddress').value;
    const initialDeposit = parseFloat(document.getElementById('initialBalance').value);

    if (!customerName || !customerContact || isNaN(initialDeposit)) {
      alert('Please fill in all required fields.');
      return;
    }

    // Check if customer already exists
    const customerExists = customers.some(customer => customer.name === customerName);
    if (customerExists) {
      alert('Customer with this name already exists.');
      return;
    }

    // Create customer object
    const customer = {
      name: customerName,
      contact: customerContact,
      email: customerEmail,
      address: customerAddress,
      balance: initialDeposit
    };

    // Add customer to the list
    customers.push(customer);
    totalBalance += initialDeposit;

    // Add initial deposit as a transaction
    const initialTransaction = {
      customerName: customerName,
      type: 'Deposit',
      method: 'Cash', // Default method for initial deposit
      amount: initialDeposit,
      receiverName: null
    };

    transactions.push(initialTransaction);
    totalDeposits += initialDeposit;

    // Update UI
    updateTotalBalance();
    displayCustomerBalances();
    addTransactionToTable(initialTransaction);
    updateTransactionReport();
    renderChart();

    // Clear the form
    document.getElementById('customerForm').reset();
  });

  // Transaction Form button
  const addTransactionButton = document.querySelector('#transactionForm .button-container button');
  addTransactionButton.addEventListener('click', function () {
    const transactionCustomerName = document.getElementById('transactionCustomer').value;
    const transactionType = document.getElementById('transactionType').value;
    const transactionMethod = document.getElementById('transactionMethod').value;
    const transactionAmount = parseFloat(document.getElementById('amount').value);
    const transactionReceiverName = document.getElementById('receiverName').value;

    if (!transactionCustomerName || isNaN(transactionAmount)) {
      alert('Please fill in all required fields for the transaction.');
      return;
    }

    // Find the customer
    const customer = customers.find(c => c.name === transactionCustomerName);
    if (!customer) {
      alert('Customer not found.');
      return;
    }

    // Update customer balance based on transaction type
    if (transactionType === 'Deposit') {
      customer.balance += transactionAmount;
      totalBalance += transactionAmount;
      totalDeposits += transactionAmount;
    } else if (transactionType === 'Withdrawal') {
      if (customer.balance < transactionAmount) {
        alert('Insufficient balance.');
        return;
      }
      customer.balance -= transactionAmount;
      totalBalance -= transactionAmount;
      totalWithdrawals += transactionAmount;
    } else if (transactionType === 'Transfer') {
      totalTransfers += transactionAmount;
      // For simplicity, assuming transfer is always valid
    }

    updateTotalBalance();
    displayCustomerBalances();

    // Add transaction to the table
    const transaction = {
      customerName: transactionCustomerName,
      type: transactionType,
      method: transactionMethod,
      amount: transactionAmount,
      receiverName: transactionReceiverName
    };
    addTransactionToTable(transaction);
    transactions.push(transaction);

    updateTransactionReport();
    renderChart();

    // Clear the form
    document.getElementById('transactionForm').reset();
  });

  // View History Button
  document.getElementById('viewHistoryButton').addEventListener('click', function () {
    const searchInput = document.getElementById('searchInput').value.trim();
    if (!searchInput) {
      alert('Please enter a customer name or contact to search.');
      return;
    }

    // Find the customer
    const customer = customers.find(c => c.name === searchInput || c.contact === searchInput);
    if (!customer) {
      alert('Customer not found.');
      return;
    }

    // Filter transactions for the customer
    const customerTransactions = transactions.filter(t => t.customerName === customer.name);

    // Display transaction history
    const transactionHistoryList = document.getElementById('transactionHistoryList');
    transactionHistoryList.innerHTML = ''; // Clear existing history

    if (customerTransactions.length === 0) {
      transactionHistoryList.innerHTML = '<li>No transactions found for this customer.</li>';
    } else {
      customerTransactions.forEach(transaction => {
        const listItem = document.createElement('li');
        listItem.textContent = `${transaction.type} (${transaction.method}): $${transaction.amount.toFixed(2)}`;
        transactionHistoryList.appendChild(listItem);
      });
    }

    // Show the transaction history section
    document.getElementById('transactionHistorySection').style.display = 'block';
  });

  // Hide History Button
  document.getElementById('hideHistoryButton').addEventListener('click', function () {
    document.getElementById('transactionHistorySection').style.display = 'none';
  });

  // Initial chart render
  updateTransactionReport();
  renderChart();
});
