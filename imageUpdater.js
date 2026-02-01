const path = require("path");
const MAXSIZE = 1000000; //DO NOT MODIFY THIS VALUE
const fs = require("fs");

const imageValidator = {
  checkFile(file, username) {
    if (this.checkType(file) && this.checkSize(file)) {
      const fileExtension = path.extname(file.name);
      const fileName = `${username.replace(/ /g, "_")}${fileExtension}`; // replaces all spaces with underscores
      const filePath = path.join("./public/images/user_profile_pic/", fileName); // joins the path of the folder and the file name
      // Check if the file with the same filename already exists
      if (fs.existsSync(filePath)) {
        // If it exists, delete the existing file
        fs.unlinkSync(filePath);
      }

      // Save the new file with the same name
      file.mv(filePath);
      return `./images/user_profile_pic/${fileName}`;
    }
    return false;
  },
  checkType(file) {
    const allowedExtensions = [".jpg", ".jpeg", ".png"];
    const fileExtension = path.extname(file.name).toLowerCase();
    return allowedExtensions.includes(fileExtension);
  },
  checkSize(file) {
    return file.size < MAXSIZE;
  },
};

module.exports = imageValidator;

