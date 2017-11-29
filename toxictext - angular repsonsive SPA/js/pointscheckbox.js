'use strict';

/**
 * @ngdoc directive
 * @name toxApp.directive:toxPointsCheckbox
 * @description
 * # toxPointsCheckbox
 */
angular.module('toxApp')
  .directive('toxPointsCheckbox', function (pointsServ, sectionsServ) {
    return {
      templateUrl: 'templates/directives/pointscheckbox.html',
      restrict: 'E',
      replace: true,
      scope: {
        product: '=',
        ingredient: '=',
        points: '='
      },
      link: function postLink(scope, element) {
        function togglePoints(check, defaultIngredient) {
          var isChecked = typeof check === 'boolean' ? check : element.is(':checked'),
              points = scope.points > 0 ? scope.points : 10,
              isDefault = 'boolean' === typeof defaultIngredient && defaultIngredient;

          points = isChecked ? points : points * -1;

          pointsServ(points);

          updateSections(isDefault ? true : isChecked, isDefault);
        }

        function updateSections(activate, defaultIngredient) {
          sectionsServ.updateSection(scope.product.label, scope.ingredient.label, activate, defaultIngredient);
        }

        element.bind('click', function(e){
          togglePoints(e.target.checked);
        });

        if (scope.ingredient.isPresent && scope.product.defaultPointsRemaining) {
          togglePoints(true, true);
        }
      }
    };
  });
