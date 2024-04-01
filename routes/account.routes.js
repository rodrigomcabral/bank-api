import express from "express";
import accountController from "../controllers/account.controller.js";

//this endpoint will make modifications at account.js
//before insertions: 1 we read; 2 make space in memory for it; 3 push into the array; 4 save the file

const router = express.Router();

//deliver the request to the controllers
router.post("/", accountController.createAccount);
router.get("/", accountController.getAccounts);
router.get("/:id", accountController.getAccount);
router.delete("/:id", accountController.deleteAccount);
router.put("/", accountController.updateAccount);
router.patch("/updateBalance", accountController.updateBalance);

//treating errors among all the endpoints
router.use((error, req, res, next) => {
  global.logger.error(`${req.method} ${req.baseUrl} ${error.message}`);
  console.log(error);
  res.status(400).send({ error: error.message });
});

export default router;
