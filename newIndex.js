require('events').EventEmitter.prototype._maxListeners = 100;

const exec = require("child_process").exec;
const { google } = require("googleapis");
const { uploadFile } = require("./aws_uploader");
const fs = require("fs");

async function downloadVideo(videoUrl, retryCount=0) {
    try {
        console.log();
        console.log("downloading video: " + videoUrl);
        var videoDownloadCmd = getVideoDownloadCmd(videoUrl);
        res = await execShellCommand(videoDownloadCmd);
        return res;
    } catch (error) {
        if (retryCount < 10) {
            console.log("retrying download: " + videoUrl);
            console.log("retry count: " + retryCount);
            return downloadVideo(videoUrl, retryCount + 1);
        } else {
            throw error;
        }
    }
}

(async () => {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    // Create client instance for auth
    const client = await auth.getClient();

    // Instance of Google Sheets API
    const googleSheets = google.sheets({ version: "v4", auth: client });
    const spreadsheetId = "1USAjiqDnUWgR4JRwXA6FmUxFdeTUIM9uz4iOBUcZIrk";
    const rows = (await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Sheet1",
    })).data.values;

    for (index in rows) {
        data = rows[index];
        console.log(data)
    }

//     for (let index in rows) {
//         if (index == 0) continue; // skip the first row since its all headings

//         var isUploaded = rows[index][4];
//         var videoUrl = rows[index][1];

//         if (isUploaded && isUploaded !== "") {
//             if (isUploaded.trim() == "yes") {
//                 continue;
//             }
//         }
       
//         // download video
//         var videoDownloadResult = await downloadVideo(videoUrl);
//         console.log("video download result:" + videoDownloadResult);

//         if (videoDownloadResult && videoDownloadResult !== "") {
//             var id = videoDownloadResult.split("/");
//             id = id[id.length - 1].split(".")[0];

//             var videoFilePath = getVideoFilePath(videoDownloadResult);
//             var outputPath = process.cwd() + "/temp/";
//             var gifFilename = getGifFilename(rows, id);

//             try {
//                 var videoToGifCmd = getVideoToGifConvertCmd(videoFilePath, outputPath, gifFilename);
//                 console.log("");
//                 console.log("converting to gif: " + gifFilename);
//                 var videoToGifResult = await execShellCommand(videoToGifCmd);
//                 console.log("conversion complete: " + gifFilename);
//             } catch (error) {
//                 console.log("conversion error for: " + videoFilePath);
//                 throw error;
//             }

//             try {
//                 console.log("");
//                 console.log("uploading file: " + gifFilename);
//                 var bucketName = rows[index][2].trim();
//                 await uploadFile(outputPath + gifFilename, gifFilename, bucketName).then( async (res) => {
//                     // mark excel is_uploaded
//                     //  is_uploaded is the E column
//                     await googleSheets.spreadsheets.values.update({
//                         auth,
//                         spreadsheetId,
//                         range: `Video!E${parseInt(index) + 1}`,
//                         valueInputOption: "RAW",
//                         resource: {
//                             values: [["yes"]],
//                         },          
//                     });

//                     fs.unlinkSync(outputPath + gifFilename);
//                     fs.unlinkSync(videoFilePath);

//                     console.log("upload file complete. is_uploaded column set");
//                 });
//             } catch (error) {
//                 console.log("could not upload to AWS");
//                 throw error();
//             }
//         }
//     }
// })();

// function getVideoToGifConvertCmd(videoFilePath, outputPath, filename) {
//     return`ffmpeg -loglevel warning -t 3 -i ${videoFilePath} -filter_complex "[0:v] fps=24,split [a][b];[a] palettegen [p];[b][p] paletteuse" ${outputPath}${filename}`
// }

// function getVideoDownloadCmd(videoUrl) {
//     return `tiktok-scraper video ${videoUrl} -d`;
// }

// function execShellCommand(cmd) {
//     return new Promise((resolve, reject) => {
//         exec(cmd, (error, stdout, stderr) => {
//             if (error) reject(error);
//             if (stderr) reject(stderr);
//             resolve(stdout);
//         })
    // });
})()

/**
 * Extract the video filepath from the stdout that is given by the tiktok scraper
 */
function getVideoFilePath(stdout) {
    return stdout.split(":")[1].trim();
}

/**
 * Find the gif filename given the video ID
 */
function getGifFilename(googleSheetData, id) {
    for (index in googleSheetData) {
        var row = googleSheetData[index];
        var idColumn = row[0];

        if (idColumn == id) {
            return row[3].trim();
        }
    }
}