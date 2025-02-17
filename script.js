document.addEventListener('DOMContentLoaded', function() {
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
    document.getElementById('totalDeposits').textContent = '$' + totalDeposits.toFixed(2);
    document.getElementById('totalWithdrawals').textContent = '$' + totalWithdrawals.toFixed(2);
    document.getElementById('totalTransfers').textContent = '$' + totalTransfers.toFixed(2);
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
  document.getElementById('registerButton').addEventListener('click', function() {
    const customerName = document.getElementById('customerName').value;
    const customerContact = document.getElementById('customerContact').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const customerAddress = document.getElementById('customerAddress').value;
    const initialBalance = parseFloat(document.getElementById('initialBalance').value);

    if (!customerName || !customerContact || isNaN(initialBalance)) {
      alert('Please fill in all required fields.');
      return;
    }

    // Check if customer already exists
    const customerExists = customers.some(customer => customer.name === customerName);
    if (customerExists) {
      alert('Customer with this name already exists.');
      return;
    }

    const customer = {
      name: customerName,
      contact: customerContact,
      email: customerEmail,
      address: customerAddress,
      balance: initialBalance
    };

    customers.push(customer);
    totalBalance += initialBalance;

    updateTotalBalance();
    displayCustomerBalances();

    // Clear the form
    document.getElementById('customerForm').reset();
  });

  // Transaction Form button
  const addTransactionButton = document.querySelector('#transactionForm .button-container button');
  addTransactionButton.addEventListener('click', function() {
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

  // Initial chart render
  updateTransactionReport();
  renderChart();

  // Customer Balance Section buttons
  document.getElementById('editCustomerButton').addEventListener('click', function() {
    alert('Edit Customer button clicked');
  });

  document.getElementById('clearDataButton').addEventListener('click', function() {
    alert('Clear Data button clicked');
  });

  document.getElementById('viewHistoryButton').addEventListener('click', function() {
    alert('View History button clicked');
  });

  document.getElementById('updateCustomerButton').addEventListener('click', function() {
    alert('Update button clicked');
  });

  document.getElementById('cancelEditButton').addEventListener('click', function() {
    alert('Cancel button clicked');
  });

  // Transaction History Section button
  document.getElementById('hideHistoryButton').addEventListener('click', function() {
    alert('Hide History button clicked');
  });

  // Order Form button
  const addOrderButton = document.querySelector('#orderForm button');
  addOrderButton.addEventListener('click', function() {
    alert('Add Order button clicked');
  });
});
