"use strict";

var Defined = function(x) {
  this.ref = x;
};

var Env = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
  "<": (a, b) => (a < b),
  ">": (a, b) => (a > b),
  "=": (a, b) => (a == b),
  ">=": (a, b) => (a >= b),
  "<=": (a, b) => (a <= b),
  "not": (a) => !(a)
};

/*
  Step 1: Tokenize
*/

var tokenize = function(code) {
  return code
    .replace(/\(/g, " ( ")
    .replace(/\)/g, " ) ")
    .split(" ")
    .filter(d => !(d === ""));
};

/*
  Step 2: build syntax tree
*/

var assemble = function(tokens) {
  var token = tokens.shift();

  if (token === "(" ) {
    var sub = [];
    while (tokens[0] !== ")" ) {
      sub.push(assemble(tokens));
    }
    tokens.shift();
    return sub;
  } else {
    return atom(token);
  }
};

/*
  Step 2.5 - convert numbers and variables
*/

var atom = function(token) {
  if (!Number.isNaN(+token)) {
    return +token;
  } else if (token == "quote") {
    return token;
  } else if (token == "if") {
    return token;
  } else if (token == "define") {
    return token;
  } else {
    return new Defined(token);
  }
};

/*
  Evaluate code acording to syntax rules
*/

var evaluate = function(exp, env) {
  if (exp instanceof Defined) {
    return env[exp.ref];
  } else if (!(exp instanceof Array)) {
    return exp;
  } else if (exp[0] === "quote") {
    return exp.slice(1);
  } else if (exp[0] === "if") {
    return exp[2] ? evaluate(exp[1], env) : exp[3];
  } else if (exp[0] === "define") {
    env[exp[1].ref] = evaluate(exp[2], env);
  } else {
    var proc = evaluate(exp[0], env);
    var args = exp.slice(1)
      .map(function(d) {
        return evaluate(d, env);
      });
    return proc.apply(null, args);
  }
};

var interpret = function(code, Env) {
  return evaluate(assemble(tokenize(code)), Env);
};

interpret("(define r 10)", Env);
var a = interpret("(* 3.14 (* r r))", Env);

console.log(a);
