import TextField from "@components/TextField/index.tsx";
import { formatDate } from "@utils/format.js";

const SelectChild = ({ listChild, setSelectedChild, selectedChild }) => (
  <div>
    <h2 className="text-xl font-bold mb-4 text-blue-600">Chọn người tiêm</h2>
    <select
      className="w-full p-2 mt-1 border rounded outline-none h-10 text-black "
      value={selectedChild ? selectedChild.id : ""}
      onChange={(e) => {
        const selected = listChild.find((child) => child.id === e.target.value);
        setSelectedChild(selected || null);
      }}
    >
      <option value="" className="text-center">
        -----Chọn người tiêm-----
      </option>
      {listChild.map((child) => (
        <option
          key={child.id}
          value={child.id}
          className="text-center hover:bg-blue-400 hover:text-white"
        >
          {child.childName}
        </option>
      ))}
    </select>

    {selectedChild && (
      <div className=" mt-4">
        <div>
          <h2 className="text-xl font-bold mb-4 text-blue-600">
            Thong tin người tiêm
          </h2>
          <div className="grid grid-cols-2  gap-6 text-left">
            <TextField title="Tên phụ huynh" data={selectedChild.parentName} />
            <TextField title="Tên đầy đủ" data={selectedChild.childName} />
          </div>
          <div className="grid grid-cols-3  gap-6 text-left">
            <TextField
              title="Giới tính"
              data={selectedChild.childGender === "M" ? "Nam" : "Nữ"}
            />
            <TextField
              title="Ngày tháng năm sinh"
              data={formatDate(selectedChild.dateOfBirth)}
            />
            <TextField title="Nơi sinh" data={selectedChild.birthPlace} />
          </div>

          <div className="grid grid-cols-3  gap-6 text-left">
            <TextField
              title="Phương pháp sinh"
              data={selectedChild.birthMethod}
            />
            <TextField title="Cân nặng (kg)" data={selectedChild.birthWeight} />
            <TextField
              title="Chiều cao (cm)"
              data={selectedChild.birthHeight}
            />
          </div>
          <div>
            <p>Khiếm khuyết</p>
            <textarea value={selectedChild.abnormalities} className="w-full border border-black rounded p-1"/>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default SelectChild;
