const router = require("express").Router();
const authenticate = require("../middleware/auth");
const { uploadProfile } = require("../middleware/upload");
const getMyProfile = require("../users/getMyProfile");
const updateMyProfile = require("../users/updateMyProfile");
const getUserProfile = require("../users/getUserProfile");

router.get("/me", authenticate, getMyProfile);
router.put("/me", authenticate, uploadProfile.single("profile_image"), updateMyProfile);
router.get("/:id", getUserProfile);

module.exports = router;
