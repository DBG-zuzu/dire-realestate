import Chart from 'chart.js/auto';

    document.addEventListener('DOMContentLoaded', () => {
      // Customer Data (Example)
      const customers = [
        { id: 1, name: 'John Doe', contact: '123-456-7890', balance: 1500 },
        { id: 2, name: 'Jane Smith', contact: '987-654-3210', balance: 2200 },
        { id: 3, name: 'Alice Johnson', contact: '555-123-4567', balance: 800 },
      ];

      let currentCustomer = null;

      // DOM Elements
      const searchInput = document.getElementById('searchInput');
      const searchResults = document.getElementById('searchResults');
      const customerNameDisplay = document.getElementById('customerNameDisplay');
      const customerBalanceDisplay = document.getElementById('customerBalanceDisplay');
      const editCustomerButton = document.getElementById('editCustomerButton');
      const restoreCustomerButton = document.getElementById('restoreCustomerButton');
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

      cancelEditButton.addEventListener('click', () => {
        clearForm();
        formTitle.textContent = 'Register Customer';
        updateCustomerButton.style.display = 'none';
        cancelEditButton.style.display = 'none';
        registerButton.style.display = 'inline-block';
        document.querySelector('.form-container').style.display = 'none';
      });

      registerButton.addEventListener('click', () => {
        const newCustomer = {
          id: customers.length + 1,
          name: customerNameInput.value,
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
        totalTransactionsDisplay.textContent = '0';
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
        const transactionCustomer = document.getElementById('transactionCustomer').value;
        const transactionType = document.getElementById('transactionType').value;
        const transactionMethod = document.getElementById('transactionMethod').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const receiverName = document.getElementById('receiverName').value;

        // Basic validation
        if (!transactionCustomer || isNaN(amount)) {
          alert('Please fill out all required fields.');
          return;
        }

        // Create transaction object
        const newTransaction = {
          date: new Date().toLocaleDateString(),
          customer: transactionCustomer,
          type: transactionType,
          method: transactionMethod,
          amount: amount,
          receiver: receiverName,
        };

        // Add transaction to table
        addTransactionToTable(newTransaction);

        // Update transaction report
        updateTransactionReport();

        // Clear form
        transactionForm.reset();
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

        // Example data (replace with actual transaction data)
        const transactions = [
          { type: 'Deposit', amount: 100 },
          { type: 'Withdrawal', amount: 50 },
          { type: 'Transfer', amount: 25 },
          { type: 'Deposit', amount: 75 },
        ];

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

      // --- Initialize ---
      updateTotalBalance();
      updateUnpaidOrders();
      updateTotalTransactions();
      updateCustomerBalanceList();
      updateTransactionReport();
    });
