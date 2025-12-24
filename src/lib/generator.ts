import { countries, namesByCountry, CountryConfig } from './countryData';
import { DOMAINS } from './domains';

// --- 静态常量定义 (内存优化 & 行为模拟) ---

const LATIN_CHARS = "abcdefghijklmnopqrstuvwxyz";

// 1. 增强的密码基础词汇库
// 真实用户倾向于使用季节、自然、积极词汇，且首字母大写
const PASSWORD_BASE_WORDS = [
  'Summer', 'Winter', 'Autumn', 'Spring', 'Freedom', 'Garden', 'Monster', 'Rocket',
  'Shadow', 'Spirit', 'Sunset', 'Sunrise', 'System', 'Secret', 'Sister', 'Brother',
  'Family', 'Friend', 'School', 'Office', 'Coffee', 'Cookie', 'Guitar', 'Piano',
  'Soccer', 'Winner', 'Master', 'Doctor', 'Driver', 'Player', 'Action', 'Energy',
  'Happy', 'Strong', 'Lovely', 'Dragon', 'Tiger', 'Eagle', 'Panda', 'Monkey',
  'Space', 'Earth', 'World', 'Ocean', 'River', 'Forest', 'Flower', 'Cherry',
  'Apple', 'Banana', 'Orange', 'Lemon', 'Melon', 'Berry', 'Grape', 'Peach',
  'King', 'Queen', 'Prince', 'Angel', 'Magic', 'Power', 'Super', 'Lucky'
];

// 2. 备用名字库 (关键修复：防止非拉丁字符转写失败产生乱码)
// 当输入的名字无法转换为 ASCII (如纯韩文/中文) 时，使用这些名字代替
const FALLBACK_NAMES = [
  'alex', 'sam', 'jordan', 'taylor', 'casey', 'jamie', 'morgan', 'riley', 
  'quinn', 'avery', 'parker', 'bailey', 'skyler', 'charlie', 'dakota',
  'reese', 'zion', 'remy', 'elias', 'sawyer', 'amara', 'finley', 'river',
  'lee', 'kim', 'chen', 'singh', 'patel', 'wang', 'garcia', 'lopez',
  'james', 'john', 'robert', 'michael', 'william', 'david', 'richard',
  'mary', 'patricia', 'jennifer', 'linda', 'elizabeth', 'barbara', 'susan',
  'thomas', 'jessica', 'sarah', 'karen', 'nancy', 'lisa', 'betty'
];

// FB 允许且用户常用的安全符号（避免使用 ^ ~ 等输入困难的符号）
const SAFE_SPECIAL_CHARS = ['!', '@', '#', '$', '*', '.'];

// 简单的备用词汇
const COMMON_WORDS = [
  'love', 'life', 'sky', 'blue', 'fire', 'cool', 'dream', 'star', 'moon'
];

// 年龄分布权重
const AGE_DISTRIBUTION = [
  { min: 18, max: 19, weight: 0.20 },
  { min: 20, max: 21, weight: 0.25 },
  { min: 22, max: 23, weight: 0.30 },
  { min: 24, max: 25, weight: 0.25 },
];

const DAYS_IN_MONTH_BASE = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const SUSPICIOUS_DAYS = [1, 15, 31];

// --- 手机号运营商前缀数据 (2024-2025 真实号段) ---

const CN_PREFIXES = {
  mobile: [
    '134', '135', '136', '137', '138', '139', '147', '150', '151', '152', '157', '158', '159', 
    '172', '178', '182', '183', '184', '187', '188', '195', '197', '198'
  ],
  unicom: [
    '130', '131', '132', '145', '155', '156', '166', '167', '171', '175', '176', '185', '186', '196'
  ],
  telecom: [
    '133', '149', '153', '173', '177', '180', '181', '189', '190', '191', '193', '199'
  ],
  virtual: ['162', '165', '167', '170', '171']
};

