// ============================================================================
// TỪ ĐIỂN TỬ VI ĐẨU SỐ (LOCAL KNOWLEDGE BASE)
// Cung cấp các đoạn text ý nghĩa để Analyzer tự ráp thành bài luận.
// Cấu trúc dễ dàng mở rộng.
// ============================================================================

const MajorStars = {
    "Tử Vi": {
        general: "Tử Vi là bậc đế vương, tượng trưng cho uy quyền, lãnh đạo và sự tôn quý. Mang đặc tính che chở, giải ách.",
        Mệnh: "Bạn có phong thái ung dung, đĩnh đạc, lòng tự tôn cao. Có khả năng lãnh đạo bẩm sinh, thích bao bọc người khác.",
        "Tài Bạch": "Kiếm tiền nhờ kỹ năng quản lý, năng lực tổ chức. Luôn chi tiêu phóng khoáng nhưng biết giữ gìn thể diện tài chính.",
        "Quan Lộc": "Sự nghiệp thăng tiến lên các vị trí điều hành. Rất hợp làm trong cơ quan nhà nước, tập đoàn lớn hoặc làm chủ doanh nghiệp."
    },
    "Thiên Cơ": {
        general: "Thiên Cơ chủ về trí tuệ, mưu lược, sự khéo léo và tư duy sắc bén. Là sao của trí thức và kỹ thuật.",
        Mệnh: "Bạn cực kỳ thông minh, nhạy bén, thích suy luận và phân tích. Tuy nhiên đôi khi dễ lo nghĩ nhiều, hay thay đổi ý định.",
        "Tài Bạch": "Kiếm tiền nhờ vào chất xám, ý tưởng và trí tuệ. Tài chính có lúc thăng lúc trầm, thích hợp buôn bán chất xám hơn là lao động chân tay.",
        "Quan Lộc": "Sự nghiệp phù hợp với các vai trò quân sư, kỹ sư, lập trình viên, nghiên cứu hoặc giảng dạy nghệ thuật."
    },
    "Thái Dương": {
        general: "Thái Dương là mặt trời, biểu tượng của sự quang minh, chính trực, nhiệt huyết và quyền lực của sự cho đi.",
        Mệnh: "Bạn có tính cách cởi mở, nhiệt tình, thích giúp đỡ người khác đến mức đôi khi ôm đồm. Rất coi trọng danh dự.",
        "Tài Bạch": "Có xu hướng chi tiêu rộng rãi. Xem trọng danh tiếng hơn tiền bạc, danh có trước rồi tài lộc mới tới sau.",
        "Quan Lộc": "Sự nghiệp toả sáng chói lọi, rất dễ đạt được địa vị cao nếu theo đuổi chính trị, giáo dục, ngoại giao, truyền thông."
    },
    "Vũ Khúc": {
        general: "Vũ Khúc là tài tinh hạng nặng, chủ về tiền tài, hành động thực tiễn, tính cách cương nghị và cực kỳ quyết đoán.",
        Mệnh: "Tính tình dứt khoát, thẳng thắn, làm việc rất thực tế và quyết liệt. Phụ nữ mệnh Vũ Khúc thường giỏi giang nhưng hơi có phần đoạt quyền nam giới.",
        "Tài Bạch": "Đích thị là sao cai quản cung Tài Bạch. Kiếm tiền cực giỏi, thích hợp với các ngành kinh tế, tài chính, đầu tư, kinh doanh buôn bán lớn.",
        "Quan Lộc": "Thường có sự nghiệp liên quan đến tài chính, ngân hàng, hoặc những công việc yêu cầu sự sắt đá, kỷ luật cao như lực lượng vũ trang."
    },
    "Thiên Đồng": {
        general: "Thiên Đồng là phúc tinh, biểu tượng của sự nhàn hạ, vui vẻ, thích hưởng thụ và tính tình có phần trẻ con, chóng chán.",
        Mệnh: "Bạn ôn hòa, dĩ hòa vi quý, không thích tranh giành bon chen. Có lộc ăn uống, cuộc sống nhìn chung thích an nhàn.",
        "Tài Bạch": "Không quá đặt nặng chuyện kiếm tiền nên tài lộc thường đến một cách tự nhiên. Tiền bạc ở mức đủ tiêu xài rủng rỉnh.",
        "Quan Lộc": "Hợp với các công việc mang tính tự do, ít áp lực, hoặc các ngành dịch vụ, ẩm thực, giải trí, thiết kế."
    },
    "Liêm Trinh": {
        general: "Liêm Trinh là sao vừa mang tính tù (kỷ luật thép) vừa mang tính đào hoa (ảo vọng, nghệ thuật).",
        Mệnh: "Tính cách cực kỳ phức tạp. Vừa có sự ngay thẳng, nghiêm khắc, bảo thủ, nhưng bên trong lại lãng mạn và rất nhạy cảm với cái đẹp.",
        "Tài Bạch": "Tài lộc hay gặp bấp bênh hoặc dính líu đến thi phi, giấy tờ. Cần hạn chế mạo hiểm.",
        "Quan Lộc": "Phát huy cực tốt trong các lĩnh vực pháp luật, thuế, công an, hoặc ngược lại là các ngành nghệ thuật thị giác."
    },
    "Thiên Phủ": {
        general: "Thiên Phủ là cái kho chứa tiền (thiên khố), biểu tượng của sự ổn định, tích luỹ, bao dung và cẩn trọng.",
        Mệnh: "Bạn mang phong thái khoan thai, chín chắn. Tính tình cẩn thận, biết vun vén, tính toán chu toàn cho gia đình.",
        "Tài Bạch": "Cách giữ tiền cực tốt. Tài vận ổn định, tích tiểu thành đại. Rất phù hợp với việc đầu tư tích sản.",
        "Quan Lộc": "Sự nghiệp ổn định, vững chắc, thăng tiến tuần tự. Thích hợp làm quản lý kho tàng, vận hành doanh nghiệp."
    },
    "Thái Âm": {
        general: "Thái Âm là mặt trăng, chủ về điền trạch và của cải, tượng trưng cho sự dịu dàng, lãng mạn, âm thầm.",
        Mệnh: "Dáng vẻ thanh tú, tính cách điềm đạm, yêu thơ ca nghệ thuật, thích sự sạch sẽ và có trực giác rất mạnh.",
        "Tài Bạch": "Tiền tài dồi dào, thường kiếm tiền qua những công việc nhẹ nhàng hoặc từ bất động sản rớt xuống.",
        "Quan Lộc": "Hành sự âm thầm, nên làm kế hoạch, tài chính nội bộ, bất động sản, hoặc văn thư nghệ thuật."
    },
    "Tham Lang": {
        general: "Tham Lang là sao của dục vọng, quan hệ xã hội, nghệ thuật và sự biến động. Dễ sa đà nhưng cũng rất tài năng.",
        Mệnh: "Bạn cực kỳ khéo léo trong giao tiếp, đa tài đa nghệ, nhiều đam mê, tham vọng lớn sống rất biết cách tận hưởng.",
        "Tài Bạch": "Tiền bạc biến động mạnh, dám bạo gan đầu tư. Thường kiếm tiền qua các mối quan hệ xã giao hoặc ngành giải trí.",
        "Quan Lộc": "Sự nghiệp nhiều thăng trầm. Hợp làm kinh doanh tự do, giải trí, nhà hàng, hoặc các mảng giao tiếp nhiều."
    },
    "Cự Môn": {
        general: "Cự Môn là ám tinh, chủ về ngôn ngữ, miệng lưỡi, thị phi, nhưng cũng đại diện cho khả năng hùng biện xuất sắc.",
        Mệnh: "Bạn có tài ăn nói, phản biện tinh tế, hay phân tích sự việc đa chiều nhưng cũng vì thế mà dễ gặp rắc rối từ lời nói.",
        "Tài Bạch": "Dùng miệng lưỡi để kiếm tiền. Rất hợp làm luật sư, giáo viên, tư vấn viên, sale.",
        "Quan Lộc": "Phù hợp với các ngành nghề đòi hỏi sự giao tiếp nhiều, ngoại ngữ, nghiên cứu, y học."
    },
    "Thiên Tướng": {
        general: "Thiên Tướng là tể tướng, mang tính ấn tín, phò trợ. Chủ về sự uy nghi, ăn mặc chải chuốt, tính tình trượng nghĩa.",
        Mệnh: "Hay lo chuyện bao đồng, thích giúp người. Phong thái sang trọng, đàng hoàng, có tư chất làm vị trí số 2 xuất sắc.",
        "Tài Bạch": "Quản lý dòng tiền tốt. Thu nhập công bằng, rõ ràng, minh bạch.",
        "Quan Lộc": "Sự nghiệp rất xán lạn nếu theo mảng nhân sự, tham mưu, thẩm mỹ, đồ hiệu."
    },
    "Thiên Lương": {
        general: "Thiên Lương là ấm tinh, chủ về sự thọ, yếu tố người lớn tuổi, tính cách thanh cao và hay gánh vác trách nhiệm.",
        Mệnh: "Mang dáng vẻ của người từng trải dù còn trẻ. Tính tình hiền lành, nhân hậu, lúc nào cũng lo lắng cho người khác.",
        "Tài Bạch": "Không tham tiền tài, thường có lộc bất ngờ từ người lớn tuổi hoặc tài sản thừa kế. Dễ mất tiền vì bao đồng.",
        "Quan Lộc": "Tuyệt vời nhất là ngành y tế, giáo dục, bảo hiểm, công tác xã hội hay thanh tra giám sát."
    },
    "Thất Sát": {
        general: "Thất Sát là tướng tinh, chủ về sự dũng mãnh, sát phạt, hành động độc lập và chịu nhiều phong ba bão táp.",
        Mệnh: "Tính cách cực kỳ mạnh mẽ, không sợ trời đất. Hay tự mình đương đầu với khó khăn, quyết đoán nhưng có phần ngang bướng.",
        "Tài Bạch": "Kiếm tiền nhanh chóng, bạo phát bạo tàn. Dễ kinh doanh các mảng sắc bén hoặc công nghệ lõi.",
        "Quan Lộc": "Sự nghiệp đầy sóng gió nhưng thành tựu lớn. Phù hợp lực lượng vũ trang, chỉ huy chiến lược, kỹ thuật viên cấp cao."
    },
    "Phá Quân": {
        general: "Phá Quân là sao của sự phá hủy để xây mới. Chủ về sự tiên phong, hao tán, sáng tạo không ngừng.",
        Mệnh: "Ghét sự tĩnh lặng, luôn muốn đạp đổ cái cũ để tạo ra cái mới. Cuộc đời nhiều biến động lớn mang tính bước ngoặt.",
        "Tài Bạch": "Dám kiếm dám tiêu, tiền bạc ra vào lượng cực lớn. Muốn kiếm tiền thường phải đầu tư phá bỏ số vốn ban đầu.",
        "Quan Lộc": "Rất hợp làm khởi nghiệp (startup), tái cấu trúc doanh nghiệp, vận tải, thiết kế thi công."
    }
};

