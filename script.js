`use strict`;

/////////////////////////////////////////////////////
// Data
/////////////////////////////////////////////////////

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Banks",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////////
// Init
/////////////////////////////////////////////////////

//Global Variables
let currentAccount;
let sort = false;

//Create Usernames
for (const el of accounts) {
  el.username = el.owner
    .split(` `)
    .map((el) => el[0])
    .join(``);
}

accounts.forEach((element) => {
  console.log(
    `Account - username: ${element.username}, password: ${element.pin}`
  );
});

/////////////////////////////////////////////////////
// HTML Elements Select
/////////////////////////////////////////////////////

const welcomeMsg = document.querySelector(`.welcome`);
const usernameIn = document.querySelector(`.login__input--user`);
const usernamePinIn = document.querySelector(`.login__input--pin`);
const loginBtn = document.querySelector(`.login__btn`);
const balanceDisplay = document.querySelector(`.balance__value`);
const movementsType = document.querySelector(`.movements__type`);
const movementsDate = document.querySelector(`.movements__date`);
const movementsValue = document.querySelector(`.movements__value`);
const summaryValueIn = document.querySelector(`.summary__value--in`);
const summaryValueOut = document.querySelector(`.summary__value--out`);
const summaryValueInterest = document.querySelector(
  `.summary__value--interest`
);
const sortMovementsBtn = document.querySelector(`.btn--sort`);
const transferToIn = document.querySelector(`.form__input--to`);
const transferAmountIn = document.querySelector(`.form__input--amount`);
const transferBtn = document.querySelector(`.form__btn--transfer`);
const loanAmountIn = document.querySelector(`.form__input--loan-amount`);
const loanBtn = document.querySelector(`.form__btn--loan`);
const closeAccountUsernameIn = document.querySelector(`.form__input--user`);
const closeAccountUsernamePinIn = document.querySelector(`.form__input--pin`);
const closeAccountBtn = document.querySelector(`.form__btn--close`);
const appElement = document.querySelector(`.app`);
const containerMovements = document.querySelector(`.movements`);
const logoutBtn = document.querySelector(`.logout__btn`);

/////////////////////////////////////////////////////
// Event Handlers
/////////////////////////////////////////////////////

//Login User
loginBtn.addEventListener(`click`, function (e) {
  e.preventDefault();

  for (const el of accounts) {
    if (
      el.username === usernameIn.value &&
      el.pin === Number(usernamePinIn.value)
    ) {
      currentAccount = el;
      welcomeMsg.textContent = `Welcome back ${
        currentAccount.owner.split(` `)[0]
      }`;
      appElement.style.opacity = 100;
      updateUI(currentAccount);
      break;
    }
  }

  if (!currentAccount) alert(`Incorrect Data`);
  clearFields([usernameIn, usernamePinIn]);
});

//Transfer Event
transferBtn.addEventListener(`click`, function (e) {
  e.preventDefault();
  const balance = calcBalance(currentAccount);
  const amount = Number(transferAmountIn.value);
  const toAccount = accounts.find((el) => el.username === transferToIn.value);
  if (
    amount &&
    amount <= balance &&
    toAccount &&
    currentAccount.username !== toAccount.username
  ) {
    toAccount.movements.push(amount);
    currentAccount.movements.push(-amount);
    updateUI(currentAccount);
  } else {
    alert(`Incorrect data`);
  }
  clearFields([transferToIn, transferAmountIn]);
});

//Loan Event
loanBtn.addEventListener(`click`, function (e) {
  e.preventDefault();
  const amount = Number(loanAmountIn.value);
  if (amount > 0) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  clearFields([loanAmountIn]);
});

//Sort Event
sortMovementsBtn.addEventListener(`click`, function () {
  sort = sort === false ? true : false;
  insertHTMLMovements();
});

//Close Account
closeAccountBtn.addEventListener(`click`, function (e) {
  e.preventDefault();
  if (
    closeAccountUsernameIn.value === currentAccount.username &&
    Number(closeAccountUsernamePinIn.value) === currentAccount.pin
  ) {
    if (prompt(`Are you sure? Type YES`) === `YES`) {
      const index = accounts.findIndex(
        (el) => el.username === currentAccount.username
      );
      accounts.splice(index, 1);
      logout();
    }
  } else {
    alert(`Incorrect Data`);
  }
  clearFields([closeAccountUsernameIn, closeAccountUsernamePinIn]);
});

//Logout Event
logoutBtn.addEventListener(`click`, function (e) {
  e.preventDefault();
  logout();
});

/////////////////////////////////////////////////////
// Functions
/////////////////////////////////////////////////////

function updateUI(currentAccount) {
  balanceDisplay.textContent = `${calcBalance(currentAccount)}€`;
  summaryValueIn.textContent = `${calcSummaryIn(currentAccount)}€`;
  summaryValueOut.textContent = `${calcSummaryOut(currentAccount)}€`;
  summaryValueInterest.textContent = `${calcSummaryInterest(currentAccount)}€`;
  insertHTMLMovements();
}

function insertHTMLMovements() {
  containerMovements.textContent = ``;
  let movementsSort = sort
    ? currentAccount.movements.slice().sort((a, b) => a - b)
    : currentAccount.movements;
  for (const el of movementsSort) {
    const transaction = el > 0 ? `deposit` : `withdrawal`;
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${transaction}">${transaction}</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${el}€</div>
    </div>;`;
    containerMovements.insertAdjacentHTML(`afterbegin`, html);
  }
}

function clearFields(elementsArray) {
  for (const el of elementsArray) {
    el.value = ``;
  }
}

function calcBalance(account) {
  return account.movements.reduce((acc, el) => (acc += el), 0);
}

function calcSummaryIn(account) {
  return account.movements
    .filter((el) => el > 0)
    .reduce((acc, el) => (acc += el), 0);
}

function calcSummaryOut(account) {
  return account.movements
    .filter((el) => el < 0)
    .reduce((acc, el) => (acc += el), 0);
}

function calcSummaryInterest(account) {
  return account.movements
    .filter((el) => el > 0)
    .map((el) => (el * account.interestRate) / 100)
    .filter((el) => el >= 1)
    .reduce((acc, el) => (acc += el), 0);
}

function logout() {
  appElement.style.opacity = 0;
  welcomeMsg.textContent = `Log in to get started`;
  currentAccount = undefined;
}
