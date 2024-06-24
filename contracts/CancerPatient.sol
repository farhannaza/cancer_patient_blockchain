// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract CancerPatientData {

    address public admin;

    constructor() {
        admin = msg.sender; // The deployer of the contract becomes the admin
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action.");
        _;
    }

    struct Patient {
        string name;
        uint256 age;
    }

    Patient[] public patients;

    mapping(address => bool) public registeredPatients;

    event PatientRegistered(string name, uint256 age);
    event PatientUpdated(uint256 patientId, string name, uint256 age);

    function registerPatient(address _patientAddress, string memory _name, uint256 _age) public onlyAdmin {
        require(!registeredPatients[_patientAddress], "Patient already registered.");
        patients.push(Patient(_name, _age));
        registeredPatients[_patientAddress] = true;
        emit PatientRegistered(_name, _age);
    }

    function updatePatient(uint256 _patientId, string memory _name, uint256 _age) public onlyAdmin {
        require(_patientId < patients.length, "Invalid patient ID.");
        patients[_patientId].name = _name;
        patients[_patientId].age = _age;
        emit PatientUpdated(_patientId, _name, _age);
    }

    function getPatient(uint256 _patientId) public view returns (string memory name, uint256 age) {
        require(_patientId < patients.length, "Invalid patient ID.");
        Patient memory patient = patients[_patientId];
        return (patient.name, patient.age);
    }
}
