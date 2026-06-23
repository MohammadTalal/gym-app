export type Lang = 'en' | 'ar';

/**
 * UI string dictionary. Keys are shared across languages; `{name}`-style
 * tokens are filled in by the `t()` helper in LanguageContext.
 */
export const STRINGS: Record<string, Record<Lang, string>> = {
  // ── Bottom navigation ──────────────────────────────
  'nav.home': { en: 'Home', ar: 'الرئيسية' },
  'nav.workout': { en: 'Workout', ar: 'التمرين' },
  'nav.progress': { en: 'Progress', ar: 'التقدّم' },
  'nav.library': { en: 'Library', ar: 'المكتبة' },

  // ── Common ─────────────────────────────────────────
  'common.min': { en: 'min', ar: 'دقيقة' },
  'common.done': { en: 'done', ar: 'مكتمل' },
  'common.exercises': { en: 'exercises', ar: 'تمارين' },
  'common.rest': { en: 'rest', ar: 'راحة' },
  'common.seeAll': { en: 'See all', ar: 'عرض الكل' },
  'common.today': { en: 'today', ar: 'اليوم' },
  'common.tomorrow': { en: 'tomorrow', ar: 'غدًا' },
  'common.inDays': { en: 'in {n} days', ar: 'بعد {n} أيام' },
  'common.kg': { en: 'kg', ar: 'كجم' },
  'common.reps': { en: 'reps', ar: 'تكرار' },
  'common.sets': { en: 'sets', ar: 'مجموعات' },

  // ── Theme / language toggles ───────────────────────
  'toggle.theme': { en: 'Toggle dark mode', ar: 'تبديل الوضع الداكن' },
  'toggle.lang': { en: 'Switch language', ar: 'تغيير اللغة' },

  // ── Dashboard ──────────────────────────────────────
  'greeting.morning': { en: 'Good morning', ar: 'صباح الخير' },
  'greeting.afternoon': { en: 'Good afternoon', ar: 'مساء الخير' },
  'greeting.evening': { en: 'Good evening', ar: 'مساء الخير' },
  'dash.todaysWorkout': { en: "Today's workout", ar: 'تمرين اليوم' },
  'dash.restDay': { en: 'Rest day', ar: 'يوم راحة' },
  'dash.recoverGrow': { en: 'Recover & grow', ar: 'تعافَ وانمُ' },
  'dash.nextUp': { en: 'Next up: {title} {when}', ar: 'التالي: {title} {when}' },
  'dash.startNow': { en: 'Start now', ar: 'ابدأ الآن' },
  'dash.previewWorkout': { en: 'Preview workout', ar: 'معاينة التمرين' },
  'dash.thisWeek': { en: 'This week', ar: 'هذا الأسبوع' },
  'dash.workouts': { en: 'workouts', ar: 'تمارين' },
  'dash.weekDone': {
    en: "You've hit every session this week. Excellent work!",
    ar: 'أنجزت كل حصص هذا الأسبوع. عمل ممتاز!',
  },
  'dash.sessionsLeftOne': {
    en: '1 session left to hit your goal.',
    ar: 'بقيت حصة واحدة لتحقيق هدفك.',
  },
  'dash.sessionsLeftMany': {
    en: '{n} sessions left to hit your goal.',
    ar: 'بقيت {n} حصص لتحقيق هدفك.',
  },
  'dash.totalWorkouts': { en: 'Total workouts', ar: 'إجمالي التمارين' },
  'dash.prsSet': { en: 'PRs set', ar: 'أرقام قياسية' },
  'dash.weightKg': { en: 'Weight (kg)', ar: 'الوزن (كجم)' },
  'dash.recentSessions': { en: 'Recent sessions', ar: 'الحصص الأخيرة' },

  // ── Today's workout ────────────────────────────────
  'today.upNext': { en: 'Up next', ar: 'التالي' },
  'today.restMessage': {
    en: "Today is a rest day. Here's a preview of your next session — come back on {day} to start it.",
    ar: 'اليوم يوم راحة. إليك معاينة لحصتك القادمة — عُد يوم {day} لبدئها.',
  },
  'today.restWord': { en: 'rest day', ar: 'يوم راحة' },
  'today.warmup': { en: 'Warm-up (5–10 min)', ar: 'الإحماء (5–10 دقائق)' },
  'today.exercises': { en: 'Exercises', ar: 'التمارين' },
  'today.start': { en: 'Start Workout', ar: 'ابدأ التمرين' },
  'today.resume': { en: 'Resume Workout', ar: 'متابعة التمرين' },
  'today.complete': { en: 'complete', ar: 'مكتمل' },

  // ── Workout mode ───────────────────────────────────
  'mode.notFound': { en: 'Workout not found.', ar: 'التمرين غير موجود.' },
  'mode.backToToday': { en: 'Back to today', ar: 'العودة لليوم' },
  'mode.exit': { en: 'Exit workout', ar: 'إنهاء التمرين' },
  'mode.rest': { en: 'Rest', ar: 'راحة' },
  'mode.add15': { en: '15s', ar: '15 ث' },
  'mode.skipRest': { en: 'Skip rest', ar: 'تخطّي الراحة' },
  'mode.nextExercise': { en: 'Next exercise', ar: 'التمرين التالي' },
  'mode.finishWorkout': { en: 'Finish workout', ar: 'إنهاء التمرين' },
  'mode.completeSet': { en: 'Complete set {n}', ar: 'أكمل المجموعة {n}' },
  'mode.previous': { en: 'Previous', ar: 'السابق' },
  'mode.skip': { en: 'Skip', ar: 'تخطّي' },
  'mode.finish': { en: 'Finish', ar: 'إنهاء' },
  'mode.howTo': { en: 'How to do it', ar: 'طريقة الأداء' },
  'mode.undoSet': { en: 'undo a set', ar: 'تراجع عن مجموعة' },
  'mode.target': {
    en: 'Target: {sets} sets × {reps} reps · {rest} rest',
    ar: 'الهدف: {sets} مجموعات × {reps} تكرار · راحة {rest}',
  },
  'mode.completeTitle': { en: 'Workout complete!', ar: 'اكتمل التمرين!' },
  'mode.completeMsg': {
    en: 'You finished {done}/{total} exercises and {sets} sets. Great job showing up.',
    ar: 'أنهيت {done}/{total} تمارين و{sets} مجموعة. أحسنت على الالتزام.',
  },
  'mode.viewProgress': { en: 'View progress', ar: 'عرض التقدّم' },
  'mode.backHome': { en: 'Back to home', ar: 'العودة للرئيسية' },

  // ── Progress ───────────────────────────────────────
  'prog.title': { en: 'Progress', ar: 'التقدّم' },
  'prog.subtitle': { en: 'Your journey', ar: 'رحلتك' },
  'prog.workoutsDone': { en: 'Workouts done', ar: 'تمارين منجزة' },
  'prog.weekStreak': { en: 'Week streak', ar: 'أسابيع متتالية' },
  'prog.totalMinutes': { en: 'Total minutes', ar: 'إجمالي الدقائق' },
  'prog.weightChange': { en: 'Weight change (kg)', ar: 'تغيّر الوزن (كجم)' },
  'prog.workoutsPerWeek': { en: 'Workouts per week', ar: 'التمارين أسبوعيًا' },
  'prog.goalPerWeek': { en: 'Goal: {n} per week', ar: 'الهدف: {n} أسبوعيًا' },
  'prog.bodyWeight': { en: 'Body weight', ar: 'وزن الجسم' },
  'prog.logWeightHint': {
    en: 'Log your weight to see the trend.',
    ar: 'سجّل وزنك لرؤية التغيّر.',
  },
  'prog.weightLabel': { en: 'Weight', ar: 'الوزن' },
  'prog.todaysWeight': { en: "Today's weight (kg)", ar: 'وزن اليوم (كجم)' },
  'prog.log': { en: 'Log', ar: 'سجّل' },
  'prog.personalRecords': { en: 'Personal records', ar: 'الأرقام القياسية' },
  'prog.noRecords': { en: 'No records yet.', ar: 'لا أرقام بعد.' },
  'prog.resetAll': { en: 'Reset all progress', ar: 'إعادة ضبط كل التقدّم' },
  'prog.resetConfirm': {
    en: 'Reset all progress and restore sample data? This cannot be undone.',
    ar: 'إعادة ضبط كل التقدّم واستعادة البيانات التجريبية؟ لا يمكن التراجع.',
  },

  // ── Library ────────────────────────────────────────
  'lib.title': { en: 'Exercise Library', ar: 'مكتبة التمارين' },
  'lib.movements': { en: '{n} movements', ar: '{n} حركة' },
  'lib.search': {
    en: 'Search exercises, muscles, equipment…',
    ar: 'ابحث عن تمارين أو عضلات أو معدات…',
  },
  'lib.all': { en: 'All', ar: 'الكل' },
  'lib.noResults': {
    en: 'No exercises match your search.',
    ar: 'لا توجد تمارين تطابق بحثك.',
  },
  'lib.clear': { en: 'Clear search', ar: 'مسح البحث' },

  // ── Auth ───────────────────────────────────────────
  'auth.welcome': { en: 'GymCoach', ar: 'مدرّب الجيم' },
  'auth.signInSubtitle': {
    en: 'Sign in to sync your workouts across devices.',
    ar: 'سجّل الدخول لمزامنة تمارينك عبر أجهزتك.',
  },
  'auth.signUpSubtitle': {
    en: 'Create an account to save your progress in the cloud.',
    ar: 'أنشئ حسابًا لحفظ تقدّمك في السحابة.',
  },
  'auth.email': { en: 'Email', ar: 'البريد الإلكتروني' },
  'auth.password': { en: 'Password', ar: 'كلمة المرور' },
  'auth.signIn': { en: 'Sign in', ar: 'تسجيل الدخول' },
  'auth.createAccount': { en: 'Create account', ar: 'إنشاء حساب' },
  'auth.toSignUp': { en: "Don't have an account? Sign up", ar: 'ليس لديك حساب؟ أنشئ حسابًا' },
  'auth.toSignIn': { en: 'Already have an account? Sign in', ar: 'لديك حساب؟ سجّل الدخول' },
  'auth.checkEmail': {
    en: 'Check your email to confirm your account, then sign in.',
    ar: 'تحقق من بريدك لتأكيد حسابك، ثم سجّل الدخول.',
  },

  // ── Profile ────────────────────────────────────────
  'profile.edit': { en: 'Edit', ar: 'تعديل' },
  'profile.name': { en: 'Name', ar: 'الاسم' },
  'profile.sex': { en: 'Sex', ar: 'الجنس' },
  'profile.male': { en: 'Male', ar: 'ذكر' },
  'profile.female': { en: 'Female', ar: 'أنثى' },
  'profile.height': { en: 'Height (cm)', ar: 'الطول (سم)' },
  'profile.cm': { en: 'cm', ar: 'سم' },
  'profile.level': { en: 'Level', ar: 'المستوى' },
  'profile.goal': { en: 'Goal', ar: 'الهدف' },
  'profile.save': { en: 'Save', ar: 'حفظ' },
  'profile.cancel': { en: 'Cancel', ar: 'إلغاء' },
  'profile.signOut': { en: 'Sign out', ar: 'تسجيل الخروج' },

  // ── Exercise detail ────────────────────────────────
  'detail.notFound': { en: 'Exercise not found.', ar: 'التمرين غير موجود.' },
  'detail.backToLibrary': { en: 'Back to library', ar: 'العودة للمكتبة' },
  'detail.back': { en: 'Go back', ar: 'رجوع' },
  'detail.watchTechnique': { en: 'Watch the technique', ar: 'شاهد الأداء الصحيح' },
  'detail.tapToPlay': {
    en: 'Tap to play the embedded video',
    ar: 'اضغط لتشغيل الفيديو',
  },
  'detail.searchTutorial': {
    en: 'Search for a tutorial on YouTube',
    ar: 'ابحث عن شرح على يوتيوب',
  },
  'detail.searchOnYoutube': {
    en: 'Search “{name}” on YouTube',
    ar: 'ابحث عن «{name}» على يوتيوب',
  },
  'detail.stepByStep': { en: 'Step-by-step', ar: 'خطوة بخطوة' },
  'detail.commonMistakes': { en: 'Common mistakes', ar: 'أخطاء شائعة' },
  'detail.personalRecord': { en: 'Personal record', ar: 'الرقم القياسي' },
  'detail.currentBest': {
    en: 'Current best: {weight} kg × {reps} reps ({date})',
    ar: 'أفضل رقم: {weight} كجم × {reps} تكرار ({date})',
  },
  'detail.noRecordYet': {
    en: 'No record logged yet. Set your first one!',
    ar: 'لم تُسجّل رقمًا بعد. سجّل أول رقم لك!',
  },
  'detail.saveRecord': { en: 'Save record', ar: 'حفظ الرقم' },

  // ── Exercise card ──────────────────────────────────
  'card.exercise': { en: 'Exercise {n}', ar: 'تمرين {n}' },
  'card.hideDetails': { en: 'Hide details', ar: 'إخفاء التفاصيل' },
  'card.howTo': { en: 'How to do it', ar: 'طريقة الأداء' },
  'card.steps': { en: 'Steps', ar: 'الخطوات' },
  'card.avoid': { en: 'Avoid', ar: 'تجنّب' },
  'card.viewFull': {
    en: 'View full exercise & video',
    ar: 'عرض التمرين كاملًا والفيديو',
  },
  'card.markDone': { en: 'Mark as done', ar: 'وضع علامة مكتمل' },
  'card.markNotDone': { en: 'Mark as not done', ar: 'إلغاء علامة الاكتمال' },
};

/** Short weekday labels for the dashboard week strip, indexed by Date.getDay(). */
export const DAY_LABELS: Record<Lang, string[]> = {
  en: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  ar: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
};

/** Full weekday names indexed by Date.getDay(). */
export const DAY_NAMES: Record<Lang, string[]> = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  ar: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
};

/** Short month names indexed by Date.getMonth(). */
export const MONTHS: Record<Lang, string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
};
