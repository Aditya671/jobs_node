import Sequelize from 'sequelize';
// Sequelize(database,username,password,{options})
const sequelize = new Sequelize('ecommerce_','root','_ecommerce_',{
   dialect:'mysql',
   host:'localhost'
});

// Create Table
const AppDatabase = sequelize.define('product',{
   id:{
      type:Sequelize.INTEGER,
      autoIncrement:true,
      allowNull:false,
      primaryKey:true
   }
})
