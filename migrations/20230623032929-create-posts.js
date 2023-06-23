'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Posts', {
      postId: {
        allowNull: false, // NOT NULL
        autoIncrement: true, // AUTO_INCREMENT
        primaryKey: true, // Primary Key
        type: Sequelize.INTEGER
      },
      UserId: {
        allowNull: false, // NOT NULL
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // Users(model)를 참조합니다.
          key: 'userId', // Users(model)의 userId(column)를 참조합니다.
        },
        onDelete: 'CASCADE', // 만약 Users(model)의 userId(column)가 삭제되면, Posts(model)의 Data가 삭제됩니다.
      },
      Nickname: {
        allowNull: false, // NOT NULL
        type: Sequelize.STRING,
      },
      title: {
        allowNull: false, // NOT NULL
        type: Sequelize.STRING,
      },
      content: {
        allowNull: false, // NOT NULL
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false, // NOT NULL
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        allowNull: false, // NOT NULL
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Posts');
  }
};