const Mutagens = {
    "Lộc": "Hóa Lộc mang lại may mắn, tài lộc, sự sinh sôi nảy nở. Chủ sự có nhiều tiền của hơn bình thường, lộc ăn uống, vui vẻ, buôn vạn bán ngàn.",
    "Quyền": "Hóa Quyền biểu tượng của thực quyền, năng lực quyết đoán. Tăng cường khả năng cầm quân, dễ thăng quan tiến chức.",
    "Khoa": "Hóa Khoa là đệ nhất giải thần, mang ý nghĩa học hành khoa bảng, danh tiếng vang xa, quý nhân hóa giải tai ương.",
    "Kỵ": "Hóa Kỵ là sự trắc trở, thị phi, ghen ghét. Thường mọi sự sẽ chậm lại, dễ dính hiểu lầm hoặc cản trở trước khi đạt thành tựu."
};

const BadStars = {
    "Địa Không": "Sát tinh hạng nặng (Không Vong), mang tính hao phá bất ngờ, làm tiêu tan của cải nhanh chóng nếu hám tư lợi.",
    "Địa Kiếp": "Cấp độ cướp đoạt cao nhất, chủ tai hoạ, mất mát thực tế. Đặc tính 'kiếm củi 3 năm thiêu một giờ'.",
    "Kình Dương": "Tính bạo lực, rào cản, mổ xẻ nhưng cũng là sức bứt phá cực kỳ sắc bén.",
    "Đà La": "Thị phi, trì trệ, làm việc gì cũng nhùng nhằng, khó dứt điểm.",
    "Hỏa Tinh": "Tính nóng nảy, phát tác cực nhanh, dễ gặp tai hoạ mang tính chớp nhoáng.",
    "Linh Tinh": "Tính nóng ngầm, âm ỉ, uất ức bên trong. Tai hoạ mang tính kéo dài dằn vặt."
};

