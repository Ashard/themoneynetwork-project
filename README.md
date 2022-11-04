# themoneynetwork-project

Created a NodeJS service that runs on an AWS server that does the following:
  1) Every hour, it will get the new links that are added to the Google Sheet, and use that to download the corresponding TikTok video.   
  2) It will then convert the TikTok into a GIF and upload it to the AWS bucket using the filename provided in the same Google Sheet.  
  3) After upload is complete we will mark the "is_uploaded" column in the Google Sheet to show the upload was completed.