const HK_PREFIXES = {
  // 香港主要运营商详细号段 (2024-2025) - 4位前缀
  csl: [
    '9000', '9010', '9020', '9030', '9040', '9050', '9060', '9070', '9080', '9090',
    '9100', '9110', '9120', '9130', '9140', '9150', '9160', '9170', '9180', '9190',
    '9200', '9210', '9220', '9230', '9240', '9250', '9260', '9270', '9280', '9290',
    '9300', '9310', '9320', '9330', '9340', '9350', '9360', '9370', '9380', '9390',
    '9400', '9410', '9420', '9430', '9440', '9450', '9460', '9470', '9480', '9490',
    '9500', '9510', '9520', '9530', '9540', '9550', '9560', '9570', '9580', '9590',
    '9600', '9610', '9620', '9630', '9640', '9650', '9660', '9670', '9680', '9690'
  ],
  three: [
    '5100', '5110', '5120', '5130', '5140', '5150', '5160', '5170', '5180', '5190',
    '5200', '5210', '5220', '5230', '5240', '5250', '5260', '5270', '5280', '5290',
    '5300', '5310', '5320', '5330', '5340', '5350', '5360', '5370', '5380', '5390',
    '5400', '5410', '5420', '5430', '5440', '5450', '5460', '5470', '5480', '5490',
    '6100', '6110', '6120', '6130', '6140', '6150', '6160', '6170', '6180', '6190',
    '6200', '6210', '6220', '6230', '6240', '6250', '6260', '6270', '6280', '6290',
    '6300', '6310', '6320', '6330', '6340', '6350', '6360', '6370', '6380', '6390',
    '6400', '6410', '6420', '6430', '6440', '6450', '6460', '6470', '6480', '6490'
  ],
  smartone: [
    '5500', '5510', '5520', '5530', '5540', '5550', '5560', '5570', '5580', '5590',
    '5600', '5610', '5620', '5630', '5640', '5650', '5660', '5670', '5680', '5690',
    '5700', '5710', '5720', '5730', '5740', '5750', '5760', '5770', '5780', '5790',
    '5800', '5810', '5820', '5830', '5840', '5850', '5860', '5870', '5880', '5890',
    '5900', '5910', '5920', '5930', '5940', '5950', '5960', '5970', '5980', '5990',
    '6500', '6510', '6520', '6530', '6540', '6550', '6560', '6570', '6580', '6590',
    '6600', '6610', '6620', '6630', '6640', '6650', '6660', '6670', '6680', '6690',
    '6700', '6710', '6720', '6730', '6740', '6750', '6760', '6770', '6780', '6790',
    '6800', '6810', '6820', '6830', '6840', '6850', '6860', '6870', '6880', '6890',
    '6900', '6910', '6920', '6930', '6940', '6950', '6960', '6970', '6980', '6990'
  ],
  cmhk: [
    '6000', '6010', '6020', '6030', '6040', '6050', '6060', '6070', '6080', '6090',
    '9700', '9710', '9720', '9730', '9740', '9750', '9760', '9770', '9780', '9790',
    '9800', '9810', '9820', '9830', '9840', '9850', '9860', '9870', '9880', '9890'
  ]
};
const TW_PREFIXES = {
  chunghwa: ['900', '901', '902', '903', '905', '906', '909', '910', '911', '912', '919', '921', '928', '932', '933', '934', '937', '963', '965', '966', '972', '974', '975', '978', '988'],
  twm: ['907', '914', '918', '920', '922', '923', '924', '929', '930', '931', '935', '936', '938', '939', '952', '953', '954', '955', '956', '958', '960', '961', '970', '971', '979', '983', '987', '989'],
  fetnet: ['903', '913', '915', '916', '917', '925', '926', '927', '930', '931', '936', '938', '955', '960', '962', '967', '968', '973', '976', '981', '984', '989']
};

const US_AREA_CODES = {
  east: [
    '201', '202', '203', '212', '215', '240', '267', '301', '302', '315', '339', '347', '351', '401', '410', '412', '413', '443', '475', '484', '508', '516', '518', '551', '570', '585', '603', '607', '609', '610', '617', '631', '646', '716', '717', '718', '724', '732', '781', '802', '814', '845', '856', '860', '908', '914', '917', '929', '973', '978'
  ],
  central: [
    '216', '217', '218', '219', '224', '231', '234', '248', '260', '262', '269', '309', '312', '313', '314', '317', '319', '330', '402', '414', '417', '419', '434', '440', '507', '513', '515', '517', '563', '573', '574', '586', '605', '608', '612', '614', '616', '618', '630', '636', '641', '651', '701', '708', '712', '715', '734', '763', '773', '810', '812', '815', '816', '847', '906', '913', '920', '937', '952', '989'
  ],
  south: [
    '205', '210', '214', '225', '228', '229', '239', '251', '252', '254', '256', '281', '305', '318', '321', '325', '334', '336', '337', '352', '361', '386', '404', '405', '407', '409', '423', '432', '469', '478', '479', '501', '502', '504', '512', '540', '561', '571', '580', '601', '606', '615', '662', '678', '682', '703', '704', '706', '713', '727', '731', '754', '757', '769', '770', '772', '786', '803', '804', '806', '813', '817', '828', '830', '832', '843', '850', '859', '863', '864', '865', '901', '903', '904', '910', '912', '918', '919', '931', '936', '940', '941', '954', '956', '972', '979', '980', '985'
  ],
  west: [
    '206', '208', '209', '213', '253', '303', '307', '310', '323', '360', '385', '406', '408', '415', '425', '435', '442', '458', '480', '503', '505', '509', '510', '520', '530', '541', '559', '562', '602', '619', '623', '626', '650', '657', '661', '702', '707', '714', '719', '720', '725', '747', '760', '775', '801', '805', '808', '818', '831', '858', '907', '909', '916', '925', '928', '949', '951', '970', '971', '986'
  ]
};

