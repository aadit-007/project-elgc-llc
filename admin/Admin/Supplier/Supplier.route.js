const {
  addNewSupplier,
  getSupplierDetails,
  getSupplierCompanyFile,
  getSupplierEmails,
  deleteSupplierDetails,
  updateSupplierDetails,
  getCurrentSupplier,
} = require("./Supplier.controller");

const router = require("express").Router();

router.post("/addNewSupplier", addNewSupplier);
router.get("/getSupplierDetails", getSupplierDetails);
router.get("/getSupplierCompanyFile/:fileName", getSupplierCompanyFile);
router.get("/getSupplierEmails", getSupplierEmails);
router.post("/deleteSupplierDetails", deleteSupplierDetails);
router.post("/updateSupplierDetails", updateSupplierDetails);
router.get("/getSupplier/:supplierId", getCurrentSupplier);

module.exports = router;
