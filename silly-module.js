/*
An implementation of the CommonJS Module Specification

http://wiki.commonjs.org/wiki/Modules/1.1

... with the following changes to facilitate implementation in the browser:

- No script loading is implemented; you must load all modules yourself in
whatever order might be required.

- You must bind the "exports" variable yourself at the top of every module
by assigning it the return value of module.exports("<yourModuleName>")


Since in the browser modules use the global namespace instead of their own, I
recommend creating a scope for each module (see examples).


Examples:

math.js
-------
(function (exports)
{
	exports.add = function() {
	  var sum = arguments[0];
	  for (var i=1; i<arguments.length; i++) {
		sum += arguments[i];
	  }
	  return sum;
	};
}(module.exports('math'));

increment.js
------------
(function (exports)
{
	var add = require('math').add;
	exports.increment = function(val) {
	  return add(val, 1);
	};
}(module.exports('increment'));

program.js
----------
var inc = require('increment').increment;
var a = 1;
inc(a); // 2


Less noteworthy departures from the spec:

- "require" does not have a "main" property.
- Dependency cycles not allowed.
- "module.id" is writeable/deleteable.

*/

(function (global)
{
	if (undefined !== global.module) {
		throw new Error("\"module\" is already defined. To force " +
			"overwriting, call \"delete this.module;\" where " +
			"\"this\" is the global object.");
	}

	if (undefined !== global.require) {
		throw new Error("\"require\" is already defined. To force " +
			"overwriting, call \"delete this.require;\" where " +
			"\"this\" is the global object.");
	}

	var modules = {};

	global.require = function (moduleName)
	{
		if (undefined === modules[moduleName]) {
			throw new Error("Unknown module \"" + moduleName + "\"");
		}
		return modules[moduleName];
	};

	global.module = {
		id: "",

		exports: function (moduleName)
		{
			if (undefined === modules[moduleName]) {
				this.id = moduleName;
				modules[moduleName] = {};
			}
			return modules[moduleName];
		}
	};

}(this));
