export interface CountryConfig {
  code: string;
  name: string;
  phonePrefix: string;
  phoneFormat: string;
}

// 你的 countries 数组保持不变
export const countries: CountryConfig[] = [
  { code: 'CN', name: '中国', phonePrefix: '+86', phoneFormat: '1XXXXXXXXXX' },
  { code: 'HK', name: '香港', phonePrefix: '+852', phoneFormat: 'XXXX XXXX' },
  { code: 'TW', name: '台湾', phonePrefix: '+886', phoneFormat: 'XXXX XXX XXX' },
  { code: 'MO', name: '澳门', phonePrefix: '+853', phoneFormat: 'XXXX XXXX' },
  { code: 'SG', name: '新加坡', phonePrefix: '+65', phoneFormat: 'XXXX XXXX' },
  { code: 'US', name: '美国', phonePrefix: '+1', phoneFormat: 'XXX-XXX-XXXX' },
  { code: 'JP', name: '日本', phonePrefix: '+81', phoneFormat: 'XX-XXXX-XXXX' },
  { code: 'GB', name: '英国', phonePrefix: '+44', phoneFormat: 'XXXX XXX XXX' },
  { code: 'DE', name: '德国', phonePrefix: '+49', phoneFormat: 'XXX XXXXXXXX' },
  { code: 'FR', name: '法国', phonePrefix: '+33', phoneFormat: 'X XX XX XX XX' },
  { code: 'KR', name: '韩国', phonePrefix: '+82', phoneFormat: 'XX-XXXX-XXXX' },
  { code: 'CA', name: '加拿大', phonePrefix: '+1', phoneFormat: 'XXX-XXX-XXXX' },
  { code: 'AU', name: '澳大利亚', phonePrefix: '+61', phoneFormat: 'XXX XXX XXX' },
  { code: 'IT', name: '意大利', phonePrefix: '+39', phoneFormat: 'XXX XXX XXXX' },
  { code: 'ES', name: '西班牙', phonePrefix: '+34', phoneFormat: 'XXX XX XX XX' },
  { code: 'BR', name: '巴西', phonePrefix: '+55', phoneFormat: 'XX XXXXX-XXXX' },
  { code: 'RU', name: '俄罗斯', phonePrefix: '+7', phoneFormat: 'XXX XXX-XX-XX' },
  { code: 'IN', name: '印度', phonePrefix: '+91', phoneFormat: 'XXXXX XXXXX' },
  { code: 'MX', name: '墨西哥', phonePrefix: '+52', phoneFormat: 'XXX XXX XXXX' },
  { code: 'NL', name: '荷兰', phonePrefix: '+31', phoneFormat: 'X XXXXXXXX' },
  { code: 'SE', name: '瑞典', phonePrefix: '+46', phoneFormat: 'XX-XXX XX XX' },
  { code: 'CH', name: '瑞士', phonePrefix: '+41', phoneFormat: 'XX XXX XX XX' },
  { code: 'PL', name: '波兰', phonePrefix: '+48', phoneFormat: 'XXX XXX XXX' },
  { code: 'TR', name: '土耳其', phonePrefix: '+90', phoneFormat: 'XXX XXX XX XX' },
  { code: 'TH', name: '泰国', phonePrefix: '+66', phoneFormat: 'XX XXX XXXX' },
  { code: 'MY', name: '马来西亚', phonePrefix: '+60', phoneFormat: 'XX-XXX XXXX' },
  { code: 'ID', name: '印度尼西亚', phonePrefix: '+62', phoneFormat: 'XXX-XXX-XXXX' },
  { code: 'PH', name: '菲律宾', phonePrefix: '+63', phoneFormat: 'XXX XXX XXXX' },
  { code: 'VN', name: '越南', phonePrefix: '+84', phoneFormat: 'XXX XXX XXXX' },
];

export const namesByCountry: Record<string, { firstNames: string[], lastNames: string[] }> = {
  // 中国大陆：简体中文
  CN: {
    firstNames: [
      '伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '娟', '涛', '明', '超', '秀兰', '霞',
      '平', '刚', '桂英', '桂兰', '云', '建华', '建国', '志强', '海燕', '志明', '红', '玲', '浩', '波', '鑫', '鹏', '辉', '玉兰', '婷', '英',
      '华', '慧', '巧', '雪', '梅', '龙', '萍', '丹', '宇', '成', '欣', '博', '子涵', '梓萱', '一诺', '浩宇', '欣怡', '雨桐', '诗涵', '俊杰'
    ],
    lastNames: [
      '李', '王', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗',
      '梁', '宋', '郑', '谢', '韩', '唐', '冯', '于', '董', '萧', '程', '曹', '袁', '邓', '许', '傅', '沈', '曾', '彭', '吕',
      '苏', '卢', '蒋', '蔡', '贾', '丁', '魏', '薛', '叶', '阎', '余', '潘', '杜', '戴', '夏', '钟', '汪', '田', '任', '姜'
    ]
  },
  // 香港：繁体中文
  HK: {
    firstNames: [
      '家輝', '嘉欣', '志明', '美玲', '偉文', '淑儀', '志華', '麗華', '永勝', '惠貞', '文強', '詠詩', '國榮', '秀英', '建國', '美儀', '志強', '玉珍', '俊傑', '海燕',
      '振邦', '月娥', '家豪', '佩珊', '永康', '麗珍', '志偉', '美珍', '家明', '少芬', '偉強', '麗娜', '建華', '惠玲', '永強', '淑芬', '志平', '麗萍', '國華', '秀蘭',
      '振華', '美娟', '家偉', '嘉敏', '永昌', '麗珠', '志成', '美玉', '家俊', '潔雯', '浩然', '曉彤', '子軒', '樂怡', '柏豪', '芷晴', '俊緯', '凱琳', '卓賢', '思敏'
    ],
    lastNames: [
      '陳', '黃', '李', '林', '張', '梁', '吳', '劉', '郭', '周', '何', '鄭', '胡', '蔡', '許', '楊', '葉', '曾', '鄧', '馮',
      '王', '謝', '馬', '蘇', '羅', '潘', '朱', '鍾', '廖', '伍', '方', '余', '趙', '湯', '杜', '江', '魏', '徐', '彭', '盧',
      '袁', '沈', '田', '高', '蕭', '賴', '霍', '莫', '洪', '姚', '丁', '譚', '區', '黎', '關', '嚴', '歐', '錢', '戴', '薛'
    ]
  }
};
