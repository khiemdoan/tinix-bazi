/**
 * TỬ VI ĐẨU SỐ ENGINE v1.2.2
 * Final stability fix - restored legacy fields for calculator compatibility.
 */

const { Solar, Lunar } = require('lunar-javascript');

// ═══ CONSTANTS ═══
const STEMS = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
const BRANCHES = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
const PALACES_ORDER = ['Mệnh','Phụ Mẫu','Phúc Đức','Điền Trạch','Quan Lộc','Nô Bộc','Thiên Di','Tật Ách','Tài Bạch','Tử Nữ','Phu Thê','Huynh Đệ'];

const ZIWEI_GROUP = ['Tử Vi','Thiên Cơ','','Thái Dương','Vũ Khúc','Thiên Đồng','','','Liêm Trinh'];
const TIANFU_GROUP = ['Thiên Phủ','Thái Âm','Tham Lang','Cự Môn','Thiên Tướng','Thiên Lương','Thất Sát','','','','Phá Quân'];

const CUC_ORDER = ['water2nd','wood3rd','metal4th','earth5th','fire6th']; // Correct alphabet or alphabetic? No.
const CUC_NAMES_MAP = { 'wood3rd':'Mộc Tam Cục','metal4th':'Kim Tứ Cục','water2nd':'Thủy Nhị Cục','fire6th':'Hỏa Lục Cục','earth5th':'Thổ Ngũ Cục' };
const CUC_VALUES_MAP = { 'wood3rd':3,'metal4th':4,'water2nd':2,'fire6th':6,'earth5th':5 };

const TU_HOA = {
    'Giáp': ['Liêm Trinh','Phá Quân','Vũ Khúc','Thái Dương'], 'Ất': ['Thiên Cơ','Thiên Lương','Tử Vi','Thái Âm'], 'Bính': ['Thiên Đồng','Thiên Cơ','Văn Xương','Liêm Trinh'], 'Đinh': ['Thái Âm','Thiên Đồng','Thiên Cơ','Cự Môn'], 'Mậu': ['Tham Lang','Thái Âm','Hữu Bật','Thiên Cơ'],
    'Kỷ': ['Vũ Khúc','Tham Lang','Thiên Lương','Văn Khúc'], 'Canh': ['Thái Dương','Vũ Khúc','Thái Âm','Thiên Đồng'], 'Tân': ['Cự Môn','Thái Dương','Văn Khúc','Văn Xương'], 'Nhâm': ['Thiên Lương','Tử Vi','Tả Phù','Vũ Khúc'], 'Quý': ['Phá Quân','Cự Môn','Thái Âm','Tham Lang'],
};
const HOA_NAMES = ['Lộc','Quyền','Khoa','Kỵ'];

const LU_CUN_TABLE = { 'Giáp':'Dần','Ất':'Mão','Bính':'Tỵ','Đinh':'Ngọ','Mậu':'Tỵ', 'Kỷ':'Ngọ','Canh':'Thân','Tân':'Dậu','Nhâm':'Hợi','Quý':'Tý' };
const KHOI_VIET_TABLE = { 'Giáp':['Sửu','Mùi'],'Mậu':['Sửu','Mùi'],'Canh':['Sửu','Mùi'], 'Ất':['Tý','Thân'],'Kỷ':['Tý','Thân'], 'Bính':['Hợi','Dậu'],'Đinh':['Hợi','Dậu'], 'Tân':['Ngọ','Dần'], 'Nhâm':['Mão','Tỵ'],'Quý':['Mão','Tỵ'] };
const THIEN_MA_TABLE = { 'Dần':'Thân','Ngọ':'Thân','Tuất':'Thân', 'Thân':'Dần','Tý':'Dần','Thìn':'Dần', 'Tỵ':'Hợi','Dậu':'Hợi','Sửu':'Hợi', 'Hợi':'Tỵ','Mão':'Tỵ','Mùi':'Tỵ' };
const HOA_TINH_START = { 'Dần':'Sửu','Ngọ':'Sửu','Tuất':'Sửu', 'Thân':'Dần','Tý':'Dần','Thìn':'Dần', 'Tỵ':'Mão','Dậu':'Mão','Sửu':'Mão', 'Hợi':'Dậu','Mão':'Dậu','Mùi':'Dậu' };
const LINH_TINH_START = { 'Dần':'Mão','Ngọ':'Mão','Tuất':'Mão', 'Thân':'Tuất','Tý':'Tuất','Thìn':'Tuất', 'Tỵ':'Tuất','Dậu':'Tuất','Sửu':'Tuất', 'Hợi':'Tuất','Mão':'Tuất','Mùi':'Tuất' };

const CO_THAN_TABLE = { 'Dần':'Tỵ','Mão':'Tỵ','Thìn':'Tỵ', 'Tỵ':'Thân','Ngọ':'Thân','Mùi':'Thân', 'Thân':'Hợi','Dậu':'Hợi','Tuất':'Hợi', 'Hợi':'Dần','Tý':'Dần','Sửu':'Dần' };
const QUA_TU_TABLE = { 'Dần':'Sửu','Mão':'Sửu','Thìn':'Sửu', 'Tỵ':'Thìn','Ngọ':'Thìn','Mùi':'Thìn', 'Thân':'Mùi','Dậu':'Mùi','Tuất':'Mùi', 'Hợi':'Tuất','Tý':'Tuất','Sửu':'Tuất' };
const THIEN_TRU_TABLE = { 'Giáp':'Tỵ','Ất':'Ngọ','Bính':'Tý','Đinh':'Tỵ','Mậu':'Ngọ', 'Kỷ':'Thân','Canh':'Dần','Tân':'Ngọ','Nhâm':'Dậu','Quý':'Hợi' };
const PHA_TOAI_TABLE = { 'Tý':'Tỵ','Sửu':'Sửu','Dần':'Dậu','Mão':'Tỵ','Thìn':'Sửu','Tỵ':'Dậu', 'Ngọ':'Tỵ','Mùi':'Sửu','Thân':'Dậu','Dậu':'Tỵ','Tuất':'Sửu','Hợi':'Dậu' };
const PHI_LIEM = ['Thân','Dậu','Tuất','Tỵ','Ngọ','Mùi','Dần','Mão','Thìn','Hợi','Tý','Sửu'];
const THIEN_QUAN_TABLE = { 'Giáp':'Mùi','Ất':'Thìn','Bính':'Tỵ','Đinh':'Dần','Mậu':'Mão', 'Kỷ':'Dậu','Canh':'Hợi','Tân':'Dậu','Nhâm':'Tuất','Quý':'Ngọ' };
const THIEN_PHUC_TABLE = { 'Giáp':'Dậu','Ất':'Thân','Bính':'Tý','Đinh':'Hợi','Mậu':'Mão', 'Kỷ':'Dần','Canh':'Ngọ','Tân':'Tỵ','Nhâm':'Ngọ','Quý':'Tỵ' };