const JP_PREFIXES = {
  docomo: ['90', '80', '70'],
  au: ['90', '80', '70'],
  softbank: ['90', '80', '70']
};

const KR_PREFIXES = {
  common: ['10']
};

const GB_MOBILE_PREFIXES = {
  ee: ['7400', '7401', '7402', '7403', '7415', '7500', '7501', '7502', '7503', '7701', '7702', '7703', '7704', '7705', '7706', '7707', '7708', '7709', '7710', '7711', '7712'],
  o2: ['7435', '7436', '7437', '7440', '7441', '7442', '7443', '7444', '7510', '7511', '7512', '7513', '7514', '7515', '7516', '7517', '7518', '7519', '7520', '7521', '7522'],
  vodafone: ['7423', '7425', '7460', '7461', '7462', '7463', '7464', '7550', '7551', '7552', '7553', '7554', '7555', '7720', '7721', '7722', '7723', '7724', '7725', '7726', '7727', '7728'],
  three: ['7404', '7405', '7410', '7411', '7412', '7413', '7414', '7450', '7451', '7452', '7453', '7454', '7455', '7456', '7730', '7731', '7732', '7733', '7734', '7735', '7736', '7737', '7738']
};

const DE_PREFIXES = {
  telekom: ['151', '1511', '1512', '1514', '1515', '1516', '1517', '160', '170', '171', '175'],
  vodafone: ['152', '1520', '1522', '1523', '1525', '162', '172', '173', '174'],
  o2: ['159', '176', '177', '178', '179', '1573', '1575', '1577', '1578']
};

const FR_PREFIXES = {
  orange: ['607', '608', '630', '631', '632', '640', '641', '642', '670', '671', '672', '680', '681', '682'],
  sfr: ['609', '610', '611', '612', '613', '614', '615', '616', '617', '618', '619', '620', '621'],
  bouygues: ['650', '651', '652', '653', '658', '659', '660', '661', '662', '663', '664', '665', '666', '667'],
  free: ['651', '652', '695', '698', '699', '760', '761', '762', '763', '764', '765', '766', '767', '768', '769']
};

const IT_PREFIXES = {
  tim: ['330', '331', '333', '334', '335', '336', '337', '338', '339', '360', '366', '368'],
  vodafone: ['340', '341', '342', '343', '344', '345', '346', '347', '348', '349', '383'],
  windtre: ['320', '322', '323', '324', '327', '328', '329', '380', '388', '389', '391', '392', '393'],
  iliad: ['351', '352', '353', '354', '355', '356', '357', '358', '359']
};

const ES_PREFIXES = {
  movistar: ['609', '610', '616', '619', '620', '629', '630', '639', '646', '649', '650', '659', '660', '669', '670', '679', '680', '689'],
  vodafone: ['607', '610', '617', '647', '667', '677', '687', '697', '717', '737', '747'],
  orange: ['605', '615', '625', '635', '645', '655', '665', '675', '685', '695', '715', '725', '735', '745'],
  yoigo: ['622', '633', '722', '733', '744']
};

const NL_PREFIXES = {
  kpn: ['610', '611', '612', '613', '614', '615', '616', '617', '618', '619', '620', '621', '622', '623', '624', '625', '626', '627', '628', '629', '630', '633', '634', '636', '637', '649', '650', '651', '652', '653', '654', '655'],
  vodafone: ['611', '615', '621', '625', '627', '629', '631', '634', '638', '640', '641', '642', '643', '646', '648', '650', '651', '652', '653', '654', '655'],
  tmobile: ['614', '616', '618', '624', '626', '628', '634', '638', '641', '642', '643', '648', '658', '681', '682', '683']
};

