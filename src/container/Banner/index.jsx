import { Assets } from "../../assets/Assets.js";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './index.css';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

const Banner = () => {
  return (
    <div>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide><img src={Assets.banner1} alt="Banner 1" /></SwiperSlide>
        <SwiperSlide><img src={Assets.banner2} alt="Banner 2" /></SwiperSlide>
        <SwiperSlide><img src={Assets.banner3} alt="Banner 3" /></SwiperSlide>
        <SwiperSlide><img src={Assets.banner4} alt="Banner 4" /></SwiperSlide>
        <SwiperSlide><img src={Assets.banner5} alt="Banner 5" /></SwiperSlide>
        <SwiperSlide><img src={Assets.banner6} alt="Banner 6" /></SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Banner;
