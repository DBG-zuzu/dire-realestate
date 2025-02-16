import Chart from 'chart.js/auto';

    document.addEventListener('DOMContentLoaded', () => {
      // Customer Data (Example)
      const customers = [
        { id: 1, name: 'John Doe', contact: '123-456-7890', balance: 1500 },
        { id: 2, name: 'Jane Smith', contact: '987-654-3210', balance: 2200 },
        { id: 3, name: 'Alice Johnson', contact: '555-123-4567', balance: 800 },
      ];

      let currentCustomer = null;
      let transactions = []; // Array to store transactions

      // DOM Elements
      const searchInput = document.getElementById('searchInput');
      const searchResults = document.getElementById('searchResults');
      const customerNameDisplay = document.getElementById('customerNameDisplay');
      const customerBalanceDisplay = document.getElementById('customerBalanceDisplay');
      const lastTransactionDisplay = document.getElementById('lastTransactionDisplay'); // New line
      const editCustomerButton = document.getElementById('editCustomerButton');
      const clearDataButton = document.getElementById('clearDataButton');
      const viewHistoryButton = document.getElementById('viewHistoryButton'); // New button
      const customerForm = document.getElementById('customerForm');
      const formTitle = document.getElementById('formTitle');
      const customerNameInput = document.getElementById('customerName');
      const customerContactInput = document.getElementById('customerContact');
      const customerEmailInput = document.getElementById('customerEmail');
      const customerAddressInput = document.getElementById('customerAddress');
      const initialBalanceInput = document.getElementById('initialBalance');
      const registerButton = document.getElementById('registerButton');
      const updateCustomerButton = document.getElementById('updateCustomerButton');
      const cancelEditButton = document.getElementById('cancelEditButton');
      const messageDisplay = document.getElementById('message');
      const totalBalanceDisplay = document.getElementById('totalBalance');
      const unpaidOrdersDisplay = document.getElementById('unpaidOrders');
      const totalTransactionsDisplay = document.getElementById('totalTransactions');
      const customerBalanceList = document.getElementById('customerBalanceList');
      const transactionForm = document.getElementById('transactionForm');
      const transactionTableBody = document.getElementById('transactionTable').querySelector('tbody');
      const totalDepositsDisplay = document.getElementById('totalDeposits');
      const totalWithdrawalsDisplay = document.getElementById('totalWithdrawals');
      const totalTransfersDisplay = document.getElementById('totalTransfers');
      const transactionChartCanvas = document.getElementById('transactionChart');
      const orderForm = document.getElementById('orderForm');
      const transactionHistoryList = document.getElementById('transactionHistoryList');
      const transactionHistorySection = document.getElementById('transactionHistorySection');
      const hideHistoryButton = document.getElementById('hideHistoryButton');

      // --- Search Functionality ---
      searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredCustomers = customers.filter(customer =>
          customer.name.toLowerCase().includes(searchTerm) ||
          customer.contact.includes(searchTerm)
        );
        displaySearchResults(filteredCustomers);
      });

      function displaySearchResults(results) {
        searchResults.innerHTML = '';
        if (results.length === 0) {
          searchResults.style.display = 'none';
          return;
        }

        results.forEach(customer => {
          const item = document.createElement('div');
          item.classList.add('search-result-item');
          item.textContent = customer.name;
          item.addEventListener('click', () => {
            selectCustomer(customer);
            searchResults.style.display = 'none';
            searchInput.value = '';
          });
          searchResults.appendChild(item);
        });

        searchResults.style.display = 'block';
      }

      function selectCustomer(customer) {
        currentCustomer = customer;
        customerNameDisplay.textContent = customer.name;
        customerBalanceDisplay.textContent = `$${customer.balance.toFixed(2)}`;

        // Find the last transaction for the selected customer
        const lastTransaction = transactions.filter(transaction => transaction.customer === customer.name).pop();
        if (lastTransaction) {
          lastTransactionDisplay.textContent = `${lastTransaction.type}: $${lastTransaction.amount}`;
        } else {
          lastTransactionDisplay.textContent = 'N/A';
        }

        showCustomerBalanceSection();
      }

      function showCustomerBalanceSection() {
        document.getElementById('customerBalanceSection').style.display = 'block';
      }

      // --- Customer Form Functions ---
      function clearForm() {
        customerNameInput.value = '';
        customerContactInput.value = '';
        customerEmailInput.value = '';
        customerAddressInput.value = '';
        initialBalanceInput.value = '';
      }

      function populateForm(customer) {
        customerNameInput.value = customer.name;
        customerContactInput.value = customer.contact;
        customerEmailInput.value = customer.email || '';
        customerAddressInput.value = customer.address || '';
        initialBalanceInput.value = customer.balance.toFixed(2);
      }

      function showMessage(message, isError = false) {
        messageDisplay.textContent = message;
        messageDisplay.style.color = isError ? 'red' : 'green';
        messageDisplay.style.display = 'block';
        setTimeout(() => {
          messageDisplay.style.display = 'none';
        }, 3000);
      }

      // --- Button Event Listeners ---
      editCustomerButton.addEventListener('click', () => {
        if (currentCustomer) {
          formTitle.textContent = 'Edit Customer';
          populateForm(currentCustomer);
          updateCustomerButton.style.display = 'inline-block';
          cancelEditButton.style.display = 'inline-block';
          registerButton.style.display = 'none';
          document.querySelector('.form-container').style.display = 'block';
        } else {
          showMessage('No customer selected.', true);
        }
      });

      clearDataButton.addEventListener('click', () => {
        const confirmClear = confirm('Are you sure you want to clear all data? This action cannot be undone.');
        if (confirmClear) {
          // Clear customer data
          customers.length = 0;
          transactions.length = 0;

          // Update display
          updateCustomerBalanceList();
          customerNameDisplay.textContent = '';
          customerBalanceDisplay.textContent = '$0.00';
          totalBalanceDisplay.textContent = '$0.00';
          unpaidOrdersDisplay.textContent = '0';
          totalTransactionsDisplay.textContent = '0';
          lastTransactionDisplay.textContent = 'N/A'; // Clear last transaction

          // Clear transaction table
          transactionTableBody.innerHTML = '';
          updateTransactionHistoryList();

          // Reset chart
          updateTransactionReport();

          showMessage('All data cleared successfully!');
        }
      });

      // Show transaction history
      viewHistoryButton.addEventListener('click', () => {
        transactionHistorySection.style.display = 'block';
      });

      // Hide transaction history
      hideHistoryButton.addEventListener('click', () => {
        transactionHistorySection.style.display = 'none';
      });

      cancelEditButton.addEventListener('click', () => {
        clearForm();
        formTitle.textContent = 'Register Customer';
        updateCustomerButton.style.display = 'none';
        cancelEditButton.style.display = 'none';
        registerButton.style.display = 'inline-block';
        document.querySelector('.form-container').style.display = 'none';
      });

      registerButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent form submission

        const newCustomerName = customerNameInput.value;

        // Check if customer already exists
        const existingCustomer = customers.find(customer => customer.name === newCustomerName);

        if (existingCustomer) {
          showMessage('Customer already exists. Redirecting to add transaction.', true);
          // Redirect to add transaction (you might need to adjust this part)
          document.querySelector('.form-container').style.display = 'none'; // Hide the form
          document.getElementById('transactionCustomer').value = newCustomerName; // Fill customer name in transaction form
          return;
        }

        const newCustomer = {
          id: customers.length + 1,
          name: newCustomerName,
          contact: customerContactInput.value,
          email: customerEmailInput.value,
          address: customerAddressInput.value,
          balance: parseFloat(initialBalanceInput.value),
        };

        customers.push(newCustomer);
        updateCustomerBalanceList();
        showMessage('Customer registered successfully!');
        clearForm();
      });

      updateCustomerButton.addEventListener('click', () => {
        if (currentCustomer) {
          currentCustomer.name = customerNameInput.value;
          currentCustomer.contact = customerContactInput.value;
          currentCustomer.email = customerEmailInput.value;
          currentCustomer.address = customerAddressInput.value;
          currentCustomer.balance = parseFloat(initialBalanceInput.value);

          customerNameDisplay.textContent = currentCustomer.name;
          customerBalanceDisplay.textContent = `$${currentCustomer.balance.toFixed(2)}`;
          updateCustomerBalanceList();
          showMessage('Customer updated successfully!');
          cancelEditButton.click(); // Hide the form
        } else {
          showMessage('No customer selected.', true);
        }
      });

      // --- Summary Section Updates ---
      function updateTotalBalance() {
        const totalBalance = customers.reduce((sum, customer) => sum + customer.balance, 0);
        totalBalanceDisplay.textContent = `$${totalBalance.toFixed(2)}`;
      }

      function updateUnpaidOrders() {
        // This is placeholder logic; replace with actual unpaid orders calculation
        unpaidOrdersDisplay.textContent = '0';
      }

      function updateTotalTransactions() {
        // This is placeholder logic; replace with actual transaction count
        totalTransactionsDisplay.textContent = transactions.length;
      }

      // --- Customer Balances List ---
      function updateCustomerBalanceList() {
        customerBalanceList.innerHTML = '';
        customers.forEach(customer => {
          const listItem = document.createElement('li');
          listItem.textContent = `${customer.name}: $${customer.balance.toFixed(2)}`;
          customerBalanceList.appendChild(listItem);
        });
        updateTotalBalance();
      }

      // --- Transaction Handling ---
      transactionForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const transactionCustomerName = document.getElementById('transactionCustomer').value;
        const transactionType = document.getElementById('transactionType').value;
        const transactionMethod = document.getElementById('transactionMethod').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const receiverName = document.getElementById('receiverName').value;

        // Basic validation
        if (!transactionCustomerName || isNaN(amount)) {
          alert('Please fill out all required fields.');
          return;
        }

        // Find the customer
        const transactionCustomer = customers.find(customer => customer.name === transactionCustomerName);

        if (!transactionCustomer) {
          alert('Customer not found.');
          return;
        }

        // Update customer balance based on transaction type
        switch (transactionType) {
          case 'Deposit':
            transactionCustomer.balance += amount;
            break;
          case 'Withdrawal':
            if (transactionCustomer.balance < amount) {
              alert('Insufficient balance.');
              return;
            }
            transactionCustomer.balance -= amount;
            break;
          case 'Transfer':
            const receiver = customers.find(customer => customer.name === receiverName);
            if (!receiver) {
              alert('Receiver not found.');
              return;
            }
            if (transactionCustomer.balance < amount) {
              alert('Insufficient balance for transfer.');
              return;
            }
            transactionCustomer.balance -= amount;
            receiver.balance += amount;
            break;
        }

        // Create transaction object
        const newTransaction = {
          date: new Date().toLocaleDateString(),
          customer: transactionCustomerName,
          type: transactionType,
          method: transactionMethod,
          amount: amount,
          receiver: receiverName,
        };

        // Add transaction to the transactions array
        transactions.push(newTransaction);

        // Add transaction to table
        addTransactionToTable(newTransaction);

        // Update transaction report
        updateTransactionReport();

        // Update customer balance list and display
        updateCustomerBalanceList();
        customerBalanceDisplay.textContent = `$${transactionCustomer.balance.toFixed(2)}`;

        // Update transaction history
        updateTransactionHistoryList();

        // Update last transaction display
        lastTransactionDisplay.textContent = `${transactionType}: $${amount}`;

        // Clear form
        transactionForm.reset();
        updateTotalTransactions();
      });

      function addTransactionToTable(transaction) {
        const row = transactionTableBody.insertRow();
        row.insertCell().textContent = transaction.date;
        row.insertCell().textContent = transaction.customer;
        row.insertCell().textContent = transaction.type;
        row.insertCell().textContent = transaction.method;
        row.insertCell().textContent = transaction.amount;
        row.insertCell().textContent = transaction.receiver || '-';
      }

      // --- Transaction Report ---
      function updateTransactionReport() {
        let totalDeposits = 0;
        let totalWithdrawals = 0;
        let totalTransfers = 0;

        transactions.forEach(transaction => {
          switch (transaction.type) {
            case 'Deposit':
              totalDeposits += transaction.amount;
              break;
            case 'Withdrawal':
              totalWithdrawals += transaction.amount;
              break;
            case 'Transfer':
              totalTransfers += transaction.amount;
              break;
          }
        });

        totalDepositsDisplay.textContent = `$${totalDeposits.toFixed(2)}`;
        totalWithdrawalsDisplay.textContent = `$${totalWithdrawals.toFixed(2)}`;
        totalTransfersDisplay.textContent = `$${totalTransfers.toFixed(2)}`;

        // Update chart
        updateTransactionChart(totalDeposits, totalWithdrawals, totalTransfers);
      }

      let transactionChart;

      function updateTransactionChart(deposits, withdrawals, transfers) {
        if (transactionChart) {
          transactionChart.destroy(); // Destroy existing chart
        }

        const ctx = transactionChartCanvas.getContext('2d');
        transactionChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Deposits', 'Withdrawals', 'Transfers'],
            datasets: [{
              label: 'Transaction Amounts',
              data: [deposits, withdrawals, transfers],
              backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 205, 86, 0.2)',
              ],
              borderColor: [
                'rgb(75, 192, 192)',
                'rgb(255, 99, 132)',
                'rgb(255, 205, 86)',
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

      // --- Transaction History ---
      function updateTransactionHistoryList() {
        transactionHistoryList.innerHTML = '';
        transactions.forEach(transaction => {
          const listItem = document.createElement('li');
          listItem.textContent = `${transaction.date} - ${transaction.customer} - ${transaction.type} - $${transaction.amount}`;
          transactionHistoryList.appendChild(listItem);
        });
      }

      // --- Initialize ---
      updateTotalBalance();
      updateUnpaidOrders();
      updateTotalTransactions();
      updateCustomerBalanceList();
      updateTransactionReport();
      updateTransactionHistoryList();
    });