const SE_PREFIXES = {
  telia: ['702', '703', '704', '705', '706', '708', '709', '722', '723', '724', '725', '727', '730', '738'],
  tele2: ['700', '701', '704', '707', '708', '709', '720', '721', '722', '723', '729', '733', '734', '735', '736', '737', '739'],
  telenor: ['700', '701', '702', '703', '704', '705', '706', '707', '708', '709', '720', '721', '722', '723', '724', '725', '728', '731', '732', '733', '734'],
  tre: ['700', '701', '702', '703', '704', '705', '706', '707', '708', '709', '720', '721', '722', '723', '728', '730', '735', '738', '760', '761', '762', '763', '764', '765', '766', '767', '768', '769']
};

const CH_PREFIXES = {
  swisscom: ['79'],
  sunrise: ['76'],
  salt: ['78'],
  virtual: ['75', '77']
};

const PL_PREFIXES = {
  orange: ['501', '502', '503', '504', '505', '506', '507', '508', '509', '510', '511', '512', '513', '514', '515', '516', '517', '518', '519'],
  play: ['530', '531', '532', '533', '534', '535', '536', '537', '538', '539', '570', '571', '572', '573', '574', '575', '576', '577', '578', '579', '730', '731', '732', '733', '734', '735', '736', '737', '738', '739', '790', '791', '792', '793', '794', '795', '796', '797', '798', '799'],
  plus: ['601', '603', '605', '607', '609', '661', '663', '665', '667', '669', '691', '693', '695', '697'],
  tmobile: ['600', '602', '604', '606', '608', '660', '662', '664', '668', '690', '692', '694', '696', '698']
};

const TR_PREFIXES = {
  turkcell: ['530', '531', '532', '533', '534', '535', '536', '537', '538', '539', '561'],
  vodafone: ['540', '541', '542', '543', '544', '545', '546', '547', '548', '549'],
  turktelekom: ['501', '505', '506', '507', '551', '552', '553', '554', '555', '559']
};

const RU_PREFIXES = {
  mts: ['910', '911', '912', '913', '914', '915', '916', '917', '918', '919', '980', '981', '982', '983', '984', '985', '986', '987', '988', '989'],
  megafon: ['920', '921', '922', '923', '924', '925', '926', '927', '928', '929', '930', '931', '932', '933', '934', '935', '936', '937', '938', '939'],
  beeline: ['903', '905', '906', '909', '960', '961', '962', '963', '964', '965', '966', '967', '968', '969', '976'],
  tele2: ['900', '901', '902', '904', '908', '950', '951', '952', '953', '958', '977', '991', '992', '993', '994', '995', '996', '999']
};