const GoodStars = {
    "Văn Xương": "Bổ trợ mạnh mẽ cho tư duy logic, thi cử, giấy tờ, hợp đồng.",
    "Văn Khúc": "Bổ trợ mạnh mẽ cho năng khiếu nghệ thuật, ăn nói, ngoại ngữ.",
    "Tả Phù": "Người trợ lý đắc lực, tăng mạnh các mối quan hệ xã hội tốt.",
    "Hữu Bật": "Sự phò tá ngầm, luôn có người đứng phía sau hỗ trợ.",
    "Thiên Khôi": "Quý nhân là người lớn tuổi, sếp lớn, cơ hội lớn đến một cách trực tiếp.",
    "Thiên Việt": "Quý nhân mang tính gián tiếp, cơ hội do may mắn ngẫu nhiên mang lại.",
    "Lộc Tồn": "Tài lộc vững bền, nhưng thường bị Kình Đà kẹp ngàm nên kiếm tiền đỏi hỏi phải chịu nhiều áp lực cứng."
};

const SpecialModifiers = {
    "Tuần Không": "Tuần Không đóng vòng phong tỏa, làm chậm lại mọi sự. Sao tốt bị giảm độ tốt, sao xấu bị kìm chế độ xấu nửa đời đầu.",
    "Triệt Không": "Triệt Không là sự chặt đứt, trắc trở mạnh mẽ ở 30 năm đầu dương gian. Tuy nhiên sau 30 tuổi thì sức cản sẽ nhẹ dần."
};

