"use strict";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value" in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol?"symbol":typeof obj;};function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'");}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e);},f,f.exports,e,t,n,r);}return n[o].exports;}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++){s(r[o]);}return s;})({1:[function(require,module,exports){(function(process,global){ /* @preserve
 * The MIT License (MIT)
 * 
 * Copyright (c) 2013-2015 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */ /**
 * bluebird build version 3.3.3
 * Features enabled: core, race, call_get, generators, map, nodeify, promisify, props, reduce, settle, some, using, timers, filter, any, each
*/!function(e){if("object"==(typeof exports==="undefined"?"undefined":_typeof(exports))&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else {var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Promise=e();}}(function(){var define,module,exports;return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof _dereq_=="function"&&_dereq_;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f;}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e);},l,l.exports,e,t,n,r);}return n[o].exports;}var i=typeof _dereq_=="function"&&_dereq_;for(var o=0;o<r.length;o++){s(r[o]);}return s;}({1:[function(_dereq_,module,exports){"use strict";module.exports=function(Promise){var SomePromiseArray=Promise._SomePromiseArray;function any(promises){var ret=new SomePromiseArray(promises);var promise=ret.promise();ret.setHowMany(1);ret.setUnwrap();ret.init();return promise;}Promise.any=function(promises){return any(promises);};Promise.prototype.any=function(){return any(this);};};},{}],2:[function(_dereq_,module,exports){"use strict";var firstLineError;try{throw new Error();}catch(e){firstLineError=e;}var schedule=_dereq_("./schedule");var Queue=_dereq_("./queue");var util=_dereq_("./util");function Async(){this._isTickUsed=false;this._lateQueue=new Queue(16);this._normalQueue=new Queue(16);this._haveDrainedQueues=false;this._trampolineEnabled=true;var self=this;this.drainQueues=function(){self._drainQueues();};this._schedule=schedule;}Async.prototype.enableTrampoline=function(){this._trampolineEnabled=true;};Async.prototype.disableTrampolineIfNecessary=function(){if(util.hasDevTools){this._trampolineEnabled=false;}};Async.prototype.haveItemsQueued=function(){return this._isTickUsed||this._haveDrainedQueues;};Async.prototype.fatalError=function(e,isNode){if(isNode){process.stderr.write("Fatal "+(e instanceof Error?e.stack:e)+"\n");process.exit(2);}else {this.throwLater(e);}};Async.prototype.throwLater=function(fn,arg){if(arguments.length===1){arg=fn;fn=function fn(){throw arg;};}if(typeof setTimeout!=="undefined"){setTimeout(function(){fn(arg);},0);}else try{this._schedule(function(){fn(arg);});}catch(e){throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");}};function AsyncInvokeLater(fn,receiver,arg){this._lateQueue.push(fn,receiver,arg);this._queueTick();}function AsyncInvoke(fn,receiver,arg){this._normalQueue.push(fn,receiver,arg);this._queueTick();}function AsyncSettlePromises(promise){this._normalQueue._pushOne(promise);this._queueTick();}if(!util.hasDevTools){Async.prototype.invokeLater=AsyncInvokeLater;Async.prototype.invoke=AsyncInvoke;Async.prototype.settlePromises=AsyncSettlePromises;}else {Async.prototype.invokeLater=function(fn,receiver,arg){if(this._trampolineEnabled){AsyncInvokeLater.call(this,fn,receiver,arg);}else {this._schedule(function(){setTimeout(function(){fn.call(receiver,arg);},100);});}};Async.prototype.invoke=function(fn,receiver,arg){if(this._trampolineEnabled){AsyncInvoke.call(this,fn,receiver,arg);}else {this._schedule(function(){fn.call(receiver,arg);});}};Async.prototype.settlePromises=function(promise){if(this._trampolineEnabled){AsyncSettlePromises.call(this,promise);}else {this._schedule(function(){promise._settlePromises();});}};}Async.prototype.invokeFirst=function(fn,receiver,arg){this._normalQueue.unshift(fn,receiver,arg);this._queueTick();};Async.prototype._drainQueue=function(queue){while(queue.length()>0){var fn=queue.shift();if(typeof fn!=="function"){fn._settlePromises();continue;}var receiver=queue.shift();var arg=queue.shift();fn.call(receiver,arg);}};Async.prototype._drainQueues=function(){this._drainQueue(this._normalQueue);this._reset();this._haveDrainedQueues=true;this._drainQueue(this._lateQueue);};Async.prototype._queueTick=function(){if(!this._isTickUsed){this._isTickUsed=true;this._schedule(this.drainQueues);}};Async.prototype._reset=function(){this._isTickUsed=false;};module.exports=Async;module.exports.firstLineError=firstLineError;},{"./queue":26,"./schedule":29,"./util":36}],3:[function(_dereq_,module,exports){"use strict";module.exports=function(Promise,INTERNAL,tryConvertToPromise,debug){var calledBind=false;var rejectThis=function rejectThis(_,e){this._reject(e);};var targetRejected=function targetRejected(e,context){context.promiseRejectionQueued=true;context.bindingPromise._then(rejectThis,rejectThis,null,this,e);};var bindingResolved=function bindingResolved(thisArg,context){if((this._bitField&50397184)===0){this._resolveCallback(context.target);}};var bindingRejected=function bindingRejected(e,context){if(!context.promiseRejectionQueued)this._reject(e);};Promise.prototype.bind=function(thisArg){if(!calledBind){calledBind=true;Promise.prototype._propagateFrom=debug.propagateFromFunction();Promise.prototype._boundValue=debug.boundValueFunction();}var maybePromise=tryConvertToPromise(thisArg);var ret=new Promise(INTERNAL);ret._propagateFrom(this,1);var target=this._target();ret._setBoundTo(maybePromise);if(maybePromise instanceof Promise){var context={promiseRejectionQueued:false,promise:ret,target:target,bindingPromise:maybePromise};target._then(INTERNAL,targetRejected,undefined,ret,context);maybePromise._then(bindingResolved,bindingRejected,undefined,ret,context);ret._setOnCancel(maybePromise);}else {ret._resolveCallback(target);}return ret;};Promise.prototype._setBoundTo=function(obj){if(obj!==undefined){this._bitField=this._bitField|2097152;this._boundTo=obj;}else {this._bitField=this._bitField&~2097152;}};Promise.prototype._isBound=function(){return (this._bitField&2097152)===2097152;};Promise.bind=function(thisArg,value){return Promise.resolve(value).bind(thisArg);};};},{}],4:[function(_dereq_,module,exports){"use strict";var old;if(typeof Promise!=="undefined")old=Promise;function noConflict(){try{if(Promise===bluebird)Promise=old;}catch(e){}return bluebird;}var bluebird=_dereq_("./promise")();bluebird.noConflict=noConflict;module.exports=bluebird;},{"./promise":22}],5:[function(_dereq_,module,exports){"use strict";var cr=Object.create;if(cr){var callerCache=cr(null);var getterCache=cr(null);callerCache[" size"]=getterCache[" size"]=0;}module.exports=function(Promise){var util=_dereq_("./util");var canEvaluate=util.canEvaluate;var isIdentifier=util.isIdentifier;var getMethodCaller;var getGetter;if(!true){var makeMethodCaller=function makeMethodCaller(methodName){return new Function("ensureMethod","                                    \n\
        return function(obj) {                                               \n\
            'use strict'                                                     \n\
            var len = this.length;                                           \n\
            ensureMethod(obj, 'methodName');                                 \n\
            switch(len) {                                                    \n\
                case 1: return obj.methodName(this[0]);                      \n\
                case 2: return obj.methodName(this[0], this[1]);             \n\
                case 3: return obj.methodName(this[0], this[1], this[2]);    \n\
                case 0: return obj.methodName();                             \n\
                default:                                                     \n\
                    return obj.methodName.apply(obj, this);                  \n\
            }                                                                \n\
        };                                                                   \n\
        ".replace(/methodName/g,methodName))(ensureMethod);};var makeGetter=function makeGetter(propertyName){return new Function("obj","                                             \n\
        'use strict';                                                        \n\
        return obj.propertyName;                                             \n\
        ".replace("propertyName",propertyName));};var getCompiled=function getCompiled(name,compiler,cache){var ret=cache[name];if(typeof ret!=="function"){if(!isIdentifier(name)){return null;}ret=compiler(name);cache[name]=ret;cache[" size"]++;if(cache[" size"]>512){var keys=Object.keys(cache);for(var i=0;i<256;++i){delete cache[keys[i]];}cache[" size"]=keys.length-256;}}return ret;};getMethodCaller=function getMethodCaller(name){return getCompiled(name,makeMethodCaller,callerCache);};getGetter=function getGetter(name){return getCompiled(name,makeGetter,getterCache);};}function ensureMethod(obj,methodName){var fn;if(obj!=null)fn=obj[methodName];if(typeof fn!=="function"){var message="Object "+util.classString(obj)+" has no method '"+util.toString(methodName)+"'";throw new Promise.TypeError(message);}return fn;}function caller(obj){var methodName=this.pop();var fn=ensureMethod(obj,methodName);return fn.apply(obj,this);}Promise.prototype.call=function(methodName){var args=[].slice.call(arguments,1);;if(!true){if(canEvaluate){var maybeCaller=getMethodCaller(methodName);if(maybeCaller!==null){return this._then(maybeCaller,undefined,undefined,args,undefined);}}}args.push(methodName);return this._then(caller,undefined,undefined,args,undefined);};function namedGetter(obj){return obj[this];}function indexedGetter(obj){var index=+this;if(index<0)index=Math.max(0,index+obj.length);return obj[index];}Promise.prototype.get=function(propertyName){var isIndex=typeof propertyName==="number";var getter;if(!isIndex){if(canEvaluate){var maybeGetter=getGetter(propertyName);getter=maybeGetter!==null?maybeGetter:namedGetter;}else {getter=namedGetter;}}else {getter=indexedGetter;}return this._then(getter,undefined,undefined,propertyName,undefined);};};},{"./util":36}],6:[function(_dereq_,module,exports){"use strict";module.exports=function(Promise,PromiseArray,apiRejection,debug){var util=_dereq_("./util");var tryCatch=util.tryCatch;var errorObj=util.errorObj;var async=Promise._async;Promise.prototype["break"]=Promise.prototype.cancel=function(){if(!debug.cancellation())return this._warn("cancellation is disabled");var promise=this;var child=promise;while(promise.isCancellable()){if(!promise._cancelBy(child)){if(child._isFollowing()){child._followee().cancel();}else {child._cancelBranched();}break;}var parent=promise._cancellationParent;if(parent==null||!parent.isCancellable()){if(promise._isFollowing()){promise._followee().cancel();}else {promise._cancelBranched();}break;}else {if(promise._isFollowing())promise._followee().cancel();child=promise;promise=parent;}}};Promise.prototype._branchHasCancelled=function(){this._branchesRemainingToCancel--;};Promise.prototype._enoughBranchesHaveCancelled=function(){return this._branchesRemainingToCancel===undefined||this._branchesRemainingToCancel<=0;};Promise.prototype._cancelBy=function(canceller){if(canceller===this){this._branchesRemainingToCancel=0;this._invokeOnCancel();return true;}else {this._branchHasCancelled();if(this._enoughBranchesHaveCancelled()){this._invokeOnCancel();return true;}}return false;};Promise.prototype._cancelBranched=function(){if(this._enoughBranchesHaveCancelled()){this._cancel();}};Promise.prototype._cancel=function(){if(!this.isCancellable())return;this._setCancelled();async.invoke(this._cancelPromises,this,undefined);};Promise.prototype._cancelPromises=function(){if(this._length()>0)this._settlePromises();};Promise.prototype._unsetOnCancel=function(){this._onCancelField=undefined;};Promise.prototype.isCancellable=function(){return this.isPending()&&!this.isCancelled();};Promise.prototype._doInvokeOnCancel=function(onCancelCallback,internalOnly){if(util.isArray(onCancelCallback)){for(var i=0;i<onCancelCallback.length;++i){this._doInvokeOnCancel(onCancelCallback[i],internalOnly);}}else if(onCancelCallback!==undefined){if(typeof onCancelCallback==="function"){if(!internalOnly){var e=tryCatch(onCancelCallback).call(this._boundValue());if(e===errorObj){this._attachExtraTrace(e.e);async.throwLater(e.e);}}}else {onCancelCallback._resultCancelled(this);}}};Promise.prototype._invokeOnCancel=function(){var onCancelCallback=this._onCancel();this._unsetOnCancel();async.invoke(this._doInvokeOnCancel,this,onCancelCallback);};Promise.prototype._invokeInternalOnCancel=function(){if(this.isCancellable()){this._doInvokeOnCancel(this._onCancel(),true);this._unsetOnCancel();}};Promise.prototype._resultCancelled=function(){this.cancel();};};},{"./util":36}],7:[function(_dereq_,module,exports){"use strict";module.exports=function(NEXT_FILTER){var util=_dereq_("./util");var getKeys=_dereq_("./es5").keys;var tryCatch=util.tryCatch;var errorObj=util.errorObj;function catchFilter(instances,cb,promise){return function(e){var boundTo=promise._boundValue();predicateLoop: for(var i=0;i<instances.length;++i){var item=instances[i];if(item===Error||item!=null&&item.prototype instanceof Error){if(e instanceof item){return tryCatch(cb).call(boundTo,e);}}else if(typeof item==="function"){var matchesPredicate=tryCatch(item).call(boundTo,e);if(matchesPredicate===errorObj){return matchesPredicate;}else if(matchesPredicate){return tryCatch(cb).call(boundTo,e);}}else if(util.isObject(e)){var keys=getKeys(item);for(var j=0;j<keys.length;++j){var key=keys[j];if(item[key]!=e[key]){continue predicateLoop;}}return tryCatch(cb).call(boundTo,e);}}return NEXT_FILTER;};}return catchFilter;};},{"./es5":13,"./util":36}],8:[function(_dereq_,module,exports){"use strict";module.exports=function(Promise){var longStackTraces=false;var contextStack=[];Promise.prototype._promiseCreated=function(){};Promise.prototype._pushContext=function(){};Promise.prototype._popContext=function(){return null;};Promise._peekContext=Promise.prototype._peekContext=function(){};function Context(){this._trace=new Context.CapturedTrace(peekContext());}Context.prototype._pushContext=function(){if(this._trace!==undefined){this._trace._promiseCreated=null;contextStack.push(this._trace);}};Context.prototype._popContext=function(){if(this._trace!==undefined){var trace=contextStack.pop();var ret=trace._promiseCreated;trace._promiseCreated=null;return ret;}return null;};function createContext(){if(longStackTraces)return new Context();}function peekContext(){var lastIndex=contextStack.length-1;if(lastIndex>=0){return contextStack[lastIndex];}return undefined;}Context.CapturedTrace=null;Context.create=createContext;Context.deactivateLongStackTraces=function(){};Context.activateLongStackTraces=function(){var Promise_pushContext=Promise.prototype._pushContext;var Promise_popContext=Promise.prototype._popContext;var Promise_PeekContext=Promise._peekContext;var Promise_peekContext=Promise.prototype._peekContext;var Promise_promiseCreated=Promise.prototype._promiseCreated;Context.deactivateLongStackTraces=function(){Promise.prototype._pushContext=Promise_pushContext;Promise.prototype._popContext=Promise_popContext;Promise._peekContext=Promise_PeekContext;Promise.prototype._peekContext=Promise_peekContext;Promise.prototype._promiseCreated=Promise_promiseCreated;longStackTraces=false;};longStackTraces=true;Promise.prototype._pushContext=Context.prototype._pushContext;Promise.prototype._popContext=Context.prototype._popContext;Promise._peekContext=Promise.prototype._peekContext=peekContext;Promise.prototype._promiseCreated=function(){var ctx=this._peekContext();if(ctx&&ctx._promiseCreated==null)ctx._promiseCreated=this;};};return Context;};},{}],9:[function(_dereq_,module,exports){"use strict";module.exports=function(Promise,Context){var getDomain=Promise._getDomain;var async=Promise._async;var Warning=_dereq_("./errors").Warning;var util=_dereq_("./util");var canAttachTrace=util.canAttachTrace;var unhandledRejectionHandled;var possiblyUnhandledRejection;var bluebirdFramePattern=/[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/;var stackFramePattern=null;var formatStack=null;var indentStackFrames=false;var printWarning;var debugging=!!(util.env("BLUEBIRD_DEBUG")!=0&&(true||util.env("BLUEBIRD_DEBUG")||util.env("NODE_ENV")==="development"));var warnings=!!(util.env("BLUEBIRD_WARNINGS")!=0&&(debugging||util.env("BLUEBIRD_WARNINGS")));var longStackTraces=!!(util.env("BLUEBIRD_LONG_STACK_TRACES")!=0&&(debugging||util.env("BLUEBIRD_LONG_STACK_TRACES")));var wForgottenReturn=util.env("BLUEBIRD_W_FORGOTTEN_RETURN")!=0&&(warnings||!!util.env("BLUEBIRD_W_FORGOTTEN_RETURN"));Promise.prototype.suppressUnhandledRejections=function(){var target=this._target();target._bitField=target._bitField&~1048576|524288;};Promise.prototype._ensurePossibleRejectionHandled=function(){if((this._bitField&524288)!==0)return;this._setRejectionIsUnhandled();async.invokeLater(this._notifyUnhandledRejection,this,undefined);};Promise.prototype._notifyUnhandledRejectionIsHandled=function(){fireRejectionEvent("rejectionHandled",unhandledRejectionHandled,undefined,this);};Promise.prototype._setReturnedNonUndefined=function(){this._bitField=this._bitField|268435456;};Promise.prototype._returnedNonUndefined=function(){return (this._bitField&268435456)!==0;};Promise.prototype._notifyUnhandledRejection=function(){if(this._isRejectionUnhandled()){var reason=this._settledValue();this._setUnhandledRejectionIsNotified();fireRejectionEvent("unhandledRejection",possiblyUnhandledRejection,reason,this);}};Promise.prototype._setUnhandledRejectionIsNotified=function(){this._bitField=this._bitField|262144;};Promise.prototype._unsetUnhandledRejectionIsNotified=function(){this._bitField=this._bitField&~262144;};Promise.prototype._isUnhandledRejectionNotified=function(){return (this._bitField&262144)>0;};Promise.prototype._setRejectionIsUnhandled=function(){this._bitField=this._bitField|1048576;};Promise.prototype._unsetRejectionIsUnhandled=function(){this._bitField=this._bitField&~1048576;if(this._isUnhandledRejectionNotified()){this._unsetUnhandledRejectionIsNotified();this._notifyUnhandledRejectionIsHandled();}};Promise.prototype._isRejectionUnhandled=function(){return (this._bitField&1048576)>0;};Promise.prototype._warn=function(message,shouldUseOwnTrace,promise){return warn(message,shouldUseOwnTrace,promise||this);};Promise.onPossiblyUnhandledRejection=function(fn){var domain=getDomain();possiblyUnhandledRejection=typeof fn==="function"?domain===null?fn:domain.bind(fn):undefined;};Promise.onUnhandledRejectionHandled=function(fn){var domain=getDomain();unhandledRejectionHandled=typeof fn==="function"?domain===null?fn:domain.bind(fn):undefined;};var disableLongStackTraces=function disableLongStackTraces(){};Promise.longStackTraces=function(){if(async.haveItemsQueued()&&!config.longStackTraces){throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");}if(!config.longStackTraces&&longStackTracesIsSupported()){var Promise_captureStackTrace=Promise.prototype._captureStackTrace;var Promise_attachExtraTrace=Promise.prototype._attachExtraTrace;config.longStackTraces=true;disableLongStackTraces=function disableLongStackTraces(){if(async.haveItemsQueued()&&!config.longStackTraces){throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");}Promise.prototype._captureStackTrace=Promise_captureStackTrace;Promise.prototype._attachExtraTrace=Promise_attachExtraTrace;Context.deactivateLongStackTraces();async.enableTrampoline();config.longStackTraces=false;};Promise.prototype._captureStackTrace=longStackTracesCaptureStackTrace;Promise.prototype._attachExtraTrace=longStackTracesAttachExtraTrace;Context.activateLongStackTraces();async.disableTrampolineIfNecessary();}};Promise.hasLongStackTraces=function(){return config.longStackTraces&&longStackTracesIsSupported();};var fireDomEvent=function(){try{var event=document.createEvent("CustomEvent");event.initCustomEvent("testingtheevent",false,true,{});util.global.dispatchEvent(event);return function(name,event){var domEvent=document.createEvent("CustomEvent");domEvent.initCustomEvent(name.toLowerCase(),false,true,event);return !util.global.dispatchEvent(domEvent);};}catch(e){}return function(){return false;};}();var fireGlobalEvent=function(){if(util.isNode){return function(){return process.emit.apply(process,arguments);};}else {if(!util.global){return function(){return false;};}return function(name){var methodName="on"+name.toLowerCase();var method=util.global[methodName];if(!method)return false;method.apply(util.global,[].slice.call(arguments,1));return true;};}}();function generatePromiseLifecycleEventObject(name,promise){return {promise:promise};}var eventToObjectGenerator={promiseCreated:generatePromiseLifecycleEventObject,promiseFulfilled:generatePromiseLifecycleEventObject,promiseRejected:generatePromiseLifecycleEventObject,promiseResolved:generatePromiseLifecycleEventObject,promiseCancelled:generatePromiseLifecycleEventObject,promiseChained:function promiseChained(name,promise,child){return {promise:promise,child:child};},warning:function warning(name,_warning){return {warning:_warning};},unhandledRejection:function unhandledRejection(name,reason,promise){return {reason:reason,promise:promise};},rejectionHandled:generatePromiseLifecycleEventObject};var activeFireEvent=function activeFireEvent(name){var globalEventFired=false;try{globalEventFired=fireGlobalEvent.apply(null,arguments);}catch(e){async.throwLater(e);globalEventFired=true;}var domEventFired=false;try{domEventFired=fireDomEvent(name,eventToObjectGenerator[name].apply(null,arguments));}catch(e){async.throwLater(e);domEventFired=true;}return domEventFired||globalEventFired;};Promise.config=function(opts){opts=Object(opts);if("longStackTraces" in opts){if(opts.longStackTraces){Promise.longStackTraces();}else if(!opts.longStackTraces&&Promise.hasLongStackTraces()){disableLongStackTraces();}}if("warnings" in opts){var warningsOption=opts.warnings;config.warnings=!!warningsOption;wForgottenReturn=config.warnings;if(util.isObject(warningsOption)){if("wForgottenReturn" in warningsOption){wForgottenReturn=!!warningsOption.wForgottenReturn;}}}if("cancellation" in opts&&opts.cancellation&&!config.cancellation){if(async.haveItemsQueued()){throw new Error("cannot enable cancellation after promises are in use");}Promise.prototype._clearCancellationData=cancellationClearCancellationData;Promise.prototype._propagateFrom=cancellationPropagateFrom;Promise.prototype._onCancel=cancellationOnCancel;Promise.prototype._setOnCancel=cancellationSetOnCancel;Promise.prototype._attachCancellationCallback=cancellationAttachCancellationCallback;Promise.prototype._execute=cancellationExecute;_propagateFromFunction=cancellationPropagateFrom;config.cancellation=true;}if("monitoring" in opts){if(opts.monitoring&&!config.monitoring){config.monitoring=true;Promise.prototype._fireEvent=activeFireEvent;}else if(!opts.monitoring&&config.monitoring){config.monitoring=false;Promise.prototype._fireEvent=defaultFireEvent;}}};function defaultFireEvent(){return false;}Promise.prototype._fireEvent=defaultFireEvent;Promise.prototype._execute=function(executor,resolve,reject){try{executor(resolve,reject);}catch(e){return e;}};Promise.prototype._onCancel=function(){};Promise.prototype._setOnCancel=function(handler){;};Promise.prototype._attachCancellationCallback=function(onCancel){;};Promise.prototype._captureStackTrace=function(){};Promise.prototype._attachExtraTrace=function(){};Promise.prototype._clearCancellationData=function(){};Promise.prototype._propagateFrom=function(parent,flags){;;};function cancellationExecute(executor,resolve,reject){var promise=this;try{executor(resolve,reject,function(onCancel){if(typeof onCancel!=="function"){throw new TypeError("onCancel must be a function, got: "+util.toString(onCancel));}promise._attachCancellationCallback(onCancel);});}catch(e){return e;}}function cancellationAttachCancellationCallback(onCancel){if(!this.isCancellable())return this;var previousOnCancel=this._onCancel();if(previousOnCancel!==undefined){if(util.isArray(previousOnCancel)){previousOnCancel.push(onCancel);}else {this._setOnCancel([previousOnCancel,onCancel]);}}else {this._setOnCancel(onCancel);}}function cancellationOnCancel(){return this._onCancelField;}function cancellationSetOnCancel(onCancel){this._onCancelField=onCancel;}function cancellationClearCancellationData(){this._cancellationParent=undefined;this._onCancelField=undefined;}function cancellationPropagateFrom(parent,flags){if((flags&1)!==0){this._cancellationParent=parent;var branchesRemainingToCancel=parent._branchesRemainingToCancel;if(branchesRemainingToCancel===undefined){branchesRemainingToCancel=0;}parent._branchesRemainingToCancel=branchesRemainingToCancel+1;}if((flags&2)!==0&&parent._isBound()){this._setBoundTo(parent._boundTo);}}function bindingPropagateFrom(parent,flags){if((flags&2)!==0&&parent._isBound()){this._setBoundTo(parent._boundTo);}}var _propagateFromFunction=bindingPropagateFrom;function _boundValueFunction(){var ret=this._boundTo;if(ret!==undefined){if(ret instanceof Promise){if(ret.isFulfilled()){return ret.value();}else {return undefined;}}}return ret;}function longStackTracesCaptureStackTrace(){this._trace=new CapturedTrace(this._peekContext());}function longStackTracesAttachExtraTrace(error,ignoreSelf){if(canAttachTrace(error)){var trace=this._trace;if(trace!==undefined){if(ignoreSelf)trace=trace._parent;}if(trace!==undefined){trace.attachExtraTrace(error);}else if(!error.__stackCleaned__){var parsed=parseStackAndMessage(error);util.notEnumerableProp(error,"stack",parsed.message+"\n"+parsed.stack.join("\n"));util.notEnumerableProp(error,"__stackCleaned__",true);}}}function checkForgottenReturns(returnValue,promiseCreated,name,promise,parent){if(returnValue===undefined&&promiseCreated!==null&&wForgottenReturn){if(parent!==undefined&&parent._returnedNonUndefined())return;if(name)name=name+" ";var msg="a promise was created in a "+name+"handler but was not returned from it";promise._warn(msg,true,promiseCreated);}}function deprecated(name,replacement){var message=name+" is deprecated and will be removed in a future version.";if(replacement)message+=" Use "+replacement+" instead.";return warn(message);}function warn(message,shouldUseOwnTrace,promise){if(!config.warnings)return;var warning=new Warning(message);var ctx;if(shouldUseOwnTrace){promise._attachExtraTrace(warning);}else if(config.longStackTraces&&(ctx=Promise._peekContext())){ctx.attachExtraTrace(warning);}else {var parsed=parseStackAndMessage(warning);warning.stack=parsed.message+"\n"+parsed.stack.join("\n");}if(!activeFireEvent("warning",warning)){formatAndLogError(warning,"",true);}}function reconstructStack(message,stacks){for(var i=0;i<stacks.length-1;++i){stacks[i].push("From previous event:");stacks[i]=stacks[i].join("\n");}if(i<stacks.length){stacks[i]=stacks[i].join("\n");}return message+"\n"+stacks.join("\n");}function removeDuplicateOrEmptyJumps(stacks){for(var i=0;i<stacks.length;++i){if(stacks[i].length===0||i+1<stacks.length&&stacks[i][0]===stacks[i+1][0]){stacks.splice(i,1);i--;}}}function removeCommonRoots(stacks){var current=stacks[0];for(var i=1;i<stacks.length;++i){var prev=stacks[i];var currentLastIndex=current.length-1;var currentLastLine=current[currentLastIndex];var commonRootMeetPoint=-1;for(var j=prev.length-1;j>=0;--j){if(prev[j]===currentLastLine){commonRootMeetPoint=j;break;}}for(var j=commonRootMeetPoint;j>=0;--j){var line=prev[j];if(current[currentLastIndex]===line){current.pop();currentLastIndex--;}else {break;}}current=prev;}}function cleanStack(stack){var ret=[];for(var i=0;i<stack.length;++i){var line=stack[i];var isTraceLine="    (No stack trace)"===line||stackFramePattern.test(line);var isInternalFrame=isTraceLine&&shouldIgnore(line);if(isTraceLine&&!isInternalFrame){if(indentStackFrames&&line.charAt(0)!==" "){line="    "+line;}ret.push(line);}}return ret;}function stackFramesAsArray(error){var stack=error.stack.replace(/\s+$/g,"").split("\n");for(var i=0;i<stack.length;++i){var line=stack[i];if("    (No stack trace)"===line||stackFramePattern.test(line)){break;}}if(i>0){stack=stack.slice(i);}return stack;}function parseStackAndMessage(error){var stack=error.stack;var message=error.toString();stack=typeof stack==="string"&&stack.length>0?stackFramesAsArray(error):["    (No stack trace)"];return {message:message,stack:cleanStack(stack)};}function formatAndLogError(error,title,isSoft){if(typeof console!=="undefined"){var message;if(util.isObject(error)){var stack=error.stack;message=title+formatStack(stack,error);}else {message=title+String(error);}if(typeof printWarning==="function"){printWarning(message,isSoft);}else if(typeof console.log==="function"||_typeof(console.log)==="object"){console.log(message);}}}function fireRejectionEvent(name,localHandler,reason,promise){var localEventFired=false;try{if(typeof localHandler==="function"){localEventFired=true;if(name==="rejectionHandled"){localHandler(promise);}else {localHandler(reason,promise);}}}catch(e){async.throwLater(e);}if(name==="unhandledRejection"){if(!activeFireEvent(name,reason,promise)&&!localEventFired){formatAndLogError(reason,"Unhandled rejection ");}}else {activeFireEvent(name,promise);}}function formatNonError(obj){var str;if(typeof obj==="function"){str="[function "+(obj.name||"anonymous")+"]";}else {str=obj&&typeof obj.toString==="function"?obj.toString():util.toString(obj);var ruselessToString=/\[object [a-zA-Z0-9$_]+\]/;if(ruselessToString.test(str)){try{var newStr=JSON.stringify(obj);str=newStr;}catch(e){}}if(str.length===0){str="(empty array)";}}return "(<"+snip(str)+">, no stack trace)";}function snip(str){var maxChars=41;if(str.length<maxChars){return str;}return str.substr(0,maxChars-3)+"...";}function longStackTracesIsSupported(){return typeof captureStackTrace==="function";}var shouldIgnore=function shouldIgnore(){return false;};var parseLineInfoRegex=/[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;function parseLineInfo(line){var matches=line.match(parseLineInfoRegex);if(matches){return {fileName:matches[1],line:parseInt(matches[2],10)};}}function setBounds(firstLineError,lastLineError){if(!longStackTracesIsSupported())return;var firstStackLines=firstLineError.stack.split("\n");var lastStackLines=lastLineError.stack.split("\n");var firstIndex=-1;var lastIndex=-1;var firstFileName;var lastFileName;for(var i=0;i<firstStackLines.length;++i){var result=parseLineInfo(firstStackLines[i]);if(result){firstFileName=result.fileName;firstIndex=result.line;break;}}for(var i=0;i<lastStackLines.length;++i){var result=parseLineInfo(lastStackLines[i]);if(result){lastFileName=result.fileName;lastIndex=result.line;break;}}if(firstIndex<0||lastIndex<0||!firstFileName||!lastFileName||firstFileName!==lastFileName||firstIndex>=lastIndex){return;}shouldIgnore=function shouldIgnore(line){if(bluebirdFramePattern.test(line))return true;var info=parseLineInfo(line);if(info){if(info.fileName===firstFileName&&firstIndex<=info.line&&info.line<=lastIndex){return true;}}return false;};}function CapturedTrace(parent){this._parent=parent;this._promisesCreated=0;var length=this._length=1+(parent===undefined?0:parent._length);captureStackTrace(this,CapturedTrace);if(length>32)this.uncycle();}util.inherits(CapturedTrace,Error);Context.CapturedTrace=CapturedTrace;CapturedTrace.prototype.uncycle=function(){var length=this._length;if(length<2)return;var nodes=[];var stackToIndex={};for(var i=0,node=this;node!==undefined;++i){nodes.push(node);node=node._parent;}length=this._length=i;for(var i=length-1;i>=0;--i){var stack=nodes[i].stack;if(stackToIndex[stack]===undefined){stackToIndex[stack]=i;}}for(var i=0;i<length;++i){var currentStack=nodes[i].stack;var index=stackToIndex[currentStack];if(index!==undefined&&index!==i){if(index>0){nodes[index-1]._parent=undefined;nodes[index-1]._length=1;}nodes[i]._parent=undefined;nodes[i]._length=1;var cycleEdgeNode=i>0?nodes[i-1]:this;if(index<length-1){cycleEdgeNode._parent=nodes[index+1];cycleEdgeNode._parent.uncycle();cycleEdgeNode._length=cycleEdgeNode._parent._length+1;}else {cycleEdgeNode._parent=undefined;cycleEdgeNode._length=1;}var currentChildLength=cycleEdgeNode._length+1;for(var j=i-2;j>=0;--j){nodes[j]._length=currentChildLength;currentChildLength++;}return;}}};CapturedTrace.prototype.attachExtraTrace=function(error){if(error.__stackCleaned__)return;this.uncycle();var parsed=parseStackAndMessage(error);var message=parsed.message;var stacks=[parsed.stack];var trace=this;while(trace!==undefined){stacks.push(cleanStack(trace.stack.split("\n")));trace=trace._parent;}removeCommonRoots(stacks);removeDuplicateOrEmptyJumps(stacks);util.notEnumerableProp(error,"stack",reconstructStack(message,stacks));util.notEnumerableProp(error,"__stackCleaned__",true);};var captureStackTrace=function stackDetection(){var v8stackFramePattern=/^\s*at\s*/;var v8stackFormatter=function v8stackFormatter(stack,error){if(typeof stack==="string")return stack;if(error.name!==undefined&&error.message!==undefined){return error.toString();}return formatNonError(error);};if(typeof Error.stackTraceLimit==="number"&&typeof Error.captureStackTrace==="function"){Error.stackTraceLimit+=6;stackFramePattern=v8stackFramePattern;formatStack=v8stackFormatter;var captureStackTrace=Error.captureStackTrace;shouldIgnore=function shouldIgnore(line){return bluebirdFramePattern.test(line);};return function(receiver,ignoreUntil){Error.stackTraceLimit+=6;captureStackTrace(receiver,ignoreUntil);Error.stackTraceLimit-=6;};}var err=new Error();if(typeof err.stack==="string"&&err.stack.split("\n")[0].indexOf("stackDetection@")>=0){stackFramePattern=/@/;formatStack=v8stackFormatter;indentStackFrames=true;return function captureStackTrace(o){o.stack=new Error().stack;};}var hasStackAfterThrow;try{throw new Error();}catch(e){hasStackAfterThrow="stack" in e;}if(!("stack" in err)&&hasStackAfterThrow&&typeof Error.stackTraceLimit==="number"){stackFramePattern=v8stackFramePattern;formatStack=v8stackFormatter;return function captureStackTrace(o){Error.stackTraceLimit+=6;try{throw new Error();}catch(e){o.stack=e.stack;}Error.stackTraceLimit-=6;};}formatStack=function formatStack(stack,error){if(typeof stack==="string")return stack;if(((typeof error==="undefined"?"undefined":_typeof(error))==="object"||typeof error==="function")&&error.name!==undefined&&error.message!==undefined){return error.toString();}return formatNonError(error);};return null;}([]);if(typeof console!=="undefined"&&typeof console.warn!=="undefined"){printWarning=function printWarning(message){console.warn(message);};if(util.isNode&&process.stderr.isTTY){printWarning=function printWarning(message,isSoft){var color=isSoft?"\u001b[33m":"\u001b[31m";console.warn(color+message+"\u001b[0m\n");};}else if(!util.isNode&&typeof new Error().stack==="string"){printWarning=function printWarning(message,isSoft){console.warn("%c"+message,isSoft?"color: darkorange":"color: red");};}}var config={warnings:warnings,longStackTraces:false,cancellation:false,monitoring:false};if(longStackTraces)Promise.longStackTraces();return {longStackTraces:function longStackTraces(){return config.longStackTraces;},warnings:function warnings(){return config.warnings;},cancellation:function cancellation(){return config.cancellation;},monitoring:function monitoring(){return config.monitoring;},propagateFromFunction:function propagateFromFunction(){return _propagateFromFunction;},boundValueFunction:function boundValueFunction(){return _boundValueFunction;},checkForgottenReturns:checkForgottenReturns,setBounds:setBounds,warn:warn,deprecated:deprecated,CapturedTrace:CapturedTrace,fireDomEvent:fireDomEvent,fireGlobalEvent:fireGlobalEvent};};},{"./errors":12,"./util":36}],10:[function(_dereq_,module,exports){"use strict";module.exports=function(Promise){function returner(){return this.value;}function thrower(){throw this.reason;}Promise.prototype["return"]=Promise.prototype.thenReturn=function(value){if(value instanceof Promise)value.suppressUnhandledRejections();return this._then(returner,undefined,undefined,{value:value},undefined);};Promise.prototype["throw"]=Promise.prototype.thenThrow=function(reason){return this._then(thrower,undefined,undefined,{reason:reason},undefined);};Promise.prototype.catchThrow=function(reason){if(arguments.length<=1){return this._then(undefined,thrower,undefined,{reason:reason},undefined);}else {var _reason=arguments[1];var handler=function handler(){throw _reason;};return this.caught(reason,handler);}};Promise.prototype.catchReturn=function(value){if(arguments.length<=1){if(value instanceof Promise)value.suppressUnhandledRejections();return this._then(undefined,returner,undefined,{value:value},undefined);}else {var _value=arguments[1];if(_value instanceof Promise)_value.suppressUnhandledRejections();var handler=function handler(){return _value;};return this.caught(value,handler);}};};},{}],11:[function(_dereq_,module,exports){"use strict";module.exports=function(Promise,INTERNAL){var PromiseReduce=Promise.reduce;var PromiseAll=Promise.all;function promiseAllThis(){return PromiseAll(this);}function PromiseMapSeries(promises,fn){return PromiseReduce(promises,fn,INTERNAL,INTERNAL);}Promise.prototype.each=function(fn){return this.mapSeries(fn)._then(promiseAllThis,undefined,undefined,this,undefined);};Promise.prototype.mapSeries=function(fn){return PromiseReduce(this,fn,INTERNAL,INTERNAL);};Promise.each=function(promises,fn){return PromiseMapSeries(promises,fn)._then(promiseAllThis,undefined,undefined,promises,undefined);};Promise.mapSeries=PromiseMapSeries;};},{}],12:[function(_dereq_,module,exports){"use strict";var es5=_dereq_("./es5");var Objectfreeze=es5.freeze;var util=_dereq_("./util");var inherits=util.inherits;var notEnumerableProp=util.notEnumerableProp;function subError(nameProperty,defaultMessage){function SubError(message){if(!(this instanceof SubError))return new SubError(message);notEnumerableProp(this,"message",typeof message==="string"?message:defaultMessage);notEnumerableProp(this,"name",nameProperty);if(Error.captureStackTrace){Error.captureStackTrace(this,this.constructor);}else {Error.call(this);}}inherits(SubError,Error);return SubError;}var _TypeError,_RangeError;var Warning=subError("Warning","warning");var CancellationError=subError("CancellationError","cancellation error");var TimeoutError=subError("TimeoutError","timeout error");var AggregateError=subError("AggregateError","aggregate error");try{_TypeError=TypeError;_RangeError=RangeError;}catch(e){_TypeError=subError("TypeError","type error");_RangeError=subError("RangeError","range error");}var methods=("join pop push shift unshift slice filter forEach some "+"every map indexOf lastIndexOf reduce reduceRight sort reverse").split(" ");for(var i=0;i<methods.length;++i){if(typeof Array.prototype[methods[i]]==="function"){AggregateError.prototype[methods[i]]=Array.prototype[methods[i]];}}es5.defineProperty(AggregateError.prototype,"length",{value:0,configurable:false,writable:true,enumerable:true});AggregateError.prototype["isOperational"]=true;var level=0;AggregateError.prototype.toString=function(){var indent=Array(level*4+1).join(" ");var ret="\n"+indent+"AggregateError of:"+"\n";level++;indent=Array(level*4+1).join(" ");for(var i=0;i<this.length;++i){var str=this[i]===this?"[Circular AggregateError]":this[i]+"";var lines=str.split("\n");for(var j=0;j<lines.length;++j){lines[j]=indent+lines[j];}str=lines.join("\n");ret+=str+"\n";}level--;return ret;};function OperationalError(message){if(!(this instanceof OperationalError))return new OperationalError(message);notEnumerableProp(this,"name","OperationalError");notEnumerableProp(this,"message",message);this.cause=message;this["isOperational"]=true;if(message instanceof Error){notEnumerableProp(this,"message",message.message);notEnumerableProp(this,"stack",message.stack);}else if(Error.captureStackTrace){Error.captureStackTrace(this,this.constructor);}}inherits(OperationalError,Error);var errorTypes=Error["__BluebirdErrorTypes__"];if(!errorTypes){errorTypes=Objectfreeze({CancellationError:CancellationError,TimeoutError:TimeoutError,OperationalError:OperationalError,RejectionError:OperationalError,AggregateError:AggregateError});es5.defineProperty(Error,"__BluebirdErrorTypes__",{value:errorTypes,writable:false,enumerable:false,configurable:false});}module.exports={Error:Error,TypeError:_TypeError,RangeError:_RangeError,CancellationError:errorTypes.CancellationError,OperationalError:errorTypes.OperationalError,TimeoutError:errorTypes.TimeoutError,AggregateError:errorTypes.AggregateError,Warning:Warning};},{"./es5":13,"./util":36}],13:[function(_dereq_,module,exports){var isES5=function(){"use strict";return this===undefined;}();if(isES5){module.exports={freeze:Object.freeze,defineProperty:Object.defineProperty,getDescriptor:Object.getOwnPropertyDescriptor,keys:Object.keys,names:Object.getOwnPropertyNames,getPrototypeOf:Object.getPrototypeOf,isArray:Array.isArray,isES5:isES5,propertyIsWritable:function propertyIsWritable(obj,prop){var descriptor=Object.getOwnPropertyDescriptor(obj,prop);return !!(!descriptor||descriptor.writable||descriptor.set);}};}else {var has={}.hasOwnProperty;var str={}.toString;var proto={}.constructor.prototype;var ObjectKeys=function ObjectKeys(o){var ret=[];for(var key in o){if(has.call(o,key)){ret.push(key);}}return ret;};var ObjectGetDescriptor=function ObjectGetDescriptor(o,key){return {value:o[key]};};var ObjectDefineProperty=function ObjectDefineProperty(o,key,desc){o[key]=desc.value;return o;};var ObjectFreeze=function ObjectFreeze(obj){return obj;};var ObjectGetPrototypeOf=function ObjectGetPrototypeOf(obj){try{return Object(obj).constructor.prototype;}catch(e){return proto;}};var ArrayIsArray=function ArrayIsArray(obj){try{return str.call(obj)==="[object Array]";}catch(e){return false;}};module.exports={isArray:ArrayIsArray,keys:ObjectKeys,names:ObjectKeys,defineProperty:ObjectDefineProperty,getDescriptor:ObjectGetDescriptor,freeze:ObjectFreeze,getPrototypeOf:ObjectGetPrototypeOf,isES5:isES5,propertyIsWritable:function propertyIsWritable(){return true;}};}},{}],14:[function(_dereq_,module,exports){"use strict";module.exports=function(Promise,INTERNAL){var PromiseMap=Promise.map;Promise.prototype.filter=function(fn,options){return PromiseMap(this,fn,options,INTERNAL);};Promise.filter=function(promises,fn,options){return PromiseMap(promises,fn,options,INTERNAL);};};},{}],15:[function(_dereq_,module,exports){"use strict";module.exports=function(Promise,tryConvertToPromise){var util=_dereq_("./util");var CancellationError=Promise.CancellationError;var errorObj=util.errorObj;function PassThroughHandlerContext(promise,type,handler){this.promise=promise;this.type=type;this.handler=handler;this.called=false;this.cancelPromise=null;}PassThroughHandlerContext.prototype.isFinallyHandler=function(){return this.type===0;};function FinallyHandlerCancelReaction(finallyHandler){this.finallyHandler=finallyHandler;}FinallyHandlerCancelReaction.prototype._resultCancelled=function(){checkCancel(this.finallyHandler);};function checkCancel(ctx,reason){if(ctx.cancelPromise!=null){if(arguments.length>1){ctx.cancelPromise._reject(reason);}else {ctx.cancelPromise._cancel();}ctx.cancelPromise=null;return true;}return false;}function succeed(){return finallyHandler.call(this,this.promise._target()._settledValue());}function fail(reason){if(checkCancel(this,reason))return;errorObj.e=reason;return errorObj;}function finallyHandler(reasonOrValue){var promise=this.promise;var handler=this.handler;if(!this.called){this.called=true;var ret=this.isFinallyHandler()?handler.call(promise._boundValue()):handler.call(promise._boundValue(),reasonOrValue);if(ret!==undefined){promise._setReturnedNonUndefined();var maybePromise=tryConvertToPromise(ret,promise);if(maybePromise instanceof Promise){if(this.cancelPromise!=null){if(maybePromise.isCancelled()){var reason=new CancellationError("late cancellation observer");promise._attachExtraTrace(reason);errorObj.e=reason;return errorObj;}else if(maybePromise.isPending()){maybePromise._attachCancellationCallback(new FinallyHandlerCancelReaction(this));}}return maybePromise._then(succeed,fail,undefined,this,undefined);}}}if(promise.isRejected()){checkCancel(this);errorObj.e=reasonOrValue;return errorObj;}else {checkCancel(this);return reasonOrValue;}}Promise.prototype._passThrough=function(handler,type,success,fail){if(typeof handler!=="function")return this.then();return this._then(success,fail,undefined,new PassThroughHandlerContext(this,type,handler),undefined);};Promise.prototype.lastly=Promise.prototype["finally"]=function(handler){return this._passThrough(handler,0,finallyHandler,finallyHandler);};Promise.prototype.tap=function(handler){return this._passThrough(handler,1,finallyHandler);};return PassThroughHandlerContext;};},{"./util":36}],16:[function(_dereq_,module,exports){"use strict";module.exports=function(Promise,apiRejection,INTERNAL,tryConvertToPromise,Proxyable,debug){var errors=_dereq_("./errors");var TypeError=errors.TypeError;var util=_dereq_("./util");var errorObj=util.errorObj;var tryCatch=util.tryCatch;var yieldHandlers=[];function promiseFromYieldHandler(value,yieldHandlers,traceParent){for(var i=0;i<yieldHandlers.length;++i){traceParent._pushContext();var result=tryCatch(yieldHandlers[i])(value);traceParent._popContext();if(result===errorObj){traceParent._pushContext();var ret=Promise.reject(errorObj.e);traceParent._popContext();return ret;}var maybePromise=tryConvertToPromise(result,traceParent);if(maybePromise instanceof Promise)return maybePromise;}return null;}function PromiseSpawn(generatorFunction,receiver,yieldHandler,stack){var promise=this._promise=new Promise(INTERNAL);promise._captureStackTrace();promise._setOnCancel(this);this._stack=stack;this._generatorFunction=generatorFunction;this._receiver=receiver;this._generator=undefined;this._yieldHandlers=typeof yieldHandler==="function"?[yieldHandler].concat(yieldHandlers):yieldHandlers;this._yieldedPromise=null;}util.inherits(PromiseSpawn,Proxyable);PromiseSpawn.prototype._isResolved=function(){return this._promise===null;};PromiseSpawn.prototype._cleanup=function(){this._promise=this._generator=null;};PromiseSpawn.prototype._promiseCancelled=function(){if(this._isResolved())return;var implementsReturn=typeof this._generator["return"]!=="undefined";var result;if(!implementsReturn){var reason=new Promise.CancellationError("generator .return() sentinel");Promise.coroutine.returnSentinel=reason;this._promise._attachExtraTrace(reason);this._promise._pushContext();result=tryCatch(this._generator["throw"]).call(this._generator,reason);this._promise._popContext();if(result===errorObj&&result.e===reason){result=null;}}else {this._promise._pushContext();result=tryCatch(this._generator["return"]).call(this._generator,undefined);this._promise._popContext();}var promise=this._promise;this._cleanup();if(result===errorObj){promise._rejectCallback(result.e,false);}else {promise.cancel();}};PromiseSpawn.prototype._promiseFulfilled=function(value){this._yieldedPromise=null;this._promise._pushContext();var result=tryCatch(this._generator.next).call(this._generator,value);this._promise._popContext();this._continue(result);};PromiseSpawn.prototype._promiseRejected=function(reason){this._yieldedPromise=null;this._promise._attachExtraTrace(reason);this._promise._pushContext();var result=tryCatch(this._generator["throw"]).call(this._generator,reason);this._promise._popContext();this._continue(result);};PromiseSpawn.prototype._resultCancelled=function(){if(this._yieldedPromise instanceof Promise){var promise=this._yieldedPromise;this._yieldedPromise=null;promise.cancel();}};PromiseSpawn.prototype.promise=function(){return this._promise;};PromiseSpawn.prototype._run=function(){this._generator=this._generatorFunction.call(this._receiver);this._receiver=this._generatorFunction=undefined;this._promiseFulfilled(undefined);};PromiseSpawn.prototype._continue=function(result){var promise=this._promise;if(result===errorObj){this._cleanup();return promise._rejectCallback(result.e,false);}var value=result.value;if(result.done===true){this._cleanup();return promise._resolveCallback(value);}else {var maybePromise=tryConvertToPromise(value,this._promise);if(!(maybePromise instanceof Promise)){maybePromise=promiseFromYieldHandler(maybePromise,this._yieldHandlers,this._promise);if(maybePromise===null){this._promiseRejected(new TypeError("A value %s was yielded that could not be treated as a promise\n\n    See http://goo.gl/MqrFmX\n\n".replace("%s",value)+"From coroutine:\n"+this._stack.split("\n").slice(1,-7).join("\n")));return;}}maybePromise=maybePromise._target();var bitField=maybePromise._bitField;;if((bitField&50397184)===0){this._yieldedPromise=maybePromise;maybePromise._proxy(this,null);}else if((bitField&33554432)!==0){this._promiseFulfilled(maybePromise._value());}else if((bitField&16777216)!==0){this._promiseRejected(maybePromise._reason());}else {this._promiseCancelled();}}};Promise.coroutine=function(generatorFunction,options){if(typeof generatorFunction!=="function"){throw new TypeError("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");}var yieldHandler=Object(options).yieldHandler;var PromiseSpawn$=PromiseSpawn;var stack=new Error().stack;return function(){var generator=generatorFunction.apply(this,arguments);var spawn=new PromiseSpawn$(undefined,undefined,yieldHandler,stack);var ret=spawn.promise();spawn._generator=generator;spawn._promiseFulfilled(undefined);return ret;};};Promise.coroutine.addYieldHandler=function(fn){if(typeof fn!=="function"){throw new TypeError("expecting a function but got "+util.classString(fn));}yieldHandlers.push(fn);};Promise.spawn=function(generatorFunction){debug.deprecated("Promise.spawn()","Promise.coroutine()");if(typeof generatorFunction!=="function"){return apiRejection("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");}var spawn=new PromiseSpawn(generatorFunction,this);var ret=spawn.promise();spawn._run(Promise.spawn);return ret;};};},{"./errors":12,"./util":36}],17:[function(_dereq_,module,exports){"use strict";module.exports=function(Promise,PromiseArray,tryConvertToPromise,INTERNAL){var util=_dereq_("./util");var canEvaluate=util.canEvaluate;var tryCatch=util.tryCatch;var errorObj=util.errorObj;var reject;if(!true){if(canEvaluate){var thenCallback=function thenCallback(i){return new Function("value","holder","                             \n\
            'use strict';                                                    \n\
            holder.pIndex = value;                                           \n\
            holder.checkFulfillment(this);                                   \n\
            ".replace(/Index/g,i));};var promiseSetter=function promiseSetter(i){return new Function("promise","holder","                           \n\
            'use strict';                                                    \n\
            holder.pIndex = promise;                                         \n\
            ".replace(/Index/g,i));};var generateHolderClass=function generateHolderClass(total){var props=new Array(total);for(var i=0;i<props.length;++i){props[i]="this.p"+(i+1);}var assignment=props.join(" = ")+" = null;";var cancellationCode="var promise;\n"+props.map(function(prop){return "                                                         \n\
                promise = "+prop+";                                      \n\
                if (promise instanceof Promise) {                            \n\
                    promise.cancel();                                        \n\
                }                                                            \n\
            ";}).join("\n");var passedArguments=props.join(", ");var name="Holder$"+total;var code="return function(tryCatch, errorObj, Promise) {           \n\
            'use strict';                                                    \n\
            function [TheName](fn) {                                         \n\
                [TheProperties]                                              \n\
                this.fn = fn;                                                \n\
                this.now = 0;                                                \n\
            }                                                                \n\
            [TheName].prototype.checkFulfillment = function(promise) {       \n\
                var now = ++this.now;                                        \n\
                if (now === [TheTotal]) {                                    \n\
                    promise._pushContext();                                  \n\
                    var callback = this.fn;                                  \n\
                    var ret = tryCatch(callback)([ThePassedArguments]);      \n\
                    promise._popContext();                                   \n\
                    if (ret === errorObj) {                                  \n\
                        promise._rejectCallback(ret.e, false);               \n\
                    } else {                                                 \n\
                        promise._resolveCallback(ret);                       \n\
                    }                                                        \n\
                }                                                            \n\
            };                                                               \n\
                                                                             \n\
            [TheName].prototype._resultCancelled = function() {              \n\
                [CancellationCode]                                           \n\
            };                                                               \n\
                                                                             \n\
            return [TheName];                                                \n\
        }(tryCatch, errorObj, Promise);                                      \n\
        ";code=code.replace(/\[TheName\]/g,name).replace(/\[TheTotal\]/g,total).replace(/\[ThePassedArguments\]/g,passedArguments).replace(/\[TheProperties\]/g,assignment).replace(/\[CancellationCode\]/g,cancellationCode);return new Function("tryCatch","errorObj","Promise",code)(tryCatch,errorObj,Promise);};var holderClasses=[];var thenCallbacks=[];var promiseSetters=[];for(var i=0;i<8;++i){holderClasses.push(generateHolderClass(i+1));thenCallbacks.push(thenCallback(i+1));promiseSetters.push(promiseSetter(i+1));}reject=function reject(reason){this._reject(reason);};}}Promise.join=function(){var last=arguments.length-1;var fn;if(last>0&&typeof arguments[last]==="function"){fn=arguments[last];if(!true){if(last<=8&&canEvaluate){var ret=new Promise(INTERNAL);ret._captureStackTrace();var HolderClass=holderClasses[last-1];var holder=new HolderClass(fn);var callbacks=thenCallbacks;for(var i=0;i<last;++i){var maybePromise=tryConvertToPromise(arguments[i],ret);if(maybePromise instanceof Promise){maybePromise=maybePromise._target();var bitField=maybePromise._bitField;;if((bitField&50397184)===0){maybePromise._then(callbacks[i],reject,undefined,ret,holder);promiseSetters[i](maybePromise,holder);}else if((bitField&33554432)!==0){callbacks[i].call(ret,maybePromise._value(),holder);}else if((bitField&16777216)!==0){ret._reject(maybePromise._reason());}else {ret._cancel();}}else {callbacks[i].call(ret,maybePromise,holder);}}if(!ret._isFateSealed()){ret._setAsyncGuaranteed();ret._setOnCancel(holder);}return ret;}}}var args=[].slice.call(arguments);;if(fn)args.pop();var ret=new PromiseArray(args).promise();return fn!==undefined?ret.spread(fn):ret;};};},{"./util":36}],18:[function(_dereq_,module,exports){"use strict";module.exports=function(Promise,PromiseArray,apiRejection,tryConvertToPromise,INTERNAL,debug){var getDomain=Promise._getDomain;var util=_dereq_("./util");var tryCatch=util.tryCatch;var errorObj=util.errorObj;var EMPTY_ARRAY=[];function MappingPromiseArray(promises,fn,limit,_filter){this.constructor$(promises);this._promise._captureStackTrace();var domain=getDomain();this._callback=domain===null?fn:domain.bind(fn);this._preservedValues=_filter===INTERNAL?new Array(this.length()):null;this._limit=limit;this._inFlight=0;this._queue=limit>=1?[]:EMPTY_ARRAY;this._init$(undefined,-2);}util.inherits(MappingPromiseArray,PromiseArray);MappingPromiseArray.prototype._init=function(){};MappingPromiseArray.prototype._promiseFulfilled=function(value,index){var values=this._values;var length=this.length();var preservedValues=this._preservedValues;var limit=this._limit;if(index<0){index=index*-1-1;values[index]=value;if(limit>=1){this._inFlight--;this._drainQueue();if(this._isResolved())return true;}}else {if(limit>=1&&this._inFlight>=limit){values[index]=value;this._queue.push(index);return false;}if(preservedValues!==null)preservedValues[index]=value;var promise=this._promise;var callback=this._callback;var receiver=promise._boundValue();promise._pushContext();var ret=tryCatch(callback).call(receiver,value,index,length);var promiseCreated=promise._popContext();debug.checkForgottenReturns(ret,promiseCreated,preservedValues!==null?"Promise.filter":"Promise.map",promise);if(ret===errorObj){this._reject(ret.e);return true;}var maybePromise=tryConvertToPromise(ret,this._promise);if(maybePromise instanceof Promise){maybePromise=maybePromise._target();var bitField=maybePromise._bitField;;if((bitField&50397184)===0){if(limit>=1)this._inFlight++;values[index]=maybePromise;maybePromise._proxy(this,(index+1)*-1);return false;}else if((bitField&33554432)!==0){ret=maybePromise._value();}else if((bitField&16777216)!==0){this._reject(maybePromise._reason());return true;}else {this._cancel();return true;}}values[index]=ret;}var totalResolved=++this._totalResolved;if(totalResolved>=length){if(preservedValues!==null){this._filter(values,preservedValues);}else {this._resolve(values);}return true;}return false;};MappingPromiseArray.prototype._drainQueue=function(){var queue=this._queue;var limit=this._limit;var values=this._values;while(queue.length>0&&this._inFlight<limit){if(this._isResolved())return;var index=queue.pop();this._promiseFulfilled(values[index],index);}};MappingPromiseArray.prototype._filter=function(booleans,values){var len=values.length;var ret=new Array(len);var j=0;for(var i=0;i<len;++i){if(booleans[i])ret[j++]=values[i];}ret.length=j;this._resolve(ret);};MappingPromiseArray.prototype.preservedValues=function(){return this._preservedValues;};function map(promises,fn,options,_filter){if(typeof fn!=="function"){return apiRejection("expecting a function but got "+util.classString(fn));}var limit=(typeof options==="undefined"?"undefined":_typeof(options))==="object"&&options!==null?options.concurrency:0;limit=typeof limit==="number"&&isFinite(limit)&&limit>=1?limit:0;return new MappingPromiseArray(promises,fn,limit,_filter).promise();}Promise.prototype.map=function(fn,options){return map(this,fn,options,null);};Promise.map=function(promises,fn,options,_filter){return map(promises,fn,options,_filter);};};},{"./util":36}],19:[function(_dereq_,module,exports){"use strict";module.exports=function(Promise,INTERNAL,tryConvertToPromise,apiRejection,debug){var util=_dereq_("./util");var tryCatch=util.tryCatch;Promise.method=function(fn){if(typeof fn!=="function"){throw new Promise.TypeError("expecting a function but got "+util.classString(fn));}return function(){var ret=new Promise(INTERNAL);ret._captureStackTrace();ret._pushContext();var value=tryCatch(fn).apply(this,arguments);var promiseCreated=ret._popContext();debug.checkForgottenReturns(value,promiseCreated,"Promise.method",ret);ret._resolveFromSyncValue(value);return ret;};};Promise.attempt=Promise["try"]=function(fn){if(typeof fn!=="function"){return apiRejection("expecting a function but got "+util.classString(fn));}var ret=new Promise(INTERNAL);ret._captureStackTrace();ret._pushContext();var value;if(arguments.length>1){debug.deprecated("calling Promise.try with more than 1 argument");var arg=arguments[1];var ctx=arguments[2];value=util.isArray(arg)?tryCatch(fn).apply(ctx,arg):tryCatch(fn).call(ctx,arg);}else {value=tryCatch(fn)();}var promiseCreated=ret._popContext();debug.checkForgottenReturns(value,promiseCreated,"Promise.try",ret);ret._resolveFromSyncValue(value);return ret;};Promise.prototype._resolveFromSyncValue=function(value){if(value===util.errorObj){this._rejectCallback(value.e,false);}else {this._resolveCallback(value,true);}};};},{"./util":36}],20:[function(_dereq_,module,exports){"use strict";var util=_dereq_("./util");var maybeWrapAsError=util.maybeWrapAsError;var errors=_dereq_("./errors");var OperationalError=errors.OperationalError;var es5=_dereq_("./es5");function isUntypedError(obj){return obj instanceof Error&&es5.getPrototypeOf(obj)===Error.prototype;}var rErrorKey=/^(?:name|message|stack|cause)$/;function wrapAsOperationalError(obj){var ret;if(isUntypedError(obj)){ret=new OperationalError(obj);ret.name=obj.name;ret.message=obj.message;ret.stack=obj.stack;var keys=es5.keys(obj);for(var i=0;i<keys.length;++i){var key=keys[i];if(!rErrorKey.test(key)){ret[key]=obj[key];}}return ret;}util.markAsOriginatingFromRejection(obj);return obj;}function nodebackForPromise(promise,multiArgs){return function(err,value){if(promise===null)return;if(err){var wrapped=wrapAsOperationalError(maybeWrapAsError(err));promise._attachExtraTrace(wrapped);promise._reject(wrapped);}else if(!multiArgs){promise._fulfill(value);}else {var args=[].slice.call(arguments,1);;promise._fulfill(args);}promise=null;};}module.exports=nodebackForPromise;},{"./errors":12,"./es5":13,"./util":36}],21:[function(_dereq_,module,exports){"use strict";module.exports=function(Promise){var util=_dereq_("./util");var async=Promise._async;var tryCatch=util.tryCatch;var errorObj=util.errorObj;function spreadAdapter(val,nodeback){var promise=this;if(!util.isArray(val))return successAdapter.call(promise,val,nodeback);var ret=tryCatch(nodeback).apply(promise._boundValue(),[null].concat(val));if(ret===errorObj){async.throwLater(ret.e);}}function successAdapter(val,nodeback){var promise=this;var receiver=promise._boundValue();var ret=val===undefined?tryCatch(nodeback).call(receiver,null):tryCatch(nodeback).call(receiver,null,val);if(ret===errorObj){async.throwLater(ret.e);}}function errorAdapter(reason,nodeback){var promise=this;if(!reason){var newReason=new Error(reason+"");newReason.cause=reason;reason=newReason;}var ret=tryCatch(nodeback).call(promise._boundValue(),reason);if(ret===errorObj){async.throwLater(ret.e);}}Promise.prototype.asCallback=Promise.prototype.nodeify=function(nodeback,options){if(typeof nodeback=="function"){var adapter=successAdapter;if(options!==undefined&&Object(options).spread){adapter=spreadAdapter;}this._then(adapter,errorAdapter,undefined,this,nodeback);}return this;};};},{"./util":36}],22:[function(_dereq_,module,exports){"use strict";module.exports=function(){var makeSelfResolutionError=function makeSelfResolutionError(){return new TypeError("circular promise resolution chain\n\n    See http://goo.gl/MqrFmX\n");};var reflectHandler=function reflectHandler(){return new Promise.PromiseInspection(this._target());};var apiRejection=function apiRejection(msg){return Promise.reject(new TypeError(msg));};function Proxyable(){}var UNDEFINED_BINDING={};var util=_dereq_("./util");var getDomain;if(util.isNode){getDomain=function getDomain(){var ret=process.domain;if(ret===undefined)ret=null;return ret;};}else {getDomain=function getDomain(){return null;};}util.notEnumerableProp(Promise,"_getDomain",getDomain);var es5=_dereq_("./es5");var Async=_dereq_("./async");var async=new Async();es5.defineProperty(Promise,"_async",{value:async});var errors=_dereq_("./errors");var TypeError=Promise.TypeError=errors.TypeError;Promise.RangeError=errors.RangeError;var CancellationError=Promise.CancellationError=errors.CancellationError;Promise.TimeoutError=errors.TimeoutError;Promise.OperationalError=errors.OperationalError;Promise.RejectionError=errors.OperationalError;Promise.AggregateError=errors.AggregateError;var INTERNAL=function INTERNAL(){};var APPLY={};var NEXT_FILTER={};var tryConvertToPromise=_dereq_("./thenables")(Promise,INTERNAL);var PromiseArray=_dereq_("./promise_array")(Promise,INTERNAL,tryConvertToPromise,apiRejection,Proxyable);var Context=_dereq_("./context")(Promise); /*jshint unused:false*/var createContext=Context.create;var debug=_dereq_("./debuggability")(Promise,Context);var CapturedTrace=debug.CapturedTrace;var PassThroughHandlerContext=_dereq_("./finally")(Promise,tryConvertToPromise);var catchFilter=_dereq_("./catch_filter")(NEXT_FILTER);var nodebackForPromise=_dereq_("./nodeback");var errorObj=util.errorObj;var tryCatch=util.tryCatch;function check(self,executor){if(typeof executor!=="function"){throw new TypeError("expecting a function but got "+util.classString(executor));}if(self.constructor!==Promise){throw new TypeError("the promise constructor cannot be invoked directly\n\n    See http://goo.gl/MqrFmX\n");}}function Promise(executor){this._bitField=0;this._fulfillmentHandler0=undefined;this._rejectionHandler0=undefined;this._promise0=undefined;this._receiver0=undefined;if(executor!==INTERNAL){check(this,executor);this._resolveFromExecutor(executor);}this._promiseCreated();this._fireEvent("promiseCreated",this);}Promise.prototype.toString=function(){return "[object Promise]";};Promise.prototype.caught=Promise.prototype["catch"]=function(fn){var len=arguments.length;if(len>1){var catchInstances=new Array(len-1),j=0,i;for(i=0;i<len-1;++i){var item=arguments[i];if(util.isObject(item)){catchInstances[j++]=item;}else {return apiRejection("expecting an object but got "+util.classString(item));}}catchInstances.length=j;fn=arguments[i];return this.then(undefined,catchFilter(catchInstances,fn,this));}return this.then(undefined,fn);};Promise.prototype.reflect=function(){return this._then(reflectHandler,reflectHandler,undefined,this,undefined);};Promise.prototype.then=function(didFulfill,didReject){if(debug.warnings()&&arguments.length>0&&typeof didFulfill!=="function"&&typeof didReject!=="function"){var msg=".then() only accepts functions but was passed: "+util.classString(didFulfill);if(arguments.length>1){msg+=", "+util.classString(didReject);}this._warn(msg);}return this._then(didFulfill,didReject,undefined,undefined,undefined);};Promise.prototype.done=function(didFulfill,didReject){var promise=this._then(didFulfill,didReject,undefined,undefined,undefined);promise._setIsFinal();};Promise.prototype.spread=function(fn){if(typeof fn!=="function"){return apiRejection("expecting a function but got "+util.classString(fn));}return this.all()._then(fn,undefined,undefined,APPLY,undefined);};Promise.prototype.toJSON=function(){var ret={isFulfilled:false,isRejected:false,fulfillmentValue:undefined,rejectionReason:undefined};if(this.isFulfilled()){ret.fulfillmentValue=this.value();ret.isFulfilled=true;}else if(this.isRejected()){ret.rejectionReason=this.reason();ret.isRejected=true;}return ret;};Promise.prototype.all=function(){if(arguments.length>0){this._warn(".all() was passed arguments but it does not take any");}return new PromiseArray(this).promise();};Promise.prototype.error=function(fn){return this.caught(util.originatesFromRejection,fn);};Promise.is=function(val){return val instanceof Promise;};Promise.fromNode=Promise.fromCallback=function(fn){var ret=new Promise(INTERNAL);ret._captureStackTrace();var multiArgs=arguments.length>1?!!Object(arguments[1]).multiArgs:false;var result=tryCatch(fn)(nodebackForPromise(ret,multiArgs));if(result===errorObj){ret._rejectCallback(result.e,true);}if(!ret._isFateSealed())ret._setAsyncGuaranteed();return ret;};Promise.all=function(promises){return new PromiseArray(promises).promise();};Promise.cast=function(obj){var ret=tryConvertToPromise(obj);if(!(ret instanceof Promise)){ret=new Promise(INTERNAL);ret._captureStackTrace();ret._setFulfilled();ret._rejectionHandler0=obj;}return ret;};Promise.resolve=Promise.fulfilled=Promise.cast;Promise.reject=Promise.rejected=function(reason){var ret=new Promise(INTERNAL);ret._captureStackTrace();ret._rejectCallback(reason,true);return ret;};Promise.setScheduler=function(fn){if(typeof fn!=="function"){throw new TypeError("expecting a function but got "+util.classString(fn));}var prev=async._schedule;async._schedule=fn;return prev;};Promise.prototype._then=function(didFulfill,didReject,_,receiver,internalData){var haveInternalData=internalData!==undefined;var promise=haveInternalData?internalData:new Promise(INTERNAL);var target=this._target();var bitField=target._bitField;if(!haveInternalData){promise._propagateFrom(this,3);promise._captureStackTrace();if(receiver===undefined&&(this._bitField&2097152)!==0){if(!((bitField&50397184)===0)){receiver=this._boundValue();}else {receiver=target===this?undefined:this._boundTo;}}this._fireEvent("promiseChained",this,promise);}var domain=getDomain();if(!((bitField&50397184)===0)){var handler,value,settler=target._settlePromiseCtx;if((bitField&33554432)!==0){value=target._rejectionHandler0;handler=didFulfill;}else if((bitField&16777216)!==0){value=target._fulfillmentHandler0;handler=didReject;target._unsetRejectionIsUnhandled();}else {settler=target._settlePromiseLateCancellationObserver;value=new CancellationError("late cancellation observer");target._attachExtraTrace(value);handler=didReject;}async.invoke(settler,target,{handler:domain===null?handler:typeof handler==="function"&&domain.bind(handler),promise:promise,receiver:receiver,value:value});}else {target._addCallbacks(didFulfill,didReject,promise,receiver,domain);}return promise;};Promise.prototype._length=function(){return this._bitField&65535;};Promise.prototype._isFateSealed=function(){return (this._bitField&117506048)!==0;};Promise.prototype._isFollowing=function(){return (this._bitField&67108864)===67108864;};Promise.prototype._setLength=function(len){this._bitField=this._bitField&-65536|len&65535;};Promise.prototype._setFulfilled=function(){this._bitField=this._bitField|33554432;this._fireEvent("promiseFulfilled",this);};Promise.prototype._setRejected=function(){this._bitField=this._bitField|16777216;this._fireEvent("promiseRejected",this);};Promise.prototype._setFollowing=function(){this._bitField=this._bitField|67108864;this._fireEvent("promiseResolved",this);};Promise.prototype._setIsFinal=function(){this._bitField=this._bitField|4194304;};Promise.prototype._isFinal=function(){return (this._bitField&4194304)>0;};Promise.prototype._unsetCancelled=function(){this._bitField=this._bitField&~65536;};Promise.prototype._setCancelled=function(){this._bitField=this._bitField|65536;this._fireEvent("promiseCancelled",this);};Promise.prototype._setAsyncGuaranteed=function(){this._bitField=this._bitField|134217728;};Promise.prototype._receiverAt=function(index){var ret=index===0?this._receiver0:this[index*4-4+3];if(ret===UNDEFINED_BINDING){return undefined;}else if(ret===undefined&&this._isBound()){return this._boundValue();}return ret;};Promise.prototype._promiseAt=function(index){return this[index*4-4+2];};Promise.prototype._fulfillmentHandlerAt=function(index){return this[index*4-4+0];};Promise.prototype._rejectionHandlerAt=function(index){return this[index*4-4+1];};Promise.prototype._boundValue=function(){};Promise.prototype._migrateCallback0=function(follower){var bitField=follower._bitField;var fulfill=follower._fulfillmentHandler0;var reject=follower._rejectionHandler0;var promise=follower._promise0;var receiver=follower._receiverAt(0);if(receiver===undefined)receiver=UNDEFINED_BINDING;this._addCallbacks(fulfill,reject,promise,receiver,null);};Promise.prototype._migrateCallbackAt=function(follower,index){var fulfill=follower._fulfillmentHandlerAt(index);var reject=follower._rejectionHandlerAt(index);var promise=follower._promiseAt(index);var receiver=follower._receiverAt(index);if(receiver===undefined)receiver=UNDEFINED_BINDING;this._addCallbacks(fulfill,reject,promise,receiver,null);};Promise.prototype._addCallbacks=function(fulfill,reject,promise,receiver,domain){var index=this._length();if(index>=65535-4){index=0;this._setLength(0);}if(index===0){this._promise0=promise;this._receiver0=receiver;if(typeof fulfill==="function"){this._fulfillmentHandler0=domain===null?fulfill:domain.bind(fulfill);}if(typeof reject==="function"){this._rejectionHandler0=domain===null?reject:domain.bind(reject);}}else {var base=index*4-4;this[base+2]=promise;this[base+3]=receiver;if(typeof fulfill==="function"){this[base+0]=domain===null?fulfill:domain.bind(fulfill);}if(typeof reject==="function"){this[base+1]=domain===null?reject:domain.bind(reject);}}this._setLength(index+1);return index;};Promise.prototype._proxy=function(proxyable,arg){this._addCallbacks(undefined,undefined,arg,proxyable,null);};Promise.prototype._resolveCallback=function(value,shouldBind){if((this._bitField&117506048)!==0)return;if(value===this)return this._rejectCallback(makeSelfResolutionError(),false);var maybePromise=tryConvertToPromise(value,this);if(!(maybePromise instanceof Promise))return this._fulfill(value);if(shouldBind)this._propagateFrom(maybePromise,2);var promise=maybePromise._target();if(promise===this){this._reject(makeSelfResolutionError());return;}var bitField=promise._bitField;if((bitField&50397184)===0){var len=this._length();if(len>0)promise._migrateCallback0(this);for(var i=1;i<len;++i){promise._migrateCallbackAt(this,i);}this._setFollowing();this._setLength(0);this._setFollowee(promise);}else if((bitField&33554432)!==0){this._fulfill(promise._value());}else if((bitField&16777216)!==0){this._reject(promise._reason());}else {var reason=new CancellationError("late cancellation observer");promise._attachExtraTrace(reason);this._reject(reason);}};Promise.prototype._rejectCallback=function(reason,synchronous,ignoreNonErrorWarnings){var trace=util.ensureErrorObject(reason);var hasStack=trace===reason;if(!hasStack&&!ignoreNonErrorWarnings&&debug.warnings()){var message="a promise was rejected with a non-error: "+util.classString(reason);this._warn(message,true);}this._attachExtraTrace(trace,synchronous?hasStack:false);this._reject(reason);};Promise.prototype._resolveFromExecutor=function(executor){var promise=this;this._captureStackTrace();this._pushContext();var synchronous=true;var r=this._execute(executor,function(value){promise._resolveCallback(value);},function(reason){promise._rejectCallback(reason,synchronous);});synchronous=false;this._popContext();if(r!==undefined){promise._rejectCallback(r,true);}};Promise.prototype._settlePromiseFromHandler=function(handler,receiver,value,promise){var bitField=promise._bitField;if((bitField&65536)!==0)return;promise._pushContext();var x;if(receiver===APPLY){if(!value||typeof value.length!=="number"){x=errorObj;x.e=new TypeError("cannot .spread() a non-array: "+util.classString(value));}else {x=tryCatch(handler).apply(this._boundValue(),value);}}else {x=tryCatch(handler).call(receiver,value);}var promiseCreated=promise._popContext();bitField=promise._bitField;if((bitField&65536)!==0)return;if(x===NEXT_FILTER){promise._reject(value);}else if(x===errorObj){promise._rejectCallback(x.e,false);}else {debug.checkForgottenReturns(x,promiseCreated,"",promise,this);promise._resolveCallback(x);}};Promise.prototype._target=function(){var ret=this;while(ret._isFollowing()){ret=ret._followee();}return ret;};Promise.prototype._followee=function(){return this._rejectionHandler0;};Promise.prototype._setFollowee=function(promise){this._rejectionHandler0=promise;};Promise.prototype._settlePromise=function(promise,handler,receiver,value){var isPromise=promise instanceof Promise;var bitField=this._bitField;var asyncGuaranteed=(bitField&134217728)!==0;if((bitField&65536)!==0){if(isPromise)promise._invokeInternalOnCancel();if(receiver instanceof PassThroughHandlerContext&&receiver.isFinallyHandler()){receiver.cancelPromise=promise;if(tryCatch(handler).call(receiver,value)===errorObj){promise._reject(errorObj.e);}}else if(handler===reflectHandler){promise._fulfill(reflectHandler.call(receiver));}else if(receiver instanceof Proxyable){receiver._promiseCancelled(promise);}else if(isPromise||promise instanceof PromiseArray){promise._cancel();}else {receiver.cancel();}}else if(typeof handler==="function"){if(!isPromise){handler.call(receiver,value,promise);}else {if(asyncGuaranteed)promise._setAsyncGuaranteed();this._settlePromiseFromHandler(handler,receiver,value,promise);}}else if(receiver instanceof Proxyable){if(!receiver._isResolved()){if((bitField&33554432)!==0){receiver._promiseFulfilled(value,promise);}else {receiver._promiseRejected(value,promise);}}}else if(isPromise){if(asyncGuaranteed)promise._setAsyncGuaranteed();if((bitField&33554432)!==0){promise._fulfill(value);}else {promise._reject(value);}}};Promise.prototype._settlePromiseLateCancellationObserver=function(ctx){var handler=ctx.handler;var promise=ctx.promise;var receiver=ctx.receiver;var value=ctx.value;if(typeof handler==="function"){if(!(promise instanceof Promise)){handler.call(receiver,value,promise);}else {this._settlePromiseFromHandler(handler,receiver,value,promise);}}else if(promise instanceof Promise){promise._reject(value);}};Promise.prototype._settlePromiseCtx=function(ctx){this._settlePromise(ctx.promise,ctx.handler,ctx.receiver,ctx.value);};Promise.prototype._settlePromise0=function(handler,value,bitField){var promise=this._promise0;var receiver=this._receiverAt(0);this._promise0=undefined;this._receiver0=undefined;this._settlePromise(promise,handler,receiver,value);};Promise.prototype._clearCallbackDataAtIndex=function(index){var base=index*4-4;this[base+2]=this[base+3]=this[base+0]=this[base+1]=undefined;};Promise.prototype._fulfill=function(value){var bitField=this._bitField;if((bitField&117506048)>>>16)return;if(value===this){var err=makeSelfResolutionError();this._attachExtraTrace(err);return this._reject(err);}this._setFulfilled();this._rejectionHandler0=value;if((bitField&65535)>0){if((bitField&134217728)!==0){this._settlePromises();}else {async.settlePromises(this);}}};Promise.prototype._reject=function(reason){var bitField=this._bitField;if((bitField&117506048)>>>16)return;this._setRejected();this._fulfillmentHandler0=reason;if(this._isFinal()){return async.fatalError(reason,util.isNode);}if((bitField&65535)>0){async.settlePromises(this);}else {this._ensurePossibleRejectionHandled();}};Promise.prototype._fulfillPromises=function(len,value){for(var i=1;i<len;i++){var handler=this._fulfillmentHandlerAt(i);var promise=this._promiseAt(i);var receiver=this._receiverAt(i);this._clearCallbackDataAtIndex(i);this._settlePromise(promise,handler,receiver,value);}};Promise.prototype._rejectPromises=function(len,reason){for(var i=1;i<len;i++){var handler=this._rejectionHandlerAt(i);var promise=this._promiseAt(i);var receiver=this._receiverAt(i);this._clearCallbackDataAtIndex(i);this._settlePromise(promise,handler,receiver,reason);}};Promise.prototype._settlePromises=function(){var bitField=this._bitField;var len=bitField&65535;if(len>0){if((bitField&16842752)!==0){var reason=this._fulfillmentHandler0;this._settlePromise0(this._rejectionHandler0,reason,bitField);this._rejectPromises(len,reason);}else {var value=this._rejectionHandler0;this._settlePromise0(this._fulfillmentHandler0,value,bitField);this._fulfillPromises(len,value);}this._setLength(0);}this._clearCancellationData();};Promise.prototype._settledValue=function(){var bitField=this._bitField;if((bitField&33554432)!==0){return this._rejectionHandler0;}else if((bitField&16777216)!==0){return this._fulfillmentHandler0;}};function deferResolve(v){this.promise._resolveCallback(v);}function deferReject(v){this.promise._rejectCallback(v,false);}Promise.defer=Promise.pending=function(){debug.deprecated("Promise.defer","new Promise");var promise=new Promise(INTERNAL);return {promise:promise,resolve:deferResolve,reject:deferReject};};util.notEnumerableProp(Promise,"_makeSelfResolutionError",makeSelfResolutionError);_dereq_("./method")(Promise,INTERNAL,tryConvertToPromise,apiRejection,debug);_dereq_("./bind")(Promise,INTERNAL,tryConvertToPromise,debug);_dereq_("./cancel")(Promise,PromiseArray,apiRejection,debug);_dereq_("./direct_resolve")(Promise);_dereq_("./synchronous_inspection")(Promise);_dereq_("./join")(Promise,PromiseArray,tryConvertToPromise,INTERNAL,debug);Promise.Promise=Promise;_dereq_('./map.js')(Promise,PromiseArray,apiRejection,tryConvertToPromise,INTERNAL,debug);_dereq_('./using.js')(Promise,apiRejection,tryConvertToPromise,createContext,INTERNAL,debug);_dereq_('./timers.js')(Promise,INTERNAL,debug);_dereq_('./generators.js')(Promise,apiRejection,INTERNAL,tryConvertToPromise,Proxyable,debug);_dereq_('./nodeify.js')(Promise);_dereq_('./call_get.js')(Promise);_dereq_('./props.js')(Promise,PromiseArray,tryConvertToPromise,apiRejection);_dereq_('./race.js')(Promise,INTERNAL,tryConvertToPromise,apiRejection);_dereq_('./reduce.js')(Promise,PromiseArray,apiRejection,tryConvertToPromise,INTERNAL,debug);_dereq_('./settle.js')(Promise,PromiseArray,debug);_dereq_('./some.js')(Promise,PromiseArray,apiRejection);_dereq_('./promisify.js')(Promise,INTERNAL);_dereq_('./any.js')(Promise);_dereq_('./each.js')(Promise,INTERNAL);_dereq_('./filter.js')(Promise,INTERNAL);util.toFastProperties(Promise);util.toFastProperties(Promise.prototype);function fillTypes(value){var p=new Promise(INTERNAL);p._fulfillmentHandler0=value;p._rejectionHandler0=value;p._promise0=value;p._receiver0=value;} // Complete slack tracking, opt out of field-type tracking and           
// stabilize map                                                         
fillTypes({a:1});fillTypes({b:2});fillTypes({c:3});fillTypes(1);fillTypes(function(){});fillTypes(undefined);fillTypes(false);fillTypes(new Promise(INTERNAL));debug.setBounds(Async.firstLineError,util.lastLineError);return Promise;};},{"./any.js":1,"./async":2,"./bind":3,"./call_get.js":5,"./cancel":6,"./catch_filter":7,"./context":8,"./debuggability":9,"./direct_resolve":10,"./each.js":11,"./errors":12,"./es5":13,"./filter.js":14,"./finally":15,"./generators.js":16,"./join":17,"./map.js":18,"./method":19,"./nodeback":20,"./nodeify.js":21,"./promise_array":23,"./promisify.js":24,"./props.js":25,"./race.js":27,"./reduce.js":28,"./settle.js":30,"./some.js":31,"./synchronous_inspection":32,"./thenables":33,"./timers.js":34,"./using.js":35,"./util":36}],23:[function(_dereq_,module,exports){"use strict";module.exports=function(Promise,INTERNAL,tryConvertToPromise,apiRejection,Proxyable){var util=_dereq_("./util");var isArray=util.isArray;function toResolutionValue(val){switch(val){case -2:return [];case -3:return {};}}function PromiseArray(values){var promise=this._promise=new Promise(INTERNAL);if(values instanceof Promise){promise._propagateFrom(values,3);}promise._setOnCancel(this);this._values=values;this._length=0;this._totalResolved=0;this._init(undefined,-2);}util.inherits(PromiseArray,Proxyable);PromiseArray.prototype.length=function(){return this._length;};PromiseArray.prototype.promise=function(){return this._promise;};PromiseArray.prototype._init=function init(_,resolveValueIfEmpty){var values=tryConvertToPromise(this._values,this._promise);if(values instanceof Promise){values=values._target();var bitField=values._bitField;;this._values=values;if((bitField&50397184)===0){this._promise._setAsyncGuaranteed();return values._then(init,this._reject,undefined,this,resolveValueIfEmpty);}else if((bitField&33554432)!==0){values=values._value();}else if((bitField&16777216)!==0){return this._reject(values._reason());}else {return this._cancel();}}values=util.asArray(values);if(values===null){var err=apiRejection("expecting an array or an iterable object but got "+util.classString(values)).reason();this._promise._rejectCallback(err,false);return;}if(values.length===0){if(resolveValueIfEmpty===-5){this._resolveEmptyArray();}else {this._resolve(toResolutionValue(resolveValueIfEmpty));}return;}this._iterate(values);};PromiseArray.prototype._iterate=function(values){var len=this.getActualLength(values.length);this._length=len;this._values=this.shouldCopyValues()?new Array(len):this._values;var result=this._promise;var isResolved=false;var bitField=null;for(var i=0;i<len;++i){var maybePromise=tryConvertToPromise(values[i],result);if(maybePromise instanceof Promise){maybePromise=maybePromise._target();bitField=maybePromise._bitField;}else {bitField=null;}if(isResolved){if(bitField!==null){maybePromise.suppressUnhandledRejections();}}else if(bitField!==null){if((bitField&50397184)===0){maybePromise._proxy(this,i);this._values[i]=maybePromise;}else if((bitField&33554432)!==0){isResolved=this._promiseFulfilled(maybePromise._value(),i);}else if((bitField&16777216)!==0){isResolved=this._promiseRejected(maybePromise._reason(),i);}else {isResolved=this._promiseCancelled(i);}}else {isResolved=this._promiseFulfilled(maybePromise,i);}}if(!isResolved)result._setAsyncGuaranteed();};PromiseArray.prototype._isResolved=function(){return this._values===null;};PromiseArray.prototype._resolve=function(value){this._values=null;this._promise._fulfill(value);};PromiseArray.prototype._cancel=function(){if(this._isResolved()||!this._promise.isCancellable())return;this._values=null;this._promise._cancel();};PromiseArray.prototype._reject=function(reason){this._values=null;this._promise._rejectCallback(reason,false);};PromiseArray.prototype._promiseFulfilled=function(value,index){this._values[index]=value;var totalResolved=++this._totalResolved;if(totalResolved>=this._length){this._resolve(this._values);return true;}return false;};PromiseArray.prototype._promiseCancelled=function(){this._cancel();return true;};PromiseArray.prototype._promiseRejected=function(reason){this._totalResolved++;this._reject(reason);return true;};PromiseArray.prototype._resultCancelled=function(){if(this._isResolved())return;var values=this._values;this._cancel();if(values instanceof Promise){values.cancel();}else {for(var i=0;i<values.length;++i){if(values[i] instanceof Promise){values[i].cancel();}}}};PromiseArray.prototype.shouldCopyValues=function(){return true;};PromiseArray.prototype.getActualLength=function(len){return len;};return PromiseArray;};},{"./util":36}],24:[function(_dereq_,module,exports){"use strict";module.exports=function(Promise,INTERNAL){var THIS={};var util=_dereq_("./util");var nodebackForPromise=_dereq_("./nodeback");var withAppended=util.withAppended;var maybeWrapAsError=util.maybeWrapAsError;var canEvaluate=util.canEvaluate;var TypeError=_dereq_("./errors").TypeError;var defaultSuffix="Async";var defaultPromisified={__isPromisified__:true};var noCopyProps=["arity","length","name","arguments","caller","callee","prototype","__isPromisified__"];var noCopyPropsPattern=new RegExp("^(?:"+noCopyProps.join("|")+")$");var defaultFilter=function defaultFilter(name){return util.isIdentifier(name)&&name.charAt(0)!=="_"&&name!=="constructor";};function propsFilter(key){return !noCopyPropsPattern.test(key);}function isPromisified(fn){try{return fn.__isPromisified__===true;}catch(e){return false;}}function hasPromisified(obj,key,suffix){var val=util.getDataPropertyOrDefault(obj,key+suffix,defaultPromisified);return val?isPromisified(val):false;}function checkValid(ret,suffix,suffixRegexp){for(var i=0;i<ret.length;i+=2){var key=ret[i];if(suffixRegexp.test(key)){var keyWithoutAsyncSuffix=key.replace(suffixRegexp,"");for(var j=0;j<ret.length;j+=2){if(ret[j]===keyWithoutAsyncSuffix){throw new TypeError("Cannot promisify an API that has normal methods with '%s'-suffix\n\n    See http://goo.gl/MqrFmX\n".replace("%s",suffix));}}}}}function promisifiableMethods(obj,suffix,suffixRegexp,filter){var keys=util.inheritedDataKeys(obj);var ret=[];for(var i=0;i<keys.length;++i){var key=keys[i];var value=obj[key];var passesDefaultFilter=filter===defaultFilter?true:defaultFilter(key,value,obj);if(typeof value==="function"&&!isPromisified(value)&&!hasPromisified(obj,key,suffix)&&filter(key,value,obj,passesDefaultFilter)){ret.push(key,value);}}checkValid(ret,suffix,suffixRegexp);return ret;}var escapeIdentRegex=function escapeIdentRegex(str){return str.replace(/([$])/,"\\$");};var makeNodePromisifiedEval;if(!true){var switchCaseArgumentOrder=function switchCaseArgumentOrder(likelyArgumentCount){var ret=[likelyArgumentCount];var min=Math.max(0,likelyArgumentCount-1-3);for(var i=likelyArgumentCount-1;i>=min;--i){ret.push(i);}for(var i=likelyArgumentCount+1;i<=3;++i){ret.push(i);}return ret;};var argumentSequence=function argumentSequence(argumentCount){return util.filledRange(argumentCount,"_arg","");};var parameterDeclaration=function parameterDeclaration(parameterCount){return util.filledRange(Math.max(parameterCount,3),"_arg","");};var parameterCount=function parameterCount(fn){if(typeof fn.length==="number"){return Math.max(Math.min(fn.length,1023+1),0);}return 0;};makeNodePromisifiedEval=function makeNodePromisifiedEval(callback,receiver,originalName,fn,_,multiArgs){var newParameterCount=Math.max(0,parameterCount(fn)-1);var argumentOrder=switchCaseArgumentOrder(newParameterCount);var shouldProxyThis=typeof callback==="string"||receiver===THIS;function generateCallForArgumentCount(count){var args=argumentSequence(count).join(", ");var comma=count>0?", ":"";var ret;if(shouldProxyThis){ret="ret = callback.call(this, {{args}}, nodeback); break;\n";}else {ret=receiver===undefined?"ret = callback({{args}}, nodeback); break;\n":"ret = callback.call(receiver, {{args}}, nodeback); break;\n";}return ret.replace("{{args}}",args).replace(", ",comma);}function generateArgumentSwitchCase(){var ret="";for(var i=0;i<argumentOrder.length;++i){ret+="case "+argumentOrder[i]+":"+generateCallForArgumentCount(argumentOrder[i]);}ret+="                                                             \n\
        default:                                                             \n\
            var args = new Array(len + 1);                                   \n\
            var i = 0;                                                       \n\
            for (var i = 0; i < len; ++i) {                                  \n\
               args[i] = arguments[i];                                       \n\
            }                                                                \n\
            args[i] = nodeback;                                              \n\
            [CodeForCall]                                                    \n\
            break;                                                           \n\
        ".replace("[CodeForCall]",shouldProxyThis?"ret = callback.apply(this, args);\n":"ret = callback.apply(receiver, args);\n");return ret;}var getFunctionCode=typeof callback==="string"?"this != null ? this['"+callback+"'] : fn":"fn";var body="'use strict';                                                \n\
        var ret = function (Parameters) {                                    \n\
            'use strict';                                                    \n\
            var len = arguments.length;                                      \n\
            var promise = new Promise(INTERNAL);                             \n\
            promise._captureStackTrace();                                    \n\
            var nodeback = nodebackForPromise(promise, "+multiArgs+");   \n\
            var ret;                                                         \n\
            var callback = tryCatch([GetFunctionCode]);                      \n\
            switch(len) {                                                    \n\
                [CodeForSwitchCase]                                          \n\
            }                                                                \n\
            if (ret === errorObj) {                                          \n\
                promise._rejectCallback(maybeWrapAsError(ret.e), true, true);\n\
            }                                                                \n\
            if (!promise._isFateSealed()) promise._setAsyncGuaranteed();     \n\
            return promise;                                                  \n\
        };                                                                   \n\
        notEnumerableProp(ret, '__isPromisified__', true);                   \n\
        return ret;                                                          \n\
    ".replace("[CodeForSwitchCase]",generateArgumentSwitchCase()).replace("[GetFunctionCode]",getFunctionCode);body=body.replace("Parameters",parameterDeclaration(newParameterCount));return new Function("Promise","fn","receiver","withAppended","maybeWrapAsError","nodebackForPromise","tryCatch","errorObj","notEnumerableProp","INTERNAL",body)(Promise,fn,receiver,withAppended,maybeWrapAsError,nodebackForPromise,util.tryCatch,util.errorObj,util.notEnumerableProp,INTERNAL);};}function makeNodePromisifiedClosure(callback,receiver,_,fn,__,multiArgs){var defaultThis=function(){return this;}();var method=callback;if(typeof method==="string"){callback=fn;}function promisified(){var _receiver=receiver;if(receiver===THIS)_receiver=this;var promise=new Promise(INTERNAL);promise._captureStackTrace();var cb=typeof method==="string"&&this!==defaultThis?this[method]:callback;var fn=nodebackForPromise(promise,multiArgs);try{cb.apply(_receiver,withAppended(arguments,fn));}catch(e){promise._rejectCallback(maybeWrapAsError(e),true,true);}if(!promise._isFateSealed())promise._setAsyncGuaranteed();return promise;}util.notEnumerableProp(promisified,"__isPromisified__",true);return promisified;}var makeNodePromisified=canEvaluate?makeNodePromisifiedEval:makeNodePromisifiedClosure;function promisifyAll(obj,suffix,filter,promisifier,multiArgs){var suffixRegexp=new RegExp(escapeIdentRegex(suffix)+"$");var methods=promisifiableMethods(obj,suffix,suffixRegexp,filter);for(var i=0,len=methods.length;i<len;i+=2){var key=methods[i];var fn=methods[i+1];var promisifiedKey=key+suffix;if(promisifier===makeNodePromisified){obj[promisifiedKey]=makeNodePromisified(key,THIS,key,fn,suffix,multiArgs);}else {var promisified=promisifier(fn,function(){return makeNodePromisified(key,THIS,key,fn,suffix,multiArgs);});util.notEnumerableProp(promisified,"__isPromisified__",true);obj[promisifiedKey]=promisified;}}util.toFastProperties(obj);return obj;}function promisify(callback,receiver,multiArgs){return makeNodePromisified(callback,receiver,undefined,callback,null,multiArgs);}Promise.promisify=function(fn,options){if(typeof fn!=="function"){throw new TypeError("expecting a function but got "+util.classString(fn));}if(isPromisified(fn)){return fn;}options=Object(options);var receiver=options.context===undefined?THIS:options.context;var multiArgs=!!options.multiArgs;var ret=promisify(fn,receiver,multiArgs);util.copyDescriptors(fn,ret,propsFilter);return ret;};Promise.promisifyAll=function(target,options){if(typeof target!=="function"&&(typeof target==="undefined"?"undefined":_typeof(target))!=="object"){throw new TypeError("the target of promisifyAll must be an object or a function\n\n    See http://goo.gl/MqrFmX\n");}options=Object(options);var multiArgs=!!options.multiArgs;var suffix=options.suffix;if(typeof suffix!=="string")suffix=defaultSuffix;var filter=options.filter;if(typeof filter!=="function")filter=defaultFilter;var promisifier=options.promisifier;if(typeof promisifier!=="function")promisifier=makeNodePromisified;if(!util.isIdentifier(suffix)){throw new RangeError("suffix must be a valid identifier\n\n    See http://goo.gl/MqrFmX\n");}var keys=util.inheritedDataKeys(target);for(var i=0;i<keys.length;++i){var value=target[keys[i]];if(keys[i]!=="constructor"&&util.isClass(value)){promisifyAll(value.prototype,suffix,filter,promisifier,multiArgs);promisifyAll(value,suffix,filter,promisifier,multiArgs);}}return promisifyAll(target,suffix,filter,promisifier,multiArgs);};};},{"./errors":12,"./nodeback":20,"./util":36}],25:[function(_dereq_,module,exports){"use strict";module.exports=function(Promise,PromiseArray,tryConvertToPromise,apiRejection){var util=_dereq_("./util");var isObject=util.isObject;var es5=_dereq_("./es5");var Es6Map;if(typeof Map==="function")Es6Map=Map;var mapToEntries=function(){var index=0;var size=0;function extractEntry(value,key){this[index]=value;this[index+size]=key;index++;}return function mapToEntries(map){size=map.size;index=0;var ret=new Array(map.size*2);map.forEach(extractEntry,ret);return ret;};}();var entriesToMap=function entriesToMap(entries){var ret=new Es6Map();var length=entries.length/2|0;for(var i=0;i<length;++i){var key=entries[length+i];var value=entries[i];ret.set(key,value);}return ret;};function PropertiesPromiseArray(obj){var isMap=false;var entries;if(Es6Map!==undefined&&obj instanceof Es6Map){entries=mapToEntries(obj);isMap=true;}else {var keys=es5.keys(obj);var len=keys.length;entries=new Array(len*2);for(var i=0;i<len;++i){var key=keys[i];entries[i]=obj[key];entries[i+len]=key;}}this.constructor$(entries);this._isMap=isMap;this._init$(undefined,-3);}util.inherits(PropertiesPromiseArray,PromiseArray);PropertiesPromiseArray.prototype._init=function(){};PropertiesPromiseArray.prototype._promiseFulfilled=function(value,index){this._values[index]=value;var totalResolved=++this._totalResolved;if(totalResolved>=this._length){var val;if(this._isMap){val=entriesToMap(this._values);}else {val={};var keyOffset=this.length();for(var i=0,len=this.length();i<len;++i){val[this._values[i+keyOffset]]=this._values[i];}}this._resolve(val);return true;}return false;};PropertiesPromiseArray.prototype.shouldCopyValues=function(){return false;};PropertiesPromiseArray.prototype.getActualLength=function(len){return len>>1;};function props(promises){var ret;var castValue=tryConvertToPromise(promises);if(!isObject(castValue)){return apiRejection("cannot await properties of a non-object\n\n    See http://goo.gl/MqrFmX\n");}else if(castValue instanceof Promise){ret=castValue._then(Promise.props,undefined,undefined,undefined,undefined);}else {ret=new PropertiesPromiseArray(castValue).promise();}if(castValue instanceof Promise){ret._propagateFrom(castValue,2);}return ret;}Promise.prototype.props=function(){return props(this);};Promise.props=function(promises){return props(promises);};};},{"./es5":13,"./util":36}],26:[function(_dereq_,module,exports){"use strict";function arrayMove(src,srcIndex,dst,dstIndex,len){for(var j=0;j<len;++j){dst[j+dstIndex]=src[j+srcIndex];src[j+srcIndex]=void 0;}}function Queue(capacity){this._capacity=capacity;this._length=0;this._front=0;}Queue.prototype._willBeOverCapacity=function(size){return this._capacity<size;};Queue.prototype._pushOne=function(arg){var length=this.length();this._checkCapacity(length+1);var i=this._front+length&this._capacity-1;this[i]=arg;this._length=length+1;};Queue.prototype._unshiftOne=function(value){var capacity=this._capacity;this._checkCapacity(this.length()+1);var front=this._front;var i=(front-1&capacity-1^capacity)-capacity;this[i]=value;this._front=i;this._length=this.length()+1;};Queue.prototype.unshift=function(fn,receiver,arg){this._unshiftOne(arg);this._unshiftOne(receiver);this._unshiftOne(fn);};Queue.prototype.push=function(fn,receiver,arg){var length=this.length()+3;if(this._willBeOverCapacity(length)){this._pushOne(fn);this._pushOne(receiver);this._pushOne(arg);return;}var j=this._front+length-3;this._checkCapacity(length);var wrapMask=this._capacity-1;this[j+0&wrapMask]=fn;this[j+1&wrapMask]=receiver;this[j+2&wrapMask]=arg;this._length=length;};Queue.prototype.shift=function(){var front=this._front,ret=this[front];this[front]=undefined;this._front=front+1&this._capacity-1;this._length--;return ret;};Queue.prototype.length=function(){return this._length;};Queue.prototype._checkCapacity=function(size){if(this._capacity<size){this._resizeTo(this._capacity<<1);}};Queue.prototype._resizeTo=function(capacity){var oldCapacity=this._capacity;this._capacity=capacity;var front=this._front;var length=this._length;var moveItemsCount=front+length&oldCapacity-1;arrayMove(this,0,this,oldCapacity,moveItemsCount);};module.exports=Queue;},{}],27:[function(_dereq_,module,exports){"use strict";module.exports=function(Promise,INTERNAL,tryConvertToPromise,apiRejection){var util=_dereq_("./util");var raceLater=function raceLater(promise){return promise.then(function(array){return race(array,promise);});};function race(promises,parent){var maybePromise=tryConvertToPromise(promises);if(maybePromise instanceof Promise){return raceLater(maybePromise);}else {promises=util.asArray(promises);if(promises===null)return apiRejection("expecting an array or an iterable object but got "+util.classString(promises));}var ret=new Promise(INTERNAL);if(parent!==undefined){ret._propagateFrom(parent,3);}var fulfill=ret._fulfill;var reject=ret._reject;for(var i=0,len=promises.length;i<len;++i){var val=promises[i];if(val===undefined&&!(i in promises)){continue;}Promise.cast(val)._then(fulfill,reject,undefined,ret,null);}return ret;}Promise.race=function(promises){return race(promises,undefined);};Promise.prototype.race=function(){return race(this,undefined);};};},{"./util":36}],28:[function(_dereq_,module,exports){"use strict";module.exports=function(Promise,PromiseArray,apiRejection,tryConvertToPromise,INTERNAL,debug){var getDomain=Promise._getDomain;var util=_dereq_("./util");var tryCatch=util.tryCatch;function ReductionPromiseArray(promises,fn,initialValue,_each){this.constructor$(promises);var domain=getDomain();this._fn=domain===null?fn:domain.bind(fn);if(initialValue!==undefined){initialValue=Promise.resolve(initialValue);initialValue._attachCancellationCallback(this);}this._initialValue=initialValue;this._currentCancellable=null;this._eachValues=_each===INTERNAL?[]:undefined;this._promise._captureStackTrace();this._init$(undefined,-5);}util.inherits(ReductionPromiseArray,PromiseArray);ReductionPromiseArray.prototype._gotAccum=function(accum){if(this._eachValues!==undefined&&accum!==INTERNAL){this._eachValues.push(accum);}};ReductionPromiseArray.prototype._eachComplete=function(value){this._eachValues.push(value);return this._eachValues;};ReductionPromiseArray.prototype._init=function(){};ReductionPromiseArray.prototype._resolveEmptyArray=function(){this._resolve(this._eachValues!==undefined?this._eachValues:this._initialValue);};ReductionPromiseArray.prototype.shouldCopyValues=function(){return false;};ReductionPromiseArray.prototype._resolve=function(value){this._promise._resolveCallback(value);this._values=null;};ReductionPromiseArray.prototype._resultCancelled=function(sender){if(sender===this._initialValue)return this._cancel();if(this._isResolved())return;this._resultCancelled$();if(this._currentCancellable instanceof Promise){this._currentCancellable.cancel();}if(this._initialValue instanceof Promise){this._initialValue.cancel();}};ReductionPromiseArray.prototype._iterate=function(values){this._values=values;var value;var i;var length=values.length;if(this._initialValue!==undefined){value=this._initialValue;i=0;}else {value=Promise.resolve(values[0]);i=1;}this._currentCancellable=value;if(!value.isRejected()){for(;i<length;++i){var ctx={accum:null,value:values[i],index:i,length:length,array:this};value=value._then(gotAccum,undefined,undefined,ctx,undefined);}}if(this._eachValues!==undefined){value=value._then(this._eachComplete,undefined,undefined,this,undefined);}value._then(completed,completed,undefined,value,this);};Promise.prototype.reduce=function(fn,initialValue){return reduce(this,fn,initialValue,null);};Promise.reduce=function(promises,fn,initialValue,_each){return reduce(promises,fn,initialValue,_each);};function completed(valueOrReason,array){if(this.isFulfilled()){array._resolve(valueOrReason);}else {array._reject(valueOrReason);}}function reduce(promises,fn,initialValue,_each){if(typeof fn!=="function"){return apiRejection("expecting a function but got "+util.classString(fn));}var array=new ReductionPromiseArray(promises,fn,initialValue,_each);return array.promise();}function gotAccum(accum){this.accum=accum;this.array._gotAccum(accum);var value=tryConvertToPromise(this.value,this.array._promise);if(value instanceof Promise){this.array._currentCancellable=value;return value._then(gotValue,undefined,undefined,this,undefined);}else {return gotValue.call(this,value);}}function gotValue(value){var array=this.array;var promise=array._promise;var fn=tryCatch(array._fn);promise._pushContext();var ret;if(array._eachValues!==undefined){ret=fn.call(promise._boundValue(),value,this.index,this.length);}else {ret=fn.call(promise._boundValue(),this.accum,value,this.index,this.length);}if(ret instanceof Promise){array._currentCancellable=ret;}var promiseCreated=promise._popContext();debug.checkForgottenReturns(ret,promiseCreated,array._eachValues!==undefined?"Promise.each":"Promise.reduce",promise);return ret;}};},{"./util":36}],29:[function(_dereq_,module,exports){"use strict";var util=_dereq_("./util");var schedule;var noAsyncScheduler=function noAsyncScheduler(){throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");};if(util.isNode&&typeof MutationObserver==="undefined"){var GlobalSetImmediate=global.setImmediate;var ProcessNextTick=process.nextTick;schedule=util.isRecentNode?function(fn){GlobalSetImmediate.call(global,fn);}:function(fn){ProcessNextTick.call(process,fn);};}else if(typeof MutationObserver!=="undefined"&&!(typeof window!=="undefined"&&window.navigator&&window.navigator.standalone)){schedule=function(){var div=document.createElement("div");var opts={attributes:true};var toggleScheduled=false;var div2=document.createElement("div");var o2=new MutationObserver(function(){div.classList.toggle("foo");toggleScheduled=false;});o2.observe(div2,opts);var scheduleToggle=function scheduleToggle(){if(toggleScheduled)return;toggleScheduled=true;div2.classList.toggle("foo");};return function schedule(fn){var o=new MutationObserver(function(){o.disconnect();fn();});o.observe(div,opts);scheduleToggle();};}();}else if(typeof setImmediate!=="undefined"){schedule=function schedule(fn){setImmediate(fn);};}else if(typeof setTimeout!=="undefined"){schedule=function schedule(fn){setTimeout(fn,0);};}else {schedule=noAsyncScheduler;}module.exports=schedule;},{"./util":36}],30:[function(_dereq_,module,exports){"use strict";module.exports=function(Promise,PromiseArray,debug){var PromiseInspection=Promise.PromiseInspection;var util=_dereq_("./util");function SettledPromiseArray(values){this.constructor$(values);}util.inherits(SettledPromiseArray,PromiseArray);SettledPromiseArray.prototype._promiseResolved=function(index,inspection){this._values[index]=inspection;var totalResolved=++this._totalResolved;if(totalResolved>=this._length){this._resolve(this._values);return true;}return false;};SettledPromiseArray.prototype._promiseFulfilled=function(value,index){var ret=new PromiseInspection();ret._bitField=33554432;ret._settledValueField=value;return this._promiseResolved(index,ret);};SettledPromiseArray.prototype._promiseRejected=function(reason,index){var ret=new PromiseInspection();ret._bitField=16777216;ret._settledValueField=reason;return this._promiseResolved(index,ret);};Promise.settle=function(promises){debug.deprecated(".settle()",".reflect()");return new SettledPromiseArray(promises).promise();};Promise.prototype.settle=function(){return Promise.settle(this);};};},{"./util":36}],31:[function(_dereq_,module,exports){"use strict";module.exports=function(Promise,PromiseArray,apiRejection){var util=_dereq_("./util");var RangeError=_dereq_("./errors").RangeError;var AggregateError=_dereq_("./errors").AggregateError;var isArray=util.isArray;var CANCELLATION={};function SomePromiseArray(values){this.constructor$(values);this._howMany=0;this._unwrap=false;this._initialized=false;}util.inherits(SomePromiseArray,PromiseArray);SomePromiseArray.prototype._init=function(){if(!this._initialized){return;}if(this._howMany===0){this._resolve([]);return;}this._init$(undefined,-5);var isArrayResolved=isArray(this._values);if(!this._isResolved()&&isArrayResolved&&this._howMany>this._canPossiblyFulfill()){this._reject(this._getRangeError(this.length()));}};SomePromiseArray.prototype.init=function(){this._initialized=true;this._init();};SomePromiseArray.prototype.setUnwrap=function(){this._unwrap=true;};SomePromiseArray.prototype.howMany=function(){return this._howMany;};SomePromiseArray.prototype.setHowMany=function(count){this._howMany=count;};SomePromiseArray.prototype._promiseFulfilled=function(value){this._addFulfilled(value);if(this._fulfilled()===this.howMany()){this._values.length=this.howMany();if(this.howMany()===1&&this._unwrap){this._resolve(this._values[0]);}else {this._resolve(this._values);}return true;}return false;};SomePromiseArray.prototype._promiseRejected=function(reason){this._addRejected(reason);return this._checkOutcome();};SomePromiseArray.prototype._promiseCancelled=function(){if(this._values instanceof Promise||this._values==null){return this._cancel();}this._addRejected(CANCELLATION);return this._checkOutcome();};SomePromiseArray.prototype._checkOutcome=function(){if(this.howMany()>this._canPossiblyFulfill()){var e=new AggregateError();for(var i=this.length();i<this._values.length;++i){if(this._values[i]!==CANCELLATION){e.push(this._values[i]);}}if(e.length>0){this._reject(e);}else {this._cancel();}return true;}return false;};SomePromiseArray.prototype._fulfilled=function(){return this._totalResolved;};SomePromiseArray.prototype._rejected=function(){return this._values.length-this.length();};SomePromiseArray.prototype._addRejected=function(reason){this._values.push(reason);};SomePromiseArray.prototype._addFulfilled=function(value){this._values[this._totalResolved++]=value;};SomePromiseArray.prototype._canPossiblyFulfill=function(){return this.length()-this._rejected();};SomePromiseArray.prototype._getRangeError=function(count){var message="Input array must contain at least "+this._howMany+" items but contains only "+count+" items";return new RangeError(message);};SomePromiseArray.prototype._resolveEmptyArray=function(){this._reject(this._getRangeError(0));};function some(promises,howMany){if((howMany|0)!==howMany||howMany<0){return apiRejection("expecting a positive integer\n\n    See http://goo.gl/MqrFmX\n");}var ret=new SomePromiseArray(promises);var promise=ret.promise();ret.setHowMany(howMany);ret.init();return promise;}Promise.some=function(promises,howMany){return some(promises,howMany);};Promise.prototype.some=function(howMany){return some(this,howMany);};Promise._SomePromiseArray=SomePromiseArray;};},{"./errors":12,"./util":36}],32:[function(_dereq_,module,exports){"use strict";module.exports=function(Promise){function PromiseInspection(promise){if(promise!==undefined){promise=promise._target();this._bitField=promise._bitField;this._settledValueField=promise._isFateSealed()?promise._settledValue():undefined;}else {this._bitField=0;this._settledValueField=undefined;}}PromiseInspection.prototype._settledValue=function(){return this._settledValueField;};var value=PromiseInspection.prototype.value=function(){if(!this.isFulfilled()){throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\n\n    See http://goo.gl/MqrFmX\n");}return this._settledValue();};var reason=PromiseInspection.prototype.error=PromiseInspection.prototype.reason=function(){if(!this.isRejected()){throw new TypeError("cannot get rejection reason of a non-rejected promise\n\n    See http://goo.gl/MqrFmX\n");}return this._settledValue();};var isFulfilled=PromiseInspection.prototype.isFulfilled=function(){return (this._bitField&33554432)!==0;};var isRejected=PromiseInspection.prototype.isRejected=function(){return (this._bitField&16777216)!==0;};var isPending=PromiseInspection.prototype.isPending=function(){return (this._bitField&50397184)===0;};var isResolved=PromiseInspection.prototype.isResolved=function(){return (this._bitField&50331648)!==0;};PromiseInspection.prototype.isCancelled=Promise.prototype._isCancelled=function(){return (this._bitField&65536)===65536;};Promise.prototype.isCancelled=function(){return this._target()._isCancelled();};Promise.prototype.isPending=function(){return isPending.call(this._target());};Promise.prototype.isRejected=function(){return isRejected.call(this._target());};Promise.prototype.isFulfilled=function(){return isFulfilled.call(this._target());};Promise.prototype.isResolved=function(){return isResolved.call(this._target());};Promise.prototype.value=function(){return value.call(this._target());};Promise.prototype.reason=function(){var target=this._target();target._unsetRejectionIsUnhandled();return reason.call(target);};Promise.prototype._value=function(){return this._settledValue();};Promise.prototype._reason=function(){this._unsetRejectionIsUnhandled();return this._settledValue();};Promise.PromiseInspection=PromiseInspection;};},{}],33:[function(_dereq_,module,exports){"use strict";module.exports=function(Promise,INTERNAL){var util=_dereq_("./util");var errorObj=util.errorObj;var isObject=util.isObject;function tryConvertToPromise(obj,context){if(isObject(obj)){if(obj instanceof Promise)return obj;var then=getThen(obj);if(then===errorObj){if(context)context._pushContext();var ret=Promise.reject(then.e);if(context)context._popContext();return ret;}else if(typeof then==="function"){if(isAnyBluebirdPromise(obj)){var ret=new Promise(INTERNAL);obj._then(ret._fulfill,ret._reject,undefined,ret,null);return ret;}return doThenable(obj,then,context);}}return obj;}function doGetThen(obj){return obj.then;}function getThen(obj){try{return doGetThen(obj);}catch(e){errorObj.e=e;return errorObj;}}var hasProp={}.hasOwnProperty;function isAnyBluebirdPromise(obj){return hasProp.call(obj,"_promise0");}function doThenable(x,then,context){var promise=new Promise(INTERNAL);var ret=promise;if(context)context._pushContext();promise._captureStackTrace();if(context)context._popContext();var synchronous=true;var result=util.tryCatch(then).call(x,resolve,reject);synchronous=false;if(promise&&result===errorObj){promise._rejectCallback(result.e,true,true);promise=null;}function resolve(value){if(!promise)return;promise._resolveCallback(value);promise=null;}function reject(reason){if(!promise)return;promise._rejectCallback(reason,synchronous,true);promise=null;}return ret;}return tryConvertToPromise;};},{"./util":36}],34:[function(_dereq_,module,exports){"use strict";module.exports=function(Promise,INTERNAL,debug){var util=_dereq_("./util");var TimeoutError=Promise.TimeoutError;function HandleWrapper(handle){this.handle=handle;}HandleWrapper.prototype._resultCancelled=function(){clearTimeout(this.handle);};var afterValue=function afterValue(value){return delay(+this).thenReturn(value);};var delay=Promise.delay=function(ms,value){var ret;var handle;if(value!==undefined){ret=Promise.resolve(value)._then(afterValue,null,null,ms,undefined);if(debug.cancellation()&&value instanceof Promise){ret._setOnCancel(value);}}else {ret=new Promise(INTERNAL);handle=setTimeout(function(){ret._fulfill();},+ms);if(debug.cancellation()){ret._setOnCancel(new HandleWrapper(handle));}}ret._setAsyncGuaranteed();return ret;};Promise.prototype.delay=function(ms){return delay(ms,this);};var afterTimeout=function afterTimeout(promise,message,parent){var err;if(typeof message!=="string"){if(message instanceof Error){err=message;}else {err=new TimeoutError("operation timed out");}}else {err=new TimeoutError(message);}util.markAsOriginatingFromRejection(err);promise._attachExtraTrace(err);promise._reject(err);if(parent!=null){parent.cancel();}};function successClear(value){clearTimeout(this.handle);return value;}function failureClear(reason){clearTimeout(this.handle);throw reason;}Promise.prototype.timeout=function(ms,message){ms=+ms;var ret,parent;var handleWrapper=new HandleWrapper(setTimeout(function timeoutTimeout(){if(ret.isPending()){afterTimeout(ret,message,parent);}},ms));if(debug.cancellation()){parent=this.then();ret=parent._then(successClear,failureClear,undefined,handleWrapper,undefined);ret._setOnCancel(handleWrapper);}else {ret=this._then(successClear,failureClear,undefined,handleWrapper,undefined);}return ret;};};},{"./util":36}],35:[function(_dereq_,module,exports){"use strict";module.exports=function(Promise,apiRejection,tryConvertToPromise,createContext,INTERNAL,debug){var util=_dereq_("./util");var TypeError=_dereq_("./errors").TypeError;var inherits=_dereq_("./util").inherits;var errorObj=util.errorObj;var tryCatch=util.tryCatch;function thrower(e){setTimeout(function(){throw e;},0);}function castPreservingDisposable(thenable){var maybePromise=tryConvertToPromise(thenable);if(maybePromise!==thenable&&typeof thenable._isDisposable==="function"&&typeof thenable._getDisposer==="function"&&thenable._isDisposable()){maybePromise._setDisposable(thenable._getDisposer());}return maybePromise;}function dispose(resources,inspection){var i=0;var len=resources.length;var ret=new Promise(INTERNAL);function iterator(){if(i>=len)return ret._fulfill();var maybePromise=castPreservingDisposable(resources[i++]);if(maybePromise instanceof Promise&&maybePromise._isDisposable()){try{maybePromise=tryConvertToPromise(maybePromise._getDisposer().tryDispose(inspection),resources.promise);}catch(e){return thrower(e);}if(maybePromise instanceof Promise){return maybePromise._then(iterator,thrower,null,null,null);}}iterator();}iterator();return ret;}function Disposer(data,promise,context){this._data=data;this._promise=promise;this._context=context;}Disposer.prototype.data=function(){return this._data;};Disposer.prototype.promise=function(){return this._promise;};Disposer.prototype.resource=function(){if(this.promise().isFulfilled()){return this.promise().value();}return null;};Disposer.prototype.tryDispose=function(inspection){var resource=this.resource();var context=this._context;if(context!==undefined)context._pushContext();var ret=resource!==null?this.doDispose(resource,inspection):null;if(context!==undefined)context._popContext();this._promise._unsetDisposable();this._data=null;return ret;};Disposer.isDisposer=function(d){return d!=null&&typeof d.resource==="function"&&typeof d.tryDispose==="function";};function FunctionDisposer(fn,promise,context){this.constructor$(fn,promise,context);}inherits(FunctionDisposer,Disposer);FunctionDisposer.prototype.doDispose=function(resource,inspection){var fn=this.data();return fn.call(resource,resource,inspection);};function maybeUnwrapDisposer(value){if(Disposer.isDisposer(value)){this.resources[this.index]._setDisposable(value);return value.promise();}return value;}function ResourceList(length){this.length=length;this.promise=null;this[length-1]=null;}ResourceList.prototype._resultCancelled=function(){var len=this.length;for(var i=0;i<len;++i){var item=this[i];if(item instanceof Promise){item.cancel();}}};Promise.using=function(){var len=arguments.length;if(len<2)return apiRejection("you must pass at least 2 arguments to Promise.using");var fn=arguments[len-1];if(typeof fn!=="function"){return apiRejection("expecting a function but got "+util.classString(fn));}var input;var spreadArgs=true;if(len===2&&Array.isArray(arguments[0])){input=arguments[0];len=input.length;spreadArgs=false;}else {input=arguments;len--;}var resources=new ResourceList(len);for(var i=0;i<len;++i){var resource=input[i];if(Disposer.isDisposer(resource)){var disposer=resource;resource=resource.promise();resource._setDisposable(disposer);}else {var maybePromise=tryConvertToPromise(resource);if(maybePromise instanceof Promise){resource=maybePromise._then(maybeUnwrapDisposer,null,null,{resources:resources,index:i},undefined);}}resources[i]=resource;}var reflectedResources=new Array(resources.length);for(var i=0;i<reflectedResources.length;++i){reflectedResources[i]=Promise.resolve(resources[i]).reflect();}var resultPromise=Promise.all(reflectedResources).then(function(inspections){for(var i=0;i<inspections.length;++i){var inspection=inspections[i];if(inspection.isRejected()){errorObj.e=inspection.error();return errorObj;}else if(!inspection.isFulfilled()){resultPromise.cancel();return;}inspections[i]=inspection.value();}promise._pushContext();fn=tryCatch(fn);var ret=spreadArgs?fn.apply(undefined,inspections):fn(inspections);var promiseCreated=promise._popContext();debug.checkForgottenReturns(ret,promiseCreated,"Promise.using",promise);return ret;});var promise=resultPromise.lastly(function(){var inspection=new Promise.PromiseInspection(resultPromise);return dispose(resources,inspection);});resources.promise=promise;promise._setOnCancel(resources);return promise;};Promise.prototype._setDisposable=function(disposer){this._bitField=this._bitField|131072;this._disposer=disposer;};Promise.prototype._isDisposable=function(){return (this._bitField&131072)>0;};Promise.prototype._getDisposer=function(){return this._disposer;};Promise.prototype._unsetDisposable=function(){this._bitField=this._bitField&~131072;this._disposer=undefined;};Promise.prototype.disposer=function(fn){if(typeof fn==="function"){return new FunctionDisposer(fn,this,createContext());}throw new TypeError();};};},{"./errors":12,"./util":36}],36:[function(_dereq_,module,exports){"use strict";var es5=_dereq_("./es5");var canEvaluate=typeof navigator=="undefined";var errorObj={e:{}};var tryCatchTarget;var globalObject=typeof self!=="undefined"?self:typeof window!=="undefined"?window:typeof global!=="undefined"?global:this!==undefined?this:null;function tryCatcher(){try{var target=tryCatchTarget;tryCatchTarget=null;return target.apply(this,arguments);}catch(e){errorObj.e=e;return errorObj;}}function tryCatch(fn){tryCatchTarget=fn;return tryCatcher;}var inherits=function inherits(Child,Parent){var hasProp={}.hasOwnProperty;function T(){this.constructor=Child;this.constructor$=Parent;for(var propertyName in Parent.prototype){if(hasProp.call(Parent.prototype,propertyName)&&propertyName.charAt(propertyName.length-1)!=="$"){this[propertyName+"$"]=Parent.prototype[propertyName];}}}T.prototype=Parent.prototype;Child.prototype=new T();return Child.prototype;};function isPrimitive(val){return val==null||val===true||val===false||typeof val==="string"||typeof val==="number";}function isObject(value){return typeof value==="function"||(typeof value==="undefined"?"undefined":_typeof(value))==="object"&&value!==null;}function maybeWrapAsError(maybeError){if(!isPrimitive(maybeError))return maybeError;return new Error(safeToString(maybeError));}function withAppended(target,appendee){var len=target.length;var ret=new Array(len+1);var i;for(i=0;i<len;++i){ret[i]=target[i];}ret[i]=appendee;return ret;}function getDataPropertyOrDefault(obj,key,defaultValue){if(es5.isES5){var desc=Object.getOwnPropertyDescriptor(obj,key);if(desc!=null){return desc.get==null&&desc.set==null?desc.value:defaultValue;}}else {return {}.hasOwnProperty.call(obj,key)?obj[key]:undefined;}}function notEnumerableProp(obj,name,value){if(isPrimitive(obj))return obj;var descriptor={value:value,configurable:true,enumerable:false,writable:true};es5.defineProperty(obj,name,descriptor);return obj;}function thrower(r){throw r;}var inheritedDataKeys=function(){var excludedPrototypes=[Array.prototype,Object.prototype,Function.prototype];var isExcludedProto=function isExcludedProto(val){for(var i=0;i<excludedPrototypes.length;++i){if(excludedPrototypes[i]===val){return true;}}return false;};if(es5.isES5){var getKeys=Object.getOwnPropertyNames;return function(obj){var ret=[];var visitedKeys=Object.create(null);while(obj!=null&&!isExcludedProto(obj)){var keys;try{keys=getKeys(obj);}catch(e){return ret;}for(var i=0;i<keys.length;++i){var key=keys[i];if(visitedKeys[key])continue;visitedKeys[key]=true;var desc=Object.getOwnPropertyDescriptor(obj,key);if(desc!=null&&desc.get==null&&desc.set==null){ret.push(key);}}obj=es5.getPrototypeOf(obj);}return ret;};}else {var hasProp={}.hasOwnProperty;return function(obj){if(isExcludedProto(obj))return [];var ret=[]; /*jshint forin:false */enumeration: for(var key in obj){if(hasProp.call(obj,key)){ret.push(key);}else {for(var i=0;i<excludedPrototypes.length;++i){if(hasProp.call(excludedPrototypes[i],key)){continue enumeration;}}ret.push(key);}}return ret;};}}();var thisAssignmentPattern=/this\s*\.\s*\S+\s*=/;function isClass(fn){try{if(typeof fn==="function"){var keys=es5.names(fn.prototype);var hasMethods=es5.isES5&&keys.length>1;var hasMethodsOtherThanConstructor=keys.length>0&&!(keys.length===1&&keys[0]==="constructor");var hasThisAssignmentAndStaticMethods=thisAssignmentPattern.test(fn+"")&&es5.names(fn).length>0;if(hasMethods||hasMethodsOtherThanConstructor||hasThisAssignmentAndStaticMethods){return true;}}return false;}catch(e){return false;}}function toFastProperties(obj){ /*jshint -W027,-W055,-W031*/function FakeConstructor(){}FakeConstructor.prototype=obj;var l=8;while(l--){new FakeConstructor();}return obj;eval(obj);}var rident=/^[a-z$_][a-z$_0-9]*$/i;function isIdentifier(str){return rident.test(str);}function filledRange(count,prefix,suffix){var ret=new Array(count);for(var i=0;i<count;++i){ret[i]=prefix+i+suffix;}return ret;}function safeToString(obj){try{return obj+"";}catch(e){return "[no string representation]";}}function isError(obj){return obj!==null&&(typeof obj==="undefined"?"undefined":_typeof(obj))==="object"&&typeof obj.message==="string"&&typeof obj.name==="string";}function markAsOriginatingFromRejection(e){try{notEnumerableProp(e,"isOperational",true);}catch(ignore){}}function originatesFromRejection(e){if(e==null)return false;return e instanceof Error["__BluebirdErrorTypes__"].OperationalError||e["isOperational"]===true;}function canAttachTrace(obj){return isError(obj)&&es5.propertyIsWritable(obj,"stack");}var ensureErrorObject=function(){if(!("stack" in new Error())){return function(value){if(canAttachTrace(value))return value;try{throw new Error(safeToString(value));}catch(err){return err;}};}else {return function(value){if(canAttachTrace(value))return value;return new Error(safeToString(value));};}}();function classString(obj){return {}.toString.call(obj);}function copyDescriptors(from,to,filter){var keys=es5.names(from);for(var i=0;i<keys.length;++i){var key=keys[i];if(filter(key)){try{es5.defineProperty(to,key,es5.getDescriptor(from,key));}catch(ignore){}}}}var asArray=function asArray(v){if(es5.isArray(v)){return v;}return null;};if(typeof Symbol!=="undefined"&&Symbol.iterator){var ArrayFrom=typeof Array.from==="function"?function(v){return Array.from(v);}:function(v){var ret=[];var it=v[Symbol.iterator]();var itResult;while(!(itResult=it.next()).done){ret.push(itResult.value);}return ret;};asArray=function asArray(v){if(es5.isArray(v)){return v;}else if(v!=null&&typeof v[Symbol.iterator]==="function"){return ArrayFrom(v);}return null;};}var isNode=typeof process!=="undefined"&&classString(process).toLowerCase()==="[object process]";function env(key,def){return isNode?process.env[key]:def;}var ret={isClass:isClass,isIdentifier:isIdentifier,inheritedDataKeys:inheritedDataKeys,getDataPropertyOrDefault:getDataPropertyOrDefault,thrower:thrower,isArray:es5.isArray,asArray:asArray,notEnumerableProp:notEnumerableProp,isPrimitive:isPrimitive,isObject:isObject,isError:isError,canEvaluate:canEvaluate,errorObj:errorObj,tryCatch:tryCatch,inherits:inherits,withAppended:withAppended,maybeWrapAsError:maybeWrapAsError,toFastProperties:toFastProperties,filledRange:filledRange,toString:safeToString,canAttachTrace:canAttachTrace,ensureErrorObject:ensureErrorObject,originatesFromRejection:originatesFromRejection,markAsOriginatingFromRejection:markAsOriginatingFromRejection,classString:classString,copyDescriptors:copyDescriptors,hasDevTools:typeof chrome!=="undefined"&&chrome&&typeof chrome.loadTimes==="function",isNode:isNode,env:env,global:globalObject};ret.isRecentNode=ret.isNode&&function(){var version=process.versions.node.split(".").map(Number);return version[0]===0&&version[1]>10||version[0]>0;}();if(ret.isNode)ret.toFastProperties(process);try{throw new Error();}catch(e){ret.lastLineError=e;}module.exports=ret;},{"./es5":13}]},{},[4])(4);});;if(typeof window!=='undefined'&&window!==null){window.P=window.Promise;}else if(typeof self!=='undefined'&&self!==null){self.P=self.Promise;}}).call(this,require("r7L21G"),typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{"r7L21G":3}],2:[function(require,module,exports){(function(global){ /**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */;(function(){ /**
 * Block-Level Grammar
 */var block={newline:/^\n+/,code:/^( {4}[^\n]+\n*)+/,fences:noop,hr:/^( *[-*_]){3,} *(?:\n+|$)/,heading:/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,nptable:noop,lheading:/^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,blockquote:/^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,list:/^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,html:/^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,table:noop,paragraph:/^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,text:/^[^\n]+/};block.bullet=/(?:[*+-]|\d+\.)/;block.item=/^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;block.item=replace(block.item,'gm')(/bull/g,block.bullet)();block.list=replace(block.list)(/bull/g,block.bullet)('hr','\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')('def','\\n+(?='+block.def.source+')')();block.blockquote=replace(block.blockquote)('def',block.def)();block._tag='(?!(?:'+'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'+'|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'+'|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';block.html=replace(block.html)('comment',/<!--[\s\S]*?-->/)('closed',/<(tag)[\s\S]+?<\/\1>/)('closing',/<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g,block._tag)();block.paragraph=replace(block.paragraph)('hr',block.hr)('heading',block.heading)('lheading',block.lheading)('blockquote',block.blockquote)('tag','<'+block._tag)('def',block.def)(); /**
 * Normal Block Grammar
 */block.normal=merge({},block); /**
 * GFM Block Grammar
 */block.gfm=merge({},block.normal,{fences:/^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,paragraph:/^/,heading:/^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/});block.gfm.paragraph=replace(block.paragraph)('(?!','(?!'+block.gfm.fences.source.replace('\\1','\\2')+'|'+block.list.source.replace('\\1','\\3')+'|')(); /**
 * GFM + Tables Block Grammar
 */block.tables=merge({},block.gfm,{nptable:/^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,table:/^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/}); /**
 * Block Lexer
 */function Lexer(options){this.tokens=[];this.tokens.links={};this.options=options||marked.defaults;this.rules=block.normal;if(this.options.gfm){if(this.options.tables){this.rules=block.tables;}else {this.rules=block.gfm;}}} /**
 * Expose Block Rules
 */Lexer.rules=block; /**
 * Static Lex Method
 */Lexer.lex=function(src,options){var lexer=new Lexer(options);return lexer.lex(src);}; /**
 * Preprocessing
 */Lexer.prototype.lex=function(src){src=src.replace(/\r\n|\r/g,'\n').replace(/\t/g,'    ').replace(/\u00a0/g,' ').replace(/\u2424/g,'\n');return this.token(src,true);}; /**
 * Lexing
 */Lexer.prototype.token=function(src,top,bq){var src=src.replace(/^ +$/gm,''),next,loose,cap,bull,b,item,space,i,l;while(src){ // newline
if(cap=this.rules.newline.exec(src)){src=src.substring(cap[0].length);if(cap[0].length>1){this.tokens.push({type:'space'});}} // code
if(cap=this.rules.code.exec(src)){src=src.substring(cap[0].length);cap=cap[0].replace(/^ {4}/gm,'');this.tokens.push({type:'code',text:!this.options.pedantic?cap.replace(/\n+$/,''):cap});continue;} // fences (gfm)
if(cap=this.rules.fences.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:'code',lang:cap[2],text:cap[3]||''});continue;} // heading
if(cap=this.rules.heading.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:'heading',depth:cap[1].length,text:cap[2]});continue;} // table no leading pipe (gfm)
if(top&&(cap=this.rules.nptable.exec(src))){src=src.substring(cap[0].length);item={type:'table',header:cap[1].replace(/^ *| *\| *$/g,'').split(/ *\| */),align:cap[2].replace(/^ *|\| *$/g,'').split(/ *\| */),cells:cap[3].replace(/\n$/,'').split('\n')};for(i=0;i<item.align.length;i++){if(/^ *-+: *$/.test(item.align[i])){item.align[i]='right';}else if(/^ *:-+: *$/.test(item.align[i])){item.align[i]='center';}else if(/^ *:-+ *$/.test(item.align[i])){item.align[i]='left';}else {item.align[i]=null;}}for(i=0;i<item.cells.length;i++){item.cells[i]=item.cells[i].split(/ *\| */);}this.tokens.push(item);continue;} // lheading
if(cap=this.rules.lheading.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:'heading',depth:cap[2]==='='?1:2,text:cap[1]});continue;} // hr
if(cap=this.rules.hr.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:'hr'});continue;} // blockquote
if(cap=this.rules.blockquote.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:'blockquote_start'});cap=cap[0].replace(/^ *> ?/gm,''); // Pass `top` to keep the current
// "toplevel" state. This is exactly
// how markdown.pl works.
this.token(cap,top,true);this.tokens.push({type:'blockquote_end'});continue;} // list
if(cap=this.rules.list.exec(src)){src=src.substring(cap[0].length);bull=cap[2];this.tokens.push({type:'list_start',ordered:bull.length>1}); // Get each top-level item.
cap=cap[0].match(this.rules.item);next=false;l=cap.length;i=0;for(;i<l;i++){item=cap[i]; // Remove the list item's bullet
// so it is seen as the next token.
space=item.length;item=item.replace(/^ *([*+-]|\d+\.) +/,''); // Outdent whatever the
// list item contains. Hacky.
if(~item.indexOf('\n ')){space-=item.length;item=!this.options.pedantic?item.replace(new RegExp('^ {1,'+space+'}','gm'),''):item.replace(/^ {1,4}/gm,'');} // Determine whether the next list item belongs here.
// Backpedal if it does not belong in this list.
if(this.options.smartLists&&i!==l-1){b=block.bullet.exec(cap[i+1])[0];if(bull!==b&&!(bull.length>1&&b.length>1)){src=cap.slice(i+1).join('\n')+src;i=l-1;}} // Determine whether item is loose or not.
// Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
// for discount behavior.
loose=next||/\n\n(?!\s*$)/.test(item);if(i!==l-1){next=item.charAt(item.length-1)==='\n';if(!loose)loose=next;}this.tokens.push({type:loose?'loose_item_start':'list_item_start'}); // Recurse.
this.token(item,false,bq);this.tokens.push({type:'list_item_end'});}this.tokens.push({type:'list_end'});continue;} // html
if(cap=this.rules.html.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:this.options.sanitize?'paragraph':'html',pre:!this.options.sanitizer&&(cap[1]==='pre'||cap[1]==='script'||cap[1]==='style'),text:cap[0]});continue;} // def
if(!bq&&top&&(cap=this.rules.def.exec(src))){src=src.substring(cap[0].length);this.tokens.links[cap[1].toLowerCase()]={href:cap[2],title:cap[3]};continue;} // table (gfm)
if(top&&(cap=this.rules.table.exec(src))){src=src.substring(cap[0].length);item={type:'table',header:cap[1].replace(/^ *| *\| *$/g,'').split(/ *\| */),align:cap[2].replace(/^ *|\| *$/g,'').split(/ *\| */),cells:cap[3].replace(/(?: *\| *)?\n$/,'').split('\n')};for(i=0;i<item.align.length;i++){if(/^ *-+: *$/.test(item.align[i])){item.align[i]='right';}else if(/^ *:-+: *$/.test(item.align[i])){item.align[i]='center';}else if(/^ *:-+ *$/.test(item.align[i])){item.align[i]='left';}else {item.align[i]=null;}}for(i=0;i<item.cells.length;i++){item.cells[i]=item.cells[i].replace(/^ *\| *| *\| *$/g,'').split(/ *\| */);}this.tokens.push(item);continue;} // top-level paragraph
if(top&&(cap=this.rules.paragraph.exec(src))){src=src.substring(cap[0].length);this.tokens.push({type:'paragraph',text:cap[1].charAt(cap[1].length-1)==='\n'?cap[1].slice(0,-1):cap[1]});continue;} // text
if(cap=this.rules.text.exec(src)){ // Top-level should never reach here.
src=src.substring(cap[0].length);this.tokens.push({type:'text',text:cap[0]});continue;}if(src){throw new Error('Infinite loop on byte: '+src.charCodeAt(0));}}return this.tokens;}; /**
 * Inline-Level Grammar
 */var inline={escape:/^\\([\\`*{}\[\]()#+\-.!_>])/,autolink:/^<([^ >]+(@|:\/)[^ >]+)>/,url:noop,tag:/^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,link:/^!?\[(inside)\]\(href\)/,reflink:/^!?\[(inside)\]\s*\[([^\]]*)\]/,nolink:/^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,strong:/^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,em:/^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,code:/^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,br:/^ {2,}\n(?!\s*$)/,del:noop,text:/^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/};inline._inside=/(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;inline._href=/\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;inline.link=replace(inline.link)('inside',inline._inside)('href',inline._href)();inline.reflink=replace(inline.reflink)('inside',inline._inside)(); /**
 * Normal Inline Grammar
 */inline.normal=merge({},inline); /**
 * Pedantic Inline Grammar
 */inline.pedantic=merge({},inline.normal,{strong:/^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,em:/^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/}); /**
 * GFM Inline Grammar
 */inline.gfm=merge({},inline.normal,{escape:replace(inline.escape)('])','~|])')(),url:/^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,del:/^~~(?=\S)([\s\S]*?\S)~~/,text:replace(inline.text)(']|','~]|')('|','|https?://|')()}); /**
 * GFM + Line Breaks Inline Grammar
 */inline.breaks=merge({},inline.gfm,{br:replace(inline.br)('{2,}','*')(),text:replace(inline.gfm.text)('{2,}','*')()}); /**
 * Inline Lexer & Compiler
 */function InlineLexer(links,options){this.options=options||marked.defaults;this.links=links;this.rules=inline.normal;this.renderer=this.options.renderer||new Renderer();this.renderer.options=this.options;if(!this.links){throw new Error('Tokens array requires a `links` property.');}if(this.options.gfm){if(this.options.breaks){this.rules=inline.breaks;}else {this.rules=inline.gfm;}}else if(this.options.pedantic){this.rules=inline.pedantic;}} /**
 * Expose Inline Rules
 */InlineLexer.rules=inline; /**
 * Static Lexing/Compiling Method
 */InlineLexer.output=function(src,links,options){var inline=new InlineLexer(links,options);return inline.output(src);}; /**
 * Lexing/Compiling
 */InlineLexer.prototype.output=function(src){var out='',link,text,href,cap;while(src){ // escape
if(cap=this.rules.escape.exec(src)){src=src.substring(cap[0].length);out+=cap[1];continue;} // autolink
if(cap=this.rules.autolink.exec(src)){src=src.substring(cap[0].length);if(cap[2]==='@'){text=cap[1].charAt(6)===':'?this.mangle(cap[1].substring(7)):this.mangle(cap[1]);href=this.mangle('mailto:')+text;}else {text=escape(cap[1]);href=text;}out+=this.renderer.link(href,null,text);continue;} // url (gfm)
if(!this.inLink&&(cap=this.rules.url.exec(src))){src=src.substring(cap[0].length);text=escape(cap[1]);href=text;out+=this.renderer.link(href,null,text);continue;} // tag
if(cap=this.rules.tag.exec(src)){if(!this.inLink&&/^<a /i.test(cap[0])){this.inLink=true;}else if(this.inLink&&/^<\/a>/i.test(cap[0])){this.inLink=false;}src=src.substring(cap[0].length);out+=this.options.sanitize?this.options.sanitizer?this.options.sanitizer(cap[0]):escape(cap[0]):cap[0];continue;} // link
if(cap=this.rules.link.exec(src)){src=src.substring(cap[0].length);this.inLink=true;out+=this.outputLink(cap,{href:cap[2],title:cap[3]});this.inLink=false;continue;} // reflink, nolink
if((cap=this.rules.reflink.exec(src))||(cap=this.rules.nolink.exec(src))){src=src.substring(cap[0].length);link=(cap[2]||cap[1]).replace(/\s+/g,' ');link=this.links[link.toLowerCase()];if(!link||!link.href){out+=cap[0].charAt(0);src=cap[0].substring(1)+src;continue;}this.inLink=true;out+=this.outputLink(cap,link);this.inLink=false;continue;} // strong
if(cap=this.rules.strong.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.strong(this.output(cap[2]||cap[1]));continue;} // em
if(cap=this.rules.em.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.em(this.output(cap[2]||cap[1]));continue;} // code
if(cap=this.rules.code.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.codespan(escape(cap[2],true));continue;} // br
if(cap=this.rules.br.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.br();continue;} // del (gfm)
if(cap=this.rules.del.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.del(this.output(cap[1]));continue;} // text
if(cap=this.rules.text.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.text(escape(this.smartypants(cap[0])));continue;}if(src){throw new Error('Infinite loop on byte: '+src.charCodeAt(0));}}return out;}; /**
 * Compile Link
 */InlineLexer.prototype.outputLink=function(cap,link){var href=escape(link.href),title=link.title?escape(link.title):null;return cap[0].charAt(0)!=='!'?this.renderer.link(href,title,this.output(cap[1])):this.renderer.image(href,title,escape(cap[1]));}; /**
 * Smartypants Transformations
 */InlineLexer.prototype.smartypants=function(text){if(!this.options.smartypants)return text;return text // em-dashes
.replace(/---/g,"—") // en-dashes
.replace(/--/g,"–") // opening singles
.replace(/(^|[-\u2014/(\[{"\s])'/g,"$1‘") // closing singles & apostrophes
.replace(/'/g,"’") // opening doubles
.replace(/(^|[-\u2014/(\[{\u2018\s])"/g,"$1“") // closing doubles
.replace(/"/g,"”") // ellipses
.replace(/\.{3}/g,"…");}; /**
 * Mangle Links
 */InlineLexer.prototype.mangle=function(text){if(!this.options.mangle)return text;var out='',l=text.length,i=0,ch;for(;i<l;i++){ch=text.charCodeAt(i);if(Math.random()>0.5){ch='x'+ch.toString(16);}out+='&#'+ch+';';}return out;}; /**
 * Renderer
 */function Renderer(options){this.options=options||{};}Renderer.prototype.code=function(code,lang,escaped){if(this.options.highlight){var out=this.options.highlight(code,lang);if(out!=null&&out!==code){escaped=true;code=out;}}if(!lang){return '<pre><code>'+(escaped?code:escape(code,true))+'\n</code></pre>';}return '<pre><code class="'+this.options.langPrefix+escape(lang,true)+'">'+(escaped?code:escape(code,true))+'\n</code></pre>\n';};Renderer.prototype.blockquote=function(quote){return '<blockquote>\n'+quote+'</blockquote>\n';};Renderer.prototype.html=function(html){return html;};Renderer.prototype.heading=function(text,level,raw){return '<h'+level+' id="'+this.options.headerPrefix+raw.toLowerCase().replace(/[^\w]+/g,'-')+'">'+text+'</h'+level+'>\n';};Renderer.prototype.hr=function(){return this.options.xhtml?'<hr/>\n':'<hr>\n';};Renderer.prototype.list=function(body,ordered){var type=ordered?'ol':'ul';return '<'+type+'>\n'+body+'</'+type+'>\n';};Renderer.prototype.listitem=function(text){return '<li>'+text+'</li>\n';};Renderer.prototype.paragraph=function(text){return '<p>'+text+'</p>\n';};Renderer.prototype.table=function(header,body){return '<table>\n'+'<thead>\n'+header+'</thead>\n'+'<tbody>\n'+body+'</tbody>\n'+'</table>\n';};Renderer.prototype.tablerow=function(content){return '<tr>\n'+content+'</tr>\n';};Renderer.prototype.tablecell=function(content,flags){var type=flags.header?'th':'td';var tag=flags.align?'<'+type+' style="text-align:'+flags.align+'">':'<'+type+'>';return tag+content+'</'+type+'>\n';}; // span level renderer
Renderer.prototype.strong=function(text){return '<strong>'+text+'</strong>';};Renderer.prototype.em=function(text){return '<em>'+text+'</em>';};Renderer.prototype.codespan=function(text){return '<code>'+text+'</code>';};Renderer.prototype.br=function(){return this.options.xhtml?'<br/>':'<br>';};Renderer.prototype.del=function(text){return '<del>'+text+'</del>';};Renderer.prototype.link=function(href,title,text){if(this.options.sanitize){try{var prot=decodeURIComponent(unescape(href)).replace(/[^\w:]/g,'').toLowerCase();}catch(e){return '';}if(prot.indexOf('javascript:')===0||prot.indexOf('vbscript:')===0){return '';}}var out='<a href="'+href+'"';if(title){out+=' title="'+title+'"';}out+='>'+text+'</a>';return out;};Renderer.prototype.image=function(href,title,text){var out='<img src="'+href+'" alt="'+text+'"';if(title){out+=' title="'+title+'"';}out+=this.options.xhtml?'/>':'>';return out;};Renderer.prototype.text=function(text){return text;}; /**
 * Parsing & Compiling
 */function Parser(options){this.tokens=[];this.token=null;this.options=options||marked.defaults;this.options.renderer=this.options.renderer||new Renderer();this.renderer=this.options.renderer;this.renderer.options=this.options;} /**
 * Static Parse Method
 */Parser.parse=function(src,options,renderer){var parser=new Parser(options,renderer);return parser.parse(src);}; /**
 * Parse Loop
 */Parser.prototype.parse=function(src){this.inline=new InlineLexer(src.links,this.options,this.renderer);this.tokens=src.reverse();var out='';while(this.next()){out+=this.tok();}return out;}; /**
 * Next Token
 */Parser.prototype.next=function(){return this.token=this.tokens.pop();}; /**
 * Preview Next Token
 */Parser.prototype.peek=function(){return this.tokens[this.tokens.length-1]||0;}; /**
 * Parse Text Tokens
 */Parser.prototype.parseText=function(){var body=this.token.text;while(this.peek().type==='text'){body+='\n'+this.next().text;}return this.inline.output(body);}; /**
 * Parse Current Token
 */Parser.prototype.tok=function(){switch(this.token.type){case 'space':{return '';}case 'hr':{return this.renderer.hr();}case 'heading':{return this.renderer.heading(this.inline.output(this.token.text),this.token.depth,this.token.text);}case 'code':{return this.renderer.code(this.token.text,this.token.lang,this.token.escaped);}case 'table':{var header='',body='',i,row,cell,flags,j; // header
cell='';for(i=0;i<this.token.header.length;i++){flags={header:true,align:this.token.align[i]};cell+=this.renderer.tablecell(this.inline.output(this.token.header[i]),{header:true,align:this.token.align[i]});}header+=this.renderer.tablerow(cell);for(i=0;i<this.token.cells.length;i++){row=this.token.cells[i];cell='';for(j=0;j<row.length;j++){cell+=this.renderer.tablecell(this.inline.output(row[j]),{header:false,align:this.token.align[j]});}body+=this.renderer.tablerow(cell);}return this.renderer.table(header,body);}case 'blockquote_start':{var body='';while(this.next().type!=='blockquote_end'){body+=this.tok();}return this.renderer.blockquote(body);}case 'list_start':{var body='',ordered=this.token.ordered;while(this.next().type!=='list_end'){body+=this.tok();}return this.renderer.list(body,ordered);}case 'list_item_start':{var body='';while(this.next().type!=='list_item_end'){body+=this.token.type==='text'?this.parseText():this.tok();}return this.renderer.listitem(body);}case 'loose_item_start':{var body='';while(this.next().type!=='list_item_end'){body+=this.tok();}return this.renderer.listitem(body);}case 'html':{var html=!this.token.pre&&!this.options.pedantic?this.inline.output(this.token.text):this.token.text;return this.renderer.html(html);}case 'paragraph':{return this.renderer.paragraph(this.inline.output(this.token.text));}case 'text':{return this.renderer.paragraph(this.parseText());}}}; /**
 * Helpers
 */function escape(html,encode){return html.replace(!encode?/&(?!#?\w+;)/g:/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}function unescape(html){return html.replace(/&([#\w]+);/g,function(_,n){n=n.toLowerCase();if(n==='colon')return ':';if(n.charAt(0)==='#'){return n.charAt(1)==='x'?String.fromCharCode(parseInt(n.substring(2),16)):String.fromCharCode(+n.substring(1));}return '';});}function replace(regex,opt){regex=regex.source;opt=opt||'';return function self(name,val){if(!name)return new RegExp(regex,opt);val=val.source||val;val=val.replace(/(^|[^\[])\^/g,'$1');regex=regex.replace(name,val);return self;};}function noop(){}noop.exec=noop;function merge(obj){var i=1,target,key;for(;i<arguments.length;i++){target=arguments[i];for(key in target){if(Object.prototype.hasOwnProperty.call(target,key)){obj[key]=target[key];}}}return obj;} /**
 * Marked
 */function marked(src,opt,callback){if(callback||typeof opt==='function'){if(!callback){callback=opt;opt=null;}opt=merge({},marked.defaults,opt||{});var highlight=opt.highlight,tokens,pending,i=0;try{tokens=Lexer.lex(src,opt);}catch(e){return callback(e);}pending=tokens.length;var done=function done(err){if(err){opt.highlight=highlight;return callback(err);}var out;try{out=Parser.parse(tokens,opt);}catch(e){err=e;}opt.highlight=highlight;return err?callback(err):callback(null,out);};if(!highlight||highlight.length<3){return done();}delete opt.highlight;if(!pending)return done();for(;i<tokens.length;i++){(function(token){if(token.type!=='code'){return --pending||done();}return highlight(token.text,token.lang,function(err,code){if(err)return done(err);if(code==null||code===token.text){return --pending||done();}token.text=code;token.escaped=true;--pending||done();});})(tokens[i]);}return;}try{if(opt)opt=merge({},marked.defaults,opt);return Parser.parse(Lexer.lex(src,opt),opt);}catch(e){e.message+='\nPlease report this to https://github.com/chjj/marked.';if((opt||marked.defaults).silent){return '<p>An error occured:</p><pre>'+escape(e.message+'',true)+'</pre>';}throw e;}} /**
 * Options
 */marked.options=marked.setOptions=function(opt){merge(marked.defaults,opt);return marked;};marked.defaults={gfm:true,tables:true,breaks:false,pedantic:false,sanitize:false,sanitizer:null,mangle:true,smartLists:false,silent:false,highlight:null,langPrefix:'lang-',smartypants:false,headerPrefix:'',renderer:new Renderer(),xhtml:false}; /**
 * Expose
 */marked.Parser=Parser;marked.parser=Parser.parse;marked.Renderer=Renderer;marked.Lexer=Lexer;marked.lexer=Lexer.lex;marked.InlineLexer=InlineLexer;marked.inlineLexer=InlineLexer.output;marked.parse=marked;if(typeof module!=='undefined'&&(typeof exports==="undefined"?"undefined":_typeof(exports))==='object'){module.exports=marked;}else if(typeof define==='function'&&define.amd){define(function(){return marked;});}else {this.marked=marked;}}).call(function(){return this||(typeof window!=='undefined'?window:global);}());}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{}],3:[function(require,module,exports){ // shim for using process in browser
var process=module.exports={};process.nextTick=function(){var canSetImmediate=typeof window!=='undefined'&&window.setImmediate;var canPost=typeof window!=='undefined'&&window.postMessage&&window.addEventListener;if(canSetImmediate){return function(f){return window.setImmediate(f);};}if(canPost){var queue=[];window.addEventListener('message',function(ev){var source=ev.source;if((source===window||source===null)&&ev.data==='process-tick'){ev.stopPropagation();if(queue.length>0){var fn=queue.shift();fn();}}},true);return function nextTick(fn){queue.push(fn);window.postMessage('process-tick','*');};}return function nextTick(fn){setTimeout(fn,0);};}();process.title='browser';process.browser=true;process.env={};process.argv=[];function noop(){}process.on=noop;process.addListener=noop;process.once=noop;process.off=noop;process.removeListener=noop;process.removeAllListeners=noop;process.emit=noop;process.binding=function(name){throw new Error('process.binding is not supported');}; // TODO(shtylman)
process.cwd=function(){return '/';};process.chdir=function(dir){throw new Error('process.chdir is not supported');};},{}],4:[function(require,module,exports){module.exports={"board":{"columns":["in progress"]}};},{}],5:[function(require,module,exports){'use strict';var Promise=require('bluebird');var IssuesEditor=require('./views/IssuesEditor');var BoardEditor=require('./views/BoardEditor');onReady('navbar',function(){ViewHelper.get('NavbarMain').renderPane({label:'GitHub',route:'/github/',icon:'github',items:[{name:'Issues',path:'issues',icon:'exclamation-circle'},{name:'Board',path:'board',icon:'columns'},{name:'Wiki',path:'wiki',icon:'book'}]});});function showLogin(){return new Promise(function(callback){function onSubmit(e){e.preventDefault();var $form=$(this);$.post('/api/github/login',$form.serialize(),function(data,textStatus){console.log('[GitHub] Log in '+textStatus);if(textStatus=='success'){callback();}});}$('.workspace').html(_.div({class:'dashboard-container'},[_.div({class:'panel panel-login'},[_.div({class:'panel-heading'},_.div({class:'login-icon'},_.span({class:'fa fa-github'}))),_.div({class:'panel-body'},_.form([_.input({type:'text',name:'usr',class:'form-control',placeholder:'Username'}),_.input({type:'password',name:'pwd',class:'form-control',placeholder:'Password'}),_.input({type:'submit',class:'btn btn-primary',value:'Log in'})]).on('submit',onSubmit))])]));});}function checkLogin(){$('.workspace').html(_.div({class:'dashboard-container'},[_.div({class:'panel panel-login'},[_.div({class:'panel-heading'},_.div({class:'login-icon'},_.span({class:'fa fa-github'}))),_.div({class:'panel-body'},_.div({class:'spinner-container'},_.span({class:'spinner fa fa-refresh'})))])]));return new Promise(function(callback){$.ajax({type:'post',data:{},url:'/api/github/login',success:function success(){callback();},error:function error(){showLogin().then(function(){callback();});}});});}Router.route('/github/',function(){ViewHelper.get('NavbarMain').showTab('/github/');checkLogin().then(function(){$('.workspace').html(_.div({class:'dashboard-container'},[_.h1('GitHub dashboard'),_.p('Please pick a feature to proceed')]));});});Router.route('/github/issues/',function(){ViewHelper.get('NavbarMain').highlightItem('issues');checkLogin().then(function(){var issuesEditor=new IssuesEditor({modelUrl:'/api/github/issues'});$('.workspace').html(issuesEditor.$element);});});Router.route('/github/board/',function(){ViewHelper.get('NavbarMain').highlightItem('board');checkLogin().then(function(){var boardEditor=new BoardEditor({modelUrl:'/api/github/issues'});$('.workspace').html(boardEditor.$element);});});Router.route('/github/wiki/',function(){ViewHelper.get('NavbarMain').highlightItem('wiki');$('.workspace').html('');});},{"./views/BoardEditor":6,"./views/IssuesEditor":7,"bluebird":1}],6:[function(require,module,exports){'use strict';var config=require('../../config.json'); // Lib
var markdownToHtml=require('marked');var BoardEditor=function(_View){_inherits(BoardEditor,_View);function BoardEditor(params){_classCallCheck(this,BoardEditor);var _this=_possibleConstructorReturn(this,Object.getPrototypeOf(BoardEditor).call(this,params));_this.$element=_.div({class:'board-editor'});_this.fetch();return _this;} /**
     * Sorts issues and places them in their appropriate parents
     */_createClass(BoardEditor,[{key:"sortIssues",value:function sortIssues(){var view=this;this.$element.find('.issue').each(function(i){var $issue=$(this);var labels=$issue.data('labels');var $column=view.$element.find('.column[data-name="backlog"]');if(labels){var _iteratorNormalCompletion=true;var _didIteratorError=false;var _iteratorError=undefined;try{for(var _iterator=labels[Symbol.iterator](),_step;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=true){var label=_step.value;var $foundColumn=view.$element.find('.column[data-name="'+label.name+'"]');if($foundColumn.length>0){$column=$foundColumn;break;}}}catch(err){_didIteratorError=true;_iteratorError=err;}finally {try{if(!_iteratorNormalCompletion&&_iterator.return){_iterator.return();}}finally {if(_didIteratorError){throw _iteratorError;}}}}$column.find('.column-issues').append($issue);});} /**
     * Renders a column
     */},{key:"renderColumn",value:function renderColumn(name){var $column=_.div({class:'column','data-name':name},_.div({class:'panel panel-default'},[_.div({class:'panel-heading'},_.h4({class:'panel-title'},name)),_.div({class:'panel-body column-issues'})]));return $column;} /**
     * Applies html5sortable plugin
     */},{key:"applySortable",value:function applySortable(){$('.board-editor .column-issues').sortable('destroy');$('.board-editor .column-issues').sortable({items:'.issue',forcePlaceholderSize:true,connectWith:'.board-editor .column-issues'}).on('sortstop',function(e,ui){alert(ui.data('id'));});}},{key:"render",value:function render(){var view=this;this.$element.empty();this.$element.append(_.each(this.model,function(i,issue){ // assignee {String}
// body {String}
// closed_at {String}
// comments {Number}
// comments_url {String}
// created_at {String}
// events_url {String}
// html_url {String}
// id {Number}
// labels {Array}
// labels_url {String}
// locked {Boolean}
// milestone {Object}
// number {Number}
// repository_url {String}
// state {String} open closed
// title {String}
// updated_at {String}
// url {String}
// user {Object}
var $issue=_.div({class:'issue','data-id':issue.id,'data-number':issue.number,'data-milestone':issue.milestone?issue.milestone.id:''},[_.div({class:'panel panel-default'},[_.div({class:'panel-heading'},_.h4({class:'panel-title'},issue.title)),_.div({class:'panel-body issue-body'},markdownToHtml(issue.body))])]);$issue.data('labels',issue.labels);return $issue;}));this.$element.append(this.renderColumn('backlog'));var _iteratorNormalCompletion2=true;var _didIteratorError2=false;var _iteratorError2=undefined;try{for(var _iterator2=config.board.columns[Symbol.iterator](),_step2;!(_iteratorNormalCompletion2=(_step2=_iterator2.next()).done);_iteratorNormalCompletion2=true){var columnName=_step2.value;this.$element.append(this.renderColumn(columnName));}}catch(err){_didIteratorError2=true;_iteratorError2=err;}finally {try{if(!_iteratorNormalCompletion2&&_iterator2.return){_iterator2.return();}}finally {if(_didIteratorError2){throw _iteratorError2;}}}this.$element.append(this.renderColumn('closed'));this.sortIssues();this.applySortable();}}]);return BoardEditor;}(View);module.exports=BoardEditor;},{"../../config.json":4,"marked":2}],7:[function(require,module,exports){'use strict'; // Lib
var markdownToHtml=require('marked');var IssuesEditor=function(_View2){_inherits(IssuesEditor,_View2);function IssuesEditor(params){_classCallCheck(this,IssuesEditor);var _this2=_possibleConstructorReturn(this,Object.getPrototypeOf(IssuesEditor).call(this,params));_this2.$element=_.div({class:'issues-editor'});_this2.fetch();return _this2;} /**
     * Sorts issues and places them in their appropriate parents
     */_createClass(IssuesEditor,[{key:"sortIssues",value:function sortIssues(){var view=this;this.$element.find('.issue').each(function(i){var $issue=$(this);var milestoneId=$issue.attr('data-milestone');var $milestone=view.$element.find('.milestone[data-id="'+milestoneId+'"]');var parentNumber=$issue.attr('data-parent');var $parentIssue=view.$element.find('.issue[data-number="'+parentNumber+'"]');if($milestone.length>0){$milestone.find('.milestone-issues').append($issue);$milestone.children('.panel').children('.panel-footer').children('a').children('.issue-count').html($milestone.find('.issue').length);}if($parentIssue.length>0){var $panel=$parentIssue.children('.panel');if($panel.find('.panel-footer').length<1){$panel.append(_.div({class:'panel-footer'},[_.a({'data-toggle':'collapse',href:'#collapse-'+parentNumber},[_.span({class:'issue-count'}),_.span({class:'fa fa-chevron-up'}),_.span({class:'fa fa-chevron-down'})]),_.div({id:'collapse-'+parentNumber,class:'collapse issue-children'})]));}$panel.children('.panel-footer').children('.issue-children').append($issue);$panel.children('.panel-footer').children('a').children('.issue-count').html($panel.find('.issue').length);}});} /**
     * Gets parent issue
     */},{key:"getParentIssue",value:function getParentIssue(issue){var pattern=/subtask of #[0-9]+ /;var matches=issue.body.toLowerCase().match(pattern);var parentNumber=-1;if(matches&&matches.length>0){matches=matches[0].match(/[0-9]+/);parentNumber=parseInt(matches[0]);}return parentNumber;} /**
     * Render milestone
     *
     * @param {Object} milestone
     */},{key:"renderMilestone",value:function renderMilestone(milestone){console.log(milestone);var $milestone=_.div({class:'milestone','data-id':milestone.id},_.div({class:'panel panel-default'},[_.div({class:'panel-heading'},_.h4({class:'panel-title'},milestone.title)),_.div({class:'panel-body'},milestone.description),_.div({class:'panel-footer'},[_.a({'data-toggle':'collapse',href:'#collapse-'+milestone.id,'aria-expanded':true},[_.span({class:'issue-count'}),_.span({class:'fa fa-chevron-up'}),_.span({class:'fa fa-chevron-down'})]),_.div({id:'collapse-'+milestone.id,class:'collapse in milestone-issues'})])]));return $milestone;}},{key:"render",value:function render(){var view=this;this.$element.empty();this.$element.append(_.each(this.model,function(i,issue){ // assignee {String}
// body {String}
// closed_at {String}
// comments {Number}
// comments_url {String}
// created_at {String}
// events_url {String}
// html_url {String}
// id {Number}
// labels {Array}
// labels_url {String}
// locked {Boolean}
// milestone {Object}
// number {Number}
// repository_url {String}
// state {String} open closed
// title {String}
// updated_at {String}
// url {String}
// user {Object}
if(issue.milestone&&view.$element.find('.milestone[data-id="'+issue.milestone.id+'"]').length<1){view.$element.append(view.renderMilestone(issue.milestone));}var body=issue.body.replace(/Subtask of #[0-9]+/,'');var $issue=_.div({class:'issue','data-number':issue.number,'data-parent':view.getParentIssue(issue),'data-milestone':issue.milestone?issue.milestone.id:''},[_.div({class:'panel panel-default'},[_.div({class:'panel-heading'},_.h4({class:'panel-title'},issue.title)),_.div({class:'panel-body issue-body'},markdownToHtml(body))])]);return $issue;}));this.sortIssues();}}]);return IssuesEditor;}(View);module.exports=IssuesEditor;},{"marked":2}]},{},[5]);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);throw new Error("Cannot find module '" + o + "'");
      }var f = n[o] = { exports: {} };t[o][0].call(f.exports, function (e) {
        var n = t[o][1][e];return s(n ? n : e);
      }, f, f.exports, e, t, n, r);
    }return n[o].exports;
  }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
    s(r[o]);
  }return s;
})({ 1: [function (require, module, exports) {
    (function (global) {
      /**
       * marked - a markdown parser
       * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
       * https://github.com/chjj/marked
       */

      ;(function () {

        /**
         * Block-Level Grammar
         */

        var block = {
          newline: /^\n+/,
          code: /^( {4}[^\n]+\n*)+/,
          fences: noop,
          hr: /^( *[-*_]){3,} *(?:\n+|$)/,
          heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
          nptable: noop,
          lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
          blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
          list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
          html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
          def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
          table: noop,
          paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
          text: /^[^\n]+/
        };

        block.bullet = /(?:[*+-]|\d+\.)/;
        block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
        block.item = replace(block.item, 'gm')(/bull/g, block.bullet)();

        block.list = replace(block.list)(/bull/g, block.bullet)('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')('def', '\\n+(?=' + block.def.source + ')')();

        block.blockquote = replace(block.blockquote)('def', block.def)();

        block._tag = '(?!(?:' + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code' + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo' + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

        block.html = replace(block.html)('comment', /<!--[\s\S]*?-->/)('closed', /<(tag)[\s\S]+?<\/\1>/)('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g, block._tag)();

        block.paragraph = replace(block.paragraph)('hr', block.hr)('heading', block.heading)('lheading', block.lheading)('blockquote', block.blockquote)('tag', '<' + block._tag)('def', block.def)();

        /**
         * Normal Block Grammar
         */

        block.normal = merge({}, block);

        /**
         * GFM Block Grammar
         */

        block.gfm = merge({}, block.normal, {
          fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
          paragraph: /^/,
          heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
        });

        block.gfm.paragraph = replace(block.paragraph)('(?!', '(?!' + block.gfm.fences.source.replace('\\1', '\\2') + '|' + block.list.source.replace('\\1', '\\3') + '|')();

        /**
         * GFM + Tables Block Grammar
         */

        block.tables = merge({}, block.gfm, {
          nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
          table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
        });

        /**
         * Block Lexer
         */

        function Lexer(options) {
          this.tokens = [];
          this.tokens.links = {};
          this.options = options || marked.defaults;
          this.rules = block.normal;

          if (this.options.gfm) {
            if (this.options.tables) {
              this.rules = block.tables;
            } else {
              this.rules = block.gfm;
            }
          }
        }

        /**
         * Expose Block Rules
         */

        Lexer.rules = block;

        /**
         * Static Lex Method
         */

        Lexer.lex = function (src, options) {
          var lexer = new Lexer(options);
          return lexer.lex(src);
        };

        /**
         * Preprocessing
         */

        Lexer.prototype.lex = function (src) {
          src = src.replace(/\r\n|\r/g, '\n').replace(/\t/g, '    ').replace(/\u00a0/g, ' ').replace(/\u2424/g, '\n');

          return this.token(src, true);
        };

        /**
         * Lexing
         */

        Lexer.prototype.token = function (src, top, bq) {
          var src = src.replace(/^ +$/gm, ''),
              next,
              loose,
              cap,
              bull,
              b,
              item,
              space,
              i,
              l;

          while (src) {
            // newline
            if (cap = this.rules.newline.exec(src)) {
              src = src.substring(cap[0].length);
              if (cap[0].length > 1) {
                this.tokens.push({
                  type: 'space'
                });
              }
            }

            // code
            if (cap = this.rules.code.exec(src)) {
              src = src.substring(cap[0].length);
              cap = cap[0].replace(/^ {4}/gm, '');
              this.tokens.push({
                type: 'code',
                text: !this.options.pedantic ? cap.replace(/\n+$/, '') : cap
              });
              continue;
            }

            // fences (gfm)
            if (cap = this.rules.fences.exec(src)) {
              src = src.substring(cap[0].length);
              this.tokens.push({
                type: 'code',
                lang: cap[2],
                text: cap[3] || ''
              });
              continue;
            }

            // heading
            if (cap = this.rules.heading.exec(src)) {
              src = src.substring(cap[0].length);
              this.tokens.push({
                type: 'heading',
                depth: cap[1].length,
                text: cap[2]
              });
              continue;
            }

            // table no leading pipe (gfm)
            if (top && (cap = this.rules.nptable.exec(src))) {
              src = src.substring(cap[0].length);

              item = {
                type: 'table',
                header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
                align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                cells: cap[3].replace(/\n$/, '').split('\n')
              };

              for (i = 0; i < item.align.length; i++) {
                if (/^ *-+: *$/.test(item.align[i])) {
                  item.align[i] = 'right';
                } else if (/^ *:-+: *$/.test(item.align[i])) {
                  item.align[i] = 'center';
                } else if (/^ *:-+ *$/.test(item.align[i])) {
                  item.align[i] = 'left';
                } else {
                  item.align[i] = null;
                }
              }

              for (i = 0; i < item.cells.length; i++) {
                item.cells[i] = item.cells[i].split(/ *\| */);
              }

              this.tokens.push(item);

              continue;
            }

            // lheading
            if (cap = this.rules.lheading.exec(src)) {
              src = src.substring(cap[0].length);
              this.tokens.push({
                type: 'heading',
                depth: cap[2] === '=' ? 1 : 2,
                text: cap[1]
              });
              continue;
            }

            // hr
            if (cap = this.rules.hr.exec(src)) {
              src = src.substring(cap[0].length);
              this.tokens.push({
                type: 'hr'
              });
              continue;
            }

            // blockquote
            if (cap = this.rules.blockquote.exec(src)) {
              src = src.substring(cap[0].length);

              this.tokens.push({
                type: 'blockquote_start'
              });

              cap = cap[0].replace(/^ *> ?/gm, '');

              // Pass `top` to keep the current
              // "toplevel" state. This is exactly
              // how markdown.pl works.
              this.token(cap, top, true);

              this.tokens.push({
                type: 'blockquote_end'
              });

              continue;
            }

            // list
            if (cap = this.rules.list.exec(src)) {
              src = src.substring(cap[0].length);
              bull = cap[2];

              this.tokens.push({
                type: 'list_start',
                ordered: bull.length > 1
              });

              // Get each top-level item.
              cap = cap[0].match(this.rules.item);

              next = false;
              l = cap.length;
              i = 0;

              for (; i < l; i++) {
                item = cap[i];

                // Remove the list item's bullet
                // so it is seen as the next token.
                space = item.length;
                item = item.replace(/^ *([*+-]|\d+\.) +/, '');

                // Outdent whatever the
                // list item contains. Hacky.
                if (~item.indexOf('\n ')) {
                  space -= item.length;
                  item = !this.options.pedantic ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '') : item.replace(/^ {1,4}/gm, '');
                }

                // Determine whether the next list item belongs here.
                // Backpedal if it does not belong in this list.
                if (this.options.smartLists && i !== l - 1) {
                  b = block.bullet.exec(cap[i + 1])[0];
                  if (bull !== b && !(bull.length > 1 && b.length > 1)) {
                    src = cap.slice(i + 1).join('\n') + src;
                    i = l - 1;
                  }
                }

                // Determine whether item is loose or not.
                // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
                // for discount behavior.
                loose = next || /\n\n(?!\s*$)/.test(item);
                if (i !== l - 1) {
                  next = item.charAt(item.length - 1) === '\n';
                  if (!loose) loose = next;
                }

                this.tokens.push({
                  type: loose ? 'loose_item_start' : 'list_item_start'
                });

                // Recurse.
                this.token(item, false, bq);

                this.tokens.push({
                  type: 'list_item_end'
                });
              }

              this.tokens.push({
                type: 'list_end'
              });

              continue;
            }

            // html
            if (cap = this.rules.html.exec(src)) {
              src = src.substring(cap[0].length);
              this.tokens.push({
                type: this.options.sanitize ? 'paragraph' : 'html',
                pre: !this.options.sanitizer && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
                text: cap[0]
              });
              continue;
            }

            // def
            if (!bq && top && (cap = this.rules.def.exec(src))) {
              src = src.substring(cap[0].length);
              this.tokens.links[cap[1].toLowerCase()] = {
                href: cap[2],
                title: cap[3]
              };
              continue;
            }

            // table (gfm)
            if (top && (cap = this.rules.table.exec(src))) {
              src = src.substring(cap[0].length);

              item = {
                type: 'table',
                header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
                align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
              };

              for (i = 0; i < item.align.length; i++) {
                if (/^ *-+: *$/.test(item.align[i])) {
                  item.align[i] = 'right';
                } else if (/^ *:-+: *$/.test(item.align[i])) {
                  item.align[i] = 'center';
                } else if (/^ *:-+ *$/.test(item.align[i])) {
                  item.align[i] = 'left';
                } else {
                  item.align[i] = null;
                }
              }

              for (i = 0; i < item.cells.length; i++) {
                item.cells[i] = item.cells[i].replace(/^ *\| *| *\| *$/g, '').split(/ *\| */);
              }

              this.tokens.push(item);

              continue;
            }

            // top-level paragraph
            if (top && (cap = this.rules.paragraph.exec(src))) {
              src = src.substring(cap[0].length);
              this.tokens.push({
                type: 'paragraph',
                text: cap[1].charAt(cap[1].length - 1) === '\n' ? cap[1].slice(0, -1) : cap[1]
              });
              continue;
            }

            // text
            if (cap = this.rules.text.exec(src)) {
              // Top-level should never reach here.
              src = src.substring(cap[0].length);
              this.tokens.push({
                type: 'text',
                text: cap[0]
              });
              continue;
            }

            if (src) {
              throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
            }
          }

          return this.tokens;
        };

        /**
         * Inline-Level Grammar
         */

        var inline = {
          escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
          autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
          url: noop,
          tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
          link: /^!?\[(inside)\]\(href\)/,
          reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
          nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
          strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
          em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
          code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
          br: /^ {2,}\n(?!\s*$)/,
          del: noop,
          text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
        };

        inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
        inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

        inline.link = replace(inline.link)('inside', inline._inside)('href', inline._href)();

        inline.reflink = replace(inline.reflink)('inside', inline._inside)();

        /**
         * Normal Inline Grammar
         */

        inline.normal = merge({}, inline);

        /**
         * Pedantic Inline Grammar
         */

        inline.pedantic = merge({}, inline.normal, {
          strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
          em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
        });

        /**
         * GFM Inline Grammar
         */

        inline.gfm = merge({}, inline.normal, {
          escape: replace(inline.escape)('])', '~|])')(),
          url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
          del: /^~~(?=\S)([\s\S]*?\S)~~/,
          text: replace(inline.text)(']|', '~]|')('|', '|https?://|')()
        });

        /**
         * GFM + Line Breaks Inline Grammar
         */

        inline.breaks = merge({}, inline.gfm, {
          br: replace(inline.br)('{2,}', '*')(),
          text: replace(inline.gfm.text)('{2,}', '*')()
        });

        /**
         * Inline Lexer & Compiler
         */

        function InlineLexer(links, options) {
          this.options = options || marked.defaults;
          this.links = links;
          this.rules = inline.normal;
          this.renderer = this.options.renderer || new Renderer();
          this.renderer.options = this.options;

          if (!this.links) {
            throw new Error('Tokens array requires a `links` property.');
          }

          if (this.options.gfm) {
            if (this.options.breaks) {
              this.rules = inline.breaks;
            } else {
              this.rules = inline.gfm;
            }
          } else if (this.options.pedantic) {
            this.rules = inline.pedantic;
          }
        }

        /**
         * Expose Inline Rules
         */

        InlineLexer.rules = inline;

        /**
         * Static Lexing/Compiling Method
         */

        InlineLexer.output = function (src, links, options) {
          var inline = new InlineLexer(links, options);
          return inline.output(src);
        };

        /**
         * Lexing/Compiling
         */

        InlineLexer.prototype.output = function (src) {
          var out = '',
              link,
              text,
              href,
              cap;

          while (src) {
            // escape
            if (cap = this.rules.escape.exec(src)) {
              src = src.substring(cap[0].length);
              out += cap[1];
              continue;
            }

            // autolink
            if (cap = this.rules.autolink.exec(src)) {
              src = src.substring(cap[0].length);
              if (cap[2] === '@') {
                text = cap[1].charAt(6) === ':' ? this.mangle(cap[1].substring(7)) : this.mangle(cap[1]);
                href = this.mangle('mailto:') + text;
              } else {
                text = escape(cap[1]);
                href = text;
              }
              out += this.renderer.link(href, null, text);
              continue;
            }

            // url (gfm)
            if (!this.inLink && (cap = this.rules.url.exec(src))) {
              src = src.substring(cap[0].length);
              text = escape(cap[1]);
              href = text;
              out += this.renderer.link(href, null, text);
              continue;
            }

            // tag
            if (cap = this.rules.tag.exec(src)) {
              if (!this.inLink && /^<a /i.test(cap[0])) {
                this.inLink = true;
              } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
                this.inLink = false;
              }
              src = src.substring(cap[0].length);
              out += this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]) : cap[0];
              continue;
            }

            // link
            if (cap = this.rules.link.exec(src)) {
              src = src.substring(cap[0].length);
              this.inLink = true;
              out += this.outputLink(cap, {
                href: cap[2],
                title: cap[3]
              });
              this.inLink = false;
              continue;
            }

            // reflink, nolink
            if ((cap = this.rules.reflink.exec(src)) || (cap = this.rules.nolink.exec(src))) {
              src = src.substring(cap[0].length);
              link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
              link = this.links[link.toLowerCase()];
              if (!link || !link.href) {
                out += cap[0].charAt(0);
                src = cap[0].substring(1) + src;
                continue;
              }
              this.inLink = true;
              out += this.outputLink(cap, link);
              this.inLink = false;
              continue;
            }

            // strong
            if (cap = this.rules.strong.exec(src)) {
              src = src.substring(cap[0].length);
              out += this.renderer.strong(this.output(cap[2] || cap[1]));
              continue;
            }

            // em
            if (cap = this.rules.em.exec(src)) {
              src = src.substring(cap[0].length);
              out += this.renderer.em(this.output(cap[2] || cap[1]));
              continue;
            }

            // code
            if (cap = this.rules.code.exec(src)) {
              src = src.substring(cap[0].length);
              out += this.renderer.codespan(escape(cap[2], true));
              continue;
            }

            // br
            if (cap = this.rules.br.exec(src)) {
              src = src.substring(cap[0].length);
              out += this.renderer.br();
              continue;
            }

            // del (gfm)
            if (cap = this.rules.del.exec(src)) {
              src = src.substring(cap[0].length);
              out += this.renderer.del(this.output(cap[1]));
              continue;
            }

            // text
            if (cap = this.rules.text.exec(src)) {
              src = src.substring(cap[0].length);
              out += this.renderer.text(escape(this.smartypants(cap[0])));
              continue;
            }

            if (src) {
              throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
            }
          }

          return out;
        };

        /**
         * Compile Link
         */

        InlineLexer.prototype.outputLink = function (cap, link) {
          var href = escape(link.href),
              title = link.title ? escape(link.title) : null;

          return cap[0].charAt(0) !== '!' ? this.renderer.link(href, title, this.output(cap[1])) : this.renderer.image(href, title, escape(cap[1]));
        };

        /**
         * Smartypants Transformations
         */

        InlineLexer.prototype.smartypants = function (text) {
          if (!this.options.smartypants) return text;
          return text
          // em-dashes
          .replace(/---/g, "—")
          // en-dashes
          .replace(/--/g, "–")
          // opening singles
          .replace(/(^|[-\u2014/(\[{"\s])'/g, "$1‘")
          // closing singles & apostrophes
          .replace(/'/g, "’")
          // opening doubles
          .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1“")
          // closing doubles
          .replace(/"/g, "”")
          // ellipses
          .replace(/\.{3}/g, "…");
        };

        /**
         * Mangle Links
         */

        InlineLexer.prototype.mangle = function (text) {
          if (!this.options.mangle) return text;
          var out = '',
              l = text.length,
              i = 0,
              ch;

          for (; i < l; i++) {
            ch = text.charCodeAt(i);
            if (Math.random() > 0.5) {
              ch = 'x' + ch.toString(16);
            }
            out += '&#' + ch + ';';
          }

          return out;
        };

        /**
         * Renderer
         */

        function Renderer(options) {
          this.options = options || {};
        }

        Renderer.prototype.code = function (code, lang, escaped) {
          if (this.options.highlight) {
            var out = this.options.highlight(code, lang);
            if (out != null && out !== code) {
              escaped = true;
              code = out;
            }
          }

          if (!lang) {
            return '<pre><code>' + (escaped ? code : escape(code, true)) + '\n</code></pre>';
          }

          return '<pre><code class="' + this.options.langPrefix + escape(lang, true) + '">' + (escaped ? code : escape(code, true)) + '\n</code></pre>\n';
        };

        Renderer.prototype.blockquote = function (quote) {
          return '<blockquote>\n' + quote + '</blockquote>\n';
        };

        Renderer.prototype.html = function (html) {
          return html;
        };

        Renderer.prototype.heading = function (text, level, raw) {
          return '<h' + level + ' id="' + this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-') + '">' + text + '</h' + level + '>\n';
        };

        Renderer.prototype.hr = function () {
          return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
        };

        Renderer.prototype.list = function (body, ordered) {
          var type = ordered ? 'ol' : 'ul';
          return '<' + type + '>\n' + body + '</' + type + '>\n';
        };

        Renderer.prototype.listitem = function (text) {
          return '<li>' + text + '</li>\n';
        };

        Renderer.prototype.paragraph = function (text) {
          return '<p>' + text + '</p>\n';
        };

        Renderer.prototype.table = function (header, body) {
          return '<table>\n' + '<thead>\n' + header + '</thead>\n' + '<tbody>\n' + body + '</tbody>\n' + '</table>\n';
        };

        Renderer.prototype.tablerow = function (content) {
          return '<tr>\n' + content + '</tr>\n';
        };

        Renderer.prototype.tablecell = function (content, flags) {
          var type = flags.header ? 'th' : 'td';
          var tag = flags.align ? '<' + type + ' style="text-align:' + flags.align + '">' : '<' + type + '>';
          return tag + content + '</' + type + '>\n';
        };

        // span level renderer
        Renderer.prototype.strong = function (text) {
          return '<strong>' + text + '</strong>';
        };

        Renderer.prototype.em = function (text) {
          return '<em>' + text + '</em>';
        };

        Renderer.prototype.codespan = function (text) {
          return '<code>' + text + '</code>';
        };

        Renderer.prototype.br = function () {
          return this.options.xhtml ? '<br/>' : '<br>';
        };

        Renderer.prototype.del = function (text) {
          return '<del>' + text + '</del>';
        };

        Renderer.prototype.link = function (href, title, text) {
          if (this.options.sanitize) {
            try {
              var prot = decodeURIComponent(unescape(href)).replace(/[^\w:]/g, '').toLowerCase();
            } catch (e) {
              return '';
            }
            if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
              return '';
            }
          }
          var out = '<a href="' + href + '"';
          if (title) {
            out += ' title="' + title + '"';
          }
          out += '>' + text + '</a>';
          return out;
        };

        Renderer.prototype.image = function (href, title, text) {
          var out = '<img src="' + href + '" alt="' + text + '"';
          if (title) {
            out += ' title="' + title + '"';
          }
          out += this.options.xhtml ? '/>' : '>';
          return out;
        };

        Renderer.prototype.text = function (text) {
          return text;
        };

        /**
         * Parsing & Compiling
         */

        function Parser(options) {
          this.tokens = [];
          this.token = null;
          this.options = options || marked.defaults;
          this.options.renderer = this.options.renderer || new Renderer();
          this.renderer = this.options.renderer;
          this.renderer.options = this.options;
        }

        /**
         * Static Parse Method
         */

        Parser.parse = function (src, options, renderer) {
          var parser = new Parser(options, renderer);
          return parser.parse(src);
        };

        /**
         * Parse Loop
         */

        Parser.prototype.parse = function (src) {
          this.inline = new InlineLexer(src.links, this.options, this.renderer);
          this.tokens = src.reverse();

          var out = '';
          while (this.next()) {
            out += this.tok();
          }

          return out;
        };

        /**
         * Next Token
         */

        Parser.prototype.next = function () {
          return this.token = this.tokens.pop();
        };

        /**
         * Preview Next Token
         */

        Parser.prototype.peek = function () {
          return this.tokens[this.tokens.length - 1] || 0;
        };

        /**
         * Parse Text Tokens
         */

        Parser.prototype.parseText = function () {
          var body = this.token.text;

          while (this.peek().type === 'text') {
            body += '\n' + this.next().text;
          }

          return this.inline.output(body);
        };

        /**
         * Parse Current Token
         */

        Parser.prototype.tok = function () {
          switch (this.token.type) {
            case 'space':
              {
                return '';
              }
            case 'hr':
              {
                return this.renderer.hr();
              }
            case 'heading':
              {
                return this.renderer.heading(this.inline.output(this.token.text), this.token.depth, this.token.text);
              }
            case 'code':
              {
                return this.renderer.code(this.token.text, this.token.lang, this.token.escaped);
              }
            case 'table':
              {
                var header = '',
                    body = '',
                    i,
                    row,
                    cell,
                    flags,
                    j;

                // header
                cell = '';
                for (i = 0; i < this.token.header.length; i++) {
                  flags = { header: true, align: this.token.align[i] };
                  cell += this.renderer.tablecell(this.inline.output(this.token.header[i]), { header: true, align: this.token.align[i] });
                }
                header += this.renderer.tablerow(cell);

                for (i = 0; i < this.token.cells.length; i++) {
                  row = this.token.cells[i];

                  cell = '';
                  for (j = 0; j < row.length; j++) {
                    cell += this.renderer.tablecell(this.inline.output(row[j]), { header: false, align: this.token.align[j] });
                  }

                  body += this.renderer.tablerow(cell);
                }
                return this.renderer.table(header, body);
              }
            case 'blockquote_start':
              {
                var body = '';

                while (this.next().type !== 'blockquote_end') {
                  body += this.tok();
                }

                return this.renderer.blockquote(body);
              }
            case 'list_start':
              {
                var body = '',
                    ordered = this.token.ordered;

                while (this.next().type !== 'list_end') {
                  body += this.tok();
                }

                return this.renderer.list(body, ordered);
              }
            case 'list_item_start':
              {
                var body = '';

                while (this.next().type !== 'list_item_end') {
                  body += this.token.type === 'text' ? this.parseText() : this.tok();
                }

                return this.renderer.listitem(body);
              }
            case 'loose_item_start':
              {
                var body = '';

                while (this.next().type !== 'list_item_end') {
                  body += this.tok();
                }

                return this.renderer.listitem(body);
              }
            case 'html':
              {
                var html = !this.token.pre && !this.options.pedantic ? this.inline.output(this.token.text) : this.token.text;
                return this.renderer.html(html);
              }
            case 'paragraph':
              {
                return this.renderer.paragraph(this.inline.output(this.token.text));
              }
            case 'text':
              {
                return this.renderer.paragraph(this.parseText());
              }
          }
        };

        /**
         * Helpers
         */

        function escape(html, encode) {
          return html.replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        }

        function unescape(html) {
          return html.replace(/&([#\w]+);/g, function (_, n) {
            n = n.toLowerCase();
            if (n === 'colon') return ':';
            if (n.charAt(0) === '#') {
              return n.charAt(1) === 'x' ? String.fromCharCode(parseInt(n.substring(2), 16)) : String.fromCharCode(+n.substring(1));
            }
            return '';
          });
        }

        function replace(regex, opt) {
          regex = regex.source;
          opt = opt || '';
          return function self(name, val) {
            if (!name) return new RegExp(regex, opt);
            val = val.source || val;
            val = val.replace(/(^|[^\[])\^/g, '$1');
            regex = regex.replace(name, val);
            return self;
          };
        }

        function noop() {}
        noop.exec = noop;

        function merge(obj) {
          var i = 1,
              target,
              key;

          for (; i < arguments.length; i++) {
            target = arguments[i];
            for (key in target) {
              if (Object.prototype.hasOwnProperty.call(target, key)) {
                obj[key] = target[key];
              }
            }
          }

          return obj;
        }

        /**
         * Marked
         */

        function marked(src, opt, callback) {
          if (callback || typeof opt === 'function') {
            if (!callback) {
              callback = opt;
              opt = null;
            }

            opt = merge({}, marked.defaults, opt || {});

            var highlight = opt.highlight,
                tokens,
                pending,
                i = 0;

            try {
              tokens = Lexer.lex(src, opt);
            } catch (e) {
              return callback(e);
            }

            pending = tokens.length;

            var done = function done(err) {
              if (err) {
                opt.highlight = highlight;
                return callback(err);
              }

              var out;

              try {
                out = Parser.parse(tokens, opt);
              } catch (e) {
                err = e;
              }

              opt.highlight = highlight;

              return err ? callback(err) : callback(null, out);
            };

            if (!highlight || highlight.length < 3) {
              return done();
            }

            delete opt.highlight;

            if (!pending) return done();

            for (; i < tokens.length; i++) {
              (function (token) {
                if (token.type !== 'code') {
                  return --pending || done();
                }
                return highlight(token.text, token.lang, function (err, code) {
                  if (err) return done(err);
                  if (code == null || code === token.text) {
                    return --pending || done();
                  }
                  token.text = code;
                  token.escaped = true;
                  --pending || done();
                });
              })(tokens[i]);
            }

            return;
          }
          try {
            if (opt) opt = merge({}, marked.defaults, opt);
            return Parser.parse(Lexer.lex(src, opt), opt);
          } catch (e) {
            e.message += '\nPlease report this to https://github.com/chjj/marked.';
            if ((opt || marked.defaults).silent) {
              return '<p>An error occured:</p><pre>' + escape(e.message + '', true) + '</pre>';
            }
            throw e;
          }
        }

        /**
         * Options
         */

        marked.options = marked.setOptions = function (opt) {
          merge(marked.defaults, opt);
          return marked;
        };

        marked.defaults = {
          gfm: true,
          tables: true,
          breaks: false,
          pedantic: false,
          sanitize: false,
          sanitizer: null,
          mangle: true,
          smartLists: false,
          silent: false,
          highlight: null,
          langPrefix: 'lang-',
          smartypants: false,
          headerPrefix: '',
          renderer: new Renderer(),
          xhtml: false
        };

        /**
         * Expose
         */

        marked.Parser = Parser;
        marked.parser = Parser.parse;

        marked.Renderer = Renderer;

        marked.Lexer = Lexer;
        marked.lexer = Lexer.lex;

        marked.InlineLexer = InlineLexer;
        marked.inlineLexer = InlineLexer.output;

        marked.parse = marked;

        if (typeof module !== 'undefined' && (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
          module.exports = marked;
        } else if (typeof define === 'function' && define.amd) {
          define(function () {
            return marked;
          });
        } else {
          this.marked = marked;
        }
      }).call(function () {
        return this || (typeof window !== 'undefined' ? window : global);
      }());
    }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
  }, {}], 2: [function (require, module, exports) {
    'use strict';

    // Lib

    var markdownToHtml = require('marked');

    var IssuesEditor = function (_View) {
      _inherits(IssuesEditor, _View);

      function IssuesEditor(params) {
        _classCallCheck(this, IssuesEditor);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(IssuesEditor).call(this, params));

        _this.$element = _.div({ class: 'issues-editor' });

        _this.fetch();
        return _this;
      }

      /**
       * Sorts issues and places them in their appropriate parents
       */


      _createClass(IssuesEditor, [{
        key: "sortIssues",
        value: function sortIssues() {
          var view = this;

          this.$element.find('.issue').each(function (i) {
            var $issue = $(this);

            var milestoneId = $issue.attr('data-milestone');
            var $milestone = view.$element.find('.milestone[data-id="' + milestoneId + '"]');

            var parentNumber = $issue.attr('data-parent');
            var $parentIssue = view.$element.find('.issue[data-number="' + parentNumber + '"]');

            if ($milestone.length > 0) {
              $milestone.find('.milestone-issues').append($issue);

              $milestone.children('.panel').children('.panel-footer').children('a').children('.issue-count').html($milestone.find('.issue').length);
            }

            if ($parentIssue.length > 0) {
              var $panel = $parentIssue.children('.panel');

              if ($panel.find('.panel-footer').length < 1) {
                $panel.append(_.div({ class: 'panel-footer' }, [_.a({ 'data-toggle': 'collapse', href: '#collapse-' + parentNumber }, [_.span({ class: 'issue-count' }), _.span({ class: 'fa fa-chevron-up' }), _.span({ class: 'fa fa-chevron-down' })]), _.div({ id: 'collapse-' + parentNumber, class: 'collapse issue-children' })]));
              }

              $panel.children('.panel-footer').children('.issue-children').append($issue);

              $panel.children('.panel-footer').children('a').children('.issue-count').html($panel.find('.issue').length);
            }
          });
        }

        /**
         * Gets parent issue
         */

      }, {
        key: "getParentIssue",
        value: function getParentIssue(issue) {
          var pattern = /subtask of #[0-9]+ /;
          var matches = issue.body.toLowerCase().match(pattern);
          var parentNumber = -1;

          if (matches && matches.length > 0) {
            matches = matches[0].match(/[0-9]+/);

            parentNumber = parseInt(matches[0]);
          }

          return parentNumber;
        }

        /**
         * Render milestone
         *
         * @param {Object} milestone
         */

      }, {
        key: "renderMilestone",
        value: function renderMilestone(milestone) {
          console.log(milestone);

          var $milestone = _.div({ class: 'milestone', 'data-id': milestone.id }, _.div({ class: 'panel panel-default' }, [_.div({ class: 'panel-heading' }, _.h4({ class: 'panel-title' }, milestone.title)), _.div({ class: 'panel-body' }, milestone.description), _.div({ class: 'panel-footer' }, [_.a({ 'data-toggle': 'collapse', href: '#collapse-' + milestone.id, 'aria-expanded': true }, [_.span({ class: 'issue-count' }), _.span({ class: 'fa fa-chevron-up' }), _.span({ class: 'fa fa-chevron-down' })]), _.div({ id: 'collapse-' + milestone.id, class: 'collapse in milestone-issues' })])]));

          return $milestone;
        }
      }, {
        key: "render",
        value: function render() {
          var view = this;

          this.$element.empty();
          this.$element.append(_.each(this.model, function (i, issue) {
            // assignee {String}
            // body {String}
            // closed_at {String}
            // comments {Number}
            // comments_url {String}
            // created_at {String}
            // events_url {String}
            // html_url {String}
            // id {Number}
            // labels {Array}
            // labels_url {String}
            // locked {Boolean}
            // milestone {Object}
            // number {Number}
            // repository_url {String}
            // state {String} open closed
            // title {String}
            // updated_at {String}
            // url {String}
            // user {Object}

            if (issue.milestone && view.$element.find('.milestone[data-id="' + issue.milestone.id + '"]').length < 1) {
              view.$element.append(view.renderMilestone(issue.milestone));
            }

            var body = issue.body.replace(/Subtask of #[0-9]+/, '');

            var $issue = _.div({
              class: 'issue',
              'data-number': issue.number,
              'data-parent': view.getParentIssue(issue),
              'data-milestone': issue.milestone ? issue.milestone.id : ''
            }, [_.div({ class: 'panel panel-default' }, [_.div({ class: 'panel-heading' }, _.h4({ class: 'panel-title' }, issue.title)), _.div({ class: 'panel-body issue-body' }, markdownToHtml(body))])]);

            return $issue;
          }));

          this.sortIssues();
        }
      }]);

      return IssuesEditor;
    }(View);

    module.exports = IssuesEditor;
  }, { "marked": 1 }] }, {}, [2]);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);throw new Error("Cannot find module '" + o + "'");
            }var f = n[o] = { exports: {} };t[o][0].call(f.exports, function (e) {
                var n = t[o][1][e];return s(n ? n : e);
            }, f, f.exports, e, t, n, r);
        }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
        s(r[o]);
    }return s;
})({ 1: [function (require, module, exports) {
        'use strict';

        var ContentReferenceEditor = function (_View) {
            _inherits(ContentReferenceEditor, _View);

            function ContentReferenceEditor(params) {
                _classCallCheck(this, ContentReferenceEditor);

                var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ContentReferenceEditor).call(this, params));

                _this.init();
                return _this;
            }

            _createClass(ContentReferenceEditor, [{
                key: "onChange",
                value: function onChange() {
                    this.trigger('change', this.$select.val());
                }
            }, {
                key: "render",
                value: function render() {
                    var editor = this;

                    this.$element = _.div({ class: 'field-editor input-group content-reference-editor' }, [this.$select = _.select({ class: 'form-control' }, _.each(window.resources.content, function (id, node) {
                        return _.option({ value: node.id }, node.title);
                    })).change(function () {
                        editor.onChange();
                    }), _.div({ class: 'input-group-btn' }, this.$clearBtn = _.button({ class: 'btn btn-primary' }, 'Clear'))]);

                    this.$select.val(editor.value);

                    this.$clearBtn.click(function () {
                        editor.$select.val(null);

                        editor.onChange();
                    });
                }
            }]);

            return ContentReferenceEditor;
        }(View);

        resources.editors['20006'] = ContentReferenceEditor;
    }, {}] }, {}, [1]);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);throw new Error("Cannot find module '" + o + "'");
            }var f = n[o] = { exports: {} };t[o][0].call(f.exports, function (e) {
                var n = t[o][1][e];return s(n ? n : e);
            }, f, f.exports, e, t, n, r);
        }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
        s(r[o]);
    }return s;
})({ 1: [function (require, module, exports) {
        'use strict';

        var DateEditor = function (_View) {
            _inherits(DateEditor, _View);

            function DateEditor(params) {
                _classCallCheck(this, DateEditor);

                var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DateEditor).call(this, params));

                _this.init();
                return _this;
            }

            _createClass(DateEditor, [{
                key: "onChange",
                value: function onChange() {
                    this.trigger('change', this.$input.val());
                }
            }, {
                key: "render",
                value: function render() {
                    var editor = this;

                    var date = new Date(this.value);

                    this.$element = _.div({ class: 'field-editor date-editor' }, this.disabled ? _.p({}, date) : this.$input = _.input({ class: 'form-control', type: 'text', value: this.value }));

                    if (this.$input) {
                        this.$input.datepicker();

                        this.$input.on('changeDate', function () {
                            editor.onChange();
                        });
                    }
                }
            }]);

            return DateEditor;
        }(View);

        resources.editors['20002'] = DateEditor;
    }, {}] }, {}, [1]);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);throw new Error("Cannot find module '" + o + "'");
            }var f = n[o] = { exports: {} };t[o][0].call(f.exports, function (e) {
                var n = t[o][1][e];return s(n ? n : e);
            }, f, f.exports, e, t, n, r);
        }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
        s(r[o]);
    }return s;
})({ 1: [function (require, module, exports) {
        'use strict';

        var DropdownEditor = function (_View) {
            _inherits(DropdownEditor, _View);

            function DropdownEditor(params) {
                _classCallCheck(this, DropdownEditor);

                var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DropdownEditor).call(this, params));

                _this.init();
                return _this;
            }

            _createClass(DropdownEditor, [{
                key: "onChange",
                value: function onChange() {
                    this.value = this.$select.val();

                    this.trigger('change', this.value);
                }
            }, {
                key: "render",
                value: function render() {
                    var editor = this;

                    this.$element = _.div({ class: 'field-editor dropdown-editor' }, this.$select = _.select({ class: 'form-control' }, _.each(this.config.options, function (i, option) {
                        return _.option({
                            value: option.value,
                            selected: editor.value == option.value
                        }, option.label);
                    })).change(function () {
                        editor.onChange();
                    }));
                }
            }]);

            return DropdownEditor;
        }(View);

        resources.editors['20008'] = DropdownEditor;
    }, {}] }, {}, [1]);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);throw new Error("Cannot find module '" + o + "'");
            }var f = n[o] = { exports: {} };t[o][0].call(f.exports, function (e) {
                var n = t[o][1][e];return s(n ? n : e);
            }, f, f.exports, e, t, n, r);
        }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
        s(r[o]);
    }return s;
})({ 1: [function (require, module, exports) {
        'use strict';

        var MediaReferenceEditor = function (_View) {
            _inherits(MediaReferenceEditor, _View);

            function MediaReferenceEditor(params) {
                _classCallCheck(this, MediaReferenceEditor);

                var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MediaReferenceEditor).call(this, params));

                _this.$element = _.div({ class: 'field-editor media-reference-editor' }, [_this.$body = _.div({ class: 'thumbnail-container' }), _this.$footer = _.div()]);

                _this.init();
                return _this;
            }

            _createClass(MediaReferenceEditor, [{
                key: "onChange",
                value: function onChange() {
                    this.trigger('change', this.value);

                    this.render();
                }
            }, {
                key: "onClickBrowse",
                value: function onClickBrowse() {
                    var editor = this;

                    function onClickOK() {
                        if (!editor.config.multiple) {
                            editor.value = $modal.find('.thumbnail.active').attr('data-id');
                        } else {
                            editor.value = [];

                            $modal.find('.thumbnail.active').each(function (i) {
                                editor.value.push($(this).attr('data-id'));
                            });
                        }

                        editor.onChange();

                        $modal.modal('hide');
                    }

                    var $modal = _.div({ class: 'modal fade media-modal' }, _.div({ class: 'modal-dialog' }, _.div({ class: 'modal-content' }, [_.div({ class: 'modal-header' }, _.input({ class: 'form-control', placeholder: 'Search media' })), _.div({ class: 'modal-body' }, _.div({ class: 'thumbnail-container' }, _.each(resources.media, function (i, media) {
                        function onClick() {
                            if (!editor.config.multiple) {
                                $modal.find('.thumbnail').toggleClass('active', false);
                                $(this).toggleClass('active', true);
                            } else {
                                $(this).toggleClass('active');
                            }
                        }

                        return _.button({
                            class: 'thumbnail thumbnail-sm',
                            'data-id': media.id,
                            style: 'background-image: url(\'/media/' + media.id + '\')'
                        }, [_.label(media.name)]).click(onClick);
                    }))), _.div({ class: 'modal-footer' }, _.button({ class: 'btn btn-primary' }, 'OK').click(onClickOK))])));

                    if (!editor.config.multiple) {
                        $modal.find('.thumbnail[data-id="' + editor.value + '"]').toggleClass('active', true);
                    } else {
                        editor.value = editor.value || [];

                        $modal.find('.thumbnail').each(function (i) {
                            $(this).toggleClass('active', editor.value.indexOf($(this).attr('data-id')) > -1);
                        });
                    }

                    $modal.on('hidden.bs.modal', function () {
                        $modal.remove();
                    });

                    $modal.modal('show');

                    return $modal;
                }
            }, {
                key: "render",
                value: function render() {
                    var editor = this;

                    var $images = void 0;

                    if (!editor.config.multiple) {
                        $images = _.div({
                            class: 'thumbnail thumbnail-sm',
                            style: 'background-image: url(\'/media/' + editor.value + '\')'
                        });
                    } else {
                        $images = _.each(editor.value, function (i, val) {
                            return _.div({
                                class: 'thumbnail thumbnail-sm',
                                style: 'background-image: url(\'/media/' + val + '\')'
                            });
                        });
                    }

                    this.$body.html($images);

                    this.$footer.html(this.$button = _.button({ class: 'btn btn-primary' }, 'Browse').click(function () {
                        editor.onClickBrowse();
                    }));
                }
            }]);

            return MediaReferenceEditor;
        }(View);

        resources.editors['20007'] = MediaReferenceEditor;
    }, {}] }, {}, [1]);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);throw new Error("Cannot find module '" + o + "'");
            }var f = n[o] = { exports: {} };t[o][0].call(f.exports, function (e) {
                var n = t[o][1][e];return s(n ? n : e);
            }, f, f.exports, e, t, n, r);
        }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
        s(r[o]);
    }return s;
})({ 1: [function (require, module, exports) {
        'use strict';

        var PeriodEditor = function (_View) {
            _inherits(PeriodEditor, _View);

            function PeriodEditor(params) {
                _classCallCheck(this, PeriodEditor);

                var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PeriodEditor).call(this, params));

                _this.init();
                return _this;
            }

            _createClass(PeriodEditor, [{
                key: "onChange",
                value: function onChange() {
                    var newValue = {
                        enabled: this.$toggle[0].checked,
                        from: this.$from.val(),
                        to: this.$to.val()
                    };

                    this.trigger('change', newValue);
                }
            }, {
                key: "render",
                value: function render() {
                    var editor = this;

                    editor.value = editor.value || {};
                    editor.value.enabled = editor.value.enabled == true || editor.value.enabled == "true";

                    var toDate = new Date(editor.value.to);
                    var fromDate = new Date(editor.value.from);
                    var switchId = 'switch-' + $('.switch').length;

                    this.$element = _.div({ class: 'field-editor period-editor' }, _.div({ class: 'input-group' }, [this.$from = _.input({ class: 'form-control' + (editor.value.enabled ? '' : ' disabled'), type: 'text', value: editor.value.from }), _.div({ class: 'arrow-middle input-group-addon' }, _.span({ class: 'fa fa-arrow-right' })), this.$to = _.input({ class: 'form-control' + (editor.value.enabled ? '' : ' disabled'), type: 'text', value: editor.value.to }), _.div({ class: 'input-group-addon' }, _.div({ class: 'switch' }, [this.$toggle = _.input({ id: switchId, class: 'form-control switch', type: 'checkbox' }), _.label({ for: switchId })]))]));

                    this.$from.datepicker();
                    this.$to.datepicker();

                    this.$toggle[0].checked = editor.value.enabled;

                    this.$from.on('changeDate', function () {
                        editor.onChange();
                    });

                    this.$to.on('changeDate', function () {
                        editor.onChange();
                    });

                    this.$toggle.on('change', function () {
                        editor.$from.toggleClass('disabled', !this.checked);
                        editor.$to.toggleClass('disabled', !this.checked);

                        editor.onChange();
                    });
                }
            }]);

            return PeriodEditor;
        }(View);

        resources.editors['20005'] = PeriodEditor;
    }, {}] }, {}, [1]);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);throw new Error("Cannot find module '" + o + "'");
      }var f = n[o] = { exports: {} };t[o][0].call(f.exports, function (e) {
        var n = t[o][1][e];return s(n ? n : e);
      }, f, f.exports, e, t, n, r);
    }return n[o].exports;
  }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
    s(r[o]);
  }return s;
})({ 1: [function (require, module, exports) {
    /**
     * This file automatically generated from `build.js`.
     * Do not manually edit.
     */

    module.exports = ["address", "article", "aside", "audio", "blockquote", "canvas", "dd", "div", "dl", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "main", "nav", "noscript", "ol", "output", "p", "pre", "section", "table", "tfoot", "ul", "video"];
  }, {}], 2: [function (require, module, exports) {}, {}], 3: [function (require, module, exports) {
    'use strict';

    var voidElements = require('void-elements');
    Object.keys(voidElements).forEach(function (name) {
      voidElements[name.toUpperCase()] = 1;
    });

    var blockElements = {};
    require('block-elements').forEach(function (name) {
      blockElements[name.toUpperCase()] = 1;
    });

    /**
     * isBlockElem(node) determines if the given node is a block element.
     *
     * @param {Node} node
     * @return {Boolean}
     */
    function isBlockElem(node) {
      return !!(node && blockElements[node.nodeName]);
    }

    /**
     * isVoid(node) determines if the given node is a void element.
     *
     * @param {Node} node
     * @return {Boolean}
     */
    function isVoid(node) {
      return !!(node && voidElements[node.nodeName]);
    }

    /**
     * whitespace(elem [, isBlock]) removes extraneous whitespace from an
     * the given element. The function isBlock may optionally be passed in
     * to determine whether or not an element is a block element; if none
     * is provided, defaults to using the list of block elements provided
     * by the `block-elements` module.
     *
     * @param {Node} elem
     * @param {Function} blockTest
     */
    function collapseWhitespace(elem, isBlock) {
      if (!elem.firstChild || elem.nodeName === 'PRE') return;

      if (typeof isBlock !== 'function') {
        isBlock = isBlockElem;
      }

      var prevText = null;
      var prevVoid = false;

      var prev = null;
      var node = next(prev, elem);

      while (node !== elem) {
        if (node.nodeType === 3) {
          // Node.TEXT_NODE
          var text = node.data.replace(/[ \r\n\t]+/g, ' ');

          if ((!prevText || / $/.test(prevText.data)) && !prevVoid && text[0] === ' ') {
            text = text.substr(1);
          }

          // `text` might be empty at this point.
          if (!text) {
            node = remove(node);
            continue;
          }

          node.data = text;
          prevText = node;
        } else if (node.nodeType === 1) {
          // Node.ELEMENT_NODE
          if (isBlock(node) || node.nodeName === 'BR') {
            if (prevText) {
              prevText.data = prevText.data.replace(/ $/, '');
            }

            prevText = null;
            prevVoid = false;
          } else if (isVoid(node)) {
            // Avoid trimming space around non-block, non-BR void elements.
            prevText = null;
            prevVoid = true;
          }
        } else {
          node = remove(node);
          continue;
        }

        var nextNode = next(prev, node);
        prev = node;
        node = nextNode;
      }

      if (prevText) {
        prevText.data = prevText.data.replace(/ $/, '');
        if (!prevText.data) {
          remove(prevText);
        }
      }
    }

    /**
     * remove(node) removes the given node from the DOM and returns the
     * next node in the sequence.
     *
     * @param {Node} node
     * @return {Node} node
     */
    function remove(node) {
      var next = node.nextSibling || node.parentNode;

      node.parentNode.removeChild(node);

      return next;
    }

    /**
     * next(prev, current) returns the next node in the sequence, given the
     * current and previous nodes.
     *
     * @param {Node} prev
     * @param {Node} current
     * @return {Node}
     */
    function next(prev, current) {
      if (prev && prev.parentNode === current || current.nodeName === 'PRE') {
        return current.nextSibling || current.parentNode;
      }

      return current.firstChild || current.nextSibling || current.parentNode;
    }

    module.exports = collapseWhitespace;
  }, { "block-elements": 1, "void-elements": 8 }], 4: [function (require, module, exports) {
    (function (global) {
      /**
       * marked - a markdown parser
       * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
       * https://github.com/chjj/marked
       */

      ;(function () {

        /**
         * Block-Level Grammar
         */

        var block = {
          newline: /^\n+/,
          code: /^( {4}[^\n]+\n*)+/,
          fences: noop,
          hr: /^( *[-*_]){3,} *(?:\n+|$)/,
          heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
          nptable: noop,
          lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
          blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
          list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
          html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
          def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
          table: noop,
          paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
          text: /^[^\n]+/
        };

        block.bullet = /(?:[*+-]|\d+\.)/;
        block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
        block.item = replace(block.item, 'gm')(/bull/g, block.bullet)();

        block.list = replace(block.list)(/bull/g, block.bullet)('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')('def', '\\n+(?=' + block.def.source + ')')();

        block.blockquote = replace(block.blockquote)('def', block.def)();

        block._tag = '(?!(?:' + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code' + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo' + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

        block.html = replace(block.html)('comment', /<!--[\s\S]*?-->/)('closed', /<(tag)[\s\S]+?<\/\1>/)('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g, block._tag)();

        block.paragraph = replace(block.paragraph)('hr', block.hr)('heading', block.heading)('lheading', block.lheading)('blockquote', block.blockquote)('tag', '<' + block._tag)('def', block.def)();

        /**
         * Normal Block Grammar
         */

        block.normal = merge({}, block);

        /**
         * GFM Block Grammar
         */

        block.gfm = merge({}, block.normal, {
          fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
          paragraph: /^/,
          heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
        });

        block.gfm.paragraph = replace(block.paragraph)('(?!', '(?!' + block.gfm.fences.source.replace('\\1', '\\2') + '|' + block.list.source.replace('\\1', '\\3') + '|')();

        /**
         * GFM + Tables Block Grammar
         */

        block.tables = merge({}, block.gfm, {
          nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
          table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
        });

        /**
         * Block Lexer
         */

        function Lexer(options) {
          this.tokens = [];
          this.tokens.links = {};
          this.options = options || marked.defaults;
          this.rules = block.normal;

          if (this.options.gfm) {
            if (this.options.tables) {
              this.rules = block.tables;
            } else {
              this.rules = block.gfm;
            }
          }
        }

        /**
         * Expose Block Rules
         */

        Lexer.rules = block;

        /**
         * Static Lex Method
         */

        Lexer.lex = function (src, options) {
          var lexer = new Lexer(options);
          return lexer.lex(src);
        };

        /**
         * Preprocessing
         */

        Lexer.prototype.lex = function (src) {
          src = src.replace(/\r\n|\r/g, '\n').replace(/\t/g, '    ').replace(/\u00a0/g, ' ').replace(/\u2424/g, '\n');

          return this.token(src, true);
        };

        /**
         * Lexing
         */

        Lexer.prototype.token = function (src, top, bq) {
          var src = src.replace(/^ +$/gm, ''),
              next,
              loose,
              cap,
              bull,
              b,
              item,
              space,
              i,
              l;

          while (src) {
            // newline
            if (cap = this.rules.newline.exec(src)) {
              src = src.substring(cap[0].length);
              if (cap[0].length > 1) {
                this.tokens.push({
                  type: 'space'
                });
              }
            }

            // code
            if (cap = this.rules.code.exec(src)) {
              src = src.substring(cap[0].length);
              cap = cap[0].replace(/^ {4}/gm, '');
              this.tokens.push({
                type: 'code',
                text: !this.options.pedantic ? cap.replace(/\n+$/, '') : cap
              });
              continue;
            }

            // fences (gfm)
            if (cap = this.rules.fences.exec(src)) {
              src = src.substring(cap[0].length);
              this.tokens.push({
                type: 'code',
                lang: cap[2],
                text: cap[3] || ''
              });
              continue;
            }

            // heading
            if (cap = this.rules.heading.exec(src)) {
              src = src.substring(cap[0].length);
              this.tokens.push({
                type: 'heading',
                depth: cap[1].length,
                text: cap[2]
              });
              continue;
            }

            // table no leading pipe (gfm)
            if (top && (cap = this.rules.nptable.exec(src))) {
              src = src.substring(cap[0].length);

              item = {
                type: 'table',
                header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
                align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                cells: cap[3].replace(/\n$/, '').split('\n')
              };

              for (i = 0; i < item.align.length; i++) {
                if (/^ *-+: *$/.test(item.align[i])) {
                  item.align[i] = 'right';
                } else if (/^ *:-+: *$/.test(item.align[i])) {
                  item.align[i] = 'center';
                } else if (/^ *:-+ *$/.test(item.align[i])) {
                  item.align[i] = 'left';
                } else {
                  item.align[i] = null;
                }
              }

              for (i = 0; i < item.cells.length; i++) {
                item.cells[i] = item.cells[i].split(/ *\| */);
              }

              this.tokens.push(item);

              continue;
            }

            // lheading
            if (cap = this.rules.lheading.exec(src)) {
              src = src.substring(cap[0].length);
              this.tokens.push({
                type: 'heading',
                depth: cap[2] === '=' ? 1 : 2,
                text: cap[1]
              });
              continue;
            }

            // hr
            if (cap = this.rules.hr.exec(src)) {
              src = src.substring(cap[0].length);
              this.tokens.push({
                type: 'hr'
              });
              continue;
            }

            // blockquote
            if (cap = this.rules.blockquote.exec(src)) {
              src = src.substring(cap[0].length);

              this.tokens.push({
                type: 'blockquote_start'
              });

              cap = cap[0].replace(/^ *> ?/gm, '');

              // Pass `top` to keep the current
              // "toplevel" state. This is exactly
              // how markdown.pl works.
              this.token(cap, top, true);

              this.tokens.push({
                type: 'blockquote_end'
              });

              continue;
            }

            // list
            if (cap = this.rules.list.exec(src)) {
              src = src.substring(cap[0].length);
              bull = cap[2];

              this.tokens.push({
                type: 'list_start',
                ordered: bull.length > 1
              });

              // Get each top-level item.
              cap = cap[0].match(this.rules.item);

              next = false;
              l = cap.length;
              i = 0;

              for (; i < l; i++) {
                item = cap[i];

                // Remove the list item's bullet
                // so it is seen as the next token.
                space = item.length;
                item = item.replace(/^ *([*+-]|\d+\.) +/, '');

                // Outdent whatever the
                // list item contains. Hacky.
                if (~item.indexOf('\n ')) {
                  space -= item.length;
                  item = !this.options.pedantic ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '') : item.replace(/^ {1,4}/gm, '');
                }

                // Determine whether the next list item belongs here.
                // Backpedal if it does not belong in this list.
                if (this.options.smartLists && i !== l - 1) {
                  b = block.bullet.exec(cap[i + 1])[0];
                  if (bull !== b && !(bull.length > 1 && b.length > 1)) {
                    src = cap.slice(i + 1).join('\n') + src;
                    i = l - 1;
                  }
                }

                // Determine whether item is loose or not.
                // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
                // for discount behavior.
                loose = next || /\n\n(?!\s*$)/.test(item);
                if (i !== l - 1) {
                  next = item.charAt(item.length - 1) === '\n';
                  if (!loose) loose = next;
                }

                this.tokens.push({
                  type: loose ? 'loose_item_start' : 'list_item_start'
                });

                // Recurse.
                this.token(item, false, bq);

                this.tokens.push({
                  type: 'list_item_end'
                });
              }

              this.tokens.push({
                type: 'list_end'
              });

              continue;
            }

            // html
            if (cap = this.rules.html.exec(src)) {
              src = src.substring(cap[0].length);
              this.tokens.push({
                type: this.options.sanitize ? 'paragraph' : 'html',
                pre: !this.options.sanitizer && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
                text: cap[0]
              });
              continue;
            }

            // def
            if (!bq && top && (cap = this.rules.def.exec(src))) {
              src = src.substring(cap[0].length);
              this.tokens.links[cap[1].toLowerCase()] = {
                href: cap[2],
                title: cap[3]
              };
              continue;
            }

            // table (gfm)
            if (top && (cap = this.rules.table.exec(src))) {
              src = src.substring(cap[0].length);

              item = {
                type: 'table',
                header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
                align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
              };

              for (i = 0; i < item.align.length; i++) {
                if (/^ *-+: *$/.test(item.align[i])) {
                  item.align[i] = 'right';
                } else if (/^ *:-+: *$/.test(item.align[i])) {
                  item.align[i] = 'center';
                } else if (/^ *:-+ *$/.test(item.align[i])) {
                  item.align[i] = 'left';
                } else {
                  item.align[i] = null;
                }
              }

              for (i = 0; i < item.cells.length; i++) {
                item.cells[i] = item.cells[i].replace(/^ *\| *| *\| *$/g, '').split(/ *\| */);
              }

              this.tokens.push(item);

              continue;
            }

            // top-level paragraph
            if (top && (cap = this.rules.paragraph.exec(src))) {
              src = src.substring(cap[0].length);
              this.tokens.push({
                type: 'paragraph',
                text: cap[1].charAt(cap[1].length - 1) === '\n' ? cap[1].slice(0, -1) : cap[1]
              });
              continue;
            }

            // text
            if (cap = this.rules.text.exec(src)) {
              // Top-level should never reach here.
              src = src.substring(cap[0].length);
              this.tokens.push({
                type: 'text',
                text: cap[0]
              });
              continue;
            }

            if (src) {
              throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
            }
          }

          return this.tokens;
        };

        /**
         * Inline-Level Grammar
         */

        var inline = {
          escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
          autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
          url: noop,
          tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
          link: /^!?\[(inside)\]\(href\)/,
          reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
          nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
          strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
          em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
          code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
          br: /^ {2,}\n(?!\s*$)/,
          del: noop,
          text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
        };

        inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
        inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

        inline.link = replace(inline.link)('inside', inline._inside)('href', inline._href)();

        inline.reflink = replace(inline.reflink)('inside', inline._inside)();

        /**
         * Normal Inline Grammar
         */

        inline.normal = merge({}, inline);

        /**
         * Pedantic Inline Grammar
         */

        inline.pedantic = merge({}, inline.normal, {
          strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
          em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
        });

        /**
         * GFM Inline Grammar
         */

        inline.gfm = merge({}, inline.normal, {
          escape: replace(inline.escape)('])', '~|])')(),
          url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
          del: /^~~(?=\S)([\s\S]*?\S)~~/,
          text: replace(inline.text)(']|', '~]|')('|', '|https?://|')()
        });

        /**
         * GFM + Line Breaks Inline Grammar
         */

        inline.breaks = merge({}, inline.gfm, {
          br: replace(inline.br)('{2,}', '*')(),
          text: replace(inline.gfm.text)('{2,}', '*')()
        });

        /**
         * Inline Lexer & Compiler
         */

        function InlineLexer(links, options) {
          this.options = options || marked.defaults;
          this.links = links;
          this.rules = inline.normal;
          this.renderer = this.options.renderer || new Renderer();
          this.renderer.options = this.options;

          if (!this.links) {
            throw new Error('Tokens array requires a `links` property.');
          }

          if (this.options.gfm) {
            if (this.options.breaks) {
              this.rules = inline.breaks;
            } else {
              this.rules = inline.gfm;
            }
          } else if (this.options.pedantic) {
            this.rules = inline.pedantic;
          }
        }

        /**
         * Expose Inline Rules
         */

        InlineLexer.rules = inline;

        /**
         * Static Lexing/Compiling Method
         */

        InlineLexer.output = function (src, links, options) {
          var inline = new InlineLexer(links, options);
          return inline.output(src);
        };

        /**
         * Lexing/Compiling
         */

        InlineLexer.prototype.output = function (src) {
          var out = '',
              link,
              text,
              href,
              cap;

          while (src) {
            // escape
            if (cap = this.rules.escape.exec(src)) {
              src = src.substring(cap[0].length);
              out += cap[1];
              continue;
            }

            // autolink
            if (cap = this.rules.autolink.exec(src)) {
              src = src.substring(cap[0].length);
              if (cap[2] === '@') {
                text = cap[1].charAt(6) === ':' ? this.mangle(cap[1].substring(7)) : this.mangle(cap[1]);
                href = this.mangle('mailto:') + text;
              } else {
                text = escape(cap[1]);
                href = text;
              }
              out += this.renderer.link(href, null, text);
              continue;
            }

            // url (gfm)
            if (!this.inLink && (cap = this.rules.url.exec(src))) {
              src = src.substring(cap[0].length);
              text = escape(cap[1]);
              href = text;
              out += this.renderer.link(href, null, text);
              continue;
            }

            // tag
            if (cap = this.rules.tag.exec(src)) {
              if (!this.inLink && /^<a /i.test(cap[0])) {
                this.inLink = true;
              } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
                this.inLink = false;
              }
              src = src.substring(cap[0].length);
              out += this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]) : cap[0];
              continue;
            }

            // link
            if (cap = this.rules.link.exec(src)) {
              src = src.substring(cap[0].length);
              this.inLink = true;
              out += this.outputLink(cap, {
                href: cap[2],
                title: cap[3]
              });
              this.inLink = false;
              continue;
            }

            // reflink, nolink
            if ((cap = this.rules.reflink.exec(src)) || (cap = this.rules.nolink.exec(src))) {
              src = src.substring(cap[0].length);
              link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
              link = this.links[link.toLowerCase()];
              if (!link || !link.href) {
                out += cap[0].charAt(0);
                src = cap[0].substring(1) + src;
                continue;
              }
              this.inLink = true;
              out += this.outputLink(cap, link);
              this.inLink = false;
              continue;
            }

            // strong
            if (cap = this.rules.strong.exec(src)) {
              src = src.substring(cap[0].length);
              out += this.renderer.strong(this.output(cap[2] || cap[1]));
              continue;
            }

            // em
            if (cap = this.rules.em.exec(src)) {
              src = src.substring(cap[0].length);
              out += this.renderer.em(this.output(cap[2] || cap[1]));
              continue;
            }

            // code
            if (cap = this.rules.code.exec(src)) {
              src = src.substring(cap[0].length);
              out += this.renderer.codespan(escape(cap[2], true));
              continue;
            }

            // br
            if (cap = this.rules.br.exec(src)) {
              src = src.substring(cap[0].length);
              out += this.renderer.br();
              continue;
            }

            // del (gfm)
            if (cap = this.rules.del.exec(src)) {
              src = src.substring(cap[0].length);
              out += this.renderer.del(this.output(cap[1]));
              continue;
            }

            // text
            if (cap = this.rules.text.exec(src)) {
              src = src.substring(cap[0].length);
              out += this.renderer.text(escape(this.smartypants(cap[0])));
              continue;
            }

            if (src) {
              throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
            }
          }

          return out;
        };

        /**
         * Compile Link
         */

        InlineLexer.prototype.outputLink = function (cap, link) {
          var href = escape(link.href),
              title = link.title ? escape(link.title) : null;

          return cap[0].charAt(0) !== '!' ? this.renderer.link(href, title, this.output(cap[1])) : this.renderer.image(href, title, escape(cap[1]));
        };

        /**
         * Smartypants Transformations
         */

        InlineLexer.prototype.smartypants = function (text) {
          if (!this.options.smartypants) return text;
          return text
          // em-dashes
          .replace(/---/g, "—")
          // en-dashes
          .replace(/--/g, "–")
          // opening singles
          .replace(/(^|[-\u2014/(\[{"\s])'/g, "$1‘")
          // closing singles & apostrophes
          .replace(/'/g, "’")
          // opening doubles
          .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1“")
          // closing doubles
          .replace(/"/g, "”")
          // ellipses
          .replace(/\.{3}/g, "…");
        };

        /**
         * Mangle Links
         */

        InlineLexer.prototype.mangle = function (text) {
          if (!this.options.mangle) return text;
          var out = '',
              l = text.length,
              i = 0,
              ch;

          for (; i < l; i++) {
            ch = text.charCodeAt(i);
            if (Math.random() > 0.5) {
              ch = 'x' + ch.toString(16);
            }
            out += '&#' + ch + ';';
          }

          return out;
        };

        /**
         * Renderer
         */

        function Renderer(options) {
          this.options = options || {};
        }

        Renderer.prototype.code = function (code, lang, escaped) {
          if (this.options.highlight) {
            var out = this.options.highlight(code, lang);
            if (out != null && out !== code) {
              escaped = true;
              code = out;
            }
          }

          if (!lang) {
            return '<pre><code>' + (escaped ? code : escape(code, true)) + '\n</code></pre>';
          }

          return '<pre><code class="' + this.options.langPrefix + escape(lang, true) + '">' + (escaped ? code : escape(code, true)) + '\n</code></pre>\n';
        };

        Renderer.prototype.blockquote = function (quote) {
          return '<blockquote>\n' + quote + '</blockquote>\n';
        };

        Renderer.prototype.html = function (html) {
          return html;
        };

        Renderer.prototype.heading = function (text, level, raw) {
          return '<h' + level + ' id="' + this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-') + '">' + text + '</h' + level + '>\n';
        };

        Renderer.prototype.hr = function () {
          return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
        };

        Renderer.prototype.list = function (body, ordered) {
          var type = ordered ? 'ol' : 'ul';
          return '<' + type + '>\n' + body + '</' + type + '>\n';
        };

        Renderer.prototype.listitem = function (text) {
          return '<li>' + text + '</li>\n';
        };

        Renderer.prototype.paragraph = function (text) {
          return '<p>' + text + '</p>\n';
        };

        Renderer.prototype.table = function (header, body) {
          return '<table>\n' + '<thead>\n' + header + '</thead>\n' + '<tbody>\n' + body + '</tbody>\n' + '</table>\n';
        };

        Renderer.prototype.tablerow = function (content) {
          return '<tr>\n' + content + '</tr>\n';
        };

        Renderer.prototype.tablecell = function (content, flags) {
          var type = flags.header ? 'th' : 'td';
          var tag = flags.align ? '<' + type + ' style="text-align:' + flags.align + '">' : '<' + type + '>';
          return tag + content + '</' + type + '>\n';
        };

        // span level renderer
        Renderer.prototype.strong = function (text) {
          return '<strong>' + text + '</strong>';
        };

        Renderer.prototype.em = function (text) {
          return '<em>' + text + '</em>';
        };

        Renderer.prototype.codespan = function (text) {
          return '<code>' + text + '</code>';
        };

        Renderer.prototype.br = function () {
          return this.options.xhtml ? '<br/>' : '<br>';
        };

        Renderer.prototype.del = function (text) {
          return '<del>' + text + '</del>';
        };

        Renderer.prototype.link = function (href, title, text) {
          if (this.options.sanitize) {
            try {
              var prot = decodeURIComponent(unescape(href)).replace(/[^\w:]/g, '').toLowerCase();
            } catch (e) {
              return '';
            }
            if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
              return '';
            }
          }
          var out = '<a href="' + href + '"';
          if (title) {
            out += ' title="' + title + '"';
          }
          out += '>' + text + '</a>';
          return out;
        };

        Renderer.prototype.image = function (href, title, text) {
          var out = '<img src="' + href + '" alt="' + text + '"';
          if (title) {
            out += ' title="' + title + '"';
          }
          out += this.options.xhtml ? '/>' : '>';
          return out;
        };

        Renderer.prototype.text = function (text) {
          return text;
        };

        /**
         * Parsing & Compiling
         */

        function Parser(options) {
          this.tokens = [];
          this.token = null;
          this.options = options || marked.defaults;
          this.options.renderer = this.options.renderer || new Renderer();
          this.renderer = this.options.renderer;
          this.renderer.options = this.options;
        }

        /**
         * Static Parse Method
         */

        Parser.parse = function (src, options, renderer) {
          var parser = new Parser(options, renderer);
          return parser.parse(src);
        };

        /**
         * Parse Loop
         */

        Parser.prototype.parse = function (src) {
          this.inline = new InlineLexer(src.links, this.options, this.renderer);
          this.tokens = src.reverse();

          var out = '';
          while (this.next()) {
            out += this.tok();
          }

          return out;
        };

        /**
         * Next Token
         */

        Parser.prototype.next = function () {
          return this.token = this.tokens.pop();
        };

        /**
         * Preview Next Token
         */

        Parser.prototype.peek = function () {
          return this.tokens[this.tokens.length - 1] || 0;
        };

        /**
         * Parse Text Tokens
         */

        Parser.prototype.parseText = function () {
          var body = this.token.text;

          while (this.peek().type === 'text') {
            body += '\n' + this.next().text;
          }

          return this.inline.output(body);
        };

        /**
         * Parse Current Token
         */

        Parser.prototype.tok = function () {
          switch (this.token.type) {
            case 'space':
              {
                return '';
              }
            case 'hr':
              {
                return this.renderer.hr();
              }
            case 'heading':
              {
                return this.renderer.heading(this.inline.output(this.token.text), this.token.depth, this.token.text);
              }
            case 'code':
              {
                return this.renderer.code(this.token.text, this.token.lang, this.token.escaped);
              }
            case 'table':
              {
                var header = '',
                    body = '',
                    i,
                    row,
                    cell,
                    flags,
                    j;

                // header
                cell = '';
                for (i = 0; i < this.token.header.length; i++) {
                  flags = { header: true, align: this.token.align[i] };
                  cell += this.renderer.tablecell(this.inline.output(this.token.header[i]), { header: true, align: this.token.align[i] });
                }
                header += this.renderer.tablerow(cell);

                for (i = 0; i < this.token.cells.length; i++) {
                  row = this.token.cells[i];

                  cell = '';
                  for (j = 0; j < row.length; j++) {
                    cell += this.renderer.tablecell(this.inline.output(row[j]), { header: false, align: this.token.align[j] });
                  }

                  body += this.renderer.tablerow(cell);
                }
                return this.renderer.table(header, body);
              }
            case 'blockquote_start':
              {
                var body = '';

                while (this.next().type !== 'blockquote_end') {
                  body += this.tok();
                }

                return this.renderer.blockquote(body);
              }
            case 'list_start':
              {
                var body = '',
                    ordered = this.token.ordered;

                while (this.next().type !== 'list_end') {
                  body += this.tok();
                }

                return this.renderer.list(body, ordered);
              }
            case 'list_item_start':
              {
                var body = '';

                while (this.next().type !== 'list_item_end') {
                  body += this.token.type === 'text' ? this.parseText() : this.tok();
                }

                return this.renderer.listitem(body);
              }
            case 'loose_item_start':
              {
                var body = '';

                while (this.next().type !== 'list_item_end') {
                  body += this.tok();
                }

                return this.renderer.listitem(body);
              }
            case 'html':
              {
                var html = !this.token.pre && !this.options.pedantic ? this.inline.output(this.token.text) : this.token.text;
                return this.renderer.html(html);
              }
            case 'paragraph':
              {
                return this.renderer.paragraph(this.inline.output(this.token.text));
              }
            case 'text':
              {
                return this.renderer.paragraph(this.parseText());
              }
          }
        };

        /**
         * Helpers
         */

        function escape(html, encode) {
          return html.replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        }

        function unescape(html) {
          return html.replace(/&([#\w]+);/g, function (_, n) {
            n = n.toLowerCase();
            if (n === 'colon') return ':';
            if (n.charAt(0) === '#') {
              return n.charAt(1) === 'x' ? String.fromCharCode(parseInt(n.substring(2), 16)) : String.fromCharCode(+n.substring(1));
            }
            return '';
          });
        }

        function replace(regex, opt) {
          regex = regex.source;
          opt = opt || '';
          return function self(name, val) {
            if (!name) return new RegExp(regex, opt);
            val = val.source || val;
            val = val.replace(/(^|[^\[])\^/g, '$1');
            regex = regex.replace(name, val);
            return self;
          };
        }

        function noop() {}
        noop.exec = noop;

        function merge(obj) {
          var i = 1,
              target,
              key;

          for (; i < arguments.length; i++) {
            target = arguments[i];
            for (key in target) {
              if (Object.prototype.hasOwnProperty.call(target, key)) {
                obj[key] = target[key];
              }
            }
          }

          return obj;
        }

        /**
         * Marked
         */

        function marked(src, opt, callback) {
          if (callback || typeof opt === 'function') {
            if (!callback) {
              callback = opt;
              opt = null;
            }

            opt = merge({}, marked.defaults, opt || {});

            var highlight = opt.highlight,
                tokens,
                pending,
                i = 0;

            try {
              tokens = Lexer.lex(src, opt);
            } catch (e) {
              return callback(e);
            }

            pending = tokens.length;

            var done = function done(err) {
              if (err) {
                opt.highlight = highlight;
                return callback(err);
              }

              var out;

              try {
                out = Parser.parse(tokens, opt);
              } catch (e) {
                err = e;
              }

              opt.highlight = highlight;

              return err ? callback(err) : callback(null, out);
            };

            if (!highlight || highlight.length < 3) {
              return done();
            }

            delete opt.highlight;

            if (!pending) return done();

            for (; i < tokens.length; i++) {
              (function (token) {
                if (token.type !== 'code') {
                  return --pending || done();
                }
                return highlight(token.text, token.lang, function (err, code) {
                  if (err) return done(err);
                  if (code == null || code === token.text) {
                    return --pending || done();
                  }
                  token.text = code;
                  token.escaped = true;
                  --pending || done();
                });
              })(tokens[i]);
            }

            return;
          }
          try {
            if (opt) opt = merge({}, marked.defaults, opt);
            return Parser.parse(Lexer.lex(src, opt), opt);
          } catch (e) {
            e.message += '\nPlease report this to https://github.com/chjj/marked.';
            if ((opt || marked.defaults).silent) {
              return '<p>An error occured:</p><pre>' + escape(e.message + '', true) + '</pre>';
            }
            throw e;
          }
        }

        /**
         * Options
         */

        marked.options = marked.setOptions = function (opt) {
          merge(marked.defaults, opt);
          return marked;
        };

        marked.defaults = {
          gfm: true,
          tables: true,
          breaks: false,
          pedantic: false,
          sanitize: false,
          sanitizer: null,
          mangle: true,
          smartLists: false,
          silent: false,
          highlight: null,
          langPrefix: 'lang-',
          smartypants: false,
          headerPrefix: '',
          renderer: new Renderer(),
          xhtml: false
        };

        /**
         * Expose
         */

        marked.Parser = Parser;
        marked.parser = Parser.parse;

        marked.Renderer = Renderer;

        marked.Lexer = Lexer;
        marked.lexer = Lexer.lex;

        marked.InlineLexer = InlineLexer;
        marked.inlineLexer = InlineLexer.output;

        marked.parse = marked;

        if (typeof module !== 'undefined' && (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
          module.exports = marked;
        } else if (typeof define === 'function' && define.amd) {
          define(function () {
            return marked;
          });
        } else {
          this.marked = marked;
        }
      }).call(function () {
        return this || (typeof window !== 'undefined' ? window : global);
      }());
    }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
  }, {}], 5: [function (require, module, exports) {
    /*
     * to-markdown - an HTML to Markdown converter
     *
     * Copyright 2011-15, Dom Christie
     * Licenced under the MIT licence
     *
     */

    'use strict';

    var toMarkdown;
    var converters;
    var mdConverters = require('./lib/md-converters');
    var gfmConverters = require('./lib/gfm-converters');
    var collapse = require('collapse-whitespace');

    /*
     * Set up window and document for Node.js
     */

    var _window = typeof window !== 'undefined' ? window : this,
        _document;
    if (typeof document === 'undefined') {
      _document = require('jsdom').jsdom();
    } else {
      _document = document;
    }

    /*
     * Utilities
     */

    function trim(string) {
      return string.replace(/^[ \r\n\t]+|[ \r\n\t]+$/g, '');
    }

    var blocks = ['address', 'article', 'aside', 'audio', 'blockquote', 'body', 'canvas', 'center', 'dd', 'dir', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'html', 'isindex', 'li', 'main', 'menu', 'nav', 'noframes', 'noscript', 'ol', 'output', 'p', 'pre', 'section', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul'];

    function isBlock(node) {
      return blocks.indexOf(node.nodeName.toLowerCase()) !== -1;
    }

    var voids = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

    function isVoid(node) {
      return voids.indexOf(node.nodeName.toLowerCase()) !== -1;
    }

    /*
     * Parsing HTML strings
     */

    function canParseHtml() {
      var Parser = _window.DOMParser,
          canParse = false;

      // Adapted from https://gist.github.com/1129031
      // Firefox/Opera/IE throw errors on unsupported types
      try {
        // WebKit returns null on unsupported types
        if (new Parser().parseFromString('', 'text/html')) {
          canParse = true;
        }
      } catch (e) {}
      return canParse;
    }

    function createHtmlParser() {
      var Parser = function Parser() {};

      Parser.prototype.parseFromString = function (string) {
        var newDoc = _document.implementation.createHTMLDocument('');

        if (string.toLowerCase().indexOf('<!doctype') > -1) {
          newDoc.documentElement.innerHTML = string;
        } else {
          newDoc.body.innerHTML = string;
        }
        return newDoc;
      };
      return Parser;
    }

    var HtmlParser = canParseHtml() ? _window.DOMParser : createHtmlParser();

    function htmlToDom(string) {
      var tree = new HtmlParser().parseFromString(string, 'text/html');
      collapse(tree, isBlock);
      return tree;
    }

    /*
     * Flattens DOM tree into single array
     */

    function bfsOrder(node) {
      var inqueue = [node],
          outqueue = [],
          elem,
          children,
          i;

      while (inqueue.length > 0) {
        elem = inqueue.shift();
        outqueue.push(elem);
        children = elem.childNodes;
        for (i = 0; i < children.length; i++) {
          if (children[i].nodeType === 1) {
            inqueue.push(children[i]);
          }
        }
      }
      outqueue.shift();
      return outqueue;
    }

    /*
     * Contructs a Markdown string of replacement text for a given node
     */

    function getContent(node) {
      var text = '';
      for (var i = 0; i < node.childNodes.length; i++) {
        if (node.childNodes[i].nodeType === 1) {
          text += node.childNodes[i]._replacement;
        } else if (node.childNodes[i].nodeType === 3) {
          text += node.childNodes[i].data;
        } else {
          continue;
        }
      }
      return text;
    }

    /*
     * Returns the HTML string of an element with its contents converted
     */

    function outer(node, content) {
      return node.cloneNode(false).outerHTML.replace('><', '>' + content + '<');
    }

    function canConvert(node, filter) {
      if (typeof filter === 'string') {
        return filter === node.nodeName.toLowerCase();
      }
      if (Array.isArray(filter)) {
        return filter.indexOf(node.nodeName.toLowerCase()) !== -1;
      } else if (typeof filter === 'function') {
        return filter.call(toMarkdown, node);
      } else {
        throw new TypeError('`filter` needs to be a string, array, or function');
      }
    }

    function isFlankedByWhitespace(side, node) {
      var sibling, regExp, isFlanked;

      if (side === 'left') {
        sibling = node.previousSibling;
        regExp = / $/;
      } else {
        sibling = node.nextSibling;
        regExp = /^ /;
      }

      if (sibling) {
        if (sibling.nodeType === 3) {
          isFlanked = regExp.test(sibling.nodeValue);
        } else if (sibling.nodeType === 1 && !isBlock(sibling)) {
          isFlanked = regExp.test(sibling.textContent);
        }
      }
      return isFlanked;
    }

    function flankingWhitespace(node) {
      var leading = '',
          trailing = '';

      if (!isBlock(node)) {
        var hasLeading = /^[ \r\n\t]/.test(node.innerHTML),
            hasTrailing = /[ \r\n\t]$/.test(node.innerHTML);

        if (hasLeading && !isFlankedByWhitespace('left', node)) {
          leading = ' ';
        }
        if (hasTrailing && !isFlankedByWhitespace('right', node)) {
          trailing = ' ';
        }
      }

      return { leading: leading, trailing: trailing };
    }

    /*
     * Finds a Markdown converter, gets the replacement, and sets it on
     * `_replacement`
     */

    function process(node) {
      var replacement,
          content = getContent(node);

      // Remove blank nodes
      if (!isVoid(node) && !/A/.test(node.nodeName) && /^\s*$/i.test(content)) {
        node._replacement = '';
        return;
      }

      for (var i = 0; i < converters.length; i++) {
        var converter = converters[i];

        if (canConvert(node, converter.filter)) {
          if (typeof converter.replacement !== 'function') {
            throw new TypeError('`replacement` needs to be a function that returns a string');
          }

          var whitespace = flankingWhitespace(node);

          if (whitespace.leading || whitespace.trailing) {
            content = trim(content);
          }
          replacement = whitespace.leading + converter.replacement.call(toMarkdown, content, node) + whitespace.trailing;
          break;
        }
      }

      node._replacement = replacement;
    }

    toMarkdown = function toMarkdown(input, options) {
      options = options || {};

      if (typeof input !== 'string') {
        throw new TypeError(input + ' is not a string');
      }

      // Escape potential ol triggers
      input = input.replace(/(\d+)\. /g, '$1\\. ');

      var clone = htmlToDom(input).body,
          nodes = bfsOrder(clone),
          output;

      converters = mdConverters.slice(0);
      if (options.gfm) {
        converters = gfmConverters.concat(converters);
      }

      if (options.converters) {
        converters = options.converters.concat(converters);
      }

      // Process through nodes in reverse (so deepest child elements are first).
      for (var i = nodes.length - 1; i >= 0; i--) {
        process(nodes[i]);
      }
      output = getContent(clone);

      return output.replace(/^[\t\r\n]+|[\t\r\n\s]+$/g, '').replace(/\n\s+\n/g, '\n\n').replace(/\n{3,}/g, '\n\n');
    };

    toMarkdown.isBlock = isBlock;
    toMarkdown.isVoid = isVoid;
    toMarkdown.trim = trim;
    toMarkdown.outer = outer;

    module.exports = toMarkdown;
  }, { "./lib/gfm-converters": 6, "./lib/md-converters": 7, "collapse-whitespace": 3, "jsdom": 2 }], 6: [function (require, module, exports) {
    'use strict';

    function cell(content, node) {
      var index = Array.prototype.indexOf.call(node.parentNode.childNodes, node);
      var prefix = ' ';
      if (index === 0) {
        prefix = '| ';
      }
      return prefix + content + ' |';
    }

    var highlightRegEx = /highlight highlight-(\S+)/;

    module.exports = [{
      filter: 'br',
      replacement: function replacement() {
        return '\n';
      }
    }, {
      filter: ['del', 's', 'strike'],
      replacement: function replacement(content) {
        return '~~' + content + '~~';
      }
    }, {
      filter: function filter(node) {
        return node.type === 'checkbox' && node.parentNode.nodeName === 'LI';
      },
      replacement: function replacement(content, node) {
        return (node.checked ? '[x]' : '[ ]') + ' ';
      }
    }, {
      filter: ['th', 'td'],
      replacement: function replacement(content, node) {
        return cell(content, node);
      }
    }, {
      filter: 'tr',
      replacement: function replacement(content, node) {
        var borderCells = '';
        var alignMap = { left: ':--', right: '--:', center: ':-:' };

        if (node.parentNode.nodeName === 'THEAD') {
          for (var i = 0; i < node.childNodes.length; i++) {
            var align = node.childNodes[i].attributes.align;
            var border = '---';

            if (align) {
              border = alignMap[align.value] || border;
            }

            borderCells += cell(border, node.childNodes[i]);
          }
        }
        return '\n' + content + (borderCells ? '\n' + borderCells : '');
      }
    }, {
      filter: 'table',
      replacement: function replacement(content) {
        return '\n\n' + content + '\n\n';
      }
    }, {
      filter: ['thead', 'tbody', 'tfoot'],
      replacement: function replacement(content) {
        return content;
      }
    },

    // Fenced code blocks
    {
      filter: function filter(node) {
        return node.nodeName === 'PRE' && node.firstChild && node.firstChild.nodeName === 'CODE';
      },
      replacement: function replacement(content, node) {
        return '\n\n```\n' + node.firstChild.textContent + '\n```\n\n';
      }
    },

    // Syntax-highlighted code blocks
    {
      filter: function filter(node) {
        return node.nodeName === 'PRE' && node.parentNode.nodeName === 'DIV' && highlightRegEx.test(node.parentNode.className);
      },
      replacement: function replacement(content, node) {
        var language = node.parentNode.className.match(highlightRegEx)[1];
        return '\n\n```' + language + '\n' + node.textContent + '\n```\n\n';
      }
    }, {
      filter: function filter(node) {
        return node.nodeName === 'DIV' && highlightRegEx.test(node.className);
      },
      replacement: function replacement(content) {
        return '\n\n' + content + '\n\n';
      }
    }];
  }, {}], 7: [function (require, module, exports) {
    'use strict';

    module.exports = [{
      filter: 'p',
      replacement: function replacement(content) {
        return '\n\n' + content + '\n\n';
      }
    }, {
      filter: 'br',
      replacement: function replacement() {
        return '  \n';
      }
    }, {
      filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      replacement: function replacement(content, node) {
        var hLevel = node.nodeName.charAt(1);
        var hPrefix = '';
        for (var i = 0; i < hLevel; i++) {
          hPrefix += '#';
        }
        return '\n\n' + hPrefix + ' ' + content + '\n\n';
      }
    }, {
      filter: 'hr',
      replacement: function replacement() {
        return '\n\n* * *\n\n';
      }
    }, {
      filter: ['em', 'i'],
      replacement: function replacement(content) {
        return '_' + content + '_';
      }
    }, {
      filter: ['strong', 'b'],
      replacement: function replacement(content) {
        return '**' + content + '**';
      }
    },

    // Inline code
    {
      filter: function filter(node) {
        var hasSiblings = node.previousSibling || node.nextSibling;
        var isCodeBlock = node.parentNode.nodeName === 'PRE' && !hasSiblings;

        return node.nodeName === 'CODE' && !isCodeBlock;
      },
      replacement: function replacement(content) {
        return '`' + content + '`';
      }
    }, {
      filter: function filter(node) {
        return node.nodeName === 'A' && node.getAttribute('href');
      },
      replacement: function replacement(content, node) {
        var titlePart = node.title ? ' "' + node.title + '"' : '';
        return '[' + content + '](' + node.getAttribute('href') + titlePart + ')';
      }
    }, {
      filter: 'img',
      replacement: function replacement(content, node) {
        var alt = node.alt || '';
        var src = node.getAttribute('src') || '';
        var title = node.title || '';
        var titlePart = title ? ' "' + title + '"' : '';
        return src ? '![' + alt + ']' + '(' + src + titlePart + ')' : '';
      }
    },

    // Code blocks
    {
      filter: function filter(node) {
        return node.nodeName === 'PRE' && node.firstChild.nodeName === 'CODE';
      },
      replacement: function replacement(content, node) {
        return '\n\n    ' + node.firstChild.textContent.replace(/\n/g, '\n    ') + '\n\n';
      }
    }, {
      filter: 'blockquote',
      replacement: function replacement(content) {
        content = this.trim(content);
        content = content.replace(/\n{3,}/g, '\n\n');
        content = content.replace(/^/gm, '> ');
        return '\n\n' + content + '\n\n';
      }
    }, {
      filter: 'li',
      replacement: function replacement(content, node) {
        content = content.replace(/^\s+/, '').replace(/\n/gm, '\n    ');
        var prefix = '*   ';
        var parent = node.parentNode;
        var index = Array.prototype.indexOf.call(parent.children, node) + 1;

        prefix = /ol/i.test(parent.nodeName) ? index + '.  ' : '*   ';
        return prefix + content;
      }
    }, {
      filter: ['ul', 'ol'],
      replacement: function replacement(content, node) {
        var strings = [];
        for (var i = 0; i < node.childNodes.length; i++) {
          strings.push(node.childNodes[i]._replacement);
        }

        if (/li/i.test(node.parentNode.nodeName)) {
          return '\n' + strings.join('\n');
        }
        return '\n\n' + strings.join('\n') + '\n\n';
      }
    }, {
      filter: function filter(node) {
        return this.isBlock(node);
      },
      replacement: function replacement(content, node) {
        return '\n\n' + this.outer(node, content) + '\n\n';
      }
    },

    // Anything else!
    {
      filter: function filter() {
        return true;
      },
      replacement: function replacement(content, node) {
        return this.outer(node, content);
      }
    }];
  }, {}], 8: [function (require, module, exports) {
    /**
     * This file automatically generated from `pre-publish.js`.
     * Do not manually edit.
     */

    module.exports = {
      "area": true,
      "base": true,
      "br": true,
      "col": true,
      "embed": true,
      "hr": true,
      "img": true,
      "input": true,
      "keygen": true,
      "link": true,
      "menuitem": true,
      "meta": true,
      "param": true,
      "source": true,
      "track": true,
      "wbr": true
    };
  }, {}], 9: [function (require, module, exports) {
    'use strict';

    // Lib

    var markdownToHtml = require('marked');
    var htmlToMarkdown = require('to-markdown');

    /**
     * A rich text editor
     */

    var RichTextEditor = function (_View) {
      _inherits(RichTextEditor, _View);

      function RichTextEditor(params) {
        _classCallCheck(this, RichTextEditor);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RichTextEditor).call(this, params));

        _this.init();
        return _this;
      }

      /**
       * Event: Change input
       */


      _createClass(RichTextEditor, [{
        key: "onChange",
        value: function onChange() {
          this.trigger('change', this.$textarea.val());
        }
      }, {
        key: "render",
        value: function render() {
          var editor = this;

          // Main element
          this.$element = _.div({ class: 'field-editor rich-text-editor panel panel-default' }, [
          // Toolbar
          _.div({ class: 'panel-heading' }, _.div({ class: 'btn-group' }, [_.button({ class: 'btn btn-default', 'data-wrap': 'strong' }, _.span({ class: 'fa fa-bold' })), _.button({ class: 'btn btn-default', 'data-wrap': 'em' }, _.span({ class: 'fa fa-italic' }))])),

          // HTML output
          _.div({ class: 'panel-body' }, this.$output = _.div({ class: 'rte-output', contenteditable: true }).bind('change propertychange keyup paste', function () {
            editor.$textarea.val(htmlToMarkdown(editor.$output.html()));

            editor.onChange();
          })),

          // Markdown editor
          _.div({ class: 'panel-footer' }, this.$textarea = _.textarea({ class: 'form-control', type: 'text' }, this.value).bind('change propertychange keyup paste', function () {
            editor.$output.html(markdownToHtml(editor.$textarea.val()));

            editor.onChange();
          }))]);

          // Initial call to render markdown as HTML
          this.$output.html(markdownToHtml(this.$textarea.val()));
        }
      }]);

      return RichTextEditor;
    }(View);

    resources.editors['20001'] = RichTextEditor;
  }, { "marked": 4, "to-markdown": 5 }] }, {}, [9]);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);throw new Error("Cannot find module '" + o + "'");
            }var f = n[o] = { exports: {} };t[o][0].call(f.exports, function (e) {
                var n = t[o][1][e];return s(n ? n : e);
            }, f, f.exports, e, t, n, r);
        }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
        s(r[o]);
    }return s;
})({ 1: [function (require, module, exports) {
        'use strict';

        var SchemaReferenceEditor = function (_View) {
            _inherits(SchemaReferenceEditor, _View);

            function SchemaReferenceEditor(params) {
                _classCallCheck(this, SchemaReferenceEditor);

                var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SchemaReferenceEditor).call(this, params));

                _this.init();
                return _this;
            }

            /**
             * Event: Change input
             */


            _createClass(SchemaReferenceEditor, [{
                key: "onChange",
                value: function onChange() {
                    this.trigger('change', this.$select.val());
                }
            }, {
                key: "render",
                value: function render() {
                    var editor = this;

                    this.$element = _.div({ class: 'field-editor schema-reference-editor' }, this.$select = _.select({ class: 'form-control' }, _.each(window.resources.schemas, function (id, schema) {
                        if (editor.config) {
                            var id = parseInt(schema.id);

                            if (editor.config.min && id < editor.config.min) {
                                return;
                            }

                            if (editor.config.max && id > editor.config.max) {
                                return;
                            }
                        }

                        return _.option({ value: schema.id }, schema.name);
                    })).change(function () {
                        editor.onChange();
                    }));

                    this.$select.val(editor.value);
                }
            }]);

            return SchemaReferenceEditor;
        }(View);

        resources.editors['20004'] = SchemaReferenceEditor;
    }, {}] }, {}, [1]);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);throw new Error("Cannot find module '" + o + "'");
            }var f = n[o] = { exports: {} };t[o][0].call(f.exports, function (e) {
                var n = t[o][1][e];return s(n ? n : e);
            }, f, f.exports, e, t, n, r);
        }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
        s(r[o]);
    }return s;
})({ 1: [function (require, module, exports) {
        'use strict';

        /**
         * A simple string editor
         */

        var StringEditor = function (_View) {
            _inherits(StringEditor, _View);

            function StringEditor(params) {
                _classCallCheck(this, StringEditor);

                var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(StringEditor).call(this, params));

                _this.init();
                return _this;
            }

            /**
             * Event: Change
             */


            _createClass(StringEditor, [{
                key: "onChange",
                value: function onChange() {
                    this.trigger('change', this.$input.val());
                }
            }, {
                key: "render",
                value: function render() {
                    var editor = this;

                    // Main element
                    this.$element = _.div({ class: 'field-editor string-editor' }, this.$input = _.input({ class: 'form-control', value: this.value }).bind('change propertychange paste keyup', function () {
                        editor.onChange();
                    }));
                }
            }]);

            return StringEditor;
        }(View);

        resources.editors['20000'] = StringEditor;
    }, {}] }, {}, [1]);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);throw new Error("Cannot find module '" + o + "'");
            }var f = n[o] = { exports: {} };t[o][0].call(f.exports, function (e) {
                var n = t[o][1][e];return s(n ? n : e);
            }, f, f.exports, e, t, n, r);
        }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
        s(r[o]);
    }return s;
})({ 1: [function (require, module, exports) {
        'use strict';

        var UrlEditor = function (_View) {
            _inherits(UrlEditor, _View);

            function UrlEditor(params) {
                _classCallCheck(this, UrlEditor);

                var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(UrlEditor).call(this, params));

                _this.init();
                return _this;
            }

            _createClass(UrlEditor, [{
                key: "regenerate",
                value: function regenerate() {
                    this.$input.val('/new-url/');

                    this.trigger('change', this.$input.val());
                }
            }, {
                key: "onChange",
                value: function onChange() {
                    this.trigger('change', this.$input.val());
                }
            }, {
                key: "render",
                value: function render() {
                    var editor = this;

                    this.$element = _.div({ class: 'field-editor url-editor input-group' }, [this.$input = _.input({ class: 'form-control', value: this.value }).bind('change propertychange paste keyup', function () {
                        this.onChange();
                    }), _.div({ class: 'input-group-btn' }, _.button({ class: 'btn btn-primary' }, 'Regenerate ').click(function () {
                        editor.regenerate();
                    }))]);
                }
            }]);

            return UrlEditor;
        }(View);

        resources.editors['20003'] = UrlEditor;
    }, {}] }, {}, [1]);