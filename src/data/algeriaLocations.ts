export interface Wilaya {
  id: string;
  name: string;
  nameAr: string;
}

export interface Baladiya {
  id: string;
  wilayaId: string;
  name: string;
  nameAr: string;
}

export const wilayas: Wilaya[] = [
  { id: '01', name: 'Adrar', nameAr: 'أدرار' },
  { id: '02', name: 'Chlef', nameAr: 'الشلف' },
  { id: '03', name: 'Laghouat', nameAr: 'الأغواط' },
  { id: '04', name: 'Oum El Bouaghi', nameAr: 'أم البواقي' },
  { id: '05', name: 'Batna', nameAr: 'باتنة' },
];

export const baladiyas: Baladiya[] = [
  // Adrar (01)
  { id: '0101', wilayaId: '01', name: 'Adrar', nameAr: 'أدرار' },
  { id: '0102', wilayaId: '01', name: 'Tamest', nameAr: 'تامست' },
  { id: '0103', wilayaId: '01', name: 'Charouine', nameAr: 'شروين' },
  { id: '0104', wilayaId: '01', name: 'Reggane', nameAr: 'رقان' },
  { id: '0105', wilayaId: '01', name: 'Inzegmir', nameAr: 'انزجمير' },
  { id: '0106', wilayaId: '01', name: 'Tit', nameAr: 'تيت' },
  { id: '0107', wilayaId: '01', name: 'Ksar Kaddour', nameAr: 'قصر قدور' },
  { id: '0108', wilayaId: '01', name: 'Tsabit', nameAr: 'تسابيت' },
  { id: '0109', wilayaId: '01', name: 'Timimoun', nameAr: 'تيميمون' },
  { id: '0110', wilayaId: '01', name: 'Ouled Ahmed Timmi', nameAr: 'أولاد أحمد تيمي' },
  { id: '0111', wilayaId: '01', name: 'Aougrout', nameAr: 'أوقروت' },

  // Chlef (02)
  { id: '0201', wilayaId: '02', name: 'Chlef', nameAr: 'الشلف' },
  { id: '0202', wilayaId: '02', name: 'Ténès', nameAr: 'تنس' },
  { id: '0203', wilayaId: '02', name: 'Boukadir', nameAr: 'بوقدير' },
  { id: '0204', wilayaId: '02', name: 'El Karimia', nameAr: 'الكريمية' },
  { id: '0205', wilayaId: '02', name: 'Oued Fodda', nameAr: 'وادي الفضة' },
  { id: '0206', wilayaId: '02', name: 'Beni Haoua', nameAr: 'بني حواء' },
  { id: '0207', wilayaId: '02', name: 'Ouled Fares', nameAr: 'أولاد فارس' },
  { id: '0208', wilayaId: '02', name: 'Ain Merane', nameAr: 'عين مران' },
  { id: '0209', wilayaId: '02', name: 'El Marsa', nameAr: 'المرسى' },
  { id: '0210', wilayaId: '02', name: 'Chettia', nameAr: 'الشطية' },

  // Laghouat (03)
  { id: '0301', wilayaId: '03', name: 'Laghouat', nameAr: 'الأغواط' },
  { id: '0302', wilayaId: '03', name: 'Ksar El Hirane', nameAr: 'قصر الحيران' },
  { id: '0303', wilayaId: '03', name: 'Bennacer Benchohra', nameAr: 'بن ناصر بن شهرة' },
  { id: '0304', wilayaId: '03', name: 'Sidi Makhlouf', nameAr: 'سيدي مخلوف' },
  { id: '0305', wilayaId: '03', name: 'Hassi Delaa', nameAr: 'حاسي الدلاعة' },
  { id: '0306', wilayaId: '03', name: 'Hassi R\'Mel', nameAr: 'حاسي الرمل' },
  { id: '0307', wilayaId: '03', name: 'Ain Madhi', nameAr: 'عين ماضي' },
  { id: '0308', wilayaId: '03', name: 'Tadjmout', nameAr: 'تاجموت' },
  { id: '0309', wilayaId: '03', name: 'El Ghicha', nameAr: 'الغيشة' },
  { id: '0310', wilayaId: '03', name: 'Aflou', nameAr: 'أفلو' },

  // Oum El Bouaghi (04)
  { id: '0401', wilayaId: '04', name: 'Oum El Bouaghi', nameAr: 'أم البواقي' },
  { id: '0402', wilayaId: '04', name: 'Ain Beida', nameAr: 'عين البيضاء' },
  { id: '0403', wilayaId: '04', name: 'Ain M\'Lila', nameAr: 'عين مليلة' },
  { id: '0404', wilayaId: '04', name: 'Behir Chergui', nameAr: 'بحير الشرقي' },
  { id: '0405', wilayaId: '04', name: 'El Amiria', nameAr: 'العامرية' },
  { id: '0406', wilayaId: '04', name: 'Sigus', nameAr: 'سيقوس' },
  { id: '0407', wilayaId: '04', name: 'Ain Babouche', nameAr: 'عين ببوش' },
  { id: '0408', wilayaId: '04', name: 'Fkirina', nameAr: 'فكيرينة' },
  { id: '0409', wilayaId: '04', name: 'Souk Naamane', nameAr: 'سوق نعمان' },
  { id: '0410', wilayaId: '04', name: 'Ksar Sbahi', nameAr: 'قصر الصباحي' },

  // Batna (05)
  { id: '0501', wilayaId: '05', name: 'Batna', nameAr: 'باتنة' },
  { id: '0502', wilayaId: '05', name: 'Barika', nameAr: 'بريكة' },
  { id: '0503', wilayaId: '05', name: 'Merouana', nameAr: 'مروانة' },
  { id: '0504', wilayaId: '05', name: 'Arris', nameAr: 'أريس' },
  { id: '0505', wilayaId: '05', name: 'Ain Touta', nameAr: 'عين التوتة' },
  { id: '0506', wilayaId: '05', name: 'N\'Gaous', nameAr: 'نقاوس' },
  { id: '0507', wilayaId: '05', name: 'Tazoult', nameAr: 'تازولت' },
  { id: '0508', wilayaId: '05', name: 'Timgad', nameAr: 'تيمقاد' },
  { id: '0509', wilayaId: '05', name: 'Menaa', nameAr: 'منعة' },
  { id: '0510', wilayaId: '05', name: 'El Madher', nameAr: 'المعذر' },
];

export const getBaladiyas = (wilayaId: string): Baladiya[] => {
  return baladiyas.filter(b => b.wilayaId === wilayaId);
};
