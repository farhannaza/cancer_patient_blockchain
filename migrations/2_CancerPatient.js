const CancerPatientData = artifacts.require("CancerPatientData");
 
module.exports = function (deployer) {
  deployer.deploy(CancerPatientData);
};