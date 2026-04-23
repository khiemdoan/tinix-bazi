/**
 * TuVi Question Data
 */

const TUVI_THEMES = [
    { id: 'tuvi_general', name: 'Tổng quan lá số', icon: '🌠' },
    { id: 'tuvi_career', name: 'Công danh - Sự nghiệp', icon: '🏛️' },
    { id: 'tuvi_love', name: 'Tình duyên - Gia đạo', icon: '❤️' },
    { id: 'tuvi_wealth', name: 'Tài lộc - Tiền bạc', icon: '💰' }
];

const TUVI_QUESTIONS = {
    tuvi_general: [
        { id: "TUVI_GEN_1", text: "Xin mạn phép hỏi thầy luận giải tổng quan về Cung Mệnh và Cung Thân của con có điểm gì nổi bật?", logic: "TUVI_GEN_1" },
        { id: "TUVI_GEN_2", text: "Thầy xem giúp con cuộc đời mình có bị ảnh hưởng nhiều bởi các sát tinh (Không Kiếp, Kình Đà, Linh Hỏa) không?", logic: "TUVI_GEN_2" }
    ],
    tuvi_career: [
        { id: "TUVI_CAR_1", text: "Sự nghiệp của con qua Cung Quan Lộc chỉ ra con hợp làm trong môi trường nhà nước hay kinh doanh tự do?", logic: "TUVI_CAR_1" },
        { id: "TUVI_CAR_2", text: "Đường công danh của con có bị Tuần/Triệt cản trở không và cách hóa giải thế nào?", logic: "TUVI_CAR_2" }
    ],
    tuvi_love: [
        { id: "TUVI_LOV_1", text: "Thầy xem giúp cung Phu Thê của con có bị hình khắc không, đào hoa vượng hay suy?", logic: "TUVI_LOV_1" },
        { id: "TUVI_LOV_2", text: "Người phối ngẫu tương lai của con qua lá số có tính cách và trợ lực cho con ra sao?", logic: "TUVI_LOV_2" }
    ],
    tuvi_wealth: [
        { id: "TUVI_WEA_1", text: "Cung Tài Bạch của con có số giàu sang không, tiền bạc đến từ đâu là chính?", logic: "TUVI_WEA_1" },
        { id: "TUVI_WEA_2", text: "Trong đại vận hiện tại, con có nên mạo hiểm đầu tư tài chính không?", logic: "TUVI_WEA_2" }
    ]
};

module.exports = { TUVI_THEMES, TUVI_QUESTIONS };