const TRANG_SINH = ['Trường Sinh','Mộc Dục','Quan Đới','Lâm Quan','Đế Vượng','Suy','Bệnh','Tử','Mộ','Tuyệt','Thai','Dưỡng'];
const BAC_SI = ['Bác Sĩ','Lực Sĩ','Thanh Long','Tiểu Hao','Tướng Quân','Tấu Thư','Phi Liêm','Hỷ Thần','Bệnh Phù','Đại Hao','Phục Binh','Quan Phủ'];
const TUONG_TINH = ['Tướng Tinh','Phan Án','Tuế Dịch','Tức Thần','Hoa Cái','Kiếp Sát','Tai Sát','Thiên Sát','Chỉ Bối','Hàm Trì','Nguyệt Sát','Vong Thần'];
const TUE_KIEN = ['Thái Tuế','Hối Khí','Tang Môn','Quán Tác','Quan Phù','Tiểu Hao','Đại Hao','Long Đức','Bạch Hổ','Thiên Đức','Điếu Khách','Trực Phù'];

const MENH_CHU = { 'Tý':'Tham Lang','Sửu':'Cự Môn','Dần':'Lộc Tồn','Mão':'Văn Khúc','Thìn':'Liêm Trinh','Tỵ':'Vũ Khúc', 'Ngọ':'Phá Quân','Mùi':'Vũ Khúc','Thân':'Liêm Trinh','Dậu':'Văn Khúc','Tuất':'Lộc Tồn','Hợi':'Cự Môn' };
const THAN_CHU = { 'Tý':'Linh Tinh','Sửu':'Thiên Tướng','Dần':'Thiên Lương','Mão':'Thiên Đồng', 'Thìn':'Văn Xương','Tỵ':'Thiên Cơ','Ngọ':'Hỏa Tinh','Mùi':'Thiên Tướng', 'Thân':'Thiên Lương','Dậu':'Thiên Đồng','Tuất':'Văn Xương','Hợi':'Thiên Cơ' };

const BRIGHTNESS = {
    'Tử Vi': ['B','B','M','M','V','Đ','M','M','V','B','B','M'], 'Thiên Cơ': ['Đ','M','M','M','V','Đ','Đ','H','M','H','Đ','H'], 'Thái Dương':['V','Đ','M','M','V','Đ','B','H','H','H','H','H'], 'Vũ Khúc': ['M','M','Đ','H','V','M','M','Đ','V','M','Đ','Đ'], 'Thiên Đồng':['B','H','M','M','Đ','H','M','H','Đ','M','M','Đ'],
    'Liêm Trinh':['V','B','M','H','Đ','H','V','B','M','H','B','H'], 'Thiên Phủ': ['M','M','M','M','B','M','M','M','B','M','M','M'], 'Thái Âm': ['H','H','H','H','H','H','B','Đ','V','M','M','M'], 'Tham Lang': ['M','H','Đ','M','H','B','M','H','Đ','M','B','H'], 'Cự Môn': ['M','M','Đ','M','B','H','M','H','Đ','H','B','B'],
    'Thiên Tướng':['M','Đ','Đ','H','V','Đ','M','Đ','Đ','H','V','Đ'], 'Thiên Lương':['M','M','V','H','M','M','M','Đ','H','H','V','Đ'], 'Thất Sát': ['M','V','M','H','Đ','M','M','M','Đ','V','M','H'], 'Phá Quân': ['M','H','Đ','M','H','B','M','H','H','Đ','H','B'],
    'Văn Xương': ['Đ','Đ','M','B','Đ','H','M','Đ','V','M','B','Đ'], 'Văn Khúc': ['Đ','Đ','M','B','Đ','H','M','Đ','V','M','B','Đ'], 'Kình Dương':['H','H','M','H','H','M','H','H','M','H','H','M'], 'Đà La': ['M','H','H','M','M','H','M','H','H','M','M','H'],
    'Địa Không':['H','H','Đ','H','H','Đ','H','H','Đ','H','H','Đ'], 'Địa Kiếp':['H','H','Đ','H','H','Đ','H','H','Đ','H','H','Đ'], 'Hỏa Tinh':['H','H','Đ','H','H','Đ','V','M','M','H','H','H'], 'Linh Tinh':['H','H','Đ','H','H','Đ','V','M','M','H','H','H'],
    'Thiên Khôi':['Đ','.','Đ','.','Đ','.','Đ','.','Đ','.','Đ','.'], 'Thiên Việt':['Đ','.','Đ','.','Đ','.','Đ','.','Đ','.','Đ','.'], 'Thiên Mã': ['Đ','Đ','.','.','Đ','Đ','.','.','Đ','Đ','.','.'],
    'Long Trì': ['.','.','Đ','.','.','Đ','.','.','Đ','.','.','Đ'], 'Phượng Các':['.','.','Đ','.','.','Đ','.','.','Đ','.','.','Đ'], 'Giải Thần': ['.','.','Đ','.','.','Đ','.','.','Đ','.','.','Đ'],
};
const BRIGHTNESS_MAP = { 'M':'Miếu', 'V':'Vượng', 'Đ':'Đắc', 'B':'Bình', 'H':'Hãm', '.':'Bất' };

