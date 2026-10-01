const form = document.getElementById("transactionForm");
const transactions = document.getElementById("transactions");

const balanceElement = document.getElementById("balance");
const incomeElement = document.getElementById("income");
const expensesElement = document.getElementById("expenses");

const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");

const categorySummary =
    document.getElementById("categorySummary");

const monthlySummary =
    document.getElementById("monthlySummary");

const expenseChart =
    document.getElementById("expenseChart");


let transactionList = JSON.parse(
    localStorage.getItem("transactions")
) || [];


let editingId = null;


// ===============================
// UPDATE SUMMARY
// ===============================

function updateSummary() {

    let totalIncome = 0;
    let totalExpenses = 0;

    transactionList.forEach(function(transaction) {

        if (transaction.type === "income") {

            totalIncome += transaction.amount;

        } else {

            totalExpenses += transaction.amount;

        }

    });

    const balance =
        totalIncome - totalExpenses;

    incomeElement.textContent =
        totalIncome;

    expensesElement.textContent =
        totalExpenses;

    balanceElement.textContent =
        balance;
}


// ===============================
// CATEGORY SUMMARY
// ===============================

function updateCategorySummary() {

    const categoryTotals = {};


    transactionList.forEach(function(transaction) {

        if (transaction.type === "expense") {

            const category =
                transaction.category;


            if (categoryTotals[category]) {

                categoryTotals[category] +=
                    transaction.amount;

            } else {

                categoryTotals[category] =
                    transaction.amount;

            }

        }

    });


    categorySummary.innerHTML = "";


    const categories =
        Object.keys(categoryTotals);


    if (categories.length === 0) {

        categorySummary.innerHTML =
            "<p>No expenses yet.</p>";

        return;
    }


    categories.forEach(function(category) {

        const categoryElement =
            document.createElement("div");


        categoryElement.className =
            "summary-row";


        categoryElement.innerHTML = `
            <strong>${category}</strong>
            <span>₹${categoryTotals[category]}</span>
        `;


        categorySummary.appendChild(
            categoryElement
        );

    });

}


// ===============================
// MONTHLY SUMMARY
// ===============================

function updateMonthlySummary() {

    const monthlyTotals = {};


    transactionList.forEach(function(transaction) {

        if (transaction.type === "expense") {

            const date =
                new Date(transaction.date);


            const month =
                date.toLocaleString(
                    "en-US",
                    {
                        month: "long"
                    }
                );


            const year =
                date.getFullYear();


            const monthYear =
                `${month} ${year}`;


            if (monthlyTotals[monthYear]) {

                monthlyTotals[monthYear] +=
                    transaction.amount;

            } else {

                monthlyTotals[monthYear] =
                    transaction.amount;

            }

        }

    });


    monthlySummary.innerHTML = "";


    const months =
        Object.keys(monthlyTotals);


    if (months.length === 0) {

        monthlySummary.innerHTML =
            "<p>No expenses yet.</p>";

        return;
    }


    months.forEach(function(month) {

        const monthElement =
            document.createElement("div");


        monthElement.className =
            "summary-row";


        monthElement.innerHTML = `
            <strong>${month}</strong>
            <span>₹${monthlyTotals[month]}</span>
        `;


        monthlySummary.appendChild(
            monthElement
        );

    });

}


// ===============================
// EXPENSE CHART
// ===============================

function updateExpenseChart() {

    const categoryTotals = {};


    transactionList.forEach(function(transaction) {

        if (transaction.type === "expense") {

            const category =
                transaction.category;


            if (categoryTotals[category]) {

                categoryTotals[category] +=
                    transaction.amount;

            } else {

                categoryTotals[category] =
                    transaction.amount;

            }

        }

    });


    expenseChart.innerHTML = "";


    const categories =
        Object.keys(categoryTotals);


    if (categories.length === 0) {

        expenseChart.innerHTML =
            "<p>No expenses yet.</p>";

        return;
    }


    let maximum =
        Math.max(
            ...Object.values(categoryTotals)
        );


    categories.forEach(function(category) {

        const amount =
            categoryTotals[category];


        const percentage =
            (amount / maximum) * 100;


        const chartRow =
            document.createElement("div");


        chartRow.className =
            "chart-row";


        chartRow.innerHTML = `

            <div class="chart-label">

                <strong>
                    ${category}
                </strong>

                <span>
                    ₹${amount}
                </span>

            </div>


            <div class="chart-bar-container">

                <div
                    class="chart-bar"
                    style="width: ${percentage}%"
                >
                </div>

            </div>

        `;


        expenseChart.appendChild(
            chartRow
        );

    });

}


// ===============================
// EMPTY MESSAGE
// ===============================

function updateEmptyMessage() {

    const emptyMessage =
        document.getElementById("emptyMessage");


    if (transactionList.length === 0) {

        if (!emptyMessage) {

            const message =
                document.createElement("p");

            message.id =
                "emptyMessage";

            message.textContent =
                "No transactions yet.";

            transactions.appendChild(
                message
            );

        }

    } else {

        if (emptyMessage) {

            emptyMessage.remove();

        }

    }

}


