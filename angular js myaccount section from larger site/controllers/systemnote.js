'use strict';

app.controller('SystemNotes', ['$rootScope', '$scope', '$http', '$filter', '$state', 'NoteHandler', function ($rootScope, $scope, $http, $filter, $state, NoteHandler) {
	console.log( "SystemNotes Controller");
	var token = $rootScope.member.token;
	//$scope.accountsummary = {};

	$scope.data = {
		messages: [],
		servertime: 0,
		unseen: function(){
			var t = 0;
			angular.forEach($scope.data.messages, function(note){
				t += parseInt(note.seen) ? 0 : 1;
			});
			return t;
		}
	};

	$scope.colors = ['warning', 'success'];

	$scope.timeDifference = function(data){
		if (isNaN(data.timestamp)) return data.created_on;

		var tmp = $scope.data.servertime - data.timestamp;
		if (tmp <= 60 ) {
			return 'A minute ago';
		} else if (tmp <= 3600) {
			return $filter('number')(tmp / (60), 0) + ' minutes ago';
		} else if (tmp <= 86400) {
			var t = $filter('number')(tmp / (60 * 60), 0);
			return t + (t == 1 ? ' hour' : ' hours') + ' ago';
		} else if (tmp <= 2592000) {
			var t = $filter('number')(tmp / (24 * 60 * 60), 0);
			return t + (t == 1 ? ' day' : ' days') + ' ago';
		} else {
			return data.created_on;
		}
	};

	$scope.readMessage = function(key, id) {
		$http.post('/api/notes/noteread', {id: id, token:token})
		.then(function (response) {
			if (response.data.status) {
				if ($scope.data.messages[key].id != id) {
					angular.forEach($scope.data.messages, function(value, mkey){
						if (value.id == id) key = mkey;
					});
				}
				$scope.data.messages[key].seen = 1;
			}
		});
	};

	$scope.selectNote = function(note){
		angular.forEach($scope.data.messages, function(note) {
		  note.selected = false;
		});
		$scope.note = note;
		$scope.note.selected = true;
		if (parseInt($scope.note.seen) != 1) {
			$scope.readMessage(0, $scope.note.id);
		}
	};

    $scope.getNotes = function () {
        NoteHandler.usernote({id:$rootScope.member.MemberId}, function (response) {
            if (response) {
                $scope.data.messages = response.data.response.notes;
                $scope.data.servertime = response.data.response.now;
            }
        });
    };
    $scope.getNotes();

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $scope.getNotes();
    });


 }]);