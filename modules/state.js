/* WHITE WOLF V63.6 — State Factory */
(function(){
  'use strict';
  function createState(seed){
    seed=seed||{};
    return {
      route:'dashboard', subjectId:null, topicId:null, langId:null, levelKey:'B2', lessonNum:null,
      statsTab:'overview', errFilter:'all', fcLang:null, fcScreen:'list', fcSession:null, fcFlipped:false,
      resFilter:'Tout', resSearch:'', resOpenGroups:{}, pendingResourceHandle:null, pendingResourceFile:null,
      subjects:seed.subjects||[], topics:seed.topics||[], progress:{}, mastery:{}, sessions:[], errors:[], programming:{},
      languages:seed.languages||[], langDone:{}, flashcards:{}, fcReview:{}, tasks:[], exams:[], resources:{}, ignoredTopics:{},
      settings:{showSmartRevision:true, notifications:true}, onboardingDone:false, onboardingStep:0,
      onboardingData:{name:'',goal:'',studyTime:'',notif:true}, customSchedule:{}, isEditingPlanning:false,
      modal:null, isSettingsOpen:false, studyStreak:0, lastStudyDate:null, xp:0, reviewSession:null, adaptiveRevision:null, adaptiveQuestionStats:{}, adaptiveCustomQuestions:{},
      quranTab:'surahs', quranSurahs:[], quranJuz:[], quranKhatmas:[], quranCurrentKhatmaId:null,
      notifications:[], readNotifications:{}, lastNotifCheck:0, _lastSentNotifs:{}
    };
  }
  function createPomodoro(){return {workTime:25,breakTime:5,remaining:25*60,isRunning:false,isBreak:false,timerId:null,freeMode:false};}
  window.WWState={create:createState,createPomodoro:createPomodoro,version:'63.6.4'};
})();
