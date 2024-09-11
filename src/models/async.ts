import { sequelize } from '@models/init';
(async () => {
    try {
        await sequelize.sync({ alter: true }); // Synchronize all models with the database
        console.log('All models synchronized with the database.');
    } catch (error) {
        console.error('Error synchronizing models:', error);
    }

    // Your application logic here
})();