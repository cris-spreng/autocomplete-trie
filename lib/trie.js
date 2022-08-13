const {capitalize} = require('./capitalize');

var trie = {};

trie.TrieNode = function (key,score = null) {

	this.key = key;		// Char of name
	this.parent = null;	// Reference to parent
	this.children = {};	// Reference to child
	this.end = false;	// True if Leaf
	this.score = score;	// Set if leaf
};

// iterates through parents to get name.
trie.TrieNode.prototype.getName = function () {
	var output = [];
	var node = this;
	while (node !== null) {
		output.unshift(node.key);
		node = node.parent;
	}
	return output.join("");
};

// Trie as root with null value.
trie.Trie = function () {
	this.root = new trie.TrieNode(null);
};

trie.Trie.prototype.insert = function (name,score=null) {
	var node = this.root; // we start at the root

	// run name for every char.
	for (var i = 0; i < name.length; i++) {
		// check to see if char node exists in children.
		if (!node.children[name[i]]) {
			// if it doesn't exist we create it.
			node.children[name[i]] = new trie.TrieNode(name[i].toLowerCase());

			// we also assign the parent to the child node.
			node.children[name[i]].parent = node;
		}
		// assign next level in trie to node.
		node = node.children[name[i]];

		// check if it's the last char in name (leaf).
		if (i == name.length - 1) {   
			node.end = true;	// set the end flag to true.
			node.score = score;	// set score to leaf.
		}
	}
};

// check name exists in trie.
trie.Trie.prototype.exists = function (name) {
	var node = this.root;

	// run name for every char.
	for (var i = 0; i < name.length; i++) {
	// check to see if char node exists in children.
		if (node.children[name[i]]) {
			// proceed to the next level of trie.
			node = node.children[name[i]];
		} else {
			// else return false since name does not exist in trie.
			return false;
		}
	}
	return node.score;	// return score: valid name with score. (else false l:69)
};

// returns list of names with given prefix and maxResults as limit
trie.Trie.prototype.findName = function (prefix,maxResults = 8) {
	var node = this.root;	// start with root
	var output = [];
	// we run prefix for every char
	for (var i = 0; i < prefix.length; i++) {
		// make sure node.children contains char (prefix[i])
		if (node.children[prefix[i]]) {
			// move to next level of trie
			node = node.children[prefix[i]];
		} else {
			// there's none return empty output and finish.
			return output;
		}
	}

// recursively find all possible names from this node
	trie.findAll(node, output);
	// return sorted and limited array
	return output.sort((a,b)=>{
		if(a.times<b.times){ return 1; }
		else if(a.times>b.times){ return -1; }
		else if(a.times==b.times && a.name>b.name){ return 1;}
		else if(a.times==b.times && a.name<b.name){ return -1;}
		else{ return 0;}
}).slice(0,maxResults);
};

// Find all names from the given node.
trie.findAll = function (node, arr) {
	// base case, if node is leaf, push to output with score
	if (node.end) {
		arr.unshift({"name":capitalize(node.getName()),"times":node.score});
	}

	// iterate through each children, call recursive findAll
	for (var child in node.children) {
		trie.findAll(node.children[child], arr);
	}
};

module.exports = trie;
