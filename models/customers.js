/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('customers', {
		customerNumber: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		customerName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		contactLastName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		contactFirstName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: false
		},
		addressLine1: {
			type: DataTypes.STRING,
			allowNull: false
		},
		addressLine2: {
			type: DataTypes.STRING,
			allowNull: true
		},
		city: {
			type: DataTypes.STRING,
			allowNull: false
		},
		state: {
			type: DataTypes.STRING,
			allowNull: true
		},
		postalCode: {
			type: DataTypes.STRING,
			allowNull: true
		},
		country: {
			type: DataTypes.STRING,
			allowNull: false
		},
		salesRepEmployeeNumber: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'employees',
				key: 'employeeNumber'
			}
		},
		creditLimit: {
			type: 'DOUBLE',
			allowNull: true
		}
	}, {
		tableName: 'customers'
	});
};
