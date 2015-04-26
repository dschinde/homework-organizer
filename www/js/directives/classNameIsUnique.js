'use strict';

angular.module('hwo').directive('hwoClassNameIsUnique', ClassNameIsUnique);

function ClassNameIsUnique($q, Class) {
	return {
		require: 'ngModel',
		link: function link($scope, $element, $attr, ngModel) {
			ngModel.$asyncValidators.duplicateClassName = validate;
		}
	};

	function validate(name) {
		return $q(function (resolve, reject) {
			Class.get().then(function (classes) {
				var length = classes.length;
				for(var i = 0; i < length; i++) {
					if (name === classes[i].name) {
						reject();
					}
				}
				resolve();
			});
		});
	}
}