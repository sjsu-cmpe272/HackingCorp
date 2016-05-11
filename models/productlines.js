/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('productlines', {
		productLine: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		textDescription: {
			type: DataTypes.STRING,
			allowNull: true
		},
		htmlDescription: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		image: {
			type: 'MEDIUMBLOB',
			allowNull: true
		}
	},
        {
            classMethods: {
                getProductLinesData: function (callback) {
                    var _ProductLines = this;

                    _ProductLines.findAll().then(function (productLines) {
                        //return order
                        callback(productLines);
                    }).error(function (error) {
                        console.log("Error!");
                        callback(null);
                    });
                }
            }
        });
};