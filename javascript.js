/*
	The MIT License (MIT)

    Copyright (c) 2015 Zachary Seguin

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
*/

angular
    .module('PortalApp')
    .controller('widgetCtrl', ['$scope', '$http', '$q', '$filter', function ($scope, $http, $q, $filter) {

        /** Widget Configuration **/
        $scope.portalHelpers.config = {
            "title": "Public Health Inspections",
            "icon": "icon-attention"
        };

        // Search filter
        $scope.filter = { value: '' };
        
        // Facilities Pagination
        $scope.currentPage = 1;
        $scope.itemsPerPage = 5;
        $scope.maxSize = 3; // maximum number of page links to display

        /** Methods **/
        var InspectionsData = {
          
          	// Returns listing of all facilities.
            facilities: function() {
                return $scope.portalHelpers.invokeServerFunction('getFacilities');
            }, // End of facilities
          
          	// Returns inspections for a given facility.
            facility: function(facilityId) {
                return $scope.portalHelpers.invokeServerFunction('getFacility', { facilityId: facilityId });
            } // End of facility
        }; // End of InspectionsData
        
      	// Filters the facilities based on page and filter.
        $scope.filterFacilities = function() {
            if ($scope.filter.value == $scope.lastFilterValue) {
            	var start = $scope.itemsPerPage * ($scope.currentPage - 1);
            	$scope.filteredFacilities = $scope.matchingFacilities.slice(start, start + $scope.itemsPerPage);
            } else {
                $scope.lastFilterValue = $scope.filter.value;
                $scope.matchingFacilities = $filter('filter')($scope.facilities, $scope.filter.value);
                $scope.filterFacilities();
            }// End of else
        }; // End of filterFacilities method

        /** Events **/
        // Callback called when the page is changed.
        $scope.pageChanged = function(newPage) {
            $scope.currentPage = newPage;
            $scope.filterFacilities();
        }; // End of pageChanged event
        
        // Callback when a facility is clicked
        $scope.showFacility = function(facility) {
            $scope.portalHelpers.toggleLoading(true);
            $scope.portalHelpers.showView('loading.html', 2);
            
            InspectionsData.facility(facility.id).then(function(facility) {
                $scope.facility = facility;
                $scope.portalHelpers.toggleLoading(false);
                $scope.portalHelpers.showView('facility.html', 2);
            });
        }; // End of showFacility event
        
        // Callback when clear button is clicked.
        $scope.resetFilterFacilities = function() {
           $scope.filter.value = "";
           $scope.matchingFacilities = $scope.facilities;
           $scope.filterFacilities();
        }; // End of resetFilterFacilities event
        
        /** Initialize **/
        InspectionsData.facilities().then(function(facilities) {
            // Sort and set the data
            $scope.facilities = $filter('orderBy')(facilities, 'name');
            $scope.matchingFacilities = $scope.facilities;
            $scope.filterFacilities();
            
            // Stop showing loading and display the data
            $scope.portalHelpers.toggleLoading(false);
            $scope.portalHelpers.showView('main.html', 1);
        });

        $scope.portalHelpers.toggleLoading(true);
        $scope.portalHelpers.showView('loading.html', 1);
}]);