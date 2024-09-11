"use strict";
const bcrypt = require("bcrypt");
module.exports = {
    up: async (queryInterface, Sequelize) => {
        const saltRounds = 10;
        const myPlaintextPassword = "admin@123";
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = await bcrypt.hashSync(myPlaintextPassword, salt);
        // await queryInterface.bulkDelete("admin_tokens", null, {});
        await queryInterface.bulkDelete("admins", null, {});
        await queryInterface.bulkInsert(
            "admins",
            [
                {
                    email: "juhi@admin.com",
                    password: hash,
                    name: "juhi",
                    profile_pic: "https:// dmin/1701851887065",
                    is_active: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("admins", null, {});
    },
};
