(function(){
'use strict';

// V63.6 Dependency Container — application code consumes stable service contracts.
var WW=window.WWDI?WWDI.create():{};
if(!WW.ready) console.warn('White Wolf: dependency container incomplete; compatibility mode active.');
var WWPersistence=WW.persistence||window.WWCorePersistence;
var WWEvents=WW.events||window.WWEventBus;

// UI icon service is loaded before the core app module.
var wwSvgIcon=window.WWIcons.svgIcon;
var wwUpgradeIcons=window.WWIcons.upgradeIcons;

//  MASTER APCE
// ============================================================
var MASTER_SUBJECTS = [
  {id:'s1',code:'CHM-101',name:'Spectroscopie moléculaire',semester:'S1',credits:5},
  {id:'s2',code:'CHM-102',name:'Spectroscopie atomique',semester:'S1',credits:4},
  {id:'s3',code:'CHM-103',name:'Chimie analytique',semester:'S1',credits:6},
  {id:'s4',code:'CHM-104',name:'Séparation et analyse chromatographique',semester:'S1',credits:5},
  {id:'s5',code:'CHM-105',name:'Méthodes d\'analyse des solides',semester:'S1',credits:4},
  {id:'s6',code:'QAL-101',name:'Normes et qualité',semester:'S1',credits:3},
  {id:'s7',code:'HSE-101',name:'Hygiène, sécurité et qualité',semester:'S1',credits:3},
  {id:'s8',code:'GEN-101',name:'Génie chimique',semester:'S1',credits:5},
  {id:'s9',code:'ENE-101',name:'Efficacité énergétique',semester:'S1',credits:4}
];

var TOPICS_SEED = [
  {id:'s1_1',subject_id:'s1',title:'UV/Visible'},
  {id:'s1_2',subject_id:'s1',title:'Spectroscopie infrarouge (IR)'},
  {id:'s1_3',subject_id:'s1',title:'RMN du proton (1H NMR)'},
  {id:'s1_4',subject_id:'s1',title:'RMN du carbone 13 (13C NMR)'},
  {id:'s1_5',subject_id:'s1',title:'Spectroscopie d\'absorption atomique'},
  {id:'s1_6',subject_id:'s1',title:'Spectroscopie d\'émission atomique'},
  {id:'s1_7',subject_id:'s1',title:'Complémentarité des techniques'},
  {id:'s1_8',subject_id:'s1',title:'Élucidation des structures'},
  {id:'s2_1',subject_id:'s2',title:'AAS avec flamme'},
  {id:'s2_2',subject_id:'s2',title:'Perturbations/interférences'},
  {id:'s2_3',subject_id:'s2',title:'AAS électrothermique'},
  {id:'s2_4',subject_id:'s2',title:'Génération d\'hydrures'},
  {id:'s2_5',subject_id:'s2',title:'Émission atomique flamme'},
  {id:'s2_6',subject_id:'s2',title:'Émission atomique plasma'},
  {id:'s2_7',subject_id:'s2',title:'Applications — Normes ISO'},
  {id:'s3_1',subject_id:'s3',title:'Introduction et statistiques'},
  {id:'s3_2',subject_id:'s3',title:'Échantillonnage'},
  {id:'s3_3',subject_id:'s3',title:'Chimie en solution aqueuse'},
  {id:'s3_4',subject_id:'s3',title:'Méthodes titrimétriques'},
  {id:'s3_5',subject_id:'s3',title:'Titrages acido-basiques'},
  {id:'s3_6',subject_id:'s3',title:'Titrages par précipitation'},
  {id:'s3_7',subject_id:'s3',title:'Titrages complexométriques'},
  {id:'s3_8',subject_id:'s3',title:'Titrages d\'oxydoréduction'},
  {id:'s3_9',subject_id:'s3',title:'Méthodes gravimétriques'},
  {id:'s4_1',subject_id:'s4',title:'Chromatographie liquide'},
  {id:'s4_2',subject_id:'s4',title:'Types de chromatographie'},
  {id:'s4_3',subject_id:'s4',title:'Équipements et détecteurs'},
  {id:'s4_4',subject_id:'s4',title:'Optimisation des conditions'},
  {id:'s4_5',subject_id:'s4',title:'Chromatographie en phase gazeuse'},
  {id:'s4_6',subject_id:'s4',title:'Électrophorèse capillaire'},
  {id:'s4_7',subject_id:'s4',title:'Couplage LC/MS'},
  {id:'s5_1',subject_id:'s5',title:'Microscopie électronique'},
  {id:'s5_2',subject_id:'s5',title:'Diffraction X sur poudres'},
  {id:'s5_3',subject_id:'s5',title:'Taille moyenne Debye-Scherrer'},
  {id:'s5_4',subject_id:'s5',title:'Analyse qualitative des éléments'},
  {id:'s5_5',subject_id:'s5',title:'Analyse thermique ATG et ATD'},
  {id:'s5_6',subject_id:'s5',title:'Couplage ATG-CPG-MS'},
  {id:'s5_7',subject_id:'s5',title:'Analyse mécanique composites'},
  {id:'s6_1',subject_id:'s6',title:'Standards et Normes'},
  {id:'s6_2',subject_id:'s6',title:'Management de la qualité'},
  {id:'s7_1',subject_id:'s7',title:'Gestion des risques industriels'},
  {id:'s7_2',subject_id:'s7',title:'Prévention et gestion opérationnelle'},
  {id:'s7_3',subject_id:'s7',title:'Réglementation industrielle'},
  {id:'s7_4',subject_id:'s7',title:'Risques d\'incendie'},
  {id:'s7_5',subject_id:'s7',title:'Hygiène et environnement'},
  {id:'s8_1',subject_id:'s8',title:'Bilans matière et chaleur'},
  {id:'s8_2',subject_id:'s8',title:'Mécanique des fluides'},
  {id:'s8_3',subject_id:'s8',title:'Régimes laminaire turbulent'},
  {id:'s8_4',subject_id:'s8',title:'Lits fixes et fluidisés'},
  {id:'s8_5',subject_id:'s8',title:'Transfert thermique'},
  {id:'s8_6',subject_id:'s8',title:'Transfert de matière'},
  {id:'s9_1',subject_id:'s9',title:'Concept d\'énergie'},
  {id:'s9_2',subject_id:'s9',title:'Sources d\'énergie'},
  {id:'s9_3',subject_id:'s9',title:'Transformation industrielle'},
  {id:'s9_4',subject_id:'s9',title:'Équipements industriels'},
  {id:'s9_5',subject_id:'s9',title:'Efficacité énergétique papier'}
];

var PROGRAMMING_TOPICS = [
  {id:'web1',domain:'Frontend',icon:'🌐',title:'HTML5 (Structure & Sémantique)',learn:['Structure de base','Balises sémantiques','Formulaires','Accessibilité'],video:{title:'HTML5',url:'https://www.youtube.com/results?search_query=html5+course',channel:'Traversy Media'}},
  {id:'web2',domain:'Frontend',icon:'🌐',title:'CSS3 (Flexbox, Grid)',learn:['Sélecteurs','Flexbox','CSS Grid','Media queries'],video:{title:'CSS',url:'https://www.youtube.com/results?search_query=css+course',channel:'freeCodeCamp'}},
  {id:'web3',domain:'Frontend',icon:'🌐',title:'JavaScript (ES6+)',learn:['let/const','Fonctions fléchées','DOM','Événements'],video:{title:'JavaScript',url:'https://www.youtube.com/results?search_query=javascript+course',channel:'Traversy Media'}},
  {id:'web4',domain:'Frontend',icon:'🌐',title:'React.js',learn:['JSX','useState','Props','Context API'],video:{title:'React',url:'https://www.youtube.com/results?search_query=react+course',channel:'Traversy Media'}},
  {id:'web5',domain:'Frontend',icon:'🌐',title:'React Native',learn:['Composants','Navigation','Styles','Publication'],video:{title:'React Native',url:'https://www.youtube.com/results?search_query=react+native',channel:'Mosh'}},
  {id:'py1',domain:'Python & Data',icon:'🐍',title:'Python (Bases)',learn:['Variables','Conditions','Boucles','Fonctions'],video:{title:'Python',url:'https://www.youtube.com/results?search_query=python+beginners',channel:'Mosh'}},
  {id:'py2',domain:'Python & Data',icon:'🐍',title:'Python (POO)',learn:['Fonctions','Modules','Classes','Héritage'],video:{title:'Python OOP',url:'https://www.youtube.com/results?search_query=python+oop',channel:'Corey Schafer'}},
  {id:'sql1',domain:'Python & Data',icon:'🐍',title:'SQL (Bases)',learn:['SELECT','INSERT','GROUP BY','Relations'],video:{title:'SQL',url:'https://www.youtube.com/results?search_query=sql+tutorial',channel:'Mosh'}},
  {id:'sql2',domain:'Python & Data',icon:'🐍',title:'SQL (Avancé)',learn:['JOIN','Index','Subqueries','Performance'],video:{title:'Advanced SQL',url:'https://www.youtube.com/results?search_query=advanced+sql',channel:'Alex The Analyst'}},
  {id:'java1',domain:'Java & C',icon:'☕',title:'Java (Bases)',learn:['Types','Contrôle','Classes','Constructeurs'],video:{title:'Java',url:'https://www.youtube.com/results?search_query=java+tutorial',channel:'Mosh'}},
  {id:'java2',domain:'Java & C',icon:'☕',title:'Java (POO)',learn:['Héritage','Interfaces','Collections','Streams'],video:{title:'Advanced Java',url:'https://www.youtube.com/results?search_query=advanced+java',channel:'Telusko'}},
  {id:'c1',domain:'Java & C',icon:'☕',title:'Langage C (Bases)',learn:['Pointeurs','Mémoire','Structures','Fichiers'],video:{title:'C',url:'https://www.youtube.com/results?search_query=c+programming',channel:'freeCodeCamp'}},
  {id:'c2',domain:'Java & C',icon:'☕',title:'Langage C (Algorithmes)',learn:['Algorithmes','Complexité','Optimisation','Debugging'],video:{title:'Algorithms',url:'https://www.youtube.com/results?search_query=algorithms+c',channel:'mycodeschool'}},
  {id:'git1',domain:'Outils & Projets',icon:'🔧',title:'Git & GitHub',learn:['init/add/commit','Branches','Pull requests','Conflits'],video:{title:'Git',url:'https://www.youtube.com/results?search_query=git+crash+course',channel:'Traversy Media'}},
  {id:'proj1',domain:'Outils & Projets',icon:'🔧',title:'Projet : Portfolio Web',learn:['Design responsive','Navigation','Contact','Déploiement'],video:{title:'Portfolio',url:'https://www.youtube.com/results?search_query=portfolio+website',channel:'freeCodeCamp'}},
  {id:'proj2',domain:'Outils & Projets',icon:'🔧',title:'Projet : React To-Do',learn:['CRUD','LocalStorage','Composants','Déploiement'],video:{title:'React To-Do',url:'https://www.youtube.com/results?search_query=react+todo',channel:'Traversy Media'}},
  {id:'proj3',domain:'Outils & Projets',icon:'🔧',title:'Projet : Mini jeu Python',learn:['Logique','Pygame','Événements','Boucle'],video:{title:'Python Game',url:'https://www.youtube.com/results?search_query=python+game',channel:'freeCodeCamp'}}
];

var LANGUAGES = [
  {id:'de',flag:'🇩🇪',name:'Deutsch',nameAr:'الألمانية',goal:'B2',goalLabel:'B2 — متقدم',
    levels:{
      A1:{label:'A1 — مبتدئ',description:'في نهاية هذا المستوى:',canDo:['التقديم','أسئلة','مواقف','فهم'],duration:'40-60 ساعة',pace:'3 دروس/أسبوع',
        lessons:[
          {num:1,title:'الأبجدية والنطق',sub:'Das Alphabet',learn:['الحروف الألمانية','النطق','الحروف الخاصة'],video:{title:'German Alphabet',url:'https://www.youtube.com/results?search_query=german+alphabet',channel:'Easy German'}},
          {num:2,title:'التحيات',sub:'Begrüßungen',learn:['Hallo','Ich heiße','Wie geht es dir'],video:{title:'Greetings',url:'https://www.youtube.com/results?search_query=german+greetings',channel:'Anja'}},
          {num:3,title:'الأرقام',sub:'Die Zahlen',learn:['0-20','العشرات','المئات'],video:{title:'Numbers',url:'https://www.youtube.com/results?search_query=german+numbers',channel:'Easy German'}},
          {num:4,title:'الضمائر',sub:'Personalpronomen',learn:['ich, du, er','wir, ihr, sie'],video:{title:'Pronouns',url:'https://www.youtube.com/results?search_query=german+pronouns',channel:'Learn German'}},
          {num:5,title:'der/die/das',sub:'Artikel',learn:['الأجناس','der/die/das','قواعد'],video:{title:'Articles',url:'https://www.youtube.com/results?search_query=der+die+das',channel:'Easy German'}},
          {num:6,title:'الأفعال',sub:'Verben',learn:['sein','haben','تصريف'],video:{title:'Verben',url:'https://www.youtube.com/results?search_query=german+verbs',channel:'Anja'}},
          {num:7,title:'المفردات',sub:'Wortschatz',learn:['الألوان','العائلة','الطعام'],video:{title:'Vocab',url:'https://www.youtube.com/results?search_query=german+vocab',channel:'Easy German'}},
          {num:8,title:'الجمل',sub:'Sätze',learn:['بنية الجملة','W-Fragen','Ja/Nein'],video:{title:'Sentences',url:'https://www.youtube.com/results?search_query=german+sentences',channel:'Easy German'}},
          {num:9,title:'المحادثات',sub:'Gespräche',learn:['المقهى','التسوق','السفر'],video:{title:'Dialogues',url:'https://www.youtube.com/results?search_query=german+dialogues',channel:'Easy German'}},
          {num:10,title:'الاختبار A1',sub:'Test',learn:['مراجعة','تمارين'],video:{title:'A1 Test',url:'https://www.youtube.com/results?search_query=german+A1',channel:'Learn German'}}
        ],resources:{books:[{title:'Menschen A1',author:'Hueber',sub:'الأساسي'}],youtube:[{title:'Easy German',sub:'حوارات'},{title:'Anja',sub:'مبتدئين'}],apps:[{title:'Anki',sub:'بطاقات'}],websites:[{title:'DW Nicos Weg',sub:'مسلسل'}]}
      },
      A2:{label:'A2 — أساسي',description:'في نهاية هذا المستوى:',canDo:['مواقف','تبادل','وصف','نصوص'],duration:'60-80 ساعة',pace:'3-4 دروس',
        lessons:[
          {num:1,title:'Perfekt',sub:'الماضي التام',learn:['تكوينه','PII','المحادثة'],video:{title:'Perfekt',url:'https://www.youtube.com/results?search_query=perfekt',channel:'Anja'}},
          {num:2,title:'Akkusativ',sub:'النصب',learn:['متى','den/die/das','الضمائر'],video:{title:'Akkusativ',url:'https://www.youtube.com/results?search_query=akkusativ',channel:'Easy German'}},
          {num:3,title:'Dativ',sub:'الجر',learn:['متى','dem/der','حروف'],video:{title:'Dativ',url:'https://www.youtube.com/results?search_query=dativ',channel:'Easy German'}},
          {num:4,title:'Wechselpräpositionen',sub:'حروف متغيرة',learn:['in/auf','Wohin/Wo','تمارين'],video:{title:'Wechsel',url:'https://www.youtube.com/results?search_query=wechsel',channel:'Learn German'}},
          {num:5,title:'Trennbare Verben',sub:'أفعال منفصلة',learn:['aufstehen','القاعدة'],video:{title:'Trennbar',url:'https://www.youtube.com/results?search_query=trennbar',channel:'Easy German'}},
          {num:6,title:'الصفات',sub:'Adjektive',learn:['الصفات','المقارنة'],video:{title:'Adjectives',url:'https://www.youtube.com/results?search_query=adjectives',channel:'Learn German'}},
          {num:7,title:'الملكية',sub:'Possessiv',learn:['mein/dein','unser'],video:{title:'Possessiv',url:'https://www.youtube.com/results?search_query=possessiv',channel:'Easy German'}},
          {num:8,title:'الانعكاسية',sub:'Reflexiv',learn:['mich/dich','الأفعال'],video:{title:'Reflexive',url:'https://www.youtube.com/results?search_query=reflexive',channel:'Learn German'}},
          {num:9,title:'Konjunktionen',sub:'حروف الوصل',learn:['und/aber','weil/dass'],video:{title:'Konj',url:'https://www.youtube.com/results?search_query=konjunktionen',channel:'Easy German'}},
          {num:10,title:'الساعة',sub:'Uhrzeit',learn:['الوقت','الأيام','التاريخ'],video:{title:'Time',url:'https://www.youtube.com/results?search_query=time+german',channel:'Learn German'}},
          {num:11,title:'التسوق',sub:'Einkaufen',learn:['المطعم','السوبر'],video:{title:'Shopping',url:'https://www.youtube.com/results?search_query=shopping+german',channel:'Easy German'}},
          {num:12,title:'اختبار A2',sub:'Test A2',learn:['مراجعة','B1'],video:{title:'A2 Test',url:'https://www.youtube.com/results?search_query=german+A2',channel:'Learn German'}}
        ],resources:{books:[{title:'Menschen A2',author:'Hueber',sub:'الأساسي'}],youtube:[{title:'Easy German',sub:'حوارات'},{title:'Marija',sub:'بالعربية'}],apps:[{title:'Anki A2',sub:'مفردات'}],websites:[{title:'DW A2',sub:'دروس'}]}
      },
      B1:{label:'B1 — متوسط',description:'في نهاية هذا المستوى:',canDo:['السفر','تجارب','آراء','نصوص'],duration:'80-120 ساعة',pace:'4 دروس',
        lessons:[
          {num:1,title:'Präteritum',sub:'الماضي',learn:['تكوينه','الشاذة','استخدام'],video:{title:'Präteritum',url:'https://www.youtube.com/results?search_query=praeteritum',channel:'Easy German'}},
          {num:2,title:'Futur',sub:'المستقبل',learn:['werden','الخطط'],video:{title:'Futur',url:'https://www.youtube.com/results?search_query=futur',channel:'Learn German'}},
          {num:3,title:'Modalverben',sub:'الوسيطة',learn:['können/müssen','sollen/wollen'],video:{title:'Modal',url:'https://www.youtube.com/results?search_query=modal',channel:'Easy German'}},
          {num:4,title:'Relativsätze',sub:'الموصولة',learn:['der/die/das','دمج'],video:{title:'Relativ',url:'https://www.youtube.com/results?search_query=relativ',channel:'Learn German'}},
          {num:5,title:'Genitiv',sub:'حالة الجر',learn:['الملكية','حروف'],video:{title:'Genitiv',url:'https://www.youtube.com/results?search_query=genitiv',channel:'Easy German'}},
          {num:6,title:'Passiv',sub:'المجهول',learn:['werden+PII','الأزمنة'],video:{title:'Passiv',url:'https://www.youtube.com/results?search_query=passiv',channel:'Learn German'}},
          {num:7,title:'Konjunktiv II',sub:'الشرط',learn:['würde','الأمنيات'],video:{title:'Konj II',url:'https://www.youtube.com/results?search_query=konjunktiv+2',channel:'Easy German'}},
          {num:8,title:'المقارنة',sub:'Komparativ',learn:['الشاذة','als/wie'],video:{title:'Compar',url:'https://www.youtube.com/results?search_query=komparativ',channel:'Learn German'}},
          {num:9,title:'Relativpronomen',sub:'الضمائر',learn:['der/die','الإعراب'],video:{title:'Relativ P',url:'https://www.youtube.com/results?search_query=relativpronomen',channel:'Easy German'}},
          {num:10,title:'Redewendungen',sub:'التعبيرات',learn:['Daumen','Schwein'],video:{title:'Idioms',url:'https://www.youtube.com/results?search_query=redensarten',channel:'Get Germanized'}},
          {num:11,title:'Beruf',sub:'العمل',learn:['مفردات','البريد'],video:{title:'Business',url:'https://www.youtube.com/results?search_query=business',channel:'Easy German'}},
          {num:12,title:'Nachrichten',sub:'الأخبار',learn:['فهم','الرأي'],video:{title:'News',url:'https://www.youtube.com/results?search_query=tagesschau',channel:'Tagesschau'}},
          {num:13,title:'Briefe',sub:'الرسائل',learn:['Sehr geehrte','البنية'],video:{title:'Letters',url:'https://www.youtube.com/results?search_query=briefe',channel:'Learn German'}},
          {num:14,title:'Kultur',sub:'الثقافة',learn:['العادات','الأعياد'],video:{title:'Culture',url:'https://www.youtube.com/results?search_query=kultur',channel:'Get Germanized'}},
          {num:15,title:'اختبار B1',sub:'Test B1',learn:['مراجعة','Goethe'],video:{title:'B1 Test',url:'https://www.youtube.com/results?search_query=goethe+B1',channel:'Learn German'}}
        ],resources:{books:[{title:'Menschen B1',author:'Hueber',sub:'الأساسي'}],youtube:[{title:'Easy German Podcast',sub:'حوارات'},{title:'Tagesschau',sub:'أخبار'}],apps:[{title:'Anki B1',sub:'مفردات'}],websites:[{title:'DW B1',sub:'دروس'}]}
      },
      B2:{label:'B2 — متقدم',description:'في نهاية هذا المستوى:',canDo:['نصوص معقدة','طلاقة','كتابة','نقاش'],duration:'120-180 ساعة',pace:'4-5 دروس',
        lessons:[
          {num:1,title:'Alle Zeiten',sub:'الأزمنة',learn:['جدول','متى'],video:{title:'Tenses',url:'https://www.youtube.com/results?search_query=all+tenses',channel:'Learn German'}},
          {num:2,title:'Komposita',sub:'المركبة',learn:['تكوين','البادئة'],video:{title:'Komposita',url:'https://www.youtube.com/results?search_query=komposita',channel:'Easy German'}},
          {num:3,title:'Infinitive',sub:'التراكيب',learn:['um zu','ohne zu'],video:{title:'Infinitive',url:'https://www.youtube.com/results?search_query=infinitive',channel:'Learn German'}},
          {num:4,title:'Konjunktiv I',sub:'غير مباشر',learn:['Indirekte','الصحافة'],video:{title:'Konj I',url:'https://www.youtube.com/results?search_query=konjunktiv+1',channel:'Easy German'}},
          {num:5,title:'Konditional',sub:'الشرط',learn:['wenn/falls','المستحيل'],video:{title:'Kond',url:'https://www.youtube.com/results?search_query=konditional',channel:'Learn German'}},
          {num:6,title:'Verben+Präp',sub:'أفعال+حروف',learn:['warten auf','قائمة'],video:{title:'Verben',url:'https://www.youtube.com/results?search_query=verben+praep',channel:'Easy German'}},
          {num:7,title:'Academic',sub:'كتابة',learn:['المقال','الروابط'],video:{title:'Writing',url:'https://www.youtube.com/results?search_query=academic+writing',channel:'Learn German'}},
          {num:8,title:'Listening',sub:'الاستماع',learn:['بودكاست','أفلام'],video:{title:'Listening',url:'https://www.youtube.com/results?search_query=listening+B2',channel:'Easy German'}},
          {num:9,title:'Literatur',sub:'الأدب',learn:['Goethe','Kafka'],video:{title:'Lit',url:'https://www.youtube.com/results?search_query=literatur',channel:'Get Germanized'}},
          {num:10,title:'Ingenieure',sub:'هندسة',learn:['مفردات','القراءة'],video:{title:'Technical',url:'https://www.youtube.com/results?search_query=technical',channel:'Learn German'}},
          {num:11,title:'Goethe B2',sub:'الامتحان',learn:['البنية','محاكاة'],video:{title:'Goethe B2',url:'https://www.youtube.com/results?search_query=goethe+B2',channel:'Learn German'}},
          {num:12,title:'Review B2',sub:'المراجعة',learn:['شامل','C1'],video:{title:'Review',url:'https://www.youtube.com/results?search_query=B2+review',channel:'Easy German'}}
        ],resources:{books:[{title:'Sicher! B2',author:'Hueber',sub:'الأساسي'}],youtube:[{title:'Easy German',sub:'سريع'},{title:'Tagesschau',sub:'أخبار'}],apps:[{title:'Anki B2',sub:'مفردات'}],websites:[{title:'Goethe B2',sub:'نماذج'}]}
      }
    }
  },
  {id:'en',flag:'🇬🇧',name:'English',nameAr:'الإنجليزية',startLevel:'B2',goal:'C2',goalLabel:'C2 — إتقان كامل',
    levels:{
      B2:{label:'B2 — متقدم',description:'الانطلاق من مستواك الحالي B2 نحو C2:',canDo:['فهم النصوص المعقدة','التحدث بطلاقة','التعبير عن الآراء بدقة','الكتابة الأكاديمية والمهنية'],duration:'120-180 ساعة',pace:'4-5 دروس',
        lessons:[
          {num:1,title:'Advanced Tenses',sub:'الأزمنة المتقدمة',learn:['Future Perfect','Future Continuous','Mixed time references'],video:{title:'Advanced English Tenses B2',url:'https://www.youtube.com/results?search_query=advanced+english+tenses+B2',channel:'BBC Learning English'}},
          {num:2,title:'Mixed Conditionals',sub:'الجمل الشرطية المختلطة',learn:['Mixed Type 2/3','Regret and hypothetical meaning'],video:{title:'Mixed Conditionals B2',url:'https://www.youtube.com/results?search_query=mixed+conditionals+B2',channel:'BBC Learning English'}},
          {num:3,title:'Advanced Passive',sub:'المبني للمجهول المتقدم',learn:['Complex passive structures','Reporting passive'],video:{title:'Advanced Passive B2',url:'https://www.youtube.com/results?search_query=advanced+passive+voice+B2',channel:'BBC Learning English'}},
          {num:4,title:'Inversion',sub:'القلب في الجملة',learn:['Negative inversion','Never/Rarely/Seldom'],video:{title:'Inversion B2 English',url:'https://www.youtube.com/results?search_query=english+inversion+B2',channel:'BBC Learning English'}},
          {num:5,title:'Cleft Sentences',sub:'الجمل المشقوقة',learn:['It-clefts','Wh-clefts','Emphasis'],video:{title:'Cleft Sentences B2',url:'https://www.youtube.com/results?search_query=cleft+sentences+B2',channel:'BBC Learning English'}},
          {num:6,title:'Advanced Phrasal Verbs',sub:'الأفعال المركبة',learn:['Three-part verbs','Idiomatic usage'],video:{title:'Advanced Phrasal Verbs',url:'https://www.youtube.com/results?search_query=advanced+phrasal+verbs+B2',channel:'BBC Learning English'}},
          {num:7,title:'Register & Style',sub:'مستويات اللغة والأسلوب',learn:['Formal vs informal','Academic and professional register'],video:{title:'English Register and Style',url:'https://www.youtube.com/results?search_query=english+register+style+B2',channel:'British Council'}},
          {num:8,title:'Academic Writing',sub:'الكتابة الأكاديمية',learn:['Thesis statements','Cohesion','Argument structure'],video:{title:'Academic Writing B2',url:'https://www.youtube.com/results?search_query=academic+writing+B2',channel:'British Council'}},
          {num:9,title:'Collocations',sub:'المتلازمات اللفظية',learn:['Strong collocations','Word choice','Natural combinations'],video:{title:'English Collocations B2',url:'https://www.youtube.com/results?search_query=english+collocations+B2',channel:'BBC Learning English'}},
          {num:10,title:'Idioms & Cultural References',sub:'التعابير والثقافة',learn:['Common idioms','Context','Cultural meaning'],video:{title:'English Idioms B2',url:'https://www.youtube.com/results?search_query=english+idioms+B2',channel:'BBC Learning English'}},
          {num:11,title:'Debating',sub:'المناظرة',learn:['Agreeing and disagreeing','Persuasion','Counterarguments'],video:{title:'English Debating B2',url:'https://www.youtube.com/results?search_query=english+debating+B2',channel:'British Council'}},
          {num:12,title:'Professional English',sub:'الإنجليزية المهنية',learn:['Negotiation','Presentations','Meetings'],video:{title:'Professional English B2',url:'https://www.youtube.com/results?search_query=professional+english+B2',channel:'BBC Learning English'}},
          {num:13,title:'Literature & Film',sub:'الأدب والسينما',learn:['Themes','Character analysis','Implicit meaning'],video:{title:'English Literature B2',url:'https://www.youtube.com/results?search_query=english+literature+B2',channel:'British Council'}},
          {num:14,title:'IELTS / TOEFL Skills',sub:'مهارات الاختبارات',learn:['Reading','Listening','Speaking','Writing'],video:{title:'IELTS B2 Skills',url:'https://www.youtube.com/results?search_query=IELTS+B2+skills',channel:'British Council'}},
          {num:15,title:'Critical Thinking in English',sub:'التفكير النقدي',learn:['Analyze','Evaluate','Infer'],video:{title:'Critical Thinking English',url:'https://www.youtube.com/results?search_query=critical+thinking+english+B2',channel:'TED-Ed'}},
          {num:16,title:'Advanced Listening',sub:'الاستماع المتقدم',learn:['Lectures','Podcasts','Different accents'],video:{title:'Advanced Listening B2',url:'https://www.youtube.com/results?search_query=advanced+english+listening+B2',channel:'BBC Learning English'}},
          {num:17,title:'Advanced Writing',sub:'الكتابة المتقدمة',learn:['Essays','Reports','Cohesive paragraphs'],video:{title:'Advanced Writing B2',url:'https://www.youtube.com/results?search_query=advanced+english+writing+B2',channel:'British Council'}},
          {num:18,title:'B2 Mastery Test',sub:'اختبار الانتقال إلى C1',learn:['Comprehensive review','Error correction','C1 readiness'],video:{title:'B2 English Test',url:'https://www.youtube.com/results?search_query=B2+English+test',channel:'British Council'}}
        ],resources:{books:[{title:'English Grammar in Use',author:'Cambridge',sub:'مرجع قوي للمراجعة'},{title:'English File Upper-Intermediate',author:'Oxford',sub:'مستوى B2'}],youtube:[{title:'BBC Learning English',sub:'قواعد واستماع'},{title:'TED',sub:'استماع ومناقشة'}],apps:[{title:'Anki',sub:'مفردات وCollocations'}],websites:[{title:'British Council LearnEnglish',sub:'دروس واختبارات'}]}
      },
      C1:{label:'C1 — متقدم جدًا',description:'الانتقال من B2 إلى استخدام أكاديمي ومهني متقدم:',canDo:['فهم معظم المحتوى الأصلي','التعبير بدقة ومرونة','إدارة نقاشات معقدة','الكتابة الأكاديمية والمهنية'],duration:'180-250 ساعة',pace:'5 دروس',
        lessons:[
          {num:1,title:'Advanced Grammar Mastery',sub:'إتقان القواعد',learn:['Complex structures','Tense nuance','Subordination'],video:{title:'Advanced Grammar C1',url:'https://www.youtube.com/results?search_query=advanced+english+grammar+C1',channel:'BBC Learning English'}},
          {num:2,title:'Academic Argumentation',sub:'الحجاج الأكاديمي',learn:['Claims','Evidence','Counterarguments'],video:{title:'Academic Argumentation C1',url:'https://www.youtube.com/results?search_query=academic+argumentation+C1',channel:'British Council'}},
          {num:3,title:'Advanced Vocabulary',sub:'المفردات المتقدمة',learn:['Word families','Nuance','Precise word choice'],video:{title:'Advanced Vocabulary C1',url:'https://www.youtube.com/results?search_query=advanced+english+vocabulary+C1',channel:'BBC Learning English'}},
          {num:4,title:'Literary Analysis',sub:'التحليل الأدبي',learn:['Narrative voice','Symbolism','Interpretation'],video:{title:'Literary Analysis C1',url:'https://www.youtube.com/results?search_query=literary+analysis+C1+english',channel:'TED-Ed'}},
          {num:5,title:'Rhetoric & Persuasion',sub:'البلاغة والإقناع',learn:['Ethos','Pathos','Logos','Rhetorical devices'],video:{title:'Rhetoric and Persuasion',url:'https://www.youtube.com/results?search_query=rhetoric+persuasion+english+C1',channel:'TED-Ed'}},
          {num:6,title:'Abstract Discussion',sub:'النقاش المجرد',learn:['Abstract concepts','Philosophical vocabulary','Nuanced opinions'],video:{title:'Advanced Discussion C1',url:'https://www.youtube.com/results?search_query=advanced+english+discussion+C1',channel:'BBC Learning English'}},
          {num:7,title:'Scientific English',sub:'الإنجليزية العلمية',learn:['Research papers','Methodology','Scientific reporting'],video:{title:'Scientific English C1',url:'https://www.youtube.com/results?search_query=scientific+english+C1',channel:'British Council'}},
          {num:8,title:'Leadership Communication',sub:'التواصل القيادي',learn:['Briefings','Decision language','Strategic communication'],video:{title:'Leadership Communication',url:'https://www.youtube.com/results?search_query=leadership+communication+english+C1',channel:'TED'}},
          {num:9,title:'Native-Speed Listening',sub:'استماع بسرعة طبيعية',learn:['Fast speech','Connected speech','Accents'],video:{title:'Native English Listening C1',url:'https://www.youtube.com/results?search_query=native+english+listening+C1',channel:'BBC Learning English'}},
          {num:10,title:'Pragmatics & Nuance',sub:'الدلالة والسياق',learn:['Tone','Implicature','Politeness'],video:{title:'English Pragmatics C1',url:'https://www.youtube.com/results?search_query=english+pragmatics+C1',channel:'British Council'}},
          {num:11,title:'Translation & Reformulation',sub:'الترجمة وإعادة الصياغة',learn:['Arabic-English','Paraphrasing','Context'],video:{title:'Translation Skills C1',url:'https://www.youtube.com/results?search_query=translation+skills+english+C1',channel:'British Council'}},
          {num:12,title:'Advanced Conversation',sub:'المحادثة المتقدمة',learn:['Spontaneity','Turn-taking','Debate'],video:{title:'Advanced Conversation C1',url:'https://www.youtube.com/results?search_query=advanced+english+conversation+C1',channel:'BBC Learning English'}},
          {num:13,title:'Media Analysis',sub:'تحليل الإعلام',learn:['Bias','Framing','Persuasive language'],video:{title:'Media Analysis English',url:'https://www.youtube.com/results?search_query=media+analysis+english+C1',channel:'TED-Ed'}},
          {num:14,title:'Creative Writing',sub:'الكتابة الإبداعية',learn:['Narrative structure','Voice','Style'],video:{title:'Creative Writing C1',url:'https://www.youtube.com/results?search_query=creative+writing+C1+english',channel:'British Council'}},
          {num:15,title:'C1 Exam Mastery',sub:'إتقان الاختبارات',learn:['CAE','CPE','IELTS','Error analysis'],video:{title:'C1 English Exam',url:'https://www.youtube.com/results?search_query=C1+English+exam',channel:'Cambridge English'}},
          {num:16,title:'Advanced Debate',sub:'المناظرة المتقدمة',learn:['Rebuttal','Concession','Structured argument'],video:{title:'Advanced English Debate',url:'https://www.youtube.com/results?search_query=advanced+english+debate+C1',channel:'TED'}},
          {num:17,title:'News & Advertising',sub:'الأخبار والإعلانات',learn:['Persuasion','Headlines','Subtext'],video:{title:'News and Advertising English',url:'https://www.youtube.com/results?search_query=news+advertising+english+C1',channel:'BBC Learning English'}},
          {num:18,title:'Professional Writing',sub:'الكتابة المهنية',learn:['Reports','Proposals','Formal correspondence'],video:{title:'Professional Writing C1',url:'https://www.youtube.com/results?search_query=professional+writing+C1',channel:'British Council'}},
          {num:19,title:'Fluency & Naturalness',sub:'الطلاقة والطبيعية',learn:['Chunking','Discourse markers','Natural phrasing'],video:{title:'English Fluency C1',url:'https://www.youtube.com/results?search_query=english+fluency+C1',channel:'BBC Learning English'}},
          {num:20,title:'C1 Mastery Test',sub:'اختبار الانتقال إلى C2',learn:['Comprehensive review','Precision','C2 readiness'],video:{title:'C1 English Test',url:'https://www.youtube.com/results?search_query=C1+English+test',channel:'Cambridge English'}}
        ],resources:{books:[{title:'Advanced Grammar in Use',author:'Cambridge',sub:'قواعد C1-C2'},{title:'English Vocabulary in Use Advanced',author:'Cambridge',sub:'مفردات متقدمة'}],youtube:[{title:'BBC Learning English',sub:'استماع وقواعد'},{title:'TED Talks',sub:'أفكار ونقاش'}],apps:[{title:'Anki',sub:'مفردات متقدمة'}],websites:[{title:'Cambridge English',sub:'اختبارات C1/C2'}]}
      },
      C2:{label:'C2 — إتقان كامل',description:'المرحلة النهائية: استخدام الإنجليزية بدقة ومرونة قريبة من مستوى المتعلم المتقدم جدًا:',canDo:['فهم كل ما تقرؤه أو تسمعه تقريبًا','التقاط المعاني الضمنية والفروق الدقيقة','التعبير التلقائي والدقيق','إنتاج نصوص معقدة ومتماسكة'],duration:'250-400 ساعة',pace:'5-6 دروس',
        lessons:[
          {num:1,title:'C2 Grammar Precision',sub:'الدقة النحوية',learn:['Subtle grammar choices','Ellipsis','Complex clause patterns'],video:{title:'C2 Grammar',url:'https://www.youtube.com/results?search_query=C2+English+grammar',channel:'Cambridge English'}},
          {num:2,title:'Lexical Precision',sub:'الدقة المعجمية',learn:['Near-synonyms','Connotation','Register'],video:{title:'C2 Vocabulary Precision',url:'https://www.youtube.com/results?search_query=C2+English+vocabulary+precision',channel:'Cambridge English'}},
          {num:3,title:'Idiomatic Mastery',sub:'الإتقان الاصطلاحي',learn:['Advanced idioms','Fixed expressions','Figurative language'],video:{title:'C2 English Idioms',url:'https://www.youtube.com/results?search_query=C2+English+idioms',channel:'BBC Learning English'}},
          {num:4,title:'Discourse & Cohesion',sub:'بناء الخطاب',learn:['Cohesion','Coherence','Discourse markers'],video:{title:'C2 Discourse and Cohesion',url:'https://www.youtube.com/results?search_query=C2+discourse+cohesion+English',channel:'Cambridge English'}},
          {num:5,title:'Implicit Meaning',sub:'المعنى الضمني',learn:['Inference','Sarcasm','Presupposition'],video:{title:'Implicit Meaning in English',url:'https://www.youtube.com/results?search_query=implicit+meaning+english+C2',channel:'BBC Learning English'}},
          {num:6,title:'Pragmatics Mastery',sub:'البراغماتية',learn:['Politeness strategies','Indirectness','Context'],video:{title:'English Pragmatics C2',url:'https://www.youtube.com/results?search_query=english+pragmatics+C2',channel:'Cambridge English'}},
          {num:7,title:'Rhetorical Mastery',sub:'البلاغة المتقدمة',learn:['Rhetorical devices','Framing','Persuasive structure'],video:{title:'Rhetoric C2 English',url:'https://www.youtube.com/results?search_query=rhetoric+C2+English',channel:'TED-Ed'}},
          {num:8,title:'Academic Research English',sub:'الإنجليزية البحثية',learn:['Literature review','Synthesis','Citation language'],video:{title:'Academic Research English C2',url:'https://www.youtube.com/results?search_query=academic+research+english+C2',channel:'Cambridge English'}},
          {num:9,title:'Scientific Communication',sub:'التواصل العلمي',learn:['Research presentation','Technical precision','Scientific argument'],video:{title:'Scientific Communication English',url:'https://www.youtube.com/results?search_query=scientific+communication+english+C2',channel:'TED'}},
          {num:10,title:'Advanced Professional English',sub:'الإنجليزية المهنية المتقدمة',learn:['Negotiation','Diplomatic language','Executive communication'],video:{title:'Advanced Professional English C2',url:'https://www.youtube.com/results?search_query=professional+english+C2+negotiation',channel:'BBC Learning English'}},
          {num:11,title:'Advanced Debate & Rebuttal',sub:'المناظرة والرد',learn:['Rebuttal','Concession','Logical fallacies'],video:{title:'Advanced Debate C2',url:'https://www.youtube.com/results?search_query=advanced+english+debate+C2',channel:'TED'}},
          {num:12,title:'Literary Interpretation',sub:'التفسير الأدبي',learn:['Symbolism','Irony','Narrative technique'],video:{title:'Literary Interpretation C2',url:'https://www.youtube.com/results?search_query=literary+interpretation+C2',channel:'TED-Ed'}},
          {num:13,title:'Film & Media Discourse',sub:'خطاب الإعلام والسينما',learn:['Subtext','Framing','Cultural references'],video:{title:'Media Discourse C2',url:'https://www.youtube.com/results?search_query=media+discourse+english+C2',channel:'BBC'}},
          {num:14,title:'Native-Level Listening',sub:'الاستماع المتقدم جدًا',learn:['Fast speech','Regional accents','Overlapping speech'],video:{title:'Native English Listening C2',url:'https://www.youtube.com/results?search_query=native+english+listening+C2',channel:'BBC Learning English'}},
          {num:15,title:'Advanced Speaking',sub:'التحدث المتقدم',learn:['Spontaneous speech','Nuanced opinions','Precise reformulation'],video:{title:'C2 English Speaking',url:'https://www.youtube.com/results?search_query=C2+English+speaking',channel:'Cambridge English'}},
          {num:16,title:'C2 Essay & Argument',sub:'المقال والحجة',learn:['Complex argument','Synthesis','Style control'],video:{title:'C2 Essay Writing',url:'https://www.youtube.com/results?search_query=C2+essay+writing',channel:'Cambridge English'}},
          {num:17,title:'C2 Report & Proposal',sub:'التقارير والمقترحات',learn:['Executive summary','Recommendations','Formal register'],video:{title:'C2 Report Writing',url:'https://www.youtube.com/results?search_query=C2+report+writing+English',channel:'British Council'}},
          {num:18,title:'Translation at Advanced Level',sub:'الترجمة المتقدمة',learn:['Meaning preservation','Style','Cultural adaptation'],video:{title:'Advanced Translation English',url:'https://www.youtube.com/results?search_query=advanced+translation+English+C2',channel:'British Council'}},
          {num:19,title:'C2 Error Analysis',sub:'تحليل الأخطاء',learn:['Persistent errors','False precision','Self-correction'],video:{title:'C2 English Error Analysis',url:'https://www.youtube.com/results?search_query=C2+English+error+analysis',channel:'Cambridge English'}},
          {num:20,title:'C2 Mastery Project',sub:'مشروع الإتقان',learn:['Research presentation','Long-form writing','Advanced discussion'],video:{title:'C2 English Mastery',url:'https://www.youtube.com/results?search_query=C2+English+mastery',channel:'Cambridge English'}},
          {num:21,title:'C2 Listening Mock',sub:'محاكاة الاستماع',learn:['Authentic audio','Inference','Note-taking'],video:{title:'C2 Listening Test',url:'https://www.youtube.com/results?search_query=C2+listening+test',channel:'Cambridge English'}},
          {num:22,title:'C2 Reading Mock',sub:'محاكاة القراءة',learn:['Dense texts','Implicit meaning','Speed and accuracy'],video:{title:'C2 Reading Test',url:'https://www.youtube.com/results?search_query=C2+reading+test',channel:'Cambridge English'}},
          {num:23,title:'C2 Speaking Mock',sub:'محاكاة التحدث',learn:['Interaction','Argumentation','Fluency'],video:{title:'C2 Speaking Test',url:'https://www.youtube.com/results?search_query=C2+speaking+test',channel:'Cambridge English'}},
          {num:24,title:'C2 Final Mastery Test',sub:'الاختبار النهائي',learn:['Listening','Reading','Writing','Speaking'],video:{title:'C2 English Proficiency Test',url:'https://www.youtube.com/results?search_query=C2+English+proficiency+test',channel:'Cambridge English'}}
        ],resources:{books:[{title:'English Grammar in Use + Advanced Grammar in Use',author:'Cambridge',sub:'مرجع C1-C2'},{title:'English Vocabulary in Use Advanced',author:'Cambridge',sub:'مفردات C1-C2'}],youtube:[{title:'Cambridge English',sub:'تحضير C1/C2'},{title:'BBC Learning English',sub:'استماع ولغة طبيعية'},{title:'TED Talks',sub:'محتوى متقدم'}],apps:[{title:'Anki',sub:'Spaced Repetition'}],websites:[{title:'Cambridge English',sub:'C2 Proficiency'}]}
      }
    }
  },
  {id:'es',flag:'🇪🇸',name:'Español',nameAr:'الإسبانية',goal:'B2',goalLabel:'B2 — متقدم',
    levels:{
      A1:{label:'A1 — مبتدئ',description:'في نهاية هذا المستوى:',canDo:['التقديم','مواقف','فهم','أسئلة'],duration:'40-60 ساعة',pace:'3 دروس',
        lessons:[
          {num:1,title:'El Alfabeto',sub:'الأبجدية',learn:['27 حرفاً','ñ','النطق'],video:{title:'Alphabet',url:'https://www.youtube.com/results?search_query=spanish+alphabet',channel:'SpanishPod'}},
          {num:2,title:'Saludos',sub:'التحيات',learn:['Hola','Buenos días'],video:{title:'Greetings',url:'https://www.youtube.com/results?search_query=spanish+greetings',channel:'Easy Spanish'}},
          {num:3,title:'Presentarse',sub:'التعريف',learn:['Me llamo','Soy de'],video:{title:'Introduce',url:'https://www.youtube.com/results?search_query=introduce+spanish',channel:'SpanishPod'}},
          {num:4,title:'Números',sub:'الأرقام',learn:['0-20','Decenas'],video:{title:'Numbers',url:'https://www.youtube.com/results?search_query=spanish+numbers',channel:'Easy Spanish'}},
          {num:5,title:'Artículos',sub:'الأدوات',learn:['el/la','los/las'],video:{title:'Articles',url:'https://www.youtube.com/results?search_query=spanish+articles',channel:'SpanishPod'}},
          {num:6,title:'Ser & Estar',sub:'فعلان',learn:['ser','estar','الفروق'],video:{title:'Ser/Estar',url:'https://www.youtube.com/results?search_query=ser+estar',channel:'Butterfly'}},
          {num:7,title:'Presente',sub:'المضارع',learn:['-ar','-er','-ir'],video:{title:'Present',url:'https://www.youtube.com/results?search_query=spanish+present',channel:'SpanishPod'}},
          {num:8,title:'Vocabulario',sub:'مفردات',learn:['Colores','Familia'],video:{title:'Vocab',url:'https://www.youtube.com/results?search_query=spanish+vocab',channel:'Easy Spanish'}},
          {num:9,title:'Frases',sub:'جمل',learn:['SVO','Preguntas'],video:{title:'Sentences',url:'https://www.youtube.com/results?search_query=spanish+sentences',channel:'SpanishPod'}},
          {num:10,title:'Examen A1',sub:'الاختبار',learn:['مراجعة','A2'],video:{title:'A1 Test',url:'https://www.youtube.com/results?search_query=spanish+A1',channel:'Easy Spanish'}}
        ],resources:{books:[{title:'Aula Internacional 1',author:'Difusión',sub:'الأساسي'}],youtube:[{title:'SpanishPod',sub:'دروس'},{title:'Easy Spanish',sub:'شارع'}],apps:[{title:'Duolingo',sub:'تمارين'}],websites:[{title:'SpanishDict',sub:'قاموس'}]}
      },
      A2:{label:'A2 — أساسي',description:'في نهاية هذا المستوى:',canDo:['مواقف','تبادل','وصف','نصوص'],duration:'60-80 ساعة',pace:'3-4 دروس',
        lessons:[
          {num:1,title:'Indefinido',sub:'الماضي',learn:['Regular','Irregular'],video:{title:'Indefinido',url:'https://www.youtube.com/results?search_query=indefinido',channel:'Butterfly'}},
          {num:2,title:'Imperfecto',sub:'الناقص',learn:['-aba,-ía','الفرق'],video:{title:'Imperfecto',url:'https://www.youtube.com/results?search_query=imperfecto',channel:'SpanishPod'}},
          {num:3,title:'Futuro',sub:'المستقبل',learn:['-é,-ás','ir+a'],video:{title:'Futuro',url:'https://www.youtube.com/results?search_query=futuro',channel:'Easy Spanish'}},
          {num:4,title:'Pronombres',sub:'المفعول',learn:['me/te/lo','le/les'],video:{title:'Pronouns',url:'https://www.youtube.com/results?search_query=spanish+pronouns',channel:'Butterfly'}},
          {num:5,title:'Reflexivos',sub:'انعكاسية',learn:['me/te/se','levantarse'],video:{title:'Reflexive',url:'https://www.youtube.com/results?search_query=reflexive',channel:'SpanishPod'}},
          {num:6,title:'Gustar',sub:'شبيهة',learn:['me gusta','encantar'],video:{title:'Gustar',url:'https://www.youtube.com/results?search_query=gustar',channel:'Butterfly'}},
          {num:7,title:'Comparativos',sub:'مقارنة',learn:['más...que','menos...que'],video:{title:'Compar',url:'https://www.youtube.com/results?search_query=comparativos',channel:'Easy Spanish'}},
          {num:8,title:'Perfecto',sub:'التام',learn:['he+PII','الاستخدام'],video:{title:'Perfecto',url:'https://www.youtube.com/results?search_query=perfecto',channel:'SpanishPod'}},
          {num:9,title:'Por vs Para',sub:'حروف',learn:['por','para','الفروق'],video:{title:'Por/Para',url:'https://www.youtube.com/results?search_query=por+para',channel:'Butterfly'}},
          {num:10,title:'Diálogos',sub:'محادثات',learn:['المطعم','التسوق'],video:{title:'Dialogues',url:'https://www.youtube.com/results?search_query=dialogues',channel:'Easy Spanish'}},
          {num:11,title:'Escritura',sub:'الكتابة',learn:['Emails','Textos'],video:{title:'Writing',url:'https://www.youtube.com/results?search_query=writing+spanish',channel:'SpanishPod'}},
          {num:12,title:'Examen A2',sub:'الاختبار',learn:['مراجعة','B1'],video:{title:'A2 Test',url:'https://www.youtube.com/results?search_query=spanish+A2',channel:'Easy Spanish'}}
        ],resources:{books:[{title:'Aula Internacional 2',author:'Difusión',sub:'الأساسي'}],youtube:[{title:'Easy Spanish',sub:'شارع'},{title:'Butterfly',sub:'قواعد'}],apps:[{title:'Anki A2',sub:'مفردات'}],websites:[{title:'RTVE',sub:'رسمي'}]}
      },
      B1:{label:'B1 — متوسط',description:'في نهاية هذا المستوى:',canDo:['السفر','تجارب','آراء','نصوص'],duration:'80-120 ساعة',pace:'4 دروس',
        lessons:[
          {num:1,title:'Subjuntivo',sub:'الشرط',learn:['التكوين','بعد que'],video:{title:'Subjuntivo',url:'https://www.youtube.com/results?search_query=subjuntivo',channel:'Butterfly'}},
          {num:2,title:'Condicional',sub:'الشرطي',learn:['-ía','الطلبات'],video:{title:'Condicional',url:'https://www.youtube.com/results?search_query=condicional',channel:'SpanishPod'}},
          {num:3,title:'Pluscuamperfecto',sub:'التام',learn:['había+PII','الترتيب'],video:{title:'Plus',url:'https://www.youtube.com/results?search_query=pluscuamperfecto',channel:'Easy Spanish'}},
          {num:4,title:'Imperativo',sub:'الأمر',learn:['tú,usted','Negative'],video:{title:'Imperativo',url:'https://www.youtube.com/results?search_query=imperativo',channel:'Butterfly'}},
          {num:5,title:'Relativos',sub:'موصولة',learn:['que,quien','cuyo'],video:{title:'Relativos',url:'https://www.youtube.com/results?search_query=relativos',channel:'SpanishPod'}},
          {num:6,title:'Discurso',sub:'غير مباشر',learn:['Dijo que','تغيير'],video:{title:'Indirect',url:'https://www.youtube.com/results?search_query=indirecto',channel:'Easy Spanish'}},
          {num:7,title:'Subj Imperfecto',sub:'شرط الماضي',learn:['-ra,-se','الأمنيات'],video:{title:'Subj Imp',url:'https://www.youtube.com/results?search_query=subjuntivo+imperfecto',channel:'Butterfly'}},
          {num:8,title:'Perífrasis',sub:'تراكيب',learn:['ir a+inf','soler'],video:{title:'Perífrasis',url:'https://www.youtube.com/results?search_query=perifrasis',channel:'SpanishPod'}},
          {num:9,title:'Vocab',sub:'مفردات',learn:['Trabajo','Salud'],video:{title:'Vocab',url:'https://www.youtube.com/results?search_query=vocab+spanish',channel:'Easy Spanish'}},
          {num:10,title:'Escucha',sub:'الاستماع',learn:['Podcasts','Noticias'],video:{title:'Listening',url:'https://www.youtube.com/results?search_query=listening+B1',channel:'Notes in Spanish'}},
          {num:11,title:'Cultura',sub:'الثقافة',learn:['España','Latinoamérica'],video:{title:'Culture',url:'https://www.youtube.com/results?search_query=hispanic+culture',channel:'Easy Spanish'}},
          {num:12,title:'Negocios',sub:'العمل',learn:['Emails','Reuniones'],video:{title:'Business',url:'https://www.youtube.com/results?search_query=business+spanish',channel:'SpanishPod'}},
          {num:13,title:'Escritura Av',sub:'الكتابة',learn:['Ensayos','Cartas'],video:{title:'Writing',url:'https://www.youtube.com/results?search_query=writing+B1',channel:'Butterfly'}},
          {num:14,title:'DELE B1',sub:'تحضير',learn:['Estructura','Consejos'],video:{title:'DELE B1',url:'https://www.youtube.com/results?search_query=dele+B1',channel:'SpanishPod'}},
          {num:15,title:'Examen B1',sub:'الاختبار',learn:['مراجعة','B2'],video:{title:'B1 Test',url:'https://www.youtube.com/results?search_query=spanish+B1',channel:'Easy Spanish'}}
        ],resources:{books:[{title:'Aula Internacional 3',author:'Difusión',sub:'الأساسي'}],youtube:[{title:'Easy Spanish',sub:'شارع'},{title:'Notes',sub:'بودكاست'}],apps:[{title:'Anki B1',sub:'مفردات'}],websites:[{title:'RTVE',sub:'دروس'}]}
      },
      B2:{label:'B2 — متقدم',description:'في نهاية هذا المستوى:',canDo:['نصوص معقدة','طلاقة','كتابة','نقاش'],duration:'120-180 ساعة',pace:'4-5 دروس',
        lessons:[
          {num:1,title:'Subj Avanzado',sub:'شرط متقدم',learn:['All forms','Sequences'],video:{title:'Subj Adv',url:'https://www.youtube.com/results?search_query=advanced+subjuntivo',channel:'Butterfly'}},
          {num:2,title:'Cond Mixtos',sub:'مختلط',learn:['Type 2+3','Combinations'],video:{title:'Mixed',url:'https://www.youtube.com/results?search_query=mixed+cond',channel:'SpanishPod'}},
          {num:3,title:'Ser/Estar Adv',sub:'الفروق',learn:['Change meaning','Idioms'],video:{title:'Ser/Estar',url:'https://www.youtube.com/results?search_query=ser+estar+advanced',channel:'Easy Spanish'}},
          {num:4,title:'Modismos',sub:'تعبيرات',learn:['Idioms','Refranes'],video:{title:'Idioms',url:'https://www.youtube.com/results?search_query=idioms+spanish',channel:'Easy Spanish'}},
          {num:5,title:'Estilo Indirecto',sub:'غير مباشر',learn:['Complex','Commands'],video:{title:'Indirect',url:'https://www.youtube.com/results?search_query=indirect+adv',channel:'Butterfly'}},
          {num:6,title:'Pasiva',sub:'مجهول',learn:['ser+PII','Impersonal'],video:{title:'Pasiva',url:'https://www.youtube.com/results?search_query=pasiva',channel:'SpanishPod'}},
          {num:7,title:'Conectores',sub:'روابط',learn:['sin embargo','por lo tanto'],video:{title:'Conectores',url:'https://www.youtube.com/results?search_query=conectores',channel:'Easy Spanish'}},
          {num:8,title:'Vocab Esp',sub:'متخصص',learn:['Ciencia','Tecnología'],video:{title:'Specialized',url:'https://www.youtube.com/results?search_query=specialized+spanish',channel:'SpanishPod'}},
          {num:9,title:'Literatura',sub:'أدب',learn:['Cervantes','Márquez'],video:{title:'Literature',url:'https://www.youtube.com/results?search_query=literature+spanish',channel:'Easy Spanish'}},
          {num:10,title:'Debate',sub:'النقاش',learn:['Estructura','Refutación'],video:{title:'Debate',url:'https://www.youtube.com/results?search_query=debate+spanish',channel:'SpanishPod'}},
          {num:11,title:'Escritura Acad',sub:'كتابة',learn:['Ensayos','Tesis'],video:{title:'Writing',url:'https://www.youtube.com/results?search_query=academic+writing',channel:'Butterfly'}},
          {num:12,title:'DELE B2',sub:'تحضير',learn:['Estructura','Práctica'],video:{title:'DELE B2',url:'https://www.youtube.com/results?search_query=dele+B2',channel:'SpanishPod'}},
          {num:13,title:'Español Prof',sub:'مهني',learn:['Reuniones','Presentaciones'],video:{title:'Professional',url:'https://www.youtube.com/results?search_query=professional',channel:'Easy Spanish'}},
          {num:14,title:'Medios',sub:'إعلام',learn:['Noticias','Análisis'],video:{title:'Media',url:'https://www.youtube.com/results?search_query=media+spanish',channel:'SpanishPod'}},
          {num:15,title:'Conversación',sub:'محادثة',learn:['Speed','Varieties'],video:{title:'Conversation',url:'https://www.youtube.com/results?search_query=native+spanish',channel:'Easy Spanish'}},
          {num:16,title:'Traducción',sub:'ترجمة',learn:['Árabe-Español','Contexto'],video:{title:'Translation',url:'https://www.youtube.com/results?search_query=translation',channel:'Butterfly'}},
          {num:17,title:'Refinamiento',sub:'الأسلوب',learn:['Register','Tone'],video:{title:'Style',url:'https://www.youtube.com/results?search_query=style+spanish',channel:'SpanishPod'}},
          {num:18,title:'Examen B2',sub:'الاختبار',learn:['مراجعة','C1'],video:{title:'B2 Test',url:'https://www.youtube.com/results?search_query=spanish+B2',channel:'Easy Spanish'}}
        ],resources:{books:[{title:'Aula Internacional 4',author:'Difusión',sub:'الأساسي'}],youtube:[{title:'Easy Spanish',sub:'شارع'},{title:'RTVE',sub:'أخبار'}],apps:[{title:'Anki B2',sub:'مفردات'}],websites:[{title:'El País',sub:'صحيفة'}]}
      }
    }
  }
];

var COURSE_SCHEDULE = [
  {day:'lundi',start:'08:30',end:'10:00',subject:'Analyse des solides',type:'Cours',room:'S.C.CHIM'},
  {day:'lundi',start:'10:15',end:'11:45',subject:'Analyse des solides',type:'TD',room:'S.C.CHIM'},
  {day:'lundi',start:'14:00',end:'15:30',subject:'Séparation chromato.',type:'Cours',room:'S.C.CHIM'},
  {day:'lundi',start:'15:45',end:'17:15',subject:'Séparation chromato.',type:'TD',room:'S.C.CHIM'},
  {day:'mardi',start:'08:30',end:'10:00',subject:'Chimie Analytique',type:'TD',room:'S.C.CHIM'},
  {day:'mardi',start:'10:15',end:'11:45',subject:'Chimie Analytique',type:'Cours',room:'S.C.CHIM'},
  {day:'mardi',start:'13:15',end:'14:45',subject:'Spectroscopie atomique',type:'Cours',room:'P21'},
  {day:'mercredi',start:'08:30',end:'11:30',subject:'TP',type:'TP',room:'Labo'},
  {day:'mercredi',start:'13:30',end:'15:30',subject:'Hygiène sécurité',type:'Cours',room:'ME205'},
  {day:'mercredi',start:'15:45',end:'17:00',subject:'Efficacité énergétique',type:'Cours',room:'ME205'},
  {day:'jeudi',start:'08:30',end:'11:30',subject:'TP',type:'TP',room:'Labo'},
  {day:'jeudi',start:'14:00',end:'17:00',subject:'TP',type:'TP',room:'Labo'},
  {day:'vendredi',start:'08:30',end:'10:00',subject:'Normes et qualité',type:'Cours',room:'S.Bib.CHIM'},
  {day:'vendredi',start:'10:15',end:'11:45',subject:'Spectroscopie moléculaire',type:'Cours',room:'S.Bib.CHIM'},
  {day:'vendredi',start:'13:45',end:'15:15',subject:'Spectroscopie moléculaire',type:'TD',room:'S.Bib.CHIM'}
];

var DEFAULT_SCHEDULE = {
  lundi:'📚 Chimie analytique + Spectroscopie + Python',
  mardi:'📚 Chromatographie + exercices • 🏋️ 19:30',
  mercredi:'📚 Analyse solides + OOP',
  jeudi:'📚 Spectroscopie + Génie • 🏋️ 19:30',
  vendredi:'📚 Spectroscopie atomique + DSA',
  samedi:'📚 Révision + Git • 🏋️ 19:30',
  dimanche:'🛌 Repos'
};

var DB_NAME=window.WWCorePersistence.dbName, STORE_NAME='data', db=null, dbUnavailable=false;
var DB_FALLBACK_KEY='wwAppStateFallback';
function openDB(){return window.WWCorePersistence.open().then(function(handle){db=handle;dbUnavailable=false;return handle}).catch(function(e){dbUnavailable=true;throw e})}
function wwReadFallbackState(){return window.WWCorePersistence.readFallback()}
function wwWriteFallbackState(v){return window.WWCorePersistence.writeFallback(v)}
function dbGet(k){return WWPersistence.get(k)}
function dbSet(k,v){return WWPersistence.set(k,v)}
function fileSet(k,v){return WWPersistence.fileSet(k,v)}
function fileGet(k){return WWPersistence.fileGet(k)}
function fileDelete(k){return WWPersistence.fileDelete(k)}
function supportsFileSystemAccess(){return typeof window.showOpenFilePicker==='function'}
async function pickPersistentFile(){
  if(!supportsFileSystemAccess()) return null;
  var handles=await window.showOpenFilePicker({multiple:false});
  return handles&&handles[0]?handles[0]:null;
}
async function getPersistentFile(handle){
  if(!handle||typeof handle.getFile!=='function')return null;
  try{
    var p=handle.queryPermission?await handle.queryPermission({mode:'read'}):'granted';
    if(p!=='granted'&&handle.requestPermission)p=await handle.requestPermission({mode:'read'});
    if(p!=='granted')return null;
    return await handle.getFile();
  }catch(e){console.warn('File access error',e);return null}
}



/* =========================================================
   WHITE WOLF V43 — IN-APP RESOURCE READER
   Persistent FileSystemFileHandle is stored; file bytes stay
   in phone storage. Reader uses an object URL only while open.
   ========================================================= */
/* V63.2 — Reader compatibility bridge. Rendering is owned by modules/reader.js. */
async function wwOpenResourceInApp(sid,rid){
  var r=null;
  Object.keys(state.resources[sid]||{}).some(function(f){
    r=(state.resources[sid][f]||[]).find(function(x){return x.id===rid});
    return !!r;
  });
  if(!r||!r.fileKey)return;
  try{
    var stored=await fileGet(r.fileKey);
    if(!stored){showToast('Référence du fichier introuvable');return}
    var file=stored;
    if(stored&&typeof stored.getFile==='function'){
      file=await getPersistentFile(stored);
      if(!file){showToast('Autorisation refusée ou fichier déplacé');return}
    }
    if(!(file instanceof File) && !(file instanceof Blob)){
      showToast('Format de fichier local indisponible');return;
    }
    r.lastAccessedAt=new Date().toISOString();saveState();if(window.wwOpenFileInReader) window.wwOpenFileInReader(file,r.title||file.name,{resourceId:r.id,subjectId:sid,topicId:r.topic_id||null,name:r.title||file.name});
    else showToast('Lecteur interne indisponible');
  }catch(e){console.warn('Internal reader error',e);showToast('Impossible d’ouvrir le fichier')}
}


var state = window.WWState.create({subjects:MASTER_SUBJECTS, topics:TOPICS_SEED, languages:JSON.parse(JSON.stringify(LANGUAGES))});
// V63.6 — User-controlled Study Scope. Intelligence only operates inside the user's active scope.
state.studyScope=state.studyScope||{subjects:{},topics:{}};state.documentIntelligence=state.documentIntelligence||{resources:{},activeResourceId:null};state.resourceIntelligence=state.resourceIntelligence||{version:'65.21'};
var pomodoro = window.WWState.createPomodoro();
var wwFocusTopicId='';
try{wwFocusTopicId=localStorage.getItem('wwFocusTopicId')||''}catch(e){}
try{var wwPomoSaved=JSON.parse(localStorage.getItem('wwPomodoroSettings')||'null');if(wwPomoSaved){if(Number.isFinite(+wwPomoSaved.workTime))pomodoro.workTime=Math.max(1,Math.min(600,+wwPomoSaved.workTime));if(Number.isFinite(+wwPomoSaved.breakTime))pomodoro.breakTime=Math.max(0,Math.min(600,+wwPomoSaved.breakTime));pomodoro.freeMode=!!wwPomoSaved.freeMode;pomodoro.remaining=pomodoro.workTime*60;}}catch(e){}

// ============================================================
//  HELPERS
// ============================================================
function generateId(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
// V50 Foundation — local calendar helpers. Date-only app data must use the user's
// local calendar, not UTC, so midnight boundaries cannot shift a task to yesterday/tomorrow.
function wwLocalDateISO(date){var d=date instanceof Date?date:new Date(date);if(isNaN(d.getTime()))return '';return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function wwLocalMonthISO(date){var d=date instanceof Date?date:new Date(date);if(isNaN(d.getTime()))return '';return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')}
function wwDateAtLocalMidnight(iso){if(!iso)return null;var m=String(iso).match(/^(\d{4})-(\d{2})-(\d{2})$/);if(m)return new Date(+m[1],+m[2]-1,+m[3]);var d=new Date(iso);return isNaN(d.getTime())?null:d}
function wwReviewTimestamp(value){if(!value)return 0;var d=new Date(value);if(isNaN(d.getTime()))return 0;return d.getTime()}
function getLevelLabel(level){var l=['Pas commencé','Découverte','Compris','Maîtrise','Maîtrise solide'];return l[level]||'Inconnu'}
function getStatusClass(level){return 'status-'+Math.min(Math.max(level,0),4)}
function wwEnsureStudyScope(){
  if(!state.studyScope||typeof state.studyScope!=='object')state.studyScope={subjects:{},topics:{}};
  if(!state.studyScope.subjects||typeof state.studyScope.subjects!=='object')state.studyScope.subjects={};
  if(!state.studyScope.topics||typeof state.studyScope.topics!=='object')state.studyScope.topics={};
}
function wwSubjectTopics(subjectId){return state.topics.filter(function(t){return t.subject_id===subjectId})}
function wwSubjectActive(subjectId){wwEnsureStudyScope();var tops=wwSubjectTopics(subjectId);if(!tops.length)return state.studyScope.subjects[subjectId]===true;return tops.some(function(t){return state.studyScope.topics[t.id]===true})}
function wwTopicActive(topic){if(!topic)return false;wwEnsureStudyScope();if(Object.prototype.hasOwnProperty.call(state.studyScope.topics,topic.id))return state.studyScope.topics[topic.id]===true;return state.studyScope.subjects[topic.subject_id]===true}
function wwActiveTopics(){return state.topics.filter(function(t){return wwTopicActive(t)})}
function wwActiveSubjectCount(){return state.subjects.filter(function(s){return wwSubjectActive(s.id)}).length}
function wwActiveTopicCount(){return wwActiveTopics().length}
function wwSetSubjectScope(subjectId,active){wwEnsureStudyScope();var a=!!active;state.studyScope.subjects[subjectId]=a;wwSubjectTopics(subjectId).forEach(function(t){state.studyScope.topics[t.id]=a});saveState();render()}
function wwSetTopicScope(topicId,active){wwEnsureStudyScope();var t=state.topics.find(function(x){return x.id===topicId});if(!t)return;state.studyScope.topics[topicId]=!!active;var tops=wwSubjectTopics(t.subject_id);state.studyScope.subjects[t.subject_id]=tops.some(function(x){return state.studyScope.topics[x.id]===true});saveState();render()}
function wwActivateAllSubjectTopics(subjectId,active){wwEnsureStudyScope();var a=!!active;state.studyScope.subjects[subjectId]=a;wwSubjectTopics(subjectId).forEach(function(t){state.studyScope.topics[t.id]=a});saveState();render()}
function wwStudyScopeSummary(){return {subjects:wwActiveSubjectCount(),topics:wwActiveTopicCount()}}

function getProgress(topicId){return state.progress[topicId]||{level:0,score:0,last_studied:null,notes:''}}
function wwMasteryData(topicId){return window.WWMastery?window.WWMastery.ensure(state,topicId):null}
function wwMasteryScore(topicId){return window.WWMastery?window.WWMastery.score(state,topicId):computeMasteryScore(topicId)}
function wwMasteryRecommendedStage(topicId){return window.WWMastery?window.WWMastery.recommendedStage(state,topicId):getProgress(topicId).level}
function wwAdaptiveSummary(){return window.WWAdaptiveRevision?window.WWAdaptiveRevision.summary(state):{queue:[],total:0,estimatedMinutes:0,errors:0,topics:0}}
function getSubjectProgress(subjectId){var tops=state.topics.filter(function(t){return t.subject_id===subjectId});if(!tops.length)return 0;var total=0;tops.forEach(function(t){total+=getProgress(t.id).level});return Math.round((total/(tops.length*4))*100)}
function computeMasteryScore(topicId){var p=getProgress(topicId);return Math.min(p.level*25+20,100)}
function getTasksForToday(){var today=wwLocalDateISO(new Date());return state.tasks.filter(function(t){return t.date===today&&!t.isDone})}
function getScheduleStatus(){var now=new Date();var dn=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];var today=dn[now.getDay()];var cm=now.getHours()*60+now.getMinutes();var cls=COURSE_SCHEDULE.filter(function(c){return c.day===today});var cur=null,nxt=null;cls.forEach(function(c){var s=parseInt(c.start.split(':')[0])*60+parseInt(c.start.split(':')[1]);var e=parseInt(c.end.split(':')[0])*60+parseInt(c.end.split(':')[1]);if(cm>=s&&cm<e)cur=c});cls.forEach(function(c){var s=parseInt(c.start.split(':')[0])*60+parseInt(c.start.split(':')[1]);if(cm<s&&!nxt)nxt=c});return{currentClass:cur,nextClass:nxt}}
function computeSmartRevision(){var now=Date.now();var recs=[];wwActiveTopics().forEach(function(topic){var ign=state.ignoredTopics[topic.id];if(ign&&now<ign)return;var p=getProgress(topic.id);var ls=p.last_studied?new Date(p.last_studied).getTime():0;var days=Math.floor((now-ls)/86400000);var u=days*0.5+(4-p.level)*5;if(u>8&&days>0)recs.push({topicId:topic.id,subjectId:topic.subject_id,title:topic.title,level:p.level,daysSinceLastStudy:days,urgency:u})});recs.sort(function(a,b){return b.urgency-a.urgency});var g={};recs.forEach(function(r){if(!g[r.subjectId])g[r.subjectId]=[];g[r.subjectId].push(r)});return g}
function getLang(id){for(var i=0;i<state.languages.length;i++){if(state.languages[i].id===id)return state.languages[i]}return state.languages[0]}
function langProg(langId,lk){var L=getLang(langId);if(!L)return{done:0,total:0,percent:0};var lv=L.levels[lk];if(!lv||!lv.lessons.length)return{done:0,total:0,percent:0};var total=lv.lessons.length;var done=lv.lessons.filter(function(l){return state.langDone[langId+'_'+lk+'_'+l.num]}).length;return{done:done,total:total,percent:Math.round((done/total)*100)}}
function langIsDone(langId,lk,num){return !!state.langDone[langId+'_'+lk+'_'+num]}
function langCurrentLevel(langId){var L=getLang(langId);if(!L)return'A1';var keys=Object.keys(L.levels);var start=L.startLevel&&keys.indexOf(L.startLevel)>=0?keys.indexOf(L.startLevel):0;for(var i=start;i<keys.length;i++){if(langProg(langId,keys[i]).percent<100)return keys[i]}return keys[keys.length-1]}
function langTotalDone(langId){var c=0;for(var k in state.langDone){if(k.indexOf(langId+'_')===0)c++}return c}
function progTotalDone(){var c=0;for(var k in state.programming){if(state.programming[k]&&state.programming[k].level>0)c++}return c}
function showToast(msg){var t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.classList.add('show');setTimeout(function(){t.classList.remove('show')},2400)}
var navigate = window.WWRouter.create(state, render);

// ============================================================
//  ADVANCED STATS HELPERS
// ============================================================
function getDailyStudyMinutes(){
  var days={};
  state.sessions.forEach(function(s){
    if(!s.date)return;
    var d=s.date.slice(0,10);
    days[d]=(days[d]||0)+(s.duration||0);
  });
  state.tasks.forEach(function(t){
    if(t.isDone&&t.date){
      var d=t.date.slice(0,10);
      if(!days[d])days[d]=0;
    }
  });
  return days;
}
function getHeatmapData(){
  var days=getDailyStudyMinutes();
  var today=new Date();
  var result=[];
  var start=new Date(today);
  start.setDate(start.getDate()-364);
  // Ajuster au dimanche
  var offset=start.getDay();
  start.setDate(start.getDate()-offset);
  var totalDays=371;
  for(var i=0;i<totalDays;i++){
    var d=new Date(start);
    d.setDate(d.getDate()+i);
    if(d>today)break;
    var key=wwLocalDateISO(d);
    var min=days[key]||0;
    var level=0;
    if(min>=120)level=4;
    else if(min>=60)level=3;
    else if(min>=30)level=2;
    else if(min>0)level=1;
    result.push({date:key,minutes:min,level:level,weekday:d.getDay()});
  }
  return result;
}
function getWeeklyBarData(){
  // 7 derniers jours
  var days=[];
  var labels=['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
  var today=new Date();
  for(var i=6;i>=0;i--){
    var d=new Date(today);
    d.setDate(d.getDate()-i);
    var key=wwLocalDateISO(d);
    var min=getDailyStudyMinutes()[key]||0;
    days.push({label:labels[d.getDay()],minutes:min,date:key});
  }
  return days;
}
function getSubjectPieData(){
  var totals={};
  state.sessions.forEach(function(s){
    if(!s.subject_id)return;
    var subj=state.subjects.find(function(x){return x.id===s.subject_id});
    if(!subj)return;
    totals[subj.name]=(totals[subj.name]||0)+(s.duration||0);
  });
  var arr=Object.keys(totals).map(function(name){return{name:name,minutes:totals[name]}});
  arr.sort(function(a,b){return b.minutes-a.minutes});
  return arr.slice(0,6);
}
function getMonthlyLineData(){
  // 6 derniers mois : progression globale
  var months=[];
  var now=new Date();
  for(var i=5;i>=0;i--){
    var d=new Date(now.getFullYear(),now.getMonth()-i,1);
    var monthStr=wwLocalMonthISO(d);
    var monthSessions=state.sessions.filter(function(s){
      return s.date && s.date.slice(0,7)===monthStr;
    });
    var min=monthSessions.reduce(function(sum,s){return sum+(s.duration||0)},0);
    months.push({
      label:d.toLocaleDateString('fr-FR',{month:'short'}),
      hours:Math.round(min/60*10)/10,
      sessions:monthSessions.length
    });
  }
  return months;
}
function getTopStudyDays(){
  var days=getDailyStudyMinutes();
  var arr=Object.keys(days).map(function(date){return{date:date,minutes:days[date]}});
  arr.sort(function(a,b){return b.minutes-a.minutes});
  return arr.slice(0,5);
}
function getTotalStudyHours(){
  var min=state.sessions.reduce(function(sum,s){return sum+(s.duration||0)},0);
  return Math.round(min/60*10)/10;
}
function getWeeklyGoalProgress(){
  var days=getDailyStudyMinutes();
  var today=new Date();
  var weekTotal=0;
  for(var i=0;i<7;i++){
    var d=new Date(today);
    d.setDate(d.getDate()-i);
    var key=wwLocalDateISO(d);
    weekTotal+=(days[key]||0);
  }
  var goal=7*60; // 7h/semaine par défaut
  return {current:weekTotal,goal:goal,percent:Math.min(Math.round(weekTotal/goal*100),100)};
}
function getStudyStreakFromSessions(){
  var days=getDailyStudyMinutes();
  var today=new Date();
  var streak=0;
  for(var i=0;i<365;i++){
    var d=new Date(today);
    d.setDate(d.getDate()-i);
    var key=wwLocalDateISO(d);
    if(days[key]&&days[key]>0)streak++;
    else if(i>0)break;
  }
  return streak;
}
function getAveragePerDay(){
  var days=getDailyStudyMinutes();
  var keys=Object.keys(days);
  if(!keys.length)return 0;
  var total=keys.reduce(function(sum,k){return sum+days[k]},0);
  return Math.round(total/keys.length);
}

// ============================================================
//  SVG CHARTS GENERATORS
// ============================================================
function generateHeatmapSVG(){
  var data=getHeatmapData();
  if(!data.length)return '<div class="chart-empty">Pas assez de données</div>';
  var cellSize=12;
  var cellGap=3;
  var weeksCount=Math.ceil(data.length/7);
  var svgWidth=weeksCount*(cellSize+cellGap)+40;
  var svgHeight=7*(cellSize+cellGap)+30;
  var colors=['#1a2430','#1f4a2f','#2a6a3f','#3a8a4f','#6ae8a5'];
  
  var cells='';
  data.forEach(function(d,i){
    var week=Math.floor(i/7);
    var day=d.weekday;
    var x=30+week*(cellSize+cellGap);
    var y=20+day*(cellSize+cellGap);
    var color=colors[d.level];
    var tooltip=d.date+' : '+d.minutes+' min';
    cells+='<rect x="'+x+'" y="'+y+'" width="'+cellSize+'" height="'+cellSize+'" rx="2" fill="'+color+'"><title>'+tooltip+'</title></rect>';
  });
  
  // Mois labels
  var monthLabels='';
  var lastMonth=-1;
  data.forEach(function(d,i){
    var week=Math.floor(i/7);
    var date=new Date(d.date);
    var month=date.getMonth();
    if(month!==lastMonth&&date.getDate()<=7){
      var x=30+week*(cellSize+cellGap);
      var monthName=date.toLocaleDateString('fr-FR',{month:'short'});
      monthLabels+='<text x="'+x+'" y="12" fill="#6b7f9a" font-size="10">'+monthName+'</text>';
      lastMonth=month;
    }
  });
  
  return '<svg class="heatmap-svg" viewBox="0 0 '+svgWidth+' '+svgHeight+'" xmlns="http://www.w3.org/2000/svg">'+monthLabels+cells+'</svg>';
}
function generateBarChartSVG(){
  var data=getWeeklyBarData();
  var max=Math.max.apply(null,data.map(function(d){return d.minutes}))||60;
  var svgWidth=340,svgHeight=180;
  var chartTop=20,chartBottom=140,chartLeft=20,chartRight=320;
  var chartHeight=chartBottom-chartTop;
  var chartWidth=chartRight-chartLeft;
  var barWidth=30;
  var gap=(chartWidth-data.length*barWidth)/(data.length+1);
  
  var bars='';
  var labels='';
  var values='';
  data.forEach(function(d,i){
    var x=chartLeft+gap+(barWidth+gap)*i;
    var h=(d.minutes/max)*chartHeight;
    var y=chartBottom-h;
    bars+='<rect class="bar" x="'+x+'" y="'+y+'" width="'+barWidth+'" height="'+h+'" rx="3"><title>'+d.minutes+' min</title></rect>';
    labels+='<text class="bar-label" x="'+(x+barWidth/2)+'" y="'+(chartBottom+15)+'">'+d.label+'</text>';
    if(d.minutes>0){
      values+='<text class="bar-value" x="'+(x+barWidth/2)+'" y="'+(y-4)+'">'+d.minutes+'</text>';
    }
  });
  
  // Grille horizontale
  var grid='';
  for(var i=0;i<=4;i++){
    var y=chartBottom-(chartHeight/4)*i;
    var val=Math.round(max/4*i);
    grid+='<line x1="'+chartLeft+'" y1="'+y+'" x2="'+chartRight+'" y2="'+y+'" stroke="#1a2430" stroke-width="1"/>';
    grid+='<text x="0" y="'+(y+3)+'" fill="#4b5a72" font-size="9">'+val+'</text>';
  }
  
  return '<svg class="chart-svg bar-chart" viewBox="0 0 '+svgWidth+' '+svgHeight+'" xmlns="http://www.w3.org/2000/svg">'+grid+bars+values+labels+'</svg>';
}
function generatePieChartSVG(){
  var data=getSubjectPieData();
  if(!data.length)return '<div class="chart-empty">Aucune session enregistrée</div>';
  var total=data.reduce(function(sum,d){return sum+d.minutes},0);
  if(total===0)return '<div class="chart-empty">Aucune session enregistrée</div>';
  
  var colors=['#4b7bec','#6ae8a5','#e8cc6a','#e86a6a','#a86ae8','#8ba2c0'];
  var cx=140,cy=120,r=90;
  var currentAngle=-90;
  var slices='';
  var legend='';
  
  data.forEach(function(d,i){
    var angle=(d.minutes/total)*360;
    var startAngle=currentAngle;
    var endAngle=currentAngle+angle;
    var largeArc=angle>180?1:0;
    var x1=cx+r*Math.cos(startAngle*Math.PI/180);
    var y1=cy+r*Math.sin(startAngle*Math.PI/180);
    var x2=cx+r*Math.cos(endAngle*Math.PI/180);
    var y2=cy+r*Math.sin(endAngle*Math.PI/180);
    var pct=Math.round(d.minutes/total*100);
    var path='M '+cx+' '+cy+' L '+x1+' '+y1+' A '+r+' '+r+' 0 '+largeArc+' 1 '+x2+' '+y2+' Z';
    slices+='<path class="pie-slice" d="'+path+'" fill="'+colors[i%colors.length]+'"><title>'+d.name+' : '+d.minutes+' min ('+pct+'%)</title></path>';
    legend+='<div class="leg-item"><div class="leg-box" style="background:'+colors[i%colors.length]+'"></div>'+d.name+'</div>';
    currentAngle=endAngle;
  });
  
  // Cercle blanc au centre
  var svg='<svg class="chart-svg" viewBox="0 0 280 240" xmlns="http://www.w3.org/2000/svg">'+slices+'<circle cx="'+cx+'" cy="'+cy+'" r="40" fill="#111a24"/><text x="'+cx+'" y="'+(cy-4)+'" text-anchor="middle" fill="#8ba2c0" font-size="10">Total</text><text x="'+cx+'" y="'+(cy+12)+'" text-anchor="middle" fill="#e2e8f0" font-size="14" font-weight="700">'+Math.round(total/60)+'h</text></svg>';
  
  return svg+'<div class="chart-legend">'+legend+'</div>';
}
function generateLineChartSVG(){
  var data=getMonthlyLineData();
  var max=Math.max.apply(null,data.map(function(d){return d.hours}))||10;
  var svgWidth=340,svgHeight=180;
  var chartTop=20,chartBottom=140,chartLeft=30,chartRight=320;
  var chartHeight=chartBottom-chartTop;
  var chartWidth=chartRight-chartLeft;
  var stepX=chartWidth/(data.length-1);
  
  var points=[];
  data.forEach(function(d,i){
    var x=chartLeft+i*stepX;
    var y=chartBottom-(d.hours/max)*chartHeight;
    points.push({x:x,y:y,hours:d.hours,label:d.label});
  });
  
  var pathD=points.map(function(p,i){return(i===0?'M':'L')+' '+p.x+' '+p.y}).join(' ');
  var areaD=pathD+' L '+points[points.length-1].x+' '+chartBottom+' L '+points[0].x+' '+chartBottom+' Z';
  
  var dots='';
  var labels='';
  var values='';
  points.forEach(function(p){
    dots+='<circle class="line-dot" cx="'+p.x+'" cy="'+p.y+'" r="4" fill="#4b7bec" stroke="#111a24" stroke-width="2"><title>'+p.hours+'h</title></circle>';
    labels+='<text x="'+p.x+'" y="'+(chartBottom+15)+'" text-anchor="middle" fill="#8ba2c0" font-size="10">'+p.label+'</text>';
    if(p.hours>0){
      values+='<text x="'+p.x+'" y="'+(p.y-8)+'" text-anchor="middle" fill="#c8d6e5" font-size="10" font-weight="600">'+p.hours+'</text>';
    }
  });
  
  var grid='';
  for(var i=0;i<=4;i++){
    var y=chartBottom-(chartHeight/4)*i;
    var val=Math.round(max/4*i*10)/10;
    grid+='<line x1="'+chartLeft+'" y1="'+y+'" x2="'+chartRight+'" y2="'+y+'" stroke="#1a2430" stroke-width="1"/>';
    grid+='<text x="0" y="'+(y+3)+'" fill="#4b5a72" font-size="9">'+val+'h</text>';
  }
  
  return '<svg class="chart-svg" viewBox="0 0 '+svgWidth+' '+svgHeight+'" xmlns="http://www.w3.org/2000/svg">'+grid+'<path class="line-area" d="'+areaD+'" fill="#4b7bec"/>'+'<path class="line-path" d="'+pathD+'" stroke="#4b7bec"/>'+dots+values+labels+'</svg>';
}
function generateTopDaysHTML(){
  var data=getTopStudyDays();
  if(!data.length)return '<div class="chart-empty">Aucune donnée</div>';
  var max=data[0].minutes;
  var html='';
  data.forEach(function(d,i){
    var rankClass=i===0?'gold':i===1?'silver':i===2?'bronze':'';
    var pct=max?Math.round(d.minutes/max*100):0;
    html+='<div class="top-day"><div class="td-rank '+rankClass+'">'+(i+1)+'</div><div class="td-info"><div class="td-date">'+new Date(d.date).toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'short'})+'</div><div class="td-min">'+d.minutes+' min</div></div><div class="td-bar"><div class="td-fill" style="width:'+pct+'%"></div></div></div>';
  });
  return html;
}
function generateSubjectProgressHTML(){
  var data=state.subjects.map(function(s){
    return {name:s.name,progress:getSubjectProgress(s.id),icon:'📚'};
  });
  data.sort(function(a,b){return b.progress-a.progress});
  return data.map(function(s){
    var color=s.progress<30?'#e86a6a':s.progress<60?'#e8cc6a':'#6ae8a5';
    return '<div class="subj-adv"><div class="sa-icon">'+s.icon+'</div><div class="sa-info"><div class="sa-name">'+s.name+'</div><div class="sa-bar"><div class="sa-fill" style="width:'+s.progress+'%;background:'+color+'"></div></div></div><div class="sa-pct" style="color:'+color+'">'+s.progress+'%</div></div>';
  }).join('');
}

// ============================================================
//  NOTIFICATIONS
// ============================================================
function requestNotificationPermission(){if(!('Notification' in window))return Promise.resolve('unsupported');if(Notification.permission==='granted')return Promise.resolve('granted');if(Notification.permission==='denied')return Promise.resolve('denied');return Notification.requestPermission()}
function sendNotification(title,body,options){if(!state.settings||!state.settings.notifications)return;if(!('Notification' in window))return;if(Notification.permission!=='granted')return;try{var n=new Notification(title,Object.assign({body:body},options||{}));n.onclick=function(){window.focus();n.close()};return n}catch(e){}}
function computeNotifications(){var notifs=[];try{var now=new Date();var nowMinutes=now.getHours()*60+now.getMinutes();var today=wwLocalDateISO(new Date());var dayNames=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];var todayName=dayNames[now.getDay()];COURSE_SCHEDULE.filter(function(c){return c.day===todayName}).forEach(function(c){var startM=parseInt(c.start.split(':')[0])*60+parseInt(c.start.split(':')[1]);var diff=startM-nowMinutes;if(diff>0&&diff<=15)notifs.push({id:'class_'+c.subject+'_'+c.start+'_'+today,type:'urgent',icon:'⏰',title:'Cours dans '+diff+' min',text:c.subject+' à '+c.start,date:today})});(state.exams||[]).forEach(function(exam){try{var examDate=new Date(exam.date+'T'+(exam.time||'00:00'));var daysLeft=Math.ceil((examDate-now)/86400000);if(daysLeft===0)notifs.push({id:'exam_'+exam.id+'_today',type:'urgent',icon:'🔥',title:'Examen aujourd\'hui !',text:exam.title,date:exam.date});else if(daysLeft===1)notifs.push({id:'exam_'+exam.id+'_tomorrow',type:'urgent',icon:'⚠️',title:'Examen demain !',text:exam.title,date:exam.date});else if(daysLeft===3)notifs.push({id:'exam_'+exam.id+'_3days',type:'warning',icon:'📝',title:'Examen dans 3 jours',text:exam.title,date:exam.date})}catch(e){}});var todayTasks=(state.tasks||[]).filter(function(t){return t.date===today&&!t.isDone});if(todayTasks.length>0)notifs.push({id:'tasks_'+today,type:'info',icon:'📋',title:todayTasks.length+' tâche'+(todayTasks.length>1?'s':'')+' aujourd\'hui',text:todayTasks.slice(0,2).map(function(t){return t.text}).join(', '),date:today});var errDue=0;try{errDue=getErrorsDueToday().filter(function(e){var t=e.topic_id&&state.topics.find(function(x){return x.id===e.topic_id});return t?wwTopicActive(t):(e.subject_id?wwSubjectActive(e.subject_id):false)}).length}catch(e){}if(errDue>0)notifs.push({id:'errors_'+today,type:'warning',icon:'⚠️',title:errDue+' erreur'+(errDue>1?'s':'')+' à réviser',text:'Stats → Erreurs',date:today});var fcDue=0;try{state.languages.forEach(function(L){fcDue+=getCardsDueToday(L.id).length})}catch(e){}if(fcDue>0)notifs.push({id:'fc_'+today,type:'info',icon:'🃏',title:fcDue+' carte'+(fcDue>1?'s':'')+' à réviser',text:'Flashcards',date:today})}catch(e){}return notifs}
function updateNotifications(){try{var notifs=computeNotifications();state.notifications=notifs;if(state.settings&&state.settings.notifications&&('Notification' in window)&&Notification.permission==='granted'){var lastSent=state._lastSentNotifs||{};notifs.forEach(function(n){if(lastSent[n.id])return;if(n.type==='urgent'||n.type==='warning'){sendNotification(n.title,n.text,{tag:n.id});lastSent[n.id]=true}});state._lastSentNotifs=lastSent}}catch(e){}}
function getUnreadNotificationsCount(){var count=0;(state.notifications||[]).forEach(function(n){if(!state.readNotifications[n.id])count++});return count}
function markAllNotificationsRead(){(state.notifications||[]).forEach(function(n){state.readNotifications[n.id]=true});saveState()}

// ============================================================
//  ERRORS
// ============================================================
function getErrorsDueToday(){var now=Date.now();return (state.errors||[]).filter(function(e){if(!e.next_review)return true;return new Date(e.next_review).getTime()<=now})}
function getErrorsByStatus(status){if(status==='all')return state.errors||[];return (state.errors||[]).filter(function(e){return e.status===status})}
function computeErrorStats(){var s={to_review:0,in_progress:0,mastered:0};(state.errors||[]).forEach(function(e){if(s[e.status]!==undefined)s[e.status]++});return s}
function scheduleNextReview(error){var days=2;if(error.status==='in_progress')days=7;else if(error.status==='mastered')days=30;var d=new Date();d.setDate(d.getDate()+days);error.next_review=wwLocalDateISO(d)}
function addError(desc,subjectId,topicId,cause,correction,difficulty){var err={id:'err_'+generateId(),description:desc,subject_id:subjectId||null,topic_id:topicId||null,cause:cause||'other',correction:correction||'',difficulty:difficulty||'medium',status:'to_review',revisions:0,max_revisions:3,created_at:wwLocalDateISO(new Date()),last_reviewed:null,next_review:wwLocalDateISO(new Date())};state.errors.push(err);if(window.WWMastery)window.WWMastery.recordError(state,err.topic_id||null);scheduleNextReview(err);saveState();return err}
function reviewError(id,success){var err=(state.errors||[]).find(function(e){return e.id===id});if(!err)return;err.last_reviewed=wwLocalDateISO(new Date());if(window.WWMastery)window.WWMastery.recordReview(state,err.topic_id||null,success);if(success){err.revisions++;if(err.revisions>=err.max_revisions)err.status='mastered';else err.status='in_progress'}else{err.revisions=0;err.status='to_review'}scheduleNextReview(err);saveState()}
function getErrorSubjectName(err){if(err.subject_id){var s=(state.subjects||[]).find(function(x){return x.id===err.subject_id});if(s)return s.name}return 'Autre'}
function getCauseLabel(cause){var l={forgot_formula:'نسيت الصيغة',confusion:'خلط بين مفهومين',calculation:'خطأ في الحساب',reading:'سوء قراءة السؤال',methodology:'منهجية خاطئة',other:'سبب آخر'};return l[cause]||'Autre'}

// ============================================================
//  FLASHCARDS
// ============================================================
function getFlashcardsForLanguage(langId){if(!state.flashcards)state.flashcards={};var cards=state.flashcards[langId];if(!cards){cards=[];var L=getLang(langId);if(L){Object.keys(L.levels).forEach(function(lk){var lv=L.levels[lk];if(!lv.lessons)return;lv.lessons.forEach(function(lesson){cards.push({id:'fc_'+langId+'_'+lk+'_'+lesson.num,langId:langId,level:lk,lessonNum:lesson.num,question:'Que signifie "'+lesson.title+'" en '+L.name+'?',answer:lesson.sub+' — '+(lesson.learn&&lesson.learn[0]?lesson.learn[0]:'Voir la leçon'),hint:lesson.learn?lesson.learn.join(' · '):'',auto:true})})})}state.flashcards[langId]=cards;saveState()}return cards}
function getCardReviewInfo(langId,cardId){
  if(!state.fcReview)state.fcReview={};
  if(!state.fcReview[langId])state.fcReview[langId]={};
  if(!state.fcReview[langId][cardId]){
    state.fcReview[langId][cardId]={level:0,nextReview:wwLocalDateISO(new Date()),nextReviewAt:null,lastReview:null,repetitions:0};
  }
  var info=state.fcReview[langId][cardId];
  // V50 migration: old cards only had a date. Keep them valid and introduce an exact timestamp.
  if(info.nextReviewAt===undefined)info.nextReviewAt=null;
  return info;
}
function getCardsDueToday(langId){
  var cards=getFlashcardsForLanguage(langId),now=Date.now();
  return cards.filter(function(c){var info=getCardReviewInfo(langId,c.id);if(info.nextReviewAt){return wwReviewTimestamp(info.nextReviewAt)<=now}if(!info.nextReview)return true;var d=wwDateAtLocalMidnight(info.nextReview);return d?d.getTime()<=now:true});
}
function getCardsMastered(langId){var cards=getFlashcardsForLanguage(langId);return cards.filter(function(c){return getCardReviewInfo(langId,c.id).level>=3})}

// SMART REVIEW 2.0 — adaptive priority engine (read-only over Planning)
function wwSR2DaysUntilExam(exam){if(!exam||!exam.date)return 999;try{return Math.ceil((new Date(exam.date+'T'+(exam.time||'23:59')).getTime()-Date.now())/86400000)}catch(e){return 999}}
function wwSR2NearestExam(){return (state.exams||[]).filter(function(e){return wwSR2DaysUntilExam(e)>=0}).sort(function(a,b){return wwSR2DaysUntilExam(a)-wwSR2DaysUntilExam(b)})[0]||null}
function wwSR2CardScore(langId,card){var info=getCardReviewInfo(langId,card.id),now=Date.now(),dueAt=info.nextReviewAt?wwReviewTimestamp(info.nextReviewAt):(info.nextReview?wwDateAtLocalMidnight(info.nextReview).getTime():now),overdue=Math.max(0,now-dueAt)/86400000,score=0;score+=Math.min(42,overdue*14);score+=Math.max(0,(3-(Number(info.level)||0)))*10;score+=Math.min(15,Math.max(0,5-(Number(info.repetitions)||0))*3);if(info.lastReview){var since=(now-wwReviewTimestamp(info.lastReview))/86400000;if(since>3)score+=Math.min(10,since)}else score+=8;var ex=wwSR2NearestExam();if(ex){var days=wwSR2DaysUntilExam(ex);if(days<=7)score+=Math.max(0,12-days)}return Math.round(Math.min(100,score))}
function wwSR2Queue(langId,limit){return getCardsDueToday(langId).map(function(c){return{card:c,score:wwSR2CardScore(langId,c)}}).sort(function(a,b){return b.score-a.score}).slice(0,limit||12)}
function wwSR2Summary(langId){var q=wwSR2Queue(langId,999),errors=0;try{errors=getErrorsDueToday().length}catch(e){}var exam=wwSR2NearestExam();return{due:q.length,high:q.filter(function(x){return x.score>=65}).length,errors:errors,exam:exam,examDays:exam?wwSR2DaysUntilExam(exam):null,queue:q}}
function updateCardReview(langId,cardId,quality){
  var info=getCardReviewInfo(langId,cardId),now=new Date();
  info.lastReview=now.toISOString();
  info.nextReviewAt=null;
  if(quality==='again'){
    // Short relearning interval: 10 minutes, not 10 days.
    info.level=Math.max(0,info.level-1);
    info.nextReviewAt=new Date(now.getTime()+10*60*1000).toISOString();
    info.nextReview=wwLocalDateISO(now);
  }else if(quality==='hard'){
    info.level=Math.max(0,info.level-1);
    info.nextReview=wwLocalDateISO(now);
  }else if(quality==='ok'){
    info.level=Math.min(5,info.level+1);var days=info.level>=3?7:1;var d=new Date(now);d.setDate(d.getDate()+days);info.nextReview=wwLocalDateISO(d);
  }else if(quality==='easy'){
    info.level=Math.min(5,info.level+2);var days2=info.level>=4?30:(info.level>=2?7:3);var d2=new Date(now);d2.setDate(d2.getDate()+days2);info.nextReview=wwLocalDateISO(d2);
  }
  info.repetitions++;
  state.fcReview[langId][cardId]=info;
  saveState();
}

// ============================================================
//  RESOURCES
// ============================================================
function detectResourceType(url){var u=(url||'').toLowerCase();if(u.indexOf('youtube.com')!==-1||u.indexOf('youtu.be')!==-1)return 'video';if(u.indexOf('.pdf')!==-1)return 'pdf';if(u.indexOf('.doc')!==-1||u.indexOf('.docx')!==-1)return 'doc';if(u.indexOf('.jpg')!==-1||u.indexOf('.jpeg')!==-1||u.indexOf('.png')!==-1||u.indexOf('.gif')!==-1)return 'image';if(u.indexOf('.mp3')!==-1)return 'audio';if(u.indexOf('.mp4')!==-1)return 'video';return 'link'}
function getResourceIcon(type){var icons={pdf:'📄',doc:'📝',image:'🖼️',video:'🎥',audio:'🎵',link:'🔗',folder:'📁'};return icons[type]||'🔗'}
function getResourceTypeLabel(type){var labels={pdf:'PDF',doc:'Document',image:'Image',video:'Vidéo',audio:'Audio',link:'Lien'};return labels[type]||'Lien'}
function getDomainName(url){try{var u=new URL(url);return u.hostname.replace('www.','')}catch(e){return ''}}
function getAllResources(){var all=[];Object.keys(state.resources||{}).forEach(function(sid){var s=(state.subjects||[]).find(function(x){return x.id===sid});var folders=state.resources[sid]||{};Object.keys(folders).forEach(function(fn){(folders[fn]||[]).forEach(function(r){all.push(Object.assign({},r,{subjectName:s?s.name:'Matière',subjectId:sid,folder:fn,type:r.fileKey?(r.fileType||'pdf'):detectResourceType(r.url)}))})})});return all}
function getResourcesStats(){var all=getAllResources();var stats={total:all.length,favorites:0,studied:0,minutes:0,byType:{}};all.forEach(function(r){if(r.favorite)stats.favorites++;if(r.studied)stats.studied++;stats.minutes+=Number(r.studyMinutes||0);if(!stats.byType[r.type])stats.byType[r.type]=0;stats.byType[r.type]++});stats.completion=stats.total?Math.round(stats.studied/stats.total*100):0;return stats}
function filterResources(all){var list=all;if(state.resFilter!=='Tout'){if(state.resFilter==='⭐ Favoris')list=list.filter(function(r){return r.favorite});else list=list.filter(function(r){return r.type===state.resFilter})}if(state.resSearch.trim()){var q=state.resSearch.toLowerCase();list=list.filter(function(r){return (r.title||'').toLowerCase().indexOf(q)!==-1||(r.subjectName||'').toLowerCase().indexOf(q)!==-1})}return list}

// ============================================================
//  RENDER MAIN
// ============================================================
function wwPerfMark(name){try{if(window.performance&&performance.mark)performance.mark(name)}catch(e){}}
function render(){wwPerfMark('ww-render-start');if(window.WWEventBus)WWEventBus.emit('render:start',{route:state.route});try{var root=document.getElementById('root');if(!root)return;if(!state.onboardingDone){var onboardingHTML=renderOnboarding();if(window.WWRenderer)WWRenderer.mount(root,onboardingHTML);else root.innerHTML=onboardingHTML;wwUpgradeIcons(root);attachOnboarding();if(window.WWEventBus)WWEventBus.emit('render:complete',{route:state.route,onboarding:true});return}updateNotifications();var html=renderApp();var result=window.WWRenderer?WWRenderer.mount(root,html):null;if(!result)root.innerHTML=html;wwUpgradeIcons(root);attachAppEvents();wwRenderInstallHint();wwPerfMark('ww-render-end');if(window.WWEventBus)WWEventBus.emit('render:complete',{route:state.route,duration:result?result.duration:null})}catch(e){console.error('Render error:',e);var root=document.getElementById('root');if(root){var errHTML='<div style="padding:20px;color:#e86a6a;"><h2>⚠️ Erreur</h2><pre style="font-size:12px;white-space:pre-wrap;">'+e.message+'</pre><button onclick="location.reload()" style="margin-top:20px;background:#2a3f60;color:#fff;border:none;padding:10px 20px;border-radius:10px;">Recharger</button></div>';if(window.WWRenderer)WWRenderer.mount(root,errHTML);else root.innerHTML=errHTML}if(window.WWEventBus)WWEventBus.emit('render:error',{error:e,route:state.route})}}

function renderOnboarding(){
  var step=state.onboardingStep||0;
  var content='';
  if(step===0){content='<div class="onboarding-step-content"><div class="onboarding-icon onboarding-logo-v2"><img src="logo.svg" alt="White Wolf Scholar"></div><h1 class="onboarding-title">White Wolf Scholar</h1><p class="onboarding-subtitle">Study → Track → Analyze → Master</p><div class="onboarding-features"><div class="onboarding-feature"><span class="of-icon">📚</span><span class="of-text"><strong>Master APCE</strong> — 9 matières</span></div><div class="onboarding-feature"><span class="of-icon">🌱</span><span class="of-text"><strong>3 langues</strong> — A1 → C1</span></div><div class="onboarding-feature"><span class="of-icon">📊</span><span class="of-text"><strong>Stats avancées</strong> — Heatmap + Charts</span></div></div><button class="onboarding-btn" data-onboard-next>Suivant →</button></div>'}
  else if(step===1){content='<div class="onboarding-step-content"><div class="onboarding-icon">🎯</div><h1 class="onboarding-title">Ton objectif</h1><p class="onboarding-subtitle">Quel est ton but principal ?</p><div class="onboarding-goal-options"><div class="onboarding-goal '+(state.onboardingData.goal==='study'?'selected':'')+'" data-onboard-goal="study"><span class="og-icon">📚</span><span class="og-label">Étudier</span></div><div class="onboarding-goal '+(state.onboardingData.goal==='lang'?'selected':'')+'" data-onboard-goal="lang"><span class="og-icon">🌍</span><span class="og-label">Apprendre langues</span></div><div class="onboarding-goal '+(state.onboardingData.goal==='code'?'selected':'')+'" data-onboard-goal="code"><span class="og-icon">💻</span><span class="og-label">Programmer</span></div><div class="onboarding-goal '+(state.onboardingData.goal==='all'?'selected':'')+'" data-onboard-goal="all"><span class="og-icon">🚀</span><span class="og-label">Tout</span></div></div><button class="onboarding-btn" data-onboard-next>Suivant →</button><button class="onboarding-btn secondary" data-onboard-prev>← Retour</button></div>'}
  else if(step===2){content='<div class="onboarding-step-content"><div class="onboarding-icon">🔔</div><h1 class="onboarding-title">Notifications</h1><p class="onboarding-subtitle">Active les rappels pour ne rien manquer</p><div class="onboarding-features"><div class="onboarding-feature"><span class="of-icon">⏰</span><span class="of-text">Rappels de cours</span></div><div class="onboarding-feature"><span class="of-icon">📝</span><span class="of-text">Alertes examens</span></div><div class="onboarding-feature"><span class="of-icon">📋</span><span class="of-text">Tâches du jour</span></div></div><button class="onboarding-btn" data-onboard-finish>🐺 Commencer →</button><button class="onboarding-skip" data-onboard-skip>Plus tard</button></div>'}
  var dots='';
  for(var i=0;i<3;i++){var cls=i===step?'active':(i<step?'completed':'');dots+='<div class="onboarding-dot '+cls+'"></div>'}
  return '<div class="onboarding-wrap"><div class="onboarding-container"><div class="onboarding-progress">'+dots+'</div>'+content+'</div></div>';
}
function attachOnboarding(){var next=document.querySelector('[data-onboard-next]');if(next)next.onclick=function(){state.onboardingStep=(state.onboardingStep||0)+1;render()};var prev=document.querySelector('[data-onboard-prev]');if(prev)prev.onclick=function(){state.onboardingStep=Math.max(0,(state.onboardingStep||0)-1);render()};var skip=document.querySelector('[data-onboard-skip]');if(skip)skip.onclick=function(){finishOnboarding(false)};var finish=document.querySelector('[data-onboard-finish]');if(finish)finish.onclick=function(){finishOnboarding(true)};document.querySelectorAll('[data-onboard-goal]').forEach(function(el){el.onclick=function(){state.onboardingData.goal=this.dataset.onboardGoal;render()}})}
function finishOnboarding(enableNotifs){state.onboardingDone=true;state.onboardingStep=0;if(enableNotifs){state.settings.notifications=true;requestNotificationPermission().then(function(result){if(result==='granted')showToast('🔔 Notifications activées')})}else{state.settings.notifications=false}saveState();render()}

function renderApp(){
  var a=state.route;
  var inG=(a==='growth'||a==='quran'||a==='language'||a==='lesson'||a==='programming'||a==='flashcards');
  var unread=getUnreadNotificationsCount();
  var bellDot=unread>0?'<span class="notif-badge">'+unread+'</span>':'';
  return '<div class="app">'+
    '<div class="header"><h1 class="app-brand"><img class="app-logo" src="logo.svg" alt="White Wolf Scholar"> <span class="app-brand-text">White Wolf</span></h1>'+
      '<div style="position:relative;display:flex;align-items:center;gap:8px;">'+
        '<span class="settings-btn ww-global-search-trigger" data-global-search title="Recherche globale">⌕</span>'+
        '<span class="settings-btn" id="notif-trigger" style="position:relative;">🔔'+bellDot+'</span>'+
        '<span class="settings-btn" id="settings-trigger">⚙️</span>'+
        '<div class="settings-dropdown" id="settings-menu">'+
          '<div class="section-label">Préférences</div>'+
          '<div class="item" data-setting="showSmartRevision"><span class="icon">🧠</span> Recommandations <span class="toggle-status">'+(state.settings.showSmartRevision?'✅':'❌')+'</span></div>'+
          '<div class="item" data-setting="notifications"><span class="icon">🔔</span> Notifications <span class="toggle-status">'+(state.settings.notifications?'✅':'❌')+'</span></div>'+
          '<div class="divider"></div>'+
          '<div class="section-label">Actions</div>'+
          '<div class="item" data-modal="notifications"><span class="icon">📬</span> Centre de notifications</div>'+
          '<div class="item" data-modal="about"><span class="icon">ℹ️</span> À propos</div>'+
        '</div></div></div>'+
    renderContent(a)+
    '<nav class="bottom-nav">'+
      '<button class="'+(a==='dashboard'?'active':'')+'" data-route="dashboard"><span class="nav-icon">📊</span>Dashboard</button>'+
      '<button class="'+(a==='master'||a==='subject'||a==='topic'?'active':'')+'" data-route="master"><span class="nav-icon">📚</span>Master</button>'+
      '<button class="'+(inG?'active':'')+'" data-route="growth"><span class="nav-icon">🌱</span>Growth</button>'+
      '<button class="'+(a==='planning'?'active':'')+'" data-route="planning"><span class="nav-icon">📅</span>Planning</button>'+
      '<button class="'+(a==='stats'?'active':'')+'" data-route="stats"><span class="nav-icon">📈</span>Stats</button>'+
      '<button class="'+(a==='emploi'?'active':'')+'" data-route="emploi"><span class="nav-icon">📋</span>Emploi</button>'+
      '<button class="'+(a==='resources'?'active':'')+'" data-route="resources"><span class="nav-icon">📚</span>Ressources</button>'+
    '</nav></div>'+(state.modal?renderModal():'');
}

function renderContent(r){switch(r){case'dashboard':return renderDashboard();case'master':return renderMaster();case'study-scope':return renderStudyScope();case'subject':return renderSubject();case'topic':return renderTopic();case'growth':return renderGrowth();case'quran':return renderQuran();case'language':return renderLanguage();case'lesson':return renderLesson();case'programming':return renderProgramming();case'flashcards':return renderFlashcards();case'planning':return renderPlanning();case'stats':return renderStats();case'emploi':return renderEmploi();case'resources':return renderResources();default:return renderDashboard()}}

function getUpcomingExamsForDashboard(){
  var now=new Date();
  return (state.exams||[]).map(function(e){
    var raw=(e.date||'')+'T'+(e.time||'23:59');
    var d=new Date(raw);
    return {exam:e,dateObj:d,ts:d.getTime()};
  }).filter(function(x){return x.exam&&x.exam.date&&isFinite(x.ts)&&x.ts>=now.getTime()-60000})
    .sort(function(a,b){return a.ts-b.ts}).slice(0,3);
}
function getExamCountdownLabel(d){
  var now=new Date(), diff=d.getTime()-now.getTime();
  if(diff<=0)return 'En cours / maintenant';
  var mins=Math.floor(diff/60000), days=Math.floor(mins/1440), hours=Math.floor((mins%1440)/60), rem=mins%60;
  if(days>0)return 'Dans '+days+' jour'+(days>1?'s':'');
  if(hours>0)return 'Dans '+hours+' h'+(rem?' '+rem+' min':'');
  return 'Dans '+Math.max(1,rem)+' min';
}
// ============================================================
// WHITE WOLF V48 — DAILY MISSION + EXAM PREPARATION
// Planning Hebdo is the single source of truth. Daily Mission is
// derived live from the effective weekly plan; no second plan is stored.
// ============================================================
function wwTodayISO(){var d=new Date();var y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return y+'-'+m+'-'+day}
function wwDayKey(){return ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'][new Date().getDay()]}
function wwEscapeHTML(value){return String(value==null?'':value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;').replace(/'/g,'&#39;')}
function wwEffectivePlanning(){return Object.assign({},DEFAULT_SCHEDULE,state.customSchedule||{})}
function wwMissionHash(text){var str=wwTodayISO()+'|'+String(text||'').trim();var h=2166136261;for(var i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(36)}
function wwMissionItems(){var plan=wwEffectivePlanning(),raw=String(plan[wwDayKey()]||'').trim();if(!raw)return[];var parts=raw.split(/\s*(?:\+|•|;|\n)\s*/).map(function(x){return x.trim()}).filter(Boolean);if(!parts.length)parts=[raw];var done={};try{done=JSON.parse(localStorage.getItem('wwDailyMissionDone')||'{}')||{}}catch(e){done={}}return parts.map(function(text,idx){var id=wwMissionHash(idx+'|'+text);return{id:id,text:text,done:!!done[id]}})}
function wwSetMissionDone(id,done){var all={};try{all=JSON.parse(localStorage.getItem('wwDailyMissionDone')||'{}')||{}}catch(e){all={}}if(done)all[id]=true;else delete all[id];try{localStorage.setItem('wwDailyMissionDone',JSON.stringify(all))}catch(e){}}
function renderDailyMission(){var items=wwMissionItems(),done=items.filter(function(x){return x.done}).length,total=items.length,pct=total?Math.round(done/total*100):0;var label=total?(done===total?'Mission accomplie ✓':done+' / '+total+' terminé'+(done>1?'s':'')):'Aucun planning pour aujourd’hui';var rows=items.map(function(x){return '<div class="ww-mission-item '+(x.done?'is-done':'')+'"><button class="ww-mission-check" data-mission-done="'+x.id+'" data-done="'+(x.done?'1':'0')+'">'+(x.done?'✓':'○')+'</button><div class="ww-mission-text">'+x.text+'</div></div>'}).join('');return '<div class="ww-daily-mission card"><div class="ww-mission-head"><div><div class="card-title">🎯 Daily Mission</div><div class="ww-exams-sub">Basée directement sur ton Planning Hebdo</div></div><span class="ww-mission-percent">'+pct+'%</span></div><div class="ww-mission-bar"><div style="width:'+pct+'%"></div></div><div class="ww-mission-label">'+label+'</div>'+(rows||'<div class="text-muted text-small">Ajoute ton programme du jour dans Planning Hebdo.</div>')+'</div>'}
function wwFindExam(id){return(state.exams||[]).find(function(e){return e.id===id})||null}
function wwExamSubject(exam){return exam&&exam.subject_id?state.subjects.find(function(s){return s.id===exam.subject_id}):null}
function wwExamDays(exam){if(!exam||!exam.date)return null;var end=new Date(exam.date+'T'+(exam.time||'23:59'));return Math.ceil((end.getTime()-Date.now())/86400000)}
function wwExamPrepStats(exam){var sub=wwExamSubject(exam),topics=sub?state.topics.filter(function(t){return t.subject_id===sub.id}):[];var mastery=topics.length?Math.round(topics.reduce(function(a,t){return a+getProgress(t.id).level},0)/(topics.length*4)*100):null;var errors=sub?state.errors.filter(function(e){return e.subject_id===sub.id&&e.status!=='mastered'}).length:state.errors.filter(function(e){return e.status!=='mastered'}).length;var plan=wwMissionItems();return{sub:sub,topics:topics,mastery:mastery,errors:errors,plan:plan}}
function renderExamPreparation(exam){if(!exam)return '<div class="modal-overlay"><div class="modal-content"><span class="close-btn" data-close-modal>❌</span><h3>🎯 Examen introuvable</h3><div class="modal-actions"><button class="btn-primary" data-close-modal>Fermer</button></div></div></div>';var st=wwExamPrepStats(exam),days=wwExamDays(exam),date=new Date(exam.date+'T'+(exam.time||'09:00')).toLocaleDateString('fr-FR',{weekday:'long',day:'2-digit',month:'long'}),count=days===0?'Aujourd’hui':days===1?'Demain':days>1?'Dans '+days+' jours':'Examen en cours / passé';var topicRows=st.topics.slice().sort(function(a,b){return getProgress(a.id).level-getProgress(b.id).level}).slice(0,6).map(function(t){var p=getProgress(t.id),pct=p.level*25;return '<div class="ww-prep-topic"><div><div>'+t.title+'</div><span>Niveau '+p.level+'/4</span></div><div class="ww-prep-topic-bar"><i style="width:'+pct+'%"></i></div></div>'}).join('');var planHTML=st.plan.length?st.plan.map(function(x){return '<div class="ww-prep-plan-item">'+(x.done?'✓':'○')+' '+x.text+'</div>'}).join(''):'<div class="text-muted text-small">Aucune mission planifiée aujourd’hui.</div>';return '<div class="modal-overlay"><div class="modal-content ww-exam-prep-modal"><span class="close-btn" data-close-modal>❌</span><div class="ww-prep-kicker">WHITE WOLF / EXAM MODE</div><h3>🎯 '+exam.title+'</h3><div class="ww-prep-countdown">'+count+'</div><div class="ww-prep-date">📅 '+date+(exam.time?' · '+exam.time:'')+(exam.room?' · 📍 '+exam.room:'')+'</div>'+(st.sub?'<div class="ww-prep-subject">📚 '+st.sub.name+'</div>':'')+'<div class="ww-prep-grid"><div class="ww-prep-stat"><strong>'+(st.mastery===null?'—':st.mastery+'%')+'</strong><span>Maîtrise</span></div><div class="ww-prep-stat"><strong>'+st.errors+'</strong><span>Erreurs ouvertes</span></div><div class="ww-prep-stat"><strong>'+st.plan.filter(function(x){return x.done}).length+'/'+st.plan.length+'</strong><span>Mission du jour</span></div></div>'+(topicRows?'<div class="ww-prep-section"><div class="ww-prep-section-title">📚 Topics à consolider</div>'+topicRows+'</div>':'')+'<div class="ww-prep-section"><div class="ww-prep-section-title">📋 Planning du jour</div>'+planHTML+'</div><div class="ww-prep-note">Le mode examen ne modifie jamais ton Planning Hebdo. Il montre uniquement ton état de préparation par rapport à ce que tu as planifié.</div><div class="modal-actions"><button class="btn-primary" data-close-modal>Fermer</button></div></div></div>'}

function renderDashboardExams(){
  var upcoming=getUpcomingExamsForDashboard();
  if(!upcoming.length)return '';
  var rows=upcoming.map(function(x,i){
    var e=x.exam, sub=e.subject_id?state.subjects.find(function(s){return s.id===e.subject_id}):null;
    var isFirst=i===0;
    var cls=isFirst?' ww-exam-next':' ww-exam-row';
    var dateLabel=x.dateObj.toLocaleDateString('fr-FR',{weekday:'short',day:'2-digit',month:'short'});
    var timeLabel=e.time?' · '+e.time:'';
    var room=e.room?'<span class="ww-exam-meta-item">⌂ Salle '+e.room+'</span>':'';
    return '<div class="ww-dashboard-exam'+cls+'" data-route="planning">'+
      '<div class="ww-exam-icon">📝</div>'+
      '<div class="ww-exam-main"><div class="ww-exam-title">'+e.title+'</div>'+ 
      '<div class="ww-exam-meta"><span class="ww-exam-meta-item">📅 '+dateLabel+timeLabel+'</span>'+ (sub?'<span class="ww-exam-meta-item">📚 '+sub.name+'</span>':'')+room+'</div></div>'+ 
'<div class="ww-exam-countdown '+(isFirst?'primary':'')+'">'+getExamCountdownLabel(x.dateObj)+'</div>'+
      '<button class="ww-exam-prep-btn" data-exam-prep="'+e.id+'" title="Mode préparation">🎯</button>'+
      '</div>';
  }).join('');
  return '<div class="ww-dashboard-exams card"><div class="ww-exams-head"><div><div class="card-title">📝 Examens à venir</div><div class="ww-exams-sub">Tes prochaines échéances</div></div><button class="btn-small btn-outline" data-route="planning">Voir tout</button></div>'+rows+'</div>';
}

// ============================================================
// WHITE WOLF V63.2 — ACADEMIC INTELLIGENCE 3.0
// Academic Command Center: Planning + Sessions + Errors + Mastery + Exams + Tasks + Mission.
// Recommendations are explainable and never modify the Planning Hebdo.
// ============================================================
function wwIntelDateKey(){return wwLocalDateISO(new Date())}
function wwIntelTodaySessions(){var today=wwIntelDateKey();return (state.sessions||[]).filter(function(x){return String(x.date||'').slice(0,10)===today})}
function wwIntelWeekSessions(){var now=new Date(),start=new Date(now);start.setHours(0,0,0,0);start.setDate(start.getDate()-6);var min=start.getTime();return (state.sessions||[]).filter(function(x){var d=new Date(String(x.date||'').slice(0,10)+'T12:00');return isFinite(d.getTime())&&d.getTime()>=min&&d.getTime()<=Date.now()})}
function wwIntelMission(){var items=wwMissionItems();return{items:items,done:items.filter(function(x){return x.done}).length,total:items.length}}
function wwIntelUpcomingExam(){var list=getUpcomingExamsForDashboard();return list.length?list[0]:null}
function wwIntelExamRisk(exam){if(!exam)return 0;var days=wwExamDays(exam),st=wwExamPrepStats(exam),risk=0;if(days!==null){if(days<=0)risk+=50;else if(days<=1)risk+=42;else if(days<=3)risk+=34;else if(days<=7)risk+=24;else if(days<=14)risk+=12}if(st.mastery!==null)risk+=Math.max(0,30-st.mastery*.3);risk+=Math.min(20,st.errors*4);return Math.round(risk)}
function wwIntelWeakTopic(){var best=null,score=-1;state.topics.forEach(function(t){var p=getProgress(t.id),days=p.last_studied?Math.floor((Date.now()-new Date(p.last_studied).getTime())/86400000):99;var v=(4-p.level)*6+Math.min(10,Math.max(0,days*.5));if(v>score){score=v;best={topic:t,progress:p,days:days,priority:v}}});return best}
function wwIntelWeakSubject(){var best=null,score=-1;state.subjects.forEach(function(sub){var topics=state.topics.filter(function(t){return t.subject_id===sub.id});if(!topics.length)return;var avg=topics.reduce(function(a,t){return a+getProgress(t.id).level},0)/topics.length;var errors=(state.errors||[]).filter(function(e){return e.subject_id===sub.id&&e.status!=='mastered'}).length;var sessions=(state.sessions||[]).filter(function(x){return x.subject_id===sub.id}).length;var v=(4-avg)*18+errors*5+(sessions===0?5:0);if(v>score){score=v;best={subject:sub,avg:avg,errors:errors,sessions:sessions,priority:v}}});return best}
function wwIntelSnapshot(){var mission=wwIntelMission(),today=wwIntelTodaySessions(),week=wwIntelWeekSessions(),exam=wwIntelUpcomingExam(),examRisk=wwIntelExamRisk(exam?exam.exam:null),errors=getErrorsDueToday(),weak=wwIntelWeakTopic(),weakSubject=wwIntelWeakSubject(),tasks=getTasksForToday(),sc=getScheduleStatus();var weeklyMinutes=week.reduce(function(a,x){return a+(Number(x.duration)||0)},0),todayMinutes=today.reduce(function(a,x){return a+(Number(x.duration)||0)},0);return{mission:mission,todaySessions:today.length,todayMinutes:todayMinutes,weekSessions:week.length,weeklyMinutes:weeklyMinutes,exam:exam,examRisk:examRisk,errors:errors,weak:weak,weakSubject:weakSubject,tasks:tasks,currentClass:sc.currentClass,nextClass:sc.nextClass}}
function wwIntelClamp(n,min,max){return Math.max(min,Math.min(max,n))}
function wwIntelScoreSignals(s){var out=[],examScore=0,missionScore=0,errorScore=0,topicScore=0,taskScore=0,momentumScore=0;if(s.exam){var d=wwExamDays(s.exam.exam),risk=s.examRisk;var urgency=d===null?0:(d<=0?45:d<=1?40:d<=3?32:d<=7?22:d<=14?12:4);examScore=wwIntelClamp(urgency+Math.min(35,risk*.55),0,100);out.push({key:'exam',label:'Examen',score:Math.round(examScore),detail:d===null?'échéance proche':(d<=1?'≤ 1 jour':d+' jours')})}if(s.mission.total){var pct=s.mission.done/s.mission.total;missionScore=wwIntelClamp((1-pct)*70+(s.mission.done===0?8:0)+(s.todaySessions===0?10:0),0,100);out.push({key:'mission',label:'Mission',score:Math.round(missionScore),detail:s.mission.done+'/'+s.mission.total})}if(s.errors.length){errorScore=wwIntelClamp(28+s.errors.length*10+(s.todaySessions===0?8:0),0,100);out.push({key:'errors',label:'Erreurs',score:Math.round(errorScore),detail:s.errors.length+' dues'})}if(s.weak&&s.weak.progress.level<4){topicScore=wwIntelClamp((4-s.weak.progress.level)*15+Math.min(20,s.weak.days*1.1),0,100);out.push({key:'topic',label:'Point faible',score:Math.round(topicScore),detail:'Niv. '+s.weak.progress.level+'/4'})}if(s.tasks.length){taskScore=wwIntelClamp(18+s.tasks.length*8+(s.todaySessions===0?8:0),0,75);out.push({key:'tasks',label:'Tâches',score:Math.round(taskScore),detail:s.tasks.length+' ouvertes'})}var target=7,weekly=Math.min(1,s.weekSessions/target),minBoost=Math.min(20,s.weeklyMinutes/30);momentumScore=wwIntelClamp(12+weekly*35+minBoost,0,70);out.push({key:'momentum',label:'Momentum',score:Math.round(momentumScore),detail:s.weekSessions+' sessions / 7j'});return out}
function wwIntelligenceNextAction(s){var signals=wwIntelScoreSignals(s),best=signals[0];signals.forEach(function(x){if(x.score>best.score)best=x});if(best.key==='exam'&&s.exam)return{type:'exam',title:'Prépare ton prochain examen',desc:s.exam.exam.title+' · '+getExamCountdownLabel(s.exam.dateObj),reason:'Urgence de l’échéance + état de préparation de la matière.',source:['Exams','Mastery','Errors','Planning'],icon:'🎯',button:'Mode préparation',score:best.score,signals:signals};if(best.key==='mission')return{type:'mission',title:'Termine ta mission du jour',desc:s.mission.done+' / '+s.mission.total+' éléments du Planning Hebdo terminés.',reason:'Le Planning Hebdo définit l’intention du jour et la Mission en mesure l’exécution.',source:['Planning','Daily Mission','Sessions'],icon:'📋',button:'Voir la mission',score:best.score,signals:signals};if(best.key==='errors')return{type:'errors',title:'Révise tes erreurs dues',desc:s.errors.length+' erreur'+(s.errors.length>1?'s':'')+' attend'+(s.errors.length>1?'ent':'')+' une révision.',reason:'Des erreurs sont actuellement dues et constituent un signal académique actif.',source:['Errors','Review','Mastery'],icon:'⚠️',button:'Réviser les erreurs',score:best.score,signals:signals};if(best.key==='topic'&&s.weak){var sub=state.subjects.find(function(x){return x.id===s.weak.topic.subject_id});return{type:'topic',title:'Renforce un point faible',desc:s.weak.topic.title+' · Niveau '+s.weak.progress.level+'/4',reason:'Maîtrise basse combinée à une ancienneté de travail élevée.',source:['Mastery','Sessions','Topics'],icon:'🧠',button:'Ouvrir la matière',subjectId:s.weak.topic.subject_id,score:best.score,signals:signals}}if(best.key==='tasks')return{type:'tasks',title:'Nettoie tes tâches du jour',desc:s.tasks.length+' tâche'+(s.tasks.length>1?'s':'')+' encore ouverte'+(s.tasks.length>1?'s':''),reason:'Des tâches prévues aujourd’hui ne sont pas encore terminées.',source:['Tasks','Planning'],icon:'✅',button:'Voir Planning',score:best.score,signals:signals};if(s.weekSessions>0)return{type:'momentum',title:'Consolide ton momentum',desc:s.weekSessions+' session'+(s.weekSessions>1?'s':'')+' cette semaine · '+s.weeklyMinutes+' min',reason:'Aucune urgence forte détectée ; le signal disponible est la régularité.',source:['Sessions','Analytics'],icon:'🔥',button:'Voir les Stats',score:best.score,signals:signals};return{type:'start',title:'Lance une première session',desc:'Aucune session enregistrée cette semaine.',reason:'Le moteur ne dispose pas encore d’un signal d’activité récent.',source:['Sessions','Planning'],icon:'🚀',button:'Voir le Master',score:best.score,signals:signals}}
function wwIntelSourceChips(sources){return '<div class="ww-intel-sources"><span class="ww-intel-source-label">Sources</span>'+sources.map(function(x){return '<span class="ww-intel-source">'+x+'</span>'}).join('')+'</div>'}
function renderIntelligenceBrief(){var s=wwIntelSnapshot(),a=wwIntelligenceNextAction(s),action='';if(a.type==='exam'&&s.exam)action='<button class="ww-intel-action btn-primary" data-exam-prep="'+s.exam.exam.id+'">'+a.button+' →</button>';else if(a.type==='errors')action='<button class="ww-intel-action btn-primary" data-route="stats" data-intel-stats="errors">'+a.button+' →</button>';else if(a.type==='topic')action='<button class="ww-intel-action btn-primary" data-route="subject" data-subject-id="'+a.subjectId+'">'+a.button+' →</button>';else if(a.type==='tasks'||a.type==='mission')action='<button class="ww-intel-action btn-primary" data-route="planning">'+a.button+' →</button>';else if(a.type==='momentum')action='<button class="ww-intel-action btn-primary" data-route="stats">'+a.button+' →</button>';else action='<button class="ww-intel-action btn-primary" data-route="master">'+a.button+' →</button>';var bars=a.signals.filter(function(x){return x.key!=='momentum'||x.score>15}).sort(function(x,y){return y.score-x.score}).slice(0,5).map(function(x){return '<div class="ww-intel-signal"><div><span>'+x.label+'</span><small>'+x.detail+'</small></div><b>'+x.score+'</b><i><em style="width:'+x.score+'%"></em></i></div>'}).join('');var examLine=s.exam?'<span>🎯 '+s.exam.exam.title+' · '+getExamCountdownLabel(s.exam.dateObj)+'</span>':'<span>🎯 Aucun examen à venir</span>';var classLine=s.currentClass?'<span>🔴 Cours en cours · '+s.currentClass.subject+'</span>':s.nextClass?'<span>⏳ Prochain cours · '+s.nextClass.subject+' à '+s.nextClass.start+'</span>':'<span>☕ Aucun cours imminent</span>';var weakLine=s.weak?'<span>🧠 Point faible · '+s.weak.topic.title+' · Niv. '+s.weak.progress.level+'/4</span>':'<span>🧠 Aucun point faible détecté</span>';return '<div class="ww-intelligence card"><div class="ww-intel-head"><div><div class="card-title">🧠 Academic Command Center</div><div class="ww-intel-sub">Intelligence 3.0 · recommandations explicables · Planning Hebdo inchangé</div></div><span class="ww-intel-live">LIVE</span></div><div class="ww-intel-command-grid"><div class="ww-command-stat"><strong>'+s.mission.done+'/'+s.mission.total+'</strong><span>🎯 Mission</span></div><div class="ww-command-stat"><strong>'+s.weeklyMinutes+' min</strong><span>⏱️ Focus / 7j</span></div><div class="ww-command-stat"><strong>'+s.weekSessions+'</strong><span>📚 Sessions / 7j</span></div><div class="ww-command-stat"><strong>'+s.errors.length+'</strong><span>⚠️ Erreurs dues</span></div></div><div class="ww-intel-context">'+classLine+examLine+weakLine+'</div><div class="ww-intel-main"><div class="ww-intel-icon">'+a.icon+'</div><div class="ww-intel-copy"><div class="ww-intel-title">'+a.title+'</div><div class="ww-intel-desc">'+a.desc+'</div><div class="ww-intel-reason"><b>Pourquoi :</b> '+a.reason+'</div>'+wwIntelSourceChips(a.source)+'</div></div>'+action+'<div class="ww-intel-score-head"><span>Priority Score</span><strong>'+a.score+'/100</strong></div><div class="ww-intel-signals-grid">'+bars+'</div><div class="ww-intel-signals"><span>📋 '+s.tasks.length+' tâche'+(s.tasks.length!==1?'s':'')+' ouverte'+(s.tasks.length!==1?'s':'')+'</span><span>⏱️ Aujourd’hui '+s.todayMinutes+' min</span><span>📈 Planning → Exécution → Intelligence</span></div></div>'}

function wwFocusTopic(){return state.topics.find(function(t){return t.id===wwFocusTopicId})||null}
function wwSetFocusTopic(id){wwFocusTopicId=id||'';try{if(wwFocusTopicId)localStorage.setItem('wwFocusTopicId',wwFocusTopicId);else localStorage.removeItem('wwFocusTopicId')}catch(e){};render()}
function wwLogCompletedFocus(){var topic=wwFocusTopic();if(!topic)return false;var duration=Math.max(1,Math.round((pomodoro.workTime||25)));var today=wwLocalDateISO(new Date());state.sessions.push({id:generateId(),topic_id:topic.id,subject_id:topic.subject_id||null,date:today,duration:duration,source:'focus',started_at:new Date().toISOString(),ended_at:new Date(Date.now()+duration*60000).toISOString()});if(window.WWMastery)window.WWMastery.recordSession(state,topic.id,duration);state.xp+=10;var pr=getProgress(topic.id);pr.last_studied=today;pr.score=wwMasteryScore(topic.id);state.progress[topic.id]=pr;saveState();showToast('🎯 Session Focus enregistrée · +10 XP');return true}
function renderFocusCockpit(){var selected=wwFocusTopic();var options='<option value="">Choisir un chapitre à travailler…</option>'+wwActiveTopics().map(function(t){var sub=state.subjects.find(function(x){return x.id===t.subject_id});return '<option value="'+t.id+'" '+(t.id===wwFocusTopicId?'selected':'')+'>'+(sub?sub.name+' · ':'')+t.title+'</option>'}).join('');return '<div class="ww-focus-cockpit card"><div class="ww-focus-head"><div><div class="card-title">🎯 Focus Session</div><div class="ww-focus-sub">Lie ton minuteur à un chapitre pour enregistrer automatiquement la session.</div></div><span class="ww-focus-badge">V63.2</span></div><div class="ww-focus-row"><select id="ww-focus-topic">'+options+'</select><button class="btn-primary btn-small" data-focus-apply>Associer</button></div>'+(selected?'<div class="ww-focus-selected">📚 '+selected.title+' <span>· Niveau '+getProgress(selected.id).level+'/4</span></div>':'<div class="ww-focus-empty">Aucun chapitre associé. Le minuteur reste utilisable normalement.</div>')+'</div>'}
function renderDashboard(){
  var tt=state.topics.length;
  var pr=state.topics.filter(function(t){return getProgress(t.id).level>0}).length;
  var ov=tt?Math.round((pr/tt)*100):0;
  var tasks=getTasksForToday();
  var mins=Math.floor(pomodoro.remaining/60),secs=pomodoro.remaining%60;
  var ts=(mins<10?'0':'')+mins+':'+(secs<10?'0':'')+secs;
  var sc=getScheduleStatus();
  var rev=computeSmartRevision();
  var hasRev=Object.keys(rev).length>0;
  var xpL=Math.floor(state.xp/100)+1,xpI=state.xp%100;
  var lg=langTotalDone('de')+langTotalDone('en')+langTotalDone('es');
  var pg=progTotalDone();
  var errDue=getErrorsDueToday().filter(function(e){var t=e.topic_id&&state.topics.find(function(x){return x.id===e.topic_id});return t?wwTopicActive(t):(e.subject_id?wwSubjectActive(e.subject_id):false)}).length;
  var notifs=state.notifications||[];
  var urgentNotifs=notifs.filter(function(n){return n.type==='urgent'||n.type==='warning'});
  var wwHero='<section class="ww-dashboard-hero">'+
    '<div class="ww-hero-overlay"></div>'+
    '<div class="ww-hero-content">'+
      '<div class="ww-hero-kicker"><span class="ww-hero-line"></span> WHITE WOLF / STUDY SYSTEM</div>'+
      '<h2>White Wolf Scholar</h2>'+
      '<p>Focus today,<br><span class="hero-motto-accent">Win tomorrow</span></p>'+
    '</div>'+
    
  '</section>';
  return '<div class="dashboard-shell">'+wwHero+
    (urgentNotifs.length>0?'<div class="notif-widget" data-modal="notifications"><div class="nw-top"><span class="nw-icon">🔔</span><span class="nw-title">Notifications</span><span class="nw-count">'+urgentNotifs.length+'</span></div><div class="nw-list">'+urgentNotifs.slice(0,3).map(function(n){return '<div class="nw-item"><span class="nw-item-dot '+(n.type==='urgent'?'urgent':n.type==='warning'?'warning':'info')+'"></span>'+n.icon+' '+n.title+'</div>'}).join('')+'</div></div>':'')+
    '<div class="card" style="padding:14px;"><div class="card-title" style="margin-bottom:8px;">📋 Emploi du temps</div><div class="schedule-status-container">'+
      (sc.currentClass?'<div class="schedule-status-item"><div class="status-icon">🔴</div><div><div class="status-text">En cours : '+sc.currentClass.subject+'</div><div class="status-sub">'+sc.currentClass.start+' - '+sc.currentClass.end+(sc.currentClass.room?' · Salle '+sc.currentClass.room:'')+'</div></div></div>':'')+
      (sc.nextClass?'<div class="schedule-status-item"><div class="status-icon">⏳</div><div><div class="status-text">Prochain : '+sc.nextClass.subject+'</div><div class="status-sub">À '+sc.nextClass.start+(sc.nextClass.room?' · Salle '+sc.nextClass.room:'')+'</div></div></div>':'<div class="schedule-status-item"><div class="status-icon">☕</div><div><div class="status-text">Aucun cours</div></div></div>')+
    '</div></div>'+
    renderDailyMission()+
    renderIntelligenceBrief()+
    renderDashboardExams()+
    (errDue>0?'<div class="err-widget" data-route="stats" data-stats-tab="errors"><div class="ew-top"><div class="ew-icon">⚠️</div><div class="ew-title">Erreurs à revoir</div><div class="ew-count">'+errDue+'</div></div><div class="ew-sub">Clique pour réviser</div></div>':'')+
    '<div class="card" style="background:linear-gradient(135deg,#16222e,#111a24);"><div class="flex-between"><div><div style="font-size:12px;color:#8ba2c0;">XP</div><div style="font-size:26px;font-weight:700;color:#e8cc6a;">'+state.xp+'</div></div><div style="text-align:right;"><div style="font-size:12px;color:#8ba2c0;">NIVEAU '+xpL+'</div><div style="font-size:13px;color:#8fb3e6;">'+xpI+'/100</div></div></div><div class="progress-bar" style="margin-top:10px;"><div class="fill" style="width:'+xpI+'%;background:linear-gradient(90deg,#4b7bec,#e8cc6a);"></div></div></div>'+
    '<div class="card"><div class="card-title">Progression <span class="badge">'+ov+'%</span></div><div class="progress-bar"><div class="fill" style="width:'+ov+'%;"></div></div><div class="flex-between text-small" style="margin-top:6px;"><span>'+pr+'/'+tt+' chapitres</span><span>'+lg+' leçons · '+pg+' prog</span></div></div>'+
    '<div class="card"><div class="card-title">📋 Tâches du jour <span class="badge">'+new Date().toLocaleDateString('fr-FR')+'</span></div>'+
      (tasks.length?tasks.map(function(t){return '<div class="task-item"><div class="task-left"><div class="task-text">'+t.text+'</div><div class="task-meta">'+(t.time||'')+' • '+t.priority+'</div></div><div class="task-right"><span class="task-priority '+t.priority+'">'+t.priority+'</span><button class="btn-small btn-outline" data-task-done="'+t.id+'">✅</button><button class="btn-small btn-outline" data-task-delete="'+t.id+'">🗑️</button></div></div>'}).join(''):'<div class="text-muted text-small">Aucune tâche.</div>')+
    '</div>'+
    (hasRev&&state.settings.showSmartRevision?'<div class="card"><div class="card-title">🧠 À réviser <span class="badge">'+Object.keys(rev).reduce(function(a,k){return a+rev[k].length},0)+'</span></div>'+Object.keys(rev).map(function(sid){var items=rev[sid];var s=state.subjects.find(function(x){return x.id===sid});return '<div class="revision-group"><div class="revision-group-header" data-group-toggle="'+sid+'"><div><span class="group-title">📖 '+(s?s.name:'Matière')+'</span><span class="group-meta"> • '+items.length+'</span></div><span class="group-meta">▼</span></div><div class="revision-group-body" id="body-'+sid+'">'+items.map(function(r){return '<div class="revision-item"><div><div class="name">'+r.title+'</div><div class="sub">📅 '+r.daysSinceLastStudy+' jours · Niveau '+r.level+'/4</div></div><button class="btn-small btn-outline" data-session-topic="'+r.topicId+'">🔄</button></div>'}).join('')+'</div></div>'}).join('')+'</div>':'')+
    renderAdaptiveRevisionCard()+renderFocusCockpit()+    '<div class="card"><div class="card-title">⏱️ Pomodoro <span class="badge">'+(pomodoro.freeMode?'⏱️ Minuteur':(pomodoro.isBreak?'☕ Pause':'📖 Travail'))+'</span></div><div class="pomodoro-container"><div class="timer-display">'+ts+'</div><div class="timer-controls">'+(!pomodoro.isRunning?'<button class="btn-start" data-pomo-start>▶️ Démarrer</button>':'<button class="btn-start running" data-pomo-pause>⏸️ Pause</button>')+'<button class="btn-stop" data-pomo-stop>⏹️ Arrêter</button><button class="btn-reset" data-pomo-reset>↺ Reset</button></div><div class="pomo-settings"><div class="pomo-settings-title">Réglage du temps</div><div class="pomo-duration-grid"><label>Travail (min)<input id="pomo-work-min" type="number" min="1" max="600" step="1" value="'+pomodoro.workTime+'"></label><label>Pause (min)<input id="pomo-break-min" type="number" min="0" max="600" step="1" value="'+pomodoro.breakTime+'"></label></div><label class="pomo-free-toggle"><input id="pomo-free-mode" type="checkbox" '+(pomodoro.freeMode?'checked':'')+'> <span>Mode minuteur libre — ne bascule pas automatiquement</span></label><button class="btn-pomo-apply" data-pomo-apply>Appliquer</button></div></div></div>'+
  '</div>';
}

function renderMaster(){
  wwEnsureStudyScope();var sum=wwStudyScopeSummary();
  var cards=state.subjects.map(function(s){var tops=state.topics.filter(function(t){return t.subject_id===s.id}),activeT=tops.filter(wwTopicActive).length,sa=wwSubjectActive(s.id),icon=wwSubjectScopeIcon(s.id);return '<div class="subject-card ww-scope-card" data-subject-id="'+s.id+'"><div class="ww-scope-mobile-row"><div class="ww-scope-mobile-icon">'+icon+'</div><div class="ww-scope-mobile-main"><div class="ww-scope-mobile-title">'+s.name+'</div><div class="ww-scope-mobile-code">'+s.code+'</div><div class="ww-scope-mobile-progress"><span>'+getSubjectProgress(s.id)+'%</span><div class="progress-bar"><div class="fill" style="width:'+getSubjectProgress(s.id)+'%;"></div></div><span>'+activeT+'/'+tops.length+'</span></div></div><button class="ww-scope-toggle '+(sa?'active':'')+'" data-scope-subject="'+s.id+'">'+(sa?'✓ Active':'○ Inactive')+'</button><span class="ww-scope-mobile-chevron">›</span></div><div class="ww-scope-desktop-content"><div class="ww-scope-head"><div><h4>'+s.name+'</h4><div class="sub-meta"><span>'+getSubjectProgress(s.id)+'%</span><span>'+s.code+'</span></div></div><button class="ww-scope-toggle '+(sa?'active':'')+'" data-scope-subject="'+s.id+'">'+(sa?'✓ Active':'○ Inactive')+'</button></div><div class="progress-bar" style="margin-top:6px;"><div class="fill" style="width:'+getSubjectProgress(s.id)+'%;"></div></div><div class="ww-scope-meta">'+activeT+'/'+tops.length+' chapitres actifs</div></div></div>'}).join('');
  return '<div><div class="ww-scope-banner card"><div><div class="card-title">🎯 Mon périmètre d’étude</div><p class="text-muted text-small">Tu choisis librement les matières et chapitres actifs. Les notifications et l’intelligence adaptative travaillent uniquement sur ce périmètre.</p></div><div class="ww-scope-counter"><strong>'+sum.topics+'</strong><span>chapitres actifs</span></div></div><div class="ww-scope-actions"><button class="btn-outline btn-small" data-scope-all="1">Tout activer</button><button class="btn-outline btn-small" data-scope-none="1">Tout désactiver</button></div><div class="subject-grid">'+cards+'</div></div>'
}
function wwSubjectScopeIcon(id){var m={s1:'⚛️',s2:'🔬',s3:'⚗️',s4:'📈',s5:'◈',s6:'🛡️',s7:'⛑️',s8:'🏭',s9:'🌿'};return m[id]||'📚'}
function renderStudyScope(){wwEnsureStudyScope();var html=state.subjects.map(function(s){var tops=state.topics.filter(function(t){return t.subject_id===s.id}),sa=wwSubjectActive(s.id);return '<div class="card ww-scope-panel"><div class="ww-scope-subject-head"><div><strong>📚 '+s.name+'</strong><small>'+s.code+' · '+tops.filter(wwTopicActive).length+'/'+tops.length+' actifs</small></div><div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end"><button class="btn-small '+(sa?'btn-primary':'btn-outline')+'" data-scope-subject="'+s.id+'">'+(sa?'✓ Matière active':'Activer matière')+'</button><button class="btn-small btn-outline" data-scope-subject-all="'+s.id+'">'+(sa?'Tout désactiver':'Tout activer')+'</button></div></div><div class="ww-scope-topic-list">'+tops.map(function(t){var a=wwTopicActive(t);return '<div class="ww-scope-topic"><div><b>'+t.title+'</b><small>'+ (a?'Entrera dans les révisions et notifications':'Hors périmètre actuel') +'</small></div><button class="ww-scope-toggle '+(a?'active':'')+'" data-scope-topic="'+t.id+'">'+(a?'✓ Actif':'○ Inactif')+'</button></div>'}).join('')+'</div></div>'}).join('');return '<div><button class="back-btn" data-route="master">← Retour au Master</button><div class="ww-scope-banner card"><div><div class="card-title">🎯 Périmètre d’étude</div><p class="text-muted text-small">Aucune matière ou aucun chapitre n’est imposé. Tu peux activer, désactiver ou suspendre ce que tu veux à tout moment.</p></div><div class="ww-scope-counter"><strong>'+wwActiveTopicCount()+'</strong><span>actifs</span></div></div>'+html+'</div>'}

function renderSubject(){var sub=state.subjects.find(function(s){return s.id===state.subjectId});if(!sub)return '<div class="card">Matière non trouvée</div>';var tops=state.topics.filter(function(t){return t.subject_id===sub.id});return '<div><button class="back-btn" data-route="master">← Retour</button><div class="ww-scope-subject-head" style="margin-bottom:12px;"><div><h2 style="font-size:18px;margin:0;">'+sub.name+'</h2><small>'+tops.filter(wwTopicActive).length+'/'+tops.length+' chapitres actifs</small></div><button class="btn-outline btn-small" data-route="study-scope">🎯 Gérer</button></div><div class="card">'+tops.map(function(t){var p=getProgress(t.id),a=wwTopicActive(t);return '<div class="topic-item" data-topic-id="'+t.id+'"><div class="left"><span class="name">'+t.title+'</span><span class="sub">'+(a?'🔵 Actif · ':'⚪ Hors périmètre · ')+'Niveau '+p.level+'/4</span></div><div class="right"><button class="ww-scope-toggle '+(a?'active':'')+'" data-scope-topic="'+t.id+'">'+(a?'✓':'○')+'</button><button class="btn-small btn-outline" data-topic-down="'+t.id+'">−</button><button class="btn-small btn-outline" data-topic-up="'+t.id+'">+</button></div></div>'}).join('')+'</div></div>'}
function renderTopic(){var t=state.topics.find(function(x){return x.id===state.topicId});if(!t)return '<div class="card">Chapitre non trouvé</div>';var p=getProgress(t.id),m=wwMasteryData(t.id),e=window.WWMastery?window.WWMastery.evidence(state,t.id):{sessions:0,studyMinutes:0,errorCount:0,errorSuccess:0,reviewCount:0},sc=wwMasteryScore(t.id),rec=wwMasteryRecommendedStage(t.id);return '<div><button class="back-btn" data-route="subject" data-subject-id="'+t.subject_id+'">← Retour</button><h2 style="font-size:18px;margin-bottom:14px;">'+t.title+'</h2><div class="card ww-mastery-card"><div class="card-title">🧠 Mastery Engine <span class="badge">'+getLevelLabel(p.level)+'</span></div><div class="progress-bar"><div class="fill" style="width:'+sc+'%;"></div></div><div class="ww-mastery-score"><strong>'+sc+'%</strong><span>score observable</span></div><div class="ww-mastery-levels">'+['Compréhension','Application','Exercices','Autonomie'].map(function(x,i){var active=p.level>=i+1;return '<span class="'+(active?'active':'')+'">'+(active?'✓ ':'')+x+'</span>'}).join('')+'</div><div class="ww-mastery-evidence"><span>📚 '+e.sessions+' sessions</span><span>⏱️ '+e.studyMinutes+' min</span><span>⚠️ '+e.errorCount+' erreurs</span><span>🔄 '+e.reviewCount+' revues</span></div>'+(rec!==p.level?'<div class="ww-mastery-suggestion">💡 Signal : le moteur suggère le niveau '+rec+'/4, mais la validation reste manuelle.</div>':'')+'<div style="margin-top:12px;display:flex;gap:8px;justify-content:center;"><button class="btn-small btn-outline" data-topic-down="'+t.id+'">−</button><button class="btn-small btn-outline" data-topic-up="'+t.id+'">+</button></div></div><div class="card"><div class="card-title">Notes</div><textarea id="topic-notes" rows="3">'+(p.notes||'')+'</textarea><button class="btn-primary btn-small mt-8" data-save-notes="'+t.id+'">Enregistrer</button></div></div>'}

// ============================================================
// WHITE WOLF — القرآن الكريم
// Nested Growth module. Existing navigation/pages/icons preserved.
// ============================================================
var QURAN_SURAH_NAMES=['الفاتحة','البقرة','آل عمران','النساء','المائدة','الأنعام','الأعراف','الأنفال','التوبة','يونس','هود','يوسف','الرعد','إبراهيم','الحجر','النحل','الإسراء','الكهف','مريم','طه','الأنبياء','الحج','المؤمنون','النور','الفرقان','الشعراء','النمل','القصص','العنكبوت','الروم','لقمان','السجدة','الأحزاب','سبإ','فاطر','يس','الصافات','ص','الزمر','غافر','فصلت','الشورى','الزخرف','الدخان','الجاثية','الأحقاف','محمد','الفتح','الحجرات','ق','الذاريات','الطور','النجم','القمر','الرحمن','الواقعة','الحديد','المجادلة','الحشر','الممتحنة','الصف','الجمعة','المنافقون','التغابن','الطلاق','التحريم','الملك','القلم','الحاقة','المعارج','نوح','الجن','المزمل','المدثر','القيامة','الإنسان','المرسلات','النبأ','النازعات','عبس','التكوير','الانفطار','المطففين','الانشقاق','البروج','الطارق','الأعلى','الغاشية','الفجر','البلد','الشمس','الليل','الضحى','الشرح','التين','العلق','القدر','البينة','الزلزلة','العاديات','القارعة','التكاثر','العصر','الهمزة','الفيل','قريش','الماعون','الكوثر','الكافرون','النصر','المسد','الإخلاص','الفلق','الناس'];
var QURAN_SURAH_AYAH=[7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6];
function wwQuranDefaultSurahs(){return QURAN_SURAH_NAMES.map(function(name,i){return {id:'s'+(i+1),number:i+1,name:name,ayahs:QURAN_SURAH_AYAH[i]||0,level:0,reviews:0,lastReviewed:null,notes:''}})}

function wwQuranDefaultJuz(){return Array.from({length:30},function(_,i){return {id:'j'+(i+1),number:i+1,read:false,readAt:null}})}
function wwQuranEnsureData(){
  if(!Array.isArray(state.quranSurahs)||state.quranSurahs.length!==114)state.quranSurahs=wwQuranDefaultSurahs();
  if(!Array.isArray(state.quranJuz)||state.quranJuz.length!==30)state.quranJuz=wwQuranDefaultJuz();
  if(!Array.isArray(state.quranKhatmas))state.quranKhatmas=[];
  if(!state.quranKhatmas.length){var id=generateId();state.quranKhatmas=[{id:id,number:1,startedAt:wwTodayISO(),completedAt:null,status:'active'}];state.quranCurrentKhatmaId=id}
  if(!state.quranCurrentKhatmaId || !state.quranKhatmas.some(function(k){return k.id===state.quranCurrentKhatmaId&&k.status==='active'})){var active=state.quranKhatmas.find(function(k){return k.status==='active'});if(active)state.quranCurrentKhatmaId=active.id}
  if(!state.quranTab)state.quranTab='surahs';
}
function wwQuranLevelLabel(n){return ['لم تبدأ','بدأت','حفظ جزئي','محفوظة','متقنة'][Math.max(0,Math.min(4,n||0))]}
function wwQuranLevelStars(n){return '★'.repeat(n||0)+'☆'.repeat(4-(n||0))}
function wwQuranCurrentKhatma(){wwQuranEnsureData();return state.quranKhatmas.find(function(k){return k.id===state.quranCurrentKhatmaId&&k.status==='active'})||null}
function wwQuranKhatmaProgress(k){return state.quranJuz.filter(function(j){return j.read}).length}
function wwQuranCompletedKhatmas(){return state.quranKhatmas.filter(function(k){return k.status==='completed'}).length}
function wwQuranSave(){wwQuranEnsureData();saveState();render()}
function renderQuran(){
  wwQuranEnsureData();
  var tab=state.quranTab||'surahs';
  var completed=state.quranSurahs.filter(function(s){return s.level>=3}).length;
  var mastered=state.quranSurahs.filter(function(s){return s.level===4}).length;
  var read=state.quranJuz.filter(function(j){return j.read}).length;
  var kh=wwQuranCurrentKhatma();
  var body='';
  if(tab==='surahs')body=renderQuranSurahs();
  else if(tab==='juz')body=renderQuranJuz();
  else if(tab==='khatmas')body=renderQuranKhatmas();
  else if(tab==='review')body=renderQuranReview();
  else body=renderQuranStats();
  return '<div class="quran-wrap"><button class="back-btn" data-route="growth">← رجوع</button><div class="quran-hero"><div class="quran-ar-title">القرآن الكريم</div><div class="quran-subtitle">حفظ · قراءة · مراجعة · ختمات</div><div class="quran-mini-stats"><span>📚 '+completed+'/114 محفوظة</span><span>📖 '+read+'/30 جزء</span><span>🏆 '+wwQuranCompletedKhatmas()+' ختمة</span></div></div><div class="quran-tabs">'+[['surahs','📚 السور'],['juz','📖 الأجزاء'],['khatmas','🏆 الختمات'],['review','🔄 المراجعة'],['stats','📊 الإحصائيات']].map(function(x){return '<button class="quran-tab '+(tab===x[0]?'active':'')+'" data-quran-tab="'+x[0]+'">'+x[1]+'</button>'}).join('')+'</div>'+body+'</div>';
}
function renderQuranSurahs(){return '<div class="quran-section-head"><div><h3>📚 السور</h3><p>متابعة الحفظ وتقييم الإتقان لكل سورة بشكل مستقل.</p></div><span>'+state.quranSurahs.filter(function(s){return s.level>=3}).length+' / 114</span></div><div class="quran-list">'+state.quranSurahs.map(function(s){return '<div class="quran-surah-card"><div class="quran-surah-num">'+s.number+'</div><div class="quran-surah-main"><div class="quran-surah-name">'+s.name+'</div><div class="quran-surah-meta">'+s.ayahs+' آية · '+wwQuranLevelLabel(s.level)+(s.lastReviewed?' · آخر مراجعة '+s.lastReviewed:'')+'</div><div class="quran-stars">'+wwQuranLevelStars(s.level)+'</div></div><div class="quran-surah-actions"><button class="quran-level-btn" data-quran-level-down="'+s.id+'">−</button><button class="quran-level-btn" data-quran-level-up="'+s.id+'">+</button></div></div>'}).join('')+'</div>'}
function renderQuranJuz(){var read=state.quranJuz.filter(function(j){return j.read}).length;return '<div class="quran-section-head"><div><h3>📖 الأجزاء الثلاثون</h3><p>قائمة مستقلة لمتابعة قراءة القرآن وختمته الحالية.</p></div><span>'+read+' / 30</span></div><div class="quran-progress"><div style="width:'+(read/30*100)+'%"></div></div><div class="juz-grid">'+state.quranJuz.map(function(j){return '<button class="juz-card '+(j.read?'read':'')+'" data-juz-toggle="'+j.id+'"><strong>الجزء '+String(j.number).padStart(2,'0')+'</strong><span>'+(j.read?'✓ مقروء':'○ لم يُقرأ')+'</span>'+(j.read&&j.readAt?'<small>'+j.readAt+'</small>':'')+'</button>'}).join('')+'</div>'}
function renderQuranKhatmas(){var active=wwQuranCurrentKhatma(),read=state.quranJuz.filter(function(j){return j.read}).length;return '<div class="quran-section-head"><div><h3>🏆 الختمات</h3><p>سجل دائم لكل ختمة مكتملة؛ لا يُحذف العدد عند بدء ختمة جديدة.</p></div><span>'+wwQuranCompletedKhatmas()+' مكتملة</span></div><div class="khatma-current"><div class="khatma-badge">🏆</div><div><div class="khatma-title">'+(active?'الختمة #'+active.number:'لا توجد ختمة نشطة')+'</div><div class="khatma-meta">'+read+' / 30 جزء · '+Math.round(read/30*100)+'%</div><div class="quran-progress"><div style="width:'+(read/30*100)+'%"></div></div></div></div><button class="quran-primary-btn" data-start-new-khatma>＋ بدء ختمة جديدة</button><div class="khatma-history">'+(state.quranKhatmas.filter(function(k){return k.status==='completed'}).length?state.quranKhatmas.filter(function(k){return k.status==='completed'}).map(function(k){return '<div class="khatma-row"><strong>الختمة #'+k.number+'</strong><span>'+k.startedAt+' → '+k.completedAt+'</span><b>مكتملة ✓</b></div>'}).join(''):'<div class="quran-empty">لا توجد ختمات مكتملة بعد.</div>')+'</div>'}
function renderQuranReview(){var arr=state.quranSurahs.filter(function(s){return s.level>0&&s.level<4}).sort(function(a,b){return a.level-b.level});return '<div class="quran-section-head"><div><h3>🔄 المراجعة</h3><p>السور التي بدأت حفظها ولم تصل بعد إلى مستوى الإتقان.</p></div><span>'+arr.length+'</span></div><div class="quran-list">'+(arr.length?arr.map(function(s){return '<div class="review-row"><span class="quran-surah-num">'+s.number+'</span><div><strong>'+s.name+'</strong><small> '+wwQuranLevelLabel(s.level)+' · '+wwQuranLevelStars(s.level)+'</small></div></div>'}).join(''):'<div class="quran-empty">لا توجد سورة قيد المراجعة.</div>')+'</div>'}
function renderQuranStats(){var saved=state.quranSurahs.filter(function(s){return s.level>=3}).length,mastered=state.quranSurahs.filter(function(s){return s.level===4}).length,read=state.quranJuz.filter(function(j){return j.read}).length;return '<div class="quran-stat-grid"><div><strong>'+saved+'</strong><span>سور محفوظة</span></div><div><strong>'+mastered+'</strong><span>سور متقنة</span></div><div><strong>'+read+'</strong><span>أجزاء مقروءة</span></div><div><strong>'+wwQuranCompletedKhatmas()+'</strong><span>ختمات مكتملة</span></div></div><div class="quran-card-note">يتم حساب التقدم من بيانات السور والأجزاء وسجل الختمات نفسه، وليس من عداد منفصل قابل للضياع.</div>'}

function renderGrowth(){
  var totalProg=PROGRAMMING_TOPICS.length;
  var doneProg=progTotalDone();
  var percentProg=Math.round((doneProg/totalProg)*100);
  return '<div><h2 style="font-size:22px;margin-bottom:6px;">🌱 Growth</h2><p style="font-size:13px;color:#8ba2c0;margin-bottom:20px;">طوّر مهاراتك</p><div class="card" style="background:linear-gradient(135deg,#16222e,#111a24);padding:14px;"><div class="flex-between"><div><div style="font-size:12px;color:#8ba2c0;">مرحباً بك</div><div style="font-size:17px;font-weight:700;margin-top:4px;">اختر مساراً</div></div><div style="text-align:center;"><div style="font-size:26px;">🔥</div><div style="font-size:15px;font-weight:700;color:#e8cc6a;">'+state.studyStreak+'</div><div style="font-size:10px;color:#8ba2c0;">يوم</div></div></div></div>'+
    '<div style="font-size:14px;font-weight:600;color:#8ba2c0;margin:20px 0 12px;">💻 البرمجة</div>'+
    '<div class="growth-path-card" data-route="programming"><div class="path-header"><div class="path-icon">💻</div><div class="path-info"><h3>Programmation</h3><div class="path-sub">Frontend · Python · Java · Projets</div></div></div><div class="progress-bar"><div class="fill" style="width:'+percentProg+'%;background:linear-gradient(90deg,#4b7bec,#6ae8a5);"></div></div><div class="path-goal"><span>'+doneProg+' / '+totalProg+' sujets</span><span class="goal-badge">'+percentProg+'%</span></div></div>'+
    '<div style="font-size:14px;font-weight:600;color:#8ba2c0;margin:20px 0 12px;">📖 القرآن الكريم</div>'+'<div class="growth-path-card quran-growth-card" data-route="quran"><div class="path-header"><div class="path-icon quran-growth-icon">📖</div><div class="path-info"><h3 class="quran-growth-name">القرآن الكريم</h3><div class="path-sub">السور · الأجزاء · الختمات · المراجعة</div></div></div><div class="path-goal"><span>114 سورة · 30 جزءاً · '+wwQuranCompletedKhatmas()+' ختمة مكتملة</span><span class="goal-badge">فتح</span></div></div>'+
    '<div style="font-size:14px;font-weight:600;color:#8ba2c0;margin:20px 0 12px;">🌍 اللغات</div>'+
    state.languages.map(function(L){var c=langCurrentLevel(L.id);var p=langProg(L.id,c);return '<div class="growth-path-card" data-lang="'+L.id+'"><div class="path-header"><div class="path-icon">'+L.flag+'</div><div class="path-info"><h3>'+L.name+' <span style="font-size:13px;color:#8ba2c0;">'+L.nameAr+'</span></h3><div class="path-sub">الهدف: '+L.goalLabel+' · الحالي: '+c+'</div></div></div><div class="progress-bar"><div class="fill" style="width:'+p.percent+'%;"></div></div><div class="path-goal"><span>'+p.done+'/'+p.total+' دروس '+c+'</span><span class="goal-badge">'+p.percent+'%</span></div></div>'}).join('')+
  '</div>';
}

function renderProgramming(){var domains=['Frontend','Python & Data','Java & C','Outils & Projets'];var emojis={'Frontend':'🌐','Python & Data':'🐍','Java & C':'☕','Outils & Projets':'🚀'};return '<button class="back-btn" data-route="growth">← رجوع</button><h2 style="font-size:22px;margin-bottom:14px;">💻 البرمجة</h2><p style="font-size:13px;color:#8ba2c0;margin-bottom:16px;">17 موضوعاً في 4 مجالات</p>'+domains.map(function(dom){var topics=PROGRAMMING_TOPICS.filter(function(t){return t.domain===dom});if(!topics.length)return '';return '<div class="prog-category"><div class="cat-header"><span class="cat-icon">'+emojis[dom]+'</span>'+dom+'<span class="cat-count">'+topics.length+'</span></div>'+topics.map(function(t){var p=state.programming[t.id]||{level:0,score:0};return '<div class="lesson-row '+(p.level>0?'completed':'')+'" data-prog-id="'+t.id+'"><div class="lesson-num">'+t.icon+'</div><div class="lesson-info"><div class="lesson-title">'+t.title+'</div><div class="lesson-sub">'+getLevelLabel(p.level)+'</div></div><div class="lesson-status">'+(p.level>0?'✅':'▶️')+'</div></div>'}).join('')+'</div>'}).join('')}

function renderLanguage(){
  var L=getLang(state.langId);
  var keys=Object.keys(L.levels);
  var cur=langCurrentLevel(L.id);
  var curIdx=keys.indexOf(cur);if(curIdx<0)curIdx=0;
  var lv=L.levels[state.levelKey]||L.levels[cur];
  if(!lv)return '<div class="card">اللغة غير متوفرة</div>';
  var p=langProg(L.id,state.levelKey);
  var td=langTotalDone(L.id);
  var cefr=keys.map(function(k,i){var cls='';if(i<curIdx)cls='completed';else if(k===cur)cls='active';else if(k===L.goal)cls='target';var lbl='';if(i<curIdx)lbl='✓';else if(k===cur)lbl='حالي';else if(k===L.goal)lbl='🎯';return '<div class="cefr-step '+cls+'"><div class="cefr-circle">'+k+'</div><div class="cefr-lbl">'+lbl+'</div></div>'}).join('');
  var tabs=keys.map(function(k){var i=keys.indexOf(k);var unlocked=i<=curIdx;var pk=langProg(L.id,k);var cls='';if(k===state.levelKey)cls+=' active';if(!unlocked)cls+=' locked';if(pk.percent===100)cls+=' completed';return '<div class="level-tab'+cls+'" '+(unlocked?'data-level="'+k+'"':'')+'>'+k+(pk.percent===100?' ✓':'')+'</div>'}).join('');
  var nextInc=-1;for(var i=0;i<lv.lessons.length;i++){if(!langIsDone(L.id,state.levelKey,lv.lessons[i].num)){nextInc=i;break}}
  var lessons=lv.lessons.map(function(lesson,idx){var done=langIsDone(L.id,state.levelKey,lesson.num);var locked=!done&&(nextInc===-1||idx>nextInc);var cls=done?'completed':(locked?'locked':'');var icon=done?'✅':(locked?'🔒':'▶️');return '<div class="lesson-row '+cls+'" data-lesson="'+lesson.num+'"><div class="lesson-num">'+lesson.num+'</div><div class="lesson-info"><div class="lesson-title">'+lesson.title+'</div><div class="lesson-sub">'+lesson.sub+'</div></div><div class="lesson-status">'+icon+'</div></div>'}).join('');
  var cards=getFlashcardsForLanguage(L.id);var due=getCardsDueToday(L.id).length;
  var fcEntry='<div class="fc-entry" data-route="flashcards" data-fc-lang="'+L.id+'"><div class="fce-ic">🃏</div><div class="fce-info"><h3>Flashcards</h3><div class="fce-sub">'+cards.length+' cartes · '+due+' à réviser</div></div><div class="fce-arrow">→</div></div>';
  var res='';
  res+='<div class="res-group">📕 كتب</div>'+lv.resources.books.map(function(b){return '<div class="res-row"><div class="res-icon">📕</div><div class="res-info"><div class="title">'+b.title+'</div><div class="sub">'+b.author+' · '+b.sub+'</div></div></div>'}).join('');
  res+='<div class="res-group">🎥 يوتيوب</div>'+lv.resources.youtube.map(function(y){return '<div class="res-row"><div class="res-icon">🎥</div><div class="res-info"><div class="title">'+y.title+'</div><div class="sub">'+y.sub+'</div></div><a href="https://www.youtube.com/results?search_query='+encodeURIComponent(y.title)+'" target="_blank">بحث</a></div>'}).join('');
  res+='<div class="res-group">📱 تطبيقات</div>'+lv.resources.apps.map(function(a){return '<div class="res-row"><div class="res-icon">📱</div><div class="res-info"><div class="title">'+a.title+'</div><div class="sub">'+a.sub+'</div></div></div>'}).join('');
  res+='<div class="res-group">🌐 مواقع</div>'+lv.resources.websites.map(function(w){return '<div class="res-row"><div class="res-icon">🌐</div><div class="res-info"><div class="title">'+w.title+'</div><div class="sub">'+w.sub+'</div></div></div>'}).join('');
  return '<button class="back-btn" data-route="growth">← رجوع</button>'+
    '<div class="lang-hero"><div class="hero-top"><div class="hero-flag">'+L.flag+'</div><div class="hero-title"><h2>'+L.name+'</h2><div class="hero-sub">'+L.nameAr+' · الهدف: '+L.goalLabel+'</div></div></div><div class="lang-stats-row"><div class="lang-stat-box"><div class="stat-emoji">🔥</div><div class="stat-num">'+state.studyStreak+'</div><div class="stat-lbl">سلسلة</div></div><div class="lang-stat-box"><div class="stat-emoji">📚</div><div class="stat-num">'+td+'</div><div class="stat-lbl">دروس</div></div><div class="lang-stat-box"><div class="stat-emoji">⭐</div><div class="stat-num">'+state.xp+'</div><div class="stat-lbl">XP</div></div></div></div>'+
    fcEntry+'<div class="cefr-ladder">'+cefr+'</div><div class="level-tabs">'+tabs+'</div>'+
    '<div class="level-desc"><h3>📌 '+lv.label+'</h3><p>'+lv.description+'</p><ul>'+lv.canDo.map(function(c){return '<li>✓ '+c+'</li>'}).join('')+'</ul><div class="meta-row"><span>⏱️ '+lv.duration+'</span><span>📅 '+lv.pace+'</span><span>📖 '+lv.lessons.length+' دروس</span></div></div>'+
    '<div class="card"><div class="card-title">📋 خطة '+state.levelKey+' <span class="badge">'+p.percent+'%</span></div><div class="progress-bar"><div class="fill" style="width:'+p.percent+'%;"></div></div><div style="margin-top:12px;">'+lessons+'</div></div>'+
    '<div class="resources-section"><h4>📚 المراجع</h4>'+res+'</div>';
}

function renderLesson(){
  var L=getLang(state.langId);
  var lv=L.levels[state.levelKey];
  if(!lv)return '<div class="card">الدرس غير موجود</div>';
  var lesson=null;for(var i=0;i<lv.lessons.length;i++){if(lv.lessons[i].num===state.lessonNum){lesson=lv.lessons[i];break}}
  if(!lesson)return '<div class="card">الدرس غير موجود</div>';
  var done=langIsDone(L.id,state.levelKey,lesson.num);
  return '<button class="back-btn" data-route="language" data-lang="'+L.id+'">← رجوع إلى '+state.levelKey+'</button>'+
    '<div class="lesson-detail"><div class="lbl">الدرس '+lesson.num+' · '+state.levelKey+' · '+L.name+'</div><h3>'+lesson.title+'</h3><div class="lsub">'+lesson.sub+'</div><div class="what-learn"><h4>💡 ما ستتعلمه:</h4><ul>'+lesson.learn.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul></div>'+
    '<div style="font-size:13px;color:#8ba2c0;margin-bottom:8px;">🎥 فيديو موصى به:</div>'+
    '<a class="video-link" href="'+lesson.video.url+'" target="_blank"><div class="vid-icon">▶️</div><div class="vid-info"><div class="t">'+lesson.video.title+'</div><div class="s">'+lesson.video.channel+'</div></div><div class="vid-arrow">→</div></a>'+
    '<button class="action-btn '+(done?'done':'')+'" '+(done?'disabled':'')+' data-complete="'+lesson.num+'">'+(done?'✅ أكملت':'✅ أكملت (+10 XP)')+'</button></div>'+
    '<div class="card" style="padding:12px;"><div style="font-size:13px;color:#8ba2c0;line-height:1.6;">💡 ادرس الدرس، ثم ارجع وأكمل.</div></div>';
}

function renderFlashcards(){
  var L=getLang(state.fcLang||state.langId||'de');
  if(state.fcScreen==='session')return renderFcSession(L);
  var cards=getFlashcardsForLanguage(L.id);var due=getCardsDueToday(L.id);var mastered=getCardsMastered(L.id);var sr2=wwSR2Summary(L.id);
  var header='<div class="fc-header"><div class="fc-top"><div class="fc-icon">🃏</div><div class="fc-title"><h2>Flashcards</h2><div class="fc-sub">'+L.flag+' '+L.name+' · '+L.nameAr+'</div></div></div><div class="fc-stats"><div class="fc-stat total"><div class="fs-num">'+cards.length+'</div><div class="fs-lbl">Total</div></div><div class="fc-stat due"><div class="fs-num">'+due.length+'</div><div class="fs-lbl">À réviser</div></div><div class="fc-stat mastered"><div class="fs-num">'+mastered.length+'</div><div class="fs-lbl">Maîtrisées</div></div></div></div>';
  var actions='<div class="fc-actions"><button class="fc-action-btn primary" data-start-fc-session '+(due.length===0?'disabled':'')+'>▶️ Réviser ('+due.length+')</button><button class="fc-action-btn secondary" data-start-smart-fc '+(due.length===0?'disabled':'')+'>🧠 Smart Review ('+Math.min(due.length,12)+')</button><button class="fc-action-btn secondary" data-add-fc-manual>➕ Ajouter</button></div>'+'<div class="ww-sr2-card"><div class="ww-sr2-head"><div><div class="ww-sr2-title">🧠 Smart Review 2.0</div><div class="ww-sr2-sub">Priorise automatiquement les cartes qui ont le plus besoin de toi.</div></div><span class="ww-sr2-badge">LIVE</span></div><div class="ww-sr2-grid"><div><b>'+sr2.due+'</b><span>à réviser</span></div><div><b>'+sr2.high+'</b><span>priorité haute</span></div><div><b>'+sr2.errors+'</b><span>erreurs dues</span></div><div><b>'+(sr2.exam?sr2.examDays+'j':'—')+'</b><span>prochain examen</span></div></div><div class="ww-sr2-note">'+(sr2.exam&&sr2.examDays<=7?'🎯 Examen proche : urgence renforcée.':'⚙️ Score basé sur retard, niveau, répétitions, récence et pression d’examen.')+'</div></div>';
  var list='';if(cards.length===0){list='<div class="fc-empty"><div class="fce-icon">🃏</div><div class="fce-text">Aucune carte</div></div>'}else{list='<div class="card"><div class="card-title">📋 Toutes les cartes <span class="badge">'+cards.length+'</span></div><div class="fc-list">'+cards.map(function(c){var info=getCardReviewInfo(L.id,c.id);var statusEmoji=info.level>=3?'🟢':(info.level>=1?'🟡':'🔴');var nextDate=info.nextReviewAt?new Date(info.nextReviewAt).toLocaleString('fr-FR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}):(info.nextReview?wwDateAtLocalMidnight(info.nextReview).toLocaleDateString('fr-FR'):'maintenant');var sr=wwSR2CardScore(L.id,c);var pr=sr>=65?'🔥 Haute':(sr>=40?'🟠 Moyenne':'🟢 Faible');return '<div class="fc-list-item"><div class="fli-content"><div class="fli-q">'+statusEmoji+' '+c.question+'</div><div class="fli-a">'+c.answer+'</div><div class="fli-meta">Niveau '+info.level+' · Prochaine: '+nextDate+' · '+pr+' ('+sr+')</div></div><button class="btn-small btn-outline" data-delete-fc="'+c.id+'">🗑️</button></div>'}).join('')+'</div></div>'}
  return '<button class="back-btn" data-route="language" data-lang="'+L.id+'">← رجوع</button>'+header+actions+list;
}

function renderFcSession(L){
  var session=state.fcSession;
  if(!session||!session.cards.length)return '<button class="back-btn" data-route="flashcards" data-fc-lang="'+L.id+'">← رجوع</button><div class="fc-end"><div class="fe-icon">🎉</div><div class="fe-title">Session terminée !</div><button class="btn-primary" data-end-fc-session style="width:100%;justify-content:center;">Retour</button></div>';
  var idx=session.currentIdx;
  if(idx>=session.cards.length){var reviewed=session.reviewed;var correct=session.correct;state.fcSession=null;state.fcScreen='list';return '<div class="fc-end"><div class="fe-icon">🎉</div><div class="fe-title">Terminé !</div><div class="fe-stats"><div class="fe-stat"><div class="fes-num" style="color:#8fb3e6">'+reviewed+'</div><div class="fes-lbl">Revues</div></div><div class="fe-stat"><div class="fes-num" style="color:#6ae8a5">'+correct+'</div><div class="fes-lbl">Correctes</div></div><div class="fe-stat"><div class="fes-num" style="color:#e8cc6a">'+Math.round((correct/Math.max(reviewed,1))*100)+'%</div><div class="fes-lbl">Score</div></div></div><button class="btn-primary" data-end-fc-session style="width:100%;justify-content:center;">Retour</button></div>'}
  var card=session.cards[idx];var progress=Math.round((idx/session.cards.length)*100);
  var cardHTML='<div class="fc-card '+(state.fcFlipped?'flipped':'')+'" data-flip-card><div class="fc-side-label">'+(state.fcFlipped?'RÉPONSE':'QUESTION')+'</div>'+(state.fcFlipped?'<div class="fc-answer">'+card.answer+'</div>'+(card.hint?'<div class="fc-hint">💡 '+card.hint+'</div>':''):'<div class="fc-question">'+card.question+'</div><div class="fc-hint">Clique pour voir la réponse</div>')+'</div>';
  var difficulty='';if(state.fcFlipped){difficulty='<div class="fc-difficulty"><button class="fc-diff-btn hard" data-fc-quality="again"><span class="fdb-icon">↻</span><span>Encore · 10 min</span></button><button class="fc-diff-btn hard" data-fc-quality="hard"><span class="fdb-icon">❌</span><span>Difficile</span></button><button class="fc-diff-btn ok" data-fc-quality="ok"><span class="fdb-icon">👍</span><span>OK</span></button><button class="fc-diff-btn easy" data-fc-quality="easy"><span class="fdb-icon">✅</span><span>Facile</span></button></div>'}
  return '<button class="back-btn" data-end-fc-session>← Arrêter</button><div class="fc-session-bar"><span>'+L.flag+' '+L.name+(session.smart?' · 🧠 Smart':'')+'</span><span class="sb-progress">'+(idx+1)+' / '+session.cards.length+'</span></div><div class="fc-progress-bar"><div class="fill" style="width:'+progress+'%"></div></div>'+cardHTML+difficulty;
}

function renderPlanning(){
  var days=['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
  var keys=['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'];
  var schedule=Object.assign({},DEFAULT_SCHEDULE,state.customSchedule);
  var todayTasks=state.tasks.filter(function(t){return t.date===wwLocalDateISO(new Date())});
  if(state.isEditingPlanning){return '<div><div class="flex-between" style="margin-bottom:16px;"><h2 style="font-size:22px;">📅 Modifier le Planning</h2><span class="text-small text-muted">Source de vérité</span></div><div class="card">'+keys.map(function(k,i){return '<div class="planning-day-edit"><div class="day-header"><span>'+days[i]+'</span><button class="btn-small btn-outline" type="button" data-reset-day="'+k+'" aria-label="Réinitialiser '+days[i]+'">↺</button></div><textarea id="planning-input-'+k+'" rows="3" spellcheck="true" aria-label="Planning '+days[i]+'" placeholder="Ajoute les éléments de ta journée, un par ligne…">'+wwEscapeHTML(schedule[k]||'')+'</textarea></div>'}).join('')+'<div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap;"><button class="btn-primary" type="button" data-save-planning>💾 Enregistrer</button><button class="btn-outline" type="button" data-cancel-planning>Annuler</button></div></div></div>'}
  return '<div><div class="flex-between" style="margin-bottom:16px;"><h2 style="font-size:22px;">📅 Planning</h2><button class="btn-primary btn-small" data-edit-planning>✏️ Modifier</button></div><div class="card"><div class="card-title">Planning hebdo</div>'+keys.map(function(k,i){return '<div class="stat-row"><span style="font-weight:500;min-width:80px;">'+days[i]+'</span><span class="text-small">'+wwEscapeHTML(schedule[k]||'—')+'</span></div>'}).join('')+'</div><div class="card"><div class="card-title">📋 Tâches <span class="badge">'+new Date().toLocaleDateString('fr-FR')+'</span></div>'+(todayTasks.length?todayTasks.map(function(t){return '<div class="task-item"><div class="task-left"><div class="task-text '+(t.isDone?'task-done':'')+'">'+t.text+'</div><div class="task-meta">'+(t.time||'')+' • '+t.priority+'</div></div><div class="task-right"><span class="task-priority '+t.priority+'">'+t.priority+'</span>'+(t.isDone?'':'<button class="btn-small btn-outline" data-task-done="'+t.id+'">✅</button>')+'<button class="btn-small btn-outline" data-task-delete="'+t.id+'">🗑️</button></div></div>'}).join(''):'<div class="text-muted text-small">Aucune tâche.</div>')+'<button class="btn-primary btn-small mt-8" data-add-task>➕ Ajouter</button></div><div class="card"><div class="card-title">📝 Examens <span class="badge">'+state.exams.length+'</span></div>'+(state.exams.length?state.exams.map(function(e){var dLeft=Math.ceil((new Date(e.date)-new Date())/86400000);var cls=dLeft<=1?'urgent':dLeft<=3?'soon':'';var label=dLeft===0?'Aujourd\'hui':dLeft===1?'Demain':'Dans '+dLeft+'j';return '<div class="exam-item"><div class="exam-left"><div class="exam-title">'+e.title+'</div><div class="exam-date">📅 '+new Date(e.date).toLocaleDateString('fr-FR')+' '+(e.time?'à '+e.time:'')+'</div></div><div class="exam-right"><span class="exam-badge '+cls+'">'+label+'</span><button class="btn-small btn-outline" data-exam-prep="'+e.id+'">🎯</button><button class="btn-small btn-outline" data-delete-exam="'+e.id+'">🗑️</button></div></div>'}).join(''):'<div class="text-muted text-small">Aucun examen.</div>')+'<button class="btn-primary btn-small mt-8" data-add-exam>➕ Ajouter</button></div></div>';
}

// ============================================================
//  STATS (avec onglets + Advanced)
// ============================================================
// ============================================================
//  V51 PERSONAL ANALYTICS — historical behavior layer
//  Read-only analytics: never changes Planning or study data.
// ============================================================
function wwPAValidDate(value){
  if(!value)return null;
  var d=value instanceof Date?new Date(value.getTime()):new Date(String(value).length<=10?String(value)+'T12:00:00':value);
  return isNaN(d.getTime())?null:d;
}
function wwPAStudyDays(){
  var days={};
  (state.sessions||[]).forEach(function(s){
    var d=wwPAValidDate(s.date);if(!d)return;
    var k=wwLocalDateISO(d);days[k]=(days[k]||0)+(Number(s.duration)||0);
  });
  return days;
}
function wwPAWeekdayProfile(){
  var labels=['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'],mins=[0,0,0,0,0,0,0],count=[0,0,0,0,0,0,0];
  (state.sessions||[]).forEach(function(s){var d=wwPAValidDate(s.date);if(!d)return;var w=d.getDay();mins[w]+=Number(s.duration)||0;count[w]++});
  return labels.map(function(label,i){return{label:label,minutes:mins[i],sessions:count[i],avg:count[i]?Math.round(mins[i]/count[i]):0,day:i}});
}
function wwPAHourProfile(){
  var bins=[];
  for(var i=0;i<24;i++)bins.push({hour:i,minutes:0,sessions:0});
  (state.sessions||[]).forEach(function(s){var d=wwPAValidDate(s.date);if(!d)return;var h=d.getHours();if(h>=0&&h<24){bins[h].minutes+=Number(s.duration)||0;bins[h].sessions++}});
  return bins;
}
function wwPASubjectProfile(){
  var map={};
  (state.sessions||[]).forEach(function(s){if(!s.subject_id)return;var sub=state.subjects.find(function(x){return x.id===s.subject_id});if(!sub)return;if(!map[sub.id])map[sub.id]={id:sub.id,name:sub.name,minutes:0,sessions:0};map[sub.id].minutes+=Number(s.duration)||0;map[sub.id].sessions++});
  return Object.keys(map).map(function(k){var x=map[k];x.avg=x.sessions?Math.round(x.minutes/x.sessions):0;return x}).sort(function(a,b){return b.minutes-a.minutes});
}
function wwPARecentTrend(){
  var days=wwPAStudyDays(),now=new Date(),cur=0,prev=0,curDays=0,prevDays=0;
  for(var i=0;i<7;i++){var d=new Date(now);d.setDate(d.getDate()-i);var k=wwLocalDateISO(d);cur+=days[k]||0;if(days[k])curDays++}
  for(var j=7;j<14;j++){var d2=new Date(now);d2.setDate(d2.getDate()-j);var k2=wwLocalDateISO(d2);prev+=days[k2]||0;if(days[k2])prevDays++}
  var delta=prev?Math.round((cur-prev)/prev*100):(cur>0?100:0);
  return{current:cur,previous:prev,delta:delta,currentDays:curDays,previousDays:prevDays};
}
function wwPAConsistency(){
  var days=wwPAStudyDays(),active=Object.keys(days).filter(function(k){return days[k]>0}).length;
  var now=new Date(),windowDays=28;
  for(var i=0;i<28;i++){var d=new Date(now);d.setDate(d.getDate()-i);if(days[wwLocalDateISO(d)]>0){} }
  var rate=Math.round(active/windowDays*100);
  var best=0,run=0;
  for(var j=27;j>=0;j--){var dd=new Date(now);dd.setDate(dd.getDate()-j);if(days[wwLocalDateISO(dd)]>0){run++;best=Math.max(best,run)}else run=0}
  return{active:active,rate:Math.min(rate,100),bestRun:best};
}
function wwPAMomentum(){
  var t=wwPARecentTrend(),cons=wwPAConsistency();
  var score=Math.round(Math.min(100,(t.current/420)*45 + cons.rate*0.35 + Math.max(0,Math.min(100,50+t.delta))*0.20));
  return{score:score,label:score>=80?'Excellent':score>=60?'Solide':score>=40?'À renforcer':'Fragile'};
}
function wwPAInsights(){
  var insights=[],days=wwPAStudyDays(),trend=wwPARecentTrend(),week=wwPAWeekdayProfile(),hours=wwPAHourProfile(),subs=wwPASubjectProfile(),cons=wwPAConsistency();
  var bestDay=week.slice().sort(function(a,b){return b.avg-a.avg})[0];
  var bestHour=hours.slice().sort(function(a,b){return b.minutes-a.minutes})[0];
  if(trend.previous>0) insights.push({icon:trend.delta>=0?'📈':'📉',title:(trend.delta>=0?'Progression':'Repli')+' récente',text:(trend.delta>=0?'+':'')+trend.delta+'% de temps d’étude sur les 7 derniers jours vs les 7 précédents.'});
  if(bestDay&&bestDay.sessions) insights.push({icon:'📅',title:'Jour le plus productif',text:bestDay.label+' · '+bestDay.avg+' min/session en moyenne.'});
  if(bestHour&&bestHour.sessions) insights.push({icon:'⏰',title:'Créneau dominant',text:String(bestHour.hour).padStart(2,'0')+'h · '+bestHour.minutes+' min cumulées sur les sessions enregistrées.'});
  if(subs.length>1){var top=subs[0],bottom=subs[subs.length-1];insights.push({icon:'⚖️',title:'Répartition',text:top.name+' concentre '+Math.round(top.minutes/Math.max(1,subs.reduce(function(a,x){return a+x.minutes},0))*100)+'% du temps des matières suivies.'});if(bottom.minutes<top.minutes*0.25)insights.push({icon:'🧩',title:'Matière sous-exposée',text:bottom.name+' reçoit nettement moins de temps que '+top.name+'.'});}
  insights.push({icon:'🔥',title:'Consistency 28 jours',text:cons.active+'/28 jours actifs · meilleur run '+cons.bestRun+' jour'+(cons.bestRun!==1?'s':'')+'.'});
  return insights.slice(0,5);
}
function wwPAProjection(){
  var t=wwPARecentTrend(),avg=t.current/7,goal=420;
  return{daily:Math.round(avg),weekly:Math.round(avg*7),goal:goal,pace:goal?Math.round(avg*7/goal*100):0};
}
function renderPersonalAnalytics(){
  var A=window.WWAnalytics, q=A.summary(state), cmp=q.comparison, series=A.dailySeries(state,14), subs=A.subjectBreakdown(state), hard=A.hardestTopics(state,5), dist=q.mastery;
  var totalMastery=state.topics.length||1, mastered=dist[4]||0, active=q.activeDays;
  var deltaClass=cmp.delta>=0?'up':'down', delta=(cmp.delta>0?'+':'')+cmp.delta+'%';
  var maxDay=Math.max.apply(null,series.map(function(x){return x.minutes}).concat([1]));
  var seriesHTML=series.map(function(x){var d=new Date(x.date+'T12:00:00');var h=d.toLocaleDateString('fr-FR',{weekday:'short'}).replace('.','');return '<div class="ww-a-day"><div class="ww-a-bar-wrap"><i style="height:'+Math.max(x.minutes?6:2,Math.round(x.minutes/maxDay*100))+'%"></i></div><b>'+x.minutes+'</b><small>'+h+'</small></div>'}).join('');
  var subTotal=Math.max(1,subs.reduce(function(a,x){return a+x.minutes},0));
  var subHTML=subs.slice(0,6).map(function(x){return '<div class="ww-a-row"><div><b>'+x.name+'</b><small>'+x.sessions+' sessions · '+x.avg+' min/session</small></div><strong>'+x.minutes+' min</strong><div class="ww-a-progress"><i style="width:'+Math.round(x.minutes/subTotal*100)+'%"></i></div></div>'}).join('');
  var hardHTML=hard.length?hard.map(function(x){var t=x.mastery;return '<div class="ww-a-hard"><div><b>'+x.name+'</b><small>'+x.errors+' erreur'+(x.errors!==1?'s':'')+' · '+x.sessions+' sessions · '+x.minutes+' min</small></div><span>Niv. '+t+'/4</span><strong>'+x.score+'%</strong></div>'}).join(''):'<div class="chart-empty">Pas encore assez de données par chapitre.</div>';
  var distHTML=dist.map(function(n,i){return '<div class="ww-a-stage"><span>'+['Pas commencé','Compréhension','Application','Exercices','Autonomie'][i]+'</span><b>'+n+'</b><i><em style="width:'+Math.round(n/totalMastery*100)+'%"></em></i></div>'}).join('');
  return '<div class="ww-analytics-v29">'+
    '<div class="ww-a-hero card"><div class="ww-a-head"><div><div class="card-title">📊 Study Analytics</div><div class="ww-a-sub">Mesures descriptives basées sur les sessions réellement enregistrées.</div></div><span class="ww-a-live">V63.2</span></div><div class="ww-a-kpis"><div><b>'+q.totalHours+'h</b><span>Temps réel total</span></div><div><b>'+q.sessions+'</b><span>Sessions</span></div><div><b>'+q.weekMinutes+'m</b><span>7 derniers jours</span></div><div><b>'+q.streak+'</b><span>Jours de série</span></div></div></div>'+
    '<div class="ww-a-compare card"><div class="card-title">↔️ Comparaison hebdomadaire</div><div class="ww-a-compare-grid"><div><small>Cette semaine</small><b>'+cmp.current.minutes+' min</b><span>'+cmp.current.activeDays+' jours actifs</span></div><div><small>Semaine précédente</small><b>'+cmp.previous.minutes+' min</b><span>'+cmp.previous.activeDays+' jours actifs</span></div><div class="ww-a-delta '+deltaClass+'"><small>Écart</small><b>'+delta+'</b><span>temps d’étude</span></div></div></div>'+
    '<div class="card"><div class="card-title">⏱️ Activité — 14 derniers jours</div><div class="ww-a-series">'+seriesHTML+'</div><div class="ww-a-legend">Chaque barre représente uniquement le temps contenu dans les sessions enregistrées.</div></div>'+
    '<div class="card"><div class="card-title">🧠 Répartition de la maîtrise</div><div class="ww-a-mastery-note"><b>'+mastered+'/'+totalMastery+'</b> chapitres au niveau Autonomie · '+active+'/7 jours actifs cette semaine.</div><div class="ww-a-stages">'+distHTML+'</div></div>'+
    '<div class="card"><div class="card-title">⚠️ Chapitres demandant le plus de travail</div><div class="ww-a-note">Signal descriptif combinant erreurs non maîtrisées, volume d’erreurs et score de maîtrise. Ce n’est pas une note.</div><div class="ww-a-hard-list">'+hardHTML+'</div></div>'+
    '<div class="card"><div class="card-title">📚 Temps par matière</div>'+(subHTML||'<div class="chart-empty">Aucune session liée à une matière.</div>')+'</div>'+
    '<div class="card"><div class="card-title">🔁 Erreurs & révisions</div><div class="ww-a-error-grid"><div><b>'+q.errors.total+'</b><span>erreurs enregistrées</span></div><div><b>'+q.errors.due+'</b><span>à revoir</span></div><div><b>'+q.errors.byStatus.mastered+'</b><span>maîtrisées</span></div><div><b>'+q.bestRun28+'</b><span>meilleur run / 28j</span></div></div></div>'+
  '</div>';
}

function renderAdaptiveRevisionCard(){
  var a=wwAdaptiveSummary(),items=a.queue||[], qb=(window.WWAdaptiveQuiz&&window.WWAdaptiveQuiz.coverage)?window.WWAdaptiveQuiz.coverage(state.topics||[]):{covered:0,topics:0,questions:0,coveragePercent:0};
  if(!items.length)return '<div class="card ww-adaptive-card"><div class="ww-adaptive-head"><div><div class="card-title">🧠 Révision adaptative</div><div class="ww-adaptive-sub">Aucune priorité forte détectée pour le moment.</div></div><span class="ww-adaptive-badge">64.2</span></div><button class="btn-outline" data-stats-tab="adaptive" style="width:100%;justify-content:center;margin-top:10px;">Voir le moteur</button></div>';
  var top=items.slice(0,3),rows=top.map(function(x){var icon=x.type==='error'?'⚠️':'📖';var action=x.type==='error'?'<button class="btn-small btn-outline" data-review-error="'+x.errorId+'">Réviser</button>':'<button class="btn-small btn-outline" data-adaptive-open-topic="'+x.topicId+'">Ouvrir</button>';return '<div class="ww-adaptive-item"><div class="ww-adaptive-icon">'+icon+'</div><div class="ww-adaptive-copy"><b>'+x.title+'</b><small>'+x.duration+' min · '+x.reasons.slice(0,2).join(' · ')+'</small></div><strong>'+x.score+'</strong>'+action+'</div>'}).join('');
  return '<div class="card ww-adaptive-card"><div class="ww-adaptive-head"><div><div class="card-title">🧠 Révision adaptative</div><div class="ww-adaptive-sub">Priorités calculées à partir des erreurs, Mastery, historique et examens.</div></div><span class="ww-adaptive-badge">LIVE 64.2</span></div><div class="ww-adaptive-kpis"><span><b>'+a.total+'</b> priorités</span><span><b>'+a.estimatedMinutes+'</b> min estimées</span><span><b>'+a.errors+'</b> erreurs</span><span><b>'+a.topics+'</b> chapitres</span></div><div class="ww-adaptive-list">'+rows+'</div><button class="btn-primary" data-stats-tab="adaptive" style="width:100%;justify-content:center;margin-top:10px;">🎯 Construire ma session</button></div>';
}
function wwStartAdaptiveRevision(){
  var a=wwAdaptiveSummary(),items=a.queue||[];
  if(!items.length){showToast('Aucune priorité à réviser');return;}
  state.adaptiveRevision={items:JSON.parse(JSON.stringify(items)),currentIdx:0,startedAt:new Date().toISOString(),results:[],quiz:null};
  state.statsTab='adaptive';
  saveState();
  render();
}
function wwAdaptiveCurrent(){var s=state.adaptiveRevision;if(!s||!s.items||s.currentIdx>=s.items.length)return null;return s.items[s.currentIdx]}
function wwFinishAdaptiveRevision(){var s=state.adaptiveRevision||{},r=s.results||[],ok=r.filter(function(x){return x.success}).length,difficult=r.filter(function(x){return !x.success}).length,total=(s.items||[]).length;state.adaptiveRevision={items:s.items||[],currentIdx:total,startedAt:s.startedAt||null,results:r,completedAt:new Date().toISOString()};saveState();showToast('🎯 Session adaptative terminée');render()}
function wwAdaptiveGetQuiz(item){
  if(!item||item.type!=='topic'||!item.topicId||!window.WWAdaptiveQuiz)return null;
  var s=state.adaptiveRevision||{};
  if(s.quiz&&s.quiz.itemId===item.topicId)return s.quiz;
  var topic=(state.topics||[]).find(function(t){return t.id===item.topicId});
  var q=window.WWAdaptiveQuiz.get(topic||{title:item.title},state);
  s.quiz={itemId:item.topicId,question:q,selected:null,revealed:false};
  state.adaptiveRevision=s;saveState();
  return s.quiz;
}
function wwAdaptiveAnswer(success){
  var item=wwAdaptiveCurrent();if(!item)return;
  if(item.type==='error'){
    reviewError(item.errorId,success);
  }else if(item.topicId&&window.WWMastery){
    var qstate=state.adaptiveRevision.quiz, q=qstate&&qstate.question;
    var actualCorrect=(q&&q.options&&qstate.selected!==null)?(qstate.selected===q.answer):null;
    if(q&&q.id&&q.id.indexOf('fallback_')!==0){
      if(!state.adaptiveQuestionStats)state.adaptiveQuestionStats={};
      var byTopic=state.adaptiveQuestionStats[item.topicId]||(state.adaptiveQuestionStats[item.topicId]={});
      var qs=byTopic[q.id]||(byTopic[q.id]={attempts:0,correct:0,wrong:0,lastAnswered:null});
      qs.attempts=(qs.attempts||0)+1;
      if(actualCorrect===true)qs.correct=(qs.correct||0)+1;
      if(actualCorrect===false)qs.wrong=(qs.wrong||0)+1;
      qs.lastAnswered=Date.now();
    }
    window.WWMastery.recordReview(state,item.topicId,success);
    var pr=getProgress(item.topicId);pr.score=wwMasteryScore(item.topicId);state.progress[item.topicId]=pr;
    if(success)state.xp+=3;
  }
  if(!state.adaptiveRevision.results)state.adaptiveRevision.results=[];
  state.adaptiveRevision.results.push({id:item.type==='error'?item.errorId:item.topicId,type:item.type,success:!!success,actualCorrect:actualCorrect===null?null:!!actualCorrect,questionId:(state.adaptiveRevision.quiz&&state.adaptiveRevision.quiz.question&&state.adaptiveRevision.quiz.question.id)||null,at:new Date().toISOString()});
  state.adaptiveRevision.currentIdx++;
  state.adaptiveRevision.quiz=null;
  saveState();render();
}
function wwAdaptiveQuizSelect(index){
  var item=wwAdaptiveCurrent();if(!item)return;
  var q=wwAdaptiveGetQuiz(item);if(!q||!q.question||!q.question.options)return;
  q.selected=Number(index);state.adaptiveRevision.quiz=q;saveState();render();
}
function wwAdaptiveQuizReveal(){
  var item=wwAdaptiveCurrent();if(!item)return;
  var q=wwAdaptiveGetQuiz(item);if(!q)return;
  if(q.question.options&&q.selected===null){showToast('Choisis une réponse avant de corriger');return;}
  q.revealed=true;state.adaptiveRevision.quiz=q;saveState();render();
}
function renderAdaptiveRevisionSession(){
  var s=state.adaptiveRevision,item=wwAdaptiveCurrent();
  if(!s)return '';
  var total=(s.items||[]).length,done=Math.min(s.currentIdx,total),r=s.results||[],ok=r.filter(function(x){return x.success}).length,diff=r.filter(function(x){return !x.success}).length;
  if(!item){return '<div class="ww-adaptive-session"><div class="card ww-adaptive-card"><div class="ww-adaptive-session-done">🎉</div><h3 style="text-align:center;">Session adaptative terminée</h3><p class="text-muted" style="text-align:center;">'+total+' priorité'+(total>1?'s':'')+' traitée'+(total>1?'s':'')+' · '+ok+' réussie'+(ok>1?'s':'')+' · '+diff+' à renforcer.</p><div class="ww-adaptive-kpis"><span><b>'+total+'</b> traitées</span><span><b>'+ok+'</b> OK</span><span><b>'+diff+'</b> difficiles</span><span><b>'+((new Date(s.completedAt||Date.now())-new Date(s.startedAt||Date.now()))/60000|0)+'</b> min</span></div><button class="btn-primary" data-adaptive-session-close style="width:100%;justify-content:center;margin-top:12px;">↩️ Retour au moteur</button></div><div class="card"><div class="card-title">🔄 Moteur recalculé</div><p class="text-muted text-small">Les priorités ont été réévaluées après tes réponses. Le Planning n’a pas été modifié.</p><button class="btn-outline" data-stats-tab="adaptive" style="width:100%;justify-content:center;">Voir les nouvelles priorités</button></div></div>'}
  var topic=item.topicId?((state.topics||[]).find(function(t){return t.id===item.topicId})||{}):{};
  var subject=item.subjectId?((state.subjects||[]).find(function(x){return x.id===item.subjectId})||{}):{};
  var title=wwEscapeHTML(item.title),meta=wwEscapeHTML(subject.name||'')+(topic.title?' · '+wwEscapeHTML(topic.title):'');
  var correction='';
  if(item.type==='error'){
    var err=(state.errors||[]).find(function(e){return e.id===item.errorId});
    correction=err&&err.correction?'<div class="rs-correction">💡 Correction mémorisée : '+wwEscapeHTML(err.correction)+'</div>':'';
    return '<div class="ww-adaptive-session"><div class="card ww-adaptive-card"><div class="rs-progress"><span>Session adaptative '+(done+1)+'/'+total+'</span><span>'+ok+' OK · '+diff+' difficiles</span></div><div class="ww-adaptive-progress"><i style="width:'+Math.round(done/total*100)+'%"></i></div><div class="ww-adaptive-type">⚠️ ERREUR À MAÎTRISER</div><div class="ww-adaptive-session-title">'+title+'</div><div class="ww-adaptive-session-meta">'+meta+' · Score '+item.score+'</div><div class="ww-adaptive-reasons">'+(item.reasons||[]).map(function(x){return '<span>'+wwEscapeHTML(x)+'</span>'}).join('')+'</div><div class="ww-adaptive-question">Après relecture, peux-tu expliquer et corriger cette erreur sans aide ?</div><div class="ww-adaptive-answer"><button class="rs-btn-no" data-adaptive-answer="no">❌ Non, encore difficile</button><button class="rs-btn-yes" data-adaptive-answer="yes">✅ Oui, je maîtrise</button></div>'+correction+'<button class="btn-outline btn-small" data-adaptive-session-stop style="width:100%;justify-content:center;margin-top:10px;">Arrêter la session</button></div></div>';
  }
  var qstate=wwAdaptiveGetQuiz(item),q=qstate&&qstate.question;
  var adaptiveLevel=(window.WWAdaptiveQuiz&&window.WWAdaptiveQuiz.targetDifficulty&&item.topicId)?window.WWAdaptiveQuiz.targetDifficulty((state.topics||[]).find(function(t){return t.id===item.topicId})||{id:item.topicId},state):null;
  var quiz='';
  if(q&&q.options){
    var opts=q.options.map(function(o,i){var cls='ww-quiz-option';if(qstate.selected===i)cls+=' selected';if(qstate.revealed&&i===q.answer)cls+=' correct';if(qstate.revealed&&qstate.selected===i&&i!==q.answer)cls+=' wrong';return '<button class="'+cls+'" data-adaptive-quiz-option="'+i+'" '+(qstate.revealed?'disabled':'')+'>'+String.fromCharCode(65+i)+'. '+wwEscapeHTML(o)+'</button>'}).join('');
    quiz='<div class="ww-adaptive-quiz"><div class="ww-quiz-label">🧪 MINI-TEST</div><div class="ww-quiz-question">'+wwEscapeHTML(q.q)+'</div><div class="ww-quiz-options">'+opts+'</div>'+(qstate.revealed?'<div class="ww-quiz-feedback '+(qstate.selected===q.answer?'good':'bad')+'">'+(qstate.selected===q.answer?'✅ Bonne réponse. ':'❌ Réponse incorrecte. ')+'<span>'+wwEscapeHTML(q.why||'')+'</span></div><div class="ww-adaptive-question">Résultat du test : '+(qstate.selected===q.answer?'maîtrisé':'à renforcer')+'.</div><div class="ww-adaptive-answer"><button class="rs-btn-no" data-adaptive-answer="no">❌ Je dois renforcer</button><button class="rs-btn-yes" data-adaptive-answer="yes">✅ Je maîtrise</button></div>':'<button class="btn-primary" data-adaptive-quiz-reveal style="width:100%;justify-content:center;margin-top:10px;" '+(qstate.selected===null?'disabled':'')+'>Corriger le mini-test</button>')+'</div>';
  }else{
    quiz='<div class="ww-adaptive-quiz"><div class="ww-quiz-label">🧠 RAPPEL ACTIF</div><div class="ww-quiz-question">'+wwEscapeHTML(q?q.q:'Explique ce chapitre sans regarder ton cours.')+'</div><div class="ww-quiz-feedback good" style="display:block">Formule ta réponse mentalement ou à l’oral, puis évalue honnêtement ton niveau.</div><div class="ww-adaptive-answer"><button class="rs-btn-no" data-adaptive-answer="no">❌ Je ne savais pas</button><button class="rs-btn-yes" data-adaptive-answer="yes">✅ Je savais l’expliquer</button></div></div>';
  }
  return '<div class="ww-adaptive-session"><div class="card ww-adaptive-card"><div class="rs-progress"><span>Session adaptative '+(done+1)+'/'+total+'</span><span>'+ok+' OK · '+diff+' difficiles</span></div><div class="ww-adaptive-progress"><i style="width:'+Math.round(done/total*100)+'%"></i></div><div class="ww-adaptive-type">📖 CHAPITRE À CONSOLIDER</div><div class="ww-adaptive-session-title">'+title+'</div><div class="ww-adaptive-session-meta">'+meta+' · Score '+item.score+' · '+item.duration+' min estimées</div><div class="ww-adaptive-reasons">'+(item.reasons||[]).map(function(x){return '<span>'+wwEscapeHTML(x)+'</span>'}).join('')+'</div>'+quiz+'<button class="btn-outline btn-small" data-adaptive-session-stop style="width:100%;justify-content:center;margin-top:10px;">Arrêter la session</button></div></div>';
}

function renderAdaptiveRevisionScreen(){
  if(state.adaptiveRevision)return renderAdaptiveRevisionSession();
  var a=wwAdaptiveSummary(),items=a.queue||[];
  if(!items.length)return '<div class="card ww-adaptive-screen"><div style="font-size:34px;text-align:center;margin-bottom:8px;">🧘</div><h3 style="text-align:center;">Aucune priorité forte</h3><p class="text-muted" style="text-align:center;">Continue à enregistrer tes sessions et tes erreurs : le moteur se recalculera automatiquement.</p></div>';
  var list=items.map(function(x,i){var sub=state.subjects.find(function(s){return s.id===x.subjectId});var icon=x.type==='error'?'⚠️':'📖';var action=x.type==='error'?'<button class="btn-primary btn-small" data-review-error="'+x.errorId+'">🔄 Réviser</button>':'<div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end"><button class="btn-primary btn-small" data-adaptive-open-topic="'+x.topicId+'">📖 Ouvrir</button><button class="btn-outline btn-small" data-question-bank="'+x.topicId+'">🧪 Questions</button></div>';return '<div class="ww-adaptive-row"><div class="ww-adaptive-rank">'+(i+1)+'</div><div class="ww-adaptive-icon">'+icon+'</div><div class="ww-adaptive-copy"><b>'+wwEscapeHTML(x.title)+'</b><small>'+(sub?wwEscapeHTML(sub.name)+' · ':'')+x.duration+' min · Score '+x.score+'</small><span>'+x.reasons.map(wwEscapeHTML).join(' · ')+'</span></div>'+action+'</div>'}).join('');
  return '<div class="ww-adaptive-screen"><div class="card ww-adaptive-card"><div class="ww-adaptive-head"><div><div class="card-title">🧠 Adaptive Revision Engine</div><div class="ww-adaptive-sub">Plan de révision explicable · le Planning reste inchangé.</div></div><span class="ww-adaptive-badge">64.2</span></div><div class="ww-adaptive-kpis"><span><b>'+a.total+'</b> priorités</span><span><b>'+a.estimatedMinutes+'</b> min estimées</span><span><b>'+a.errors+'</b> erreurs</span><span><b>'+a.topics+'</b> chapitres</span></div><button class="btn-primary" data-start-adaptive-session style="width:100%;justify-content:center;margin-top:12px;">▶️ Démarrer la session adaptative</button></div><div class="card"><div class="card-title">🎯 Ordre de révision proposé</div><div class="ww-adaptive-rows">'+list+'</div></div><div class="card"><div class="card-title">🧪 Banque de questions</div><p class="text-muted text-small">'+qb.covered+'/'+qb.topics+' chapitres couverts · '+qb.questions+' questions locales · couverture '+qb.coveragePercent+'%</p><div class="ww-adaptive-method"><span>🎯 Questions liées aux Topics</span><span>📊 Performance par question</span><span>🔁 Les moins révisées remontent en priorité</span></div></div><div class="card"><div class="card-title">⚙️ Comment le moteur décide</div><div class="ww-adaptive-method"><span>⚠️ Erreurs non maîtrisées</span><span>🧠 Niveau de Mastery</span><span>⏳ Temps depuis la dernière étude</span><span>🎯 Proximité des examens</span><span>📚 Sessions enregistrées</span></div></div></div>';
}

function renderStats(){
  var tab=state.statsTab||'overview';
  var errDue=getErrorsDueToday().filter(function(e){var t=e.topic_id&&state.topics.find(function(x){return x.id===e.topic_id});return t?wwTopicActive(t):(e.subject_id?wwSubjectActive(e.subject_id):false)}).length;
  var tabsHTML='<div class="inner-tabs">'+
    '<div class="inner-tab '+(tab==='overview'?'active':'')+'" data-stats-tab="overview">📈 Vue générale</div>'+
    '<div class="inner-tab '+(tab==='advanced'?'active':'')+'" data-stats-tab="advanced">📊 Analyses</div>'+
    '<div class="inner-tab '+(tab==='errors'?'active':'')+'" data-stats-tab="errors">⚠️ Erreurs'+(errDue>0?' <span class="tab-count">'+errDue+'</span>':'')+'</div>'+
    '<div class="inner-tab '+(tab==='analytics'?'active':'')+'" data-stats-tab="analytics">🧬 Analytics</div>'+
    '<div class="inner-tab '+(tab==='adaptive'?'active':'')+'" data-stats-tab="adaptive">🧠 Révision</div>'+
    '</div>';
  var content='';
  if(tab==='errors')content=renderErrorsScreen();
  else if(tab==='analytics')content=renderPersonalAnalytics();
  else if(tab==='adaptive')content=renderAdaptiveRevisionScreen();
  else if(tab==='advanced')content=renderAdvancedStats();
  else content=renderStatsOverview();
  return '<div><h2 style="font-size:22px;margin-bottom:16px;">📈 Statistiques</h2>'+tabsHTML+content+'</div>';
}

function renderStatsOverview(){
  var totalSessions=state.sessions.length;
  var totalTopics=state.topics.length;
  var progressed=state.topics.filter(function(t){return getProgress(t.id).level>0}).length;
  var totalHours=getTotalStudyHours();
  var best=null,bestP=-1,worst=null,worstP=101;
  state.subjects.forEach(function(s){var p=getSubjectProgress(s.id);if(p>bestP){bestP=p;best=s}if(p<worstP){worstP=p;worst=s}});
  var progDone=progTotalDone();
  var totalProg=PROGRAMMING_TOPICS.length;
  var resStats=getResourcesStats();
  var avgPerDay=getAveragePerDay();
  var streak=getStudyStreakFromSessions();
  return '<div>'+
    '<div class="stats-hero"><div class="sh-top"><div class="sh-icon">📊</div><div class="sh-title"><h2>Aperçu global</h2><div class="sh-sub">Toutes tes statistiques</div></div></div><div class="sh-grid"><div class="sh-box"><div class="sh-num" style="color:#e8cc6a;">'+state.xp+'</div><div class="sh-lbl">XP Total</div></div><div class="sh-box"><div class="sh-num" style="color:#e86a6a;">'+state.studyStreak+'</div><div class="sh-lbl">Série actuelle</div></div><div class="sh-box"><div class="sh-num" style="color:#6ae8a5;">'+totalHours+'h</div><div class="sh-lbl">Temps total</div></div></div></div>'+
    '<div class="card"><div class="card-title">Master APCE</div><div class="stat-row"><span class="label">⏱️ Temps</span><span class="value">'+totalHours+' h</span></div><div class="stat-row"><span class="label">📚 Sessions</span><span class="value">'+totalSessions+'</span></div><div class="stat-row"><span class="label">📖 Chapitres</span><span class="value">'+progressed+'/'+totalTopics+'</span></div><div class="stat-row"><span class="label">⏱️ Moyenne/jour</span><span class="value">'+avgPerDay+' min</span></div><div class="stat-row"><span class="label">🔥 Série calculée</span><span class="value">'+streak+' jours</span></div><div class="stat-row"><span class="label">🥇 Forte</span><span class="value">'+(best?best.name:'—')+'</span></div><div class="stat-row"><span class="label">⚠️ Faible</span><span class="value">'+(worst?worst.name:'—')+'</span></div></div>'+
    '<div class="card"><div class="card-title">💻 Programmation</div><div class="stat-row"><span class="label">Sujets commencés</span><span class="value">'+progDone+'/'+totalProg+'</span></div></div>'+
    '<div class="card"><div class="card-title">📚 Ressources</div><div class="stat-row"><span class="label">Total</span><span class="value">'+resStats.total+'</span></div><div class="stat-row"><span class="label">⭐ Favoris</span><span class="value">'+resStats.favorites+'</span></div></div>'+
    '<div class="card"><div class="card-title">🌍 Langues</div>'+state.languages.map(function(L){var cur=langCurrentLevel(L.id);var p=langProg(L.id,cur);return '<div style="margin-bottom:12px;"><div class="flex-between text-small"><span>'+L.flag+' '+L.name+' ('+cur+')</span><span>'+p.percent+'%</span></div><div class="progress-bar"><div class="fill" style="width:'+p.percent+'%;"></div></div></div>'}).join('')+'</div>'+
  '</div>';
}

function renderAdvancedStats(){
  return '<div>'+
    '<div class="card"><div class="card-title">🔥 Heatmap annuel <span class="badge">365 jours</span></div><div class="heatmap-wrap">'+generateHeatmapSVG()+'</div><div class="heatmap-legend"><span>Moins</span><div class="hl-box hl-0"></div><div class="hl-box hl-1"></div><div class="hl-box hl-2"></div><div class="hl-box hl-3"></div><div class="hl-box hl-4"></div><span>Plus</span></div></div>'+
    '<div class="objective-card"><div class="obj-header"><div class="obj-title">🎯 Objectif hebdomadaire (7h)</div><div class="obj-percent">'+getWeeklyGoalProgress().percent+'%</div></div><div class="obj-bar"><div class="obj-fill" style="width:'+getWeeklyGoalProgress().percent+'%"></div></div><div class="obj-meta"><span>'+Math.round(getWeeklyGoalProgress().current/60*10)/10+'h cette semaine</span><span>Objectif: 7h</span></div></div>'+
    '<div class="streak-card"><div class="st-fire">🔥</div><div class="st-num">'+getStudyStreakFromSessions()+'</div><div class="st-lbl">Jours consécutifs d\'étude</div><div class="st-sub">Continue comme ça !</div></div>'+
    '<div class="chart-wrap"><div class="chart-title">📊 Étude des 7 derniers jours</div>'+generateBarChartSVG()+'</div>'+
    '<div class="chart-wrap"><div class="chart-title">📈 Évolution mensuelle (6 mois)</div>'+generateLineChartSVG()+'</div>'+
    '<div class="chart-wrap"><div class="chart-title">🥧 Répartition par matière</div>'+generatePieChartSVG()+'</div>'+
    '<div class="card"><div class="card-title">🏆 Top 5 jours d\'étude</div>'+generateTopDaysHTML()+'</div>'+
    '<div class="card"><div class="card-title">📚 Progression par matière</div>'+generateSubjectProgressHTML()+'</div>'+
  '</div>';
}

function renderErrorsScreen(){
  if(state.reviewSession)return renderReviewSession();
  var stats=computeErrorStats();
  var filt=state.errFilter||'all';
  var filtered=getErrorsByStatus(filt);
  var filtLabels={all:'Tout',to_review:'🔴 À revoir',in_progress:'🟡 En cours',mastered:'🟢 Maîtrisées'};
  var filtHTML='<div class="err-filters">'+Object.keys(filtLabels).map(function(k){return '<div class="err-filter '+(filt===k?'active':'')+'" data-err-filter="'+k+'">'+filtLabels[k]+'</div>'}).join('')+'</div>';
  var statsHTML='<div class="err-stats-row"><div class="err-stat-box red"><div class="es-num">'+stats.to_review+'</div><div class="es-lbl">🔴 À revoir</div></div><div class="err-stat-box yellow"><div class="es-num">'+stats.in_progress+'</div><div class="es-lbl">🟡 En cours</div></div><div class="err-stat-box green"><div class="es-num">'+stats.mastered+'</div><div class="es-lbl">🟢 Maîtrisées</div></div></div>';
  var dueCount=getErrorsDueToday().length;
  var startBtn=dueCount>0?'<button class="btn-primary" data-start-review style="width:100%;justify-content:center;margin-bottom:14px;">🔄 Démarrer la révision ('+dueCount+')</button>':'';
  var listHTML='';
  if(state.errors.length===0){listHTML='<div class="err-empty"><div class="empty-icon">🎯</div><div class="empty-text">Aucune erreur enregistrée</div></div>'}
  else if(filtered.length===0){listHTML='<div class="err-empty"><div class="empty-icon">🔍</div><div class="empty-text">Aucune erreur dans ce filtre</div></div>'}
  else{listHTML=filtered.map(function(err){var statusLabel=err.status==='to_review'?'🔴 À revoir':(err.status==='in_progress'?'🟡 En cours':'🟢 Maîtrisé');var revDots='';for(var i=0;i<err.max_revisions;i++){revDots+='<div class="rev-dot '+(i<err.revisions?'filled':'')+'"></div>'}var topicMeta=err.topic_id?((state.topics||[]).find(function(t){return t.id===err.topic_id})||{}).title:'';var meta='<span>📚 '+getErrorSubjectName(err)+'</span>'+(topicMeta?'<span>📖 '+topicMeta+'</span>':'')+'<span>💬 '+getCauseLabel(err.cause)+'</span><span>📅 '+new Date(err.created_at).toLocaleDateString('fr-FR')+'</span>';return '<div class="error-card status-'+err.status+'"><div class="ec-header"><div class="ec-title">'+err.description+'</div><div class="ec-badge">'+statusLabel+'</div></div><div class="ec-meta">'+meta+'</div>'+(err.correction?'<div class="ec-detail">✅ '+err.correction+'</div>':'')+'<div class="ec-revisions"><span>Révisions :</span><div class="rev-dots">'+revDots+'</div><span>'+err.revisions+'/'+err.max_revisions+'</span></div><div class="ec-actions"><button class="btn-small btn-outline" data-review-error="'+err.id+'">🔄 Réviser</button><button class="btn-small btn-outline" data-delete-error="'+err.id+'">🗑️ Supprimer</button></div></div>'}).join('')}
  return '<div>'+statsHTML+'<button class="btn-primary" data-add-error style="width:100%;justify-content:center;margin-bottom:14px;">➕ Ajouter une erreur</button>'+startBtn+filtHTML+listHTML+'</div>';
}

function renderReviewSession(){
  var session=state.reviewSession;
  if(!session||session.currentIdx>=session.errors.length){
    var reviewed=session?session.errors.length:0;state.reviewSession=null;
    return '<div class="review-session" style="text-align:center;"><div style="font-size:48px;margin-bottom:12px;">🎉</div><div style="font-size:18px;font-weight:700;color:#6ae8a5;margin-bottom:8px;">Session terminée !</div><div style="font-size:13px;color:#c8d6e5;margin-bottom:16px;">Tu as révisé '+reviewed+' erreur'+(reviewed>1?'s':'')+'.</div><button class="btn-primary" data-end-review style="width:100%;justify-content:center;">Retour</button></div>';
  }
  var err=session.errors[session.currentIdx];var topicMeta=err.topic_id?((state.topics||[]).find(function(t){return t.id===err.topic_id})||{}).title:'';var meta=getErrorSubjectName(err)+(topicMeta?' · '+topicMeta:'')+' · '+getCauseLabel(err.cause);
  return '<div class="review-session"><div class="rs-progress"><span>Révision '+(session.currentIdx+1)+'/'+session.errors.length+'</span><span>Révisions: '+err.revisions+'/'+err.max_revisions+'</span></div><div class="rs-question">'+err.description+'</div><div style="font-size:12px;color:#8ba2c0;text-align:center;margin-bottom:12px;">'+meta+'</div>'+(err.correction?'<div class="rs-correction">✅ '+err.correction+'</div>':'')+'<div style="font-size:13px;color:#c8d6e5;text-align:center;margin-bottom:14px;">Maîtrises-tu ?</div><div class="rs-actions"><button class="rs-btn-no" data-review-result="no">❌ Non</button><button class="rs-btn-yes" data-review-result="yes">✅ Oui</button></div><button class="btn-outline btn-small" data-end-review style="width:100%;justify-content:center;margin-top:10px;">Arrêter</button></div>';
}

function wwScheduleToMinutes(t){var p=String(t||'').split(':');return (+p[0]||0)*60+(+p[1]||0)}
function wwScheduleDuration(c){return Math.max(0,wwScheduleToMinutes(c.end)-wwScheduleToMinutes(c.start))}
function wwScheduleSubjectId(subject){var q=String(subject||'').toLowerCase().replace(/[éèêë]/g,'e').replace(/[àâä]/g,'a').replace(/[îï]/g,'i').replace(/[ôö]/g,'o').replace(/[ùûü]/g,'u').replace(/[^a-z0-9]+/g,' ').trim();var aliases=[['s1',['spectroscopie moleculaire']],['s2',['spectroscopie atomique']],['s3',['chimie analytique']],['s4',['separation chromat','chromato']],['s5',['analyse des solides']],['s6',['normes et qualite']],['s7',['hygiene securite','hygiene securite et qualite']],['s8',['genie chimique']],['s9',['efficacite energetique']]];for(var i=0;i<aliases.length;i++){for(var j=0;j<aliases[i][1].length;j++){if(q.indexOf(aliases[i][1][j])!==-1)return aliases[i][0]}}return null}
function wwEmploiNow(){var now=new Date(),day=wwDayKey(),mins=now.getHours()*60+now.getMinutes()+now.getSeconds()/60,classes=COURSE_SCHEDULE.filter(function(c){return c.day===day}).sort(function(a,b){return wwScheduleToMinutes(a.start)-wwScheduleToMinutes(b.start)});for(var i=0;i<classes.length;i++){var c=classes[i],a=wwScheduleToMinutes(c.start),b=wwScheduleToMinutes(c.end);if(mins>=a&&mins<b)return{type:'current',course:c,progress:Math.max(0,Math.min(100,((mins-a)/(b-a))*100)),remaining:Math.max(0,b-mins),mins:mins}}for(var k=0;k<classes.length;k++){if(wwScheduleToMinutes(classes[k].start)>mins)return{type:'nextToday',course:classes[k],until:wwScheduleToMinutes(classes[k].start)-mins,mins:mins}}return{type:'none',mins:mins} }
function wwEmploiUpcoming(limit){var now=new Date(),todayIndex=now.getDay(),mins=now.getHours()*60+now.getMinutes()+now.getSeconds()/60,order=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'],out=[];for(var offset=0;offset<7&&out.length<(limit||3);offset++){var idx=(todayIndex+offset)%7,day=order[idx],classes=COURSE_SCHEDULE.filter(function(c){return c.day===day}).sort(function(a,b){return wwScheduleToMinutes(a.start)-wwScheduleToMinutes(b.start)});for(var i=0;i<classes.length&&out.length<(limit||3);i++){if(offset>0||wwScheduleToMinutes(classes[i].start)>mins)out.push({course:classes[i],day:day,days:offset,until:offset*1440+wwScheduleToMinutes(classes[i].start)-mins})}}return out}
function wwEmploiNext(){return wwEmploiUpcoming(1)[0]||null}
function wwFormatCountdown(mins){mins=Math.max(0,Math.round(mins));if(mins<60)return mins+' min';var h=Math.floor(mins/60),m=mins%60;return h+'h'+(m?' '+String(m).padStart(2,'0')+' min':'')}
function wwFormatDuration(mins){mins=Math.max(0,Math.round(mins));return mins<60?mins+' min':Math.floor(mins/60)+'h'+(mins%60?' '+(mins%60)+'min':'')}
function wwEmploiDayStats(day){var classes=COURSE_SCHEDULE.filter(function(c){return c.day===day}).sort(function(a,b){return wwScheduleToMinutes(a.start)-wwScheduleToMinutes(b.start)}),total=classes.reduce(function(sum,c){return sum+wwScheduleDuration(c)},0),gaps=[];for(var i=1;i<classes.length;i++){var gap=wwScheduleToMinutes(classes[i].start)-wwScheduleToMinutes(classes[i-1].end);if(gap>0)gaps.push({start:classes[i-1].end,end:classes[i].start,duration:gap})}var span=classes.length?wwScheduleToMinutes(classes[classes.length-1].end)-wwScheduleToMinutes(classes[0].start):0;return{classes:classes,total:total,gaps:gaps,span:span,occupation:span?Math.round(total/span*100):0}}
function wwEmploiSubjectProgress(subjectId){if(!subjectId)return null;var tops=state.topics.filter(function(t){return t.subject_id===subjectId});if(!tops.length)return null;var total=tops.reduce(function(s,t){return s+getProgress(t.id).level},0);return Math.round((total/(tops.length*4))*100)}
function wwEmploiTypeIcon(type){return type==='TP'?'🧪':(type==='TD'?'📝':'📚')}
function wwEmploiDayName(key){var map={dimanche:'Dimanche',lundi:'Lundi',mardi:'Mardi',mercredi:'Mercredi',jeudi:'Jeudi',vendredi:'Vendredi',samedi:'Samedi'};return map[key]||key}
function renderEmploi(){
  var days=['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
  var keys=['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'];
  var nowInfo=wwEmploiNow(),next=wwEmploiNext(),upcoming=wwEmploiUpcoming(3),today=wwDayKey(),todayIdx=keys.indexOf(today);
  var mode='week';try{mode=localStorage.getItem('wwEmploiMode')||'week'}catch(e){}
  var focusDay=(mode==='today'&&todayIdx>=0)?today:null,roomMode=mode==='room';
  var visibleKeys=focusDay?[focusDay]:keys;
  var totalWeek=COURSE_SCHEDULE.reduce(function(s,c){return s+wwScheduleDuration(c)},0),weekCount=COURSE_SCHEDULE.length,todayStats=todayIdx>=0?wwEmploiDayStats(today):{classes:[],total:0,gaps:[],occupation:0,span:0};
  var nowMinutes=nowInfo.mins||0;
  var todayCompleted=todayStats.classes.filter(function(c){return wwScheduleToMinutes(c.end)<=nowMinutes}).length;
  var todayRemaining=todayStats.classes.length-todayCompleted-(nowInfo.type==='current'?1:0); if(todayRemaining<0)todayRemaining=0;
  var dateLabel=new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'2-digit',month:'long'});
  var header='<div class="emploi-head"><div class="emploi-kicker">ACADEMIC SCHEDULE</div><div class="flex-between"><div><h2 class="emploi-title">📋 Emploi du temps</h2><div class="emploi-subtitle">Ton rythme réel · cours · pauses · salles</div><div class="emploi-date">'+dateLabel+'</div></div><div class="emploi-live-dot '+(nowInfo.type==='current'?'active':'')+'"></div></div>';
  var controls='<div class="emploi-controls"><button class="emploi-mode '+(mode==='today'?'active':'')+'" data-emploi-mode="today">📅 Aujourd\'hui</button><button class="emploi-mode '+(mode==='week'?'active':'')+'" data-emploi-mode="week">🗓️ Semaine</button><button class="emploi-mode '+(mode==='room'?'active':'')+'" data-emploi-mode="room">📍 Mode salle</button></div></div>';
  var status='';
  if(nowInfo.type==='current'){var cc=nowInfo.course;status='<div class="emploi-now card"><div class="emploi-now-top"><span class="emploi-status-pill live">🟢 EN COURS</span><span>'+Math.ceil(nowInfo.remaining)+' min restantes</span></div><div class="emploi-now-main"><div><div class="emploi-now-subject">'+cc.subject+'</div><div class="emploi-now-meta">'+cc.start+' – '+cc.end+' · '+cc.type+' · 📍 '+cc.room+'</div></div><div class="emploi-progress-ring" style="--p:'+nowInfo.progress+'%"><span>'+Math.round(nowInfo.progress)+'%</span></div></div><div class="emploi-progress"><div style="width:'+nowInfo.progress+'%"></div></div><div class="emploi-live-clock">🕐 Maintenant · '+new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})+'</div></div>'}
  else if(next){var nc=next.course;status='<div class="emploi-next card"><div class="emploi-now-top"><span class="emploi-status-pill next">⏳ PROCHAIN</span><span>dans '+wwFormatCountdown(next.until)+'</span></div><div class="emploi-next-main"><div><div class="emploi-now-subject">'+nc.subject+'</div><div class="emploi-now-meta">'+(next.days===0?'Aujourd\'hui':'Dans '+next.days+' jour'+(next.days>1?'s':''))+' · '+nc.start+' – '+nc.end+' · 📍 '+nc.room+'</div></div><div class="emploi-next-arrow">→</div></div></div>'}
  else{status='<div class="emploi-next card"><div class="emploi-now-top"><span class="emploi-status-pill free">☕ LIBRE</span><span>Aucun cours à venir</span></div><div class="emploi-now-subject">Profite de ton temps libre.</div></div>'}
  var upcomingHTML=upcoming.length?'<div class="emploi-upcoming"><div class="emploi-mini-head"><span>→ ENSUITE</span><small>3 prochaines séances</small></div>'+upcoming.map(function(x,i){var c=x.course;return '<button class="emploi-upcoming-item" data-emploi-course="'+(c.subject+'|'+c.start+'|'+c.end+'|'+c.type+'|'+c.room).replace(/"/g,'&quot;')+'"><span class="emploi-upcoming-index">'+(i+1)+'</span><span class="emploi-upcoming-main"><strong>'+c.subject+'</strong><small>'+wwEmploiDayName(x.day)+' · '+c.start+'–'+c.end+' · '+c.room+'</small></span><span class="emploi-upcoming-count">'+(x.days===0?'Aujourd\'hui':x.days+'j')+'</span></button>'}).join('')+'</div>':'<div class="emploi-upcoming empty"><div class="emploi-mini-head"><span>✓ PROGRAMME</span><small>aucune séance à venir</small></div></div>';
  var last=todayStats.classes.filter(function(c){return wwScheduleToMinutes(c.end)<=nowMinutes}).slice(-1)[0];
  var lastHTML=last?'<div class="emploi-last"><span>✓ DERNIÈRE SÉANCE</span><strong>'+last.subject+'</strong><small>'+last.start+' – '+last.end+' · '+last.room+'</small></div>':'';
  var freeToday=todayStats.gaps.reduce(function(s,g){return s+g.duration},0);
  var summary='<div class="emploi-summary"><div class="emploi-stat"><span>📚</span><strong>'+weekCount+'</strong><small>séances semaine</small></div><div class="emploi-stat"><span>⏱️</span><strong>'+wwFormatDuration(totalWeek)+'</strong><small>heures de cours</small></div><div class="emploi-stat"><span>📅</span><strong>'+todayStats.classes.length+'</strong><small>séances aujourd\'hui</small></div><div class="emploi-stat"><span>⏳</span><strong>'+wwFormatDuration(freeToday)+'</strong><small>temps libre</small></div></div>';
  var statusBar='<div class="emploi-statusbar"><div><span>✓</span><strong>'+todayCompleted+'</strong><small>terminées</small></div><div><span>🟢</span><strong>'+(nowInfo.type==='current'?1:0)+'</strong><small>en cours</small></div><div><span>→</span><strong>'+todayRemaining+'</strong><small>restantes</small></div><div><span>◷</span><strong>'+todayStats.occupation+'%</strong><small>occupation</small></div></div>';
  var cards=visibleKeys.map(function(k){var idx=keys.indexOf(k),stats=wwEmploiDayStats(k),classes=stats.classes;if(roomMode&&k!==today)return '';var isToday=k===today,dayLabel=days[idx],dayTag=isToday?'<span class="emploi-today-tag">AUJOURD\'HUI</span>':'';var body='';
    if(!classes.length)body='<div class="text-muted text-small">Aucun cours</div>';else{
      body=classes.map(function(c,i){var before=wwScheduleToMinutes(c.start),after=wwScheduleToMinutes(c.end),subjectId=wwScheduleSubjectId(c.subject),p=wwEmploiSubjectProgress(subjectId),current=nowInfo.type==='current'&&nowInfo.course===c,done=isToday&&after<=nowMinutes,marker='';
        if(isToday){var prev=i?wwScheduleToMinutes(classes[i-1].end):-1;if(nowMinutes>=before&&nowMinutes<after)marker='<div class="emploi-time-line"><span>🕐 '+new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})+'</span></div>';else if(i===0&&nowMinutes<before)marker='<div class="emploi-time-line"><span>🕐 '+new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})+'</span></div>';else if(i>0&&nowMinutes>=prev&&nowMinutes<before)marker='<div class="emploi-time-line"><span>🕐 '+new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})+'</span></div>'}
        var detail=''+c.subject+'|'+c.start+'|'+c.end+'|'+c.type+'|'+c.room;
        var mastery=p!==null?'<span class="emploi-mastery">🎯 '+p+'%</span>':'<span class="emploi-mastery empty">Non liée</span>';
        return marker+'<button class="emploi-course '+(current?'is-current ':'')+(done?'is-done':'')+'" data-emploi-course="'+detail.replace(/"/g,'&quot;')+'"><div class="emploi-course-left"><div class="emploi-course-title">'+wwEmploiTypeIcon(c.type)+' '+c.subject+'</div><div class="emploi-course-meta"><span class="emploi-type">'+c.type+'</span>'+mastery+(done?'<span class="emploi-done-tag">✓ TERMINÉ</span>':'')+'</div></div><div class="emploi-course-right"><span class="emploi-time">'+c.start+' – '+c.end+'</span><span class="emploi-room">• '+c.room+'</span>'+(current?'<span class="emploi-mini-live">NOW</span>':'')+'</div></button>';
      }).join('');
      if(isToday&&nowMinutes>=wwScheduleToMinutes(classes[classes.length-1].end))body+='<div class="emploi-time-line bottom"><span>🕐 '+new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})+'</span></div>';
    }
    var gapInfo=stats.gaps.length?'<div class="emploi-gaps">'+stats.gaps.map(function(g){return '<div class="emploi-gap"><span>⏳ '+g.start+' – '+g.end+'</span><strong>'+wwFormatDuration(g.duration)+'</strong><small>temps libre</small></div>'}).join('')+'</div>':'';
    return '<section class="emploi-day card '+(isToday?'is-today':'')+'"><div class="emploi-day-head"><div><div class="emploi-day-title">'+dayLabel+' '+dayTag+'</div><div class="emploi-day-meta">'+classes.length+' séance'+(classes.length>1?'s':'')+' · '+wwFormatDuration(stats.total)+' · '+stats.occupation+'% occupation</div></div><div class="emploi-day-total">'+wwFormatDuration(stats.total)+'</div></div>'+body+gapInfo+'</section>';}).join('');
  if(roomMode){var roomMap={};todayStats.classes.forEach(function(c){(roomMap[c.room]||(roomMap[c.room]=[])).push(c)});cards='<section class="emploi-room-view card"><div class="emploi-room-head"><div><div class="emploi-day-title">📍 Mode salle · '+wwEmploiDayName(today)+'</div><div class="emploi-day-meta">'+Object.keys(roomMap).length+' salle'+(Object.keys(roomMap).length>1?'s':'')+' aujourd\'hui</div></div></div>'+Object.keys(roomMap).map(function(room){return '<div class="emploi-room-group"><div class="emploi-room-title">📍 '+room+' <span>'+roomMap[room].length+'</span></div>'+roomMap[room].map(function(c){return '<button class="emploi-course" data-emploi-course="'+(c.subject+'|'+c.start+'|'+c.end+'|'+c.type+'|'+c.room).replace(/"/g,'&quot;')+'"><div class="emploi-course-left"><div class="emploi-course-title">'+wwEmploiTypeIcon(c.type)+' '+c.subject+'</div><div class="emploi-course-meta"><span class="emploi-type">'+c.type+'</span></div></div><div class="emploi-course-right"><span class="emploi-time">'+c.start+' – '+c.end+'</span></div></button>'}).join('')+'</div>'}).join('')+'</section>'}
  var footer='<div class="emploi-tip"><span>💡</span><div><strong>Mode intelligent</strong><p>Le planning reste fixe : White Wolf met en évidence le présent, le prochain cours, les séances terminées et tes créneaux libres sans modifier ton emploi.</p></div></div>';
  return header+controls+status+upcomingHTML+lastHTML+summary+statusBar+cards+footer;
}
function renderResources(){
  var all=getAllResources();var stats=getResourcesStats();var filtered=filterResources(all);
  var ri=window.WWResourceIntel?WWResourceIntel.usage():{total:all.length,totalMinutes:0,used:0,recent:0,orphan:0};
  var cov=window.WWResourceIntel?WWResourceIntel.topicCoverage():{activeTopics:0,coveredTopics:0,percent:0,uncovered:[]};
  var recs=window.WWResourceIntel?WWResourceIntel.recommendations(5):[];
  var intel='<div class="ww-resource-intel card"><div class="ww-resource-intel-head"><div><div class="card-title">🧠 Resource Intelligence</div><div class="ww-resource-intel-sub">ربط الموارد بنطاق دراستك ومستوى إتقانك واستخدامك الفعلي.</div></div><span class="ww-resource-intel-badge">V65.23</span></div><div class="ww-resource-kpis"><div><b>'+cov.percent+'%</b><span>تغطية الفصول</span><small>'+cov.coveredTopics+'/'+cov.activeTopics+' نشطة</small></div><div><b>'+ri.used+'</b><span>موارد مستعملة</span><small>'+ri.recent+' خلال 7 أيام</small></div><div><b>'+ri.totalMinutes+'</b><span>دقائق دراسة</span><small>'+ri.orphan+' بدون فصل</small></div></div>'+(recs.length?'<div class="ww-resource-recommendations"><strong>🎯 موارد تستحق العودة إليها</strong>'+recs.slice(0,4).map(function(r){var t=r.topic?'<span> · '+wwEscapeHTML(r.topic.title)+'</span>':'';return '<button class="ww-resource-rec" data-open-resource-intel="'+r.subjectId+'|'+r.id+'"><span class="ww-rec-score">'+r.resourceScore+'</span><span><b>'+wwEscapeHTML(r.title)+'</b><small>'+getResourceTypeLabel(r.type)+t+'</small></span><i>›</i></button>'}).join('')+'</div>':'')+(cov.uncovered.length?'<div class="ww-resource-gap"><strong>⚠️ فصول بلا مورد مرتبط</strong><span>'+cov.uncovered.slice(0,5).map(function(t){return wwEscapeHTML(t.title)}).join(' · ')+(cov.uncovered.length>5?' · +'+(cov.uncovered.length-5):'')+'</span></div>':'')+'</div>';

  var header='<div class="res-header"><div class="res-top"><div class="res-icon-main">📚</div><div class="res-title"><h2>Ressources</h2><div class="res-sub">Centralise tes fichiers, liens et temps d’étude</div></div></div><div class="res-stats"><div class="res-stat"><div class="rs-num">'+stats.total+'</div><div class="rs-lbl">Total</div></div><div class="res-stat"><div class="rs-num" style="color:#6ae8a5;">'+stats.studied+'</div><div class="rs-lbl">Étudiées</div></div><div class="res-stat"><div class="rs-num" style="color:#8fb3e6;">'+stats.minutes+' min</div><div class="rs-lbl">Temps d’étude</div></div><div class="res-stat"><div class="rs-num" style="color:#e8cc6a;">'+stats.completion+'%</div><div class="rs-lbl">Progression</div></div></div><div class="res-progress"><div class="res-progress-fill" style="width:'+stats.completion+'%"></div></div></div>';
  var search='<div class="res-search"><input type="text" id="res-search-input" placeholder="🔍 Rechercher..." value="'+state.resSearch+'"><span class="search-icon">🔍</span></div>';
  var actions='<div class="res-quick-actions"><button class="res-action-btn primary" data-add-resource>➕ Ajouter une ressource</button><button class="res-action-btn secondary" data-add-folder>📁 Dossier</button></div>';
  var filterLabels={Tout:'Tout',pdf:'📄 PDF',doc:'📝 Docs',image:'🖼️ Images',video:'🎥 Vidéos',audio:'🎵 Audio',link:'🔗 Liens','⭐ Favoris':'⭐ Favoris'};
  var filters='<div class="res-filters">'+Object.keys(filterLabels).map(function(k){return '<div class="res-filter '+(state.resFilter===k?'active':'')+'" data-res-filter="'+k+'">'+filterLabels[k]+'</div>'}).join('')+'</div>';
  var content='';
  if(filtered.length===0){content='<div class="res-empty"><div class="re-icon">📚</div><div class="re-text">'+(all.length===0?'Aucune ressource':'Aucun résultat')+'</div>'+(all.length===0?'<button class="btn-primary" data-add-resource>➕ Ajouter</button>':'')+'</div>'}
  else{var grouped={};filtered.forEach(function(r){if(!grouped[r.subjectName])grouped[r.subjectName]=[];grouped[r.subjectName].push(r)});content=Object.keys(grouped).map(function(subjectName){var items=grouped[subjectName];var isOpen=state.resOpenGroups[subjectName]!==false;var itemsHTML=isOpen?items.map(function(r){var type=r.type;var icon=getResourceIcon(type);var domain=getDomainName(r.url);var star=r.favorite?'⭐':'☆';var studied=r.studied?'active':'';var studyTime=Number(r.studyMinutes||0);var openLabel=r.fileKey?'📄 Ouvrir fichier':'🔗 Ouvrir';return '<div class="res-card type-'+type+' '+(r.studied?'is-studied':'')+'"><div class="rc-star '+(r.favorite?'active':'')+'" data-toggle-fav="'+r.subjectId+'|'+r.id+'">'+star+'</div><div class="rc-header"><div class="rc-icon">'+icon+'</div><div class="rc-info"><div class="rc-title">'+r.title+'</div><div class="rc-meta"><span class="rc-badge">'+getResourceTypeLabel(type)+'</span>'+(r.fileName?'<span>📎 '+r.fileName+'</span>':'')+(r.topic_id?'<span>🎯 '+((state.topics||[]).find(function(t){return t.id===r.topic_id})||{}).title+'</span>':'')+(domain?'<span>🌐 '+domain+'</span>':'')+'</div></div></div><div class="rc-study"><button class="btn-study '+studied+'" data-toggle-studied="'+r.subjectId+'|'+r.id+'">'+(r.studied?'✓ Étudiée':'○ Marquer étudiée')+'</button><span class="study-time">⏱ '+studyTime+' min</span><button class="btn-time" data-log-resource-time="'+r.subjectId+'|'+r.id+'">+ Temps</button></div><div class="rc-actions">'+(r.fileKey?'<button class="btn-open" data-open-resource="'+r.subjectId+'|'+r.id+'">'+openLabel+'</button>':'<a href="'+(r.url||'#')+'" target="_blank" class="btn-open">'+openLabel+'</a>')+(r.url?'<button class="btn-copy" data-copy-url="'+r.url.replace(/"/g,'&quot;')+'">📋</button>':'')+(window.WWDocumentIntel&&window.WWDocumentIntel.get&&window.WWDocumentIntel.get(r.id)?'<button class="btn-open" data-map-resource="'+r.id+'">🧭 أقسام</button><button class="btn-open" data-search-resource="'+r.id+'">🔎 بحث</button>':'<button class="btn-open" data-index-resource="'+r.id+'">🧠 فهرسة</button>')+'<button class="btn-delete" data-delete-resource="'+r.subjectId+'|'+r.id+'">🗑️</button></div></div>'}).join(''):'';return '<div style="margin-bottom:16px;"><div class="res-group-header '+(isOpen?'open':'')+'" data-toggle-group="'+subjectName+'"><div class="rgh-title">📚 '+subjectName+'</div><div style="display:flex;align-items:center;gap:10px;"><span class="rgh-count">'+items.length+'</span><span class="rgh-arrow">'+(isOpen?'▼':'▶')+'</span></div></div>'+itemsHTML+'</div>'}).join('')}
  return '<div>'+header+intel+search+actions+filters+'<div class="card" style="padding:14px;">'+content+'</div></div>'+(window.WWV46LibraryHTML?window.WWV46LibraryHTML():'');
}


function wwQuizDifficultyLabel(d){return d==='Easy'?'🟢 Facile':(d==='Hard'?'🔴 Difficile':'🟠 Moyen')}
function wwOpenQuestionBank(topicId){state.modal={type:'questionBank',topicId:topicId};render()}
function wwSaveCustomQuestion(){
  var tid=document.getElementById('qb-topic').value,q=document.getElementById('qb-question').value.trim();
  var o=[1,2,3,4].map(function(i){return document.getElementById('qb-o'+i).value.trim()});
  var ans=parseInt(document.getElementById('qb-answer').value,10),diff=document.getElementById('qb-difficulty').value,why=document.getElementById('qb-why').value.trim();
  if(!tid||!q||o.some(function(x){return !x})||![0,1,2,3].includes(ans)){alert('Complète la question, les 4 réponses et la bonne réponse.');return}
  if(!state.adaptiveCustomQuestions)state.adaptiveCustomQuestions={};
  if(!state.adaptiveCustomQuestions[tid])state.adaptiveCustomQuestions[tid]=[];
  state.adaptiveCustomQuestions[tid].push({id:'custom_'+generateId(),q:q,options:o,answer:ans,why:why||'Question personnalisée ajoutée par l’étudiant.',difficulty:diff,createdAt:new Date().toISOString(),custom:true});
  state.modal={type:'questionBank',topicId:tid};saveState();showToast('🧪 Question ajoutée');render();
}
function wwDeleteCustomQuestion(topicId,qid){
  if(!confirm('Supprimer cette question personnalisée ?'))return;
  var a=state.adaptiveCustomQuestions&&state.adaptiveCustomQuestions[topicId]||[];state.adaptiveCustomQuestions[topicId]=a.filter(function(q){return q.id!==qid});saveState();render();
}

function renderModal(){
  var m=state.modal;if(!m)return '';
  if(m.type==='notifications'){var notifs=state.notifications||[];var unread=notifs.filter(function(n){return !state.readNotifications[n.id]});var listHTML='';if(notifs.length===0){listHTML='<div class="notif-empty"><div class="ne-icon">🔕</div><div class="ne-text">Aucune notification</div></div>'}else{listHTML='<div class="notif-list">'+notifs.map(function(n){var isRead=state.readNotifications[n.id];return '<div class="notif-item '+n.type+'" style="'+(isRead?'opacity:.5':'')+'"><div class="ni-icon">'+n.icon+'</div><div class="ni-content"><div class="ni-title">'+n.title+'</div><div class="ni-meta">'+n.text+'</div></div></div>'}).join('')+'</div>'}var clearBtn=unread.length>0?'<button class="btn-outline btn-small" data-mark-all-read style="margin-bottom:12px;">✅ Tout marquer comme lu</button>':'';return '<div class="modal-overlay"><div class="modal-content"><span class="close-btn" data-close-modal>❌</span><h3>📬 Notifications</h3>'+clearBtn+listHTML+'<div class="modal-actions"><button class="btn-primary" data-close-modal>Fermer</button></div></div></div>'}
  if(m.type==='about'){return '<div class="modal-overlay"><div class="modal-content"><span class="close-btn" data-close-modal>❌</span><h3>ℹ️ À propos</h3><div style="text-align:center;padding:10px 0;"><img src="logo.svg" alt="White Wolf Scholar" style="width:min(100%,280px);height:auto;aspect-ratio:1/1;object-fit:contain;margin:0 auto 10px;display:block;border-radius:16px;"><div style="font-weight:600;font-size:22px;">White Wolf Scholar</div><div class="text-muted">Advanced Stats</div><div class="text-muted text-small" style="margin-top:8px;">+ Heatmap · Charts · Analyse avancée</div></div><div class="modal-actions"><button class="btn-primary" data-close-modal>Fermer</button></div></div></div>'}
  if(m.type==='task'){var today=wwLocalDateISO(new Date());return '<div class="modal-overlay"><div class="modal-content"><span class="close-btn" data-close-modal>❌</span><h3>➕ Nouvelle tâche</h3><div style="display:grid;gap:12px;"><input id="task-text" placeholder="Description" autofocus><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;"><div><label>📅 Date</label><input type="date" id="task-date" value="'+today+'"></div><div><label>⏰ Heure</label><input type="time" id="task-time" value="09:00"></div></div><div><label>🎯 Priorité</label><select id="task-priority"><option value="Basse">🟢 Basse</option><option value="Moyenne" selected>🟡 Moyenne</option><option value="Haute">🔴 Haute</option></select></div></div><div class="modal-actions"><button class="btn-outline" data-close-modal>Annuler</button><button class="btn-primary" data-save-task>✅ Enregistrer</button></div></div></div>'}
  if(m.type==='exam'){var today2=wwLocalDateISO(new Date());return '<div class="modal-overlay"><div class="modal-content"><span class="close-btn" data-close-modal>❌</span><h3>📝 Nouvel examen</h3><div style="display:grid;gap:12px;"><input id="exam-title" placeholder="Titre" autofocus><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;"><div><label>📅 Date</label><input type="date" id="exam-date" value="'+today2+'"></div><div><label>⏰ Heure</label><input type="time" id="exam-time" value="09:00"></div></div><div><label>📚 Matière</label><select id="exam-subject"><option value="">Aucune</option>'+state.subjects.map(function(s){return '<option value="'+s.id+'">'+s.name+'</option>'}).join('')+'</select></div><div><label>📍 Salle</label><input id="exam-room" placeholder="Ex. P21, ME205, S.C.CHIM..."></div><textarea id="exam-notes" rows="2" placeholder="Notes"></textarea></div><div class="modal-actions"><button class="btn-outline" data-close-modal>Annuler</button><button class="btn-primary" data-save-exam>✅ Enregistrer</button></div></div></div>'}
  if(m.type==='examPrep'){return renderExamPreparation(wwFindExam(m.examId))}
  if(m.type==='folder'){return '<div class="modal-overlay"><div class="modal-content"><span class="close-btn" data-close-modal>❌</span><h3>📁 Nouveau dossier</h3><div style="display:grid;gap:12px;"><select id="folder-subject"><option value="">Choisir matière</option>'+state.subjects.map(function(s){return '<option value="'+s.id+'">'+s.name+'</option>'}).join('')+'</select><input id="folder-name" placeholder="Nom du dossier"></div><div class="modal-actions"><button class="btn-outline" data-close-modal>Annuler</button><button class="btn-primary" data-save-folder>Enregistrer</button></div></div></div>'}
  if(m.type==='resource'){return '<div class="modal-overlay"><div class="modal-content"><span class="close-btn" data-close-modal>❌</span><h3>📚 Nouvelle ressource</h3><div style="display:grid;gap:12px;"><select id="resource-subject"><option value="">Choisir matière</option>'+state.subjects.map(function(s){return '<option value="'+s.id+'">'+s.name+'</option>'}).join('')+'</select><select id="resource-topic"><option value="">Associer à un chapitre (optionnel)</option>'+state.topics.map(function(t){return '<option value="'+t.id+'">'+t.title+'</option>'}).join('')+'</select><input id="resource-title" placeholder="Titre"><div class="res-input-label">🔗 Lien direct (optionnel)</div><input id="resource-url" placeholder="https://..." type="url"><div class="res-or">— ou —</div><div class="res-input-label">📥 Fichier sur le téléphone</div><button type="button" class="btn-outline" data-pick-resource-file>Choisir un fichier depuis le stockage</button><div id="resource-file-name" class="text-muted text-small">Aucun fichier sélectionné</div><input id="resource-file" type="file" accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.mp3,.mp4,.webm,.ppt,.pptx" style="display:none"><div class="text-muted text-small">Le fichier reste local. Si le navigateur le permet, White Wolf conserve une référence au fichier; sinon, une copie locale est stockée dans IndexedDB.</div></div><div class="modal-actions"><button class="btn-outline" data-close-modal>Annuler</button><button class="btn-primary" data-save-resource>✅ Enregistrer</button></div></div></div>'}
  if(m.type==='emploiCourse'){var parts=String(m.data||'').split('|'),sub=parts[0]||'Cours',start=parts[1]||'',end=parts[2]||'',type=parts[3]||'Cours',room=parts[4]||'',sid=wwScheduleSubjectId(sub),master=state.subjects.find(function(x){return x.id===sid}),prog=wwEmploiSubjectProgress(sid);return '<div class="modal-overlay"><div class="modal-content emploi-detail-modal"><span class="close-btn" data-close-modal>❌</span><div class="emploi-detail-icon">'+(type==='TP'?'🧪':type==='TD'?'📝':'📚')+'</div><h3>'+sub+'</h3><div class="emploi-detail-grid"><div><span>🕐 Horaire</span><strong>'+start+' – '+end+'</strong></div><div><span>📍 Salle</span><strong>'+room+'</strong></div><div><span>🏷️ Type</span><strong>'+type+'</strong></div><div><span>🎯 Maîtrise</span><strong>'+(prog===null?'—':prog+'%')+'</strong></div></div>'+(master?'<div class="emploi-master-link"><span>📚 Matière liée</span><strong>'+master.name+'</strong><small>'+master.code+' · '+master.credits+' crédits</small></div>':'<div class="emploi-master-link muted">Aucune matière Master automatiquement associée.</div>')+'<div class="modal-actions">'+(master?'<button class="btn-primary" data-route="subject" data-subject-id="'+master.id+'">Ouvrir la matière →</button>':'')+'<button class="btn-outline" data-close-modal>Fermer</button></div></div></div>'}
  if(m.type==='resourceSearch'){
    var rr=window.WWResourceIntel&&WWResourceIntel.all?WWResourceIntel.all().find(function(x){return x.id===m.resourceId}):null;
    var di=rr&&window.WWDocumentIntel?WWDocumentIntel.get(rr.id):null;
    return '<div class="modal-overlay"><div class="modal-content ww-resource-search-modal"><span class="close-btn" data-close-modal>❌</span><h3>🔎 البحث داخل المصدر</h3><p class="text-muted text-small">'+wwEscapeHTML(rr?rr.title:'Document')+'</p><input id="resource-content-query" placeholder="ابحث عن مفهوم، معادلة أو كلمة…" autofocus><div id="resource-content-results" class="ww-resource-content-results">'+(di?'<div class="text-muted text-small">اكتب كلمة للبحث داخل النص المفهرس محليًا.</div>':'<div class="text-muted text-small">هذا المصدر لم يُفهرس بعد. افتحه ثم اضغط «فهرسة».</div>')+'</div><div class="modal-actions"><button class="btn-outline" data-close-modal>إغلاق</button></div></div></div>';
  }
  if(m.type==='documentMap'){
    var dr=window.WWDocumentIntel&&window.WWDocumentIntel.get?window.WWDocumentIntel.get(m.resourceId):null;
    if(!dr)return '';
    var suggestion=window.WWDocumentMap?window.WWDocumentMap.suggest(dr,state):{sections:[]};
    var saved={};(dr.sections||[]).forEach(function(x){saved[x.id]=x});
    var sections=suggestion.sections.map(function(sec){var old=saved[sec.id];var chosen=old&&old.topicId!==undefined?old.topicId:sec.topicId;return Object.assign({},sec,{topicId:chosen,confidence:old?old.confidence:sec.confidence})});
    var rows=sections.length?sections.map(function(sec){var opts='<option value="">— Aucun chapitre —</option>'+state.topics.filter(function(t){return !dr.subjectId||t.subject_id===dr.subjectId}).map(function(t){return '<option value="'+t.id+'" '+(sec.topicId===t.id?'selected':'')+'>'+wwEscapeHTML(t.title)+'</option>'}).join('');var conf=sec.confidence?Math.round(sec.confidence*100)+'%':'—';return '<div class="ww-docmap-row"><div class="ww-docmap-title"><strong>'+wwEscapeHTML(sec.title)+'</strong><small>Ligne '+sec.line+' · confiance '+conf+'</small></div><select data-docmap-section="'+sec.id+'">'+opts+'</select></div>'}).join(''):'<div class="text-muted">Aucun titre de section détecté automatiquement. Le document peut être trop peu structuré.</div>';
    return '<div class="modal-overlay"><div class="modal-content ww-docmap-modal"><span class="close-btn" data-close-modal>❌</span><h3>🧭 Structure du document</h3><p class="text-muted text-small">'+wwEscapeHTML(dr.name||'Document')+' · '+sections.length+' section(s) détectée(s). Les suggestions sont indicatives : tu gardes le contrôle de chaque association.</p><div class="ww-docmap-summary"><span>🎯 '+suggestion.mapped+' suggestions</span><span>📚 '+state.topics.length+' chapitres disponibles</span></div><div class="ww-docmap-list">'+rows+'</div><div class="modal-actions"><button class="btn-outline" data-close-modal>Annuler</button><button class="btn-primary" data-save-docmap="'+m.resourceId+'">💾 Enregistrer la structure</button></div></div></div>';
  }
  if(m.type==='resourceTime'){return '<div class="modal-overlay"><div class="modal-content"><span class="close-btn" data-close-modal>❌</span><h3>⏱️ Enregistrer le temps</h3><div style="display:grid;gap:12px;"><label>Minutes étudiées</label><input id="resource-time-min" type="number" min="1" max="1440" value="30" autofocus></div><div class="modal-actions"><button class="btn-outline" data-close-modal>Annuler</button><button class="btn-primary" data-save-resource-time data-sid="'+m.subjectId+'" data-rid="'+m.resourceId+'">✅ Enregistrer</button></div></div></div>'}
  if(m.type==='session'){var today3=wwLocalDateISO(new Date());var tid=m.topicId;return '<div class="modal-overlay"><div class="modal-content"><span class="close-btn" data-close-modal>❌</span><h3>📚 Session</h3><div style="display:grid;gap:12px;"><div><label>📅 Date</label><input type="date" id="session-date" value="'+today3+'"></div><div><label>⏱️ Durée (min)</label><input type="number" id="session-duration" value="30" min="5" max="240"></div></div><div class="modal-actions"><button class="btn-outline" data-close-modal>Annuler</button><button class="btn-primary" data-save-session="'+tid+'">Enregistrer</button></div></div></div>'}
  if(m.type==='progDetail'){var t=PROGRAMMING_TOPICS.find(function(x){return x.id===m.topicId});if(!t)return '';return '<div class="modal-overlay"><div class="modal-content"><span class="close-btn" data-close-modal>❌</span><h3>'+t.icon+' '+t.title+'</h3><div class="what-learn"><h4>💡 ما ستتعلمه:</h4><ul>'+t.learn.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul></div><div class="modal-actions"><button class="btn-primary" data-close-modal>Fermer</button></div></div></div>'}
  if(m.type==='addError'){return '<div class="modal-overlay"><div class="modal-content"><span class="close-btn" data-close-modal>❌</span><h3>➕ Erreur</h3><div style="display:grid;gap:12px;"><input id="err-desc" placeholder="Description" autofocus><select id="err-subject"><option value="">Aucune</option>'+state.subjects.map(function(s){return '<option value="'+s.id+'">'+s.name+'</option>'}).join('')+'</select><select id="err-topic"><option value="">Chapitre / Topic (optionnel)</option>'+state.topics.map(function(t){var ss=state.subjects.find(function(s){return s.id===t.subject_id});return '<option value="'+t.id+'">'+(ss?ss.name+' · ':'')+t.title+'</option>'}).join('')+'</select><select id="err-cause"><option value="forgot_formula">نسيت الصيغة</option><option value="confusion">خلط</option><option value="calculation">حساب</option><option value="reading">قراءة</option><option value="methodology">منهجية</option><option value="other">أخرى</option></select><textarea id="err-correction" rows="2" placeholder="الصواب"></textarea></div><div class="modal-actions"><button class="btn-outline" data-close-modal>Annuler</button><button class="btn-primary" data-save-error>✅ Enregistrer</button></div></div></div>'}
  if(m.type==='questionBank'){
    var qt=state.topics.find(function(t){return t.id===m.topicId}); if(!qt)return '';
    var qs=window.WWAdaptiveQuiz?window.WWAdaptiveQuiz.list(m.topicId,state):[];
    var custom=qs.filter(function(q){return q.custom});
    var qlist=custom.length?custom.map(function(q){return '<div class="qb-custom-row"><div><b>'+wwEscapeHTML(q.q)+'</b><small>'+wwQuizDifficultyLabel(q.difficulty)+' · bonne réponse: '+String.fromCharCode(65+q.answer)+'</small></div><button class="btn-small btn-outline" data-delete-question="'+q.id+'" data-delete-question-topic="'+m.topicId+'">🗑️</button></div>'}).join(''):'<p class="text-muted text-small">Aucune question personnalisée pour ce Topic.</p>';
    return '<div class="modal-overlay"><div class="modal-content"><span class="close-btn" data-close-modal>❌</span><h3>🧪 Banque — '+wwEscapeHTML(qt.title)+'</h3><p class="text-muted text-small">Ajoute tes propres questions à partir de ton cours. Elles restent locales dans ton application.</p><div style="display:grid;gap:10px;"><textarea id="qb-question" rows="3" placeholder="Question"></textarea><input id="qb-o1" placeholder="A. Réponse"><input id="qb-o2" placeholder="B. Réponse"><input id="qb-o3" placeholder="C. Réponse"><input id="qb-o4" placeholder="D. Réponse"><select id="qb-answer"><option value="0">Bonne réponse : A</option><option value="1">Bonne réponse : B</option><option value="2">Bonne réponse : C</option><option value="3">Bonne réponse : D</option></select><select id="qb-difficulty"><option value="Easy">Facile</option><option value="Medium" selected>Moyen</option><option value="Hard">Difficile</option></select><textarea id="qb-why" rows="2" placeholder="Explication / correction"></textarea></div><div class="modal-actions"><button class="btn-outline" data-close-modal>Fermer</button><button class="btn-primary" data-save-question>➕ Ajouter</button></div><div style="margin-top:16px"><h4>Questions personnalisées ('+custom.length+')</h4>'+qlist+'</div></div></div>';
  }
  if(m.type==='addFcManual'){return '<div class="modal-overlay"><div class="modal-content"><span class="close-btn" data-close-modal>❌</span><h3>➕ Flashcard</h3><div style="display:grid;gap:12px;"><input id="fc-q" placeholder="Question" autofocus><input id="fc-a" placeholder="Réponse"></div><div class="modal-actions"><button class="btn-outline" data-close-modal>Annuler</button><button class="btn-primary" data-save-fc>✅ Ajouter</button></div></div></div>'}
  return '';
}

function savePomodoroSettings(){try{localStorage.setItem('wwPomodoroSettings',JSON.stringify({workTime:pomodoro.workTime,breakTime:pomodoro.breakTime,freeMode:pomodoro.freeMode}))}catch(e){}}
function applyPomodoroSettings(){var wi=document.getElementById('pomo-work-min'),bi=document.getElementById('pomo-break-min'),fi=document.getElementById('pomo-free-mode');var w=wi?parseInt(wi.value,10):pomodoro.workTime;var b=bi?parseInt(bi.value,10):pomodoro.breakTime;if(!Number.isFinite(w)||w<1)w=1;if(!Number.isFinite(b)||b<0)b=0;pomodoro.workTime=Math.min(w,600);pomodoro.breakTime=Math.min(b,600);pomodoro.freeMode=!!(fi&&fi.checked);if(!pomodoro.isRunning){pomodoro.isBreak=false;pomodoro.remaining=pomodoro.workTime*60;}savePomodoroSettings();showToast('⏱️ Durée du minuteur mise à jour');render()}
function startPomodoro(){if(pomodoro.isRunning)return;pomodoro.isRunning=true;if(pomodoro.remaining<=0)pomodoro.remaining=pomodoro.isBreak?pomodoro.breakTime*60:pomodoro.workTime*60;pomodoro.timerId=setInterval(function(){pomodoro.remaining--;if(pomodoro.remaining<=0){pomodoro.remaining=0;clearInterval(pomodoro.timerId);pomodoro.isRunning=false;var wwFinishedWork=!pomodoro.isBreak;if(wwFinishedWork&&!pomodoro.freeMode)wwLogCompletedFocus();if(!pomodoro.freeMode){pomodoro.isBreak=!pomodoro.isBreak;pomodoro.remaining=pomodoro.isBreak?pomodoro.breakTime*60:pomodoro.workTime*60;}if(navigator.vibrate)navigator.vibrate([200,100,200]);sendNotification(pomodoro.freeMode?'⏰ Minuteur terminé':(pomodoro.isBreak?'☕ Travail terminé':'⏰ Pause terminée'),pomodoro.freeMode?'Temps écoulé':(pomodoro.isBreak?'Prends une pause':'Reprends le travail'),{tag:'pomodoro'});render()}render()},1000);render()}
function pausePomodoro(){if(!pomodoro.isRunning)return;clearInterval(pomodoro.timerId);pomodoro.isRunning=false;render()}
function stopPomodoro(){clearInterval(pomodoro.timerId);pomodoro.isRunning=false;pomodoro.isBreak=false;pomodoro.remaining=pomodoro.workTime*60;render()}
function resetPomodoro(){stopPomodoro()}

// ============================================================
// WHITE WOLF V48 — PWA MOBILE EXPERIENCE
// ============================================================
var wwDeferredInstallPrompt=null;
function wwInitPWA(){window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();wwDeferredInstallPrompt=e;wwRenderInstallHint()});window.addEventListener('appinstalled',function(){wwDeferredInstallPrompt=null;var b=document.getElementById('ww-pwa-install');if(b)b.remove();showToast('📱 White Wolf installé')});if('serviceWorker' in navigator){navigator.serviceWorker.addEventListener('message',function(ev){if(ev&&ev.data&&ev.data.type==='WW_SW_READY'){console.info('White Wolf: service worker prêt',ev.data.version||'')}})}}
function wwRenderInstallHint(){var b=document.getElementById('ww-pwa-install');if(b||!wwDeferredInstallPrompt)return;var host=document.querySelector('.dashboard-shell');if(!host)return;var x=document.createElement('button');x.id='ww-pwa-install';x.className='ww-pwa-install';x.innerHTML='📱 Installer White Wolf';x.onclick=function(){if(!wwDeferredInstallPrompt)return;wwDeferredInstallPrompt.prompt();wwDeferredInstallPrompt.userChoice.finally(function(){wwDeferredInstallPrompt=null;x.remove()})};host.insertBefore(x,host.firstChild)}

function attachAppEvents(){
  if(!window._wwFeatureControllers&&window.WWFeatureControllers){
    window._wwFeatureControllers=WWFeatureControllers.create({
      state:state,saveState:saveState,render:render,generateId:generateId,wwTodayISO:wwTodayISO,wwLocalDateISO:wwLocalDateISO,
      wwQuranEnsureData:wwQuranEnsureData,wwQuranCurrentKhatma:wwQuranCurrentKhatma,wwQuranDefaultJuz:wwQuranDefaultJuz,showToast:showToast,
      DEFAULT_SCHEDULE:DEFAULT_SCHEDULE,getProgress:getProgress,computeMasteryScore:computeMasteryScore,masteryScore:wwMasteryScore,masteryRecommendedStage:wwMasteryRecommendedStage,getLang:getLang,getCardsDueToday:getCardsDueToday,
      wwSR2Queue:wwSR2Queue,updateCardReview:updateCardReview,getFlashcardsForLanguage:getFlashcardsForLanguage
    });
  }
  if(window._wwFeatureControllers){window._wwFeatureControllers.bind(document.getElementById('root'));}
  document.querySelectorAll('.bottom-nav button').forEach(function(b){b.onclick=function(){if(this.dataset.route)navigate(this.dataset.route)}});
  document.querySelectorAll('[data-route]').forEach(function(el){el.onclick=function(){var r=this.dataset.route;var p={};if(this.dataset.subjectId)p.subjectId=this.dataset.subjectId;if(this.dataset.langId)p.langId=this.dataset.langId;if(this.dataset.fcLang)p.fcLang=this.dataset.fcLang;if(r)navigate(r,p)}});
  document.querySelectorAll('[data-exam-prep]').forEach(function(el){el.onclick=function(e){e.stopPropagation();state.modal={type:'examPrep',examId:this.dataset.examPrep};render()}});
  document.querySelectorAll('[data-mission-done]').forEach(function(el){el.onclick=function(e){e.stopPropagation();var id=this.dataset.missionDone,d=this.dataset.done!=='1';wwSetMissionDone(id,d);if(d){state.xp+=5;showToast('🎯 Mission mise à jour · +5 XP')}saveState();render()}});
  document.querySelectorAll('.subject-card[data-subject-id]').forEach(function(el){el.onclick=function(){navigate('subject',{subjectId:this.dataset.subjectId})}});
  document.querySelectorAll('[data-scope-subject]').forEach(function(el){el.onclick=function(e){e.stopPropagation();var id=this.dataset.scopeSubject;wwSetSubjectScope(id,!wwSubjectActive(id))}});
  document.querySelectorAll('[data-scope-subject-all]').forEach(function(el){el.onclick=function(e){e.stopPropagation();var id=this.dataset.scopeSubjectAll;var active=state.topics.filter(function(t){return t.subject_id===id}).some(function(t){return wwTopicActive(t)});wwActivateAllSubjectTopics(id,!active)}});
  document.querySelectorAll('[data-scope-topic]').forEach(function(el){el.onclick=function(e){e.stopPropagation();var id=this.dataset.scopeTopic;var t=state.topics.find(function(x){return x.id===id});wwSetTopicScope(id,!wwTopicActive(t))}});
  document.querySelectorAll('[data-scope-all]').forEach(function(el){el.onclick=function(){wwEnsureStudyScope();state.subjects.forEach(function(s){state.studyScope.subjects[s.id]=true});state.topics.forEach(function(t){state.studyScope.topics[t.id]=true});saveState();showToast('🎯 Toutes les matières et chapitres sont actifs');render()}});
  document.querySelectorAll('[data-scope-none]').forEach(function(el){el.onclick=function(){wwEnsureStudyScope();state.subjects.forEach(function(s){state.studyScope.subjects[s.id]=false});state.topics.forEach(function(t){state.studyScope.topics[t.id]=false});saveState();showToast('⏸️ Périmètre vidé');render()}});
  document.querySelectorAll('.topic-item[data-topic-id]').forEach(function(el){el.onclick=function(){navigate('topic',{topicId:this.dataset.topicId})}});
  document.querySelectorAll('.growth-path-card[data-lang]').forEach(function(el){el.onclick=function(){state.langId=this.dataset.lang;state.levelKey=langCurrentLevel(this.dataset.lang);state.route='language';render()}});
  document.querySelectorAll('.lesson-row:not(.locked)').forEach(function(el){el.onclick=function(){if(this.dataset.lesson){var num=parseInt(this.dataset.lesson);var L=getLang(state.langId);var lv=L.levels[state.levelKey];var idx=-1,nextInc=-1;for(var k=0;k<lv.lessons.length;k++){if(lv.lessons[k].num===num)idx=k;if(nextInc===-1&&!langIsDone(L.id,state.levelKey,lv.lessons[k].num))nextInc=k}if(nextInc!==-1&&idx>nextInc)return;state.lessonNum=num;state.route='lesson';render()}}});
  document.querySelectorAll('.lesson-row[data-prog-id]').forEach(function(el){el.onclick=function(){state.modal={type:'progDetail',topicId:this.dataset.progId};render()}});
  document.querySelectorAll('[data-level]').forEach(function(el){el.onclick=function(){state.levelKey=this.dataset.level;render()}});
  document.querySelectorAll('[data-complete]').forEach(function(el){el.onclick=function(){var n=parseInt(this.dataset.complete);var key=state.langId+'_'+state.levelKey+'_'+n;if(!state.langDone[key]){state.langDone[key]=true;state.xp+=10;var today=wwLocalDateISO(new Date());if(state.lastStudyDate!==today){var y=wwLocalDateISO(new Date(Date.now()-86400000));state.studyStreak=state.lastStudyDate===y?state.studyStreak+1:1;state.lastStudyDate=today}showToast('🎉 +10 XP');saveState();render()}}});
  var nt=document.getElementById('notif-trigger');if(nt)nt.onclick=function(e){e.stopPropagation();state.modal={type:'notifications'};render()};
  var st=document.getElementById('settings-trigger');if(st)st.onclick=function(e){e.stopPropagation();state.isSettingsOpen=!state.isSettingsOpen;document.getElementById('settings-menu').classList.toggle('open')};
  document.addEventListener('click',function(e){var m=document.getElementById('settings-menu');var t=document.getElementById('settings-trigger');if(m&&m.classList.contains('open')&&!m.contains(e.target)&&!t.contains(e.target)){state.isSettingsOpen=false;m.classList.remove('open')}});
  document.querySelectorAll('[data-setting]').forEach(function(el){el.onclick=function(){var s=this.dataset.setting;if(s==='showSmartRevision'){state.settings.showSmartRevision=!state.settings.showSmartRevision}else if(s==='notifications'){state.settings.notifications=!state.settings.notifications;if(state.settings.notifications){requestNotificationPermission().then(function(r){if(r==='granted')showToast('🔔 Activées')})}}state.isSettingsOpen=false;document.getElementById('settings-menu').classList.remove('open');saveState();render()}});
  document.querySelectorAll('[data-modal]').forEach(function(el){el.onclick=function(){state.isSettingsOpen=false;document.getElementById('settings-menu').classList.remove('open');state.modal={type:this.dataset.modal};render()}});
  document.querySelectorAll('[data-close-modal]').forEach(function(el){el.onclick=function(){state.modal=null;render()}});
  document.querySelectorAll('[data-mark-all-read]').forEach(function(el){el.onclick=function(){markAllNotificationsRead();render()}});
  document.querySelectorAll('[data-topic-up]').forEach(function(el){el.onclick=function(e){e.stopPropagation();var tid=this.dataset.topicUp;var p=getProgress(tid);if(p.level<4){p.level++;p.score=wwMasteryScore(tid);p.last_studied=new Date().toISOString();state.progress[tid]=p;if(window.WWMastery)window.WWMastery.syncTopic(state,tid);state.xp+=5;saveState();render()}}});
  document.querySelectorAll('[data-topic-down]').forEach(function(el){el.onclick=function(e){e.stopPropagation();var tid=this.dataset.topicDown;var p=getProgress(tid);if(p.level>0){p.level--;p.score=wwMasteryScore(tid);state.progress[tid]=p;if(window.WWMastery)window.WWMastery.syncTopic(state,tid);saveState();render()}}});
  document.querySelectorAll('[data-save-notes]').forEach(function(el){el.onclick=function(){var tid=this.dataset.saveNotes;var e2=document.getElementById('topic-notes');if(e2){var p=getProgress(tid);p.notes=e2.value;state.progress[tid]=p;saveState();render()}}});
  document.querySelectorAll('[data-pomo-start]').forEach(function(el){el.onclick=startPomodoro});
  document.querySelectorAll('[data-pomo-pause]').forEach(function(el){el.onclick=pausePomodoro});
  document.querySelectorAll('[data-pomo-stop]').forEach(function(el){el.onclick=stopPomodoro});
  document.querySelectorAll('[data-pomo-reset]').forEach(function(el){el.onclick=resetPomodoro});
  document.querySelectorAll('[data-pomo-apply]').forEach(function(el){el.onclick=applyPomodoroSettings});
  var focusApply=document.querySelector('[data-focus-apply]');if(focusApply)focusApply.onclick=function(){var sel=document.getElementById('ww-focus-topic');wwSetFocusTopic(sel?sel.value:'')};
  document.querySelectorAll('[data-emploi-mode]').forEach(function(el){el.onclick=function(){var mode=this.dataset.emploiMode;try{localStorage.setItem('wwEmploiMode',mode)}catch(e){}render()}});
  document.querySelectorAll('[data-emploi-course]').forEach(function(el){el.onclick=function(){state.modal={type:'emploiCourse',data:this.dataset.emploiCourse};render()}});
  document.querySelectorAll('[data-group-toggle]').forEach(function(el){el.onclick=function(){var b=document.getElementById('body-'+this.dataset.groupToggle);if(b)b.classList.toggle('open')}});
  document.querySelectorAll('[data-stats-tab]').forEach(function(el){el.onclick=function(){state.statsTab=this.dataset.statsTab;if(this.dataset.statsTab!=='adaptive')state.adaptiveRevision=null;state.reviewSession=null;render()}});
  document.querySelectorAll('[data-start-adaptive-session]').forEach(function(el){el.onclick=function(){wwStartAdaptiveRevision()}});
  document.querySelectorAll('[data-adaptive-answer]').forEach(function(el){el.onclick=function(){wwAdaptiveAnswer(this.dataset.adaptiveAnswer==='yes')}});
  document.querySelectorAll('[data-adaptive-quiz-option]').forEach(function(el){el.onclick=function(e){e.stopPropagation();wwAdaptiveQuizSelect(this.dataset.adaptiveQuizOption)}});
  document.querySelectorAll('[data-adaptive-quiz-reveal]').forEach(function(el){el.onclick=function(e){e.stopPropagation();wwAdaptiveQuizReveal()}});
  document.querySelectorAll('[data-adaptive-session-stop]').forEach(function(el){el.onclick=function(){if(confirm('Arrêter la session adaptative ? La progression déjà enregistrée sera conservée.')){state.adaptiveRevision=null;saveState();render()}}});
  document.querySelectorAll('[data-adaptive-session-close]').forEach(function(el){el.onclick=function(){state.adaptiveRevision=null;saveState();render()}});
  document.querySelectorAll('[data-intel-stats]').forEach(function(el){el.onclick=function(e){e.stopPropagation();state.statsTab=this.dataset.intelStats||'overview';state.reviewSession=null;state.route='stats';render()}});
  document.querySelectorAll('[data-err-filter]').forEach(function(el){el.onclick=function(){state.errFilter=this.dataset.errFilter;render()}});
  document.querySelectorAll('[data-add-error]').forEach(function(el){el.onclick=function(){state.modal={type:'addError'};render()}});
  document.querySelectorAll('[data-question-bank]').forEach(function(el){el.onclick=function(e){e.stopPropagation();wwOpenQuestionBank(this.dataset.questionBank)}});
  document.querySelectorAll('[data-save-question]').forEach(function(el){el.onclick=function(){wwSaveCustomQuestion()}});
  document.querySelectorAll('[data-delete-question]').forEach(function(el){el.onclick=function(){wwDeleteCustomQuestion(this.dataset.deleteQuestionTopic,this.dataset.deleteQuestion)}});
  document.querySelectorAll('[data-save-error]').forEach(function(el){el.onclick=function(){var desc=document.getElementById('err-desc').value;var subject=document.getElementById('err-subject').value;var cause=document.getElementById('err-cause').value;var correction=document.getElementById('err-correction').value;if(!desc){alert('Description requise');return}addError(desc,subject,document.getElementById('err-topic').value,cause,correction,'medium');state.modal=null;showToast('✅ Ajoutée');render()}});
  document.querySelectorAll('[data-delete-error]').forEach(function(el){el.onclick=function(e){e.stopPropagation();if(confirm('Supprimer ?')){state.errors=state.errors.filter(function(x){return x.id!==el.dataset.deleteError});saveState();render()}}});
  document.querySelectorAll('[data-review-error]').forEach(function(el){el.onclick=function(e){e.stopPropagation();state.modal={type:'reviewError',errorId:this.dataset.reviewError};render()}});
  document.querySelectorAll('[data-review-result]').forEach(function(el){el.onclick=function(){var success=(this.dataset.reviewResult==='yes');if(state.reviewSession){var currentErr=state.reviewSession.errors[state.reviewSession.currentIdx];reviewError(currentErr.id,success);state.reviewSession.currentIdx++;if(success)state.xp+=5;saveState();render()}}});
  document.querySelectorAll('[data-start-review]').forEach(function(el){el.onclick=function(){var due=getErrorsDueToday();if(!due.length){showToast('Aucune erreur');return}state.reviewSession={errors:due,currentIdx:0};render()}});
  document.querySelectorAll('[data-end-review]').forEach(function(el){el.onclick=function(){state.reviewSession=null;render()}});
  document.querySelectorAll('[data-res-filter]').forEach(function(el){el.onclick=function(){state.resFilter=this.dataset.resFilter;render()}});
  var si=document.getElementById('res-search-input');if(si){si.oninput=function(){state.resSearch=this.value;clearTimeout(window._resSearchTimer);window._resSearchTimer=setTimeout(function(){render()},300)}}
  document.querySelectorAll('[data-toggle-group]').forEach(function(el){el.onclick=function(){var g=this.dataset.toggleGroup;state.resOpenGroups[g]=!state.resOpenGroups[g];render()}});
  document.querySelectorAll('[data-toggle-fav]').forEach(function(el){el.onclick=function(e){e.stopPropagation();var parts=this.dataset.toggleFav.split('|');var sid=parts[0],rid=parts[1];var folders=state.resources[sid]||{};Object.keys(folders).forEach(function(fn){var item=(folders[fn]||[]).find(function(r){return r.id===rid});if(item){item.favorite=!item.favorite}});saveState();render()}});
  document.querySelectorAll('[data-copy-url]').forEach(function(el){el.onclick=function(e){e.stopPropagation();var url=this.dataset.copyUrl;if(navigator.clipboard){navigator.clipboard.writeText(url).then(function(){showToast('📋 Copié !')})}}});
  document.querySelectorAll('[data-add-folder]').forEach(function(el){el.onclick=function(){state.modal={type:'folder'};render()}});
  document.querySelectorAll('[data-save-folder]').forEach(function(el){el.onclick=function(){var sid=document.getElementById('folder-subject').value;var fn=document.getElementById('folder-name').value;if(!sid||!fn){alert('Remplir');return}if(!state.resources[sid])state.resources[sid]={};if(state.resources[sid][fn]){alert('Existe');return}state.resources[sid][fn]=[];state.modal=null;showToast('✅ Créé');saveState();render()}});
  document.querySelectorAll('[data-add-resource]').forEach(function(el){el.onclick=function(){state.modal={type:'resource'};render()}});
  document.querySelectorAll('[data-save-resource]').forEach(function(el){el.onclick=async function(){var sid=document.getElementById('resource-subject').value;var topicId=(document.getElementById('resource-topic')||{}).value||'';var title=document.getElementById('resource-title').value.trim();var url=document.getElementById('resource-url').value.trim();var fileInput=document.getElementById('resource-file');var file=(state.pendingResourceFile)||(fileInput&&fileInput.files?fileInput.files[0]:null);var handle=state.pendingResourceHandle;if(!sid||!title||(!url&&!file&&!handle)){alert('Ajoute un lien ou un fichier');return}if(!state.resources[sid])state.resources[sid]={};if(!state.resources[sid]['Général'])state.resources[sid]['Général']=[];var r={id:generateId(),title:title,url:url||'',tag:'📚',dateAdded:wwLocalDateISO(new Date()),favorite:false,studied:false,studyMinutes:0,topic_id:topicId||null};if(file||handle){r.fileKey='rf_'+r.id;r.fileName=(file&&file.name)||'Fichier sélectionné';r.fileType=((file&&file.type)||'').indexOf('pdf')!==-1?'pdf':((file&&file.type)||'').indexOf('word')!==-1?'doc':((file&&file.type)||'').indexOf('image')!==-1?'image':((file&&file.type)||'').indexOf('audio')!==-1?'audio':((file&&file.type)||'').indexOf('video')!==-1?'video':'doc';try{await fileSet(r.fileKey,handle||file)}catch(e){alert('Impossible d’enregistrer le fichier dans le stockage local');return}}state.resources[sid]['Général'].push(r);state.modal=null;state.pendingResourceHandle=null;state.pendingResourceFile=null;showToast('✅ Ressource ajoutée');await saveState();render()}});
  document.querySelectorAll('#resource-file').forEach(function(el){el.onchange=function(){var f=this.files&&this.files[0];if(f){state.pendingResourceFile=f;state.pendingResourceHandle=null;var nameEl=document.getElementById('resource-file-name');if(nameEl)nameEl.textContent='✓ '+f.name+' — سيتم حفظ نسخة محلية للمتصفح';}}});
  document.querySelectorAll('[data-pick-resource-file]').forEach(function(el){el.onclick=function(){
    var input=document.getElementById('resource-file');
    if(!input){showToast('Sélecteur de fichier indisponible');return;}
    // V63.2 Android/PWA fix: open the native <input type=file> directly from
    // the user gesture. Waiting for showOpenFilePicker() and then calling
    // input.click() loses Android's user-activation token, so the fallback
    // picker may silently do nothing. The native picker is the most reliable
    // path on installed Android PWAs and its File object is persisted in IDB.
    try{input.value='';}catch(ignore){}
    input.click();
  }});
  document.querySelectorAll('[data-open-resource]').forEach(function(el){el.onclick=async function(e){e.stopPropagation();var parts=this.dataset.openResource.split('|');await wwOpenResourceInApp(parts[0],parts[1])}});
  document.querySelectorAll('[data-toggle-studied]').forEach(function(el){el.onclick=function(){var parts=this.dataset.toggleStudied.split('|');var r=null;Object.keys(state.resources[parts[0]]||{}).some(function(f){r=(state.resources[parts[0]][f]||[]).find(function(x){return x.id===parts[1]});return !!r});if(r){r.studied=!r.studied;saveState();render()}}});
  document.querySelectorAll('[data-log-resource-time]').forEach(function(el){el.onclick=function(){var parts=this.dataset.logResourceTime.split('|');state.modal={type:'resourceTime',subjectId:parts[0],resourceId:parts[1]};render()}});
  document.querySelectorAll('[data-save-resource-time]').forEach(function(el){el.onclick=function(){var mins=Math.max(1,Number(document.getElementById('resource-time-min').value)||0);var sid=this.dataset.sid,rid=this.dataset.rid,r=null;Object.keys(state.resources[sid]||{}).some(function(f){r=(state.resources[sid][f]||[]).find(function(x){return x.id===rid});return !!r});if(r){r.studyMinutes=Number(r.studyMinutes||0)+mins;r.studied=true;state.modal=null;showToast('⏱️ '+mins+' min enregistrées');saveState();render()}}});
  document.querySelectorAll('[data-open-resource-intel]').forEach(function(el){el.onclick=function(e){e.stopPropagation();var parts=this.dataset.openResourceIntel.split('|');wwOpenResourceInApp(parts[0],parts[1])}});
  document.querySelectorAll('[data-search-resource]').forEach(function(el){el.onclick=function(e){e.stopPropagation();state.modal={type:'resourceSearch',resourceId:this.dataset.searchResource};render();var q=document.getElementById('resource-content-query');if(q)q.oninput=function(){var rows=window.WWResourceIntel?WWResourceIntel.searchContent(this.value,8):[];var host=document.getElementById('resource-content-results');if(!host)return;host.innerHTML=rows.length?rows.map(function(x){return '<button class="ww-resource-result" data-open-result-resource="'+x.resourceId+'"><b>'+wwEscapeHTML(x.name)+'</b><small>Section '+(x.chunkIndex+1)+' · score '+Math.round(x.score)+'</small><span>'+wwEscapeHTML(x.text.slice(0,500))+'</span></button>'}).join(''):'<div class="text-muted text-small">لا توجد نتائج داخل النص المفهرس.</div>'}}});
  document.querySelectorAll('[data-index-resource]').forEach(function(el){el.onclick=async function(e){e.stopPropagation();var id=this.dataset.indexResource,r=window.WWResourceIntel&&WWResourceIntel.all?WWResourceIntel.all().find(function(x){return x.id===id}):null;if(!r||!r.fileKey){showToast('افتح ملفًا محليًا لفهرسته');return}await wwOpenResourceInApp(r.subjectId,id);showToast('📖 افتح الملف ثم اضغط «استخراج النص» لفهرسته')}});
  document.querySelectorAll('[data-open-result-resource]').forEach(function(el){el.onclick=function(){var id=this.dataset.openResultResource;var r=window.WWResourceIntel.all().find(function(x){return x.id===id});if(r){state.modal=null;saveState();wwOpenResourceInApp(r.subjectId,id)}}});
  var rcq=document.getElementById('resource-content-query');if(rcq)rcq.oninput=function(){var rows=window.WWResourceIntel?WWResourceIntel.searchContent(this.value,8):[];var host=document.getElementById('resource-content-results');if(!host)return;host.innerHTML=rows.length?rows.map(function(x){return '<div class="ww-resource-result"><b>'+wwEscapeHTML(x.name)+'</b><small>قسم '+(x.chunkIndex+1)+' · '+Math.round(x.score)+'</small><span>'+wwEscapeHTML(x.text.slice(0,500))+'</span></div>'}).join(''):'<div class="text-muted text-small">لا توجد نتائج.</div>'};
  document.querySelectorAll('[data-map-resource]').forEach(function(el){el.onclick=function(e){e.stopPropagation();state.modal={type:'documentMap',resourceId:this.dataset.mapResource};render()}});
  document.querySelectorAll('[data-save-docmap]').forEach(function(el){el.onclick=function(){var rid=this.dataset.saveDocmap;var rows=document.querySelectorAll('[data-docmap-section]'),secs=[];var di=window.WWDocumentIntel&&window.WWDocumentIntel.get?window.WWDocumentIntel.get(rid):null;var suggested=window.WWDocumentMap&&di?window.WWDocumentMap.suggest(di,state):{sections:[]};Array.prototype.forEach.call(rows,function(row){var base=(suggested.sections||[]).find(function(x){return x.id===row.dataset.docmapSection})||{id:row.dataset.docmapSection,title:'',line:0,kind:'heading',confidence:0};var sel=row.value||null;secs.push({id:base.id,title:base.title,line:base.line,kind:base.kind,topicId:sel,confidence:sel?base.confidence:0})});if(window.WWDocumentMap&&window.WWDocumentMap.save(rid,secs)){state.modal=null;showToast('🧭 Structure du document enregistrée');render()}else showToast('Impossible d’enregistrer la structure') }});
  document.querySelectorAll('[data-delete-resource]').forEach(function(el){el.onclick=function(e){e.stopPropagation();if(!confirm('Supprimer ?'))return;var parts=this.dataset.deleteResource.split('|');var sid=parts[0],rid=parts[1];if(state.resources[sid]){Object.keys(state.resources[sid]).forEach(function(f){state.resources[sid][f]=state.resources[sid][f].filter(function(r){if(r.id===rid&&r.fileKey){fileDelete(r.fileKey);if(window.WWDocumentIntel&&window.WWDocumentIntel.clear)window.WWDocumentIntel.clear(r.id)}return r.id!==rid})})}saveState();render()}});
}

var saveStateQueue=Promise.resolve();
async function saveState(){
  if(window.WWEventBus)WWEventBus.emit('state:save:start',{route:state.route});
  var snapshot={subjects:state.subjects,topics:state.topics,progress:state.progress,mastery:state.mastery,sessions:state.sessions,errors:state.errors,programming:state.programming,languages:state.languages,langDone:state.langDone,flashcards:state.flashcards,fcReview:state.fcReview,tasks:state.tasks,exams:state.exams,resources:state.resources,ignoredTopics:state.ignoredTopics,settings:state.settings,onboardingDone:state.onboardingDone,onboardingData:state.onboardingData,customSchedule:state.customSchedule,xp:state.xp,studyStreak:state.studyStreak,lastStudyDate:state.lastStudyDate,readNotifications:state.readNotifications,notifications:state.notifications,lastNotifCheck:state.lastNotifCheck,_lastSentNotifs:state._lastSentNotifs,quranTab:state.quranTab,quranSurahs:state.quranSurahs,quranJuz:state.quranJuz,quranKhatmas:state.quranKhatmas,quranCurrentKhatmaId:state.quranCurrentKhatmaId,adaptiveRevision:state.adaptiveRevision,adaptiveQuestionStats:state.adaptiveQuestionStats,adaptiveCustomQuestions:state.adaptiveCustomQuestions,studyScope:state.studyScope,documentIntelligence:state.documentIntelligence,resourceIntelligence:state.resourceIntelligence};
  saveStateQueue=saveStateQueue.then(function(){return dbSet('appState',snapshot)}).catch(function(e){console.warn('saveState error',e)});
  var queued=saveStateQueue.then(function(){if(window.WWEventBus)WWEventBus.emit('state:save:complete',{route:state.route})});
  return queued;
}

async function loadState(){try{var data=await dbGet('appState');if(data){state.subjects=data.subjects||MASTER_SUBJECTS;state.topics=data.topics||TOPICS_SEED;state.progress=data.progress||{};state.mastery=data.mastery||{};state.sessions=data.sessions||[];state.errors=data.errors||[];state.programming=data.programming||{};state.languages=data.languages||JSON.parse(JSON.stringify(LANGUAGES));state.langDone=data.langDone||{};state.flashcards=data.flashcards||{};var latestEn=LANGUAGES.find(function(x){return x.id==='en'});var existingEn=state.languages.find(function(x){return x.id==='en'});if(latestEn){if(existingEn){var ei=state.languages.indexOf(existingEn);state.languages[ei]=JSON.parse(JSON.stringify(latestEn))}else{state.languages.push(JSON.parse(JSON.stringify(latestEn)))}}if(state.flashcards&&state.flashcards.en){state.flashcards.en=state.flashcards.en.filter(function(c){return !c.auto||!!(state.languages.find(function(x){return x.id==='en'}).levels[c.level])})}state.fcReview=data.fcReview||{};state.tasks=data.tasks||[];state.exams=data.exams||[];state.resources=data.resources||{};state.ignoredTopics=data.ignoredTopics||{};state.settings=data.settings||{showSmartRevision:true,notifications:true};if(state.settings.notifications===undefined)state.settings.notifications=true;state.onboardingDone=data.onboardingDone||false;state.onboardingData=data.onboardingData||{name:'',goal:'',studyTime:'',notif:true};state.customSchedule=data.customSchedule||{};state.xp=data.xp||0;state.studyStreak=data.studyStreak||0;state.lastStudyDate=data.lastStudyDate||null;state.readNotifications=data.readNotifications||{};state.notifications=data.notifications||state.notifications||[];state.lastNotifCheck=data.lastNotifCheck||state.lastNotifCheck||null;state._lastSentNotifs=data._lastSentNotifs||state._lastSentNotifs||{};state.quranTab=data.quranTab||'surahs';state.quranSurahs=Array.isArray(data.quranSurahs)?data.quranSurahs:wwQuranDefaultSurahs();state.quranJuz=Array.isArray(data.quranJuz)?data.quranJuz:wwQuranDefaultJuz();state.quranKhatmas=Array.isArray(data.quranKhatmas)?data.quranKhatmas:[];state.quranCurrentKhatmaId=data.quranCurrentKhatmaId||null;state.adaptiveRevision=data.adaptiveRevision||null;state.adaptiveQuestionStats=data.adaptiveQuestionStats||{};state.adaptiveCustomQuestions=data.adaptiveCustomQuestions||{};state.studyScope=data.studyScope||{subjects:{},topics:{}};state.documentIntelligence=data.documentIntelligence||{resources:{},activeResourceId:null};state.resourceIntelligence=data.resourceIntelligence||{version:'65.21'};wwEnsureStudyScope();wwQuranEnsureData()}if(window.WWMastery)window.WWMastery.syncState(state);if(!state.notifications)state.notifications=[];if(!state.readNotifications)state.readNotifications={};if(!state._lastSentNotifs)state._lastSentNotifs={}}catch(e){console.warn('Load error',e);state.subjects=MASTER_SUBJECTS;state.topics=TOPICS_SEED;state.languages=JSON.parse(JSON.stringify(LANGUAGES));state.notifications=[];state.readNotifications={}}}


setInterval(function(){if(state.onboardingDone){updateNotifications()}},60000);
setInterval(function(){if(state.route==='emploi'&&state.onboardingDone){render()}},15000);

wwInitPWA();
if(window.WWQA)WWQA.init();

function renderBootStatus(message,detail,showRecovery){
  var root=document.getElementById('root');
  if(!root)return;
  var actions=showRecovery===false?'':'<div class="ww-boot-actions"><button type="button" onclick="location.reload()">↻ Réessayer</button><button type="button" onclick="try{localStorage.removeItem(\'wwAppStateFallback\')}catch(e){};location.reload()">Réinitialiser le cache local</button></div>';
  root.innerHTML='<div class="ww-boot-screen"><div class="ww-boot-mark">🐺</div><h1>WHITE WOLF</h1><p>'+String(message||'')+'</p>'+(detail?'<small>'+String(detail)+'</small>':'')+actions+'</div>';
  wwUpgradeIcons(root);
}
function wwInstallGlobalErrorRecovery(){
  window.addEventListener('error',function(ev){
    if(!ev||!ev.error)return;
    console.error('White Wolf runtime error:',ev.error);
    var root=document.getElementById('root');
    if(root&&root.innerHTML.trim()===''){
      renderBootStatus('Une erreur a empêché le chargement.','Recharge White Wolf pour réessayer.');
    }
  });
  window.addEventListener('unhandledrejection',function(ev){
    console.error('White Wolf unhandled rejection:',ev&&ev.reason);
  });
}
async function init(){
  renderBootStatus('Initialisation du système…','Connexion au stockage local sécurisé.',false);
  wwInstallGlobalErrorRecovery();
  try{
    await openDB();
    await loadState();
    wwUpgradeIcons(document.body);
    render();
  }catch(e){
    console.warn('Init storage warning:',e);
    try{
      dbUnavailable=true;
      if(db){try{db.close()}catch(closeErr){}}
      db=null;
      await loadState();
      render();
      showToast('⚠️ Mode compatibilité activé — données locales sauvegardées');
    }catch(e2){
      console.error('Init error:',e2);
      renderBootStatus('Impossible de démarrer White Wolf','Le stockage du navigateur ne répond pas. Ferme les autres onglets White Wolf puis réessaie.');
    }
  }
}

init();

// If a mobile browser/PWA stalls before render(), never leave a silent blank root.
setTimeout(function(){
  try{
    var root=document.getElementById('root');
    if(root&&root.innerHTML.trim()==='' ){
      console.warn('White Wolf startup watchdog: root still empty after 8s.');
      renderBootStatus('Le démarrage prend trop de temps.','Vérifie la connexion puis appuie sur Réessayer.');
    }
  }catch(e){}
},8000);

// Public bridge for extension modules (V43/V44/V45/V46) without leaking app internals.
window.WWV46App={state:state,navigate:navigate,langCurrentLevel:langCurrentLevel};
window.WWAppCore={state:state,render:render,navigate:navigate,version:'64.3',events:window.WWEventBus,renderer:window.WWRenderer};
window.WWPersistence={save:saveState,load:loadState,dbName:DB_NAME,version:63.2,schemaVersion:3};
window.WWV47Dashboard={getUpcomingExams:getUpcomingExamsForDashboard};
window.WWAdaptiveAPI={summary:wwAdaptiveSummary,build:function(limit){return window.WWAdaptiveRevision?window.WWAdaptiveRevision.build(state,limit):[]},start:wwStartAdaptiveRevision,answer:wwAdaptiveAnswer};
window.WWResourceAPI={
  getAllResources:getAllResources,
  getResourceIcon:getResourceIcon,
  getResourceTypeLabel:getResourceTypeLabel,
  openResourceInApp:wwOpenResourceInApp
};

})();
