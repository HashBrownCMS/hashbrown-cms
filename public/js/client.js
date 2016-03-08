"use strict";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value" in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol?"symbol":typeof obj;};function _classCallCheck2(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'");}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e);},f,f.exports,e,t,n,r);}return n[o].exports;}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++){s(r[o]);}return s;})({1:[function(require,module,exports){'use strict';var acorn=require('acorn');var walk=require('acorn/dist/walk');function isScope(node){return node.type==='FunctionExpression'||node.type==='FunctionDeclaration'||node.type==='ArrowFunctionExpression'||node.type==='Program';}function isBlockScope(node){return node.type==='BlockStatement'||isScope(node);}function declaresArguments(node){return node.type==='FunctionExpression'||node.type==='FunctionDeclaration';}function declaresThis(node){return node.type==='FunctionExpression'||node.type==='FunctionDeclaration';}function reallyParse(source){try{return acorn.parse(source,{ecmaVersion:6,allowReturnOutsideFunction:true,allowImportExportEverywhere:true,allowHashBang:true});}catch(ex){return acorn.parse(source,{ecmaVersion:5,allowReturnOutsideFunction:true,allowImportExportEverywhere:true,allowHashBang:true});}}module.exports=findGlobals;module.exports.parse=reallyParse;function findGlobals(source){var globals=[];var ast; // istanbul ignore else
if(typeof source==='string'){ast=reallyParse(source);}else {ast=source;} // istanbul ignore if
if(!(ast&&(typeof ast==="undefined"?"undefined":_typeof(ast))==='object'&&ast.type==='Program')){throw new TypeError('Source must be either a string of JavaScript or an acorn AST');}var declareFunction=function declareFunction(node){var fn=node;fn.locals=fn.locals||{};node.params.forEach(function(node){declarePattern(node,fn);});if(node.id){fn.locals[node.id.name]=true;}};var declarePattern=function declarePattern(node,parent){switch(node.type){case 'Identifier':parent.locals[node.name]=true;break;case 'ObjectPattern':node.properties.forEach(function(node){declarePattern(node.value,parent);});break;case 'ArrayPattern':node.elements.forEach(function(node){if(node)declarePattern(node,parent);});break;case 'RestElement':declarePattern(node.argument,parent);break;case 'AssignmentPattern':declarePattern(node.left,parent);break; // istanbul ignore next
default:throw new Error('Unrecognized pattern type: '+node.type);}};var declareModuleSpecifier=function declareModuleSpecifier(node,parents){ast.locals=ast.locals||{};ast.locals[node.local.name]=true;};walk.ancestor(ast,{'VariableDeclaration':function VariableDeclaration(node,parents){var parent=null;for(var i=parents.length-1;i>=0&&parent===null;i--){if(node.kind==='var'?isScope(parents[i]):isBlockScope(parents[i])){parent=parents[i];}}parent.locals=parent.locals||{};node.declarations.forEach(function(declaration){declarePattern(declaration.id,parent);});},'FunctionDeclaration':function FunctionDeclaration(node,parents){var parent=null;for(var i=parents.length-2;i>=0&&parent===null;i--){if(isScope(parents[i])){parent=parents[i];}}parent.locals=parent.locals||{};parent.locals[node.id.name]=true;declareFunction(node);},'Function':declareFunction,'ClassDeclaration':function ClassDeclaration(node,parents){var parent=null;for(var i=parents.length-2;i>=0&&parent===null;i--){if(isScope(parents[i])){parent=parents[i];}}parent.locals=parent.locals||{};parent.locals[node.id.name]=true;},'TryStatement':function TryStatement(node){if(node.handler===null)return;node.handler.body.locals=node.handler.body.locals||{};node.handler.body.locals[node.handler.param.name]=true;},'ImportDefaultSpecifier':declareModuleSpecifier,'ImportSpecifier':declareModuleSpecifier,'ImportNamespaceSpecifier':declareModuleSpecifier});function identifier(node,parents){var name=node.name;if(name==='undefined')return;for(var i=0;i<parents.length;i++){if(name==='arguments'&&declaresArguments(parents[i])){return;}if(parents[i].locals&&name in parents[i].locals){return;}}if(parents[parents.length-2]&&parents[parents.length-2].type==='TryStatement'&&parents[parents.length-2].handler&&node===parents[parents.length-2].handler.param){return;}node.parents=parents;globals.push(node);}walk.ancestor(ast,{'VariablePattern':identifier,'Identifier':identifier,'ThisExpression':function ThisExpression(node,parents){for(var i=0;i<parents.length;i++){if(declaresThis(parents[i])){return;}}node.parents=parents;globals.push(node);}});var groupedGlobals={};globals.forEach(function(node){groupedGlobals[node.name]=groupedGlobals[node.name]||[];groupedGlobals[node.name].push(node);});return Object.keys(groupedGlobals).sort().map(function(name){return {name:name,nodes:groupedGlobals[name]};});}},{"acorn":2,"acorn/dist/walk":3}],2:[function(require,module,exports){(function(global){(function(f){if((typeof exports==="undefined"?"undefined":_typeof(exports))==="object"&&typeof module!=="undefined"){module.exports=f();}else if(typeof define==="function"&&define.amd){define([],f);}else {var g;if(typeof window!=="undefined"){g=window;}else if(typeof global!=="undefined"){g=global;}else if(typeof self!=="undefined"){g=self;}else {g=this;}g.acorn=f();}})(function(){var define,module,exports;return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f;}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e);},l,l.exports,e,t,n,r);}return n[o].exports;}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++){s(r[o]);}return s;}({1:[function(_dereq_,module,exports){ // A recursive descent parser operates by defining functions for all
// syntactic elements, and recursively calling those, each function
// advancing the input stream and returning an AST node. Precedence
// of constructs (for example, the fact that `!x[1]` means `!(x[1])`
// instead of `(!x)[1]` is handled by the fact that the parser
// function that parses unary prefix operators is called first, and
// in turn calls the function that parses `[]` subscripts — that
// way, it'll receive the node for `x[1]` already parsed, and wraps
// *that* in the unary operator node.
//
// Acorn uses an [operator precedence parser][opp] to handle binary
// operator precedence, because it is much more compact than using
// the technique outlined above, which uses different, nesting
// functions to specify precedence, for all of the ten binary
// precedence levels that JavaScript defines.
//
// [opp]: http://en.wikipedia.org/wiki/Operator-precedence_parser
"use strict";var _tokentype=_dereq_("./tokentype");var _state=_dereq_("./state");var pp=_state.Parser.prototype; // Check if property name clashes with already added.
// Object/class getters and setters are not allowed to clash —
// either with each other or with an init property — and in
// strict mode, init properties are also not allowed to be repeated.
pp.checkPropClash=function(prop,propHash){if(this.options.ecmaVersion>=6&&(prop.computed||prop.method||prop.shorthand))return;var key=prop.key;var name=undefined;switch(key.type){case "Identifier":name=key.name;break;case "Literal":name=String(key.value);break;default:return;}var kind=prop.kind;if(this.options.ecmaVersion>=6){if(name==="__proto__"&&kind==="init"){if(propHash.proto)this.raise(key.start,"Redefinition of __proto__ property");propHash.proto=true;}return;}name="$"+name;var other=propHash[name];if(other){var isGetSet=kind!=="init";if((this.strict||isGetSet)&&other[kind]||!(isGetSet^other.init))this.raise(key.start,"Redefinition of property");}else {other=propHash[name]={init:false,get:false,set:false};}other[kind]=true;}; // ### Expression parsing
// These nest, from the most general expression type at the top to
// 'atomic', nondivisible expression types at the bottom. Most of
// the functions will simply let the function(s) below them parse,
// and, *if* the syntactic construct they handle is present, wrap
// the AST node that the inner parser gave them in another node.
// Parse a full expression. The optional arguments are used to
// forbid the `in` operator (in for loops initalization expressions)
// and provide reference for storing '=' operator inside shorthand
// property assignment in contexts where both object expression
// and object pattern might appear (so it's possible to raise
// delayed syntax error at correct position).
pp.parseExpression=function(noIn,refDestructuringErrors){var startPos=this.start,startLoc=this.startLoc;var expr=this.parseMaybeAssign(noIn,refDestructuringErrors);if(this.type===_tokentype.types.comma){var node=this.startNodeAt(startPos,startLoc);node.expressions=[expr];while(this.eat(_tokentype.types.comma)){node.expressions.push(this.parseMaybeAssign(noIn,refDestructuringErrors));}return this.finishNode(node,"SequenceExpression");}return expr;}; // Parse an assignment expression. This includes applications of
// operators like `+=`.
pp.parseMaybeAssign=function(noIn,refDestructuringErrors,afterLeftParse){if(this.type==_tokentype.types._yield&&this.inGenerator)return this.parseYield();var validateDestructuring=false;if(!refDestructuringErrors){refDestructuringErrors={shorthandAssign:0,trailingComma:0};validateDestructuring=true;}var startPos=this.start,startLoc=this.startLoc;if(this.type==_tokentype.types.parenL||this.type==_tokentype.types.name)this.potentialArrowAt=this.start;var left=this.parseMaybeConditional(noIn,refDestructuringErrors);if(afterLeftParse)left=afterLeftParse.call(this,left,startPos,startLoc);if(this.type.isAssign){if(validateDestructuring)this.checkPatternErrors(refDestructuringErrors,true);var node=this.startNodeAt(startPos,startLoc);node.operator=this.value;node.left=this.type===_tokentype.types.eq?this.toAssignable(left):left;refDestructuringErrors.shorthandAssign=0; // reset because shorthand default was used correctly
this.checkLVal(left);this.next();node.right=this.parseMaybeAssign(noIn);return this.finishNode(node,"AssignmentExpression");}else {if(validateDestructuring)this.checkExpressionErrors(refDestructuringErrors,true);}return left;}; // Parse a ternary conditional (`?:`) operator.
pp.parseMaybeConditional=function(noIn,refDestructuringErrors){var startPos=this.start,startLoc=this.startLoc;var expr=this.parseExprOps(noIn,refDestructuringErrors);if(this.checkExpressionErrors(refDestructuringErrors))return expr;if(this.eat(_tokentype.types.question)){var node=this.startNodeAt(startPos,startLoc);node.test=expr;node.consequent=this.parseMaybeAssign();this.expect(_tokentype.types.colon);node.alternate=this.parseMaybeAssign(noIn);return this.finishNode(node,"ConditionalExpression");}return expr;}; // Start the precedence parser.
pp.parseExprOps=function(noIn,refDestructuringErrors){var startPos=this.start,startLoc=this.startLoc;var expr=this.parseMaybeUnary(refDestructuringErrors);if(this.checkExpressionErrors(refDestructuringErrors))return expr;return this.parseExprOp(expr,startPos,startLoc,-1,noIn);}; // Parse binary operators with the operator precedence parsing
// algorithm. `left` is the left-hand side of the operator.
// `minPrec` provides context that allows the function to stop and
// defer further parser to one of its callers when it encounters an
// operator that has a lower precedence than the set it is parsing.
pp.parseExprOp=function(left,leftStartPos,leftStartLoc,minPrec,noIn){var prec=this.type.binop;if(prec!=null&&(!noIn||this.type!==_tokentype.types._in)){if(prec>minPrec){var node=this.startNodeAt(leftStartPos,leftStartLoc);node.left=left;node.operator=this.value;var op=this.type;this.next();var startPos=this.start,startLoc=this.startLoc;node.right=this.parseExprOp(this.parseMaybeUnary(),startPos,startLoc,prec,noIn);this.finishNode(node,op===_tokentype.types.logicalOR||op===_tokentype.types.logicalAND?"LogicalExpression":"BinaryExpression");return this.parseExprOp(node,leftStartPos,leftStartLoc,minPrec,noIn);}}return left;}; // Parse unary operators, both prefix and postfix.
pp.parseMaybeUnary=function(refDestructuringErrors){if(this.type.prefix){var node=this.startNode(),update=this.type===_tokentype.types.incDec;node.operator=this.value;node.prefix=true;this.next();node.argument=this.parseMaybeUnary();this.checkExpressionErrors(refDestructuringErrors,true);if(update)this.checkLVal(node.argument);else if(this.strict&&node.operator==="delete"&&node.argument.type==="Identifier")this.raise(node.start,"Deleting local variable in strict mode");return this.finishNode(node,update?"UpdateExpression":"UnaryExpression");}var startPos=this.start,startLoc=this.startLoc;var expr=this.parseExprSubscripts(refDestructuringErrors);if(this.checkExpressionErrors(refDestructuringErrors))return expr;while(this.type.postfix&&!this.canInsertSemicolon()){var node=this.startNodeAt(startPos,startLoc);node.operator=this.value;node.prefix=false;node.argument=expr;this.checkLVal(expr);this.next();expr=this.finishNode(node,"UpdateExpression");}return expr;}; // Parse call, dot, and `[]`-subscript expressions.
pp.parseExprSubscripts=function(refDestructuringErrors){var startPos=this.start,startLoc=this.startLoc;var expr=this.parseExprAtom(refDestructuringErrors);var skipArrowSubscripts=expr.type==="ArrowFunctionExpression"&&this.input.slice(this.lastTokStart,this.lastTokEnd)!==")";if(this.checkExpressionErrors(refDestructuringErrors)||skipArrowSubscripts)return expr;return this.parseSubscripts(expr,startPos,startLoc);};pp.parseSubscripts=function(base,startPos,startLoc,noCalls){for(;;){if(this.eat(_tokentype.types.dot)){var node=this.startNodeAt(startPos,startLoc);node.object=base;node.property=this.parseIdent(true);node.computed=false;base=this.finishNode(node,"MemberExpression");}else if(this.eat(_tokentype.types.bracketL)){var node=this.startNodeAt(startPos,startLoc);node.object=base;node.property=this.parseExpression();node.computed=true;this.expect(_tokentype.types.bracketR);base=this.finishNode(node,"MemberExpression");}else if(!noCalls&&this.eat(_tokentype.types.parenL)){var node=this.startNodeAt(startPos,startLoc);node.callee=base;node.arguments=this.parseExprList(_tokentype.types.parenR,false);base=this.finishNode(node,"CallExpression");}else if(this.type===_tokentype.types.backQuote){var node=this.startNodeAt(startPos,startLoc);node.tag=base;node.quasi=this.parseTemplate();base=this.finishNode(node,"TaggedTemplateExpression");}else {return base;}}}; // Parse an atomic expression — either a single token that is an
// expression, an expression started by a keyword like `function` or
// `new`, or an expression wrapped in punctuation like `()`, `[]`,
// or `{}`.
pp.parseExprAtom=function(refDestructuringErrors){var node=undefined,canBeArrow=this.potentialArrowAt==this.start;switch(this.type){case _tokentype.types._super:if(!this.inFunction)this.raise(this.start,"'super' outside of function or class");case _tokentype.types._this:var type=this.type===_tokentype.types._this?"ThisExpression":"Super";node=this.startNode();this.next();return this.finishNode(node,type);case _tokentype.types._yield:if(this.inGenerator)this.unexpected();case _tokentype.types.name:var startPos=this.start,startLoc=this.startLoc;var id=this.parseIdent(this.type!==_tokentype.types.name);if(canBeArrow&&!this.canInsertSemicolon()&&this.eat(_tokentype.types.arrow))return this.parseArrowExpression(this.startNodeAt(startPos,startLoc),[id]);return id;case _tokentype.types.regexp:var value=this.value;node=this.parseLiteral(value.value);node.regex={pattern:value.pattern,flags:value.flags};return node;case _tokentype.types.num:case _tokentype.types.string:return this.parseLiteral(this.value);case _tokentype.types._null:case _tokentype.types._true:case _tokentype.types._false:node=this.startNode();node.value=this.type===_tokentype.types._null?null:this.type===_tokentype.types._true;node.raw=this.type.keyword;this.next();return this.finishNode(node,"Literal");case _tokentype.types.parenL:return this.parseParenAndDistinguishExpression(canBeArrow);case _tokentype.types.bracketL:node=this.startNode();this.next(); // check whether this is array comprehension or regular array
if(this.options.ecmaVersion>=7&&this.type===_tokentype.types._for){return this.parseComprehension(node,false);}node.elements=this.parseExprList(_tokentype.types.bracketR,true,true,refDestructuringErrors);return this.finishNode(node,"ArrayExpression");case _tokentype.types.braceL:return this.parseObj(false,refDestructuringErrors);case _tokentype.types._function:node=this.startNode();this.next();return this.parseFunction(node,false);case _tokentype.types._class:return this.parseClass(this.startNode(),false);case _tokentype.types._new:return this.parseNew();case _tokentype.types.backQuote:return this.parseTemplate();default:this.unexpected();}};pp.parseLiteral=function(value){var node=this.startNode();node.value=value;node.raw=this.input.slice(this.start,this.end);this.next();return this.finishNode(node,"Literal");};pp.parseParenExpression=function(){this.expect(_tokentype.types.parenL);var val=this.parseExpression();this.expect(_tokentype.types.parenR);return val;};pp.parseParenAndDistinguishExpression=function(canBeArrow){var startPos=this.start,startLoc=this.startLoc,val=undefined;if(this.options.ecmaVersion>=6){this.next();if(this.options.ecmaVersion>=7&&this.type===_tokentype.types._for){return this.parseComprehension(this.startNodeAt(startPos,startLoc),true);}var innerStartPos=this.start,innerStartLoc=this.startLoc;var exprList=[],first=true;var refDestructuringErrors={shorthandAssign:0,trailingComma:0},spreadStart=undefined,innerParenStart=undefined;while(this.type!==_tokentype.types.parenR){first?first=false:this.expect(_tokentype.types.comma);if(this.type===_tokentype.types.ellipsis){spreadStart=this.start;exprList.push(this.parseParenItem(this.parseRest()));break;}else {if(this.type===_tokentype.types.parenL&&!innerParenStart){innerParenStart=this.start;}exprList.push(this.parseMaybeAssign(false,refDestructuringErrors,this.parseParenItem));}}var innerEndPos=this.start,innerEndLoc=this.startLoc;this.expect(_tokentype.types.parenR);if(canBeArrow&&!this.canInsertSemicolon()&&this.eat(_tokentype.types.arrow)){this.checkPatternErrors(refDestructuringErrors,true);if(innerParenStart)this.unexpected(innerParenStart);return this.parseParenArrowList(startPos,startLoc,exprList);}if(!exprList.length)this.unexpected(this.lastTokStart);if(spreadStart)this.unexpected(spreadStart);this.checkExpressionErrors(refDestructuringErrors,true);if(exprList.length>1){val=this.startNodeAt(innerStartPos,innerStartLoc);val.expressions=exprList;this.finishNodeAt(val,"SequenceExpression",innerEndPos,innerEndLoc);}else {val=exprList[0];}}else {val=this.parseParenExpression();}if(this.options.preserveParens){var par=this.startNodeAt(startPos,startLoc);par.expression=val;return this.finishNode(par,"ParenthesizedExpression");}else {return val;}};pp.parseParenItem=function(item){return item;};pp.parseParenArrowList=function(startPos,startLoc,exprList){return this.parseArrowExpression(this.startNodeAt(startPos,startLoc),exprList);}; // New's precedence is slightly tricky. It must allow its argument to
// be a `[]` or dot subscript expression, but not a call — at least,
// not without wrapping it in parentheses. Thus, it uses the noCalls
// argument to parseSubscripts to prevent it from consuming the
// argument list.
var empty=[];pp.parseNew=function(){var node=this.startNode();var meta=this.parseIdent(true);if(this.options.ecmaVersion>=6&&this.eat(_tokentype.types.dot)){node.meta=meta;node.property=this.parseIdent(true);if(node.property.name!=="target")this.raise(node.property.start,"The only valid meta property for new is new.target");if(!this.inFunction)this.raise(node.start,"new.target can only be used in functions");return this.finishNode(node,"MetaProperty");}var startPos=this.start,startLoc=this.startLoc;node.callee=this.parseSubscripts(this.parseExprAtom(),startPos,startLoc,true);if(this.eat(_tokentype.types.parenL))node.arguments=this.parseExprList(_tokentype.types.parenR,false);else node.arguments=empty;return this.finishNode(node,"NewExpression");}; // Parse template expression.
pp.parseTemplateElement=function(){var elem=this.startNode();elem.value={raw:this.input.slice(this.start,this.end).replace(/\r\n?/g,'\n'),cooked:this.value};this.next();elem.tail=this.type===_tokentype.types.backQuote;return this.finishNode(elem,"TemplateElement");};pp.parseTemplate=function(){var node=this.startNode();this.next();node.expressions=[];var curElt=this.parseTemplateElement();node.quasis=[curElt];while(!curElt.tail){this.expect(_tokentype.types.dollarBraceL);node.expressions.push(this.parseExpression());this.expect(_tokentype.types.braceR);node.quasis.push(curElt=this.parseTemplateElement());}this.next();return this.finishNode(node,"TemplateLiteral");}; // Parse an object literal or binding pattern.
pp.parseObj=function(isPattern,refDestructuringErrors){var node=this.startNode(),first=true,propHash={};node.properties=[];this.next();while(!this.eat(_tokentype.types.braceR)){if(!first){this.expect(_tokentype.types.comma);if(this.afterTrailingComma(_tokentype.types.braceR))break;}else first=false;var prop=this.startNode(),isGenerator=undefined,startPos=undefined,startLoc=undefined;if(this.options.ecmaVersion>=6){prop.method=false;prop.shorthand=false;if(isPattern||refDestructuringErrors){startPos=this.start;startLoc=this.startLoc;}if(!isPattern)isGenerator=this.eat(_tokentype.types.star);}this.parsePropertyName(prop);this.parsePropertyValue(prop,isPattern,isGenerator,startPos,startLoc,refDestructuringErrors);this.checkPropClash(prop,propHash);node.properties.push(this.finishNode(prop,"Property"));}return this.finishNode(node,isPattern?"ObjectPattern":"ObjectExpression");};pp.parsePropertyValue=function(prop,isPattern,isGenerator,startPos,startLoc,refDestructuringErrors){if(this.eat(_tokentype.types.colon)){prop.value=isPattern?this.parseMaybeDefault(this.start,this.startLoc):this.parseMaybeAssign(false,refDestructuringErrors);prop.kind="init";}else if(this.options.ecmaVersion>=6&&this.type===_tokentype.types.parenL){if(isPattern)this.unexpected();prop.kind="init";prop.method=true;prop.value=this.parseMethod(isGenerator);}else if(this.options.ecmaVersion>=5&&!prop.computed&&prop.key.type==="Identifier"&&(prop.key.name==="get"||prop.key.name==="set")&&this.type!=_tokentype.types.comma&&this.type!=_tokentype.types.braceR){if(isGenerator||isPattern)this.unexpected();prop.kind=prop.key.name;this.parsePropertyName(prop);prop.value=this.parseMethod(false);var paramCount=prop.kind==="get"?0:1;if(prop.value.params.length!==paramCount){var start=prop.value.start;if(prop.kind==="get")this.raise(start,"getter should have no params");else this.raise(start,"setter should have exactly one param");}if(prop.kind==="set"&&prop.value.params[0].type==="RestElement")this.raise(prop.value.params[0].start,"Setter cannot use rest params");}else if(this.options.ecmaVersion>=6&&!prop.computed&&prop.key.type==="Identifier"){prop.kind="init";if(isPattern){if(this.keywords.test(prop.key.name)||(this.strict?this.reservedWordsStrictBind:this.reservedWords).test(prop.key.name))this.raise(prop.key.start,"Binding "+prop.key.name);prop.value=this.parseMaybeDefault(startPos,startLoc,prop.key);}else if(this.type===_tokentype.types.eq&&refDestructuringErrors){if(!refDestructuringErrors.shorthandAssign)refDestructuringErrors.shorthandAssign=this.start;prop.value=this.parseMaybeDefault(startPos,startLoc,prop.key);}else {prop.value=prop.key;}prop.shorthand=true;}else this.unexpected();};pp.parsePropertyName=function(prop){if(this.options.ecmaVersion>=6){if(this.eat(_tokentype.types.bracketL)){prop.computed=true;prop.key=this.parseMaybeAssign();this.expect(_tokentype.types.bracketR);return prop.key;}else {prop.computed=false;}}return prop.key=this.type===_tokentype.types.num||this.type===_tokentype.types.string?this.parseExprAtom():this.parseIdent(true);}; // Initialize empty function node.
pp.initFunction=function(node){node.id=null;if(this.options.ecmaVersion>=6){node.generator=false;node.expression=false;}}; // Parse object or class method.
pp.parseMethod=function(isGenerator){var node=this.startNode();this.initFunction(node);this.expect(_tokentype.types.parenL);node.params=this.parseBindingList(_tokentype.types.parenR,false,false);if(this.options.ecmaVersion>=6)node.generator=isGenerator;this.parseFunctionBody(node,false);return this.finishNode(node,"FunctionExpression");}; // Parse arrow function expression with given parameters.
pp.parseArrowExpression=function(node,params){this.initFunction(node);node.params=this.toAssignableList(params,true);this.parseFunctionBody(node,true);return this.finishNode(node,"ArrowFunctionExpression");}; // Parse function body and check parameters.
pp.parseFunctionBody=function(node,isArrowFunction){var isExpression=isArrowFunction&&this.type!==_tokentype.types.braceL;if(isExpression){node.body=this.parseMaybeAssign();node.expression=true;}else { // Start a new scope with regard to labels and the `inFunction`
// flag (restore them to their old value afterwards).
var oldInFunc=this.inFunction,oldInGen=this.inGenerator,oldLabels=this.labels;this.inFunction=true;this.inGenerator=node.generator;this.labels=[];node.body=this.parseBlock(true);node.expression=false;this.inFunction=oldInFunc;this.inGenerator=oldInGen;this.labels=oldLabels;} // If this is a strict mode function, verify that argument names
// are not repeated, and it does not try to bind the words `eval`
// or `arguments`.
if(this.strict||!isExpression&&node.body.body.length&&this.isUseStrict(node.body.body[0])){var oldStrict=this.strict;this.strict=true;if(node.id)this.checkLVal(node.id,true);this.checkParams(node);this.strict=oldStrict;}else if(isArrowFunction){this.checkParams(node);}}; // Checks function params for various disallowed patterns such as using "eval"
// or "arguments" and duplicate parameters.
pp.checkParams=function(node){var nameHash={};for(var i=0;i<node.params.length;i++){this.checkLVal(node.params[i],true,nameHash);}}; // Parses a comma-separated list of expressions, and returns them as
// an array. `close` is the token type that ends the list, and
// `allowEmpty` can be turned on to allow subsequent commas with
// nothing in between them to be parsed as `null` (which is needed
// for array literals).
pp.parseExprList=function(close,allowTrailingComma,allowEmpty,refDestructuringErrors){var elts=[],first=true;while(!this.eat(close)){if(!first){this.expect(_tokentype.types.comma);if(this.type===close&&refDestructuringErrors&&!refDestructuringErrors.trailingComma){refDestructuringErrors.trailingComma=this.lastTokStart;}if(allowTrailingComma&&this.afterTrailingComma(close))break;}else first=false;var elt=undefined;if(allowEmpty&&this.type===_tokentype.types.comma)elt=null;else if(this.type===_tokentype.types.ellipsis)elt=this.parseSpread(refDestructuringErrors);else elt=this.parseMaybeAssign(false,refDestructuringErrors);elts.push(elt);}return elts;}; // Parse the next token as an identifier. If `liberal` is true (used
// when parsing properties), it will also convert keywords into
// identifiers.
pp.parseIdent=function(liberal){var node=this.startNode();if(liberal&&this.options.allowReserved=="never")liberal=false;if(this.type===_tokentype.types.name){if(!liberal&&(this.strict?this.reservedWordsStrict:this.reservedWords).test(this.value)&&(this.options.ecmaVersion>=6||this.input.slice(this.start,this.end).indexOf("\\")==-1))this.raise(this.start,"The keyword '"+this.value+"' is reserved");node.name=this.value;}else if(liberal&&this.type.keyword){node.name=this.type.keyword;}else {this.unexpected();}this.next();return this.finishNode(node,"Identifier");}; // Parses yield expression inside generator.
pp.parseYield=function(){var node=this.startNode();this.next();if(this.type==_tokentype.types.semi||this.canInsertSemicolon()||this.type!=_tokentype.types.star&&!this.type.startsExpr){node.delegate=false;node.argument=null;}else {node.delegate=this.eat(_tokentype.types.star);node.argument=this.parseMaybeAssign();}return this.finishNode(node,"YieldExpression");}; // Parses array and generator comprehensions.
pp.parseComprehension=function(node,isGenerator){node.blocks=[];while(this.type===_tokentype.types._for){var block=this.startNode();this.next();this.expect(_tokentype.types.parenL);block.left=this.parseBindingAtom();this.checkLVal(block.left,true);this.expectContextual("of");block.right=this.parseExpression();this.expect(_tokentype.types.parenR);node.blocks.push(this.finishNode(block,"ComprehensionBlock"));}node.filter=this.eat(_tokentype.types._if)?this.parseParenExpression():null;node.body=this.parseExpression();this.expect(isGenerator?_tokentype.types.parenR:_tokentype.types.bracketR);node.generator=isGenerator;return this.finishNode(node,"ComprehensionExpression");};},{"./state":10,"./tokentype":14}],2:[function(_dereq_,module,exports){ // This is a trick taken from Esprima. It turns out that, on
// non-Chrome browsers, to check whether a string is in a set, a
// predicate containing a big ugly `switch` statement is faster than
// a regular expression, and on Chrome the two are about on par.
// This function uses `eval` (non-lexical) to produce such a
// predicate from a space-separated string of words.
//
// It starts by sorting the words by length.
// Reserved word lists for various dialects of the language
"use strict";exports.__esModule=true;exports.isIdentifierStart=isIdentifierStart;exports.isIdentifierChar=isIdentifierChar;var reservedWords={3:"abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",5:"class enum extends super const export import",6:"enum",strict:"implements interface let package private protected public static yield",strictBind:"eval arguments"};exports.reservedWords=reservedWords; // And the keywords
var ecma5AndLessKeywords="break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";var keywords={5:ecma5AndLessKeywords,6:ecma5AndLessKeywords+" let const class extends export import yield super"};exports.keywords=keywords; // ## Character categories
// Big ugly regular expressions that match characters in the
// whitespace, identifier, and identifier-start categories. These
// are only applied when a character is found to actually have a
// code point above 128.
// Generated by `bin/generate-identifier-regex.js`.
var nonASCIIidentifierStartChars="ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙա-ևא-תװ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࢠ-ࢲऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘౙౠౡಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠೡೱೲഅ-ഌഎ-ഐഒ-ഺഽൎൠൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄງຈຊຍດ-ທນ-ຟມ-ຣລວສຫອ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏼᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡷᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᧁ-ᧇᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭋᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᳩ-ᳬᳮ-ᳱᳵᳶᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄭㄱ-ㆎㆠ-ㆺㇰ-ㇿ㐀-䶵一-鿌ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꞎꞐ-ꞭꞰꞱꟷ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭟꭤꭥꯀ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ";var nonASCIIidentifierChars="‌‍·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ࣤ-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ଁ-ଃ଼ା-ୄେୈୋ-୍ୖୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఃా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ഁ-ഃാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ංඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ູົຼ່-ໍ໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜔ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠐-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏ᦰ-ᧀᧈᧉ᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭ᳲ-᳴᳸᳹᷀-᷵᷼-᷿‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯꘠-꘩꙯ꙴ-꙽ꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧꢀꢁꢴ-꣄꣐-꣙꣠-꣱꤀-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︭︳︴﹍-﹏０-９＿";var nonASCIIidentifierStart=new RegExp("["+nonASCIIidentifierStartChars+"]");var nonASCIIidentifier=new RegExp("["+nonASCIIidentifierStartChars+nonASCIIidentifierChars+"]");nonASCIIidentifierStartChars=nonASCIIidentifierChars=null; // These are a run-length and offset encoded representation of the
// >0xffff code points that are a valid part of identifiers. The
// offset starts at 0x10000, and each pair of numbers represents an
// offset to the next range, and then a size of the range. They were
// generated by tools/generate-identifier-regex.js
var astralIdentifierStartCodes=[0,11,2,25,2,18,2,1,2,14,3,13,35,122,70,52,268,28,4,48,48,31,17,26,6,37,11,29,3,35,5,7,2,4,43,157,99,39,9,51,157,310,10,21,11,7,153,5,3,0,2,43,2,1,4,0,3,22,11,22,10,30,98,21,11,25,71,55,7,1,65,0,16,3,2,2,2,26,45,28,4,28,36,7,2,27,28,53,11,21,11,18,14,17,111,72,955,52,76,44,33,24,27,35,42,34,4,0,13,47,15,3,22,0,38,17,2,24,133,46,39,7,3,1,3,21,2,6,2,1,2,4,4,0,32,4,287,47,21,1,2,0,185,46,82,47,21,0,60,42,502,63,32,0,449,56,1288,920,104,110,2962,1070,13266,568,8,30,114,29,19,47,17,3,32,20,6,18,881,68,12,0,67,12,16481,1,3071,106,6,12,4,8,8,9,5991,84,2,70,2,1,3,0,3,1,3,3,2,11,2,0,2,6,2,64,2,3,3,7,2,6,2,27,2,3,2,4,2,0,4,6,2,339,3,24,2,24,2,30,2,24,2,30,2,24,2,30,2,24,2,30,2,24,2,7,4149,196,1340,3,2,26,2,1,2,0,3,0,2,9,2,3,2,0,2,0,7,0,5,0,2,0,2,0,2,2,2,1,2,0,3,0,2,0,2,0,2,0,2,0,2,1,2,0,3,3,2,6,2,3,2,3,2,0,2,9,2,16,6,2,2,4,2,16,4421,42710,42,4148,12,221,16355,541];var astralIdentifierCodes=[509,0,227,0,150,4,294,9,1368,2,2,1,6,3,41,2,5,0,166,1,1306,2,54,14,32,9,16,3,46,10,54,9,7,2,37,13,2,9,52,0,13,2,49,13,16,9,83,11,168,11,6,9,8,2,57,0,2,6,3,1,3,2,10,0,11,1,3,6,4,4,316,19,13,9,214,6,3,8,112,16,16,9,82,12,9,9,535,9,20855,9,135,4,60,6,26,9,1016,45,17,3,19723,1,5319,4,4,5,9,7,3,6,31,3,149,2,1418,49,4305,6,792618,239]; // This has a complexity linear to the value of the code. The
// assumption is that looking up astral identifier characters is
// rare.
function isInAstralSet(code,set){var pos=0x10000;for(var i=0;i<set.length;i+=2){pos+=set[i];if(pos>code)return false;pos+=set[i+1];if(pos>=code)return true;}} // Test whether a given character code starts an identifier.
function isIdentifierStart(code,astral){if(code<65)return code===36;if(code<91)return true;if(code<97)return code===95;if(code<123)return true;if(code<=0xffff)return code>=0xaa&&nonASCIIidentifierStart.test(String.fromCharCode(code));if(astral===false)return false;return isInAstralSet(code,astralIdentifierStartCodes);} // Test whether a given character is part of an identifier.
function isIdentifierChar(code,astral){if(code<48)return code===36;if(code<58)return true;if(code<65)return false;if(code<91)return true;if(code<97)return code===95;if(code<123)return true;if(code<=0xffff)return code>=0xaa&&nonASCIIidentifier.test(String.fromCharCode(code));if(astral===false)return false;return isInAstralSet(code,astralIdentifierStartCodes)||isInAstralSet(code,astralIdentifierCodes);}},{}],3:[function(_dereq_,module,exports){ // Acorn is a tiny, fast JavaScript parser written in JavaScript.
//
// Acorn was written by Marijn Haverbeke, Ingvar Stepanyan, and
// various contributors and released under an MIT license.
//
// Git repositories for Acorn are available at
//
//     http://marijnhaverbeke.nl/git/acorn
//     https://github.com/ternjs/acorn.git
//
// Please use the [github bug tracker][ghbt] to report issues.
//
// [ghbt]: https://github.com/ternjs/acorn/issues
//
// This file defines the main parser interface. The library also comes
// with a [error-tolerant parser][dammit] and an
// [abstract syntax tree walker][walk], defined in other files.
//
// [dammit]: acorn_loose.js
// [walk]: util/walk.js
"use strict";exports.__esModule=true;exports.parse=parse;exports.parseExpressionAt=parseExpressionAt;exports.tokenizer=tokenizer;var _state=_dereq_("./state");_dereq_("./parseutil");_dereq_("./statement");_dereq_("./lval");_dereq_("./expression");_dereq_("./location");exports.Parser=_state.Parser;exports.plugins=_state.plugins;var _options=_dereq_("./options");exports.defaultOptions=_options.defaultOptions;var _locutil=_dereq_("./locutil");exports.Position=_locutil.Position;exports.SourceLocation=_locutil.SourceLocation;exports.getLineInfo=_locutil.getLineInfo;var _node=_dereq_("./node");exports.Node=_node.Node;var _tokentype=_dereq_("./tokentype");exports.TokenType=_tokentype.TokenType;exports.tokTypes=_tokentype.types;var _tokencontext=_dereq_("./tokencontext");exports.TokContext=_tokencontext.TokContext;exports.tokContexts=_tokencontext.types;var _identifier=_dereq_("./identifier");exports.isIdentifierChar=_identifier.isIdentifierChar;exports.isIdentifierStart=_identifier.isIdentifierStart;var _tokenize=_dereq_("./tokenize");exports.Token=_tokenize.Token;var _whitespace=_dereq_("./whitespace");exports.isNewLine=_whitespace.isNewLine;exports.lineBreak=_whitespace.lineBreak;exports.lineBreakG=_whitespace.lineBreakG;var version="2.7.0";exports.version=version; // The main exported interface (under `self.acorn` when in the
// browser) is a `parse` function that takes a code string and
// returns an abstract syntax tree as specified by [Mozilla parser
// API][api].
//
// [api]: https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API
function parse(input,options){return new _state.Parser(options,input).parse();} // This function tries to parse a single expression at a given
// offset in a string. Useful for parsing mixed-language formats
// that embed JavaScript expressions.
function parseExpressionAt(input,pos,options){var p=new _state.Parser(options,input,pos);p.nextToken();return p.parseExpression();} // Acorn is organized as a tokenizer and a recursive-descent parser.
// The `tokenizer` export provides an interface to the tokenizer.
function tokenizer(input,options){return new _state.Parser(options,input);}},{"./expression":1,"./identifier":2,"./location":4,"./locutil":5,"./lval":6,"./node":7,"./options":8,"./parseutil":9,"./state":10,"./statement":11,"./tokencontext":12,"./tokenize":13,"./tokentype":14,"./whitespace":16}],4:[function(_dereq_,module,exports){"use strict";var _state=_dereq_("./state");var _locutil=_dereq_("./locutil");var pp=_state.Parser.prototype; // This function is used to raise exceptions on parse errors. It
// takes an offset integer (into the current `input`) to indicate
// the location of the error, attaches the position to the end
// of the error message, and then raises a `SyntaxError` with that
// message.
pp.raise=function(pos,message){var loc=_locutil.getLineInfo(this.input,pos);message+=" ("+loc.line+":"+loc.column+")";var err=new SyntaxError(message);err.pos=pos;err.loc=loc;err.raisedAt=this.pos;throw err;};pp.curPosition=function(){if(this.options.locations){return new _locutil.Position(this.curLine,this.pos-this.lineStart);}};},{"./locutil":5,"./state":10}],5:[function(_dereq_,module,exports){"use strict";exports.__esModule=true;exports.getLineInfo=getLineInfo;function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var _whitespace=_dereq_("./whitespace"); // These are used when `options.locations` is on, for the
// `startLoc` and `endLoc` properties.
var Position=function(){function Position(line,col){_classCallCheck(this,Position);this.line=line;this.column=col;}Position.prototype.offset=function offset(n){return new Position(this.line,this.column+n);};return Position;}();exports.Position=Position;var SourceLocation=function SourceLocation(p,start,end){_classCallCheck(this,SourceLocation);this.start=start;this.end=end;if(p.sourceFile!==null)this.source=p.sourceFile;} // The `getLineInfo` function is mostly useful when the
// `locations` option is off (for performance reasons) and you
// want to find the line/column position for a given character
// offset. `input` should be the code string that the offset refers
// into.
;exports.SourceLocation=SourceLocation;function getLineInfo(input,offset){for(var line=1,cur=0;;){_whitespace.lineBreakG.lastIndex=cur;var match=_whitespace.lineBreakG.exec(input);if(match&&match.index<offset){++line;cur=match.index+match[0].length;}else {return new Position(line,offset-cur);}}}},{"./whitespace":16}],6:[function(_dereq_,module,exports){"use strict";var _tokentype=_dereq_("./tokentype");var _state=_dereq_("./state");var _util=_dereq_("./util");var pp=_state.Parser.prototype; // Convert existing expression atom to assignable pattern
// if possible.
pp.toAssignable=function(node,isBinding){if(this.options.ecmaVersion>=6&&node){switch(node.type){case "Identifier":case "ObjectPattern":case "ArrayPattern":break;case "ObjectExpression":node.type="ObjectPattern";for(var i=0;i<node.properties.length;i++){var prop=node.properties[i];if(prop.kind!=="init")this.raise(prop.key.start,"Object pattern can't contain getter or setter");this.toAssignable(prop.value,isBinding);}break;case "ArrayExpression":node.type="ArrayPattern";this.toAssignableList(node.elements,isBinding);break;case "AssignmentExpression":if(node.operator==="="){node.type="AssignmentPattern";delete node.operator; // falls through to AssignmentPattern
}else {this.raise(node.left.end,"Only '=' operator can be used for specifying default value.");break;}case "AssignmentPattern":if(node.right.type==="YieldExpression")this.raise(node.right.start,"Yield expression cannot be a default value");break;case "ParenthesizedExpression":node.expression=this.toAssignable(node.expression,isBinding);break;case "MemberExpression":if(!isBinding)break;default:this.raise(node.start,"Assigning to rvalue");}}return node;}; // Convert list of expression atoms to binding list.
pp.toAssignableList=function(exprList,isBinding){var end=exprList.length;if(end){var last=exprList[end-1];if(last&&last.type=="RestElement"){--end;}else if(last&&last.type=="SpreadElement"){last.type="RestElement";var arg=last.argument;this.toAssignable(arg,isBinding);if(arg.type!=="Identifier"&&arg.type!=="MemberExpression"&&arg.type!=="ArrayPattern")this.unexpected(arg.start);--end;}if(isBinding&&last.type==="RestElement"&&last.argument.type!=="Identifier")this.unexpected(last.argument.start);}for(var i=0;i<end;i++){var elt=exprList[i];if(elt)this.toAssignable(elt,isBinding);}return exprList;}; // Parses spread element.
pp.parseSpread=function(refDestructuringErrors){var node=this.startNode();this.next();node.argument=this.parseMaybeAssign(refDestructuringErrors);return this.finishNode(node,"SpreadElement");};pp.parseRest=function(allowNonIdent){var node=this.startNode();this.next(); // RestElement inside of a function parameter must be an identifier
if(allowNonIdent)node.argument=this.type===_tokentype.types.name?this.parseIdent():this.unexpected();else node.argument=this.type===_tokentype.types.name||this.type===_tokentype.types.bracketL?this.parseBindingAtom():this.unexpected();return this.finishNode(node,"RestElement");}; // Parses lvalue (assignable) atom.
pp.parseBindingAtom=function(){if(this.options.ecmaVersion<6)return this.parseIdent();switch(this.type){case _tokentype.types.name:return this.parseIdent();case _tokentype.types.bracketL:var node=this.startNode();this.next();node.elements=this.parseBindingList(_tokentype.types.bracketR,true,true);return this.finishNode(node,"ArrayPattern");case _tokentype.types.braceL:return this.parseObj(true);default:this.unexpected();}};pp.parseBindingList=function(close,allowEmpty,allowTrailingComma,allowNonIdent){var elts=[],first=true;while(!this.eat(close)){if(first)first=false;else this.expect(_tokentype.types.comma);if(allowEmpty&&this.type===_tokentype.types.comma){elts.push(null);}else if(allowTrailingComma&&this.afterTrailingComma(close)){break;}else if(this.type===_tokentype.types.ellipsis){var rest=this.parseRest(allowNonIdent);this.parseBindingListItem(rest);elts.push(rest);this.expect(close);break;}else {var elem=this.parseMaybeDefault(this.start,this.startLoc);this.parseBindingListItem(elem);elts.push(elem);}}return elts;};pp.parseBindingListItem=function(param){return param;}; // Parses assignment pattern around given atom if possible.
pp.parseMaybeDefault=function(startPos,startLoc,left){left=left||this.parseBindingAtom();if(this.options.ecmaVersion<6||!this.eat(_tokentype.types.eq))return left;var node=this.startNodeAt(startPos,startLoc);node.left=left;node.right=this.parseMaybeAssign();return this.finishNode(node,"AssignmentPattern");}; // Verify that a node is an lval — something that can be assigned
// to.
pp.checkLVal=function(expr,isBinding,checkClashes){switch(expr.type){case "Identifier":if(this.strict&&this.reservedWordsStrictBind.test(expr.name))this.raise(expr.start,(isBinding?"Binding ":"Assigning to ")+expr.name+" in strict mode");if(checkClashes){if(_util.has(checkClashes,expr.name))this.raise(expr.start,"Argument name clash");checkClashes[expr.name]=true;}break;case "MemberExpression":if(isBinding)this.raise(expr.start,(isBinding?"Binding":"Assigning to")+" member expression");break;case "ObjectPattern":for(var i=0;i<expr.properties.length;i++){this.checkLVal(expr.properties[i].value,isBinding,checkClashes);}break;case "ArrayPattern":for(var i=0;i<expr.elements.length;i++){var elem=expr.elements[i];if(elem)this.checkLVal(elem,isBinding,checkClashes);}break;case "AssignmentPattern":this.checkLVal(expr.left,isBinding,checkClashes);break;case "RestElement":this.checkLVal(expr.argument,isBinding,checkClashes);break;case "ParenthesizedExpression":this.checkLVal(expr.expression,isBinding,checkClashes);break;default:this.raise(expr.start,(isBinding?"Binding":"Assigning to")+" rvalue");}};},{"./state":10,"./tokentype":14,"./util":15}],7:[function(_dereq_,module,exports){"use strict";exports.__esModule=true;function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var _state=_dereq_("./state");var _locutil=_dereq_("./locutil");var Node=function Node(parser,pos,loc){_classCallCheck(this,Node);this.type="";this.start=pos;this.end=0;if(parser.options.locations)this.loc=new _locutil.SourceLocation(parser,loc);if(parser.options.directSourceFile)this.sourceFile=parser.options.directSourceFile;if(parser.options.ranges)this.range=[pos,0];} // Start an AST node, attaching a start offset.
;exports.Node=Node;var pp=_state.Parser.prototype;pp.startNode=function(){return new Node(this,this.start,this.startLoc);};pp.startNodeAt=function(pos,loc){return new Node(this,pos,loc);}; // Finish an AST node, adding `type` and `end` properties.
function finishNodeAt(node,type,pos,loc){node.type=type;node.end=pos;if(this.options.locations)node.loc.end=loc;if(this.options.ranges)node.range[1]=pos;return node;}pp.finishNode=function(node,type){return finishNodeAt.call(this,node,type,this.lastTokEnd,this.lastTokEndLoc);}; // Finish node at given position
pp.finishNodeAt=function(node,type,pos,loc){return finishNodeAt.call(this,node,type,pos,loc);};},{"./locutil":5,"./state":10}],8:[function(_dereq_,module,exports){"use strict";exports.__esModule=true;exports.getOptions=getOptions;var _util=_dereq_("./util");var _locutil=_dereq_("./locutil"); // A second optional argument can be given to further configure
// the parser process. These options are recognized:
var defaultOptions={ // `ecmaVersion` indicates the ECMAScript version to parse. Must
// be either 3, or 5, or 6. This influences support for strict
// mode, the set of reserved words, support for getters and
// setters and other features.
ecmaVersion:5, // Source type ("script" or "module") for different semantics
sourceType:"script", // `onInsertedSemicolon` can be a callback that will be called
// when a semicolon is automatically inserted. It will be passed
// th position of the comma as an offset, and if `locations` is
// enabled, it is given the location as a `{line, column}` object
// as second argument.
onInsertedSemicolon:null, // `onTrailingComma` is similar to `onInsertedSemicolon`, but for
// trailing commas.
onTrailingComma:null, // By default, reserved words are only enforced if ecmaVersion >= 5.
// Set `allowReserved` to a boolean value to explicitly turn this on
// an off. When this option has the value "never", reserved words
// and keywords can also not be used as property names.
allowReserved:null, // When enabled, a return at the top level is not considered an
// error.
allowReturnOutsideFunction:false, // When enabled, import/export statements are not constrained to
// appearing at the top of the program.
allowImportExportEverywhere:false, // When enabled, hashbang directive in the beginning of file
// is allowed and treated as a line comment.
allowHashBang:false, // When `locations` is on, `loc` properties holding objects with
// `start` and `end` properties in `{line, column}` form (with
// line being 1-based and column 0-based) will be attached to the
// nodes.
locations:false, // A function can be passed as `onToken` option, which will
// cause Acorn to call that function with object in the same
// format as tokens returned from `tokenizer().getToken()`. Note
// that you are not allowed to call the parser from the
// callback—that will corrupt its internal state.
onToken:null, // A function can be passed as `onComment` option, which will
// cause Acorn to call that function with `(block, text, start,
// end)` parameters whenever a comment is skipped. `block` is a
// boolean indicating whether this is a block (`/* */`) comment,
// `text` is the content of the comment, and `start` and `end` are
// character offsets that denote the start and end of the comment.
// When the `locations` option is on, two more parameters are
// passed, the full `{line, column}` locations of the start and
// end of the comments. Note that you are not allowed to call the
// parser from the callback—that will corrupt its internal state.
onComment:null, // Nodes have their start and end characters offsets recorded in
// `start` and `end` properties (directly on the node, rather than
// the `loc` object, which holds line/column data. To also add a
// [semi-standardized][range] `range` property holding a `[start,
// end]` array with the same numbers, set the `ranges` option to
// `true`.
//
// [range]: https://bugzilla.mozilla.org/show_bug.cgi?id=745678
ranges:false, // It is possible to parse multiple files into a single AST by
// passing the tree produced by parsing the first file as
// `program` option in subsequent parses. This will add the
// toplevel forms of the parsed file to the `Program` (top) node
// of an existing parse tree.
program:null, // When `locations` is on, you can pass this to record the source
// file in every node's `loc` object.
sourceFile:null, // This value, if given, is stored in every node, whether
// `locations` is on or off.
directSourceFile:null, // When enabled, parenthesized expressions are represented by
// (non-standard) ParenthesizedExpression nodes
preserveParens:false,plugins:{}};exports.defaultOptions=defaultOptions; // Interpret and default an options object
function getOptions(opts){var options={};for(var opt in defaultOptions){options[opt]=opts&&_util.has(opts,opt)?opts[opt]:defaultOptions[opt];}if(options.allowReserved==null)options.allowReserved=options.ecmaVersion<5;if(_util.isArray(options.onToken)){(function(){var tokens=options.onToken;options.onToken=function(token){return tokens.push(token);};})();}if(_util.isArray(options.onComment))options.onComment=pushComment(options,options.onComment);return options;}function pushComment(options,array){return function(block,text,start,end,startLoc,endLoc){var comment={type:block?'Block':'Line',value:text,start:start,end:end};if(options.locations)comment.loc=new _locutil.SourceLocation(this,startLoc,endLoc);if(options.ranges)comment.range=[start,end];array.push(comment);};}},{"./locutil":5,"./util":15}],9:[function(_dereq_,module,exports){"use strict";var _tokentype=_dereq_("./tokentype");var _state=_dereq_("./state");var _whitespace=_dereq_("./whitespace");var pp=_state.Parser.prototype; // ## Parser utilities
// Test whether a statement node is the string literal `"use strict"`.
pp.isUseStrict=function(stmt){return this.options.ecmaVersion>=5&&stmt.type==="ExpressionStatement"&&stmt.expression.type==="Literal"&&stmt.expression.raw.slice(1,-1)==="use strict";}; // Predicate that tests whether the next token is of the given
// type, and if yes, consumes it as a side effect.
pp.eat=function(type){if(this.type===type){this.next();return true;}else {return false;}}; // Tests whether parsed token is a contextual keyword.
pp.isContextual=function(name){return this.type===_tokentype.types.name&&this.value===name;}; // Consumes contextual keyword if possible.
pp.eatContextual=function(name){return this.value===name&&this.eat(_tokentype.types.name);}; // Asserts that following token is given contextual keyword.
pp.expectContextual=function(name){if(!this.eatContextual(name))this.unexpected();}; // Test whether a semicolon can be inserted at the current position.
pp.canInsertSemicolon=function(){return this.type===_tokentype.types.eof||this.type===_tokentype.types.braceR||_whitespace.lineBreak.test(this.input.slice(this.lastTokEnd,this.start));};pp.insertSemicolon=function(){if(this.canInsertSemicolon()){if(this.options.onInsertedSemicolon)this.options.onInsertedSemicolon(this.lastTokEnd,this.lastTokEndLoc);return true;}}; // Consume a semicolon, or, failing that, see if we are allowed to
// pretend that there is a semicolon at this position.
pp.semicolon=function(){if(!this.eat(_tokentype.types.semi)&&!this.insertSemicolon())this.unexpected();};pp.afterTrailingComma=function(tokType){if(this.type==tokType){if(this.options.onTrailingComma)this.options.onTrailingComma(this.lastTokStart,this.lastTokStartLoc);this.next();return true;}}; // Expect a token of a given type. If found, consume it, otherwise,
// raise an unexpected token error.
pp.expect=function(type){this.eat(type)||this.unexpected();}; // Raise an unexpected token error.
pp.unexpected=function(pos){this.raise(pos!=null?pos:this.start,"Unexpected token");};pp.checkPatternErrors=function(refDestructuringErrors,andThrow){var pos=refDestructuringErrors&&refDestructuringErrors.trailingComma;if(!andThrow)return !!pos;if(pos)this.raise(pos,"Trailing comma is not permitted in destructuring patterns");};pp.checkExpressionErrors=function(refDestructuringErrors,andThrow){var pos=refDestructuringErrors&&refDestructuringErrors.shorthandAssign;if(!andThrow)return !!pos;if(pos)this.raise(pos,"Shorthand property assignments are valid only in destructuring patterns");};},{"./state":10,"./tokentype":14,"./whitespace":16}],10:[function(_dereq_,module,exports){"use strict";exports.__esModule=true;function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var _identifier=_dereq_("./identifier");var _tokentype=_dereq_("./tokentype");var _whitespace=_dereq_("./whitespace");var _options=_dereq_("./options"); // Registered plugins
var plugins={};exports.plugins=plugins;function keywordRegexp(words){return new RegExp("^("+words.replace(/ /g,"|")+")$");}var Parser=function(){function Parser(options,input,startPos){_classCallCheck(this,Parser);this.options=options=_options.getOptions(options);this.sourceFile=options.sourceFile;this.keywords=keywordRegexp(_identifier.keywords[options.ecmaVersion>=6?6:5]);var reserved=options.allowReserved?"":_identifier.reservedWords[options.ecmaVersion]+(options.sourceType=="module"?" await":"");this.reservedWords=keywordRegexp(reserved);var reservedStrict=(reserved?reserved+" ":"")+_identifier.reservedWords.strict;this.reservedWordsStrict=keywordRegexp(reservedStrict);this.reservedWordsStrictBind=keywordRegexp(reservedStrict+" "+_identifier.reservedWords.strictBind);this.input=String(input); // Used to signal to callers of `readWord1` whether the word
// contained any escape sequences. This is needed because words with
// escape sequences must not be interpreted as keywords.
this.containsEsc=false; // Load plugins
this.loadPlugins(options.plugins); // Set up token state
// The current position of the tokenizer in the input.
if(startPos){this.pos=startPos;this.lineStart=Math.max(0,this.input.lastIndexOf("\n",startPos));this.curLine=this.input.slice(0,this.lineStart).split(_whitespace.lineBreak).length;}else {this.pos=this.lineStart=0;this.curLine=1;} // Properties of the current token:
// Its type
this.type=_tokentype.types.eof; // For tokens that include more information than their type, the value
this.value=null; // Its start and end offset
this.start=this.end=this.pos; // And, if locations are used, the {line, column} object
// corresponding to those offsets
this.startLoc=this.endLoc=this.curPosition(); // Position information for the previous token
this.lastTokEndLoc=this.lastTokStartLoc=null;this.lastTokStart=this.lastTokEnd=this.pos; // The context stack is used to superficially track syntactic
// context to predict whether a regular expression is allowed in a
// given position.
this.context=this.initialContext();this.exprAllowed=true; // Figure out if it's a module code.
this.strict=this.inModule=options.sourceType==="module"; // Used to signify the start of a potential arrow function
this.potentialArrowAt=-1; // Flags to track whether we are in a function, a generator.
this.inFunction=this.inGenerator=false; // Labels in scope.
this.labels=[]; // If enabled, skip leading hashbang line.
if(this.pos===0&&options.allowHashBang&&this.input.slice(0,2)==='#!')this.skipLineComment(2);} // DEPRECATED Kept for backwards compatibility until 3.0 in case a plugin uses them
Parser.prototype.isKeyword=function isKeyword(word){return this.keywords.test(word);};Parser.prototype.isReservedWord=function isReservedWord(word){return this.reservedWords.test(word);};Parser.prototype.extend=function extend(name,f){this[name]=f(this[name]);};Parser.prototype.loadPlugins=function loadPlugins(pluginConfigs){for(var _name in pluginConfigs){var plugin=plugins[_name];if(!plugin)throw new Error("Plugin '"+_name+"' not found");plugin(this,pluginConfigs[_name]);}};Parser.prototype.parse=function parse(){var node=this.options.program||this.startNode();this.nextToken();return this.parseTopLevel(node);};return Parser;}();exports.Parser=Parser;},{"./identifier":2,"./options":8,"./tokentype":14,"./whitespace":16}],11:[function(_dereq_,module,exports){"use strict";var _tokentype=_dereq_("./tokentype");var _state=_dereq_("./state");var _whitespace=_dereq_("./whitespace");var pp=_state.Parser.prototype; // ### Statement parsing
// Parse a program. Initializes the parser, reads any number of
// statements, and wraps them in a Program node.  Optionally takes a
// `program` argument.  If present, the statements will be appended
// to its body instead of creating a new node.
pp.parseTopLevel=function(node){var first=true;if(!node.body)node.body=[];while(this.type!==_tokentype.types.eof){var stmt=this.parseStatement(true,true);node.body.push(stmt);if(first){if(this.isUseStrict(stmt))this.setStrict(true);first=false;}}this.next();if(this.options.ecmaVersion>=6){node.sourceType=this.options.sourceType;}return this.finishNode(node,"Program");};var loopLabel={kind:"loop"},switchLabel={kind:"switch"}; // Parse a single statement.
//
// If expecting a statement and finding a slash operator, parse a
// regular expression literal. This is to handle cases like
// `if (foo) /blah/.exec(foo)`, where looking at the previous token
// does not help.
pp.parseStatement=function(declaration,topLevel){var starttype=this.type,node=this.startNode(); // Most types of statements are recognized by the keyword they
// start with. Many are trivial to parse, some require a bit of
// complexity.
switch(starttype){case _tokentype.types._break:case _tokentype.types._continue:return this.parseBreakContinueStatement(node,starttype.keyword);case _tokentype.types._debugger:return this.parseDebuggerStatement(node);case _tokentype.types._do:return this.parseDoStatement(node);case _tokentype.types._for:return this.parseForStatement(node);case _tokentype.types._function:if(!declaration&&this.options.ecmaVersion>=6)this.unexpected();return this.parseFunctionStatement(node);case _tokentype.types._class:if(!declaration)this.unexpected();return this.parseClass(node,true);case _tokentype.types._if:return this.parseIfStatement(node);case _tokentype.types._return:return this.parseReturnStatement(node);case _tokentype.types._switch:return this.parseSwitchStatement(node);case _tokentype.types._throw:return this.parseThrowStatement(node);case _tokentype.types._try:return this.parseTryStatement(node);case _tokentype.types._let:case _tokentype.types._const:if(!declaration)this.unexpected(); // NOTE: falls through to _var
case _tokentype.types._var:return this.parseVarStatement(node,starttype);case _tokentype.types._while:return this.parseWhileStatement(node);case _tokentype.types._with:return this.parseWithStatement(node);case _tokentype.types.braceL:return this.parseBlock();case _tokentype.types.semi:return this.parseEmptyStatement(node);case _tokentype.types._export:case _tokentype.types._import:if(!this.options.allowImportExportEverywhere){if(!topLevel)this.raise(this.start,"'import' and 'export' may only appear at the top level");if(!this.inModule)this.raise(this.start,"'import' and 'export' may appear only with 'sourceType: module'");}return starttype===_tokentype.types._import?this.parseImport(node):this.parseExport(node); // If the statement does not start with a statement keyword or a
// brace, it's an ExpressionStatement or LabeledStatement. We
// simply start parsing an expression, and afterwards, if the
// next token is a colon and the expression was a simple
// Identifier node, we switch to interpreting it as a label.
default:var maybeName=this.value,expr=this.parseExpression();if(starttype===_tokentype.types.name&&expr.type==="Identifier"&&this.eat(_tokentype.types.colon))return this.parseLabeledStatement(node,maybeName,expr);else return this.parseExpressionStatement(node,expr);}};pp.parseBreakContinueStatement=function(node,keyword){var isBreak=keyword=="break";this.next();if(this.eat(_tokentype.types.semi)||this.insertSemicolon())node.label=null;else if(this.type!==_tokentype.types.name)this.unexpected();else {node.label=this.parseIdent();this.semicolon();} // Verify that there is an actual destination to break or
// continue to.
for(var i=0;i<this.labels.length;++i){var lab=this.labels[i];if(node.label==null||lab.name===node.label.name){if(lab.kind!=null&&(isBreak||lab.kind==="loop"))break;if(node.label&&isBreak)break;}}if(i===this.labels.length)this.raise(node.start,"Unsyntactic "+keyword);return this.finishNode(node,isBreak?"BreakStatement":"ContinueStatement");};pp.parseDebuggerStatement=function(node){this.next();this.semicolon();return this.finishNode(node,"DebuggerStatement");};pp.parseDoStatement=function(node){this.next();this.labels.push(loopLabel);node.body=this.parseStatement(false);this.labels.pop();this.expect(_tokentype.types._while);node.test=this.parseParenExpression();if(this.options.ecmaVersion>=6)this.eat(_tokentype.types.semi);else this.semicolon();return this.finishNode(node,"DoWhileStatement");}; // Disambiguating between a `for` and a `for`/`in` or `for`/`of`
// loop is non-trivial. Basically, we have to parse the init `var`
// statement or expression, disallowing the `in` operator (see
// the second parameter to `parseExpression`), and then check
// whether the next token is `in` or `of`. When there is no init
// part (semicolon immediately after the opening parenthesis), it
// is a regular `for` loop.
pp.parseForStatement=function(node){this.next();this.labels.push(loopLabel);this.expect(_tokentype.types.parenL);if(this.type===_tokentype.types.semi)return this.parseFor(node,null);if(this.type===_tokentype.types._var||this.type===_tokentype.types._let||this.type===_tokentype.types._const){var _init=this.startNode(),varKind=this.type;this.next();this.parseVar(_init,true,varKind);this.finishNode(_init,"VariableDeclaration");if((this.type===_tokentype.types._in||this.options.ecmaVersion>=6&&this.isContextual("of"))&&_init.declarations.length===1&&!(varKind!==_tokentype.types._var&&_init.declarations[0].init))return this.parseForIn(node,_init);return this.parseFor(node,_init);}var refDestructuringErrors={shorthandAssign:0,trailingComma:0};var init=this.parseExpression(true,refDestructuringErrors);if(this.type===_tokentype.types._in||this.options.ecmaVersion>=6&&this.isContextual("of")){this.checkPatternErrors(refDestructuringErrors,true);this.toAssignable(init);this.checkLVal(init);return this.parseForIn(node,init);}else {this.checkExpressionErrors(refDestructuringErrors,true);}return this.parseFor(node,init);};pp.parseFunctionStatement=function(node){this.next();return this.parseFunction(node,true);};pp.parseIfStatement=function(node){this.next();node.test=this.parseParenExpression();node.consequent=this.parseStatement(false);node.alternate=this.eat(_tokentype.types._else)?this.parseStatement(false):null;return this.finishNode(node,"IfStatement");};pp.parseReturnStatement=function(node){if(!this.inFunction&&!this.options.allowReturnOutsideFunction)this.raise(this.start,"'return' outside of function");this.next(); // In `return` (and `break`/`continue`), the keywords with
// optional arguments, we eagerly look for a semicolon or the
// possibility to insert one.
if(this.eat(_tokentype.types.semi)||this.insertSemicolon())node.argument=null;else {node.argument=this.parseExpression();this.semicolon();}return this.finishNode(node,"ReturnStatement");};pp.parseSwitchStatement=function(node){this.next();node.discriminant=this.parseParenExpression();node.cases=[];this.expect(_tokentype.types.braceL);this.labels.push(switchLabel); // Statements under must be grouped (by label) in SwitchCase
// nodes. `cur` is used to keep the node that we are currently
// adding statements to.
for(var cur,sawDefault=false;this.type!=_tokentype.types.braceR;){if(this.type===_tokentype.types._case||this.type===_tokentype.types._default){var isCase=this.type===_tokentype.types._case;if(cur)this.finishNode(cur,"SwitchCase");node.cases.push(cur=this.startNode());cur.consequent=[];this.next();if(isCase){cur.test=this.parseExpression();}else {if(sawDefault)this.raise(this.lastTokStart,"Multiple default clauses");sawDefault=true;cur.test=null;}this.expect(_tokentype.types.colon);}else {if(!cur)this.unexpected();cur.consequent.push(this.parseStatement(true));}}if(cur)this.finishNode(cur,"SwitchCase");this.next(); // Closing brace
this.labels.pop();return this.finishNode(node,"SwitchStatement");};pp.parseThrowStatement=function(node){this.next();if(_whitespace.lineBreak.test(this.input.slice(this.lastTokEnd,this.start)))this.raise(this.lastTokEnd,"Illegal newline after throw");node.argument=this.parseExpression();this.semicolon();return this.finishNode(node,"ThrowStatement");}; // Reused empty array added for node fields that are always empty.
var empty=[];pp.parseTryStatement=function(node){this.next();node.block=this.parseBlock();node.handler=null;if(this.type===_tokentype.types._catch){var clause=this.startNode();this.next();this.expect(_tokentype.types.parenL);clause.param=this.parseBindingAtom();this.checkLVal(clause.param,true);this.expect(_tokentype.types.parenR);clause.body=this.parseBlock();node.handler=this.finishNode(clause,"CatchClause");}node.finalizer=this.eat(_tokentype.types._finally)?this.parseBlock():null;if(!node.handler&&!node.finalizer)this.raise(node.start,"Missing catch or finally clause");return this.finishNode(node,"TryStatement");};pp.parseVarStatement=function(node,kind){this.next();this.parseVar(node,false,kind);this.semicolon();return this.finishNode(node,"VariableDeclaration");};pp.parseWhileStatement=function(node){this.next();node.test=this.parseParenExpression();this.labels.push(loopLabel);node.body=this.parseStatement(false);this.labels.pop();return this.finishNode(node,"WhileStatement");};pp.parseWithStatement=function(node){if(this.strict)this.raise(this.start,"'with' in strict mode");this.next();node.object=this.parseParenExpression();node.body=this.parseStatement(false);return this.finishNode(node,"WithStatement");};pp.parseEmptyStatement=function(node){this.next();return this.finishNode(node,"EmptyStatement");};pp.parseLabeledStatement=function(node,maybeName,expr){for(var i=0;i<this.labels.length;++i){if(this.labels[i].name===maybeName)this.raise(expr.start,"Label '"+maybeName+"' is already declared");}var kind=this.type.isLoop?"loop":this.type===_tokentype.types._switch?"switch":null;for(var i=this.labels.length-1;i>=0;i--){var label=this.labels[i];if(label.statementStart==node.start){label.statementStart=this.start;label.kind=kind;}else break;}this.labels.push({name:maybeName,kind:kind,statementStart:this.start});node.body=this.parseStatement(true);this.labels.pop();node.label=expr;return this.finishNode(node,"LabeledStatement");};pp.parseExpressionStatement=function(node,expr){node.expression=expr;this.semicolon();return this.finishNode(node,"ExpressionStatement");}; // Parse a semicolon-enclosed block of statements, handling `"use
// strict"` declarations when `allowStrict` is true (used for
// function bodies).
pp.parseBlock=function(allowStrict){var node=this.startNode(),first=true,oldStrict=undefined;node.body=[];this.expect(_tokentype.types.braceL);while(!this.eat(_tokentype.types.braceR)){var stmt=this.parseStatement(true);node.body.push(stmt);if(first&&allowStrict&&this.isUseStrict(stmt)){oldStrict=this.strict;this.setStrict(this.strict=true);}first=false;}if(oldStrict===false)this.setStrict(false);return this.finishNode(node,"BlockStatement");}; // Parse a regular `for` loop. The disambiguation code in
// `parseStatement` will already have parsed the init statement or
// expression.
pp.parseFor=function(node,init){node.init=init;this.expect(_tokentype.types.semi);node.test=this.type===_tokentype.types.semi?null:this.parseExpression();this.expect(_tokentype.types.semi);node.update=this.type===_tokentype.types.parenR?null:this.parseExpression();this.expect(_tokentype.types.parenR);node.body=this.parseStatement(false);this.labels.pop();return this.finishNode(node,"ForStatement");}; // Parse a `for`/`in` and `for`/`of` loop, which are almost
// same from parser's perspective.
pp.parseForIn=function(node,init){var type=this.type===_tokentype.types._in?"ForInStatement":"ForOfStatement";this.next();node.left=init;node.right=this.parseExpression();this.expect(_tokentype.types.parenR);node.body=this.parseStatement(false);this.labels.pop();return this.finishNode(node,type);}; // Parse a list of variable declarations.
pp.parseVar=function(node,isFor,kind){node.declarations=[];node.kind=kind.keyword;for(;;){var decl=this.startNode();this.parseVarId(decl);if(this.eat(_tokentype.types.eq)){decl.init=this.parseMaybeAssign(isFor);}else if(kind===_tokentype.types._const&&!(this.type===_tokentype.types._in||this.options.ecmaVersion>=6&&this.isContextual("of"))){this.unexpected();}else if(decl.id.type!="Identifier"&&!(isFor&&(this.type===_tokentype.types._in||this.isContextual("of")))){this.raise(this.lastTokEnd,"Complex binding patterns require an initialization value");}else {decl.init=null;}node.declarations.push(this.finishNode(decl,"VariableDeclarator"));if(!this.eat(_tokentype.types.comma))break;}return node;};pp.parseVarId=function(decl){decl.id=this.parseBindingAtom();this.checkLVal(decl.id,true);}; // Parse a function declaration or literal (depending on the
// `isStatement` parameter).
pp.parseFunction=function(node,isStatement,allowExpressionBody){this.initFunction(node);if(this.options.ecmaVersion>=6)node.generator=this.eat(_tokentype.types.star);if(isStatement||this.type===_tokentype.types.name)node.id=this.parseIdent();this.parseFunctionParams(node);this.parseFunctionBody(node,allowExpressionBody);return this.finishNode(node,isStatement?"FunctionDeclaration":"FunctionExpression");};pp.parseFunctionParams=function(node){this.expect(_tokentype.types.parenL);node.params=this.parseBindingList(_tokentype.types.parenR,false,false,true);}; // Parse a class declaration or literal (depending on the
// `isStatement` parameter).
pp.parseClass=function(node,isStatement){this.next();this.parseClassId(node,isStatement);this.parseClassSuper(node);var classBody=this.startNode();var hadConstructor=false;classBody.body=[];this.expect(_tokentype.types.braceL);while(!this.eat(_tokentype.types.braceR)){if(this.eat(_tokentype.types.semi))continue;var method=this.startNode();var isGenerator=this.eat(_tokentype.types.star);var isMaybeStatic=this.type===_tokentype.types.name&&this.value==="static";this.parsePropertyName(method);method["static"]=isMaybeStatic&&this.type!==_tokentype.types.parenL;if(method["static"]){if(isGenerator)this.unexpected();isGenerator=this.eat(_tokentype.types.star);this.parsePropertyName(method);}method.kind="method";var isGetSet=false;if(!method.computed){var key=method.key;if(!isGenerator&&key.type==="Identifier"&&this.type!==_tokentype.types.parenL&&(key.name==="get"||key.name==="set")){isGetSet=true;method.kind=key.name;key=this.parsePropertyName(method);}if(!method["static"]&&(key.type==="Identifier"&&key.name==="constructor"||key.type==="Literal"&&key.value==="constructor")){if(hadConstructor)this.raise(key.start,"Duplicate constructor in the same class");if(isGetSet)this.raise(key.start,"Constructor can't have get/set modifier");if(isGenerator)this.raise(key.start,"Constructor can't be a generator");method.kind="constructor";hadConstructor=true;}}this.parseClassMethod(classBody,method,isGenerator);if(isGetSet){var paramCount=method.kind==="get"?0:1;if(method.value.params.length!==paramCount){var start=method.value.start;if(method.kind==="get")this.raise(start,"getter should have no params");else this.raise(start,"setter should have exactly one param");}if(method.kind==="set"&&method.value.params[0].type==="RestElement")this.raise(method.value.params[0].start,"Setter cannot use rest params");}}node.body=this.finishNode(classBody,"ClassBody");return this.finishNode(node,isStatement?"ClassDeclaration":"ClassExpression");};pp.parseClassMethod=function(classBody,method,isGenerator){method.value=this.parseMethod(isGenerator);classBody.body.push(this.finishNode(method,"MethodDefinition"));};pp.parseClassId=function(node,isStatement){node.id=this.type===_tokentype.types.name?this.parseIdent():isStatement?this.unexpected():null;};pp.parseClassSuper=function(node){node.superClass=this.eat(_tokentype.types._extends)?this.parseExprSubscripts():null;}; // Parses module export declaration.
pp.parseExport=function(node){this.next(); // export * from '...'
if(this.eat(_tokentype.types.star)){this.expectContextual("from");node.source=this.type===_tokentype.types.string?this.parseExprAtom():this.unexpected();this.semicolon();return this.finishNode(node,"ExportAllDeclaration");}if(this.eat(_tokentype.types._default)){ // export default ...
var expr=this.parseMaybeAssign();var needsSemi=true;if(expr.type=="FunctionExpression"||expr.type=="ClassExpression"){needsSemi=false;if(expr.id){expr.type=expr.type=="FunctionExpression"?"FunctionDeclaration":"ClassDeclaration";}}node.declaration=expr;if(needsSemi)this.semicolon();return this.finishNode(node,"ExportDefaultDeclaration");} // export var|const|let|function|class ...
if(this.shouldParseExportStatement()){node.declaration=this.parseStatement(true);node.specifiers=[];node.source=null;}else { // export { x, y as z } [from '...']
node.declaration=null;node.specifiers=this.parseExportSpecifiers();if(this.eatContextual("from")){node.source=this.type===_tokentype.types.string?this.parseExprAtom():this.unexpected();}else { // check for keywords used as local names
for(var i=0;i<node.specifiers.length;i++){if(this.keywords.test(node.specifiers[i].local.name)||this.reservedWords.test(node.specifiers[i].local.name)){this.unexpected(node.specifiers[i].local.start);}}node.source=null;}this.semicolon();}return this.finishNode(node,"ExportNamedDeclaration");};pp.shouldParseExportStatement=function(){return this.type.keyword;}; // Parses a comma-separated list of module exports.
pp.parseExportSpecifiers=function(){var nodes=[],first=true; // export { x, y as z } [from '...']
this.expect(_tokentype.types.braceL);while(!this.eat(_tokentype.types.braceR)){if(!first){this.expect(_tokentype.types.comma);if(this.afterTrailingComma(_tokentype.types.braceR))break;}else first=false;var node=this.startNode();node.local=this.parseIdent(this.type===_tokentype.types._default);node.exported=this.eatContextual("as")?this.parseIdent(true):node.local;nodes.push(this.finishNode(node,"ExportSpecifier"));}return nodes;}; // Parses import declaration.
pp.parseImport=function(node){this.next(); // import '...'
if(this.type===_tokentype.types.string){node.specifiers=empty;node.source=this.parseExprAtom();}else {node.specifiers=this.parseImportSpecifiers();this.expectContextual("from");node.source=this.type===_tokentype.types.string?this.parseExprAtom():this.unexpected();}this.semicolon();return this.finishNode(node,"ImportDeclaration");}; // Parses a comma-separated list of module imports.
pp.parseImportSpecifiers=function(){var nodes=[],first=true;if(this.type===_tokentype.types.name){ // import defaultObj, { x, y as z } from '...'
var node=this.startNode();node.local=this.parseIdent();this.checkLVal(node.local,true);nodes.push(this.finishNode(node,"ImportDefaultSpecifier"));if(!this.eat(_tokentype.types.comma))return nodes;}if(this.type===_tokentype.types.star){var node=this.startNode();this.next();this.expectContextual("as");node.local=this.parseIdent();this.checkLVal(node.local,true);nodes.push(this.finishNode(node,"ImportNamespaceSpecifier"));return nodes;}this.expect(_tokentype.types.braceL);while(!this.eat(_tokentype.types.braceR)){if(!first){this.expect(_tokentype.types.comma);if(this.afterTrailingComma(_tokentype.types.braceR))break;}else first=false;var node=this.startNode();node.imported=this.parseIdent(true);if(this.eatContextual("as")){node.local=this.parseIdent();}else {node.local=node.imported;if(this.isKeyword(node.local.name))this.unexpected(node.local.start);if(this.reservedWordsStrict.test(node.local.name))this.raise(node.local.start,"The keyword '"+node.local.name+"' is reserved");}this.checkLVal(node.local,true);nodes.push(this.finishNode(node,"ImportSpecifier"));}return nodes;};},{"./state":10,"./tokentype":14,"./whitespace":16}],12:[function(_dereq_,module,exports){ // The algorithm used to determine whether a regexp can appear at a
// given point in the program is loosely based on sweet.js' approach.
// See https://github.com/mozilla/sweet.js/wiki/design
"use strict";exports.__esModule=true;function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var _state=_dereq_("./state");var _tokentype=_dereq_("./tokentype");var _whitespace=_dereq_("./whitespace");var TokContext=function TokContext(token,isExpr,preserveSpace,override){_classCallCheck(this,TokContext);this.token=token;this.isExpr=!!isExpr;this.preserveSpace=!!preserveSpace;this.override=override;};exports.TokContext=TokContext;var types={b_stat:new TokContext("{",false),b_expr:new TokContext("{",true),b_tmpl:new TokContext("${",true),p_stat:new TokContext("(",false),p_expr:new TokContext("(",true),q_tmpl:new TokContext("`",true,true,function(p){return p.readTmplToken();}),f_expr:new TokContext("function",true)};exports.types=types;var pp=_state.Parser.prototype;pp.initialContext=function(){return [types.b_stat];};pp.braceIsBlock=function(prevType){if(prevType===_tokentype.types.colon){var _parent=this.curContext();if(_parent===types.b_stat||_parent===types.b_expr)return !_parent.isExpr;}if(prevType===_tokentype.types._return)return _whitespace.lineBreak.test(this.input.slice(this.lastTokEnd,this.start));if(prevType===_tokentype.types._else||prevType===_tokentype.types.semi||prevType===_tokentype.types.eof||prevType===_tokentype.types.parenR)return true;if(prevType==_tokentype.types.braceL)return this.curContext()===types.b_stat;return !this.exprAllowed;};pp.updateContext=function(prevType){var update=undefined,type=this.type;if(type.keyword&&prevType==_tokentype.types.dot)this.exprAllowed=false;else if(update=type.updateContext)update.call(this,prevType);else this.exprAllowed=type.beforeExpr;}; // Token-specific context update code
_tokentype.types.parenR.updateContext=_tokentype.types.braceR.updateContext=function(){if(this.context.length==1){this.exprAllowed=true;return;}var out=this.context.pop();if(out===types.b_stat&&this.curContext()===types.f_expr){this.context.pop();this.exprAllowed=false;}else if(out===types.b_tmpl){this.exprAllowed=true;}else {this.exprAllowed=!out.isExpr;}};_tokentype.types.braceL.updateContext=function(prevType){this.context.push(this.braceIsBlock(prevType)?types.b_stat:types.b_expr);this.exprAllowed=true;};_tokentype.types.dollarBraceL.updateContext=function(){this.context.push(types.b_tmpl);this.exprAllowed=true;};_tokentype.types.parenL.updateContext=function(prevType){var statementParens=prevType===_tokentype.types._if||prevType===_tokentype.types._for||prevType===_tokentype.types._with||prevType===_tokentype.types._while;this.context.push(statementParens?types.p_stat:types.p_expr);this.exprAllowed=true;};_tokentype.types.incDec.updateContext=function(){ // tokExprAllowed stays unchanged
};_tokentype.types._function.updateContext=function(){if(this.curContext()!==types.b_stat)this.context.push(types.f_expr);this.exprAllowed=false;};_tokentype.types.backQuote.updateContext=function(){if(this.curContext()===types.q_tmpl)this.context.pop();else this.context.push(types.q_tmpl);this.exprAllowed=false;};},{"./state":10,"./tokentype":14,"./whitespace":16}],13:[function(_dereq_,module,exports){"use strict";exports.__esModule=true;function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var _identifier=_dereq_("./identifier");var _tokentype=_dereq_("./tokentype");var _state=_dereq_("./state");var _locutil=_dereq_("./locutil");var _whitespace=_dereq_("./whitespace"); // Object type used to represent tokens. Note that normally, tokens
// simply exist as properties on the parser object. This is only
// used for the onToken callback and the external tokenizer.
var Token=function Token(p){_classCallCheck(this,Token);this.type=p.type;this.value=p.value;this.start=p.start;this.end=p.end;if(p.options.locations)this.loc=new _locutil.SourceLocation(p,p.startLoc,p.endLoc);if(p.options.ranges)this.range=[p.start,p.end];} // ## Tokenizer
;exports.Token=Token;var pp=_state.Parser.prototype; // Are we running under Rhino?
var isRhino=(typeof Packages==="undefined"?"undefined":_typeof(Packages))=="object"&&Object.prototype.toString.call(Packages)=="[object JavaPackage]"; // Move to the next token
pp.next=function(){if(this.options.onToken)this.options.onToken(new Token(this));this.lastTokEnd=this.end;this.lastTokStart=this.start;this.lastTokEndLoc=this.endLoc;this.lastTokStartLoc=this.startLoc;this.nextToken();};pp.getToken=function(){this.next();return new Token(this);}; // If we're in an ES6 environment, make parsers iterable
if(typeof Symbol!=="undefined")pp[Symbol.iterator]=function(){var self=this;return {next:function next(){var token=self.getToken();return {done:token.type===_tokentype.types.eof,value:token};}};}; // Toggle strict mode. Re-reads the next number or string to please
// pedantic tests (`"use strict"; 010;` should fail).
pp.setStrict=function(strict){this.strict=strict;if(this.type!==_tokentype.types.num&&this.type!==_tokentype.types.string)return;this.pos=this.start;if(this.options.locations){while(this.pos<this.lineStart){this.lineStart=this.input.lastIndexOf("\n",this.lineStart-2)+1;--this.curLine;}}this.nextToken();};pp.curContext=function(){return this.context[this.context.length-1];}; // Read a single token, updating the parser object's token-related
// properties.
pp.nextToken=function(){var curContext=this.curContext();if(!curContext||!curContext.preserveSpace)this.skipSpace();this.start=this.pos;if(this.options.locations)this.startLoc=this.curPosition();if(this.pos>=this.input.length)return this.finishToken(_tokentype.types.eof);if(curContext.override)return curContext.override(this);else this.readToken(this.fullCharCodeAtPos());};pp.readToken=function(code){ // Identifier or keyword. '\uXXXX' sequences are allowed in
// identifiers, so '\' also dispatches to that.
if(_identifier.isIdentifierStart(code,this.options.ecmaVersion>=6)||code===92 /* '\' */)return this.readWord();return this.getTokenFromCode(code);};pp.fullCharCodeAtPos=function(){var code=this.input.charCodeAt(this.pos);if(code<=0xd7ff||code>=0xe000)return code;var next=this.input.charCodeAt(this.pos+1);return (code<<10)+next-0x35fdc00;};pp.skipBlockComment=function(){var startLoc=this.options.onComment&&this.curPosition();var start=this.pos,end=this.input.indexOf("*/",this.pos+=2);if(end===-1)this.raise(this.pos-2,"Unterminated comment");this.pos=end+2;if(this.options.locations){_whitespace.lineBreakG.lastIndex=start;var match=undefined;while((match=_whitespace.lineBreakG.exec(this.input))&&match.index<this.pos){++this.curLine;this.lineStart=match.index+match[0].length;}}if(this.options.onComment)this.options.onComment(true,this.input.slice(start+2,end),start,this.pos,startLoc,this.curPosition());};pp.skipLineComment=function(startSkip){var start=this.pos;var startLoc=this.options.onComment&&this.curPosition();var ch=this.input.charCodeAt(this.pos+=startSkip);while(this.pos<this.input.length&&ch!==10&&ch!==13&&ch!==8232&&ch!==8233){++this.pos;ch=this.input.charCodeAt(this.pos);}if(this.options.onComment)this.options.onComment(false,this.input.slice(start+startSkip,this.pos),start,this.pos,startLoc,this.curPosition());}; // Called at the start of the parse and after every token. Skips
// whitespace and comments, and.
pp.skipSpace=function(){loop: while(this.pos<this.input.length){var ch=this.input.charCodeAt(this.pos);switch(ch){case 32:case 160: // ' '
++this.pos;break;case 13:if(this.input.charCodeAt(this.pos+1)===10){++this.pos;}case 10:case 8232:case 8233:++this.pos;if(this.options.locations){++this.curLine;this.lineStart=this.pos;}break;case 47: // '/'
switch(this.input.charCodeAt(this.pos+1)){case 42: // '*'
this.skipBlockComment();break;case 47:this.skipLineComment(2);break;default:break loop;}break;default:if(ch>8&&ch<14||ch>=5760&&_whitespace.nonASCIIwhitespace.test(String.fromCharCode(ch))){++this.pos;}else {break loop;}}}}; // Called at the end of every token. Sets `end`, `val`, and
// maintains `context` and `exprAllowed`, and skips the space after
// the token, so that the next one's `start` will point at the
// right position.
pp.finishToken=function(type,val){this.end=this.pos;if(this.options.locations)this.endLoc=this.curPosition();var prevType=this.type;this.type=type;this.value=val;this.updateContext(prevType);}; // ### Token reading
// This is the function that is called to fetch the next token. It
// is somewhat obscure, because it works in character codes rather
// than characters, and because operator parsing has been inlined
// into it.
//
// All in the name of speed.
//
pp.readToken_dot=function(){var next=this.input.charCodeAt(this.pos+1);if(next>=48&&next<=57)return this.readNumber(true);var next2=this.input.charCodeAt(this.pos+2);if(this.options.ecmaVersion>=6&&next===46&&next2===46){ // 46 = dot '.'
this.pos+=3;return this.finishToken(_tokentype.types.ellipsis);}else {++this.pos;return this.finishToken(_tokentype.types.dot);}};pp.readToken_slash=function(){ // '/'
var next=this.input.charCodeAt(this.pos+1);if(this.exprAllowed){++this.pos;return this.readRegexp();}if(next===61)return this.finishOp(_tokentype.types.assign,2);return this.finishOp(_tokentype.types.slash,1);};pp.readToken_mult_modulo=function(code){ // '%*'
var next=this.input.charCodeAt(this.pos+1);if(next===61)return this.finishOp(_tokentype.types.assign,2);return this.finishOp(code===42?_tokentype.types.star:_tokentype.types.modulo,1);};pp.readToken_pipe_amp=function(code){ // '|&'
var next=this.input.charCodeAt(this.pos+1);if(next===code)return this.finishOp(code===124?_tokentype.types.logicalOR:_tokentype.types.logicalAND,2);if(next===61)return this.finishOp(_tokentype.types.assign,2);return this.finishOp(code===124?_tokentype.types.bitwiseOR:_tokentype.types.bitwiseAND,1);};pp.readToken_caret=function(){ // '^'
var next=this.input.charCodeAt(this.pos+1);if(next===61)return this.finishOp(_tokentype.types.assign,2);return this.finishOp(_tokentype.types.bitwiseXOR,1);};pp.readToken_plus_min=function(code){ // '+-'
var next=this.input.charCodeAt(this.pos+1);if(next===code){if(next==45&&this.input.charCodeAt(this.pos+2)==62&&_whitespace.lineBreak.test(this.input.slice(this.lastTokEnd,this.pos))){ // A `-->` line comment
this.skipLineComment(3);this.skipSpace();return this.nextToken();}return this.finishOp(_tokentype.types.incDec,2);}if(next===61)return this.finishOp(_tokentype.types.assign,2);return this.finishOp(_tokentype.types.plusMin,1);};pp.readToken_lt_gt=function(code){ // '<>'
var next=this.input.charCodeAt(this.pos+1);var size=1;if(next===code){size=code===62&&this.input.charCodeAt(this.pos+2)===62?3:2;if(this.input.charCodeAt(this.pos+size)===61)return this.finishOp(_tokentype.types.assign,size+1);return this.finishOp(_tokentype.types.bitShift,size);}if(next==33&&code==60&&this.input.charCodeAt(this.pos+2)==45&&this.input.charCodeAt(this.pos+3)==45){if(this.inModule)this.unexpected(); // `<!--`, an XML-style comment that should be interpreted as a line comment
this.skipLineComment(4);this.skipSpace();return this.nextToken();}if(next===61)size=this.input.charCodeAt(this.pos+2)===61?3:2;return this.finishOp(_tokentype.types.relational,size);};pp.readToken_eq_excl=function(code){ // '=!'
var next=this.input.charCodeAt(this.pos+1);if(next===61)return this.finishOp(_tokentype.types.equality,this.input.charCodeAt(this.pos+2)===61?3:2);if(code===61&&next===62&&this.options.ecmaVersion>=6){ // '=>'
this.pos+=2;return this.finishToken(_tokentype.types.arrow);}return this.finishOp(code===61?_tokentype.types.eq:_tokentype.types.prefix,1);};pp.getTokenFromCode=function(code){switch(code){ // The interpretation of a dot depends on whether it is followed
// by a digit or another two dots.
case 46: // '.'
return this.readToken_dot(); // Punctuation tokens.
case 40:++this.pos;return this.finishToken(_tokentype.types.parenL);case 41:++this.pos;return this.finishToken(_tokentype.types.parenR);case 59:++this.pos;return this.finishToken(_tokentype.types.semi);case 44:++this.pos;return this.finishToken(_tokentype.types.comma);case 91:++this.pos;return this.finishToken(_tokentype.types.bracketL);case 93:++this.pos;return this.finishToken(_tokentype.types.bracketR);case 123:++this.pos;return this.finishToken(_tokentype.types.braceL);case 125:++this.pos;return this.finishToken(_tokentype.types.braceR);case 58:++this.pos;return this.finishToken(_tokentype.types.colon);case 63:++this.pos;return this.finishToken(_tokentype.types.question);case 96: // '`'
if(this.options.ecmaVersion<6)break;++this.pos;return this.finishToken(_tokentype.types.backQuote);case 48: // '0'
var next=this.input.charCodeAt(this.pos+1);if(next===120||next===88)return this.readRadixNumber(16); // '0x', '0X' - hex number
if(this.options.ecmaVersion>=6){if(next===111||next===79)return this.readRadixNumber(8); // '0o', '0O' - octal number
if(next===98||next===66)return this.readRadixNumber(2); // '0b', '0B' - binary number
} // Anything else beginning with a digit is an integer, octal
// number, or float.
case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57: // 1-9
return this.readNumber(false); // Quotes produce strings.
case 34:case 39: // '"', "'"
return this.readString(code); // Operators are parsed inline in tiny state machines. '=' (61) is
// often referred to. `finishOp` simply skips the amount of
// characters it is given as second argument, and returns a token
// of the type given by its first argument.
case 47: // '/'
return this.readToken_slash();case 37:case 42: // '%*'
return this.readToken_mult_modulo(code);case 124:case 38: // '|&'
return this.readToken_pipe_amp(code);case 94: // '^'
return this.readToken_caret();case 43:case 45: // '+-'
return this.readToken_plus_min(code);case 60:case 62: // '<>'
return this.readToken_lt_gt(code);case 61:case 33: // '=!'
return this.readToken_eq_excl(code);case 126: // '~'
return this.finishOp(_tokentype.types.prefix,1);}this.raise(this.pos,"Unexpected character '"+codePointToString(code)+"'");};pp.finishOp=function(type,size){var str=this.input.slice(this.pos,this.pos+size);this.pos+=size;return this.finishToken(type,str);}; // Parse a regular expression. Some context-awareness is necessary,
// since a '/' inside a '[]' set does not end the expression.
function tryCreateRegexp(src,flags,throwErrorAt,parser){try{return new RegExp(src,flags);}catch(e){if(throwErrorAt!==undefined){if(e instanceof SyntaxError)parser.raise(throwErrorAt,"Error parsing regular expression: "+e.message);throw e;}}}var regexpUnicodeSupport=!!tryCreateRegexp("￿","u");pp.readRegexp=function(){var _this=this;var escaped=undefined,inClass=undefined,start=this.pos;for(;;){if(this.pos>=this.input.length)this.raise(start,"Unterminated regular expression");var ch=this.input.charAt(this.pos);if(_whitespace.lineBreak.test(ch))this.raise(start,"Unterminated regular expression");if(!escaped){if(ch==="[")inClass=true;else if(ch==="]"&&inClass)inClass=false;else if(ch==="/"&&!inClass)break;escaped=ch==="\\";}else escaped=false;++this.pos;}var content=this.input.slice(start,this.pos);++this.pos; // Need to use `readWord1` because '\uXXXX' sequences are allowed
// here (don't ask).
var mods=this.readWord1();var tmp=content;if(mods){var validFlags=/^[gim]*$/;if(this.options.ecmaVersion>=6)validFlags=/^[gimuy]*$/;if(!validFlags.test(mods))this.raise(start,"Invalid regular expression flag");if(mods.indexOf('u')>=0&&!regexpUnicodeSupport){ // Replace each astral symbol and every Unicode escape sequence that
// possibly represents an astral symbol or a paired surrogate with a
// single ASCII symbol to avoid throwing on regular expressions that
// are only valid in combination with the `/u` flag.
// Note: replacing with the ASCII symbol `x` might cause false
// negatives in unlikely scenarios. For example, `[\u{61}-b]` is a
// perfectly valid pattern that is equivalent to `[a-b]`, but it would
// be replaced by `[x-b]` which throws an error.
tmp=tmp.replace(/\\u\{([0-9a-fA-F]+)\}/g,function(_match,code,offset){code=Number("0x"+code);if(code>0x10FFFF)_this.raise(start+offset+3,"Code point out of bounds");return "x";});tmp=tmp.replace(/\\u([a-fA-F0-9]{4})|[\uD800-\uDBFF][\uDC00-\uDFFF]/g,"x");}} // Detect invalid regular expressions.
var value=null; // Rhino's regular expression parser is flaky and throws uncatchable exceptions,
// so don't do detection if we are running under Rhino
if(!isRhino){tryCreateRegexp(tmp,undefined,start,this); // Get a regular expression object for this pattern-flag pair, or `null` in
// case the current environment doesn't support the flags it uses.
value=tryCreateRegexp(content,mods);}return this.finishToken(_tokentype.types.regexp,{pattern:content,flags:mods,value:value});}; // Read an integer in the given radix. Return null if zero digits
// were read, the integer value otherwise. When `len` is given, this
// will return `null` unless the integer has exactly `len` digits.
pp.readInt=function(radix,len){var start=this.pos,total=0;for(var i=0,e=len==null?Infinity:len;i<e;++i){var code=this.input.charCodeAt(this.pos),val=undefined;if(code>=97)val=code-97+10; // a
else if(code>=65)val=code-65+10; // A
else if(code>=48&&code<=57)val=code-48; // 0-9
else val=Infinity;if(val>=radix)break;++this.pos;total=total*radix+val;}if(this.pos===start||len!=null&&this.pos-start!==len)return null;return total;};pp.readRadixNumber=function(radix){this.pos+=2; // 0x
var val=this.readInt(radix);if(val==null)this.raise(this.start+2,"Expected number in radix "+radix);if(_identifier.isIdentifierStart(this.fullCharCodeAtPos()))this.raise(this.pos,"Identifier directly after number");return this.finishToken(_tokentype.types.num,val);}; // Read an integer, octal integer, or floating-point number.
pp.readNumber=function(startsWithDot){var start=this.pos,isFloat=false,octal=this.input.charCodeAt(this.pos)===48;if(!startsWithDot&&this.readInt(10)===null)this.raise(start,"Invalid number");var next=this.input.charCodeAt(this.pos);if(next===46){ // '.'
++this.pos;this.readInt(10);isFloat=true;next=this.input.charCodeAt(this.pos);}if(next===69||next===101){ // 'eE'
next=this.input.charCodeAt(++this.pos);if(next===43||next===45)++this.pos; // '+-'
if(this.readInt(10)===null)this.raise(start,"Invalid number");isFloat=true;}if(_identifier.isIdentifierStart(this.fullCharCodeAtPos()))this.raise(this.pos,"Identifier directly after number");var str=this.input.slice(start,this.pos),val=undefined;if(isFloat)val=parseFloat(str);else if(!octal||str.length===1)val=parseInt(str,10);else if(/[89]/.test(str)||this.strict)this.raise(start,"Invalid number");else val=parseInt(str,8);return this.finishToken(_tokentype.types.num,val);}; // Read a string value, interpreting backslash-escapes.
pp.readCodePoint=function(){var ch=this.input.charCodeAt(this.pos),code=undefined;if(ch===123){if(this.options.ecmaVersion<6)this.unexpected();var codePos=++this.pos;code=this.readHexChar(this.input.indexOf('}',this.pos)-this.pos);++this.pos;if(code>0x10FFFF)this.raise(codePos,"Code point out of bounds");}else {code=this.readHexChar(4);}return code;};function codePointToString(code){ // UTF-16 Decoding
if(code<=0xFFFF)return String.fromCharCode(code);code-=0x10000;return String.fromCharCode((code>>10)+0xD800,(code&1023)+0xDC00);}pp.readString=function(quote){var out="",chunkStart=++this.pos;for(;;){if(this.pos>=this.input.length)this.raise(this.start,"Unterminated string constant");var ch=this.input.charCodeAt(this.pos);if(ch===quote)break;if(ch===92){ // '\'
out+=this.input.slice(chunkStart,this.pos);out+=this.readEscapedChar(false);chunkStart=this.pos;}else {if(_whitespace.isNewLine(ch))this.raise(this.start,"Unterminated string constant");++this.pos;}}out+=this.input.slice(chunkStart,this.pos++);return this.finishToken(_tokentype.types.string,out);}; // Reads template string tokens.
pp.readTmplToken=function(){var out="",chunkStart=this.pos;for(;;){if(this.pos>=this.input.length)this.raise(this.start,"Unterminated template");var ch=this.input.charCodeAt(this.pos);if(ch===96||ch===36&&this.input.charCodeAt(this.pos+1)===123){ // '`', '${'
if(this.pos===this.start&&this.type===_tokentype.types.template){if(ch===36){this.pos+=2;return this.finishToken(_tokentype.types.dollarBraceL);}else {++this.pos;return this.finishToken(_tokentype.types.backQuote);}}out+=this.input.slice(chunkStart,this.pos);return this.finishToken(_tokentype.types.template,out);}if(ch===92){ // '\'
out+=this.input.slice(chunkStart,this.pos);out+=this.readEscapedChar(true);chunkStart=this.pos;}else if(_whitespace.isNewLine(ch)){out+=this.input.slice(chunkStart,this.pos);++this.pos;switch(ch){case 13:if(this.input.charCodeAt(this.pos)===10)++this.pos;case 10:out+="\n";break;default:out+=String.fromCharCode(ch);break;}if(this.options.locations){++this.curLine;this.lineStart=this.pos;}chunkStart=this.pos;}else {++this.pos;}}}; // Used to read escaped characters
pp.readEscapedChar=function(inTemplate){var ch=this.input.charCodeAt(++this.pos);++this.pos;switch(ch){case 110:return "\n"; // 'n' -> '\n'
case 114:return "\r"; // 'r' -> '\r'
case 120:return String.fromCharCode(this.readHexChar(2)); // 'x'
case 117:return codePointToString(this.readCodePoint()); // 'u'
case 116:return "\t"; // 't' -> '\t'
case 98:return "\b"; // 'b' -> '\b'
case 118:return "\u000b"; // 'v' -> '\u000b'
case 102:return "\f"; // 'f' -> '\f'
case 13:if(this.input.charCodeAt(this.pos)===10)++this.pos; // '\r\n'
case 10: // ' \n'
if(this.options.locations){this.lineStart=this.pos;++this.curLine;}return "";default:if(ch>=48&&ch<=55){var octalStr=this.input.substr(this.pos-1,3).match(/^[0-7]+/)[0];var octal=parseInt(octalStr,8);if(octal>255){octalStr=octalStr.slice(0,-1);octal=parseInt(octalStr,8);}if(octalStr!=="0"&&(this.strict||inTemplate)){this.raise(this.pos-2,"Octal literal in strict mode");}this.pos+=octalStr.length-1;return String.fromCharCode(octal);}return String.fromCharCode(ch);}}; // Used to read character escape sequences ('\x', '\u', '\U').
pp.readHexChar=function(len){var codePos=this.pos;var n=this.readInt(16,len);if(n===null)this.raise(codePos,"Bad character escape sequence");return n;}; // Read an identifier, and return it as a string. Sets `this.containsEsc`
// to whether the word contained a '\u' escape.
//
// Incrementally adds only escaped chars, adding other chunks as-is
// as a micro-optimization.
pp.readWord1=function(){this.containsEsc=false;var word="",first=true,chunkStart=this.pos;var astral=this.options.ecmaVersion>=6;while(this.pos<this.input.length){var ch=this.fullCharCodeAtPos();if(_identifier.isIdentifierChar(ch,astral)){this.pos+=ch<=0xffff?1:2;}else if(ch===92){ // "\"
this.containsEsc=true;word+=this.input.slice(chunkStart,this.pos);var escStart=this.pos;if(this.input.charCodeAt(++this.pos)!=117) // "u"
this.raise(this.pos,"Expecting Unicode escape sequence \\uXXXX");++this.pos;var esc=this.readCodePoint();if(!(first?_identifier.isIdentifierStart:_identifier.isIdentifierChar)(esc,astral))this.raise(escStart,"Invalid Unicode escape");word+=codePointToString(esc);chunkStart=this.pos;}else {break;}first=false;}return word+this.input.slice(chunkStart,this.pos);}; // Read an identifier or keyword token. Will check for reserved
// words when necessary.
pp.readWord=function(){var word=this.readWord1();var type=_tokentype.types.name;if((this.options.ecmaVersion>=6||!this.containsEsc)&&this.keywords.test(word))type=_tokentype.keywords[word];return this.finishToken(type,word);};},{"./identifier":2,"./locutil":5,"./state":10,"./tokentype":14,"./whitespace":16}],14:[function(_dereq_,module,exports){ // ## Token types
// The assignment of fine-grained, information-carrying type objects
// allows the tokenizer to store the information it has about a
// token in a way that is very cheap for the parser to look up.
// All token type variables start with an underscore, to make them
// easy to recognize.
// The `beforeExpr` property is used to disambiguate between regular
// expressions and divisions. It is set on all token types that can
// be followed by an expression (thus, a slash after them would be a
// regular expression).
//
// The `startsExpr` property is used to check if the token ends a
// `yield` expression. It is set on all token types that either can
// directly start an expression (like a quotation mark) or can
// continue an expression (like the body of a string).
//
// `isLoop` marks a keyword as starting a loop, which is important
// to know when parsing a label, in order to allow or disallow
// continue jumps to that label.
"use strict";exports.__esModule=true;function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var TokenType=function TokenType(label){var conf=arguments.length<=1||arguments[1]===undefined?{}:arguments[1];_classCallCheck(this,TokenType);this.label=label;this.keyword=conf.keyword;this.beforeExpr=!!conf.beforeExpr;this.startsExpr=!!conf.startsExpr;this.isLoop=!!conf.isLoop;this.isAssign=!!conf.isAssign;this.prefix=!!conf.prefix;this.postfix=!!conf.postfix;this.binop=conf.binop||null;this.updateContext=null;};exports.TokenType=TokenType;function binop(name,prec){return new TokenType(name,{beforeExpr:true,binop:prec});}var beforeExpr={beforeExpr:true},startsExpr={startsExpr:true};var types={num:new TokenType("num",startsExpr),regexp:new TokenType("regexp",startsExpr),string:new TokenType("string",startsExpr),name:new TokenType("name",startsExpr),eof:new TokenType("eof"), // Punctuation token types.
bracketL:new TokenType("[",{beforeExpr:true,startsExpr:true}),bracketR:new TokenType("]"),braceL:new TokenType("{",{beforeExpr:true,startsExpr:true}),braceR:new TokenType("}"),parenL:new TokenType("(",{beforeExpr:true,startsExpr:true}),parenR:new TokenType(")"),comma:new TokenType(",",beforeExpr),semi:new TokenType(";",beforeExpr),colon:new TokenType(":",beforeExpr),dot:new TokenType("."),question:new TokenType("?",beforeExpr),arrow:new TokenType("=>",beforeExpr),template:new TokenType("template"),ellipsis:new TokenType("...",beforeExpr),backQuote:new TokenType("`",startsExpr),dollarBraceL:new TokenType("${",{beforeExpr:true,startsExpr:true}), // Operators. These carry several kinds of properties to help the
// parser use them properly (the presence of these properties is
// what categorizes them as operators).
//
// `binop`, when present, specifies that this operator is a binary
// operator, and will refer to its precedence.
//
// `prefix` and `postfix` mark the operator as a prefix or postfix
// unary operator.
//
// `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
// binary operators with a very low precedence, that should result
// in AssignmentExpression nodes.
eq:new TokenType("=",{beforeExpr:true,isAssign:true}),assign:new TokenType("_=",{beforeExpr:true,isAssign:true}),incDec:new TokenType("++/--",{prefix:true,postfix:true,startsExpr:true}),prefix:new TokenType("prefix",{beforeExpr:true,prefix:true,startsExpr:true}),logicalOR:binop("||",1),logicalAND:binop("&&",2),bitwiseOR:binop("|",3),bitwiseXOR:binop("^",4),bitwiseAND:binop("&",5),equality:binop("==/!=",6),relational:binop("</>",7),bitShift:binop("<</>>",8),plusMin:new TokenType("+/-",{beforeExpr:true,binop:9,prefix:true,startsExpr:true}),modulo:binop("%",10),star:binop("*",10),slash:binop("/",10)};exports.types=types; // Map keyword names to token types.
var keywords={};exports.keywords=keywords; // Succinct definitions of keyword token types
function kw(name){var options=arguments.length<=1||arguments[1]===undefined?{}:arguments[1];options.keyword=name;keywords[name]=types["_"+name]=new TokenType(name,options);}kw("break");kw("case",beforeExpr);kw("catch");kw("continue");kw("debugger");kw("default",beforeExpr);kw("do",{isLoop:true,beforeExpr:true});kw("else",beforeExpr);kw("finally");kw("for",{isLoop:true});kw("function",startsExpr);kw("if");kw("return",beforeExpr);kw("switch");kw("throw",beforeExpr);kw("try");kw("var");kw("let");kw("const");kw("while",{isLoop:true});kw("with");kw("new",{beforeExpr:true,startsExpr:true});kw("this",startsExpr);kw("super",startsExpr);kw("class");kw("extends",beforeExpr);kw("export");kw("import");kw("yield",{beforeExpr:true,startsExpr:true});kw("null",startsExpr);kw("true",startsExpr);kw("false",startsExpr);kw("in",{beforeExpr:true,binop:7});kw("instanceof",{beforeExpr:true,binop:7});kw("typeof",{beforeExpr:true,prefix:true,startsExpr:true});kw("void",{beforeExpr:true,prefix:true,startsExpr:true});kw("delete",{beforeExpr:true,prefix:true,startsExpr:true});},{}],15:[function(_dereq_,module,exports){"use strict";exports.__esModule=true;exports.isArray=isArray;exports.has=has;function isArray(obj){return Object.prototype.toString.call(obj)==="[object Array]";} // Checks if an object has a property.
function has(obj,propName){return Object.prototype.hasOwnProperty.call(obj,propName);}},{}],16:[function(_dereq_,module,exports){ // Matches a whole line break (where CRLF is considered a single
// line break). Used to count lines.
"use strict";exports.__esModule=true;exports.isNewLine=isNewLine;var lineBreak=/\r\n?|\n|\u2028|\u2029/;exports.lineBreak=lineBreak;var lineBreakG=new RegExp(lineBreak.source,"g");exports.lineBreakG=lineBreakG;function isNewLine(code){return code===10||code===13||code===0x2028||code==0x2029;}var nonASCIIwhitespace=/[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/;exports.nonASCIIwhitespace=nonASCIIwhitespace;},{}]},{},[3])(3);});}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{}],3:[function(require,module,exports){(function(global){(function(f){if((typeof exports==="undefined"?"undefined":_typeof(exports))==="object"&&typeof module!=="undefined"){module.exports=f();}else if(typeof define==="function"&&define.amd){define([],f);}else {var g;if(typeof window!=="undefined"){g=window;}else if(typeof global!=="undefined"){g=global;}else if(typeof self!=="undefined"){g=self;}else {g=this;}(g.acorn||(g.acorn={})).walk=f();}})(function(){var define,module,exports;return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f;}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e);},l,l.exports,e,t,n,r);}return n[o].exports;}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++){s(r[o]);}return s;}({1:[function(_dereq_,module,exports){ // AST walker module for Mozilla Parser API compatible trees
// A simple walk is one where you simply specify callbacks to be
// called on specific nodes. The last two arguments are optional. A
// simple use would be
//
//     walk.simple(myTree, {
//         Expression: function(node) { ... }
//     });
//
// to do something with all expressions. All Parser API node types
// can be used to identify node types, as well as Expression,
// Statement, and ScopeBody, which denote categories of nodes.
//
// The base argument can be used to pass a custom (recursive)
// walker, and state can be used to give this walked an initial
// state.
"use strict";exports.__esModule=true;exports.simple=simple;exports.ancestor=ancestor;exports.recursive=recursive;exports.findNodeAt=findNodeAt;exports.findNodeAround=findNodeAround;exports.findNodeAfter=findNodeAfter;exports.findNodeBefore=findNodeBefore;exports.make=make;function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function simple(node,visitors,base,state,override){if(!base)base=exports.base;(function c(node,st,override){var type=override||node.type,found=visitors[type];base[type](node,st,c);if(found)found(node,st);})(node,state,override);} // An ancestor walk builds up an array of ancestor nodes (including
// the current node) and passes them to the callback as the state parameter.
function ancestor(node,visitors,base,state){if(!base)base=exports.base;if(!state)state=[];(function c(node,st,override){var type=override||node.type,found=visitors[type];if(node!=st[st.length-1]){st=st.slice();st.push(node);}base[type](node,st,c);if(found)found(node,st);})(node,state);} // A recursive walk is one where your functions override the default
// walkers. They can modify and replace the state parameter that's
// threaded through the walk, and can opt how and whether to walk
// their child nodes (by calling their third argument on these
// nodes).
function recursive(node,state,funcs,base,override){var visitor=funcs?exports.make(funcs,base):base;(function c(node,st,override){visitor[override||node.type](node,st,c);})(node,state,override);}function makeTest(test){if(typeof test=="string")return function(type){return type==test;};else if(!test)return function(){return true;};else return test;}var Found=function Found(node,state){_classCallCheck(this,Found);this.node=node;this.state=state;} // Find a node with a given start, end, and type (all are optional,
// null can be used as wildcard). Returns a {node, state} object, or
// undefined when it doesn't find a matching node.
;function findNodeAt(node,start,end,test,base,state){test=makeTest(test);if(!base)base=exports.base;try{;(function c(node,st,override){var type=override||node.type;if((start==null||node.start<=start)&&(end==null||node.end>=end))base[type](node,st,c);if((start==null||node.start==start)&&(end==null||node.end==end)&&test(type,node))throw new Found(node,st);})(node,state);}catch(e){if(e instanceof Found)return e;throw e;}} // Find the innermost node of a given type that contains the given
// position. Interface similar to findNodeAt.
function findNodeAround(node,pos,test,base,state){test=makeTest(test);if(!base)base=exports.base;try{;(function c(node,st,override){var type=override||node.type;if(node.start>pos||node.end<pos)return;base[type](node,st,c);if(test(type,node))throw new Found(node,st);})(node,state);}catch(e){if(e instanceof Found)return e;throw e;}} // Find the outermost matching node after a given position.
function findNodeAfter(node,pos,test,base,state){test=makeTest(test);if(!base)base=exports.base;try{;(function c(node,st,override){if(node.end<pos)return;var type=override||node.type;if(node.start>=pos&&test(type,node))throw new Found(node,st);base[type](node,st,c);})(node,state);}catch(e){if(e instanceof Found)return e;throw e;}} // Find the outermost matching node before a given position.
function findNodeBefore(node,pos,test,base,state){test=makeTest(test);if(!base)base=exports.base;var max=undefined;(function c(node,st,override){if(node.start>pos)return;var type=override||node.type;if(node.end<=pos&&(!max||max.node.end<node.end)&&test(type,node))max=new Found(node,st);base[type](node,st,c);})(node,state);return max;} // Used to create a custom walker. Will fill in all missing node
// type properties with the defaults.
function make(funcs,base){if(!base)base=exports.base;var visitor={};for(var type in base){visitor[type]=base[type];}for(var type in funcs){visitor[type]=funcs[type];}return visitor;}function skipThrough(node,st,c){c(node,st);}function ignore(_node,_st,_c){} // Node walkers.
var base={};exports.base=base;base.Program=base.BlockStatement=function(node,st,c){for(var i=0;i<node.body.length;++i){c(node.body[i],st,"Statement");}};base.Statement=skipThrough;base.EmptyStatement=ignore;base.ExpressionStatement=base.ParenthesizedExpression=function(node,st,c){return c(node.expression,st,"Expression");};base.IfStatement=function(node,st,c){c(node.test,st,"Expression");c(node.consequent,st,"Statement");if(node.alternate)c(node.alternate,st,"Statement");};base.LabeledStatement=function(node,st,c){return c(node.body,st,"Statement");};base.BreakStatement=base.ContinueStatement=ignore;base.WithStatement=function(node,st,c){c(node.object,st,"Expression");c(node.body,st,"Statement");};base.SwitchStatement=function(node,st,c){c(node.discriminant,st,"Expression");for(var i=0;i<node.cases.length;++i){var cs=node.cases[i];if(cs.test)c(cs.test,st,"Expression");for(var j=0;j<cs.consequent.length;++j){c(cs.consequent[j],st,"Statement");}}};base.ReturnStatement=base.YieldExpression=function(node,st,c){if(node.argument)c(node.argument,st,"Expression");};base.ThrowStatement=base.SpreadElement=function(node,st,c){return c(node.argument,st,"Expression");};base.TryStatement=function(node,st,c){c(node.block,st,"Statement");if(node.handler){c(node.handler.param,st,"Pattern");c(node.handler.body,st,"ScopeBody");}if(node.finalizer)c(node.finalizer,st,"Statement");};base.WhileStatement=base.DoWhileStatement=function(node,st,c){c(node.test,st,"Expression");c(node.body,st,"Statement");};base.ForStatement=function(node,st,c){if(node.init)c(node.init,st,"ForInit");if(node.test)c(node.test,st,"Expression");if(node.update)c(node.update,st,"Expression");c(node.body,st,"Statement");};base.ForInStatement=base.ForOfStatement=function(node,st,c){c(node.left,st,"ForInit");c(node.right,st,"Expression");c(node.body,st,"Statement");};base.ForInit=function(node,st,c){if(node.type=="VariableDeclaration")c(node,st);else c(node,st,"Expression");};base.DebuggerStatement=ignore;base.FunctionDeclaration=function(node,st,c){return c(node,st,"Function");};base.VariableDeclaration=function(node,st,c){for(var i=0;i<node.declarations.length;++i){c(node.declarations[i],st);}};base.VariableDeclarator=function(node,st,c){c(node.id,st,"Pattern");if(node.init)c(node.init,st,"Expression");};base.Function=function(node,st,c){if(node.id)c(node.id,st,"Pattern");for(var i=0;i<node.params.length;i++){c(node.params[i],st,"Pattern");}c(node.body,st,node.expression?"ScopeExpression":"ScopeBody");}; // FIXME drop these node types in next major version
// (They are awkward, and in ES6 every block can be a scope.)
base.ScopeBody=function(node,st,c){return c(node,st,"Statement");};base.ScopeExpression=function(node,st,c){return c(node,st,"Expression");};base.Pattern=function(node,st,c){if(node.type=="Identifier")c(node,st,"VariablePattern");else if(node.type=="MemberExpression")c(node,st,"MemberPattern");else c(node,st);};base.VariablePattern=ignore;base.MemberPattern=skipThrough;base.RestElement=function(node,st,c){return c(node.argument,st,"Pattern");};base.ArrayPattern=function(node,st,c){for(var i=0;i<node.elements.length;++i){var elt=node.elements[i];if(elt)c(elt,st,"Pattern");}};base.ObjectPattern=function(node,st,c){for(var i=0;i<node.properties.length;++i){c(node.properties[i].value,st,"Pattern");}};base.Expression=skipThrough;base.ThisExpression=base.Super=base.MetaProperty=ignore;base.ArrayExpression=function(node,st,c){for(var i=0;i<node.elements.length;++i){var elt=node.elements[i];if(elt)c(elt,st,"Expression");}};base.ObjectExpression=function(node,st,c){for(var i=0;i<node.properties.length;++i){c(node.properties[i],st);}};base.FunctionExpression=base.ArrowFunctionExpression=base.FunctionDeclaration;base.SequenceExpression=base.TemplateLiteral=function(node,st,c){for(var i=0;i<node.expressions.length;++i){c(node.expressions[i],st,"Expression");}};base.UnaryExpression=base.UpdateExpression=function(node,st,c){c(node.argument,st,"Expression");};base.BinaryExpression=base.LogicalExpression=function(node,st,c){c(node.left,st,"Expression");c(node.right,st,"Expression");};base.AssignmentExpression=base.AssignmentPattern=function(node,st,c){c(node.left,st,"Pattern");c(node.right,st,"Expression");};base.ConditionalExpression=function(node,st,c){c(node.test,st,"Expression");c(node.consequent,st,"Expression");c(node.alternate,st,"Expression");};base.NewExpression=base.CallExpression=function(node,st,c){c(node.callee,st,"Expression");if(node.arguments)for(var i=0;i<node.arguments.length;++i){c(node.arguments[i],st,"Expression");}};base.MemberExpression=function(node,st,c){c(node.object,st,"Expression");if(node.computed)c(node.property,st,"Expression");};base.ExportNamedDeclaration=base.ExportDefaultDeclaration=function(node,st,c){if(node.declaration)c(node.declaration,st,node.type=="ExportNamedDeclaration"||node.declaration.id?"Statement":"Expression");if(node.source)c(node.source,st,"Expression");};base.ExportAllDeclaration=function(node,st,c){c(node.source,st,"Expression");};base.ImportDeclaration=function(node,st,c){for(var i=0;i<node.specifiers.length;i++){c(node.specifiers[i],st);}c(node.source,st,"Expression");};base.ImportSpecifier=base.ImportDefaultSpecifier=base.ImportNamespaceSpecifier=base.Identifier=base.Literal=ignore;base.TaggedTemplateExpression=function(node,st,c){c(node.tag,st,"Expression");c(node.quasi,st);};base.ClassDeclaration=base.ClassExpression=function(node,st,c){return c(node,st,"Class");};base.Class=function(node,st,c){if(node.id)c(node.id,st,"Pattern");if(node.superClass)c(node.superClass,st,"Expression");for(var i=0;i<node.body.body.length;i++){c(node.body.body[i],st);}};base.MethodDefinition=base.Property=function(node,st,c){if(node.computed)c(node.key,st,"Expression");c(node.value,st,"Expression");};base.ComprehensionExpression=function(node,st,c){for(var i=0;i<node.blocks.length;i++){c(node.blocks[i].right,st,"Expression");}c(node.body,st,"Expression");};},{}]},{},[1])(1);});}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{}],4:[function(require,module,exports){ // This file is autogenerated via the `commonjs` Grunt task. You can require() this file in a CommonJS environment.
require('../../js/transition.js');require('../../js/alert.js');require('../../js/button.js');require('../../js/carousel.js');require('../../js/collapse.js');require('../../js/dropdown.js');require('../../js/modal.js');require('../../js/tooltip.js');require('../../js/popover.js');require('../../js/scrollspy.js');require('../../js/tab.js');require('../../js/affix.js');},{"../../js/affix.js":5,"../../js/alert.js":6,"../../js/button.js":7,"../../js/carousel.js":8,"../../js/collapse.js":9,"../../js/dropdown.js":10,"../../js/modal.js":11,"../../js/popover.js":12,"../../js/scrollspy.js":13,"../../js/tab.js":14,"../../js/tooltip.js":15,"../../js/transition.js":16}],5:[function(require,module,exports){ /* ========================================================================
 * Bootstrap: affix.js v3.3.6
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */+function($){'use strict'; // AFFIX CLASS DEFINITION
// ======================
var Affix=function Affix(element,options){this.options=$.extend({},Affix.DEFAULTS,options);this.$target=$(this.options.target).on('scroll.bs.affix.data-api',$.proxy(this.checkPosition,this)).on('click.bs.affix.data-api',$.proxy(this.checkPositionWithEventLoop,this));this.$element=$(element);this.affixed=null;this.unpin=null;this.pinnedOffset=null;this.checkPosition();};Affix.VERSION='3.3.6';Affix.RESET='affix affix-top affix-bottom';Affix.DEFAULTS={offset:0,target:window};Affix.prototype.getState=function(scrollHeight,height,offsetTop,offsetBottom){var scrollTop=this.$target.scrollTop();var position=this.$element.offset();var targetHeight=this.$target.height();if(offsetTop!=null&&this.affixed=='top')return scrollTop<offsetTop?'top':false;if(this.affixed=='bottom'){if(offsetTop!=null)return scrollTop+this.unpin<=position.top?false:'bottom';return scrollTop+targetHeight<=scrollHeight-offsetBottom?false:'bottom';}var initializing=this.affixed==null;var colliderTop=initializing?scrollTop:position.top;var colliderHeight=initializing?targetHeight:height;if(offsetTop!=null&&scrollTop<=offsetTop)return 'top';if(offsetBottom!=null&&colliderTop+colliderHeight>=scrollHeight-offsetBottom)return 'bottom';return false;};Affix.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(Affix.RESET).addClass('affix');var scrollTop=this.$target.scrollTop();var position=this.$element.offset();return this.pinnedOffset=position.top-scrollTop;};Affix.prototype.checkPositionWithEventLoop=function(){setTimeout($.proxy(this.checkPosition,this),1);};Affix.prototype.checkPosition=function(){if(!this.$element.is(':visible'))return;var height=this.$element.height();var offset=this.options.offset;var offsetTop=offset.top;var offsetBottom=offset.bottom;var scrollHeight=Math.max($(document).height(),$(document.body).height());if((typeof offset==="undefined"?"undefined":_typeof(offset))!='object')offsetBottom=offsetTop=offset;if(typeof offsetTop=='function')offsetTop=offset.top(this.$element);if(typeof offsetBottom=='function')offsetBottom=offset.bottom(this.$element);var affix=this.getState(scrollHeight,height,offsetTop,offsetBottom);if(this.affixed!=affix){if(this.unpin!=null)this.$element.css('top','');var affixType='affix'+(affix?'-'+affix:'');var e=$.Event(affixType+'.bs.affix');this.$element.trigger(e);if(e.isDefaultPrevented())return;this.affixed=affix;this.unpin=affix=='bottom'?this.getPinnedOffset():null;this.$element.removeClass(Affix.RESET).addClass(affixType).trigger(affixType.replace('affix','affixed')+'.bs.affix');}if(affix=='bottom'){this.$element.offset({top:scrollHeight-height-offsetBottom});}}; // AFFIX PLUGIN DEFINITION
// =======================
function Plugin(option){return this.each(function(){var $this=$(this);var data=$this.data('bs.affix');var options=(typeof option==="undefined"?"undefined":_typeof(option))=='object'&&option;if(!data)$this.data('bs.affix',data=new Affix(this,options));if(typeof option=='string')data[option]();});}var old=$.fn.affix;$.fn.affix=Plugin;$.fn.affix.Constructor=Affix; // AFFIX NO CONFLICT
// =================
$.fn.affix.noConflict=function(){$.fn.affix=old;return this;}; // AFFIX DATA-API
// ==============
$(window).on('load',function(){$('[data-spy="affix"]').each(function(){var $spy=$(this);var data=$spy.data();data.offset=data.offset||{};if(data.offsetBottom!=null)data.offset.bottom=data.offsetBottom;if(data.offsetTop!=null)data.offset.top=data.offsetTop;Plugin.call($spy,data);});});}(jQuery);},{}],6:[function(require,module,exports){ /* ========================================================================
 * Bootstrap: alert.js v3.3.6
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */+function($){'use strict'; // ALERT CLASS DEFINITION
// ======================
var dismiss='[data-dismiss="alert"]';var Alert=function Alert(el){$(el).on('click',dismiss,this.close);};Alert.VERSION='3.3.6';Alert.TRANSITION_DURATION=150;Alert.prototype.close=function(e){var $this=$(this);var selector=$this.attr('data-target');if(!selector){selector=$this.attr('href');selector=selector&&selector.replace(/.*(?=#[^\s]*$)/,''); // strip for ie7
}var $parent=$(selector);if(e)e.preventDefault();if(!$parent.length){$parent=$this.closest('.alert');}$parent.trigger(e=$.Event('close.bs.alert'));if(e.isDefaultPrevented())return;$parent.removeClass('in');function removeElement(){ // detach from parent, fire event then clean up data
$parent.detach().trigger('closed.bs.alert').remove();}$.support.transition&&$parent.hasClass('fade')?$parent.one('bsTransitionEnd',removeElement).emulateTransitionEnd(Alert.TRANSITION_DURATION):removeElement();}; // ALERT PLUGIN DEFINITION
// =======================
function Plugin(option){return this.each(function(){var $this=$(this);var data=$this.data('bs.alert');if(!data)$this.data('bs.alert',data=new Alert(this));if(typeof option=='string')data[option].call($this);});}var old=$.fn.alert;$.fn.alert=Plugin;$.fn.alert.Constructor=Alert; // ALERT NO CONFLICT
// =================
$.fn.alert.noConflict=function(){$.fn.alert=old;return this;}; // ALERT DATA-API
// ==============
$(document).on('click.bs.alert.data-api',dismiss,Alert.prototype.close);}(jQuery);},{}],7:[function(require,module,exports){ /* ========================================================================
 * Bootstrap: button.js v3.3.6
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */+function($){'use strict'; // BUTTON PUBLIC CLASS DEFINITION
// ==============================
var Button=function Button(element,options){this.$element=$(element);this.options=$.extend({},Button.DEFAULTS,options);this.isLoading=false;};Button.VERSION='3.3.6';Button.DEFAULTS={loadingText:'loading...'};Button.prototype.setState=function(state){var d='disabled';var $el=this.$element;var val=$el.is('input')?'val':'html';var data=$el.data();state+='Text';if(data.resetText==null)$el.data('resetText',$el[val]()); // push to event loop to allow forms to submit
setTimeout($.proxy(function(){$el[val](data[state]==null?this.options[state]:data[state]);if(state=='loadingText'){this.isLoading=true;$el.addClass(d).attr(d,d);}else if(this.isLoading){this.isLoading=false;$el.removeClass(d).removeAttr(d);}},this),0);};Button.prototype.toggle=function(){var changed=true;var $parent=this.$element.closest('[data-toggle="buttons"]');if($parent.length){var $input=this.$element.find('input');if($input.prop('type')=='radio'){if($input.prop('checked'))changed=false;$parent.find('.active').removeClass('active');this.$element.addClass('active');}else if($input.prop('type')=='checkbox'){if($input.prop('checked')!==this.$element.hasClass('active'))changed=false;this.$element.toggleClass('active');}$input.prop('checked',this.$element.hasClass('active'));if(changed)$input.trigger('change');}else {this.$element.attr('aria-pressed',!this.$element.hasClass('active'));this.$element.toggleClass('active');}}; // BUTTON PLUGIN DEFINITION
// ========================
function Plugin(option){return this.each(function(){var $this=$(this);var data=$this.data('bs.button');var options=(typeof option==="undefined"?"undefined":_typeof(option))=='object'&&option;if(!data)$this.data('bs.button',data=new Button(this,options));if(option=='toggle')data.toggle();else if(option)data.setState(option);});}var old=$.fn.button;$.fn.button=Plugin;$.fn.button.Constructor=Button; // BUTTON NO CONFLICT
// ==================
$.fn.button.noConflict=function(){$.fn.button=old;return this;}; // BUTTON DATA-API
// ===============
$(document).on('click.bs.button.data-api','[data-toggle^="button"]',function(e){var $btn=$(e.target);if(!$btn.hasClass('btn'))$btn=$btn.closest('.btn');Plugin.call($btn,'toggle');if(!($(e.target).is('input[type="radio"]')||$(e.target).is('input[type="checkbox"]')))e.preventDefault();}).on('focus.bs.button.data-api blur.bs.button.data-api','[data-toggle^="button"]',function(e){$(e.target).closest('.btn').toggleClass('focus',/^focus(in)?$/.test(e.type));});}(jQuery);},{}],8:[function(require,module,exports){ /* ========================================================================
 * Bootstrap: carousel.js v3.3.6
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */+function($){'use strict'; // CAROUSEL CLASS DEFINITION
// =========================
var Carousel=function Carousel(element,options){this.$element=$(element);this.$indicators=this.$element.find('.carousel-indicators');this.options=options;this.paused=null;this.sliding=null;this.interval=null;this.$active=null;this.$items=null;this.options.keyboard&&this.$element.on('keydown.bs.carousel',$.proxy(this.keydown,this));this.options.pause=='hover'&&!('ontouchstart' in document.documentElement)&&this.$element.on('mouseenter.bs.carousel',$.proxy(this.pause,this)).on('mouseleave.bs.carousel',$.proxy(this.cycle,this));};Carousel.VERSION='3.3.6';Carousel.TRANSITION_DURATION=600;Carousel.DEFAULTS={interval:5000,pause:'hover',wrap:true,keyboard:true};Carousel.prototype.keydown=function(e){if(/input|textarea/i.test(e.target.tagName))return;switch(e.which){case 37:this.prev();break;case 39:this.next();break;default:return;}e.preventDefault();};Carousel.prototype.cycle=function(e){e||(this.paused=false);this.interval&&clearInterval(this.interval);this.options.interval&&!this.paused&&(this.interval=setInterval($.proxy(this.next,this),this.options.interval));return this;};Carousel.prototype.getItemIndex=function(item){this.$items=item.parent().children('.item');return this.$items.index(item||this.$active);};Carousel.prototype.getItemForDirection=function(direction,active){var activeIndex=this.getItemIndex(active);var willWrap=direction=='prev'&&activeIndex===0||direction=='next'&&activeIndex==this.$items.length-1;if(willWrap&&!this.options.wrap)return active;var delta=direction=='prev'?-1:1;var itemIndex=(activeIndex+delta)%this.$items.length;return this.$items.eq(itemIndex);};Carousel.prototype.to=function(pos){var that=this;var activeIndex=this.getItemIndex(this.$active=this.$element.find('.item.active'));if(pos>this.$items.length-1||pos<0)return;if(this.sliding)return this.$element.one('slid.bs.carousel',function(){that.to(pos);}); // yes, "slid"
if(activeIndex==pos)return this.pause().cycle();return this.slide(pos>activeIndex?'next':'prev',this.$items.eq(pos));};Carousel.prototype.pause=function(e){e||(this.paused=true);if(this.$element.find('.next, .prev').length&&$.support.transition){this.$element.trigger($.support.transition.end);this.cycle(true);}this.interval=clearInterval(this.interval);return this;};Carousel.prototype.next=function(){if(this.sliding)return;return this.slide('next');};Carousel.prototype.prev=function(){if(this.sliding)return;return this.slide('prev');};Carousel.prototype.slide=function(type,next){var $active=this.$element.find('.item.active');var $next=next||this.getItemForDirection(type,$active);var isCycling=this.interval;var direction=type=='next'?'left':'right';var that=this;if($next.hasClass('active'))return this.sliding=false;var relatedTarget=$next[0];var slideEvent=$.Event('slide.bs.carousel',{relatedTarget:relatedTarget,direction:direction});this.$element.trigger(slideEvent);if(slideEvent.isDefaultPrevented())return;this.sliding=true;isCycling&&this.pause();if(this.$indicators.length){this.$indicators.find('.active').removeClass('active');var $nextIndicator=$(this.$indicators.children()[this.getItemIndex($next)]);$nextIndicator&&$nextIndicator.addClass('active');}var slidEvent=$.Event('slid.bs.carousel',{relatedTarget:relatedTarget,direction:direction}); // yes, "slid"
if($.support.transition&&this.$element.hasClass('slide')){$next.addClass(type);$next[0].offsetWidth; // force reflow
$active.addClass(direction);$next.addClass(direction);$active.one('bsTransitionEnd',function(){$next.removeClass([type,direction].join(' ')).addClass('active');$active.removeClass(['active',direction].join(' '));that.sliding=false;setTimeout(function(){that.$element.trigger(slidEvent);},0);}).emulateTransitionEnd(Carousel.TRANSITION_DURATION);}else {$active.removeClass('active');$next.addClass('active');this.sliding=false;this.$element.trigger(slidEvent);}isCycling&&this.cycle();return this;}; // CAROUSEL PLUGIN DEFINITION
// ==========================
function Plugin(option){return this.each(function(){var $this=$(this);var data=$this.data('bs.carousel');var options=$.extend({},Carousel.DEFAULTS,$this.data(),(typeof option==="undefined"?"undefined":_typeof(option))=='object'&&option);var action=typeof option=='string'?option:options.slide;if(!data)$this.data('bs.carousel',data=new Carousel(this,options));if(typeof option=='number')data.to(option);else if(action)data[action]();else if(options.interval)data.pause().cycle();});}var old=$.fn.carousel;$.fn.carousel=Plugin;$.fn.carousel.Constructor=Carousel; // CAROUSEL NO CONFLICT
// ====================
$.fn.carousel.noConflict=function(){$.fn.carousel=old;return this;}; // CAROUSEL DATA-API
// =================
var clickHandler=function clickHandler(e){var href;var $this=$(this);var $target=$($this.attr('data-target')||(href=$this.attr('href'))&&href.replace(/.*(?=#[^\s]+$)/,'')); // strip for ie7
if(!$target.hasClass('carousel'))return;var options=$.extend({},$target.data(),$this.data());var slideIndex=$this.attr('data-slide-to');if(slideIndex)options.interval=false;Plugin.call($target,options);if(slideIndex){$target.data('bs.carousel').to(slideIndex);}e.preventDefault();};$(document).on('click.bs.carousel.data-api','[data-slide]',clickHandler).on('click.bs.carousel.data-api','[data-slide-to]',clickHandler);$(window).on('load',function(){$('[data-ride="carousel"]').each(function(){var $carousel=$(this);Plugin.call($carousel,$carousel.data());});});}(jQuery);},{}],9:[function(require,module,exports){ /* ========================================================================
 * Bootstrap: collapse.js v3.3.6
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */+function($){'use strict'; // COLLAPSE PUBLIC CLASS DEFINITION
// ================================
var Collapse=function Collapse(element,options){this.$element=$(element);this.options=$.extend({},Collapse.DEFAULTS,options);this.$trigger=$('[data-toggle="collapse"][href="#'+element.id+'"],'+'[data-toggle="collapse"][data-target="#'+element.id+'"]');this.transitioning=null;if(this.options.parent){this.$parent=this.getParent();}else {this.addAriaAndCollapsedClass(this.$element,this.$trigger);}if(this.options.toggle)this.toggle();};Collapse.VERSION='3.3.6';Collapse.TRANSITION_DURATION=350;Collapse.DEFAULTS={toggle:true};Collapse.prototype.dimension=function(){var hasWidth=this.$element.hasClass('width');return hasWidth?'width':'height';};Collapse.prototype.show=function(){if(this.transitioning||this.$element.hasClass('in'))return;var activesData;var actives=this.$parent&&this.$parent.children('.panel').children('.in, .collapsing');if(actives&&actives.length){activesData=actives.data('bs.collapse');if(activesData&&activesData.transitioning)return;}var startEvent=$.Event('show.bs.collapse');this.$element.trigger(startEvent);if(startEvent.isDefaultPrevented())return;if(actives&&actives.length){Plugin.call(actives,'hide');activesData||actives.data('bs.collapse',null);}var dimension=this.dimension();this.$element.removeClass('collapse').addClass('collapsing')[dimension](0).attr('aria-expanded',true);this.$trigger.removeClass('collapsed').attr('aria-expanded',true);this.transitioning=1;var complete=function complete(){this.$element.removeClass('collapsing').addClass('collapse in')[dimension]('');this.transitioning=0;this.$element.trigger('shown.bs.collapse');};if(!$.support.transition)return complete.call(this);var scrollSize=$.camelCase(['scroll',dimension].join('-'));this.$element.one('bsTransitionEnd',$.proxy(complete,this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize]);};Collapse.prototype.hide=function(){if(this.transitioning||!this.$element.hasClass('in'))return;var startEvent=$.Event('hide.bs.collapse');this.$element.trigger(startEvent);if(startEvent.isDefaultPrevented())return;var dimension=this.dimension();this.$element[dimension](this.$element[dimension]())[0].offsetHeight;this.$element.addClass('collapsing').removeClass('collapse in').attr('aria-expanded',false);this.$trigger.addClass('collapsed').attr('aria-expanded',false);this.transitioning=1;var complete=function complete(){this.transitioning=0;this.$element.removeClass('collapsing').addClass('collapse').trigger('hidden.bs.collapse');};if(!$.support.transition)return complete.call(this);this.$element[dimension](0).one('bsTransitionEnd',$.proxy(complete,this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION);};Collapse.prototype.toggle=function(){this[this.$element.hasClass('in')?'hide':'show']();};Collapse.prototype.getParent=function(){return $(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each($.proxy(function(i,element){var $element=$(element);this.addAriaAndCollapsedClass(getTargetFromTrigger($element),$element);},this)).end();};Collapse.prototype.addAriaAndCollapsedClass=function($element,$trigger){var isOpen=$element.hasClass('in');$element.attr('aria-expanded',isOpen);$trigger.toggleClass('collapsed',!isOpen).attr('aria-expanded',isOpen);};function getTargetFromTrigger($trigger){var href;var target=$trigger.attr('data-target')||(href=$trigger.attr('href'))&&href.replace(/.*(?=#[^\s]+$)/,''); // strip for ie7
return $(target);} // COLLAPSE PLUGIN DEFINITION
// ==========================
function Plugin(option){return this.each(function(){var $this=$(this);var data=$this.data('bs.collapse');var options=$.extend({},Collapse.DEFAULTS,$this.data(),(typeof option==="undefined"?"undefined":_typeof(option))=='object'&&option);if(!data&&options.toggle&&/show|hide/.test(option))options.toggle=false;if(!data)$this.data('bs.collapse',data=new Collapse(this,options));if(typeof option=='string')data[option]();});}var old=$.fn.collapse;$.fn.collapse=Plugin;$.fn.collapse.Constructor=Collapse; // COLLAPSE NO CONFLICT
// ====================
$.fn.collapse.noConflict=function(){$.fn.collapse=old;return this;}; // COLLAPSE DATA-API
// =================
$(document).on('click.bs.collapse.data-api','[data-toggle="collapse"]',function(e){var $this=$(this);if(!$this.attr('data-target'))e.preventDefault();var $target=getTargetFromTrigger($this);var data=$target.data('bs.collapse');var option=data?'toggle':$this.data();Plugin.call($target,option);});}(jQuery);},{}],10:[function(require,module,exports){ /* ========================================================================
 * Bootstrap: dropdown.js v3.3.6
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */+function($){'use strict'; // DROPDOWN CLASS DEFINITION
// =========================
var backdrop='.dropdown-backdrop';var toggle='[data-toggle="dropdown"]';var Dropdown=function Dropdown(element){$(element).on('click.bs.dropdown',this.toggle);};Dropdown.VERSION='3.3.6';function getParent($this){var selector=$this.attr('data-target');if(!selector){selector=$this.attr('href');selector=selector&&/#[A-Za-z]/.test(selector)&&selector.replace(/.*(?=#[^\s]*$)/,''); // strip for ie7
}var $parent=selector&&$(selector);return $parent&&$parent.length?$parent:$this.parent();}function clearMenus(e){if(e&&e.which===3)return;$(backdrop).remove();$(toggle).each(function(){var $this=$(this);var $parent=getParent($this);var relatedTarget={relatedTarget:this};if(!$parent.hasClass('open'))return;if(e&&e.type=='click'&&/input|textarea/i.test(e.target.tagName)&&$.contains($parent[0],e.target))return;$parent.trigger(e=$.Event('hide.bs.dropdown',relatedTarget));if(e.isDefaultPrevented())return;$this.attr('aria-expanded','false');$parent.removeClass('open').trigger($.Event('hidden.bs.dropdown',relatedTarget));});}Dropdown.prototype.toggle=function(e){var $this=$(this);if($this.is('.disabled, :disabled'))return;var $parent=getParent($this);var isActive=$parent.hasClass('open');clearMenus();if(!isActive){if('ontouchstart' in document.documentElement&&!$parent.closest('.navbar-nav').length){ // if mobile we use a backdrop because click events don't delegate
$(document.createElement('div')).addClass('dropdown-backdrop').insertAfter($(this)).on('click',clearMenus);}var relatedTarget={relatedTarget:this};$parent.trigger(e=$.Event('show.bs.dropdown',relatedTarget));if(e.isDefaultPrevented())return;$this.trigger('focus').attr('aria-expanded','true');$parent.toggleClass('open').trigger($.Event('shown.bs.dropdown',relatedTarget));}return false;};Dropdown.prototype.keydown=function(e){if(!/(38|40|27|32)/.test(e.which)||/input|textarea/i.test(e.target.tagName))return;var $this=$(this);e.preventDefault();e.stopPropagation();if($this.is('.disabled, :disabled'))return;var $parent=getParent($this);var isActive=$parent.hasClass('open');if(!isActive&&e.which!=27||isActive&&e.which==27){if(e.which==27)$parent.find(toggle).trigger('focus');return $this.trigger('click');}var desc=' li:not(.disabled):visible a';var $items=$parent.find('.dropdown-menu'+desc);if(!$items.length)return;var index=$items.index(e.target);if(e.which==38&&index>0)index--; // up
if(e.which==40&&index<$items.length-1)index++; // down
if(! ~index)index=0;$items.eq(index).trigger('focus');}; // DROPDOWN PLUGIN DEFINITION
// ==========================
function Plugin(option){return this.each(function(){var $this=$(this);var data=$this.data('bs.dropdown');if(!data)$this.data('bs.dropdown',data=new Dropdown(this));if(typeof option=='string')data[option].call($this);});}var old=$.fn.dropdown;$.fn.dropdown=Plugin;$.fn.dropdown.Constructor=Dropdown; // DROPDOWN NO CONFLICT
// ====================
$.fn.dropdown.noConflict=function(){$.fn.dropdown=old;return this;}; // APPLY TO STANDARD DROPDOWN ELEMENTS
// ===================================
$(document).on('click.bs.dropdown.data-api',clearMenus).on('click.bs.dropdown.data-api','.dropdown form',function(e){e.stopPropagation();}).on('click.bs.dropdown.data-api',toggle,Dropdown.prototype.toggle).on('keydown.bs.dropdown.data-api',toggle,Dropdown.prototype.keydown).on('keydown.bs.dropdown.data-api','.dropdown-menu',Dropdown.prototype.keydown);}(jQuery);},{}],11:[function(require,module,exports){ /* ========================================================================
 * Bootstrap: modal.js v3.3.6
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */+function($){'use strict'; // MODAL CLASS DEFINITION
// ======================
var Modal=function Modal(element,options){this.options=options;this.$body=$(document.body);this.$element=$(element);this.$dialog=this.$element.find('.modal-dialog');this.$backdrop=null;this.isShown=null;this.originalBodyPad=null;this.scrollbarWidth=0;this.ignoreBackdropClick=false;if(this.options.remote){this.$element.find('.modal-content').load(this.options.remote,$.proxy(function(){this.$element.trigger('loaded.bs.modal');},this));}};Modal.VERSION='3.3.6';Modal.TRANSITION_DURATION=300;Modal.BACKDROP_TRANSITION_DURATION=150;Modal.DEFAULTS={backdrop:true,keyboard:true,show:true};Modal.prototype.toggle=function(_relatedTarget){return this.isShown?this.hide():this.show(_relatedTarget);};Modal.prototype.show=function(_relatedTarget){var that=this;var e=$.Event('show.bs.modal',{relatedTarget:_relatedTarget});this.$element.trigger(e);if(this.isShown||e.isDefaultPrevented())return;this.isShown=true;this.checkScrollbar();this.setScrollbar();this.$body.addClass('modal-open');this.escape();this.resize();this.$element.on('click.dismiss.bs.modal','[data-dismiss="modal"]',$.proxy(this.hide,this));this.$dialog.on('mousedown.dismiss.bs.modal',function(){that.$element.one('mouseup.dismiss.bs.modal',function(e){if($(e.target).is(that.$element))that.ignoreBackdropClick=true;});});this.backdrop(function(){var transition=$.support.transition&&that.$element.hasClass('fade');if(!that.$element.parent().length){that.$element.appendTo(that.$body); // don't move modals dom position
}that.$element.show().scrollTop(0);that.adjustDialog();if(transition){that.$element[0].offsetWidth; // force reflow
}that.$element.addClass('in');that.enforceFocus();var e=$.Event('shown.bs.modal',{relatedTarget:_relatedTarget});transition?that.$dialog // wait for modal to slide in
.one('bsTransitionEnd',function(){that.$element.trigger('focus').trigger(e);}).emulateTransitionEnd(Modal.TRANSITION_DURATION):that.$element.trigger('focus').trigger(e);});};Modal.prototype.hide=function(e){if(e)e.preventDefault();e=$.Event('hide.bs.modal');this.$element.trigger(e);if(!this.isShown||e.isDefaultPrevented())return;this.isShown=false;this.escape();this.resize();$(document).off('focusin.bs.modal');this.$element.removeClass('in').off('click.dismiss.bs.modal').off('mouseup.dismiss.bs.modal');this.$dialog.off('mousedown.dismiss.bs.modal');$.support.transition&&this.$element.hasClass('fade')?this.$element.one('bsTransitionEnd',$.proxy(this.hideModal,this)).emulateTransitionEnd(Modal.TRANSITION_DURATION):this.hideModal();};Modal.prototype.enforceFocus=function(){$(document).off('focusin.bs.modal') // guard against infinite focus loop
.on('focusin.bs.modal',$.proxy(function(e){if(this.$element[0]!==e.target&&!this.$element.has(e.target).length){this.$element.trigger('focus');}},this));};Modal.prototype.escape=function(){if(this.isShown&&this.options.keyboard){this.$element.on('keydown.dismiss.bs.modal',$.proxy(function(e){e.which==27&&this.hide();},this));}else if(!this.isShown){this.$element.off('keydown.dismiss.bs.modal');}};Modal.prototype.resize=function(){if(this.isShown){$(window).on('resize.bs.modal',$.proxy(this.handleUpdate,this));}else {$(window).off('resize.bs.modal');}};Modal.prototype.hideModal=function(){var that=this;this.$element.hide();this.backdrop(function(){that.$body.removeClass('modal-open');that.resetAdjustments();that.resetScrollbar();that.$element.trigger('hidden.bs.modal');});};Modal.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove();this.$backdrop=null;};Modal.prototype.backdrop=function(callback){var that=this;var animate=this.$element.hasClass('fade')?'fade':'';if(this.isShown&&this.options.backdrop){var doAnimate=$.support.transition&&animate;this.$backdrop=$(document.createElement('div')).addClass('modal-backdrop '+animate).appendTo(this.$body);this.$element.on('click.dismiss.bs.modal',$.proxy(function(e){if(this.ignoreBackdropClick){this.ignoreBackdropClick=false;return;}if(e.target!==e.currentTarget)return;this.options.backdrop=='static'?this.$element[0].focus():this.hide();},this));if(doAnimate)this.$backdrop[0].offsetWidth; // force reflow
this.$backdrop.addClass('in');if(!callback)return;doAnimate?this.$backdrop.one('bsTransitionEnd',callback).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION):callback();}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass('in');var callbackRemove=function callbackRemove(){that.removeBackdrop();callback&&callback();};$.support.transition&&this.$element.hasClass('fade')?this.$backdrop.one('bsTransitionEnd',callbackRemove).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION):callbackRemove();}else if(callback){callback();}}; // these following methods are used to handle overflowing modals
Modal.prototype.handleUpdate=function(){this.adjustDialog();};Modal.prototype.adjustDialog=function(){var modalIsOverflowing=this.$element[0].scrollHeight>document.documentElement.clientHeight;this.$element.css({paddingLeft:!this.bodyIsOverflowing&&modalIsOverflowing?this.scrollbarWidth:'',paddingRight:this.bodyIsOverflowing&&!modalIsOverflowing?this.scrollbarWidth:''});};Modal.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:'',paddingRight:''});};Modal.prototype.checkScrollbar=function(){var fullWindowWidth=window.innerWidth;if(!fullWindowWidth){ // workaround for missing window.innerWidth in IE8
var documentElementRect=document.documentElement.getBoundingClientRect();fullWindowWidth=documentElementRect.right-Math.abs(documentElementRect.left);}this.bodyIsOverflowing=document.body.clientWidth<fullWindowWidth;this.scrollbarWidth=this.measureScrollbar();};Modal.prototype.setScrollbar=function(){var bodyPad=parseInt(this.$body.css('padding-right')||0,10);this.originalBodyPad=document.body.style.paddingRight||'';if(this.bodyIsOverflowing)this.$body.css('padding-right',bodyPad+this.scrollbarWidth);};Modal.prototype.resetScrollbar=function(){this.$body.css('padding-right',this.originalBodyPad);};Modal.prototype.measureScrollbar=function(){ // thx walsh
var scrollDiv=document.createElement('div');scrollDiv.className='modal-scrollbar-measure';this.$body.append(scrollDiv);var scrollbarWidth=scrollDiv.offsetWidth-scrollDiv.clientWidth;this.$body[0].removeChild(scrollDiv);return scrollbarWidth;}; // MODAL PLUGIN DEFINITION
// =======================
function Plugin(option,_relatedTarget){return this.each(function(){var $this=$(this);var data=$this.data('bs.modal');var options=$.extend({},Modal.DEFAULTS,$this.data(),(typeof option==="undefined"?"undefined":_typeof(option))=='object'&&option);if(!data)$this.data('bs.modal',data=new Modal(this,options));if(typeof option=='string')data[option](_relatedTarget);else if(options.show)data.show(_relatedTarget);});}var old=$.fn.modal;$.fn.modal=Plugin;$.fn.modal.Constructor=Modal; // MODAL NO CONFLICT
// =================
$.fn.modal.noConflict=function(){$.fn.modal=old;return this;}; // MODAL DATA-API
// ==============
$(document).on('click.bs.modal.data-api','[data-toggle="modal"]',function(e){var $this=$(this);var href=$this.attr('href');var $target=$($this.attr('data-target')||href&&href.replace(/.*(?=#[^\s]+$)/,'')); // strip for ie7
var option=$target.data('bs.modal')?'toggle':$.extend({remote:!/#/.test(href)&&href},$target.data(),$this.data());if($this.is('a'))e.preventDefault();$target.one('show.bs.modal',function(showEvent){if(showEvent.isDefaultPrevented())return; // only register focus restorer if modal will actually get shown
$target.one('hidden.bs.modal',function(){$this.is(':visible')&&$this.trigger('focus');});});Plugin.call($target,option,this);});}(jQuery);},{}],12:[function(require,module,exports){ /* ========================================================================
 * Bootstrap: popover.js v3.3.6
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */+function($){'use strict'; // POPOVER PUBLIC CLASS DEFINITION
// ===============================
var Popover=function Popover(element,options){this.init('popover',element,options);};if(!$.fn.tooltip)throw new Error('Popover requires tooltip.js');Popover.VERSION='3.3.6';Popover.DEFAULTS=$.extend({},$.fn.tooltip.Constructor.DEFAULTS,{placement:'right',trigger:'click',content:'',template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}); // NOTE: POPOVER EXTENDS tooltip.js
// ================================
Popover.prototype=$.extend({},$.fn.tooltip.Constructor.prototype);Popover.prototype.constructor=Popover;Popover.prototype.getDefaults=function(){return Popover.DEFAULTS;};Popover.prototype.setContent=function(){var $tip=this.tip();var title=this.getTitle();var content=this.getContent();$tip.find('.popover-title')[this.options.html?'html':'text'](title);$tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
this.options.html?typeof content=='string'?'html':'append':'text'](content);$tip.removeClass('fade top bottom left right in'); // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
// this manually by checking the contents.
if(!$tip.find('.popover-title').html())$tip.find('.popover-title').hide();};Popover.prototype.hasContent=function(){return this.getTitle()||this.getContent();};Popover.prototype.getContent=function(){var $e=this.$element;var o=this.options;return $e.attr('data-content')||(typeof o.content=='function'?o.content.call($e[0]):o.content);};Popover.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find('.arrow');}; // POPOVER PLUGIN DEFINITION
// =========================
function Plugin(option){return this.each(function(){var $this=$(this);var data=$this.data('bs.popover');var options=(typeof option==="undefined"?"undefined":_typeof(option))=='object'&&option;if(!data&&/destroy|hide/.test(option))return;if(!data)$this.data('bs.popover',data=new Popover(this,options));if(typeof option=='string')data[option]();});}var old=$.fn.popover;$.fn.popover=Plugin;$.fn.popover.Constructor=Popover; // POPOVER NO CONFLICT
// ===================
$.fn.popover.noConflict=function(){$.fn.popover=old;return this;};}(jQuery);},{}],13:[function(require,module,exports){ /* ========================================================================
 * Bootstrap: scrollspy.js v3.3.6
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */+function($){'use strict'; // SCROLLSPY CLASS DEFINITION
// ==========================
function ScrollSpy(element,options){this.$body=$(document.body);this.$scrollElement=$(element).is(document.body)?$(window):$(element);this.options=$.extend({},ScrollSpy.DEFAULTS,options);this.selector=(this.options.target||'')+' .nav li > a';this.offsets=[];this.targets=[];this.activeTarget=null;this.scrollHeight=0;this.$scrollElement.on('scroll.bs.scrollspy',$.proxy(this.process,this));this.refresh();this.process();}ScrollSpy.VERSION='3.3.6';ScrollSpy.DEFAULTS={offset:10};ScrollSpy.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight);};ScrollSpy.prototype.refresh=function(){var that=this;var offsetMethod='offset';var offsetBase=0;this.offsets=[];this.targets=[];this.scrollHeight=this.getScrollHeight();if(!$.isWindow(this.$scrollElement[0])){offsetMethod='position';offsetBase=this.$scrollElement.scrollTop();}this.$body.find(this.selector).map(function(){var $el=$(this);var href=$el.data('target')||$el.attr('href');var $href=/^#./.test(href)&&$(href);return $href&&$href.length&&$href.is(':visible')&&[[$href[offsetMethod]().top+offsetBase,href]]||null;}).sort(function(a,b){return a[0]-b[0];}).each(function(){that.offsets.push(this[0]);that.targets.push(this[1]);});};ScrollSpy.prototype.process=function(){var scrollTop=this.$scrollElement.scrollTop()+this.options.offset;var scrollHeight=this.getScrollHeight();var maxScroll=this.options.offset+scrollHeight-this.$scrollElement.height();var offsets=this.offsets;var targets=this.targets;var activeTarget=this.activeTarget;var i;if(this.scrollHeight!=scrollHeight){this.refresh();}if(scrollTop>=maxScroll){return activeTarget!=(i=targets[targets.length-1])&&this.activate(i);}if(activeTarget&&scrollTop<offsets[0]){this.activeTarget=null;return this.clear();}for(i=offsets.length;i--;){activeTarget!=targets[i]&&scrollTop>=offsets[i]&&(offsets[i+1]===undefined||scrollTop<offsets[i+1])&&this.activate(targets[i]);}};ScrollSpy.prototype.activate=function(target){this.activeTarget=target;this.clear();var selector=this.selector+'[data-target="'+target+'"],'+this.selector+'[href="'+target+'"]';var active=$(selector).parents('li').addClass('active');if(active.parent('.dropdown-menu').length){active=active.closest('li.dropdown').addClass('active');}active.trigger('activate.bs.scrollspy');};ScrollSpy.prototype.clear=function(){$(this.selector).parentsUntil(this.options.target,'.active').removeClass('active');}; // SCROLLSPY PLUGIN DEFINITION
// ===========================
function Plugin(option){return this.each(function(){var $this=$(this);var data=$this.data('bs.scrollspy');var options=(typeof option==="undefined"?"undefined":_typeof(option))=='object'&&option;if(!data)$this.data('bs.scrollspy',data=new ScrollSpy(this,options));if(typeof option=='string')data[option]();});}var old=$.fn.scrollspy;$.fn.scrollspy=Plugin;$.fn.scrollspy.Constructor=ScrollSpy; // SCROLLSPY NO CONFLICT
// =====================
$.fn.scrollspy.noConflict=function(){$.fn.scrollspy=old;return this;}; // SCROLLSPY DATA-API
// ==================
$(window).on('load.bs.scrollspy.data-api',function(){$('[data-spy="scroll"]').each(function(){var $spy=$(this);Plugin.call($spy,$spy.data());});});}(jQuery);},{}],14:[function(require,module,exports){ /* ========================================================================
 * Bootstrap: tab.js v3.3.6
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */+function($){'use strict'; // TAB CLASS DEFINITION
// ====================
var Tab=function Tab(element){ // jscs:disable requireDollarBeforejQueryAssignment
this.element=$(element); // jscs:enable requireDollarBeforejQueryAssignment
};Tab.VERSION='3.3.6';Tab.TRANSITION_DURATION=150;Tab.prototype.show=function(){var $this=this.element;var $ul=$this.closest('ul:not(.dropdown-menu)');var selector=$this.data('target');if(!selector){selector=$this.attr('href');selector=selector&&selector.replace(/.*(?=#[^\s]*$)/,''); // strip for ie7
}if($this.parent('li').hasClass('active'))return;var $previous=$ul.find('.active:last a');var hideEvent=$.Event('hide.bs.tab',{relatedTarget:$this[0]});var showEvent=$.Event('show.bs.tab',{relatedTarget:$previous[0]});$previous.trigger(hideEvent);$this.trigger(showEvent);if(showEvent.isDefaultPrevented()||hideEvent.isDefaultPrevented())return;var $target=$(selector);this.activate($this.closest('li'),$ul);this.activate($target,$target.parent(),function(){$previous.trigger({type:'hidden.bs.tab',relatedTarget:$this[0]});$this.trigger({type:'shown.bs.tab',relatedTarget:$previous[0]});});};Tab.prototype.activate=function(element,container,callback){var $active=container.find('> .active');var transition=callback&&$.support.transition&&($active.length&&$active.hasClass('fade')||!!container.find('> .fade').length);function next(){$active.removeClass('active').find('> .dropdown-menu > .active').removeClass('active').end().find('[data-toggle="tab"]').attr('aria-expanded',false);element.addClass('active').find('[data-toggle="tab"]').attr('aria-expanded',true);if(transition){element[0].offsetWidth; // reflow for transition
element.addClass('in');}else {element.removeClass('fade');}if(element.parent('.dropdown-menu').length){element.closest('li.dropdown').addClass('active').end().find('[data-toggle="tab"]').attr('aria-expanded',true);}callback&&callback();}$active.length&&transition?$active.one('bsTransitionEnd',next).emulateTransitionEnd(Tab.TRANSITION_DURATION):next();$active.removeClass('in');}; // TAB PLUGIN DEFINITION
// =====================
function Plugin(option){return this.each(function(){var $this=$(this);var data=$this.data('bs.tab');if(!data)$this.data('bs.tab',data=new Tab(this));if(typeof option=='string')data[option]();});}var old=$.fn.tab;$.fn.tab=Plugin;$.fn.tab.Constructor=Tab; // TAB NO CONFLICT
// ===============
$.fn.tab.noConflict=function(){$.fn.tab=old;return this;}; // TAB DATA-API
// ============
var clickHandler=function clickHandler(e){e.preventDefault();Plugin.call($(this),'show');};$(document).on('click.bs.tab.data-api','[data-toggle="tab"]',clickHandler).on('click.bs.tab.data-api','[data-toggle="pill"]',clickHandler);}(jQuery);},{}],15:[function(require,module,exports){ /* ========================================================================
 * Bootstrap: tooltip.js v3.3.6
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */+function($){'use strict'; // TOOLTIP PUBLIC CLASS DEFINITION
// ===============================
var Tooltip=function Tooltip(element,options){this.type=null;this.options=null;this.enabled=null;this.timeout=null;this.hoverState=null;this.$element=null;this.inState=null;this.init('tooltip',element,options);};Tooltip.VERSION='3.3.6';Tooltip.TRANSITION_DURATION=150;Tooltip.DEFAULTS={animation:true,placement:'top',selector:false,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:'hover focus',title:'',delay:0,html:false,container:false,viewport:{selector:'body',padding:0}};Tooltip.prototype.init=function(type,element,options){this.enabled=true;this.type=type;this.$element=$(element);this.options=this.getOptions(options);this.$viewport=this.options.viewport&&$($.isFunction(this.options.viewport)?this.options.viewport.call(this,this.$element):this.options.viewport.selector||this.options.viewport);this.inState={click:false,hover:false,focus:false};if(this.$element[0] instanceof document.constructor&&!this.options.selector){throw new Error('`selector` option must be specified when initializing '+this.type+' on the window.document object!');}var triggers=this.options.trigger.split(' ');for(var i=triggers.length;i--;){var trigger=triggers[i];if(trigger=='click'){this.$element.on('click.'+this.type,this.options.selector,$.proxy(this.toggle,this));}else if(trigger!='manual'){var eventIn=trigger=='hover'?'mouseenter':'focusin';var eventOut=trigger=='hover'?'mouseleave':'focusout';this.$element.on(eventIn+'.'+this.type,this.options.selector,$.proxy(this.enter,this));this.$element.on(eventOut+'.'+this.type,this.options.selector,$.proxy(this.leave,this));}}this.options.selector?this._options=$.extend({},this.options,{trigger:'manual',selector:''}):this.fixTitle();};Tooltip.prototype.getDefaults=function(){return Tooltip.DEFAULTS;};Tooltip.prototype.getOptions=function(options){options=$.extend({},this.getDefaults(),this.$element.data(),options);if(options.delay&&typeof options.delay=='number'){options.delay={show:options.delay,hide:options.delay};}return options;};Tooltip.prototype.getDelegateOptions=function(){var options={};var defaults=this.getDefaults();this._options&&$.each(this._options,function(key,value){if(defaults[key]!=value)options[key]=value;});return options;};Tooltip.prototype.enter=function(obj){var self=obj instanceof this.constructor?obj:$(obj.currentTarget).data('bs.'+this.type);if(!self){self=new this.constructor(obj.currentTarget,this.getDelegateOptions());$(obj.currentTarget).data('bs.'+this.type,self);}if(obj instanceof $.Event){self.inState[obj.type=='focusin'?'focus':'hover']=true;}if(self.tip().hasClass('in')||self.hoverState=='in'){self.hoverState='in';return;}clearTimeout(self.timeout);self.hoverState='in';if(!self.options.delay||!self.options.delay.show)return self.show();self.timeout=setTimeout(function(){if(self.hoverState=='in')self.show();},self.options.delay.show);};Tooltip.prototype.isInStateTrue=function(){for(var key in this.inState){if(this.inState[key])return true;}return false;};Tooltip.prototype.leave=function(obj){var self=obj instanceof this.constructor?obj:$(obj.currentTarget).data('bs.'+this.type);if(!self){self=new this.constructor(obj.currentTarget,this.getDelegateOptions());$(obj.currentTarget).data('bs.'+this.type,self);}if(obj instanceof $.Event){self.inState[obj.type=='focusout'?'focus':'hover']=false;}if(self.isInStateTrue())return;clearTimeout(self.timeout);self.hoverState='out';if(!self.options.delay||!self.options.delay.hide)return self.hide();self.timeout=setTimeout(function(){if(self.hoverState=='out')self.hide();},self.options.delay.hide);};Tooltip.prototype.show=function(){var e=$.Event('show.bs.'+this.type);if(this.hasContent()&&this.enabled){this.$element.trigger(e);var inDom=$.contains(this.$element[0].ownerDocument.documentElement,this.$element[0]);if(e.isDefaultPrevented()||!inDom)return;var that=this;var $tip=this.tip();var tipId=this.getUID(this.type);this.setContent();$tip.attr('id',tipId);this.$element.attr('aria-describedby',tipId);if(this.options.animation)$tip.addClass('fade');var placement=typeof this.options.placement=='function'?this.options.placement.call(this,$tip[0],this.$element[0]):this.options.placement;var autoToken=/\s?auto?\s?/i;var autoPlace=autoToken.test(placement);if(autoPlace)placement=placement.replace(autoToken,'')||'top';$tip.detach().css({top:0,left:0,display:'block'}).addClass(placement).data('bs.'+this.type,this);this.options.container?$tip.appendTo(this.options.container):$tip.insertAfter(this.$element);this.$element.trigger('inserted.bs.'+this.type);var pos=this.getPosition();var actualWidth=$tip[0].offsetWidth;var actualHeight=$tip[0].offsetHeight;if(autoPlace){var orgPlacement=placement;var viewportDim=this.getPosition(this.$viewport);placement=placement=='bottom'&&pos.bottom+actualHeight>viewportDim.bottom?'top':placement=='top'&&pos.top-actualHeight<viewportDim.top?'bottom':placement=='right'&&pos.right+actualWidth>viewportDim.width?'left':placement=='left'&&pos.left-actualWidth<viewportDim.left?'right':placement;$tip.removeClass(orgPlacement).addClass(placement);}var calculatedOffset=this.getCalculatedOffset(placement,pos,actualWidth,actualHeight);this.applyPlacement(calculatedOffset,placement);var complete=function complete(){var prevHoverState=that.hoverState;that.$element.trigger('shown.bs.'+that.type);that.hoverState=null;if(prevHoverState=='out')that.leave(that);};$.support.transition&&this.$tip.hasClass('fade')?$tip.one('bsTransitionEnd',complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION):complete();}};Tooltip.prototype.applyPlacement=function(offset,placement){var $tip=this.tip();var width=$tip[0].offsetWidth;var height=$tip[0].offsetHeight; // manually read margins because getBoundingClientRect includes difference
var marginTop=parseInt($tip.css('margin-top'),10);var marginLeft=parseInt($tip.css('margin-left'),10); // we must check for NaN for ie 8/9
if(isNaN(marginTop))marginTop=0;if(isNaN(marginLeft))marginLeft=0;offset.top+=marginTop;offset.left+=marginLeft; // $.fn.offset doesn't round pixel values
// so we use setOffset directly with our own function B-0
$.offset.setOffset($tip[0],$.extend({using:function using(props){$tip.css({top:Math.round(props.top),left:Math.round(props.left)});}},offset),0);$tip.addClass('in'); // check to see if placing tip in new offset caused the tip to resize itself
var actualWidth=$tip[0].offsetWidth;var actualHeight=$tip[0].offsetHeight;if(placement=='top'&&actualHeight!=height){offset.top=offset.top+height-actualHeight;}var delta=this.getViewportAdjustedDelta(placement,offset,actualWidth,actualHeight);if(delta.left)offset.left+=delta.left;else offset.top+=delta.top;var isVertical=/top|bottom/.test(placement);var arrowDelta=isVertical?delta.left*2-width+actualWidth:delta.top*2-height+actualHeight;var arrowOffsetPosition=isVertical?'offsetWidth':'offsetHeight';$tip.offset(offset);this.replaceArrow(arrowDelta,$tip[0][arrowOffsetPosition],isVertical);};Tooltip.prototype.replaceArrow=function(delta,dimension,isVertical){this.arrow().css(isVertical?'left':'top',50*(1-delta/dimension)+'%').css(isVertical?'top':'left','');};Tooltip.prototype.setContent=function(){var $tip=this.tip();var title=this.getTitle();$tip.find('.tooltip-inner')[this.options.html?'html':'text'](title);$tip.removeClass('fade in top bottom left right');};Tooltip.prototype.hide=function(callback){var that=this;var $tip=$(this.$tip);var e=$.Event('hide.bs.'+this.type);function complete(){if(that.hoverState!='in')$tip.detach();that.$element.removeAttr('aria-describedby').trigger('hidden.bs.'+that.type);callback&&callback();}this.$element.trigger(e);if(e.isDefaultPrevented())return;$tip.removeClass('in');$.support.transition&&$tip.hasClass('fade')?$tip.one('bsTransitionEnd',complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION):complete();this.hoverState=null;return this;};Tooltip.prototype.fixTitle=function(){var $e=this.$element;if($e.attr('title')||typeof $e.attr('data-original-title')!='string'){$e.attr('data-original-title',$e.attr('title')||'').attr('title','');}};Tooltip.prototype.hasContent=function(){return this.getTitle();};Tooltip.prototype.getPosition=function($element){$element=$element||this.$element;var el=$element[0];var isBody=el.tagName=='BODY';var elRect=el.getBoundingClientRect();if(elRect.width==null){ // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
elRect=$.extend({},elRect,{width:elRect.right-elRect.left,height:elRect.bottom-elRect.top});}var elOffset=isBody?{top:0,left:0}:$element.offset();var scroll={scroll:isBody?document.documentElement.scrollTop||document.body.scrollTop:$element.scrollTop()};var outerDims=isBody?{width:$(window).width(),height:$(window).height()}:null;return $.extend({},elRect,scroll,outerDims,elOffset);};Tooltip.prototype.getCalculatedOffset=function(placement,pos,actualWidth,actualHeight){return placement=='bottom'?{top:pos.top+pos.height,left:pos.left+pos.width/2-actualWidth/2}:placement=='top'?{top:pos.top-actualHeight,left:pos.left+pos.width/2-actualWidth/2}:placement=='left'?{top:pos.top+pos.height/2-actualHeight/2,left:pos.left-actualWidth}: /* placement == 'right' */{top:pos.top+pos.height/2-actualHeight/2,left:pos.left+pos.width};};Tooltip.prototype.getViewportAdjustedDelta=function(placement,pos,actualWidth,actualHeight){var delta={top:0,left:0};if(!this.$viewport)return delta;var viewportPadding=this.options.viewport&&this.options.viewport.padding||0;var viewportDimensions=this.getPosition(this.$viewport);if(/right|left/.test(placement)){var topEdgeOffset=pos.top-viewportPadding-viewportDimensions.scroll;var bottomEdgeOffset=pos.top+viewportPadding-viewportDimensions.scroll+actualHeight;if(topEdgeOffset<viewportDimensions.top){ // top overflow
delta.top=viewportDimensions.top-topEdgeOffset;}else if(bottomEdgeOffset>viewportDimensions.top+viewportDimensions.height){ // bottom overflow
delta.top=viewportDimensions.top+viewportDimensions.height-bottomEdgeOffset;}}else {var leftEdgeOffset=pos.left-viewportPadding;var rightEdgeOffset=pos.left+viewportPadding+actualWidth;if(leftEdgeOffset<viewportDimensions.left){ // left overflow
delta.left=viewportDimensions.left-leftEdgeOffset;}else if(rightEdgeOffset>viewportDimensions.right){ // right overflow
delta.left=viewportDimensions.left+viewportDimensions.width-rightEdgeOffset;}}return delta;};Tooltip.prototype.getTitle=function(){var title;var $e=this.$element;var o=this.options;title=$e.attr('data-original-title')||(typeof o.title=='function'?o.title.call($e[0]):o.title);return title;};Tooltip.prototype.getUID=function(prefix){do {prefix+=~ ~(Math.random()*1000000);}while(document.getElementById(prefix));return prefix;};Tooltip.prototype.tip=function(){if(!this.$tip){this.$tip=$(this.options.template);if(this.$tip.length!=1){throw new Error(this.type+' `template` option must consist of exactly 1 top-level element!');}}return this.$tip;};Tooltip.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find('.tooltip-arrow');};Tooltip.prototype.enable=function(){this.enabled=true;};Tooltip.prototype.disable=function(){this.enabled=false;};Tooltip.prototype.toggleEnabled=function(){this.enabled=!this.enabled;};Tooltip.prototype.toggle=function(e){var self=this;if(e){self=$(e.currentTarget).data('bs.'+this.type);if(!self){self=new this.constructor(e.currentTarget,this.getDelegateOptions());$(e.currentTarget).data('bs.'+this.type,self);}}if(e){self.inState.click=!self.inState.click;if(self.isInStateTrue())self.enter(self);else self.leave(self);}else {self.tip().hasClass('in')?self.leave(self):self.enter(self);}};Tooltip.prototype.destroy=function(){var that=this;clearTimeout(this.timeout);this.hide(function(){that.$element.off('.'+that.type).removeData('bs.'+that.type);if(that.$tip){that.$tip.detach();}that.$tip=null;that.$arrow=null;that.$viewport=null;});}; // TOOLTIP PLUGIN DEFINITION
// =========================
function Plugin(option){return this.each(function(){var $this=$(this);var data=$this.data('bs.tooltip');var options=(typeof option==="undefined"?"undefined":_typeof(option))=='object'&&option;if(!data&&/destroy|hide/.test(option))return;if(!data)$this.data('bs.tooltip',data=new Tooltip(this,options));if(typeof option=='string')data[option]();});}var old=$.fn.tooltip;$.fn.tooltip=Plugin;$.fn.tooltip.Constructor=Tooltip; // TOOLTIP NO CONFLICT
// ===================
$.fn.tooltip.noConflict=function(){$.fn.tooltip=old;return this;};}(jQuery);},{}],16:[function(require,module,exports){ /* ========================================================================
 * Bootstrap: transition.js v3.3.6
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */+function($){'use strict'; // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
// ============================================================
function transitionEnd(){var el=document.createElement('bootstrap');var transEndEventNames={WebkitTransition:'webkitTransitionEnd',MozTransition:'transitionend',OTransition:'oTransitionEnd otransitionend',transition:'transitionend'};for(var name in transEndEventNames){if(el.style[name]!==undefined){return {end:transEndEventNames[name]};}}return false; // explicit for ie8 (  ._.)
} // http://blog.alexmaccaw.com/css-transitions
$.fn.emulateTransitionEnd=function(duration){var called=false;var $el=this;$(this).one('bsTransitionEnd',function(){called=true;});var callback=function callback(){if(!called)$($el).trigger($.support.transition.end);};setTimeout(callback,duration);return this;};$(function(){$.support.transition=transitionEnd();if(!$.support.transition)return;$.event.special.bsTransitionEnd={bindType:$.support.transition.end,delegateType:$.support.transition.end,handle:function handle(e){if($(e.target).is(this))return e.handleObj.handler.apply(this,arguments);}};});}(jQuery);},{}],17:[function(require,module,exports){},{}],18:[function(require,module,exports){exports=module.exports=parse;exports.parse=parse;function parse(src,state,options){options=options||{};state=state||exports.defaultState();var start=options.start||0;var end=options.end||src.length;var index=start;while(index<end){if(state.roundDepth<0||state.curlyDepth<0||state.squareDepth<0){throw new SyntaxError('Mismatched Bracket: '+src[index-1]);}exports.parseChar(src[index++],state);}return state;}exports.parseMax=parseMax;function parseMax(src,options){options=options||{};var start=options.start||0;var index=start;var state=exports.defaultState();while(state.roundDepth>=0&&state.curlyDepth>=0&&state.squareDepth>=0){if(index>=src.length){throw new Error('The end of the string was reached with no closing bracket found.');}exports.parseChar(src[index++],state);}var end=index-1;return {start:start,end:end,src:src.substring(start,end)};}exports.parseUntil=parseUntil;function parseUntil(src,delimiter,options){options=options||{};var includeLineComment=options.includeLineComment||false;var start=options.start||0;var index=start;var state=exports.defaultState();while(state.isString()||state.regexp||state.blockComment||!includeLineComment&&state.lineComment||!startsWith(src,delimiter,index)){exports.parseChar(src[index++],state);}var end=index;return {start:start,end:end,src:src.substring(start,end)};}exports.parseChar=parseChar;function parseChar(character,state){if(character.length!==1)throw new Error('Character must be a string of length 1');state=state||exports.defaultState();state.src=state.src||'';state.src+=character;var wasComment=state.blockComment||state.lineComment;var lastChar=state.history?state.history[0]:'';if(state.regexpStart){if(character==='/'||character=='*'){state.regexp=false;}state.regexpStart=false;}if(state.lineComment){if(character==='\n'){state.lineComment=false;}}else if(state.blockComment){if(state.lastChar==='*'&&character==='/'){state.blockComment=false;}}else if(state.singleQuote){if(character==='\''&&!state.escaped){state.singleQuote=false;}else if(character==='\\'&&!state.escaped){state.escaped=true;}else {state.escaped=false;}}else if(state.doubleQuote){if(character==='"'&&!state.escaped){state.doubleQuote=false;}else if(character==='\\'&&!state.escaped){state.escaped=true;}else {state.escaped=false;}}else if(state.regexp){if(character==='/'&&!state.escaped){state.regexp=false;}else if(character==='\\'&&!state.escaped){state.escaped=true;}else {state.escaped=false;}}else if(lastChar==='/'&&character==='/'){state.history=state.history.substr(1);state.lineComment=true;}else if(lastChar==='/'&&character==='*'){state.history=state.history.substr(1);state.blockComment=true;}else if(character==='/'&&isRegexp(state.history)){state.regexp=true;state.regexpStart=true;}else if(character==='\''){state.singleQuote=true;}else if(character==='"'){state.doubleQuote=true;}else if(character==='('){state.roundDepth++;}else if(character===')'){state.roundDepth--;}else if(character==='{'){state.curlyDepth++;}else if(character==='}'){state.curlyDepth--;}else if(character==='['){state.squareDepth++;}else if(character===']'){state.squareDepth--;}if(!state.blockComment&&!state.lineComment&&!wasComment)state.history=character+state.history;state.lastChar=character; // store last character for ending block comments
return state;}exports.defaultState=function(){return new State();};function State(){this.lineComment=false;this.blockComment=false;this.singleQuote=false;this.doubleQuote=false;this.regexp=false;this.escaped=false;this.roundDepth=0;this.curlyDepth=0;this.squareDepth=0;this.history='';this.lastChar='';}State.prototype.isString=function(){return this.singleQuote||this.doubleQuote;};State.prototype.isComment=function(){return this.lineComment||this.blockComment;};State.prototype.isNesting=function(){return this.isString()||this.isComment()||this.regexp||this.roundDepth>0||this.curlyDepth>0||this.squareDepth>0;};function startsWith(str,start,i){return str.substr(i||0,start.length)===start;}exports.isPunctuator=isPunctuator;function isPunctuator(c){if(!c)return true; // the start of a string is a punctuator
var code=c.charCodeAt(0);switch(code){case 46: // . dot
case 40: // ( open bracket
case 41: // ) close bracket
case 59: // ; semicolon
case 44: // , comma
case 123: // { open curly brace
case 125: // } close curly brace
case 91: // [
case 93: // ]
case 58: // :
case 63: // ?
case 126: // ~
case 37: // %
case 38: // &
case 42: // *:
case 43: // +
case 45: // -
case 47: // /
case 60: // <
case 62: // >
case 94: // ^
case 124: // |
case 33: // !
case 61: // =
return true;default:return false;}}exports.isKeyword=isKeyword;function isKeyword(id){return id==='if'||id==='in'||id==='do'||id==='var'||id==='for'||id==='new'||id==='try'||id==='let'||id==='this'||id==='else'||id==='case'||id==='void'||id==='with'||id==='enum'||id==='while'||id==='break'||id==='catch'||id==='throw'||id==='const'||id==='yield'||id==='class'||id==='super'||id==='return'||id==='typeof'||id==='delete'||id==='switch'||id==='export'||id==='import'||id==='default'||id==='finally'||id==='extends'||id==='function'||id==='continue'||id==='debugger'||id==='package'||id==='private'||id==='interface'||id==='instanceof'||id==='implements'||id==='protected'||id==='public'||id==='static'||id==='yield'||id==='let';}function isRegexp(history){ //could be start of regexp or divide sign
history=history.replace(/^\s*/,''); //unless its an `if`, `while`, `for` or `with` it's a divide, so we assume it's a divide
if(history[0]===')')return false; //unless it's a function expression, it's a regexp, so we assume it's a regexp
if(history[0]==='}')return true; //any punctuation means it's a regexp
if(isPunctuator(history[0]))return true; //if the last thing was a keyword then it must be a regexp (e.g. `typeof /foo/`)
if(/^\w+\b/.test(history)&&isKeyword(/^\w+\b/.exec(history)[0].split('').reverse().join('')))return true;return false;}},{}],19:[function(require,module,exports){'use strict';var acorn=require('acorn');var walk=require('acorn/dist/walk');var lastSRC='(null)';var lastRes=true;var lastConstants=undefined;var STATEMENT_WHITE_LIST={'EmptyStatement':true,'ExpressionStatement':true};var EXPRESSION_WHITE_LIST={'ParenthesizedExpression':true,'ArrayExpression':true,'ObjectExpression':true,'SequenceExpression':true,'TemplateLiteral':true,'UnaryExpression':true,'BinaryExpression':true,'LogicalExpression':true,'ConditionalExpression':true,'Identifier':true,'Literal':true,'ComprehensionExpression':true,'TaggedTemplateExpression':true,'MemberExpression':true,'CallExpression':true,'NewExpression':true};module.exports=isConstant;function isConstant(src,constants){src='('+src+')';if(lastSRC===src&&lastConstants===constants)return lastRes;lastSRC=src;lastConstants=constants;if(!isExpression(src))return lastRes=false;var ast;try{ast=acorn.parse(src,{ecmaVersion:6,allowReturnOutsideFunction:true,allowImportExportEverywhere:true,allowHashBang:true});}catch(ex){return lastRes=false;}var isConstant=true;walk.simple(ast,{Statement:function Statement(node){if(isConstant){if(STATEMENT_WHITE_LIST[node.type]!==true){isConstant=false;}}},Expression:function Expression(node){if(isConstant){if(EXPRESSION_WHITE_LIST[node.type]!==true){isConstant=false;}}},MemberExpression:function MemberExpression(node){if(isConstant){if(node.computed)isConstant=false;else if(node.property.name[0]==='_')isConstant=false;}},Identifier:function Identifier(node){if(isConstant){if(!constants||!(node.name in constants)){isConstant=false;}}}});return lastRes=isConstant;}isConstant.isConstant=isConstant;isConstant.toConstant=toConstant;function toConstant(src,constants){if(!isConstant(src,constants))throw new Error(JSON.stringify(src)+' is not constant.');return Function(Object.keys(constants||{}).join(','),'return ('+src+')').apply(null,Object.keys(constants||{}).map(function(key){return constants[key];}));}function isExpression(src){try{eval('throw "STOP"; (function () { return ('+src+'); })()');return false;}catch(err){return err==='STOP';}}},{"acorn":2,"acorn/dist/walk":3}],20:[function(require,module,exports){module.exports=Array.isArray||function(arr){return Object.prototype.toString.call(arr)=='[object Array]';};},{}],21:[function(require,module,exports){'use strict';var nodes=require('./nodes');var filters=require('./filters');var doctypes=require('./doctypes');var runtime=require('./runtime');var utils=require('./utils');var selfClosing=require('void-elements');var parseJSExpression=require('character-parser').parseMax;var constantinople=require('constantinople');function isConstant(src){return constantinople(src,{jade:runtime,'jade_interp':undefined});}function toConstant(src){return constantinople.toConstant(src,{jade:runtime,'jade_interp':undefined});}function errorAtNode(node,error){error.line=node.line;error.filename=node.filename;return error;} /**
 * Initialize `Compiler` with the given `node`.
 *
 * @param {Node} node
 * @param {Object} options
 * @api public
 */var Compiler=module.exports=function Compiler(node,options){this.options=options=options||{};this.node=node;this.hasCompiledDoctype=false;this.hasCompiledTag=false;this.pp=options.pretty||false;if(this.pp&&typeof this.pp!=='string'){this.pp='  ';}this.debug=false!==options.compileDebug;this.indents=0;this.parentIndents=0;this.terse=false;this.mixins={};this.dynamicMixins=false;if(options.doctype)this.setDoctype(options.doctype);}; /**
 * Compiler prototype.
 */Compiler.prototype={ /**
   * Compile parse tree to JavaScript.
   *
   * @api public
   */compile:function compile(){this.buf=[];if(this.pp)this.buf.push("var jade_indent = [];");this.lastBufferedIdx=-1;this.visit(this.node);if(!this.dynamicMixins){ // if there are no dynamic mixins we can remove any un-used mixins
var mixinNames=Object.keys(this.mixins);for(var i=0;i<mixinNames.length;i++){var mixin=this.mixins[mixinNames[i]];if(!mixin.used){for(var x=0;x<mixin.instances.length;x++){for(var y=mixin.instances[x].start;y<mixin.instances[x].end;y++){this.buf[y]='';}}}}}return this.buf.join('\n');}, /**
   * Sets the default doctype `name`. Sets terse mode to `true` when
   * html 5 is used, causing self-closing tags to end with ">" vs "/>",
   * and boolean attributes are not mirrored.
   *
   * @param {string} name
   * @api public
   */setDoctype:function setDoctype(name){this.doctype=doctypes[name.toLowerCase()]||'<!DOCTYPE '+name+'>';this.terse=this.doctype.toLowerCase()=='<!doctype html>';this.xml=0==this.doctype.indexOf('<?xml');}, /**
   * Buffer the given `str` exactly as is or with interpolation
   *
   * @param {String} str
   * @param {Boolean} interpolate
   * @api public
   */buffer:function buffer(str,interpolate){var self=this;if(interpolate){var match=/(\\)?([#!]){((?:.|\n)*)$/.exec(str);if(match){this.buffer(str.substr(0,match.index),false);if(match[1]){ // escape
this.buffer(match[2]+'{',false);this.buffer(match[3],true);return;}else {var rest=match[3];var range=parseJSExpression(rest);var code=('!'==match[2]?'':'jade.escape')+"((jade_interp = "+range.src+") == null ? '' : jade_interp)";this.bufferExpression(code);this.buffer(rest.substr(range.end+1),true);return;}}}str=utils.stringify(str);str=str.substr(1,str.length-2);if(this.lastBufferedIdx==this.buf.length){if(this.lastBufferedType==='code')this.lastBuffered+=' + "';this.lastBufferedType='text';this.lastBuffered+=str;this.buf[this.lastBufferedIdx-1]='buf.push('+this.bufferStartChar+this.lastBuffered+'");';}else {this.buf.push('buf.push("'+str+'");');this.lastBufferedType='text';this.bufferStartChar='"';this.lastBuffered=str;this.lastBufferedIdx=this.buf.length;}}, /**
   * Buffer the given `src` so it is evaluated at run time
   *
   * @param {String} src
   * @api public
   */bufferExpression:function bufferExpression(src){if(isConstant(src)){return this.buffer(toConstant(src)+'',false);}if(this.lastBufferedIdx==this.buf.length){if(this.lastBufferedType==='text')this.lastBuffered+='"';this.lastBufferedType='code';this.lastBuffered+=' + ('+src+')';this.buf[this.lastBufferedIdx-1]='buf.push('+this.bufferStartChar+this.lastBuffered+');';}else {this.buf.push('buf.push('+src+');');this.lastBufferedType='code';this.bufferStartChar='';this.lastBuffered='('+src+')';this.lastBufferedIdx=this.buf.length;}}, /**
   * Buffer an indent based on the current `indent`
   * property and an additional `offset`.
   *
   * @param {Number} offset
   * @param {Boolean} newline
   * @api public
   */prettyIndent:function prettyIndent(offset,newline){offset=offset||0;newline=newline?'\n':'';this.buffer(newline+Array(this.indents+offset).join(this.pp));if(this.parentIndents)this.buf.push("buf.push.apply(buf, jade_indent);");}, /**
   * Visit `node`.
   *
   * @param {Node} node
   * @api public
   */visit:function visit(node){var debug=this.debug;if(debug){this.buf.push('jade_debug.unshift(new jade.DebugItem( '+node.line+', '+(node.filename?utils.stringify(node.filename):'jade_debug[0].filename')+' ));');} // Massive hack to fix our context
// stack for - else[ if] etc
if(false===node.debug&&this.debug){this.buf.pop();this.buf.pop();}this.visitNode(node);if(debug)this.buf.push('jade_debug.shift();');}, /**
   * Visit `node`.
   *
   * @param {Node} node
   * @api public
   */visitNode:function visitNode(node){return this['visit'+node.type](node);}, /**
   * Visit case `node`.
   *
   * @param {Literal} node
   * @api public
   */visitCase:function visitCase(node){var _=this.withinCase;this.withinCase=true;this.buf.push('switch ('+node.expr+'){');this.visit(node.block);this.buf.push('}');this.withinCase=_;}, /**
   * Visit when `node`.
   *
   * @param {Literal} node
   * @api public
   */visitWhen:function visitWhen(node){if('default'==node.expr){this.buf.push('default:');}else {this.buf.push('case '+node.expr+':');}if(node.block){this.visit(node.block);this.buf.push('  break;');}}, /**
   * Visit literal `node`.
   *
   * @param {Literal} node
   * @api public
   */visitLiteral:function visitLiteral(node){this.buffer(node.str);}, /**
   * Visit all nodes in `block`.
   *
   * @param {Block} block
   * @api public
   */visitBlock:function visitBlock(block){var len=block.nodes.length,escape=this.escape,pp=this.pp; // Pretty print multi-line text
if(pp&&len>1&&!escape&&block.nodes[0].isText&&block.nodes[1].isText)this.prettyIndent(1,true);for(var i=0;i<len;++i){ // Pretty print text
if(pp&&i>0&&!escape&&block.nodes[i].isText&&block.nodes[i-1].isText)this.prettyIndent(1,false);this.visit(block.nodes[i]); // Multiple text nodes are separated by newlines
if(block.nodes[i+1]&&block.nodes[i].isText&&block.nodes[i+1].isText)this.buffer('\n');}}, /**
   * Visit a mixin's `block` keyword.
   *
   * @param {MixinBlock} block
   * @api public
   */visitMixinBlock:function visitMixinBlock(block){if(this.pp)this.buf.push("jade_indent.push('"+Array(this.indents+1).join(this.pp)+"');");this.buf.push('block && block();');if(this.pp)this.buf.push("jade_indent.pop();");}, /**
   * Visit `doctype`. Sets terse mode to `true` when html 5
   * is used, causing self-closing tags to end with ">" vs "/>",
   * and boolean attributes are not mirrored.
   *
   * @param {Doctype} doctype
   * @api public
   */visitDoctype:function visitDoctype(doctype){if(doctype&&(doctype.val||!this.doctype)){this.setDoctype(doctype.val||'default');}if(this.doctype)this.buffer(this.doctype);this.hasCompiledDoctype=true;}, /**
   * Visit `mixin`, generating a function that
   * may be called within the template.
   *
   * @param {Mixin} mixin
   * @api public
   */visitMixin:function visitMixin(mixin){var name='jade_mixins[';var args=mixin.args||'';var block=mixin.block;var attrs=mixin.attrs;var attrsBlocks=mixin.attributeBlocks.slice();var pp=this.pp;var dynamic=mixin.name[0]==='#';var key=mixin.name;if(dynamic)this.dynamicMixins=true;name+=(dynamic?mixin.name.substr(2,mixin.name.length-3):'"'+mixin.name+'"')+']';this.mixins[key]=this.mixins[key]||{used:false,instances:[]};if(mixin.call){this.mixins[key].used=true;if(pp)this.buf.push("jade_indent.push('"+Array(this.indents+1).join(pp)+"');");if(block||attrs.length||attrsBlocks.length){this.buf.push(name+'.call({');if(block){this.buf.push('block: function(){'); // Render block with no indents, dynamically added when rendered
this.parentIndents++;var _indents=this.indents;this.indents=0;this.visit(mixin.block);this.indents=_indents;this.parentIndents--;if(attrs.length||attrsBlocks.length){this.buf.push('},');}else {this.buf.push('}');}}if(attrsBlocks.length){if(attrs.length){var val=this.attrs(attrs);attrsBlocks.unshift(val);}this.buf.push('attributes: jade.merge(['+attrsBlocks.join(',')+'])');}else if(attrs.length){var val=this.attrs(attrs);this.buf.push('attributes: '+val);}if(args){this.buf.push('}, '+args+');');}else {this.buf.push('});');}}else {this.buf.push(name+'('+args+');');}if(pp)this.buf.push("jade_indent.pop();");}else {var mixin_start=this.buf.length;args=args?args.split(','):[];var rest;if(args.length&&/^\.\.\./.test(args[args.length-1].trim())){rest=args.pop().trim().replace(/^\.\.\./,'');} // we need use jade_interp here for v8: https://code.google.com/p/v8/issues/detail?id=4165
// once fixed, use this: this.buf.push(name + ' = function(' + args.join(',') + '){');
this.buf.push(name+' = jade_interp = function('+args.join(',')+'){');this.buf.push('var block = (this && this.block), attributes = (this && this.attributes) || {};');if(rest){this.buf.push('var '+rest+' = [];');this.buf.push('for (jade_interp = '+args.length+'; jade_interp < arguments.length; jade_interp++) {');this.buf.push('  '+rest+'.push(arguments[jade_interp]);');this.buf.push('}');}this.parentIndents++;this.visit(block);this.parentIndents--;this.buf.push('};');var mixin_end=this.buf.length;this.mixins[key].instances.push({start:mixin_start,end:mixin_end});}}, /**
   * Visit `tag` buffering tag markup, generating
   * attributes, visiting the `tag`'s code and block.
   *
   * @param {Tag} tag
   * @api public
   */visitTag:function visitTag(tag){this.indents++;var name=tag.name,pp=this.pp,self=this;function bufferName(){if(tag.buffer)self.bufferExpression(name);else self.buffer(name);}if('pre'==tag.name)this.escape=true;if(!this.hasCompiledTag){if(!this.hasCompiledDoctype&&'html'==name){this.visitDoctype();}this.hasCompiledTag=true;} // pretty print
if(pp&&!tag.isInline())this.prettyIndent(0,true);if(tag.selfClosing||!this.xml&&selfClosing[tag.name]){this.buffer('<');bufferName();this.visitAttributes(tag.attrs,tag.attributeBlocks.slice());this.terse?this.buffer('>'):this.buffer('/>'); // if it is non-empty throw an error
if(tag.block&&!(tag.block.type==='Block'&&tag.block.nodes.length===0)&&tag.block.nodes.some(function(tag){return tag.type!=='Text'||!/^\s*$/.test(tag.val);})){throw errorAtNode(tag,new Error(name+' is self closing and should not have content.'));}}else { // Optimize attributes buffering
this.buffer('<');bufferName();this.visitAttributes(tag.attrs,tag.attributeBlocks.slice());this.buffer('>');if(tag.code)this.visitCode(tag.code);this.visit(tag.block); // pretty print
if(pp&&!tag.isInline()&&'pre'!=tag.name&&!tag.canInline())this.prettyIndent(0,true);this.buffer('</');bufferName();this.buffer('>');}if('pre'==tag.name)this.escape=false;this.indents--;}, /**
   * Visit `filter`, throwing when the filter does not exist.
   *
   * @param {Filter} filter
   * @api public
   */visitFilter:function visitFilter(filter){var text=filter.block.nodes.map(function(node){return node.val;}).join('\n');filter.attrs.filename=this.options.filename;try{this.buffer(filters(filter.name,text,filter.attrs),true);}catch(err){throw errorAtNode(filter,err);}}, /**
   * Visit `text` node.
   *
   * @param {Text} text
   * @api public
   */visitText:function visitText(text){this.buffer(text.val,true);}, /**
   * Visit a `comment`, only buffering when the buffer flag is set.
   *
   * @param {Comment} comment
   * @api public
   */visitComment:function visitComment(comment){if(!comment.buffer)return;if(this.pp)this.prettyIndent(1,true);this.buffer('<!--'+comment.val+'-->');}, /**
   * Visit a `BlockComment`.
   *
   * @param {Comment} comment
   * @api public
   */visitBlockComment:function visitBlockComment(comment){if(!comment.buffer)return;if(this.pp)this.prettyIndent(1,true);this.buffer('<!--'+comment.val);this.visit(comment.block);if(this.pp)this.prettyIndent(1,true);this.buffer('-->');}, /**
   * Visit `code`, respecting buffer / escape flags.
   * If the code is followed by a block, wrap it in
   * a self-calling function.
   *
   * @param {Code} code
   * @api public
   */visitCode:function visitCode(code){ // Wrap code blocks with {}.
// we only wrap unbuffered code blocks ATM
// since they are usually flow control
// Buffer code
if(code.buffer){var val=code.val.trim();val='null == (jade_interp = '+val+') ? "" : jade_interp';if(code.escape)val='jade.escape('+val+')';this.bufferExpression(val);}else {this.buf.push(code.val);} // Block support
if(code.block){if(!code.buffer)this.buf.push('{');this.visit(code.block);if(!code.buffer)this.buf.push('}');}}, /**
   * Visit `each` block.
   *
   * @param {Each} each
   * @api public
   */visitEach:function visitEach(each){this.buf.push(''+'// iterate '+each.obj+'\n'+';(function(){\n'+'  var $$obj = '+each.obj+';\n'+'  if (\'number\' == typeof $$obj.length) {\n');if(each.alternative){this.buf.push('  if ($$obj.length) {');}this.buf.push(''+'    for (var '+each.key+' = 0, $$l = $$obj.length; '+each.key+' < $$l; '+each.key+'++) {\n'+'      var '+each.val+' = $$obj['+each.key+'];\n');this.visit(each.block);this.buf.push('    }\n');if(each.alternative){this.buf.push('  } else {');this.visit(each.alternative);this.buf.push('  }');}this.buf.push(''+'  } else {\n'+'    var $$l = 0;\n'+'    for (var '+each.key+' in $$obj) {\n'+'      $$l++;'+'      var '+each.val+' = $$obj['+each.key+'];\n');this.visit(each.block);this.buf.push('    }\n');if(each.alternative){this.buf.push('    if ($$l === 0) {');this.visit(each.alternative);this.buf.push('    }');}this.buf.push('  }\n}).call(this);\n');}, /**
   * Visit `attrs`.
   *
   * @param {Array} attrs
   * @api public
   */visitAttributes:function visitAttributes(attrs,attributeBlocks){if(attributeBlocks.length){if(attrs.length){var val=this.attrs(attrs);attributeBlocks.unshift(val);}this.bufferExpression('jade.attrs(jade.merge(['+attributeBlocks.join(',')+']), '+utils.stringify(this.terse)+')');}else if(attrs.length){this.attrs(attrs,true);}}, /**
   * Compile attributes.
   */attrs:function attrs(_attrs,buffer){var buf=[];var classes=[];var classEscaping=[];_attrs.forEach(function(attr){var key=attr.name;var escaped=attr.escaped;if(key==='class'){classes.push(attr.val);classEscaping.push(attr.escaped);}else if(isConstant(attr.val)){if(buffer){this.buffer(runtime.attr(key,toConstant(attr.val),escaped,this.terse));}else {var val=toConstant(attr.val);if(key==='style')val=runtime.style(val);if(escaped&&!(key.indexOf('data')===0&&typeof val!=='string')){val=runtime.escape(val);}buf.push(utils.stringify(key)+': '+utils.stringify(val));}}else {if(buffer){this.bufferExpression('jade.attr("'+key+'", '+attr.val+', '+utils.stringify(escaped)+', '+utils.stringify(this.terse)+')');}else {var val=attr.val;if(key==='style'){val='jade.style('+val+')';}if(escaped&&!(key.indexOf('data')===0)){val='jade.escape('+val+')';}else if(escaped){val='(typeof (jade_interp = '+val+') == "string" ? jade.escape(jade_interp) : jade_interp)';}buf.push(utils.stringify(key)+': '+val);}}}.bind(this));if(buffer){if(classes.every(isConstant)){this.buffer(runtime.cls(classes.map(toConstant),classEscaping));}else {this.bufferExpression('jade.cls(['+classes.join(',')+'], '+utils.stringify(classEscaping)+')');}}else if(classes.length){if(classes.every(isConstant)){classes=utils.stringify(runtime.joinClasses(classes.map(toConstant).map(runtime.joinClasses).map(function(cls,i){return classEscaping[i]?runtime.escape(cls):cls;})));}else {classes='(jade_interp = '+utils.stringify(classEscaping)+','+' jade.joinClasses(['+classes.join(',')+'].map(jade.joinClasses).map(function (cls, i) {'+'   return jade_interp[i] ? jade.escape(cls) : cls'+' }))'+')';}if(classes.length)buf.push('"class": '+classes);}return '{'+buf.join(',')+'}';}};},{"./doctypes":22,"./filters":23,"./nodes":36,"./runtime":44,"./utils":45,"character-parser":18,"constantinople":19,"void-elements":59}],22:[function(require,module,exports){'use strict';module.exports={'default':'<!DOCTYPE html>','xml':'<?xml version="1.0" encoding="utf-8" ?>','transitional':'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">','strict':'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">','frameset':'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">','1.1':'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">','basic':'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">','mobile':'<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.2//EN" "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd">'};},{}],23:[function(require,module,exports){'use strict';module.exports=filter;function filter(name,str,options){if(typeof filter[name]==='function'){return filter[name](str,options);}else {throw new Error('unknown filter ":'+name+'"');}}},{}],24:[function(require,module,exports){(function(process){'use strict'; /*!
 * Jade
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */ /**
 * Module dependencies.
 */var Parser=require('./parser'),Lexer=require('./lexer'),Compiler=require('./compiler'),runtime=require('./runtime'),addWith=require('with'),fs=require('fs'),utils=require('./utils'); /**
 * Expose self closing tags.
 */ // FIXME: either stop exporting selfClosing in v2 or export the new object
// form
exports.selfClosing=Object.keys(require('void-elements')); /**
 * Default supported doctypes.
 */exports.doctypes=require('./doctypes'); /**
 * Text filters.
 */exports.filters=require('./filters'); /**
 * Utilities.
 */exports.utils=utils; /**
 * Expose `Compiler`.
 */exports.Compiler=Compiler; /**
 * Expose `Parser`.
 */exports.Parser=Parser; /**
 * Expose `Lexer`.
 */exports.Lexer=Lexer; /**
 * Nodes.
 */exports.nodes=require('./nodes'); /**
 * Jade runtime helpers.
 */exports.runtime=runtime; /**
 * Template function cache.
 */exports.cache={}; /**
 * Parse the given `str` of jade and return a function body.
 *
 * @param {String} str
 * @param {Object} options
 * @return {Object}
 * @api private
 */function parse(str,options){if(options.lexer){console.warn('Using `lexer` as a local in render() is deprecated and '+'will be interpreted as an option in Jade 2.0.0');} // Parse
var parser=new (options.parser||Parser)(str,options.filename,options);var tokens;try{ // Parse
tokens=parser.parse();}catch(err){parser=parser.context();runtime.rethrow(err,parser.filename,parser.lexer.lineno,parser.input);} // Compile
var compiler=new (options.compiler||Compiler)(tokens,options);var js;try{js=compiler.compile();}catch(err){if(err.line&&(err.filename||!options.filename)){runtime.rethrow(err,err.filename,err.line,parser.input);}else {if(err instanceof Error){err.message+='\n\nPlease report this entire error and stack trace to https://github.com/jadejs/jade/issues';}throw err;}} // Debug compiler
if(options.debug){console.error("\nCompiled Function:\n\n\u001b[90m%s\u001b[0m",js.replace(/^/gm,'  '));}var globals=[];if(options.globals){globals=options.globals.slice();}globals.push('jade');globals.push('jade_mixins');globals.push('jade_interp');globals.push('jade_debug');globals.push('buf');var body=''+'var buf = [];\n'+'var jade_mixins = {};\n'+'var jade_interp;\n'+(options.self?'var self = locals || {};\n'+js:addWith('locals || {}','\n'+js,globals))+';'+'return buf.join("");';return {body:body,dependencies:parser.dependencies};} /**
 * Get the template from a string or a file, either compiled on-the-fly or
 * read from cache (if enabled), and cache the template if needed.
 *
 * If `str` is not set, the file specified in `options.filename` will be read.
 *
 * If `options.cache` is true, this function reads the file from
 * `options.filename` so it must be set prior to calling this function.
 *
 * @param {Object} options
 * @param {String=} str
 * @return {Function}
 * @api private
 */function handleTemplateCache(options,str){var key=options.filename;if(options.cache&&exports.cache[key]){return exports.cache[key];}else {if(str===undefined)str=fs.readFileSync(options.filename,'utf8');var templ=exports.compile(str,options);if(options.cache)exports.cache[key]=templ;return templ;}} /**
 * Compile a `Function` representation of the given jade `str`.
 *
 * Options:
 *
 *   - `compileDebug` when `false` debugging code is stripped from the compiled
       template, when it is explicitly `true`, the source code is included in
       the compiled template for better accuracy.
 *   - `filename` used to improve errors when `compileDebug` is not `false` and to resolve imports/extends
 *
 * @param {String} str
 * @param {Options} options
 * @return {Function}
 * @api public
 */exports.compile=function(str,options){var options=options||{},filename=options.filename?utils.stringify(options.filename):'undefined',fn;str=String(str);var parsed=parse(str,options);if(options.compileDebug!==false){fn=['var jade_debug = [ new jade.DebugItem( 1, '+filename+' ) ];','try {',parsed.body,'} catch (err) {','  jade.rethrow(err, jade_debug[0].filename, jade_debug[0].lineno'+(options.compileDebug===true?','+utils.stringify(str):'')+');','}'].join('\n');}else {fn=parsed.body;}fn=new Function('locals, jade',fn);var res=function res(locals){return fn(locals,Object.create(runtime));};if(options.client){res.toString=function(){var err=new Error('The `client` option is deprecated, use the `jade.compileClient` method instead');err.name='Warning';console.error(err.stack|| /* istanbul ignore next */err.message);return exports.compileClient(str,options);};}res.dependencies=parsed.dependencies;return res;}; /**
 * Compile a JavaScript source representation of the given jade `str`.
 *
 * Options:
 *
 *   - `compileDebug` When it is `true`, the source code is included in
 *     the compiled template for better error messages.
 *   - `filename` used to improve errors when `compileDebug` is not `true` and to resolve imports/extends
 *   - `name` the name of the resulting function (defaults to "template")
 *
 * @param {String} str
 * @param {Options} options
 * @return {Object}
 * @api public
 */exports.compileClientWithDependenciesTracked=function(str,options){var options=options||{};var name=options.name||'template';var filename=options.filename?utils.stringify(options.filename):'undefined';var fn;str=String(str);options.compileDebug=options.compileDebug?true:false;var parsed=parse(str,options);if(options.compileDebug){fn=['var jade_debug = [ new jade.DebugItem( 1, '+filename+' ) ];','try {',parsed.body,'} catch (err) {','  jade.rethrow(err, jade_debug[0].filename, jade_debug[0].lineno, '+utils.stringify(str)+');','}'].join('\n');}else {fn=parsed.body;}return {body:'function '+name+'(locals) {\n'+fn+'\n}',dependencies:parsed.dependencies};}; /**
 * Compile a JavaScript source representation of the given jade `str`.
 *
 * Options:
 *
 *   - `compileDebug` When it is `true`, the source code is included in
 *     the compiled template for better error messages.
 *   - `filename` used to improve errors when `compileDebug` is not `true` and to resolve imports/extends
 *   - `name` the name of the resulting function (defaults to "template")
 *
 * @param {String} str
 * @param {Options} options
 * @return {String}
 * @api public
 */exports.compileClient=function(str,options){return exports.compileClientWithDependenciesTracked(str,options).body;}; /**
 * Compile a `Function` representation of the given jade file.
 *
 * Options:
 *
 *   - `compileDebug` when `false` debugging code is stripped from the compiled
       template, when it is explicitly `true`, the source code is included in
       the compiled template for better accuracy.
 *
 * @param {String} path
 * @param {Options} options
 * @return {Function}
 * @api public
 */exports.compileFile=function(path,options){options=options||{};options.filename=path;return handleTemplateCache(options);}; /**
 * Render the given `str` of jade.
 *
 * Options:
 *
 *   - `cache` enable template caching
 *   - `filename` filename required for `include` / `extends` and caching
 *
 * @param {String} str
 * @param {Object|Function} options or fn
 * @param {Function|undefined} fn
 * @returns {String}
 * @api public
 */exports.render=function(str,options,fn){ // support callback API
if('function'==typeof options){fn=options,options=undefined;}if(typeof fn==='function'){var res;try{res=exports.render(str,options);}catch(ex){return fn(ex);}return fn(null,res);}options=options||{}; // cache requires .filename
if(options.cache&&!options.filename){throw new Error('the "filename" option is required for caching');}return handleTemplateCache(options,str)(options);}; /**
 * Render a Jade file at the given `path`.
 *
 * @param {String} path
 * @param {Object|Function} options or callback
 * @param {Function|undefined} fn
 * @returns {String}
 * @api public
 */exports.renderFile=function(path,options,fn){ // support callback API
if('function'==typeof options){fn=options,options=undefined;}if(typeof fn==='function'){var res;try{res=exports.renderFile(path,options);}catch(ex){return fn(ex);}return fn(null,res);}options=options||{};options.filename=path;return handleTemplateCache(options)(options);}; /**
 * Compile a Jade file at the given `path` for use on the client.
 *
 * @param {String} path
 * @param {Object} options
 * @returns {String}
 * @api public
 */exports.compileFileClient=function(path,options){var key=path+':client';options=options||{};options.filename=path;if(options.cache&&exports.cache[key]){return exports.cache[key];}var str=fs.readFileSync(options.filename,'utf8');var out=exports.compileClient(str,options);if(options.cache)exports.cache[key]=out;return out;}; /**
 * Express support.
 */exports.__express=function(path,options,fn){if(options.compileDebug==undefined&&process.env.NODE_ENV==='production'){options.compileDebug=false;}exports.renderFile(path,options,fn);};}).call(this,require("FT5ORs"));},{"./compiler":21,"./doctypes":22,"./filters":23,"./lexer":26,"./nodes":36,"./parser":43,"./runtime":44,"./utils":45,"FT5ORs":53,"fs":17,"void-elements":59,"with":60}],25:[function(require,module,exports){'use strict';module.exports=['a','abbr','acronym','b','br','code','em','font','i','img','ins','kbd','map','samp','small','span','strong','sub','sup'];},{}],26:[function(require,module,exports){'use strict';var utils=require('./utils');var characterParser=require('character-parser'); /**
 * Initialize `Lexer` with the given `str`.
 *
 * @param {String} str
 * @param {String} filename
 * @api private
 */var Lexer=module.exports=function Lexer(str,filename){this.input=str.replace(/\r\n|\r/g,'\n');this.filename=filename;this.deferredTokens=[];this.lastIndents=0;this.lineno=1;this.stash=[];this.indentStack=[];this.indentRe=null;this.pipeless=false;};function assertExpression(exp){ //this verifies that a JavaScript expression is valid
Function('','return ('+exp+')');}function assertNestingCorrect(exp){ //this verifies that code is properly nested, but allows
//invalid JavaScript such as the contents of `attributes`
var res=characterParser(exp);if(res.isNesting()){throw new Error('Nesting must match on expression `'+exp+'`');}} /**
 * Lexer prototype.
 */Lexer.prototype={ /**
   * Construct a token with the given `type` and `val`.
   *
   * @param {String} type
   * @param {String} val
   * @return {Object}
   * @api private
   */tok:function tok(type,val){return {type:type,line:this.lineno,val:val};}, /**
   * Consume the given `len` of input.
   *
   * @param {Number} len
   * @api private
   */consume:function consume(len){this.input=this.input.substr(len);}, /**
   * Scan for `type` with the given `regexp`.
   *
   * @param {String} type
   * @param {RegExp} regexp
   * @return {Object}
   * @api private
   */scan:function scan(regexp,type){var captures;if(captures=regexp.exec(this.input)){this.consume(captures[0].length);return this.tok(type,captures[1]);}}, /**
   * Defer the given `tok`.
   *
   * @param {Object} tok
   * @api private
   */defer:function defer(tok){this.deferredTokens.push(tok);}, /**
   * Lookahead `n` tokens.
   *
   * @param {Number} n
   * @return {Object}
   * @api private
   */lookahead:function lookahead(n){var fetch=n-this.stash.length;while(fetch-->0){this.stash.push(this.next());}return this.stash[--n];}, /**
   * Return the indexOf `(` or `{` or `[` / `)` or `}` or `]` delimiters.
   *
   * @return {Number}
   * @api private
   */bracketExpression:function bracketExpression(skip){skip=skip||0;var start=this.input[skip];if(start!='('&&start!='{'&&start!='[')throw new Error('unrecognized start character');var end={'(':')','{':'}','[':']'}[start];var range=characterParser.parseMax(this.input,{start:skip+1});if(this.input[range.end]!==end)throw new Error('start character '+start+' does not match end character '+this.input[range.end]);return range;}, /**
   * Stashed token.
   */stashed:function stashed(){return this.stash.length&&this.stash.shift();}, /**
   * Deferred token.
   */deferred:function deferred(){return this.deferredTokens.length&&this.deferredTokens.shift();}, /**
   * end-of-source.
   */eos:function eos(){if(this.input.length)return;if(this.indentStack.length){this.indentStack.shift();return this.tok('outdent');}else {return this.tok('eos');}}, /**
   * Blank line.
   */blank:function blank(){var captures;if(captures=/^\n *\n/.exec(this.input)){this.consume(captures[0].length-1);++this.lineno;if(this.pipeless)return this.tok('text','');return this.next();}}, /**
   * Comment.
   */comment:function comment(){var captures;if(captures=/^\/\/(-)?([^\n]*)/.exec(this.input)){this.consume(captures[0].length);var tok=this.tok('comment',captures[2]);tok.buffer='-'!=captures[1];this.pipeless=true;return tok;}}, /**
   * Interpolated tag.
   */interpolation:function interpolation(){if(/^#\{/.test(this.input)){var match=this.bracketExpression(1);this.consume(match.end+1);return this.tok('interpolation',match.src);}}, /**
   * Tag.
   */tag:function tag(){var captures;if(captures=/^(\w[-:\w]*)(\/?)/.exec(this.input)){this.consume(captures[0].length);var tok,name=captures[1];if(':'==name[name.length-1]){name=name.slice(0,-1);tok=this.tok('tag',name);this.defer(this.tok(':'));if(this.input[0]!==' '){console.warn('Warning: space required after `:` on line '+this.lineno+' of jade file "'+this.filename+'"');}while(' '==this.input[0]){this.input=this.input.substr(1);}}else {tok=this.tok('tag',name);}tok.selfClosing=!!captures[2];return tok;}}, /**
   * Filter.
   */filter:function filter(){var tok=this.scan(/^:([\w\-]+)/,'filter');if(tok){this.pipeless=true;return tok;}}, /**
   * Doctype.
   */doctype:function doctype(){if(this.scan(/^!!! *([^\n]+)?/,'doctype')){throw new Error('`!!!` is deprecated, you must now use `doctype`');}var node=this.scan(/^(?:doctype) *([^\n]+)?/,'doctype');if(node&&node.val&&node.val.trim()==='5'){throw new Error('`doctype 5` is deprecated, you must now use `doctype html`');}return node;}, /**
   * Id.
   */id:function id(){return this.scan(/^#([\w-]+)/,'id');}, /**
   * Class.
   */className:function className(){return this.scan(/^\.([\w-]+)/,'class');}, /**
   * Text.
   */text:function text(){return this.scan(/^(?:\| ?| )([^\n]+)/,'text')||this.scan(/^\|?( )/,'text')||this.scan(/^(<[^\n]*)/,'text');},textFail:function textFail(){var tok;if(tok=this.scan(/^([^\.\n][^\n]+)/,'text')){console.warn('Warning: missing space before text for line '+this.lineno+' of jade file "'+this.filename+'"');return tok;}}, /**
   * Dot.
   */dot:function dot(){var match;if(match=this.scan(/^\./,'dot')){this.pipeless=true;return match;}}, /**
   * Extends.
   */"extends":function _extends(){return this.scan(/^extends? +([^\n]+)/,'extends');}, /**
   * Block prepend.
   */prepend:function prepend(){var captures;if(captures=/^prepend +([^\n]+)/.exec(this.input)){this.consume(captures[0].length);var mode='prepend',name=captures[1],tok=this.tok('block',name);tok.mode=mode;return tok;}}, /**
   * Block append.
   */append:function append(){var captures;if(captures=/^append +([^\n]+)/.exec(this.input)){this.consume(captures[0].length);var mode='append',name=captures[1],tok=this.tok('block',name);tok.mode=mode;return tok;}}, /**
   * Block.
   */block:function block(){var captures;if(captures=/^block\b *(?:(prepend|append) +)?([^\n]+)/.exec(this.input)){this.consume(captures[0].length);var mode=captures[1]||'replace',name=captures[2],tok=this.tok('block',name);tok.mode=mode;return tok;}}, /**
   * Mixin Block.
   */mixinBlock:function mixinBlock(){var captures;if(captures=/^block[ \t]*(\n|$)/.exec(this.input)){this.consume(captures[0].length-captures[1].length);return this.tok('mixin-block');}}, /**
   * Yield.
   */'yield':function _yield(){return this.scan(/^yield */,'yield');}, /**
   * Include.
   */include:function include(){return this.scan(/^include +([^\n]+)/,'include');}, /**
   * Include with filter
   */includeFiltered:function includeFiltered(){var captures;if(captures=/^include:([\w\-]+)([\( ])/.exec(this.input)){this.consume(captures[0].length-1);var filter=captures[1];var attrs=captures[2]==='('?this.attrs():null;if(!(captures[2]===' '||this.input[0]===' ')){throw new Error('expected space after include:filter but got '+utils.stringify(this.input[0]));}captures=/^ *([^\n]+)/.exec(this.input);if(!captures||captures[1].trim()===''){throw new Error('missing path for include:filter');}this.consume(captures[0].length);var path=captures[1];var tok=this.tok('include',path);tok.filter=filter;tok.attrs=attrs;return tok;}}, /**
   * Case.
   */"case":function _case(){return this.scan(/^case +([^\n]+)/,'case');}, /**
   * When.
   */when:function when(){return this.scan(/^when +([^:\n]+)/,'when');}, /**
   * Default.
   */"default":function _default(){return this.scan(/^default */,'default');}, /**
   * Call mixin.
   */call:function call(){var tok,captures;if(captures=/^\+(\s*)(([-\w]+)|(#\{))/.exec(this.input)){ // try to consume simple or interpolated call
if(captures[3]){ // simple call
this.consume(captures[0].length);tok=this.tok('call',captures[3]);}else { // interpolated call
var match=this.bracketExpression(2+captures[1].length);this.consume(match.end+1);assertExpression(match.src);tok=this.tok('call','#{'+match.src+'}');} // Check for args (not attributes)
if(captures=/^ *\(/.exec(this.input)){var range=this.bracketExpression(captures[0].length-1);if(!/^\s*[-\w]+ *=/.test(range.src)){ // not attributes
this.consume(range.end+1);tok.args=range.src;}if(tok.args){assertExpression('['+tok.args+']');}}return tok;}}, /**
   * Mixin.
   */mixin:function mixin(){var captures;if(captures=/^mixin +([-\w]+)(?: *\((.*)\))? */.exec(this.input)){this.consume(captures[0].length);var tok=this.tok('mixin',captures[1]);tok.args=captures[2];return tok;}}, /**
   * Conditional.
   */conditional:function conditional(){var captures;if(captures=/^(if|unless|else if|else)\b([^\n]*)/.exec(this.input)){this.consume(captures[0].length);var type=captures[1];var js=captures[2];var isIf=false;var isElse=false;switch(type){case 'if':assertExpression(js);js='if ('+js+')';isIf=true;break;case 'unless':assertExpression(js);js='if (!('+js+'))';isIf=true;break;case 'else if':assertExpression(js);js='else if ('+js+')';isIf=true;isElse=true;break;case 'else':if(js&&js.trim()){throw new Error('`else` cannot have a condition, perhaps you meant `else if`');}js='else';isElse=true;break;}var tok=this.tok('code',js);tok.isElse=isElse;tok.isIf=isIf;tok.requiresBlock=true;return tok;}}, /**
   * While.
   */"while":function _while(){var captures;if(captures=/^while +([^\n]+)/.exec(this.input)){this.consume(captures[0].length);assertExpression(captures[1]);var tok=this.tok('code','while ('+captures[1]+')');tok.requiresBlock=true;return tok;}}, /**
   * Each.
   */each:function each(){var captures;if(captures=/^(?:- *)?(?:each|for) +([a-zA-Z_$][\w$]*)(?: *, *([a-zA-Z_$][\w$]*))? * in *([^\n]+)/.exec(this.input)){this.consume(captures[0].length);var tok=this.tok('each',captures[1]);tok.key=captures[2]||'$index';assertExpression(captures[3]);tok.code=captures[3];return tok;}}, /**
   * Code.
   */code:function code(){var captures;if(captures=/^(!?=|-)[ \t]*([^\n]+)/.exec(this.input)){this.consume(captures[0].length);var flags=captures[1];captures[1]=captures[2];var tok=this.tok('code',captures[1]);tok.escape=flags.charAt(0)==='=';tok.buffer=flags.charAt(0)==='='||flags.charAt(1)==='=';if(tok.buffer)assertExpression(captures[1]);return tok;}}, /**
   * Block code.
   */blockCode:function blockCode(){var captures;if(captures=/^-\n/.exec(this.input)){this.consume(captures[0].length-1);var tok=this.tok('blockCode');this.pipeless=true;return tok;}}, /**
   * Attributes.
   */attrs:function attrs(){if('('==this.input.charAt(0)){var index=this.bracketExpression().end,str=this.input.substr(1,index-1),tok=this.tok('attrs');assertNestingCorrect(str);var quote='';var interpolate=function interpolate(attr){return attr.replace(/(\\)?#\{(.+)/g,function(_,escape,expr){if(escape)return _;try{var range=characterParser.parseMax(expr);if(expr[range.end]!=='}')return _.substr(0,2)+interpolate(_.substr(2));assertExpression(range.src);return quote+" + ("+range.src+") + "+quote+interpolate(expr.substr(range.end+1));}catch(ex){return _.substr(0,2)+interpolate(_.substr(2));}});};this.consume(index+1);tok.attrs=[];var escapedAttr=true;var key='';var val='';var interpolatable='';var state=characterParser.defaultState();var loc='key';var isEndOfAttribute=function isEndOfAttribute(i){if(key.trim()==='')return false;if(i===str.length)return true;if(loc==='key'){if(str[i]===' '||str[i]==='\n'){for(var x=i;x<str.length;x++){if(str[x]!=' '&&str[x]!='\n'){if(str[x]==='='||str[x]==='!'||str[x]===',')return false;else return true;}}}return str[i]===',';}else if(loc==='value'&&!state.isNesting()){try{assertExpression(val);if(str[i]===' '||str[i]==='\n'){for(var x=i;x<str.length;x++){if(str[x]!=' '&&str[x]!='\n'){if(characterParser.isPunctuator(str[x])&&str[x]!='"'&&str[x]!="'")return false;else return true;}}}return str[i]===',';}catch(ex){return false;}}};this.lineno+=str.split("\n").length-1;for(var i=0;i<=str.length;i++){if(isEndOfAttribute(i)){val=val.trim();if(val)assertExpression(val);key=key.trim();key=key.replace(/^['"]|['"]$/g,'');tok.attrs.push({name:key,val:''==val?true:val,escaped:escapedAttr});key=val='';loc='key';escapedAttr=false;}else {switch(loc){case 'key-char':if(str[i]===quote){loc='key';if(i+1<str.length&&[' ',',','!','=','\n'].indexOf(str[i+1])===-1)throw new Error('Unexpected character '+str[i+1]+' expected ` `, `\\n`, `,`, `!` or `=`');}else {key+=str[i];}break;case 'key':if(key===''&&(str[i]==='"'||str[i]==="'")){loc='key-char';quote=str[i];}else if(str[i]==='!'||str[i]==='='){escapedAttr=str[i]!=='!';if(str[i]==='!')i++;if(str[i]!=='=')throw new Error('Unexpected character '+str[i]+' expected `=`');loc='value';state=characterParser.defaultState();}else {key+=str[i];}break;case 'value':state=characterParser.parseChar(str[i],state);if(state.isString()){loc='string';quote=str[i];interpolatable=str[i];}else {val+=str[i];}break;case 'string':state=characterParser.parseChar(str[i],state);interpolatable+=str[i];if(!state.isString()){loc='value';val+=interpolate(interpolatable);}break;}}}if('/'==this.input.charAt(0)){this.consume(1);tok.selfClosing=true;}return tok;}}, /**
   * &attributes block
   */attributesBlock:function attributesBlock(){var captures;if(/^&attributes\b/.test(this.input)){this.consume(11);var args=this.bracketExpression();this.consume(args.end+1);return this.tok('&attributes',args.src);}}, /**
   * Indent | Outdent | Newline.
   */indent:function indent(){var captures,re; // established regexp
if(this.indentRe){captures=this.indentRe.exec(this.input); // determine regexp
}else { // tabs
re=/^\n(\t*) */;captures=re.exec(this.input); // spaces
if(captures&&!captures[1].length){re=/^\n( *)/;captures=re.exec(this.input);} // established
if(captures&&captures[1].length)this.indentRe=re;}if(captures){var tok,indents=captures[1].length;++this.lineno;this.consume(indents+1);if(' '==this.input[0]||'\t'==this.input[0]){throw new Error('Invalid indentation, you can use tabs or spaces but not both');} // blank line
if('\n'==this.input[0]){this.pipeless=false;return this.tok('newline');} // outdent
if(this.indentStack.length&&indents<this.indentStack[0]){while(this.indentStack.length&&this.indentStack[0]>indents){this.stash.push(this.tok('outdent'));this.indentStack.shift();}tok=this.stash.pop(); // indent
}else if(indents&&indents!=this.indentStack[0]){this.indentStack.unshift(indents);tok=this.tok('indent',indents); // newline
}else {tok=this.tok('newline');}this.pipeless=false;return tok;}}, /**
   * Pipe-less text consumed only when
   * pipeless is true;
   */pipelessText:function pipelessText(){if(!this.pipeless)return;var captures,re; // established regexp
if(this.indentRe){captures=this.indentRe.exec(this.input); // determine regexp
}else { // tabs
re=/^\n(\t*) */;captures=re.exec(this.input); // spaces
if(captures&&!captures[1].length){re=/^\n( *)/;captures=re.exec(this.input);} // established
if(captures&&captures[1].length)this.indentRe=re;}var indents=captures&&captures[1].length;if(indents&&(this.indentStack.length===0||indents>this.indentStack[0])){var indent=captures[1];var line;var tokens=[];var isMatch;do { // text has `\n` as a prefix
var i=this.input.substr(1).indexOf('\n');if(-1==i)i=this.input.length-1;var str=this.input.substr(1,i);isMatch=str.substr(0,indent.length)===indent||!str.trim();if(isMatch){ // consume test along with `\n` prefix if match
this.consume(str.length+1);++this.lineno;tokens.push(str.substr(indent.length));}}while(this.input.length&&isMatch);while(this.input.length===0&&tokens[tokens.length-1]===''){tokens.pop();}return this.tok('pipeless-text',tokens);}}, /**
   * ':'
   */colon:function colon(){var good=/^: +/.test(this.input);var res=this.scan(/^: */,':');if(res&&!good){console.warn('Warning: space required after `:` on line '+this.lineno+' of jade file "'+this.filename+'"');}return res;},fail:function fail(){throw new Error('unexpected text '+this.input.substr(0,5));}, /**
   * Return the next token object, or those
   * previously stashed by lookahead.
   *
   * @return {Object}
   * @api private
   */advance:function advance(){return this.stashed()||this.next();}, /**
   * Return the next token object.
   *
   * @return {Object}
   * @api private
   */next:function next(){return this.deferred()||this.blank()||this.eos()||this.pipelessText()||this.yield()||this.doctype()||this.interpolation()||this["case"]()||this.when()||this["default"]()||this["extends"]()||this.append()||this.prepend()||this.block()||this.mixinBlock()||this.include()||this.includeFiltered()||this.mixin()||this.call()||this.conditional()||this.each()||this["while"]()||this.tag()||this.filter()||this.blockCode()||this.code()||this.id()||this.className()||this.attrs()||this.attributesBlock()||this.indent()||this.text()||this.comment()||this.colon()||this.dot()||this.textFail()||this.fail();}};},{"./utils":45,"character-parser":18}],27:[function(require,module,exports){'use strict';var Node=require('./node'); /**
 * Initialize a `Attrs` node.
 *
 * @api public
 */var Attrs=module.exports=function Attrs(){this.attributeNames=[];this.attrs=[];this.attributeBlocks=[];}; // Inherit from `Node`.
Attrs.prototype=Object.create(Node.prototype);Attrs.prototype.constructor=Attrs;Attrs.prototype.type='Attrs'; /**
 * Set attribute `name` to `val`, keep in mind these become
 * part of a raw js object literal, so to quote a value you must
 * '"quote me"', otherwise or example 'user.name' is literal JavaScript.
 *
 * @param {String} name
 * @param {String} val
 * @param {Boolean} escaped
 * @return {Tag} for chaining
 * @api public
 */Attrs.prototype.setAttribute=function(name,val,escaped){if(name!=='class'&&this.attributeNames.indexOf(name)!==-1){throw new Error('Duplicate attribute "'+name+'" is not allowed.');}this.attributeNames.push(name);this.attrs.push({name:name,val:val,escaped:escaped});return this;}; /**
 * Remove attribute `name` when present.
 *
 * @param {String} name
 * @api public
 */Attrs.prototype.removeAttribute=function(name){var err=new Error('attrs.removeAttribute is deprecated and will be removed in v2.0.0');console.warn(err.stack);for(var i=0,len=this.attrs.length;i<len;++i){if(this.attrs[i]&&this.attrs[i].name==name){delete this.attrs[i];}}}; /**
 * Get attribute value by `name`.
 *
 * @param {String} name
 * @return {String}
 * @api public
 */Attrs.prototype.getAttribute=function(name){var err=new Error('attrs.getAttribute is deprecated and will be removed in v2.0.0');console.warn(err.stack);for(var i=0,len=this.attrs.length;i<len;++i){if(this.attrs[i]&&this.attrs[i].name==name){return this.attrs[i].val;}}};Attrs.prototype.addAttributes=function(src){this.attributeBlocks.push(src);};},{"./node":40}],28:[function(require,module,exports){'use strict';var Node=require('./node'); /**
 * Initialize a `BlockComment` with the given `block`.
 *
 * @param {String} val
 * @param {Block} block
 * @param {Boolean} buffer
 * @api public
 */var BlockComment=module.exports=function BlockComment(val,block,buffer){this.block=block;this.val=val;this.buffer=buffer;}; // Inherit from `Node`.
BlockComment.prototype=Object.create(Node.prototype);BlockComment.prototype.constructor=BlockComment;BlockComment.prototype.type='BlockComment';},{"./node":40}],29:[function(require,module,exports){'use strict';var Node=require('./node'); /**
 * Initialize a new `Block` with an optional `node`.
 *
 * @param {Node} node
 * @api public
 */var Block=module.exports=function Block(node){this.nodes=[];if(node)this.push(node);}; // Inherit from `Node`.
Block.prototype=Object.create(Node.prototype);Block.prototype.constructor=Block;Block.prototype.type='Block'; /**
 * Block flag.
 */Block.prototype.isBlock=true; /**
 * Replace the nodes in `other` with the nodes
 * in `this` block.
 *
 * @param {Block} other
 * @api private
 */Block.prototype.replace=function(other){var err=new Error('block.replace is deprecated and will be removed in v2.0.0');console.warn(err.stack);other.nodes=this.nodes;}; /**
 * Push the given `node`.
 *
 * @param {Node} node
 * @return {Number}
 * @api public
 */Block.prototype.push=function(node){return this.nodes.push(node);}; /**
 * Check if this block is empty.
 *
 * @return {Boolean}
 * @api public
 */Block.prototype.isEmpty=function(){return 0==this.nodes.length;}; /**
 * Unshift the given `node`.
 *
 * @param {Node} node
 * @return {Number}
 * @api public
 */Block.prototype.unshift=function(node){return this.nodes.unshift(node);}; /**
 * Return the "last" block, or the first `yield` node.
 *
 * @return {Block}
 * @api private
 */Block.prototype.includeBlock=function(){var ret=this,node;for(var i=0,len=this.nodes.length;i<len;++i){node=this.nodes[i];if(node.yield)return node;else if(node.textOnly)continue;else if(node.includeBlock)ret=node.includeBlock();else if(node.block&&!node.block.isEmpty())ret=node.block.includeBlock();if(ret.yield)return ret;}return ret;}; /**
 * Return a clone of this block.
 *
 * @return {Block}
 * @api private
 */Block.prototype.clone=function(){var err=new Error('block.clone is deprecated and will be removed in v2.0.0');console.warn(err.stack);var clone=new Block();for(var i=0,len=this.nodes.length;i<len;++i){clone.push(this.nodes[i].clone());}return clone;};},{"./node":40}],30:[function(require,module,exports){'use strict';var Node=require('./node'); /**
 * Initialize a new `Case` with `expr`.
 *
 * @param {String} expr
 * @api public
 */var Case=exports=module.exports=function Case(expr,block){this.expr=expr;this.block=block;}; // Inherit from `Node`.
Case.prototype=Object.create(Node.prototype);Case.prototype.constructor=Case;Case.prototype.type='Case';var When=exports.When=function When(expr,block){this.expr=expr;this.block=block;this.debug=false;}; // Inherit from `Node`.
When.prototype=Object.create(Node.prototype);When.prototype.constructor=When;When.prototype.type='When';},{"./node":40}],31:[function(require,module,exports){'use strict';var Node=require('./node'); /**
 * Initialize a `Code` node with the given code `val`.
 * Code may also be optionally buffered and escaped.
 *
 * @param {String} val
 * @param {Boolean} buffer
 * @param {Boolean} escape
 * @api public
 */var Code=module.exports=function Code(val,buffer,escape){this.val=val;this.buffer=buffer;this.escape=escape;if(val.match(/^ *else/))this.debug=false;}; // Inherit from `Node`.
Code.prototype=Object.create(Node.prototype);Code.prototype.constructor=Code;Code.prototype.type='Code'; // prevent the minifiers removing this
},{"./node":40}],32:[function(require,module,exports){'use strict';var Node=require('./node'); /**
 * Initialize a `Comment` with the given `val`, optionally `buffer`,
 * otherwise the comment may render in the output.
 *
 * @param {String} val
 * @param {Boolean} buffer
 * @api public
 */var Comment=module.exports=function Comment(val,buffer){this.val=val;this.buffer=buffer;}; // Inherit from `Node`.
Comment.prototype=Object.create(Node.prototype);Comment.prototype.constructor=Comment;Comment.prototype.type='Comment';},{"./node":40}],33:[function(require,module,exports){'use strict';var Node=require('./node'); /**
 * Initialize a `Doctype` with the given `val`. 
 *
 * @param {String} val
 * @api public
 */var Doctype=module.exports=function Doctype(val){this.val=val;}; // Inherit from `Node`.
Doctype.prototype=Object.create(Node.prototype);Doctype.prototype.constructor=Doctype;Doctype.prototype.type='Doctype';},{"./node":40}],34:[function(require,module,exports){'use strict';var Node=require('./node'); /**
 * Initialize an `Each` node, representing iteration
 *
 * @param {String} obj
 * @param {String} val
 * @param {String} key
 * @param {Block} block
 * @api public
 */var Each=module.exports=function Each(obj,val,key,block){this.obj=obj;this.val=val;this.key=key;this.block=block;}; // Inherit from `Node`.
Each.prototype=Object.create(Node.prototype);Each.prototype.constructor=Each;Each.prototype.type='Each';},{"./node":40}],35:[function(require,module,exports){'use strict';var Node=require('./node'); /**
 * Initialize a `Filter` node with the given
 * filter `name` and `block`.
 *
 * @param {String} name
 * @param {Block|Node} block
 * @api public
 */var Filter=module.exports=function Filter(name,block,attrs){this.name=name;this.block=block;this.attrs=attrs;}; // Inherit from `Node`.
Filter.prototype=Object.create(Node.prototype);Filter.prototype.constructor=Filter;Filter.prototype.type='Filter';},{"./node":40}],36:[function(require,module,exports){'use strict';exports.Node=require('./node');exports.Tag=require('./tag');exports.Code=require('./code');exports.Each=require('./each');exports.Case=require('./case');exports.Text=require('./text');exports.Block=require('./block');exports.MixinBlock=require('./mixin-block');exports.Mixin=require('./mixin');exports.Filter=require('./filter');exports.Comment=require('./comment');exports.Literal=require('./literal');exports.BlockComment=require('./block-comment');exports.Doctype=require('./doctype');},{"./block":29,"./block-comment":28,"./case":30,"./code":31,"./comment":32,"./doctype":33,"./each":34,"./filter":35,"./literal":37,"./mixin":39,"./mixin-block":38,"./node":40,"./tag":41,"./text":42}],37:[function(require,module,exports){'use strict';var Node=require('./node'); /**
 * Initialize a `Literal` node with the given `str.
 *
 * @param {String} str
 * @api public
 */var Literal=module.exports=function Literal(str){this.str=str;}; // Inherit from `Node`.
Literal.prototype=Object.create(Node.prototype);Literal.prototype.constructor=Literal;Literal.prototype.type='Literal';},{"./node":40}],38:[function(require,module,exports){'use strict';var Node=require('./node'); /**
 * Initialize a new `Block` with an optional `node`.
 *
 * @param {Node} node
 * @api public
 */var MixinBlock=module.exports=function MixinBlock(){}; // Inherit from `Node`.
MixinBlock.prototype=Object.create(Node.prototype);MixinBlock.prototype.constructor=MixinBlock;MixinBlock.prototype.type='MixinBlock';},{"./node":40}],39:[function(require,module,exports){'use strict';var Attrs=require('./attrs'); /**
 * Initialize a new `Mixin` with `name` and `block`.
 *
 * @param {String} name
 * @param {String} args
 * @param {Block} block
 * @api public
 */var Mixin=module.exports=function Mixin(name,args,block,call){Attrs.call(this);this.name=name;this.args=args;this.block=block;this.call=call;}; // Inherit from `Attrs`.
Mixin.prototype=Object.create(Attrs.prototype);Mixin.prototype.constructor=Mixin;Mixin.prototype.type='Mixin';},{"./attrs":27}],40:[function(require,module,exports){'use strict';var Node=module.exports=function Node(){}; /**
 * Clone this node (return itself)
 *
 * @return {Node}
 * @api private
 */Node.prototype.clone=function(){var err=new Error('node.clone is deprecated and will be removed in v2.0.0');console.warn(err.stack);return this;};Node.prototype.type='';},{}],41:[function(require,module,exports){'use strict';var Attrs=require('./attrs');var Block=require('./block');var inlineTags=require('../inline-tags'); /**
 * Initialize a `Tag` node with the given tag `name` and optional `block`.
 *
 * @param {String} name
 * @param {Block} block
 * @api public
 */var Tag=module.exports=function Tag(name,block){Attrs.call(this);this.name=name;this.block=block||new Block();}; // Inherit from `Attrs`.
Tag.prototype=Object.create(Attrs.prototype);Tag.prototype.constructor=Tag;Tag.prototype.type='Tag'; /**
 * Clone this tag.
 *
 * @return {Tag}
 * @api private
 */Tag.prototype.clone=function(){var err=new Error('tag.clone is deprecated and will be removed in v2.0.0');console.warn(err.stack);var clone=new Tag(this.name,this.block.clone());clone.line=this.line;clone.attrs=this.attrs;clone.textOnly=this.textOnly;return clone;}; /**
 * Check if this tag is an inline tag.
 *
 * @return {Boolean}
 * @api private
 */Tag.prototype.isInline=function(){return ~inlineTags.indexOf(this.name);}; /**
 * Check if this tag's contents can be inlined.  Used for pretty printing.
 *
 * @return {Boolean}
 * @api private
 */Tag.prototype.canInline=function(){var nodes=this.block.nodes;function isInline(node){ // Recurse if the node is a block
if(node.isBlock)return node.nodes.every(isInline);return node.isText||node.isInline&&node.isInline();} // Empty tag
if(!nodes.length)return true; // Text-only or inline-only tag
if(1==nodes.length)return isInline(nodes[0]); // Multi-line inline-only tag
if(this.block.nodes.every(isInline)){for(var i=1,len=nodes.length;i<len;++i){if(nodes[i-1].isText&&nodes[i].isText)return false;}return true;} // Mixed tag
return false;};},{"../inline-tags":25,"./attrs":27,"./block":29}],42:[function(require,module,exports){'use strict';var Node=require('./node'); /**
 * Initialize a `Text` node with optional `line`.
 *
 * @param {String} line
 * @api public
 */var Text=module.exports=function Text(line){this.val=line;}; // Inherit from `Node`.
Text.prototype=Object.create(Node.prototype);Text.prototype.constructor=Text;Text.prototype.type='Text'; /**
 * Flag as text.
 */Text.prototype.isText=true;},{"./node":40}],43:[function(require,module,exports){'use strict';var Lexer=require('./lexer');var nodes=require('./nodes');var utils=require('./utils');var filters=require('./filters');var path=require('path');var constantinople=require('constantinople');var parseJSExpression=require('character-parser').parseMax;var extname=path.extname; /**
 * Initialize `Parser` with the given input `str` and `filename`.
 *
 * @param {String} str
 * @param {String} filename
 * @param {Object} options
 * @api public
 */var Parser=exports=module.exports=function Parser(str,filename,options){ //Strip any UTF-8 BOM off of the start of `str`, if it exists.
this.input=str.replace(/^\uFEFF/,'');this.lexer=new Lexer(this.input,filename);this.filename=filename;this.blocks={};this.mixins={};this.options=options;this.contexts=[this];this.inMixin=0;this.dependencies=[];this.inBlock=0;}; /**
 * Parser prototype.
 */Parser.prototype={ /**
   * Save original constructor
   */constructor:Parser, /**
   * Push `parser` onto the context stack,
   * or pop and return a `Parser`.
   */context:function context(parser){if(parser){this.contexts.push(parser);}else {return this.contexts.pop();}}, /**
   * Return the next token object.
   *
   * @return {Object}
   * @api private
   */advance:function advance(){return this.lexer.advance();}, /**
   * Single token lookahead.
   *
   * @return {Object}
   * @api private
   */peek:function peek(){return this.lookahead(1);}, /**
   * Return lexer lineno.
   *
   * @return {Number}
   * @api private
   */line:function line(){return this.lexer.lineno;}, /**
   * `n` token lookahead.
   *
   * @param {Number} n
   * @return {Object}
   * @api private
   */lookahead:function lookahead(n){return this.lexer.lookahead(n);}, /**
   * Parse input returning a string of js for evaluation.
   *
   * @return {String}
   * @api public
   */parse:function parse(){var block=new nodes.Block(),parser;block.line=0;block.filename=this.filename;while('eos'!=this.peek().type){if('newline'==this.peek().type){this.advance();}else {var next=this.peek();var expr=this.parseExpr();expr.filename=expr.filename||this.filename;expr.line=next.line;block.push(expr);}}if(parser=this.extending){this.context(parser);var ast=parser.parse();this.context(); // hoist mixins
for(var name in this.mixins){ast.unshift(this.mixins[name]);}return ast;}if(!this.extending&&!this.included&&Object.keys(this.blocks).length){var blocks=[];utils.walkAST(block,function(node){if(node.type==='Block'&&node.name){blocks.push(node.name);}});Object.keys(this.blocks).forEach(function(name){if(blocks.indexOf(name)===-1&&!this.blocks[name].isSubBlock){console.warn('Warning: Unexpected block "'+name+'" '+' on line '+this.blocks[name].line+' of '+this.blocks[name].filename+'. This block is never used. This warning will be an error in v2.0.0');}}.bind(this));}return block;}, /**
   * Expect the given type, or throw an exception.
   *
   * @param {String} type
   * @api private
   */expect:function expect(type){if(this.peek().type===type){return this.advance();}else {throw new Error('expected "'+type+'", but got "'+this.peek().type+'"');}}, /**
   * Accept the given `type`.
   *
   * @param {String} type
   * @api private
   */accept:function accept(type){if(this.peek().type===type){return this.advance();}}, /**
   *   tag
   * | doctype
   * | mixin
   * | include
   * | filter
   * | comment
   * | text
   * | each
   * | code
   * | yield
   * | id
   * | class
   * | interpolation
   */parseExpr:function parseExpr(){switch(this.peek().type){case 'tag':return this.parseTag();case 'mixin':return this.parseMixin();case 'block':return this.parseBlock();case 'mixin-block':return this.parseMixinBlock();case 'case':return this.parseCase();case 'extends':return this.parseExtends();case 'include':return this.parseInclude();case 'doctype':return this.parseDoctype();case 'filter':return this.parseFilter();case 'comment':return this.parseComment();case 'text':return this.parseText();case 'each':return this.parseEach();case 'code':return this.parseCode();case 'blockCode':return this.parseBlockCode();case 'call':return this.parseCall();case 'interpolation':return this.parseInterpolation();case 'yield':this.advance();var block=new nodes.Block();block.yield=true;return block;case 'id':case 'class':var tok=this.advance();this.lexer.defer(this.lexer.tok('tag','div'));this.lexer.defer(tok);return this.parseExpr();default:throw new Error('unexpected token "'+this.peek().type+'"');}}, /**
   * Text
   */parseText:function parseText(){var tok=this.expect('text');var tokens=this.parseInlineTagsInText(tok.val);if(tokens.length===1)return tokens[0];var node=new nodes.Block();for(var i=0;i<tokens.length;i++){node.push(tokens[i]);};return node;}, /**
   *   ':' expr
   * | block
   */parseBlockExpansion:function parseBlockExpansion(){if(':'==this.peek().type){this.advance();return new nodes.Block(this.parseExpr());}else {return this.block();}}, /**
   * case
   */parseCase:function parseCase(){var val=this.expect('case').val;var node=new nodes.Case(val);node.line=this.line();var block=new nodes.Block();block.line=this.line();block.filename=this.filename;this.expect('indent');while('outdent'!=this.peek().type){switch(this.peek().type){case 'comment':case 'newline':this.advance();break;case 'when':block.push(this.parseWhen());break;case 'default':block.push(this.parseDefault());break;default:throw new Error('Unexpected token "'+this.peek().type+'", expected "when", "default" or "newline"');}}this.expect('outdent');node.block=block;return node;}, /**
   * when
   */parseWhen:function parseWhen(){var val=this.expect('when').val;if(this.peek().type!=='newline')return new nodes.Case.When(val,this.parseBlockExpansion());else return new nodes.Case.When(val);}, /**
   * default
   */parseDefault:function parseDefault(){this.expect('default');return new nodes.Case.When('default',this.parseBlockExpansion());}, /**
   * code
   */parseCode:function parseCode(afterIf){var tok=this.expect('code');var node=new nodes.Code(tok.val,tok.buffer,tok.escape);var block;node.line=this.line(); // throw an error if an else does not have an if
if(tok.isElse&&!tok.hasIf){throw new Error('Unexpected else without if');} // handle block
block='indent'==this.peek().type;if(block){node.block=this.block();} // handle missing block
if(tok.requiresBlock&&!block){node.block=new nodes.Block();} // mark presense of if for future elses
if(tok.isIf&&this.peek().isElse){this.peek().hasIf=true;}else if(tok.isIf&&this.peek().type==='newline'&&this.lookahead(2).isElse){this.lookahead(2).hasIf=true;}return node;}, /**
   * block code
   */parseBlockCode:function parseBlockCode(){var tok=this.expect('blockCode');var node;var body=this.peek();var text;if(body.type==='pipeless-text'){this.advance();text=body.val.join('\n');}else {text='';}node=new nodes.Code(text,false,false);return node;}, /**
   * comment
   */parseComment:function parseComment(){var tok=this.expect('comment');var node;var block;if(block=this.parseTextBlock()){node=new nodes.BlockComment(tok.val,block,tok.buffer);}else {node=new nodes.Comment(tok.val,tok.buffer);}node.line=this.line();return node;}, /**
   * doctype
   */parseDoctype:function parseDoctype(){var tok=this.expect('doctype');var node=new nodes.Doctype(tok.val);node.line=this.line();return node;}, /**
   * filter attrs? text-block
   */parseFilter:function parseFilter(){var tok=this.expect('filter');var attrs=this.accept('attrs');var block;block=this.parseTextBlock()||new nodes.Block();var options={};if(attrs){attrs.attrs.forEach(function(attribute){options[attribute.name]=constantinople.toConstant(attribute.val);});}var node=new nodes.Filter(tok.val,block,options);node.line=this.line();return node;}, /**
   * each block
   */parseEach:function parseEach(){var tok=this.expect('each');var node=new nodes.Each(tok.code,tok.val,tok.key);node.line=this.line();node.block=this.block();if(this.peek().type=='code'&&this.peek().val=='else'){this.advance();node.alternative=this.block();}return node;}, /**
   * Resolves a path relative to the template for use in
   * includes and extends
   *
   * @param {String}  path
   * @param {String}  purpose  Used in error messages.
   * @return {String}
   * @api private
   */resolvePath:function resolvePath(path,purpose){var p=require('path');var dirname=p.dirname;var basename=p.basename;var join=p.join;if(path[0]!=='/'&&!this.filename)throw new Error('the "filename" option is required to use "'+purpose+'" with "relative" paths');if(path[0]==='/'&&!this.options.basedir)throw new Error('the "basedir" option is required to use "'+purpose+'" with "absolute" paths');path=join(path[0]==='/'?this.options.basedir:dirname(this.filename),path);if(basename(path).indexOf('.')===-1)path+='.jade';return path;}, /**
   * 'extends' name
   */parseExtends:function parseExtends(){var fs=require('fs');var path=this.resolvePath(this.expect('extends').val.trim(),'extends');if('.jade'!=path.substr(-5))path+='.jade';this.dependencies.push(path);var str=fs.readFileSync(path,'utf8');var parser=new this.constructor(str,path,this.options);parser.dependencies=this.dependencies;parser.blocks=this.blocks;parser.included=this.included;parser.contexts=this.contexts;this.extending=parser; // TODO: null node
return new nodes.Literal('');}, /**
   * 'block' name block
   */parseBlock:function parseBlock(){var block=this.expect('block');var mode=block.mode;var name=block.val.trim();var line=block.line;this.inBlock++;block='indent'==this.peek().type?this.block():new nodes.Block(new nodes.Literal(''));this.inBlock--;block.name=name;block.line=line;var prev=this.blocks[name]||{prepended:[],appended:[]};if(prev.mode==='replace')return this.blocks[name]=prev;var allNodes=prev.prepended.concat(block.nodes).concat(prev.appended);switch(mode){case 'append':prev.appended=prev.parser===this?prev.appended.concat(block.nodes):block.nodes.concat(prev.appended);break;case 'prepend':prev.prepended=prev.parser===this?block.nodes.concat(prev.prepended):prev.prepended.concat(block.nodes);break;}block.nodes=allNodes;block.appended=prev.appended;block.prepended=prev.prepended;block.mode=mode;block.parser=this;block.isSubBlock=this.inBlock>0;return this.blocks[name]=block;},parseMixinBlock:function parseMixinBlock(){var block=this.expect('mixin-block');if(!this.inMixin){throw new Error('Anonymous blocks are not allowed unless they are part of a mixin.');}return new nodes.MixinBlock();}, /**
   * include block?
   */parseInclude:function parseInclude(){var fs=require('fs');var tok=this.expect('include');var path=this.resolvePath(tok.val.trim(),'include');this.dependencies.push(path); // has-filter
if(tok.filter){var str=fs.readFileSync(path,'utf8').replace(/\r/g,'');var options={filename:path};if(tok.attrs){tok.attrs.attrs.forEach(function(attribute){options[attribute.name]=constantinople.toConstant(attribute.val);});}str=filters(tok.filter,str,options);return new nodes.Literal(str);} // non-jade
if('.jade'!=path.substr(-5)){var str=fs.readFileSync(path,'utf8').replace(/\r/g,'');return new nodes.Literal(str);}var str=fs.readFileSync(path,'utf8');var parser=new this.constructor(str,path,this.options);parser.dependencies=this.dependencies;parser.blocks=utils.merge({},this.blocks);parser.included=true;parser.mixins=this.mixins;this.context(parser);var ast=parser.parse();this.context();ast.filename=path;if('indent'==this.peek().type){ast.includeBlock().push(this.block());}return ast;}, /**
   * call ident block
   */parseCall:function parseCall(){var tok=this.expect('call');var name=tok.val;var args=tok.args;var mixin=new nodes.Mixin(name,args,new nodes.Block(),true);this.tag(mixin);if(mixin.code){mixin.block.push(mixin.code);mixin.code=null;}if(mixin.block.isEmpty())mixin.block=null;return mixin;}, /**
   * mixin block
   */parseMixin:function parseMixin(){var tok=this.expect('mixin');var name=tok.val;var args=tok.args;var mixin; // definition
if('indent'==this.peek().type){this.inMixin++;mixin=new nodes.Mixin(name,args,this.block(),false);this.mixins[name]=mixin;this.inMixin--;return mixin; // call
}else {return new nodes.Mixin(name,args,null,true);}},parseInlineTagsInText:function parseInlineTagsInText(str){var line=this.line();var match=/(\\)?#\[((?:.|\n)*)$/.exec(str);if(match){if(match[1]){ // escape
var text=new nodes.Text(str.substr(0,match.index)+'#[');text.line=line;var rest=this.parseInlineTagsInText(match[2]);if(rest[0].type==='Text'){text.val+=rest[0].val;rest.shift();}return [text].concat(rest);}else {var text=new nodes.Text(str.substr(0,match.index));text.line=line;var buffer=[text];var rest=match[2];var range=parseJSExpression(rest);var inner=new Parser(range.src,this.filename,this.options);buffer.push(inner.parse());return buffer.concat(this.parseInlineTagsInText(rest.substr(range.end+1)));}}else {var text=new nodes.Text(str);text.line=line;return [text];}}, /**
   * indent (text | newline)* outdent
   */parseTextBlock:function parseTextBlock(){var block=new nodes.Block();block.line=this.line();var body=this.peek();if(body.type!=='pipeless-text')return;this.advance();block.nodes=body.val.reduce(function(accumulator,text){return accumulator.concat(this.parseInlineTagsInText(text));}.bind(this),[]);return block;}, /**
   * indent expr* outdent
   */block:function block(){var block=new nodes.Block();block.line=this.line();block.filename=this.filename;this.expect('indent');while('outdent'!=this.peek().type){if('newline'==this.peek().type){this.advance();}else {var expr=this.parseExpr();expr.filename=this.filename;block.push(expr);}}this.expect('outdent');return block;}, /**
   * interpolation (attrs | class | id)* (text | code | ':')? newline* block?
   */parseInterpolation:function parseInterpolation(){var tok=this.advance();var tag=new nodes.Tag(tok.val);tag.buffer=true;return this.tag(tag);}, /**
   * tag (attrs | class | id)* (text | code | ':')? newline* block?
   */parseTag:function parseTag(){var tok=this.advance();var tag=new nodes.Tag(tok.val);tag.selfClosing=tok.selfClosing;return this.tag(tag);}, /**
   * Parse tag.
   */tag:function tag(_tag){_tag.line=this.line();var seenAttrs=false; // (attrs | class | id)*
out: while(true){switch(this.peek().type){case 'id':case 'class':var tok=this.advance();_tag.setAttribute(tok.type,"'"+tok.val+"'");continue;case 'attrs':if(seenAttrs){console.warn(this.filename+', line '+this.peek().line+':\nYou should not have jade tags with multiple attributes.');}seenAttrs=true;var tok=this.advance();var attrs=tok.attrs;if(tok.selfClosing)_tag.selfClosing=true;for(var i=0;i<attrs.length;i++){_tag.setAttribute(attrs[i].name,attrs[i].val,attrs[i].escaped);}continue;case '&attributes':var tok=this.advance();_tag.addAttributes(tok.val);break;default:break out;}} // check immediate '.'
if('dot'==this.peek().type){_tag.textOnly=true;this.advance();} // (text | code | ':')?
switch(this.peek().type){case 'text':_tag.block.push(this.parseText());break;case 'code':_tag.code=this.parseCode();break;case ':':this.advance();_tag.block=new nodes.Block();_tag.block.push(this.parseExpr());break;case 'newline':case 'indent':case 'outdent':case 'eos':case 'pipeless-text':break;default:throw new Error('Unexpected token `'+this.peek().type+'` expected `text`, `code`, `:`, `newline` or `eos`');} // newline*
while('newline'==this.peek().type){this.advance();} // block?
if(_tag.textOnly){_tag.block=this.parseTextBlock()||new nodes.Block();}else if('indent'==this.peek().type){var block=this.block();for(var i=0,len=block.nodes.length;i<len;++i){_tag.block.push(block.nodes[i]);}}return _tag;}};},{"./filters":23,"./lexer":26,"./nodes":36,"./utils":45,"character-parser":18,"constantinople":19,"fs":17,"path":51}],44:[function(require,module,exports){'use strict'; /**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */exports.merge=function merge(a,b){if(arguments.length===1){var attrs=a[0];for(var i=1;i<a.length;i++){attrs=merge(attrs,a[i]);}return attrs;}var ac=a['class'];var bc=b['class'];if(ac||bc){ac=ac||[];bc=bc||[];if(!Array.isArray(ac))ac=[ac];if(!Array.isArray(bc))bc=[bc];a['class']=ac.concat(bc).filter(nulls);}for(var key in b){if(key!='class'){a[key]=b[key];}}return a;}; /**
 * Filter null `val`s.
 *
 * @param {*} val
 * @return {Boolean}
 * @api private
 */function nulls(val){return val!=null&&val!=='';} /**
 * join array as classes.
 *
 * @param {*} val
 * @return {String}
 */exports.joinClasses=joinClasses;function joinClasses(val){return (Array.isArray(val)?val.map(joinClasses):val&&(typeof val==="undefined"?"undefined":_typeof(val))==='object'?Object.keys(val).filter(function(key){return val[key];}):[val]).filter(nulls).join(' ');} /**
 * Render the given classes.
 *
 * @param {Array} classes
 * @param {Array.<Boolean>} escaped
 * @return {String}
 */exports.cls=function cls(classes,escaped){var buf=[];for(var i=0;i<classes.length;i++){if(escaped&&escaped[i]){buf.push(exports.escape(joinClasses([classes[i]])));}else {buf.push(joinClasses(classes[i]));}}var text=joinClasses(buf);if(text.length){return ' class="'+text+'"';}else {return '';}};exports.style=function(val){if(val&&(typeof val==="undefined"?"undefined":_typeof(val))==='object'){return Object.keys(val).map(function(style){return style+':'+val[style];}).join(';');}else {return val;}}; /**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */exports.attr=function attr(key,val,escaped,terse){if(key==='style'){val=exports.style(val);}if('boolean'==typeof val||null==val){if(val){return ' '+(terse?key:key+'="'+key+'"');}else {return '';}}else if(0==key.indexOf('data')&&'string'!=typeof val){if(JSON.stringify(val).indexOf('&')!==-1){console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes '+'will be escaped to `&amp;`');};if(val&&typeof val.toISOString==='function'){console.warn('Jade will eliminate the double quotes around dates in '+'ISO form after 2.0.0');}return ' '+key+"='"+JSON.stringify(val).replace(/'/g,'&apos;')+"'";}else if(escaped){if(val&&typeof val.toISOString==='function'){console.warn('Jade will stringify dates in ISO form after 2.0.0');}return ' '+key+'="'+exports.escape(val)+'"';}else {if(val&&typeof val.toISOString==='function'){console.warn('Jade will stringify dates in ISO form after 2.0.0');}return ' '+key+'="'+val+'"';}}; /**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 */exports.attrs=function attrs(obj,terse){var buf=[];var keys=Object.keys(obj);if(keys.length){for(var i=0;i<keys.length;++i){var key=keys[i],val=obj[key];if('class'==key){if(val=joinClasses(val)){buf.push(' '+key+'="'+val+'"');}}else {buf.push(exports.attr(key,val,false,terse));}}}return buf.join('');}; /**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */var jade_encode_html_rules={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'};var jade_match_html=/[&<>"]/g;function jade_encode_char(c){return jade_encode_html_rules[c]||c;}exports.escape=jade_escape;function jade_escape(html){var result=String(html).replace(jade_match_html,jade_encode_char);if(result===''+html)return html;else return result;}; /**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */exports.rethrow=function rethrow(err,filename,lineno,str){if(!(err instanceof Error))throw err;if((typeof window!='undefined'||!filename)&&!str){err.message+=' on line '+lineno;throw err;}try{str=str||require('fs').readFileSync(filename,'utf8');}catch(ex){rethrow(err,null,lineno);}var context=3,lines=str.split('\n'),start=Math.max(lineno-context,0),end=Math.min(lines.length,lineno+context); // Error context
var context=lines.slice(start,end).map(function(line,i){var curr=i+start+1;return (curr==lineno?'  > ':'    ')+curr+'| '+line;}).join('\n'); // Alter exception message
err.path=filename;err.message=(filename||'Jade')+':'+lineno+'\n'+context+'\n\n'+err.message;throw err;};exports.DebugItem=function DebugItem(lineno,filename){this.lineno=lineno;this.filename=filename;};},{"fs":17}],45:[function(require,module,exports){'use strict'; /**
 * Merge `b` into `a`.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 * @api public
 */exports.merge=function(a,b){for(var key in b){a[key]=b[key];}return a;};exports.stringify=function(str){return JSON.stringify(str).replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029");};exports.walkAST=function walkAST(ast,before,after){before&&before(ast);switch(ast.type){case 'Block':ast.nodes.forEach(function(node){walkAST(node,before,after);});break;case 'Case':case 'Each':case 'Mixin':case 'Tag':case 'When':case 'Code':ast.block&&walkAST(ast.block,before,after);break;case 'Attrs':case 'BlockComment':case 'Comment':case 'Doctype':case 'Filter':case 'Literal':case 'MixinBlock':case 'Text':break;default:throw new Error('Unexpected node type '+ast.type);break;}after&&after(ast);};},{}],46:[function(require,module,exports){ /*!
 * jQuery JavaScript Library v2.2.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-02-22T19:11Z
 */(function(global,factory){if((typeof module==="undefined"?"undefined":_typeof(module))==="object"&&_typeof(module.exports)==="object"){ // For CommonJS and CommonJS-like environments where a proper `window`
// is present, execute the factory and get jQuery.
// For environments that do not have a `window` with a `document`
// (such as Node.js), expose a factory as module.exports.
// This accentuates the need for the creation of a real `window`.
// e.g. var jQuery = require("jquery")(window);
// See ticket #14549 for more info.
module.exports=global.document?factory(global,true):function(w){if(!w.document){throw new Error("jQuery requires a window with a document");}return factory(w);};}else {factory(global);} // Pass this if window is not defined yet
})(typeof window!=="undefined"?window:this,function(window,noGlobal){ // Support: Firefox 18+
// Can't be in strict mode, several libs including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
//"use strict";
var arr=[];var document=window.document;var _slice=arr.slice;var concat=arr.concat;var push=arr.push;var indexOf=arr.indexOf;var class2type={};var toString=class2type.toString;var hasOwn=class2type.hasOwnProperty;var support={};var version="2.2.1", // Define a local copy of jQuery
jQuery=function jQuery(selector,context){ // The jQuery object is actually just the init constructor 'enhanced'
// Need init if jQuery is called (just allow error to be thrown if not included)
return new jQuery.fn.init(selector,context);}, // Support: Android<4.1
// Make sure we trim BOM and NBSP
rtrim=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, // Matches dashed string for camelizing
rmsPrefix=/^-ms-/,rdashAlpha=/-([\da-z])/gi, // Used by jQuery.camelCase as callback to replace()
fcamelCase=function fcamelCase(all,letter){return letter.toUpperCase();};jQuery.fn=jQuery.prototype={ // The current version of jQuery being used
jquery:version,constructor:jQuery, // Start with an empty selector
selector:"", // The default length of a jQuery object is 0
length:0,toArray:function toArray(){return _slice.call(this);}, // Get the Nth element in the matched element set OR
// Get the whole matched element set as a clean array
get:function get(num){return num!=null? // Return just the one element from the set
num<0?this[num+this.length]:this[num]: // Return all the elements in a clean array
_slice.call(this);}, // Take an array of elements and push it onto the stack
// (returning the new matched element set)
pushStack:function pushStack(elems){ // Build a new jQuery matched element set
var ret=jQuery.merge(this.constructor(),elems); // Add the old object onto the stack (as a reference)
ret.prevObject=this;ret.context=this.context; // Return the newly-formed element set
return ret;}, // Execute a callback for every element in the matched set.
each:function each(callback){return jQuery.each(this,callback);},map:function map(callback){return this.pushStack(jQuery.map(this,function(elem,i){return callback.call(elem,i,elem);}));},slice:function slice(){return this.pushStack(_slice.apply(this,arguments));},first:function first(){return this.eq(0);},last:function last(){return this.eq(-1);},eq:function eq(i){var len=this.length,j=+i+(i<0?len:0);return this.pushStack(j>=0&&j<len?[this[j]]:[]);},end:function end(){return this.prevObject||this.constructor();}, // For internal use only.
// Behaves like an Array's method, not like a jQuery method.
push:push,sort:arr.sort,splice:arr.splice};jQuery.extend=jQuery.fn.extend=function(){var options,name,src,copy,copyIsArray,clone,target=arguments[0]||{},i=1,length=arguments.length,deep=false; // Handle a deep copy situation
if(typeof target==="boolean"){deep=target; // Skip the boolean and the target
target=arguments[i]||{};i++;} // Handle case when target is a string or something (possible in deep copy)
if((typeof target==="undefined"?"undefined":_typeof(target))!=="object"&&!jQuery.isFunction(target)){target={};} // Extend jQuery itself if only one argument is passed
if(i===length){target=this;i--;}for(;i<length;i++){ // Only deal with non-null/undefined values
if((options=arguments[i])!=null){ // Extend the base object
for(name in options){src=target[name];copy=options[name]; // Prevent never-ending loop
if(target===copy){continue;} // Recurse if we're merging plain objects or arrays
if(deep&&copy&&(jQuery.isPlainObject(copy)||(copyIsArray=jQuery.isArray(copy)))){if(copyIsArray){copyIsArray=false;clone=src&&jQuery.isArray(src)?src:[];}else {clone=src&&jQuery.isPlainObject(src)?src:{};} // Never move original objects, clone them
target[name]=jQuery.extend(deep,clone,copy); // Don't bring in undefined values
}else if(copy!==undefined){target[name]=copy;}}}} // Return the modified object
return target;};jQuery.extend({ // Unique for each copy of jQuery on the page
expando:"jQuery"+(version+Math.random()).replace(/\D/g,""), // Assume jQuery is ready without the ready module
isReady:true,error:function error(msg){throw new Error(msg);},noop:function noop(){},isFunction:function isFunction(obj){return jQuery.type(obj)==="function";},isArray:Array.isArray,isWindow:function isWindow(obj){return obj!=null&&obj===obj.window;},isNumeric:function isNumeric(obj){ // parseFloat NaNs numeric-cast false positives (null|true|false|"")
// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
// subtraction forces infinities to NaN
// adding 1 corrects loss of precision from parseFloat (#15100)
var realStringObj=obj&&obj.toString();return !jQuery.isArray(obj)&&realStringObj-parseFloat(realStringObj)+1>=0;},isPlainObject:function isPlainObject(obj){ // Not plain objects:
// - Any object or value whose internal [[Class]] property is not "[object Object]"
// - DOM nodes
// - window
if(jQuery.type(obj)!=="object"||obj.nodeType||jQuery.isWindow(obj)){return false;}if(obj.constructor&&!hasOwn.call(obj.constructor.prototype,"isPrototypeOf")){return false;} // If the function hasn't returned already, we're confident that
// |obj| is a plain object, created by {} or constructed with new Object
return true;},isEmptyObject:function isEmptyObject(obj){var name;for(name in obj){return false;}return true;},type:function type(obj){if(obj==null){return obj+"";} // Support: Android<4.0, iOS<6 (functionish RegExp)
return (typeof obj==="undefined"?"undefined":_typeof(obj))==="object"||typeof obj==="function"?class2type[toString.call(obj)]||"object":typeof obj==="undefined"?"undefined":_typeof(obj);}, // Evaluates a script in a global context
globalEval:function globalEval(code){var script,indirect=eval;code=jQuery.trim(code);if(code){ // If the code includes a valid, prologue position
// strict mode pragma, execute code by injecting a
// script tag into the document.
if(code.indexOf("use strict")===1){script=document.createElement("script");script.text=code;document.head.appendChild(script).parentNode.removeChild(script);}else { // Otherwise, avoid the DOM node creation, insertion
// and removal by using an indirect global eval
indirect(code);}}}, // Convert dashed to camelCase; used by the css and data modules
// Support: IE9-11+
// Microsoft forgot to hump their vendor prefix (#9572)
camelCase:function camelCase(string){return string.replace(rmsPrefix,"ms-").replace(rdashAlpha,fcamelCase);},nodeName:function nodeName(elem,name){return elem.nodeName&&elem.nodeName.toLowerCase()===name.toLowerCase();},each:function each(obj,callback){var length,i=0;if(isArrayLike(obj)){length=obj.length;for(;i<length;i++){if(callback.call(obj[i],i,obj[i])===false){break;}}}else {for(i in obj){if(callback.call(obj[i],i,obj[i])===false){break;}}}return obj;}, // Support: Android<4.1
trim:function trim(text){return text==null?"":(text+"").replace(rtrim,"");}, // results is for internal usage only
makeArray:function makeArray(arr,results){var ret=results||[];if(arr!=null){if(isArrayLike(Object(arr))){jQuery.merge(ret,typeof arr==="string"?[arr]:arr);}else {push.call(ret,arr);}}return ret;},inArray:function inArray(elem,arr,i){return arr==null?-1:indexOf.call(arr,elem,i);},merge:function merge(first,second){var len=+second.length,j=0,i=first.length;for(;j<len;j++){first[i++]=second[j];}first.length=i;return first;},grep:function grep(elems,callback,invert){var callbackInverse,matches=[],i=0,length=elems.length,callbackExpect=!invert; // Go through the array, only saving the items
// that pass the validator function
for(;i<length;i++){callbackInverse=!callback(elems[i],i);if(callbackInverse!==callbackExpect){matches.push(elems[i]);}}return matches;}, // arg is for internal usage only
map:function map(elems,callback,arg){var length,value,i=0,ret=[]; // Go through the array, translating each of the items to their new values
if(isArrayLike(elems)){length=elems.length;for(;i<length;i++){value=callback(elems[i],i,arg);if(value!=null){ret.push(value);}} // Go through every key on the object,
}else {for(i in elems){value=callback(elems[i],i,arg);if(value!=null){ret.push(value);}}} // Flatten any nested arrays
return concat.apply([],ret);}, // A global GUID counter for objects
guid:1, // Bind a function to a context, optionally partially applying any
// arguments.
proxy:function proxy(fn,context){var tmp,args,proxy;if(typeof context==="string"){tmp=fn[context];context=fn;fn=tmp;} // Quick check to determine if target is callable, in the spec
// this throws a TypeError, but we will just return undefined.
if(!jQuery.isFunction(fn)){return undefined;} // Simulated bind
args=_slice.call(arguments,2);proxy=function proxy(){return fn.apply(context||this,args.concat(_slice.call(arguments)));}; // Set the guid of unique handler to the same of original handler, so it can be removed
proxy.guid=fn.guid=fn.guid||jQuery.guid++;return proxy;},now:Date.now, // jQuery.support is not used in Core but other projects attach their
// properties to it so it needs to exist.
support:support}); // JSHint would error on this code due to the Symbol not being defined in ES5.
// Defining this global in .jshintrc would create a danger of using the global
// unguarded in another place, it seems safer to just disable JSHint for these
// three lines.
/* jshint ignore: start */if(typeof Symbol==="function"){jQuery.fn[Symbol.iterator]=arr[Symbol.iterator];} /* jshint ignore: end */ // Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(i,name){class2type["[object "+name+"]"]=name.toLowerCase();});function isArrayLike(obj){ // Support: iOS 8.2 (not reproducible in simulator)
// `in` check used to prevent JIT error (gh-2145)
// hasOwn isn't used here due to false negatives
// regarding Nodelist length in IE
var length=!!obj&&"length" in obj&&obj.length,type=jQuery.type(obj);if(type==="function"||jQuery.isWindow(obj)){return false;}return type==="array"||length===0||typeof length==="number"&&length>0&&length-1 in obj;}var Sizzle= /*!
 * Sizzle CSS Selector Engine v2.2.1
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-10-17
 */function(window){var i,support,Expr,getText,isXML,tokenize,compile,select,outermostContext,sortInput,hasDuplicate, // Local document vars
setDocument,document,docElem,documentIsHTML,rbuggyQSA,rbuggyMatches,matches,contains, // Instance-specific data
expando="sizzle"+1*new Date(),preferredDoc=window.document,dirruns=0,done=0,classCache=createCache(),tokenCache=createCache(),compilerCache=createCache(),sortOrder=function sortOrder(a,b){if(a===b){hasDuplicate=true;}return 0;}, // General-purpose constants
MAX_NEGATIVE=1<<31, // Instance methods
hasOwn={}.hasOwnProperty,arr=[],pop=arr.pop,push_native=arr.push,push=arr.push,slice=arr.slice, // Use a stripped-down indexOf as it's faster than native
// http://jsperf.com/thor-indexof-vs-for/5
indexOf=function indexOf(list,elem){var i=0,len=list.length;for(;i<len;i++){if(list[i]===elem){return i;}}return -1;},booleans="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", // Regular expressions
// http://www.w3.org/TR/css3-selectors/#whitespace
whitespace="[\\x20\\t\\r\\n\\f]", // http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
identifier="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", // Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
attributes="\\["+whitespace+"*("+identifier+")(?:"+whitespace+ // Operator (capture 2)
"*([*^$|!~]?=)"+whitespace+ // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+identifier+"))|)"+whitespace+"*\\]",pseudos=":("+identifier+")(?:\\(("+ // To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
// 1. quoted (capture 3; capture 4 or capture 5)
"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|"+ // 2. simple (capture 6)
"((?:\\\\.|[^\\\\()[\\]]|"+attributes+")*)|"+ // 3. anything else (capture 2)
".*"+")\\)|)", // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
rwhitespace=new RegExp(whitespace+"+","g"),rtrim=new RegExp("^"+whitespace+"+|((?:^|[^\\\\])(?:\\\\.)*)"+whitespace+"+$","g"),rcomma=new RegExp("^"+whitespace+"*,"+whitespace+"*"),rcombinators=new RegExp("^"+whitespace+"*([>+~]|"+whitespace+")"+whitespace+"*"),rattributeQuotes=new RegExp("="+whitespace+"*([^\\]'\"]*?)"+whitespace+"*\\]","g"),rpseudo=new RegExp(pseudos),ridentifier=new RegExp("^"+identifier+"$"),matchExpr={"ID":new RegExp("^#("+identifier+")"),"CLASS":new RegExp("^\\.("+identifier+")"),"TAG":new RegExp("^("+identifier+"|[*])"),"ATTR":new RegExp("^"+attributes),"PSEUDO":new RegExp("^"+pseudos),"CHILD":new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+whitespace+"*(even|odd|(([+-]|)(\\d*)n|)"+whitespace+"*(?:([+-]|)"+whitespace+"*(\\d+)|))"+whitespace+"*\\)|)","i"),"bool":new RegExp("^(?:"+booleans+")$","i"), // For use in libraries implementing .is()
// We use this for POS matching in `select`
"needsContext":new RegExp("^"+whitespace+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+whitespace+"*((?:-\\d)?\\d*)"+whitespace+"*\\)|)(?=[^-]|$)","i")},rinputs=/^(?:input|select|textarea|button)$/i,rheader=/^h\d$/i,rnative=/^[^{]+\{\s*\[native \w/, // Easily-parseable/retrievable ID or TAG or CLASS selectors
rquickExpr=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,rsibling=/[+~]/,rescape=/'|\\/g, // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
runescape=new RegExp("\\\\([\\da-f]{1,6}"+whitespace+"?|("+whitespace+")|.)","ig"),funescape=function funescape(_,escaped,escapedWhitespace){var high="0x"+escaped-0x10000; // NaN means non-codepoint
// Support: Firefox<24
// Workaround erroneous numeric interpretation of +"0x"
return high!==high||escapedWhitespace?escaped:high<0? // BMP codepoint
String.fromCharCode(high+0x10000): // Supplemental Plane codepoint (surrogate pair)
String.fromCharCode(high>>10|0xD800,high&0x3FF|0xDC00);}, // Used for iframes
// See setDocument()
// Removing the function wrapper causes a "Permission Denied"
// error in IE
unloadHandler=function unloadHandler(){setDocument();}; // Optimize for push.apply( _, NodeList )
try{push.apply(arr=slice.call(preferredDoc.childNodes),preferredDoc.childNodes); // Support: Android<4.0
// Detect silently failing push.apply
arr[preferredDoc.childNodes.length].nodeType;}catch(e){push={apply:arr.length? // Leverage slice if possible
function(target,els){push_native.apply(target,slice.call(els));}: // Support: IE<9
// Otherwise append directly
function(target,els){var j=target.length,i=0; // Can't trust NodeList.length
while(target[j++]=els[i++]){}target.length=j-1;}};}function Sizzle(selector,context,results,seed){var m,i,elem,nid,nidselect,match,groups,newSelector,newContext=context&&context.ownerDocument, // nodeType defaults to 9, since context defaults to document
nodeType=context?context.nodeType:9;results=results||[]; // Return early from calls with invalid selector or context
if(typeof selector!=="string"||!selector||nodeType!==1&&nodeType!==9&&nodeType!==11){return results;} // Try to shortcut find operations (as opposed to filters) in HTML documents
if(!seed){if((context?context.ownerDocument||context:preferredDoc)!==document){setDocument(context);}context=context||document;if(documentIsHTML){ // If the selector is sufficiently simple, try using a "get*By*" DOM method
// (excepting DocumentFragment context, where the methods don't exist)
if(nodeType!==11&&(match=rquickExpr.exec(selector))){ // ID selector
if(m=match[1]){ // Document context
if(nodeType===9){if(elem=context.getElementById(m)){ // Support: IE, Opera, Webkit
// TODO: identify versions
// getElementById can match elements by name instead of ID
if(elem.id===m){results.push(elem);return results;}}else {return results;} // Element context
}else { // Support: IE, Opera, Webkit
// TODO: identify versions
// getElementById can match elements by name instead of ID
if(newContext&&(elem=newContext.getElementById(m))&&contains(context,elem)&&elem.id===m){results.push(elem);return results;}} // Type selector
}else if(match[2]){push.apply(results,context.getElementsByTagName(selector));return results; // Class selector
}else if((m=match[3])&&support.getElementsByClassName&&context.getElementsByClassName){push.apply(results,context.getElementsByClassName(m));return results;}} // Take advantage of querySelectorAll
if(support.qsa&&!compilerCache[selector+" "]&&(!rbuggyQSA||!rbuggyQSA.test(selector))){if(nodeType!==1){newContext=context;newSelector=selector; // qSA looks outside Element context, which is not what we want
// Thanks to Andrew Dupont for this workaround technique
// Support: IE <=8
// Exclude object elements
}else if(context.nodeName.toLowerCase()!=="object"){ // Capture the context ID, setting it first if necessary
if(nid=context.getAttribute("id")){nid=nid.replace(rescape,"\\$&");}else {context.setAttribute("id",nid=expando);} // Prefix every selector in the list
groups=tokenize(selector);i=groups.length;nidselect=ridentifier.test(nid)?"#"+nid:"[id='"+nid+"']";while(i--){groups[i]=nidselect+" "+toSelector(groups[i]);}newSelector=groups.join(","); // Expand context for sibling selectors
newContext=rsibling.test(selector)&&testContext(context.parentNode)||context;}if(newSelector){try{push.apply(results,newContext.querySelectorAll(newSelector));return results;}catch(qsaError){}finally {if(nid===expando){context.removeAttribute("id");}}}}}} // All others
return select(selector.replace(rtrim,"$1"),context,results,seed);} /**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */function createCache(){var keys=[];function cache(key,value){ // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
if(keys.push(key+" ")>Expr.cacheLength){ // Only keep the most recent entries
delete cache[keys.shift()];}return cache[key+" "]=value;}return cache;} /**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */function markFunction(fn){fn[expando]=true;return fn;} /**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */function assert(fn){var div=document.createElement("div");try{return !!fn(div);}catch(e){return false;}finally { // Remove from its parent by default
if(div.parentNode){div.parentNode.removeChild(div);} // release memory in IE
div=null;}} /**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */function addHandle(attrs,handler){var arr=attrs.split("|"),i=arr.length;while(i--){Expr.attrHandle[arr[i]]=handler;}} /**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */function siblingCheck(a,b){var cur=b&&a,diff=cur&&a.nodeType===1&&b.nodeType===1&&(~b.sourceIndex||MAX_NEGATIVE)-(~a.sourceIndex||MAX_NEGATIVE); // Use IE sourceIndex if available on both nodes
if(diff){return diff;} // Check if b follows a
if(cur){while(cur=cur.nextSibling){if(cur===b){return -1;}}}return a?1:-1;} /**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */function createInputPseudo(type){return function(elem){var name=elem.nodeName.toLowerCase();return name==="input"&&elem.type===type;};} /**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */function createButtonPseudo(type){return function(elem){var name=elem.nodeName.toLowerCase();return (name==="input"||name==="button")&&elem.type===type;};} /**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */function createPositionalPseudo(fn){return markFunction(function(argument){argument=+argument;return markFunction(function(seed,matches){var j,matchIndexes=fn([],seed.length,argument),i=matchIndexes.length; // Match elements found at the specified indexes
while(i--){if(seed[j=matchIndexes[i]]){seed[j]=!(matches[j]=seed[j]);}}});});} /**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */function testContext(context){return context&&typeof context.getElementsByTagName!=="undefined"&&context;} // Expose support vars for convenience
support=Sizzle.support={}; /**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */isXML=Sizzle.isXML=function(elem){ // documentElement is verified for cases where it doesn't yet exist
// (such as loading iframes in IE - #4833)
var documentElement=elem&&(elem.ownerDocument||elem).documentElement;return documentElement?documentElement.nodeName!=="HTML":false;}; /**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */setDocument=Sizzle.setDocument=function(node){var hasCompare,parent,doc=node?node.ownerDocument||node:preferredDoc; // Return early if doc is invalid or already selected
if(doc===document||doc.nodeType!==9||!doc.documentElement){return document;} // Update global variables
document=doc;docElem=document.documentElement;documentIsHTML=!isXML(document); // Support: IE 9-11, Edge
// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
if((parent=document.defaultView)&&parent.top!==parent){ // Support: IE 11
if(parent.addEventListener){parent.addEventListener("unload",unloadHandler,false); // Support: IE 9 - 10 only
}else if(parent.attachEvent){parent.attachEvent("onunload",unloadHandler);}} /* Attributes
	---------------------------------------------------------------------- */ // Support: IE<8
// Verify that getAttribute really returns attributes and not properties
// (excepting IE8 booleans)
support.attributes=assert(function(div){div.className="i";return !div.getAttribute("className");}); /* getElement(s)By*
	---------------------------------------------------------------------- */ // Check if getElementsByTagName("*") returns only elements
support.getElementsByTagName=assert(function(div){div.appendChild(document.createComment(""));return !div.getElementsByTagName("*").length;}); // Support: IE<9
support.getElementsByClassName=rnative.test(document.getElementsByClassName); // Support: IE<10
// Check if getElementById returns elements by name
// The broken getElementById methods don't pick up programatically-set names,
// so use a roundabout getElementsByName test
support.getById=assert(function(div){docElem.appendChild(div).id=expando;return !document.getElementsByName||!document.getElementsByName(expando).length;}); // ID find and filter
if(support.getById){Expr.find["ID"]=function(id,context){if(typeof context.getElementById!=="undefined"&&documentIsHTML){var m=context.getElementById(id);return m?[m]:[];}};Expr.filter["ID"]=function(id){var attrId=id.replace(runescape,funescape);return function(elem){return elem.getAttribute("id")===attrId;};};}else { // Support: IE6/7
// getElementById is not reliable as a find shortcut
delete Expr.find["ID"];Expr.filter["ID"]=function(id){var attrId=id.replace(runescape,funescape);return function(elem){var node=typeof elem.getAttributeNode!=="undefined"&&elem.getAttributeNode("id");return node&&node.value===attrId;};};} // Tag
Expr.find["TAG"]=support.getElementsByTagName?function(tag,context){if(typeof context.getElementsByTagName!=="undefined"){return context.getElementsByTagName(tag); // DocumentFragment nodes don't have gEBTN
}else if(support.qsa){return context.querySelectorAll(tag);}}:function(tag,context){var elem,tmp=[],i=0, // By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
results=context.getElementsByTagName(tag); // Filter out possible comments
if(tag==="*"){while(elem=results[i++]){if(elem.nodeType===1){tmp.push(elem);}}return tmp;}return results;}; // Class
Expr.find["CLASS"]=support.getElementsByClassName&&function(className,context){if(typeof context.getElementsByClassName!=="undefined"&&documentIsHTML){return context.getElementsByClassName(className);}}; /* QSA/matchesSelector
	---------------------------------------------------------------------- */ // QSA and matchesSelector support
// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
rbuggyMatches=[]; // qSa(:focus) reports false when true (Chrome 21)
// We allow this because of a bug in IE8/9 that throws an error
// whenever `document.activeElement` is accessed on an iframe
// So, we allow :focus to pass through QSA all the time to avoid the IE error
// See http://bugs.jquery.com/ticket/13378
rbuggyQSA=[];if(support.qsa=rnative.test(document.querySelectorAll)){ // Build QSA regex
// Regex strategy adopted from Diego Perini
assert(function(div){ // Select is set to empty string on purpose
// This is to test IE's treatment of not explicitly
// setting a boolean content attribute,
// since its presence should be enough
// http://bugs.jquery.com/ticket/12359
docElem.appendChild(div).innerHTML="<a id='"+expando+"'></a>"+"<select id='"+expando+"-\r\\' msallowcapture=''>"+"<option selected=''></option></select>"; // Support: IE8, Opera 11-12.16
// Nothing should be selected when empty strings follow ^= or $= or *=
// The test attribute must be unknown in Opera but "safe" for WinRT
// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
if(div.querySelectorAll("[msallowcapture^='']").length){rbuggyQSA.push("[*^$]="+whitespace+"*(?:''|\"\")");} // Support: IE8
// Boolean attributes and "value" are not treated correctly
if(!div.querySelectorAll("[selected]").length){rbuggyQSA.push("\\["+whitespace+"*(?:value|"+booleans+")");} // Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
if(!div.querySelectorAll("[id~="+expando+"-]").length){rbuggyQSA.push("~=");} // Webkit/Opera - :checked should return selected option elements
// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
// IE8 throws error here and will not see later tests
if(!div.querySelectorAll(":checked").length){rbuggyQSA.push(":checked");} // Support: Safari 8+, iOS 8+
// https://bugs.webkit.org/show_bug.cgi?id=136851
// In-page `selector#id sibing-combinator selector` fails
if(!div.querySelectorAll("a#"+expando+"+*").length){rbuggyQSA.push(".#.+[+~]");}});assert(function(div){ // Support: Windows 8 Native Apps
// The type and name attributes are restricted during .innerHTML assignment
var input=document.createElement("input");input.setAttribute("type","hidden");div.appendChild(input).setAttribute("name","D"); // Support: IE8
// Enforce case-sensitivity of name attribute
if(div.querySelectorAll("[name=d]").length){rbuggyQSA.push("name"+whitespace+"*[*^$|!~]?=");} // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
// IE8 throws error here and will not see later tests
if(!div.querySelectorAll(":enabled").length){rbuggyQSA.push(":enabled",":disabled");} // Opera 10-11 does not throw on post-comma invalid pseudos
div.querySelectorAll("*,:x");rbuggyQSA.push(",.*:");});}if(support.matchesSelector=rnative.test(matches=docElem.matches||docElem.webkitMatchesSelector||docElem.mozMatchesSelector||docElem.oMatchesSelector||docElem.msMatchesSelector)){assert(function(div){ // Check to see if it's possible to do matchesSelector
// on a disconnected node (IE 9)
support.disconnectedMatch=matches.call(div,"div"); // This should fail with an exception
// Gecko does not error, returns false instead
matches.call(div,"[s!='']:x");rbuggyMatches.push("!=",pseudos);});}rbuggyQSA=rbuggyQSA.length&&new RegExp(rbuggyQSA.join("|"));rbuggyMatches=rbuggyMatches.length&&new RegExp(rbuggyMatches.join("|")); /* Contains
	---------------------------------------------------------------------- */hasCompare=rnative.test(docElem.compareDocumentPosition); // Element contains another
// Purposefully self-exclusive
// As in, an element does not contain itself
contains=hasCompare||rnative.test(docElem.contains)?function(a,b){var adown=a.nodeType===9?a.documentElement:a,bup=b&&b.parentNode;return a===bup||!!(bup&&bup.nodeType===1&&(adown.contains?adown.contains(bup):a.compareDocumentPosition&&a.compareDocumentPosition(bup)&16));}:function(a,b){if(b){while(b=b.parentNode){if(b===a){return true;}}}return false;}; /* Sorting
	---------------------------------------------------------------------- */ // Document order sorting
sortOrder=hasCompare?function(a,b){ // Flag for duplicate removal
if(a===b){hasDuplicate=true;return 0;} // Sort on method existence if only one input has compareDocumentPosition
var compare=!a.compareDocumentPosition-!b.compareDocumentPosition;if(compare){return compare;} // Calculate position if both inputs belong to the same document
compare=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b): // Otherwise we know they are disconnected
1; // Disconnected nodes
if(compare&1||!support.sortDetached&&b.compareDocumentPosition(a)===compare){ // Choose the first element that is related to our preferred document
if(a===document||a.ownerDocument===preferredDoc&&contains(preferredDoc,a)){return -1;}if(b===document||b.ownerDocument===preferredDoc&&contains(preferredDoc,b)){return 1;} // Maintain original order
return sortInput?indexOf(sortInput,a)-indexOf(sortInput,b):0;}return compare&4?-1:1;}:function(a,b){ // Exit early if the nodes are identical
if(a===b){hasDuplicate=true;return 0;}var cur,i=0,aup=a.parentNode,bup=b.parentNode,ap=[a],bp=[b]; // Parentless nodes are either documents or disconnected
if(!aup||!bup){return a===document?-1:b===document?1:aup?-1:bup?1:sortInput?indexOf(sortInput,a)-indexOf(sortInput,b):0; // If the nodes are siblings, we can do a quick check
}else if(aup===bup){return siblingCheck(a,b);} // Otherwise we need full lists of their ancestors for comparison
cur=a;while(cur=cur.parentNode){ap.unshift(cur);}cur=b;while(cur=cur.parentNode){bp.unshift(cur);} // Walk down the tree looking for a discrepancy
while(ap[i]===bp[i]){i++;}return i? // Do a sibling check if the nodes have a common ancestor
siblingCheck(ap[i],bp[i]): // Otherwise nodes in our document sort first
ap[i]===preferredDoc?-1:bp[i]===preferredDoc?1:0;};return document;};Sizzle.matches=function(expr,elements){return Sizzle(expr,null,null,elements);};Sizzle.matchesSelector=function(elem,expr){ // Set document vars if needed
if((elem.ownerDocument||elem)!==document){setDocument(elem);} // Make sure that attribute selectors are quoted
expr=expr.replace(rattributeQuotes,"='$1']");if(support.matchesSelector&&documentIsHTML&&!compilerCache[expr+" "]&&(!rbuggyMatches||!rbuggyMatches.test(expr))&&(!rbuggyQSA||!rbuggyQSA.test(expr))){try{var ret=matches.call(elem,expr); // IE 9's matchesSelector returns false on disconnected nodes
if(ret||support.disconnectedMatch|| // As well, disconnected nodes are said to be in a document
// fragment in IE 9
elem.document&&elem.document.nodeType!==11){return ret;}}catch(e){}}return Sizzle(expr,document,null,[elem]).length>0;};Sizzle.contains=function(context,elem){ // Set document vars if needed
if((context.ownerDocument||context)!==document){setDocument(context);}return contains(context,elem);};Sizzle.attr=function(elem,name){ // Set document vars if needed
if((elem.ownerDocument||elem)!==document){setDocument(elem);}var fn=Expr.attrHandle[name.toLowerCase()], // Don't get fooled by Object.prototype properties (jQuery #13807)
val=fn&&hasOwn.call(Expr.attrHandle,name.toLowerCase())?fn(elem,name,!documentIsHTML):undefined;return val!==undefined?val:support.attributes||!documentIsHTML?elem.getAttribute(name):(val=elem.getAttributeNode(name))&&val.specified?val.value:null;};Sizzle.error=function(msg){throw new Error("Syntax error, unrecognized expression: "+msg);}; /**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */Sizzle.uniqueSort=function(results){var elem,duplicates=[],j=0,i=0; // Unless we *know* we can detect duplicates, assume their presence
hasDuplicate=!support.detectDuplicates;sortInput=!support.sortStable&&results.slice(0);results.sort(sortOrder);if(hasDuplicate){while(elem=results[i++]){if(elem===results[i]){j=duplicates.push(i);}}while(j--){results.splice(duplicates[j],1);}} // Clear input after sorting to release objects
// See https://github.com/jquery/sizzle/pull/225
sortInput=null;return results;}; /**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */getText=Sizzle.getText=function(elem){var node,ret="",i=0,nodeType=elem.nodeType;if(!nodeType){ // If no nodeType, this is expected to be an array
while(node=elem[i++]){ // Do not traverse comment nodes
ret+=getText(node);}}else if(nodeType===1||nodeType===9||nodeType===11){ // Use textContent for elements
// innerText usage removed for consistency of new lines (jQuery #11153)
if(typeof elem.textContent==="string"){return elem.textContent;}else { // Traverse its children
for(elem=elem.firstChild;elem;elem=elem.nextSibling){ret+=getText(elem);}}}else if(nodeType===3||nodeType===4){return elem.nodeValue;} // Do not include comment or processing instruction nodes
return ret;};Expr=Sizzle.selectors={ // Can be adjusted by the user
cacheLength:50,createPseudo:markFunction,match:matchExpr,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:true}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:true},"~":{dir:"previousSibling"}},preFilter:{"ATTR":function ATTR(match){match[1]=match[1].replace(runescape,funescape); // Move the given value to match[3] whether quoted or unquoted
match[3]=(match[3]||match[4]||match[5]||"").replace(runescape,funescape);if(match[2]==="~="){match[3]=" "+match[3]+" ";}return match.slice(0,4);},"CHILD":function CHILD(match){ /* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/match[1]=match[1].toLowerCase();if(match[1].slice(0,3)==="nth"){ // nth-* requires argument
if(!match[3]){Sizzle.error(match[0]);} // numeric x and y parameters for Expr.filter.CHILD
// remember that false/true cast respectively to 0/1
match[4]=+(match[4]?match[5]+(match[6]||1):2*(match[3]==="even"||match[3]==="odd"));match[5]=+(match[7]+match[8]||match[3]==="odd"); // other types prohibit arguments
}else if(match[3]){Sizzle.error(match[0]);}return match;},"PSEUDO":function PSEUDO(match){var excess,unquoted=!match[6]&&match[2];if(matchExpr["CHILD"].test(match[0])){return null;} // Accept quoted arguments as-is
if(match[3]){match[2]=match[4]||match[5]||""; // Strip excess characters from unquoted arguments
}else if(unquoted&&rpseudo.test(unquoted)&&( // Get excess from tokenize (recursively)
excess=tokenize(unquoted,true))&&( // advance to the next closing parenthesis
excess=unquoted.indexOf(")",unquoted.length-excess)-unquoted.length)){ // excess is a negative index
match[0]=match[0].slice(0,excess);match[2]=unquoted.slice(0,excess);} // Return only captures needed by the pseudo filter method (type and argument)
return match.slice(0,3);}},filter:{"TAG":function TAG(nodeNameSelector){var nodeName=nodeNameSelector.replace(runescape,funescape).toLowerCase();return nodeNameSelector==="*"?function(){return true;}:function(elem){return elem.nodeName&&elem.nodeName.toLowerCase()===nodeName;};},"CLASS":function CLASS(className){var pattern=classCache[className+" "];return pattern||(pattern=new RegExp("(^|"+whitespace+")"+className+"("+whitespace+"|$)"))&&classCache(className,function(elem){return pattern.test(typeof elem.className==="string"&&elem.className||typeof elem.getAttribute!=="undefined"&&elem.getAttribute("class")||"");});},"ATTR":function ATTR(name,operator,check){return function(elem){var result=Sizzle.attr(elem,name);if(result==null){return operator==="!=";}if(!operator){return true;}result+="";return operator==="="?result===check:operator==="!="?result!==check:operator==="^="?check&&result.indexOf(check)===0:operator==="*="?check&&result.indexOf(check)>-1:operator==="$="?check&&result.slice(-check.length)===check:operator==="~="?(" "+result.replace(rwhitespace," ")+" ").indexOf(check)>-1:operator==="|="?result===check||result.slice(0,check.length+1)===check+"-":false;};},"CHILD":function CHILD(type,what,argument,first,last){var simple=type.slice(0,3)!=="nth",forward=type.slice(-4)!=="last",ofType=what==="of-type";return first===1&&last===0? // Shortcut for :nth-*(n)
function(elem){return !!elem.parentNode;}:function(elem,context,xml){var cache,uniqueCache,outerCache,node,nodeIndex,start,dir=simple!==forward?"nextSibling":"previousSibling",parent=elem.parentNode,name=ofType&&elem.nodeName.toLowerCase(),useCache=!xml&&!ofType,diff=false;if(parent){ // :(first|last|only)-(child|of-type)
if(simple){while(dir){node=elem;while(node=node[dir]){if(ofType?node.nodeName.toLowerCase()===name:node.nodeType===1){return false;}} // Reverse direction for :only-* (if we haven't yet done so)
start=dir=type==="only"&&!start&&"nextSibling";}return true;}start=[forward?parent.firstChild:parent.lastChild]; // non-xml :nth-child(...) stores cache data on `parent`
if(forward&&useCache){ // Seek `elem` from a previously-cached index
// ...in a gzip-friendly way
node=parent;outerCache=node[expando]||(node[expando]={}); // Support: IE <9 only
// Defend against cloned attroperties (jQuery gh-1709)
uniqueCache=outerCache[node.uniqueID]||(outerCache[node.uniqueID]={});cache=uniqueCache[type]||[];nodeIndex=cache[0]===dirruns&&cache[1];diff=nodeIndex&&cache[2];node=nodeIndex&&parent.childNodes[nodeIndex];while(node=++nodeIndex&&node&&node[dir]||( // Fallback to seeking `elem` from the start
diff=nodeIndex=0)||start.pop()){ // When found, cache indexes on `parent` and break
if(node.nodeType===1&&++diff&&node===elem){uniqueCache[type]=[dirruns,nodeIndex,diff];break;}}}else { // Use previously-cached element index if available
if(useCache){ // ...in a gzip-friendly way
node=elem;outerCache=node[expando]||(node[expando]={}); // Support: IE <9 only
// Defend against cloned attroperties (jQuery gh-1709)
uniqueCache=outerCache[node.uniqueID]||(outerCache[node.uniqueID]={});cache=uniqueCache[type]||[];nodeIndex=cache[0]===dirruns&&cache[1];diff=nodeIndex;} // xml :nth-child(...)
// or :nth-last-child(...) or :nth(-last)?-of-type(...)
if(diff===false){ // Use the same loop as above to seek `elem` from the start
while(node=++nodeIndex&&node&&node[dir]||(diff=nodeIndex=0)||start.pop()){if((ofType?node.nodeName.toLowerCase()===name:node.nodeType===1)&&++diff){ // Cache the index of each encountered element
if(useCache){outerCache=node[expando]||(node[expando]={}); // Support: IE <9 only
// Defend against cloned attroperties (jQuery gh-1709)
uniqueCache=outerCache[node.uniqueID]||(outerCache[node.uniqueID]={});uniqueCache[type]=[dirruns,diff];}if(node===elem){break;}}}}} // Incorporate the offset, then check against cycle size
diff-=last;return diff===first||diff%first===0&&diff/first>=0;}};},"PSEUDO":function PSEUDO(pseudo,argument){ // pseudo-class names are case-insensitive
// http://www.w3.org/TR/selectors/#pseudo-classes
// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
// Remember that setFilters inherits from pseudos
var args,fn=Expr.pseudos[pseudo]||Expr.setFilters[pseudo.toLowerCase()]||Sizzle.error("unsupported pseudo: "+pseudo); // The user may use createPseudo to indicate that
// arguments are needed to create the filter function
// just as Sizzle does
if(fn[expando]){return fn(argument);} // But maintain support for old signatures
if(fn.length>1){args=[pseudo,pseudo,"",argument];return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase())?markFunction(function(seed,matches){var idx,matched=fn(seed,argument),i=matched.length;while(i--){idx=indexOf(seed,matched[i]);seed[idx]=!(matches[idx]=matched[i]);}}):function(elem){return fn(elem,0,args);};}return fn;}},pseudos:{ // Potentially complex pseudos
"not":markFunction(function(selector){ // Trim the selector passed to compile
// to avoid treating leading and trailing
// spaces as combinators
var input=[],results=[],matcher=compile(selector.replace(rtrim,"$1"));return matcher[expando]?markFunction(function(seed,matches,context,xml){var elem,unmatched=matcher(seed,null,xml,[]),i=seed.length; // Match elements unmatched by `matcher`
while(i--){if(elem=unmatched[i]){seed[i]=!(matches[i]=elem);}}}):function(elem,context,xml){input[0]=elem;matcher(input,null,xml,results); // Don't keep the element (issue #299)
input[0]=null;return !results.pop();};}),"has":markFunction(function(selector){return function(elem){return Sizzle(selector,elem).length>0;};}),"contains":markFunction(function(text){text=text.replace(runescape,funescape);return function(elem){return (elem.textContent||elem.innerText||getText(elem)).indexOf(text)>-1;};}), // "Whether an element is represented by a :lang() selector
// is based solely on the element's language value
// being equal to the identifier C,
// or beginning with the identifier C immediately followed by "-".
// The matching of C against the element's language value is performed case-insensitively.
// The identifier C does not have to be a valid language name."
// http://www.w3.org/TR/selectors/#lang-pseudo
"lang":markFunction(function(lang){ // lang value must be a valid identifier
if(!ridentifier.test(lang||"")){Sizzle.error("unsupported lang: "+lang);}lang=lang.replace(runescape,funescape).toLowerCase();return function(elem){var elemLang;do {if(elemLang=documentIsHTML?elem.lang:elem.getAttribute("xml:lang")||elem.getAttribute("lang")){elemLang=elemLang.toLowerCase();return elemLang===lang||elemLang.indexOf(lang+"-")===0;}}while((elem=elem.parentNode)&&elem.nodeType===1);return false;};}), // Miscellaneous
"target":function target(elem){var hash=window.location&&window.location.hash;return hash&&hash.slice(1)===elem.id;},"root":function root(elem){return elem===docElem;},"focus":function focus(elem){return elem===document.activeElement&&(!document.hasFocus||document.hasFocus())&&!!(elem.type||elem.href||~elem.tabIndex);}, // Boolean properties
"enabled":function enabled(elem){return elem.disabled===false;},"disabled":function disabled(elem){return elem.disabled===true;},"checked":function checked(elem){ // In CSS3, :checked should return both checked and selected elements
// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
var nodeName=elem.nodeName.toLowerCase();return nodeName==="input"&&!!elem.checked||nodeName==="option"&&!!elem.selected;},"selected":function selected(elem){ // Accessing this property makes selected-by-default
// options in Safari work properly
if(elem.parentNode){elem.parentNode.selectedIndex;}return elem.selected===true;}, // Contents
"empty":function empty(elem){ // http://www.w3.org/TR/selectors/#empty-pseudo
// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
//   but not by others (comment: 8; processing instruction: 7; etc.)
// nodeType < 6 works because attributes (2) do not appear as children
for(elem=elem.firstChild;elem;elem=elem.nextSibling){if(elem.nodeType<6){return false;}}return true;},"parent":function parent(elem){return !Expr.pseudos["empty"](elem);}, // Element/input types
"header":function header(elem){return rheader.test(elem.nodeName);},"input":function input(elem){return rinputs.test(elem.nodeName);},"button":function button(elem){var name=elem.nodeName.toLowerCase();return name==="input"&&elem.type==="button"||name==="button";},"text":function text(elem){var attr;return elem.nodeName.toLowerCase()==="input"&&elem.type==="text"&&( // Support: IE<8
// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
(attr=elem.getAttribute("type"))==null||attr.toLowerCase()==="text");}, // Position-in-collection
"first":createPositionalPseudo(function(){return [0];}),"last":createPositionalPseudo(function(matchIndexes,length){return [length-1];}),"eq":createPositionalPseudo(function(matchIndexes,length,argument){return [argument<0?argument+length:argument];}),"even":createPositionalPseudo(function(matchIndexes,length){var i=0;for(;i<length;i+=2){matchIndexes.push(i);}return matchIndexes;}),"odd":createPositionalPseudo(function(matchIndexes,length){var i=1;for(;i<length;i+=2){matchIndexes.push(i);}return matchIndexes;}),"lt":createPositionalPseudo(function(matchIndexes,length,argument){var i=argument<0?argument+length:argument;for(;--i>=0;){matchIndexes.push(i);}return matchIndexes;}),"gt":createPositionalPseudo(function(matchIndexes,length,argument){var i=argument<0?argument+length:argument;for(;++i<length;){matchIndexes.push(i);}return matchIndexes;})}};Expr.pseudos["nth"]=Expr.pseudos["eq"]; // Add button/input type pseudos
for(i in {radio:true,checkbox:true,file:true,password:true,image:true}){Expr.pseudos[i]=createInputPseudo(i);}for(i in {submit:true,reset:true}){Expr.pseudos[i]=createButtonPseudo(i);} // Easy API for creating new setFilters
function setFilters(){}setFilters.prototype=Expr.filters=Expr.pseudos;Expr.setFilters=new setFilters();tokenize=Sizzle.tokenize=function(selector,parseOnly){var matched,match,tokens,type,soFar,groups,preFilters,cached=tokenCache[selector+" "];if(cached){return parseOnly?0:cached.slice(0);}soFar=selector;groups=[];preFilters=Expr.preFilter;while(soFar){ // Comma and first run
if(!matched||(match=rcomma.exec(soFar))){if(match){ // Don't consume trailing commas as valid
soFar=soFar.slice(match[0].length)||soFar;}groups.push(tokens=[]);}matched=false; // Combinators
if(match=rcombinators.exec(soFar)){matched=match.shift();tokens.push({value:matched, // Cast descendant combinators to space
type:match[0].replace(rtrim," ")});soFar=soFar.slice(matched.length);} // Filters
for(type in Expr.filter){if((match=matchExpr[type].exec(soFar))&&(!preFilters[type]||(match=preFilters[type](match)))){matched=match.shift();tokens.push({value:matched,type:type,matches:match});soFar=soFar.slice(matched.length);}}if(!matched){break;}} // Return the length of the invalid excess
// if we're just parsing
// Otherwise, throw an error or return tokens
return parseOnly?soFar.length:soFar?Sizzle.error(selector): // Cache the tokens
tokenCache(selector,groups).slice(0);};function toSelector(tokens){var i=0,len=tokens.length,selector="";for(;i<len;i++){selector+=tokens[i].value;}return selector;}function addCombinator(matcher,combinator,base){var dir=combinator.dir,checkNonElements=base&&dir==="parentNode",doneName=done++;return combinator.first? // Check against closest ancestor/preceding element
function(elem,context,xml){while(elem=elem[dir]){if(elem.nodeType===1||checkNonElements){return matcher(elem,context,xml);}}}: // Check against all ancestor/preceding elements
function(elem,context,xml){var oldCache,uniqueCache,outerCache,newCache=[dirruns,doneName]; // We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
if(xml){while(elem=elem[dir]){if(elem.nodeType===1||checkNonElements){if(matcher(elem,context,xml)){return true;}}}}else {while(elem=elem[dir]){if(elem.nodeType===1||checkNonElements){outerCache=elem[expando]||(elem[expando]={}); // Support: IE <9 only
// Defend against cloned attroperties (jQuery gh-1709)
uniqueCache=outerCache[elem.uniqueID]||(outerCache[elem.uniqueID]={});if((oldCache=uniqueCache[dir])&&oldCache[0]===dirruns&&oldCache[1]===doneName){ // Assign to newCache so results back-propagate to previous elements
return newCache[2]=oldCache[2];}else { // Reuse newcache so results back-propagate to previous elements
uniqueCache[dir]=newCache; // A match means we're done; a fail means we have to keep checking
if(newCache[2]=matcher(elem,context,xml)){return true;}}}}}};}function elementMatcher(matchers){return matchers.length>1?function(elem,context,xml){var i=matchers.length;while(i--){if(!matchers[i](elem,context,xml)){return false;}}return true;}:matchers[0];}function multipleContexts(selector,contexts,results){var i=0,len=contexts.length;for(;i<len;i++){Sizzle(selector,contexts[i],results);}return results;}function condense(unmatched,map,filter,context,xml){var elem,newUnmatched=[],i=0,len=unmatched.length,mapped=map!=null;for(;i<len;i++){if(elem=unmatched[i]){if(!filter||filter(elem,context,xml)){newUnmatched.push(elem);if(mapped){map.push(i);}}}}return newUnmatched;}function setMatcher(preFilter,selector,matcher,postFilter,postFinder,postSelector){if(postFilter&&!postFilter[expando]){postFilter=setMatcher(postFilter);}if(postFinder&&!postFinder[expando]){postFinder=setMatcher(postFinder,postSelector);}return markFunction(function(seed,results,context,xml){var temp,i,elem,preMap=[],postMap=[],preexisting=results.length, // Get initial elements from seed or context
elems=seed||multipleContexts(selector||"*",context.nodeType?[context]:context,[]), // Prefilter to get matcher input, preserving a map for seed-results synchronization
matcherIn=preFilter&&(seed||!selector)?condense(elems,preMap,preFilter,context,xml):elems,matcherOut=matcher? // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
postFinder||(seed?preFilter:preexisting||postFilter)? // ...intermediate processing is necessary
[]: // ...otherwise use results directly
results:matcherIn; // Find primary matches
if(matcher){matcher(matcherIn,matcherOut,context,xml);} // Apply postFilter
if(postFilter){temp=condense(matcherOut,postMap);postFilter(temp,[],context,xml); // Un-match failing elements by moving them back to matcherIn
i=temp.length;while(i--){if(elem=temp[i]){matcherOut[postMap[i]]=!(matcherIn[postMap[i]]=elem);}}}if(seed){if(postFinder||preFilter){if(postFinder){ // Get the final matcherOut by condensing this intermediate into postFinder contexts
temp=[];i=matcherOut.length;while(i--){if(elem=matcherOut[i]){ // Restore matcherIn since elem is not yet a final match
temp.push(matcherIn[i]=elem);}}postFinder(null,matcherOut=[],temp,xml);} // Move matched elements from seed to results to keep them synchronized
i=matcherOut.length;while(i--){if((elem=matcherOut[i])&&(temp=postFinder?indexOf(seed,elem):preMap[i])>-1){seed[temp]=!(results[temp]=elem);}}} // Add elements to results, through postFinder if defined
}else {matcherOut=condense(matcherOut===results?matcherOut.splice(preexisting,matcherOut.length):matcherOut);if(postFinder){postFinder(null,results,matcherOut,xml);}else {push.apply(results,matcherOut);}}});}function matcherFromTokens(tokens){var checkContext,matcher,j,len=tokens.length,leadingRelative=Expr.relative[tokens[0].type],implicitRelative=leadingRelative||Expr.relative[" "],i=leadingRelative?1:0, // The foundational matcher ensures that elements are reachable from top-level context(s)
matchContext=addCombinator(function(elem){return elem===checkContext;},implicitRelative,true),matchAnyContext=addCombinator(function(elem){return indexOf(checkContext,elem)>-1;},implicitRelative,true),matchers=[function(elem,context,xml){var ret=!leadingRelative&&(xml||context!==outermostContext)||((checkContext=context).nodeType?matchContext(elem,context,xml):matchAnyContext(elem,context,xml)); // Avoid hanging onto element (issue #299)
checkContext=null;return ret;}];for(;i<len;i++){if(matcher=Expr.relative[tokens[i].type]){matchers=[addCombinator(elementMatcher(matchers),matcher)];}else {matcher=Expr.filter[tokens[i].type].apply(null,tokens[i].matches); // Return special upon seeing a positional matcher
if(matcher[expando]){ // Find the next relative operator (if any) for proper handling
j=++i;for(;j<len;j++){if(Expr.relative[tokens[j].type]){break;}}return setMatcher(i>1&&elementMatcher(matchers),i>1&&toSelector( // If the preceding token was a descendant combinator, insert an implicit any-element `*`
tokens.slice(0,i-1).concat({value:tokens[i-2].type===" "?"*":""})).replace(rtrim,"$1"),matcher,i<j&&matcherFromTokens(tokens.slice(i,j)),j<len&&matcherFromTokens(tokens=tokens.slice(j)),j<len&&toSelector(tokens));}matchers.push(matcher);}}return elementMatcher(matchers);}function matcherFromGroupMatchers(elementMatchers,setMatchers){var bySet=setMatchers.length>0,byElement=elementMatchers.length>0,superMatcher=function superMatcher(seed,context,xml,results,outermost){var elem,j,matcher,matchedCount=0,i="0",unmatched=seed&&[],setMatched=[],contextBackup=outermostContext, // We must always have either seed elements or outermost context
elems=seed||byElement&&Expr.find["TAG"]("*",outermost), // Use integer dirruns iff this is the outermost matcher
dirrunsUnique=dirruns+=contextBackup==null?1:Math.random()||0.1,len=elems.length;if(outermost){outermostContext=context===document||context||outermost;} // Add elements passing elementMatchers directly to results
// Support: IE<9, Safari
// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
for(;i!==len&&(elem=elems[i])!=null;i++){if(byElement&&elem){j=0;if(!context&&elem.ownerDocument!==document){setDocument(elem);xml=!documentIsHTML;}while(matcher=elementMatchers[j++]){if(matcher(elem,context||document,xml)){results.push(elem);break;}}if(outermost){dirruns=dirrunsUnique;}} // Track unmatched elements for set filters
if(bySet){ // They will have gone through all possible matchers
if(elem=!matcher&&elem){matchedCount--;} // Lengthen the array for every element, matched or not
if(seed){unmatched.push(elem);}}} // `i` is now the count of elements visited above, and adding it to `matchedCount`
// makes the latter nonnegative.
matchedCount+=i; // Apply set filters to unmatched elements
// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
// no element matchers and no seed.
// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
// case, which will result in a "00" `matchedCount` that differs from `i` but is also
// numerically zero.
if(bySet&&i!==matchedCount){j=0;while(matcher=setMatchers[j++]){matcher(unmatched,setMatched,context,xml);}if(seed){ // Reintegrate element matches to eliminate the need for sorting
if(matchedCount>0){while(i--){if(!(unmatched[i]||setMatched[i])){setMatched[i]=pop.call(results);}}} // Discard index placeholder values to get only actual matches
setMatched=condense(setMatched);} // Add matches to results
push.apply(results,setMatched); // Seedless set matches succeeding multiple successful matchers stipulate sorting
if(outermost&&!seed&&setMatched.length>0&&matchedCount+setMatchers.length>1){Sizzle.uniqueSort(results);}} // Override manipulation of globals by nested matchers
if(outermost){dirruns=dirrunsUnique;outermostContext=contextBackup;}return unmatched;};return bySet?markFunction(superMatcher):superMatcher;}compile=Sizzle.compile=function(selector,match /* Internal Use Only */){var i,setMatchers=[],elementMatchers=[],cached=compilerCache[selector+" "];if(!cached){ // Generate a function of recursive functions that can be used to check each element
if(!match){match=tokenize(selector);}i=match.length;while(i--){cached=matcherFromTokens(match[i]);if(cached[expando]){setMatchers.push(cached);}else {elementMatchers.push(cached);}} // Cache the compiled function
cached=compilerCache(selector,matcherFromGroupMatchers(elementMatchers,setMatchers)); // Save selector and tokenization
cached.selector=selector;}return cached;}; /**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */select=Sizzle.select=function(selector,context,results,seed){var i,tokens,token,type,find,compiled=typeof selector==="function"&&selector,match=!seed&&tokenize(selector=compiled.selector||selector);results=results||[]; // Try to minimize operations if there is only one selector in the list and no seed
// (the latter of which guarantees us context)
if(match.length===1){ // Reduce context if the leading compound selector is an ID
tokens=match[0]=match[0].slice(0);if(tokens.length>2&&(token=tokens[0]).type==="ID"&&support.getById&&context.nodeType===9&&documentIsHTML&&Expr.relative[tokens[1].type]){context=(Expr.find["ID"](token.matches[0].replace(runescape,funescape),context)||[])[0];if(!context){return results; // Precompiled matchers will still verify ancestry, so step up a level
}else if(compiled){context=context.parentNode;}selector=selector.slice(tokens.shift().value.length);} // Fetch a seed set for right-to-left matching
i=matchExpr["needsContext"].test(selector)?0:tokens.length;while(i--){token=tokens[i]; // Abort if we hit a combinator
if(Expr.relative[type=token.type]){break;}if(find=Expr.find[type]){ // Search, expanding context for leading sibling combinators
if(seed=find(token.matches[0].replace(runescape,funescape),rsibling.test(tokens[0].type)&&testContext(context.parentNode)||context)){ // If seed is empty or no tokens remain, we can return early
tokens.splice(i,1);selector=seed.length&&toSelector(tokens);if(!selector){push.apply(results,seed);return results;}break;}}}} // Compile and execute a filtering function if one is not provided
// Provide `match` to avoid retokenization if we modified the selector above
(compiled||compile(selector,match))(seed,context,!documentIsHTML,results,!context||rsibling.test(selector)&&testContext(context.parentNode)||context);return results;}; // One-time assignments
// Sort stability
support.sortStable=expando.split("").sort(sortOrder).join("")===expando; // Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates=!!hasDuplicate; // Initialize against the default document
setDocument(); // Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached=assert(function(div1){ // Should return 1, but returns 4 (following)
return div1.compareDocumentPosition(document.createElement("div"))&1;}); // Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if(!assert(function(div){div.innerHTML="<a href='#'></a>";return div.firstChild.getAttribute("href")==="#";})){addHandle("type|href|height|width",function(elem,name,isXML){if(!isXML){return elem.getAttribute(name,name.toLowerCase()==="type"?1:2);}});} // Support: IE<9
// Use defaultValue in place of getAttribute("value")
if(!support.attributes||!assert(function(div){div.innerHTML="<input/>";div.firstChild.setAttribute("value","");return div.firstChild.getAttribute("value")==="";})){addHandle("value",function(elem,name,isXML){if(!isXML&&elem.nodeName.toLowerCase()==="input"){return elem.defaultValue;}});} // Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if(!assert(function(div){return div.getAttribute("disabled")==null;})){addHandle(booleans,function(elem,name,isXML){var val;if(!isXML){return elem[name]===true?name.toLowerCase():(val=elem.getAttributeNode(name))&&val.specified?val.value:null;}});}return Sizzle;}(window);jQuery.find=Sizzle;jQuery.expr=Sizzle.selectors;jQuery.expr[":"]=jQuery.expr.pseudos;jQuery.uniqueSort=jQuery.unique=Sizzle.uniqueSort;jQuery.text=Sizzle.getText;jQuery.isXMLDoc=Sizzle.isXML;jQuery.contains=Sizzle.contains;var dir=function dir(elem,_dir,until){var matched=[],truncate=until!==undefined;while((elem=elem[_dir])&&elem.nodeType!==9){if(elem.nodeType===1){if(truncate&&jQuery(elem).is(until)){break;}matched.push(elem);}}return matched;};var _siblings=function _siblings(n,elem){var matched=[];for(;n;n=n.nextSibling){if(n.nodeType===1&&n!==elem){matched.push(n);}}return matched;};var rneedsContext=jQuery.expr.match.needsContext;var rsingleTag=/^<([\w-]+)\s*\/?>(?:<\/\1>|)$/;var risSimple=/^.[^:#\[\.,]*$/; // Implement the identical functionality for filter and not
function winnow(elements,qualifier,not){if(jQuery.isFunction(qualifier)){return jQuery.grep(elements,function(elem,i){ /* jshint -W018 */return !!qualifier.call(elem,i,elem)!==not;});}if(qualifier.nodeType){return jQuery.grep(elements,function(elem){return elem===qualifier!==not;});}if(typeof qualifier==="string"){if(risSimple.test(qualifier)){return jQuery.filter(qualifier,elements,not);}qualifier=jQuery.filter(qualifier,elements);}return jQuery.grep(elements,function(elem){return indexOf.call(qualifier,elem)>-1!==not;});}jQuery.filter=function(expr,elems,not){var elem=elems[0];if(not){expr=":not("+expr+")";}return elems.length===1&&elem.nodeType===1?jQuery.find.matchesSelector(elem,expr)?[elem]:[]:jQuery.find.matches(expr,jQuery.grep(elems,function(elem){return elem.nodeType===1;}));};jQuery.fn.extend({find:function find(selector){var i,len=this.length,ret=[],self=this;if(typeof selector!=="string"){return this.pushStack(jQuery(selector).filter(function(){for(i=0;i<len;i++){if(jQuery.contains(self[i],this)){return true;}}}));}for(i=0;i<len;i++){jQuery.find(selector,self[i],ret);} // Needed because $( selector, context ) becomes $( context ).find( selector )
ret=this.pushStack(len>1?jQuery.unique(ret):ret);ret.selector=this.selector?this.selector+" "+selector:selector;return ret;},filter:function filter(selector){return this.pushStack(winnow(this,selector||[],false));},not:function not(selector){return this.pushStack(winnow(this,selector||[],true));},is:function is(selector){return !!winnow(this, // If this is a positional/relative selector, check membership in the returned set
// so $("p:first").is("p:last") won't return true for a doc with two "p".
typeof selector==="string"&&rneedsContext.test(selector)?jQuery(selector):selector||[],false).length;}}); // Initialize a jQuery object
// A central reference to the root jQuery(document)
var rootjQuery, // A simple way to check for HTML strings
// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
// Strict HTML recognition (#11290: must start with <)
rquickExpr=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,init=jQuery.fn.init=function(selector,context,root){var match,elem; // HANDLE: $(""), $(null), $(undefined), $(false)
if(!selector){return this;} // Method init() accepts an alternate rootjQuery
// so migrate can support jQuery.sub (gh-2101)
root=root||rootjQuery; // Handle HTML strings
if(typeof selector==="string"){if(selector[0]==="<"&&selector[selector.length-1]===">"&&selector.length>=3){ // Assume that strings that start and end with <> are HTML and skip the regex check
match=[null,selector,null];}else {match=rquickExpr.exec(selector);} // Match html or make sure no context is specified for #id
if(match&&(match[1]||!context)){ // HANDLE: $(html) -> $(array)
if(match[1]){context=context instanceof jQuery?context[0]:context; // Option to run scripts is true for back-compat
// Intentionally let the error be thrown if parseHTML is not present
jQuery.merge(this,jQuery.parseHTML(match[1],context&&context.nodeType?context.ownerDocument||context:document,true)); // HANDLE: $(html, props)
if(rsingleTag.test(match[1])&&jQuery.isPlainObject(context)){for(match in context){ // Properties of context are called as methods if possible
if(jQuery.isFunction(this[match])){this[match](context[match]); // ...and otherwise set as attributes
}else {this.attr(match,context[match]);}}}return this; // HANDLE: $(#id)
}else {elem=document.getElementById(match[2]); // Support: Blackberry 4.6
// gEBID returns nodes no longer in the document (#6963)
if(elem&&elem.parentNode){ // Inject the element directly into the jQuery object
this.length=1;this[0]=elem;}this.context=document;this.selector=selector;return this;} // HANDLE: $(expr, $(...))
}else if(!context||context.jquery){return (context||root).find(selector); // HANDLE: $(expr, context)
// (which is just equivalent to: $(context).find(expr)
}else {return this.constructor(context).find(selector);} // HANDLE: $(DOMElement)
}else if(selector.nodeType){this.context=this[0]=selector;this.length=1;return this; // HANDLE: $(function)
// Shortcut for document ready
}else if(jQuery.isFunction(selector)){return root.ready!==undefined?root.ready(selector): // Execute immediately if ready is not present
selector(jQuery);}if(selector.selector!==undefined){this.selector=selector.selector;this.context=selector.context;}return jQuery.makeArray(selector,this);}; // Give the init function the jQuery prototype for later instantiation
init.prototype=jQuery.fn; // Initialize central reference
rootjQuery=jQuery(document);var rparentsprev=/^(?:parents|prev(?:Until|All))/, // Methods guaranteed to produce a unique set when starting from a unique set
guaranteedUnique={children:true,contents:true,next:true,prev:true};jQuery.fn.extend({has:function has(target){var targets=jQuery(target,this),l=targets.length;return this.filter(function(){var i=0;for(;i<l;i++){if(jQuery.contains(this,targets[i])){return true;}}});},closest:function closest(selectors,context){var cur,i=0,l=this.length,matched=[],pos=rneedsContext.test(selectors)||typeof selectors!=="string"?jQuery(selectors,context||this.context):0;for(;i<l;i++){for(cur=this[i];cur&&cur!==context;cur=cur.parentNode){ // Always skip document fragments
if(cur.nodeType<11&&(pos?pos.index(cur)>-1: // Don't pass non-elements to Sizzle
cur.nodeType===1&&jQuery.find.matchesSelector(cur,selectors))){matched.push(cur);break;}}}return this.pushStack(matched.length>1?jQuery.uniqueSort(matched):matched);}, // Determine the position of an element within the set
index:function index(elem){ // No argument, return index in parent
if(!elem){return this[0]&&this[0].parentNode?this.first().prevAll().length:-1;} // Index in selector
if(typeof elem==="string"){return indexOf.call(jQuery(elem),this[0]);} // Locate the position of the desired element
return indexOf.call(this, // If it receives a jQuery object, the first element is used
elem.jquery?elem[0]:elem);},add:function add(selector,context){return this.pushStack(jQuery.uniqueSort(jQuery.merge(this.get(),jQuery(selector,context))));},addBack:function addBack(selector){return this.add(selector==null?this.prevObject:this.prevObject.filter(selector));}});function sibling(cur,dir){while((cur=cur[dir])&&cur.nodeType!==1){}return cur;}jQuery.each({parent:function parent(elem){var parent=elem.parentNode;return parent&&parent.nodeType!==11?parent:null;},parents:function parents(elem){return dir(elem,"parentNode");},parentsUntil:function parentsUntil(elem,i,until){return dir(elem,"parentNode",until);},next:function next(elem){return sibling(elem,"nextSibling");},prev:function prev(elem){return sibling(elem,"previousSibling");},nextAll:function nextAll(elem){return dir(elem,"nextSibling");},prevAll:function prevAll(elem){return dir(elem,"previousSibling");},nextUntil:function nextUntil(elem,i,until){return dir(elem,"nextSibling",until);},prevUntil:function prevUntil(elem,i,until){return dir(elem,"previousSibling",until);},siblings:function siblings(elem){return _siblings((elem.parentNode||{}).firstChild,elem);},children:function children(elem){return _siblings(elem.firstChild);},contents:function contents(elem){return elem.contentDocument||jQuery.merge([],elem.childNodes);}},function(name,fn){jQuery.fn[name]=function(until,selector){var matched=jQuery.map(this,fn,until);if(name.slice(-5)!=="Until"){selector=until;}if(selector&&typeof selector==="string"){matched=jQuery.filter(selector,matched);}if(this.length>1){ // Remove duplicates
if(!guaranteedUnique[name]){jQuery.uniqueSort(matched);} // Reverse order for parents* and prev-derivatives
if(rparentsprev.test(name)){matched.reverse();}}return this.pushStack(matched);};});var rnotwhite=/\S+/g; // Convert String-formatted options into Object-formatted ones
function createOptions(options){var object={};jQuery.each(options.match(rnotwhite)||[],function(_,flag){object[flag]=true;});return object;} /*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */jQuery.Callbacks=function(options){ // Convert options from String-formatted to Object-formatted if needed
// (we check in cache first)
options=typeof options==="string"?createOptions(options):jQuery.extend({},options);var  // Flag to know if list is currently firing
firing, // Last fire value for non-forgettable lists
memory, // Flag to know if list was already fired
_fired, // Flag to prevent firing
_locked, // Actual callback list
list=[], // Queue of execution data for repeatable lists
queue=[], // Index of currently firing callback (modified by add/remove as needed)
firingIndex=-1, // Fire callbacks
fire=function fire(){ // Enforce single-firing
_locked=options.once; // Execute callbacks for all pending executions,
// respecting firingIndex overrides and runtime changes
_fired=firing=true;for(;queue.length;firingIndex=-1){memory=queue.shift();while(++firingIndex<list.length){ // Run callback and check for early termination
if(list[firingIndex].apply(memory[0],memory[1])===false&&options.stopOnFalse){ // Jump to end and forget the data so .add doesn't re-fire
firingIndex=list.length;memory=false;}}} // Forget the data if we're done with it
if(!options.memory){memory=false;}firing=false; // Clean up if we're done firing for good
if(_locked){ // Keep an empty list if we have data for future add calls
if(memory){list=[]; // Otherwise, this object is spent
}else {list="";}}}, // Actual Callbacks object
self={ // Add a callback or a collection of callbacks to the list
add:function add(){if(list){ // If we have memory from a past run, we should fire after adding
if(memory&&!firing){firingIndex=list.length-1;queue.push(memory);}(function add(args){jQuery.each(args,function(_,arg){if(jQuery.isFunction(arg)){if(!options.unique||!self.has(arg)){list.push(arg);}}else if(arg&&arg.length&&jQuery.type(arg)!=="string"){ // Inspect recursively
add(arg);}});})(arguments);if(memory&&!firing){fire();}}return this;}, // Remove a callback from the list
remove:function remove(){jQuery.each(arguments,function(_,arg){var index;while((index=jQuery.inArray(arg,list,index))>-1){list.splice(index,1); // Handle firing indexes
if(index<=firingIndex){firingIndex--;}}});return this;}, // Check if a given callback is in the list.
// If no argument is given, return whether or not list has callbacks attached.
has:function has(fn){return fn?jQuery.inArray(fn,list)>-1:list.length>0;}, // Remove all callbacks from the list
empty:function empty(){if(list){list=[];}return this;}, // Disable .fire and .add
// Abort any current/pending executions
// Clear all callbacks and values
disable:function disable(){_locked=queue=[];list=memory="";return this;},disabled:function disabled(){return !list;}, // Disable .fire
// Also disable .add unless we have memory (since it would have no effect)
// Abort any pending executions
lock:function lock(){_locked=queue=[];if(!memory){list=memory="";}return this;},locked:function locked(){return !!_locked;}, // Call all callbacks with the given context and arguments
fireWith:function fireWith(context,args){if(!_locked){args=args||[];args=[context,args.slice?args.slice():args];queue.push(args);if(!firing){fire();}}return this;}, // Call all the callbacks with the given arguments
fire:function fire(){self.fireWith(this,arguments);return this;}, // To know if the callbacks have already been called at least once
fired:function fired(){return !!_fired;}};return self;};jQuery.extend({Deferred:function Deferred(func){var tuples=[ // action, add listener, listener list, final state
["resolve","done",jQuery.Callbacks("once memory"),"resolved"],["reject","fail",jQuery.Callbacks("once memory"),"rejected"],["notify","progress",jQuery.Callbacks("memory")]],_state2="pending",_promise={state:function state(){return _state2;},always:function always(){deferred.done(arguments).fail(arguments);return this;},then:function then() /* fnDone, fnFail, fnProgress */{var fns=arguments;return jQuery.Deferred(function(newDefer){jQuery.each(tuples,function(i,tuple){var fn=jQuery.isFunction(fns[i])&&fns[i]; // deferred[ done | fail | progress ] for forwarding actions to newDefer
deferred[tuple[1]](function(){var returned=fn&&fn.apply(this,arguments);if(returned&&jQuery.isFunction(returned.promise)){returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);}else {newDefer[tuple[0]+"With"](this===_promise?newDefer.promise():this,fn?[returned]:arguments);}});});fns=null;}).promise();}, // Get a promise for this deferred
// If obj is provided, the promise aspect is added to the object
promise:function promise(obj){return obj!=null?jQuery.extend(obj,_promise):_promise;}},deferred={}; // Keep pipe for back-compat
_promise.pipe=_promise.then; // Add list-specific methods
jQuery.each(tuples,function(i,tuple){var list=tuple[2],stateString=tuple[3]; // promise[ done | fail | progress ] = list.add
_promise[tuple[1]]=list.add; // Handle state
if(stateString){list.add(function(){ // state = [ resolved | rejected ]
_state2=stateString; // [ reject_list | resolve_list ].disable; progress_list.lock
},tuples[i^1][2].disable,tuples[2][2].lock);} // deferred[ resolve | reject | notify ]
deferred[tuple[0]]=function(){deferred[tuple[0]+"With"](this===deferred?_promise:this,arguments);return this;};deferred[tuple[0]+"With"]=list.fireWith;}); // Make the deferred a promise
_promise.promise(deferred); // Call given func if any
if(func){func.call(deferred,deferred);} // All done!
return deferred;}, // Deferred helper
when:function when(subordinate /* , ..., subordinateN */){var i=0,resolveValues=_slice.call(arguments),length=resolveValues.length, // the count of uncompleted subordinates
remaining=length!==1||subordinate&&jQuery.isFunction(subordinate.promise)?length:0, // the master Deferred.
// If resolveValues consist of only a single Deferred, just use that.
deferred=remaining===1?subordinate:jQuery.Deferred(), // Update function for both resolve and progress values
updateFunc=function updateFunc(i,contexts,values){return function(value){contexts[i]=this;values[i]=arguments.length>1?_slice.call(arguments):value;if(values===progressValues){deferred.notifyWith(contexts,values);}else if(! --remaining){deferred.resolveWith(contexts,values);}};},progressValues,progressContexts,resolveContexts; // Add listeners to Deferred subordinates; treat others as resolved
if(length>1){progressValues=new Array(length);progressContexts=new Array(length);resolveContexts=new Array(length);for(;i<length;i++){if(resolveValues[i]&&jQuery.isFunction(resolveValues[i].promise)){resolveValues[i].promise().progress(updateFunc(i,progressContexts,progressValues)).done(updateFunc(i,resolveContexts,resolveValues)).fail(deferred.reject);}else {--remaining;}}} // If we're not waiting on anything, resolve the master
if(!remaining){deferred.resolveWith(resolveContexts,resolveValues);}return deferred.promise();}}); // The deferred used on DOM ready
var readyList;jQuery.fn.ready=function(fn){ // Add the callback
jQuery.ready.promise().done(fn);return this;};jQuery.extend({ // Is the DOM ready to be used? Set to true once it occurs.
isReady:false, // A counter to track how many items to wait for before
// the ready event fires. See #6781
readyWait:1, // Hold (or release) the ready event
holdReady:function holdReady(hold){if(hold){jQuery.readyWait++;}else {jQuery.ready(true);}}, // Handle when the DOM is ready
ready:function ready(wait){ // Abort if there are pending holds or we're already ready
if(wait===true?--jQuery.readyWait:jQuery.isReady){return;} // Remember that the DOM is ready
jQuery.isReady=true; // If a normal DOM Ready event fired, decrement, and wait if need be
if(wait!==true&&--jQuery.readyWait>0){return;} // If there are functions bound, to execute
readyList.resolveWith(document,[jQuery]); // Trigger any bound ready events
if(jQuery.fn.triggerHandler){jQuery(document).triggerHandler("ready");jQuery(document).off("ready");}}}); /**
 * The ready event handler and self cleanup method
 */function completed(){document.removeEventListener("DOMContentLoaded",completed);window.removeEventListener("load",completed);jQuery.ready();}jQuery.ready.promise=function(obj){if(!readyList){readyList=jQuery.Deferred(); // Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE9-10 only
// Older IE sometimes signals "interactive" too soon
if(document.readyState==="complete"||document.readyState!=="loading"&&!document.documentElement.doScroll){ // Handle it asynchronously to allow scripts the opportunity to delay ready
window.setTimeout(jQuery.ready);}else { // Use the handy event callback
document.addEventListener("DOMContentLoaded",completed); // A fallback to window.onload, that will always work
window.addEventListener("load",completed);}}return readyList.promise(obj);}; // Kick off the DOM ready check even if the user does not
jQuery.ready.promise(); // Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access=function access(elems,fn,key,value,chainable,emptyGet,raw){var i=0,len=elems.length,bulk=key==null; // Sets many values
if(jQuery.type(key)==="object"){chainable=true;for(i in key){access(elems,fn,i,key[i],true,emptyGet,raw);} // Sets one value
}else if(value!==undefined){chainable=true;if(!jQuery.isFunction(value)){raw=true;}if(bulk){ // Bulk operations run against the entire set
if(raw){fn.call(elems,value);fn=null; // ...except when executing function values
}else {bulk=fn;fn=function fn(elem,key,value){return bulk.call(jQuery(elem),value);};}}if(fn){for(;i<len;i++){fn(elems[i],key,raw?value:value.call(elems[i],i,fn(elems[i],key)));}}}return chainable?elems: // Gets
bulk?fn.call(elems):len?fn(elems[0],key):emptyGet;};var acceptData=function acceptData(owner){ // Accepts only:
//  - Node
//    - Node.ELEMENT_NODE
//    - Node.DOCUMENT_NODE
//  - Object
//    - Any
/* jshint -W018 */return owner.nodeType===1||owner.nodeType===9||! +owner.nodeType;};function Data(){this.expando=jQuery.expando+Data.uid++;}Data.uid=1;Data.prototype={register:function register(owner,initial){var value=initial||{}; // If it is a node unlikely to be stringify-ed or looped over
// use plain assignment
if(owner.nodeType){owner[this.expando]=value; // Otherwise secure it in a non-enumerable, non-writable property
// configurability must be true to allow the property to be
// deleted with the delete operator
}else {Object.defineProperty(owner,this.expando,{value:value,writable:true,configurable:true});}return owner[this.expando];},cache:function cache(owner){ // We can accept data for non-element nodes in modern browsers,
// but we should not, see #8335.
// Always return an empty object.
if(!acceptData(owner)){return {};} // Check if the owner object already has a cache
var value=owner[this.expando]; // If not, create one
if(!value){value={}; // We can accept data for non-element nodes in modern browsers,
// but we should not, see #8335.
// Always return an empty object.
if(acceptData(owner)){ // If it is a node unlikely to be stringify-ed or looped over
// use plain assignment
if(owner.nodeType){owner[this.expando]=value; // Otherwise secure it in a non-enumerable property
// configurable must be true to allow the property to be
// deleted when data is removed
}else {Object.defineProperty(owner,this.expando,{value:value,configurable:true});}}}return value;},set:function set(owner,data,value){var prop,cache=this.cache(owner); // Handle: [ owner, key, value ] args
if(typeof data==="string"){cache[data]=value; // Handle: [ owner, { properties } ] args
}else { // Copy the properties one-by-one to the cache object
for(prop in data){cache[prop]=data[prop];}}return cache;},get:function get(owner,key){return key===undefined?this.cache(owner):owner[this.expando]&&owner[this.expando][key];},access:function access(owner,key,value){var stored; // In cases where either:
//
//   1. No key was specified
//   2. A string key was specified, but no value provided
//
// Take the "read" path and allow the get method to determine
// which value to return, respectively either:
//
//   1. The entire cache object
//   2. The data stored at the key
//
if(key===undefined||key&&typeof key==="string"&&value===undefined){stored=this.get(owner,key);return stored!==undefined?stored:this.get(owner,jQuery.camelCase(key));} // When the key is not a string, or both a key and value
// are specified, set or extend (existing objects) with either:
//
//   1. An object of properties
//   2. A key and value
//
this.set(owner,key,value); // Since the "set" path can have two possible entry points
// return the expected data based on which path was taken[*]
return value!==undefined?value:key;},remove:function remove(owner,key){var i,name,camel,cache=owner[this.expando];if(cache===undefined){return;}if(key===undefined){this.register(owner);}else { // Support array or space separated string of keys
if(jQuery.isArray(key)){ // If "name" is an array of keys...
// When data is initially created, via ("key", "val") signature,
// keys will be converted to camelCase.
// Since there is no way to tell _how_ a key was added, remove
// both plain key and camelCase key. #12786
// This will only penalize the array argument path.
name=key.concat(key.map(jQuery.camelCase));}else {camel=jQuery.camelCase(key); // Try the string as a key before any manipulation
if(key in cache){name=[key,camel];}else { // If a key with the spaces exists, use it.
// Otherwise, create an array by matching non-whitespace
name=camel;name=name in cache?[name]:name.match(rnotwhite)||[];}}i=name.length;while(i--){delete cache[name[i]];}} // Remove the expando if there's no more data
if(key===undefined||jQuery.isEmptyObject(cache)){ // Support: Chrome <= 35-45+
// Webkit & Blink performance suffers when deleting properties
// from DOM nodes, so set to undefined instead
// https://code.google.com/p/chromium/issues/detail?id=378607
if(owner.nodeType){owner[this.expando]=undefined;}else {delete owner[this.expando];}}},hasData:function hasData(owner){var cache=owner[this.expando];return cache!==undefined&&!jQuery.isEmptyObject(cache);}};var dataPriv=new Data();var dataUser=new Data(); //	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014
var rbrace=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,rmultiDash=/[A-Z]/g;function dataAttr(elem,key,data){var name; // If nothing was found internally, try to fetch any
// data from the HTML5 data-* attribute
if(data===undefined&&elem.nodeType===1){name="data-"+key.replace(rmultiDash,"-$&").toLowerCase();data=elem.getAttribute(name);if(typeof data==="string"){try{data=data==="true"?true:data==="false"?false:data==="null"?null: // Only convert to a number if it doesn't change the string
+data+""===data?+data:rbrace.test(data)?jQuery.parseJSON(data):data;}catch(e){} // Make sure we set the data so it isn't changed later
dataUser.set(elem,key,data);}else {data=undefined;}}return data;}jQuery.extend({hasData:function hasData(elem){return dataUser.hasData(elem)||dataPriv.hasData(elem);},data:function data(elem,name,_data){return dataUser.access(elem,name,_data);},removeData:function removeData(elem,name){dataUser.remove(elem,name);}, // TODO: Now that all calls to _data and _removeData have been replaced
// with direct calls to dataPriv methods, these can be deprecated.
_data:function _data(elem,name,data){return dataPriv.access(elem,name,data);},_removeData:function _removeData(elem,name){dataPriv.remove(elem,name);}});jQuery.fn.extend({data:function data(key,value){var i,name,data,elem=this[0],attrs=elem&&elem.attributes; // Gets all values
if(key===undefined){if(this.length){data=dataUser.get(elem);if(elem.nodeType===1&&!dataPriv.get(elem,"hasDataAttrs")){i=attrs.length;while(i--){ // Support: IE11+
// The attrs elements can be null (#14894)
if(attrs[i]){name=attrs[i].name;if(name.indexOf("data-")===0){name=jQuery.camelCase(name.slice(5));dataAttr(elem,name,data[name]);}}}dataPriv.set(elem,"hasDataAttrs",true);}}return data;} // Sets multiple values
if((typeof key==="undefined"?"undefined":_typeof(key))==="object"){return this.each(function(){dataUser.set(this,key);});}return access(this,function(value){var data,camelKey; // The calling jQuery object (element matches) is not empty
// (and therefore has an element appears at this[ 0 ]) and the
// `value` parameter was not undefined. An empty jQuery object
// will result in `undefined` for elem = this[ 0 ] which will
// throw an exception if an attempt to read a data cache is made.
if(elem&&value===undefined){ // Attempt to get data from the cache
// with the key as-is
data=dataUser.get(elem,key)|| // Try to find dashed key if it exists (gh-2779)
// This is for 2.2.x only
dataUser.get(elem,key.replace(rmultiDash,"-$&").toLowerCase());if(data!==undefined){return data;}camelKey=jQuery.camelCase(key); // Attempt to get data from the cache
// with the key camelized
data=dataUser.get(elem,camelKey);if(data!==undefined){return data;} // Attempt to "discover" the data in
// HTML5 custom data-* attrs
data=dataAttr(elem,camelKey,undefined);if(data!==undefined){return data;} // We tried really hard, but the data doesn't exist.
return;} // Set the data...
camelKey=jQuery.camelCase(key);this.each(function(){ // First, attempt to store a copy or reference of any
// data that might've been store with a camelCased key.
var data=dataUser.get(this,camelKey); // For HTML5 data-* attribute interop, we have to
// store property names with dashes in a camelCase form.
// This might not apply to all properties...*
dataUser.set(this,camelKey,value); // *... In the case of properties that might _actually_
// have dashes, we need to also store a copy of that
// unchanged property.
if(key.indexOf("-")>-1&&data!==undefined){dataUser.set(this,key,value);}});},null,value,arguments.length>1,null,true);},removeData:function removeData(key){return this.each(function(){dataUser.remove(this,key);});}});jQuery.extend({queue:function queue(elem,type,data){var queue;if(elem){type=(type||"fx")+"queue";queue=dataPriv.get(elem,type); // Speed up dequeue by getting out quickly if this is just a lookup
if(data){if(!queue||jQuery.isArray(data)){queue=dataPriv.access(elem,type,jQuery.makeArray(data));}else {queue.push(data);}}return queue||[];}},dequeue:function dequeue(elem,type){type=type||"fx";var queue=jQuery.queue(elem,type),startLength=queue.length,fn=queue.shift(),hooks=jQuery._queueHooks(elem,type),next=function next(){jQuery.dequeue(elem,type);}; // If the fx queue is dequeued, always remove the progress sentinel
if(fn==="inprogress"){fn=queue.shift();startLength--;}if(fn){ // Add a progress sentinel to prevent the fx queue from being
// automatically dequeued
if(type==="fx"){queue.unshift("inprogress");} // Clear up the last queue stop function
delete hooks.stop;fn.call(elem,next,hooks);}if(!startLength&&hooks){hooks.empty.fire();}}, // Not public - generate a queueHooks object, or return the current one
_queueHooks:function _queueHooks(elem,type){var key=type+"queueHooks";return dataPriv.get(elem,key)||dataPriv.access(elem,key,{empty:jQuery.Callbacks("once memory").add(function(){dataPriv.remove(elem,[type+"queue",key]);})});}});jQuery.fn.extend({queue:function queue(type,data){var setter=2;if(typeof type!=="string"){data=type;type="fx";setter--;}if(arguments.length<setter){return jQuery.queue(this[0],type);}return data===undefined?this:this.each(function(){var queue=jQuery.queue(this,type,data); // Ensure a hooks for this queue
jQuery._queueHooks(this,type);if(type==="fx"&&queue[0]!=="inprogress"){jQuery.dequeue(this,type);}});},dequeue:function dequeue(type){return this.each(function(){jQuery.dequeue(this,type);});},clearQueue:function clearQueue(type){return this.queue(type||"fx",[]);}, // Get a promise resolved when queues of a certain type
// are emptied (fx is the type by default)
promise:function promise(type,obj){var tmp,count=1,defer=jQuery.Deferred(),elements=this,i=this.length,resolve=function resolve(){if(! --count){defer.resolveWith(elements,[elements]);}};if(typeof type!=="string"){obj=type;type=undefined;}type=type||"fx";while(i--){tmp=dataPriv.get(elements[i],type+"queueHooks");if(tmp&&tmp.empty){count++;tmp.empty.add(resolve);}}resolve();return defer.promise(obj);}});var pnum=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;var rcssNum=new RegExp("^(?:([+-])=|)("+pnum+")([a-z%]*)$","i");var cssExpand=["Top","Right","Bottom","Left"];var isHidden=function isHidden(elem,el){ // isHidden might be called from jQuery#filter function;
// in that case, element will be second argument
elem=el||elem;return jQuery.css(elem,"display")==="none"||!jQuery.contains(elem.ownerDocument,elem);};function adjustCSS(elem,prop,valueParts,tween){var adjusted,scale=1,maxIterations=20,currentValue=tween?function(){return tween.cur();}:function(){return jQuery.css(elem,prop,"");},initial=currentValue(),unit=valueParts&&valueParts[3]||(jQuery.cssNumber[prop]?"":"px"), // Starting value computation is required for potential unit mismatches
initialInUnit=(jQuery.cssNumber[prop]||unit!=="px"&&+initial)&&rcssNum.exec(jQuery.css(elem,prop));if(initialInUnit&&initialInUnit[3]!==unit){ // Trust units reported by jQuery.css
unit=unit||initialInUnit[3]; // Make sure we update the tween properties later on
valueParts=valueParts||[]; // Iteratively approximate from a nonzero starting point
initialInUnit=+initial||1;do { // If previous iteration zeroed out, double until we get *something*.
// Use string for doubling so we don't accidentally see scale as unchanged below
scale=scale||".5"; // Adjust and apply
initialInUnit=initialInUnit/scale;jQuery.style(elem,prop,initialInUnit+unit); // Update scale, tolerating zero or NaN from tween.cur()
// Break the loop if scale is unchanged or perfect, or if we've just had enough.
}while(scale!==(scale=currentValue()/initial)&&scale!==1&&--maxIterations);}if(valueParts){initialInUnit=+initialInUnit||+initial||0; // Apply relative offset (+=/-=) if specified
adjusted=valueParts[1]?initialInUnit+(valueParts[1]+1)*valueParts[2]:+valueParts[2];if(tween){tween.unit=unit;tween.start=initialInUnit;tween.end=adjusted;}}return adjusted;}var rcheckableType=/^(?:checkbox|radio)$/i;var rtagName=/<([\w:-]+)/;var rscriptType=/^$|\/(?:java|ecma)script/i; // We have to close these tags to support XHTML (#13200)
var wrapMap={ // Support: IE9
option:[1,"<select multiple='multiple'>","</select>"], // XHTML parsers do not magically insert elements in the
// same way that tag soup parsers do. So we cannot shorten
// this by omitting <tbody> or other required elements.
thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]}; // Support: IE9
wrapMap.optgroup=wrapMap.option;wrapMap.tbody=wrapMap.tfoot=wrapMap.colgroup=wrapMap.caption=wrapMap.thead;wrapMap.th=wrapMap.td;function getAll(context,tag){ // Support: IE9-11+
// Use typeof to avoid zero-argument method invocation on host objects (#15151)
var ret=typeof context.getElementsByTagName!=="undefined"?context.getElementsByTagName(tag||"*"):typeof context.querySelectorAll!=="undefined"?context.querySelectorAll(tag||"*"):[];return tag===undefined||tag&&jQuery.nodeName(context,tag)?jQuery.merge([context],ret):ret;} // Mark scripts as having already been evaluated
function setGlobalEval(elems,refElements){var i=0,l=elems.length;for(;i<l;i++){dataPriv.set(elems[i],"globalEval",!refElements||dataPriv.get(refElements[i],"globalEval"));}}var rhtml=/<|&#?\w+;/;function buildFragment(elems,context,scripts,selection,ignored){var elem,tmp,tag,wrap,contains,j,fragment=context.createDocumentFragment(),nodes=[],i=0,l=elems.length;for(;i<l;i++){elem=elems[i];if(elem||elem===0){ // Add nodes directly
if(jQuery.type(elem)==="object"){ // Support: Android<4.1, PhantomJS<2
// push.apply(_, arraylike) throws on ancient WebKit
jQuery.merge(nodes,elem.nodeType?[elem]:elem); // Convert non-html into a text node
}else if(!rhtml.test(elem)){nodes.push(context.createTextNode(elem)); // Convert html into DOM nodes
}else {tmp=tmp||fragment.appendChild(context.createElement("div")); // Deserialize a standard representation
tag=(rtagName.exec(elem)||["",""])[1].toLowerCase();wrap=wrapMap[tag]||wrapMap._default;tmp.innerHTML=wrap[1]+jQuery.htmlPrefilter(elem)+wrap[2]; // Descend through wrappers to the right content
j=wrap[0];while(j--){tmp=tmp.lastChild;} // Support: Android<4.1, PhantomJS<2
// push.apply(_, arraylike) throws on ancient WebKit
jQuery.merge(nodes,tmp.childNodes); // Remember the top-level container
tmp=fragment.firstChild; // Ensure the created nodes are orphaned (#12392)
tmp.textContent="";}}} // Remove wrapper from fragment
fragment.textContent="";i=0;while(elem=nodes[i++]){ // Skip elements already in the context collection (trac-4087)
if(selection&&jQuery.inArray(elem,selection)>-1){if(ignored){ignored.push(elem);}continue;}contains=jQuery.contains(elem.ownerDocument,elem); // Append to fragment
tmp=getAll(fragment.appendChild(elem),"script"); // Preserve script evaluation history
if(contains){setGlobalEval(tmp);} // Capture executables
if(scripts){j=0;while(elem=tmp[j++]){if(rscriptType.test(elem.type||"")){scripts.push(elem);}}}}return fragment;}(function(){var fragment=document.createDocumentFragment(),div=fragment.appendChild(document.createElement("div")),input=document.createElement("input"); // Support: Android 4.0-4.3, Safari<=5.1
// Check state lost if the name is set (#11217)
// Support: Windows Web Apps (WWA)
// `name` and `type` must use .setAttribute for WWA (#14901)
input.setAttribute("type","radio");input.setAttribute("checked","checked");input.setAttribute("name","t");div.appendChild(input); // Support: Safari<=5.1, Android<4.2
// Older WebKit doesn't clone checked state correctly in fragments
support.checkClone=div.cloneNode(true).cloneNode(true).lastChild.checked; // Support: IE<=11+
// Make sure textarea (and checkbox) defaultValue is properly cloned
div.innerHTML="<textarea>x</textarea>";support.noCloneChecked=!!div.cloneNode(true).lastChild.defaultValue;})();var rkeyEvent=/^key/,rmouseEvent=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,rtypenamespace=/^([^.]*)(?:\.(.+)|)/;function returnTrue(){return true;}function returnFalse(){return false;} // Support: IE9
// See #13393 for more info
function safeActiveElement(){try{return document.activeElement;}catch(err){}}function _on(elem,types,selector,data,fn,one){var origFn,type; // Types can be a map of types/handlers
if((typeof types==="undefined"?"undefined":_typeof(types))==="object"){ // ( types-Object, selector, data )
if(typeof selector!=="string"){ // ( types-Object, data )
data=data||selector;selector=undefined;}for(type in types){_on(elem,type,selector,data,types[type],one);}return elem;}if(data==null&&fn==null){ // ( types, fn )
fn=selector;data=selector=undefined;}else if(fn==null){if(typeof selector==="string"){ // ( types, selector, fn )
fn=data;data=undefined;}else { // ( types, data, fn )
fn=data;data=selector;selector=undefined;}}if(fn===false){fn=returnFalse;}else if(!fn){return elem;}if(one===1){origFn=fn;fn=function fn(event){ // Can use an empty set, since event contains the info
jQuery().off(event);return origFn.apply(this,arguments);}; // Use same guid so caller can remove using origFn
fn.guid=origFn.guid||(origFn.guid=jQuery.guid++);}return elem.each(function(){jQuery.event.add(this,types,fn,data,selector);});} /*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */jQuery.event={global:{},add:function add(elem,types,handler,data,selector){var handleObjIn,eventHandle,tmp,events,t,handleObj,special,handlers,type,namespaces,origType,elemData=dataPriv.get(elem); // Don't attach events to noData or text/comment nodes (but allow plain objects)
if(!elemData){return;} // Caller can pass in an object of custom data in lieu of the handler
if(handler.handler){handleObjIn=handler;handler=handleObjIn.handler;selector=handleObjIn.selector;} // Make sure that the handler has a unique ID, used to find/remove it later
if(!handler.guid){handler.guid=jQuery.guid++;} // Init the element's event structure and main handler, if this is the first
if(!(events=elemData.events)){events=elemData.events={};}if(!(eventHandle=elemData.handle)){eventHandle=elemData.handle=function(e){ // Discard the second event of a jQuery.event.trigger() and
// when an event is called after a page has unloaded
return typeof jQuery!=="undefined"&&jQuery.event.triggered!==e.type?jQuery.event.dispatch.apply(elem,arguments):undefined;};} // Handle multiple events separated by a space
types=(types||"").match(rnotwhite)||[""];t=types.length;while(t--){tmp=rtypenamespace.exec(types[t])||[];type=origType=tmp[1];namespaces=(tmp[2]||"").split(".").sort(); // There *must* be a type, no attaching namespace-only handlers
if(!type){continue;} // If event changes its type, use the special event handlers for the changed type
special=jQuery.event.special[type]||{}; // If selector defined, determine special event api type, otherwise given type
type=(selector?special.delegateType:special.bindType)||type; // Update special based on newly reset type
special=jQuery.event.special[type]||{}; // handleObj is passed to all event handlers
handleObj=jQuery.extend({type:type,origType:origType,data:data,handler:handler,guid:handler.guid,selector:selector,needsContext:selector&&jQuery.expr.match.needsContext.test(selector),namespace:namespaces.join(".")},handleObjIn); // Init the event handler queue if we're the first
if(!(handlers=events[type])){handlers=events[type]=[];handlers.delegateCount=0; // Only use addEventListener if the special events handler returns false
if(!special.setup||special.setup.call(elem,data,namespaces,eventHandle)===false){if(elem.addEventListener){elem.addEventListener(type,eventHandle);}}}if(special.add){special.add.call(elem,handleObj);if(!handleObj.handler.guid){handleObj.handler.guid=handler.guid;}} // Add to the element's handler list, delegates in front
if(selector){handlers.splice(handlers.delegateCount++,0,handleObj);}else {handlers.push(handleObj);} // Keep track of which events have ever been used, for event optimization
jQuery.event.global[type]=true;}}, // Detach an event or set of events from an element
remove:function remove(elem,types,handler,selector,mappedTypes){var j,origCount,tmp,events,t,handleObj,special,handlers,type,namespaces,origType,elemData=dataPriv.hasData(elem)&&dataPriv.get(elem);if(!elemData||!(events=elemData.events)){return;} // Once for each type.namespace in types; type may be omitted
types=(types||"").match(rnotwhite)||[""];t=types.length;while(t--){tmp=rtypenamespace.exec(types[t])||[];type=origType=tmp[1];namespaces=(tmp[2]||"").split(".").sort(); // Unbind all events (on this namespace, if provided) for the element
if(!type){for(type in events){jQuery.event.remove(elem,type+types[t],handler,selector,true);}continue;}special=jQuery.event.special[type]||{};type=(selector?special.delegateType:special.bindType)||type;handlers=events[type]||[];tmp=tmp[2]&&new RegExp("(^|\\.)"+namespaces.join("\\.(?:.*\\.|)")+"(\\.|$)"); // Remove matching events
origCount=j=handlers.length;while(j--){handleObj=handlers[j];if((mappedTypes||origType===handleObj.origType)&&(!handler||handler.guid===handleObj.guid)&&(!tmp||tmp.test(handleObj.namespace))&&(!selector||selector===handleObj.selector||selector==="**"&&handleObj.selector)){handlers.splice(j,1);if(handleObj.selector){handlers.delegateCount--;}if(special.remove){special.remove.call(elem,handleObj);}}} // Remove generic event handler if we removed something and no more handlers exist
// (avoids potential for endless recursion during removal of special event handlers)
if(origCount&&!handlers.length){if(!special.teardown||special.teardown.call(elem,namespaces,elemData.handle)===false){jQuery.removeEvent(elem,type,elemData.handle);}delete events[type];}} // Remove data and the expando if it's no longer used
if(jQuery.isEmptyObject(events)){dataPriv.remove(elem,"handle events");}},dispatch:function dispatch(event){ // Make a writable jQuery.Event from the native event object
event=jQuery.event.fix(event);var i,j,ret,matched,handleObj,handlerQueue=[],args=_slice.call(arguments),handlers=(dataPriv.get(this,"events")||{})[event.type]||[],special=jQuery.event.special[event.type]||{}; // Use the fix-ed jQuery.Event rather than the (read-only) native event
args[0]=event;event.delegateTarget=this; // Call the preDispatch hook for the mapped type, and let it bail if desired
if(special.preDispatch&&special.preDispatch.call(this,event)===false){return;} // Determine handlers
handlerQueue=jQuery.event.handlers.call(this,event,handlers); // Run delegates first; they may want to stop propagation beneath us
i=0;while((matched=handlerQueue[i++])&&!event.isPropagationStopped()){event.currentTarget=matched.elem;j=0;while((handleObj=matched.handlers[j++])&&!event.isImmediatePropagationStopped()){ // Triggered event must either 1) have no namespace, or 2) have namespace(s)
// a subset or equal to those in the bound event (both can have no namespace).
if(!event.rnamespace||event.rnamespace.test(handleObj.namespace)){event.handleObj=handleObj;event.data=handleObj.data;ret=((jQuery.event.special[handleObj.origType]||{}).handle||handleObj.handler).apply(matched.elem,args);if(ret!==undefined){if((event.result=ret)===false){event.preventDefault();event.stopPropagation();}}}}} // Call the postDispatch hook for the mapped type
if(special.postDispatch){special.postDispatch.call(this,event);}return event.result;},handlers:function handlers(event,_handlers){var i,matches,sel,handleObj,handlerQueue=[],delegateCount=_handlers.delegateCount,cur=event.target; // Support (at least): Chrome, IE9
// Find delegate handlers
// Black-hole SVG <use> instance trees (#13180)
//
// Support: Firefox<=42+
// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
if(delegateCount&&cur.nodeType&&(event.type!=="click"||isNaN(event.button)||event.button<1)){for(;cur!==this;cur=cur.parentNode||this){ // Don't check non-elements (#13208)
// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
if(cur.nodeType===1&&(cur.disabled!==true||event.type!=="click")){matches=[];for(i=0;i<delegateCount;i++){handleObj=_handlers[i]; // Don't conflict with Object.prototype properties (#13203)
sel=handleObj.selector+" ";if(matches[sel]===undefined){matches[sel]=handleObj.needsContext?jQuery(sel,this).index(cur)>-1:jQuery.find(sel,this,null,[cur]).length;}if(matches[sel]){matches.push(handleObj);}}if(matches.length){handlerQueue.push({elem:cur,handlers:matches});}}}} // Add the remaining (directly-bound) handlers
if(delegateCount<_handlers.length){handlerQueue.push({elem:this,handlers:_handlers.slice(delegateCount)});}return handlerQueue;}, // Includes some event props shared by KeyEvent and MouseEvent
props:("altKey bubbles cancelable ctrlKey currentTarget detail eventPhase "+"metaKey relatedTarget shiftKey target timeStamp view which").split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function filter(event,original){ // Add which for key events
if(event.which==null){event.which=original.charCode!=null?original.charCode:original.keyCode;}return event;}},mouseHooks:{props:("button buttons clientX clientY offsetX offsetY pageX pageY "+"screenX screenY toElement").split(" "),filter:function filter(event,original){var eventDoc,doc,body,button=original.button; // Calculate pageX/Y if missing and clientX/Y available
if(event.pageX==null&&original.clientX!=null){eventDoc=event.target.ownerDocument||document;doc=eventDoc.documentElement;body=eventDoc.body;event.pageX=original.clientX+(doc&&doc.scrollLeft||body&&body.scrollLeft||0)-(doc&&doc.clientLeft||body&&body.clientLeft||0);event.pageY=original.clientY+(doc&&doc.scrollTop||body&&body.scrollTop||0)-(doc&&doc.clientTop||body&&body.clientTop||0);} // Add which for click: 1 === left; 2 === middle; 3 === right
// Note: button is not normalized, so don't use it
if(!event.which&&button!==undefined){event.which=button&1?1:button&2?3:button&4?2:0;}return event;}},fix:function fix(event){if(event[jQuery.expando]){return event;} // Create a writable copy of the event object and normalize some properties
var i,prop,copy,type=event.type,originalEvent=event,fixHook=this.fixHooks[type];if(!fixHook){this.fixHooks[type]=fixHook=rmouseEvent.test(type)?this.mouseHooks:rkeyEvent.test(type)?this.keyHooks:{};}copy=fixHook.props?this.props.concat(fixHook.props):this.props;event=new jQuery.Event(originalEvent);i=copy.length;while(i--){prop=copy[i];event[prop]=originalEvent[prop];} // Support: Cordova 2.5 (WebKit) (#13255)
// All events should have a target; Cordova deviceready doesn't
if(!event.target){event.target=document;} // Support: Safari 6.0+, Chrome<28
// Target should not be a text node (#504, #13143)
if(event.target.nodeType===3){event.target=event.target.parentNode;}return fixHook.filter?fixHook.filter(event,originalEvent):event;},special:{load:{ // Prevent triggered image.load events from bubbling to window.load
noBubble:true},focus:{ // Fire native event if possible so blur/focus sequence is correct
trigger:function trigger(){if(this!==safeActiveElement()&&this.focus){this.focus();return false;}},delegateType:"focusin"},blur:{trigger:function trigger(){if(this===safeActiveElement()&&this.blur){this.blur();return false;}},delegateType:"focusout"},click:{ // For checkbox, fire native event so checked state will be right
trigger:function trigger(){if(this.type==="checkbox"&&this.click&&jQuery.nodeName(this,"input")){this.click();return false;}}, // For cross-browser consistency, don't fire native .click() on links
_default:function _default(event){return jQuery.nodeName(event.target,"a");}},beforeunload:{postDispatch:function postDispatch(event){ // Support: Firefox 20+
// Firefox doesn't alert if the returnValue field is not set.
if(event.result!==undefined&&event.originalEvent){event.originalEvent.returnValue=event.result;}}}}};jQuery.removeEvent=function(elem,type,handle){ // This "if" is needed for plain objects
if(elem.removeEventListener){elem.removeEventListener(type,handle);}};jQuery.Event=function(src,props){ // Allow instantiation without the 'new' keyword
if(!(this instanceof jQuery.Event)){return new jQuery.Event(src,props);} // Event object
if(src&&src.type){this.originalEvent=src;this.type=src.type; // Events bubbling up the document may have been marked as prevented
// by a handler lower down the tree; reflect the correct value.
this.isDefaultPrevented=src.defaultPrevented||src.defaultPrevented===undefined&& // Support: Android<4.0
src.returnValue===false?returnTrue:returnFalse; // Event type
}else {this.type=src;} // Put explicitly provided properties onto the event object
if(props){jQuery.extend(this,props);} // Create a timestamp if incoming event doesn't have one
this.timeStamp=src&&src.timeStamp||jQuery.now(); // Mark it as fixed
this[jQuery.expando]=true;}; // jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype={constructor:jQuery.Event,isDefaultPrevented:returnFalse,isPropagationStopped:returnFalse,isImmediatePropagationStopped:returnFalse,preventDefault:function preventDefault(){var e=this.originalEvent;this.isDefaultPrevented=returnTrue;if(e){e.preventDefault();}},stopPropagation:function stopPropagation(){var e=this.originalEvent;this.isPropagationStopped=returnTrue;if(e){e.stopPropagation();}},stopImmediatePropagation:function stopImmediatePropagation(){var e=this.originalEvent;this.isImmediatePropagationStopped=returnTrue;if(e){e.stopImmediatePropagation();}this.stopPropagation();}}; // Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://code.google.com/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(orig,fix){jQuery.event.special[orig]={delegateType:fix,bindType:fix,handle:function handle(event){var ret,target=this,related=event.relatedTarget,handleObj=event.handleObj; // For mouseenter/leave call the handler if related is outside the target.
// NB: No relatedTarget if the mouse left/entered the browser window
if(!related||related!==target&&!jQuery.contains(target,related)){event.type=handleObj.origType;ret=handleObj.handler.apply(this,arguments);event.type=fix;}return ret;}};});jQuery.fn.extend({on:function on(types,selector,data,fn){return _on(this,types,selector,data,fn);},one:function one(types,selector,data,fn){return _on(this,types,selector,data,fn,1);},off:function off(types,selector,fn){var handleObj,type;if(types&&types.preventDefault&&types.handleObj){ // ( event )  dispatched jQuery.Event
handleObj=types.handleObj;jQuery(types.delegateTarget).off(handleObj.namespace?handleObj.origType+"."+handleObj.namespace:handleObj.origType,handleObj.selector,handleObj.handler);return this;}if((typeof types==="undefined"?"undefined":_typeof(types))==="object"){ // ( types-object [, selector] )
for(type in types){this.off(type,selector,types[type]);}return this;}if(selector===false||typeof selector==="function"){ // ( types [, fn] )
fn=selector;selector=undefined;}if(fn===false){fn=returnFalse;}return this.each(function(){jQuery.event.remove(this,types,fn,selector);});}});var rxhtmlTag=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi, // Support: IE 10-11, Edge 10240+
// In IE/Edge using regex groups here causes severe slowdowns.
// See https://connect.microsoft.com/IE/feedback/details/1736512/
rnoInnerhtml=/<script|<style|<link/i, // checked="checked" or checked
rchecked=/checked\s*(?:[^=]|=\s*.checked.)/i,rscriptTypeMasked=/^true\/(.*)/,rcleanScript=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g; // Manipulating tables requires a tbody
function manipulationTarget(elem,content){return jQuery.nodeName(elem,"table")&&jQuery.nodeName(content.nodeType!==11?content:content.firstChild,"tr")?elem.getElementsByTagName("tbody")[0]||elem.appendChild(elem.ownerDocument.createElement("tbody")):elem;} // Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript(elem){elem.type=(elem.getAttribute("type")!==null)+"/"+elem.type;return elem;}function restoreScript(elem){var match=rscriptTypeMasked.exec(elem.type);if(match){elem.type=match[1];}else {elem.removeAttribute("type");}return elem;}function cloneCopyEvent(src,dest){var i,l,type,pdataOld,pdataCur,udataOld,udataCur,events;if(dest.nodeType!==1){return;} // 1. Copy private data: events, handlers, etc.
if(dataPriv.hasData(src)){pdataOld=dataPriv.access(src);pdataCur=dataPriv.set(dest,pdataOld);events=pdataOld.events;if(events){delete pdataCur.handle;pdataCur.events={};for(type in events){for(i=0,l=events[type].length;i<l;i++){jQuery.event.add(dest,type,events[type][i]);}}}} // 2. Copy user data
if(dataUser.hasData(src)){udataOld=dataUser.access(src);udataCur=jQuery.extend({},udataOld);dataUser.set(dest,udataCur);}} // Fix IE bugs, see support tests
function fixInput(src,dest){var nodeName=dest.nodeName.toLowerCase(); // Fails to persist the checked state of a cloned checkbox or radio button.
if(nodeName==="input"&&rcheckableType.test(src.type)){dest.checked=src.checked; // Fails to return the selected option to the default selected state when cloning options
}else if(nodeName==="input"||nodeName==="textarea"){dest.defaultValue=src.defaultValue;}}function domManip(collection,args,callback,ignored){ // Flatten any nested arrays
args=concat.apply([],args);var fragment,first,scripts,hasScripts,node,doc,i=0,l=collection.length,iNoClone=l-1,value=args[0],isFunction=jQuery.isFunction(value); // We can't cloneNode fragments that contain checked, in WebKit
if(isFunction||l>1&&typeof value==="string"&&!support.checkClone&&rchecked.test(value)){return collection.each(function(index){var self=collection.eq(index);if(isFunction){args[0]=value.call(this,index,self.html());}domManip(self,args,callback,ignored);});}if(l){fragment=buildFragment(args,collection[0].ownerDocument,false,collection,ignored);first=fragment.firstChild;if(fragment.childNodes.length===1){fragment=first;} // Require either new content or an interest in ignored elements to invoke the callback
if(first||ignored){scripts=jQuery.map(getAll(fragment,"script"),disableScript);hasScripts=scripts.length; // Use the original fragment for the last item
// instead of the first because it can end up
// being emptied incorrectly in certain situations (#8070).
for(;i<l;i++){node=fragment;if(i!==iNoClone){node=jQuery.clone(node,true,true); // Keep references to cloned scripts for later restoration
if(hasScripts){ // Support: Android<4.1, PhantomJS<2
// push.apply(_, arraylike) throws on ancient WebKit
jQuery.merge(scripts,getAll(node,"script"));}}callback.call(collection[i],node,i);}if(hasScripts){doc=scripts[scripts.length-1].ownerDocument; // Reenable scripts
jQuery.map(scripts,restoreScript); // Evaluate executable scripts on first document insertion
for(i=0;i<hasScripts;i++){node=scripts[i];if(rscriptType.test(node.type||"")&&!dataPriv.access(node,"globalEval")&&jQuery.contains(doc,node)){if(node.src){ // Optional AJAX dependency, but won't run scripts if not present
if(jQuery._evalUrl){jQuery._evalUrl(node.src);}}else {jQuery.globalEval(node.textContent.replace(rcleanScript,""));}}}}}}return collection;}function _remove(elem,selector,keepData){var node,nodes=selector?jQuery.filter(selector,elem):elem,i=0;for(;(node=nodes[i])!=null;i++){if(!keepData&&node.nodeType===1){jQuery.cleanData(getAll(node));}if(node.parentNode){if(keepData&&jQuery.contains(node.ownerDocument,node)){setGlobalEval(getAll(node,"script"));}node.parentNode.removeChild(node);}}return elem;}jQuery.extend({htmlPrefilter:function htmlPrefilter(html){return html.replace(rxhtmlTag,"<$1></$2>");},clone:function clone(elem,dataAndEvents,deepDataAndEvents){var i,l,srcElements,destElements,clone=elem.cloneNode(true),inPage=jQuery.contains(elem.ownerDocument,elem); // Fix IE cloning issues
if(!support.noCloneChecked&&(elem.nodeType===1||elem.nodeType===11)&&!jQuery.isXMLDoc(elem)){ // We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
destElements=getAll(clone);srcElements=getAll(elem);for(i=0,l=srcElements.length;i<l;i++){fixInput(srcElements[i],destElements[i]);}} // Copy the events from the original to the clone
if(dataAndEvents){if(deepDataAndEvents){srcElements=srcElements||getAll(elem);destElements=destElements||getAll(clone);for(i=0,l=srcElements.length;i<l;i++){cloneCopyEvent(srcElements[i],destElements[i]);}}else {cloneCopyEvent(elem,clone);}} // Preserve script evaluation history
destElements=getAll(clone,"script");if(destElements.length>0){setGlobalEval(destElements,!inPage&&getAll(elem,"script"));} // Return the cloned set
return clone;},cleanData:function cleanData(elems){var data,elem,type,special=jQuery.event.special,i=0;for(;(elem=elems[i])!==undefined;i++){if(acceptData(elem)){if(data=elem[dataPriv.expando]){if(data.events){for(type in data.events){if(special[type]){jQuery.event.remove(elem,type); // This is a shortcut to avoid jQuery.event.remove's overhead
}else {jQuery.removeEvent(elem,type,data.handle);}}} // Support: Chrome <= 35-45+
// Assign undefined instead of using delete, see Data#remove
elem[dataPriv.expando]=undefined;}if(elem[dataUser.expando]){ // Support: Chrome <= 35-45+
// Assign undefined instead of using delete, see Data#remove
elem[dataUser.expando]=undefined;}}}}});jQuery.fn.extend({ // Keep domManip exposed until 3.0 (gh-2225)
domManip:domManip,detach:function detach(selector){return _remove(this,selector,true);},remove:function remove(selector){return _remove(this,selector);},text:function text(value){return access(this,function(value){return value===undefined?jQuery.text(this):this.empty().each(function(){if(this.nodeType===1||this.nodeType===11||this.nodeType===9){this.textContent=value;}});},null,value,arguments.length);},append:function append(){return domManip(this,arguments,function(elem){if(this.nodeType===1||this.nodeType===11||this.nodeType===9){var target=manipulationTarget(this,elem);target.appendChild(elem);}});},prepend:function prepend(){return domManip(this,arguments,function(elem){if(this.nodeType===1||this.nodeType===11||this.nodeType===9){var target=manipulationTarget(this,elem);target.insertBefore(elem,target.firstChild);}});},before:function before(){return domManip(this,arguments,function(elem){if(this.parentNode){this.parentNode.insertBefore(elem,this);}});},after:function after(){return domManip(this,arguments,function(elem){if(this.parentNode){this.parentNode.insertBefore(elem,this.nextSibling);}});},empty:function empty(){var elem,i=0;for(;(elem=this[i])!=null;i++){if(elem.nodeType===1){ // Prevent memory leaks
jQuery.cleanData(getAll(elem,false)); // Remove any remaining nodes
elem.textContent="";}}return this;},clone:function clone(dataAndEvents,deepDataAndEvents){dataAndEvents=dataAndEvents==null?false:dataAndEvents;deepDataAndEvents=deepDataAndEvents==null?dataAndEvents:deepDataAndEvents;return this.map(function(){return jQuery.clone(this,dataAndEvents,deepDataAndEvents);});},html:function html(value){return access(this,function(value){var elem=this[0]||{},i=0,l=this.length;if(value===undefined&&elem.nodeType===1){return elem.innerHTML;} // See if we can take a shortcut and just use innerHTML
if(typeof value==="string"&&!rnoInnerhtml.test(value)&&!wrapMap[(rtagName.exec(value)||["",""])[1].toLowerCase()]){value=jQuery.htmlPrefilter(value);try{for(;i<l;i++){elem=this[i]||{}; // Remove element nodes and prevent memory leaks
if(elem.nodeType===1){jQuery.cleanData(getAll(elem,false));elem.innerHTML=value;}}elem=0; // If using innerHTML throws an exception, use the fallback method
}catch(e){}}if(elem){this.empty().append(value);}},null,value,arguments.length);},replaceWith:function replaceWith(){var ignored=[]; // Make the changes, replacing each non-ignored context element with the new content
return domManip(this,arguments,function(elem){var parent=this.parentNode;if(jQuery.inArray(this,ignored)<0){jQuery.cleanData(getAll(this));if(parent){parent.replaceChild(elem,this);}} // Force callback invocation
},ignored);}});jQuery.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(name,original){jQuery.fn[name]=function(selector){var elems,ret=[],insert=jQuery(selector),last=insert.length-1,i=0;for(;i<=last;i++){elems=i===last?this:this.clone(true);jQuery(insert[i])[original](elems); // Support: QtWebKit
// .get() because push.apply(_, arraylike) throws
push.apply(ret,elems.get());}return this.pushStack(ret);};});var iframe,elemdisplay={ // Support: Firefox
// We have to pre-define these values for FF (#10227)
HTML:"block",BODY:"block"}; /**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */ // Called only from within defaultDisplay
function actualDisplay(name,doc){var elem=jQuery(doc.createElement(name)).appendTo(doc.body),display=jQuery.css(elem[0],"display"); // We don't have any data stored on the element,
// so use "detach" method as fast way to get rid of the element
elem.detach();return display;} /**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */function defaultDisplay(nodeName){var doc=document,display=elemdisplay[nodeName];if(!display){display=actualDisplay(nodeName,doc); // If the simple way fails, read from inside an iframe
if(display==="none"||!display){ // Use the already-created iframe if possible
iframe=(iframe||jQuery("<iframe frameborder='0' width='0' height='0'/>")).appendTo(doc.documentElement); // Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
doc=iframe[0].contentDocument; // Support: IE
doc.write();doc.close();display=actualDisplay(nodeName,doc);iframe.detach();} // Store the correct default display
elemdisplay[nodeName]=display;}return display;}var rmargin=/^margin/;var rnumnonpx=new RegExp("^("+pnum+")(?!px)[a-z%]+$","i");var getStyles=function getStyles(elem){ // Support: IE<=11+, Firefox<=30+ (#15098, #14150)
// IE throws on elements created in popups
// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
var view=elem.ownerDocument.defaultView;if(!view||!view.opener){view=window;}return view.getComputedStyle(elem);};var swap=function swap(elem,options,callback,args){var ret,name,old={}; // Remember the old values, and insert the new ones
for(name in options){old[name]=elem.style[name];elem.style[name]=options[name];}ret=callback.apply(elem,args||[]); // Revert the old values
for(name in options){elem.style[name]=old[name];}return ret;};var documentElement=document.documentElement;(function(){var pixelPositionVal,boxSizingReliableVal,pixelMarginRightVal,reliableMarginLeftVal,container=document.createElement("div"),div=document.createElement("div"); // Finish early in limited (non-browser) environments
if(!div.style){return;} // Support: IE9-11+
// Style of cloned element affects source element cloned (#8908)
div.style.backgroundClip="content-box";div.cloneNode(true).style.backgroundClip="";support.clearCloneStyle=div.style.backgroundClip==="content-box";container.style.cssText="border:0;width:8px;height:0;top:0;left:-9999px;"+"padding:0;margin-top:1px;position:absolute";container.appendChild(div); // Executing both pixelPosition & boxSizingReliable tests require only one layout
// so they're executed at the same time to save the second computation.
function computeStyleTests(){div.style.cssText= // Support: Firefox<29, Android 2.3
// Vendor-prefix box-sizing
"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;"+"position:relative;display:block;"+"margin:auto;border:1px;padding:1px;"+"top:1%;width:50%";div.innerHTML="";documentElement.appendChild(container);var divStyle=window.getComputedStyle(div);pixelPositionVal=divStyle.top!=="1%";reliableMarginLeftVal=divStyle.marginLeft==="2px";boxSizingReliableVal=divStyle.width==="4px"; // Support: Android 4.0 - 4.3 only
// Some styles come back with percentage values, even though they shouldn't
div.style.marginRight="50%";pixelMarginRightVal=divStyle.marginRight==="4px";documentElement.removeChild(container);}jQuery.extend(support,{pixelPosition:function pixelPosition(){ // This test is executed only once but we still do memoizing
// since we can use the boxSizingReliable pre-computing.
// No need to check if the test was already performed, though.
computeStyleTests();return pixelPositionVal;},boxSizingReliable:function boxSizingReliable(){if(boxSizingReliableVal==null){computeStyleTests();}return boxSizingReliableVal;},pixelMarginRight:function pixelMarginRight(){ // Support: Android 4.0-4.3
// We're checking for boxSizingReliableVal here instead of pixelMarginRightVal
// since that compresses better and they're computed together anyway.
if(boxSizingReliableVal==null){computeStyleTests();}return pixelMarginRightVal;},reliableMarginLeft:function reliableMarginLeft(){ // Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
if(boxSizingReliableVal==null){computeStyleTests();}return reliableMarginLeftVal;},reliableMarginRight:function reliableMarginRight(){ // Support: Android 2.3
// Check if div with explicit width and no margin-right incorrectly
// gets computed margin-right based on width of container. (#3333)
// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
// This support function is only executed once so no memoizing is needed.
var ret,marginDiv=div.appendChild(document.createElement("div")); // Reset CSS: box-sizing; display; margin; border; padding
marginDiv.style.cssText=div.style.cssText= // Support: Android 2.3
// Vendor-prefix box-sizing
"-webkit-box-sizing:content-box;box-sizing:content-box;"+"display:block;margin:0;border:0;padding:0";marginDiv.style.marginRight=marginDiv.style.width="0";div.style.width="1px";documentElement.appendChild(container);ret=!parseFloat(window.getComputedStyle(marginDiv).marginRight);documentElement.removeChild(container);div.removeChild(marginDiv);return ret;}});})();function curCSS(elem,name,computed){var width,minWidth,maxWidth,ret,style=elem.style;computed=computed||getStyles(elem);ret=computed?computed.getPropertyValue(name)||computed[name]:undefined; // Support: Opera 12.1x only
// Fall back to style even without computed
// computed is undefined for elems on document fragments
if((ret===""||ret===undefined)&&!jQuery.contains(elem.ownerDocument,elem)){ret=jQuery.style(elem,name);} // Support: IE9
// getPropertyValue is only needed for .css('filter') (#12537)
if(computed){ // A tribute to the "awesome hack by Dean Edwards"
// Android Browser returns percentage for some values,
// but width seems to be reliably pixels.
// This is against the CSSOM draft spec:
// http://dev.w3.org/csswg/cssom/#resolved-values
if(!support.pixelMarginRight()&&rnumnonpx.test(ret)&&rmargin.test(name)){ // Remember the original values
width=style.width;minWidth=style.minWidth;maxWidth=style.maxWidth; // Put in the new values to get a computed value out
style.minWidth=style.maxWidth=style.width=ret;ret=computed.width; // Revert the changed values
style.width=width;style.minWidth=minWidth;style.maxWidth=maxWidth;}}return ret!==undefined? // Support: IE9-11+
// IE returns zIndex value as an integer.
ret+"":ret;}function addGetHookIf(conditionFn,hookFn){ // Define the hook, we'll check on the first run if it's really needed.
return {get:function get(){if(conditionFn()){ // Hook not needed (or it's not possible to use it due
// to missing dependency), remove it.
delete this.get;return;} // Hook needed; redefine it so that the support test is not executed again.
return (this.get=hookFn).apply(this,arguments);}};}var  // Swappable if display is none or starts with table
// except "table", "table-cell", or "table-caption"
// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
rdisplayswap=/^(none|table(?!-c[ea]).+)/,cssShow={position:"absolute",visibility:"hidden",display:"block"},cssNormalTransform={letterSpacing:"0",fontWeight:"400"},cssPrefixes=["Webkit","O","Moz","ms"],emptyStyle=document.createElement("div").style; // Return a css property mapped to a potentially vendor prefixed property
function vendorPropName(name){ // Shortcut for names that are not vendor prefixed
if(name in emptyStyle){return name;} // Check for vendor prefixed names
var capName=name[0].toUpperCase()+name.slice(1),i=cssPrefixes.length;while(i--){name=cssPrefixes[i]+capName;if(name in emptyStyle){return name;}}}function setPositiveNumber(elem,value,subtract){ // Any relative (+/-) values have already been
// normalized at this point
var matches=rcssNum.exec(value);return matches? // Guard against undefined "subtract", e.g., when used as in cssHooks
Math.max(0,matches[2]-(subtract||0))+(matches[3]||"px"):value;}function augmentWidthOrHeight(elem,name,extra,isBorderBox,styles){var i=extra===(isBorderBox?"border":"content")? // If we already have the right measurement, avoid augmentation
4: // Otherwise initialize for horizontal or vertical properties
name==="width"?1:0,val=0;for(;i<4;i+=2){ // Both box models exclude margin, so add it if we want it
if(extra==="margin"){val+=jQuery.css(elem,extra+cssExpand[i],true,styles);}if(isBorderBox){ // border-box includes padding, so remove it if we want content
if(extra==="content"){val-=jQuery.css(elem,"padding"+cssExpand[i],true,styles);} // At this point, extra isn't border nor margin, so remove border
if(extra!=="margin"){val-=jQuery.css(elem,"border"+cssExpand[i]+"Width",true,styles);}}else { // At this point, extra isn't content, so add padding
val+=jQuery.css(elem,"padding"+cssExpand[i],true,styles); // At this point, extra isn't content nor padding, so add border
if(extra!=="padding"){val+=jQuery.css(elem,"border"+cssExpand[i]+"Width",true,styles);}}}return val;}function getWidthOrHeight(elem,name,extra){ // Start with offset property, which is equivalent to the border-box value
var valueIsBorderBox=true,val=name==="width"?elem.offsetWidth:elem.offsetHeight,styles=getStyles(elem),isBorderBox=jQuery.css(elem,"boxSizing",false,styles)==="border-box"; // Support: IE11 only
// In IE 11 fullscreen elements inside of an iframe have
// 100x too small dimensions (gh-1764).
if(document.msFullscreenElement&&window.top!==window){ // Support: IE11 only
// Running getBoundingClientRect on a disconnected node
// in IE throws an error.
if(elem.getClientRects().length){val=Math.round(elem.getBoundingClientRect()[name]*100);}} // Some non-html elements return undefined for offsetWidth, so check for null/undefined
// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
if(val<=0||val==null){ // Fall back to computed then uncomputed css if necessary
val=curCSS(elem,name,styles);if(val<0||val==null){val=elem.style[name];} // Computed unit is not pixels. Stop here and return.
if(rnumnonpx.test(val)){return val;} // Check for style in case a browser which returns unreliable values
// for getComputedStyle silently falls back to the reliable elem.style
valueIsBorderBox=isBorderBox&&(support.boxSizingReliable()||val===elem.style[name]); // Normalize "", auto, and prepare for extra
val=parseFloat(val)||0;} // Use the active box-sizing model to add/subtract irrelevant styles
return val+augmentWidthOrHeight(elem,name,extra||(isBorderBox?"border":"content"),valueIsBorderBox,styles)+"px";}function showHide(elements,show){var display,elem,hidden,values=[],index=0,length=elements.length;for(;index<length;index++){elem=elements[index];if(!elem.style){continue;}values[index]=dataPriv.get(elem,"olddisplay");display=elem.style.display;if(show){ // Reset the inline display of this element to learn if it is
// being hidden by cascaded rules or not
if(!values[index]&&display==="none"){elem.style.display="";} // Set elements which have been overridden with display: none
// in a stylesheet to whatever the default browser style is
// for such an element
if(elem.style.display===""&&isHidden(elem)){values[index]=dataPriv.access(elem,"olddisplay",defaultDisplay(elem.nodeName));}}else {hidden=isHidden(elem);if(display!=="none"||!hidden){dataPriv.set(elem,"olddisplay",hidden?display:jQuery.css(elem,"display"));}}} // Set the display of most of the elements in a second loop
// to avoid the constant reflow
for(index=0;index<length;index++){elem=elements[index];if(!elem.style){continue;}if(!show||elem.style.display==="none"||elem.style.display===""){elem.style.display=show?values[index]||"":"none";}}return elements;}jQuery.extend({ // Add in style property hooks for overriding the default
// behavior of getting and setting a style property
cssHooks:{opacity:{get:function get(elem,computed){if(computed){ // We should always get a number back from opacity
var ret=curCSS(elem,"opacity");return ret===""?"1":ret;}}}}, // Don't automatically add "px" to these possibly-unitless properties
cssNumber:{"animationIterationCount":true,"columnCount":true,"fillOpacity":true,"flexGrow":true,"flexShrink":true,"fontWeight":true,"lineHeight":true,"opacity":true,"order":true,"orphans":true,"widows":true,"zIndex":true,"zoom":true}, // Add in properties whose names you wish to fix before
// setting or getting the value
cssProps:{"float":"cssFloat"}, // Get and set the style property on a DOM Node
style:function style(elem,name,value,extra){ // Don't set styles on text and comment nodes
if(!elem||elem.nodeType===3||elem.nodeType===8||!elem.style){return;} // Make sure that we're working with the right name
var ret,type,hooks,origName=jQuery.camelCase(name),style=elem.style;name=jQuery.cssProps[origName]||(jQuery.cssProps[origName]=vendorPropName(origName)||origName); // Gets hook for the prefixed version, then unprefixed version
hooks=jQuery.cssHooks[name]||jQuery.cssHooks[origName]; // Check if we're setting a value
if(value!==undefined){type=typeof value==="undefined"?"undefined":_typeof(value); // Convert "+=" or "-=" to relative numbers (#7345)
if(type==="string"&&(ret=rcssNum.exec(value))&&ret[1]){value=adjustCSS(elem,name,ret); // Fixes bug #9237
type="number";} // Make sure that null and NaN values aren't set (#7116)
if(value==null||value!==value){return;} // If a number was passed in, add the unit (except for certain CSS properties)
if(type==="number"){value+=ret&&ret[3]||(jQuery.cssNumber[origName]?"":"px");} // Support: IE9-11+
// background-* props affect original clone's values
if(!support.clearCloneStyle&&value===""&&name.indexOf("background")===0){style[name]="inherit";} // If a hook was provided, use that value, otherwise just set the specified value
if(!hooks||!("set" in hooks)||(value=hooks.set(elem,value,extra))!==undefined){style[name]=value;}}else { // If a hook was provided get the non-computed value from there
if(hooks&&"get" in hooks&&(ret=hooks.get(elem,false,extra))!==undefined){return ret;} // Otherwise just get the value from the style object
return style[name];}},css:function css(elem,name,extra,styles){var val,num,hooks,origName=jQuery.camelCase(name); // Make sure that we're working with the right name
name=jQuery.cssProps[origName]||(jQuery.cssProps[origName]=vendorPropName(origName)||origName); // Try prefixed name followed by the unprefixed name
hooks=jQuery.cssHooks[name]||jQuery.cssHooks[origName]; // If a hook was provided get the computed value from there
if(hooks&&"get" in hooks){val=hooks.get(elem,true,extra);} // Otherwise, if a way to get the computed value exists, use that
if(val===undefined){val=curCSS(elem,name,styles);} // Convert "normal" to computed value
if(val==="normal"&&name in cssNormalTransform){val=cssNormalTransform[name];} // Make numeric if forced or a qualifier was provided and val looks numeric
if(extra===""||extra){num=parseFloat(val);return extra===true||isFinite(num)?num||0:val;}return val;}});jQuery.each(["height","width"],function(i,name){jQuery.cssHooks[name]={get:function get(elem,computed,extra){if(computed){ // Certain elements can have dimension info if we invisibly show them
// but it must have a current display style that would benefit
return rdisplayswap.test(jQuery.css(elem,"display"))&&elem.offsetWidth===0?swap(elem,cssShow,function(){return getWidthOrHeight(elem,name,extra);}):getWidthOrHeight(elem,name,extra);}},set:function set(elem,value,extra){var matches,styles=extra&&getStyles(elem),subtract=extra&&augmentWidthOrHeight(elem,name,extra,jQuery.css(elem,"boxSizing",false,styles)==="border-box",styles); // Convert to pixels if value adjustment is needed
if(subtract&&(matches=rcssNum.exec(value))&&(matches[3]||"px")!=="px"){elem.style[name]=value;value=jQuery.css(elem,name);}return setPositiveNumber(elem,value,subtract);}};});jQuery.cssHooks.marginLeft=addGetHookIf(support.reliableMarginLeft,function(elem,computed){if(computed){return (parseFloat(curCSS(elem,"marginLeft"))||elem.getBoundingClientRect().left-swap(elem,{marginLeft:0},function(){return elem.getBoundingClientRect().left;}))+"px";}}); // Support: Android 2.3
jQuery.cssHooks.marginRight=addGetHookIf(support.reliableMarginRight,function(elem,computed){if(computed){return swap(elem,{"display":"inline-block"},curCSS,[elem,"marginRight"]);}}); // These hooks are used by animate to expand properties
jQuery.each({margin:"",padding:"",border:"Width"},function(prefix,suffix){jQuery.cssHooks[prefix+suffix]={expand:function expand(value){var i=0,expanded={}, // Assumes a single number if not a string
parts=typeof value==="string"?value.split(" "):[value];for(;i<4;i++){expanded[prefix+cssExpand[i]+suffix]=parts[i]||parts[i-2]||parts[0];}return expanded;}};if(!rmargin.test(prefix)){jQuery.cssHooks[prefix+suffix].set=setPositiveNumber;}});jQuery.fn.extend({css:function css(name,value){return access(this,function(elem,name,value){var styles,len,map={},i=0;if(jQuery.isArray(name)){styles=getStyles(elem);len=name.length;for(;i<len;i++){map[name[i]]=jQuery.css(elem,name[i],false,styles);}return map;}return value!==undefined?jQuery.style(elem,name,value):jQuery.css(elem,name);},name,value,arguments.length>1);},show:function show(){return showHide(this,true);},hide:function hide(){return showHide(this);},toggle:function toggle(state){if(typeof state==="boolean"){return state?this.show():this.hide();}return this.each(function(){if(isHidden(this)){jQuery(this).show();}else {jQuery(this).hide();}});}});function Tween(elem,options,prop,end,easing){return new Tween.prototype.init(elem,options,prop,end,easing);}jQuery.Tween=Tween;Tween.prototype={constructor:Tween,init:function init(elem,options,prop,end,easing,unit){this.elem=elem;this.prop=prop;this.easing=easing||jQuery.easing._default;this.options=options;this.start=this.now=this.cur();this.end=end;this.unit=unit||(jQuery.cssNumber[prop]?"":"px");},cur:function cur(){var hooks=Tween.propHooks[this.prop];return hooks&&hooks.get?hooks.get(this):Tween.propHooks._default.get(this);},run:function run(percent){var eased,hooks=Tween.propHooks[this.prop];if(this.options.duration){this.pos=eased=jQuery.easing[this.easing](percent,this.options.duration*percent,0,1,this.options.duration);}else {this.pos=eased=percent;}this.now=(this.end-this.start)*eased+this.start;if(this.options.step){this.options.step.call(this.elem,this.now,this);}if(hooks&&hooks.set){hooks.set(this);}else {Tween.propHooks._default.set(this);}return this;}};Tween.prototype.init.prototype=Tween.prototype;Tween.propHooks={_default:{get:function get(tween){var result; // Use a property on the element directly when it is not a DOM element,
// or when there is no matching style property that exists.
if(tween.elem.nodeType!==1||tween.elem[tween.prop]!=null&&tween.elem.style[tween.prop]==null){return tween.elem[tween.prop];} // Passing an empty string as a 3rd parameter to .css will automatically
// attempt a parseFloat and fallback to a string if the parse fails.
// Simple values such as "10px" are parsed to Float;
// complex values such as "rotate(1rad)" are returned as-is.
result=jQuery.css(tween.elem,tween.prop,""); // Empty strings, null, undefined and "auto" are converted to 0.
return !result||result==="auto"?0:result;},set:function set(tween){ // Use step hook for back compat.
// Use cssHook if its there.
// Use .style if available and use plain properties where available.
if(jQuery.fx.step[tween.prop]){jQuery.fx.step[tween.prop](tween);}else if(tween.elem.nodeType===1&&(tween.elem.style[jQuery.cssProps[tween.prop]]!=null||jQuery.cssHooks[tween.prop])){jQuery.style(tween.elem,tween.prop,tween.now+tween.unit);}else {tween.elem[tween.prop]=tween.now;}}}}; // Support: IE9
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop=Tween.propHooks.scrollLeft={set:function set(tween){if(tween.elem.nodeType&&tween.elem.parentNode){tween.elem[tween.prop]=tween.now;}}};jQuery.easing={linear:function linear(p){return p;},swing:function swing(p){return 0.5-Math.cos(p*Math.PI)/2;},_default:"swing"};jQuery.fx=Tween.prototype.init; // Back Compat <1.8 extension point
jQuery.fx.step={};var fxNow,timerId,rfxtypes=/^(?:toggle|show|hide)$/,rrun=/queueHooks$/; // Animations created synchronously will run synchronously
function createFxNow(){window.setTimeout(function(){fxNow=undefined;});return fxNow=jQuery.now();} // Generate parameters to create a standard animation
function genFx(type,includeWidth){var which,i=0,attrs={height:type}; // If we include width, step value is 1 to do all cssExpand values,
// otherwise step value is 2 to skip over Left and Right
includeWidth=includeWidth?1:0;for(;i<4;i+=2-includeWidth){which=cssExpand[i];attrs["margin"+which]=attrs["padding"+which]=type;}if(includeWidth){attrs.opacity=attrs.width=type;}return attrs;}function createTween(value,prop,animation){var tween,collection=(Animation.tweeners[prop]||[]).concat(Animation.tweeners["*"]),index=0,length=collection.length;for(;index<length;index++){if(tween=collection[index].call(animation,prop,value)){ // We're done with this property
return tween;}}}function defaultPrefilter(elem,props,opts){ /* jshint validthis: true */var prop,value,toggle,tween,hooks,oldfire,display,checkDisplay,anim=this,orig={},style=elem.style,hidden=elem.nodeType&&isHidden(elem),dataShow=dataPriv.get(elem,"fxshow"); // Handle queue: false promises
if(!opts.queue){hooks=jQuery._queueHooks(elem,"fx");if(hooks.unqueued==null){hooks.unqueued=0;oldfire=hooks.empty.fire;hooks.empty.fire=function(){if(!hooks.unqueued){oldfire();}};}hooks.unqueued++;anim.always(function(){ // Ensure the complete handler is called before this completes
anim.always(function(){hooks.unqueued--;if(!jQuery.queue(elem,"fx").length){hooks.empty.fire();}});});} // Height/width overflow pass
if(elem.nodeType===1&&("height" in props||"width" in props)){ // Make sure that nothing sneaks out
// Record all 3 overflow attributes because IE9-10 do not
// change the overflow attribute when overflowX and
// overflowY are set to the same value
opts.overflow=[style.overflow,style.overflowX,style.overflowY]; // Set display property to inline-block for height/width
// animations on inline elements that are having width/height animated
display=jQuery.css(elem,"display"); // Test default display if display is currently "none"
checkDisplay=display==="none"?dataPriv.get(elem,"olddisplay")||defaultDisplay(elem.nodeName):display;if(checkDisplay==="inline"&&jQuery.css(elem,"float")==="none"){style.display="inline-block";}}if(opts.overflow){style.overflow="hidden";anim.always(function(){style.overflow=opts.overflow[0];style.overflowX=opts.overflow[1];style.overflowY=opts.overflow[2];});} // show/hide pass
for(prop in props){value=props[prop];if(rfxtypes.exec(value)){delete props[prop];toggle=toggle||value==="toggle";if(value===(hidden?"hide":"show")){ // If there is dataShow left over from a stopped hide or show
// and we are going to proceed with show, we should pretend to be hidden
if(value==="show"&&dataShow&&dataShow[prop]!==undefined){hidden=true;}else {continue;}}orig[prop]=dataShow&&dataShow[prop]||jQuery.style(elem,prop); // Any non-fx value stops us from restoring the original display value
}else {display=undefined;}}if(!jQuery.isEmptyObject(orig)){if(dataShow){if("hidden" in dataShow){hidden=dataShow.hidden;}}else {dataShow=dataPriv.access(elem,"fxshow",{});} // Store state if its toggle - enables .stop().toggle() to "reverse"
if(toggle){dataShow.hidden=!hidden;}if(hidden){jQuery(elem).show();}else {anim.done(function(){jQuery(elem).hide();});}anim.done(function(){var prop;dataPriv.remove(elem,"fxshow");for(prop in orig){jQuery.style(elem,prop,orig[prop]);}});for(prop in orig){tween=createTween(hidden?dataShow[prop]:0,prop,anim);if(!(prop in dataShow)){dataShow[prop]=tween.start;if(hidden){tween.end=tween.start;tween.start=prop==="width"||prop==="height"?1:0;}}} // If this is a noop like .hide().hide(), restore an overwritten display value
}else if((display==="none"?defaultDisplay(elem.nodeName):display)==="inline"){style.display=display;}}function propFilter(props,specialEasing){var index,name,easing,value,hooks; // camelCase, specialEasing and expand cssHook pass
for(index in props){name=jQuery.camelCase(index);easing=specialEasing[name];value=props[index];if(jQuery.isArray(value)){easing=value[1];value=props[index]=value[0];}if(index!==name){props[name]=value;delete props[index];}hooks=jQuery.cssHooks[name];if(hooks&&"expand" in hooks){value=hooks.expand(value);delete props[name]; // Not quite $.extend, this won't overwrite existing keys.
// Reusing 'index' because we have the correct "name"
for(index in value){if(!(index in props)){props[index]=value[index];specialEasing[index]=easing;}}}else {specialEasing[name]=easing;}}}function Animation(elem,properties,options){var result,stopped,index=0,length=Animation.prefilters.length,deferred=jQuery.Deferred().always(function(){ // Don't match elem in the :animated selector
delete tick.elem;}),tick=function tick(){if(stopped){return false;}var currentTime=fxNow||createFxNow(),remaining=Math.max(0,animation.startTime+animation.duration-currentTime), // Support: Android 2.3
// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
temp=remaining/animation.duration||0,percent=1-temp,index=0,length=animation.tweens.length;for(;index<length;index++){animation.tweens[index].run(percent);}deferred.notifyWith(elem,[animation,percent,remaining]);if(percent<1&&length){return remaining;}else {deferred.resolveWith(elem,[animation]);return false;}},animation=deferred.promise({elem:elem,props:jQuery.extend({},properties),opts:jQuery.extend(true,{specialEasing:{},easing:jQuery.easing._default},options),originalProperties:properties,originalOptions:options,startTime:fxNow||createFxNow(),duration:options.duration,tweens:[],createTween:function createTween(prop,end){var tween=jQuery.Tween(elem,animation.opts,prop,end,animation.opts.specialEasing[prop]||animation.opts.easing);animation.tweens.push(tween);return tween;},stop:function stop(gotoEnd){var index=0, // If we are going to the end, we want to run all the tweens
// otherwise we skip this part
length=gotoEnd?animation.tweens.length:0;if(stopped){return this;}stopped=true;for(;index<length;index++){animation.tweens[index].run(1);} // Resolve when we played the last frame; otherwise, reject
if(gotoEnd){deferred.notifyWith(elem,[animation,1,0]);deferred.resolveWith(elem,[animation,gotoEnd]);}else {deferred.rejectWith(elem,[animation,gotoEnd]);}return this;}}),props=animation.props;propFilter(props,animation.opts.specialEasing);for(;index<length;index++){result=Animation.prefilters[index].call(animation,elem,props,animation.opts);if(result){if(jQuery.isFunction(result.stop)){jQuery._queueHooks(animation.elem,animation.opts.queue).stop=jQuery.proxy(result.stop,result);}return result;}}jQuery.map(props,createTween,animation);if(jQuery.isFunction(animation.opts.start)){animation.opts.start.call(elem,animation);}jQuery.fx.timer(jQuery.extend(tick,{elem:elem,anim:animation,queue:animation.opts.queue})); // attach callbacks from options
return animation.progress(animation.opts.progress).done(animation.opts.done,animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);}jQuery.Animation=jQuery.extend(Animation,{tweeners:{"*":[function(prop,value){var tween=this.createTween(prop,value);adjustCSS(tween.elem,prop,rcssNum.exec(value),tween);return tween;}]},tweener:function tweener(props,callback){if(jQuery.isFunction(props)){callback=props;props=["*"];}else {props=props.match(rnotwhite);}var prop,index=0,length=props.length;for(;index<length;index++){prop=props[index];Animation.tweeners[prop]=Animation.tweeners[prop]||[];Animation.tweeners[prop].unshift(callback);}},prefilters:[defaultPrefilter],prefilter:function prefilter(callback,prepend){if(prepend){Animation.prefilters.unshift(callback);}else {Animation.prefilters.push(callback);}}});jQuery.speed=function(speed,easing,fn){var opt=speed&&(typeof speed==="undefined"?"undefined":_typeof(speed))==="object"?jQuery.extend({},speed):{complete:fn||!fn&&easing||jQuery.isFunction(speed)&&speed,duration:speed,easing:fn&&easing||easing&&!jQuery.isFunction(easing)&&easing};opt.duration=jQuery.fx.off?0:typeof opt.duration==="number"?opt.duration:opt.duration in jQuery.fx.speeds?jQuery.fx.speeds[opt.duration]:jQuery.fx.speeds._default; // Normalize opt.queue - true/undefined/null -> "fx"
if(opt.queue==null||opt.queue===true){opt.queue="fx";} // Queueing
opt.old=opt.complete;opt.complete=function(){if(jQuery.isFunction(opt.old)){opt.old.call(this);}if(opt.queue){jQuery.dequeue(this,opt.queue);}};return opt;};jQuery.fn.extend({fadeTo:function fadeTo(speed,to,easing,callback){ // Show any hidden elements after setting opacity to 0
return this.filter(isHidden).css("opacity",0).show() // Animate to the value specified
.end().animate({opacity:to},speed,easing,callback);},animate:function animate(prop,speed,easing,callback){var empty=jQuery.isEmptyObject(prop),optall=jQuery.speed(speed,easing,callback),doAnimation=function doAnimation(){ // Operate on a copy of prop so per-property easing won't be lost
var anim=Animation(this,jQuery.extend({},prop),optall); // Empty animations, or finishing resolves immediately
if(empty||dataPriv.get(this,"finish")){anim.stop(true);}};doAnimation.finish=doAnimation;return empty||optall.queue===false?this.each(doAnimation):this.queue(optall.queue,doAnimation);},stop:function stop(type,clearQueue,gotoEnd){var stopQueue=function stopQueue(hooks){var stop=hooks.stop;delete hooks.stop;stop(gotoEnd);};if(typeof type!=="string"){gotoEnd=clearQueue;clearQueue=type;type=undefined;}if(clearQueue&&type!==false){this.queue(type||"fx",[]);}return this.each(function(){var dequeue=true,index=type!=null&&type+"queueHooks",timers=jQuery.timers,data=dataPriv.get(this);if(index){if(data[index]&&data[index].stop){stopQueue(data[index]);}}else {for(index in data){if(data[index]&&data[index].stop&&rrun.test(index)){stopQueue(data[index]);}}}for(index=timers.length;index--;){if(timers[index].elem===this&&(type==null||timers[index].queue===type)){timers[index].anim.stop(gotoEnd);dequeue=false;timers.splice(index,1);}} // Start the next in the queue if the last step wasn't forced.
// Timers currently will call their complete callbacks, which
// will dequeue but only if they were gotoEnd.
if(dequeue||!gotoEnd){jQuery.dequeue(this,type);}});},finish:function finish(type){if(type!==false){type=type||"fx";}return this.each(function(){var index,data=dataPriv.get(this),queue=data[type+"queue"],hooks=data[type+"queueHooks"],timers=jQuery.timers,length=queue?queue.length:0; // Enable finishing flag on private data
data.finish=true; // Empty the queue first
jQuery.queue(this,type,[]);if(hooks&&hooks.stop){hooks.stop.call(this,true);} // Look for any active animations, and finish them
for(index=timers.length;index--;){if(timers[index].elem===this&&timers[index].queue===type){timers[index].anim.stop(true);timers.splice(index,1);}} // Look for any animations in the old queue and finish them
for(index=0;index<length;index++){if(queue[index]&&queue[index].finish){queue[index].finish.call(this);}} // Turn off finishing flag
delete data.finish;});}});jQuery.each(["toggle","show","hide"],function(i,name){var cssFn=jQuery.fn[name];jQuery.fn[name]=function(speed,easing,callback){return speed==null||typeof speed==="boolean"?cssFn.apply(this,arguments):this.animate(genFx(name,true),speed,easing,callback);};}); // Generate shortcuts for custom animations
jQuery.each({slideDown:genFx("show"),slideUp:genFx("hide"),slideToggle:genFx("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(name,props){jQuery.fn[name]=function(speed,easing,callback){return this.animate(props,speed,easing,callback);};});jQuery.timers=[];jQuery.fx.tick=function(){var timer,i=0,timers=jQuery.timers;fxNow=jQuery.now();for(;i<timers.length;i++){timer=timers[i]; // Checks the timer has not already been removed
if(!timer()&&timers[i]===timer){timers.splice(i--,1);}}if(!timers.length){jQuery.fx.stop();}fxNow=undefined;};jQuery.fx.timer=function(timer){jQuery.timers.push(timer);if(timer()){jQuery.fx.start();}else {jQuery.timers.pop();}};jQuery.fx.interval=13;jQuery.fx.start=function(){if(!timerId){timerId=window.setInterval(jQuery.fx.tick,jQuery.fx.interval);}};jQuery.fx.stop=function(){window.clearInterval(timerId);timerId=null;};jQuery.fx.speeds={slow:600,fast:200, // Default speed
_default:400}; // Based off of the plugin by Clint Helfers, with permission.
// http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay=function(time,type){time=jQuery.fx?jQuery.fx.speeds[time]||time:time;type=type||"fx";return this.queue(type,function(next,hooks){var timeout=window.setTimeout(next,time);hooks.stop=function(){window.clearTimeout(timeout);};});};(function(){var input=document.createElement("input"),select=document.createElement("select"),opt=select.appendChild(document.createElement("option"));input.type="checkbox"; // Support: iOS<=5.1, Android<=4.2+
// Default value for a checkbox should be "on"
support.checkOn=input.value!==""; // Support: IE<=11+
// Must access selectedIndex to make default options select
support.optSelected=opt.selected; // Support: Android<=2.3
// Options inside disabled selects are incorrectly marked as disabled
select.disabled=true;support.optDisabled=!opt.disabled; // Support: IE<=11+
// An input loses its value after becoming a radio
input=document.createElement("input");input.value="t";input.type="radio";support.radioValue=input.value==="t";})();var boolHook,attrHandle=jQuery.expr.attrHandle;jQuery.fn.extend({attr:function attr(name,value){return access(this,jQuery.attr,name,value,arguments.length>1);},removeAttr:function removeAttr(name){return this.each(function(){jQuery.removeAttr(this,name);});}});jQuery.extend({attr:function attr(elem,name,value){var ret,hooks,nType=elem.nodeType; // Don't get/set attributes on text, comment and attribute nodes
if(nType===3||nType===8||nType===2){return;} // Fallback to prop when attributes are not supported
if(typeof elem.getAttribute==="undefined"){return jQuery.prop(elem,name,value);} // All attributes are lowercase
// Grab necessary hook if one is defined
if(nType!==1||!jQuery.isXMLDoc(elem)){name=name.toLowerCase();hooks=jQuery.attrHooks[name]||(jQuery.expr.match.bool.test(name)?boolHook:undefined);}if(value!==undefined){if(value===null){jQuery.removeAttr(elem,name);return;}if(hooks&&"set" in hooks&&(ret=hooks.set(elem,value,name))!==undefined){return ret;}elem.setAttribute(name,value+"");return value;}if(hooks&&"get" in hooks&&(ret=hooks.get(elem,name))!==null){return ret;}ret=jQuery.find.attr(elem,name); // Non-existent attributes return null, we normalize to undefined
return ret==null?undefined:ret;},attrHooks:{type:{set:function set(elem,value){if(!support.radioValue&&value==="radio"&&jQuery.nodeName(elem,"input")){var val=elem.value;elem.setAttribute("type",value);if(val){elem.value=val;}return value;}}}},removeAttr:function removeAttr(elem,value){var name,propName,i=0,attrNames=value&&value.match(rnotwhite);if(attrNames&&elem.nodeType===1){while(name=attrNames[i++]){propName=jQuery.propFix[name]||name; // Boolean attributes get special treatment (#10870)
if(jQuery.expr.match.bool.test(name)){ // Set corresponding property to false
elem[propName]=false;}elem.removeAttribute(name);}}}}); // Hooks for boolean attributes
boolHook={set:function set(elem,value,name){if(value===false){ // Remove boolean attributes when set to false
jQuery.removeAttr(elem,name);}else {elem.setAttribute(name,name);}return name;}};jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g),function(i,name){var getter=attrHandle[name]||jQuery.find.attr;attrHandle[name]=function(elem,name,isXML){var ret,handle;if(!isXML){ // Avoid an infinite loop by temporarily removing this function from the getter
handle=attrHandle[name];attrHandle[name]=ret;ret=getter(elem,name,isXML)!=null?name.toLowerCase():null;attrHandle[name]=handle;}return ret;};});var rfocusable=/^(?:input|select|textarea|button)$/i,rclickable=/^(?:a|area)$/i;jQuery.fn.extend({prop:function prop(name,value){return access(this,jQuery.prop,name,value,arguments.length>1);},removeProp:function removeProp(name){return this.each(function(){delete this[jQuery.propFix[name]||name];});}});jQuery.extend({prop:function prop(elem,name,value){var ret,hooks,nType=elem.nodeType; // Don't get/set properties on text, comment and attribute nodes
if(nType===3||nType===8||nType===2){return;}if(nType!==1||!jQuery.isXMLDoc(elem)){ // Fix name and attach hooks
name=jQuery.propFix[name]||name;hooks=jQuery.propHooks[name];}if(value!==undefined){if(hooks&&"set" in hooks&&(ret=hooks.set(elem,value,name))!==undefined){return ret;}return elem[name]=value;}if(hooks&&"get" in hooks&&(ret=hooks.get(elem,name))!==null){return ret;}return elem[name];},propHooks:{tabIndex:{get:function get(elem){ // elem.tabIndex doesn't always return the
// correct value when it hasn't been explicitly set
// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
// Use proper attribute retrieval(#12072)
var tabindex=jQuery.find.attr(elem,"tabindex");return tabindex?parseInt(tabindex,10):rfocusable.test(elem.nodeName)||rclickable.test(elem.nodeName)&&elem.href?0:-1;}}},propFix:{"for":"htmlFor","class":"className"}});if(!support.optSelected){jQuery.propHooks.selected={get:function get(elem){var parent=elem.parentNode;if(parent&&parent.parentNode){parent.parentNode.selectedIndex;}return null;}};}jQuery.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){jQuery.propFix[this.toLowerCase()]=this;});var rclass=/[\t\r\n\f]/g;function getClass(elem){return elem.getAttribute&&elem.getAttribute("class")||"";}jQuery.fn.extend({addClass:function addClass(value){var classes,elem,cur,curValue,clazz,j,finalValue,i=0;if(jQuery.isFunction(value)){return this.each(function(j){jQuery(this).addClass(value.call(this,j,getClass(this)));});}if(typeof value==="string"&&value){classes=value.match(rnotwhite)||[];while(elem=this[i++]){curValue=getClass(elem);cur=elem.nodeType===1&&(" "+curValue+" ").replace(rclass," ");if(cur){j=0;while(clazz=classes[j++]){if(cur.indexOf(" "+clazz+" ")<0){cur+=clazz+" ";}} // Only assign if different to avoid unneeded rendering.
finalValue=jQuery.trim(cur);if(curValue!==finalValue){elem.setAttribute("class",finalValue);}}}}return this;},removeClass:function removeClass(value){var classes,elem,cur,curValue,clazz,j,finalValue,i=0;if(jQuery.isFunction(value)){return this.each(function(j){jQuery(this).removeClass(value.call(this,j,getClass(this)));});}if(!arguments.length){return this.attr("class","");}if(typeof value==="string"&&value){classes=value.match(rnotwhite)||[];while(elem=this[i++]){curValue=getClass(elem); // This expression is here for better compressibility (see addClass)
cur=elem.nodeType===1&&(" "+curValue+" ").replace(rclass," ");if(cur){j=0;while(clazz=classes[j++]){ // Remove *all* instances
while(cur.indexOf(" "+clazz+" ")>-1){cur=cur.replace(" "+clazz+" "," ");}} // Only assign if different to avoid unneeded rendering.
finalValue=jQuery.trim(cur);if(curValue!==finalValue){elem.setAttribute("class",finalValue);}}}}return this;},toggleClass:function toggleClass(value,stateVal){var type=typeof value==="undefined"?"undefined":_typeof(value);if(typeof stateVal==="boolean"&&type==="string"){return stateVal?this.addClass(value):this.removeClass(value);}if(jQuery.isFunction(value)){return this.each(function(i){jQuery(this).toggleClass(value.call(this,i,getClass(this),stateVal),stateVal);});}return this.each(function(){var className,i,self,classNames;if(type==="string"){ // Toggle individual class names
i=0;self=jQuery(this);classNames=value.match(rnotwhite)||[];while(className=classNames[i++]){ // Check each className given, space separated list
if(self.hasClass(className)){self.removeClass(className);}else {self.addClass(className);}} // Toggle whole class name
}else if(value===undefined||type==="boolean"){className=getClass(this);if(className){ // Store className if set
dataPriv.set(this,"__className__",className);} // If the element has a class name or if we're passed `false`,
// then remove the whole classname (if there was one, the above saved it).
// Otherwise bring back whatever was previously saved (if anything),
// falling back to the empty string if nothing was stored.
if(this.setAttribute){this.setAttribute("class",className||value===false?"":dataPriv.get(this,"__className__")||"");}}});},hasClass:function hasClass(selector){var className,elem,i=0;className=" "+selector+" ";while(elem=this[i++]){if(elem.nodeType===1&&(" "+getClass(elem)+" ").replace(rclass," ").indexOf(className)>-1){return true;}}return false;}});var rreturn=/\r/g;jQuery.fn.extend({val:function val(value){var hooks,ret,isFunction,elem=this[0];if(!arguments.length){if(elem){hooks=jQuery.valHooks[elem.type]||jQuery.valHooks[elem.nodeName.toLowerCase()];if(hooks&&"get" in hooks&&(ret=hooks.get(elem,"value"))!==undefined){return ret;}ret=elem.value;return typeof ret==="string"? // Handle most common string cases
ret.replace(rreturn,""): // Handle cases where value is null/undef or number
ret==null?"":ret;}return;}isFunction=jQuery.isFunction(value);return this.each(function(i){var val;if(this.nodeType!==1){return;}if(isFunction){val=value.call(this,i,jQuery(this).val());}else {val=value;} // Treat null/undefined as ""; convert numbers to string
if(val==null){val="";}else if(typeof val==="number"){val+="";}else if(jQuery.isArray(val)){val=jQuery.map(val,function(value){return value==null?"":value+"";});}hooks=jQuery.valHooks[this.type]||jQuery.valHooks[this.nodeName.toLowerCase()]; // If set returns undefined, fall back to normal setting
if(!hooks||!("set" in hooks)||hooks.set(this,val,"value")===undefined){this.value=val;}});}});jQuery.extend({valHooks:{option:{get:function get(elem){ // Support: IE<11
// option.value not trimmed (#14858)
return jQuery.trim(elem.value);}},select:{get:function get(elem){var value,option,options=elem.options,index=elem.selectedIndex,one=elem.type==="select-one"||index<0,values=one?null:[],max=one?index+1:options.length,i=index<0?max:one?index:0; // Loop through all the selected options
for(;i<max;i++){option=options[i]; // IE8-9 doesn't update selected after form reset (#2551)
if((option.selected||i===index)&&( // Don't return options that are disabled or in a disabled optgroup
support.optDisabled?!option.disabled:option.getAttribute("disabled")===null)&&(!option.parentNode.disabled||!jQuery.nodeName(option.parentNode,"optgroup"))){ // Get the specific value for the option
value=jQuery(option).val(); // We don't need an array for one selects
if(one){return value;} // Multi-Selects return an array
values.push(value);}}return values;},set:function set(elem,value){var optionSet,option,options=elem.options,values=jQuery.makeArray(value),i=options.length;while(i--){option=options[i];if(option.selected=jQuery.inArray(jQuery.valHooks.option.get(option),values)>-1){optionSet=true;}} // Force browsers to behave consistently when non-matching value is set
if(!optionSet){elem.selectedIndex=-1;}return values;}}}}); // Radios and checkboxes getter/setter
jQuery.each(["radio","checkbox"],function(){jQuery.valHooks[this]={set:function set(elem,value){if(jQuery.isArray(value)){return elem.checked=jQuery.inArray(jQuery(elem).val(),value)>-1;}}};if(!support.checkOn){jQuery.valHooks[this].get=function(elem){return elem.getAttribute("value")===null?"on":elem.value;};}}); // Return jQuery for attributes-only inclusion
var rfocusMorph=/^(?:focusinfocus|focusoutblur)$/;jQuery.extend(jQuery.event,{trigger:function trigger(event,data,elem,onlyHandlers){var i,cur,tmp,bubbleType,ontype,handle,special,eventPath=[elem||document],type=hasOwn.call(event,"type")?event.type:event,namespaces=hasOwn.call(event,"namespace")?event.namespace.split("."):[];cur=tmp=elem=elem||document; // Don't do events on text and comment nodes
if(elem.nodeType===3||elem.nodeType===8){return;} // focus/blur morphs to focusin/out; ensure we're not firing them right now
if(rfocusMorph.test(type+jQuery.event.triggered)){return;}if(type.indexOf(".")>-1){ // Namespaced trigger; create a regexp to match event type in handle()
namespaces=type.split(".");type=namespaces.shift();namespaces.sort();}ontype=type.indexOf(":")<0&&"on"+type; // Caller can pass in a jQuery.Event object, Object, or just an event type string
event=event[jQuery.expando]?event:new jQuery.Event(type,(typeof event==="undefined"?"undefined":_typeof(event))==="object"&&event); // Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
event.isTrigger=onlyHandlers?2:3;event.namespace=namespaces.join(".");event.rnamespace=event.namespace?new RegExp("(^|\\.)"+namespaces.join("\\.(?:.*\\.|)")+"(\\.|$)"):null; // Clean up the event in case it is being reused
event.result=undefined;if(!event.target){event.target=elem;} // Clone any incoming data and prepend the event, creating the handler arg list
data=data==null?[event]:jQuery.makeArray(data,[event]); // Allow special events to draw outside the lines
special=jQuery.event.special[type]||{};if(!onlyHandlers&&special.trigger&&special.trigger.apply(elem,data)===false){return;} // Determine event propagation path in advance, per W3C events spec (#9951)
// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
if(!onlyHandlers&&!special.noBubble&&!jQuery.isWindow(elem)){bubbleType=special.delegateType||type;if(!rfocusMorph.test(bubbleType+type)){cur=cur.parentNode;}for(;cur;cur=cur.parentNode){eventPath.push(cur);tmp=cur;} // Only add window if we got to document (e.g., not plain obj or detached DOM)
if(tmp===(elem.ownerDocument||document)){eventPath.push(tmp.defaultView||tmp.parentWindow||window);}} // Fire handlers on the event path
i=0;while((cur=eventPath[i++])&&!event.isPropagationStopped()){event.type=i>1?bubbleType:special.bindType||type; // jQuery handler
handle=(dataPriv.get(cur,"events")||{})[event.type]&&dataPriv.get(cur,"handle");if(handle){handle.apply(cur,data);} // Native handler
handle=ontype&&cur[ontype];if(handle&&handle.apply&&acceptData(cur)){event.result=handle.apply(cur,data);if(event.result===false){event.preventDefault();}}}event.type=type; // If nobody prevented the default action, do it now
if(!onlyHandlers&&!event.isDefaultPrevented()){if((!special._default||special._default.apply(eventPath.pop(),data)===false)&&acceptData(elem)){ // Call a native DOM method on the target with the same name name as the event.
// Don't do default actions on window, that's where global variables be (#6170)
if(ontype&&jQuery.isFunction(elem[type])&&!jQuery.isWindow(elem)){ // Don't re-trigger an onFOO event when we call its FOO() method
tmp=elem[ontype];if(tmp){elem[ontype]=null;} // Prevent re-triggering of the same event, since we already bubbled it above
jQuery.event.triggered=type;elem[type]();jQuery.event.triggered=undefined;if(tmp){elem[ontype]=tmp;}}}}return event.result;}, // Piggyback on a donor event to simulate a different one
simulate:function simulate(type,elem,event){var e=jQuery.extend(new jQuery.Event(),event,{type:type,isSimulated:true // Previously, `originalEvent: {}` was set here, so stopPropagation call
// would not be triggered on donor event, since in our own
// jQuery.event.stopPropagation function we had a check for existence of
// originalEvent.stopPropagation method, so, consequently it would be a noop.
//
// But now, this "simulate" function is used only for events
// for which stopPropagation() is noop, so there is no need for that anymore.
//
// For the 1.x branch though, guard for "click" and "submit"
// events is still used, but was moved to jQuery.event.stopPropagation function
// because `originalEvent` should point to the original event for the constancy
// with other events and for more focused logic
});jQuery.event.trigger(e,null,elem);if(e.isDefaultPrevented()){event.preventDefault();}}});jQuery.fn.extend({trigger:function trigger(type,data){return this.each(function(){jQuery.event.trigger(type,data,this);});},triggerHandler:function triggerHandler(type,data){var elem=this[0];if(elem){return jQuery.event.trigger(type,data,elem,true);}}});jQuery.each(("blur focus focusin focusout load resize scroll unload click dblclick "+"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave "+"change select submit keydown keypress keyup error contextmenu").split(" "),function(i,name){ // Handle event binding
jQuery.fn[name]=function(data,fn){return arguments.length>0?this.on(name,null,data,fn):this.trigger(name);};});jQuery.fn.extend({hover:function hover(fnOver,fnOut){return this.mouseenter(fnOver).mouseleave(fnOut||fnOver);}});support.focusin="onfocusin" in window; // Support: Firefox
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome, Safari
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
if(!support.focusin){jQuery.each({focus:"focusin",blur:"focusout"},function(orig,fix){ // Attach a single capturing handler on the document while someone wants focusin/focusout
var handler=function handler(event){jQuery.event.simulate(fix,event.target,jQuery.event.fix(event));};jQuery.event.special[fix]={setup:function setup(){var doc=this.ownerDocument||this,attaches=dataPriv.access(doc,fix);if(!attaches){doc.addEventListener(orig,handler,true);}dataPriv.access(doc,fix,(attaches||0)+1);},teardown:function teardown(){var doc=this.ownerDocument||this,attaches=dataPriv.access(doc,fix)-1;if(!attaches){doc.removeEventListener(orig,handler,true);dataPriv.remove(doc,fix);}else {dataPriv.access(doc,fix,attaches);}}};});}var location=window.location;var nonce=jQuery.now();var rquery=/\?/; // Support: Android 2.3
// Workaround failure to string-cast null input
jQuery.parseJSON=function(data){return JSON.parse(data+"");}; // Cross-browser xml parsing
jQuery.parseXML=function(data){var xml;if(!data||typeof data!=="string"){return null;} // Support: IE9
try{xml=new window.DOMParser().parseFromString(data,"text/xml");}catch(e){xml=undefined;}if(!xml||xml.getElementsByTagName("parsererror").length){jQuery.error("Invalid XML: "+data);}return xml;};var rhash=/#.*$/,rts=/([?&])_=[^&]*/,rheaders=/^(.*?):[ \t]*([^\r\n]*)$/mg, // #7653, #8125, #8152: local protocol detection
rlocalProtocol=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,rnoContent=/^(?:GET|HEAD)$/,rprotocol=/^\/\//, /* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */prefilters={}, /* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */transports={}, // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
allTypes="*/".concat("*"), // Anchor tag for parsing the document origin
originAnchor=document.createElement("a");originAnchor.href=location.href; // Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports(structure){ // dataTypeExpression is optional and defaults to "*"
return function(dataTypeExpression,func){if(typeof dataTypeExpression!=="string"){func=dataTypeExpression;dataTypeExpression="*";}var dataType,i=0,dataTypes=dataTypeExpression.toLowerCase().match(rnotwhite)||[];if(jQuery.isFunction(func)){ // For each dataType in the dataTypeExpression
while(dataType=dataTypes[i++]){ // Prepend if requested
if(dataType[0]==="+"){dataType=dataType.slice(1)||"*";(structure[dataType]=structure[dataType]||[]).unshift(func); // Otherwise append
}else {(structure[dataType]=structure[dataType]||[]).push(func);}}}};} // Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports(structure,options,originalOptions,jqXHR){var inspected={},seekingTransport=structure===transports;function inspect(dataType){var selected;inspected[dataType]=true;jQuery.each(structure[dataType]||[],function(_,prefilterOrFactory){var dataTypeOrTransport=prefilterOrFactory(options,originalOptions,jqXHR);if(typeof dataTypeOrTransport==="string"&&!seekingTransport&&!inspected[dataTypeOrTransport]){options.dataTypes.unshift(dataTypeOrTransport);inspect(dataTypeOrTransport);return false;}else if(seekingTransport){return !(selected=dataTypeOrTransport);}});return selected;}return inspect(options.dataTypes[0])||!inspected["*"]&&inspect("*");} // A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend(target,src){var key,deep,flatOptions=jQuery.ajaxSettings.flatOptions||{};for(key in src){if(src[key]!==undefined){(flatOptions[key]?target:deep||(deep={}))[key]=src[key];}}if(deep){jQuery.extend(true,target,deep);}return target;} /* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */function ajaxHandleResponses(s,jqXHR,responses){var ct,type,finalDataType,firstDataType,contents=s.contents,dataTypes=s.dataTypes; // Remove auto dataType and get content-type in the process
while(dataTypes[0]==="*"){dataTypes.shift();if(ct===undefined){ct=s.mimeType||jqXHR.getResponseHeader("Content-Type");}} // Check if we're dealing with a known content-type
if(ct){for(type in contents){if(contents[type]&&contents[type].test(ct)){dataTypes.unshift(type);break;}}} // Check to see if we have a response for the expected dataType
if(dataTypes[0] in responses){finalDataType=dataTypes[0];}else { // Try convertible dataTypes
for(type in responses){if(!dataTypes[0]||s.converters[type+" "+dataTypes[0]]){finalDataType=type;break;}if(!firstDataType){firstDataType=type;}} // Or just use first one
finalDataType=finalDataType||firstDataType;} // If we found a dataType
// We add the dataType to the list if needed
// and return the corresponding response
if(finalDataType){if(finalDataType!==dataTypes[0]){dataTypes.unshift(finalDataType);}return responses[finalDataType];}} /* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */function ajaxConvert(s,response,jqXHR,isSuccess){var conv2,current,conv,tmp,prev,converters={}, // Work with a copy of dataTypes in case we need to modify it for conversion
dataTypes=s.dataTypes.slice(); // Create converters map with lowercased keys
if(dataTypes[1]){for(conv in s.converters){converters[conv.toLowerCase()]=s.converters[conv];}}current=dataTypes.shift(); // Convert to each sequential dataType
while(current){if(s.responseFields[current]){jqXHR[s.responseFields[current]]=response;} // Apply the dataFilter if provided
if(!prev&&isSuccess&&s.dataFilter){response=s.dataFilter(response,s.dataType);}prev=current;current=dataTypes.shift();if(current){ // There's only work to do if current dataType is non-auto
if(current==="*"){current=prev; // Convert response if prev dataType is non-auto and differs from current
}else if(prev!=="*"&&prev!==current){ // Seek a direct converter
conv=converters[prev+" "+current]||converters["* "+current]; // If none found, seek a pair
if(!conv){for(conv2 in converters){ // If conv2 outputs current
tmp=conv2.split(" ");if(tmp[1]===current){ // If prev can be converted to accepted input
conv=converters[prev+" "+tmp[0]]||converters["* "+tmp[0]];if(conv){ // Condense equivalence converters
if(conv===true){conv=converters[conv2]; // Otherwise, insert the intermediate dataType
}else if(converters[conv2]!==true){current=tmp[0];dataTypes.unshift(tmp[1]);}break;}}}} // Apply converter (if not an equivalence)
if(conv!==true){ // Unless errors are allowed to bubble, catch and return them
if(conv&&s.throws){response=conv(response);}else {try{response=conv(response);}catch(e){return {state:"parsererror",error:conv?e:"No conversion from "+prev+" to "+current};}}}}}}return {state:"success",data:response};}jQuery.extend({ // Counter for holding the number of active queries
active:0, // Last-Modified header cache for next request
lastModified:{},etag:{},ajaxSettings:{url:location.href,type:"GET",isLocal:rlocalProtocol.test(location.protocol),global:true,processData:true,async:true,contentType:"application/x-www-form-urlencoded; charset=UTF-8", /*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/accepts:{"*":allTypes,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"}, // Data converters
// Keys separate source (or catchall "*") and destination types with a single space
converters:{ // Convert anything to text
"* text":String, // Text to html (true = no transformation)
"text html":true, // Evaluate text as a json expression
"text json":jQuery.parseJSON, // Parse text as xml
"text xml":jQuery.parseXML}, // For options that shouldn't be deep extended:
// you can add your own custom options here if
// and when you create one that shouldn't be
// deep extended (see ajaxExtend)
flatOptions:{url:true,context:true}}, // Creates a full fledged settings object into target
// with both ajaxSettings and settings fields.
// If target is omitted, writes into ajaxSettings.
ajaxSetup:function ajaxSetup(target,settings){return settings? // Building a settings object
ajaxExtend(ajaxExtend(target,jQuery.ajaxSettings),settings): // Extending ajaxSettings
ajaxExtend(jQuery.ajaxSettings,target);},ajaxPrefilter:addToPrefiltersOrTransports(prefilters),ajaxTransport:addToPrefiltersOrTransports(transports), // Main method
ajax:function ajax(url,options){ // If url is an object, simulate pre-1.5 signature
if((typeof url==="undefined"?"undefined":_typeof(url))==="object"){options=url;url=undefined;} // Force options to be an object
options=options||{};var transport, // URL without anti-cache param
cacheURL, // Response headers
responseHeadersString,responseHeaders, // timeout handle
timeoutTimer, // Url cleanup var
urlAnchor, // To know if global events are to be dispatched
fireGlobals, // Loop variable
i, // Create the final options object
s=jQuery.ajaxSetup({},options), // Callbacks context
callbackContext=s.context||s, // Context for global events is callbackContext if it is a DOM node or jQuery collection
globalEventContext=s.context&&(callbackContext.nodeType||callbackContext.jquery)?jQuery(callbackContext):jQuery.event, // Deferreds
deferred=jQuery.Deferred(),completeDeferred=jQuery.Callbacks("once memory"), // Status-dependent callbacks
_statusCode=s.statusCode||{}, // Headers (they are sent all at once)
requestHeaders={},requestHeadersNames={}, // The jqXHR state
state=0, // Default abort message
strAbort="canceled", // Fake xhr
jqXHR={readyState:0, // Builds headers hashtable if needed
getResponseHeader:function getResponseHeader(key){var match;if(state===2){if(!responseHeaders){responseHeaders={};while(match=rheaders.exec(responseHeadersString)){responseHeaders[match[1].toLowerCase()]=match[2];}}match=responseHeaders[key.toLowerCase()];}return match==null?null:match;}, // Raw string
getAllResponseHeaders:function getAllResponseHeaders(){return state===2?responseHeadersString:null;}, // Caches the header
setRequestHeader:function setRequestHeader(name,value){var lname=name.toLowerCase();if(!state){name=requestHeadersNames[lname]=requestHeadersNames[lname]||name;requestHeaders[name]=value;}return this;}, // Overrides response content-type header
overrideMimeType:function overrideMimeType(type){if(!state){s.mimeType=type;}return this;}, // Status-dependent callbacks
statusCode:function statusCode(map){var code;if(map){if(state<2){for(code in map){ // Lazy-add the new callback in a way that preserves old ones
_statusCode[code]=[_statusCode[code],map[code]];}}else { // Execute the appropriate callbacks
jqXHR.always(map[jqXHR.status]);}}return this;}, // Cancel the request
abort:function abort(statusText){var finalText=statusText||strAbort;if(transport){transport.abort(finalText);}done(0,finalText);return this;}}; // Attach deferreds
deferred.promise(jqXHR).complete=completeDeferred.add;jqXHR.success=jqXHR.done;jqXHR.error=jqXHR.fail; // Remove hash character (#7531: and string promotion)
// Add protocol if not provided (prefilters might expect it)
// Handle falsy url in the settings object (#10093: consistency with old signature)
// We also use the url parameter if available
s.url=((url||s.url||location.href)+"").replace(rhash,"").replace(rprotocol,location.protocol+"//"); // Alias method option to type as per ticket #12004
s.type=options.method||options.type||s.method||s.type; // Extract dataTypes list
s.dataTypes=jQuery.trim(s.dataType||"*").toLowerCase().match(rnotwhite)||[""]; // A cross-domain request is in order when the origin doesn't match the current origin.
if(s.crossDomain==null){urlAnchor=document.createElement("a"); // Support: IE8-11+
// IE throws exception if url is malformed, e.g. http://example.com:80x/
try{urlAnchor.href=s.url; // Support: IE8-11+
// Anchor's host property isn't correctly set when s.url is relative
urlAnchor.href=urlAnchor.href;s.crossDomain=originAnchor.protocol+"//"+originAnchor.host!==urlAnchor.protocol+"//"+urlAnchor.host;}catch(e){ // If there is an error parsing the URL, assume it is crossDomain,
// it can be rejected by the transport if it is invalid
s.crossDomain=true;}} // Convert data if not already a string
if(s.data&&s.processData&&typeof s.data!=="string"){s.data=jQuery.param(s.data,s.traditional);} // Apply prefilters
inspectPrefiltersOrTransports(prefilters,s,options,jqXHR); // If request was aborted inside a prefilter, stop there
if(state===2){return jqXHR;} // We can fire global events as of now if asked to
// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
fireGlobals=jQuery.event&&s.global; // Watch for a new set of requests
if(fireGlobals&&jQuery.active++===0){jQuery.event.trigger("ajaxStart");} // Uppercase the type
s.type=s.type.toUpperCase(); // Determine if request has content
s.hasContent=!rnoContent.test(s.type); // Save the URL in case we're toying with the If-Modified-Since
// and/or If-None-Match header later on
cacheURL=s.url; // More options handling for requests with no content
if(!s.hasContent){ // If data is available, append data to url
if(s.data){cacheURL=s.url+=(rquery.test(cacheURL)?"&":"?")+s.data; // #9682: remove data so that it's not used in an eventual retry
delete s.data;} // Add anti-cache in url if needed
if(s.cache===false){s.url=rts.test(cacheURL)? // If there is already a '_' parameter, set its value
cacheURL.replace(rts,"$1_="+nonce++): // Otherwise add one to the end
cacheURL+(rquery.test(cacheURL)?"&":"?")+"_="+nonce++;}} // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
if(s.ifModified){if(jQuery.lastModified[cacheURL]){jqXHR.setRequestHeader("If-Modified-Since",jQuery.lastModified[cacheURL]);}if(jQuery.etag[cacheURL]){jqXHR.setRequestHeader("If-None-Match",jQuery.etag[cacheURL]);}} // Set the correct header, if data is being sent
if(s.data&&s.hasContent&&s.contentType!==false||options.contentType){jqXHR.setRequestHeader("Content-Type",s.contentType);} // Set the Accepts header for the server, depending on the dataType
jqXHR.setRequestHeader("Accept",s.dataTypes[0]&&s.accepts[s.dataTypes[0]]?s.accepts[s.dataTypes[0]]+(s.dataTypes[0]!=="*"?", "+allTypes+"; q=0.01":""):s.accepts["*"]); // Check for headers option
for(i in s.headers){jqXHR.setRequestHeader(i,s.headers[i]);} // Allow custom headers/mimetypes and early abort
if(s.beforeSend&&(s.beforeSend.call(callbackContext,jqXHR,s)===false||state===2)){ // Abort if not done already and return
return jqXHR.abort();} // Aborting is no longer a cancellation
strAbort="abort"; // Install callbacks on deferreds
for(i in {success:1,error:1,complete:1}){jqXHR[i](s[i]);} // Get transport
transport=inspectPrefiltersOrTransports(transports,s,options,jqXHR); // If no transport, we auto-abort
if(!transport){done(-1,"No Transport");}else {jqXHR.readyState=1; // Send global event
if(fireGlobals){globalEventContext.trigger("ajaxSend",[jqXHR,s]);} // If request was aborted inside ajaxSend, stop there
if(state===2){return jqXHR;} // Timeout
if(s.async&&s.timeout>0){timeoutTimer=window.setTimeout(function(){jqXHR.abort("timeout");},s.timeout);}try{state=1;transport.send(requestHeaders,done);}catch(e){ // Propagate exception as error if not done
if(state<2){done(-1,e); // Simply rethrow otherwise
}else {throw e;}}} // Callback for when everything is done
function done(status,nativeStatusText,responses,headers){var isSuccess,success,error,response,modified,statusText=nativeStatusText; // Called once
if(state===2){return;} // State is "done" now
state=2; // Clear timeout if it exists
if(timeoutTimer){window.clearTimeout(timeoutTimer);} // Dereference transport for early garbage collection
// (no matter how long the jqXHR object will be used)
transport=undefined; // Cache response headers
responseHeadersString=headers||""; // Set readyState
jqXHR.readyState=status>0?4:0; // Determine if successful
isSuccess=status>=200&&status<300||status===304; // Get response data
if(responses){response=ajaxHandleResponses(s,jqXHR,responses);} // Convert no matter what (that way responseXXX fields are always set)
response=ajaxConvert(s,response,jqXHR,isSuccess); // If successful, handle type chaining
if(isSuccess){ // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
if(s.ifModified){modified=jqXHR.getResponseHeader("Last-Modified");if(modified){jQuery.lastModified[cacheURL]=modified;}modified=jqXHR.getResponseHeader("etag");if(modified){jQuery.etag[cacheURL]=modified;}} // if no content
if(status===204||s.type==="HEAD"){statusText="nocontent"; // if not modified
}else if(status===304){statusText="notmodified"; // If we have data, let's convert it
}else {statusText=response.state;success=response.data;error=response.error;isSuccess=!error;}}else { // Extract error from statusText and normalize for non-aborts
error=statusText;if(status||!statusText){statusText="error";if(status<0){status=0;}}} // Set data for the fake xhr object
jqXHR.status=status;jqXHR.statusText=(nativeStatusText||statusText)+""; // Success/Error
if(isSuccess){deferred.resolveWith(callbackContext,[success,statusText,jqXHR]);}else {deferred.rejectWith(callbackContext,[jqXHR,statusText,error]);} // Status-dependent callbacks
jqXHR.statusCode(_statusCode);_statusCode=undefined;if(fireGlobals){globalEventContext.trigger(isSuccess?"ajaxSuccess":"ajaxError",[jqXHR,s,isSuccess?success:error]);} // Complete
completeDeferred.fireWith(callbackContext,[jqXHR,statusText]);if(fireGlobals){globalEventContext.trigger("ajaxComplete",[jqXHR,s]); // Handle the global AJAX counter
if(! --jQuery.active){jQuery.event.trigger("ajaxStop");}}}return jqXHR;},getJSON:function getJSON(url,data,callback){return jQuery.get(url,data,callback,"json");},getScript:function getScript(url,callback){return jQuery.get(url,undefined,callback,"script");}});jQuery.each(["get","post"],function(i,method){jQuery[method]=function(url,data,callback,type){ // Shift arguments if data argument was omitted
if(jQuery.isFunction(data)){type=type||callback;callback=data;data=undefined;} // The url can be an options object (which then must have .url)
return jQuery.ajax(jQuery.extend({url:url,type:method,dataType:type,data:data,success:callback},jQuery.isPlainObject(url)&&url));};});jQuery._evalUrl=function(url){return jQuery.ajax({url:url, // Make this explicit, since user can override this through ajaxSetup (#11264)
type:"GET",dataType:"script",async:false,global:false,"throws":true});};jQuery.fn.extend({wrapAll:function wrapAll(html){var wrap;if(jQuery.isFunction(html)){return this.each(function(i){jQuery(this).wrapAll(html.call(this,i));});}if(this[0]){ // The elements to wrap the target around
wrap=jQuery(html,this[0].ownerDocument).eq(0).clone(true);if(this[0].parentNode){wrap.insertBefore(this[0]);}wrap.map(function(){var elem=this;while(elem.firstElementChild){elem=elem.firstElementChild;}return elem;}).append(this);}return this;},wrapInner:function wrapInner(html){if(jQuery.isFunction(html)){return this.each(function(i){jQuery(this).wrapInner(html.call(this,i));});}return this.each(function(){var self=jQuery(this),contents=self.contents();if(contents.length){contents.wrapAll(html);}else {self.append(html);}});},wrap:function wrap(html){var isFunction=jQuery.isFunction(html);return this.each(function(i){jQuery(this).wrapAll(isFunction?html.call(this,i):html);});},unwrap:function unwrap(){return this.parent().each(function(){if(!jQuery.nodeName(this,"body")){jQuery(this).replaceWith(this.childNodes);}}).end();}});jQuery.expr.filters.hidden=function(elem){return !jQuery.expr.filters.visible(elem);};jQuery.expr.filters.visible=function(elem){ // Support: Opera <= 12.12
// Opera reports offsetWidths and offsetHeights less than zero on some elements
// Use OR instead of AND as the element is not visible if either is true
// See tickets #10406 and #13132
return elem.offsetWidth>0||elem.offsetHeight>0||elem.getClientRects().length>0;};var r20=/%20/g,rbracket=/\[\]$/,rCRLF=/\r?\n/g,rsubmitterTypes=/^(?:submit|button|image|reset|file)$/i,rsubmittable=/^(?:input|select|textarea|keygen)/i;function buildParams(prefix,obj,traditional,add){var name;if(jQuery.isArray(obj)){ // Serialize array item.
jQuery.each(obj,function(i,v){if(traditional||rbracket.test(prefix)){ // Treat each array item as a scalar.
add(prefix,v);}else { // Item is non-scalar (array or object), encode its numeric index.
buildParams(prefix+"["+((typeof v==="undefined"?"undefined":_typeof(v))==="object"&&v!=null?i:"")+"]",v,traditional,add);}});}else if(!traditional&&jQuery.type(obj)==="object"){ // Serialize object item.
for(name in obj){buildParams(prefix+"["+name+"]",obj[name],traditional,add);}}else { // Serialize scalar item.
add(prefix,obj);}} // Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param=function(a,traditional){var prefix,s=[],add=function add(key,value){ // If value is a function, invoke it and return its value
value=jQuery.isFunction(value)?value():value==null?"":value;s[s.length]=encodeURIComponent(key)+"="+encodeURIComponent(value);}; // Set traditional to true for jQuery <= 1.3.2 behavior.
if(traditional===undefined){traditional=jQuery.ajaxSettings&&jQuery.ajaxSettings.traditional;} // If an array was passed in, assume that it is an array of form elements.
if(jQuery.isArray(a)||a.jquery&&!jQuery.isPlainObject(a)){ // Serialize the form elements
jQuery.each(a,function(){add(this.name,this.value);});}else { // If traditional, encode the "old" way (the way 1.3.2 or older
// did it), otherwise encode params recursively.
for(prefix in a){buildParams(prefix,a[prefix],traditional,add);}} // Return the resulting serialization
return s.join("&").replace(r20,"+");};jQuery.fn.extend({serialize:function serialize(){return jQuery.param(this.serializeArray());},serializeArray:function serializeArray(){return this.map(function(){ // Can add propHook for "elements" to filter or add form elements
var elements=jQuery.prop(this,"elements");return elements?jQuery.makeArray(elements):this;}).filter(function(){var type=this.type; // Use .is( ":disabled" ) so that fieldset[disabled] works
return this.name&&!jQuery(this).is(":disabled")&&rsubmittable.test(this.nodeName)&&!rsubmitterTypes.test(type)&&(this.checked||!rcheckableType.test(type));}).map(function(i,elem){var val=jQuery(this).val();return val==null?null:jQuery.isArray(val)?jQuery.map(val,function(val){return {name:elem.name,value:val.replace(rCRLF,"\r\n")};}):{name:elem.name,value:val.replace(rCRLF,"\r\n")};}).get();}});jQuery.ajaxSettings.xhr=function(){try{return new window.XMLHttpRequest();}catch(e){}};var xhrSuccessStatus={ // File protocol always yields status code 0, assume 200
0:200, // Support: IE9
// #1450: sometimes IE returns 1223 when it should be 204
1223:204},xhrSupported=jQuery.ajaxSettings.xhr();support.cors=!!xhrSupported&&"withCredentials" in xhrSupported;support.ajax=xhrSupported=!!xhrSupported;jQuery.ajaxTransport(function(options){var _callback,errorCallback; // Cross domain only allowed if supported through XMLHttpRequest
if(support.cors||xhrSupported&&!options.crossDomain){return {send:function send(headers,complete){var i,xhr=options.xhr();xhr.open(options.type,options.url,options.async,options.username,options.password); // Apply custom fields if provided
if(options.xhrFields){for(i in options.xhrFields){xhr[i]=options.xhrFields[i];}} // Override mime type if needed
if(options.mimeType&&xhr.overrideMimeType){xhr.overrideMimeType(options.mimeType);} // X-Requested-With header
// For cross-domain requests, seeing as conditions for a preflight are
// akin to a jigsaw puzzle, we simply never set it to be sure.
// (it can always be set on a per-request basis or even using ajaxSetup)
// For same-domain requests, won't change header if already provided.
if(!options.crossDomain&&!headers["X-Requested-With"]){headers["X-Requested-With"]="XMLHttpRequest";} // Set headers
for(i in headers){xhr.setRequestHeader(i,headers[i]);} // Callback
_callback=function callback(type){return function(){if(_callback){_callback=errorCallback=xhr.onload=xhr.onerror=xhr.onabort=xhr.onreadystatechange=null;if(type==="abort"){xhr.abort();}else if(type==="error"){ // Support: IE9
// On a manual native abort, IE9 throws
// errors on any property access that is not readyState
if(typeof xhr.status!=="number"){complete(0,"error");}else {complete( // File: protocol always yields status 0; see #8605, #14207
xhr.status,xhr.statusText);}}else {complete(xhrSuccessStatus[xhr.status]||xhr.status,xhr.statusText, // Support: IE9 only
// IE9 has no XHR2 but throws on binary (trac-11426)
// For XHR2 non-text, let the caller handle it (gh-2498)
(xhr.responseType||"text")!=="text"||typeof xhr.responseText!=="string"?{binary:xhr.response}:{text:xhr.responseText},xhr.getAllResponseHeaders());}}};}; // Listen to events
xhr.onload=_callback();errorCallback=xhr.onerror=_callback("error"); // Support: IE9
// Use onreadystatechange to replace onabort
// to handle uncaught aborts
if(xhr.onabort!==undefined){xhr.onabort=errorCallback;}else {xhr.onreadystatechange=function(){ // Check readyState before timeout as it changes
if(xhr.readyState===4){ // Allow onerror to be called first,
// but that will not handle a native abort
// Also, save errorCallback to a variable
// as xhr.onerror cannot be accessed
window.setTimeout(function(){if(_callback){errorCallback();}});}};} // Create the abort callback
_callback=_callback("abort");try{ // Do send the request (this may raise an exception)
xhr.send(options.hasContent&&options.data||null);}catch(e){ // #14683: Only rethrow if this hasn't been notified as an error yet
if(_callback){throw e;}}},abort:function abort(){if(_callback){_callback();}}};}}); // Install script dataType
jQuery.ajaxSetup({accepts:{script:"text/javascript, application/javascript, "+"application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function textScript(text){jQuery.globalEval(text);return text;}}}); // Handle cache's special case and crossDomain
jQuery.ajaxPrefilter("script",function(s){if(s.cache===undefined){s.cache=false;}if(s.crossDomain){s.type="GET";}}); // Bind script tag hack transport
jQuery.ajaxTransport("script",function(s){ // This transport only deals with cross domain requests
if(s.crossDomain){var script,_callback2;return {send:function send(_,complete){script=jQuery("<script>").prop({charset:s.scriptCharset,src:s.url}).on("load error",_callback2=function callback(evt){script.remove();_callback2=null;if(evt){complete(evt.type==="error"?404:200,evt.type);}}); // Use native DOM manipulation to avoid our domManip AJAX trickery
document.head.appendChild(script[0]);},abort:function abort(){if(_callback2){_callback2();}}};}});var oldCallbacks=[],rjsonp=/(=)\?(?=&|$)|\?\?/; // Default jsonp settings
jQuery.ajaxSetup({jsonp:"callback",jsonpCallback:function jsonpCallback(){var callback=oldCallbacks.pop()||jQuery.expando+"_"+nonce++;this[callback]=true;return callback;}}); // Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter("json jsonp",function(s,originalSettings,jqXHR){var callbackName,overwritten,responseContainer,jsonProp=s.jsonp!==false&&(rjsonp.test(s.url)?"url":typeof s.data==="string"&&(s.contentType||"").indexOf("application/x-www-form-urlencoded")===0&&rjsonp.test(s.data)&&"data"); // Handle iff the expected data type is "jsonp" or we have a parameter to set
if(jsonProp||s.dataTypes[0]==="jsonp"){ // Get callback name, remembering preexisting value associated with it
callbackName=s.jsonpCallback=jQuery.isFunction(s.jsonpCallback)?s.jsonpCallback():s.jsonpCallback; // Insert callback into url or form data
if(jsonProp){s[jsonProp]=s[jsonProp].replace(rjsonp,"$1"+callbackName);}else if(s.jsonp!==false){s.url+=(rquery.test(s.url)?"&":"?")+s.jsonp+"="+callbackName;} // Use data converter to retrieve json after script execution
s.converters["script json"]=function(){if(!responseContainer){jQuery.error(callbackName+" was not called");}return responseContainer[0];}; // Force json dataType
s.dataTypes[0]="json"; // Install callback
overwritten=window[callbackName];window[callbackName]=function(){responseContainer=arguments;}; // Clean-up function (fires after converters)
jqXHR.always(function(){ // If previous value didn't exist - remove it
if(overwritten===undefined){jQuery(window).removeProp(callbackName); // Otherwise restore preexisting value
}else {window[callbackName]=overwritten;} // Save back as free
if(s[callbackName]){ // Make sure that re-using the options doesn't screw things around
s.jsonpCallback=originalSettings.jsonpCallback; // Save the callback name for future use
oldCallbacks.push(callbackName);} // Call if it was a function and we have a response
if(responseContainer&&jQuery.isFunction(overwritten)){overwritten(responseContainer[0]);}responseContainer=overwritten=undefined;}); // Delegate to script
return "script";}}); // Support: Safari 8+
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument=function(){var body=document.implementation.createHTMLDocument("").body;body.innerHTML="<form></form><form></form>";return body.childNodes.length===2;}(); // Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML=function(data,context,keepScripts){if(!data||typeof data!=="string"){return null;}if(typeof context==="boolean"){keepScripts=context;context=false;} // Stop scripts or inline event handlers from being executed immediately
// by using document.implementation
context=context||(support.createHTMLDocument?document.implementation.createHTMLDocument(""):document);var parsed=rsingleTag.exec(data),scripts=!keepScripts&&[]; // Single tag
if(parsed){return [context.createElement(parsed[1])];}parsed=buildFragment([data],context,scripts);if(scripts&&scripts.length){jQuery(scripts).remove();}return jQuery.merge([],parsed.childNodes);}; // Keep a copy of the old load method
var _load=jQuery.fn.load; /**
 * Load a url into a page
 */jQuery.fn.load=function(url,params,callback){if(typeof url!=="string"&&_load){return _load.apply(this,arguments);}var selector,type,response,self=this,off=url.indexOf(" ");if(off>-1){selector=jQuery.trim(url.slice(off));url=url.slice(0,off);} // If it's a function
if(jQuery.isFunction(params)){ // We assume that it's the callback
callback=params;params=undefined; // Otherwise, build a param string
}else if(params&&(typeof params==="undefined"?"undefined":_typeof(params))==="object"){type="POST";} // If we have elements to modify, make the request
if(self.length>0){jQuery.ajax({url:url, // If "type" variable is undefined, then "GET" method will be used.
// Make value of this field explicit since
// user can override it through ajaxSetup method
type:type||"GET",dataType:"html",data:params}).done(function(responseText){ // Save response for use in complete callback
response=arguments;self.html(selector? // If a selector was specified, locate the right elements in a dummy div
// Exclude scripts to avoid IE 'Permission Denied' errors
jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector): // Otherwise use the full result
responseText); // If the request succeeds, this function gets "data", "status", "jqXHR"
// but they are ignored because response was set above.
// If it fails, this function gets "jqXHR", "status", "error"
}).always(callback&&function(jqXHR,status){self.each(function(){callback.apply(self,response||[jqXHR.responseText,status,jqXHR]);});});}return this;}; // Attach a bunch of functions for handling common AJAX events
jQuery.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(i,type){jQuery.fn[type]=function(fn){return this.on(type,fn);};});jQuery.expr.filters.animated=function(elem){return jQuery.grep(jQuery.timers,function(fn){return elem===fn.elem;}).length;}; /**
 * Gets a window from an element
 */function getWindow(elem){return jQuery.isWindow(elem)?elem:elem.nodeType===9&&elem.defaultView;}jQuery.offset={setOffset:function setOffset(elem,options,i){var curPosition,curLeft,curCSSTop,curTop,curOffset,curCSSLeft,calculatePosition,position=jQuery.css(elem,"position"),curElem=jQuery(elem),props={}; // Set position first, in-case top/left are set even on static elem
if(position==="static"){elem.style.position="relative";}curOffset=curElem.offset();curCSSTop=jQuery.css(elem,"top");curCSSLeft=jQuery.css(elem,"left");calculatePosition=(position==="absolute"||position==="fixed")&&(curCSSTop+curCSSLeft).indexOf("auto")>-1; // Need to be able to calculate position if either
// top or left is auto and position is either absolute or fixed
if(calculatePosition){curPosition=curElem.position();curTop=curPosition.top;curLeft=curPosition.left;}else {curTop=parseFloat(curCSSTop)||0;curLeft=parseFloat(curCSSLeft)||0;}if(jQuery.isFunction(options)){ // Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
options=options.call(elem,i,jQuery.extend({},curOffset));}if(options.top!=null){props.top=options.top-curOffset.top+curTop;}if(options.left!=null){props.left=options.left-curOffset.left+curLeft;}if("using" in options){options.using.call(elem,props);}else {curElem.css(props);}}};jQuery.fn.extend({offset:function offset(options){if(arguments.length){return options===undefined?this:this.each(function(i){jQuery.offset.setOffset(this,options,i);});}var docElem,win,elem=this[0],box={top:0,left:0},doc=elem&&elem.ownerDocument;if(!doc){return;}docElem=doc.documentElement; // Make sure it's not a disconnected DOM node
if(!jQuery.contains(docElem,elem)){return box;}box=elem.getBoundingClientRect();win=getWindow(doc);return {top:box.top+win.pageYOffset-docElem.clientTop,left:box.left+win.pageXOffset-docElem.clientLeft};},position:function position(){if(!this[0]){return;}var offsetParent,offset,elem=this[0],parentOffset={top:0,left:0}; // Fixed elements are offset from window (parentOffset = {top:0, left: 0},
// because it is its only offset parent
if(jQuery.css(elem,"position")==="fixed"){ // Assume getBoundingClientRect is there when computed position is fixed
offset=elem.getBoundingClientRect();}else { // Get *real* offsetParent
offsetParent=this.offsetParent(); // Get correct offsets
offset=this.offset();if(!jQuery.nodeName(offsetParent[0],"html")){parentOffset=offsetParent.offset();} // Add offsetParent borders
parentOffset.top+=jQuery.css(offsetParent[0],"borderTopWidth",true);parentOffset.left+=jQuery.css(offsetParent[0],"borderLeftWidth",true);} // Subtract parent offsets and element margins
return {top:offset.top-parentOffset.top-jQuery.css(elem,"marginTop",true),left:offset.left-parentOffset.left-jQuery.css(elem,"marginLeft",true)};}, // This method will return documentElement in the following cases:
// 1) For the element inside the iframe without offsetParent, this method will return
//    documentElement of the parent window
// 2) For the hidden or detached element
// 3) For body or html element, i.e. in case of the html node - it will return itself
//
// but those exceptions were never presented as a real life use-cases
// and might be considered as more preferable results.
//
// This logic, however, is not guaranteed and can change at any point in the future
offsetParent:function offsetParent(){return this.map(function(){var offsetParent=this.offsetParent;while(offsetParent&&jQuery.css(offsetParent,"position")==="static"){offsetParent=offsetParent.offsetParent;}return offsetParent||documentElement;});}}); // Create scrollLeft and scrollTop methods
jQuery.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(method,prop){var top="pageYOffset"===prop;jQuery.fn[method]=function(val){return access(this,function(elem,method,val){var win=getWindow(elem);if(val===undefined){return win?win[prop]:elem[method];}if(win){win.scrollTo(!top?val:win.pageXOffset,top?val:win.pageYOffset);}else {elem[method]=val;}},method,val,arguments.length);};}); // Support: Safari<7-8+, Chrome<37-44+
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://code.google.com/p/chromium/issues/detail?id=229280
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each(["top","left"],function(i,prop){jQuery.cssHooks[prop]=addGetHookIf(support.pixelPosition,function(elem,computed){if(computed){computed=curCSS(elem,prop); // If curCSS returns percentage, fallback to offset
return rnumnonpx.test(computed)?jQuery(elem).position()[prop]+"px":computed;}});}); // Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each({Height:"height",Width:"width"},function(name,type){jQuery.each({padding:"inner"+name,content:type,"":"outer"+name},function(defaultExtra,funcName){ // Margin is only for outerHeight, outerWidth
jQuery.fn[funcName]=function(margin,value){var chainable=arguments.length&&(defaultExtra||typeof margin!=="boolean"),extra=defaultExtra||(margin===true||value===true?"margin":"border");return access(this,function(elem,type,value){var doc;if(jQuery.isWindow(elem)){ // As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
// isn't a whole lot we can do. See pull request at this URL for discussion:
// https://github.com/jquery/jquery/pull/764
return elem.document.documentElement["client"+name];} // Get document width or height
if(elem.nodeType===9){doc=elem.documentElement; // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
// whichever is greatest
return Math.max(elem.body["scroll"+name],doc["scroll"+name],elem.body["offset"+name],doc["offset"+name],doc["client"+name]);}return value===undefined? // Get width or height on the element, requesting but not forcing parseFloat
jQuery.css(elem,type,extra): // Set width or height on the element
jQuery.style(elem,type,value,extra);},type,chainable?margin:undefined,chainable,null);};});});jQuery.fn.extend({bind:function bind(types,data,fn){return this.on(types,null,data,fn);},unbind:function unbind(types,fn){return this.off(types,null,fn);},delegate:function delegate(selector,types,data,fn){return this.on(types,selector,data,fn);},undelegate:function undelegate(selector,types,fn){ // ( namespace ) or ( selector, types [, fn] )
return arguments.length===1?this.off(selector,"**"):this.off(types,selector||"**",fn);},size:function size(){return this.length;}});jQuery.fn.andSelf=jQuery.fn.addBack; // Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.
// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon
if(typeof define==="function"&&define.amd){define("jquery",[],function(){return jQuery;});}var  // Map over jQuery in case of overwrite
_jQuery=window.jQuery, // Map over the $ in case of overwrite
_$=window.$;jQuery.noConflict=function(deep){if(window.$===jQuery){window.$=_$;}if(deep&&window.jQuery===jQuery){window.jQuery=_jQuery;}return jQuery;}; // Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if(!noGlobal){window.jQuery=window.$=jQuery;}return jQuery;});},{}],47:[function(require,module,exports){ /**
The following batches are equivalent:

var beautify_js = require('js-beautify');
var beautify_js = require('js-beautify').js;
var beautify_js = require('js-beautify').js_beautify;

var beautify_css = require('js-beautify').css;
var beautify_css = require('js-beautify').css_beautify;

var beautify_html = require('js-beautify').html;
var beautify_html = require('js-beautify').html_beautify;

All methods returned accept two arguments, the source string and an options object.
**/function get_beautify(js_beautify,css_beautify,html_beautify){ // the default is js
var beautify=function beautify(src,config){return js_beautify.js_beautify(src,config);}; // short aliases
beautify.js=js_beautify.js_beautify;beautify.css=css_beautify.css_beautify;beautify.html=html_beautify.html_beautify; // legacy aliases
beautify.js_beautify=js_beautify.js_beautify;beautify.css_beautify=css_beautify.css_beautify;beautify.html_beautify=html_beautify.html_beautify;return beautify;}if(typeof define==="function"&&define.amd){ // Add support for AMD ( https://github.com/amdjs/amdjs-api/wiki/AMD#defineamd-property- )
define(["./lib/beautify","./lib/beautify-css","./lib/beautify-html"],function(js_beautify,css_beautify,html_beautify){return get_beautify(js_beautify,css_beautify,html_beautify);});}else {(function(mod){var js_beautify=require('./lib/beautify');var css_beautify=require('./lib/beautify-css');var html_beautify=require('./lib/beautify-html');mod.exports=get_beautify(js_beautify,css_beautify,html_beautify);})(module);}},{"./lib/beautify":50,"./lib/beautify-css":48,"./lib/beautify-html":49}],48:[function(require,module,exports){(function(global){ /*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */ /*

  The MIT License (MIT)

  Copyright (c) 2007-2013 Einar Lielmanis and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.


 CSS Beautifier
---------------

    Written by Harutyun Amirjanyan, (amirjanyan@gmail.com)

    Based on code initially developed by: Einar Lielmanis, <einar@jsbeautifier.org>
        http://jsbeautifier.org/

    Usage:
        css_beautify(source_text);
        css_beautify(source_text, options);

    The options are (default in brackets):
        indent_size (4)                   — indentation size,
        indent_char (space)               — character to indent with,
        selector_separator_newline (true) - separate selectors with newline or
                                            not (e.g. "a,\nbr" or "a, br")
        end_with_newline (false)          - end with a newline
        newline_between_rules (true)      - add a new line after every css rule

    e.g

    css_beautify(css_source_text, {
      'indent_size': 1,
      'indent_char': '\t',
      'selector_separator': ' ',
      'end_with_newline': false,
      'newline_between_rules': true
    });
*/ // http://www.w3.org/TR/CSS21/syndata.html#tokenization
// http://www.w3.org/TR/css3-syntax/
(function(){function css_beautify(source_text,options){options=options||{};source_text=source_text||''; // HACK: newline parsing inconsistent. This brute force normalizes the input.
source_text=source_text.replace(/\r\n|[\r\u2028\u2029]/g,'\n');var indentSize=options.indent_size||4;var indentCharacter=options.indent_char||' ';var selectorSeparatorNewline=options.selector_separator_newline===undefined?true:options.selector_separator_newline;var end_with_newline=options.end_with_newline===undefined?false:options.end_with_newline;var newline_between_rules=options.newline_between_rules===undefined?true:options.newline_between_rules;var eol=options.eol?options.eol:'\n'; // compatibility
if(typeof indentSize==="string"){indentSize=parseInt(indentSize,10);}if(options.indent_with_tabs){indentCharacter='\t';indentSize=1;}eol=eol.replace(/\\r/,'\r').replace(/\\n/,'\n'); // tokenizer
var whiteRe=/^\s+$/;var wordRe=/[\w$\-_]/;var pos=-1,ch;var parenLevel=0;function next(){ch=source_text.charAt(++pos);return ch||'';}function peek(skipWhitespace){var result='';var prev_pos=pos;if(skipWhitespace){eatWhitespace();}result=source_text.charAt(pos+1)||'';pos=prev_pos-1;next();return result;}function eatString(endChars){var start=pos;while(next()){if(ch==="\\"){next();}else if(endChars.indexOf(ch)!==-1){break;}else if(ch==="\n"){break;}}return source_text.substring(start,pos+1);}function peekString(endChar){var prev_pos=pos;var str=eatString(endChar);pos=prev_pos-1;next();return str;}function eatWhitespace(){var result='';while(whiteRe.test(peek())){next();result+=ch;}return result;}function skipWhitespace(){var result='';if(ch&&whiteRe.test(ch)){result=ch;}while(whiteRe.test(next())){result+=ch;}return result;}function eatComment(singleLine){var start=pos;singleLine=peek()==="/";next();while(next()){if(!singleLine&&ch==="*"&&peek()==="/"){next();break;}else if(singleLine&&ch==="\n"){return source_text.substring(start,pos);}}return source_text.substring(start,pos)+ch;}function lookBack(str){return source_text.substring(pos-str.length,pos).toLowerCase()===str;} // Nested pseudo-class if we are insideRule
// and the next special character found opens
// a new block
function foundNestedPseudoClass(){var openParen=0;for(var i=pos+1;i<source_text.length;i++){var ch=source_text.charAt(i);if(ch==="{"){return true;}else if(ch==='('){ // pseudoclasses can contain ()
openParen+=1;}else if(ch===')'){if(openParen==0){return false;}openParen-=1;}else if(ch===";"||ch==="}"){return false;}}return false;} // printer
var basebaseIndentString=source_text.match(/^[\t ]*/)[0];var singleIndent=new Array(indentSize+1).join(indentCharacter);var indentLevel=0;var nestedLevel=0;function indent(){indentLevel++;basebaseIndentString+=singleIndent;}function outdent(){indentLevel--;basebaseIndentString=basebaseIndentString.slice(0,-indentSize);}var print={};print["{"]=function(ch){print.singleSpace();output.push(ch);print.newLine();};print["}"]=function(ch){print.newLine();output.push(ch);print.newLine();};print._lastCharWhitespace=function(){return whiteRe.test(output[output.length-1]);};print.newLine=function(keepWhitespace){if(output.length){if(!keepWhitespace&&output[output.length-1]!=='\n'){print.trim();}output.push('\n');if(basebaseIndentString){output.push(basebaseIndentString);}}};print.singleSpace=function(){if(output.length&&!print._lastCharWhitespace()){output.push(' ');}};print.preserveSingleSpace=function(){if(isAfterSpace){print.singleSpace();}};print.trim=function(){while(print._lastCharWhitespace()){output.pop();}};var output=[]; /*_____________________--------------------_____________________*/var insideRule=false;var insidePropertyValue=false;var enteringConditionalGroup=false;var top_ch='';var last_top_ch='';while(true){var whitespace=skipWhitespace();var isAfterSpace=whitespace!=='';var isAfterNewline=whitespace.indexOf('\n')!==-1;last_top_ch=top_ch;top_ch=ch;if(!ch){break;}else if(ch==='/'&&peek()==='*'){ /* css comment */var header=indentLevel===0;if(isAfterNewline||header){print.newLine();}output.push(eatComment());print.newLine();if(header){print.newLine(true);}}else if(ch==='/'&&peek()==='/'){ // single line comment
if(!isAfterNewline&&last_top_ch!=='{'){print.trim();}print.singleSpace();output.push(eatComment());print.newLine();}else if(ch==='@'){print.preserveSingleSpace();output.push(ch); // strip trailing space, if present, for hash property checks
var variableOrRule=peekString(": ,;{}()[]/='\"");if(variableOrRule.match(/[ :]$/)){ // we have a variable or pseudo-class, add it and insert one space before continuing
next();variableOrRule=eatString(": ").replace(/\s$/,'');output.push(variableOrRule);print.singleSpace();}variableOrRule=variableOrRule.replace(/\s$/,''); // might be a nesting at-rule
if(variableOrRule in css_beautify.NESTED_AT_RULE){nestedLevel+=1;if(variableOrRule in css_beautify.CONDITIONAL_GROUP_RULE){enteringConditionalGroup=true;}}}else if(ch==='#'&&peek()==='{'){print.preserveSingleSpace();output.push(eatString('}'));}else if(ch==='{'){if(peek(true)==='}'){eatWhitespace();next();print.singleSpace();output.push("{}");print.newLine();if(newline_between_rules&&indentLevel===0){print.newLine(true);}}else {indent();print["{"](ch); // when entering conditional groups, only rulesets are allowed
if(enteringConditionalGroup){enteringConditionalGroup=false;insideRule=indentLevel>nestedLevel;}else { // otherwise, declarations are also allowed
insideRule=indentLevel>=nestedLevel;}}}else if(ch==='}'){outdent();print["}"](ch);insideRule=false;insidePropertyValue=false;if(nestedLevel){nestedLevel--;}if(newline_between_rules&&indentLevel===0){print.newLine(true);}}else if(ch===":"){eatWhitespace();if((insideRule||enteringConditionalGroup)&&!(lookBack("&")||foundNestedPseudoClass())){ // 'property: value' delimiter
// which could be in a conditional group query
insidePropertyValue=true;output.push(':');print.singleSpace();}else { // sass/less parent reference don't use a space
// sass nested pseudo-class don't use a space
if(peek()===":"){ // pseudo-element
next();output.push("::");}else { // pseudo-class
output.push(':');}}}else if(ch==='"'||ch==='\''){print.preserveSingleSpace();output.push(eatString(ch));}else if(ch===';'){insidePropertyValue=false;output.push(ch);print.newLine();}else if(ch==='('){ // may be a url
if(lookBack("url")){output.push(ch);eatWhitespace();if(next()){if(ch!==')'&&ch!=='"'&&ch!=='\''){output.push(eatString(')'));}else {pos--;}}}else {parenLevel++;print.preserveSingleSpace();output.push(ch);eatWhitespace();}}else if(ch===')'){output.push(ch);parenLevel--;}else if(ch===','){output.push(ch);eatWhitespace();if(selectorSeparatorNewline&&!insidePropertyValue&&parenLevel<1){print.newLine();}else {print.singleSpace();}}else if(ch===']'){output.push(ch);}else if(ch==='['){print.preserveSingleSpace();output.push(ch);}else if(ch==='='){ // no whitespace before or after
eatWhitespace();ch='=';output.push(ch);}else {print.preserveSingleSpace();output.push(ch);}}var sweetCode='';if(basebaseIndentString){sweetCode+=basebaseIndentString;}sweetCode+=output.join('').replace(/[\r\n\t ]+$/,''); // establish end_with_newline
if(end_with_newline){sweetCode+='\n';}if(eol!='\n'){sweetCode=sweetCode.replace(/[\n]/g,eol);}return sweetCode;} // https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule
css_beautify.NESTED_AT_RULE={"@page":true,"@font-face":true,"@keyframes":true, // also in CONDITIONAL_GROUP_RULE below
"@media":true,"@supports":true,"@document":true};css_beautify.CONDITIONAL_GROUP_RULE={"@media":true,"@supports":true,"@document":true}; /*global define */if(typeof define==="function"&&define.amd){ // Add support for AMD ( https://github.com/amdjs/amdjs-api/wiki/AMD#defineamd-property- )
define([],function(){return {css_beautify:css_beautify};});}else if(typeof exports!=="undefined"){ // Add support for CommonJS. Just put this file somewhere on your require.paths
// and you will be able to `var html_beautify = require("beautify").html_beautify`.
exports.css_beautify=css_beautify;}else if(typeof window!=="undefined"){ // If we're running a web page and don't have either of the above, add our one global
window.css_beautify=css_beautify;}else if(typeof global!=="undefined"){ // If we don't even have window, try global.
global.css_beautify=css_beautify;}})();}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{}],49:[function(require,module,exports){(function(global){ /*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */ /*

  The MIT License (MIT)

  Copyright (c) 2007-2013 Einar Lielmanis and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.


 Style HTML
---------------

  Written by Nochum Sossonko, (nsossonko@hotmail.com)

  Based on code initially developed by: Einar Lielmanis, <einar@jsbeautifier.org>
    http://jsbeautifier.org/

  Usage:
    style_html(html_source);

    style_html(html_source, options);

  The options are:
    indent_inner_html (default false)  — indent <head> and <body> sections,
    indent_size (default 4)          — indentation size,
    indent_char (default space)      — character to indent with,
    wrap_line_length (default 250)            -  maximum amount of characters per line (0 = disable)
    brace_style (default "collapse") - "collapse" | "expand" | "end-expand" | "none"
            put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line, or attempt to keep them where they are.
    unformatted (defaults to inline tags) - list of tags, that shouldn't be reformatted
    indent_scripts (default normal)  - "keep"|"separate"|"normal"
    preserve_newlines (default true) - whether existing line breaks before elements should be preserved
                                        Only works before elements, not inside tags or for text.
    max_preserve_newlines (default unlimited) - maximum number of line breaks to be preserved in one chunk
    indent_handlebars (default false) - format and indent {{#foo}} and {{/foo}}
    end_with_newline (false)          - end with a newline
    extra_liners (default [head,body,/html]) -List of tags that should have an extra newline before them.

    e.g.

    style_html(html_source, {
      'indent_inner_html': false,
      'indent_size': 2,
      'indent_char': ' ',
      'wrap_line_length': 78,
      'brace_style': 'expand',
      'preserve_newlines': true,
      'max_preserve_newlines': 5,
      'indent_handlebars': false,
      'extra_liners': ['/html']
    });
*/(function(){function trim(s){return s.replace(/^\s+|\s+$/g,'');}function ltrim(s){return s.replace(/^\s+/g,'');}function rtrim(s){return s.replace(/\s+$/g,'');}function style_html(html_source,options,js_beautify,css_beautify){ //Wrapper function to invoke all the necessary constructors and deal with the output.
var multi_parser,indent_inner_html,indent_size,indent_character,wrap_line_length,brace_style,unformatted,preserve_newlines,max_preserve_newlines,indent_handlebars,wrap_attributes,wrap_attributes_indent_size,end_with_newline,extra_liners,eol;options=options||{}; // backwards compatibility to 1.3.4
if((options.wrap_line_length===undefined||parseInt(options.wrap_line_length,10)===0)&&options.max_char!==undefined&&parseInt(options.max_char,10)!==0){options.wrap_line_length=options.max_char;}indent_inner_html=options.indent_inner_html===undefined?false:options.indent_inner_html;indent_size=options.indent_size===undefined?4:parseInt(options.indent_size,10);indent_character=options.indent_char===undefined?' ':options.indent_char;brace_style=options.brace_style===undefined?'collapse':options.brace_style;wrap_line_length=parseInt(options.wrap_line_length,10)===0?32786:parseInt(options.wrap_line_length||250,10);unformatted=options.unformatted||[ // https://www.w3.org/TR/html5/dom.html#phrasing-content
'a','abbr','area','audio','b','bdi','bdo','br','button','canvas','cite','code','data','datalist','del','dfn','em','embed','i','iframe','img','input','ins','kbd','keygen','label','map','mark','math','meter','noscript','object','output','progress','q','ruby','s','samp', /* 'script', */'select','small','span','strong','sub','sup','svg','template','textarea','time','u','var','video','wbr','text', // prexisting - not sure of full effect of removing, leaving in
'acronym','address','big','dt','ins','small','strike','tt','pre','h1','h2','h3','h4','h5','h6'];preserve_newlines=options.preserve_newlines===undefined?true:options.preserve_newlines;max_preserve_newlines=preserve_newlines?isNaN(parseInt(options.max_preserve_newlines,10))?32786:parseInt(options.max_preserve_newlines,10):0;indent_handlebars=options.indent_handlebars===undefined?false:options.indent_handlebars;wrap_attributes=options.wrap_attributes===undefined?'auto':options.wrap_attributes;wrap_attributes_indent_size=isNaN(parseInt(options.wrap_attributes_indent_size,10))?indent_size:parseInt(options.wrap_attributes_indent_size,10);end_with_newline=options.end_with_newline===undefined?false:options.end_with_newline;extra_liners=_typeof(options.extra_liners)=='object'&&options.extra_liners?options.extra_liners.concat():typeof options.extra_liners==='string'?options.extra_liners.split(','):'head,body,/html'.split(',');eol=options.eol?options.eol:'\n';if(options.indent_with_tabs){indent_character='\t';indent_size=1;}eol=eol.replace(/\\r/,'\r').replace(/\\n/,'\n');function Parser(){this.pos=0; //Parser position
this.token='';this.current_mode='CONTENT'; //reflects the current Parser mode: TAG/CONTENT
this.tags={ //An object to hold tags, their position, and their parent-tags, initiated with default values
parent:'parent1',parentcount:1,parent1:''};this.tag_type='';this.token_text=this.last_token=this.last_text=this.token_type='';this.newlines=0;this.indent_content=indent_inner_html;this.Utils={ //Uilities made available to the various functions
whitespace:"\n\r\t ".split(''),single_token:[ // HTLM void elements - aka self-closing tags - aka singletons
// https://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements
'area','base','br','col','embed','hr','img','input','keygen','link','menuitem','meta','param','source','track','wbr', // NOTE: Optional tags - are not understood.
// https://www.w3.org/TR/html5/syntax.html#optional-tags
// The rules for optional tags are too complex for a simple list
// Also, the content of these tags should still be indented in many cases.
// 'li' is a good exmple.
// Doctype and xml elements
'!doctype','?xml', // ?php tag
'?php', // other tags that were in this list, keeping just in case
'basefont','isindex'],extra_liners:extra_liners, //for tags that need a line of whitespace before them
in_array:function in_array(what,arr){for(var i=0;i<arr.length;i++){if(what===arr[i]){return true;}}return false;}}; // Return true if the given text is composed entirely of whitespace.
this.is_whitespace=function(text){for(var n=0;n<text.length;n++){if(!this.Utils.in_array(text.charAt(n),this.Utils.whitespace)){return false;}}return true;};this.traverse_whitespace=function(){var input_char='';input_char=this.input.charAt(this.pos);if(this.Utils.in_array(input_char,this.Utils.whitespace)){this.newlines=0;while(this.Utils.in_array(input_char,this.Utils.whitespace)){if(preserve_newlines&&input_char==='\n'&&this.newlines<=max_preserve_newlines){this.newlines+=1;}this.pos++;input_char=this.input.charAt(this.pos);}return true;}return false;}; // Append a space to the given content (string array) or, if we are
// at the wrap_line_length, append a newline/indentation.
// return true if a newline was added, false if a space was added
this.space_or_wrap=function(content){if(this.line_char_count>=this.wrap_line_length){ //insert a line when the wrap_line_length is reached
this.print_newline(false,content);this.print_indentation(content);return true;}else {this.line_char_count++;content.push(' ');return false;}};this.get_content=function(){ //function to capture regular content between tags
var input_char='',content=[],space=false; //if a space is needed
while(this.input.charAt(this.pos)!=='<'){if(this.pos>=this.input.length){return content.length?content.join(''):['','TK_EOF'];}if(this.traverse_whitespace()){this.space_or_wrap(content);continue;}if(indent_handlebars){ // Handlebars parsing is complicated.
// {{#foo}} and {{/foo}} are formatted tags.
// {{something}} should get treated as content, except:
// {{else}} specifically behaves like {{#if}} and {{/if}}
var peek3=this.input.substr(this.pos,3);if(peek3==='{{#'||peek3==='{{/'){ // These are tags and not content.
break;}else if(peek3==='{{!'){return [this.get_tag(),'TK_TAG_HANDLEBARS_COMMENT'];}else if(this.input.substr(this.pos,2)==='{{'){if(this.get_tag(true)==='{{else}}'){break;}}}input_char=this.input.charAt(this.pos);this.pos++;this.line_char_count++;content.push(input_char); //letter at-a-time (or string) inserted to an array
}return content.length?content.join(''):'';};this.get_contents_to=function(name){ //get the full content of a script or style to pass to js_beautify
if(this.pos===this.input.length){return ['','TK_EOF'];}var input_char='';var content='';var reg_match=new RegExp('</'+name+'\\s*>','igm');reg_match.lastIndex=this.pos;var reg_array=reg_match.exec(this.input);var end_script=reg_array?reg_array.index:this.input.length; //absolute end of script
if(this.pos<end_script){ //get everything in between the script tags
content=this.input.substring(this.pos,end_script);this.pos=end_script;}return content;};this.record_tag=function(tag){ //function to record a tag and its parent in this.tags Object
if(this.tags[tag+'count']){ //check for the existence of this tag type
this.tags[tag+'count']++;this.tags[tag+this.tags[tag+'count']]=this.indent_level; //and record the present indent level
}else { //otherwise initialize this tag type
this.tags[tag+'count']=1;this.tags[tag+this.tags[tag+'count']]=this.indent_level; //and record the present indent level
}this.tags[tag+this.tags[tag+'count']+'parent']=this.tags.parent; //set the parent (i.e. in the case of a div this.tags.div1parent)
this.tags.parent=tag+this.tags[tag+'count']; //and make this the current parent (i.e. in the case of a div 'div1')
};this.retrieve_tag=function(tag){ //function to retrieve the opening tag to the corresponding closer
if(this.tags[tag+'count']){ //if the openener is not in the Object we ignore it
var temp_parent=this.tags.parent; //check to see if it's a closable tag.
while(temp_parent){ //till we reach '' (the initial value);
if(tag+this.tags[tag+'count']===temp_parent){ //if this is it use it
break;}temp_parent=this.tags[temp_parent+'parent']; //otherwise keep on climbing up the DOM Tree
}if(temp_parent){ //if we caught something
this.indent_level=this.tags[tag+this.tags[tag+'count']]; //set the indent_level accordingly
this.tags.parent=this.tags[temp_parent+'parent']; //and set the current parent
}delete this.tags[tag+this.tags[tag+'count']+'parent']; //delete the closed tags parent reference...
delete this.tags[tag+this.tags[tag+'count']]; //...and the tag itself
if(this.tags[tag+'count']===1){delete this.tags[tag+'count'];}else {this.tags[tag+'count']--;}}};this.indent_to_tag=function(tag){ // Match the indentation level to the last use of this tag, but don't remove it.
if(!this.tags[tag+'count']){return;}var temp_parent=this.tags.parent;while(temp_parent){if(tag+this.tags[tag+'count']===temp_parent){break;}temp_parent=this.tags[temp_parent+'parent'];}if(temp_parent){this.indent_level=this.tags[tag+this.tags[tag+'count']];}};this.get_tag=function(peek){ //function to get a full tag and parse its type
var input_char='',content=[],comment='',space=false,first_attr=true,tag_start,tag_end,tag_start_char,orig_pos=this.pos,orig_line_char_count=this.line_char_count;peek=peek!==undefined?peek:false;do {if(this.pos>=this.input.length){if(peek){this.pos=orig_pos;this.line_char_count=orig_line_char_count;}return content.length?content.join(''):['','TK_EOF'];}input_char=this.input.charAt(this.pos);this.pos++;if(this.Utils.in_array(input_char,this.Utils.whitespace)){ //don't want to insert unnecessary space
space=true;continue;}if(input_char==="'"||input_char==='"'){input_char+=this.get_unformatted(input_char);space=true;}if(input_char==='='){ //no space before =
space=false;}if(content.length&&content[content.length-1]!=='='&&input_char!=='>'&&space){ //no space after = or before >
var wrapped=this.space_or_wrap(content);var indentAttrs=wrapped&&input_char!=='/'&&wrap_attributes!=='force';space=false;if(!first_attr&&wrap_attributes==='force'&&input_char!=='/'){this.print_newline(false,content);this.print_indentation(content);indentAttrs=true;}if(indentAttrs){ //indent attributes an auto or forced line-wrap
for(var count=0;count<wrap_attributes_indent_size;count++){content.push(indent_character);}}for(var i=0;i<content.length;i++){if(content[i]===' '){first_attr=false;break;}}}if(indent_handlebars&&tag_start_char==='<'){ // When inside an angle-bracket tag, put spaces around
// handlebars not inside of strings.
if(input_char+this.input.charAt(this.pos)==='{{'){input_char+=this.get_unformatted('}}');if(content.length&&content[content.length-1]!==' '&&content[content.length-1]!=='<'){input_char=' '+input_char;}space=true;}}if(input_char==='<'&&!tag_start_char){tag_start=this.pos-1;tag_start_char='<';}if(indent_handlebars&&!tag_start_char){if(content.length>=2&&content[content.length-1]==='{'&&content[content.length-2]==='{'){if(input_char==='#'||input_char==='/'||input_char==='!'){tag_start=this.pos-3;}else {tag_start=this.pos-2;}tag_start_char='{';}}this.line_char_count++;content.push(input_char); //inserts character at-a-time (or string)
if(content[1]&&(content[1]==='!'||content[1]==='?'||content[1]==='%')){ //if we're in a comment, do something special
// We treat all comments as literals, even more than preformatted tags
// we just look for the appropriate close tag
content=[this.get_comment(tag_start)];break;}if(indent_handlebars&&content[1]&&content[1]==='{'&&content[2]&&content[2]==='!'){ //if we're in a comment, do something special
// We treat all comments as literals, even more than preformatted tags
// we just look for the appropriate close tag
content=[this.get_comment(tag_start)];break;}if(indent_handlebars&&tag_start_char==='{'&&content.length>2&&content[content.length-2]==='}'&&content[content.length-1]==='}'){break;}}while(input_char!=='>');var tag_complete=content.join('');var tag_index;var tag_offset;if(tag_complete.indexOf(' ')!==-1){ //if there's whitespace, thats where the tag name ends
tag_index=tag_complete.indexOf(' ');}else if(tag_complete.charAt(0)==='{'){tag_index=tag_complete.indexOf('}');}else { //otherwise go with the tag ending
tag_index=tag_complete.indexOf('>');}if(tag_complete.charAt(0)==='<'||!indent_handlebars){tag_offset=1;}else {tag_offset=tag_complete.charAt(2)==='#'?3:2;}var tag_check=tag_complete.substring(tag_offset,tag_index).toLowerCase();if(tag_complete.charAt(tag_complete.length-2)==='/'||this.Utils.in_array(tag_check,this.Utils.single_token)){ //if this tag name is a single tag type (either in the list or has a closing /)
if(!peek){this.tag_type='SINGLE';}}else if(indent_handlebars&&tag_complete.charAt(0)==='{'&&tag_check==='else'){if(!peek){this.indent_to_tag('if');this.tag_type='HANDLEBARS_ELSE';this.indent_content=true;this.traverse_whitespace();}}else if(this.is_unformatted(tag_check,unformatted)){ // do not reformat the "unformatted" tags
comment=this.get_unformatted('</'+tag_check+'>',tag_complete); //...delegate to get_unformatted function
content.push(comment);tag_end=this.pos-1;this.tag_type='SINGLE';}else if(tag_check==='script'&&(tag_complete.search('type')===-1||tag_complete.search('type')>-1&&tag_complete.search(/\b(text|application)\/(x-)?(javascript|ecmascript|jscript|livescript|(ld\+)?json)/)>-1)){if(!peek){this.record_tag(tag_check);this.tag_type='SCRIPT';}}else if(tag_check==='style'&&(tag_complete.search('type')===-1||tag_complete.search('type')>-1&&tag_complete.search('text/css')>-1)){if(!peek){this.record_tag(tag_check);this.tag_type='STYLE';}}else if(tag_check.charAt(0)==='!'){ //peek for <! comment
// for comments content is already correct.
if(!peek){this.tag_type='SINGLE';this.traverse_whitespace();}}else if(!peek){if(tag_check.charAt(0)==='/'){ //this tag is a double tag so check for tag-ending
this.retrieve_tag(tag_check.substring(1)); //remove it and all ancestors
this.tag_type='END';}else { //otherwise it's a start-tag
this.record_tag(tag_check); //push it on the tag stack
if(tag_check.toLowerCase()!=='html'){this.indent_content=true;}this.tag_type='START';} // Allow preserving of newlines after a start or end tag
if(this.traverse_whitespace()){this.space_or_wrap(content);}if(this.Utils.in_array(tag_check,this.Utils.extra_liners)){ //check if this double needs an extra line
this.print_newline(false,this.output);if(this.output.length&&this.output[this.output.length-2]!=='\n'){this.print_newline(true,this.output);}}}if(peek){this.pos=orig_pos;this.line_char_count=orig_line_char_count;}return content.join(''); //returns fully formatted tag
};this.get_comment=function(start_pos){ //function to return comment content in its entirety
// this is will have very poor perf, but will work for now.
var comment='',delimiter='>',matched=false;this.pos=start_pos;var input_char=this.input.charAt(this.pos);this.pos++;while(this.pos<=this.input.length){comment+=input_char; // only need to check for the delimiter if the last chars match
if(comment.charAt(comment.length-1)===delimiter.charAt(delimiter.length-1)&&comment.indexOf(delimiter)!==-1){break;} // only need to search for custom delimiter for the first few characters
if(!matched&&comment.length<10){if(comment.indexOf('<![if')===0){ //peek for <![if conditional comment
delimiter='<![endif]>';matched=true;}else if(comment.indexOf('<![cdata[')===0){ //if it's a <[cdata[ comment...
delimiter=']]>';matched=true;}else if(comment.indexOf('<![')===0){ // some other ![ comment? ...
delimiter=']>';matched=true;}else if(comment.indexOf('<!--')===0){ // <!-- comment ...
delimiter='-->';matched=true;}else if(comment.indexOf('{{!')===0){ // {{! handlebars comment
delimiter='}}';matched=true;}else if(comment.indexOf('<?')===0){ // {{! handlebars comment
delimiter='?>';matched=true;}else if(comment.indexOf('<%')===0){ // {{! handlebars comment
delimiter='%>';matched=true;}}input_char=this.input.charAt(this.pos);this.pos++;}return comment;};function tokenMatcher(delimiter){var token='';var add=function add(str){var newToken=token+str.toLowerCase();token=newToken.length<=delimiter.length?newToken:newToken.substr(newToken.length-delimiter.length,delimiter.length);};var doesNotMatch=function doesNotMatch(){return token.indexOf(delimiter)===-1;};return {add:add,doesNotMatch:doesNotMatch};}this.get_unformatted=function(delimiter,orig_tag){ //function to return unformatted content in its entirety
if(orig_tag&&orig_tag.toLowerCase().indexOf(delimiter)!==-1){return '';}var input_char='';var content='';var space=true;var delimiterMatcher=tokenMatcher(delimiter);do {if(this.pos>=this.input.length){return content;}input_char=this.input.charAt(this.pos);this.pos++;if(this.Utils.in_array(input_char,this.Utils.whitespace)){if(!space){this.line_char_count--;continue;}if(input_char==='\n'||input_char==='\r'){content+='\n'; /*  Don't change tab indention for unformatted blocks.  If using code for html editing, this will greatly affect <pre> tags if they are specified in the 'unformatted array'
                for (var i=0; i<this.indent_level; i++) {
                  content += this.indent_string;
                }
                space = false; //...and make sure other indentation is erased
                */this.line_char_count=0;continue;}}content+=input_char;delimiterMatcher.add(input_char);this.line_char_count++;space=true;if(indent_handlebars&&input_char==='{'&&content.length&&content.charAt(content.length-2)==='{'){ // Handlebars expressions in strings should also be unformatted.
content+=this.get_unformatted('}}'); // Don't consider when stopping for delimiters.
}}while(delimiterMatcher.doesNotMatch());return content;};this.get_token=function(){ //initial handler for token-retrieval
var token;if(this.last_token==='TK_TAG_SCRIPT'||this.last_token==='TK_TAG_STYLE'){ //check if we need to format javascript
var type=this.last_token.substr(7);token=this.get_contents_to(type);if(typeof token!=='string'){return token;}return [token,'TK_'+type];}if(this.current_mode==='CONTENT'){token=this.get_content();if(typeof token!=='string'){return token;}else {return [token,'TK_CONTENT'];}}if(this.current_mode==='TAG'){token=this.get_tag();if(typeof token!=='string'){return token;}else {var tag_name_type='TK_TAG_'+this.tag_type;return [token,tag_name_type];}}};this.get_full_indent=function(level){level=this.indent_level+level||0;if(level<1){return '';}return Array(level+1).join(this.indent_string);};this.is_unformatted=function(tag_check,unformatted){ //is this an HTML5 block-level link?
if(!this.Utils.in_array(tag_check,unformatted)){return false;}if(tag_check.toLowerCase()!=='a'||!this.Utils.in_array('a',unformatted)){return true;} //at this point we have an  tag; is its first child something we want to remain
//unformatted?
var next_tag=this.get_tag(true /* peek. */); // test next_tag to see if it is just html tag (no external content)
var tag=(next_tag||"").match(/^\s*<\s*\/?([a-z]*)\s*[^>]*>\s*$/); // if next_tag comes back but is not an isolated tag, then
// let's treat the 'a' tag as having content
// and respect the unformatted option
if(!tag||this.Utils.in_array(tag,unformatted)){return true;}else {return false;}};this.printer=function(js_source,indent_character,indent_size,wrap_line_length,brace_style){ //handles input/output and some other printing functions
this.input=js_source||''; //gets the input for the Parser
// HACK: newline parsing inconsistent. This brute force normalizes the input.
this.input=this.input.replace(/\r\n|[\r\u2028\u2029]/g,'\n');this.output=[];this.indent_character=indent_character;this.indent_string='';this.indent_size=indent_size;this.brace_style=brace_style;this.indent_level=0;this.wrap_line_length=wrap_line_length;this.line_char_count=0; //count to see if wrap_line_length was exceeded
for(var i=0;i<this.indent_size;i++){this.indent_string+=this.indent_character;}this.print_newline=function(force,arr){this.line_char_count=0;if(!arr||!arr.length){return;}if(force||arr[arr.length-1]!=='\n'){ //we might want the extra line
if(arr[arr.length-1]!=='\n'){arr[arr.length-1]=rtrim(arr[arr.length-1]);}arr.push('\n');}};this.print_indentation=function(arr){for(var i=0;i<this.indent_level;i++){arr.push(this.indent_string);this.line_char_count+=this.indent_string.length;}};this.print_token=function(text){ // Avoid printing initial whitespace.
if(this.is_whitespace(text)&&!this.output.length){return;}if(text||text!==''){if(this.output.length&&this.output[this.output.length-1]==='\n'){this.print_indentation(this.output);text=ltrim(text);}}this.print_token_raw(text);};this.print_token_raw=function(text){ // If we are going to print newlines, truncate trailing
// whitespace, as the newlines will represent the space.
if(this.newlines>0){text=rtrim(text);}if(text&&text!==''){if(text.length>1&&text.charAt(text.length-1)==='\n'){ // unformatted tags can grab newlines as their last character
this.output.push(text.slice(0,-1));this.print_newline(false,this.output);}else {this.output.push(text);}}for(var n=0;n<this.newlines;n++){this.print_newline(n>0,this.output);}this.newlines=0;};this.indent=function(){this.indent_level++;};this.unindent=function(){if(this.indent_level>0){this.indent_level--;}};};return this;} /*_____________________--------------------_____________________*/multi_parser=new Parser(); //wrapping functions Parser
multi_parser.printer(html_source,indent_character,indent_size,wrap_line_length,brace_style); //initialize starting values
while(true){var t=multi_parser.get_token();multi_parser.token_text=t[0];multi_parser.token_type=t[1];if(multi_parser.token_type==='TK_EOF'){break;}switch(multi_parser.token_type){case 'TK_TAG_START':multi_parser.print_newline(false,multi_parser.output);multi_parser.print_token(multi_parser.token_text);if(multi_parser.indent_content){multi_parser.indent();multi_parser.indent_content=false;}multi_parser.current_mode='CONTENT';break;case 'TK_TAG_STYLE':case 'TK_TAG_SCRIPT':multi_parser.print_newline(false,multi_parser.output);multi_parser.print_token(multi_parser.token_text);multi_parser.current_mode='CONTENT';break;case 'TK_TAG_END': //Print new line only if the tag has no content and has child
if(multi_parser.last_token==='TK_CONTENT'&&multi_parser.last_text===''){var tag_name=multi_parser.token_text.match(/\w+/)[0];var tag_extracted_from_last_output=null;if(multi_parser.output.length){tag_extracted_from_last_output=multi_parser.output[multi_parser.output.length-1].match(/(?:<|{{#)\s*(\w+)/);}if(tag_extracted_from_last_output===null||tag_extracted_from_last_output[1]!==tag_name&&!multi_parser.Utils.in_array(tag_extracted_from_last_output[1],unformatted)){multi_parser.print_newline(false,multi_parser.output);}}multi_parser.print_token(multi_parser.token_text);multi_parser.current_mode='CONTENT';break;case 'TK_TAG_SINGLE': // Don't add a newline before elements that should remain unformatted.
var tag_check=multi_parser.token_text.match(/^\s*<([a-z-]+)/i);if(!tag_check||!multi_parser.Utils.in_array(tag_check[1],unformatted)){multi_parser.print_newline(false,multi_parser.output);}multi_parser.print_token(multi_parser.token_text);multi_parser.current_mode='CONTENT';break;case 'TK_TAG_HANDLEBARS_ELSE': // Don't add a newline if opening {{#if}} tag is on the current line
var foundIfOnCurrentLine=false;for(var lastCheckedOutput=multi_parser.output.length-1;lastCheckedOutput>=0;lastCheckedOutput--){if(multi_parser.output[lastCheckedOutput]==='\n'){break;}else {if(multi_parser.output[lastCheckedOutput].match(/{{#if/)){foundIfOnCurrentLine=true;break;}}}if(!foundIfOnCurrentLine){multi_parser.print_newline(false,multi_parser.output);}multi_parser.print_token(multi_parser.token_text);if(multi_parser.indent_content){multi_parser.indent();multi_parser.indent_content=false;}multi_parser.current_mode='CONTENT';break;case 'TK_TAG_HANDLEBARS_COMMENT':multi_parser.print_token(multi_parser.token_text);multi_parser.current_mode='TAG';break;case 'TK_CONTENT':multi_parser.print_token(multi_parser.token_text);multi_parser.current_mode='TAG';break;case 'TK_STYLE':case 'TK_SCRIPT':if(multi_parser.token_text!==''){multi_parser.print_newline(false,multi_parser.output);var text=multi_parser.token_text,_beautifier,script_indent_level=1;if(multi_parser.token_type==='TK_SCRIPT'){_beautifier=typeof js_beautify==='function'&&js_beautify;}else if(multi_parser.token_type==='TK_STYLE'){_beautifier=typeof css_beautify==='function'&&css_beautify;}if(options.indent_scripts==="keep"){script_indent_level=0;}else if(options.indent_scripts==="separate"){script_indent_level=-multi_parser.indent_level;}var indentation=multi_parser.get_full_indent(script_indent_level);if(_beautifier){ // call the Beautifier if avaliable
var Child_options=function Child_options(){this.eol='\n';};Child_options.prototype=options;var child_options=new Child_options();text=_beautifier(text.replace(/^\s*/,indentation),child_options);}else { // simply indent the string otherwise
var white=text.match(/^\s*/)[0];var _level=white.match(/[^\n\r]*$/)[0].split(multi_parser.indent_string).length-1;var reindent=multi_parser.get_full_indent(script_indent_level-_level);text=text.replace(/^\s*/,indentation).replace(/\r\n|\r|\n/g,'\n'+reindent).replace(/\s+$/,'');}if(text){multi_parser.print_token_raw(text);multi_parser.print_newline(true,multi_parser.output);}}multi_parser.current_mode='TAG';break;default: // We should not be getting here but we don't want to drop input on the floor
// Just output the text and move on
if(multi_parser.token_text!==''){multi_parser.print_token(multi_parser.token_text);}break;}multi_parser.last_token=multi_parser.token_type;multi_parser.last_text=multi_parser.token_text;}var sweet_code=multi_parser.output.join('').replace(/[\r\n\t ]+$/,''); // establish end_with_newline
if(end_with_newline){sweet_code+='\n';}if(eol!='\n'){sweet_code=sweet_code.replace(/[\n]/g,eol);}return sweet_code;}if(typeof define==="function"&&define.amd){ // Add support for AMD ( https://github.com/amdjs/amdjs-api/wiki/AMD#defineamd-property- )
define(["require","./beautify","./beautify-css"],function(requireamd){var js_beautify=requireamd("./beautify");var css_beautify=requireamd("./beautify-css");return {html_beautify:function html_beautify(html_source,options){return style_html(html_source,options,js_beautify.js_beautify,css_beautify.css_beautify);}};});}else if(typeof exports!=="undefined"){ // Add support for CommonJS. Just put this file somewhere on your require.paths
// and you will be able to `var html_beautify = require("beautify").html_beautify`.
var js_beautify=require('./beautify.js');var css_beautify=require('./beautify-css.js');exports.html_beautify=function(html_source,options){return style_html(html_source,options,js_beautify.js_beautify,css_beautify.css_beautify);};}else if(typeof window!=="undefined"){ // If we're running a web page and don't have either of the above, add our one global
window.html_beautify=function(html_source,options){return style_html(html_source,options,window.js_beautify,window.css_beautify);};}else if(typeof global!=="undefined"){ // If we don't even have window, try global.
global.html_beautify=function(html_source,options){return style_html(html_source,options,global.js_beautify,global.css_beautify);};}})();}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{"./beautify-css.js":48,"./beautify.js":50}],50:[function(require,module,exports){(function(global){ /*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */ /*

  The MIT License (MIT)

  Copyright (c) 2007-2013 Einar Lielmanis and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

 JS Beautifier
---------------


  Written by Einar Lielmanis, <einar@jsbeautifier.org>
      http://jsbeautifier.org/

  Originally converted to javascript by Vital, <vital76@gmail.com>
  "End braces on own line" added by Chris J. Shull, <chrisjshull@gmail.com>
  Parsing improvements for brace-less statements by Liam Newman <bitwiseman@gmail.com>


  Usage:
    js_beautify(js_source_text);
    js_beautify(js_source_text, options);

  The options are:
    indent_size (default 4)          - indentation size,
    indent_char (default space)      - character to indent with,
    preserve_newlines (default true) - whether existing line breaks should be preserved,
    max_preserve_newlines (default unlimited) - maximum number of line breaks to be preserved in one chunk,

    jslint_happy (default false) - if true, then jslint-stricter mode is enforced.

            jslint_happy        !jslint_happy
            ---------------------------------
            function ()         function()

            switch () {         switch() {
            case 1:               case 1:
              break;                break;
            }                   }

    space_after_anon_function (default false) - should the space before an anonymous function's parens be added, "function()" vs "function ()",
          NOTE: This option is overriden by jslint_happy (i.e. if jslint_happy is true, space_after_anon_function is true by design)

    brace_style (default "collapse") - "collapse-preserve-inline" | "collapse" | "expand" | "end-expand" | "none"
            put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line, or attempt to keep them where they are.

    space_before_conditional (default true) - should the space before conditional statement be added, "if(true)" vs "if (true)",

    unescape_strings (default false) - should printable characters in strings encoded in \xNN notation be unescaped, "example" vs "\x65\x78\x61\x6d\x70\x6c\x65"

    wrap_line_length (default unlimited) - lines should wrap at next opportunity after this number of characters.
          NOTE: This is not a hard limit. Lines will continue until a point where a newline would
                be preserved if it were present.

    end_with_newline (default false)  - end output with a newline


    e.g

    js_beautify(js_source_text, {
      'indent_size': 1,
      'indent_char': '\t'
    });

*/(function(){var acorn={};(function(exports){ // This section of code is taken from acorn.
//
// Acorn was written by Marijn Haverbeke and released under an MIT
// license. The Unicode regexps (for identifiers and whitespace) were
// taken from [Esprima](http://esprima.org) by Ariya Hidayat.
//
// Git repositories for Acorn are available at
//
//     http://marijnhaverbeke.nl/git/acorn
//     https://github.com/marijnh/acorn.git
// ## Character categories
// Big ugly regular expressions that match characters in the
// whitespace, identifier, and identifier-start categories. These
// are only applied when a character is found to actually have a
// code point above 128.
var nonASCIIwhitespace=/[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/;var nonASCIIidentifierStartChars="ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԧԱ-Ֆՙա-ևא-תװ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࢠࢢ-ࢬऄ-हऽॐक़-ॡॱ-ॷॹ-ॿঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-ళవ-హఽౘౙౠౡಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠೡೱೲഅ-ഌഎ-ഐഒ-ഺഽൎൠൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄງຈຊຍດ-ທນ-ຟມ-ຣລວສຫອ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏼᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛰᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡷᢀ-ᢨᢪᢰ-ᣵᤀ-ᤜᥐ-ᥭᥰ-ᥴᦀ-ᦫᧁ-ᧇᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭋᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᳩ-ᳬᳮ-ᳱᳵᳶᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞⸯ々-〇〡-〩〱-〵〸-〼ぁ-ゖゝ-ゟァ-ヺー-ヿㄅ-ㄭㄱ-ㆎㆠ-ㆺㇰ-ㇿ㐀-䶵一-鿌ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚗꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꪀ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꯀ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ";var nonASCIIidentifierChars="̀-ͯ҃-֑҇-ׇֽֿׁׂׅׄؐ-ؚؠ-ىٲ-ۓۧ-ۨۻ-ۼܰ-݊ࠀ-ࠔࠛ-ࠣࠥ-ࠧࠩ-࠭ࡀ-ࡗࣤ-ࣾऀ-ःऺ-़ा-ॏ॑-ॗॢ-ॣ०-९ঁ-ঃ়া-ৄেৈৗয়-ৠਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢ-ૣ૦-૯ଁ-ଃ଼ା-ୄେୈୋ-୍ୖୗୟ-ୠ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఁ-ఃె-ైొ-్ౕౖౢ-ౣ౦-౯ಂಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢ-ೣ೦-೯ംഃെ-ൈൗൢ-ൣ൦-൯ංඃ්ා-ුූෘ-ෟෲෳิ-ฺเ-ๅ๐-๙ິ-ູ່-ໍ໐-໙༘༙༠-༩༹༵༷ཁ-ཇཱ-྄྆-྇ྍ-ྗྙ-ྼ࿆က-ဩ၀-၉ၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟ᜎ-ᜐᜠ-ᜰᝀ-ᝐᝲᝳក-ឲ៝០-៩᠋-᠍᠐-᠙ᤠ-ᤫᤰ-᤻ᥑ-ᥭᦰ-ᧀᧈ-ᧉ᧐-᧙ᨀ-ᨕᨠ-ᩓ᩠-᩿᩼-᪉᪐-᪙ᭆ-ᭋ᭐-᭙᭫-᭳᮰-᮹᯦-᯳ᰀ-ᰢ᱀-᱉ᱛ-ᱽ᳐-᳒ᴀ-ᶾḁ-ἕ‌‍‿⁀⁔⃐-⃥⃜⃡-⃰ⶁ-ⶖⷠ-ⷿ〡-〨゙゚Ꙁ-ꙭꙴ-꙽ꚟ꛰-꛱ꟸ-ꠀ꠆ꠋꠣ-ꠧꢀ-ꢁꢴ-꣄꣐-꣙ꣳ-ꣷ꤀-꤉ꤦ-꤭ꤰ-ꥅꦀ-ꦃ꦳-꧀ꨀ-ꨧꩀ-ꩁꩌ-ꩍ꩐-꩙ꩻꫠ-ꫩꫲ-ꫳꯀ-ꯡ꯬꯭꯰-꯹ﬠ-ﬨ︀-️︠-︦︳︴﹍-﹏０-９＿";var nonASCIIidentifierStart=new RegExp("["+nonASCIIidentifierStartChars+"]");var nonASCIIidentifier=new RegExp("["+nonASCIIidentifierStartChars+nonASCIIidentifierChars+"]"); // Whether a single character denotes a newline.
var newline=exports.newline=/[\n\r\u2028\u2029]/; // Matches a whole line break (where CRLF is considered a single
// line break). Used to count lines.
// in javascript, these two differ
// in python they are the same, different methods are called on them
var lineBreak=exports.lineBreak=/\r\n|[\n\r\u2028\u2029]/;var allLineBreaks=exports.allLineBreaks=new RegExp(lineBreak.source,'g'); // Test whether a given character code starts an identifier.
var isIdentifierStart=exports.isIdentifierStart=function(code){ // permit $ (36) and @ (64). @ is used in ES7 decorators.
if(code<65)return code===36||code===64; // 65 through 91 are uppercase letters.
if(code<91)return true; // permit _ (95).
if(code<97)return code===95; // 97 through 123 are lowercase letters.
if(code<123)return true;return code>=0xaa&&nonASCIIidentifierStart.test(String.fromCharCode(code));}; // Test whether a given character is part of an identifier.
var isIdentifierChar=exports.isIdentifierChar=function(code){if(code<48)return code===36;if(code<58)return true;if(code<65)return false;if(code<91)return true;if(code<97)return code===95;if(code<123)return true;return code>=0xaa&&nonASCIIidentifier.test(String.fromCharCode(code));};})(acorn);function in_array(what,arr){for(var i=0;i<arr.length;i+=1){if(arr[i]===what){return true;}}return false;}function trim(s){return s.replace(/^\s+|\s+$/g,'');}function ltrim(s){return s.replace(/^\s+/g,'');}function rtrim(s){return s.replace(/\s+$/g,'');}function js_beautify(js_source_text,options){"use strict";var beautifier=new Beautifier(js_source_text,options);return beautifier.beautify();}var MODE={BlockStatement:'BlockStatement', // 'BLOCK'
Statement:'Statement', // 'STATEMENT'
ObjectLiteral:'ObjectLiteral', // 'OBJECT',
ArrayLiteral:'ArrayLiteral', //'[EXPRESSION]',
ForInitializer:'ForInitializer', //'(FOR-EXPRESSION)',
Conditional:'Conditional', //'(COND-EXPRESSION)',
Expression:'Expression' //'(EXPRESSION)'
};function Beautifier(js_source_text,options){"use strict";var output;var tokens=[],token_pos;var Tokenizer;var current_token;var last_type,last_last_text,indent_string;var flags,previous_flags,flag_store;var prefix;var handlers,opt;var baseIndentString='';handlers={'TK_START_EXPR':handle_start_expr,'TK_END_EXPR':handle_end_expr,'TK_START_BLOCK':handle_start_block,'TK_END_BLOCK':handle_end_block,'TK_WORD':handle_word,'TK_RESERVED':handle_word,'TK_SEMICOLON':handle_semicolon,'TK_STRING':handle_string,'TK_EQUALS':handle_equals,'TK_OPERATOR':handle_operator,'TK_COMMA':handle_comma,'TK_BLOCK_COMMENT':handle_block_comment,'TK_COMMENT':handle_comment,'TK_DOT':handle_dot,'TK_UNKNOWN':handle_unknown,'TK_EOF':handle_eof};function create_flags(flags_base,mode){var next_indent_level=0;if(flags_base){next_indent_level=flags_base.indentation_level;if(!output.just_added_newline()&&flags_base.line_indent_level>next_indent_level){next_indent_level=flags_base.line_indent_level;}}var next_flags={mode:mode,parent:flags_base,last_text:flags_base?flags_base.last_text:'', // last token text
last_word:flags_base?flags_base.last_word:'', // last 'TK_WORD' passed
declaration_statement:false,declaration_assignment:false,multiline_frame:false,inline_frame:false,if_block:false,else_block:false,do_block:false,do_while:false,import_block:false,in_case_statement:false, // switch(..){ INSIDE HERE }
in_case:false, // we're on the exact line with "case 0:"
case_body:false, // the indented case-action block
indentation_level:next_indent_level,line_indent_level:flags_base?flags_base.line_indent_level:next_indent_level,start_line_index:output.get_line_number(),ternary_depth:0};return next_flags;} // Some interpreters have unexpected results with foo = baz || bar;
options=options?options:{};opt={}; // compatibility
if(options.braces_on_own_line!==undefined){ //graceful handling of deprecated option
opt.brace_style=options.braces_on_own_line?"expand":"collapse";}opt.brace_style=options.brace_style?options.brace_style:opt.brace_style?opt.brace_style:"collapse"; // graceful handling of deprecated option
if(opt.brace_style==="expand-strict"){opt.brace_style="expand";}opt.indent_size=options.indent_size?parseInt(options.indent_size,10):4;opt.indent_char=options.indent_char?options.indent_char:' ';opt.eol=options.eol?options.eol:'auto';opt.preserve_newlines=options.preserve_newlines===undefined?true:options.preserve_newlines;opt.break_chained_methods=options.break_chained_methods===undefined?false:options.break_chained_methods;opt.max_preserve_newlines=options.max_preserve_newlines===undefined?0:parseInt(options.max_preserve_newlines,10);opt.space_in_paren=options.space_in_paren===undefined?false:options.space_in_paren;opt.space_in_empty_paren=options.space_in_empty_paren===undefined?false:options.space_in_empty_paren;opt.jslint_happy=options.jslint_happy===undefined?false:options.jslint_happy;opt.space_after_anon_function=options.space_after_anon_function===undefined?false:options.space_after_anon_function;opt.keep_array_indentation=options.keep_array_indentation===undefined?false:options.keep_array_indentation;opt.space_before_conditional=options.space_before_conditional===undefined?true:options.space_before_conditional;opt.unescape_strings=options.unescape_strings===undefined?false:options.unescape_strings;opt.wrap_line_length=options.wrap_line_length===undefined?0:parseInt(options.wrap_line_length,10);opt.e4x=options.e4x===undefined?false:options.e4x;opt.end_with_newline=options.end_with_newline===undefined?false:options.end_with_newline;opt.comma_first=options.comma_first===undefined?false:options.comma_first; // For testing of beautify ignore:start directive
opt.test_output_raw=options.test_output_raw===undefined?false:options.test_output_raw; // force opt.space_after_anon_function to true if opt.jslint_happy
if(opt.jslint_happy){opt.space_after_anon_function=true;}if(options.indent_with_tabs){opt.indent_char='\t';opt.indent_size=1;}if(opt.eol==='auto'){opt.eol='\n';if(js_source_text&&acorn.lineBreak.test(js_source_text||'')){opt.eol=js_source_text.match(acorn.lineBreak)[0];}}opt.eol=opt.eol.replace(/\\r/,'\r').replace(/\\n/,'\n'); //----------------------------------
indent_string='';while(opt.indent_size>0){indent_string+=opt.indent_char;opt.indent_size-=1;}var preindent_index=0;if(js_source_text&&js_source_text.length){while(js_source_text.charAt(preindent_index)===' '||js_source_text.charAt(preindent_index)==='\t'){baseIndentString+=js_source_text.charAt(preindent_index);preindent_index+=1;}js_source_text=js_source_text.substring(preindent_index);}last_type='TK_START_BLOCK'; // last token type
last_last_text=''; // pre-last token text
output=new Output(indent_string,baseIndentString); // If testing the ignore directive, start with output disable set to true
output.raw=opt.test_output_raw; // Stack of parsing/formatting states, including MODE.
// We tokenize, parse, and output in an almost purely a forward-only stream of token input
// and formatted output.  This makes the beautifier less accurate than full parsers
// but also far more tolerant of syntax errors.
//
// For example, the default mode is MODE.BlockStatement. If we see a '{' we push a new frame of type
// MODE.BlockStatement on the the stack, even though it could be object literal.  If we later
// encounter a ":", we'll switch to to MODE.ObjectLiteral.  If we then see a ";",
// most full parsers would die, but the beautifier gracefully falls back to
// MODE.BlockStatement and continues on.
flag_store=[];set_mode(MODE.BlockStatement);this.beautify=function(){ /*jshint onevar:true */var local_token,sweet_code;Tokenizer=new tokenizer(js_source_text,opt,indent_string);tokens=Tokenizer.tokenize();token_pos=0;while(local_token=get_token()){for(var i=0;i<local_token.comments_before.length;i++){ // The cleanest handling of inline comments is to treat them as though they aren't there.
// Just continue formatting and the behavior should be logical.
// Also ignore unknown tokens.  Again, this should result in better behavior.
handle_token(local_token.comments_before[i]);}handle_token(local_token);last_last_text=flags.last_text;last_type=local_token.type;flags.last_text=local_token.text;token_pos+=1;}sweet_code=output.get_code();if(opt.end_with_newline){sweet_code+='\n';}if(opt.eol!='\n'){sweet_code=sweet_code.replace(/[\n]/g,opt.eol);}return sweet_code;};function handle_token(local_token){var newlines=local_token.newlines;var keep_whitespace=opt.keep_array_indentation&&is_array(flags.mode);if(keep_whitespace){for(i=0;i<newlines;i+=1){print_newline(i>0);}}else {if(opt.max_preserve_newlines&&newlines>opt.max_preserve_newlines){newlines=opt.max_preserve_newlines;}if(opt.preserve_newlines){if(local_token.newlines>1){print_newline();for(var i=1;i<newlines;i+=1){print_newline(true);}}}}current_token=local_token;handlers[current_token.type]();} // we could use just string.split, but
// IE doesn't like returning empty strings
function split_linebreaks(s){ //return s.split(/\x0d\x0a|\x0a/);
s=s.replace(acorn.allLineBreaks,'\n');var out=[],idx=s.indexOf("\n");while(idx!==-1){out.push(s.substring(0,idx));s=s.substring(idx+1);idx=s.indexOf("\n");}if(s.length){out.push(s);}return out;}var newline_restricted_tokens=['break','contiue','return','throw'];function allow_wrap_or_preserved_newline(force_linewrap){force_linewrap=force_linewrap===undefined?false:force_linewrap; // Never wrap the first token on a line
if(output.just_added_newline()){return;}if(opt.preserve_newlines&&current_token.wanted_newline||force_linewrap){print_newline(false,true);}else if(opt.wrap_line_length){if(last_type==='TK_RESERVED'&&in_array(flags.last_text,newline_restricted_tokens)){ // These tokens should never have a newline inserted
// between them and the following expression.
return;}var proposed_line_length=output.current_line.get_character_count()+current_token.text.length+(output.space_before_token?1:0);if(proposed_line_length>=opt.wrap_line_length){print_newline(false,true);}}}function print_newline(force_newline,preserve_statement_flags){if(!preserve_statement_flags){if(flags.last_text!==';'&&flags.last_text!==','&&flags.last_text!=='='&&last_type!=='TK_OPERATOR'){while(flags.mode===MODE.Statement&&!flags.if_block&&!flags.do_block){restore_mode();}}}if(output.add_new_line(force_newline)){flags.multiline_frame=true;}}function print_token_line_indentation(){if(output.just_added_newline()){if(opt.keep_array_indentation&&is_array(flags.mode)&&current_token.wanted_newline){output.current_line.push(current_token.whitespace_before);output.space_before_token=false;}else if(output.set_indent(flags.indentation_level)){flags.line_indent_level=flags.indentation_level;}}}function print_token(printable_token){if(output.raw){output.add_raw_token(current_token);return;}if(opt.comma_first&&last_type==='TK_COMMA'&&output.just_added_newline()){if(output.previous_line.last()===','){var popped=output.previous_line.pop(); // if the comma was already at the start of the line,
// pull back onto that line and reprint the indentation
if(output.previous_line.is_empty()){output.previous_line.push(popped);output.trim(true);output.current_line.pop();output.trim();} // add the comma in front of the next token
print_token_line_indentation();output.add_token(',');output.space_before_token=true;}}printable_token=printable_token||current_token.text;print_token_line_indentation();output.add_token(printable_token);}function indent(){flags.indentation_level+=1;}function deindent(){if(flags.indentation_level>0&&(!flags.parent||flags.indentation_level>flags.parent.indentation_level))flags.indentation_level-=1;}function set_mode(mode){if(flags){flag_store.push(flags);previous_flags=flags;}else {previous_flags=create_flags(null,mode);}flags=create_flags(previous_flags,mode);}function is_array(mode){return mode===MODE.ArrayLiteral;}function is_expression(mode){return in_array(mode,[MODE.Expression,MODE.ForInitializer,MODE.Conditional]);}function restore_mode(){if(flag_store.length>0){previous_flags=flags;flags=flag_store.pop();if(previous_flags.mode===MODE.Statement){output.remove_redundant_indentation(previous_flags);}}}function start_of_object_property(){return flags.parent.mode===MODE.ObjectLiteral&&flags.mode===MODE.Statement&&(flags.last_text===':'&&flags.ternary_depth===0||last_type==='TK_RESERVED'&&in_array(flags.last_text,['get','set']));}function start_of_statement(){if(last_type==='TK_RESERVED'&&in_array(flags.last_text,['var','let','const'])&&current_token.type==='TK_WORD'||last_type==='TK_RESERVED'&&flags.last_text==='do'||last_type==='TK_RESERVED'&&in_array(flags.last_text,['return','throw'])&&!current_token.wanted_newline||last_type==='TK_RESERVED'&&flags.last_text==='else'&&!(current_token.type==='TK_RESERVED'&&current_token.text==='if')||last_type==='TK_END_EXPR'&&(previous_flags.mode===MODE.ForInitializer||previous_flags.mode===MODE.Conditional)||last_type==='TK_WORD'&&flags.mode===MODE.BlockStatement&&!flags.in_case&&!(current_token.text==='--'||current_token.text==='++')&&last_last_text!=='function'&&current_token.type!=='TK_WORD'&&current_token.type!=='TK_RESERVED'||flags.mode===MODE.ObjectLiteral&&(flags.last_text===':'&&flags.ternary_depth===0||last_type==='TK_RESERVED'&&in_array(flags.last_text,['get','set']))){set_mode(MODE.Statement);indent();if(last_type==='TK_RESERVED'&&in_array(flags.last_text,['var','let','const'])&&current_token.type==='TK_WORD'){flags.declaration_statement=true;} // Issue #276:
// If starting a new statement with [if, for, while, do], push to a new line.
// if (a) if (b) if(c) d(); else e(); else f();
if(!start_of_object_property()){allow_wrap_or_preserved_newline(current_token.type==='TK_RESERVED'&&in_array(current_token.text,['do','for','if','while']));}return true;}return false;}function all_lines_start_with(lines,c){for(var i=0;i<lines.length;i++){var line=trim(lines[i]);if(line.charAt(0)!==c){return false;}}return true;}function each_line_matches_indent(lines,indent){var i=0,len=lines.length,line;for(;i<len;i++){line=lines[i]; // allow empty lines to pass through
if(line&&line.indexOf(indent)!==0){return false;}}return true;}function is_special_word(word){return in_array(word,['case','return','do','if','throw','else']);}function get_token(offset){var index=token_pos+(offset||0);return index<0||index>=tokens.length?null:tokens[index];}function handle_start_expr(){if(start_of_statement()){ // The conditional starts the statement if appropriate.
}var next_mode=MODE.Expression;if(current_token.text==='['){if(last_type==='TK_WORD'||flags.last_text===')'){ // this is array index specifier, break immediately
// a[x], fn()[x]
if(last_type==='TK_RESERVED'&&in_array(flags.last_text,Tokenizer.line_starters)){output.space_before_token=true;}set_mode(next_mode);print_token();indent();if(opt.space_in_paren){output.space_before_token=true;}return;}next_mode=MODE.ArrayLiteral;if(is_array(flags.mode)){if(flags.last_text==='['||flags.last_text===','&&(last_last_text===']'||last_last_text==='}')){ // ], [ goes to new line
// }, [ goes to new line
if(!opt.keep_array_indentation){print_newline();}}}}else {if(last_type==='TK_RESERVED'&&flags.last_text==='for'){next_mode=MODE.ForInitializer;}else if(last_type==='TK_RESERVED'&&in_array(flags.last_text,['if','while'])){next_mode=MODE.Conditional;}else { // next_mode = MODE.Expression;
}}if(flags.last_text===';'||last_type==='TK_START_BLOCK'){print_newline();}else if(last_type==='TK_END_EXPR'||last_type==='TK_START_EXPR'||last_type==='TK_END_BLOCK'||flags.last_text==='.'){ // TODO: Consider whether forcing this is required.  Review failing tests when removed.
allow_wrap_or_preserved_newline(current_token.wanted_newline); // do nothing on (( and )( and ][ and ]( and .(
}else if(!(last_type==='TK_RESERVED'&&current_token.text==='(')&&last_type!=='TK_WORD'&&last_type!=='TK_OPERATOR'){output.space_before_token=true;}else if(last_type==='TK_RESERVED'&&(flags.last_word==='function'||flags.last_word==='typeof')||flags.last_text==='*'&&last_last_text==='function'){ // function() vs function ()
if(opt.space_after_anon_function){output.space_before_token=true;}}else if(last_type==='TK_RESERVED'&&(in_array(flags.last_text,Tokenizer.line_starters)||flags.last_text==='catch')){if(opt.space_before_conditional){output.space_before_token=true;}} // Should be a space between await and an IIFE
if(current_token.text==='('&&last_type==='TK_RESERVED'&&flags.last_word==='await'){output.space_before_token=true;} // Support of this kind of newline preservation.
// a = (b &&
//     (c || d));
if(current_token.text==='('){if(last_type==='TK_EQUALS'||last_type==='TK_OPERATOR'){if(!start_of_object_property()){allow_wrap_or_preserved_newline();}}} // Support preserving wrapped arrow function expressions
// a.b('c',
//     () => d.e
// )
if(current_token.text==='('&&last_type!=='TK_WORD'&&last_type!=='TK_RESERVED'){allow_wrap_or_preserved_newline();}set_mode(next_mode);print_token();if(opt.space_in_paren){output.space_before_token=true;} // In all cases, if we newline while inside an expression it should be indented.
indent();}function handle_end_expr(){ // statements inside expressions are not valid syntax, but...
// statements must all be closed when their container closes
while(flags.mode===MODE.Statement){restore_mode();}if(flags.multiline_frame){allow_wrap_or_preserved_newline(current_token.text===']'&&is_array(flags.mode)&&!opt.keep_array_indentation);}if(opt.space_in_paren){if(last_type==='TK_START_EXPR'&&!opt.space_in_empty_paren){ // () [] no inner space in empty parens like these, ever, ref #320
output.trim();output.space_before_token=false;}else {output.space_before_token=true;}}if(current_token.text===']'&&opt.keep_array_indentation){print_token();restore_mode();}else {restore_mode();print_token();}output.remove_redundant_indentation(previous_flags); // do {} while () // no statement required after
if(flags.do_while&&previous_flags.mode===MODE.Conditional){previous_flags.mode=MODE.Expression;flags.do_block=false;flags.do_while=false;}}function handle_start_block(){ // Check if this is should be treated as a ObjectLiteral
var next_token=get_token(1);var second_token=get_token(2);if(second_token&&(in_array(second_token.text,[':',','])&&in_array(next_token.type,['TK_STRING','TK_WORD','TK_RESERVED'])||in_array(next_token.text,['get','set'])&&in_array(second_token.type,['TK_WORD','TK_RESERVED']))){ // We don't support TypeScript,but we didn't break it for a very long time.
// We'll try to keep not breaking it.
if(!in_array(last_last_text,['class','interface'])){set_mode(MODE.ObjectLiteral);}else {set_mode(MODE.BlockStatement);}}else if(last_type==='TK_OPERATOR'&&flags.last_text==='=>'){ // arrow function: (param1, paramN) => { statements }
set_mode(MODE.BlockStatement);}else if(in_array(last_type,['TK_EQUALS','TK_START_EXPR','TK_COMMA','TK_OPERATOR'])||last_type==='TK_RESERVED'&&in_array(flags.last_text,['return','throw','import'])){ // Detecting shorthand function syntax is difficult by scanning forward,
//     so check the surrounding context.
// If the block is being returned, imported, passed as arg,
//     assigned with = or assigned in a nested object, treat as an ObjectLiteral.
set_mode(MODE.ObjectLiteral);}else {set_mode(MODE.BlockStatement);}var empty_braces=!next_token.comments_before.length&&next_token.text==='}';var empty_anonymous_function=empty_braces&&flags.last_word==='function'&&last_type==='TK_END_EXPR';if(opt.brace_style==="expand"||opt.brace_style==="none"&&current_token.wanted_newline){if(last_type!=='TK_OPERATOR'&&(empty_anonymous_function||last_type==='TK_EQUALS'||last_type==='TK_RESERVED'&&is_special_word(flags.last_text)&&flags.last_text!=='else')){output.space_before_token=true;}else {print_newline(false,true);}}else { // collapse
if(opt.brace_style==='collapse-preserve-inline'){ // search forward for a newline wanted inside this block
var index=0;var check_token=null;flags.inline_frame=true;do {index+=1;check_token=get_token(index);if(check_token.wanted_newline){flags.inline_frame=false;break;}}while(check_token.type!=='TK_EOF'&&!(check_token.type==='TK_END_BLOCK'&&check_token.opened===current_token));}if(is_array(previous_flags.mode)&&(last_type==='TK_START_EXPR'||last_type==='TK_COMMA')){ // if we're preserving inline,
// allow newline between comma and next brace.
if(flags.inline_frame){allow_wrap_or_preserved_newline();flags.inline_frame=true;previous_flags.multiline_frame=previous_flags.multiline_frame||flags.multiline_frame;flags.multiline_frame=false;}else if(last_type==='TK_COMMA'){output.space_before_token=true;}}else if(last_type!=='TK_OPERATOR'&&last_type!=='TK_START_EXPR'){if(last_type==='TK_START_BLOCK'){print_newline();}else {output.space_before_token=true;}}}print_token();indent();}function handle_end_block(){ // statements must all be closed when their container closes
while(flags.mode===MODE.Statement){restore_mode();}var empty_braces=last_type==='TK_START_BLOCK';if(opt.brace_style==="expand"){if(!empty_braces){print_newline();}}else { // skip {}
if(!empty_braces){if(flags.inline_frame){output.space_before_token=true;}else if(is_array(flags.mode)&&opt.keep_array_indentation){ // we REALLY need a newline here, but newliner would skip that
opt.keep_array_indentation=false;print_newline();opt.keep_array_indentation=true;}else {print_newline();}}}restore_mode();print_token();}function handle_word(){if(current_token.type==='TK_RESERVED'){if(in_array(current_token.text,['set','get'])&&flags.mode!==MODE.ObjectLiteral){current_token.type='TK_WORD';}else if(in_array(current_token.text,['as','from'])&&!flags.import_block){current_token.type='TK_WORD';}else if(flags.mode===MODE.ObjectLiteral){var next_token=get_token(1);if(next_token.text==':'){current_token.type='TK_WORD';}}}if(start_of_statement()){ // The conditional starts the statement if appropriate.
}else if(current_token.wanted_newline&&!is_expression(flags.mode)&&(last_type!=='TK_OPERATOR'||flags.last_text==='--'||flags.last_text==='++')&&last_type!=='TK_EQUALS'&&(opt.preserve_newlines||!(last_type==='TK_RESERVED'&&in_array(flags.last_text,['var','let','const','set','get'])))){print_newline();}if(flags.do_block&&!flags.do_while){if(current_token.type==='TK_RESERVED'&&current_token.text==='while'){ // do {} ## while ()
output.space_before_token=true;print_token();output.space_before_token=true;flags.do_while=true;return;}else { // do {} should always have while as the next word.
// if we don't see the expected while, recover
print_newline();flags.do_block=false;}} // if may be followed by else, or not
// Bare/inline ifs are tricky
// Need to unwind the modes correctly: if (a) if (b) c(); else d(); else e();
if(flags.if_block){if(!flags.else_block&&current_token.type==='TK_RESERVED'&&current_token.text==='else'){flags.else_block=true;}else {while(flags.mode===MODE.Statement){restore_mode();}flags.if_block=false;flags.else_block=false;}}if(current_token.type==='TK_RESERVED'&&(current_token.text==='case'||current_token.text==='default'&&flags.in_case_statement)){print_newline();if(flags.case_body||opt.jslint_happy){ // switch cases following one another
deindent();flags.case_body=false;}print_token();flags.in_case=true;flags.in_case_statement=true;return;}if(current_token.type==='TK_RESERVED'&&current_token.text==='function'){if(in_array(flags.last_text,['}',';'])||output.just_added_newline()&&!in_array(flags.last_text,['[','{',':','=',','])){ // make sure there is a nice clean space of at least one blank line
// before a new function definition
if(!output.just_added_blankline()&&!current_token.comments_before.length){print_newline();print_newline(true);}}if(last_type==='TK_RESERVED'||last_type==='TK_WORD'){if(last_type==='TK_RESERVED'&&in_array(flags.last_text,['get','set','new','return','export','async'])){output.space_before_token=true;}else if(last_type==='TK_RESERVED'&&flags.last_text==='default'&&last_last_text==='export'){output.space_before_token=true;}else {print_newline();}}else if(last_type==='TK_OPERATOR'||flags.last_text==='='){ // foo = function
output.space_before_token=true;}else if(!flags.multiline_frame&&(is_expression(flags.mode)||is_array(flags.mode))){ // (function
}else {print_newline();}}if(last_type==='TK_COMMA'||last_type==='TK_START_EXPR'||last_type==='TK_EQUALS'||last_type==='TK_OPERATOR'){if(!start_of_object_property()){allow_wrap_or_preserved_newline();}}if(current_token.type==='TK_RESERVED'&&in_array(current_token.text,['function','get','set'])){print_token();flags.last_word=current_token.text;return;}prefix='NONE';if(last_type==='TK_END_BLOCK'){if(!(current_token.type==='TK_RESERVED'&&in_array(current_token.text,['else','catch','finally','from']))){prefix='NEWLINE';}else {if(opt.brace_style==="expand"||opt.brace_style==="end-expand"||opt.brace_style==="none"&&current_token.wanted_newline){prefix='NEWLINE';}else {prefix='SPACE';output.space_before_token=true;}}}else if(last_type==='TK_SEMICOLON'&&flags.mode===MODE.BlockStatement){ // TODO: Should this be for STATEMENT as well?
prefix='NEWLINE';}else if(last_type==='TK_SEMICOLON'&&is_expression(flags.mode)){prefix='SPACE';}else if(last_type==='TK_STRING'){prefix='NEWLINE';}else if(last_type==='TK_RESERVED'||last_type==='TK_WORD'||flags.last_text==='*'&&last_last_text==='function'){prefix='SPACE';}else if(last_type==='TK_START_BLOCK'){if(flags.inline_frame){prefix='SPACE';}else {prefix='NEWLINE';}}else if(last_type==='TK_END_EXPR'){output.space_before_token=true;prefix='NEWLINE';}if(current_token.type==='TK_RESERVED'&&in_array(current_token.text,Tokenizer.line_starters)&&flags.last_text!==')'){if(flags.last_text==='else'||flags.last_text==='export'){prefix='SPACE';}else {prefix='NEWLINE';}}if(current_token.type==='TK_RESERVED'&&in_array(current_token.text,['else','catch','finally'])){if(!(last_type==='TK_END_BLOCK'&&previous_flags.mode===MODE.BlockStatement)||opt.brace_style==="expand"||opt.brace_style==="end-expand"||opt.brace_style==="none"&&current_token.wanted_newline){print_newline();}else {output.trim(true);var line=output.current_line; // If we trimmed and there's something other than a close block before us
// put a newline back in.  Handles '} // comment' scenario.
if(line.last()!=='}'){print_newline();}output.space_before_token=true;}}else if(prefix==='NEWLINE'){if(last_type==='TK_RESERVED'&&is_special_word(flags.last_text)){ // no newline between 'return nnn'
output.space_before_token=true;}else if(last_type!=='TK_END_EXPR'){if((last_type!=='TK_START_EXPR'||!(current_token.type==='TK_RESERVED'&&in_array(current_token.text,['var','let','const'])))&&flags.last_text!==':'){ // no need to force newline on 'var': for (var x = 0...)
if(current_token.type==='TK_RESERVED'&&current_token.text==='if'&&flags.last_text==='else'){ // no newline for } else if {
output.space_before_token=true;}else {print_newline();}}}else if(current_token.type==='TK_RESERVED'&&in_array(current_token.text,Tokenizer.line_starters)&&flags.last_text!==')'){print_newline();}}else if(flags.multiline_frame&&is_array(flags.mode)&&flags.last_text===','&&last_last_text==='}'){print_newline(); // }, in lists get a newline treatment
}else if(prefix==='SPACE'){output.space_before_token=true;}print_token();flags.last_word=current_token.text;if(current_token.type==='TK_RESERVED'){if(current_token.text==='do'){flags.do_block=true;}else if(current_token.text==='if'){flags.if_block=true;}else if(current_token.text==='import'){flags.import_block=true;}else if(flags.import_block&&current_token.type==='TK_RESERVED'&&current_token.text==='from'){flags.import_block=false;}}}function handle_semicolon(){if(start_of_statement()){ // The conditional starts the statement if appropriate.
// Semicolon can be the start (and end) of a statement
output.space_before_token=false;}while(flags.mode===MODE.Statement&&!flags.if_block&&!flags.do_block){restore_mode();} // hacky but effective for the moment
if(flags.import_block){flags.import_block=false;}print_token();}function handle_string(){if(start_of_statement()){ // The conditional starts the statement if appropriate.
// One difference - strings want at least a space before
output.space_before_token=true;}else if(last_type==='TK_RESERVED'||last_type==='TK_WORD'||flags.inline_frame){output.space_before_token=true;}else if(last_type==='TK_COMMA'||last_type==='TK_START_EXPR'||last_type==='TK_EQUALS'||last_type==='TK_OPERATOR'){if(!start_of_object_property()){allow_wrap_or_preserved_newline();}}else {print_newline();}print_token();}function handle_equals(){if(start_of_statement()){ // The conditional starts the statement if appropriate.
}if(flags.declaration_statement){ // just got an '=' in a var-line, different formatting/line-breaking, etc will now be done
flags.declaration_assignment=true;}output.space_before_token=true;print_token();output.space_before_token=true;}function handle_comma(){print_token();output.space_before_token=true;if(flags.declaration_statement){if(is_expression(flags.parent.mode)){ // do not break on comma, for(var a = 1, b = 2)
flags.declaration_assignment=false;}if(flags.declaration_assignment){flags.declaration_assignment=false;print_newline(false,true);}else if(opt.comma_first){ // for comma-first, we want to allow a newline before the comma
// to turn into a newline after the comma, which we will fixup later
allow_wrap_or_preserved_newline();}}else if(flags.mode===MODE.ObjectLiteral||flags.mode===MODE.Statement&&flags.parent.mode===MODE.ObjectLiteral){if(flags.mode===MODE.Statement){restore_mode();}if(!flags.inline_frame){print_newline();}}else if(opt.comma_first){ // EXPR or DO_BLOCK
// for comma-first, we want to allow a newline before the comma
// to turn into a newline after the comma, which we will fixup later
allow_wrap_or_preserved_newline();}}function handle_operator(){if(start_of_statement()){ // The conditional starts the statement if appropriate.
}if(last_type==='TK_RESERVED'&&is_special_word(flags.last_text)){ // "return" had a special handling in TK_WORD. Now we need to return the favor
output.space_before_token=true;print_token();return;} // hack for actionscript's import .*;
if(current_token.text==='*'&&last_type==='TK_DOT'){print_token();return;}if(current_token.text===':'&&flags.in_case){flags.case_body=true;indent();print_token();print_newline();flags.in_case=false;return;}if(current_token.text==='::'){ // no spaces around exotic namespacing syntax operator
print_token();return;} // Allow line wrapping between operators
if(last_type==='TK_OPERATOR'){allow_wrap_or_preserved_newline();}var space_before=true;var space_after=true;if(in_array(current_token.text,['--','++','!','~'])||in_array(current_token.text,['-','+'])&&(in_array(last_type,['TK_START_BLOCK','TK_START_EXPR','TK_EQUALS','TK_OPERATOR'])||in_array(flags.last_text,Tokenizer.line_starters)||flags.last_text===',')){ // unary operators (and binary +/- pretending to be unary) special cases
space_before=false;space_after=false; // http://www.ecma-international.org/ecma-262/5.1/#sec-7.9.1
// if there is a newline between -- or ++ and anything else we should preserve it.
if(current_token.wanted_newline&&(current_token.text==='--'||current_token.text==='++')){print_newline(false,true);}if(flags.last_text===';'&&is_expression(flags.mode)){ // for (;; ++i)
//        ^^^
space_before=true;}if(last_type==='TK_RESERVED'){space_before=true;}else if(last_type==='TK_END_EXPR'){space_before=!(flags.last_text===']'&&(current_token.text==='--'||current_token.text==='++'));}else if(last_type==='TK_OPERATOR'){ // a++ + ++b;
// a - -b
space_before=in_array(current_token.text,['--','-','++','+'])&&in_array(flags.last_text,['--','-','++','+']); // + and - are not unary when preceeded by -- or ++ operator
// a-- + b
// a * +b
// a - -b
if(in_array(current_token.text,['+','-'])&&in_array(flags.last_text,['--','++'])){space_after=true;}}if((flags.mode===MODE.BlockStatement&&!flags.inline_frame||flags.mode===MODE.Statement)&&(flags.last_text==='{'||flags.last_text===';')){ // { foo; --i }
// foo(); --bar;
print_newline();}}else if(current_token.text===':'){if(flags.ternary_depth===0){ // Colon is invalid javascript outside of ternary and object, but do our best to guess what was meant.
space_before=false;}else {flags.ternary_depth-=1;}}else if(current_token.text==='?'){flags.ternary_depth+=1;}else if(current_token.text==='*'&&last_type==='TK_RESERVED'&&flags.last_text==='function'){space_before=false;space_after=false;}output.space_before_token=output.space_before_token||space_before;print_token();output.space_before_token=space_after;}function handle_block_comment(){if(output.raw){output.add_raw_token(current_token);if(current_token.directives&&current_token.directives['preserve']==='end'){ // If we're testing the raw output behavior, do not allow a directive to turn it off.
if(!opt.test_output_raw){output.raw=false;}}return;}if(current_token.directives){print_newline(false,true);print_token();if(current_token.directives['preserve']==='start'){output.raw=true;}print_newline(false,true);return;} // inline block
if(!acorn.newline.test(current_token.text)&&!current_token.wanted_newline){output.space_before_token=true;print_token();output.space_before_token=true;return;}var lines=split_linebreaks(current_token.text);var j; // iterator for this case
var javadoc=false;var starless=false;var lastIndent=current_token.whitespace_before;var lastIndentLength=lastIndent.length; // block comment starts with a new line
print_newline(false,true);if(lines.length>1){if(all_lines_start_with(lines.slice(1),'*')){javadoc=true;}else if(each_line_matches_indent(lines.slice(1),lastIndent)){starless=true;}} // first line always indented
print_token(lines[0]);for(j=1;j<lines.length;j++){print_newline(false,true);if(javadoc){ // javadoc: reformat and re-indent
print_token(' '+ltrim(lines[j]));}else if(starless&&lines[j].length>lastIndentLength){ // starless: re-indent non-empty content, avoiding trim
print_token(lines[j].substring(lastIndentLength));}else { // normal comments output raw
output.add_token(lines[j]);}} // for comments of more than one line, make sure there's a new line after
print_newline(false,true);}function handle_comment(){if(current_token.wanted_newline){print_newline(false,true);}else {output.trim(true);}output.space_before_token=true;print_token();print_newline(false,true);}function handle_dot(){if(start_of_statement()){ // The conditional starts the statement if appropriate.
}if(last_type==='TK_RESERVED'&&is_special_word(flags.last_text)){output.space_before_token=true;}else { // allow preserved newlines before dots in general
// force newlines on dots after close paren when break_chained - for bar().baz()
allow_wrap_or_preserved_newline(flags.last_text===')'&&opt.break_chained_methods);}print_token();}function handle_unknown(){print_token();if(current_token.text[current_token.text.length-1]==='\n'){print_newline();}}function handle_eof(){ // Unwind any open statements
while(flags.mode===MODE.Statement){restore_mode();}}}function OutputLine(parent){var _character_count=0; // use indent_count as a marker for lines that have preserved indentation
var _indent_count=-1;var _items=[];var _empty=true;this.set_indent=function(level){_character_count=parent.baseIndentLength+level*parent.indent_length;_indent_count=level;};this.get_character_count=function(){return _character_count;};this.is_empty=function(){return _empty;};this.last=function(){if(!this._empty){return _items[_items.length-1];}else {return null;}};this.push=function(input){_items.push(input);_character_count+=input.length;_empty=false;};this.pop=function(){var item=null;if(!_empty){item=_items.pop();_character_count-=item.length;_empty=_items.length===0;}return item;};this.remove_indent=function(){if(_indent_count>0){_indent_count-=1;_character_count-=parent.indent_length;}};this.trim=function(){while(this.last()===' '){var item=_items.pop();_character_count-=1;}_empty=_items.length===0;};this.toString=function(){var result='';if(!this._empty){if(_indent_count>=0){result=parent.indent_cache[_indent_count];}result+=_items.join('');}return result;};}function Output(indent_string,baseIndentString){baseIndentString=baseIndentString||'';this.indent_cache=[baseIndentString];this.baseIndentLength=baseIndentString.length;this.indent_length=indent_string.length;this.raw=false;var lines=[];this.baseIndentString=baseIndentString;this.indent_string=indent_string;this.previous_line=null;this.current_line=null;this.space_before_token=false;this.add_outputline=function(){this.previous_line=this.current_line;this.current_line=new OutputLine(this);lines.push(this.current_line);}; // initialize
this.add_outputline();this.get_line_number=function(){return lines.length;}; // Using object instead of string to allow for later expansion of info about each line
this.add_new_line=function(force_newline){if(this.get_line_number()===1&&this.just_added_newline()){return false; // no newline on start of file
}if(force_newline||!this.just_added_newline()){if(!this.raw){this.add_outputline();}return true;}return false;};this.get_code=function(){var sweet_code=lines.join('\n').replace(/[\r\n\t ]+$/,'');return sweet_code;};this.set_indent=function(level){ // Never indent your first output indent at the start of the file
if(lines.length>1){while(level>=this.indent_cache.length){this.indent_cache.push(this.indent_cache[this.indent_cache.length-1]+this.indent_string);}this.current_line.set_indent(level);return true;}this.current_line.set_indent(0);return false;};this.add_raw_token=function(token){for(var x=0;x<token.newlines;x++){this.add_outputline();}this.current_line.push(token.whitespace_before);this.current_line.push(token.text);this.space_before_token=false;};this.add_token=function(printable_token){this.add_space_before_token();this.current_line.push(printable_token);};this.add_space_before_token=function(){if(this.space_before_token&&!this.just_added_newline()){this.current_line.push(' ');}this.space_before_token=false;};this.remove_redundant_indentation=function(frame){ // This implementation is effective but has some issues:
//     - can cause line wrap to happen too soon due to indent removal
//           after wrap points are calculated
// These issues are minor compared to ugly indentation.
if(frame.multiline_frame||frame.mode===MODE.ForInitializer||frame.mode===MODE.Conditional){return;} // remove one indent from each line inside this section
var index=frame.start_line_index;var line;var output_length=lines.length;while(index<output_length){lines[index].remove_indent();index++;}};this.trim=function(eat_newlines){eat_newlines=eat_newlines===undefined?false:eat_newlines;this.current_line.trim(indent_string,baseIndentString);while(eat_newlines&&lines.length>1&&this.current_line.is_empty()){lines.pop();this.current_line=lines[lines.length-1];this.current_line.trim();}this.previous_line=lines.length>1?lines[lines.length-2]:null;};this.just_added_newline=function(){return this.current_line.is_empty();};this.just_added_blankline=function(){if(this.just_added_newline()){if(lines.length===1){return true; // start of the file and newline = blank
}var line=lines[lines.length-2];return line.is_empty();}return false;};}var Token=function Token(type,text,newlines,whitespace_before,mode,parent){this.type=type;this.text=text;this.comments_before=[];this.newlines=newlines||0;this.wanted_newline=newlines>0;this.whitespace_before=whitespace_before||'';this.parent=null;this.opened=null;this.directives=null;};function tokenizer(input,opts,indent_string){var whitespace="\n\r\t ".split('');var digit=/[0-9]/;var digit_bin=/[01]/;var digit_oct=/[01234567]/;var digit_hex=/[0123456789abcdefABCDEF]/;var punct='+ - * / % & ++ -- = += -= *= /= %= == === != !== > < >= <= >> << >>> >>>= >>= <<= && &= | || ! ~ , : ? ^ ^= |= :: => **'.split(' '); // words which should always start on new line.
this.line_starters='continue,try,throw,return,var,let,const,if,switch,case,default,for,while,break,function,import,export'.split(',');var reserved_words=this.line_starters.concat(['do','in','else','get','set','new','catch','finally','typeof','yield','async','await','from','as']); //  /* ... */ comment ends with nearest */ or end of file
var block_comment_pattern=/([\s\S]*?)((?:\*\/)|$)/g; // comment ends just before nearest linefeed or end of file
var comment_pattern=/([^\n\r\u2028\u2029]*)/g;var directives_block_pattern=/\/\* beautify( \w+[:]\w+)+ \*\//g;var directive_pattern=/ (\w+)[:](\w+)/g;var directives_end_ignore_pattern=/([\s\S]*?)((?:\/\*\sbeautify\signore:end\s\*\/)|$)/g;var template_pattern=/((<\?php|<\?=)[\s\S]*?\?>)|(<%[\s\S]*?%>)/g;var n_newlines,whitespace_before_token,in_html_comment,tokens,parser_pos;var input_length;this.tokenize=function(){ // cache the source's length.
input_length=input.length;parser_pos=0;in_html_comment=false;tokens=[];var next,last;var token_values;var open=null;var open_stack=[];var comments=[];while(!(last&&last.type==='TK_EOF')){token_values=tokenize_next();next=new Token(token_values[1],token_values[0],n_newlines,whitespace_before_token);while(next.type==='TK_COMMENT'||next.type==='TK_BLOCK_COMMENT'||next.type==='TK_UNKNOWN'){if(next.type==='TK_BLOCK_COMMENT'){next.directives=token_values[2];}comments.push(next);token_values=tokenize_next();next=new Token(token_values[1],token_values[0],n_newlines,whitespace_before_token);}if(comments.length){next.comments_before=comments;comments=[];}if(next.type==='TK_START_BLOCK'||next.type==='TK_START_EXPR'){next.parent=last;open_stack.push(open);open=next;}else if((next.type==='TK_END_BLOCK'||next.type==='TK_END_EXPR')&&open&&(next.text===']'&&open.text==='['||next.text===')'&&open.text==='('||next.text==='}'&&open.text==='{')){next.parent=open.parent;next.opened=open;open=open_stack.pop();}tokens.push(next);last=next;}return tokens;};function get_directives(text){if(!text.match(directives_block_pattern)){return null;}var directives={};directive_pattern.lastIndex=0;var directive_match=directive_pattern.exec(text);while(directive_match){directives[directive_match[1]]=directive_match[2];directive_match=directive_pattern.exec(text);}return directives;}function tokenize_next(){var i,resulting_string;var whitespace_on_this_line=[];n_newlines=0;whitespace_before_token='';if(parser_pos>=input_length){return ['','TK_EOF'];}var last_token;if(tokens.length){last_token=tokens[tokens.length-1];}else { // For the sake of tokenizing we can pretend that there was on open brace to start
last_token=new Token('TK_START_BLOCK','{');}var c=input.charAt(parser_pos);parser_pos+=1;while(in_array(c,whitespace)){if(acorn.newline.test(c)){if(!(c==='\n'&&input.charAt(parser_pos-2)==='\r')){n_newlines+=1;whitespace_on_this_line=[];}}else {whitespace_on_this_line.push(c);}if(parser_pos>=input_length){return ['','TK_EOF'];}c=input.charAt(parser_pos);parser_pos+=1;}if(whitespace_on_this_line.length){whitespace_before_token=whitespace_on_this_line.join('');}if(digit.test(c)||c==='.'&&digit.test(input.charAt(parser_pos))){var allow_decimal=true;var allow_e=true;var local_digit=digit;if(c==='0'&&parser_pos<input_length&&/[XxOoBb]/.test(input.charAt(parser_pos))){ // switch to hex/oct/bin number, no decimal or e, just hex/oct/bin digits
allow_decimal=false;allow_e=false;if(/[Bb]/.test(input.charAt(parser_pos))){local_digit=digit_bin;}else if(/[Oo]/.test(input.charAt(parser_pos))){local_digit=digit_oct;}else {local_digit=digit_hex;}c+=input.charAt(parser_pos);parser_pos+=1;}else if(c==='.'){ // Already have a decimal for this literal, don't allow another
allow_decimal=false;}else { // we know this first loop will run.  It keeps the logic simpler.
c='';parser_pos-=1;} // Add the digits
while(parser_pos<input_length&&local_digit.test(input.charAt(parser_pos))){c+=input.charAt(parser_pos);parser_pos+=1;if(allow_decimal&&parser_pos<input_length&&input.charAt(parser_pos)==='.'){c+=input.charAt(parser_pos);parser_pos+=1;allow_decimal=false;}else if(allow_e&&parser_pos<input_length&&/[Ee]/.test(input.charAt(parser_pos))){c+=input.charAt(parser_pos);parser_pos+=1;if(parser_pos<input_length&&/[+-]/.test(input.charAt(parser_pos))){c+=input.charAt(parser_pos);parser_pos+=1;}allow_e=false;allow_decimal=false;}}return [c,'TK_WORD'];}if(acorn.isIdentifierStart(input.charCodeAt(parser_pos-1))){if(parser_pos<input_length){while(acorn.isIdentifierChar(input.charCodeAt(parser_pos))){c+=input.charAt(parser_pos);parser_pos+=1;if(parser_pos===input_length){break;}}}if(!(last_token.type==='TK_DOT'||last_token.type==='TK_RESERVED'&&in_array(last_token.text,['set','get']))&&in_array(c,reserved_words)){if(c==='in'){ // hack for 'in' operator
return [c,'TK_OPERATOR'];}return [c,'TK_RESERVED'];}return [c,'TK_WORD'];}if(c==='('||c==='['){return [c,'TK_START_EXPR'];}if(c===')'||c===']'){return [c,'TK_END_EXPR'];}if(c==='{'){return [c,'TK_START_BLOCK'];}if(c==='}'){return [c,'TK_END_BLOCK'];}if(c===';'){return [c,'TK_SEMICOLON'];}if(c==='/'){var comment=''; // peek for comment /* ... */
if(input.charAt(parser_pos)==='*'){parser_pos+=1;block_comment_pattern.lastIndex=parser_pos;var comment_match=block_comment_pattern.exec(input);comment='/*'+comment_match[0];parser_pos+=comment_match[0].length;var directives=get_directives(comment);if(directives&&directives['ignore']==='start'){directives_end_ignore_pattern.lastIndex=parser_pos;comment_match=directives_end_ignore_pattern.exec(input);comment+=comment_match[0];parser_pos+=comment_match[0].length;}comment=comment.replace(acorn.allLineBreaks,'\n');return [comment,'TK_BLOCK_COMMENT',directives];} // peek for comment // ...
if(input.charAt(parser_pos)==='/'){parser_pos+=1;comment_pattern.lastIndex=parser_pos;var comment_match=comment_pattern.exec(input);comment='//'+comment_match[0];parser_pos+=comment_match[0].length;return [comment,'TK_COMMENT'];}}var startXmlRegExp=/^<([-a-zA-Z:0-9_.]+|{.+?}|!\[CDATA\[[\s\S]*?\]\])(\s+{.+?}|\s+[-a-zA-Z:0-9_.]+|\s+[-a-zA-Z:0-9_.]+\s*=\s*('[^']*'|"[^"]*"|{.+?}))*\s*(\/?)\s*>/;if(c==='`'||c==="'"||c==='"'|| // string
(c==='/'|| // regexp
opts.e4x&&c==="<"&&input.slice(parser_pos-1).match(startXmlRegExp) // xml
)&&( // regex and xml can only appear in specific locations during parsing
last_token.type==='TK_RESERVED'&&in_array(last_token.text,['return','case','throw','else','do','typeof','yield'])||last_token.type==='TK_END_EXPR'&&last_token.text===')'&&last_token.parent&&last_token.parent.type==='TK_RESERVED'&&in_array(last_token.parent.text,['if','while','for'])||in_array(last_token.type,['TK_COMMENT','TK_START_EXPR','TK_START_BLOCK','TK_END_BLOCK','TK_OPERATOR','TK_EQUALS','TK_EOF','TK_SEMICOLON','TK_COMMA']))){var sep=c,esc=false,has_char_escapes=false;resulting_string=c;if(sep==='/'){ //
// handle regexp
//
var in_char_class=false;while(parser_pos<input_length&&(esc||in_char_class||input.charAt(parser_pos)!==sep)&&!acorn.newline.test(input.charAt(parser_pos))){resulting_string+=input.charAt(parser_pos);if(!esc){esc=input.charAt(parser_pos)==='\\';if(input.charAt(parser_pos)==='['){in_char_class=true;}else if(input.charAt(parser_pos)===']'){in_char_class=false;}}else {esc=false;}parser_pos+=1;}}else if(opts.e4x&&sep==='<'){ //
// handle e4x xml literals
//
var xmlRegExp=/<(\/?)([-a-zA-Z:0-9_.]+|{.+?}|!\[CDATA\[[\s\S]*?\]\])(\s+{.+?}|\s+[-a-zA-Z:0-9_.]+|\s+[-a-zA-Z:0-9_.]+\s*=\s*('[^']*'|"[^"]*"|{.+?}))*\s*(\/?)\s*>/g;var xmlStr=input.slice(parser_pos-1);var match=xmlRegExp.exec(xmlStr);if(match&&match.index===0){var rootTag=match[2];var depth=0;while(match){var isEndTag=!!match[1];var tagName=match[2];var isSingletonTag=!!match[match.length-1]||tagName.slice(0,8)==="![CDATA[";if(tagName===rootTag&&!isSingletonTag){if(isEndTag){--depth;}else {++depth;}}if(depth<=0){break;}match=xmlRegExp.exec(xmlStr);}var xmlLength=match?match.index+match[0].length:xmlStr.length;xmlStr=xmlStr.slice(0,xmlLength);parser_pos+=xmlLength-1;xmlStr=xmlStr.replace(acorn.allLineBreaks,'\n');return [xmlStr,"TK_STRING"];}}else { //
// handle string
//
var parse_string=function parse_string(delimiter,allow_unescaped_newlines,start_sub){ // Template strings can travers lines without escape characters.
// Other strings cannot
var current_char;while(parser_pos<input_length){current_char=input.charAt(parser_pos);if(!(esc||current_char!==delimiter&&(allow_unescaped_newlines||!acorn.newline.test(current_char)))){break;} // Handle \r\n linebreaks after escapes or in template strings
if((esc||allow_unescaped_newlines)&&acorn.newline.test(current_char)){if(current_char==='\r'&&input.charAt(parser_pos+1)==='\n'){parser_pos+=1;current_char=input.charAt(parser_pos);}resulting_string+='\n';}else {resulting_string+=current_char;}if(esc){if(current_char==='x'||current_char==='u'){has_char_escapes=true;}esc=false;}else {esc=current_char==='\\';}parser_pos+=1;if(start_sub&&resulting_string.indexOf(start_sub,resulting_string.length-start_sub.length)!==-1){if(delimiter==='`'){parse_string('}',allow_unescaped_newlines,'`');}else {parse_string('`',allow_unescaped_newlines,'${');}}}};if(sep==='`'){parse_string('`',true,'${');}else {parse_string(sep);}}if(has_char_escapes&&opts.unescape_strings){resulting_string=unescape_string(resulting_string);}if(parser_pos<input_length&&input.charAt(parser_pos)===sep){resulting_string+=sep;parser_pos+=1;if(sep==='/'){ // regexps may have modifiers /regexp/MOD , so fetch those, too
// Only [gim] are valid, but if the user puts in garbage, do what we can to take it.
while(parser_pos<input_length&&acorn.isIdentifierStart(input.charCodeAt(parser_pos))){resulting_string+=input.charAt(parser_pos);parser_pos+=1;}}}return [resulting_string,'TK_STRING'];}if(c==='#'){if(tokens.length===0&&input.charAt(parser_pos)==='!'){ // shebang
resulting_string=c;while(parser_pos<input_length&&c!=='\n'){c=input.charAt(parser_pos);resulting_string+=c;parser_pos+=1;}return [trim(resulting_string)+'\n','TK_UNKNOWN'];} // Spidermonkey-specific sharp variables for circular references
// https://developer.mozilla.org/En/Sharp_variables_in_JavaScript
// http://mxr.mozilla.org/mozilla-central/source/js/src/jsscan.cpp around line 1935
var sharp='#';if(parser_pos<input_length&&digit.test(input.charAt(parser_pos))){do {c=input.charAt(parser_pos);sharp+=c;parser_pos+=1;}while(parser_pos<input_length&&c!=='#'&&c!=='=');if(c==='#'){ //
}else if(input.charAt(parser_pos)==='['&&input.charAt(parser_pos+1)===']'){sharp+='[]';parser_pos+=2;}else if(input.charAt(parser_pos)==='{'&&input.charAt(parser_pos+1)==='}'){sharp+='{}';parser_pos+=2;}return [sharp,'TK_WORD'];}}if(c==='<'&&(input.charAt(parser_pos)==='?'||input.charAt(parser_pos)==='%')){template_pattern.lastIndex=parser_pos-1;var template_match=template_pattern.exec(input);if(template_match){c=template_match[0];parser_pos+=c.length-1;c=c.replace(acorn.allLineBreaks,'\n');return [c,'TK_STRING'];}}if(c==='<'&&input.substring(parser_pos-1,parser_pos+3)==='<!--'){parser_pos+=3;c='<!--';while(!acorn.newline.test(input.charAt(parser_pos))&&parser_pos<input_length){c+=input.charAt(parser_pos);parser_pos++;}in_html_comment=true;return [c,'TK_COMMENT'];}if(c==='-'&&in_html_comment&&input.substring(parser_pos-1,parser_pos+2)==='-->'){in_html_comment=false;parser_pos+=2;return ['-->','TK_COMMENT'];}if(c==='.'){return [c,'TK_DOT'];}if(in_array(c,punct)){while(parser_pos<input_length&&in_array(c+input.charAt(parser_pos),punct)){c+=input.charAt(parser_pos);parser_pos+=1;if(parser_pos>=input_length){break;}}if(c===','){return [c,'TK_COMMA'];}else if(c==='='){return [c,'TK_EQUALS'];}else {return [c,'TK_OPERATOR'];}}return [c,'TK_UNKNOWN'];}function unescape_string(s){var esc=false,out='',pos=0,s_hex='',escaped=0,c;while(esc||pos<s.length){c=s.charAt(pos);pos++;if(esc){esc=false;if(c==='x'){ // simple hex-escape \x24
s_hex=s.substr(pos,2);pos+=2;}else if(c==='u'){ // unicode-escape, \u2134
s_hex=s.substr(pos,4);pos+=4;}else { // some common escape, e.g \n
out+='\\'+c;continue;}if(!s_hex.match(/^[0123456789abcdefABCDEF]+$/)){ // some weird escaping, bail out,
// leaving whole string intact
return s;}escaped=parseInt(s_hex,16);if(escaped>=0x00&&escaped<0x20){ // leave 0x00...0x1f escaped
if(c==='x'){out+='\\x'+s_hex;}else {out+="\\u"+s_hex;}continue;}else if(escaped===0x22||escaped===0x27||escaped===0x5c){ // single-quote, apostrophe, backslash - escape these
out+='\\'+String.fromCharCode(escaped);}else if(c==='x'&&escaped>0x7e&&escaped<=0xff){ // we bail out on \x7f..\xff,
// leaving whole string escaped,
// as it's probably completely binary
return s;}else {out+=String.fromCharCode(escaped);}}else if(c==='\\'){esc=true;}else {out+=c;}}return out;}}if(typeof define==="function"&&define.amd){ // Add support for AMD ( https://github.com/amdjs/amdjs-api/wiki/AMD#defineamd-property- )
define([],function(){return {js_beautify:js_beautify};});}else if(typeof exports!=="undefined"){ // Add support for CommonJS. Just put this file somewhere on your require.paths
// and you will be able to `var js_beautify = require("beautify").js_beautify`.
exports.js_beautify=js_beautify;}else if(typeof window!=="undefined"){ // If we're running a web page and don't have either of the above, add our one global
window.js_beautify=js_beautify;}else if(typeof global!=="undefined"){ // If we don't even have window, try global.
global.js_beautify=js_beautify;}})();}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{}],51:[function(require,module,exports){(function(process){ // Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts,allowAboveRoot){ // if the path tries to go above the root, `up` ends up > 0
var up=0;for(var i=parts.length-1;i>=0;i--){var last=parts[i];if(last==='.'){parts.splice(i,1);}else if(last==='..'){parts.splice(i,1);up++;}else if(up){parts.splice(i,1);up--;}} // if the path is allowed to go above the root, restore leading ..s
if(allowAboveRoot){for(;up--;up){parts.unshift('..');}}return parts;} // Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;var splitPath=function splitPath(filename){return splitPathRe.exec(filename).slice(1);}; // path.resolve([from ...], to)
// posix version
exports.resolve=function(){var resolvedPath='',resolvedAbsolute=false;for(var i=arguments.length-1;i>=-1&&!resolvedAbsolute;i--){var path=i>=0?arguments[i]:process.cwd(); // Skip empty and invalid entries
if(typeof path!=='string'){throw new TypeError('Arguments to path.resolve must be strings');}else if(!path){continue;}resolvedPath=path+'/'+resolvedPath;resolvedAbsolute=path.charAt(0)==='/';} // At this point the path should be resolved to a full absolute path, but
// handle relative paths to be safe (might happen when process.cwd() fails)
// Normalize the path
resolvedPath=normalizeArray(filter(resolvedPath.split('/'),function(p){return !!p;}),!resolvedAbsolute).join('/');return (resolvedAbsolute?'/':'')+resolvedPath||'.';}; // path.normalize(path)
// posix version
exports.normalize=function(path){var isAbsolute=exports.isAbsolute(path),trailingSlash=substr(path,-1)==='/'; // Normalize the path
path=normalizeArray(filter(path.split('/'),function(p){return !!p;}),!isAbsolute).join('/');if(!path&&!isAbsolute){path='.';}if(path&&trailingSlash){path+='/';}return (isAbsolute?'/':'')+path;}; // posix version
exports.isAbsolute=function(path){return path.charAt(0)==='/';}; // posix version
exports.join=function(){var paths=Array.prototype.slice.call(arguments,0);return exports.normalize(filter(paths,function(p,index){if(typeof p!=='string'){throw new TypeError('Arguments to path.join must be strings');}return p;}).join('/'));}; // path.relative(from, to)
// posix version
exports.relative=function(from,to){from=exports.resolve(from).substr(1);to=exports.resolve(to).substr(1);function trim(arr){var start=0;for(;start<arr.length;start++){if(arr[start]!=='')break;}var end=arr.length-1;for(;end>=0;end--){if(arr[end]!=='')break;}if(start>end)return [];return arr.slice(start,end-start+1);}var fromParts=trim(from.split('/'));var toParts=trim(to.split('/'));var length=Math.min(fromParts.length,toParts.length);var samePartsLength=length;for(var i=0;i<length;i++){if(fromParts[i]!==toParts[i]){samePartsLength=i;break;}}var outputParts=[];for(var i=samePartsLength;i<fromParts.length;i++){outputParts.push('..');}outputParts=outputParts.concat(toParts.slice(samePartsLength));return outputParts.join('/');};exports.sep='/';exports.delimiter=':';exports.dirname=function(path){var result=splitPath(path),root=result[0],dir=result[1];if(!root&&!dir){ // No dirname whatsoever
return '.';}if(dir){ // It has a dirname, strip trailing slash
dir=dir.substr(0,dir.length-1);}return root+dir;};exports.basename=function(path,ext){var f=splitPath(path)[2]; // TODO: make this comparison case-insensitive on windows?
if(ext&&f.substr(-1*ext.length)===ext){f=f.substr(0,f.length-ext.length);}return f;};exports.extname=function(path){return splitPath(path)[3];};function filter(xs,f){if(xs.filter)return xs.filter(f);var res=[];for(var i=0;i<xs.length;i++){if(f(xs[i],i,xs))res.push(xs[i]);}return res;} // String.prototype.substr - negative index don't work in IE8
var substr='ab'.substr(-1)==='b'?function(str,start,len){return str.substr(start,len);}:function(str,start,len){if(start<0)start=str.length+start;return str.substr(start,len);};}).call(this,require("FT5ORs"));},{"FT5ORs":53}],52:[function(require,module,exports){var isarray=require('isarray'); /**
 * Expose `pathToRegexp`.
 */module.exports=pathToRegexp;module.exports.parse=parse;module.exports.compile=compile;module.exports.tokensToFunction=tokensToFunction;module.exports.tokensToRegExp=tokensToRegExp; /**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */var PATH_REGEXP=new RegExp([ // Match escaped characters that would otherwise appear in future matches.
// This allows the user to escape special characters that won't transform.
'(\\\\.)', // Match Express-style parameters and un-named parameters with a prefix
// and optional suffixes. Matches appear as:
//
// "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
// "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
// "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
'([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'].join('|'),'g'); /**
 * Parse a string for the raw tokens.
 *
 * @param  {String} str
 * @return {Array}
 */function parse(str){var tokens=[];var key=0;var index=0;var path='';var res;while((res=PATH_REGEXP.exec(str))!=null){var m=res[0];var escaped=res[1];var offset=res.index;path+=str.slice(index,offset);index=offset+m.length; // Ignore already escaped sequences.
if(escaped){path+=escaped[1];continue;} // Push the current path onto the tokens.
if(path){tokens.push(path);path='';}var prefix=res[2];var name=res[3];var capture=res[4];var group=res[5];var suffix=res[6];var asterisk=res[7];var repeat=suffix==='+'||suffix==='*';var optional=suffix==='?'||suffix==='*';var delimiter=prefix||'/';var pattern=capture||group||(asterisk?'.*':'[^'+delimiter+']+?');tokens.push({name:name||key++,prefix:prefix||'',delimiter:delimiter,optional:optional,repeat:repeat,pattern:escapeGroup(pattern)});} // Match any characters still remaining.
if(index<str.length){path+=str.substr(index);} // If the path exists, push it onto the end.
if(path){tokens.push(path);}return tokens;} /**
 * Compile a string to a template function for the path.
 *
 * @param  {String}   str
 * @return {Function}
 */function compile(str){return tokensToFunction(parse(str));} /**
 * Expose a method for transforming tokens into the path function.
 */function tokensToFunction(tokens){ // Compile all the tokens into regexps.
var matches=new Array(tokens.length); // Compile all the patterns before compilation.
for(var i=0;i<tokens.length;i++){if(_typeof(tokens[i])==='object'){matches[i]=new RegExp('^'+tokens[i].pattern+'$');}}return function(obj){var path='';var data=obj||{};for(var i=0;i<tokens.length;i++){var token=tokens[i];if(typeof token==='string'){path+=token;continue;}var value=data[token.name];var segment;if(value==null){if(token.optional){continue;}else {throw new TypeError('Expected "'+token.name+'" to be defined');}}if(isarray(value)){if(!token.repeat){throw new TypeError('Expected "'+token.name+'" to not repeat, but received "'+value+'"');}if(value.length===0){if(token.optional){continue;}else {throw new TypeError('Expected "'+token.name+'" to not be empty');}}for(var j=0;j<value.length;j++){segment=encodeURIComponent(value[j]);if(!matches[i].test(segment)){throw new TypeError('Expected all "'+token.name+'" to match "'+token.pattern+'", but received "'+segment+'"');}path+=(j===0?token.prefix:token.delimiter)+segment;}continue;}segment=encodeURIComponent(value);if(!matches[i].test(segment)){throw new TypeError('Expected "'+token.name+'" to match "'+token.pattern+'", but received "'+segment+'"');}path+=token.prefix+segment;}return path;};} /**
 * Escape a regular expression string.
 *
 * @param  {String} str
 * @return {String}
 */function escapeString(str){return str.replace(/([.+*?=^!:${}()[\]|\/])/g,'\\$1');} /**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {String} group
 * @return {String}
 */function escapeGroup(group){return group.replace(/([=!:$\/()])/g,'\\$1');} /**
 * Attach the keys as a property of the regexp.
 *
 * @param  {RegExp} re
 * @param  {Array}  keys
 * @return {RegExp}
 */function attachKeys(re,keys){re.keys=keys;return re;} /**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {String}
 */function flags(options){return options.sensitive?'':'i';} /**
 * Pull out keys from a regexp.
 *
 * @param  {RegExp} path
 * @param  {Array}  keys
 * @return {RegExp}
 */function regexpToRegexp(path,keys){ // Use a negative lookahead to match only capturing groups.
var groups=path.source.match(/\((?!\?)/g);if(groups){for(var i=0;i<groups.length;i++){keys.push({name:i,prefix:null,delimiter:null,optional:false,repeat:false,pattern:null});}}return attachKeys(path,keys);} /**
 * Transform an array into a regexp.
 *
 * @param  {Array}  path
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */function arrayToRegexp(path,keys,options){var parts=[];for(var i=0;i<path.length;i++){parts.push(pathToRegexp(path[i],keys,options).source);}var regexp=new RegExp('(?:'+parts.join('|')+')',flags(options));return attachKeys(regexp,keys);} /**
 * Create a path regexp from string input.
 *
 * @param  {String} path
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */function stringToRegexp(path,keys,options){var tokens=parse(path);var re=tokensToRegExp(tokens,options); // Attach keys back to the regexp.
for(var i=0;i<tokens.length;i++){if(typeof tokens[i]!=='string'){keys.push(tokens[i]);}}return attachKeys(re,keys);} /**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {Array}  tokens
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */function tokensToRegExp(tokens,options){options=options||{};var strict=options.strict;var end=options.end!==false;var route='';var lastToken=tokens[tokens.length-1];var endsWithSlash=typeof lastToken==='string'&&/\/$/.test(lastToken); // Iterate over the tokens and create our regexp string.
for(var i=0;i<tokens.length;i++){var token=tokens[i];if(typeof token==='string'){route+=escapeString(token);}else {var prefix=escapeString(token.prefix);var capture=token.pattern;if(token.repeat){capture+='(?:'+prefix+capture+')*';}if(token.optional){if(prefix){capture='(?:'+prefix+'('+capture+'))?';}else {capture='('+capture+')?';}}else {capture=prefix+'('+capture+')';}route+=capture;}} // In non-strict mode we allow a slash at the end of match. If the path to
// match already ends with a slash, we remove it for consistency. The slash
// is valid at the end of a path match, not in the middle. This is important
// in non-ending mode, where "/test/" shouldn't match "/test//route".
if(!strict){route=(endsWithSlash?route.slice(0,-2):route)+'(?:\\/(?=$))?';}if(end){route+='$';}else { // In non-ending mode, we need the capturing groups to match as much as
// possible by using a positive lookahead to the end or next path segment.
route+=strict&&endsWithSlash?'':'(?=\\/|$)';}return new RegExp('^'+route,flags(options));} /**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(String|RegExp|Array)} path
 * @param  {Array}                 [keys]
 * @param  {Object}                [options]
 * @return {RegExp}
 */function pathToRegexp(path,keys,options){keys=keys||[];if(!isarray(keys)){options=keys;keys=[];}else if(!options){options={};}if(path instanceof RegExp){return regexpToRegexp(path,keys,options);}if(isarray(path)){return arrayToRegexp(path,keys,options);}return stringToRegexp(path,keys,options);}},{"isarray":20}],53:[function(require,module,exports){ // shim for using process in browser
var process=module.exports={};process.nextTick=function(){var canSetImmediate=typeof window!=='undefined'&&window.setImmediate;var canPost=typeof window!=='undefined'&&window.postMessage&&window.addEventListener;if(canSetImmediate){return function(f){return window.setImmediate(f);};}if(canPost){var queue=[];window.addEventListener('message',function(ev){var source=ev.source;if((source===window||source===null)&&ev.data==='process-tick'){ev.stopPropagation();if(queue.length>0){var fn=queue.shift();fn();}}},true);return function nextTick(fn){queue.push(fn);window.postMessage('process-tick','*');};}return function nextTick(fn){setTimeout(fn,0);};}();process.title='browser';process.browser=true;process.env={};process.argv=[];function noop(){}process.on=noop;process.addListener=noop;process.once=noop;process.off=noop;process.removeListener=noop;process.removeAllListeners=noop;process.emit=noop;process.binding=function(name){throw new Error('process.binding is not supported');}; // TODO(shtylman)
process.cwd=function(){return '/';};process.chdir=function(dir){throw new Error('process.chdir is not supported');};},{}],54:[function(require,module,exports){'use strict';var ContextMenu=function(_View){_inherits(ContextMenu,_View);function ContextMenu(args){_classCallCheck2(this,ContextMenu); // Recycle other context menus
var _this2=_possibleConstructorReturn(this,Object.getPrototypeOf(ContextMenu).call(this,args));if($('.context-menu').length>0){_this2.$element=$('.context-menu');}else {_this2.$element=_.ul({class:'context-menu dropdown-menu',role:'menu'});}_this2.$element.css({position:'absolute','z-index':1200,top:_this2.pos.y,left:_this2.pos.x,display:'block'});_this2.fetch();return _this2;}_createClass(ContextMenu,[{key:"render",value:function render(){var view=this;view.$element.html(_.each(view.model,function(label,func){if(func=='---'){return _.li({class:'dropdown-header'},label);}else {return _.li({class:typeof func==='function'?'':'disabled'},_.a({tabindex:'-1',href:'#'},label).click(function(e){e.preventDefault();e.stopPropagation();if(func){func(e);view.remove();}}));}}));$('body').append(view.$element);}}]);return ContextMenu;}(View); // jQuery extention
jQuery.fn.extend({context:function context(menuItems){return this.each(function(){$(this).on('contextmenu',function(e){if(e.ctrlKey){return;}e.preventDefault();e.stopPropagation();if(e.which==3){var menu=new ContextMenu({model:menuItems,pos:{x:e.pageX,y:e.pageY}});}});});}}); // Event handling
$('body').click(function(e){if($(e.target).parents('.context-menu').length<1){ViewHelper.removeAll('ContextMenu');}});},{}],55:[function(require,module,exports){'use strict';var pathToRegexp=require('path-to-regexp');var routes=[];var Router=function(){function Router(){_classCallCheck2(this,Router);}_createClass(Router,null,[{key:"route",value:function route(path,controller){routes[path]={controller:controller};}},{key:"go",value:function go(url){location.hash=url;}},{key:"goToBaseDir",value:function goToBaseDir(){var url=this.url||'/';var base=new String(url).substring(0,url.lastIndexOf('/'));this.go(base);}},{key:"init",value:function init(){ // Get the url
var url=location.hash.slice(1)||'/';var trimmed=url.substring(0,url.indexOf('?'));if(trimmed){url=trimmed;} // Look for route
var context={};var route=void 0; // Exact match
if(routes[url]){route=routes[url]; // Use path to regexp
}else {for(var path in routes){var keys=[];var re=pathToRegexp(path,keys);var values=re.exec(url); // A match was found
if(re.test(url)){ // Set the route
route=routes[path]; // Add context variables (first result (0) is the entire path,
// so assign that manually and start the counter at 1 instead)
route.url=url;var counter=1;var _iteratorNormalCompletion=true;var _didIteratorError=false;var _iteratorError=undefined;try{for(var _iterator=keys[Symbol.iterator](),_step;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=true){var key=_step.value;route[key.name]=values[counter];counter++;}}catch(err){_didIteratorError=true;_iteratorError=err;}finally {try{if(!_iteratorNormalCompletion&&_iterator.return){_iterator.return();}}finally {if(_didIteratorError){throw _iteratorError;}}}break;}}}if(route){route.controller();}}}]);return Router;}();window.addEventListener('hashchange',Router.init);window.Router=Router;},{"path-to-regexp":52}],56:[function(require,module,exports){var Templating={};function append(el,content){if(Object.prototype.toString.call(content)==='[object Array]'){for(var i in content){append(el,content[i]);}}else if(content){el.append(content);}}function create(tag,attr,content){var el=$('<'+tag+'></'+tag+'>'); // If the attribute parameter fails, it's probably an element or a string
try{for(var k in attr){el.attr(k,attr[k]);}}catch(err){content=attr;}append(el,content);return el;}function declareMethod(type){Templating[type]=function(attr,content){return create(type,attr,content);};}function declareBootstrapMethod(type){var tagName='div';if(type.indexOf('|')>-1){tagName=type.split('|')[1];type=type.split('|')[0];}var functionName=type.replace(/-/g,'_');Templating[functionName]=function(attr,content){return create(tagName,attr,content).addClass(type);};}var elementTypes=[ // Block elements
'div','section','nav','hr','label','textarea','audio','video','canvas','iframe', // Inline elements
'img', // Table elements
'table','thead','tbody','th','td','tr', // Select
'select','option','input', // Headings
'h1','h2','h3','h4','h5','h6', // Body text
'span','p','strong','b', // Action buttons
'a','button', // List
'ol','ul','li', // Forms
'form','input'];var bootstrapTypes=['row','col','col-xs-1','col-xs-2','col-xs-3','col-xs-4','col-xs-5','col-xs-6','col-xs-7','col-xs-8','col-xs-9','col-xs-10','col-xs-11','col-xs-12','col-sm-1','col-sm-2','col-sm-3','col-sm-4','col-sm-5','col-sm-6','col-sm-7','col-sm-8','col-sm-9','col-sm-10','col-sm-11','col-sm-12','col-md-1','col-md-2','col-md-3','col-md-4','col-md-5','col-md-6','col-md-7','col-md-8','col-md-9','col-md-10','col-md-11','col-md-12','col-lg-1','col-lg-2','col-lg-3','col-lg-4','col-lg-5','col-lg-6','col-lg-7','col-lg-8','col-lg-9','col-lg-10','col-lg-11','col-lg-12','jumbotron','container','panel','panel-heading','panel-footer','panel-collapse','panel-body','navbar|nav','navbar-nav|ul','collapse','glyphicon|span','btn|button','btn-group','list-group','list-group-item','input-group','input-group-btn|span','input-group-addon|span','form-control|input'];for(var i in elementTypes){declareMethod(elementTypes[i]);}for(var i in bootstrapTypes){declareBootstrapMethod(bootstrapTypes[i]);}Templating.if=function(condition,content){return condition?content:null;};Templating.each=function(array,callback){var elements=[];for(var i in array){var element=callback(i,array[i]);if(element){elements.push(element);}}return elements;};window._=Templating;},{}],57:[function(require,module,exports){'use strict'; /**
 *  jQuery extension
 */(function($){$.event.special.destroyed={remove:function remove(o){if(o.handler){o.handler();}}};})(jQuery); /**
 * GUID
 */function guid(){function s4(){return Math.floor((1+Math.random())*0x10000).toString(16).substring(1);}return s4()+s4()+'-'+s4()+'-'+s4()+'-'+s4()+'-'+s4()+s4()+s4();} /**
 * Helper
 */var instances=[];var ViewHelper=function(){function ViewHelper(){_classCallCheck2(this,ViewHelper);}_createClass(ViewHelper,null,[{key:"getAll",value:function getAll(type){var results=[];if(type){for(var i in instances){var instance=instances[i];var name=instance.name;if(name==type){results.push(instance);}}}else {results=instances;}return results;}},{key:"get",value:function get(type){var results=ViewHelper.getAll(type);var view=results.length>0?results[0]:null;return view;}},{key:"clear",value:function clear(type){for(var _guid in instances){var instance=instances[_guid];var name=instance.constructor.name;if(!type||name==type){instance.remove();}}}},{key:"removeAll",value:function removeAll(type){var _iteratorNormalCompletion2=true;var _didIteratorError2=false;var _iteratorError2=undefined;try{for(var _iterator2=ViewHelper.getAll(type)[Symbol.iterator](),_step2;!(_iteratorNormalCompletion2=(_step2=_iterator2.next()).done);_iteratorNormalCompletion2=true){var view=_step2.value;view.remove();}}catch(err){_didIteratorError2=true;_iteratorError2=err;}finally {try{if(!_iteratorNormalCompletion2&&_iterator2.return){_iterator2.return();}}finally {if(_didIteratorError2){throw _iteratorError2;}}}}}]);return ViewHelper;}();window.ViewHelper=ViewHelper; /**
 * Class
 */var View=function(){ /**
     * Init
     */function View(args){_classCallCheck2(this,View);this.name=this.constructor.name;this.guid=guid();this.events={};this.adopt(args);instances[this.guid]=this;}_createClass(View,[{key:"getName",value:function getName(){var name=this.constructor.toString();name=name.substring('function '.length);name=name.substring(0,name.indexOf('('));return name;}},{key:"init",value:function init(){this.prerender();this.render();this.postrender();if(this.$element){this.element=this.$element[0];this.$element.data('view',this);this.$element.bind('destroyed',function(){var view=$(this).data('view');if(view){$(this).data('view').remove();}});}this.trigger('ready',this);this.isReady=true;}},{key:"ready",value:function ready(callback){if(this.isReady){callback(this);}else {this.on('ready',callback);}} // Adopt values
},{key:"adopt",value:function adopt(args){for(var k in args){this[k]=args[k];}return this;} /**
     * Rendering
     */},{key:"prerender",value:function prerender(){}},{key:"render",value:function render(){}},{key:"postrender",value:function postrender(){} /**
     * Events
     */ // Removes the view from DOM and memory
},{key:"remove",value:function remove(timeout){var view=this;if(!view.destroyed){view.destroyed=true;setTimeout(function(){view.trigger('remove');if(view.$element&&view.$element.length>0){view.$element.remove();}instances.splice(view.guid,1);},timeout||0);}} // Call an event (for internal use)
},{key:"call",value:function call(callback,data,ui){callback(data,ui,this);} // Trigger an event
},{key:"trigger",value:function trigger(e,obj){if(this.events[e]){if(typeof this.events[e]==='function'){this.events[e](obj);}else {for(var i in this.events[e]){if(this.events[e][i]){this.events[e][i](obj);}}}}} // Bind an event
},{key:"on",value:function on(e,callback){var view=this; // No events registered, register this as the only event
if(!this.events[e]){this.events[e]=function(data){view.call(callback,data,this);}; // Events have already been registered, add to callback array
}else { // Only one event is registered, so convert from a single reference to an array
if(!this.events[e].length){this.events[e]=[this.events[e]];} // Insert the event call into the array 
this.events[e].push(function(data){view.call(callback,data,this);});}} // Check if event exists
},{key:"hasEvent",value:function hasEvent(name){for(var k in this.events){if(k==name){return true;}}return false;} /**
     * Fetch
     */},{key:"fetch",value:function fetch(){var view=this;function getModel(){ // Get model from URL
if(!view.model&&typeof view.modelUrl==='string'){$.getJSON(view.modelUrl,function(data){view.model=data;view.init();}); // Get model with function
}else if(!view.model&&typeof view.modelFunction==='function'){view.modelFunction(function(data){view.model=data;view.init();}); // Just perform the initialisation
}else {view.init();}} // Get rendered content from URL
if(typeof view.renderUrl==='string'){$.get(view.renderUrl,function(html){if(view.$element){view.$element.append(html);}else {view.$element=$(html);} // And then get the model
getModel();}); // If no render url is defined, just get the model
}else {getModel();}}}]);return View;}();window.View=View;},{}],58:[function(require,module,exports){require('./Router');require('./Templating');require('./View');require('./ContextMenu');},{"./ContextMenu":54,"./Router":55,"./Templating":56,"./View":57}],59:[function(require,module,exports){ /**
 * This file automatically generated from `pre-publish.js`.
 * Do not manually edit.
 */module.exports={"area":true,"base":true,"br":true,"col":true,"embed":true,"hr":true,"img":true,"input":true,"keygen":true,"link":true,"menuitem":true,"meta":true,"param":true,"source":true,"track":true,"wbr":true};},{}],60:[function(require,module,exports){'use strict';var detect=require('acorn-globals');var acorn=require('acorn');var walk=require('acorn/dist/walk'); // polyfill for https://github.com/marijnh/acorn/pull/231
walk.base.ExportNamedDeclaration=walk.base.ExportDefaultDeclaration=function(node,st,c){return c(node.declaration,st);};walk.base.ImportDefaultSpecifier=walk.base.ImportNamespaceSpecifier=function(){}; // hacky fix for https://github.com/marijnh/acorn/issues/227
function reallyParse(source){try{return acorn.parse(source,{ecmaVersion:5,allowReturnOutsideFunction:true});}catch(ex){if(ex.name!=='SyntaxError'){throw ex;}return acorn.parse(source,{ecmaVersion:6,allowReturnOutsideFunction:true});}}module.exports=addWith; /**
 * Mimic `with` as far as possible but at compile time
 *
 * @param {String} obj The object part of a with expression
 * @param {String} src The body of the with expression
 * @param {Array.<String>} exclude A list of variable names to explicitly exclude
 */function addWith(obj,src,exclude){obj=obj+'';src=src+'';exclude=exclude||[];exclude=exclude.concat(detect(obj).map(function(global){return global.name;}));var vars=detect(src).map(function(global){return global.name;}).filter(function(v){return exclude.indexOf(v)===-1;});if(vars.length===0)return src;var declareLocal='';var local='locals_for_with';var result='result_of_with';if(/^[a-zA-Z0-9$_]+$/.test(obj)){local=obj;}else {while(vars.indexOf(local)!=-1||exclude.indexOf(local)!=-1){local+='_';}declareLocal='var '+local+' = ('+obj+')';}while(vars.indexOf(result)!=-1||exclude.indexOf(result)!=-1){result+='_';}var inputVars=vars.map(function(v){return JSON.stringify(v)+' in '+local+'?'+local+'.'+v+':'+'typeof '+v+'!=="undefined"?'+v+':undefined';});src='(function ('+vars.join(', ')+') {'+src+'}.call(this'+inputVars.map(function(v){return ','+v;}).join('')+'))';return ';'+declareLocal+';'+unwrapReturns(src,result)+';';} /**
 * Take a self calling function, and unwrap it such that return inside the function
 * results in return outside the function
 *
 * @param {String} src    Some JavaScript code representing a self-calling function
 * @param {String} result A temporary variable to store the result in
 */function unwrapReturns(src,result){var originalSource=src;var hasReturn=false;var ast=reallyParse(src);var ref;src=src.split(''); // get a reference to the function that was inserted to add an inner context
if((ref=ast.body).length!==1||(ref=ref[0]).type!=='ExpressionStatement'||(ref=ref.expression).type!=='CallExpression'||(ref=ref.callee).type!=='MemberExpression'||ref.computed!==false||ref.property.name!=='call'||(ref=ref.object).type!=='FunctionExpression')throw new Error('AST does not seem to represent a self-calling function');var fn=ref;walk.recursive(ast,null,{Function:function Function(node,st,c){if(node===fn){c(node.body,st,"ScopeBody");}},ReturnStatement:function ReturnStatement(node){hasReturn=true;replace(node,'return {value: '+source(node.argument)+'};');}});function source(node){return src.slice(node.start,node.end).join('');}function replace(node,str){for(var i=node.start;i<node.end;i++){src[i]='';}src[node.start]=str;}if(!hasReturn)return originalSource;else return 'var '+result+'='+src.join('')+';if ('+result+') return '+result+'.value';}},{"acorn":61,"acorn-globals":1,"acorn/dist/walk":62}],61:[function(require,module,exports){(function(global){(function(f){if((typeof exports==="undefined"?"undefined":_typeof(exports))==="object"&&typeof module!=="undefined"){module.exports=f();}else if(typeof define==="function"&&define.amd){define([],f);}else {var g;if(typeof window!=="undefined"){g=window;}else if(typeof global!=="undefined"){g=global;}else if(typeof self!=="undefined"){g=self;}else {g=this;}g.acorn=f();}})(function(){var define,module,exports;return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f;}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e);},l,l.exports,e,t,n,r);}return n[o].exports;}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++){s(r[o]);}return s;}({1:[function(_dereq_,module,exports){ // The main exported interface (under `self.acorn` when in the
// browser) is a `parse` function that takes a code string and
// returns an abstract syntax tree as specified by [Mozilla parser
// API][api].
//
// [api]: https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API
"use strict";exports.parse=parse; // This function tries to parse a single expression at a given
// offset in a string. Useful for parsing mixed-language formats
// that embed JavaScript expressions.
exports.parseExpressionAt=parseExpressionAt; // Acorn is organized as a tokenizer and a recursive-descent parser.
// The `tokenize` export provides an interface to the tokenizer.
exports.tokenizer=tokenizer;exports.__esModule=true; // Acorn is a tiny, fast JavaScript parser written in JavaScript.
//
// Acorn was written by Marijn Haverbeke, Ingvar Stepanyan, and
// various contributors and released under an MIT license.
//
// Git repositories for Acorn are available at
//
//     http://marijnhaverbeke.nl/git/acorn
//     https://github.com/marijnh/acorn.git
//
// Please use the [github bug tracker][ghbt] to report issues.
//
// [ghbt]: https://github.com/marijnh/acorn/issues
//
// This file defines the main parser interface. The library also comes
// with a [error-tolerant parser][dammit] and an
// [abstract syntax tree walker][walk], defined in other files.
//
// [dammit]: acorn_loose.js
// [walk]: util/walk.js
var _state=_dereq_("./state");var Parser=_state.Parser;var _options=_dereq_("./options");var getOptions=_options.getOptions;_dereq_("./parseutil");_dereq_("./statement");_dereq_("./lval");_dereq_("./expression");exports.Parser=_state.Parser;exports.plugins=_state.plugins;exports.defaultOptions=_options.defaultOptions;var _location=_dereq_("./location");exports.SourceLocation=_location.SourceLocation;exports.getLineInfo=_location.getLineInfo;exports.Node=_dereq_("./node").Node;var _tokentype=_dereq_("./tokentype");exports.TokenType=_tokentype.TokenType;exports.tokTypes=_tokentype.types;var _tokencontext=_dereq_("./tokencontext");exports.TokContext=_tokencontext.TokContext;exports.tokContexts=_tokencontext.types;var _identifier=_dereq_("./identifier");exports.isIdentifierChar=_identifier.isIdentifierChar;exports.isIdentifierStart=_identifier.isIdentifierStart;exports.Token=_dereq_("./tokenize").Token;var _whitespace=_dereq_("./whitespace");exports.isNewLine=_whitespace.isNewLine;exports.lineBreak=_whitespace.lineBreak;exports.lineBreakG=_whitespace.lineBreakG;var version="1.2.2";exports.version=version;function parse(input,options){var p=parser(options,input);var startPos=p.pos,startLoc=p.options.locations&&p.curPosition();p.nextToken();return p.parseTopLevel(p.options.program||p.startNodeAt(startPos,startLoc));}function parseExpressionAt(input,pos,options){var p=parser(options,input,pos);p.nextToken();return p.parseExpression();}function tokenizer(input,options){return parser(options,input);}function parser(options,input){return new Parser(getOptions(options),String(input));}},{"./expression":6,"./identifier":7,"./location":8,"./lval":9,"./node":10,"./options":11,"./parseutil":12,"./state":13,"./statement":14,"./tokencontext":15,"./tokenize":16,"./tokentype":17,"./whitespace":19}],2:[function(_dereq_,module,exports){if(typeof Object.create==='function'){ // implementation from standard node.js 'util' module
module.exports=function inherits(ctor,superCtor){ctor.super_=superCtor;ctor.prototype=Object.create(superCtor.prototype,{constructor:{value:ctor,enumerable:false,writable:true,configurable:true}});};}else { // old school shim for old browsers
module.exports=function inherits(ctor,superCtor){ctor.super_=superCtor;var TempCtor=function TempCtor(){};TempCtor.prototype=superCtor.prototype;ctor.prototype=new TempCtor();ctor.prototype.constructor=ctor;};}},{}],3:[function(_dereq_,module,exports){ // shim for using process in browser
var process=module.exports={};var queue=[];var draining=false;function drainQueue(){if(draining){return;}draining=true;var currentQueue;var len=queue.length;while(len){currentQueue=queue;queue=[];var i=-1;while(++i<len){currentQueue[i]();}len=queue.length;}draining=false;}process.nextTick=function(fun){queue.push(fun);if(!draining){setTimeout(drainQueue,0);}};process.title='browser';process.browser=true;process.env={};process.argv=[];process.version=''; // empty string to avoid regexp issues
process.versions={};function noop(){}process.on=noop;process.addListener=noop;process.once=noop;process.off=noop;process.removeListener=noop;process.removeAllListeners=noop;process.emit=noop;process.binding=function(name){throw new Error('process.binding is not supported');}; // TODO(shtylman)
process.cwd=function(){return '/';};process.chdir=function(dir){throw new Error('process.chdir is not supported');};process.umask=function(){return 0;};},{}],4:[function(_dereq_,module,exports){module.exports=function isBuffer(arg){return arg&&(typeof arg==="undefined"?"undefined":_typeof(arg))==='object'&&typeof arg.copy==='function'&&typeof arg.fill==='function'&&typeof arg.readUInt8==='function';};},{}],5:[function(_dereq_,module,exports){(function(process,global){ // Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
var formatRegExp=/%[sdj%]/g;exports.format=function(f){if(!isString(f)){var objects=[];for(var i=0;i<arguments.length;i++){objects.push(inspect(arguments[i]));}return objects.join(' ');}var i=1;var args=arguments;var len=args.length;var str=String(f).replace(formatRegExp,function(x){if(x==='%%')return '%';if(i>=len)return x;switch(x){case '%s':return String(args[i++]);case '%d':return Number(args[i++]);case '%j':try{return JSON.stringify(args[i++]);}catch(_){return '[Circular]';}default:return x;}});for(var x=args[i];i<len;x=args[++i]){if(isNull(x)||!isObject(x)){str+=' '+x;}else {str+=' '+inspect(x);}}return str;}; // Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate=function(fn,msg){ // Allow for deprecating things in the process of starting up.
if(isUndefined(global.process)){return function(){return exports.deprecate(fn,msg).apply(this,arguments);};}if(process.noDeprecation===true){return fn;}var warned=false;function deprecated(){if(!warned){if(process.throwDeprecation){throw new Error(msg);}else if(process.traceDeprecation){console.trace(msg);}else {console.error(msg);}warned=true;}return fn.apply(this,arguments);}return deprecated;};var debugs={};var debugEnviron;exports.debuglog=function(set){if(isUndefined(debugEnviron))debugEnviron=process.env.NODE_DEBUG||'';set=set.toUpperCase();if(!debugs[set]){if(new RegExp('\\b'+set+'\\b','i').test(debugEnviron)){var pid=process.pid;debugs[set]=function(){var msg=exports.format.apply(exports,arguments);console.error('%s %d: %s',set,pid,msg);};}else {debugs[set]=function(){};}}return debugs[set];}; /**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */ /* legacy: obj, showHidden, depth, colors*/function inspect(obj,opts){ // default options
var ctx={seen:[],stylize:stylizeNoColor}; // legacy...
if(arguments.length>=3)ctx.depth=arguments[2];if(arguments.length>=4)ctx.colors=arguments[3];if(isBoolean(opts)){ // legacy...
ctx.showHidden=opts;}else if(opts){ // got an "options" object
exports._extend(ctx,opts);} // set default options
if(isUndefined(ctx.showHidden))ctx.showHidden=false;if(isUndefined(ctx.depth))ctx.depth=2;if(isUndefined(ctx.colors))ctx.colors=false;if(isUndefined(ctx.customInspect))ctx.customInspect=true;if(ctx.colors)ctx.stylize=stylizeWithColor;return formatValue(ctx,obj,ctx.depth);}exports.inspect=inspect; // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors={'bold':[1,22],'italic':[3,23],'underline':[4,24],'inverse':[7,27],'white':[37,39],'grey':[90,39],'black':[30,39],'blue':[34,39],'cyan':[36,39],'green':[32,39],'magenta':[35,39],'red':[31,39],'yellow':[33,39]}; // Don't use 'blue' not visible on cmd.exe
inspect.styles={'special':'cyan','number':'yellow','boolean':'yellow','undefined':'grey','null':'bold','string':'green','date':'magenta', // "name": intentionally not styling
'regexp':'red'};function stylizeWithColor(str,styleType){var style=inspect.styles[styleType];if(style){return "\u001b["+inspect.colors[style][0]+'m'+str+"\u001b["+inspect.colors[style][1]+'m';}else {return str;}}function stylizeNoColor(str,styleType){return str;}function arrayToHash(array){var hash={};array.forEach(function(val,idx){hash[val]=true;});return hash;}function formatValue(ctx,value,recurseTimes){ // Provide a hook for user-specified inspect functions.
// Check that value is an object with an inspect function on it
if(ctx.customInspect&&value&&isFunction(value.inspect)&& // Filter out the util module, it's inspect function is special
value.inspect!==exports.inspect&& // Also filter out any prototype objects using the circular check.
!(value.constructor&&value.constructor.prototype===value)){var ret=value.inspect(recurseTimes,ctx);if(!isString(ret)){ret=formatValue(ctx,ret,recurseTimes);}return ret;} // Primitive types cannot have properties
var primitive=formatPrimitive(ctx,value);if(primitive){return primitive;} // Look up the keys of the object.
var keys=Object.keys(value);var visibleKeys=arrayToHash(keys);if(ctx.showHidden){keys=Object.getOwnPropertyNames(value);} // IE doesn't make error fields non-enumerable
// http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
if(isError(value)&&(keys.indexOf('message')>=0||keys.indexOf('description')>=0)){return formatError(value);} // Some type of object without properties can be shortcutted.
if(keys.length===0){if(isFunction(value)){var name=value.name?': '+value.name:'';return ctx.stylize('[Function'+name+']','special');}if(isRegExp(value)){return ctx.stylize(RegExp.prototype.toString.call(value),'regexp');}if(isDate(value)){return ctx.stylize(Date.prototype.toString.call(value),'date');}if(isError(value)){return formatError(value);}}var base='',array=false,braces=['{','}']; // Make Array say that they are Array
if(isArray(value)){array=true;braces=['[',']'];} // Make functions say that they are functions
if(isFunction(value)){var n=value.name?': '+value.name:'';base=' [Function'+n+']';} // Make RegExps say that they are RegExps
if(isRegExp(value)){base=' '+RegExp.prototype.toString.call(value);} // Make dates with properties first say the date
if(isDate(value)){base=' '+Date.prototype.toUTCString.call(value);} // Make error with message first say the error
if(isError(value)){base=' '+formatError(value);}if(keys.length===0&&(!array||value.length==0)){return braces[0]+base+braces[1];}if(recurseTimes<0){if(isRegExp(value)){return ctx.stylize(RegExp.prototype.toString.call(value),'regexp');}else {return ctx.stylize('[Object]','special');}}ctx.seen.push(value);var output;if(array){output=formatArray(ctx,value,recurseTimes,visibleKeys,keys);}else {output=keys.map(function(key){return formatProperty(ctx,value,recurseTimes,visibleKeys,key,array);});}ctx.seen.pop();return reduceToSingleString(output,base,braces);}function formatPrimitive(ctx,value){if(isUndefined(value))return ctx.stylize('undefined','undefined');if(isString(value)){var simple='\''+JSON.stringify(value).replace(/^"|"$/g,'').replace(/'/g,"\\'").replace(/\\"/g,'"')+'\'';return ctx.stylize(simple,'string');}if(isNumber(value))return ctx.stylize(''+value,'number');if(isBoolean(value))return ctx.stylize(''+value,'boolean'); // For some reason typeof null is "object", so special case here.
if(isNull(value))return ctx.stylize('null','null');}function formatError(value){return '['+Error.prototype.toString.call(value)+']';}function formatArray(ctx,value,recurseTimes,visibleKeys,keys){var output=[];for(var i=0,l=value.length;i<l;++i){if(hasOwnProperty(value,String(i))){output.push(formatProperty(ctx,value,recurseTimes,visibleKeys,String(i),true));}else {output.push('');}}keys.forEach(function(key){if(!key.match(/^\d+$/)){output.push(formatProperty(ctx,value,recurseTimes,visibleKeys,key,true));}});return output;}function formatProperty(ctx,value,recurseTimes,visibleKeys,key,array){var name,str,desc;desc=Object.getOwnPropertyDescriptor(value,key)||{value:value[key]};if(desc.get){if(desc.set){str=ctx.stylize('[Getter/Setter]','special');}else {str=ctx.stylize('[Getter]','special');}}else {if(desc.set){str=ctx.stylize('[Setter]','special');}}if(!hasOwnProperty(visibleKeys,key)){name='['+key+']';}if(!str){if(ctx.seen.indexOf(desc.value)<0){if(isNull(recurseTimes)){str=formatValue(ctx,desc.value,null);}else {str=formatValue(ctx,desc.value,recurseTimes-1);}if(str.indexOf('\n')>-1){if(array){str=str.split('\n').map(function(line){return '  '+line;}).join('\n').substr(2);}else {str='\n'+str.split('\n').map(function(line){return '   '+line;}).join('\n');}}}else {str=ctx.stylize('[Circular]','special');}}if(isUndefined(name)){if(array&&key.match(/^\d+$/)){return str;}name=JSON.stringify(''+key);if(name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)){name=name.substr(1,name.length-2);name=ctx.stylize(name,'name');}else {name=name.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'");name=ctx.stylize(name,'string');}}return name+': '+str;}function reduceToSingleString(output,base,braces){var numLinesEst=0;var length=output.reduce(function(prev,cur){numLinesEst++;if(cur.indexOf('\n')>=0)numLinesEst++;return prev+cur.replace(/\u001b\[\d\d?m/g,'').length+1;},0);if(length>60){return braces[0]+(base===''?'':base+'\n ')+' '+output.join(',\n  ')+' '+braces[1];}return braces[0]+base+' '+output.join(', ')+' '+braces[1];} // NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar){return Array.isArray(ar);}exports.isArray=isArray;function isBoolean(arg){return typeof arg==='boolean';}exports.isBoolean=isBoolean;function isNull(arg){return arg===null;}exports.isNull=isNull;function isNullOrUndefined(arg){return arg==null;}exports.isNullOrUndefined=isNullOrUndefined;function isNumber(arg){return typeof arg==='number';}exports.isNumber=isNumber;function isString(arg){return typeof arg==='string';}exports.isString=isString;function isSymbol(arg){return (typeof arg==="undefined"?"undefined":_typeof(arg))==='symbol';}exports.isSymbol=isSymbol;function isUndefined(arg){return arg===void 0;}exports.isUndefined=isUndefined;function isRegExp(re){return isObject(re)&&objectToString(re)==='[object RegExp]';}exports.isRegExp=isRegExp;function isObject(arg){return (typeof arg==="undefined"?"undefined":_typeof(arg))==='object'&&arg!==null;}exports.isObject=isObject;function isDate(d){return isObject(d)&&objectToString(d)==='[object Date]';}exports.isDate=isDate;function isError(e){return isObject(e)&&(objectToString(e)==='[object Error]'||e instanceof Error);}exports.isError=isError;function isFunction(arg){return typeof arg==='function';}exports.isFunction=isFunction;function isPrimitive(arg){return arg===null||typeof arg==='boolean'||typeof arg==='number'||typeof arg==='string'||(typeof arg==="undefined"?"undefined":_typeof(arg))==='symbol'|| // ES6 symbol
typeof arg==='undefined';}exports.isPrimitive=isPrimitive;exports.isBuffer=_dereq_('./support/isBuffer');function objectToString(o){return Object.prototype.toString.call(o);}function pad(n){return n<10?'0'+n.toString(10):n.toString(10);}var months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; // 26 Feb 16:19:34
function timestamp(){var d=new Date();var time=[pad(d.getHours()),pad(d.getMinutes()),pad(d.getSeconds())].join(':');return [d.getDate(),months[d.getMonth()],time].join(' ');} // log is just a thin wrapper to console.log that prepends a timestamp
exports.log=function(){console.log('%s - %s',timestamp(),exports.format.apply(exports,arguments));}; /**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */exports.inherits=_dereq_('inherits');exports._extend=function(origin,add){ // Don't do anything if add isn't an object
if(!add||!isObject(add))return origin;var keys=Object.keys(add);var i=keys.length;while(i--){origin[keys[i]]=add[keys[i]];}return origin;};function hasOwnProperty(obj,prop){return Object.prototype.hasOwnProperty.call(obj,prop);}}).call(this,_dereq_('_process'),typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{"./support/isBuffer":4,"_process":3,"inherits":2}],6:[function(_dereq_,module,exports){ // A recursive descent parser operates by defining functions for all
// syntactic elements, and recursively calling those, each function
// advancing the input stream and returning an AST node. Precedence
// of constructs (for example, the fact that `!x[1]` means `!(x[1])`
// instead of `(!x)[1]` is handled by the fact that the parser
// function that parses unary prefix operators is called first, and
// in turn calls the function that parses `[]` subscripts — that
// way, it'll receive the node for `x[1]` already parsed, and wraps
// *that* in the unary operator node.
//
// Acorn uses an [operator precedence parser][opp] to handle binary
// operator precedence, because it is much more compact than using
// the technique outlined above, which uses different, nesting
// functions to specify precedence, for all of the ten binary
// precedence levels that JavaScript defines.
//
// [opp]: http://en.wikipedia.org/wiki/Operator-precedence_parser
"use strict";var tt=_dereq_("./tokentype").types;var Parser=_dereq_("./state").Parser;var reservedWords=_dereq_("./identifier").reservedWords;var has=_dereq_("./util").has;var pp=Parser.prototype; // Check if property name clashes with already added.
// Object/class getters and setters are not allowed to clash —
// either with each other or with an init property — and in
// strict mode, init properties are also not allowed to be repeated.
pp.checkPropClash=function(prop,propHash){if(this.options.ecmaVersion>=6)return;var key=prop.key,name=undefined;switch(key.type){case "Identifier":name=key.name;break;case "Literal":name=String(key.value);break;default:return;}var kind=prop.kind||"init",other=undefined;if(has(propHash,name)){other=propHash[name];var isGetSet=kind!=="init";if((this.strict||isGetSet)&&other[kind]||!(isGetSet^other.init))this.raise(key.start,"Redefinition of property");}else {other=propHash[name]={init:false,get:false,set:false};}other[kind]=true;}; // ### Expression parsing
// These nest, from the most general expression type at the top to
// 'atomic', nondivisible expression types at the bottom. Most of
// the functions will simply let the function(s) below them parse,
// and, *if* the syntactic construct they handle is present, wrap
// the AST node that the inner parser gave them in another node.
// Parse a full expression. The optional arguments are used to
// forbid the `in` operator (in for loops initalization expressions)
// and provide reference for storing '=' operator inside shorthand
// property assignment in contexts where both object expression
// and object pattern might appear (so it's possible to raise
// delayed syntax error at correct position).
pp.parseExpression=function(noIn,refShorthandDefaultPos){var startPos=this.start,startLoc=this.startLoc;var expr=this.parseMaybeAssign(noIn,refShorthandDefaultPos);if(this.type===tt.comma){var node=this.startNodeAt(startPos,startLoc);node.expressions=[expr];while(this.eat(tt.comma)){node.expressions.push(this.parseMaybeAssign(noIn,refShorthandDefaultPos));}return this.finishNode(node,"SequenceExpression");}return expr;}; // Parse an assignment expression. This includes applications of
// operators like `+=`.
pp.parseMaybeAssign=function(noIn,refShorthandDefaultPos,afterLeftParse){if(this.type==tt._yield&&this.inGenerator)return this.parseYield();var failOnShorthandAssign=undefined;if(!refShorthandDefaultPos){refShorthandDefaultPos={start:0};failOnShorthandAssign=true;}else {failOnShorthandAssign=false;}var startPos=this.start,startLoc=this.startLoc;if(this.type==tt.parenL||this.type==tt.name)this.potentialArrowAt=this.start;var left=this.parseMaybeConditional(noIn,refShorthandDefaultPos);if(afterLeftParse)left=afterLeftParse.call(this,left,startPos,startLoc);if(this.type.isAssign){var node=this.startNodeAt(startPos,startLoc);node.operator=this.value;node.left=this.type===tt.eq?this.toAssignable(left):left;refShorthandDefaultPos.start=0; // reset because shorthand default was used correctly
this.checkLVal(left);this.next();node.right=this.parseMaybeAssign(noIn);return this.finishNode(node,"AssignmentExpression");}else if(failOnShorthandAssign&&refShorthandDefaultPos.start){this.unexpected(refShorthandDefaultPos.start);}return left;}; // Parse a ternary conditional (`?:`) operator.
pp.parseMaybeConditional=function(noIn,refShorthandDefaultPos){var startPos=this.start,startLoc=this.startLoc;var expr=this.parseExprOps(noIn,refShorthandDefaultPos);if(refShorthandDefaultPos&&refShorthandDefaultPos.start)return expr;if(this.eat(tt.question)){var node=this.startNodeAt(startPos,startLoc);node.test=expr;node.consequent=this.parseMaybeAssign();this.expect(tt.colon);node.alternate=this.parseMaybeAssign(noIn);return this.finishNode(node,"ConditionalExpression");}return expr;}; // Start the precedence parser.
pp.parseExprOps=function(noIn,refShorthandDefaultPos){var startPos=this.start,startLoc=this.startLoc;var expr=this.parseMaybeUnary(refShorthandDefaultPos);if(refShorthandDefaultPos&&refShorthandDefaultPos.start)return expr;return this.parseExprOp(expr,startPos,startLoc,-1,noIn);}; // Parse binary operators with the operator precedence parsing
// algorithm. `left` is the left-hand side of the operator.
// `minPrec` provides context that allows the function to stop and
// defer further parser to one of its callers when it encounters an
// operator that has a lower precedence than the set it is parsing.
pp.parseExprOp=function(left,leftStartPos,leftStartLoc,minPrec,noIn){var prec=this.type.binop;if(Array.isArray(leftStartPos)){if(this.options.locations&&noIn===undefined){ // shift arguments to left by one
noIn=minPrec;minPrec=leftStartLoc; // flatten leftStartPos
leftStartLoc=leftStartPos[1];leftStartPos=leftStartPos[0];}}if(prec!=null&&(!noIn||this.type!==tt._in)){if(prec>minPrec){var node=this.startNodeAt(leftStartPos,leftStartLoc);node.left=left;node.operator=this.value;var op=this.type;this.next();var startPos=this.start,startLoc=this.startLoc;node.right=this.parseExprOp(this.parseMaybeUnary(),startPos,startLoc,prec,noIn);this.finishNode(node,op===tt.logicalOR||op===tt.logicalAND?"LogicalExpression":"BinaryExpression");return this.parseExprOp(node,leftStartPos,leftStartLoc,minPrec,noIn);}}return left;}; // Parse unary operators, both prefix and postfix.
pp.parseMaybeUnary=function(refShorthandDefaultPos){if(this.type.prefix){var node=this.startNode(),update=this.type===tt.incDec;node.operator=this.value;node.prefix=true;this.next();node.argument=this.parseMaybeUnary();if(refShorthandDefaultPos&&refShorthandDefaultPos.start)this.unexpected(refShorthandDefaultPos.start);if(update)this.checkLVal(node.argument);else if(this.strict&&node.operator==="delete"&&node.argument.type==="Identifier")this.raise(node.start,"Deleting local variable in strict mode");return this.finishNode(node,update?"UpdateExpression":"UnaryExpression");}var startPos=this.start,startLoc=this.startLoc;var expr=this.parseExprSubscripts(refShorthandDefaultPos);if(refShorthandDefaultPos&&refShorthandDefaultPos.start)return expr;while(this.type.postfix&&!this.canInsertSemicolon()){var node=this.startNodeAt(startPos,startLoc);node.operator=this.value;node.prefix=false;node.argument=expr;this.checkLVal(expr);this.next();expr=this.finishNode(node,"UpdateExpression");}return expr;}; // Parse call, dot, and `[]`-subscript expressions.
pp.parseExprSubscripts=function(refShorthandDefaultPos){var startPos=this.start,startLoc=this.startLoc;var expr=this.parseExprAtom(refShorthandDefaultPos);if(refShorthandDefaultPos&&refShorthandDefaultPos.start)return expr;return this.parseSubscripts(expr,startPos,startLoc);};pp.parseSubscripts=function(base,startPos,startLoc,noCalls){if(Array.isArray(startPos)){if(this.options.locations&&noCalls===undefined){ // shift arguments to left by one
noCalls=startLoc; // flatten startPos
startLoc=startPos[1];startPos=startPos[0];}}for(;;){if(this.eat(tt.dot)){var node=this.startNodeAt(startPos,startLoc);node.object=base;node.property=this.parseIdent(true);node.computed=false;base=this.finishNode(node,"MemberExpression");}else if(this.eat(tt.bracketL)){var node=this.startNodeAt(startPos,startLoc);node.object=base;node.property=this.parseExpression();node.computed=true;this.expect(tt.bracketR);base=this.finishNode(node,"MemberExpression");}else if(!noCalls&&this.eat(tt.parenL)){var node=this.startNodeAt(startPos,startLoc);node.callee=base;node.arguments=this.parseExprList(tt.parenR,false);base=this.finishNode(node,"CallExpression");}else if(this.type===tt.backQuote){var node=this.startNodeAt(startPos,startLoc);node.tag=base;node.quasi=this.parseTemplate();base=this.finishNode(node,"TaggedTemplateExpression");}else {return base;}}}; // Parse an atomic expression — either a single token that is an
// expression, an expression started by a keyword like `function` or
// `new`, or an expression wrapped in punctuation like `()`, `[]`,
// or `{}`.
pp.parseExprAtom=function(refShorthandDefaultPos){var node=undefined,canBeArrow=this.potentialArrowAt==this.start;switch(this.type){case tt._this:case tt._super:var type=this.type===tt._this?"ThisExpression":"Super";node=this.startNode();this.next();return this.finishNode(node,type);case tt._yield:if(this.inGenerator)this.unexpected();case tt.name:var startPos=this.start,startLoc=this.startLoc;var id=this.parseIdent(this.type!==tt.name);if(canBeArrow&&!this.canInsertSemicolon()&&this.eat(tt.arrow))return this.parseArrowExpression(this.startNodeAt(startPos,startLoc),[id]);return id;case tt.regexp:var value=this.value;node=this.parseLiteral(value.value);node.regex={pattern:value.pattern,flags:value.flags};return node;case tt.num:case tt.string:return this.parseLiteral(this.value);case tt._null:case tt._true:case tt._false:node=this.startNode();node.value=this.type===tt._null?null:this.type===tt._true;node.raw=this.type.keyword;this.next();return this.finishNode(node,"Literal");case tt.parenL:return this.parseParenAndDistinguishExpression(canBeArrow);case tt.bracketL:node=this.startNode();this.next(); // check whether this is array comprehension or regular array
if(this.options.ecmaVersion>=7&&this.type===tt._for){return this.parseComprehension(node,false);}node.elements=this.parseExprList(tt.bracketR,true,true,refShorthandDefaultPos);return this.finishNode(node,"ArrayExpression");case tt.braceL:return this.parseObj(false,refShorthandDefaultPos);case tt._function:node=this.startNode();this.next();return this.parseFunction(node,false);case tt._class:return this.parseClass(this.startNode(),false);case tt._new:return this.parseNew();case tt.backQuote:return this.parseTemplate();default:this.unexpected();}};pp.parseLiteral=function(value){var node=this.startNode();node.value=value;node.raw=this.input.slice(this.start,this.end);this.next();return this.finishNode(node,"Literal");};pp.parseParenExpression=function(){this.expect(tt.parenL);var val=this.parseExpression();this.expect(tt.parenR);return val;};pp.parseParenAndDistinguishExpression=function(canBeArrow){var startPos=this.start,startLoc=this.startLoc,val=undefined;if(this.options.ecmaVersion>=6){this.next();if(this.options.ecmaVersion>=7&&this.type===tt._for){return this.parseComprehension(this.startNodeAt(startPos,startLoc),true);}var innerStartPos=this.start,innerStartLoc=this.startLoc;var exprList=[],first=true;var refShorthandDefaultPos={start:0},spreadStart=undefined,innerParenStart=undefined;while(this.type!==tt.parenR){first?first=false:this.expect(tt.comma);if(this.type===tt.ellipsis){spreadStart=this.start;exprList.push(this.parseParenItem(this.parseRest()));break;}else {if(this.type===tt.parenL&&!innerParenStart){innerParenStart=this.start;}exprList.push(this.parseMaybeAssign(false,refShorthandDefaultPos,this.parseParenItem));}}var innerEndPos=this.start,innerEndLoc=this.startLoc;this.expect(tt.parenR);if(canBeArrow&&!this.canInsertSemicolon()&&this.eat(tt.arrow)){if(innerParenStart)this.unexpected(innerParenStart);return this.parseParenArrowList(startPos,startLoc,exprList);}if(!exprList.length)this.unexpected(this.lastTokStart);if(spreadStart)this.unexpected(spreadStart);if(refShorthandDefaultPos.start)this.unexpected(refShorthandDefaultPos.start);if(exprList.length>1){val=this.startNodeAt(innerStartPos,innerStartLoc);val.expressions=exprList;this.finishNodeAt(val,"SequenceExpression",innerEndPos,innerEndLoc);}else {val=exprList[0];}}else {val=this.parseParenExpression();}if(this.options.preserveParens){var par=this.startNodeAt(startPos,startLoc);par.expression=val;return this.finishNode(par,"ParenthesizedExpression");}else {return val;}};pp.parseParenItem=function(item){return item;};pp.parseParenArrowList=function(startPos,startLoc,exprList){return this.parseArrowExpression(this.startNodeAt(startPos,startLoc),exprList);}; // New's precedence is slightly tricky. It must allow its argument
// to be a `[]` or dot subscript expression, but not a call — at
// least, not without wrapping it in parentheses. Thus, it uses the
var empty=[];pp.parseNew=function(){var node=this.startNode();var meta=this.parseIdent(true);if(this.options.ecmaVersion>=6&&this.eat(tt.dot)){node.meta=meta;node.property=this.parseIdent(true);if(node.property.name!=="target")this.raise(node.property.start,"The only valid meta property for new is new.target");return this.finishNode(node,"MetaProperty");}var startPos=this.start,startLoc=this.startLoc;node.callee=this.parseSubscripts(this.parseExprAtom(),startPos,startLoc,true);if(this.eat(tt.parenL))node.arguments=this.parseExprList(tt.parenR,false);else node.arguments=empty;return this.finishNode(node,"NewExpression");}; // Parse template expression.
pp.parseTemplateElement=function(){var elem=this.startNode();elem.value={raw:this.input.slice(this.start,this.end),cooked:this.value};this.next();elem.tail=this.type===tt.backQuote;return this.finishNode(elem,"TemplateElement");};pp.parseTemplate=function(){var node=this.startNode();this.next();node.expressions=[];var curElt=this.parseTemplateElement();node.quasis=[curElt];while(!curElt.tail){this.expect(tt.dollarBraceL);node.expressions.push(this.parseExpression());this.expect(tt.braceR);node.quasis.push(curElt=this.parseTemplateElement());}this.next();return this.finishNode(node,"TemplateLiteral");}; // Parse an object literal or binding pattern.
pp.parseObj=function(isPattern,refShorthandDefaultPos){var node=this.startNode(),first=true,propHash={};node.properties=[];this.next();while(!this.eat(tt.braceR)){if(!first){this.expect(tt.comma);if(this.afterTrailingComma(tt.braceR))break;}else first=false;var prop=this.startNode(),isGenerator=undefined,startPos=undefined,startLoc=undefined;if(this.options.ecmaVersion>=6){prop.method=false;prop.shorthand=false;if(isPattern||refShorthandDefaultPos){startPos=this.start;startLoc=this.startLoc;}if(!isPattern)isGenerator=this.eat(tt.star);}this.parsePropertyName(prop);this.parsePropertyValue(prop,isPattern,isGenerator,startPos,startLoc,refShorthandDefaultPos);this.checkPropClash(prop,propHash);node.properties.push(this.finishNode(prop,"Property"));}return this.finishNode(node,isPattern?"ObjectPattern":"ObjectExpression");};pp.parsePropertyValue=function(prop,isPattern,isGenerator,startPos,startLoc,refShorthandDefaultPos){if(this.eat(tt.colon)){prop.value=isPattern?this.parseMaybeDefault(this.start,this.startLoc):this.parseMaybeAssign(false,refShorthandDefaultPos);prop.kind="init";}else if(this.options.ecmaVersion>=6&&this.type===tt.parenL){if(isPattern)this.unexpected();prop.kind="init";prop.method=true;prop.value=this.parseMethod(isGenerator);}else if(this.options.ecmaVersion>=5&&!prop.computed&&prop.key.type==="Identifier"&&(prop.key.name==="get"||prop.key.name==="set")&&this.type!=tt.comma&&this.type!=tt.braceR){if(isGenerator||isPattern)this.unexpected();prop.kind=prop.key.name;this.parsePropertyName(prop);prop.value=this.parseMethod(false);}else if(this.options.ecmaVersion>=6&&!prop.computed&&prop.key.type==="Identifier"){prop.kind="init";if(isPattern){if(this.isKeyword(prop.key.name)||this.strict&&(reservedWords.strictBind(prop.key.name)||reservedWords.strict(prop.key.name))||!this.options.allowReserved&&this.isReservedWord(prop.key.name))this.raise(prop.key.start,"Binding "+prop.key.name);prop.value=this.parseMaybeDefault(startPos,startLoc,prop.key);}else if(this.type===tt.eq&&refShorthandDefaultPos){if(!refShorthandDefaultPos.start)refShorthandDefaultPos.start=this.start;prop.value=this.parseMaybeDefault(startPos,startLoc,prop.key);}else {prop.value=prop.key;}prop.shorthand=true;}else this.unexpected();};pp.parsePropertyName=function(prop){if(this.options.ecmaVersion>=6){if(this.eat(tt.bracketL)){prop.computed=true;prop.key=this.parseMaybeAssign();this.expect(tt.bracketR);return prop.key;}else {prop.computed=false;}}return prop.key=this.type===tt.num||this.type===tt.string?this.parseExprAtom():this.parseIdent(true);}; // Initialize empty function node.
pp.initFunction=function(node){node.id=null;if(this.options.ecmaVersion>=6){node.generator=false;node.expression=false;}}; // Parse object or class method.
pp.parseMethod=function(isGenerator){var node=this.startNode();this.initFunction(node);this.expect(tt.parenL);node.params=this.parseBindingList(tt.parenR,false,false);var allowExpressionBody=undefined;if(this.options.ecmaVersion>=6){node.generator=isGenerator;allowExpressionBody=true;}else {allowExpressionBody=false;}this.parseFunctionBody(node,allowExpressionBody);return this.finishNode(node,"FunctionExpression");}; // Parse arrow function expression with given parameters.
pp.parseArrowExpression=function(node,params){this.initFunction(node);node.params=this.toAssignableList(params,true);this.parseFunctionBody(node,true);return this.finishNode(node,"ArrowFunctionExpression");}; // Parse function body and check parameters.
pp.parseFunctionBody=function(node,allowExpression){var isExpression=allowExpression&&this.type!==tt.braceL;if(isExpression){node.body=this.parseMaybeAssign();node.expression=true;}else { // Start a new scope with regard to labels and the `inFunction`
// flag (restore them to their old value afterwards).
var oldInFunc=this.inFunction,oldInGen=this.inGenerator,oldLabels=this.labels;this.inFunction=true;this.inGenerator=node.generator;this.labels=[];node.body=this.parseBlock(true);node.expression=false;this.inFunction=oldInFunc;this.inGenerator=oldInGen;this.labels=oldLabels;} // If this is a strict mode function, verify that argument names
// are not repeated, and it does not try to bind the words `eval`
// or `arguments`.
if(this.strict||!isExpression&&node.body.body.length&&this.isUseStrict(node.body.body[0])){var nameHash={},oldStrict=this.strict;this.strict=true;if(node.id)this.checkLVal(node.id,true);for(var i=0;i<node.params.length;i++){this.checkLVal(node.params[i],true,nameHash);}this.strict=oldStrict;}}; // Parses a comma-separated list of expressions, and returns them as
// an array. `close` is the token type that ends the list, and
// `allowEmpty` can be turned on to allow subsequent commas with
// nothing in between them to be parsed as `null` (which is needed
// for array literals).
pp.parseExprList=function(close,allowTrailingComma,allowEmpty,refShorthandDefaultPos){var elts=[],first=true;while(!this.eat(close)){if(!first){this.expect(tt.comma);if(allowTrailingComma&&this.afterTrailingComma(close))break;}else first=false;if(allowEmpty&&this.type===tt.comma){elts.push(null);}else {if(this.type===tt.ellipsis)elts.push(this.parseSpread(refShorthandDefaultPos));else elts.push(this.parseMaybeAssign(false,refShorthandDefaultPos));}}return elts;}; // Parse the next token as an identifier. If `liberal` is true (used
// when parsing properties), it will also convert keywords into
// identifiers.
pp.parseIdent=function(liberal){var node=this.startNode();if(liberal&&this.options.allowReserved=="never")liberal=false;if(this.type===tt.name){if(!liberal&&(!this.options.allowReserved&&this.isReservedWord(this.value)||this.strict&&reservedWords.strict(this.value)&&(this.options.ecmaVersion>=6||this.input.slice(this.start,this.end).indexOf("\\")==-1)))this.raise(this.start,"The keyword '"+this.value+"' is reserved");node.name=this.value;}else if(liberal&&this.type.keyword){node.name=this.type.keyword;}else {this.unexpected();}this.next();return this.finishNode(node,"Identifier");}; // Parses yield expression inside generator.
pp.parseYield=function(){var node=this.startNode();this.next();if(this.type==tt.semi||this.canInsertSemicolon()||this.type!=tt.star&&!this.type.startsExpr){node.delegate=false;node.argument=null;}else {node.delegate=this.eat(tt.star);node.argument=this.parseMaybeAssign();}return this.finishNode(node,"YieldExpression");}; // Parses array and generator comprehensions.
pp.parseComprehension=function(node,isGenerator){node.blocks=[];while(this.type===tt._for){var block=this.startNode();this.next();this.expect(tt.parenL);block.left=this.parseBindingAtom();this.checkLVal(block.left,true);this.expectContextual("of");block.right=this.parseExpression();this.expect(tt.parenR);node.blocks.push(this.finishNode(block,"ComprehensionBlock"));}node.filter=this.eat(tt._if)?this.parseParenExpression():null;node.body=this.parseExpression();this.expect(isGenerator?tt.parenR:tt.bracketR);node.generator=isGenerator;return this.finishNode(node,"ComprehensionExpression");};},{"./identifier":7,"./state":13,"./tokentype":17,"./util":18}],7:[function(_dereq_,module,exports){ // Test whether a given character code starts an identifier.
"use strict";exports.isIdentifierStart=isIdentifierStart; // Test whether a given character is part of an identifier.
exports.isIdentifierChar=isIdentifierChar;exports.__esModule=true; // This is a trick taken from Esprima. It turns out that, on
// non-Chrome browsers, to check whether a string is in a set, a
// predicate containing a big ugly `switch` statement is faster than
// a regular expression, and on Chrome the two are about on par.
// This function uses `eval` (non-lexical) to produce such a
// predicate from a space-separated string of words.
//
// It starts by sorting the words by length.
function makePredicate(words){words=words.split(" ");var f="",cats=[];out: for(var i=0;i<words.length;++i){for(var j=0;j<cats.length;++j){if(cats[j][0].length==words[i].length){cats[j].push(words[i]);continue out;}}cats.push([words[i]]);}function compareTo(arr){if(arr.length==1){return f+="return str === "+JSON.stringify(arr[0])+";";}f+="switch(str){";for(var i=0;i<arr.length;++i){f+="case "+JSON.stringify(arr[i])+":";}f+="return true}return false;";} // When there are more than three length categories, an outer
// switch first dispatches on the lengths, to save on comparisons.
if(cats.length>3){cats.sort(function(a,b){return b.length-a.length;});f+="switch(str.length){";for(var i=0;i<cats.length;++i){var cat=cats[i];f+="case "+cat[0].length+":";compareTo(cat);}f+="}" // Otherwise, simply generate a flat `switch` statement.
;}else {compareTo(words);}return new Function("str",f);} // Reserved word lists for various dialects of the language
var reservedWords={3:makePredicate("abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile"),5:makePredicate("class enum extends super const export import"),6:makePredicate("enum await"),strict:makePredicate("implements interface let package private protected public static yield"),strictBind:makePredicate("eval arguments")};exports.reservedWords=reservedWords; // And the keywords
var ecma5AndLessKeywords="break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";var keywords={5:makePredicate(ecma5AndLessKeywords),6:makePredicate(ecma5AndLessKeywords+" let const class extends export import yield super")};exports.keywords=keywords; // ## Character categories
// Big ugly regular expressions that match characters in the
// whitespace, identifier, and identifier-start categories. These
// are only applied when a character is found to actually have a
// code point above 128.
// Generated by `tools/generate-identifier-regex.js`.
var nonASCIIidentifierStartChars="ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙա-ևא-תװ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࢠ-ࢲऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘౙౠౡಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠೡೱೲഅ-ഌഎ-ഐഒ-ഺഽൎൠൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄງຈຊຍດ-ທນ-ຟມ-ຣລວສຫອ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏼᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡷᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᧁ-ᧇᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭋᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᳩ-ᳬᳮ-ᳱᳵᳶᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄭㄱ-ㆎㆠ-ㆺㇰ-ㇿ㐀-䶵一-鿌ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꞎꞐ-ꞭꞰꞱꟷ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭟꭤꭥꯀ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ";var nonASCIIidentifierChars="‌‍·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ࣤ-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ଁ-ଃ଼ା-ୄେୈୋ-୍ୖୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఃా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ഁ-ഃാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ංඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ູົຼ່-ໍ໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜔ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠐-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏ᦰ-ᧀᧈᧉ᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭ᳲ-᳴᳸᳹᷀-᷵᷼-᷿‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯꘠-꘩꙯ꙴ-꙽ꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧꢀꢁꢴ-꣄꣐-꣙꣠-꣱꤀-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︭︳︴﹍-﹏０-９＿";var nonASCIIidentifierStart=new RegExp("["+nonASCIIidentifierStartChars+"]");var nonASCIIidentifier=new RegExp("["+nonASCIIidentifierStartChars+nonASCIIidentifierChars+"]");nonASCIIidentifierStartChars=nonASCIIidentifierChars=null; // These are a run-length and offset encoded representation of the
// >0xffff code points that are a valid part of identifiers. The
// offset starts at 0x10000, and each pair of numbers represents an
// offset to the next range, and then a size of the range. They were
// generated by tools/generate-identifier-regex.js
var astralIdentifierStartCodes=[0,11,2,25,2,18,2,1,2,14,3,13,35,122,70,52,268,28,4,48,48,31,17,26,6,37,11,29,3,35,5,7,2,4,43,157,99,39,9,51,157,310,10,21,11,7,153,5,3,0,2,43,2,1,4,0,3,22,11,22,10,30,98,21,11,25,71,55,7,1,65,0,16,3,2,2,2,26,45,28,4,28,36,7,2,27,28,53,11,21,11,18,14,17,111,72,955,52,76,44,33,24,27,35,42,34,4,0,13,47,15,3,22,0,38,17,2,24,133,46,39,7,3,1,3,21,2,6,2,1,2,4,4,0,32,4,287,47,21,1,2,0,185,46,82,47,21,0,60,42,502,63,32,0,449,56,1288,920,104,110,2962,1070,13266,568,8,30,114,29,19,47,17,3,32,20,6,18,881,68,12,0,67,12,16481,1,3071,106,6,12,4,8,8,9,5991,84,2,70,2,1,3,0,3,1,3,3,2,11,2,0,2,6,2,64,2,3,3,7,2,6,2,27,2,3,2,4,2,0,4,6,2,339,3,24,2,24,2,30,2,24,2,30,2,24,2,30,2,24,2,30,2,24,2,7,4149,196,1340,3,2,26,2,1,2,0,3,0,2,9,2,3,2,0,2,0,7,0,5,0,2,0,2,0,2,2,2,1,2,0,3,0,2,0,2,0,2,0,2,0,2,1,2,0,3,3,2,6,2,3,2,3,2,0,2,9,2,16,6,2,2,4,2,16,4421,42710,42,4148,12,221,16355,541];var astralIdentifierCodes=[509,0,227,0,150,4,294,9,1368,2,2,1,6,3,41,2,5,0,166,1,1306,2,54,14,32,9,16,3,46,10,54,9,7,2,37,13,2,9,52,0,13,2,49,13,16,9,83,11,168,11,6,9,8,2,57,0,2,6,3,1,3,2,10,0,11,1,3,6,4,4,316,19,13,9,214,6,3,8,112,16,16,9,82,12,9,9,535,9,20855,9,135,4,60,6,26,9,1016,45,17,3,19723,1,5319,4,4,5,9,7,3,6,31,3,149,2,1418,49,4305,6,792618,239]; // This has a complexity linear to the value of the code. The
// assumption is that looking up astral identifier characters is
// rare.
function isInAstralSet(code,set){var pos=65536;for(var i=0;i<set.length;i+=2){pos+=set[i];if(pos>code){return false;}pos+=set[i+1];if(pos>=code){return true;}}}function isIdentifierStart(code,astral){if(code<65){return code===36;}if(code<91){return true;}if(code<97){return code===95;}if(code<123){return true;}if(code<=65535){return code>=170&&nonASCIIidentifierStart.test(String.fromCharCode(code));}if(astral===false){return false;}return isInAstralSet(code,astralIdentifierStartCodes);}function isIdentifierChar(code,astral){if(code<48){return code===36;}if(code<58){return true;}if(code<65){return false;}if(code<91){return true;}if(code<97){return code===95;}if(code<123){return true;}if(code<=65535){return code>=170&&nonASCIIidentifier.test(String.fromCharCode(code));}if(astral===false){return false;}return isInAstralSet(code,astralIdentifierStartCodes)||isInAstralSet(code,astralIdentifierCodes);}},{}],8:[function(_dereq_,module,exports){"use strict";var _classCallCheck=function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}; // The `getLineInfo` function is mostly useful when the
// `locations` option is off (for performance reasons) and you
// want to find the line/column position for a given character
// offset. `input` should be the code string that the offset refers
// into.
exports.getLineInfo=getLineInfo;exports.__esModule=true;var Parser=_dereq_("./state").Parser;var lineBreakG=_dereq_("./whitespace").lineBreakG;var deprecate=_dereq_("util").deprecate; // These are used when `options.locations` is on, for the
// `startLoc` and `endLoc` properties.
var Position=exports.Position=function(){function Position(line,col){_classCallCheck(this,Position);this.line=line;this.column=col;}Position.prototype.offset=function offset(n){return new Position(this.line,this.column+n);};return Position;}();var SourceLocation=exports.SourceLocation=function SourceLocation(p,start,end){_classCallCheck(this,SourceLocation);this.start=start;this.end=end;if(p.sourceFile!==null)this.source=p.sourceFile;};function getLineInfo(input,offset){for(var line=1,cur=0;;){lineBreakG.lastIndex=cur;var match=lineBreakG.exec(input);if(match&&match.index<offset){++line;cur=match.index+match[0].length;}else {return new Position(line,offset-cur);}}}var pp=Parser.prototype; // This function is used to raise exceptions on parse errors. It
// takes an offset integer (into the current `input`) to indicate
// the location of the error, attaches the position to the end
// of the error message, and then raises a `SyntaxError` with that
// message.
pp.raise=function(pos,message){var loc=getLineInfo(this.input,pos);message+=" ("+loc.line+":"+loc.column+")";var err=new SyntaxError(message);err.pos=pos;err.loc=loc;err.raisedAt=this.pos;throw err;};pp.curPosition=function(){return new Position(this.curLine,this.pos-this.lineStart);};pp.markPosition=function(){return this.options.locations?[this.start,this.startLoc]:this.start;};},{"./state":13,"./whitespace":19,"util":5}],9:[function(_dereq_,module,exports){"use strict";var tt=_dereq_("./tokentype").types;var Parser=_dereq_("./state").Parser;var reservedWords=_dereq_("./identifier").reservedWords;var has=_dereq_("./util").has;var pp=Parser.prototype; // Convert existing expression atom to assignable pattern
// if possible.
pp.toAssignable=function(node,isBinding){if(this.options.ecmaVersion>=6&&node){switch(node.type){case "Identifier":case "ObjectPattern":case "ArrayPattern":case "AssignmentPattern":break;case "ObjectExpression":node.type="ObjectPattern";for(var i=0;i<node.properties.length;i++){var prop=node.properties[i];if(prop.kind!=="init")this.raise(prop.key.start,"Object pattern can't contain getter or setter");this.toAssignable(prop.value,isBinding);}break;case "ArrayExpression":node.type="ArrayPattern";this.toAssignableList(node.elements,isBinding);break;case "AssignmentExpression":if(node.operator==="="){node.type="AssignmentPattern";}else {this.raise(node.left.end,"Only '=' operator can be used for specifying default value.");}break;case "ParenthesizedExpression":node.expression=this.toAssignable(node.expression,isBinding);break;case "MemberExpression":if(!isBinding)break;default:this.raise(node.start,"Assigning to rvalue");}}return node;}; // Convert list of expression atoms to binding list.
pp.toAssignableList=function(exprList,isBinding){var end=exprList.length;if(end){var last=exprList[end-1];if(last&&last.type=="RestElement"){--end;}else if(last&&last.type=="SpreadElement"){last.type="RestElement";var arg=last.argument;this.toAssignable(arg,isBinding);if(arg.type!=="Identifier"&&arg.type!=="MemberExpression"&&arg.type!=="ArrayPattern")this.unexpected(arg.start);--end;}}for(var i=0;i<end;i++){var elt=exprList[i];if(elt)this.toAssignable(elt,isBinding);}return exprList;}; // Parses spread element.
pp.parseSpread=function(refShorthandDefaultPos){var node=this.startNode();this.next();node.argument=this.parseMaybeAssign(refShorthandDefaultPos);return this.finishNode(node,"SpreadElement");};pp.parseRest=function(){var node=this.startNode();this.next();node.argument=this.type===tt.name||this.type===tt.bracketL?this.parseBindingAtom():this.unexpected();return this.finishNode(node,"RestElement");}; // Parses lvalue (assignable) atom.
pp.parseBindingAtom=function(){if(this.options.ecmaVersion<6)return this.parseIdent();switch(this.type){case tt.name:return this.parseIdent();case tt.bracketL:var node=this.startNode();this.next();node.elements=this.parseBindingList(tt.bracketR,true,true);return this.finishNode(node,"ArrayPattern");case tt.braceL:return this.parseObj(true);default:this.unexpected();}};pp.parseBindingList=function(close,allowEmpty,allowTrailingComma){var elts=[],first=true;while(!this.eat(close)){if(first)first=false;else this.expect(tt.comma);if(allowEmpty&&this.type===tt.comma){elts.push(null);}else if(allowTrailingComma&&this.afterTrailingComma(close)){break;}else if(this.type===tt.ellipsis){var rest=this.parseRest();this.parseBindingListItem(rest);elts.push(rest);this.expect(close);break;}else {var elem=this.parseMaybeDefault(this.start,this.startLoc);this.parseBindingListItem(elem);elts.push(elem);}}return elts;};pp.parseBindingListItem=function(param){return param;}; // Parses assignment pattern around given atom if possible.
pp.parseMaybeDefault=function(startPos,startLoc,left){if(Array.isArray(startPos)){if(this.options.locations&&noCalls===undefined){ // shift arguments to left by one
left=startLoc; // flatten startPos
startLoc=startPos[1];startPos=startPos[0];}}left=left||this.parseBindingAtom();if(!this.eat(tt.eq))return left;var node=this.startNodeAt(startPos,startLoc);node.operator="=";node.left=left;node.right=this.parseMaybeAssign();return this.finishNode(node,"AssignmentPattern");}; // Verify that a node is an lval — something that can be assigned
// to.
pp.checkLVal=function(expr,isBinding,checkClashes){switch(expr.type){case "Identifier":if(this.strict&&(reservedWords.strictBind(expr.name)||reservedWords.strict(expr.name)))this.raise(expr.start,(isBinding?"Binding ":"Assigning to ")+expr.name+" in strict mode");if(checkClashes){if(has(checkClashes,expr.name))this.raise(expr.start,"Argument name clash in strict mode");checkClashes[expr.name]=true;}break;case "MemberExpression":if(isBinding)this.raise(expr.start,(isBinding?"Binding":"Assigning to")+" member expression");break;case "ObjectPattern":for(var i=0;i<expr.properties.length;i++){this.checkLVal(expr.properties[i].value,isBinding,checkClashes);}break;case "ArrayPattern":for(var i=0;i<expr.elements.length;i++){var elem=expr.elements[i];if(elem)this.checkLVal(elem,isBinding,checkClashes);}break;case "AssignmentPattern":this.checkLVal(expr.left,isBinding,checkClashes);break;case "RestElement":this.checkLVal(expr.argument,isBinding,checkClashes);break;case "ParenthesizedExpression":this.checkLVal(expr.expression,isBinding,checkClashes);break;default:this.raise(expr.start,(isBinding?"Binding":"Assigning to")+" rvalue");}};},{"./identifier":7,"./state":13,"./tokentype":17,"./util":18}],10:[function(_dereq_,module,exports){"use strict";var _classCallCheck=function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}};exports.__esModule=true;var Parser=_dereq_("./state").Parser;var SourceLocation=_dereq_("./location").SourceLocation; // Start an AST node, attaching a start offset.
var pp=Parser.prototype;var Node=exports.Node=function Node(){_classCallCheck(this,Node);};pp.startNode=function(){var node=new Node();node.start=this.start;if(this.options.locations)node.loc=new SourceLocation(this,this.startLoc);if(this.options.directSourceFile)node.sourceFile=this.options.directSourceFile;if(this.options.ranges)node.range=[this.start,0];return node;};pp.startNodeAt=function(pos,loc){var node=new Node();if(Array.isArray(pos)){if(this.options.locations&&loc===undefined){ // flatten pos
loc=pos[1];pos=pos[0];}}node.start=pos;if(this.options.locations)node.loc=new SourceLocation(this,loc);if(this.options.directSourceFile)node.sourceFile=this.options.directSourceFile;if(this.options.ranges)node.range=[pos,0];return node;}; // Finish an AST node, adding `type` and `end` properties.
pp.finishNode=function(node,type){node.type=type;node.end=this.lastTokEnd;if(this.options.locations)node.loc.end=this.lastTokEndLoc;if(this.options.ranges)node.range[1]=this.lastTokEnd;return node;}; // Finish node at given position
pp.finishNodeAt=function(node,type,pos,loc){node.type=type;if(Array.isArray(pos)){if(this.options.locations&&loc===undefined){ // flatten pos
loc=pos[1];pos=pos[0];}}node.end=pos;if(this.options.locations)node.loc.end=loc;if(this.options.ranges)node.range[1]=pos;return node;};},{"./location":8,"./state":13}],11:[function(_dereq_,module,exports){ // Interpret and default an options object
"use strict";exports.getOptions=getOptions;exports.__esModule=true;var _util=_dereq_("./util");var has=_util.has;var isArray=_util.isArray;var SourceLocation=_dereq_("./location").SourceLocation; // A second optional argument can be given to further configure
// the parser process. These options are recognized:
var defaultOptions={ // `ecmaVersion` indicates the ECMAScript version to parse. Must
// be either 3, or 5, or 6. This influences support for strict
// mode, the set of reserved words, support for getters and
// setters and other features.
ecmaVersion:5, // Source type ("script" or "module") for different semantics
sourceType:"script", // `onInsertedSemicolon` can be a callback that will be called
// when a semicolon is automatically inserted. It will be passed
// th position of the comma as an offset, and if `locations` is
// enabled, it is given the location as a `{line, column}` object
// as second argument.
onInsertedSemicolon:null, // `onTrailingComma` is similar to `onInsertedSemicolon`, but for
// trailing commas.
onTrailingComma:null, // By default, reserved words are not enforced. Disable
// `allowReserved` to enforce them. When this option has the
// value "never", reserved words and keywords can also not be
// used as property names.
allowReserved:true, // When enabled, a return at the top level is not considered an
// error.
allowReturnOutsideFunction:false, // When enabled, import/export statements are not constrained to
// appearing at the top of the program.
allowImportExportEverywhere:false, // When enabled, hashbang directive in the beginning of file
// is allowed and treated as a line comment.
allowHashBang:false, // When `locations` is on, `loc` properties holding objects with
// `start` and `end` properties in `{line, column}` form (with
// line being 1-based and column 0-based) will be attached to the
// nodes.
locations:false, // A function can be passed as `onToken` option, which will
// cause Acorn to call that function with object in the same
// format as tokenize() returns. Note that you are not
// allowed to call the parser from the callback—that will
// corrupt its internal state.
onToken:null, // A function can be passed as `onComment` option, which will
// cause Acorn to call that function with `(block, text, start,
// end)` parameters whenever a comment is skipped. `block` is a
// boolean indicating whether this is a block (`/* */`) comment,
// `text` is the content of the comment, and `start` and `end` are
// character offsets that denote the start and end of the comment.
// When the `locations` option is on, two more parameters are
// passed, the full `{line, column}` locations of the start and
// end of the comments. Note that you are not allowed to call the
// parser from the callback—that will corrupt its internal state.
onComment:null, // Nodes have their start and end characters offsets recorded in
// `start` and `end` properties (directly on the node, rather than
// the `loc` object, which holds line/column data. To also add a
// [semi-standardized][range] `range` property holding a `[start,
// end]` array with the same numbers, set the `ranges` option to
// `true`.
//
// [range]: https://bugzilla.mozilla.org/show_bug.cgi?id=745678
ranges:false, // It is possible to parse multiple files into a single AST by
// passing the tree produced by parsing the first file as
// `program` option in subsequent parses. This will add the
// toplevel forms of the parsed file to the `Program` (top) node
// of an existing parse tree.
program:null, // When `locations` is on, you can pass this to record the source
// file in every node's `loc` object.
sourceFile:null, // This value, if given, is stored in every node, whether
// `locations` is on or off.
directSourceFile:null, // When enabled, parenthesized expressions are represented by
// (non-standard) ParenthesizedExpression nodes
preserveParens:false,plugins:{}};exports.defaultOptions=defaultOptions;function getOptions(opts){var options={};for(var opt in defaultOptions){options[opt]=opts&&has(opts,opt)?opts[opt]:defaultOptions[opt];}if(isArray(options.onToken)){(function(){var tokens=options.onToken;options.onToken=function(token){return tokens.push(token);};})();}if(isArray(options.onComment))options.onComment=pushComment(options,options.onComment);return options;}function pushComment(options,array){return function(block,text,start,end,startLoc,endLoc){var comment={type:block?"Block":"Line",value:text,start:start,end:end};if(options.locations)comment.loc=new SourceLocation(this,startLoc,endLoc);if(options.ranges)comment.range=[start,end];array.push(comment);};}},{"./location":8,"./util":18}],12:[function(_dereq_,module,exports){"use strict";var tt=_dereq_("./tokentype").types;var Parser=_dereq_("./state").Parser;var lineBreak=_dereq_("./whitespace").lineBreak;var pp=Parser.prototype; // ## Parser utilities
// Test whether a statement node is the string literal `"use strict"`.
pp.isUseStrict=function(stmt){return this.options.ecmaVersion>=5&&stmt.type==="ExpressionStatement"&&stmt.expression.type==="Literal"&&stmt.expression.value==="use strict";}; // Predicate that tests whether the next token is of the given
// type, and if yes, consumes it as a side effect.
pp.eat=function(type){if(this.type===type){this.next();return true;}else {return false;}}; // Tests whether parsed token is a contextual keyword.
pp.isContextual=function(name){return this.type===tt.name&&this.value===name;}; // Consumes contextual keyword if possible.
pp.eatContextual=function(name){return this.value===name&&this.eat(tt.name);}; // Asserts that following token is given contextual keyword.
pp.expectContextual=function(name){if(!this.eatContextual(name))this.unexpected();}; // Test whether a semicolon can be inserted at the current position.
pp.canInsertSemicolon=function(){return this.type===tt.eof||this.type===tt.braceR||lineBreak.test(this.input.slice(this.lastTokEnd,this.start));};pp.insertSemicolon=function(){if(this.canInsertSemicolon()){if(this.options.onInsertedSemicolon)this.options.onInsertedSemicolon(this.lastTokEnd,this.lastTokEndLoc);return true;}}; // Consume a semicolon, or, failing that, see if we are allowed to
// pretend that there is a semicolon at this position.
pp.semicolon=function(){if(!this.eat(tt.semi)&&!this.insertSemicolon())this.unexpected();};pp.afterTrailingComma=function(tokType){if(this.type==tokType){if(this.options.onTrailingComma)this.options.onTrailingComma(this.lastTokStart,this.lastTokStartLoc);this.next();return true;}}; // Expect a token of a given type. If found, consume it, otherwise,
// raise an unexpected token error.
pp.expect=function(type){this.eat(type)||this.unexpected();}; // Raise an unexpected token error.
pp.unexpected=function(pos){this.raise(pos!=null?pos:this.start,"Unexpected token");};},{"./state":13,"./tokentype":17,"./whitespace":19}],13:[function(_dereq_,module,exports){"use strict";exports.Parser=Parser;exports.__esModule=true;var _identifier=_dereq_("./identifier");var reservedWords=_identifier.reservedWords;var keywords=_identifier.keywords;var tt=_dereq_("./tokentype").types;var lineBreak=_dereq_("./whitespace").lineBreak;function Parser(options,input,startPos){this.options=options;this.sourceFile=this.options.sourceFile||null;this.isKeyword=keywords[this.options.ecmaVersion>=6?6:5];this.isReservedWord=reservedWords[this.options.ecmaVersion];this.input=input; // Load plugins
this.loadPlugins(this.options.plugins); // Set up token state
// The current position of the tokenizer in the input.
if(startPos){this.pos=startPos;this.lineStart=Math.max(0,this.input.lastIndexOf("\n",startPos));this.curLine=this.input.slice(0,this.lineStart).split(lineBreak).length;}else {this.pos=this.lineStart=0;this.curLine=1;} // Properties of the current token:
// Its type
this.type=tt.eof; // For tokens that include more information than their type, the value
this.value=null; // Its start and end offset
this.start=this.end=this.pos; // And, if locations are used, the {line, column} object
// corresponding to those offsets
this.startLoc=this.endLoc=null; // Position information for the previous token
this.lastTokEndLoc=this.lastTokStartLoc=null;this.lastTokStart=this.lastTokEnd=this.pos; // The context stack is used to superficially track syntactic
// context to predict whether a regular expression is allowed in a
// given position.
this.context=this.initialContext();this.exprAllowed=true; // Figure out if it's a module code.
this.strict=this.inModule=this.options.sourceType==="module"; // Used to signify the start of a potential arrow function
this.potentialArrowAt=-1; // Flags to track whether we are in a function, a generator.
this.inFunction=this.inGenerator=false; // Labels in scope.
this.labels=[]; // If enabled, skip leading hashbang line.
if(this.pos===0&&this.options.allowHashBang&&this.input.slice(0,2)==="#!")this.skipLineComment(2);}Parser.prototype.extend=function(name,f){this[name]=f(this[name]);}; // Registered plugins
var plugins={};exports.plugins=plugins;Parser.prototype.loadPlugins=function(plugins){for(var _name in plugins){var plugin=exports.plugins[_name];if(!plugin)throw new Error("Plugin '"+_name+"' not found");plugin(this,plugins[_name]);}};},{"./identifier":7,"./tokentype":17,"./whitespace":19}],14:[function(_dereq_,module,exports){"use strict";var tt=_dereq_("./tokentype").types;var Parser=_dereq_("./state").Parser;var lineBreak=_dereq_("./whitespace").lineBreak;var pp=Parser.prototype; // ### Statement parsing
// Parse a program. Initializes the parser, reads any number of
// statements, and wraps them in a Program node.  Optionally takes a
// `program` argument.  If present, the statements will be appended
// to its body instead of creating a new node.
pp.parseTopLevel=function(node){var first=true;if(!node.body)node.body=[];while(this.type!==tt.eof){var stmt=this.parseStatement(true,true);node.body.push(stmt);if(first&&this.isUseStrict(stmt))this.setStrict(true);first=false;}this.next();if(this.options.ecmaVersion>=6){node.sourceType=this.options.sourceType;}return this.finishNode(node,"Program");};var loopLabel={kind:"loop"},switchLabel={kind:"switch"}; // Parse a single statement.
//
// If expecting a statement and finding a slash operator, parse a
// regular expression literal. This is to handle cases like
// `if (foo) /blah/.exec(foo)`, where looking at the previous token
// does not help.
pp.parseStatement=function(declaration,topLevel){var starttype=this.type,node=this.startNode(); // Most types of statements are recognized by the keyword they
// start with. Many are trivial to parse, some require a bit of
// complexity.
switch(starttype){case tt._break:case tt._continue:return this.parseBreakContinueStatement(node,starttype.keyword);case tt._debugger:return this.parseDebuggerStatement(node);case tt._do:return this.parseDoStatement(node);case tt._for:return this.parseForStatement(node);case tt._function:if(!declaration&&this.options.ecmaVersion>=6)this.unexpected();return this.parseFunctionStatement(node);case tt._class:if(!declaration)this.unexpected();return this.parseClass(node,true);case tt._if:return this.parseIfStatement(node);case tt._return:return this.parseReturnStatement(node);case tt._switch:return this.parseSwitchStatement(node);case tt._throw:return this.parseThrowStatement(node);case tt._try:return this.parseTryStatement(node);case tt._let:case tt._const:if(!declaration)this.unexpected(); // NOTE: falls through to _var
case tt._var:return this.parseVarStatement(node,starttype);case tt._while:return this.parseWhileStatement(node);case tt._with:return this.parseWithStatement(node);case tt.braceL:return this.parseBlock();case tt.semi:return this.parseEmptyStatement(node);case tt._export:case tt._import:if(!this.options.allowImportExportEverywhere){if(!topLevel)this.raise(this.start,"'import' and 'export' may only appear at the top level");if(!this.inModule)this.raise(this.start,"'import' and 'export' may appear only with 'sourceType: module'");}return starttype===tt._import?this.parseImport(node):this.parseExport(node); // If the statement does not start with a statement keyword or a
// brace, it's an ExpressionStatement or LabeledStatement. We
// simply start parsing an expression, and afterwards, if the
// next token is a colon and the expression was a simple
// Identifier node, we switch to interpreting it as a label.
default:var maybeName=this.value,expr=this.parseExpression();if(starttype===tt.name&&expr.type==="Identifier"&&this.eat(tt.colon))return this.parseLabeledStatement(node,maybeName,expr);else return this.parseExpressionStatement(node,expr);}};pp.parseBreakContinueStatement=function(node,keyword){var isBreak=keyword=="break";this.next();if(this.eat(tt.semi)||this.insertSemicolon())node.label=null;else if(this.type!==tt.name)this.unexpected();else {node.label=this.parseIdent();this.semicolon();} // Verify that there is an actual destination to break or
// continue to.
for(var i=0;i<this.labels.length;++i){var lab=this.labels[i];if(node.label==null||lab.name===node.label.name){if(lab.kind!=null&&(isBreak||lab.kind==="loop"))break;if(node.label&&isBreak)break;}}if(i===this.labels.length)this.raise(node.start,"Unsyntactic "+keyword);return this.finishNode(node,isBreak?"BreakStatement":"ContinueStatement");};pp.parseDebuggerStatement=function(node){this.next();this.semicolon();return this.finishNode(node,"DebuggerStatement");};pp.parseDoStatement=function(node){this.next();this.labels.push(loopLabel);node.body=this.parseStatement(false);this.labels.pop();this.expect(tt._while);node.test=this.parseParenExpression();if(this.options.ecmaVersion>=6)this.eat(tt.semi);else this.semicolon();return this.finishNode(node,"DoWhileStatement");}; // Disambiguating between a `for` and a `for`/`in` or `for`/`of`
// loop is non-trivial. Basically, we have to parse the init `var`
// statement or expression, disallowing the `in` operator (see
// the second parameter to `parseExpression`), and then check
// whether the next token is `in` or `of`. When there is no init
// part (semicolon immediately after the opening parenthesis), it
// is a regular `for` loop.
pp.parseForStatement=function(node){this.next();this.labels.push(loopLabel);this.expect(tt.parenL);if(this.type===tt.semi)return this.parseFor(node,null);if(this.type===tt._var||this.type===tt._let||this.type===tt._const){var _init=this.startNode(),varKind=this.type;this.next();this.parseVar(_init,true,varKind);this.finishNode(_init,"VariableDeclaration");if((this.type===tt._in||this.options.ecmaVersion>=6&&this.isContextual("of"))&&_init.declarations.length===1&&!(varKind!==tt._var&&_init.declarations[0].init))return this.parseForIn(node,_init);return this.parseFor(node,_init);}var refShorthandDefaultPos={start:0};var init=this.parseExpression(true,refShorthandDefaultPos);if(this.type===tt._in||this.options.ecmaVersion>=6&&this.isContextual("of")){this.toAssignable(init);this.checkLVal(init);return this.parseForIn(node,init);}else if(refShorthandDefaultPos.start){this.unexpected(refShorthandDefaultPos.start);}return this.parseFor(node,init);};pp.parseFunctionStatement=function(node){this.next();return this.parseFunction(node,true);};pp.parseIfStatement=function(node){this.next();node.test=this.parseParenExpression();node.consequent=this.parseStatement(false);node.alternate=this.eat(tt._else)?this.parseStatement(false):null;return this.finishNode(node,"IfStatement");};pp.parseReturnStatement=function(node){if(!this.inFunction&&!this.options.allowReturnOutsideFunction)this.raise(this.start,"'return' outside of function");this.next(); // In `return` (and `break`/`continue`), the keywords with
// optional arguments, we eagerly look for a semicolon or the
// possibility to insert one.
if(this.eat(tt.semi)||this.insertSemicolon())node.argument=null;else {node.argument=this.parseExpression();this.semicolon();}return this.finishNode(node,"ReturnStatement");};pp.parseSwitchStatement=function(node){this.next();node.discriminant=this.parseParenExpression();node.cases=[];this.expect(tt.braceL);this.labels.push(switchLabel); // Statements under must be grouped (by label) in SwitchCase
// nodes. `cur` is used to keep the node that we are currently
// adding statements to.
for(var cur,sawDefault;this.type!=tt.braceR;){if(this.type===tt._case||this.type===tt._default){var isCase=this.type===tt._case;if(cur)this.finishNode(cur,"SwitchCase");node.cases.push(cur=this.startNode());cur.consequent=[];this.next();if(isCase){cur.test=this.parseExpression();}else {if(sawDefault)this.raise(this.lastTokStart,"Multiple default clauses");sawDefault=true;cur.test=null;}this.expect(tt.colon);}else {if(!cur)this.unexpected();cur.consequent.push(this.parseStatement(true));}}if(cur)this.finishNode(cur,"SwitchCase");this.next(); // Closing brace
this.labels.pop();return this.finishNode(node,"SwitchStatement");};pp.parseThrowStatement=function(node){this.next();if(lineBreak.test(this.input.slice(this.lastTokEnd,this.start)))this.raise(this.lastTokEnd,"Illegal newline after throw");node.argument=this.parseExpression();this.semicolon();return this.finishNode(node,"ThrowStatement");}; // Reused empty array added for node fields that are always empty.
var empty=[];pp.parseTryStatement=function(node){this.next();node.block=this.parseBlock();node.handler=null;if(this.type===tt._catch){var clause=this.startNode();this.next();this.expect(tt.parenL);clause.param=this.parseBindingAtom();this.checkLVal(clause.param,true);this.expect(tt.parenR);clause.guard=null;clause.body=this.parseBlock();node.handler=this.finishNode(clause,"CatchClause");}node.guardedHandlers=empty;node.finalizer=this.eat(tt._finally)?this.parseBlock():null;if(!node.handler&&!node.finalizer)this.raise(node.start,"Missing catch or finally clause");return this.finishNode(node,"TryStatement");};pp.parseVarStatement=function(node,kind){this.next();this.parseVar(node,false,kind);this.semicolon();return this.finishNode(node,"VariableDeclaration");};pp.parseWhileStatement=function(node){this.next();node.test=this.parseParenExpression();this.labels.push(loopLabel);node.body=this.parseStatement(false);this.labels.pop();return this.finishNode(node,"WhileStatement");};pp.parseWithStatement=function(node){if(this.strict)this.raise(this.start,"'with' in strict mode");this.next();node.object=this.parseParenExpression();node.body=this.parseStatement(false);return this.finishNode(node,"WithStatement");};pp.parseEmptyStatement=function(node){this.next();return this.finishNode(node,"EmptyStatement");};pp.parseLabeledStatement=function(node,maybeName,expr){for(var i=0;i<this.labels.length;++i){if(this.labels[i].name===maybeName)this.raise(expr.start,"Label '"+maybeName+"' is already declared");}var kind=this.type.isLoop?"loop":this.type===tt._switch?"switch":null;this.labels.push({name:maybeName,kind:kind});node.body=this.parseStatement(true);this.labels.pop();node.label=expr;return this.finishNode(node,"LabeledStatement");};pp.parseExpressionStatement=function(node,expr){node.expression=expr;this.semicolon();return this.finishNode(node,"ExpressionStatement");}; // Parse a semicolon-enclosed block of statements, handling `"use
// strict"` declarations when `allowStrict` is true (used for
// function bodies).
pp.parseBlock=function(allowStrict){var node=this.startNode(),first=true,oldStrict=undefined;node.body=[];this.expect(tt.braceL);while(!this.eat(tt.braceR)){var stmt=this.parseStatement(true);node.body.push(stmt);if(first&&allowStrict&&this.isUseStrict(stmt)){oldStrict=this.strict;this.setStrict(this.strict=true);}first=false;}if(oldStrict===false)this.setStrict(false);return this.finishNode(node,"BlockStatement");}; // Parse a regular `for` loop. The disambiguation code in
// `parseStatement` will already have parsed the init statement or
// expression.
pp.parseFor=function(node,init){node.init=init;this.expect(tt.semi);node.test=this.type===tt.semi?null:this.parseExpression();this.expect(tt.semi);node.update=this.type===tt.parenR?null:this.parseExpression();this.expect(tt.parenR);node.body=this.parseStatement(false);this.labels.pop();return this.finishNode(node,"ForStatement");}; // Parse a `for`/`in` and `for`/`of` loop, which are almost
// same from parser's perspective.
pp.parseForIn=function(node,init){var type=this.type===tt._in?"ForInStatement":"ForOfStatement";this.next();node.left=init;node.right=this.parseExpression();this.expect(tt.parenR);node.body=this.parseStatement(false);this.labels.pop();return this.finishNode(node,type);}; // Parse a list of variable declarations.
pp.parseVar=function(node,isFor,kind){node.declarations=[];node.kind=kind.keyword;for(;;){var decl=this.startNode();this.parseVarId(decl);if(this.eat(tt.eq)){decl.init=this.parseMaybeAssign(isFor);}else if(kind===tt._const&&!(this.type===tt._in||this.options.ecmaVersion>=6&&this.isContextual("of"))){this.unexpected();}else if(decl.id.type!="Identifier"&&!(isFor&&(this.type===tt._in||this.isContextual("of")))){this.raise(this.lastTokEnd,"Complex binding patterns require an initialization value");}else {decl.init=null;}node.declarations.push(this.finishNode(decl,"VariableDeclarator"));if(!this.eat(tt.comma))break;}return node;};pp.parseVarId=function(decl){decl.id=this.parseBindingAtom();this.checkLVal(decl.id,true);}; // Parse a function declaration or literal (depending on the
// `isStatement` parameter).
pp.parseFunction=function(node,isStatement,allowExpressionBody){this.initFunction(node);if(this.options.ecmaVersion>=6)node.generator=this.eat(tt.star);if(isStatement||this.type===tt.name)node.id=this.parseIdent();this.parseFunctionParams(node);this.parseFunctionBody(node,allowExpressionBody);return this.finishNode(node,isStatement?"FunctionDeclaration":"FunctionExpression");};pp.parseFunctionParams=function(node){this.expect(tt.parenL);node.params=this.parseBindingList(tt.parenR,false,false);}; // Parse a class declaration or literal (depending on the
// `isStatement` parameter).
pp.parseClass=function(node,isStatement){this.next();this.parseClassId(node,isStatement);this.parseClassSuper(node);var classBody=this.startNode();var hadConstructor=false;classBody.body=[];this.expect(tt.braceL);while(!this.eat(tt.braceR)){if(this.eat(tt.semi))continue;var method=this.startNode();var isGenerator=this.eat(tt.star);var isMaybeStatic=this.type===tt.name&&this.value==="static";this.parsePropertyName(method);method["static"]=isMaybeStatic&&this.type!==tt.parenL;if(method["static"]){if(isGenerator)this.unexpected();isGenerator=this.eat(tt.star);this.parsePropertyName(method);}method.kind="method";if(!method.computed){var key=method.key;var isGetSet=false;if(!isGenerator&&key.type==="Identifier"&&this.type!==tt.parenL&&(key.name==="get"||key.name==="set")){isGetSet=true;method.kind=key.name;key=this.parsePropertyName(method);}if(!method["static"]&&(key.type==="Identifier"&&key.name==="constructor"||key.type==="Literal"&&key.value==="constructor")){if(hadConstructor)this.raise(key.start,"Duplicate constructor in the same class");if(isGetSet)this.raise(key.start,"Constructor can't have get/set modifier");if(isGenerator)this.raise(key.start,"Constructor can't be a generator");method.kind="constructor";hadConstructor=true;}}this.parseClassMethod(classBody,method,isGenerator);}node.body=this.finishNode(classBody,"ClassBody");return this.finishNode(node,isStatement?"ClassDeclaration":"ClassExpression");};pp.parseClassMethod=function(classBody,method,isGenerator){method.value=this.parseMethod(isGenerator);classBody.body.push(this.finishNode(method,"MethodDefinition"));};pp.parseClassId=function(node,isStatement){node.id=this.type===tt.name?this.parseIdent():isStatement?this.unexpected():null;};pp.parseClassSuper=function(node){node.superClass=this.eat(tt._extends)?this.parseExprSubscripts():null;}; // Parses module export declaration.
pp.parseExport=function(node){this.next(); // export * from '...'
if(this.eat(tt.star)){this.expectContextual("from");node.source=this.type===tt.string?this.parseExprAtom():this.unexpected();this.semicolon();return this.finishNode(node,"ExportAllDeclaration");}if(this.eat(tt._default)){ // export default ...
var expr=this.parseMaybeAssign();var needsSemi=true;if(expr.type=="FunctionExpression"||expr.type=="ClassExpression"){needsSemi=false;if(expr.id){expr.type=expr.type=="FunctionExpression"?"FunctionDeclaration":"ClassDeclaration";}}node.declaration=expr;if(needsSemi)this.semicolon();return this.finishNode(node,"ExportDefaultDeclaration");} // export var|const|let|function|class ...
if(this.shouldParseExportStatement()){node.declaration=this.parseStatement(true);node.specifiers=[];node.source=null;}else { // export { x, y as z } [from '...']
node.declaration=null;node.specifiers=this.parseExportSpecifiers();if(this.eatContextual("from")){node.source=this.type===tt.string?this.parseExprAtom():this.unexpected();}else {node.source=null;}this.semicolon();}return this.finishNode(node,"ExportNamedDeclaration");};pp.shouldParseExportStatement=function(){return this.type.keyword;}; // Parses a comma-separated list of module exports.
pp.parseExportSpecifiers=function(){var nodes=[],first=true; // export { x, y as z } [from '...']
this.expect(tt.braceL);while(!this.eat(tt.braceR)){if(!first){this.expect(tt.comma);if(this.afterTrailingComma(tt.braceR))break;}else first=false;var node=this.startNode();node.local=this.parseIdent(this.type===tt._default);node.exported=this.eatContextual("as")?this.parseIdent(true):node.local;nodes.push(this.finishNode(node,"ExportSpecifier"));}return nodes;}; // Parses import declaration.
pp.parseImport=function(node){this.next(); // import '...'
if(this.type===tt.string){node.specifiers=empty;node.source=this.parseExprAtom();node.kind="";}else {node.specifiers=this.parseImportSpecifiers();this.expectContextual("from");node.source=this.type===tt.string?this.parseExprAtom():this.unexpected();}this.semicolon();return this.finishNode(node,"ImportDeclaration");}; // Parses a comma-separated list of module imports.
pp.parseImportSpecifiers=function(){var nodes=[],first=true;if(this.type===tt.name){ // import defaultObj, { x, y as z } from '...'
var node=this.startNode();node.local=this.parseIdent();this.checkLVal(node.local,true);nodes.push(this.finishNode(node,"ImportDefaultSpecifier"));if(!this.eat(tt.comma))return nodes;}if(this.type===tt.star){var node=this.startNode();this.next();this.expectContextual("as");node.local=this.parseIdent();this.checkLVal(node.local,true);nodes.push(this.finishNode(node,"ImportNamespaceSpecifier"));return nodes;}this.expect(tt.braceL);while(!this.eat(tt.braceR)){if(!first){this.expect(tt.comma);if(this.afterTrailingComma(tt.braceR))break;}else first=false;var node=this.startNode();node.imported=this.parseIdent(true);node.local=this.eatContextual("as")?this.parseIdent():node.imported;this.checkLVal(node.local,true);nodes.push(this.finishNode(node,"ImportSpecifier"));}return nodes;};},{"./state":13,"./tokentype":17,"./whitespace":19}],15:[function(_dereq_,module,exports){"use strict";var _classCallCheck=function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}};exports.__esModule=true; // The algorithm used to determine whether a regexp can appear at a
// given point in the program is loosely based on sweet.js' approach.
// See https://github.com/mozilla/sweet.js/wiki/design
var Parser=_dereq_("./state").Parser;var tt=_dereq_("./tokentype").types;var lineBreak=_dereq_("./whitespace").lineBreak;var TokContext=exports.TokContext=function TokContext(token,isExpr,preserveSpace,override){_classCallCheck(this,TokContext);this.token=token;this.isExpr=isExpr;this.preserveSpace=preserveSpace;this.override=override;};var types={b_stat:new TokContext("{",false),b_expr:new TokContext("{",true),b_tmpl:new TokContext("${",true),p_stat:new TokContext("(",false),p_expr:new TokContext("(",true),q_tmpl:new TokContext("`",true,true,function(p){return p.readTmplToken();}),f_expr:new TokContext("function",true)};exports.types=types;var pp=Parser.prototype;pp.initialContext=function(){return [types.b_stat];};pp.braceIsBlock=function(prevType){var parent=undefined;if(prevType===tt.colon&&(parent=this.curContext()).token=="{")return !parent.isExpr;if(prevType===tt._return)return lineBreak.test(this.input.slice(this.lastTokEnd,this.start));if(prevType===tt._else||prevType===tt.semi||prevType===tt.eof)return true;if(prevType==tt.braceL)return this.curContext()===types.b_stat;return !this.exprAllowed;};pp.updateContext=function(prevType){var update=undefined,type=this.type;if(type.keyword&&prevType==tt.dot)this.exprAllowed=false;else if(update=type.updateContext)update.call(this,prevType);else this.exprAllowed=type.beforeExpr;}; // Token-specific context update code
tt.parenR.updateContext=tt.braceR.updateContext=function(){if(this.context.length==1){this.exprAllowed=true;return;}var out=this.context.pop();if(out===types.b_stat&&this.curContext()===types.f_expr){this.context.pop();this.exprAllowed=false;}else if(out===types.b_tmpl){this.exprAllowed=true;}else {this.exprAllowed=!out.isExpr;}};tt.braceL.updateContext=function(prevType){this.context.push(this.braceIsBlock(prevType)?types.b_stat:types.b_expr);this.exprAllowed=true;};tt.dollarBraceL.updateContext=function(){this.context.push(types.b_tmpl);this.exprAllowed=true;};tt.parenL.updateContext=function(prevType){var statementParens=prevType===tt._if||prevType===tt._for||prevType===tt._with||prevType===tt._while;this.context.push(statementParens?types.p_stat:types.p_expr);this.exprAllowed=true;};tt.incDec.updateContext=function(){};tt._function.updateContext=function(){if(this.curContext()!==types.b_stat)this.context.push(types.f_expr);this.exprAllowed=false;};tt.backQuote.updateContext=function(){if(this.curContext()===types.q_tmpl)this.context.pop();else this.context.push(types.q_tmpl);this.exprAllowed=false;}; // tokExprAllowed stays unchanged
},{"./state":13,"./tokentype":17,"./whitespace":19}],16:[function(_dereq_,module,exports){"use strict";var _classCallCheck=function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}};exports.__esModule=true;var _identifier=_dereq_("./identifier");var isIdentifierStart=_identifier.isIdentifierStart;var isIdentifierChar=_identifier.isIdentifierChar;var _tokentype=_dereq_("./tokentype");var tt=_tokentype.types;var keywordTypes=_tokentype.keywords;var Parser=_dereq_("./state").Parser;var SourceLocation=_dereq_("./location").SourceLocation;var _whitespace=_dereq_("./whitespace");var lineBreak=_whitespace.lineBreak;var lineBreakG=_whitespace.lineBreakG;var isNewLine=_whitespace.isNewLine;var nonASCIIwhitespace=_whitespace.nonASCIIwhitespace; // Object type used to represent tokens. Note that normally, tokens
// simply exist as properties on the parser object. This is only
// used for the onToken callback and the external tokenizer.
var Token=exports.Token=function Token(p){_classCallCheck(this,Token);this.type=p.type;this.value=p.value;this.start=p.start;this.end=p.end;if(p.options.locations)this.loc=new SourceLocation(p,p.startLoc,p.endLoc);if(p.options.ranges)this.range=[p.start,p.end];}; // ## Tokenizer
var pp=Parser.prototype; // Are we running under Rhino?
var isRhino=typeof Packages!=="undefined"; // Move to the next token
pp.next=function(){if(this.options.onToken)this.options.onToken(new Token(this));this.lastTokEnd=this.end;this.lastTokStart=this.start;this.lastTokEndLoc=this.endLoc;this.lastTokStartLoc=this.startLoc;this.nextToken();};pp.getToken=function(){this.next();return new Token(this);}; // If we're in an ES6 environment, make parsers iterable
if(typeof Symbol!=="undefined")pp[Symbol.iterator]=function(){var self=this;return {next:function next(){var token=self.getToken();return {done:token.type===tt.eof,value:token};}};}; // Toggle strict mode. Re-reads the next number or string to please
// pedantic tests (`"use strict"; 010;` should fail).
pp.setStrict=function(strict){this.strict=strict;if(this.type!==tt.num&&this.type!==tt.string)return;this.pos=this.start;if(this.options.locations){while(this.pos<this.lineStart){this.lineStart=this.input.lastIndexOf("\n",this.lineStart-2)+1;--this.curLine;}}this.nextToken();};pp.curContext=function(){return this.context[this.context.length-1];}; // Read a single token, updating the parser object's token-related
// properties.
pp.nextToken=function(){var curContext=this.curContext();if(!curContext||!curContext.preserveSpace)this.skipSpace();this.start=this.pos;if(this.options.locations)this.startLoc=this.curPosition();if(this.pos>=this.input.length)return this.finishToken(tt.eof);if(curContext.override)return curContext.override(this);else this.readToken(this.fullCharCodeAtPos());};pp.readToken=function(code){ // Identifier or keyword. '\uXXXX' sequences are allowed in
// identifiers, so '\' also dispatches to that.
if(isIdentifierStart(code,this.options.ecmaVersion>=6)||code===92 /* '\' */)return this.readWord();return this.getTokenFromCode(code);};pp.fullCharCodeAtPos=function(){var code=this.input.charCodeAt(this.pos);if(code<=55295||code>=57344)return code;var next=this.input.charCodeAt(this.pos+1);return (code<<10)+next-56613888;};pp.skipBlockComment=function(){var startLoc=this.options.onComment&&this.options.locations&&this.curPosition();var start=this.pos,end=this.input.indexOf("*/",this.pos+=2);if(end===-1)this.raise(this.pos-2,"Unterminated comment");this.pos=end+2;if(this.options.locations){lineBreakG.lastIndex=start;var match=undefined;while((match=lineBreakG.exec(this.input))&&match.index<this.pos){++this.curLine;this.lineStart=match.index+match[0].length;}}if(this.options.onComment)this.options.onComment(true,this.input.slice(start+2,end),start,this.pos,startLoc,this.options.locations&&this.curPosition());};pp.skipLineComment=function(startSkip){var start=this.pos;var startLoc=this.options.onComment&&this.options.locations&&this.curPosition();var ch=this.input.charCodeAt(this.pos+=startSkip);while(this.pos<this.input.length&&ch!==10&&ch!==13&&ch!==8232&&ch!==8233){++this.pos;ch=this.input.charCodeAt(this.pos);}if(this.options.onComment)this.options.onComment(false,this.input.slice(start+startSkip,this.pos),start,this.pos,startLoc,this.options.locations&&this.curPosition());}; // Called at the start of the parse and after every token. Skips
// whitespace and comments, and.
pp.skipSpace=function(){while(this.pos<this.input.length){var ch=this.input.charCodeAt(this.pos);if(ch===32){ // ' '
++this.pos;}else if(ch===13){++this.pos;var next=this.input.charCodeAt(this.pos);if(next===10){++this.pos;}if(this.options.locations){++this.curLine;this.lineStart=this.pos;}}else if(ch===10||ch===8232||ch===8233){++this.pos;if(this.options.locations){++this.curLine;this.lineStart=this.pos;}}else if(ch>8&&ch<14){++this.pos;}else if(ch===47){ // '/'
var next=this.input.charCodeAt(this.pos+1);if(next===42){ // '*'
this.skipBlockComment();}else if(next===47){ // '/'
this.skipLineComment(2);}else break;}else if(ch===160){ // '\xa0'
++this.pos;}else if(ch>=5760&&nonASCIIwhitespace.test(String.fromCharCode(ch))){++this.pos;}else {break;}}}; // Called at the end of every token. Sets `end`, `val`, and
// maintains `context` and `exprAllowed`, and skips the space after
// the token, so that the next one's `start` will point at the
// right position.
pp.finishToken=function(type,val){this.end=this.pos;if(this.options.locations)this.endLoc=this.curPosition();var prevType=this.type;this.type=type;this.value=val;this.updateContext(prevType);}; // ### Token reading
// This is the function that is called to fetch the next token. It
// is somewhat obscure, because it works in character codes rather
// than characters, and because operator parsing has been inlined
// into it.
//
// All in the name of speed.
//
pp.readToken_dot=function(){var next=this.input.charCodeAt(this.pos+1);if(next>=48&&next<=57)return this.readNumber(true);var next2=this.input.charCodeAt(this.pos+2);if(this.options.ecmaVersion>=6&&next===46&&next2===46){ // 46 = dot '.'
this.pos+=3;return this.finishToken(tt.ellipsis);}else {++this.pos;return this.finishToken(tt.dot);}};pp.readToken_slash=function(){ // '/'
var next=this.input.charCodeAt(this.pos+1);if(this.exprAllowed){++this.pos;return this.readRegexp();}if(next===61)return this.finishOp(tt.assign,2);return this.finishOp(tt.slash,1);};pp.readToken_mult_modulo=function(code){ // '%*'
var next=this.input.charCodeAt(this.pos+1);if(next===61)return this.finishOp(tt.assign,2);return this.finishOp(code===42?tt.star:tt.modulo,1);};pp.readToken_pipe_amp=function(code){ // '|&'
var next=this.input.charCodeAt(this.pos+1);if(next===code)return this.finishOp(code===124?tt.logicalOR:tt.logicalAND,2);if(next===61)return this.finishOp(tt.assign,2);return this.finishOp(code===124?tt.bitwiseOR:tt.bitwiseAND,1);};pp.readToken_caret=function(){ // '^'
var next=this.input.charCodeAt(this.pos+1);if(next===61)return this.finishOp(tt.assign,2);return this.finishOp(tt.bitwiseXOR,1);};pp.readToken_plus_min=function(code){ // '+-'
var next=this.input.charCodeAt(this.pos+1);if(next===code){if(next==45&&this.input.charCodeAt(this.pos+2)==62&&lineBreak.test(this.input.slice(this.lastTokEnd,this.pos))){ // A `-->` line comment
this.skipLineComment(3);this.skipSpace();return this.nextToken();}return this.finishOp(tt.incDec,2);}if(next===61)return this.finishOp(tt.assign,2);return this.finishOp(tt.plusMin,1);};pp.readToken_lt_gt=function(code){ // '<>'
var next=this.input.charCodeAt(this.pos+1);var size=1;if(next===code){size=code===62&&this.input.charCodeAt(this.pos+2)===62?3:2;if(this.input.charCodeAt(this.pos+size)===61)return this.finishOp(tt.assign,size+1);return this.finishOp(tt.bitShift,size);}if(next==33&&code==60&&this.input.charCodeAt(this.pos+2)==45&&this.input.charCodeAt(this.pos+3)==45){if(this.inModule)this.unexpected(); // `<!--`, an XML-style comment that should be interpreted as a line comment
this.skipLineComment(4);this.skipSpace();return this.nextToken();}if(next===61)size=this.input.charCodeAt(this.pos+2)===61?3:2;return this.finishOp(tt.relational,size);};pp.readToken_eq_excl=function(code){ // '=!'
var next=this.input.charCodeAt(this.pos+1);if(next===61)return this.finishOp(tt.equality,this.input.charCodeAt(this.pos+2)===61?3:2);if(code===61&&next===62&&this.options.ecmaVersion>=6){ // '=>'
this.pos+=2;return this.finishToken(tt.arrow);}return this.finishOp(code===61?tt.eq:tt.prefix,1);};pp.getTokenFromCode=function(code){switch(code){ // The interpretation of a dot depends on whether it is followed
// by a digit or another two dots.
case 46: // '.'
return this.readToken_dot(); // Punctuation tokens.
case 40:++this.pos;return this.finishToken(tt.parenL);case 41:++this.pos;return this.finishToken(tt.parenR);case 59:++this.pos;return this.finishToken(tt.semi);case 44:++this.pos;return this.finishToken(tt.comma);case 91:++this.pos;return this.finishToken(tt.bracketL);case 93:++this.pos;return this.finishToken(tt.bracketR);case 123:++this.pos;return this.finishToken(tt.braceL);case 125:++this.pos;return this.finishToken(tt.braceR);case 58:++this.pos;return this.finishToken(tt.colon);case 63:++this.pos;return this.finishToken(tt.question);case 96: // '`'
if(this.options.ecmaVersion<6)break;++this.pos;return this.finishToken(tt.backQuote);case 48: // '0'
var next=this.input.charCodeAt(this.pos+1);if(next===120||next===88)return this.readRadixNumber(16); // '0x', '0X' - hex number
if(this.options.ecmaVersion>=6){if(next===111||next===79)return this.readRadixNumber(8); // '0o', '0O' - octal number
if(next===98||next===66)return this.readRadixNumber(2); // '0b', '0B' - binary number
} // Anything else beginning with a digit is an integer, octal
// number, or float.
case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57: // 1-9
return this.readNumber(false); // Quotes produce strings.
case 34:case 39: // '"', "'"
return this.readString(code); // Operators are parsed inline in tiny state machines. '=' (61) is
// often referred to. `finishOp` simply skips the amount of
// characters it is given as second argument, and returns a token
// of the type given by its first argument.
case 47: // '/'
return this.readToken_slash();case 37:case 42: // '%*'
return this.readToken_mult_modulo(code);case 124:case 38: // '|&'
return this.readToken_pipe_amp(code);case 94: // '^'
return this.readToken_caret();case 43:case 45: // '+-'
return this.readToken_plus_min(code);case 60:case 62: // '<>'
return this.readToken_lt_gt(code);case 61:case 33: // '=!'
return this.readToken_eq_excl(code);case 126: // '~'
return this.finishOp(tt.prefix,1);}this.raise(this.pos,"Unexpected character '"+codePointToString(code)+"'");};pp.finishOp=function(type,size){var str=this.input.slice(this.pos,this.pos+size);this.pos+=size;return this.finishToken(type,str);};var regexpUnicodeSupport=false;try{new RegExp("￿","u");regexpUnicodeSupport=true;}catch(e){} // Parse a regular expression. Some context-awareness is necessary,
// since a '/' inside a '[]' set does not end the expression.
pp.readRegexp=function(){var escaped=undefined,inClass=undefined,start=this.pos;for(;;){if(this.pos>=this.input.length)this.raise(start,"Unterminated regular expression");var ch=this.input.charAt(this.pos);if(lineBreak.test(ch))this.raise(start,"Unterminated regular expression");if(!escaped){if(ch==="[")inClass=true;else if(ch==="]"&&inClass)inClass=false;else if(ch==="/"&&!inClass)break;escaped=ch==="\\";}else escaped=false;++this.pos;}var content=this.input.slice(start,this.pos);++this.pos; // Need to use `readWord1` because '\uXXXX' sequences are allowed
// here (don't ask).
var mods=this.readWord1();var tmp=content;if(mods){var validFlags=/^[gmsiy]*$/;if(this.options.ecmaVersion>=6)validFlags=/^[gmsiyu]*$/;if(!validFlags.test(mods))this.raise(start,"Invalid regular expression flag");if(mods.indexOf("u")>=0&&!regexpUnicodeSupport){ // Replace each astral symbol and every Unicode escape sequence that
// possibly represents an astral symbol or a paired surrogate with a
// single ASCII symbol to avoid throwing on regular expressions that
// are only valid in combination with the `/u` flag.
// Note: replacing with the ASCII symbol `x` might cause false
// negatives in unlikely scenarios. For example, `[\u{61}-b]` is a
// perfectly valid pattern that is equivalent to `[a-b]`, but it would
// be replaced by `[x-b]` which throws an error.
tmp=tmp.replace(/\\u([a-fA-F0-9]{4})|\\u\{([0-9a-fA-F]+)\}|[\uD800-\uDBFF][\uDC00-\uDFFF]/g,"x");}} // Detect invalid regular expressions.
var value=null; // Rhino's regular expression parser is flaky and throws uncatchable exceptions,
// so don't do detection if we are running under Rhino
if(!isRhino){try{new RegExp(tmp);}catch(e){if(e instanceof SyntaxError)this.raise(start,"Error parsing regular expression: "+e.message);this.raise(e);} // Get a regular expression object for this pattern-flag pair, or `null` in
// case the current environment doesn't support the flags it uses.
try{value=new RegExp(content,mods);}catch(err){}}return this.finishToken(tt.regexp,{pattern:content,flags:mods,value:value});}; // Read an integer in the given radix. Return null if zero digits
// were read, the integer value otherwise. When `len` is given, this
// will return `null` unless the integer has exactly `len` digits.
pp.readInt=function(radix,len){var start=this.pos,total=0;for(var i=0,e=len==null?Infinity:len;i<e;++i){var code=this.input.charCodeAt(this.pos),val=undefined;if(code>=97)val=code-97+10; // a
else if(code>=65)val=code-65+10; // A
else if(code>=48&&code<=57)val=code-48; // 0-9
else val=Infinity;if(val>=radix)break;++this.pos;total=total*radix+val;}if(this.pos===start||len!=null&&this.pos-start!==len)return null;return total;};pp.readRadixNumber=function(radix){this.pos+=2; // 0x
var val=this.readInt(radix);if(val==null)this.raise(this.start+2,"Expected number in radix "+radix);if(isIdentifierStart(this.fullCharCodeAtPos()))this.raise(this.pos,"Identifier directly after number");return this.finishToken(tt.num,val);}; // Read an integer, octal integer, or floating-point number.
pp.readNumber=function(startsWithDot){var start=this.pos,isFloat=false,octal=this.input.charCodeAt(this.pos)===48;if(!startsWithDot&&this.readInt(10)===null)this.raise(start,"Invalid number");if(this.input.charCodeAt(this.pos)===46){++this.pos;this.readInt(10);isFloat=true;}var next=this.input.charCodeAt(this.pos);if(next===69||next===101){ // 'eE'
next=this.input.charCodeAt(++this.pos);if(next===43||next===45)++this.pos; // '+-'
if(this.readInt(10)===null)this.raise(start,"Invalid number");isFloat=true;}if(isIdentifierStart(this.fullCharCodeAtPos()))this.raise(this.pos,"Identifier directly after number");var str=this.input.slice(start,this.pos),val=undefined;if(isFloat)val=parseFloat(str);else if(!octal||str.length===1)val=parseInt(str,10);else if(/[89]/.test(str)||this.strict)this.raise(start,"Invalid number");else val=parseInt(str,8);return this.finishToken(tt.num,val);}; // Read a string value, interpreting backslash-escapes.
pp.readCodePoint=function(){var ch=this.input.charCodeAt(this.pos),code=undefined;if(ch===123){if(this.options.ecmaVersion<6)this.unexpected();++this.pos;code=this.readHexChar(this.input.indexOf("}",this.pos)-this.pos);++this.pos;if(code>1114111)this.unexpected();}else {code=this.readHexChar(4);}return code;};function codePointToString(code){ // UTF-16 Decoding
if(code<=65535){return String.fromCharCode(code);}return String.fromCharCode((code-65536>>10)+55296,(code-65536&1023)+56320);}pp.readString=function(quote){var out="",chunkStart=++this.pos;for(;;){if(this.pos>=this.input.length)this.raise(this.start,"Unterminated string constant");var ch=this.input.charCodeAt(this.pos);if(ch===quote)break;if(ch===92){ // '\'
out+=this.input.slice(chunkStart,this.pos);out+=this.readEscapedChar();chunkStart=this.pos;}else {if(isNewLine(ch))this.raise(this.start,"Unterminated string constant");++this.pos;}}out+=this.input.slice(chunkStart,this.pos++);return this.finishToken(tt.string,out);}; // Reads template string tokens.
pp.readTmplToken=function(){var out="",chunkStart=this.pos;for(;;){if(this.pos>=this.input.length)this.raise(this.start,"Unterminated template");var ch=this.input.charCodeAt(this.pos);if(ch===96||ch===36&&this.input.charCodeAt(this.pos+1)===123){ // '`', '${'
if(this.pos===this.start&&this.type===tt.template){if(ch===36){this.pos+=2;return this.finishToken(tt.dollarBraceL);}else {++this.pos;return this.finishToken(tt.backQuote);}}out+=this.input.slice(chunkStart,this.pos);return this.finishToken(tt.template,out);}if(ch===92){ // '\'
out+=this.input.slice(chunkStart,this.pos);out+=this.readEscapedChar();chunkStart=this.pos;}else if(isNewLine(ch)){out+=this.input.slice(chunkStart,this.pos);++this.pos;if(ch===13&&this.input.charCodeAt(this.pos)===10){++this.pos;out+="\n";}else {out+=String.fromCharCode(ch);}if(this.options.locations){++this.curLine;this.lineStart=this.pos;}chunkStart=this.pos;}else {++this.pos;}}}; // Used to read escaped characters
pp.readEscapedChar=function(){var ch=this.input.charCodeAt(++this.pos);var octal=/^[0-7]+/.exec(this.input.slice(this.pos,this.pos+3));if(octal)octal=octal[0];while(octal&&parseInt(octal,8)>255){octal=octal.slice(0,-1);}if(octal==="0")octal=null;++this.pos;if(octal){if(this.strict)this.raise(this.pos-2,"Octal literal in strict mode");this.pos+=octal.length-1;return String.fromCharCode(parseInt(octal,8));}else {switch(ch){case 110:return "\n"; // 'n' -> '\n'
case 114:return "\r"; // 'r' -> '\r'
case 120:return String.fromCharCode(this.readHexChar(2)); // 'x'
case 117:return codePointToString(this.readCodePoint()); // 'u'
case 116:return "\t"; // 't' -> '\t'
case 98:return "\b"; // 'b' -> '\b'
case 118:return "\u000b"; // 'v' -> '\u000b'
case 102:return "\f"; // 'f' -> '\f'
case 48:return "\u0000"; // 0 -> '\0'
case 13:if(this.input.charCodeAt(this.pos)===10)++this.pos; // '\r\n'
case 10: // ' \n'
if(this.options.locations){this.lineStart=this.pos;++this.curLine;}return "";default:return String.fromCharCode(ch);}}}; // Used to read character escape sequences ('\x', '\u', '\U').
pp.readHexChar=function(len){var n=this.readInt(16,len);if(n===null)this.raise(this.start,"Bad character escape sequence");return n;}; // Used to signal to callers of `readWord1` whether the word
// contained any escape sequences. This is needed because words with
// escape sequences must not be interpreted as keywords.
var containsEsc; // Read an identifier, and return it as a string. Sets `containsEsc`
// to whether the word contained a '\u' escape.
//
// Incrementally adds only escaped chars, adding other chunks as-is
// as a micro-optimization.
pp.readWord1=function(){containsEsc=false;var word="",first=true,chunkStart=this.pos;var astral=this.options.ecmaVersion>=6;while(this.pos<this.input.length){var ch=this.fullCharCodeAtPos();if(isIdentifierChar(ch,astral)){this.pos+=ch<=65535?1:2;}else if(ch===92){ // "\"
containsEsc=true;word+=this.input.slice(chunkStart,this.pos);var escStart=this.pos;if(this.input.charCodeAt(++this.pos)!=117) // "u"
this.raise(this.pos,"Expecting Unicode escape sequence \\uXXXX");++this.pos;var esc=this.readCodePoint();if(!(first?isIdentifierStart:isIdentifierChar)(esc,astral))this.raise(escStart,"Invalid Unicode escape");word+=codePointToString(esc);chunkStart=this.pos;}else {break;}first=false;}return word+this.input.slice(chunkStart,this.pos);}; // Read an identifier or keyword token. Will check for reserved
// words when necessary.
pp.readWord=function(){var word=this.readWord1();var type=tt.name;if((this.options.ecmaVersion>=6||!containsEsc)&&this.isKeyword(word))type=keywordTypes[word];return this.finishToken(type,word);};},{"./identifier":7,"./location":8,"./state":13,"./tokentype":17,"./whitespace":19}],17:[function(_dereq_,module,exports){"use strict";var _classCallCheck=function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}};exports.__esModule=true; // ## Token types
// The assignment of fine-grained, information-carrying type objects
// allows the tokenizer to store the information it has about a
// token in a way that is very cheap for the parser to look up.
// All token type variables start with an underscore, to make them
// easy to recognize.
// The `beforeExpr` property is used to disambiguate between regular
// expressions and divisions. It is set on all token types that can
// be followed by an expression (thus, a slash after them would be a
// regular expression).
//
// `isLoop` marks a keyword as starting a loop, which is important
// to know when parsing a label, in order to allow or disallow
// continue jumps to that label.
var TokenType=exports.TokenType=function TokenType(label){var conf=arguments[1]===undefined?{}:arguments[1];_classCallCheck(this,TokenType);this.label=label;this.keyword=conf.keyword;this.beforeExpr=!!conf.beforeExpr;this.startsExpr=!!conf.startsExpr;this.isLoop=!!conf.isLoop;this.isAssign=!!conf.isAssign;this.prefix=!!conf.prefix;this.postfix=!!conf.postfix;this.binop=conf.binop||null;this.updateContext=null;};function binop(name,prec){return new TokenType(name,{beforeExpr:true,binop:prec});}var beforeExpr={beforeExpr:true},startsExpr={startsExpr:true};var types={num:new TokenType("num",startsExpr),regexp:new TokenType("regexp",startsExpr),string:new TokenType("string",startsExpr),name:new TokenType("name",startsExpr),eof:new TokenType("eof"), // Punctuation token types.
bracketL:new TokenType("[",{beforeExpr:true,startsExpr:true}),bracketR:new TokenType("]"),braceL:new TokenType("{",{beforeExpr:true,startsExpr:true}),braceR:new TokenType("}"),parenL:new TokenType("(",{beforeExpr:true,startsExpr:true}),parenR:new TokenType(")"),comma:new TokenType(",",beforeExpr),semi:new TokenType(";",beforeExpr),colon:new TokenType(":",beforeExpr),dot:new TokenType("."),question:new TokenType("?",beforeExpr),arrow:new TokenType("=>",beforeExpr),template:new TokenType("template"),ellipsis:new TokenType("...",beforeExpr),backQuote:new TokenType("`",startsExpr),dollarBraceL:new TokenType("${",{beforeExpr:true,startsExpr:true}), // Operators. These carry several kinds of properties to help the
// parser use them properly (the presence of these properties is
// what categorizes them as operators).
//
// `binop`, when present, specifies that this operator is a binary
// operator, and will refer to its precedence.
//
// `prefix` and `postfix` mark the operator as a prefix or postfix
// unary operator.
//
// `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
// binary operators with a very low precedence, that should result
// in AssignmentExpression nodes.
eq:new TokenType("=",{beforeExpr:true,isAssign:true}),assign:new TokenType("_=",{beforeExpr:true,isAssign:true}),incDec:new TokenType("++/--",{prefix:true,postfix:true,startsExpr:true}),prefix:new TokenType("prefix",{beforeExpr:true,prefix:true,startsExpr:true}),logicalOR:binop("||",1),logicalAND:binop("&&",2),bitwiseOR:binop("|",3),bitwiseXOR:binop("^",4),bitwiseAND:binop("&",5),equality:binop("==/!=",6),relational:binop("</>",7),bitShift:binop("<</>>",8),plusMin:new TokenType("+/-",{beforeExpr:true,binop:9,prefix:true,startsExpr:true}),modulo:binop("%",10),star:binop("*",10),slash:binop("/",10)};exports.types=types; // Map keyword names to token types.
var keywords={};exports.keywords=keywords; // Succinct definitions of keyword token types
function kw(name){var options=arguments[1]===undefined?{}:arguments[1];options.keyword=name;keywords[name]=types["_"+name]=new TokenType(name,options);}kw("break");kw("case",beforeExpr);kw("catch");kw("continue");kw("debugger");kw("default");kw("do",{isLoop:true});kw("else",beforeExpr);kw("finally");kw("for",{isLoop:true});kw("function",startsExpr);kw("if");kw("return",beforeExpr);kw("switch");kw("throw",beforeExpr);kw("try");kw("var");kw("let");kw("const");kw("while",{isLoop:true});kw("with");kw("new",{beforeExpr:true,startsExpr:true});kw("this",startsExpr);kw("super",startsExpr);kw("class");kw("extends",beforeExpr);kw("export");kw("import");kw("yield",{beforeExpr:true,startsExpr:true});kw("null",startsExpr);kw("true",startsExpr);kw("false",startsExpr);kw("in",{beforeExpr:true,binop:7});kw("instanceof",{beforeExpr:true,binop:7});kw("typeof",{beforeExpr:true,prefix:true,startsExpr:true});kw("void",{beforeExpr:true,prefix:true,startsExpr:true});kw("delete",{beforeExpr:true,prefix:true,startsExpr:true});},{}],18:[function(_dereq_,module,exports){"use strict";exports.isArray=isArray; // Checks if an object has a property.
exports.has=has;exports.__esModule=true;function isArray(obj){return Object.prototype.toString.call(obj)==="[object Array]";}function has(obj,propName){return Object.prototype.hasOwnProperty.call(obj,propName);}},{}],19:[function(_dereq_,module,exports){"use strict";exports.isNewLine=isNewLine;exports.__esModule=true; // Matches a whole line break (where CRLF is considered a single
// line break). Used to count lines.
var lineBreak=/\r\n?|\n|\u2028|\u2029/;exports.lineBreak=lineBreak;var lineBreakG=new RegExp(lineBreak.source,"g");exports.lineBreakG=lineBreakG;function isNewLine(code){return code===10||code===13||code===8232||code==8233;}var nonASCIIwhitespace=/[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/;exports.nonASCIIwhitespace=nonASCIIwhitespace;},{}]},{},[1])(1);});}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{}],62:[function(require,module,exports){(function(global){(function(f){if((typeof exports==="undefined"?"undefined":_typeof(exports))==="object"&&typeof module!=="undefined"){module.exports=f();}else if(typeof define==="function"&&define.amd){define([],f);}else {var g;if(typeof window!=="undefined"){g=window;}else if(typeof global!=="undefined"){g=global;}else if(typeof self!=="undefined"){g=self;}else {g=this;}(g.acorn||(g.acorn={})).walk=f();}})(function(){var define,module,exports;return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f;}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e);},l,l.exports,e,t,n,r);}return n[o].exports;}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++){s(r[o]);}return s;}({1:[function(_dereq_,module,exports){"use strict";var _classCallCheck=function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}; // AST walker module for Mozilla Parser API compatible trees
// A simple walk is one where you simply specify callbacks to be
// called on specific nodes. The last two arguments are optional. A
// simple use would be
//
//     walk.simple(myTree, {
//         Expression: function(node) { ... }
//     });
//
// to do something with all expressions. All Parser API node types
// can be used to identify node types, as well as Expression,
// Statement, and ScopeBody, which denote categories of nodes.
//
// The base argument can be used to pass a custom (recursive)
// walker, and state can be used to give this walked an initial
// state.
exports.simple=simple; // An ancestor walk builds up an array of ancestor nodes (including
// the current node) and passes them to the callback as the state parameter.
exports.ancestor=ancestor; // A recursive walk is one where your functions override the default
// walkers. They can modify and replace the state parameter that's
// threaded through the walk, and can opt how and whether to walk
// their child nodes (by calling their third argument on these
// nodes).
exports.recursive=recursive; // Find a node with a given start, end, and type (all are optional,
// null can be used as wildcard). Returns a {node, state} object, or
// undefined when it doesn't find a matching node.
exports.findNodeAt=findNodeAt; // Find the innermost node of a given type that contains the given
// position. Interface similar to findNodeAt.
exports.findNodeAround=findNodeAround; // Find the outermost matching node after a given position.
exports.findNodeAfter=findNodeAfter; // Find the outermost matching node before a given position.
exports.findNodeBefore=findNodeBefore; // Used to create a custom walker. Will fill in all missing node
// type properties with the defaults.
exports.make=make;exports.__esModule=true;function simple(node,visitors,base,state){if(!base)base=exports.base;(function c(node,st,override){var type=override||node.type,found=visitors[type];base[type](node,st,c);if(found)found(node,st);})(node,state);}function ancestor(node,visitors,base,state){if(!base)base=exports.base;if(!state)state=[];(function c(node,st,override){var type=override||node.type,found=visitors[type];if(node!=st[st.length-1]){st=st.slice();st.push(node);}base[type](node,st,c);if(found)found(node,st);})(node,state);}function recursive(node,state,funcs,base){var visitor=funcs?exports.make(funcs,base):base;(function c(node,st,override){visitor[override||node.type](node,st,c);})(node,state);}function makeTest(test){if(typeof test=="string"){return function(type){return type==test;};}else if(!test){return function(){return true;};}else {return test;}}var Found=function Found(node,state){_classCallCheck(this,Found);this.node=node;this.state=state;};function findNodeAt(node,start,end,test,base,state){test=makeTest(test);if(!base)base=exports.base;try{;(function c(node,st,override){var type=override||node.type;if((start==null||node.start<=start)&&(end==null||node.end>=end))base[type](node,st,c);if(test(type,node)&&(start==null||node.start==start)&&(end==null||node.end==end))throw new Found(node,st);})(node,state);}catch(e){if(e instanceof Found){return e;}throw e;}}function findNodeAround(node,pos,test,base,state){test=makeTest(test);if(!base)base=exports.base;try{;(function c(node,st,override){var type=override||node.type;if(node.start>pos||node.end<pos){return;}base[type](node,st,c);if(test(type,node))throw new Found(node,st);})(node,state);}catch(e){if(e instanceof Found){return e;}throw e;}}function findNodeAfter(node,pos,test,base,state){test=makeTest(test);if(!base)base=exports.base;try{;(function c(node,st,override){if(node.end<pos){return;}var type=override||node.type;if(node.start>=pos&&test(type,node))throw new Found(node,st);base[type](node,st,c);})(node,state);}catch(e){if(e instanceof Found){return e;}throw e;}}function findNodeBefore(node,pos,test,base,state){test=makeTest(test);if(!base)base=exports.base;var max=undefined;(function c(node,st,override){if(node.start>pos){return;}var type=override||node.type;if(node.end<=pos&&(!max||max.node.end<node.end)&&test(type,node))max=new Found(node,st);base[type](node,st,c);})(node,state);return max;}function make(funcs,base){if(!base)base=exports.base;var visitor={};for(var type in base){visitor[type]=base[type];}for(var type in funcs){visitor[type]=funcs[type];}return visitor;}function skipThrough(node,st,c){c(node,st);}function ignore(_node,_st,_c){} // Node walkers.
var base={};exports.base=base;base.Program=base.BlockStatement=function(node,st,c){for(var i=0;i<node.body.length;++i){c(node.body[i],st,"Statement");}};base.Statement=skipThrough;base.EmptyStatement=ignore;base.ExpressionStatement=base.ParenthesizedExpression=function(node,st,c){return c(node.expression,st,"Expression");};base.IfStatement=function(node,st,c){c(node.test,st,"Expression");c(node.consequent,st,"Statement");if(node.alternate)c(node.alternate,st,"Statement");};base.LabeledStatement=function(node,st,c){return c(node.body,st,"Statement");};base.BreakStatement=base.ContinueStatement=ignore;base.WithStatement=function(node,st,c){c(node.object,st,"Expression");c(node.body,st,"Statement");};base.SwitchStatement=function(node,st,c){c(node.discriminant,st,"Expression");for(var i=0;i<node.cases.length;++i){var cs=node.cases[i];if(cs.test)c(cs.test,st,"Expression");for(var j=0;j<cs.consequent.length;++j){c(cs.consequent[j],st,"Statement");}}};base.ReturnStatement=base.YieldExpression=function(node,st,c){if(node.argument)c(node.argument,st,"Expression");};base.ThrowStatement=base.SpreadElement=base.RestElement=function(node,st,c){return c(node.argument,st,"Expression");};base.TryStatement=function(node,st,c){c(node.block,st,"Statement");if(node.handler)c(node.handler.body,st,"ScopeBody");if(node.finalizer)c(node.finalizer,st,"Statement");};base.WhileStatement=base.DoWhileStatement=function(node,st,c){c(node.test,st,"Expression");c(node.body,st,"Statement");};base.ForStatement=function(node,st,c){if(node.init)c(node.init,st,"ForInit");if(node.test)c(node.test,st,"Expression");if(node.update)c(node.update,st,"Expression");c(node.body,st,"Statement");};base.ForInStatement=base.ForOfStatement=function(node,st,c){c(node.left,st,"ForInit");c(node.right,st,"Expression");c(node.body,st,"Statement");};base.ForInit=function(node,st,c){if(node.type=="VariableDeclaration")c(node,st);else c(node,st,"Expression");};base.DebuggerStatement=ignore;base.FunctionDeclaration=function(node,st,c){return c(node,st,"Function");};base.VariableDeclaration=function(node,st,c){for(var i=0;i<node.declarations.length;++i){var decl=node.declarations[i];if(decl.init)c(decl.init,st,"Expression");}};base.Function=function(node,st,c){return c(node.body,st,"ScopeBody");};base.ScopeBody=function(node,st,c){return c(node,st,"Statement");};base.Expression=skipThrough;base.ThisExpression=base.Super=base.MetaProperty=ignore;base.ArrayExpression=base.ArrayPattern=function(node,st,c){for(var i=0;i<node.elements.length;++i){var elt=node.elements[i];if(elt)c(elt,st,"Expression");}};base.ObjectExpression=base.ObjectPattern=function(node,st,c){for(var i=0;i<node.properties.length;++i){c(node.properties[i],st);}};base.FunctionExpression=base.ArrowFunctionExpression=base.FunctionDeclaration;base.SequenceExpression=base.TemplateLiteral=function(node,st,c){for(var i=0;i<node.expressions.length;++i){c(node.expressions[i],st,"Expression");}};base.UnaryExpression=base.UpdateExpression=function(node,st,c){c(node.argument,st,"Expression");};base.BinaryExpression=base.AssignmentExpression=base.AssignmentPattern=base.LogicalExpression=function(node,st,c){c(node.left,st,"Expression");c(node.right,st,"Expression");};base.ConditionalExpression=function(node,st,c){c(node.test,st,"Expression");c(node.consequent,st,"Expression");c(node.alternate,st,"Expression");};base.NewExpression=base.CallExpression=function(node,st,c){c(node.callee,st,"Expression");if(node.arguments)for(var i=0;i<node.arguments.length;++i){c(node.arguments[i],st,"Expression");}};base.MemberExpression=function(node,st,c){c(node.object,st,"Expression");if(node.computed)c(node.property,st,"Expression");};base.ExportNamedDeclaration=base.ExportDefaultDeclaration=function(node,st,c){return c(node.declaration,st);};base.ImportDeclaration=function(node,st,c){for(var i=0;i<node.specifiers.length;i++){c(node.specifiers[i],st);}};base.ImportSpecifier=base.ImportDefaultSpecifier=base.ImportNamespaceSpecifier=base.Identifier=base.Literal=ignore;base.TaggedTemplateExpression=function(node,st,c){c(node.tag,st,"Expression");c(node.quasi,st);};base.ClassDeclaration=base.ClassExpression=function(node,st,c){if(node.superClass)c(node.superClass,st,"Expression");for(var i=0;i<node.body.body.length;i++){c(node.body.body[i],st);}};base.MethodDefinition=base.Property=function(node,st,c){if(node.computed)c(node.key,st,"Expression");c(node.value,st,"Expression");};base.ComprehensionExpression=function(node,st,c){for(var i=0;i<node.blocks.length;i++){c(node.blocks[i].right,st,"Expression");}c(node.body,st,"Expression");};},{}]},{},[1])(1);});}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{}],63:[function(require,module,exports){'use strict'; // Libraries
require('putaitu.js');window.$=window.jQuery=require('jquery');require('bootstrap'); // Views
var NavbarMain=require('./views/NavbarMain');var JSONEditor=require('./views/JSONEditor');var PageEditor=require('./views/PageEditor'); // -----------
// Persistent views
// -----------
var navbarMain=new NavbarMain(); // -----------
// Routes
// -----------
// Page edit
Router.route('/jsoneditor/pages/:id',function(){var pageEditor=new PageEditor({modelUrl:'/api/pages/'+this.id});navbarMain.showTab('pages');$('.workspace').html(pageEditor.$element);}); // Object schema edit
Router.route('/jsoneditor/objectSchemas/:id',function(){var jsonEditor=new JSONEditor({modelUrl:'/api/objectSchemas/'+this.id});navbarMain.showTab('objectSchemas');$('.workspace').html(jsonEditor.$element);}); // Field schema edit
Router.route('/jsoneditor/fieldSchemas/:id',function(){var jsonEditor=new JSONEditor({modelUrl:'/api/fieldSchemas/'+this.id});navbarMain.showTab('fieldSchemas');$('.workspace').html(jsonEditor.$element);});Router.init();},{"./views/JSONEditor":64,"./views/NavbarMain":66,"./views/PageEditor":67,"bootstrap":4,"jquery":46,"putaitu.js":58}],64:[function(require,module,exports){'use strict'; // Lib
var beautify=require('js-beautify').js_beautify; // Views
var MessageModal=require('./MessageModal'); /**
 * A basic JSON editor for any object
 */var JSONEditor=function(_View2){_inherits(JSONEditor,_View2);function JSONEditor(params){_classCallCheck2(this,JSONEditor);var _this3=_possibleConstructorReturn(this,Object.getPrototypeOf(JSONEditor).call(this,params));_this3.$element=_.div({class:'json-editor flex-vertical'});_this3.fetch();return _this3;} /**
     * Event: Click reload. Fetches the model again
     */_createClass(JSONEditor,[{key:"onClickReload",value:function onClickReload(){this.fetch();} /**
     * Event: Click save. Posts the model to the modelUrl
     */},{key:"onClickSave",value:function onClickSave(){var view=this;try{this.model=JSON.parse(this.value);$.post(this.modelUrl,this.model,function(){console.log('[JSONEditor] Saved model to '+view.modelUrl);});}catch(e){new MessageModal({model:{title:'Invalid JSON',body:e}});}} /**
     * Event: Change text. Make sure the value is up to date
     */},{key:"onChangeText",value:function onChangeText($textarea){this.value=$textarea.val();}},{key:"render",value:function render(){var view=this;this.value=beautify(JSON.stringify(this.model));this.$element.html([_.textarea({class:'flex-expand'},this.value).bind('keyup change propertychange paste',function(){view.onChangeText($(this));}),_.div({class:'btn-group flex-horizontal'},[_.button({class:'btn btn-primary flex-expand'},'Reload').click(function(){view.onClickReload();}),_.button({class:'btn btn-success flex-expand'},'Save').click(function(){view.onClickSave();})])]);}}]);return JSONEditor;}(View);module.exports=JSONEditor;},{"./MessageModal":65,"js-beautify":47}],65:[function(require,module,exports){'use strict'; /**
 * A basic modal for displaying messages to the user
 */var MessageModal=function(_View3){_inherits(MessageModal,_View3);function MessageModal(params){_classCallCheck2(this,MessageModal);var _this4=_possibleConstructorReturn(this,Object.getPrototypeOf(MessageModal).call(this,params));ViewHelper.removeAll('MessageModal');_this4.fetch();return _this4;}_createClass(MessageModal,[{key:"hide",value:function hide(){this.$element.modal('hide');}},{key:"show",value:function show(){this.$element.modal('show');}},{key:"render",value:function render(){this.$element=_.div({class:'modal fade'},_.div({class:'modal-dialog'},_.div({class:'modal-content'},[_.div({class:'modal-header'},[_.button({class:'close','data-dismiss':'modal'},_.span({class:'fa fa-close'})).click(function(){this.hide();}),_.h4({class:'modal-title'},this.model.title)]),_.div({class:'modal-body'},this.model.body),_.div({class:'modal-footer'},_.button({class:'btn btn-default','data-dismiss':'modal'},'OK').click(function(){this.hide();}))])));$('body').append(this.$element);this.$element.modal('show');}}]);return MessageModal;}(View);module.exports=MessageModal;},{}],66:[function(require,module,exports){'use strict'; /**
 * The main navbar
 */var NavbarMain=function(_View4){_inherits(NavbarMain,_View4);function NavbarMain(params){_classCallCheck2(this,NavbarMain);var _this5=_possibleConstructorReturn(this,Object.getPrototypeOf(NavbarMain).call(this,params));_this5.$element=_.nav({class:'navbar-main'});_this5.fetch();return _this5;} /**
     * Fetches pane information and renders it
     *
     * @param {String} uri
     * @param {String} name
     */_createClass(NavbarMain,[{key:"renderPane",value:function renderPane(params){var view=this;var $button=_.button({class:'btn','data-route':params.route},[_.span({class:'fa fa-'+params.icon}),_.p(params.label)]).click(function(){view.showTab(params.route);});var $pane=_.div({class:'pane list-group','data-route':params.route},_.div({class:'pane-content'}));if(params.api){$.getJSON(params.api,function(items){if(!window.resources){window.resources=[];}window.resources[params.route]=items;$pane.html(_.each(items,function(i,item){return _.a({href:'#/jsoneditor/'+params.route+'/'+(item.id||item._id),class:'pane-item list-group-item'},_.p(item.title||item.name||item.id));}));});}if(this.$element.find('.tab-panes .pane').length<1){$pane.addClass('active');$button.addClass('active');}this.$element.find('.tab-panes').append($pane);this.$element.find('.tab-buttons').append($button);} /**
     * Shows a tab
     *
     * @param {String} tabName
     */},{key:"showTab",value:function showTab(tabRoute){this.$element.find('.tab-panes .pane').each(function(i){$(this).toggleClass('active',$(this).attr('data-route')==tabRoute);});this.$element.find('.tab-buttons .btn').each(function(i){$(this).toggleClass('active',$(this).attr('data-route')==tabRoute);});}},{key:"render",value:function render(){this.$element.html([ // Tab buttons
_.div({class:'tab-buttons'},[]), // Tab panes
_.div({class:'tab-panes'})]);$('.navspace').html(this.$element);this.renderPane({api:'/api/pages',label:'Pages',route:'pages',icon:'file'});this.renderPane({api:'/api/sections',label:'Sections',route:'sections',icon:'th'});this.renderPane({api:'/api/objectSchemas',label:'Objects',route:'objectSchemas',icon:'gears'});this.renderPane({api:'/api/fieldSchemas',label:'Fields',route:'fieldSchemas',icon:'list-ul'});this.renderPane({api:'/api/fieldViews',label:'Field views',route:'fieldViews',icon:'list-ul'});}}]);return NavbarMain;}(View);module.exports=NavbarMain;},{}],67:[function(require,module,exports){'use strict';var jade=require('jade');var PageEditor=function(_View5){_inherits(PageEditor,_View5);function PageEditor(params){_classCallCheck2(this,PageEditor);var _this6=_possibleConstructorReturn(this,Object.getPrototypeOf(PageEditor).call(this,params));_this6.$element=_.div({class:'page-editor'});_this6.fetch();return _this6;} /**
     * Renders a field value
     *
     * @param {Object} field
     * @param {Object} schema
     *
     * @return {Object} element
     */_createClass(PageEditor,[{key:"renderFieldValue",value:function renderFieldValue(fieldValue,schemaValue){var fieldSchema=resources['fieldSchemas'][schemaValue.$ref];if(fieldSchema){var fieldView=resources['fieldViews'][fieldSchema.id];if(fieldView){return jade.compile(fieldView,{value:fieldValue});}else {console.log('[PageEditor] No template found for schema id "'+fieldSchema.id+'"');}}} /**
     * Renders an object
     *
     * @param {Object} data
     * @param {Object} schema
     *
     * @return {Object} element
     */},{key:"renderObject",value:function renderObject(object,schema){var view=this;return _.div({class:'object'},[_.each(schema.properties,function(key,value){return _.div({class:'field-container'},[_.div({class:'field-key'},key),_.div({class:'field-value'},view.renderFieldValue(object[key],schema.properties[key]))]);})]);}},{key:"render",value:function render(){var objectSchemas=resources['objectSchemas'];var pageSchema={};for(var i in objectSchemas){if(objectSchemas[i].id==this.model.schemaId){pageSchema=objectSchemas[i];break;}}this.$element.html(this.renderObject(this.model,pageSchema));}}]);return PageEditor;}(View);module.exports=PageEditor;},{"jade":24}]},{},[63]);