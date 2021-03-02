class Queue<T> {
  elements: T[];
  constructor() {
    this.elements = [];
  }
  enqueue(e: T) {
    this.elements.push(e);
  }
  dequeue() {
    return this.elements.shift();
  }
}

class Node {
  data: any;
  parent: null;
  children: never[];
  childrenIf: never[];
  childrenThen: never[];
  childrenElse: never[];
  id: number
  name: string
  constructor(data: any) {
    this.data = data;
    this.parent = null;
    this.children = [];
    this.childrenIf = [];
    this.childrenThen = [];
    this.childrenElse = [];
    this.id = 0;
    this.name = "root";
  }
}

class Tree {
  _root: Node;
  counter: number;
  constructor(data: any) {
    const node = new Node(data);
    this._root = node;
    this.counter = 0;
  }
  traverseDF(callback: (arg0: Node) => void) {
    // это рекурсивная и мгновенно вызываемая функция
    (function recurse(currentNode) {
      // шаг 2
      function childrenFor (item: string | any[]) {
        for (let i = 0, length = item.length; i < length; i++) {
          // шаг 3
          recurse(item[i]);
        }
      } 
      childrenFor(currentNode.children)
      childrenFor(currentNode.childrenIf)
      childrenFor(currentNode.childrenThen)
      childrenFor(currentNode.childrenElse)
      // шаг 4
      callback(currentNode);

      // шаг 1
    })(this._root);
  }
  traverseBF(callback: (arg0: any) => void) {
    const queue = new Queue();

    queue.enqueue(this._root);

    let currentNode: any = queue.dequeue();
    while (currentNode) {
      function childrenFor (item: string | any[]) {
        for (let i = 0, length = item.length; i < length; i++) {
          queue.enqueue(item[i]);
        }
      }
      childrenFor(currentNode.children)
      childrenFor(currentNode.childrenIf)
      childrenFor(currentNode.childrenThen)
      childrenFor(currentNode.childrenElse)
      callback(currentNode);
      currentNode = queue.dequeue();
    }
  }
  contains(callback: { (node: any): void; (node: any): void; }, traversal: any) {
    traversal.call(this, callback);
  }
  add(data: any, id: number, nested:string="root", idItem: number, traversal: any) {
    const child = new Node(data);
    let parent: { data: any} | null | any = null;
    const callback = function (node: { id: number}) {
      if (node.id === +id) {
        parent = node;
      }
    };

    const addMethodFunc = (children: string, name: string) => {
      const index = findIndex(parent[children], +idItem);
      if (index === undefined) {
        parent[children].unshift(child)
      } else if (index === parent[children].length - 1)  {
        parent[children].push(child)
      } else {
        parent[children].splice(index+1, 0, child)
      };
      this.counter = this.counter + 1;
      child.id = this.counter;
      child.name = name;
    }

    this.contains(callback, traversal);
    
    if (parent) {
      switch (nested) {
        case "root":
          addMethodFunc("children", "root")
          break;
        case "if":
          addMethodFunc("childrenIf", "if")
          break;
        case "then":
          addMethodFunc("childrenThen", "then")
          break;
        case "else":
          addMethodFunc("childrenElse", "else")
          break;
        default:
          addMethodFunc("children", "root")
          break;
      }
      child.parent = parent;
    } else {
      throw new Error("Cannot add node to a non-existent parent.");
    }
  }
  remove(id: number, parentId: any, traversal: any, nested = "root") {
    let parent: { children?: any; data?: any; } | null | any = null,
      childToRemove = null,
      index;

    const callback = function (node: { id: any; name: string }) {
      if (node.id === parentId) {
        parent = node;
      }
    };

    this.contains(callback, traversal);
    const removeFunc = (children: string) => {
      index = findIndex(parent[children], id);
      if (index === undefined) {
        throw new Error("Node to remove does not exist.");
      } else {
        childToRemove = parent[children].splice(index, 1);
      }
    }
    if (parent) {
      switch (nested) {
        case "root":
          removeFunc("children")
          break;
        case "if":
          removeFunc("childrenIf")
          break;
        case "then":
          removeFunc("childrenThen")
          break;
        case "else":
          removeFunc("childrenElse")
          break;
        default:
          removeFunc("children")
          break;
      }
    } else {
      throw new Error("Parent does not exist.");
    }
    return childToRemove;
  }

}

function findIndex(arr: any[], id: number) {
  let index;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      index = i;
    }
  }
  return index;
}

export default Tree