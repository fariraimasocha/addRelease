import { useState } from 'react';
import { addRelease_backend } from 'declarations/addRelease_backend';
import InputField from './InputField';

function App() {
    const [releaseId, setReleaseId] = useState('');
    const [version, setVersion] = useState('');
    const [features, setFeatures] = useState('');
    const [releases, setReleases] = useState([]);

    function handleCreate(event) {
        event.preventDefault();
        addRelease_backend.create_release(releaseId, version, features).then((id) => {
            setReleaseId(id);
        });
        return false;
    }

    function handleGet(event) {
        event.preventDefault();
        addRelease_backend.get_release(releaseId).then((release) => {
            setVersion(release.version);
            setFeatures(release.features);
        });
        return false;
    }

    function handleUpdate(event) {
        event.preventDefault();
        addRelease_backend.update_release(releaseId, version, features).then((id) => {
            setReleaseId(id);
        });
        return false;
    }

    function handleDelete(event) {
        event.preventDefault();
        addRelease_backend.delete_release(releaseId).then(() => {
            setReleaseId('');
            setVersion('');
            setFeatures('');
        });
        return false;
    }

    function handleGetAll(event) {
        event.preventDefault();
        addRelease_backend.get_all_releases().then((allReleases) => {
            setReleases(allReleases);
        });
        return false;
    }

    return (
        <main className="p-4">
            <img src="/logo2.svg" alt="DFINITY logo" />
            <br />
            <br />
            <form action="#" onSubmit={handleCreate} className="justify-center mx-auto flex space-y-5">
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
            </form>
            <div className="flex space-x-4 justify-center mx-auto mt-10">
                <button onClick={handleCreate} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
                    Create Release
                </button>
                <button onClick={handleGet} className="bg-green-500 text-white p-2 rounded hover:bg-green-700">
                    Get Release
                </button>
                <button onClick={handleUpdate} className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-700">
                    Update Release
                </button>
                <button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded hover:bg-red-700">
                    Delete Release
                </button>
                <button onClick={handleGetAll} className="bg-purple-500 text-white p-2 rounded hover:bg-purple-700">
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