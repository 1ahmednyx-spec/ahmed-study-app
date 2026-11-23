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
}
];

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
