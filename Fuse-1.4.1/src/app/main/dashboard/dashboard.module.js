(function ()
{
    'use strict';

    angular
        .module('app.dashboard', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            //.state('app.dashboard', {
            //    url    : '/doctorDashboard',
            //    access: {restricted: true},
            //    views  : {
            //        'content@app': {
            //            templateUrl: 'app/main/dashboard/dashboard.html',
            //            controller : 'DashboardController as vm'
            //        }
            //    }
            //});
      .state('app.dashboard', {

        url: '/doctorDashboard',
        access: {restricted: true},
        views  : {
          'content@app': {
            templateUrl: 'app/main/dashboard/dashboard.html',
            controller : 'DashboardController as vm'
          }
        }
      })
      .state('app.dashboard.bookWalkin', {
        url: '/bookWalkin',
        access: {restricted: true},
        data: {
          'selectedTab': 0
        },
        views: {
          'bookWalkin': {
            templateUrl: 'app/main/appointment/walkin/walkin.html',
            controller: 'WalkinController as vm'
          }
        }
      })
      .state('app.dashboard.bookAppointment', {
        url: '/bookAppointment',
        access: {restricted: true},
        data: {
          'selectedTab': 1
        },
        views: {
          'bookAppointment': {
            templateUrl: 'app/main/appointment/book/book.html',
            controller: 'BookController as vm'
          }
        }
      })
      .state('app.dashboard.prescription', {
        url: '/prescription',
        access: {restricted: true},
        data: {
          'selectedTab': 2
        },
            views: {
              'prescription': {
                templateUrl: 'app/main/case/case.html',
                controller: 'CaseController as vm'
              }
            }
      })
      .state('app.dashboard.manageAppointment', {
        url: '/manageAppointment',
        access: {restricted: true},
        data: {
          'selectedTab': 3
        },
        views: {
          'manageAppointment': {
            templateUrl: 'app/main/appointment/manage/manage.html',
            controller: 'ManageController as vm'
          }
        }
      })

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/dashboard');


        // Navigation
        msNavigationServiceProvider.saveItem('fuse', {
            title : 'dashboard',
            group : true,
            weight: 1
        });

        msNavigationServiceProvider.saveItem('fuse.dashboard', {
            title    : 'dashboard',
            icon     : 'icon-tile-four',
            state    : 'app.dashboard',
            /*stateParams: {
                'param1': 'page'
             },*/
            translate: 'DASHBOARD.DASHBOARD_NAV',
            weight   : 1
        });
    }
})();
