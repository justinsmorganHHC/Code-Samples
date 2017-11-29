angular.module('app')
.factory(
    'Helpers',['$rootScope', function ($rootScope) {
        return {
            getMemberRole: function (member) {
                /** determinate user role */
                var role = 'Unknown';
                if (member.Type === 'X') {
                    role = 'Administrators';
                }
                if (member.Type === 'D')
                    role = 'Distributors';
                if (member.Type === 'D' && member.SubType === '') {
                    role = 'ProReps';
                }
                if (member.Type === 'D' && member.SubType === 'M') {
                    role = 'Members'
                }
                switch (member.Type) {
                    case 'I':
                        role = 'Individuals';
                        break;
                    case 'P':
                        role = 'Prospects';
                        break;
                }
                return role;
            },
            isMember: function (member) {
                return member.SubType === 'M';
            },
            isProRep: function (member) {
               return member.SubType === '';
            }
        }
    }]
);
