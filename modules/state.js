/* WHITE WOLF V63.6 — State Factory */
(function(){
  'use strict';
  function createState(seed){
    seed=seed||{};
    return {
      route:'dashboard', subjectId:null, topicId:null, langId:null, levelKey:'B2', lessonNum:null,
      statsTab:'overview', errFilter:'all', fcLang:null, fcScreen:'list', fcSession:null, fcFlipped:false,
      resFilter:'Tout', resSearch:'', resOpenGroups:{}, pendingResourceHandle:null, pendingResourceFile:null,
      subjects:seed.subjects||[], topics:seed.topics||[], concepts:seed.concepts||[], studyActivities:seed.studyActivities||[], progress:{}, mastery:{}, sessions:[], errors:[], programming:{},
      languages:seed.languages||[], langDone:{}, flashcards:{}, fcReview:{}, tasks:[], exams:[], resources:{}, activities:[], ignoredTopics:{},
      settings:{showSmartRevision:true,timeConstraints:{sleepStart:'23:00',wakeTime:'05:00'},notifications:{enabled:false,leadMinutes:10,taskDeadlines:true,studySessions:true,revision:true,morning:true,evening:true}}, onboardingDone:false, onboardingStep:0,
      onboardingData:{name:'',goal:'',studyTime:''}, customSchedule:{}, personalEvents:seed.personalEvents||[], isEditingPlanning:false,
      modal:null, isSettingsOpen:false, studyStreak:0, lastStudyDate:null, xp:0, reviewSession:null, adaptiveRevision:null, adaptiveQuestionStats:{}, adaptiveCustomQuestions:{},
      quranTab:'surahs', quranSurahs:[], quranJuz:[], quranKhatmas:[], quranCurrentKhatmaId:null, focusContext:{type:'study',title:'',subjectId:'',topicId:'',taskId:'',notes:''}, focusSessions:[],
    };
  }
  function createPomodoro(){return {workTime:25,breakTime:5,remaining:25*60,isRunning:false,isBreak:false,timerId:null,freeMode:false,sessionStartedAt:null,workElapsedBeforePause:0,lastRunAt:null};}
  window.WWState={create:createState,createPomodoro:createPomodoro,version:'65.19'};
})();
