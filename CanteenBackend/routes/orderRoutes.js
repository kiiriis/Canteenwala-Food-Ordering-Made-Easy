const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order");
const authController = require("../middleware/authentication");

router
  .route("/")
  .get(
    authController.authenticateUser,
    authController.authorizePermissions("admin"), //Passing an array of roles that are authorized to view
    orderController.getAllOrders // get all orders if the role is admin
  )
  .post(authController.authenticateUser, orderController.createOrder);

router
  .route("/myOrders")
  .get(authController.authenticateUser, orderController.getCurrentUserOrders);

router
  .route("/:id")
  .get(authController.authenticateUser, orderController.getSingleOrder)
  .patch(
    authController.authenticateUser,
    authController.authorizePermissions("admin"),
    orderController.updateOrder
  );

module.exports = router;