const IN_PREFIXES = {
  jio: ['62', '70', '79', '89', '90', '91', '93', '95', '96', '97', '98'],
  airtel: ['70', '72', '73', '74', '75', '76', '77', '78', '80', '81', '82', '83', '84', '85', '86', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99'],
  vi: ['70', '72', '73', '74', '75', '76', '77', '78', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99']
};

const AU_PREFIXES = {
  telstra: ['400', '401', '402', '403', '404', '405', '406', '407', '408', '409', '410', '411', '412', '413', '414', '415', '416', '417', '418', '419', '420', '421', '422', '423', '424', '425', '426', '427', '428', '429'],
  optus: ['430', '431', '432', '433', '434', '435', '436', '437', '438', '439', '440', '441', '442', '443', '444', '445', '446', '447', '448', '449', '450', '451', '452', '453', '454', '455', '456', '457', '458', '459'],
  vodafone: ['460', '461', '462', '463', '464', '465', '466', '467', '468', '469', '470', '471', '472', '473', '474', '475', '476', '477', '478', '479', '480', '481', '482', '483', '484', '485', '486', '487', '488', '489']
};

const TH_PREFIXES = {
  ais: ['61', '62', '63', '64', '65', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '98'],
  dtac: ['66', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '99'],
  true: ['60', '61', '62', '63', '64', '65', '66', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99']
};

const VN_PREFIXES = {
  viettel: ['86', '96', '97', '98', '32', '33', '34', '35', '36', '37', '38', '39'],
  vinaphone: ['88', '91', '94', '81', '82', '83', '84', '85'],
  mobifone: ['89', '90', '93', '70', '76', '77', '78', '79'],
  vietnamobile: ['92', '56', '58'],
  gmobile: ['99', '59']
};

const PH_PREFIXES = {
  globe: ['905', '906', '915', '916', '917', '926', '927', '935', '936', '937', '945', '955', '956', '965', '966', '967', '975', '976', '977', '995', '996', '997'],
  smart: ['908', '918', '919', '920', '921', '928', '929', '939', '946', '947', '949', '950', '951', '961', '963', '968', '969', '970', '981', '989', '998', '999'],
  sun: ['922', '923', '924', '925', '931', '932', '933', '934', '940', '941', '942', '943', '973', '974']
};

const ID_PREFIXES = {
  telkomsel: ['811', '812', '813', '821', '822', '823', '851', '852', '853'],
  indosat: ['814', '815', '816', '855', '856', '857', '858'],
  xl: ['817', '818', '819', '859', '877', '878'],
  three: ['895', '896', '897', '898', '899'],
  smartfren: ['881', '882', '883', '884', '885', '886', '887', '888', '889']
};

const MY_PREFIXES = {
  maxis: ['12', '142', '17'],
  celcom: ['13', '19', '148'],
  digi: ['16', '146', '11'],
  umobile: ['18', '11']
};

const BR_PREFIXES = {
  vivo: ['11', '12', '13', '14', '15', '21', '22', '24', '27', '28', '31', '32', '33', '34', '35', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68', '69', '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99'],
  claro: ['11', '21', '31', '41', '51', '61', '71', '81', '91'],
  tim: ['11', '21', '31', '41', '51', '61', '71', '81', '91']
};

const MX_PREFIXES = {
  common: ['55', '33', '81', '656', '664', '686', '722', '999', '477', '222', '614', '998', '442', '871', '444', '662', '229', '311', '449', '833']
};

const MO_PREFIXES = {
  ctm: ['66', '62'],
  three: ['63', '68'],
  smartone: ['65'],
  china_telecom: ['68']
};

const SG_PREFIXES = {
  singtel: ['90', '91', '92', '93', '94', '95', '96', '97', '98'],
  starhub: ['81', '82', '83', '84', '85', '86', '87'],
  m1: ['88', '89']
};

// --- 辅助函数 ---

function getRandomCarrierPrefix(carriers: Record<string, string[]>): string {
  const carrierNames = Object.keys(carriers);
  const carrier = randomChoice(carrierNames);
  return randomChoice(carriers[carrier]);
}

/**
 * 修正版转写函数
 * 逻辑：只保留拉丁字母。如果结果为空或过短（例如非拉丁语系名字且无法转写），
 * 则从 FALLBACK_NAMES 中随机选择一个真实英文名，而不是生成随机乱码。
 */
function convertToLatinChars(str: string): string {
  if (!str) {
    return randomChoice(FALLBACK_NAMES);
  }
  const normalized = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const ascii = normalized.replace(/[^a-zA-Z0-9]/g, "");
  
  // 关键修复：如果转换后长度 < 2，说明原名是非拉丁字符（如纯中文）
  // 此时返回一个真实的备用名，而不是随机字符
  if (ascii.length < 2) {
    return randomChoice(FALLBACK_NAMES);
  }
  return ascii.toLowerCase();
}

function secureRandom(min: number, max: number): number {
  const range = max - min + 1;
  const randomBuffer = new Uint32Array(1);
  crypto.getRandomValues(randomBuffer);
  return min + (randomBuffer[0] % range);
}

function randomChoice<T>(array: T[]): T {
  return array[secureRandom(0, array.length - 1)];
}

function randomDigit(min: number = 0, max: number = 9): string {
  return secureRandom(min, max).toString();
}

function randomDigits(length: number, min: number = 0, max: number = 9): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += randomDigit(min, max);
  }
  return result;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// --- 导出函数 ---

export function generateName(countryCode: string) {
  const config = namesByCountry[countryCode] || namesByCountry['US'];
  const firstName = config.firstNames[secureRandom(0, config.firstNames.length - 1)];
  const lastName = config.lastNames[secureRandom(0, config.lastNames.length - 1)];
  return { firstName, lastName };
}

export function generateBirthday() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  
  let random = Math.random();
  let age = 22;
  
  for (const range of AGE_DISTRIBUTION) {
    if (random < range.weight) {
      age = secureRandom(range.min, range.max);
      break;
    }
    random -= range.weight;
  }
  
  const birthYear = currentYear - age;
  
  const avoidMonths = [
    (currentMonth - 2 + 12) % 12 || 12,
    (currentMonth - 1 + 12) % 12 || 12,
    currentMonth,
    (currentMonth % 12) + 1,
  ];
  
  let month: number;
  do {
    month = secureRandom(1, 12);
  } while (Math.random() < 0.7 && avoidMonths.includes(month));
  
  let maxDays = DAYS_IN_MONTH_BASE[month - 1];
  if (month === 2 && birthYear % 4 === 0 && (birthYear % 100 !== 0 || birthYear % 400 === 0)) {
    maxDays = 29;
  }
  
  let day: number;
  do {
    day = secureRandom(1, maxDays);
  } while (Math.random() < 0.6 && SUSPICIOUS_DAYS.includes(day));
  
  const monthStr = month.toString().padStart(2, '0');
  const dayStr = day.toString().padStart(2, '0');
  
  return `${birthYear}-${monthStr}-${dayStr}`;
}

export function generatePhone(country: CountryConfig) {
  const code = country.code;
  
  switch (code) {
    case 'CN':
      const cnPrefix = getRandomCarrierPrefix(CN_PREFIXES);
      return `${country.phonePrefix} ${cnPrefix}${randomDigits(8)}`;

    case 'HK':
      const hkPrefix = getRandomCarrierPrefix(HK_PREFIXES);
      return `${country.phonePrefix} ${hkPrefix}${randomDigits(4)}`;

    case 'TW':
      const twPrefix = getRandomCarrierPrefix(TW_PREFIXES);
      return `${country.phonePrefix} ${twPrefix}${randomDigits(6)}`;

    case 'MO':
      const moPrefix = getRandomCarrierPrefix(MO_PREFIXES);
      return `${country.phonePrefix} ${moPrefix}${randomDigits(6)}`;

    case 'SG':
      const sgPrefix = getRandomCarrierPrefix(SG_PREFIXES);
      return `${country.phonePrefix} ${sgPrefix}${randomDigits(6)}`;

    case 'US':
    case 'CA':
      const regionKeys = ['east', 'central', 'west', 'south'] as const;
      const region = randomChoice([...regionKeys]);
      const areaCode = randomChoice(US_AREA_CODES[region]);
      const exchange = randomDigit(2, 9) + randomDigits(2);
      const subscriber = randomDigits(4);
      return `${country.phonePrefix} ${areaCode}-${exchange}-${subscriber}`;

    case 'JP':
      const jpPrefix = getRandomCarrierPrefix(JP_PREFIXES);
      return `${country.phonePrefix} ${jpPrefix}-${randomDigits(4)}-${randomDigits(4)}`;

    case 'KR':
      const krPrefix = getRandomCarrierPrefix(KR_PREFIXES);
      return `${country.phonePrefix} ${krPrefix}-${randomDigits(4)}-${randomDigits(4)}`;

    case 'GB':
      const gbPrefix = getRandomCarrierPrefix(GB_MOBILE_PREFIXES);
      return `${country.phonePrefix} ${gbPrefix} ${randomDigits(6)}`;

    case 'DE':
      const dePrefix = getRandomCarrierPrefix(DE_PREFIXES);
      const deSuffixLen = dePrefix.length > 3 ? 7 : 8; 
      return `${country.phonePrefix} ${dePrefix} ${randomDigits(deSuffixLen)}`;

    case 'FR':
      const frPrefix = getRandomCarrierPrefix(FR_PREFIXES);
      const frStart = frPrefix.charAt(0);
      const frNext = frPrefix.slice(1);
      return `${country.phonePrefix} ${frStart} ${frNext} ${randomDigits(2)} ${randomDigits(2)} ${randomDigits(2)}`;

    case 'IT':
      const itPrefix = getRandomCarrierPrefix(IT_PREFIXES);
      return `${country.phonePrefix} ${itPrefix} ${randomDigits(3)} ${randomDigits(4)}`;

    case 'ES':
      const esPrefix = getRandomCarrierPrefix(ES_PREFIXES);
      return `${country.phonePrefix} ${esPrefix} ${randomDigits(2)} ${randomDigits(2)} ${randomDigits(2)}`;

    case 'NL':
      const nlPrefix = getRandomCarrierPrefix(NL_PREFIXES);
      return `${country.phonePrefix} 6 ${nlPrefix.slice(1)} ${randomDigits(2)} ${randomDigits(2)} ${randomDigits(2)}`;

    case 'SE':
      const sePrefix = getRandomCarrierPrefix(SE_PREFIXES);
      return `${country.phonePrefix} ${sePrefix.slice(0, 2)} ${sePrefix.slice(2)}${randomDigits(2)} ${randomDigits(2)} ${randomDigits(2)}`;

    case 'CH':
      const chPrefix = getRandomCarrierPrefix(CH_PREFIXES);
      return `${country.phonePrefix} ${chPrefix} ${randomDigits(3)} ${randomDigits(2)} ${randomDigits(2)}`;

    case 'PL':
      const plPrefix = getRandomCarrierPrefix(PL_PREFIXES);
      return `${country.phonePrefix} ${plPrefix} ${randomDigits(3)} ${randomDigits(3)}`;

    case 'TR':
      const trPrefix = getRandomCarrierPrefix(TR_PREFIXES);
      return `${country.phonePrefix} ${trPrefix} ${randomDigits(3)} ${randomDigits(2)} ${randomDigits(2)}`;

    case 'RU':
      const ruPrefix = getRandomCarrierPrefix(RU_PREFIXES);
      return `${country.phonePrefix} ${ruPrefix} ${randomDigits(3)}-${randomDigits(2)}-${randomDigits(2)}`;

    case 'IN':
      const inPrefix = getRandomCarrierPrefix(IN_PREFIXES);
      const inRest = randomDigits(10 - inPrefix.length);
      return `${country.phonePrefix} ${inPrefix}${inRest.slice(0, 5 - inPrefix.length + 3)} ${inRest.slice(5 - inPrefix.length + 3)}`;

    case 'AU':
      const auPrefix = getRandomCarrierPrefix(AU_PREFIXES);
      return `${country.phonePrefix} ${auPrefix} ${randomDigits(3)} ${randomDigits(3)}`;

    case 'TH':
      const thPrefix = getRandomCarrierPrefix(TH_PREFIXES);
      return `${country.phonePrefix} ${thPrefix} ${randomDigits(3)} ${randomDigits(4)}`;

    case 'VN':
      const vnPrefix = getRandomCarrierPrefix(VN_PREFIXES);
      return `${country.phonePrefix} ${vnPrefix} ${randomDigits(3)} ${randomDigits(4)}`;

    case 'PH':
      const phPrefix = getRandomCarrierPrefix(PH_PREFIXES);
      return `${country.phonePrefix} ${phPrefix} ${randomDigits(3)} ${randomDigits(4)}`;

    case 'ID':
      const idPrefix = getRandomCarrierPrefix(ID_PREFIXES);
      return `${country.phonePrefix} ${idPrefix}-${randomDigits(4)}-${randomDigits(4)}`;

    case 'MY':
      const myPrefix = getRandomCarrierPrefix(MY_PREFIXES);
      const myRestLen = myPrefix.length === 2 ? 8 : 7;
      const myRest = randomDigits(myRestLen);
      return `${country.phonePrefix} ${myPrefix}-${myRest.slice(0, 3)} ${myRest.slice(3)}`;

    case 'BR':
      const brArea = getRandomCarrierPrefix(BR_PREFIXES);
      return `${country.phonePrefix} ${brArea} 9${randomDigits(4)}-${randomDigits(4)}`;

    case 'MX':
      const mxPrefix = getRandomCarrierPrefix(MX_PREFIXES);
      const mxRestLen = 10 - mxPrefix.length;
      const mxRest = randomDigits(mxRestLen);
      return `${country.phonePrefix} ${mxPrefix} ${mxRest.slice(0, 4)} ${mxRest.slice(4)}`;

    default:
      let phone = country.phoneFormat;
      phone = phone.replace(/X/g, () => randomDigit().toString());
      return `${country.phonePrefix} ${phone}`;
  }
}

/**
 * 优化版密码生成：
 * 目的：通过图灵测试，模拟真实人类的密码习惯
 * 策略：避免完全随机的字符堆叠，使用"有意义的单词 + 数字/年份 + 常见符号"
 */
export function generatePassword(): string {
  const scheme = Math.random();
  let password = '';
  
  // 随机年份 (1985 - 2024) 模拟纪念日
  const yearSuffix = secureRandom(1985, 2024).toString();
  const simpleSuffix = randomDigits(secureRandom(2, 4));
  const specialChar = randomChoice(SAFE_SPECIAL_CHARS);
  const baseWord = randomChoice(PASSWORD_BASE_WORDS);
  
  // 方案 A (40%): 标准强密码格式 -> "Summer@2023"
  if (scheme < 0.4) {
    password = `${baseWord}${specialChar}${yearSuffix}`;
  }
  
  // 方案 B (30%): 单词+简单数字 -> "Tiger1234"
  else if (scheme < 0.7) {
    password = `${baseWord}${randomDigit(1, 9)}${randomDigits(2)}`;
    // 确保首字母大写
    password = capitalize(password); 
  }
  
  // 方案 C (20%): 两个单词组合 -> "BlueSky99"
  else if (scheme < 0.9) {
    let secondWord = randomChoice(COMMON_WORDS);
    secondWord = secondWord.charAt(0).toUpperCase() + secondWord.slice(1);
    password = `${baseWord}${secondWord}${randomDigits(2)}`;
  }
  
  // 方案 D (10%): 混合杂凑（模拟老式密码习惯） -> "P@ssw0rd1" 风格
  else {
    let word = randomChoice(COMMON_WORDS);
    // 简单的字符替换，模拟人类行为
    word = word.replace(/a/g, '@').replace(/o/g, '0').replace(/i/g, '1').replace(/e/g, '3');
    password = `${capitalize(word)}${randomDigits(3)}`;
  }

  // 最终兜底：Facebook 建议 8 位以上
  while (password.length < 8) {
    password += randomDigit();
  }

  return password;
}

export function getCountryConfig(code: string) {
  return countries.find(c => c.code === code) || countries[0];
}

export function getAllDomains(): string[] {
  return DOMAINS;
}

/**
 * 优化版邮箱生成：
 * 目的：避免 Facebook 检测 (禁止使用 . 或 _ 分隔符)，彻底修复乱码问题
 * 策略：
 * 1. 模拟真实用户注册行为 (名字缩写、加年份、加幸运数字)
 * 2. 如果名字含有无法转写的非拉丁字符，使用 FALLBACK_NAMES 代替，杜绝生成乱码
 */
export function generateEmail(firstName: string, lastName: string, customDomain?: string) {
  const domain = customDomain || randomChoice(DOMAINS);
  
  // 1. 数据清洗：转为纯拉丁字母，若失败则使用备用库
  let first = convertToLatinChars(firstName);
  let last = convertToLatinChars(lastName);
  
  // 2. 模拟真实用户的命名截断习惯
  // 比如 "Christopher" 太长，用户可能会输入 "chris"
  if (first.length > 8 && Math.random() > 0.5) first = first.slice(0, secureRandom(4, 6));
  if (last.length > 8 && Math.random() > 0.5) last = last.slice(0, secureRandom(4, 6));

  const birthYear = secureRandom(1980, 2005); 
  const currentYear = new Date().getFullYear();
  const randomNum2 = randomDigits(2);
  const randomNum3 = randomDigits(3);
  
  let username = '';
  const pattern = Math.random();

  // --- 模式选择 (基于真实用户习惯分布) ---

  // 模式 1: 全名 + 年份 (35%) -> davidwang1995
  if (pattern < 0.35) {
    username = `${first}${last}${birthYear}`;
  }
  
  // 模式 2: 名字 + 姓氏首字母 + 数字 (25%) -> sarahj82
  else if (pattern < 0.60) {
    username = `${first}${last.charAt(0)}${randomNum2}`;
  }
  
  // 模式 3: 姓 + 名 + 短数字 (15%) -> wangdavid23
  else if (pattern < 0.75) {
    username = `${last}${first}${secureRandom(1, 99)}`;
  }
  
  // 模式 4: 极简模式 (15%) -> alberteinstein
  else if (pattern < 0.90) {
    username = `${first}${last}`;
    // 如果组合起来太短，必须加点东西
    if (username.length < 6) {
      username += randomNum3;
    } else if (Math.random() > 0.7) {
      username += randomDigit();
    }
  }
  
  // 模式 5: 临时/年份后缀 (10%) -> jason2024
  else {
    username = `${first}${currentYear}`;
  }

  // --- 最终约束检查 ---
  
  // 1. 再次确保无非字母数字字符
  username = username.replace(/[^a-z0-9]/g, '');

  // 2. 长度控制 (FB 最佳区间 6-20)
  if (username.length > 20) {
    username = username.slice(0, 20);
    // 截断后如果末尾是数字可能不完整，补一个字母
    if (/[0-9]/.test(username.slice(-1))) {
      username += 'x';
    }
  }

  // 3. 长度不足补齐
  while (username.length < 6) {
    username += randomChoice(['a', 'b', 'c', '1', '2', '3']);
  }

  return `${username}@${domain}`;
}