const WEIGHT_YEAR = { 'Tý': 12, 'Sửu': 5, 'Dần': 7, 'Mão': 8, 'Thìn': 9, 'Tỵ': 6, 'Ngọ': 10, 'Mùi': 8, 'Thân': 5, 'Dậu': 9, 'Tuất': 14, 'Hợi': 6 };
const WEIGHT_MONTH = { 1: 6, 2: 7, 3: 18, 4: 9, 5: 5, 6: 16, 7: 9, 8: 15, 9: 18, 10: 8, 11: 9, 12: 5 };
const WEIGHT_DAY = { 1: 5, 2: 10, 3: 8, 4: 15, 5: 16, 6: 15, 7: 8, 8: 16, 9: 8, 10: 16, 11: 9, 12: 17, 13: 8, 14: 17, 15: 10, 16: 8, 17: 9, 18: 18, 19: 5, 20: 15, 21: 10, 22: 9, 23: 8, 24: 9, 25: 15, 26: 18, 27: 7, 28: 8, 29: 16, 30: 6 };
const WEIGHT_HOUR = { 'Tý': 16, 'Sửu': 6, 'Dần': 7, 'Mão': 10, 'Thìn': 9, 'Tỵ': 16, 'Ngọ': 10, 'Mùi': 8, 'Thân': 8, 'Dậu': 9, 'Tuất': 6, 'Hợi': 6 };

const NAP_AM = {
    'Giáp Tý': 'Hải Trung Kim', 'Ất Sửu': 'Hải Trung Kim', 'Bính Dần': 'Lư Trung Hỏa', 'Đinh Mão': 'Lư Trung Hỏa', 'Mậu Thìn': 'Đại Lâm Mộc', 'Kỷ Tỵ': 'Đại Lâm Mộc', 'Canh Ngọ': 'Lộ Bàng Thổ', 'Tân Mùi': 'Lộ Bàng Thổ',
    'Nhâm Thân': 'Kiếm Phong Kim', 'Quý Dậu': 'Kiếm Phong Kim', 'Giáp Tuất': 'Sơn Đầu Hỏa', 'Ất Hợi': 'Sơn Đầu Hỏa', 'Bính Tý': 'Giản Hạ Thủy', 'Đinh Sửu': 'Giản Hạ Thủy', 'Mậu Dần': 'Thành Đầu Thổ', 'Kỷ Mão': 'Thành Đầu Thổ',
    'Canh Thìn': 'Bạch Lạp Kim', 'Tân Tỵ': 'Bạch Lạp Kim', 'Nhâm Ngọ': 'Dương Liễu Mộc', 'Quý Mùi': 'Dương Liễu Mộc', 'Giáp Thân': 'Tuyền Trung Thủy', 'Ất Dậu': 'Tuyền Trung Thủy', 'Bính Tuất': 'Ốc Thượng Thổ', 'Đinh Hợi': 'Ốc Thượng Thổ',
    'Mậu Tý': 'Thích Lịch Hỏa', 'Kỷ Sửu': 'Thích Lịch Hỏa', 'Canh Dần': 'Tùng Bách Mộc', 'Tân Mùi': 'Tùng Bách Mộc', 'Nhâm Thìn': 'Trường Lưu Thủy', 'Quý Tỵ': 'Trường Lưu Thủy', 'Giáp Ngọ': 'Sa Trung Kim', 'Ất Mùi': 'Sa Trung Kim',
    'Bính Thân': 'Sơn Hạ Hỏa', 'Đinh Dậu': 'Sơn Hạ Hỏa', 'Mậu Tuất': 'Bình Địa Mộc', 'Kỷ Hợi': 'Bình Địa Mộc', 'Canh Tý': 'Bích Thượng Thổ', 'Tân Sửu': 'Bích Thượng Thổ', 'Nhâm Dần': 'Kim Bạch Kim', 'Quý Mão': 'Kim Bạch Kim',
    'Giáp Thìn': 'Phú Đăng Hỏa', 'Ất Tỵ': 'Phú Đăng Hỏa', 'Bính Ngọ': 'Thiên Hà Thủy', 'Đinh Mùi': 'Thiên Hà Thủy', 'Mậu Thân': 'Đại Trạch Thổ', 'Kỷ Dậu': 'Đại Trạch Thổ', 'Canh Tuất': 'Thoa Xuyến Kim', 'Tân Hợi': 'Thoa Xuyến Kim',
    'Nhâm Tý': 'Tang Đố Mộc', 'Quý Sửu': 'Tang Đố Mộc', 'Giáp Dần': 'Đại Khê Thủy', 'Ất Mão': 'Đại Khê Thủy', 'Bính Thìn': 'Sa Trung Thổ', 'Đinh Tỵ': 'Sa Trung Thổ', 'Mậu Ngọ': 'Thiên Thượng Hỏa', 'Kỷ Mùi': 'Thiên Thượng Hỏa',
    'Canh Thân': 'Thạch Lựu Mộc', 'Tân Dậu': 'Thạch Lựu Mộc', 'Nhâm Tuất': 'Đại Hải Thủy', 'Quý Hợi': 'Đại Hải Thủy'
};
const ELEMENTAL_RELATIONS = {
    'Kim-Mộc': 'Kim khắc Mộc', 'Kim-Thủy': 'Kim sinh Thủy', 'Kim-Hỏa': 'Hỏa khắc Kim', 'Kim-Thổ': 'Thổ sinh Kim', 'Kim-Kim': 'Kim hòa hợp',
    'Mộc-Thổ': 'Mộc khắc Thổ', 'Mộc-Hỏa': 'Mộc sinh Hỏa', 'Mộc-Kim': 'Kim khắc Mộc', 'Mộc-Thủy': 'Thủy sinh Mộc', 'Mộc-Mộc': 'Mộc hòa hợp',
    'Thủy-Hỏa': 'Thủy khắc Hỏa', 'Thủy-Mộc': 'Thủy sinh Mộc', 'Thủy-Thổ': 'Thổ khắc Thủy', 'Thủy-Kim': 'Kim sinh Thủy', 'Thủy-Thủy': 'Thủy hòa hợp',
    'Hỏa-Kim': 'Hỏa khắc Kim', 'Hỏa-Thổ': 'Hỏa sinh Thổ', 'Hỏa-Thủy': 'Thủy khắc Hỏa', 'Hỏa-Mộc': 'Mộc sinh Hỏa', 'Hỏa-Hỏa': 'Hỏa hòa hợp',
    'Thổ-Thủy': 'Thổ khắc Thủy', 'Thổ-Kim': 'Thổ sinh Kim', 'Thổ-Mộc': 'Mộc khắc Thổ', 'Thổ-Hỏa': 'Hỏa sinh Thổ', 'Thổ-Thổ': 'Thổ hòa hợp'
};

