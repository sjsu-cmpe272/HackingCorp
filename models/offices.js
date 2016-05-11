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
	},
        {
        classMethods: {
            getOfficesData: function (callback) {
                var _Offices = this;

                _Offices.findAll().then(function (offices) {
                    //return order
                    callback(offices);
                }).error(function (error) {
                    console.log("Error!");
                    callback(null);
                });
            }
        }
    });
};
