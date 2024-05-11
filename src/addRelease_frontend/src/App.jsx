import React, { useState } from 'react';
import { addRelease_backend } from 'declarations/addRelease_backend';
import InputField from './InputField';

function App() {
    const [releaseId, setReleaseId] = useState('');
    const [version, setVersion] = useState('');
    const [features, setFeatures] = useState('');
    const [wasmFile, setWasmFile] = useState(null);
    const [releases, setReleases] = useState([]);

    const handleFileChange = (file) => {
        setWasmFile(file);
    }

    const handleReleaseCreation = async (event) => {
        event.preventDefault();
        try {
            const id = await addRelease_backend.create_release(releaseId, version, features, wasmFile);
            setReleaseId(id);
        } catch (error) {
            // Handle error
            console.error(error);
        }
    }

    const handleReleaseRetrieval = async (event) => {
        event.preventDefault();
        try {
            const release = await addRelease_backend.get_release(releaseId);
            setVersion(release.version);
            setFeatures(release.features);
        } catch (error) {
            // Handle error
            console.error(error);
        }
    }

    const handleReleaseUpdate = async (event) => {
        event.preventDefault();
        try {
            const id = await addRelease_backend.update_release(releaseId, version, features);
            setReleaseId(id);
        } catch (error) {
            // Handle error
            console.error(error);
        }
    }

    const handleReleaseDeletion = async (event) => {
        event.preventDefault();
        try {
            await addRelease_backend.delete_release(releaseId);
            setReleaseId('');
            setVersion('');
            setFeatures('');
        } catch (error) {
            // Handle error
            console.error(error);
        }
    }

    const handleGetAllReleases = async (event) => {
        event.preventDefault();
        try {
            const allReleases = await addRelease_backend.get_all_releases();
            setReleases(allReleases);
        } catch (error) {
            // Handle error
            console.error(error);
        }
    }

    return (
        <main className="p-4">
            <img src="/logo2.svg" alt="DFINITY logo" />
            <br />
            <br />
            <form onSubmit={handleReleaseCreation} className="justify-center mx-auto flex space-y-5">
                <InputField
                    id="releaseId"
                    label="Release ID"
                    type="text"
                    onChange={(e) => setReleaseId(e.target.value)}
                />
                <InputField
                    id="version"
                    label="Release Version"
                    type="text"
                    onChange={(e) => setVersion(e.target.value)}
                />
                <InputField
                    id="features"
                    label="Features"
                    type="text"
                    onChange={(e) => setFeatures(e.target.value)}
                />
                <InputField
                    id="wasmFile"
                    label="Wasm File"
                    type="file"
                    onChange={(e) => handleFileChange(e.target.files[0])}
                />
            </form>
            <div className="flex space-x-4 justify-center mx-auto mt-10">
                <button onClick={handleReleaseCreation} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
                    Create Release
                </button>
                <button onClick={handleReleaseRetrieval} className="bg-green-500 text-white p-2 rounded hover:bg-green-700">
                    Get Release
                </button>
                <button onClick={handleReleaseUpdate} className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-700">
                    Update Release
                </button>
                <button onClick={handleReleaseDeletion} className="bg-red-500 text-white p-2 rounded hover:bg-red-700">
                    Delete Release
                </button>
                <button onClick={handleGetAllReleases} className="bg-purple-500 text-white p-2 rounded hover:bg-purple-700">
                    Get All Releases
                </button>
            </div>
            <section id="releases" className="mt-4 justify-center mx-auto">
                {JSON.stringify(releases)}
            </section>
        </main>
    );
}

export default App;