function fix(idx, max = 12) { idx = idx % max; return idx < 0 ? idx + max : idx; }
function branchIdx(name) { return BRANCHES.indexOf(name); }
function stemIdx(name) { return STEMS.indexOf(name); }
function palaceIdx(branchName) { return branchIdx(branchName); }
function branchFromPalaceIdx(pIdx) { return BRANCHES[fix(pIdx)]; }
function getBrightness(starName, pIdx) { const table = BRIGHTNESS[starName]; if (!table) return ''; return BRIGHTNESS_MAP[table[fix(pIdx)]] || ''; }

class TuViEngine {
    static calculate(opts) {
        let lunarDate;
        try {
            if (opts.isLunar) { lunarDate = Lunar.fromYmd(opts.year, opts.month, opts.day); }
            else { lunarDate = Solar.fromYmd(opts.year, opts.month, opts.day).getLunar(); }
        } catch (e) { console.error("Lunar error:", e); return null; }

        const lunarYear = lunarDate.getYear();
        const lunarMonth = lunarDate.getMonth();
        const lunarDay = lunarDate.getDay();

        const hourIdx = Math.floor((opts.hour + 1) / 2) % 12;
        // Standard TuVi uses Lunar Month for core calculations
        const calcMonth = lunarMonth; 
        
        const yearGanZhi = TuViEngine._getYearGanZhi(lunarYear);
        const dayGanZhi = TuViEngine._getDayGanZhi(opts.year, opts.month, opts.day);
        const hourGanZhi = TuViEngine._getHourGanZhi(dayGanZhi.stem, hourIdx);
        const monthGanZhi = TuViEngine._getMonthGanZhi(yearGanZhi.stem, lunarMonth);

        const yearStem = yearGanZhi.stem;
        const yearBranch = yearGanZhi.branch;

        // Absolute branch index formula: Start from Dần(2), move forward (Month-1), then lùi (Hour-1)
        const menhPalaceIdx = fix(2 + (calcMonth - 1) - hourIdx);
        const thanPalaceIdx = fix(2 + (calcMonth - 1) + hourIdx);
        const menhBranch = branchFromPalaceIdx(menhPalaceIdx);
        const thanBranch = branchFromPalaceIdx(thanPalaceIdx);

        const palaceStems = [];
        for (let i = 0; i < 12; i++) { palaceStems[i] = TuViEngine._palaceStem(yearStem, i); }

        const stemOfMenh = TuViEngine._palaceStem(yearStem, menhPalaceIdx);
        const cucKey = TuViEngine._getCuc(stemOfMenh, menhBranch);
        const cucName = CUC_NAMES_MAP[cucKey];
        const cucValue = CUC_VALUES_MAP[cucKey];

        const palaceNames = [];
        for (let i = 0; i < 12; i++) { palaceNames[fix(menhPalaceIdx + i)] = PALACES_ORDER[i]; }

        const ziweiIdx = TuViEngine._findZiwei(lunarDay, cucValue);
        const tianfuIdx = fix(4 - ziweiIdx);
        const stars = Array.from({ length: 12 }, () => ({ major: [], minor: [], adjective: [] }));

        ZIWEI_GROUP.forEach((name, i) => { if (name) { const pIdx = fix(ziweiIdx - i); stars[pIdx].major.push({ name, type: 'major', brightness: getBrightness(name, pIdx), mutagen: TuViEngine._getMutagen(name, yearStem) }); } });
        TIANFU_GROUP.forEach((name, i) => { if (name) { const pIdx = fix(tianfuIdx + i); stars[pIdx].major.push({ name, type: 'major', brightness: getBrightness(name, pIdx), mutagen: TuViEngine._getMutagen(name, yearStem) }); } });

        TuViEngine._placeMinorStars(stars, yearStem, yearBranch, lunarMonth, hourIdx, lunarDay);
        TuViEngine._placeAdjectiveStars(stars, yearStem, yearBranch, lunarMonth, hourIdx, lunarDay, menhPalaceIdx, thanPalaceIdx, opts.gender);

        // Additional stars found in aituvi.com
        if (THIEN_QUAN_TABLE[yearStem]) stars[palaceIdx(THIEN_QUAN_TABLE[yearStem])].minor.push({ name: 'Thiên Quan', type: 'minor' });
        if (THIEN_PHUC_TABLE[yearStem]) stars[palaceIdx(THIEN_PHUC_TABLE[yearStem])].minor.push({ name: 'Thiên Phúc', type: 'minor' });
        
        const changsheng = TuViEngine._changsheng(cucKey, opts.gender, yearStem);
        const boshi = TuViEngine._boshi12(palaceIdx(LU_CUN_TABLE[yearStem]), opts.gender, yearStem);
        const jiangqian = TuViEngine._jiangqian12(branchIdx(yearBranch));
        const suiqian = TuViEngine._suiqian12(branchIdx(yearBranch));

        const trietKhong = TuViEngine._trietKhong(yearStem);
        const tuanKhong = TuViEngine._tuanKhong(yearStem, yearBranch);

        Object.entries(suiqian).forEach(([pIdx, name]) => stars[parseInt(pIdx)].minor.push({ name, type: 'minor' }));
        Object.entries(boshi).forEach(([pIdx, name]) => stars[parseInt(pIdx)].minor.push({ name, type: 'minor', brightness: getBrightness(name, parseInt(pIdx)) }));
        Object.entries(changsheng).forEach(([pIdx, name]) => stars[parseInt(pIdx)].minor.push({ name, type: 'minor' }));
        Object.entries(jiangqian).forEach(([pIdx, name]) => stars[parseInt(pIdx)].minor.push({ name, type: 'minor' }));

        const isMaleYangOrFemaleYin = TuViEngine._isShun(yearStem, opts.gender);
        const decadals = TuViEngine._decadals(cucValue, menhPalaceIdx, isMaleYangOrFemaleYin, palaceStems);

        let laiNhanCung = '';
        for (let i = 0; i < 12; i++) { if (palaceStems[i] === yearStem) { laiNhanCung = palaceNames[i]; break; } }

        const weightSum = (WEIGHT_YEAR[yearBranch] || 0) + (WEIGHT_MONTH[lunarMonth] || 0) + (WEIGHT_DAY[lunarDay] || 0) + (WEIGHT_HOUR[hourGanZhi.branch] || 0);
        const banMenh = NAP_AM[`${yearStem} ${yearBranch}`] || 'Hải Trung Kim';
        const banMenhElement = banMenh.split(' ').pop();
        const cucElement = cucName.split(' ')[0];
        const correlation = ELEMENTAL_RELATIONS[`${banMenhElement}-${cucElement}`] || '';

        const isYangYear = stemIdx(yearStem) % 2 === 0;
        const isYangMenhPalace = menhPalaceIdx % 2 === 0;
        const yangYinDesc = (isYangYear === isYangMenhPalace) ? 'Âm dương thuận lý' : 'Âm dương nghịch lý';
        
        const relationMap = {
            'Thủy-Mộc': 'Cục sinh Bản mệnh', 'Mộc-Hỏa': 'Cục sinh Bản mệnh', 'Hỏa-Thổ': 'Cục sinh Bản mệnh', 'Thổ-Kim': 'Cục sinh Bản mệnh', 'Kim-Thủy': 'Cục sinh Bản mệnh',
            'Mộc-Thủy': 'Bản mệnh sinh Cục', 'Hỏa-Mộc': 'Bản mệnh sinh Cục', 'Thổ-Hỏa': 'Bản mệnh sinh Cục', 'Kim-Thổ': 'Bản mệnh sinh Cục', 'Thủy-Kim': 'Bản mệnh sinh Cục',
            'Thủy-Hỏa': 'Cục khắc Bản mệnh', 'Hỏa-Kim': 'Cục khắc Bản mệnh', 'Kim-Mộc': 'Cục khắc Bản mệnh', 'Mộc-Thổ': 'Cục khắc Bản mệnh', 'Thổ-Thủy': 'Cục khắc Bản mệnh',
            'Hỏa-Thủy': 'Bản mệnh khắc Cục', 'Kim-Hỏa': 'Bản mệnh khắc Cục', 'Mộc-Kim': 'Bản mệnh khắc Cục', 'Thổ-Mộc': 'Bản mệnh khắc Cục', 'Thủy-Thổ': 'Bản mệnh khắc Cục',
            'Thủy-Thủy': 'Cục và Bản mệnh bình hòa', 'Mộc-Mộc': 'Cục và Bản mệnh bình hòa', 'Hỏa-Hỏa': 'Cục và Bản mệnh bình hòa', 'Thổ-Thổ': 'Cục và Bản mệnh bình hòa', 'Kim-Kim': 'Cục và Bản mệnh bình hòa',
        };
        const cucRelation = relationMap[`${cucElement}-${banMenhElement}`] || '';

        const info = {
            name: opts.name || 'Khách', gender: opts.gender === 'Nữ' ? 'Nữ' : 'Nam',
            solarDate: `${opts.year}-${opts.month}-${opts.day}`, lunarDate: `Ngày ${lunarDay} tháng ${lunarMonth} (Lưu ${lunarMonth}) năm ${yearGanZhi.full}`,
            chineseDate: `${yearGanZhi.full} - ${monthGanZhi.full} - ${dayGanZhi.full} - ${hourGanZhi.full}`, time: `Giờ ${hourGanZhi.branch} (${opts.hour}h)`,
            sign: (isYangYear ? 'Dương ' : 'Âm ') + (opts.gender === 'Nam' ? 'Nam' : 'Nữ'), 
            yangYinDesc,
            zodiac: yearBranch, fiveElementsClass: cucName, cucRelation, soul: MENH_CHU[menhBranch] || 'Tham Lang', body: THAN_CHU[yearBranch] || 'Linh Tinh',
            laiNhanCung, canLuong: `${Math.floor(weightSum / 10)} lượng ${weightSum % 10} chỉ`,
            banMenh: `${banMenh}`,
            cucName: cucName,
            earthlyBranchOfSoulPalace: menhBranch, earthlyBranchOfBodyPalace: thanBranch,
        };

        const targetYear = opts.targetYear || new Date().getFullYear();
        const luck = TuViEngine._getYearlyLuck(targetYear, yearStem, yearBranch);
        
        const currentAge = targetYear - opts.year + 1; // Tuổi mụ
        let currentDecadalPIdx = menhPalaceIdx;
        for (let i = 0; i < 12; i++) {
            if (currentAge >= decadals[i].range[0] && currentAge <= decadals[i].range[1]) {
                currentDecadalPIdx = i;
                break;
            }
        }
        const decadalStem = decadals[currentDecadalPIdx].heavenlyStem;
        const decadalBranch = decadals[currentDecadalPIdx].earthlyBranch;
        const decadalLuck = TuViEngine._getLuckPeriod('decadal', decadalStem, decadalBranch, currentDecadalPIdx);

        const palaces = [];
        for (let i = 0; i < 12; i++) {
            const yearlyStars = luck.stars[i] || [];
            const decadalStars = decadalLuck.stars[i] || [];
            palaces.push({
                index: i, name: palaceNames[i], isBodyPalace: i === thanPalaceIdx, heavenlyStem: palaceStems[i], earthlyBranch: branchFromPalaceIdx(i),
                majorStars: stars[i].major, minorStars: stars[i].minor, adjectiveStars: stars[i].adjective,
                yearlyStars: yearlyStars, decadalStars: decadalStars,
                changsheng12: changsheng[i], boshi12: boshi[i], jiangqian12: jiangqian[i], suiqian12: suiqian[i],
                decadal: decadals[i], ages: [],
            });
        }
        return { info: { ...info, targetYear, currentAge }, palaces, tuanKhong, trietKhong };
    }

