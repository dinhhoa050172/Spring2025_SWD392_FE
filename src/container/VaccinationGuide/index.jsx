import { FaAnglesRight } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Assets } from "@src/assets/Assets.js";

const steps = [
  {
    title: "Trước khi tiêm",
    bgColor: "bg-blue-500",
    textColor: "text-white",
    bgLight: "bg-blue-100",
    images: [Assets.step1_1, Assets.step1_2],
    content: [
      "Sàng lọc: Khám sàng lọc và tư vấn cho đối tượng tiêm chủng.",
      "Thông báo, giải đáp thắc mắc: Thông báo về loại vắc xin sẽ tiêm.",
    ],
  },
  {
    title: "Quá trình tiêm",
    bgColor: "bg-orange-500",
    textColor: "text-white",
    bgLight: "bg-orange-100",
    images: [Assets.step2_1, Assets.step2_2, Assets.step2_3],
    content: [
      "Nhân viên y tế: Kiểm tra vắc xin, bơm tiêm và dụng cụ trước khi sử dụng.",
      "Đối tượng tiêm chủng: Cho đối tượng tiêm hoặc cha mẹ, người giám hộ xem lọ vắc xin.",
      "Thực hiện tiêm: Tiêm đúng chỉ định, đúng liều, đúng đường dùng.",
    ],
  },
  {
    title: "Sau khi tiêm",
    bgColor: "bg-green-500",
    textColor: "text-white",
    bgLight: "bg-green-100",
    images: [Assets.step3_1, Assets.step3_2, Assets.step3_3],
    content: [
      "Theo dõi sau tiêm: Lưu trú, theo dõi các phản ứng sau tiêm.",
      "Bảo quản: Bảo quản vắc xin, vật tư tiêm chủng chưa sử dụng theo quy định.",
      "Xử lý chất thải: Xử lý các chất thải y tế sau tiêm chủng theo đúng quy định.",
    ],
  },
];

const VaccinationGuide = () => {
  return (
    <div className="max-w-[23rem] sm:max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        Quy trình tiêm chủng tại Nhân Ái
      </h2>

      <div className="flex justify-center mb-6">
        <img
          src={Assets.processVaccination}
          alt="Quy trình tiêm chủng"
          className="w-full max-w-[21rem] sm:max-w-[41rem] md:max-w-[61rem]"
        />
      </div>

      {/* Grid layout cho màn hình lớn */}
      <div className="hidden md:flex justify-between gap-6">
        {steps.map((step, index) => (
          <div key={index} className={`flex-1 rounded-lg overflow-hidden ${step.bgLight}`}>
            
            {/* Header */}
            <h3 className={`text-lg font-semibold ${step.textColor} ${step.bgColor} flex items-center gap-2 p-3 rounded-t-lg`}>
              <FaAnglesRight /> {step.title}
            </h3>

            {/* Nội dung */}
            <div className="flex gap-4 items-start p-2 mr-[-2rem]">
              {/* Hình ảnh bên trái */}
              <div className="w-1/5 grid grid-cols-1 gap-2">
                {step.images.map((img, idx) => (
                  <img key={idx} src={img} alt={`Step ${index + 1}`} className="w-full h-16 object-cover rounded-lg" />
                ))}
              </div>

              {/* Nội dung bên phải */}
              <ul className="w-2/3 text-sm text-gray-700">
                {step.content.map((text, idx) => (
                  <li key={idx} className="mb-2">
                    <strong>{text.split(":")[0]}:</strong> {text.split(":")[1]}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Swiper cho màn hình nhỏ */}
<div className="md:hidden w-full">
  <Swiper spaceBetween={10} slidesPerView={1} pagination={{ clickable: true }}>
    {steps.map((step, index) => (
      <SwiperSlide key={index}>
        <div className={`rounded-lg overflow-hidden ${step.bgLight} h-[24.5rem]`}>
          {/* Header */}
          <h3 className={`text-lg font-semibold ${step.textColor} ${step.bgColor} flex items-center gap-2 p-3 rounded-t-lg`}>
            <FaAnglesRight /> {step.title}
          </h3>

          {/* Bố cục giống màn hình lớn: Hình ảnh bên trái - Nội dung bên phải */}
          <div className="flex gap-4 items-start p-2">
            {/* Hình ảnh bên trái */}
            <div className="w-1/3 grid grid-cols-1 gap-2">
              {step.images.map((img, idx) => (
                <img key={idx} src={img} alt={`Step ${index + 1}`} className="w-full h-16 object-cover rounded-lg" />
              ))}
            </div>

            {/* Nội dung bên phải */}
            <ul className="w-2/3 text-sm text-gray-700">
              {step.content.map((text, idx) => (
                <li key={idx} className="mt-7 mb-10 text-left">
                  <strong>{text.split(":")[0]}:</strong> {text.split(":")[1]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
</div>

    </div>
  );
};

export default VaccinationGuide;
