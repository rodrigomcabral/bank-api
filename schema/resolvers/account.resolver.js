//insert a new account
import { promises as fs } from "fs";

const { readFile, writeFile } = fs;

async function createAccount(account) {
  const data = await readFile("accounts.json");
  //console.log(data); // comes the memory space;
  //PARSE converts string (raw data) to object
  const jsonData = JSON.parse(data);
  console.log(jsonData);

  account = {
    id: jsonData.nextId,
    name: account.name,
    balance: account.balance,
  };
  jsonData.nextId++;

  jsonData.accounts.push(account);
  //stringify converts objects to string
  await writeFile("accounts.json", JSON.stringify(jsonData, null, 2));

  //we return the account to be received at controller
  return account;
}

async function getAccounts() {
  const data = await readFile("accounts.json");
  const jsonData = JSON.parse(data);

  //before giving back the response we delete the property nextId of the object
  delete jsonData.nextId;
  return jsonData;
}

async function getAccount(id) {
  const data = await readFile("accounts.json");
  const jsonData = JSON.parse(data);
  const account = jsonData.accounts.find((account) => {
    //get the id passed in the url => parseInt converts from string to number
    account.id === parseInt(id);
  });
  return account;
}

async function deleteAccount(id) {
  const data = await readFile("accounts.json");
  const jsonData = JSON.parse(data); // Parse JSON data into an object
  // Filter out the account with the given id
  jsonData.accounts = jsonData.accounts.filter(
    (account) => account.id !== parseInt(id)
  );
  // Write the updated data back to accounts.json
  await writeFile("accounts.json", JSON.stringify(jsonData, null, 2));
}

async function updateAccount(account) {
  const data = await readFile("accounts.json");
  const jsonData = JSON.parse(data);
  //bring the index by it's id
  const index = jsonData.accounts.findIndex((a) => a.id === account.id);

  //if we dont find the id: -1
  if (index === -1) {
    throw new Error("The registration was not found");
  }

  //when we find the id execute the followed
  jsonData.accounts[index].name = account.name;
  jsonData.accounts[index].balance = account.name;

  await writeFile("accounts.json", JSON.stringify(jsonData, null, 2));
  return jsonData.accounts[index];
}

async function updateBalance(account) {
  const data = await readFile("accounts.json");
  const jsonData = JSON.parse(data);

  const index = jsonData.accounts.findIndex((a) => a.id === account.id);

  if (index === -1) {
    throw new Error("The registration was not found");
  }
  jsonData.accounts[index].balance = account.balance;

  await writeFile("accounts.json", JSON.stringify(jsonData, null, 2));

  return jsonData.accounts[index];
}

export default {
  createAccount,
  getAccounts,
  getAccount,
  deleteAccount,
  updateAccount,
  updateBalance,
};
