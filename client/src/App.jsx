import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import CancerPatientDataABI from './artifacts/CancerPatientData.json';
import './App.css';

const App = () => {
    const [account, setAccount] = useState('');
    const [contract, setContract] = useState(null);
    const [patientAddress, setPatientAddress] = useState('');
    const [patientName, setPatientName] = useState('');
    const [patientAge, setPatientAge] = useState('');
    const [patientId, setPatientId] = useState('');
    const [fetchedPatient, setFetchedPatient] = useState(null);
    const [updateAddress, setUpdateAddress] = useState('');
    const [updateName, setUpdateName] = useState('');
    const [updateAge, setUpdateAge] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadWeb3();
        loadBlockchainData();
    }, []);

    const loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
    };

    const loadBlockchainData = async () => {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const networkId = await web3.eth.net.getId();
        const networkData = CancerPatientDataABI.networks[networkId];

        if (networkData) {
            const contractInstance = new web3.eth.Contract(
                CancerPatientDataABI.abi,
                networkData.address
            );
            setContract(contractInstance);
        } else {
            window.alert('The smart contract is not deployed to the current network');
        }
    };

    const registerPatient = async () => {
        if (!patientAddress || !patientName || !patientAge) {
            alert('All fields are required for registering a patient.');
            return;
        }
        setLoading(true);
        try {
            await contract.methods.registerPatient(patientAddress, patientName, parseInt(patientAge)).send({ from: account });
            alert('Patient registered successfully');
            setPatientAddress('');
            setPatientName('');
            setPatientAge('');
        } catch (error) {
            console.error(error);
            alert('Error registering patient');
        }
        setLoading(false);
    };

    const fetchPatient = async () => {
        if (!patientId) {
            alert('Patient ID is required.');
            return;
        }
        setLoading(true);
        try {
            const patient = await contract.methods.getPatient(patientId).call();
            setFetchedPatient(patient);
        } catch (error) {
            console.error(error);
            alert('Error fetching patient data');
        }
        setLoading(false);
    };

    const updatePatient = async () => {
        if (!updateAddress || !updateName || !updateAge) {
            alert('All fields are required for updating a patient.');
            return;
        }
        setLoading(true);
        try {
            await contract.methods.updatePatient(updateAddress, updateName, parseInt(updateAge)).send({ from: account });
            alert('Patient updated successfully');
            setUpdateAddress('');
            setUpdateName('');
            setUpdateAge('');
        } catch (error) {
            console.error(error);
            alert('Error updating patient');
        }
        setLoading(false);
    };

    return (
        <div className="main-container">
            <h1 className="title">Cancer Patient Data Management</h1>

            <div className="content-container">
                {loading && <div className="loading">Loading...</div>}

                <div className="section">
                    <h2>Register Patient</h2>
                    <input
                        type="text"
                        value={patientAddress}
                        onChange={(e) => setPatientAddress(e.target.value)}
                        placeholder="Patient Address"
                    />
                    <input
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="Patient Name"
                    />
                    <input
                        type="number"
                        value={patientAge}
                        onChange={(e) => setPatientAge(e.target.value)}
                        placeholder="Patient Age"
                    />
                    <button className="button" onClick={registerPatient}>
                        Register
                    </button>
                </div>

                <div className="section">
                    <h2>Fetch Patient</h2>
                    <input
                        type="number"
                        value={patientId}
                        onChange={(e) => setPatientId(e.target.value)}
                        placeholder="Patient ID"
                    />
                    <button className="button" onClick={fetchPatient}>
                        Fetch
                    </button>

                    {fetchedPatient && (
                        <div className="patient-details">
                            <h3>Patient Details</h3>
                            <p>Name: {fetchedPatient.name}</p>
                            <p>Age: {fetchedPatient.age}</p>
                        </div>
                    )}
                </div>

                <div className="section">
                    <h2>Update Patient</h2>
                    <input
                        type="text"
                        value={updateAddress}
                        onChange={(e) => setUpdateAddress(e.target.value)}
                        placeholder="Patient Address"
                    />
                    <input
                        type="text"
                        value={updateName}
                        onChange={(e) => setUpdateName(e.target.value)}
                        placeholder="New Patient Name"
                    />
                    <input
                        type="number"
                        value={updateAge}
                        onChange={(e) => setUpdateAge(e.target.value)}
                        placeholder="New Patient Age"
                    />
                    <button className="button" onClick={updatePatient}>
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
};

export default App;