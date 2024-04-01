import accountServices from "../services/account.service.js";

////POST method: create data
async function createAccount(req, res, next) {
  //consume the req printing the parameters and saving
  try {
    let account = req.body;

    //validate before inserction and send to the services to handle
    if (account.id !== undefined) {
      throw new Error("the ids are generated automatically.");
    }

    if (!account.name || account.balance == null) {
      throw new Error("Name and Balance are mandatory!");
    }

    //await bc the function called is async in service
    account = await accountServices.createAccount(account);

    //responde the client
    res.send(account);

    logger.info(`POST /account - ${JSON.stringify(account)}`);
  } catch (error) {
    //res.status(400).send({ error: error.mesage });
    //using next as a param
    next(error);
  }
}

//GET method: gets data
async function getAccounts(req, res, next) {
  try {
    res.send(await accountServices.getAccounts());

    logger.info(`GET /account`);
  } catch (error) {
    next(error);
  }
}

//get the account by its id
async function getAccount(req, res, next) {
  try {
    res.send(await accountServices.getAccount(req.params.id));

    logger.info(`GET /account/:id`);
  } catch (error) {
    next(error);
  }
}

//delete the account by its id
async function deleteAccount(req, res, next) {
  try {
    await accountServices.deleteAccount(req.params.id);
    res.end();

    logger.info(`DELETE /account/id - ${req.params.id}`);
  } catch (error) {
    next(error);
  }
}

//PUT method: update full data
async function updateAccount(req, res, next) {
  try {
    const account = req.body;

    if (!account.id || !account.name || account.balance == null) {
      throw new Error("Id, Name and Balance are mandatory!");
    }

    res.send(await accountServices.updateAccount(account));

    logger.info(`PUT /account - ${JSON.stringify(account)}`);
  } catch (error) {
    next(error);
  }
}

//PATCH method: updates partial data
async function updateBalance(req, res, next) {
  try {
    const account = req.body;

    if (!account.id || account.balance == null) {
      throw new Error("Id and Balance are mandatory");
    }
    account.balance = parseInt(account.balance);

    res.send(await accountServices.updateBalance(account));

    logger.info(`PATCH /account/updatedBalance - ${JSON.stringify(account)}`);
  } catch (error) {
    next(error);
  }
}

export default {
  createAccount,
  getAccounts,
  getAccount,
  deleteAccount,
  updateAccount,
  updateBalance,
};
