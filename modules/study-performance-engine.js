
/**
 * White Wolf Scholar V65.23 — Study Performance Engine
 * Integrates study sessions, Pomodoro, mastery snapshots, tasks/quizzes/resources
 * and analytics through a small event-based local layer.
 *
 * Non-destructive: existing application modules continue to work unchanged.
 */
(() => {
  'use strict';

  const KEY = 'wws.studyPerformance.v1';
  const now = () => Date.now();

  const read = () => {
    try {
      const v = JSON.parse(localStorage.getItem(KEY) || '{}');
      return {
        sessions: Array.isArray(v.sessions) ? v.sessions : [],
        events: Array.isArray(v.events) ? v.events : [],
        snapshots: Array.isArray(v.snapshots) ? v.snapshots : []
      };
    } catch (_) {
      return {sessions: [], events: [], snapshots: []};
    }
  };

  const write = (v) => {
    try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (_) {}
  };

  const emit = (type, payload = {}) => {
    const v = read();
    v.events.push({id: crypto.randomUUID?.() || String(now()), type, at: now(), ...payload});
    if (v.events.length > 2000) v.events = v.events.slice(-2000);
    write(v);
    window.dispatchEvent(new CustomEvent('wws:study-event', {detail:{type, ...payload}}));
  };

  const api = {
    startSession(meta = {}) {
      const session = {
        id: crypto.randomUUID?.() || `${now()}-${Math.random()}`,
        startedAt: now(),
        endedAt: null,
        plannedMinutes: Number(meta.plannedMinutes || 25),
        actualMinutes: 0,
        subjectId: meta.subjectId || null,
        topicId: meta.topicId || null,
        activityType: meta.activityType || 'study',
        goal: meta.goal || '',
        pomodoros: 0,
        tasksCompleted: 0,
        quizScore: null,
        masteryBefore: meta.masteryBefore ?? null,
        masteryAfter: null,
        notes: ''
      };
      const v = read();
      v.sessions.push(session);
      write(v);
      emit('session_started', {sessionId:session.id});
      return session;
    },

    finishSession(id, meta = {}) {
      const v = read();
      const s = v.sessions.find(x => x.id === id);
      if (!s) return null;
      s.endedAt = now();
      s.actualMinutes = Math.max(0, Math.round((s.endedAt - s.startedAt) / 60000));
      if (meta.actualMinutes != null) s.actualMinutes = Math.max(0, Number(meta.actualMinutes));
      Object.assign(s, {
        pomodoros: Number(meta.pomodoros ?? s.pomodoros),
        tasksCompleted: Number(meta.tasksCompleted ?? s.tasksCompleted),
        quizScore: meta.quizScore ?? s.quizScore,
        masteryAfter: meta.masteryAfter ?? s.masteryAfter,
        notes: meta.notes ?? s.notes
      });
      write(v);
      emit('session_finished', {sessionId:id, actualMinutes:s.actualMinutes});
      return s;
    },

    recordPomodoro(meta = {}) {
      const v = read();
      const id = meta.sessionId;
      const s = id && v.sessions.find(x => x.id === id);
      if (s) s.pomodoros = Number(s.pomodoros || 0) + 1;
      write(v);
      emit('pomodoro_completed', {sessionId:id || null, minutes:Number(meta.minutes || 25)});
    },

    recordMastery(meta = {}) {
      const snapshot = {
        at: now(),
        subjectId: meta.subjectId || null,
        topicId: meta.topicId || null,
        mastery: Number(meta.mastery || 0),
        source: meta.source || 'manual'
      };
      const v = read();
      v.snapshots.push(snapshot);
      if (v.snapshots.length > 3000) v.snapshots = v.snapshots.slice(-3000);
      write(v);
      emit('mastery_recorded', snapshot);
      return snapshot;
    },

    recordQuiz(meta = {}) {
      emit('quiz_completed', {
        subjectId:meta.subjectId || null,
        topicId:meta.topicId || null,
        score:Number(meta.score || 0),
        total:Number(meta.total || 0)
      });
    },

    recordTask(meta = {}) {
      emit('task_completed', {
        subjectId:meta.subjectId || null,
        topicId:meta.topicId || null,
        taskId:meta.taskId || null
      });
    },

    recordResource(meta = {}) {
      emit('resource_used', {
        subjectId:meta.subjectId || null,
        topicId:meta.topicId || null,
        resourceId:meta.resourceId || null
      });
    },

    summary(days = 7) {
      const v = read();
      const since = now() - Number(days) * 86400000;
      const sessions = v.sessions.filter(s => Number(s.startedAt) >= since);
      const events = v.events.filter(e => Number(e.at) >= since);
      const minutes = sessions.reduce((n,s) => n + Number(s.actualMinutes || 0), 0);
      const pomodoros = events.filter(e=>e.type==='pomodoro_completed').length;
      const tasks = events.filter(e=>e.type==='task_completed').length;
      const quizzes = events.filter(e=>e.type==='quiz_completed');
      const quizAvg = quizzes.length ? quizzes.reduce((n,q)=>n+Number(q.score||0),0)/quizzes.length : null;
      return {
        days, sessions:sessions.length, minutes,
        pomodoros, tasks, quizzes:quizzes.length,
        quizAverage:quizAvg,
        masterySnapshots:v.snapshots.filter(x=>x.at>=since).length
      };
    },

    topicEfficiency(topicId, days = 30) {
      const v = read(), since = now() - days*86400000;
      const ss = v.sessions.filter(s=>s.topicId===topicId && s.startedAt>=since);
      const snaps = v.snapshots.filter(s=>s.topicId===topicId && s.at>=since);
      const first = snaps[0]?.mastery, last = snaps.at(-1)?.mastery;
      const delta = (first != null && last != null) ? last-first : null;
      const minutes = ss.reduce((n,s)=>n+Number(s.actualMinutes||0),0);
      return {topicId, minutes, sessions:ss.length, masteryDelta:delta};
    },

    history(limit = 100) {
      return read().sessions.slice(-limit).reverse();
    },

    exportData() {
      return JSON.stringify(read(), null, 2);
    }
  };

  window.WhiteWolfStudyPerformance = api;
  window.dispatchEvent(new CustomEvent('wws:study-engine-ready'));
})();
