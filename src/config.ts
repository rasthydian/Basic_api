import path from "path"
// define address/path of root folder
const ROOT_DIRECTORY = `${path.join(__dirname, `../`)}`
// __dirname: mendapatkan posisi dari folder pada file ini (config.ts). 
// -> pada folder /src/config.ts
// "../" : mundur satu folder ke belakang, habis dari src berada pada ROOT_DIRECTORY

export { ROOT_DIRECTORY }