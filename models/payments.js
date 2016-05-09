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
	}, {
		tableName: 'payments'
	});
};
