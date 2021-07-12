export default {
  pushEvent(event, sub) {
    const subs = this.subscribers || (this.subscribers = {});
    (subs[event] || (subs[event] = [])).push(sub);
  },

  on(event, callback) {
    this.pushEvent(event, [true, callback]);
  },

  once(event, callback) {
    this.pushEvent(event, [false, callback]);
  },

  un(event, subToUn) {
    const subs = this.subscribers;
    if (subs && subs[event]) subs[event] = subs[event].filter((sub) => sub !== subToUn);
  },

  trigger(event, data = null) {
    const subs = this.subscribers;
    if (subs && subs[event]) {
      // вызываем все обработчики
      subs[event].forEach((sub) => sub[1](event, data, this));
      // удаляем все одноразовые обработчики
      subs[event] = subs[event].filter((sub) => sub[0]);
    }
  },
};
