const AboutUs = () => {
    return (
        <div className="mx-auto px-4 lg:px-16 pb-10">
            <div className="pt-5 mt-3 ">
                <h2 className="text-4xl text-teal-700 font-bold text-center">
                    Trung tâm Tiêm chủng Nhân Ái
                </h2>
            </div>
            <div>
                <h2 className="text-xl md:text-2xl text-center mt-7 font-bold">
                    &quot;Tiêm chủng đã giúp cứu sống hàng triệu sinh mạng trên thế giới&quot;
                </h2>

                <p className="text-center mt-6 text-base md:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto">
                    Trung tâm tiêm chủng Nhân Ái tự hào là đơn vị có các loại vắc xin thế hệ mới nhất từ
                    các nhà sản xuất hàng đầu thế giới, toàn bộ vắc xin đều được nhập khẩu chính hãng từ các
                    nhà sản xuất lớn trên thế giới. Tiêm chủng Nhân Ái cung cấp nhiều dịch vụ tiêm chủng linh
                    hoạt theo yêu cầu của Quý khách: Tiêm lẻ, tiêm theo yêu cầu, mua đặt giữ vắc xin theo yêu cầu,
                    đặt giữ vắc xin online…
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8">
                    <div className="text-center">
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md h-52 w-full mx-auto flex flex-col items-center">
                            <img
                                className="w-full h-32 object-contain"
                                src="https://cdn.nhathuoclongchau.com.vn/unsafe/375x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/tiem_nhe_it_dau_fc0f59106c.png"
                                alt="tiem nhe it dau"
                            />
                            <h5 className="mt-4 font-semibold text-base">Tiêm nhẹ - ít đau</h5>
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md h-52 w-full mx-auto flex flex-col items-center">
                            <img
                                className="w-full h-32 object-contain"
                                src="https://cdn.nhathuoclongchau.com.vn/unsafe/375x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/vaccine_chinh_hang_da_chung_loai_b9216eeac9.png"
                                alt="vacxin chinh hang"
                            />
                            <h5 className="mt-4 font-semibold text-base">Vắc xin chính hãng, đa chủng loại</h5>
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md h-52 w-full mx-auto flex flex-col items-center">
                            <img
                                className="w-full h-32 object-contain"
                                src="https://cdn.nhathuoclongchau.com.vn/unsafe/375x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/gia_tot_0022801d83.png"
                                alt="gia tot"
                            />
                            <h5 className="mt-4 font-semibold text-base">Giá tốt</h5>
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md h-52 w-full mx-auto flex flex-col items-center">
                            <img
                                className="w-full h-32 object-contain"
                                src="https://cdn.nhathuoclongchau.com.vn/unsafe/375x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/he_thong_luu_tru_dat_chuan_GSP_8107a958b3.png"
                                alt="dat chuan GSP"
                            />
                            <h5 className="mt-4 font-semibold text-base">Hệ thống lưu trữ đạt chuẩn GSP</h5>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AboutUs;
