class Node {
  constructor() {
    this.mp = new Map();
    this.leaf = new Set();
    this.pref = 0;
  }
}

class Trie {
  constructor() {
    this.root = new Node();
  }

  insert(key, val) {
    let temp = this.root;
    for (let i = 0; i < key.length; i++) {
      let c = key[i];
      if (!temp.mp.has(c)) {
        temp.mp.set(c, new Node());
      }
      temp = temp.mp.get(c);
      temp.pref++;
    }
    temp.leaf.add(val);
  }

  search(key) {
    let temp = this.root;
    for (let i = 0; i < key.length; i++) {
      temp = temp.mp.get(key[i]);
      if (!temp) {
        return new Set();
      }
    }
    return temp.leaf;
  }

  delete(key, val) {
    let temp = this.root;
    let stack = [];
    
    for (let i = 0; i < key.length; i++) {
      stack.push([temp, key[i]]);
      temp = temp.mp.get(key[i]);
      if (!temp) {
        return false; 
      }
    }
    
    if (!temp.leaf.has(val)) {
      return false; 
    }
    
    temp.leaf.delete(val);
    if (temp.leaf.size === 0) {
      while (stack.length > 0) {
        let [node, char] = stack.pop();
        let child = node.mp.get(char);
        
        if (child.leaf.size === 0 && child.mp.size === 0) {
          node.mp.delete(char);
        }
        
        child.pref--;
        if (child.pref > 0) {
          break;
        }
      }
    }
    
    return true;
  }
}

module.exports = Trie;