    static _getYearlyLuck(targetYear, birthYearStem, birthYearBranch) {
        const lunar = Solar.fromYmd(targetYear, 6, 15).getLunar(); // Reference date for the year
        const yStem = STEMS[fix(lunar.getYearGanIndex())];
        const yBranch = BRANCHES[fix(lunar.getYearZhiIndex())];
        return TuViEngine._getLuckPeriod('yearly', yStem, yBranch, palaceIdx(yBranch));
    }

    static calculateHoroscope(targetDate, natalInfo) {
        const d = new Date(targetDate); const l = Lunar.fromDate(d);
        const yStem = STEMS[fix(l.getYearGanIndex())]; const yBranch = BRANCHES[fix(l.getYearZhiIndex())];
        const mStem = STEMS[fix(l.getMonthGanIndex())]; const mBranch = BRANCHES[fix(l.getMonthZhiIndex())];
        const dStem = STEMS[fix(l.getDayGanIndex())]; const dBranch = BRANCHES[fix(l.getDayZhiIndex())];
        const yearlyIndex = palaceIdx(yBranch); const yearly = TuViEngine._getLuckPeriod('yearly', yStem, yBranch, yearlyIndex);
        const birthMonth = parseInt(natalInfo.info.lunarDate.match(/tháng (\d+)/)?.[1] || '1');
        const targetMonth = l.getMonth(); const monthlyIndex = fix(yearlyIndex - (birthMonth - 1) + (targetMonth - 1));
        const monthly = TuViEngine._getLuckPeriod('monthly', mStem, mBranch, monthlyIndex);
        const dailyIndex = fix(monthlyIndex + (l.getDay() - 1)); const daily = TuViEngine._getLuckPeriod('daily', dStem, dBranch, dailyIndex);
        return { yearly, monthly, daily };
    }

