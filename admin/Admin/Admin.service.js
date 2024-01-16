const pool = require("../config/database");

module.exports = {
  adminLogin: (data, adminLoginCallback) => {
    pool.query(
      `Select * From admin where email = ?`,
      [data.email],
      (err, results, fields) => {
        if (err) return adminLoginCallback(err);
        return adminLoginCallback(null, results);
      }
    );
  },

  addProjectRequisition: (data, addRequisitionCallback) => {
    pool.query(
      `Insert into project(projectId, toName, name, subject, remarks, status) values(?,?,?,?,?,?)`,
      [
        data.projectId,
        data.toName,
        data.name,
        data.subject,
        data.remarks,
        "Pending",
      ],
      (err, results, fields) => {
        if (err) return addRequisitionCallback(err);
        return addRequisitionCallback(err, results);
      }
    );
  },

  addMaterialsDetails: (data, addMaterialDetailsCallback) => {
    pool.query(
      `Insert into requisitions(description, size, quantity, projectId) values ?`,
      [
        data.materials.map((requisition) => [
          requisition.description,
          requisition.size,
          requisition.quantity,
          data.projectId,
        ]),
      ],
      (err, results, fields) => {
        if (err) return addMaterialDetailsCallback(err);
        return addMaterialDetailsCallback(null, results);
      }
    );
  },

  updateStatus: (data, updateStatusCallback) => {
    pool.query(
      `Update project set status = ? where projectId = ? `,
      ["Approved", data.projectId],
      (err, results, fields) => {
        if (err) return updateStatusCallback(err);
        return updateStatusCallback(null, results);
      }
    );
  },

  getRequisitions: (data, getAllRequisitionsCallback) => {
    pool.query(
      `Select * From requisitions where projectId = ?`,
      [data.projectId],
      (err, results, fields) => {
        if (err) return getAllRequisitionsCallback(err);
        return getAllRequisitionsCallback(null, results);
      }
    );
  },

  getAllRequisitionDetails: (data, getAllRequisitionsDataCallback) => {
    pool.query(
      `Select * From project where status In(?)`,
      [data.status],
      (err, results, fields) => {
        if (err) getAllRequisitionsDataCallback(err);
        return getAllRequisitionsDataCallback(null, results);
      }
    );
  },

  deleteRequisitionService: (data, deleteRequisitionCallback) => {
    pool.query(
      `Delete From project where projectId = ?`,
      [data.projectId],
      (err, results, fields) => {
        if (err) deleteRequisitionCallback(err);
        deleteRequisitionCallback(null, results);
      }
    );
  },

  supplierQuoteDetailsService: (
    data,
    supplierQuoteDetailsControllerCallback
  ) => {
    pool.query(
      `Insert into supplierquote(name,email,company,country,address,message,mobile) values(?,?,?,?,?,?,?)`,
      [
        data.name,
        data.email,
        data.company,
        data.country,
        data.address,
        data.message,
        data.mobile,
      ],
      (err, results, fields) => {
        if (err) return supplierQuoteDetailsControllerCallback(err);
        console.log(results);
        return supplierQuoteDetailsControllerCallback(null, results.insertId);
      }
    );
  },

  submitQuoteService: (data, submitQuoteControllerCallback) => {
    pool.query(
      `Insert into supplierquotedetails(itemId,id,unitPrice,projectId) values ?`,
      [
        data.quote.map((details) => [
          details.itemId,
          details.id,
          details.unitPrice,
          details.projectId,
        ]),
      ],
      (err, results, fields) => {
        if (err) return submitQuoteControllerCallback(err);
        return submitQuoteControllerCallback(null);
      }
    );
  },

  quotationProjectService: (quotationProjectCallback) => {
    pool.query(
      `Select projectId,name,subject,status from project where projectId In
      (Select distinct projectId from supplierquotedetails)`,
      [],
      (err, results, fields) => {
        if (err) return quotationProjectCallback(err);
        return quotationProjectCallback(null, results);
      }
    );
  },

  quotationItemService: (data, quotationItemCallback) => {
    pool.query(
      `Select requisitions.itemId as itemId, id, description, quantity, size, unitPrice from 
        supplierquotedetails,requisitions 
        where supplierquotedetails.projectId = ? and requisitions.itemId = supplierquotedetails.itemId 
        order by id desc`,
      [data.projectId],
      (err, results, fields) => {
        if (err) quotationItemCallback(err);
        quotationItemCallback(null, results);
      }
    );
  },

  companyDetailsService: (data, companyDetailsCallback) => {
    pool.query(
      `Select * From supplierquote where id = ?`,
      [data.id],
      (err, results, fields) => {
        if (err) return companyDetailsCallback(err);
        return companyDetailsCallback(err, results);
      }
    );
  },

  createOrderService: (data, createOrderCallback) => {
    pool.query(
      `Insert into orders(id) values(?)`,
      [data.id],
      (err, results, fields) => {
        if (err) return createOrderCallback(err);
        return createOrderCallback(null, results);
      }
    );
  },

  orderDetailsService: (data, orderDetailsCallback) => {
    pool.query(
      `Insert into orderdetails(description,quantity,size,unitPrice,orderId,itemId) values ?`,
      [
        data.materials.map((requisition) => [
          requisition.description,
          requisition.quantity,
          requisition.size,
          requisition.unitPrice,
          data.orderId,
          requisition.itemId,
        ]),
      ],
      (err, results, fields) => {
        if (err) return orderDetailsCallback(err);
        return orderDetailsCallback(null, results);
      }
    );
  },

  getOrdersService: (orderCallback) => {
    pool.query(
      `Select orderId,orderTime,name,email,company,mobile,address,message,country,orders.id from orders,
      (Select * from supplierquote) as temp 
      where orderId In (Select distinct(orderId) from orderdetails) and temp.id = orders.id
      `,
      [],
      (err, results, fields) => {
        if (err) return orderCallback(err);
        return orderCallback(null, results);
      }
    );
  },

  getprojectOrderService: (data, quotationProjectCallback) => {
    pool.query(
      `Select * from project where projectId In
      (Select distinct projectId from supplierquotedetails where id = ?)`,
      [data.id],
      (err, results, fields) => {
        if (err) return quotationProjectCallback(err);
        return quotationProjectCallback(null, results);
      }
    );
  },

  getOrderMaterialService: (data, getMaterialsCallback) => {
    pool.query(
      `Select * From orderdetails where orderId = ?`,
      [data.orderId],
      (err, results, fields) => {
        if (err) return getMaterialsCallback(err);
        return getMaterialsCallback(null, results);
      }
    );
  },

  getQuoteDetailsService: (data, getQuoteDetailsCallback) => {
    pool.query(
      `Select r.itemId, unitPrice, description, size, quantity From requisitions r, supplierquoteDetails s where r.itemId = s.itemId and id = ?`,
      [data],
      (err, results, fields) => {
        if (err) getQuoteDetailsCallback(err);
        return getQuoteDetailsCallback(null, results);
      }
    );
  },

  updateQuotePriceService: (data, id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `Update supplierquoteDetails set unitPrice = ? where itemId = ? and id = ?`,
        [data.unitPrice, data.itemId, id],
        (err, results, fields) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
  },
};
