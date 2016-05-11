/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('payments', {
		customerNumber: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			references: {
				model: 'customers',
				key: 'customerNumber'
			}
		},
		checkNumber: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		paymentDate: {
			type: DataTypes.DATE,
			allowNull: false
		},
		amount: {
			type: 'DOUBLE',
			allowNull: false
		}
	},
        {
            classMethods: {
                getPaymentsData: function (callback) {
                    var _Payments = this;

                    _Payments.findAll().then(function (payments) {
                        //return order
                        callback(payments);
                    }).error(function (error) {
                        console.log("Error!");
                        callback(null);
                    });
                }
            }
        });
};