    static _getLuckPeriod(scope, stem, branch, index) {
        const stars = Array.from({ length: 12 }, () => []);
        const mutagen = TU_HOA[stem] || [];
        const prefix = scope === 'decadal' ? 'ĐV.' : 'L.'; 
        
        const luPIdx = palaceIdx(LU_CUN_TABLE[stem]);
        stars[luPIdx].push({ name: prefix + (scope === 'decadal' ? ' Lộc Tồn' : 'Lộc'), type: 'lucun', scope });
        stars[fix(luPIdx + 1)].push({ name: prefix + (scope === 'decadal' ? ' K Dương' : 'Dương'), type: 'tough', scope });
        stars[fix(luPIdx - 1)].push({ name: prefix + (scope === 'decadal' ? ' Đà La' : 'Đà'), type: 'tough', scope });
        
        const maBranch = THIEN_MA_TABLE[branch];
        if (maBranch) stars[palaceIdx(maBranch)].push({ name: prefix + (scope === 'decadal' ? ' Thiên Mã' : 'Mã'), type: 'tianma', scope });

        const kv = KHOI_VIET_TABLE[stem];
        if (kv) {
            stars[palaceIdx(kv[0])].push({ name: prefix + (scope === 'decadal' ? ' T Khôi' : 'Khôi'), type: 'minor', scope });
            stars[palaceIdx(kv[1])].push({ name: prefix + (scope === 'decadal' ? ' T Việt' : 'Việt'), type: 'minor', scope });
        }
        
        if (scope !== 'decadal') {
            const suiqian = TuViEngine._suiqian12(branchIdx(branch));
            Object.entries(suiqian).forEach(([pIdx, name]) => {
                stars[parseInt(pIdx)].push({ name: prefix + name, type: 'minor', scope });
            });
        }

        const palaceNames = [];
        const LUCK_PALACES = ['Mệnh','Phụ Mẫu','Phúc Đức','Điền Trạch','Quan Lộc','Nô Bộc','Thiên Di','Tật Ách','Tài Bạch','Tử Nữ','Phu Thê','Huynh Đệ'];
        for (let i = 0; i < 12; i++) { palaceNames[fix(index + i)] = LUCK_PALACES[i]; }
        return { index, heavenlyStem: stem, earthlyBranch: branch, palaceNames, mutagen, stars };
    }

