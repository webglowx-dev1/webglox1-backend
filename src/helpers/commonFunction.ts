import log4js from "log4js";
const logger = log4js.getLogger();
const nodemailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars');


const sendEmailTemplate = (async (data: any) => {
    try {
        var transporter = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "066b538e8236c0",
                pass: "93517838974074"
            }
        });


        const pathUrl = process.env.APP_BASE_EMAIL_TEMP;

        logger.info(process.env.SENDGRID_API_KEY)
        logger.info(pathUrl)
        const handlebarOptions = {
            viewEngine: {
                partialsDir: pathUrl,
                defaultLayout: false,
            },
            viewPath: pathUrl,
        };

        // use a template file with nodemailer
        transporter.use('compile', hbs(handlebarOptions))


        const pathImg = pathUrl + `logo.png`;

        let attech = [{
            filename: 'logo.jpg',
            path: pathImg,
            cid: 'logo1' //same cid value as in the html img src
        }]

        if (data.attachments) {
            attech = [...attech, data.attachments]
        }

        var mailOptions = {
            from: 'juhi@gmail.com', // sender address
            to: data.to, // list of receivers
            subject: data.subject,
            template: data.template, // the name of the template file i.e email.handlebars
            context: data.sendEmailTemplatedata,
            attachments: attech
        };

        // trigger the sending of the E-mail
        await transporter.sendMail(mailOptions, function (error: any, info: any) {
            if (error) {
                logger.info(error)
                return true;
            }
            console.log('Message sent: ' + info.response);
        });
    } catch (err: any) {
        logger.info("sendEmailTemplate");
        logger.info(err);
        return
    }

});

const makeIdString = ((length: any) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
});

const generateOtp = (() => {
    logger.info("generateOtp");
    return Math.floor(1000 + Math.random() * 9000);
});

const smsGatway = (async (to: any, message: any) => {
    try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const client = require('twilio')(accountSid, authToken);

        const data = await client.messages
            .create({
                body: message,
                from: 'bnbb',
                to: to
            })
            .then((message: any) => {
                logger.info("smsGatway")
                logger.info(message.sid)
            });
        return data;
    } catch (err: any) {
        logger.info(" smsGatway Issue ");
        logger.info(err);
        logger.info(err);
        return false
    }
});


const titleToSlug = (title: any) => {
    let slug;

    // convert to lower case
    slug = title.toLowerCase();

    // remove special characters
    slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
    // The /gi modifier is used to do a case insensitive search of all occurrences of a regular expression in a string

    // replace spaces with dash symbols
    slug = slug.replace(/ /gi, "-");

    // remove consecutive dash symbols 
    slug = slug.replace(/\-\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-/gi, '-');
    slug = slug.replace(/\-\-/gi, '-');

    // remove the unwanted dash symbols at the beginning and the end of the slug
    slug = '@' + slug + '@';
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');
    return slug;
};


const isActive = () => {
    return { $match: { is_active: true } }
}


export default {
    sendEmailTemplate,
    generateOtp,
    smsGatway,
    makeIdString,
    titleToSlug,
    isActive,
}