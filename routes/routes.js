import { Router } from "express";
import multer from "multer";
import Users from "./controllers/user/users.js";
import isAuth from "../middlewears/isAuth.js";
import getAllLogFromWinston from "./controllers/log/log.js";
import UploadFont from "./controllers/fontData/FontUpload.js";
import DownloadFont from "./controllers/fontData/DownloadFont.js";
import AdminPermission from "../middlewears/isAdmin.js";
import GetFonts from "./controllers/fontData/GetFonts.js";
import DeleteFontById from "./controllers/fontData/DeleteFontById.js";
import Visitors from "./controllers/Visitors/Visitors.js";
import report from "./controllers/Bug/ReportBug.js";


const Route = Router();
const storage = multer.diskStorage({})
let upload = multer({
    storage
})
Route.options('/download', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.sendStatus(200);
})
Route.post("/addAdmin", isAuth, AdminPermission.isAdminOnly, upload.single('uploadImage'), Users.userRegister)
Route.post("/adminLogin", Users.userLogin)
Route.get("/getUsers", isAuth, AdminPermission.isAdminOnly, Users.getUserData)
Route.get("/logs", isAuth, AdminPermission.isAdminOnly, getAllLogFromWinston)
Route.post("/editRole", isAuth, AdminPermission.isAdminOnly, Users.editUserRole)
Route.get("/profile", isAuth, Users.getMyProfile)
Route.post('/deleteById', isAuth, AdminPermission.isAdminOnly, Users.deleteById)
Route.post('/uploadFont', isAuth, AdminPermission.isAdminAndModerator, upload.any(), UploadFont)
Route.post('/downloadFont', DownloadFont)
Route.get('/getFonts', GetFonts)
Route.get('/deleteFont', isAuth, AdminPermission.isAdminOnly, DeleteFontById)
Route.get('/visitors', Visitors.Visitors)
Route.get('/getVisitors', Visitors.getVisitors)
Route.post('/reportBug', report.ReportBug)
Route.get('/getReportBugs', isAuth, report.getReportBugs)
Route.get('/', (req, res) => {
    res.send("Hello World")
})
export default Route; 