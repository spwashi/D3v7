export function resolveSubject() {
  const locale           = 'en-US';
  const dayName          = (new Date()).toLocaleDateString(locale, {weekday: 'long'}).toLowerCase();
  const subject          = {};
  subject.__ts           = Date.now();
  subject.__internalword = dayName;
  return subject;
}