const path = require('path'),
      { Sequelize, DataTypes } = require('sequelize'),
      sequelize = new Sequelize({
        storage: path.join(__dirname, '..', 'library.sqlite'),
        dialect: 'sqlite'
      });

const User = sequelize.define('User', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Required" },
        }
      }
});

const Book = sequelize.define('Book', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Required" },
        }
      },
      inside: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
});

const Borrow = sequelize.define('Borrow', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Required" },
        },
        references: {
            model: User,
            key: 'id'
        }
      },
      bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Required" },
        },
        references: {
            model: Book,
            key: 'id'
        }
      }
});

const Return = sequelize.define('Return', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Required" },
        },
        references: {
            model: User,
            key: 'id'
        }
      },
      bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Required" },
        },
        references: {
            model: Book,
            key: 'id'
        }
      },
      score: {
        type: DataTypes.FLOAT
      }
});

// Relations
User.hasMany(Borrow, {foreignKey: 'userId'})
Borrow.belongsTo(User, {foreignKey: 'userId'})
Book.hasMany(Borrow, {foreignKey: 'bookId'})
Borrow.belongsTo(Book, {foreignKey: 'bookId'})
User.hasMany(Return, {foreignKey: 'userId'})
Return.belongsTo(User, {foreignKey: 'userId'})
Book.hasMany(Return, {foreignKey: 'bookId'})
Return.belongsTo(Book, {foreignKey: 'bookId'})

module.exports = {User, Book, Borrow, Return}