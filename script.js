const tbody = document.querySelector("tbody");
const descItem = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const date = document.querySelector("#date");
const category = document.querySelector("#category");
const client = document.querySelector("#client");
const invoiceNumber = document.querySelector("#invoiceNumber");
const btnNew = document.querySelector("#btnNew");

const incomes = document.querySelector(".incomes");
const expenses = document.querySelector(".expenses");
const total = document.querySelector(".total");

let items = [];

btnNew.onclick = () => {
  if (
    descItem.value === "" ||
    amount.value === "" ||
    type.value === "" ||
    date.value === "" ||
    category.value === "" ||
    client.value === "" ||
    invoiceNumber.value === ""
  ) {
    return alert("Preencha todos os campos!");
  }

  const newItem = {
    desc: descItem.value,
    amount: Math.abs(amount.value),
    type: type.value,
    date: date.value,
    category: category.value,
    client: client.value,
    invoiceNumber: invoiceNumber.value,
  };

  items.push(newItem);

  setItemsBD(items);

  insertItem(newItem);

  descItem.value = "";
  amount.value = "";
  date.value = "";
  category.value = "";
  client.value = "";
  invoiceNumber.value = "";
};

function deleteItem(index) {
  items.splice(index, 1);
  setItemsBD(items);
  loadItems();
}

function editItem(index) {
  const item = items[index];
  descItem.value = item.desc;
  amount.value = item.amount;
  type.value = item.type;
  date.value = item.date;
  category.value = item.category;
  client.value = item.client;
  invoiceNumber.value = item.invoiceNumber;

  btnNew.innerHTML = "Salvar";
  btnNew.onclick = () => {
    if (
      descItem.value === "" ||
      amount.value === "" ||
      type.value === "" ||
      date.value === "" ||
      category.value === "" ||
      client.value === "" ||
      invoiceNumber.value === ""
    ) {
      return alert("Preencha todos os campos!");
    }

    items[index] = {
      desc: descItem.value,
      amount: Math.abs(amount.value),
      type: type.value,
      date: date.value,
      category: category.value,
      client: client.value,
      invoiceNumber: invoiceNumber.value,
    };

    setItemsBD(items);
    loadItems();

    descItem.value = "";
    amount.value = "";
    date.value = "";
    category.value = "";
    client.value = "";
    invoiceNumber.value = "";

    btnNew.innerHTML = "Incluir";
    btnNew.onclick = handleNewButtonClick;
  };
}

function handleNewButtonClick() {
  if (
    descItem.value === "" ||
    amount.value === "" ||
    type.value === "" ||
    date.value === "" ||
    category.value === "" ||
    client.value === "" ||
    invoiceNumber.value === ""
  ) {
    return alert("Preencha todos os campos!");
  }

  const newItem = {
    desc: descItem.value,
    amount: Math.abs(amount.value),
    type: type.value,
    date: date.value,
    category: category.value,
    client: client.value,
    invoiceNumber: invoiceNumber.value,
  };

  items.push(newItem);

  setItemsBD(items);
  insertItem(newItem);

  descItem.value = "";
  amount.value = "";
  date.value = "";
  category.value = "";
  client.value = "";
  invoiceNumber.value = "";
}

function insertItem(item) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${item.desc}</td>
    <td>${formatCurrency(item.amount)}</td>
    <td>${item.date}</td>
    <td>${item.category}</td>
    <td>${item.client}</td>
    <td>${item.invoiceNumber}</td>
    <td class="columnType">${
      item.type === "Entrada"
        ? '<i class="bx bxs-chevron-up-circle"></i>'
        : '<i class="bx bxs-chevron-down-circle"></i>'
    }</td>
    <td class="columnAction">
      <button onclick="editItem(${items.indexOf(item)})"><i class='bx bx-pencil'></i></button>
      <button onclick="deleteItem(${items.indexOf(item)})"><i class='bx bx-trash'></i></button>
    </td>
  `;

  tbody.appendChild(tr);
}

function loadItems() {
  items = getItemsBD();
  tbody.innerHTML = "";
  items.forEach((item) => {
    insertItem(item);
  });

  getTotals();
}

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

function getTotals() {
  const amountIncomes = items
    .filter((item) => item.type === "Entrada")
    .map((transaction) => Number(transaction.amount));

  const amountExpenses = items
    .filter((item) => item.type === "Saída")
    .map((transaction) => Number(transaction.amount));

  const totalIncomes = amountIncomes.reduce((acc, cur) => acc + cur, 0);
  const totalExpenses = amountExpenses.reduce((acc, cur) => acc + cur, 0);
  const totalItems = totalIncomes - totalExpenses;

  incomes.textContent = formatCurrency(totalIncomes);
  expenses.textContent = formatCurrency(totalExpenses);
  total.textContent = formatCurrency(totalItems);
}

function getItemsBD() {
  const storedItems = localStorage.getItem("db_items");
  return storedItems ? JSON.parse(storedItems) : [];
}

function setItemsBD(items) {
  localStorage.setItem("db_items", JSON.stringify(items));
}

loadItems();
