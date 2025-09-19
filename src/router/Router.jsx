import { createBrowserRouter } from "react-router-dom";
import LayoutMain from "@layouts/LayoutMain";
import LayoutAuth from "@layouts/LayoutAuth";
import routes from "./index.js";
import LayoutAdmin from "@layouts/LayoutAdmin.jsx";
import LayoutCus from "@layouts/LayoutCus.jsx";
import UserProfile from "@containers/customer/ProfileCus/index.jsx";
import EmailVerify from "@containers/EmailVerify/index.jsx";
import ProtectedRoute from "@containers/auth/ProtectedRoute/index.jsx";
import NotFound from "@containers/NotFound/index.jsx";
import LayoutStaff from "@layouts/LayoutStaff.jsx";
import Blogs from "@containers/staff/Blog/index.jsx";
import BlogDetail from "@containers/BlogDetail/index.jsx";
import ServiceList from "@containers/ServiceList/index.jsx";
import AdminVaccine from "@containers/admin/AdminVaccine/index.jsx";
import SelfSchedule from "@containers/customer/SelfSchedule/index.jsx";
import PriceList from "@containers/PriceList/index.jsx";
import PackageVaccine from "@containers/admin/AdminPackageVaccine/index.jsx";
import Home from "@containers/Home/index.jsx";
import VaccinationGuide from "@containers/VaccinationGuide/index.jsx";
import AboutUs from "@containers/AboutsUs/index.jsx";
import Blog from "@containers/Blog/index.jsx";
import Login from "@containers/auth/Login/index.jsx";
import Register from "@containers/auth/Register/index.jsx";
import RegisterProfileChild from "@containers/customer/RegisterProfileChild/index.jsx";
import DashBoard from "@containers/admin/DashBoard/index.jsx";
import RegisterVaccination from "@containers/RegisterVaccination/index.jsx";
import { ROLE } from "@utils/role.js";
import Request from "@containers/staff/Request/index.jsx";
import ScheduleStaff from "@containers/staff/Schedule/index.jsx";
import CanceledSchedule from "@containers/staff/CanceledSchedule/index.jsx";
import BlogAdmin from "@containers/admin/Blog/index.jsx";
import Feedback from "@containers/customer/Feedback/index.jsx";
import AdminUser from "@containers/admin/AdminUser/index.jsx";
import Transaction from "@containers/customer/Transaction/index.jsx";
import Record from "@containers/customer/Record/index.jsx";
import AdminDiseaseType from "@containers/admin/AdminDiseasetype/index.jsx";
import StaffColdStorage from "@containers/staff/StaffColdStorage/index.jsx";
import RequestImportInvoice from "@containers/staff/RequestImportInvoice/index.jsx";
import VaccinePath from "@containers/staff/VaccinePatch/index.jsx";
import AdminImportInvoice from "@containers/admin/AdminImportInvoice/index.jsx";
import CancelScheduleCus from "@containers/customer/CancelSchedule/index.jsx";

const userRole = localStorage.getItem("userRole") || '{}';

const Router = createBrowserRouter(
  [
    {
      path: routes.home,
      element: <LayoutMain />,
      children: [
        { path: routes.home, element: <Home /> },
        { path: routes.notFound, element: <NotFound /> },
        {
          path: routes.registerVaccination,
          element: <RegisterVaccination />,
        },
        { path: routes.vaccinationGuide, element: <VaccinationGuide /> },
        { path: routes.service, element: <ServiceList /> },
        { path: routes.vaccinePrice, element: <PriceList /> },
        { path: routes.aboutUs, element: <AboutUs /> },
        { path: routes.blog, element: <Blog /> },
        { path: routes.blogDetail, element: <BlogDetail /> },
        { path: routes.emailVerify, element: <EmailVerify /> },
      ],
    },
    {
      path: routes.auth.login.split("/")[1],
      element: <LayoutAuth />,
      children: [
        { path: routes.auth.login.split("/")[2], element: <Login /> },
        { path: routes.auth.register.split("/")[2], element: <Register /> },
      ],
    },
    {
      path: routes.user.profile.split("/")[1],
      element: <ProtectedRoute role={userRole} allowedRoles={[ROLE.CUSTOMER]} ><LayoutCus /></ProtectedRoute>,
      children: [
        { path: routes.user.profile.split("/")[2], element: <UserProfile /> },
        { path: routes.user.registerProfileChild.split("/")[2], element: <RegisterProfileChild /> },
        { path: routes.user.selfSchedule.split("/")[2], element: <SelfSchedule /> },
        { path: routes.user.feedback.split("/")[2], element: <Feedback /> },
        { path: routes.user.transaction.split("/")[2], element: <Transaction /> },
        { path: routes.user.record.split("/")[2], element: <Record /> },
        { path: routes.user.cancelSchedule.split("/")[2], element: <CancelScheduleCus /> },
      ],
    },
    {
      path: routes.staff.blog.split("/")[1],
      element: <ProtectedRoute role={userRole} allowedRoles={[ROLE.STAFF]} ><LayoutStaff /></ProtectedRoute>,
      children: [{ path: routes.staff.blog.split("/")[2], element: <Blogs /> },
      { path: routes.staff.request.split("/")[2], element: <Request /> },
      { path: routes.staff.viewScheduleAll.split("/")[2], element: <ScheduleStaff /> },
      { path: routes.staff.viewCanceledSchedule.split("/")[2], element: <CanceledSchedule /> },
      { path: routes.staff.coldStorage.split("/")[2], element: <StaffColdStorage /> },
      { path: routes.staff.RequestImportInvoice.split("/")[2], element: <RequestImportInvoice /> },
      { path: routes.staff.VaccinePatch.split("/")[2], element: <VaccinePath /> }
      ],
    },
    {
      path: routes.admin.dashboard.split("/")[1],
      element: <ProtectedRoute role={userRole} allowedRoles={[ROLE.ADMIN, ROLE.MANAGER]} ><LayoutAdmin /></ProtectedRoute>,
      children: [
        { path: routes.admin.dashboard.split("/")[2], element: <DashBoard /> },
        { path: routes.admin.adminVaccine.split("/")[2], element: <AdminVaccine /> },
        { path: routes.admin.adminPackageVaccine.split("/")[2], element: <PackageVaccine /> },
        { path: routes.admin.blog.split("/")[2], element: <BlogAdmin /> },
        { path: routes.admin.user.split("/")[2], element: <AdminUser /> },
        { path: routes.admin.diseasetype.split("/")[2], element: <AdminDiseaseType /> },
        { path: routes.admin.RequestImportInvoice.split("/")[2], element: <AdminImportInvoice /> },

      ],
    },
    { path: "*", element: <NotFound /> },
  ],
  { basename: import.meta.env.VITE_BASE_PATH }
);
export default Router;
