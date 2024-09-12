const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menu-controller");

router.get("/admin/:id", menuController.getMenuItems);
router.post("/admin", menuController.addMenuItem);
router.put("/admin/:id", menuController.updateMenuItem);

//user menu routes
// router.get("/", menuController.getAdmins);
// router.post("/", menuController.addCompanyAdmin);
// router.put("/:id", menuController.updateAdmins);

module.exports = router;
