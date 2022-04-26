"use strict";

//Dit is de HamburgerMenu die je kan clicken
const hbMenu = document.getElementById("menu");
//Hier opent de Hamburger Menu met de Modal
const hbMenuOpen = document.getElementById("hb-menu-open");
//Hierin opent een lijst met de navigatie naar verschillende paginas
const hbModalMenuList = document.getElementById("sidebar-menulist");
const modalBG = document.getElementById("modal--menu");

//Dit is een button waarbij je administratie modal opent
const addTransactionBtn = document.getElementById("add-transaction");
//Hier gaat de Modal van de invulvelden open
const addTransactionModal = document.getElementById("add-trans");
//Deze knop sluit de modal met de invulvelden
const addTransactionModalClose = document.getElementById(
  "close-trans-modal-btn"
);
//Hiermee stuur je alle invulvelden met een waarde naar de server.
const submitTransactionBtn = document.getElementById("submit-btn");
/////////////////////////////////////////////////////////////////////

///Input values overview//////////////////////////////////////
let insertDate = document.getElementById("insertDate");
let insertDescription = document.getElementById("description");
let transactionNum = document.getElementById("transaction-number");
let typeTrans = document.getElementById("type");
let transactionAmount = document.getElementById("amountTrans");
//////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////
let revenueCalculation = document.getElementById("revenue");
let purchaseCalculation = document.getElementById("purchaseCalc");
let profitLoss = document.getElementById("profitLoss");
const profitLosStyle = document.querySelector(".profitLos");

/////////////////////////////////////////////////////////////////////////
const page1 = document.getElementById("page-1");
const page2 = document.getElementById("page-2");
const page3 = document.getElementById("page-3");
const page4 = document.getElementById("page-4");
const page5 = document.getElementById("page-5");
const page6 = document.getElementById("page-6");
const page7 = document.getElementById("page-7");
const page8 = document.getElementById("page-8");
/////////////////////////////////////////////////////////////////////////
//Deze functie haalt de bestaande transacties op hem weer te geven
const getTransactions = () => {
  const query = location.search;
  console.log(query);
  const getReq = new XMLHttpRequest();
  getReq.open("GET", `http://localhost:9000/findtransactions${query}`, false);
  getReq.setRequestHeader("Content-Type", "application/json");
  getReq.send();
  const response = JSON.parse(getReq.response);
  console.log(response);

  let insertTransactions = "";
  let insertName = "";
  let insertTransactionNum = "";
  let insertTransactionType = "";
  let insertTransactionAmount = "";
  response.forEach((trans) => {
    insertTransactions += `<div class="transaction-data-js js-transaction-date">${trans.date} </div>`;
    insertName += `<div class="transaction-data-js js-transaction-description"> ${trans.description}</div>`;
    insertTransactionNum += `<div class="transaction-data-js js-transaction-number">${trans.transaction_number}</div>`;
    insertTransactionType += `<div class="transaction-data-js js-transaction-type">${trans.type}</div>`;
    insertTransactionAmount += `<div class="transaction-data-js js-transaction-amount"> € ${trans.amount},-</div>`;
  });

  insertDate.innerHTML = insertTransactions;
  insertDescription.innerHTML = insertName;
  transactionNum.innerHTML = insertTransactionNum;
  typeTrans.innerHTML = insertTransactionType;
  transactionAmount.innerHTML = insertTransactionAmount;

  calculateFinance(response);
};

const calculateFinance = (response) => {
  let revenue = 0;
  let purchase = 0;
  let profitloss = 0;

  response.forEach((calc) => {
    if (calc.type === "Income") {
      revenue += calc.amount;
    } else if (calc.type === "Purchase") {
      purchase += calc.amount;
    }
  });

  profitloss = revenue - purchase;
  let res = Math.round(profitloss * 100) / 100;

  console.log(revenue);
  console.log(purchase);
  revenueCalculation.innerHTML = ` € ${revenue} ,-`;
  purchaseCalculation.innerHTML = ` € ${purchase} ,-`;
  profitLoss.innerHTML = ` € ${res}`;

  if (profitloss > 0) {
    profitLosStyle.style.color = "green";
  } else if (profitloss < 0) {
    profitLosStyle.style.color = "red";
  }
};

const toggleMenuList = () => {
  hbModalMenuList.classList.toggle("menu-toggle");
};

getTransactions();

//Deze functie haalt alle waardes op van de invulvelden
const getInputValues = () => {
  const inputDate = document.getElementById("date").value;
  const inputCompanyName = document.getElementById("cpName").value;
  const inputTransNumber = document.getElementById("trans-numb").value;
  const inputAmount = document.getElementById("amount").value;
  const inputTranscationType =
    document.getElementById("transaction-type").value;

  console.log(inputDate);
  console.log(inputCompanyName);
  console.log(inputTransNumber);
  console.log(inputAmount);
  console.log(inputTranscationType);

  return {
    inputDate,
    inputCompanyName,
    inputTransNumber,
    inputAmount,
    inputTranscationType,
  };
};

//Deze Functie neemt alle waardes en stuurt deze naar de server
const setTransaction = () => {
  const xmhttpReq = new XMLHttpRequest();
  xmhttpReq.open("POST", "http://localhost:9000/bills", false);
  xmhttpReq.setRequestHeader("Content-Type", "application/json");

  const values = getInputValues();

  console.log(values);

  const {
    inputDate,
    inputCompanyName,
    inputTransNumber,
    inputAmount,
    inputTranscationType,
  } = values;

  console.log(inputDate);

  xmhttpReq.send(
    JSON.stringify({
      date: inputDate,
      name: inputCompanyName,
      transaction_num: inputTransNumber,
      amount: Number(inputAmount),
      transcationType: inputTranscationType,
    })
  );
};

submitTransactionBtn.addEventListener("click", () => {
  addTransactionModal.classList.toggle("add-trans-visible");
  setTransaction();
  getTransactions();
});

hbMenu.addEventListener("click", () => {
  console.log("Menu Open");
  hbMenuOpen.classList.toggle("sidebar--toggle");
  modalBG.classList.toggle("modal-menu");
  toggleMenuList();
});

addTransactionBtn.addEventListener("click", () => {
  console.log("Add Tranaction Button Worked");
  addTransactionModal.classList.toggle("add-trans-visible");
});

addTransactionModalClose.addEventListener("click", () => {
  addTransactionModal.classList.toggle("add-trans-visible");
});