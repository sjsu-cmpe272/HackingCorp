/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('employees', {
		employeeNumber: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		extension: {
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false
		},
		officeCode: {
			type: DataTypes.STRING,
			allowNull: false,
			references: {
				model: 'offices',
				key: 'officeCode'
			}
		},
		reportsTo: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'employees',
				key: 'employeeNumber'
			}
		},
		jobTitle: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
        {
            classMethods: {
                getEmployeesData: function (callback) {
                    var _Employees = this;

                    _Employees.findAll().then(function (employees) {
                        //return order
                        callback(employees);
                    }).error(function (error) {
                        console.log("Error!");
                        callback(null);
                    });
                }
            }
        });
};
