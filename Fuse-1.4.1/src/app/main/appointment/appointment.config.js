(function ()
{
    'use strict';

    angular
        .module('app.appointment')
        .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider) {
    // State
    $stateProvider
      .state('app.appointmentSchedule', {
        url: '/appointmentSchedule',
        access: {restricted: true},
        views: {
          'content@app': {
            templateUrl: 'app/main/appointment/schedule/schedule.html',
            controller: 'ScheduleController as vm'
          }
        },
      })
      .state('app.appointmentManage', {
        url: '/appointmentManage',
        access: {restricted: true},
        views: {
          'content@app': {
            templateUrl: 'app/main/appointment/manage/manage.html',
            controller: 'ManageController as vm'
          }
        },
      })
      .state('app.appointmentQ', {
        url: '/appointmentQ',
        access: {restricted: true},
        views: {
          'content@app': {
            templateUrl: 'app/main/appointment/q/q.html',
            controller: 'QController as vm'
          }
        },
      })
      .state('app.appointmentWalkin', {
        url: '/appointmentWalkin',
        access: {restricted: true},
        views: {
          'content@app': {
            templateUrl: 'app/main/appointment/walkin/walkin.html',
            controller: 'WalkinController as vm'
          }
        },
      })
      .state('app.appointmentBook', {
          url: '/appointmentBook',
          access: {restricted: true},
          views: {
            'content@app': {
              templateUrl: 'app/main/appointment/book/book.html',
              controller: 'BookController as vm'
            }
          },
        });

    // Translation
    //$translatePartialLoaderProvider.addPart('app/main/doctor/doctorProfile');

    // Navigation
    msNavigationServiceProvider.saveItem('Appointment.Schedule', {
      title: 'Create Schedule',
      state: 'app.appointmentSchedule',
      weight: 1
    });

    // Navigation
    msNavigationServiceProvider.saveItem('Appointment.Walkin', {
      title: 'Book Walkin',
      state: 'app.appointmentWalkin',
      weight: 1
    });

    // Navigation
    msNavigationServiceProvider.saveItem('Appointment.Book', {
      title: 'Book Appointment',
      state: 'app.appointmentBook',
      weight: 1
    });

    // Navigation
    msNavigationServiceProvider.saveItem('Appointment.Manage', {
      title: 'Manage Appointment',
      state: 'app.appointmentManage',
      weight: 1
    });

    // Navigation
    msNavigationServiceProvider.saveItem('Appointment.Q', {
      title: 'Queue',
      state: 'app.appointmentQ',
      weight: 1
    });
  }
})();
