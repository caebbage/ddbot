module.exports = {
  fromEmbeds(embeds) {
    let res = {};
    embeds.forEach(x => {
      let name = /^` .+ ` ー ` (.+) `$/m.exec(x.description)?.[1];
      if (name) {
        if (res[name]) {
          res[name]++
        } else res[name] = 1
      }
    })
    return res
  },
  toObject(list) {
    let res = {};
    if (list) {
      [...list.matchAll(/^- (.+?)( \(x(\d+)\))?$/gm)]
        .forEach(x => {
          if (res[x[1]]) res[x[1]] += x[3] ? +x[3] : 1
          else res[x[1]] = x[3] ? +x[3] : 1
        })
    }

    return res
  },
  toString(list) {
    return Object.entries(list).map(x => `- ${x[0]}${x[1] > 1 ? ` (x${x[1]})` : ""}`).join("\n")
  },
  checkHas(inv, find) {
    for (let [item, amt] of Object.entries(find)) {
      if (Object.keys(inv).includes(item)) {
        // if item can be found exactly, if there wasn't enough, reject
        if (amt > inv[item]) return false
      } else {
        // if item can't be found, try to find it with less sensitive search
        let resolve = Object.keys(inv).find((x) =>
          x.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu) ==
          item.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu));
        // if item still wasn't found, or it was but there wasn't enough, rejeect 
        if (!resolve || amt > inv[resolve]) return false
      }
    }
    return true;
  },
  take(inv, list) {
    if (this.checkHas(inv, list)) {
      let res = { ...inv };

      for (let [item, amt] of Object.entries(list)) {
        let name = Object.keys(inv).find((x) =>
          x.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu) ==
          item.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu));
        res[name] -= amt;
        if (res[name] < 1) delete res[name]
      }
      return res;
    } else return false;
  },
  give(inv, list) {
    let res = { ...inv };

    for (let [item, amt] of Object.entries(list)) {
      let name = Object.keys(inv).find((x) =>
        x.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu) ==
        item.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu));

      if (name) res[name] += amt;
      else res[item] = amt;
    }

    return this.sort(res);
  },
  sort(list) {
    return Object.fromEntries(Object.entries(list).sort((a, b) => a[0].localeCompare(b[0])))
  }
}