/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('products', {
		productCode: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		productName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		productLine: {
			type: DataTypes.STRING,
			allowNull: false,
			references: {
				model: 'productlines',
				key: 'productLine'
			}
		},
		productScale: {
			type: DataTypes.STRING,
			allowNull: false
		},
		productVendor: {
			type: DataTypes.STRING,
			allowNull: false
		},
		productDescription: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		quantityInStock: {
			type: DataTypes.INTEGER(6),
			allowNull: false
		},
		buyPrice: {
			type: 'DOUBLE',
			allowNull: false
		},
		MSRP: {
			type: 'DOUBLE',
			allowNull: false
		}
	},
        {
            classMethods: {
                getProductsData: function (callback) {
                    var _Products = this;

                    _Products.findAll().then(function (products) {
                        //return order
                        callback(products);
                    }).error(function (error) {
                        console.log("Error!");
                        callback(null);
                    });
                }
            }
        });
};