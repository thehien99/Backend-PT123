const { Sequelize } = require('sequelize');
const sequelize = new Sequelize("db_phongtro123_abqw", "db_phongtro123_abqw_user", "H8N9wOYlvFjzFl0Tlte6sKE4FdNU0kB3", {
  host: "dpg-cj1nmmmnqqla1dhsqr20-a.singapore-postgres.render.com",
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

let connectDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
export default connectDb