const DecadalMeanings = {
    "Mệnh": "Đại vận này trọng tâm quay về bản thân, xây dựng nền tảng, định hình lại cá tính và cuộc sống.",
    "Huynh Đệ": "Đại vận chủ về sự hợp tác, anh em, bạn bè. Có nhiều cơ hội liên kết phát triển nhưng cũng cần đề phòng tranh chấp.",
    "Phu Thê": "Thời kỳ hôn nhân và các mối quan hệ tình cảm chiếm ưu thế. Có thể có những biến động lớn về gia đình.",
    "Tử Nữ": "Giai đoạn tập trung cho con cái, thế hệ trẻ, hoặc khởi đầu những dự án sáng tạo mới.",
    "Tài Bạch": "Đại vận rực rỡ về kinh tế, tập trung tích luỹ và luân chuyển dòng tiền.",
    "Tật Ách": "Cần đặc biệt lưu ý đến sức khoẻ, những thay đổi ngầm bên trong cơ thể hoặc những rắc rối pháp lý.",
    "Thiên Di": "Vận trình có sự thay đổi lớn về nơi ăn chốn ở, đi xa, xuất ngoại hoặc thay đổi môi trường làm việc.",
    "Nô Bộc": "Giai đoạn quan hệ xã hội mở rộng, có sự hỗ trợ từ cấp dưới hoặc bạn bè, nhưng cũng dễ dính thi phi.",
    "Quan Lộc": "Sự nghiệp thăng tiến mạnh mẽ, có nhiều cơ hội khẳng định vị trí và quyền lực.",
    "Điền Trạch": "Đại vận thuận lợi cho mua sắm bất động sản, sửa sang nhà cửa, ổn định gia đạo.",
    "Phúc Đức": "Tâm tính hướng thiện, thích hưởng thụ tinh thần hoặc có sự phù trì từ tổ tiên. Vận trình thanh thản.",
    "Phụ Mẫu": "Chủ về sự che chở của bề trên, danh tiếng hoặc các giấy tờ bổng lộc từ cơ quan nhà nước."
};

const CycleGeneral = {
    "Yearly": "Vận trình Lưu Niên (Năm nay) mang tính chất biến động ngắn hạn. Mọi thành bại trong năm phụ thuộc lớn vào việc cung Lưu Thái Tuế kích hoạt vào đâu và Tứ Hóa năm nay tác động lên các chính tinh thế nào.",
    "Monthly": "Vận trình Lưu Nguyệt (Tháng) phản ánh những sự việc mang tính chu kỳ ngắn, nhịp sống thường ngày. Hãy quan sát Hóa Lộc, Hóa Kỵ của tháng để biết dòng tiền và mâu thuẫn.",
    "Daily": "Vận trình Lưu Nhật (Ngày) thiên về cảm xúc, những quyết định chớp nhoáng hoặc các sự việc nhỏ nhặt phát sinh. Cần tránh manh động nếu gặp Hóa Kỵ trùng phùng."
};

const TuHoaMeaning = {
    "Lộc": "HÓA LỘC: Chủ về nhân duyên tốt đẹp, khởi sắc tài chính, có thu hoạch, tâm trạng vui vẻ hanh thông. Mang năng lượng của mầm non, sự nở rộ.",
    "Quyền": "HÓA QUYỀN: Chủ về sự quyết đoán, gia tăng quyền lực, sự cạnh tranh, muốn kiểm soát, thăng tiến công danh. Mang năng lượng của sức nóng, sức mạnh.",
    "Khoa": "HÓA KHOA: Chủ về danh tiếng, khoa bảng, sự hanh thông nhờ quý nhân phù trợ, chuyển hung thành cát, học hành mẫn tiệp. Mang năng lượng của ánh sáng thanh tao.",
    "Kỵ": "HÓA KỴ: Chủ về sự bế tắc, hiểu lầm, hao tài, trắc trở, thị phi, dễ có cản trở bất ngờ hoặc tổn thương tình cảm. Cần rèn chữ 'Nhẫn' khi gặp Hóa Kỵ."
};

