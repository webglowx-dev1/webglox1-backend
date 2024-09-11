"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("cms", null, {});
        const dataInsert = [
            { key: "who_we_are", value: " " },
            { key: "about_us", value: "<p>about_ussadasdasdasd</p>" },
            { key: "terms_condition", value: "<p>featureddwdwdwdwdwdw</p>" },
            { key: "privacy_policy", value: "<p>privacy_poliasdasdasdcy</p>" },
            { key: "feature", value: "<p>featuredfeefefewfasdasdasd</p>" },
            { key: "app_store", value: "https://www.apple.com/in/app-store/" },
            { key: "play_store", value: "https://play.google.com/store/apps", },
        ];
        dataInsert.map((item) => {
            item.createdAt = new Date();
            item.updatedAt = new Date();
        });

        await queryInterface.bulkInsert("cms", dataInsert, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("cms", null, {});
    },
};
