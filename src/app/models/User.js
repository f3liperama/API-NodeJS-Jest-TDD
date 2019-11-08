const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password_hash: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false
        }   
    }, {
        hooks: {
            beforeSave: async user => {
                if (user.password) {
                    user.password_hash = await bcrypt.hash(user.password, 8);
                }                    
            }
        }
    });

    User.prototype.checkPassword = function(password) {
        return bcrypt.compare(password, this.password_hash);
    }

    User.prototype.generateToken = function() {
        return jwt.sign({ id: this.id }, process.env.JWT_SECRET);
    }

    return User;
}