    static _getYearGanZhi(lunarYear) { const stemI = fix(lunarYear - 4, 10); const branchI = fix(lunarYear - 4, 12); return { stem: STEMS[stemI], branch: BRANCHES[branchI], full: `${STEMS[stemI]} ${BRANCHES[branchI]}` }; }
    static _getMonthGanZhi(yearStem, lunarMonth) { const startMap = { 'Giáp': 2, 'Kỷ': 2, 'Ất': 4, 'Canh': 4, 'Bính': 6, 'Tân': 6, 'Đinh': 8, 'Nhâm': 8, 'Mậu': 0, 'Quý': 0 }; const startStem = startMap[yearStem] || 0; const s = STEMS[fix(startStem + lunarMonth - 1, 10)], b = BRANCHES[fix(lunarMonth + 1, 12)]; return { stem: s, branch: b, full: `${s} ${b}` }; }
    static _getDayGanZhi(solarYear, solarMonth, solarDay) { const lunar = Solar.fromYmd(solarYear, solarMonth, solarDay).getLunar(); const stemMap = {'甲':'Giáp','乙':'Ất','丙':'Bính','丁':'Đinh','戊':'Mậu','己':'Kỷ','庚':'Canh','辛':'Tân','壬':'Nhâm','癸':'Quý'}; const branchMap = {'子':'Tý','丑':'Sửu','寅':'Dần','卯':'Mão','辰':'Thìn','巳':'Tỵ','午':'Ngọ','未':'Mùi','申':'Thân','酉':'Dậu','戌':'Tuất','亥':'Hợi'}; const s = stemMap[lunar.getDayGan()] || '', b = branchMap[lunar.getDayZhi()] || ''; return { stem: s, branch: b, full: `${s} ${b}` }; }
    static _getHourGanZhi(dayStem, hourIdx) { const startMap = { 'Giáp': 0, 'Kỷ': 0, 'Ất': 2, 'Canh': 2, 'Bính': 4, 'Tân': 4, 'Đinh': 6, 'Nhâm': 6, 'Mậu': 8, 'Quý': 8 }; const s = STEMS[fix((startMap[dayStem] || 0) + hourIdx, 10)], b = BRANCHES[fix(hourIdx, 12)]; return { stem: s, branch: b, full: `${s} ${b}` }; }
    static _palaceStem(yearStem, pIdx) { const startMap = { 'Giáp': 2, 'Kỷ': 2, 'Ất': 4, 'Canh': 4, 'Bính': 6, 'Tân': 6, 'Đinh': 8, 'Nhâm': 8, 'Mậu': 0, 'Quý': 0 }; const startStem = startMap[yearStem] || 0; return STEMS[fix((startStem + pIdx - 2), 10)]; }
    static _getCuc(palaceStem, palaceBranch) {
        // Nạp Âm lookup for Cục determination (Standard TuVi)
        const combination = `${palaceStem} ${palaceBranch}`;
        const napAm = NAP_AM[combination] || '';
        if (napAm.includes('Thủy')) return 'water2nd';
        if (napAm.includes('Mộc')) return 'wood3rd';
        if (napAm.includes('Kim')) return 'metal4th';
        if (napAm.includes('Thổ')) return 'earth5th';
        if (napAm.includes('Hỏa')) return 'fire6th';
        return 'water2nd'; // Fallback
    }

