export class List {
  /**
   * 更新陣列中的一個值, 若找不到則直接加入 (副作用方法)
   * @param {Array} list 要更新的list (會直接更新這個list)
   * @param {*} query 搜尋條件, 可以是物件, 若是function則會執行
   * @param {Object} newMember 陣列的新成員
   * @returns {list} 更新後的陣列
   */
  static updateOrInsert(list, query, newMember) {
    let index = -1;
    if (typeof query === 'function') {
      index = list.findIndex(query);
    }
    else {
      index = list.findIndex((member) => {
        return member === query;
      });
    }

    if (index !== -1) {
      list[index] = newMember;
    }
    else {
      list.push(newMember);
    }

    return list;
  }
}
