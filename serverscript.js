function getInspectionFacilities() {
    return proxy.GetProxy("https://zacharyseguin.ca/projects/you-want-food/api/inspections/facilities.json");
};

function getFacility() {
    return proxy.GetProxy("https://zacharyseguin.ca/projects/you-want-food/api/inspections/facility/" + args.Get("facilityId") + ".json");
}