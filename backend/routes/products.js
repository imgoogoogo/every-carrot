const router = require("express").Router();
const { authenticate } = require("../middleware/auth");
const { uploadProduct } = require("../middleware/upload");
const getProducts = require("../products/getProducts");
const createProduct = require("../products/createProduct");
const getMyProducts = require("../products/getMyProducts");
const getProduct = require("../products/getProduct");
const updateProduct = require("../products/updateProduct");
const deleteProduct = require("../products/deleteProduct");
const updateProductStatus = require("../products/updateProductStatus");

router.get("/", getProducts);
router.post("/", authenticate, uploadProduct.single("images", 5), createProduct);
// /me 는 반드시 /:id 보다 앞에 선언해야 함
router.get("/me", authenticate, getMyProducts);
router.get("/:id", getProduct);
router.put("/:id", authenticate, uploadProduct.single("images", 5), updateProduct);
router.delete("/:id", authenticate, deleteProduct);
router.patch("/:id/status", authenticate, updateProductStatus);

module.exports = router;
