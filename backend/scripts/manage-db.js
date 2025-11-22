const mongoose = require('mongoose');
const User = require('../src/models/User');
const dotenv = require('dotenv');
const path = require('path');

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/future_teller');
    // console.log('✅ MongoDB 连接成功');
  } catch (error) {
    console.error('❌ MongoDB 连接失败:', error.message);
    process.exit(1);
  }
};

const listUsers = async () => {
  const users = await User.find({});
  console.log('\n📋 用户列表 (Users):');
  if (users.length === 0) {
    console.log('   (暂无用户)');
  } else {
    users.forEach(u => {
      console.log(`   - [${u.role}] ${u.username} (${u.email}) ID: ${u._id}`);
    });
  }
};

const createTestUser = async (role = 'customer') => {
  const username = `test_${role}_${Math.floor(Math.random() * 1000)}`;
  const email = `${username}@example.com`;
  const password = 'password123';

  try {
    const user = await User.create({
      username,
      email,
      password,
      role
    });
    console.log(`\n✅ 创建测试用户成功:`);
    console.log(`   Username: ${username}`);
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role:     ${role}`);
  } catch (error) {
    console.error('❌ 创建用户失败:', error.message);
  }
};

const deleteUser = async (emailOrId) => {
  try {
    let result;
    if (mongoose.Types.ObjectId.isValid(emailOrId)) {
      result = await User.findByIdAndDelete(emailOrId);
    } else {
      result = await User.findOneAndDelete({ email: emailOrId });
    }

    if (result) {
      console.log(`\n✅ 删除用户成功: ${result.username} (${result.email})`);
    } else {
      console.log(`\n❌ 未找到用户: ${emailOrId}`);
    }
  } catch (error) {
    console.error('❌ 删除用户失败:', error.message);
  }
};

const deleteAllUsers = async () => {
  try {
    const result = await User.deleteMany({});
    console.log(`\n⚠️  已清空所有用户，共删除 ${result.deletedCount} 条记录。`);
  } catch (error) {
    console.error('❌ 清空用户失败:', error.message);
  }
};

const showCollections = async () => {
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('\n📚 数据库集合 (Collections):');
  if (collections.length === 0) {
    console.log('   (暂无集合)');
  } else {
    collections.forEach(c => {
      console.log(`   - ${c.name}`);
    });
  }
};

const inspectCollection = async (collectionName) => {
  try {
    const collection = mongoose.connection.db.collection(collectionName);
    const count = await collection.countDocuments();
    const items = await collection.find({}).limit(5).toArray();

    console.log(`\n🔍 集合: ${collectionName}`);
    console.log(`   总记录数: ${count}`);
    console.log('   前5条记录:');
    
    if (items.length === 0) {
      console.log('   (空)');
    } else {
      console.dir(items, { depth: null, colors: true });
    }
  } catch (error) {
    console.error(`❌ 查看集合 ${collectionName} 失败:`, error.message);
  }
};

const main = async () => {
  await connectDB();

  const args = process.argv.slice(2);
  const command = args[0];
  const param = args[1];

  switch (command) {
    case 'list':
      await listUsers();
      break;
    case 'collections':
      await showCollections();
      break;
    case 'inspect':
      if (!param) {
        console.log('❌ 请指定集合名称，例如: node ... inspect users');
      } else {
        await inspectCollection(param);
      }
      break;
    case 'create-customer':
      await createTestUser('customer');
      break;
    case 'create-teller':
      await createTestUser('fortune_teller');
      break;
    case 'create-admin':
      await createTestUser('admin');
      break;
    case 'delete':
      if (!param) {
        console.log('❌ 请指定要删除的 Email 或 ID');
      } else {
        await deleteUser(param);
      }
      break;
    case 'clean-users':
      // 简单的确认机制
      console.log('⚠️  您确定要清空所有用户吗？这将无法撤销。');
      console.log('   请运行: node backend/scripts/manage-db.js clean-users-confirm');
      break;
    case 'clean-users-confirm':
      await deleteAllUsers();
      break;
    default:
      console.log('\n用法: node backend/scripts/manage-db.js <command>');
      console.log('命令:');
      console.log('  list             - 列出所有用户');
      console.log('  create-customer  - 创建测试客户');
      console.log('  delete <email>   - 删除指定用户 (Email 或 ID)');
      console.log('  clean-users      - 清空所有用户 (需要二次确认)');
      console.log('  collections      - 列出所有集合');
      console.log('  inspect <name>   - 查看集合数据');
      break;
  }

  setTimeout(() => {
    mongoose.connection.close();
  }, 1000);
};

main();
