// const { exec } = require("child_process");
const shell = require("shelljs");

/**
 * 
 * @param {the path to the video file that needs to be converted to gif} videoFilepath 
 * @param {the path to the folder where the gif will be saved. Include the trailing "/" in this path} outputPath 
 * @param {the filename with the .gif extension } filename
 * 
 */
function convertVideoToGif(videoFilepath, outputPath, filename, callback=null) {
    const cmd = `ffmpeg -i -loglevel warning -i ${videoFilepath} -filter_complex "[0:v] fps=24,scale=1000:-1,split [a][b];[a] palettegen [p];[b][p] paletteuse" ${outputPath}${filename}`

    // const cmd = `ffmpeg -loglevel warning -i ${videoFilepath} fps=60 ${outputPath}${filename}`
    shell.exec(cmd, function (err, stdout, stderr) {
        stdout = `${outputPath}${filename}`;
        callback(err, stdout);
    });
}

exports.convertVideoToGif = convertVideoToGif;