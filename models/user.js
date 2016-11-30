const bcrypt = require('bcryptjs');
module.exports = (sequlize, dataTypes) => {
  return sequlize.define('user', {
    name: {
      type: dataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3]
      },
    },
    email: {
      type: dataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    salt: {
      type: dataTypes.STRING
    },
    password_hash: {
      type: dataTypes.STRING
    },
    password: {
      type: dataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        len: [7, 100]
      },
      set: function(value) {
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(value, salt)

        this.setDataValue('password', value);
        this.setDataValue('salt', salt);
        this.setDataValue('password_hash', hashedPassword)
      }
    }
  }, {
    hooks: {
      beforeValidate: (user, options) => {
        user.email = user.email.toLowerCase();
        user.name = user.name.trim();
      }
    },
    instanceMethods: {
      toPublicJson: function () {
        return this.toJson()
      }
    }
  });
};