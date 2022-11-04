require('dotenv').config()

const s3Client = require("aws-sdk/clients/s3");
const fs = require("fs");

// const bucketName = process.env.AWS_BUCKET_NAME;
const s3 = new s3Client();

function uploadFile(filepath, filename, bucketName) {
    const fileStream = fs.createReadStream(filepath);

    const uploadParams = {
        Bucket: bucketName, // The name of the bucket. For example, 'sample_bucket_101'.
        Key: filename, // The name of the object. For example, 'sample_upload.txt'.
        Body: fileStream, // The content of the object. For example, 'Hello world!".
    };

    return new Promise((resolve, reject) => {
        s3.upload(uploadParams, function (err, stdout, stderr) {
            if (err) throw err;
            resolve(stdout);
        })
    });
}

exports.uploadFile = uploadFile;