(function () {
  'use strict';

  angular
    .module('app.file')
    .factory('File', File);

  /** @ngInject */
  function File($q, logger, $http, cfg, $location, LocalStorage) {
    var service = {
      Upload: Upload,
      Download: Download

    };
    return service;



  function Upload(file, fileData) {

    if (file.$valid && file) {
      //$scope.upload($scope.file);
      console.log(file);

      //filepath on S3 - process.env.ENVIRONMENT+ '_'+ req.query["source"] + '/'+ req.query["mxID"] +'/'
       // + req.query["directory"] + '/' +  req.query["fileName"];
      //get the signed url and url from server
      var fileData =
      {
        'fileName': file.name,
        'mxID': fileData.mxID(),
        'directory': fileData.directory,
        'source': fileData.source
      }
      console.log($scope.buildUrl(fileData));
      $http.post('/api/UploadedPatientReport/getSignedURL', fileData)
        .success(function (data) {
          console.log(data);

          var d_completed = $q.defer(); // since I'm working with Angular, I use $q for asynchronous control flow, but it's not mandatory
          xhr = new XMLHttpRequest();
          xhr.file = file; // not necessary if you create scopes like this

          //xhr.upload.addEventListener("progress", updateProgress, false);
          //xhr.addEventListener("abort", uploadCanceled, false);
          xhr.onreadystatechange = function (e) {
            console.log('this.readyState' + this.readyState);
            //Holds the status of the XMLHttpRequest. Changes from 0 to 4:
            //0: request not initialized
            //1: server connection established
            //2: request received
            //3: processing request
            //4: request finished and response is ready
            if (4 == xhr.readyState) {
              if (xhr.status === 200) {
                // done uploading! HURRAY!
                alert('Done uploading! HURRAY!');
                console.log(xhr.responseText);
              } else {
                alert('Error');
                console.log("Error", xhr.statusText);
              }
              d_completed.resolve(true);
            }
            if (2 == this.readyState) {
              // done uploading! HURRAY!
              console.log('done uploading! HURRAY!');
              //d_completed.resolve(true);
            }
          };
          xhr.open('PUT', data.signedUrl, true);
          xhr.setRequestHeader("Content-Type", "application/octet-stream");
          xhr.send(file);

        })
        .error(function (data) {
          console.log('Error: ' + data);

        });

    }
  }


  // progress on transfers from the client to server (uploads)
  //function updateProgress(oEvent) {
  //  //console.log('aaaaaaaaaaaaaaa');
  //  if (oEvent.lengthComputable) {
  //    var percentComplete = (oEvent.loaded / oEvent.total) * 100;
  //    var math = $window.Math;
  //    var currentPercent = math.min(math.round(percentComplete), $scope.max);
  //    $timeout(function () {
  //      $scope.current = currentPercent;
  //    });
  //
  //    //console.log('percentComplete:' + currentPercent + 'oEvent.total:' + oEvent.total);
  //
  //  } else {
  //    // Unable to compute progress information since the total size is unknown
  //    console.log('Unable to compute progress information since the total size is unknown');
  //  }
  //};
  //
  //function uploadCanceled(evt) {
  //  alert("Upload has been cancelled");
  //  //$scope.$apply(function(){
  //  //    $scope.current = currentPercent;
  //  //});
  //
  //  $timeout(function () {
  //    //update the report status to completed
  //    $scope.reportFormData.status = 'cancelled';
  //
  //    console.log($scope.reportFormData);
  //    $http.put('/api/UploadedPatientReport/' + reportID, $scope.reportFormData)
  //      .success(function (data) {
  //        $scope.message = data.message;
  //        console.log(data);
  //      })
  //      .error(function (data) {
  //        console.log('Error: ' + data);
  //        $scope.message = 'Error: ' + data;
  //      });
  //
  //
  //    $scope.current = 0;
  //    $scope.file = null;
  //    $scope.reportFormData = {};
  //    reportID = null;
  //  });
  //
  //
  //}
  //
  //$scope.CancelUpload = function () {
  //  //alert('aborting');
  //  if (xhr)
  //    xhr.abort();
  //
  //  $timeout(function () {
  //    $scope.file = null;
  //    $scope.reportFormData = {};
  //    reportID = null;
  //  });
  //}
}

})();
