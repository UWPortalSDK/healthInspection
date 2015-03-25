angular.module('PortalApp')

.controller('widgetCtrl', ['$scope', '$http', '$q', '$filter', function ($scope, $http, $q, $filter) {

    // SETUP

    // Widget Configuration
    $scope.portalHelpers.config = {
        "title": "Public Health Inspections",
        "icon": "icon-attention"
    };

    // Show loading message in the first column
    $scope.portalHelpers.showView('loading.html', 1);

    // Show loading animation
    $scope.portalHelpers.toggleLoading(true);

    /**
     * Configuration
     */
    $scope.filter = { value: '' };
  	$scope.itemsPerPage = 20;
    $scope.currentPage = 1;
    $scope.maxSize = 3;
    $scope.matchingFacilities = 0;
  	$scope.pageChanged = function(newPage) {
        $scope.currentPage = newPage;
        $scope.filterFacilities();
    }
  
    /**
     * Facilities
     */
	$scope.getInspectionFacilities = function() {
		$scope.portalHelpers.invokeServerFunction('getInspectionFacilities').then(function(result) {
            $scope.facilities = $filter('orderBy')(result, 'name');
            $scope.matchingFacilities = $scope.facilities;
            $scope.filterFacilities();
            $scope.portalHelpers.toggleLoading(false);
            $scope.portalHelpers.showView('main.html', 1);
        });   
    }// End of getInspectionFacilities
    
    $scope.filterFacilities = function() {
        if ($scope.filter.value == $scope.lastFilterValue) {
        	var start = $scope.itemsPerPage * ($scope.currentPage - 1);
        	$scope.filteredFacilities = $scope.matchingFacilities.slice(start, start + $scope.itemsPerPage);
        } else {
            $scope.lastFilterValue = $scope.filter.value;
            $scope.matchingFacilities = $filter('filter')($scope.facilities, $scope.filter.value);
            $scope.filterFacilities();
        }// End of else
    }// End of filterFacilities
    
    $scope.resetFilterFacilities = function() {
       $scope.filter.value = "";
       $scope.matchingFacilities = $scope.facilities;
       $scope.filterFacilities();
    }
    
    $scope.getInspectionFacilities();
   
    // DETAILS VIEW EXAMPLE
    $scope.showFacility = function (facility) {
        $scope.portalHelpers.toggleLoading(true);
        $scope.portalHelpers.showView('loading.html', 2);
        $scope.portalHelpers.invokeServerFunction('getFacility', { facilityId: facility.id }).then(function(result) {
            $scope.facility = result;
            $scope.portalHelpers.toggleLoading(false);
            $scope.portalHelpers.showView('facility.html', 2);
        });
    }
}])