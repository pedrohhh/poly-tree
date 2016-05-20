

/* global str */
// ------------------METHODS--------------------------------------------------------------

/* global currentTree */

//creates a node
function NNode(data) {
    this.data = data;
    this.parent = null;
    this.children = [];
}

//creates a tree 
function Tree(data) {
    var node = new NNode(data);
    this._root = node;
}

Tree.prototype.traverseDF = function(callback) {
 
    // this is a recurse and immediately-invoking function
    (function recurse(currentNode) {
        // step 2
        for (var i = 0, length = currentNode.children.length; i < length; i++) {
            // step 3
            recurse(currentNode.children[i]);
        }
 
        // step 4
        callback(currentNode);
 
        // step 1
    })(this._root);
 
};
 
Tree.prototype.traverseBF = function(callback) {
    
    var queue = new Queue();
    
    queue.enqueue(this._root);
 
    currentTree = queue.dequeue();
    
    while(currentTree){
        for (var i = 0, length = currentTree.children.length; i < length; i++) {
            queue.enqueue(currentTree.children[i]);          
        }
        callback(currentTree);
        currentTree = queue.dequeue();
    }
};

Tree.prototype.toDraw = function(callback) {
    
    var stack = new Stack();
    
    stack.push(this._root);
     
    
};

 
Tree.prototype.contains = function(callback, traversal) {
    
    traversal.call(this, callback);
    
};

//adding a node on the tree 
Tree.prototype.add = function(data, toData, traversal, root) {
    
    var child = new NNode(data),
        parent = null,
        callback = function(node) {
            if (node.data === toData) {
                parent = node;
            }
        };
    
    this.contains(callback, traversal);
    
    if (parent) {
        parent.children.push(child);
        child.parent = parent;
    } else {
        
        //throw new Error('Cannot add node to a non-existent parent.');
        //se nao tiver o no, adicionar com o root como pai e chamar de novo a funcao para adicionar...
        this.add(toData, root, traversal, root);
        this.add(data, toData, traversal, root);
    
    }
};

//removing a node from the tree 
Tree.prototype.remove = function(data, fromData, traversal) {
    var tree = this,
        parent = null,
        childToRemove = null,
        index;
 
    var callback = function(node) {
        if (node.data === fromData) {
            parent = node;
        }
    };
 
    this.contains(callback, traversal);
 
    if (parent) {
        index = findIndex(parent.children, data);
 
        if (index === undefined) {
            throw new Error('Node to remove does not exist.');
        } else {
            childToRemove = parent.children.splice(index, 1);
        }
    } else {
        throw new Error('Parent does not exist.');
    }
 
    return childToRemove;
};
 
function findIndex(arr, data) {
    var index;
 
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].data === data) {
            index = i;
        }
    }
 
    return index;
}


//gets the data from a json file
function getData(file){
    
    var data = {
        "description": {
            "is_a": "AnnotationProperty",
            "labelEN": "description",
            "labelPT": "descrição"
        },
        "test1": {
            "is_a": "description",
            "domain": "Indicator",
            "labelEN": "relevance",
            "labelPT": "relevância"
        },
        "relevance": {
            "is_a": "AnnotationProperty",
            "domain": "Indicator",
            "labelEN": "relevance",
            "labelPT": "relevância"
        },
        "title": {
            "is_a": "AnnotationProperty",
            "labelPT": "título",
            "labelEN": "title",
            "range": "Literal"
        },
        "title3": {
            "is_a": "title",
            "labelPT": "título",
            "labelEN": "title",
            "range": "Literal"
        },
        "title2": {
            "labelPT": "título",
            "labelEN": "title",
            "range": "Literal"
        }
    };
    
    var result = [];
    
    //the root node
    var treeName =  'Tree';

    //creating the tree
    var tree = new Tree(treeName);
    
    //tree.add("AnnotationProperty", treeName, tree.traverseBF, treeName);
    Object.keys(data).forEach(function (name) {
                
         if(data[name].is_a){
             result.push(name + ' is a ' + data[name].is_a);
             tree.add(name, data[name].is_a, tree.traverseBF, treeName);
         } 
         else{
             result.push(name + ' DOES NOT HAVE IS A FIELD');
             tree.add(name, treeName, tree.traverseBF, treeName);
         } 
    });
        
// output in snippet
document.write(result.join('<br>'));
    
}


//--------------------------  QUEUE  -------------------------------------------
function Queue() {
    this._oldestIndex = 1;
    this._newestIndex = 1;
    this._storage = {};
}
 
Queue.prototype.size = function() {
    return this._newestIndex - this._oldestIndex;
};
 
Queue.prototype.enqueue = function(data) {
    this._storage[this._newestIndex] = data;
    this._newestIndex++;
};
 
Queue.prototype.dequeue = function() {
    var oldestIndex = this._oldestIndex,
        newestIndex = this._newestIndex,
        deletedData;
 
    if (oldestIndex !== newestIndex) {
        deletedData = this._storage[oldestIndex];
        delete this._storage[oldestIndex];
        this._oldestIndex++;
 
        return deletedData;
    }
};

//-----------------------------------------------------------------------------------------

//----------------------------  STACK -----------------------------------------------------

function Stack() {
    this._size = 0;
    this._storage = {};
}
 
Stack.prototype.push = function(data) {
    var size = ++this._size;
    this._storage[size] = data;
};
 
Stack.prototype.pop = function() {
    var size = this._size,
        deletedData;
 
    if (size) {
        deletedData = this._storage[size];
 
        delete this._storage[size];
        this._size--;
 
        return deletedData;
    }
};

//-----------------------------------------------------------------------------------------

