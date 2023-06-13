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
import Editfonts from "./controllers/fontData/Editfonts.js";


const Route = Router();
const storage = multer.diskStorage({})
let upload = multer({
    storage
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
Route.post('/updateFont', isAuth, AdminPermission.isAdminOnly, Editfonts)
Route.get('/', (req,res) => {
return res.json("hello"}
})
export default Route; 
