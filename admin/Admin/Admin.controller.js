const {
  adminLogin,
  addProjectRequisition,
  addMaterialsDetails,
  updateStatus,
  getRequisitions,
  getAllRequisitionDetails,
  deleteRequisitionService,
  supplierQuoteDetailsService,
  submitQuoteService,
  quotationProjectService,
  quotationItemService,
  companyDetailsService,
  orderDetailsService,
  createOrderService,
  getOrdersService,
  getprojectOrderService,
  getOrderMaterialService,
  getQuoteDetailsService,
  updateQuotePriceService,
} = require("./Admin.service");
const { generateUniqueId } = require("./utils/GenerateId");
const fs = require("fs");
const nodemailer = require("nodemailer");
const { sign } = require("jsonwebtoken");

module.exports = {
  checkLogin: (req, res) => {
    console.log("Hello");
    const data = req.body;
    adminLogin(data, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Invalid Request",
        });
      }
      if (results.length === 0) {
        return res.status(300).json({
          success: 0,
          message: "Invalid Email",
        });
      }
      if (data.password === results[0].password) {
        results[0].password = undefined;
        const jsontoken = sign(
          { result: results[0] },
          process.env.WEBTOKEN_KEY,
          {
            expiresIn: "3h",
          }
        );
        return res.status(200).json({
          success: 1,
          token: jsontoken,
          message: "Logged In Successfully",
        });
      }
      return res.status(500).json({
        success: 0,
        message: "Invalid Password",
      });
    });
  },

  addNewProjectRequisition: (req, res) => {
    const projectId = generateUniqueId();

    const data = { ...req.body, projectId };

    addProjectRequisition(data, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Bad Request",
        });
      }
      return res.status(200).json({
        success: 1,
        message: "Added Successfully",
        projectId: projectId,
      });
    });
  },

  addMaterialDetailsController: (req, res) => {
    const data = req.body;
    addMaterialsDetails(data, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Bad Request",
        });
      }
      return res.status(200).json({
        success: 1,
        message: "Added Successfully",
        materials: results,
      });
    });
  },

  updateProjectStatus: (req, res) => {
    const data = req.params;
    updateStatus(data, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Bad Request",
        });
      }
      console.log(results);
      return res.status(200).json({
        success: 1,
        message: "Updated Successfully",
      });
    });
  },

  getAllRequisitions: (req, res) => {
    const data = req.params;
    getRequisitions(data, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Bad Request",
        });
      }
      return res.status(200).json({
        success: 1,
        materials: results,
      });
    });
  },

  getAllRequisitionsData: (req, res) => {
    const data = req.body;
    console.log("Api Called");
    console.log(data);
    getAllRequisitionDetails(data, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Bad Request",
        });
      }
      return res.status(200).json({
        success: 1,
        requisitions: results,
      });
    });
  },

  deleteRequisition: (req, res) => {
    const data = req.params;
    deleteRequisitionService(data, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Internal Server Error",
        });
      }
      return res.status(200).json({
        success: 1,
        message: "Requisition Deleted Successfully",
      });
    });
  },

  sentEmail: (req, res) => {
    const { emailDetails, mailBody, subject } = req.body;
    console.log(req.body);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "",
        pass: "",
      },
    });

    const message = {
      from: "your-email-address",
      to: emailDetails,
      subject: subject,
      html: mailBody,
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: 0,
          message: "Bad Request",
        });
      } else {
        console.log(info);
      }
    });
    return res.status(200).json({
      success: 1,
      message: "Mail Sent Successfully",
    });
  },

  tokenValidationSuccessful: (req, res) => {
    return res.status(200).json({
      success: 1,
      message: "Token Successfully Matched",
    });
  },

  supplierQuoteDetailsController: (req, res) => {
    const data = req.body;
    supplierQuoteDetailsService(data, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Internal Server Error",
        });
      }
      return res.status(200).json({
        success: 1,
        insertId: results,
      });
    });
  },

  submitQuoteController: (req, res) => {
    const data = req.body;
    console.log(data);
    submitQuoteService(data, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Bad Request",
        });
      }
      return res.status(200).json({
        success: 1,
        message: "Data Inserted Successfully",
      });
    });
  },

  getQuotationProjectController: (req, res) => {
    quotationProjectService((err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Internal Server Error",
        });
      }
      return res.status(200).json({
        success: 1,
        projects: results,
      });
    });
  },

  getQuotationItemController: (req, res) => {
    const data = req.params;
    quotationItemService(data, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Internal Server Error",
        });
      }
      return res.status(200).json({
        success: 1,
        details: results,
      });
    });
  },

  getCompanyDetails: (req, res) => {
    const data = req.params;
    companyDetailsService(data, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Internal Server Error",
        });
      }
      return res.status(200).json({
        success: 1,
        details: results,
      });
    });
  },

  createOrderController: (req, res) => {
    const data = req.body;
    createOrderService(data, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Internal Server Error",
        });
      }
      return res.status(200).json({
        success: 1,
        orderId: results.insertId,
      });
    });
  },

  orderDetailsController: (req, res) => {
    const data = req.body;
    orderDetailsService(data, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Internal Server Error",
        });
      }
      return res.status(200).json({
        success: 1,
        message: "Order Successfull",
      });
    });
  },

  getOrdersController: (req, res) => {
    getOrdersService((err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Internal Server Error",
        });
      }
      return res.status(200).json({
        success: 1,
        results: results,
      });
    });
  },

  getOrderProjectDetails: (req, res) => {
    const data = req.params;
    getprojectOrderService(data, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Internal Server Error",
        });
      }
      return res.status(200).json({
        success: 1,
        results: results,
      });
    });
  },

  getOrderedMaterials: (req, res) => {
    const data = req.params;
    getOrderMaterialService(data, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Internal Server Error",
        });
      }
      return res.status(200).json({
        success: 1,
        results: results,
      });
    });
  },

  getQuoteDetails: (req, res) => {
    const { id } = req.params;
    getQuoteDetailsService(id, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Internal Server Error",
        });
      }
      return res.status(200).json({
        success: 1,
        results: results,
      });
    });
  },

  updateQuotePrice: async (req, res) => {
    const data = req.body.itemDetails;
    for (const item of data) {
      try {
        await updateQuotePriceService(item, req.body.id);
        console.log(`Updated unitprice for ID ${item.id}`);
      } catch (error) {
        console.error(
          `Error updating unitprice for ID ${item.id}: ${error.message}`
        );
      }
    }
    return res.status(200).json({
      success: 1,
      message: "Updated Successfully",
    });
  },
};
