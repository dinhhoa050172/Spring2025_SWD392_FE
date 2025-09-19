import { useEffect, useState } from "react";
import { userService } from "@src/services/userService.js";
import TextField from "@src/components/TextField/index.jsx";
import { formatDate } from "@utils/format.js";
import ChangePasswordModal from "@src/components/Modal/index.jsx";
import RegisterProfileChild from "@containers/customer/RegisterProfileChild/index.jsx";
import EditProfileChild from "@containers/customer/EditChildProfile/index.jsx";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import { message } from "@utils/message.js";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [childData, setChildData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalRegister, setIsModalRegister] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [childToDelete, setChildToDelete] = useState(null);
  const [count, setCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [isChangeInfo, setIsChangeInfo] = useState(false);
  const [isDeleteChild, setIsDeleteChild] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await userService.getUser();
        const childData = await userService.getAllChildProfile(data.id);
        setUserData(data);
        setEditedData(data);
        setChildData(childData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [count]);

  const handleRegisterSuccess = async () => {
    try {
      const data = await userService.getUser();
      const childData = await userService.getAllChildProfile(data.id);
      setChildData(childData);
    } catch (err) {
      setError(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setEditedData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setEditedData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateBirthday = (birthday) => {
    const selectedDate = new Date(birthday);
    const currentDate = new Date();

    if (selectedDate > currentDate) {
      return "Ngày sinh không được lớn hơn ngày hiện tại.";
    }

    if (isNaN(selectedDate.getTime())) {
      return "Ngày sinh không hợp lệ.";
    }

    return null;
  };

  const handleSave = async () => {
    setIsChangeInfo(true);
    const birthdayError = validateBirthday(editedData.birthday);
    if (birthdayError) {
      toast.error(birthdayError);
      return;
    }

    try {
      await userService.editProfile(editedData);
      setUserData(editedData);
      setIsEditing(false);
      toast.success(message.UPDATE_SUCCESS);
    } catch (err) {
      console.error(message.UPDATE_ERROR, err);
      toast.error(message.UPDATE_ERROR);
    } finally {
      setIsChangeInfo(false);
    }
  };

  const handleEditChild = (data) => {
    setSelectedChild(data);
    setIsEditModalOpen(true);
  };

  const handleDeleteChild = (id) => {
    setChildToDelete(id);
    setIsDeleteModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <CircularProgress size="6rem" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );
  }

  return (
    <div className="h-full mx-auto bg-white rounded-lg p-6">
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-2xl font-semibold mb-6">Thông tin khách hàng</h2>
        <button
          onClick={() => {
            setIsModalRegister(true);
          }}
          className="bg-[rgb(33,103,221)] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6 mr-4"
        >
          Đăng ký hồ sơ trẻ em
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {isEditing ? (
            <>
              <div className="pb-4">
                <label className="block text-sm font-bold mb-2">
                  Tên đầy đủ
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={editedData.fullname}
                  onChange={handleInputChange}
                  className="shadow border rounded w-full py-2 px-3 h-[40px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* <div className="pb-4">
                <label className="block text-sm font-bold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editedData.email}
                  onChange={handleInputChange}
                  className="shadow border rounded w-full py-2 px-3 h-[40px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div> */}
              <TextField title="Email" data={userData.email} />
            </>
          ) : (
            <>
              <TextField title="Tên đầy đủ" data={userData.fullname} />
              <TextField title="Email" data={userData.email} />
            </>
          )}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {isEditing ? (
            <>
              <div className="pb-4">
                <label className="block text-sm font-bold mb-2">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={editedData.phoneNumber}
                  onChange={handleInputChange}
                  className="shadow border rounded w-full py-2 px-3 h-[40px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="pb-4">
                <label className="block text-sm font-bold mb-2">
                  Ngày sinh(mm/dd/yyyy)
                </label>
                <input
                  type="date"
                  name="birthday"
                  value={editedData.birthday}
                  onChange={handleInputChange}
                  className="shadow border rounded w-full py-2 px-3 h-[40px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="pb-4">
                <label className="block text-sm font-bold mb-2">
                  Giới tính
                </label>
                <div className="shadow border rounded w-full py-2 px-3 h-[40px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <select
                    name="gender" // Tên trường
                    value={editedData.gender} // Giá trị là "M" hoặc "F"
                    onChange={handleInputChange}
                    className="rounded w-full focus:outline-none"
                  >
                    <option value="M">Nam</option>
                    <option value="F">Nữ</option>
                  </select>
                </div>
              </div>
            </>
          ) : (
            <>
              <TextField title="Số điện thoại" data={userData.phoneNumber} />
              <TextField
                title="Ngày sinh"
                data={formatDate(userData.birthday)}
              />
              <TextField
                title="Giới tính"
                data={userData.gender === "M" ? "Nam" : "Nữ"}
              />
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {isEditing ? (
          <>
            <div className="pb-4">
              <label className="block text-sm font-bold mb-2">Số nhà</label>
              <input
                type="text"
                name="address.unitNumber"
                value={editedData.address.unitNumber}
                onChange={handleInputChange}
                className="shadow border rounded w-full py-2 px-3 h-[40px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="pb-4">
              <label className="block text-sm font-bold mb-2">Phường/Xã</label>
              <input
                type="text"
                name="address.ward"
                value={editedData.address.ward}
                onChange={handleInputChange}
                className="shadow border rounded w-full py-2 px-3 h-[40px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        ) : (
          <>
            <TextField title="Số nhà" data={userData.address.unitNumber} />
            <TextField title="Phường/Xã" data={userData.address.ward} />
          </>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {isEditing ? (
          <>
            <div className="pb-4">
              <label className="block text-sm font-bold mb-2">Quận/Huyện</label>
              <input
                type="text"
                name="address.district"
                value={editedData.address.district}
                onChange={handleInputChange}
                className="shadow border rounded w-full py-2 px-3 h-[40px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="pb-4">
              <label className="block text-sm font-bold mb-2">
                Tỉnh/Thành phố
              </label>
              <input
                type="text"
                name="address.province"
                value={editedData.address.province}
                onChange={handleInputChange}
                className="shadow border rounded w-full py-2 px-3 h-[40px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        ) : (
          <>
            <TextField title="Quận/Huyện" data={userData.address.district} />
            <TextField
              title="Tỉnh/Thành phố"
              data={userData.address.province}
            />
          </>
        )}
      </div>
      <div>
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-6 mr-4"
              disabled={isChangeInfo}
            >
              {isChangeInfo ? "Đang cập nhật" : "Cập nhật"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mt-6"
            >
              Hủy
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[rgb(33,103,221)] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6 mr-4"
            >
              Thay đổi thông tin
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[rgb(33,103,221)] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6"
            >
              Đổi mật khẩu
            </button>
          </>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-6">Thông tin hồ sơ trẻ em</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-center">
                <th className="border px-4 py-2">Tên</th>
                <th className="border border-l px-4 py-2">Giới tính</th>
                <th className="border px-4 py-2">Ngày sinh</th>
                <th className="border px-4 py-2">Nơi sinh</th>
                <th className="border px-4 py-2">Phương pháp sinh</th>
                <th className="border px-4 py-2">Cân nặng</th>
                <th className="border px-4 py-2">Chiều cao</th>
                <th className="border px-4 py-2">Dị tật</th>
                <th className="border px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {childData.map((child) => (
                <tr key={child.id} className="border-b text-center">
                  <td className="border px-4 py-2">{child.childName}</td>
                  <td className="border px-4 py-2">
                    {child.childGender === "M" ? "Nam" : "Nữ"}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(child.dateOfBirth).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">{child.birthPlace}</td>
                  <td className="border px-4 py-2">{child.birthMethod}</td>
                  <td className="border px-4 py-2">{child.birthWeight} kg</td>
                  <td className="border px-4 py-2">{child.birthHeight} cm</td>
                  <td className="border px-4 py-2">{child.abnormalities || "Không"}</td>
                  <td className="border px-4 py-2">
                    <div className="flex">
                      <button
                        onClick={() => handleEditChild(child.id)}
                        className="bg-[rgb(33,103,221)] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteChild(child.id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isDeleteModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded p-6 w-1/3">
                <h3 className="text-xl font-semibold">Xóa hồ sơ trẻ em</h3>
                <p className="my-4">
                  Bạn có chắc chắn muốn xóa hồ sơ của trẻ này?
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={async () => {
                      if (childToDelete) {
                        setIsDeleteChild(true);
                        await userService.deleteChildProfile(childToDelete);
                        setIsDeleteChild(false);
                        setChildData(
                          childData.filter(
                            (child) => child.id !== childToDelete
                          )
                        );
                        toast.success(message.DELETE_SUCCESS, {
                          autoClose: 3000,
                          closeOnClick: true,
                        });
                        setIsDeleteModalOpen(false);
                      }
                    }}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    disabled={isDeleteChild}
                  >
                    {isDeleteChild ? <CircularProgress size={16} sx={{ mx: "6.5px"}} /> : "Xóa"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal đổi mật khẩu */}
      <ChangePasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Modal đăng ký tài khoảng cho trẻ em */}
      <RegisterProfileChild
        parentInfo={userData}
        isOpen={isModalRegister}
        onClose={() => {
          setIsModalRegister(false);
          setCount(count + 1);
        }}
        onRegisterSuccess={handleRegisterSuccess}
      />

      <EditProfileChild
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setCount(count + 1);
        }}
        childId={selectedChild}
      />
    </div>
  );
};

export default UserProfile;
