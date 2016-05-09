/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('offices', {
		officeCode: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		city: {
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
		state: {
			type: DataTypes.STRING,
			allowNull: true
		},
		country: {
			type: DataTypes.STRING,
			allowNull: false
		},
		postalCode: {
			type: DataTypes.STRING,
			allowNull: false
		},
		territory: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		tableName: 'offices'
	});
};
