const path = require("path");
const MAXSIZE = 1000000; //DO NOT MODIFY THIS VALUE

const imageValidator = {
  checkFile(file, username) {
    if (this.checkType(file) && this.checkSize(file)) {
      const fileExtension = path.extname(file.name);
      const fileName = `${username.replace(/ /g, "_")}${fileExtension}`; // replaces all spaces with underscores
      const filePath = path.join("./public/images/user_profile_pic/", fileName); // joins the path of the folder and the file name
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