// ===============================
// DISPLAY TRANSACTION
// ===============================

function displayTransaction(transaction) {

    const transactionElement =
        document.createElement("div");


    transactionElement.setAttribute(
        "data-id",
        transaction.id
    );


    transactionElement.setAttribute(
        "data-type",
        transaction.type
    );


    transactionElement.innerHTML = `

        <div class="transaction-info">

            <h3>
                ${transaction.category}
            </h3>

            <p>
                ${transaction.description}
            </p>

            <small>
                ${transaction.date}
            </small>

        </div>


        <div class="transaction-right">

            <strong class="${transaction.type}">
                ₹${transaction.amount}
            </strong>

            <p>
                ${transaction.type}
            </p>

            <button class="editButton">
                Edit
            </button>

            <button class="deleteButton">
                Delete
            </button>

        </div>

    `;


    transactions.appendChild(
        transactionElement
    );


    const editButton =
        transactionElement.querySelector(
            ".editButton"
        );


    editButton.addEventListener(
        "click",
        function() {

            document.getElementById("type").value =
                transaction.type;

            document.getElementById("amount").value =
                transaction.amount;

            document.getElementById("category").value =
                transaction.category;

            document.getElementById("description").value =
                transaction.description;

            document.getElementById("date").value =
                transaction.date;


            editingId =
                transaction.id;


            form.querySelector(
                "button[type='submit']"
            ).textContent =
                "Save Changes";

        }
    );


    const deleteButton =
        transactionElement.querySelector(
            ".deleteButton"
        );


    deleteButton.addEventListener(
        "click",
        function() {

            transactionList =
                transactionList.filter(
                    function(item) {

                        return item.id !==
                            transaction.id;

                    }
                );


            localStorage.setItem(
                "transactions",
                JSON.stringify(transactionList)
            );


            transactionElement.remove();


            updateSummary();

            updateCategorySummary();

            updateMonthlySummary();

            updateExpenseChart();

            updateEmptyMessage();

        }
    );

}


// ===============================
// ADD / EDIT
// ===============================

form.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const type =
            document.getElementById("type").value;

        const amount =
            document.getElementById("amount").value;

        const category =
            document.getElementById("category").value;

        const description =
            document.getElementById("description").value;

        const date =
            document.getElementById("date").value;


        const amountNumber =
            Number(amount);


        if (
            amount === "" ||
            amountNumber <= 0 ||
            category === "" ||
            date === ""
        ) {

            alert(
                "Please enter a valid amount and fill all required fields."
            );

            return;
        }


        // EDIT

        if (editingId !== null) {

            transactionList =
                transactionList.map(
                    function(transaction) {

                        if (
                            transaction.id ===
                            editingId
                        ) {

                            return {

                                id: transaction.id,

                                type: type,

                                amount: amountNumber,

                                category: category,

                                description: description,

                                date: date

                            };

                        }


                        return transaction;

                    }
                );


            localStorage.setItem(
                "transactions",
                JSON.stringify(transactionList)
            );


            transactions.innerHTML = "";


            transactionList.forEach(
                function(transaction) {

                    displayTransaction(
                        transaction
                    );

                }
            );


            editingId = null;


            form.querySelector(
                "button[type='submit']"
            ).textContent =
                "Add Transaction";


            updateSummary();

            updateCategorySummary();

            updateMonthlySummary();

            updateExpenseChart();

            updateEmptyMessage();


            form.reset();


            return;

        }


        // ADD

        const transaction = {

            id: Date.now(),

            type: type,

            amount: amountNumber,

            category: category,

            description: description,

            date: date

        };


        transactionList.push(
            transaction
        );


        localStorage.setItem(
            "transactions",
            JSON.stringify(transactionList)
        );


        displayTransaction(
            transaction
        );


        updateSummary();

        updateCategorySummary();

        updateMonthlySummary();

        updateExpenseChart();

        updateEmptyMessage();


        form.reset();

    }
);


// ===============================
// SEARCH + FILTER
// ===============================

function filterTransactions() {

    const searchText =
        searchInput.value.toLowerCase();


    const selectedType =
        filterType.value;


    const allTransactions =
        document.querySelectorAll(
            "#transactions > div"
        );


    allTransactions.forEach(
        function(transaction) {

            const transactionText =
                transaction.textContent
                    .toLowerCase();


            const transactionType =
                transaction.getAttribute(
                    "data-type"
                );


            const matchesSearch =
                transactionText.includes(
                    searchText
                );


            const matchesType =
                selectedType === "all" ||
                transactionType ===
                    selectedType;


            if (
                matchesSearch &&
                matchesType
            ) {

                transaction.style.display =
                    "flex";

            } else {

                transaction.style.display =
                    "none";

            }

        }
    );

}


searchInput.addEventListener(
    "input",
    filterTransactions
);


filterType.addEventListener(
    "change",
    filterTransactions
);


// ===============================
// LOAD SAVED DATA
// ===============================

transactionList.forEach(
    function(transaction) {

        displayTransaction(
            transaction
        );

    }
);


updateSummary();

updateCategorySummary();

updateMonthlySummary();

updateExpenseChart();

updateEmptyMessage();