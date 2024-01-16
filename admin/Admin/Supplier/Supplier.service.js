const pool = require("../../config/database");
const { connect } = require("../Admin.route");

module.exports = {
  addSupplier: (data, addNewSupplierCallback) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return addNewSupplierCallback(err);
      }

      connection.beginTransaction((err) => {
        if (err) {
          connection.release();
          return addNewSupplierCallback(err);
        }

        const query1 =
          "Insert into Supplier(name,email,phone,company_name,country_name,address,supplierId) values(?,?,?,?,?,?,?)";
        const query2 =
          "Insert into SupplierFiles(supplierId, fileName) values ?";

        connection.query(
          query1,
          [
            data.name,
            data.email,
            data.phone,
            data.company_name,
            data.country_name,
            data.address,
            data.supplierId,
          ],
          (err, results) => {
            if (err) {
              connection.rollback(() => {
                connection.release();
                return addNewSupplierCallback(err);
              });
            }

            connection.query(
              query2,
              [data.fileNames.map((fileName) => [data.supplierId, fileName])],
              (err, results) => {
                if (err) {
                  connection.rollback(() => {
                    connection.release();
                    return addNewSupplierCallback(err);
                  });
                } else {
                  connection.commit((err) => {
                    if (err) {
                      connection.rollback(() => {
                        connection.release();
                        return addNewSupplierCallback(err);
                      });
                    } else {
                      connection.release();
                      addNewSupplierCallback(null, results);
                    }
                  });
                }
              }
            );
          }
        );
      });
    });
  },

  supplierDetails: (getSupplierDetailsCallback) => {
    pool.query(
      `Select name, email, phone, company_name, country_name, address, fileName,supplier.supplierId 
       from supplier, supplierfiles where supplier.supplierId = supplierFiles.supplierId; 
    `,
      [],
      (err, results, fields) => {
        if (err) return getSupplierDetailsCallback(err);
        return getSupplierDetailsCallback(null, results);
      }
    );
  },

  supplierEmails: (getSupplierEmailsCallback) => {
    pool.query(`Select email from supplier`, [], (err, results, fields) => {
      if (err) return getSupplierEmailsCallback(err);
      return getSupplierEmailsCallback(null, results);
    });
  },

  deleteSupplier: (supplierId, deleteSupplierCallback) => {
    pool.query(
      `Delete from supplier where supplierId = ?`,
      [supplierId],
      (err, results, fields) => {
        if (err) return deleteSupplierCallback(err);
        return deleteSupplierCallback(null, results);
      }
    );
  },

  updateSupplier: (data, updateSupplierDetailsCallback) => {
    pool.query(
      `Update supplier set name = ?, email = ?, phone = ?, company_name = ?, country_name = ?, address=? 
          where supplierId = ?`,
      [
        data.name,
        data.email,
        data.phone,
        data.company_name,
        data.country_name,
        data.address,
        data.supplierId,
      ],
      (err, results, fields) => {
        if (err) updateSupplierDetailsCallback(err);
        updateSupplierDetailsCallback(null, results);
      }
    );
  },

  getSupplier: (supplierId, getSupplierCallback) => {
    pool.query(
      `Select * from supplier where supplierId = ?`,
      [supplierId],
      (err, results, fields) => {
        if (err) return getSupplierCallback(err);
        return getSupplierCallback(null, results);
      }
    );
  },
};
