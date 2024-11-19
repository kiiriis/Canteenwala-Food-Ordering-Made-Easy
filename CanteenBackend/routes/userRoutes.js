const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authentication");
const userController = require("../controllers/user");

router
  .route("/")
  .get(
    authMiddleware.authenticateUser,
    authMiddleware.authorizePermissions("admin"),
    userController.getAllUsers
  );

router
  .route("/showMe")
  .get(authMiddleware.authenticateUser, userController.showCurrentUser); //authMiddleware.authenticateUser checks for cookies

router
  .route("/updateUser")
  .patch(authMiddleware.authenticateUser, userController.updateUser);

router
  .route("/updateUserPassword")
  .patch(authMiddleware.authenticateUser, userController.updateUserPassword);

router
  .route("/:id")
  .get(authMiddleware.authenticateUser, userController.getSingleUser);

module.exports = router;
