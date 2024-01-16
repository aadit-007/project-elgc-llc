const {
  addSupplier,
  supplierDetails,
  supplierEmails,
  deleteSupplier,
  updateSupplier,
  getSupplier,
} = require("./Supplier.service");

const { generateUniqueId } = require("../utils/GenerateId");

const fs = require("fs");

module.exports = {
  addNewSupplier: (req, res) => {
    const supplierId = generateUniqueId();
    const files = req.files.company_details;
    const fileNames = [];
    files.forEach((file, index) => {
      const uploadPath =
        __dirname + "/uploads/" + supplierId + index + "_" + file.name;
      fileNames.push(uploadPath);
      file.mv(uploadPath, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: 0,
            message: "Unable To Upload File",
          });
        }
      });
    });

    const data = { ...req.body, supplierId: supplierId, fileNames: fileNames };
    console.log(data);
    addSupplier(data, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Bad Request",
        });
      }
      return res.status(200).json({
        success: 1,
        supplierId,
        fileNames,
      });
    });
  },

  getSupplierDetails: (req, res) => {
    supplierDetails((err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Bad Request",
        });
      }
      return res.status(200).json({
        success: 1,
        suppliers: results,
      });
    });
  },

  getSupplierCompanyFile: (req, res) => {
    const data = req.params;
    const path = __dirname + "/uploads/" + data.fileName;
    console.log(path);
    if (fs.existsSync(path)) {
      return res.sendFile(path);
    }
    return res.status(500).json({
      success: 0,
      message: "FileName not exist",
    });
  },

  getSupplierEmails: (req, res) => {
    supplierEmails((err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Server Error",
        });
      }
      return res.status(200).json({
        success: 1,
        emails: results,
      });
    });
  },

  deleteSupplierDetails: (req, res) => {
   
    const { supplierId, fileName } = req.body;

    deleteSupplier(supplierId, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Bad Request",
        });
      }
      fileName.map((currFileName, index) => {
        const temp =
          __dirname +
          "/uploads/" +
          supplierId +
          index +
          "_" +
          currFileName.substring(
            currFileName.indexOf("_"),
            currFileName.length
          );
        console.log(temp);
        if (fs.existsSync(temp)) {
          fs.unlink(temp, (err) => {
            if (err)
              return res.status(200).json({
                success: 0,
                message: "Records Deleted Successfully error in deleting files",
              });
          });
        }
      });
      console.log("abc");
      return res.status(200).json({
        success: 0,
        message: "Supplier Deleted Successfully",
      });
    });
  },

  updateSupplierDetails: (req, res) => {
    const data = req.body;
    console.log("update supplier details");
    updateSupplier(data, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Bad Request",
        });
      }
      return res.status(200).json({
        success: 1,
        message: "Updated Record Successfully",
      });
    });
  },

  getCurrentSupplier: (req, res) => {
    const data = req.params.supplierId;
    getSupplier(data, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Bad Request",
        });
      }
      return res.status(200).json({
        success: 1,
        results,
      });
    });
  },
};
