// Image upload for game images

const path = require("path");
const MAXSIZE = 1000000; //DO NOT MODIFY THIS VALUE

const imageValidator2 = {
  checkFile(file, name) {
    if (this.checkType(file) && this.checkSize(file)) {
      const fileExtension = path.extname(file.name);
      const fileName = `${name.replace(/ /g, "_")}${fileExtension}`; //replaces all spaces with underscores
      const filePath = path.join("./public/images/game_pic/", fileName); //joins the path of the folder and the file name
      file.mv(filePath);
      return `game_pic/${fileName}`;
    }
    return false;
  },
  checkType(file) {
    const allowedExtensions = [".jpg", ".jpeg"];
    const fileExtension = path.extname(file.name).toLowerCase();
    return allowedExtensions.includes(fileExtension);
  },
  checkSize(file) {
    return file.size < MAXSIZE;
  },
};

module.exports = imageValidator2;