    static _findZiwei(lunarDay, cucValue) {
        let offset = 0, quotient;
        const day = lunarDay;
        while (true) {
            if ((day + offset) % cucValue === 0) {
                quotient = (day + offset) / cucValue;
                break;
            }
            offset++;
        }
        // Formula matching aituvi.com's behavior across multiple samples
        let ziweiIdx = (quotient + 1);
        if (offset % 2 !== 0) ziweiIdx -= offset;
        else ziweiIdx += offset;
        return fix(ziweiIdx);
    }
    static _getMutagen(starName, yearStem) { const hoaList = TU_HOA[yearStem] || []; const idx = hoaList.indexOf(starName); return idx >= 0 ? HOA_NAMES[idx] : ''; }
    static _placeMinorStars(stars, yStem, yBranch, lMonth, hourIdx, lDay) {
        const addMinor = (pIdx, name) => stars[fix(pIdx)].minor.push({ name, type: 'minor', brightness: getBrightness(name, pIdx), mutagen: TuViEngine._getMutagen(name, yStem) });
        const luPIdx = palaceIdx(LU_CUN_TABLE[yStem]); addMinor(luPIdx, 'Lộc Tồn'); addMinor(fix(luPIdx + 1), 'Kình Dương'); addMinor(fix(luPIdx - 1), 'Đà La');
        const maBranch = THIEN_MA_TABLE[yBranch]; if (maBranch) addMinor(palaceIdx(maBranch), 'Thiên Mã');
        const kv = KHOI_VIET_TABLE[yStem]; if (kv) { addMinor(palaceIdx(kv[0]), 'Thiên Khôi'); addMinor(palaceIdx(kv[1]), 'Thiên Việt'); }
        addMinor(fix(palaceIdx('Thìn') + lMonth - 1), 'Tả Phù'); addMinor(fix(palaceIdx('Tuất') - lMonth + 1), 'Hữu Bật');
        addMinor(fix(palaceIdx('Tuất') - hourIdx), 'Văn Xương'); addMinor(fix(palaceIdx('Thìn') + hourIdx), 'Văn Khúc');
        const huoStart = HOA_TINH_START[yBranch], lingStart = LINH_TINH_START[yBranch];
        if (huoStart) addMinor(fix(palaceIdx(huoStart) + hourIdx), 'Hỏa Tinh');
        if (lingStart) addMinor(fix(palaceIdx(lingStart) + hourIdx), 'Linh Tinh');
        addMinor(fix(palaceIdx('Hợi') - hourIdx), 'Địa Không'); addMinor(fix(palaceIdx('Hợi') + hourIdx), 'Địa Kiếp');
    }
    static _placeAdjectiveStars(stars, yStem, yBranch, lMonth, hourIdx, lDay, menhIdx, thanIdx, gender) {
        const addAdj = (pIdx, name) => stars[fix(pIdx)].adjective.push({ name, type: 'adjective', brightness: getBrightness(name, pIdx) });
        const ybIdx = branchIdx(yBranch); const hlIdx = fix(palaceIdx('Mão') - ybIdx);
        addAdj(hlIdx, 'Hồng Loan'); addAdj(fix(hlIdx + 6), 'Thiên Hỷ');
        addAdj(fix(palaceIdx('Dậu') + lMonth - 1), 'Thiên Hình'); addAdj(fix(palaceIdx('Sửu') + lMonth - 1), 'Thiên Diêu');
        if (THIEN_TRU_TABLE[yStem]) addAdj(palaceIdx(THIEN_TRU_TABLE[yStem]), 'Thiên Trù');
        if (CO_THAN_TABLE[yBranch]) addAdj(palaceIdx(CO_THAN_TABLE[yBranch]), 'Cô Thần');
        if (QUA_TU_TABLE[yBranch]) addAdj(palaceIdx(QUA_TU_TABLE[yBranch]), 'Quả Tú');
        if (PHA_TOAI_TABLE[yBranch]) addAdj(palaceIdx(PHA_TOAI_TABLE[yBranch]), 'Phá Toái');
        addAdj(fix(palaceIdx(PHI_LIEM[ybIdx])), 'Phi Liêm'); addAdj(fix(palaceIdx('Thìn') + ybIdx), 'Long Trì');
        addAdj(fix(palaceIdx('Tuất') - ybIdx), 'Phượng Các');
        addAdj(fix(palaceIdx('Tuất') - ybIdx), 'Giải Thần');
        addAdj(fix(palaceIdx('Ngọ') - ybIdx), 'Thiên Khốc'); addAdj(fix(palaceIdx('Ngọ') + ybIdx), 'Thiên Hư');
        addAdj(fix(menhIdx + ybIdx), 'Thiên Tài'); addAdj(fix(thanIdx + ybIdx), 'Thiên Thọ');
        const zuoIdx = fix(palaceIdx('Thìn') + lMonth - 1), youIdx = fix(palaceIdx('Tuất') - lMonth + 1);
        addAdj(fix(zuoIdx + lDay - 1), 'Tam Thai'); addAdj(fix(youIdx - lDay + 1), 'Bát Tọa');
        const changPIdx = fix(palaceIdx('Tuất') - hourIdx), quPIdx = fix(palaceIdx('Thìn') + hourIdx);
        addAdj(fix(changPIdx + lDay - 2), 'Ân Quang'); addAdj(fix(quPIdx + lDay - 2), 'Thiên Quý');
        addAdj(fix(palaceIdx('Ngọ') + hourIdx), 'Đài Phụ'); addAdj(fix(palaceIdx('Dần') + hourIdx), 'Phong Cáo');
        addAdj(fix(palaceIdx('Sửu') + ybIdx), 'Đường Phù');
        addAdj(fix(palaceIdx('Dần') + ybIdx), 'Tấu Thư');
        
        // Stars specific to aituvi.com high-fidelity charts
        addAdj(fix(palaceIdx('Sửu') + ybIdx - lMonth + 1), 'Đầu Quân');
        if (gender === 'Nam' || gender === 'male') {
            addAdj(fix(thanIdx + 6), 'Thiên Sứ');
        } else {
            addAdj(fix(thanIdx - 6), 'Thiên Sứ');
        }
        const ksMap = { 'Thân':3, 'Tý':3, 'Thìn':3, 'Hợi':6, 'Mão':6, 'Mùi':6, 'Dần':9, 'Ngọ':9, 'Tuất':9, 'Tỵ':0, 'Dậu':0, 'Sửu':0 };
        if (ksMap[yBranch] !== undefined) addAdj(ksMap[yBranch], 'Kiếp Sát');
        const dhMap = [5,4,7,6,9,8,11,10,1,0,3,2]; addAdj(dhMap[ybIdx], 'Đại Hao');
        const liuha = { 'Giáp':'Dậu','Ất':'Tuất','Bính':'Mùi','Đinh':'Tỵ','Mậu':'Ngọ','Kỷ':'Thân','Canh':'Mão','Tân':'Thìn','Nhâm':'Hợi','Quý':'Dần' };
        if (liuha[yStem]) addAdj(palaceIdx(liuha[yStem]), 'Lưu Hà');
        const daohoa = { 'Dần':'Mão', 'Ngọ':'Mão', 'Tuất':'Mão', 'Thân':'Dậu', 'Tý':'Dậu', 'Thìn':'Dậu', 'Tỵ':'Ngọ', 'Dậu':'Ngọ', 'Sửu':'Ngọ', 'Hợi':'Tý', 'Mão':'Tý', 'Mùi':'Tý' };
        addAdj(palaceIdx(daohoa[yBranch]), 'Đào Hoa');
    }
    static _isShun(yearStem, gender) {
        const isYang = stemIdx(yearStem) % 2 === 0, isMale = gender !== 'Nữ' && gender !== 'female';
        return (isYang && isMale) || (!isYang && !isMale);
    }
    static _changsheng(cucKey, gender, yearStem) {
        const startPIndices = { 'wood3rd': 9, 'metal4th': 3, 'water2nd': 6, 'fire6th': 0, 'earth5th': 6 };
        const startPIdx = startPIndices[cucKey] || 0; const isShun = TuViEngine._isShun(yearStem, gender);
        const result = {}; for (let i = 0; i < 12; i++) { const pIdx = isShun ? fix(startPIdx + i) : fix(startPIdx - i); result[pIdx] = TRANG_SINH[i]; }
        return result;
    }
    static _boshi12(luCunPIdx, gender, yearStem) {
        const isShun = TuViEngine._isShun(yearStem, gender);
        const result = {}; for (let i = 0; i < 12; i++) { const pIdx = isShun ? fix(luCunPIdx + i) : fix(luCunPIdx - i); result[pIdx] = BAC_SI[i]; }
        return result;
    }
    static _jiangqian12(yearBranchIdx) { const startPIdx = palaceIdx(BRANCHES[yearBranchIdx]), result = {}; for (let i = 0; i < 12; i++) { result[fix(startPIdx + i)] = TUONG_TINH[i]; } return result; }
    static _suiqian12(yearBranchIdx) { const startPIdx = palaceIdx(BRANCHES[yearBranchIdx]), result = {}; for (let i = 0; i < 12; i++) { result[fix(startPIdx + i)] = TUE_KIEN[i]; } return result; }
    static _tuanKhong(yearStem, yearBranch) { const gap = fix(branchIdx(yearBranch) - stemIdx(yearStem), 12); return [BRANCHES[fix(gap + 10, 12)], BRANCHES[fix(gap + 11, 12)]]; }
    static _trietKhong(yearStem) { const table = [['Thân','Dậu'],['Ngọ','Mùi'],['Thìn','Tỵ'],['Dần','Mão'],['Tý','Sửu']]; return table[stemIdx(yearStem) % 5]; }
    static _decadals(cucValue, menhPIdx, isShun, palaceStems) {
        const result = {}; for (let i = 0; i < 12; i++) { const pIdx = isShun ? fix(menhPIdx + i) : fix(menhPIdx - i); result[pIdx] = { range: [cucValue + i * 10, cucValue + i * 10 + 9], heavenlyStem: palaceStems[pIdx], earthlyBranch: branchFromPalaceIdx(pIdx) }; }
        return result;
    }
}
module.exports = TuViEngine;
