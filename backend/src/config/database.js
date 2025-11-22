const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/future_teller');

    console.log(`MongoDB连接成功: ${conn.connection.host}`);
  } catch (error) {
    console.error(`数据库连接失败: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;



