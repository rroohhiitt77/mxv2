(function ()
{
    'use strict';

    angular
        .module('app.doctor')
        .controller('DoctorProfileEditController', DoctorProfileEditController);

    /** @ngInject */
    function DoctorProfileEditController(Auth, doctorService, logger, ClinicService, $q) {
      var vm = this;

      // Data


      vm.helloText = Auth.GetLoggedInStatus();
      vm.states = {
        "AP": "Andhra Pradesh",
        "AR": "Arunachal Pradesh",
        "AS": "Assam",
        "BR": "Bihar",
        "CG": "Chhattisgarh",
        "Chandigarh": "Chandigarh",
        "DN": "Dadra and Nagar Haveli",
        "DD": "Daman and Diu",
        "DL": "Delhi",
        "GA": "Goa",
        "GJ": "Gujarat",
        "HR": "Haryana",
        "HP": "Himachal Pradesh",
        "JK": "Jammu and Kashmir",
        "JH": "Jharkhand",
        "KA": "Karnataka",
        "KL": "Kerala",
        "MP": "Madhya Pradesh",
        "MH": "Maharashtra",
        "MN": "Manipur",
        "ML": "Meghalaya",
        "MZ": "Mizoram",
        "NL": "Nagaland",
        "OR": "Orissa",
        "PB": "Punjab",
        "PY": "Pondicherry",
        "RJ": "Rajasthan",
        "SK": "Sikkim",
        "TN": "Tamil Nadu",
        "TR": "Tripura",
        "UP": "Uttar Pradesh",
        "UK": "Uttarakhand",
        "WB": "West Bengal"
      }

      vm.profileImage = {
        "title": "Rate this album",
        "subtitle": "Alice Cooper",
        "text": "Poison",
        "media": {
          "image": {
            "src": "assets/images/avatars/katherine.jpg",
            "alt": "Alice Cooper - Poison"
          }
        }
      }

      InitClinicAutoComplete();

      // Methods
      vm.addFile = function () {
        alert('aaaaaa');
      }

      doctorService.GetProfile()
        .then(function (data) {
          vm.profileForm = data;
          vm.profileForm.clinics = vm.profileForm.clinics || [];
          vm.profileForm.phone1 = vm.profileForm.phone1 || [];
          vm.profileForm.services = vm.profileForm.services || [];
          vm.profileForm.specializations = vm.profileForm.specializations || [];
          vm.profileForm.registrations = vm.profileForm.registrations || [];
          vm.associatedClinics = [];
          if (vm.profileForm.educations.length === 0)  vm.AddEducation();
          if (vm.profileForm.memberships.length === 0)  vm.AddMembership();
          if (vm.profileForm.hospitalExperiences.length === 0)  vm.AddHospitalExperience();
          if (vm.profileForm.clinics.length === 0) {
            vm.AddAssociatedClinics();
          }
          else {
            PrePopulateClincsAutoComplete(vm.associatedClinics, vm.profileForm.clinics);
          }

          logger.debug('Doctor Profile success', vm.profileForm, 'DoctorProfile');

        })
        .catch(function (data) {
          logger.error(data.status);
        });

      vm.SubmitProfileForm = function () {
        PopulateClinics(vm.profileForm, vm.associatedClinics);
        doctorService.SaveProfile(vm.profileForm)
          .then(function (data) {
            logger.success('Profile successfully saved', data, 'DoctorProfile');
          })
          .catch(function (data) {
            logger.error('Error saving profile', data, 'DoctorProfile');
          });
      }

      vm.AddEducation = function (event) {
        vm.profileForm.educations.push({id: vm.profileForm.educations.length + 1});
      }

      vm.RemoveEducation = function (index) {
        vm.profileForm.educations.splice(index, 1);
      }

      vm.AddMembership = function (event) {
        vm.profileForm.memberships.push({id: vm.profileForm.memberships.length + 1});
      }

      vm.RemoveMembership = function (index) {
        vm.profileForm.memberships.splice(index, 1);
      }

      vm.AddHospitalExperience = function (event) {
        vm.profileForm.hospitalExperiences.push({id: vm.profileForm.hospitalExperiences.length + 1});
      }

      vm.RemoveHospitalExperience = function (index) {
        vm.profileForm.hospitalExperiences.splice(index, 1);
      }

      vm.AddAssociatedClinics = function (event) {
        vm.associatedClinics.push({id: vm.associatedClinics.length + 1});
      }

      vm.RemoveAssociatedClinics = function (index) {
        vm.associatedClinics.splice(index, 1);
      }


      // ******************************
      // Clinic auto complete start
      // ******************************
      function InitClinicAutoComplete() {

        var deferred = $q.defer();

        vm.selectedItem = null;
        vm.searchText = null;
        vm.querySearch = querySearch;

        ClinicService.GetForAutoComplete(null)
          .then(function (data) {
            vm.clinics = data;
            console.log(vm.clinics);
            deferred.resolve();
          })
          .catch(function (data) {
            logger.error('Error loading clinics', data, loggingTitle);
            deferred.reject(data);
          });

        // return promise object
        return deferred.promise;


      }



      function querySearch(query) {
        var results = query ? vm.clinics.filter(createFilterFor(query)) : vm.clinics;
        return results;

      }

      /**
       * Create filter function for a query string
       */
      function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(state) {
          return (state.searchField.indexOf(lowercaseQuery) > -1);
        };
      }

      // ******************************
      // Clinic auto complete End
      // ******************************

      function PopulateClinics(form, clinics) {
        form.clinics = [];
        for (var i = 0; i < clinics.length; i++) {
          if(clinics[i].selectedItem) {
            form.clinics.push(
              {
                id: clinics[i].selectedItem.value,
                fees: clinics[i].fees
              }
            )
          }
        }
      }

      function PrePopulateClincsAutoComplete(associatedClinics, formClinics) {
        if(!vm.clinics) {
          InitClinicAutoComplete().then(function(){
            for (var i = 0; i < formClinics.length; i++) {
              var selectedItem = GetSelectedItem(formClinics[i].id, vm.clinics);
              associatedClinics.push(
                {
                  selectedItem: selectedItem,
                  fees: formClinics[i].fees
                }
              )
            }
          })
        }
        else{
          for (var i = 0; i < formClinics.length; i++) {
            var selectedItem = GetSelectedItem(formClinics[i].id, vm.clinics);
            associatedClinics.push(
              {
                selectedItem: selectedItem,
                fees: formClinics[i].fees
              }
            )
          }
        }
      }

      function GetSelectedItem(id, clinics) {
        for(var i =0; i<clinics.length; i++){
          if(clinics[i].value==id) {
            return clinics[i];
          }
        }

        return null;

      }
    }

})();
