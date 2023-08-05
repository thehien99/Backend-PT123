const { Sequelize } = require('sequelize');
const sequelize = new Sequelize("phongtro_mfqc", "phongtro_mfqc_user", "zkMJrToIfbziq5GO8XFHdeshTJ9GWcAq", {
  host: "dpg-cj6tj0ljeehc73bslnu0-a.singapore-postgres.render.com",
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