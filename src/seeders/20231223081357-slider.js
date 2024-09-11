"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("sliders", null, {});
        const dataInsert = [
            {
                image_path: "https:/1702364257466",
                name: "slider1",
                is_active: 1,
            },

        ];
        dataInsert.map((item) => {
            item.name = new Date();
            item.createdAt = new Date();
            item.updatedAt = new Date();
        });

        await queryInterface.bulkInsert("sliders", dataInsert, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("sliders", null, {});
    },
};
