const Router = require("express");
const userControllers = require("../controllers/userControllers");
const router = new Router();

router.get("/get", userControllers.getAll);
router.get("/get/:id", userControllers.getOne);
router.post("/registration", userControllers.registration);
router.post("/login", userControllers.login);
router.get("/manager", userControllers.getManager);
router.get("/responsible/:manager", userControllers.getResponsible);

module.exports = router;