const LuuDieuMeaning = {
    "Lưu Thái Tuế": "Thái Quản khâm mạng năm nay trực tiếp soi chiếu tới cung này, các sự kiện cốt lõi trong năm sẽ xoay quanh chủ đề của cung này.",
    "Lưu Lộc Tồn": "Phát tài phát lộc, có nguồn thu dư dả hoặc lợi ích bất ngờ tới cung này.",
    "Lưu Thiên Mã": "Ra ngoài bôn ba, dịch chuyển, thay đổi hoàn cảnh hoặc công việc (Thường kèm thay đổi chỗ ở/đi làm xa).",
    "Lưu Kình Dương": "Sự dèm pha, va chạm, mâu thuẫn bộc phát, cẩn thận hình thương.",
    "Lưu Đà La": "Sự trì trệ, rắc rối ngầm, việc đang trôi chảy tự dưng chững lại.",
    "Lưu Khốc Khách": "Nếu đi cùng Mã sẽ thành cự giá (ngựa có chuông), chủ về vang danh thiên hạ. Nếu đi với hung tinh thì hao lệ, buồn lo."
};

const BodyPalaceMeanings = {
    "Mệnh": "Thân cư Mệnh: Tư tưởng và hành động nhất quán. Bạn là người tự lập, tin vào bản thân, sướng khổ đều do tự tay mình làm ra. Tính cách ít thay đổi theo thời gian.",
    "Phu Thê": "Thân cư Phu Thê: Coi trọng tình cảm gia đình. Sau khi kết hôn, sự nghiệp và tâm tính chịu ảnh hưởng rất lớn từ người bạn đời. Thành bại thường gắn liền với sự ổn định của gia đạo.",
    "Tài Bạch": "Thân cư Tài Bạch: Rất thực tế, coi trọng giá trị vật chất và năng lực kiếm tiền. Cuộc sống xoay quanh các hoạt động kinh tế, làm việc gì cũng tính toán đến tính thực dụng.",
    "Thiên Di": "Thân cư Thiên Di: Thích bay nhảy, hướng ngoại. Cuộc đời gắn liền với những chuyến đi, hay thay đổi môi trường sống hoặc làm việc. Thành công thường đến ở nơi xa quê hương.",
    "Quan Lộc": "Thân cư Quan Lộc: Say mê công việc, coi trọng danh tiếng và sự nghiệp. Đặt nặng trách nhiệm xã hội, sống để làm việc và cống hiến.",
    "Phúc Đức": "Thân cư Phúc Đức: Coi trọng đời sống tinh thần và cội nguồn. Thường được hưởng phúc đức dòng họ, có trực giác tâm linh tốt, sướng khổ tại tâm."
};

const HarmonyMeanings = {
    "Cục sinh Mệnh": "CỤC SINH MỆNH: Môi trường xã hội cực kỳ thuận lợi cho bạn. Bạn như cá gặp nước, đi đâu cũng có người giúp đỡ, cơ hội tự tìm đến. Cuộc đời ít gặp nghịch cảnh lớn.",
    "Mệnh Cục đồng hành": "MỆNH CỤC ĐỒNG HÀNH: Bạn hòa hợp tuyệt vời với môi trường xung quanh. Cuộc sống bình ổn, dễ thích nghi, ít sóng gió vượt cấp.",
    "Mệnh sinh Cục": "MỆNH SINH CỤC: Bạn thường phải cống hiến cho xã hội, lo toan cho người khác mới có thành tựu. Bản thân là người tạo ra giá trị cho môi trường xung quanh.",
    "Cục khắc Mệnh": "CỤC KHẮC MỆNH: Cuộc đời nhiều thử thách, môi trường xã hội hay chèn ép hoặc gây khó khăn. Bạn phải đấu tranh quyết liệt để giành lấy chỗ đứng.",
    "Mệnh khắc Cục": "MỆNH KHẮC CỤC: Bạn là người có nội lực mạnh, tự tay xoay chuyển hoàn cảnh. Dù môi trường khó khăn, bạn vẫn chiến thắng bằng ý chí cứng cỏi."
};

module.exports = {
    MajorStars,
    Mutagens,
    BadStars,
    GoodStars,
    SpecialModifiers,
    DecadalMeanings,
    CycleGeneral,
    TuHoaMeaning,
    LuuDieuMeaning,
    BodyPalaceMeanings,
    HarmonyMeanings
};
