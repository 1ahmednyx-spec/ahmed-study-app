/* Past examination archive — metadata-first catalogue.
   Only verified exam files should be added to EXAMS with an official source URL. */
(function () {
  const YEARS = Array.from({ length: 8 }, (_, index) => String(2019 + index));
  // Prioritize the core subjects requested for the first archive-completion pass.
  const SUBJECTS = [
    'اللغة العربية', 'اللغة الأجنبية الأولى', 'اللغة الأجنبية الثانية',
    'الرياضيات', 'الكيمياء', 'الفيزياء', 'الأحياء',
    'التاريخ', 'الجغرافيا', 'الإحصاء', 'الفلسفة والمنطق', 'علم النفس والاجتماع', 'الاقتصاد', 'التربية الوطنية', 'كل المواد'
  ];
  const SYSTEMS = [
    { value: 'all', label: 'كل الأنظمة' },
    { value: 'legacy', label: 'النظام القديم' },
    { value: 'modern', label: 'النظام الحديث' },
    { value: 'baccalaureate', label: 'البكالوريا المصرية' }
  ];
  const TYPES = [
    { value: 'official', label: 'امتحان وزارة رسمي' },
    { value: 'governorate', label: 'امتحان محافظة / إدارة' },
    { value: 'model', label: 'نموذج استرشادي' }
  ];

  // Verified Ministry-hosted files. Answers and model papers are classified separately from exam papers.
  const EXAMS = [
  {
    "id": "2020-chemistry-first",
    "year": "2020",
    "system": "modern",
    "systemLabel": "نظام الثانوية العامة 2020",
    "subject": "الكيمياء",
    "type": "official",
    "typeLabel": "امتحان وزارة رسمي — فئات خاصة",
    "fileKind": "paper",
    "title": "امتحان الكيمياء — نسخة دمج للمكفوفين",
    "round": "الدور الأول",
    "pdfUrl": "https://moe.gov.eg/media/ivpmsmdj/الكيمياء-دمج_مكفوفين_1.pdf",
    "fileLabel": "فتح ورقة الامتحان"
  },
  {
    "id": "2020-psychology-second",
    "year": "2020",
    "system": "modern",
    "systemLabel": "نظام الثانوية العامة 2020",
    "subject": "علم النفس والاجتماع",
    "type": "official",
    "typeLabel": "امتحان وزارة رسمي — فئات خاصة",
    "fileKind": "paper",
    "title": "امتحان علم النفس والاجتماع — نسخة دمج (الدور الثاني)",
    "round": "الدور الثاني",
    "pdfUrl": "https://moe.gov.eg/media/sh5lfevy/علم_نفس_دور_ثانى-شلل.pdf",
    "fileLabel": "فتح ورقة الامتحان"
  },
  {
    "id": "2020-arabic-second-blind-paper",
    "year": "2020",
    "system": "modern",
    "systemLabel": "نظام الثانوية العامة 2020",
    "subject": "اللغة العربية",
    "type": "official",
    "typeLabel": "امتحان وزارة رسمي — دمج للمكفوفين",
    "fileKind": "paper",
    "title": "امتحان اللغة العربية — نسخة دمج للمكفوفين",
    "round": "الدور الثاني",
    "pdfUrl": "https://moe.gov.eg/media/4lvbjegj/اللفه_العربيه-مكفوفين.pdf",
    "fileLabel": "فتح ورقة الامتحان"
  },
  {
    "id": "2020-arabic-first-answer-cerebral-palsy",
    "year": "2020",
    "system": "modern",
    "systemLabel": "نظام الثانوية العامة 2020",
    "subject": "اللغة العربية",
    "type": "official",
    "typeLabel": "نماذج إجابة رسمية — فئات دمج متعددة",
    "fileKind": "answer",
    "title": "نماذج إجابة اللغة العربية — نسخ دمج لفئات خاصة",
    "round": "الدور الأول",
    "pdfUrl": "https://moe.gov.eg/media/y4aa4wct/نموذج_إجابة_اللغه_العربيه-شلل_دماغى.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2020-economics-answer",
    "year": "2020",
    "system": "modern",
    "systemLabel": "نظام الثانوية العامة 2020",
    "subject": "الاقتصاد",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي — فئات خاصة",
    "fileKind": "answer",
    "title": "نموذج إجابة الاقتصاد — نسخة لضعاف السمع",
    "round": "الدور الأول",
    "pdfUrl": "https://moe.gov.eg/media/rnkh43k0/نموذج_اجابه_الاقتصاد-ضعاف_سمع.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-science-arabic-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث",
    "subject": "اللغة العربية",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي — الشعبة العلمية علوم",
    "fileKind": "answer",
    "title": "نموذج إجابة اللغة العربية — الشعبة العلمية علوم",
    "round": "الدور الأول",
    "pdfPage": 3,
    "pdfUrl": "https://moe.gov.eg/media/evqfv1il/scinece-exammodels.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-science-english-first-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث",
    "subject": "اللغة الأجنبية الأولى",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي — الشعبة العلمية علوم",
    "fileKind": "answer",
    "title": "نموذج إجابة الإنجليزية — لغة أجنبية أولى",
    "round": "الدور الأول",
    "pdfPage": 8,
    "pdfUrl": "https://moe.gov.eg/media/evqfv1il/scinece-exammodels.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-science-english-second-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث",
    "subject": "اللغة الأجنبية الثانية",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي — الشعبة العلمية علوم",
    "fileKind": "answer",
    "title": "نموذج إجابة الإنجليزية — لغة أجنبية ثانية",
    "round": "الدور الأول",
    "pdfPage": 28,
    "pdfUrl": "https://moe.gov.eg/media/evqfv1il/scinece-exammodels.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-science-chemistry-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث",
    "subject": "الكيمياء",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي — الشعبة العلمية علوم",
    "fileKind": "answer",
    "title": "نموذج إجابة الكيمياء باللغة العربية",
    "round": "الدور الأول",
    "pdfPage": 53,
    "pdfUrl": "https://moe.gov.eg/media/evqfv1il/scinece-exammodels.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-science-biology-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث",
    "subject": "الأحياء",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي — الشعبة العلمية علوم",
    "fileKind": "answer",
    "title": "نموذج إجابة الأحياء باللغة العربية",
    "round": "الدور الأول",
    "pdfPage": 98,
    "pdfUrl": "https://moe.gov.eg/media/evqfv1il/scinece-exammodels.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-science-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث",
    "subject": "الفيزياء",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي — الشعبة العلمية",
    "fileKind": "answer",
    "title": "نموذج إجابة الفيزياء باللغة العربية — الشعبة العلمية",
    "round": "الدور الأول",
    "pdfPage": 68,
    "pdfUrl": "https://moe.gov.eg/media/evqfv1il/scinece-exammodels.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-math-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث",
    "subject": "الرياضيات",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي",
    "fileKind": "answer",
    "title": "نموذج إجابة الديناميكا باللغة العربية — الشعبة العلمية رياضيات",
    "round": "الدور الأول",
    "pdfPage": 97,
    "pdfUrl": "https://moe.gov.eg/media/tzfj0lya/mathematica-exammodels.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-literary-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث",
    "subject": "كل المواد",
    "type": "official",
    "typeLabel": "نماذج إجابة رسمية — الشعبة الأدبية",
    "fileKind": "answer",
    "title": "نماذج إجابة مواد الشعبة الأدبية — 2023",
    "round": "الدور الأول",
    "pdfUrl": "https://moe.gov.eg/media/xmhd3sow/arts-answermodels.pdf",
    "fileLabel": "فتح نماذج الإجابة"
  },
  {
    "id": "2019-history-model",
    "year": "2019",
    "system": "legacy",
    "systemLabel": "نظام الثانوية العامة 2019",
    "subject": "التاريخ",
    "type": "model",
    "typeLabel": "نموذج استرشادي رسمي — فئة ضعاف السمع",
    "fileKind": "model",
    "title": "نموذج امتحان التاريخ — نظام الدمج (ضعاف السمع)",
    "round": "نموذج استرشادي",
    "pdfUrl": "https://moe.gov.eg/media/y1hdk03m/history_hearing_weakness_guide_19.pdf",
    "fileLabel": "فتح النموذج الاسترشادي"
  },
  {
    "id": "2026-physics-french-model-4",
    "year": "2026",
    "system": "modern",
    "systemLabel": "النظام الحديث",
    "subject": "الفيزياء",
    "type": "model",
    "typeLabel": "نموذج استرشادي رسمي — باللغة الفرنسية",
    "fileKind": "model",
    "title": "النموذج الاسترشادي الرابع — الفيزياء باللغة الفرنسية",
    "round": "العام الدراسي 2025/2026",
    "pdfUrl": "https://ellibrary.moe.gov.eg/sec3guideforms/publish4/Physics_FR_Model_4.pdf",
    "fileLabel": "فتح النموذج الاسترشادي"
  },
  {
    "id": "2026-applied-math-model-5",
    "year": "2026",
    "system": "modern",
    "systemLabel": "النظام الحديث",
    "subject": "الرياضيات",
    "type": "model",
    "typeLabel": "نموذج استرشادي رسمي",
    "fileKind": "model",
    "title": "النموذج الاسترشادي الخامس — الرياضيات التطبيقية",
    "round": "العام الدراسي 2025/2026",
    "pdfUrl": "https://ellibrary.moe.gov.eg/sec3guideforms/publish5/Applid_Math_EN_Model_5.pdf",
    "fileLabel": "فتح النموذج الاسترشادي"
  },
{
  "id": "2021-history-trial-answer",
  "year": "2021",
  "system": "modern",
  "systemLabel": "نظام الثانوية العامة 2021",
  "subject": "التاريخ",
  "type": "model",
  "typeLabel": "إجابة امتحان تجريبي رسمي",
  "fileKind": "answer",
  "title": "إجابة امتحان التاريخ التجريبي — يونيو 2021",
  "round": "اختبار تجريبي — وليس امتحان الدور النهائي",
  "pdfUrl": "https://moe.gov.eg/media/qe4doi3f/history-answer.pdf",
  "fileLabel": "فتح إجابة النموذج"
},
{
  "id": "2023-ministry-exam-portal",
  "year": "2023",
  "system": "modern",
  "systemLabel": "نظام الثانوية العامة 2023",
  "subject": "كل المواد",
  "type": "official",
  "typeLabel": "بوابة امتحانات الوزارة",
  "title": "بوابة امتحانات الثانوية العامة 2022/2023",
  "round": "الدور الأول",
  "pdfUrl": "https://moe.gov.eg/ar/exam-model2022-2023/",
  "fileLabel": "فتح بوابة الوزارة"
},
{
  "id": "2024-madrasetna-plus",
  "year": "2024",
  "system": "modern",
  "systemLabel": "نظام الثانوية العامة 2024",
  "subject": "كل المواد",
  "type": "official",
  "typeLabel": "مصدر رسمي — مدرستنا بلس",
  "title": "أسئلة وإجابات امتحانات 2023/2024 والنماذج الأربعة",
  "round": "الدور الأول",
  "pdfUrl": "https://madrasetnaplus.eg/",
  "fileLabel": "فتح المصدر الرسمي"
},
{
  "id": "2025-ministry-models",
  "year": "2025",
  "system": "modern",
  "systemLabel": "نظام الثانوية العامة 2025",
  "subject": "كل المواد",
  "type": "model",
  "typeLabel": "بوابة النماذج الاسترشادية الرسمية",
  "title": "نماذج الثانوية العامة 2025",
  "round": "نماذج استرشادية",
  "pdfUrl": "https://content.moe.gov.eg/qa",
  "fileLabel": "فتح بوابة الوزارة"
},
  {
    "id": "2023-science-french-first-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث — 2022/2023",
    "subject": "اللغة الأجنبية الأولى",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي — الدور الأول 2023",
    "fileKind": "answer",
    "title": "نموذج إجابة الفرنسية — لغة أجنبية أولى (الشعبة العلمية علوم)",
    "round": "الدور الأول",
    "pdfPage": 13,
    "pdfUrl": "https://moe.gov.eg/media/evqfv1il/scinece-exammodels.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-science-german-first-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث — 2022/2023",
    "subject": "اللغة الأجنبية الأولى",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي — الدور الأول 2023",
    "fileKind": "answer",
    "title": "نموذج إجابة الألمانية — لغة أجنبية أولى (الشعبة العلمية علوم)",
    "round": "الدور الأول",
    "pdfPage": 18,
    "pdfUrl": "https://moe.gov.eg/media/evqfv1il/scinece-exammodels.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-science-french-second-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث — 2022/2023",
    "subject": "اللغة الأجنبية الثانية",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي — الدور الأول 2023",
    "fileKind": "answer",
    "title": "نموذج إجابة الفرنسية — لغة أجنبية ثانية (الشعبة العلمية علوم)",
    "round": "الدور الأول",
    "pdfPage": 23,
    "pdfUrl": "https://moe.gov.eg/media/evqfv1il/scinece-exammodels.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-science-german-second-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث — 2022/2023",
    "subject": "اللغة الأجنبية الثانية",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي — الدور الأول 2023",
    "fileKind": "answer",
    "title": "نموذج إجابة الألمانية — لغة أجنبية ثانية (الشعبة العلمية علوم)",
    "round": "الدور الأول",
    "pdfPage": 33,
    "pdfUrl": "https://moe.gov.eg/media/evqfv1il/scinece-exammodels.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-science-italian-second-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث — 2022/2023",
    "subject": "اللغة الأجنبية الثانية",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي — الدور الأول 2023",
    "fileKind": "answer",
    "title": "نموذج إجابة الإيطالية — لغة أجنبية ثانية (الشعبة العلمية علوم)",
    "round": "الدور الأول",
    "pdfPage": 38,
    "pdfUrl": "https://moe.gov.eg/media/evqfv1il/scinece-exammodels.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-science-spanish-second-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث — 2022/2023",
    "subject": "اللغة الأجنبية الثانية",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي — الدور الأول 2023",
    "fileKind": "answer",
    "title": "نموذج إجابة الإسبانية — لغة أجنبية ثانية (الشعبة العلمية علوم)",
    "round": "الدور الأول",
    "pdfPage": 43,
    "pdfUrl": "https://moe.gov.eg/media/evqfv1il/scinece-exammodels.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-science-chinese-second-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث — 2022/2023",
    "subject": "اللغة الأجنبية الثانية",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي — الدور الأول 2023",
    "fileKind": "answer",
    "title": "نموذج إجابة الصينية — لغة أجنبية ثانية (الشعبة العلمية علوم)",
    "round": "الدور الأول",
    "pdfPage": 48,
    "pdfUrl": "https://moe.gov.eg/media/evqfv1il/scinece-exammodels.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-science-chemistry-en-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث — 2022/2023",
    "subject": "الكيمياء",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي — الدور الأول 2023",
    "fileKind": "answer",
    "title": "نموذج إجابة الكيمياء باللغة الإنجليزية",
    "round": "الدور الأول",
    "pdfPage": 58,
    "pdfUrl": "https://moe.gov.eg/media/evqfv1il/scinece-exammodels.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-science-chemistry-fr-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث — 2022/2023",
    "subject": "الكيمياء",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي — الدور الأول 2023",
    "fileKind": "answer",
    "title": "نموذج إجابة الكيمياء باللغة الفرنسية",
    "round": "الدور الأول",
    "pdfPage": 63,
    "pdfUrl": "https://moe.gov.eg/media/evqfv1il/scinece-exammodels.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-science-physics-en-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث — 2022/2023",
    "subject": "الفيزياء",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي — الدور الأول 2023",
    "fileKind": "answer",
    "title": "نموذج إجابة الفيزياء باللغة الإنجليزية",
    "round": "الدور الأول",
    "pdfPage": 73,
    "pdfUrl": "https://moe.gov.eg/media/evqfv1il/scinece-exammodels.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-science-physics-fr-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث — 2022/2023",
    "subject": "الفيزياء",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي — الدور الأول 2023",
    "fileKind": "answer",
    "title": "نموذج إجابة الفيزياء باللغة الفرنسية",
    "round": "الدور الأول",
    "pdfPage": 78,
    "pdfUrl": "https://moe.gov.eg/media/evqfv1il/scinece-exammodels.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-science-geology-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث — 2022/2023",
    "subject": "كل المواد",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي — الدور الأول 2023",
    "fileKind": "answer",
    "title": "نموذج إجابة الجيولوجيا باللغة العربية — الشعبة العلمية علوم",
    "round": "الدور الأول",
    "pdfPage": 83,
    "pdfUrl": "https://moe.gov.eg/media/evqfv1il/scinece-exammodels.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-science-biology-en-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث — 2022/2023",
    "subject": "الأحياء",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي — الدور الأول 2023",
    "fileKind": "answer",
    "title": "نموذج إجابة الأحياء باللغة الإنجليزية",
    "round": "الدور الأول",
    "pdfPage": 103,
    "pdfUrl": "https://moe.gov.eg/media/evqfv1il/scinece-exammodels.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-science-biology-fr-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث — 2022/2023",
    "subject": "الأحياء",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي — الدور الأول 2023",
    "fileKind": "answer",
    "title": "نموذج إجابة الأحياء باللغة الفرنسية",
    "round": "الدور الأول",
    "pdfPage": 108,
    "pdfUrl": "https://moe.gov.eg/media/evqfv1il/scinece-exammodels.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-math-static-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث — 2022/2023",
    "subject": "الرياضيات",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي — الدور الأول 2023",
    "fileKind": "answer",
    "title": "نموذج إجابة الاستاتيكا — الشعبة العلمية رياضيات",
    "round": "الدور الأول",
    "pdfPage": 82,
    "pdfUrl": "https://moe.gov.eg/media/tzfj0lya/mathematica-exammodels.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-math-calculus-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث — 2022/2023",
    "subject": "الرياضيات",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي — الدور الأول 2023",
    "fileKind": "answer",
    "title": "نموذج إجابة التفاضل والتكامل — الشعبة العلمية رياضيات",
    "round": "الدور الأول",
    "pdfPage": 112,
    "pdfUrl": "https://moe.gov.eg/media/tzfj0lya/mathematica-exammodels.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-math-algebra-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث — 2022/2023",
    "subject": "الرياضيات",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي — الدور الأول 2023",
    "fileKind": "answer",
    "title": "نموذج إجابة الجبر والهندسة الفراغية — الشعبة العلمية رياضيات",
    "round": "الدور الأول",
    "pdfPage": 127,
    "pdfUrl": "https://moe.gov.eg/media/tzfj0lya/mathematica-exammodels.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-arts-history-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث — 2022/2023",
    "subject": "التاريخ",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي — الدور الأول 2023",
    "fileKind": "answer",
    "title": "نموذج إجابة التاريخ — الشعبة الأدبية",
    "round": "الدور الأول",
    "pdfPage": 53,
    "pdfUrl": "https://moe.gov.eg/media/xmhd3sow/arts-answermodels.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-arts-geography-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث — 2022/2023",
    "subject": "الجغرافيا",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي — الدور الأول 2023",
    "fileKind": "answer",
    "title": "نموذج إجابة الجغرافيا — الشعبة الأدبية",
    "round": "الدور الأول",
    "pdfPage": 58,
    "pdfUrl": "https://moe.gov.eg/media/xmhd3sow/arts-answermodels.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-arts-psychology-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث — 2022/2023",
    "subject": "علم النفس والاجتماع",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي — الدور الأول 2023",
    "fileKind": "answer",
    "title": "نموذج إجابة علم النفس — الشعبة الأدبية",
    "round": "الدور الأول",
    "pdfPage": 63,
    "pdfUrl": "https://moe.gov.eg/media/xmhd3sow/arts-answermodels.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-arts-philosophy-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث — 2022/2023",
    "subject": "الفلسفة والمنطق",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي — الدور الأول 2023",
    "fileKind": "answer",
    "title": "نموذج إجابة الفلسفة — الشعبة الأدبية",
    "round": "الدور الأول",
    "pdfPage": 68,
    "pdfUrl": "https://moe.gov.eg/media/xmhd3sow/arts-answermodels.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-official-question-paper-portal",
    "year": "2023",
    "system": "modern",
    "systemLabel": "نظام الثانوية العامة 2023",
    "subject": "كل المواد",
    "type": "official",
    "typeLabel": "كراسات أسئلة رسمية — بوابة وزارة التربية والتعليم",
    "fileKind": "paper",
    "title": "كراسات أسئلة امتحانات الثانوية العامة 2022/2023 — جميع المواد",
    "round": "الدور الأول — بوابة الوزارة",
    "pdfUrl": "https://moe.gov.eg/ar/exam-model2022-2023/",
    "fileLabel": "فتح كراسات الأسئلة من بوابة الوزارة"
  },
  {
    "id": "2024-official-question-and-answer-portal",
    "year": "2024",
    "system": "modern",
    "systemLabel": "نظام الثانوية العامة 2024",
    "subject": "كل المواد",
    "type": "official",
    "typeLabel": "أسئلة ونماذج إجابة رسمية — مدرستنا بلس",
    "fileKind": "paper",
    "title": "امتحانات الدور الأول 2023/2024 — النماذج الأربعة ونماذج الإجابة",
    "round": "الدور الأول",
    "pdfUrl": "https://madrasetnaplus.eg/",
    "fileLabel": "فتح منصة مدرستنا بلس"
  },
  {
    "id": "2026-official-models-portal",
    "year": "2026",
    "system": "modern",
    "systemLabel": "العام الدراسي 2025/2026",
    "subject": "كل المواد",
    "type": "model",
    "typeLabel": "نماذج استرشادية رسمية — وزارة التربية والتعليم",
    "fileKind": "model",
    "title": "النماذج الاسترشادية للثانوية العامة 2026 — حتى 10 نماذج لكل مادة",
    "round": "العام الدراسي 2025/2026",
    "pdfUrl": "https://ellibrary.moe.gov.eg/sec3guideforms/",
    "fileLabel": "فتح المكتبة الإلكترونية الرسمية"
  }
];

  // Official Ministry answer key, Arabic 2023 first round, model A (51 objective questions).
  // Question text remains in the linked paper; this module provides a digital answer sheet.
  const ARABIC_2023_MODEL_A_KEY = [
    'أ','ج','ب','ب','أ','د','ج','ب','أ','د','ج','ب','د','أ','ج','د','ب','أ','ج','ب',
    'ج','ب','ب','أ','د','ج','ب','أ','د','ج','ب','أ','أ','ب','د','ج','أ','ب','ج','ج',
    'د','ب','ج','أ','د','ب','ج','أ','ج','ب','د'
  ];
  const ARABIC_2023_MODEL_B_KEY = [
    'د','ج','ب','أ','ج','ب','د','ج','أ','د','أ','ج','د','أ','ب','ج','أ','د','ب','ج',
    'أ','ج','ب','أ','د','ج','ب','أ','ج','ب','أ','أ','د','ب','ج','ج','أ','ب','د','ج',
    'أ','د','ج','أ','د','ب','د','أ','ب','ج','أ'
  ];
  const ARABIC_2023_MODEL_C_KEY = [
    'ج','ب','أ','د','ج','ب','أ','ج','ب','ب','أ','د','د','ب','ج','أ','ج','ب','د','ج',
    'أ','ب','أ','د','د','أ','ب','ج','أ','د','ب','د','أ','ج','ج','د','أ','أ','د','ج',
    'أ','د','أ','ج','د','ج','ب','ج','أ','د','ب'
  ];
  const ARABIC_2023_MODEL_D_KEY = [
    'ج','أ','أ','ج','ب','ب','أ','د','ج','ب','أ','د','ج','ب','د','ب','ج','أ','ج','ب',
    'ج','أ','أ','ج','ب','ب','أ','د','ج','ب','أ','د','ج','ب','د','ب','ج','أ','ج','ب',
    'د','ج','أ','د','أ','ج','د','أ','ب','ج','أ'
  ];
  const ARABIC_2023_MODEL_KEYS = { أ: ARABIC_2023_MODEL_A_KEY, ب: ARABIC_2023_MODEL_B_KEY, ج: ARABIC_2023_MODEL_C_KEY, د: ARABIC_2023_MODEL_D_KEY };
  const CHEMISTRY_2023_MODEL_A_KEY = [
    'د','أ','ج','د','ب','ج','أ','د','ب','ج','أ','ج','ب','أ','د','ب','أ','ج','د','ب','أ','د',
    'أ','أ','ب','أ','د','ج','د','ج','ب','أ','د','ب','ج','ج','د','أ','ج','أ','ب','د','د','أ'
  ];
  const CHEMISTRY_2023_MODEL_B_KEY = [
    'د','ج','ب','أ','ب','أ','د','ج','أ','د','أ','أ','أ','ج','د','ب','ب','ج','أ','د','د','أ',
    'ج','د','ب','أ','د','ب','ب','ج','أ','ج','د','د','أ','ج','أ','ب','ج','د','أ','د','ب','ج'
  ];
  const CHEMISTRY_2023_MODEL_C_KEY = [
    'أ','د','أ','أ','أ','ج','د','ب','د','ج','ب','أ','ب','أ','د','ج','ب','أ','د','ب','ب','ج',
    'أ','ج','ب','ج','أ','د','د','أ','ج','د','ج','أ','ب','د','د','أ','د','ب','ج','ج','د','أ'
  ];
  const CHEMISTRY_2023_MODEL_D_KEY = [
    'ب','أ','د','ب','ب','ج','أ','ج','ب','ج','أ','د','د','أ','ج','د','د','ج','ب','أ','ب','أ',
    'د','ج','أ','د','أ','أ','أ','ج','د','ب','ج','د','أ','د','د','ج','د','د','أ','ج','أ','ب'
  ];
  const CHEMISTRY_2023_MODEL_KEYS = { أ: CHEMISTRY_2023_MODEL_A_KEY, ب: CHEMISTRY_2023_MODEL_B_KEY, ج: CHEMISTRY_2023_MODEL_C_KEY, د: CHEMISTRY_2023_MODEL_D_KEY };
  const CHEMISTRY_2023_QUESTION_URL = 'https://www.mediafire.com/file/8pkihbdzjfy1y1r/%25D8%25A7%25D9%2585%25D8%25AA%25D8%25AD%25D8%25A7%25D9%2586_%25D8%25A7%25D9%2584%25D9%2583%25D9%258A%25D9%2585%25D9%258A%25D8%25A7%25D8%25A1_%25D8%25A8%25D8%25A7%25D9%2584%25D8%25A7%25D8%25AC%25D8%25A7%25D8%25A8%25D8%25A7%25D8%25AA_%25D9%2584%25D9%2584%25D8%25AB%25D8%25A7%25D9%2586%25D9%2588%25D9%258A%25D8%25A9_%25D8%25A7%25D9%2584%25D8%25B9%25D8%25A7%25D9%2585%25D8%25A9_%25D8%25A7%25D9%2584%25D8%25AF%25D9%2588%25D8%25B1_%25D8%25A7%25D9%2584%25D8%25A3%25D9%2588%25D9%2584_2023_%25D9%2585.pdf/file';
  const CHEMISTRY_2023_ANSWER_URL = 'https://moe.gov.eg/media/evqfv1il/scinece-exammodels.pdf#page=53';
  const CHEMISTRY_2023_WEIGHTS = Array.from({ length: 44 }, (_, index) => index < 32 ? 1 : 2);

  // Physics 2023 Arabic answer keys transcribed from the Ministry's official grading PDF (pages 68–71).
  const PHYSICS_2023_MODEL_A_KEY = ['د','أ','ج','د','ب','أ','د','ب','ج','أ','د','أ','ج','ب','أ','أ','د','ب','ب','ج','ب','أ','جميع الإجابات صحيحة','ب|ج','ج','ب','ج','ج','ب','أ','د','ب','ج','أ','د','أ','ب','د','ج','أ','ج','ب','أ','د'];
  const PHYSICS_2023_MODEL_B_KEY = ['ب','أ','د','ب','ج','أ','ب','ج','ج','ب','ب','ج','ب','أ','د','ب','ب|ج','ج','د','أ','ج','ب','أ','أ','د','د','أ','ج','د','ب','أ','جميع الإجابات صحيحة','أ','ب','د','ج','أ','د','ب','أ','د','ج','أ','ج'];
  const PHYSICS_2023_MODEL_C_KEY = ['د','أ','ج','ب','أ','أ','د','ب','أ','جميع الإجابات صحيحة','د','أ','ج','د','ب','أ','د','ب','ج','أ','ب','أ','د','ب','ب','ج','ج','ب','ب','ج','ب|ج','ج','ج','أ','ج','ب','أ','د','أ','ب','د','ج','أ','د'];
  const PHYSICS_2023_MODEL_D_KEY = ['ب','ب','ج','ب|ج','ج','د','أ','ج','ب','أ','أ','د','ب','أ','جميع الإجابات صحيحة','ب','ج','ج','ب','أ','د','ب','ج','أ','ب','أ','د','ب','د','أ','ج','د','ب','أ','د','ج','أ','د','ج','أ','ج','أ','ب','د'];
  const PHYSICS_2023_MODEL_KEYS = { أ: PHYSICS_2023_MODEL_A_KEY, ب: PHYSICS_2023_MODEL_B_KEY, ج: PHYSICS_2023_MODEL_C_KEY, د: PHYSICS_2023_MODEL_D_KEY };
  const PHYSICS_2023_QUESTION_URL = 'https://www.ta3lemkonline.com/2023/08/2023_32.html';
  const PHYSICS_2023_ANSWER_URL = 'https://moe.gov.eg/media/evqfv1il/scinece-exammodels.pdf#page=68';
  const PHYSICS_2023_WEIGHTS = Array.from({ length: 44 }, (_, index) => index < 32 ? 1 : 2);
  // Biology 2023 Arabic answer keys transcribed from the Ministry's official science key, printed pages 98–101.
  const BIOLOGY_2023_MODEL_A_KEY = ['أ','ج','ب','أ','د','ج','ب','د','أ','ج','ب','د','أ','ج','ب','د','ب','أ','د','ج','ب','د','أ','ج','ب','د','أ','ج','ج','ب','د','أ','ج','ب','د','أ','د','ج','ب','أ','د','ج','ب','أ'];
  const BIOLOGY_2023_MODEL_B_KEY = ['ب','د','أ','ج','ج','ب','د','أ','ب','أ','د','ج','ب','د','أ','ج','أ','ج','ب','د','أ','ج','ب','د','أ','ج','ب','أ','د','ج','ب','د','ج','ب','أ','ب','أ','د','أ','د','ج','ج','ب','د'];
  const BIOLOGY_2023_MODEL_C_KEY = ['أ','ج','ب','د','أ','ج','ب','د','ب','د','أ','ج','ج','ب','د','أ','أ','ج','ب','أ','د','ج','ب','د','ب','أ','د','ج','ب','د','أ','ج','أ','د','ج','ج','ب','أ','ج','ب','د','ب','أ','د'];
  const BIOLOGY_2023_MODEL_D_KEY = ['ب','أ','د','ج','ب','د','أ','ج','أ','ج','ب','أ','د','ج','ب','د','ب','د','أ','ج','ج','ب','د','أ','أ','ج','ب','د','أ','ج','ب','د','ب','أ','د','ج','ب','د','ج','ب','أ','أ','د','ج'];
  const BIOLOGY_2023_MODEL_KEYS = { أ: BIOLOGY_2023_MODEL_A_KEY, ب: BIOLOGY_2023_MODEL_B_KEY, ج: BIOLOGY_2023_MODEL_C_KEY, د: BIOLOGY_2023_MODEL_D_KEY };
  const BIOLOGY_2023_QUESTION_URL = 'https://www.ta3lemkonline.com/2023/08/2023_33.html';
  const BIOLOGY_2023_ANSWER_URL = 'https://moe.gov.eg/media/evqfv1il/scinece-exammodels.pdf#page=98';
  const BIOLOGY_2023_WEIGHTS = Array.from({ length: 44 }, (_, index) => index < 32 ? 1 : 2);
  // 2023 scientific-mathematics Arabic keys transcribed from the official Ministry answer-key PDF.
  // 2023 English answer keys transcribed from the Ministry's official marking guides.
  const ENGLISH_2023_KEYS = {
    first: {
      label: 'اللغة الإنجليزية — لغة أجنبية أولى',
      questionUrl: 'https://www.myschool77.com/2023/07/English-exam-3secondary.html',
      answerUrl: 'https://moe.gov.eg/media/evqfv1il/scinece-exammodels.pdf',
      questionPage: 8, answerPage: 8, questionCount: 34, totalQuestions: 37, officialTotal: 50,
      weights: Array.from({ length: 34 }, (_, index) => index < 26 ? 1 : 2),
      models: {
        A: ['B','A','D','C','B','B','D','A','B','C','C','B','A','D','B','A','C','D','B','A','C','B','D','D','A','C','A','C','D','C','A|B','D','B','C'],
        B: ['C','B','A','C','A','B','D','B','D','B','B','A','C','D','C','B','A','D','D','D','A','C','B','A','C','B','C','D','C','A','D','A|B','C','B'],
        C: ['D','B','B','D','B','C','A','B','C','A','D','C','A','B','D','A','B','C','C','A','D','D','B','C','A','B','D','C','A','C','A|B','D','B','C'],
        D: ['B','C','D','B','D','A','B','C','B','A','D','A','B','C','D','C','A','B','B','C','A','B','C','A','D','D','C','A','C','D','D','A|B','C','B']
      }
    },
    second: {
      label: 'اللغة الإنجليزية — لغة أجنبية ثانية',
      questionUrl: 'https://bablsheet.blob.core.windows.net/examq2023/09.pdf',
      answerUrl: 'https://moe.gov.eg/media/evqfv1il/scinece-exammodels.pdf',
      questionPage: 28, answerPage: 28, questionCount: 29, totalQuestions: 31, officialTotal: 40,
      weights: Array.from({ length: 29 }, (_, index) => index < 24 ? 1 : 2),
      models: {
        A: ['C','A','D','C','B','C','A','C','D','B','D','A','C','A','B','D','C','A','B','A','D','C','A','B','D','C','D','A','B'],
        B: ['C','B','C','C','A','D','B','D','A','A','C','D','A','B','C','D','C','A','B','D','C','A','B','A','C','D','D','B','A'],
        C: ['D','C','A','C','C','B','D','A','C','A','B','D','B','C','A','B','D','A','A','C','D','B','A','C','D','D','C','A','B'],
        D: ['C','C','B','D','C','A','A','B','D','D','A','C','C','B','A','A','A','D','C','B','B','C','D','A','C','D','D','B','A']
      }
    }
  };
  const MATH_2023_KEYS = {
    statics: {
      label: 'الاستاتيكا', questionPage: 82, answerPage: 83,
      models: {
        أ: ['ب','ج','د','ج','ب','د','ج','أ','أ','ب','أ','د','ب','ج','د','د','أ','ج'],
        ب: ['ب','ج','د','ج','ب','ب','أ','أ','ج','د','د','أ','د','د','ج','ب','ج','أ'],
        ج: ['د','ب','ج','ب','ج','أ','د','أ','ب','ج','أ','د','د','ب','د','ج','أ','ج'],
        د: ['ج','د','ب','ب','ج','ج','أ','ب','د','أ','د','أ','ج','د','ب','د','ج','أ']
      }
    },
    dynamics: {
      label: 'الديناميكا', questionPage: 97, answerPage: 98,
      models: {
        أ: ['ج','ب','د','ج','أ','ب','د','ج','أ','ج','د','ب','د','ج','أ','د','ب','ج'],
        ب: ['أ','ج','د','ب','ج','ج','أ','ج','د','ب','ب','د','د','أ','ج','د','ج','ب'],
        ج: ['د','ج','ج','أ','ب','ج','ب','أ','ج','د','د','ب','أ','د','د','ج','ب','ج'],
        د: ['ب','د','أ','ج','ج','د','ج','ج','ب','أ','ب','د','ج','د','د','أ','ج','ب']
      }
    },
    calculus: {
      label: 'التفاضل والتكامل', questionPage: 112, answerPage: 113,
      models: {
        أ: ['ب','ب','أ','د','ج','أ','ب','أ','د','ج','ب','د','أ','ج','ب','د','أ','ج'],
        ب: ['ج','د','أ','ب','ب','ج','د','أ','ب','أ','د','ب','د','ب','ج','أ','ج','أ'],
        ج: ['أ','ب','د','ج','ب','أ','أ','د','ج','ب','ب','د','ب','أ','د','ج','أ','ج'],
        د: ['ب','أ','ج','ب','د','ب','أ','ج','أ','د','د','ب','ج','د','أ','ب','ج','أ']
      }
    },
    algebra: {
      label: 'الجبر والهندسة الفراغية', questionPage: 127, answerPage: 128,
      models: {
        أ: ['ب','ج','أ','ج','د','ب','أ','ب','أ','ج','د','ب','أ','ج','ب','ج','أ','د'],
        ب: ['د','ج','أ','ج','ب','ج','أ','ب','أ','ب','ب','د','ج','ب','ج','أ','د','أ'],
        ج: ['أ','ب','ج','د','ج','ب','ب','أ','ج','أ','د','ب','ب','أ','ج','ج','أ','د'],
        د: ['ج','أ','د','ب','ج','أ','ب','ج','ب','أ','ب','د','ج','ج','أ','ب','د','أ']
      }
    }
  };
  const MATH_2023_ANSWER_URL = 'https://moe.gov.eg/media/tzfj0lya/mathematica-exammodels.pdf';
  const MATH_2023_WEIGHTS = Array.from({ length: 18 }, (_, index) => index < 10 ? 1 : 2);
  const ARABIC_2023_PAPER_URL = 'https://drive.google.com/file/d/1Xdhd5Y8WgYdk9LoSfLjN0ktpgahl5tZr/view?usp=drivesdk';
  const ARABIC_2023_ANSWER_URL = 'https://moe.gov.eg/media/xmhd3sow/arts-answermodels.pdf#page=4';

  // External-book references only; no copyrighted book files are hosted here.
  const BOOK_SOURCES = [
    { id:'arabic-emtehan-2026', subject:'اللغة العربية', book:'كتاب الامتحان — ملحق امتحانات الأعوام السابقة 2026', publisher:'الامتحان', coverage:'امتحانات 2021 و2022 و2023 للشعبتين العلمية والأدبية، الدوران الأول والثاني', indexDetail:'السنوات: 2021، 2022، 2023. الشعبتان العلمية والأدبية. الدوران الأول والثاني. لم يُنشر رقم صفحة بداية الملحق في المصدر المفتوح.', classification:'امتحانات سابقة بحسب وصف الملحق', sourceUrl:'https://shbabbek.com/show/266322', sourceLabel:'عرض وصف الملحق' },
    { id:'english-first-gem-2026', subject:'اللغة الأجنبية الأولى', book:'GEM English 2026 — ملحق نماذج الامتحانات', publisher:'GEM', coverage:'16 نموذج امتحان للتدريب؛ لم يثبت أنها امتحانات سنوات سابقة أصلية', indexDetail:'عدد النماذج: 16. التصنيف تدريب ومحاكاة، وليس سجلًا لامتحانات رسمية سابقة.', classification:'نماذج تدريبية — ليست امتحانات سابقة مؤكدة', sourceUrl:'https://www.myschool77.com/2026/02/gem-english-3rd-secondary-term-2-2026.html', sourceLabel:'عرض وصف الملحق' },
    { id:'math-moasser-pure-2026', subject:'الرياضيات — بحتة', book:'المعاصر رياضيات بحتة 2026', publisher:'المعاصر', coverage:'أسئلة امتحانات الثانوية العامة المصرية من 2019 إلى 2025، الدوران الأول والثاني؛ ويوجد قسم منفصل لأسئلة الأزهر', indexDetail:'السنوات: 2019–2025. الدور الأول والثاني. قسم الأزهر منفصل ويجب عدم دمجه مع امتحانات الثانوية العامة المصرية.', classification:'أسئلة امتحانات سابقة — قسم الأزهر منفصل', sourceUrl:'https://shbabbek.com/show/269082', sourceLabel:'عرض تفاصيل الكتاب' },
    { id:'math-moasser-applied-2026', subject:'الرياضيات — تطبيقية', book:'المعاصر رياضيات تطبيقية 2026', publisher:'المعاصر', coverage:'أسئلة امتحانات مصر والأزهر من 2019 إلى 2025، الدوران الأول والثاني، إضافة إلى 20 امتحانًا تدريبيًا', indexDetail:'السنوات: 2019–2025. 20 امتحانًا تدريبيًا منفصلًا عن أسئلة السنوات السابقة. يلزم استبعاد أسئلة الأزهر عند بناء أرشيف الثانوية العامة.', classification:'أسئلة سابقة مختلطة + نماذج تدريبية', sourceUrl:'https://shbabbek.com/show/268762', sourceLabel:'عرض تفاصيل الكتاب' },
    { id:'chemistry-emtehan-2026', subject:'الكيمياء', book:'كتاب الامتحان كيمياء 2026 — المراجعة النهائية', publisher:'الامتحان', coverage:'11 نموذجًا من امتحانات الأعوام السابقة، معدلة لتناسب تعديلات الوزارة', indexDetail:'النماذج 1–11 تبدأ من صفحة 102. النماذج 12–26 تدريبية من إعداد الكتاب وتبدأ من صفحة 211؛ لا تخلط النوعين.', classification:'11 نموذجًا من امتحانات سابقة معدلة', sourceUrl:'https://shbabbek.com/show/267311', sourceLabel:'عرض الفهرس الموصوف' },
    { id:'chemistry-mendeleev-2026', subject:'الكيمياء', book:'مندليف كيمياء 2026 — الجزء الثاني', publisher:'مندليف', coverage:'وصف الجزء الثاني يذكر امتحانات الأعوام السابقة والنماذج التجريبية والاسترشادية', indexDetail:'لم يتوفر فهرس مفتوح يحدد السنوات أو أرقام الصفحات؛ يبقى هذا السجل مرجعًا عامًا فقط.', classification:'امتحانات سابقة + نماذج تجريبية — تفاصيل غير مكتملة', sourceUrl:'https://www.sherine-edu.com/mendeleev-chemistry-review-exams/', sourceLabel:'عرض وصف المحتوى' },
    { id:'physics-tafawok-2026', subject:'الفيزياء', book:'التفوق فيزياء 2026 — الجزء الثاني: امتحانات الثانوية العامة والنماذج الاسترشادية', publisher:'التفوق', coverage:'25 امتحانًا في الجزء الثاني تشمل امتحانات الثانوية العامة والنماذج التجريبية والاسترشادية الرسمية', indexDetail:'الجزء الثاني: 25 امتحانًا إجمالًا. المصدر لا يفصل عدد الامتحانات السابقة عن النماذج الاسترشادية ولا يسرد السنوات؛ لا يمكن تسجيلها كسنوات محددة بعد.', classification:'امتحانات سابقة + نماذج تجريبية واسترشادية', sourceUrl:'https://www.youtube.com/watch?v=YByYsZX6dR0', sourceLabel:'عرض شرح محتويات الناشر' },
    { id:'biology-tafawok-2026', subject:'الأحياء', book:'التفوق أحياء 2026 — جزء امتحانات الثانوية العامة والنماذج الاسترشادية', publisher:'التفوق', coverage:'25 امتحانًا بحسب وصف قناة السلسلة، تشمل امتحانات الثانوية العامة والنماذج التجريبية والاسترشادية', indexDetail:'عدد الامتحانات: 25. لا توجد في الوصف المتاح قائمة مفصلة بالسنوات أو الصفحات.', classification:'امتحانات سابقة + نماذج رسمية — السنوات غير مفصلة', sourceUrl:'https://www.youtube.com/watch?v=hZ1WAls7mqY', sourceLabel:'عرض شرح محتويات الناشر' },
    { id:'biology-emtehan-2026', subject:'الأحياء', book:'كتاب الامتحان أحياء 2026 — المراجعة النهائية', publisher:'الامتحان', coverage:'الأسئلة المقررة من امتحانات الثانوية العامة 2021–2024، وامتحانا الدور الأول والثاني لعام 2025', indexDetail:'السنوات: 2021–2024 (الأسئلة المقررة فقط)، ثم امتحان الدور الأول والدور الثاني لعام 2025. لا يذكر المصدر أرقام صفحات هذا القسم.', classification:'أسئلة سنوات سابقة + امتحانا 2025', sourceUrl:'https://shbabbek.com/show/267137', sourceLabel:'عرض تفاصيل المحتويات' },
    { id:'french-bravo-2026', subject:'اللغة الأجنبية الثانية — الفرنسية', book:'برافو لغة فرنسية 2026 — بوكليت المراجعة والامتحانات', publisher:'برافو', coverage:'بوكليت يضم امتحانات الوزارة والنماذج التجريبية وامتحانات برافو وامتحانات الثانوية العامة والأزهر', indexDetail:'فهرس الدروس المنشور يسرد امتحانات مرقمة من 1 إلى 26 في الصفحات 129–209؛ لا يحدد أيها امتحان وزارة سابق وأيها نموذج من إعداد برافو، لذا لا نصنفها كأوراق رسمية منفردة.', classification:'بوكليت امتحانات مختلط — يلزم تمييز مصدر كل نموذج', sourceUrl:'https://www.eltapalomesr.com/2025/02/2025_384.html', sourceLabel:'عرض بيانات البوكليت' }
  ];
  const BOOK_SOURCE_PENDING = [
    { subject:'اللغة الأجنبية الثانية — الألمانية والإيطالية والإسبانية والصينية', note:'تم العثور على مصدر للفرنسية (برافو)، لكن لم يتم بعد توثيق كتب خارجية محددة لبقية اللغات الثانية.' },
    { subject:'اللغة الأجنبية الأولى — امتحانات سنوات سابقة داخل كتاب خارجي', note:'المصدر المتحقق لـ GEM يثبت وجود نماذج تدريبية فقط، وليس امتحانات سنوات سابقة أصلية. نحتاج فهرسًا أو ملحقًا موثقًا من العمالقة أو سلسلة أخرى.' }
  ];
  const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const option = (item, selected) =>
    `<option value="${escapeHTML(item.value)}" ${item.value === selected ? 'selected' : ''}>${escapeHTML(item.label)}</option>`;

  function init() {
    const root = document.getElementById('pastExamArchiveRoot');
    if (!root) return;
    root.innerHTML = `
      <div class="past-exam-hero">
        <span class="eyebrow">PAST EXAMINATIONS · 2019–2026</span>
        <h2>أرشيف امتحانات الثانوية العامة</h2>
        <p>امتحانات الوزارة الرسمية، وامتحانات المحافظات، والنماذج الاسترشادية — مع فصل كل نظام تعليمي عن الآخر.</p>
        <div class="past-exam-stats">
          <div><strong>8</strong><span>سنوات مستهدفة</span></div>
          <div><strong>${SUBJECTS.length}</strong><span>مواد وفروع</span></div>
          <div><strong>3</strong><span>أنواع مصادر</span></div>
        </div>
      </div>
      <div class="panel past-exam-filters">
        <div class="past-exam-filter-grid">
          <div><label for="pastExamSystem">النظام التعليمي</label><select id="pastExamSystem">${SYSTEMS.map(item => option(item, 'all')).join('')}</select></div>
          <div><label for="pastExamYear">السنة</label><select id="pastExamYear"><option value="all">كل السنوات</option>${YEARS.map(year => `<option value="${year}">${year}</option>`).join('')}</select></div>
          <div><label for="pastExamSubject">المادة</label><select id="pastExamSubject"><option value="all">كل المواد</option>${SUBJECTS.map(subject => `<option value="${escapeHTML(subject)}">${escapeHTML(subject)}</option>`).join('')}</select></div>
          <div><label for="pastExamType">نوع الامتحان</label><select id="pastExamType"><option value="all">كل الأنواع</option>${TYPES.map(item => option(item, '')).join('')}</select></div>
        </div>
        <label for="pastExamSearch">بحث داخل الأرشيف</label>
        <input id="pastExamSearch" type="search" placeholder="ابحث باسم المادة أو السنة أو الدور...">
      </div>
      <div class="past-exam-results-head"><div><h3>الامتحانات والملفات</h3><span id="pastExamCount" class="hint"></span></div><span class="past-exam-integrity">المصدر يُراجع قبل الإضافة</span></div>
      <div id="pastExamResults" class="past-exam-results" aria-live="polite"></div>
      <section class="panel past-exam-interactive" id="pastExamInteractive">
        <div class="past-exam-results-head"><div><h3>امتحان تفاعلي تجريبي من أرشيف الوزارة</h3><span class="hint">اللغة العربية · الدور الأول 2023 · النموذج أ</span></div><span class="past-exam-integrity">مفتاح إجابة رسمي</span></div>
        <p class="past-exam-interactive-note">افتح ورقة الأسئلة في نافذة مستقلة، ثم سجّل اختياراتك هنا حسب أرقام الأسئلة. هذه النسخة تصحح 51 سؤال اختيار من متعدد فقط؛ الأسئلة المقالية الأربعة لا تدخل في الدرجة الآلية.</p>
        <div class="past-exam-source-links">
          <a href="${ARABIC_2023_PAPER_URL}" target="_blank" rel="noopener noreferrer">فتح ورقة الأسئلة — رابط أرشيف خارجي ↗</a>
          <a href="${ARABIC_2023_ANSWER_URL}" target="_blank" rel="noopener noreferrer">مفتاح الإجابة الرسمي من الوزارة ↗</a>
        </div>
        <div id="pastExamArabicQuiz"></div>
      </section>
      <section class="panel past-exam-interactive" id="pastExamChemistryInteractive">
        <div class="past-exam-results-head"><div><h3>امتحان الكيمياء التفاعلي — الدور الأول 2023</h3><span class="hint">الشعبة العلمية · الكيمياء باللغة العربية · النماذج أ، ب، ج، د</span></div><span class="past-exam-integrity">مفتاح إجابة رسمي</span></div>
        <p class="past-exam-interactive-note">افتح ورقة الامتحان من رابط الأرشيف الخارجي، ثم سجّل إجاباتك هنا. التصحيح الآلي يشمل 44 سؤال اختيار من متعدد وفق توزيع الوزارة: 32 سؤالًا بدرجة و12 سؤالًا بدرجتين. السؤالان المقاليان (45 و46) لا يدخلان في التصحيح الآلي.</p>
        <div class="past-exam-source-links">
          <a href="${CHEMISTRY_2023_QUESTION_URL}" target="_blank" rel="noopener noreferrer">فتح ورقة الامتحان — أرشيف خارجي ↗</a>
          <a href="${CHEMISTRY_2023_ANSWER_URL}" target="_blank" rel="noopener noreferrer">مفتاح الإجابة الرسمي من الوزارة ↗</a>
        </div>
        <div id="pastExamChemistryQuiz"></div>
      </section>
      <section class="panel past-exam-interactive" id="pastExamPhysicsInteractive">
        <div class="past-exam-results-head"><div><h3>امتحان الفيزياء التفاعلي — الدور الأول 2023</h3><span class="hint">الشعبة العلمية · الفيزياء باللغة العربية · النماذج أ، ب، ج، د</span></div><span class="past-exam-integrity">مفتاح إجابة رسمي</span></div>
        <p class="past-exam-interactive-note">افتح صفحة الامتحان لتحميل ورقة الأسئلة، ثم سجّل إجاباتك هنا. التصحيح الآلي يشمل 44 سؤالًا موضوعيًا وفق توزيع الوزارة: 32 سؤالًا بدرجة و12 سؤالًا بدرجتين. السؤالان المقاليان (45 و46) لا يدخلان في التصحيح الآلي. بعض مفاتيح الوزارة تتضمن إجابة مركبة أو «جميع الإجابات صحيحة»، وقد أُدرجت كما وردت في المفتاح.</p>
        <div class="past-exam-source-links">
          <a href="${PHYSICS_2023_QUESTION_URL}" target="_blank" rel="noopener noreferrer">صفحة الامتحان وتحميل ورقة الأسئلة ↗</a>
          <a href="${PHYSICS_2023_ANSWER_URL}" target="_blank" rel="noopener noreferrer">مفتاح الإجابة الرسمي من الوزارة ↗</a>
        </div>
        <div id="pastExamPhysicsQuiz"></div>
      </section>
      <section class="panel past-exam-interactive" id="pastExamBiologyInteractive">
        <div class="past-exam-results-head"><div><h3>امتحان الأحياء التفاعلي — الدور الأول 2023</h3><span class="hint">الشعبة العلمية · الأحياء باللغة العربية · النماذج أ، ب، ج، د</span></div><span class="past-exam-integrity">مفتاح إجابة رسمي</span></div>
        <p class="past-exam-interactive-note">افتح ورقة الأسئلة من صفحة الأرشيف الخارجي، ثم سجّل إجاباتك هنا. التصحيح الآلي يشمل 44 سؤالًا موضوعيًا وفق توزيع الوزارة: 32 سؤالًا بدرجة و12 سؤالًا بدرجتين. السؤالان المقاليان (45 و46) لا يدخلان في التصحيح الآلي.</p>
        <div class="past-exam-source-links">
          <a href="${BIOLOGY_2023_QUESTION_URL}" target="_blank" rel="noopener noreferrer">فتح ورقة الامتحان — أرشيف خارجي ↗</a>
          <a href="${BIOLOGY_2023_ANSWER_URL}" target="_blank" rel="noopener noreferrer">مفتاح الإجابة الرسمي من الوزارة ↗</a>
        </div>
        <div id="pastExamBiologyQuiz"></div>
      </section>
      <section class="panel past-exam-interactive" id="pastExamEnglishInteractive">
        <div class="past-exam-results-head"><div><h3>امتحانات اللغة الإنجليزية التفاعلية — الدور الأول 2023</h3><span class="hint">اللغة الأجنبية الأولى واللغة الأجنبية الثانية · النماذج A وB وC وD</span></div><span class="past-exam-integrity">مفاتيح إجابة الوزارة</span></div>
        <p class="past-exam-interactive-note">اللغة الأولى: 34 سؤالًا موضوعيًا، منها سؤال اختيار إجابتين لا يدخل في التصحيح الآلي، بالإضافة إلى 3 أسئلة مقالية. اللغة الثانية: 29 سؤالًا موضوعيًا بالإضافة إلى سؤالين مقاليين. التصحيح يعرض نتيجة الجزء الموضوعي الآلي فقط، ولا يدّعي احتساب الدرجة الرسمية الكاملة.</p>
        <div class="past-exam-source-links">
          <a href="https://www.myschool77.com/2023/07/English-exam-3secondary.html" target="_blank" rel="noopener noreferrer">ورقة اللغة الإنجليزية الأولى — نسخة أرشيفية خارجية ↗</a>
          <a href="https://bablsheet.blob.core.windows.net/examq2023/09.pdf" target="_blank" rel="noopener noreferrer">ورقة اللغة الإنجليزية الثانية — PDF ↗</a>
          <a href="https://moe.gov.eg/media/evqfv1il/scinece-exammodels.pdf#page=8" target="_blank" rel="noopener noreferrer">مفتاح الوزارة للغة الأولى — صفحة 8 ↗</a>
          <a href="https://moe.gov.eg/media/evqfv1il/scinece-exammodels.pdf#page=28" target="_blank" rel="noopener noreferrer">مفتاح الوزارة للغة الثانية — صفحة 28 ↗</a>
        </div>
        <div id="pastExamEnglishQuiz"></div>
      </section>
      <section class="panel past-exam-interactive" id="pastExamMathInteractive">
        <div class="past-exam-results-head"><div><h3>امتحانات الرياضيات التفاعلية — الدور الأول 2023</h3><span class="hint">الشعبة العلمية رياضيات · الاستاتيكا · الديناميكا · التفاضل والتكامل · الجبر والهندسة الفراغية</span></div><span class="past-exam-integrity">مفاتيح إجابة رسمية</span></div>
        <p class="past-exam-interactive-note">اختر فرع المادة والنموذج (أ، ب، ج، د). لكل فرع 18 سؤالًا موضوعيًا: أول 10 أسئلة بدرجة واحدة، وآخر 8 أسئلة بدرجتين. السؤالان المقاليان (19 و20) مستبعدان من التصحيح الآلي. الدرجة الكلية لكل فرع 30 درجة، منها 26 درجة للأسئلة الموضوعية.</p>
        <div class="past-exam-source-links">
          <a href="${MATH_2023_ANSWER_URL}#page=82" target="_blank" rel="noopener noreferrer">ورقة الاستاتيكا — صفحة 82 ↗</a>
          <a href="${MATH_2023_ANSWER_URL}#page=97" target="_blank" rel="noopener noreferrer">ورقة الديناميكا — صفحة 97 ↗</a>
          <a href="${MATH_2023_ANSWER_URL}#page=112" target="_blank" rel="noopener noreferrer">ورقة التفاضل والتكامل — صفحة 112 ↗</a>
          <a href="${MATH_2023_ANSWER_URL}#page=127" target="_blank" rel="noopener noreferrer">ورقة الجبر والهندسة الفراغية — صفحة 127 ↗</a>
          <a href="${MATH_2023_ANSWER_URL}#page=83" target="_blank" rel="noopener noreferrer">مفاتيح إجابة الوزارة — الاستاتيكا ↗</a>
          <a href="${MATH_2023_ANSWER_URL}#page=98" target="_blank" rel="noopener noreferrer">مفاتيح إجابة الوزارة — الديناميكا ↗</a>
          <a href="${MATH_2023_ANSWER_URL}#page=113" target="_blank" rel="noopener noreferrer">مفاتيح إجابة الوزارة — التفاضل والتكامل ↗</a>
          <a href="${MATH_2023_ANSWER_URL}#page=128" target="_blank" rel="noopener noreferrer">مفاتيح إجابة الوزارة — الجبر والهندسة الفراغية ↗</a>
        </div>
        <div id="pastExamMathQuiz"></div>
      </section>
      <div class="past-exam-results-head"><div><h3>مراجع الكتب الخارجية</h3><span class="hint">روابط تعريفية لمحتوى الكتب — لا نستضيف نسخًا محمية</span></div></div>
      <div id="pastExamBookSources" class="past-exam-results"></div>
      <div class="panel past-exam-note">
        <h3>كيف نضمن دقة الأرشيف؟</h3>
        <ul>
          <li>لن يُصنّف أي ملف على أنه رسمي إلا بعد التحقق من مصدر وزارة التربية والتعليم.</li>
          <li>سنفصل الدور الأول عن الدور الثاني، ونماذج الأسئلة عن نماذج الإجابة.</li>
          <li>امتحانات المحافظات والنماذج الاسترشادية ستظهر بتصنيف واضح، لا كأنها امتحانات وزارة.</li>
          <li>السنوات التي لم تتوفر لها ملفات موثقة ستظل معلّمة بأنها قيد الاستكمال.</li>
        </ul>
        <a href="https://moe.gov.eg/" target="_blank" rel="noopener noreferrer">الموقع الرسمي لوزارة التربية والتعليم المصرية</a>
      </div>`;

    const controls = ['pastExamSystem', 'pastExamYear', 'pastExamSubject', 'pastExamType', 'pastExamSearch']
      .map(id => document.getElementById(id));
    controls.forEach(control => control.addEventListener('input', render));
    render();
    renderBookSources();
    renderArabicInteractiveExam();
    renderChemistryInteractiveExam();
    renderPhysicsInteractiveExam();
    renderBiologyInteractiveExam();
    renderMath2023InteractiveExam();
    renderEnglish2023InteractiveExam();

    function renderBookSources() {
      const container = document.getElementById('pastExamBookSources');
      if (!container) return;
      const cards = BOOK_SOURCES.map(source => `
        <article class="past-exam-card">
          <div class="past-exam-card-top"><span>${escapeHTML(source.publisher)} · ${escapeHTML(source.classification)}</span></div>
          <h3>${escapeHTML(source.subject)}</h3>
          <p><strong>${escapeHTML(source.book)}</strong></p>
          <p>${escapeHTML(source.coverage)}</p>
          <p class="hint"><strong>تفاصيل الفهرس:</strong> ${escapeHTML(source.indexDetail)}</p>
          <div class="past-exam-card-meta"><span>مرجع خارجي — طبعة 2026</span><a href="${escapeHTML(source.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHTML(source.sourceLabel)} ↗</a></div>
        </article>`).join('');
      const pending = BOOK_SOURCE_PENDING.map(item => `
        <article class="past-exam-card">
          <div class="past-exam-card-top"><span>قيد التحقق</span></div>
          <h3>${escapeHTML(item.subject)}</h3>
          <p>${escapeHTML(item.note)}</p>
        </article>`).join('');
      container.innerHTML = cards + pending;
    }

    function renderArabicInteractiveExam() {
      const host = document.getElementById('pastExamArabicQuiz');
      if (!host) return;
      host.innerHTML = '<label class="past-exam-model-picker">اختر نموذج الإجابة: <select id="pastExamArabicModel"><option value="أ">النموذج أ</option><option value="ب">النموذج ب</option><option value="ج">النموذج ج</option><option value="د">النموذج د</option></select></label><button class="p past-exam-quiz-start" type="button" id="pastExamArabicStart">ابدأ تسجيل الإجابات</button><p class="hint">51 سؤالًا موضوعيًا · 4 اختيارات لكل سؤال · مفاتيح النماذج الأربعة من الوزارة</p>';
      host.querySelector('#pastExamArabicStart').addEventListener('click', () => {
        const model = host.querySelector('#pastExamArabicModel').value;
        const answerKey = ARABIC_2023_MODEL_KEYS[model];
        const choices = ['أ','ب','ج','د'];
        host.innerHTML = '<div class="past-exam-quiz-toolbar"><b>ورقة الإجابة — النموذج ' + model + '</b><span id="pastExamArabicProgress">تمت الإجابة عن 0 من 51</span></div>' +
          '<div class="past-exam-answer-grid">' + answerKey.map((_, index) =>
            '<label class="past-exam-answer-cell"><span>سؤال ' + (index + 1) + '</span><select aria-label="إجابة السؤال ' + (index + 1) + '" data-answer="' + index + '"><option value="">—</option>' +
            choices.map(choice => '<option value="' + choice + '">' + choice + '</option>').join('') + '</select></label>'
          ).join('') + '</div><button class="p past-exam-quiz-submit" type="button" id="pastExamArabicSubmit">تصحيح الإجابات</button>';
        const selects = Array.from(host.querySelectorAll('[data-answer]'));
        const updateProgress = () => {
          const count = selects.filter(select => select.value).length;
          host.querySelector('#pastExamArabicProgress').textContent = 'تمت الإجابة عن ' + count + ' من 51';
        };
        selects.forEach(select => select.addEventListener('change', updateProgress));
        host.querySelector('#pastExamArabicSubmit').addEventListener('click', () => {
          const answers = selects.map(select => select.value);
          const answered = answers.filter(Boolean).length;
          const correct = answers.reduce((sum, answer, index) => sum + (answer === answerKey[index] || answerKey[index].split('|').includes(answer) ? 1 : 0), 0);
          const wrong = answered - correct;
          const percent = Math.round(correct / answerKey.length * 100);
          host.innerHTML = '<div class="past-exam-quiz-result"><strong>' + percent + '%</strong><h4>نتيجتك: ' + correct + ' من 51</h4><p>إجابات صحيحة: ' + correct + ' · خاطئة: ' + wrong + ' · بدون إجابة: ' + (51 - answered) + '</p><p class="hint">هذه نتيجة عدد الإجابات الصحيحة من 51 سؤالًا موضوعيًا، وليست الدرجة الرسمية من 80؛ لا تشمل الأسئلة المقالية أو توزيع درجات كل سؤال.</p><button class="p" type="button" id="pastExamArabicRetry">إعادة المحاولة</button></div>' +
            '<details class="past-exam-key-review"><summary>مراجعة مفتاح الإجابة الرسمي للنموذج ' + model + '</summary><div class="past-exam-key-grid">' +
            answerKey.map((answer, index) => '<span class="' + (answers[index] === answer ? 'is-correct' : 'is-wrong') + '">س' + (index + 1) + ': ' + answer + (answers[index] ? (answers[index] === answer ? ' ✓' : ' · إجابتك ' + answers[index]) : ' · لم تجب') + '</span>').join('') +
            '</div></details>';
          host.querySelector('#pastExamArabicRetry').addEventListener('click', renderArabicInteractiveExam);
        });
      });
    }

    function renderChemistryInteractiveExam() {
      const host = document.getElementById('pastExamChemistryQuiz');
      if (!host) return;
      host.innerHTML = '<label class="past-exam-model-picker">اختر نموذج الامتحان: <select id="pastExamChemistryModel"><option value="أ">النموذج أ</option><option value="ب">النموذج ب</option><option value="ج">النموذج ج</option><option value="د">النموذج د</option></select></label><button class="p past-exam-quiz-start" type="button" id="pastExamChemistryStart">ابدأ تسجيل الإجابات</button><p class="hint">44 سؤالًا موضوعيًا · الدرجة القصوى للأسئلة الموضوعية 56 · مفاتيح النماذج الأربعة من الوزارة</p>';
      host.querySelector('#pastExamChemistryStart').addEventListener('click', () => {
        const model = host.querySelector('#pastExamChemistryModel').value;
        const answerKey = CHEMISTRY_2023_MODEL_KEYS[model];
        const choices = ['أ','ب','ج','د'];
        host.innerHTML = '<div class="past-exam-quiz-toolbar"><b>ورقة إجابة الكيمياء — النموذج ' + model + '</b><span id="pastExamChemistryProgress">تمت الإجابة عن 0 من 44</span></div>' +
          '<div class="past-exam-answer-grid">' + answerKey.map((_, index) =>
            '<label class="past-exam-answer-cell"><span>سؤال ' + (index + 1) + (CHEMISTRY_2023_WEIGHTS[index] === 2 ? ' · درجتان' : ' · درجة') + '</span><select aria-label="إجابة السؤال ' + (index + 1) + '" data-chem-answer="' + index + '"><option value="">—</option>' +
            choices.map(choice => '<option value="' + choice + '">' + choice + '</option>').join('') + '</select></label>'
          ).join('') + '</div><button class="p past-exam-quiz-submit" type="button" id="pastExamChemistrySubmit">تصحيح الإجابات</button>';
        const selects = Array.from(host.querySelectorAll('[data-chem-answer]'));
        const updateProgress = () => {
          const count = selects.filter(select => select.value).length;
          host.querySelector('#pastExamChemistryProgress').textContent = 'تمت الإجابة عن ' + count + ' من 44';
        };
        selects.forEach(select => select.addEventListener('change', updateProgress));
        host.querySelector('#pastExamChemistrySubmit').addEventListener('click', () => {
          const answers = selects.map(select => select.value);
          const answered = answers.filter(Boolean).length;
          const score = answers.reduce((sum, answer, index) => sum + (answer === answerKey[index] ? CHEMISTRY_2023_WEIGHTS[index] : 0), 0);
          const maxScore = CHEMISTRY_2023_WEIGHTS.reduce((sum, weight) => sum + weight, 0);
          const correct = answers.reduce((sum, answer, index) => sum + (answer === answerKey[index] || answerKey[index].split('|').includes(answer) ? 1 : 0), 0);
          const wrong = answered - correct;
          const percent = Math.round(score / maxScore * 100);
          host.innerHTML = '<div class="past-exam-quiz-result"><strong>' + percent + '%</strong><h4>درجتك: ' + score + ' من ' + maxScore + '</h4><p>إجابات صحيحة: ' + correct + ' · خاطئة: ' + wrong + ' · بدون إجابة: ' + (44 - answered) + '</p><p class="hint">هذه نتيجة الأسئلة الموضوعية فقط من 56 درجة. لا تشمل السؤالين المقاليين (45 و46)، والدرجة الكلية الرسمية للمادة 60 درجة.</p><button class="p" type="button" id="pastExamChemistryRetry">إعادة المحاولة</button></div>' +
            '<details class="past-exam-key-review"><summary>مراجعة مفتاح الإجابة الرسمي للنموذج ' + model + '</summary><div class="past-exam-key-grid">' +
            answerKey.map((answer, index) => '<span class="' + (answers[index] === answer ? 'is-correct' : 'is-wrong') + '">س' + (index + 1) + ': ' + answer + ' (' + CHEMISTRY_2023_WEIGHTS[index] + ' د)' + (answers[index] ? (answers[index] === answer ? ' ✓' : ' · إجابتك ' + answers[index]) : ' · لم تجب') + '</span>').join('') +
            '</div></details>';
          host.querySelector('#pastExamChemistryRetry').addEventListener('click', renderChemistryInteractiveExam);
        });
      });
    }

    function renderPhysicsInteractiveExam() {
      const host = document.getElementById('pastExamPhysicsQuiz');
      if (!host) return;
      host.innerHTML = '<label class="past-exam-model-picker">اختر نموذج الامتحان: <select id="pastExamPhysicsModel"><option value="أ">النموذج أ</option><option value="ب">النموذج ب</option><option value="ج">النموذج ج</option><option value="د">النموذج د</option></select></label><button class="p past-exam-quiz-start" type="button" id="pastExamPhysicsStart">ابدأ تسجيل الإجابات</button><p class="hint">44 سؤالًا موضوعيًا · الدرجة القصوى للأسئلة الموضوعية 56 · مفاتيح النماذج الأربعة من الوزارة</p>';
      host.querySelector('#pastExamPhysicsStart').addEventListener('click', () => {
        const model = host.querySelector('#pastExamPhysicsModel').value;
        const answerKey = PHYSICS_2023_MODEL_KEYS[model];
        const choices = ['أ','ب','ج','د','جميع الإجابات صحيحة'];
        host.innerHTML = '<div class="past-exam-quiz-toolbar"><b>ورقة إجابة الفيزياء — النموذج ' + model + '</b><span id="pastExamPhysicsProgress">تمت الإجابة عن 0 من 44</span></div>' +
          '<div class="past-exam-answer-grid">' + answerKey.map((_, index) =>
            '<label class="past-exam-answer-cell"><span>سؤال ' + (index + 1) + (PHYSICS_2023_WEIGHTS[index] === 2 ? ' · درجتان' : ' · درجة') + '</span><select aria-label="إجابة السؤال ' + (index + 1) + '" data-physics-answer="' + index + '"><option value="">—</option>' +
            choices.map(choice => '<option value="' + choice + '">' + choice + '</option>').join('') + '</select></label>'
          ).join('') + '</div><button class="p past-exam-quiz-submit" type="button" id="pastExamPhysicsSubmit">تصحيح الإجابات</button>';
        const selects = Array.from(host.querySelectorAll('[data-physics-answer]'));
        const updateProgress = () => {
          const count = selects.filter(select => select.value).length;
          host.querySelector('#pastExamPhysicsProgress').textContent = 'تمت الإجابة عن ' + count + ' من 44';
        };
        selects.forEach(select => select.addEventListener('change', updateProgress));
        host.querySelector('#pastExamPhysicsSubmit').addEventListener('click', () => {
          const answers = selects.map(select => select.value);
          const answered = answers.filter(Boolean).length;
          const score = answers.reduce((sum, answer, index) => sum + (answer === answerKey[index] || answerKey[index].split('|').includes(answer) ? PHYSICS_2023_WEIGHTS[index] : 0), 0);
          const maxScore = PHYSICS_2023_WEIGHTS.reduce((sum, weight) => sum + weight, 0);
          const correct = answers.reduce((sum, answer, index) => sum + (answer === answerKey[index] || answerKey[index].split('|').includes(answer) ? 1 : 0), 0);
          const wrong = answered - correct;
          const percent = Math.round(score / maxScore * 100);
          host.innerHTML = '<div class="past-exam-quiz-result"><strong>' + percent + '%</strong><h4>درجتك: ' + score + ' من ' + maxScore + '</h4><p>إجابات صحيحة: ' + correct + ' · خاطئة: ' + wrong + ' · بدون إجابة: ' + (44 - answered) + '</p><p class="hint">هذه نتيجة الأسئلة الموضوعية فقط من 56 درجة. لا تشمل السؤالين المقاليين (45 و46)، والدرجة الكلية الرسمية للمادة 60 درجة.</p><button class="p" type="button" id="pastExamPhysicsRetry">إعادة المحاولة</button></div>' +
            '<details class="past-exam-key-review"><summary>مراجعة مفتاح الإجابة الرسمي للنموذج ' + model + '</summary><div class="past-exam-key-grid">' +
            answerKey.map((answer, index) => '<span class="' + (answers[index] === answer || answer.split('|').includes(answers[index]) ? 'is-correct' : 'is-wrong') + '">س' + (index + 1) + ': ' + answer.replace('|', ' أو ') + ' (' + PHYSICS_2023_WEIGHTS[index] + ' د)' + (answers[index] ? (answers[index] === answer ? ' ✓' : ' · إجابتك ' + answers[index]) : ' · لم تجب') + '</span>').join('') +
            '</div></details>';
          host.querySelector('#pastExamPhysicsRetry').addEventListener('click', renderPhysicsInteractiveExam);
        });
      });
    }

    function renderBiologyInteractiveExam() {
      const host = document.getElementById('pastExamBiologyQuiz');
      if (!host) return;
      host.innerHTML = '<label class="past-exam-model-picker">اختر نموذج الامتحان: <select id="pastExamBiologyModel"><option value="أ">النموذج أ</option><option value="ب">النموذج ب</option><option value="ج">النموذج ج</option><option value="د">النموذج د</option></select></label><button class="p past-exam-quiz-start" type="button" id="pastExamBiologyStart">ابدأ تسجيل الإجابات</button><p class="hint">44 سؤالًا موضوعيًا · الدرجة القصوى 56 · مفاتيح النماذج الأربعة من الوزارة</p>';
      host.querySelector('#pastExamBiologyStart').addEventListener('click', () => {
        const model = host.querySelector('#pastExamBiologyModel').value;
        const answerKey = BIOLOGY_2023_MODEL_KEYS[model];
        const choices = ['أ','ب','ج','د'];
        host.innerHTML = '<div class="past-exam-quiz-toolbar"><b>ورقة إجابة الأحياء — النموذج ' + model + '</b><span id="pastExamBiologyProgress">تمت الإجابة عن 0 من 44</span></div>' +
          '<div class="past-exam-answer-grid">' + answerKey.map((_, index) =>
            '<label class="past-exam-answer-cell"><span>سؤال ' + (index + 1) + (BIOLOGY_2023_WEIGHTS[index] === 2 ? ' · درجتان' : ' · درجة') + '</span><select aria-label="إجابة السؤال ' + (index + 1) + '" data-biology-answer="' + index + '"><option value="">—</option>' +
            choices.map(choice => '<option value="' + choice + '">' + choice + '</option>').join('') + '</select></label>'
          ).join('') + '</div><button class="p past-exam-quiz-submit" type="button" id="pastExamBiologySubmit">تصحيح الإجابات</button>';
        const selects = Array.from(host.querySelectorAll('[data-biology-answer]'));
        const updateProgress = () => {
          const count = selects.filter(select => select.value).length;
          host.querySelector('#pastExamBiologyProgress').textContent = 'تمت الإجابة عن ' + count + ' من 44';
        };
        selects.forEach(select => select.addEventListener('change', updateProgress));
        host.querySelector('#pastExamBiologySubmit').addEventListener('click', () => {
          const answers = selects.map(select => select.value);
          const answered = answers.filter(Boolean).length;
          const correct = answers.reduce((sum, answer, index) => sum + (answer === answerKey[index] ? 1 : 0), 0);
          const score = answers.reduce((sum, answer, index) => sum + (answer === answerKey[index] ? BIOLOGY_2023_WEIGHTS[index] : 0), 0);
          const maxScore = BIOLOGY_2023_WEIGHTS.reduce((sum, weight) => sum + weight, 0);
          const percent = Math.round(score / maxScore * 100);
          host.innerHTML = '<div class="past-exam-quiz-result"><strong>' + percent + '%</strong><h4>درجتك: ' + score + ' من ' + maxScore + '</h4><p>إجابات صحيحة: ' + correct + ' · خاطئة: ' + (answered - correct) + ' · بدون إجابة: ' + (44 - answered) + '</p><p class="hint">النتيجة للأسئلة الموضوعية فقط من 56 درجة. لا تشمل السؤالين المقاليين (45 و46)، والدرجة الكلية الرسمية للمادة 60 درجة.</p><button class="p" type="button" id="pastExamBiologyRetry">إعادة المحاولة</button></div>' +
            '<details class="past-exam-key-review"><summary>مراجعة مفتاح الإجابة الرسمي للنموذج ' + model + '</summary><div class="past-exam-key-grid">' +
            answerKey.map((answer, index) => '<span class="' + (answers[index] === answer ? 'is-correct' : 'is-wrong') + '">س' + (index + 1) + ': ' + answer + ' (' + BIOLOGY_2023_WEIGHTS[index] + ' د)' + (answers[index] ? (answers[index] === answer ? ' ✓' : ' · إجابتك ' + answers[index]) : ' · لم تجب') + '</span>').join('') +
            '</div></details>';
          host.querySelector('#pastExamBiologyRetry').addEventListener('click', renderBiologyInteractiveExam);
        });
      });
    }

    function renderEnglish2023InteractiveExam() {
      const host = document.getElementById('pastExamEnglishQuiz');
      if (!host) return;
      const subjectOptions = Object.entries(ENGLISH_2023_KEYS).map(([id, subject]) =>
        '<option value="' + id + '">' + subject.label + '</option>').join('');
      host.innerHTML = '<div class="past-exam-model-picker"><label>المادة: <select id="pastExamEnglishSubject">' + subjectOptions + '</select></label> <label>النموذج: <select id="pastExamEnglishModel"><option value="A">النموذج A</option><option value="B">النموذج B</option><option value="C">النموذج C</option><option value="D">النموذج D</option></select></label></div><button class="p past-exam-quiz-start" type="button" id="pastExamEnglishStart">ابدأ حل الامتحان</button><p class="hint">اختر اللغة الأولى أو الثانية، ثم نموذج A أو B أو C أو D. التصحيح الآلي للأسئلة الموضوعية فقط.</p>';
      host.querySelector('#pastExamEnglishStart').addEventListener('click', () => {
        const subjectId = host.querySelector('#pastExamEnglishSubject').value;
        const subject = ENGLISH_2023_KEYS[subjectId];
        const model = host.querySelector('#pastExamEnglishModel').value;
        const answerKey = subject.models[model];
        const autoIndexes = answerKey.map((answer, index) => answer.includes('|') ? -1 : index).filter(index => index >= 0);
        const maxScore = autoIndexes.reduce((sum, index) => sum + subject.weights[index], 0);
        host.innerHTML = '<div class="past-exam-quiz-toolbar"><b>' + subject.label + ' — النموذج ' + model + '</b><span id="pastExamEnglishProgress">تمت الإجابة عن 0 من ' + autoIndexes.length + '</span></div>' +
          '<div class="past-exam-answer-grid">' + answerKey.map((answer, index) => {
            if (answer.includes('|')) return '<div class="past-exam-answer-cell"><span>سؤال ' + (index + 1) + ' · إجابة متعددة</span><p class="hint">مستبعد من التصحيح الآلي — مفتاح الوزارة يتطلب اختيار إجابتين: ' + answer.replace('|', ' و ') + '</p></div>';
            return '<label class="past-exam-answer-cell"><span>سؤال ' + (index + 1) + (subject.weights[index] === 2 ? ' · درجتان' : ' · درجة') + '</span><select aria-label="إجابة السؤال ' + (index + 1) + '" data-english-answer="' + index + '"><option value="">—</option>' +
              ['A','B','C','D'].map(choice => '<option value="' + choice + '">' + choice + '</option>').join('') + '</select></label>';
          }).join('') + '</div><button class="p past-exam-quiz-submit" type="button" id="pastExamEnglishSubmit">تصحيح الإجابات</button>';
        const selects = Array.from(host.querySelectorAll('[data-english-answer]'));
        const updateProgress = () => {
          const count = selects.filter(select => select.value).length;
          host.querySelector('#pastExamEnglishProgress').textContent = 'تمت الإجابة عن ' + count + ' من ' + autoIndexes.length;
        };
        selects.forEach(select => select.addEventListener('change', updateProgress));
        host.querySelector('#pastExamEnglishSubmit').addEventListener('click', () => {
          const answers = answerKey.map((answer, index) => answer.includes('|') ? null : (host.querySelector('[data-english-answer="' + index + '"]')?.value || ''));
          const answered = answers.filter(Boolean).length;
          const correct = autoIndexes.filter(index => answers[index] === answerKey[index]).length;
          const score = autoIndexes.reduce((sum, index) => sum + (answers[index] === answerKey[index] ? subject.weights[index] : 0), 0);
          const percent = Math.round(score / maxScore * 100);
          const excluded = answerKey.filter(answer => answer.includes('|')).length;
          const essayStart = subject.questionCount + 1;
          host.innerHTML = '<div class="past-exam-quiz-result"><strong>' + percent + '%</strong><h4>درجتك: ' + score + ' من ' + maxScore + '</h4><p>إجابات صحيحة: ' + correct + ' · خاطئة: ' + (answered - correct) + ' · بدون إجابة: ' + (autoIndexes.length - answered) + '</p><p class="hint">هذه نتيجة الأسئلة الموضوعية التي يمكن تصحيحها آليًا فقط. الدرجة الكلية الرسمية للمادة: ' + subject.officialTotal + '. ' + (excluded ? 'تم استبعاد سؤال اختيار متعدد يتطلب إجابتين من التصحيح الآلي. ' : '') + 'الأسئلة المقالية من ' + essayStart + ' إلى ' + subject.questionCount + ' خارج التصحيح الآلي.</p><button class="p" type="button" id="pastExamEnglishRetry">إعادة المحاولة</button></div>' +
            '<details class="past-exam-key-review"><summary>مراجعة مفتاح الوزارة — ' + subject.label + '، النموذج ' + model + '</summary><div class="past-exam-key-grid">' +
            answerKey.map((answer, index) => '<span class="' + (answer.includes('|') ? '' : (answers[index] === answer ? 'is-correct' : 'is-wrong')) + '">س' + (index + 1) + ': ' + answer.replace('|', ' + ') + (answer.includes('|') ? ' · مراجعة يدوية' : ' (' + subject.weights[index] + ' د)' + (answers[index] ? (answers[index] === answer ? ' ✓' : ' · إجابتك ' + answers[index]) : ' · لم تجب')) + '</span>').join('') +
            '</div></details>';
          host.querySelector('#pastExamEnglishRetry').addEventListener('click', renderEnglish2023InteractiveExam);
        });
      });
    }

    function renderMath2023InteractiveExam() {
      const host = document.getElementById('pastExamMathQuiz');
      if (!host) return;
      const branches = Object.entries(MATH_2023_KEYS);
      const branchOptions = branches.map(([id, branch]) => '<option value="' + id + '">' + branch.label + '</option>').join('');
      host.innerHTML = '<div class="past-exam-model-picker"><label>فرع الرياضيات: <select id="pastExamMathBranch">' + branchOptions + '</select></label> <label>نموذج الامتحان: <select id="pastExamMathModel"><option value="أ">النموذج أ</option><option value="ب">النموذج ب</option><option value="ج">النموذج ج</option><option value="د">النموذج د</option></select></label></div><button class="p past-exam-quiz-start" type="button" id="pastExamMathStart">ابدأ تسجيل الإجابات</button><p class="hint">18 سؤالًا موضوعيًا · الدرجة القصوى 26 · سؤالان مقاليان خارج التصحيح الآلي</p>';
      host.querySelector('#pastExamMathStart').addEventListener('click', () => {
        const branchId = host.querySelector('#pastExamMathBranch').value;
        const branch = MATH_2023_KEYS[branchId];
        const model = host.querySelector('#pastExamMathModel').value;
        const answerKey = branch.models[model];
        host.innerHTML = '<div class="past-exam-quiz-toolbar"><b>' + branch.label + ' — النموذج ' + model + '</b><span id="pastExamMathProgress">تمت الإجابة عن 0 من 18</span></div>' +
          '<div class="past-exam-answer-grid">' + answerKey.map((_, index) =>
            '<label class="past-exam-answer-cell"><span>سؤال ' + (index + 1) + (MATH_2023_WEIGHTS[index] === 2 ? ' · درجتان' : ' · درجة') + '</span><select aria-label="إجابة السؤال ' + (index + 1) + '" data-math-answer="' + index + '"><option value="">—</option>' +
            ['أ','ب','ج','د'].map(choice => '<option value="' + choice + '">' + choice + '</option>').join('') + '</select></label>'
          ).join('') + '</div><button class="p past-exam-quiz-submit" type="button" id="pastExamMathSubmit">تصحيح الإجابات</button>';
        const selects = Array.from(host.querySelectorAll('[data-math-answer]'));
        const updateProgress = () => {
          const count = selects.filter(select => select.value).length;
          host.querySelector('#pastExamMathProgress').textContent = 'تمت الإجابة عن ' + count + ' من 18';
        };
        selects.forEach(select => select.addEventListener('change', updateProgress));
        host.querySelector('#pastExamMathSubmit').addEventListener('click', () => {
          const answers = selects.map(select => select.value);
          const answered = answers.filter(Boolean).length;
          const correct = answers.reduce((sum, answer, index) => sum + (answer === answerKey[index] ? 1 : 0), 0);
          const score = answers.reduce((sum, answer, index) => sum + (answer === answerKey[index] ? MATH_2023_WEIGHTS[index] : 0), 0);
          const maxScore = MATH_2023_WEIGHTS.reduce((sum, weight) => sum + weight, 0);
          const percent = Math.round(score / maxScore * 100);
          host.innerHTML = '<div class="past-exam-quiz-result"><strong>' + percent + '%</strong><h4>درجتك: ' + score + ' من ' + maxScore + '</h4><p>إجابات صحيحة: ' + correct + ' · خاطئة: ' + (answered - correct) + ' · بدون إجابة: ' + (18 - answered) + '</p><p class="hint">النتيجة للأسئلة الموضوعية فقط من 26 درجة. لا تشمل السؤالين المقاليين (19 و20)، والدرجة الكلية الرسمية لهذا الفرع 30 درجة.</p><button class="p" type="button" id="pastExamMathRetry">إعادة المحاولة</button></div>' +
            '<details class="past-exam-key-review"><summary>مراجعة مفتاح الإجابة الرسمي — ' + branch.label + '، النموذج ' + model + '</summary><div class="past-exam-key-grid">' +
            answerKey.map((answer, index) => '<span class="' + (answers[index] === answer ? 'is-correct' : 'is-wrong') + '">س' + (index + 1) + ': ' + answer + ' (' + MATH_2023_WEIGHTS[index] + ' د)' + (answers[index] ? (answers[index] === answer ? ' ✓' : ' · إجابتك ' + answers[index]) : ' · لم تجب') + '</span>').join('') +
            '</div></details>';
          host.querySelector('#pastExamMathRetry').addEventListener('click', renderMath2023InteractiveExam);
        });
      });
    }

    function render() {
      const [system, year, subject, type, search] = controls.map(control => control.value.trim().toLowerCase());
      const filtered = EXAMS.filter(exam =>
        (system === 'all' || exam.system === system) &&
        (year === 'all' || exam.year === year) &&
        (subject === 'all' || exam.subject === controls[2].value) &&
        (type === 'all' || exam.type === type) &&
        (!search || [exam.year, exam.subject, exam.round, exam.title, exam.systemLabel, exam.typeLabel].join(' ').toLowerCase().includes(search))
      );
      document.getElementById('pastExamCount').textContent = `${filtered.length} ملف موثق من أصل ${EXAMS.length}`;
      const results = document.getElementById('pastExamResults');
      if (!filtered.length) {
        results.innerHTML = `
          <div class="past-exam-empty">
            <span aria-hidden="true">📚</span>
            <h3>الأرشيف قيد التجهيز</h3>
            <p>${EXAMS.length ? 'لا توجد ملفات تطابق خيارات البحث الحالية. ما زالت بقية السنوات والمواد قيد الجمع والتحقق.' : 'لم نضف ملفات بعد. سنضيف كل امتحان بعد التحقق من الملف ومصدره الرسمي، ولن نعرض روابط تجريبية أو ملفات غير مؤكدة.'}</p>
            <small>الفلاتر جاهزة — محتوى الامتحانات سيُضاف على مراحل.</small>
          </div>`;
        return;
      }
      results.innerHTML = filtered.map(exam => `
        <article class="past-exam-card">
          <div class="past-exam-card-top"><span>${escapeHTML(exam.typeLabel)}</span><b>${escapeHTML(exam.year)}</b></div>
          <h3>${escapeHTML(exam.subject)}</h3>
          <p>${escapeHTML(exam.title)} · ${escapeHTML(exam.round)}</p>
          <div class="past-exam-card-meta"><span>${escapeHTML(exam.systemLabel)}</span><a href="${escapeHTML(exam.pdfUrl + (exam.pdfPage ? "#page=" + exam.pdfPage : ""))}" target="_blank" rel="noopener noreferrer">${escapeHTML(exam.fileLabel || "فتح الملف")} ↗</a></div>
          ${exam.answerUrl ? `<a class="past-exam-answer" href="${escapeHTML(exam.answerUrl)}" target="_blank" rel="noopener noreferrer">نموذج الإجابة ↗</a>` : ''}
        </article>`).join('');
    }
  }

  window.StudyPastExamArchive = { init, years: YEARS.slice(), subjects: SUBJECTS.slice() };
})();
