use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk_macros::*;
use serde::Serialize;
use std::cell::RefCell;
use std::collections::BTreeMap;
use sha2::{Sha256, Digest};

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
struct Release {
    id: String,
    version: String,
    features: String,
    wasm_file: Vec<u8>,
    wasm_hash: String,
}

thread_local! {
    static RELEASES: RefCell<BTreeMap<String, Release>> = RefCell::default();
}

fn hash_wasm_file(wasm_file: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(wasm_file);
    let result = hasher.finalize();
    format!("{:x}", result)
}

fn chunk_wasm_file(wasm_file: &[u8]) -> Vec<Vec<u8>> {
    let chunk_size = 1024 * 1024; // 1MiB
    let chunks = wasm_file
        .chunks(chunk_size)
        .map(|chunk| chunk.to_vec())
        .collect();
    chunks
}

#[update]
fn create_release(id: String, version: String, features: String, wasm_file: Vec<u8>) -> String {
    let chunks = chunk_wasm_file(&wasm_file); 
    let wasm_hash = hash_wasm_file(&wasm_file);
    for chunk in chunks {
    }
    let release = Release {
        id: id.clone(),
        version,
        features,
        wasm_file,
        wasm_hash,
    };
    RELEASES.with(|releases| {
        releases.borrow_mut().insert(id.clone(), release);
    });
    id
}

#[query]
fn get_release(release_id: String) -> Option<Release> {
    RELEASES.with(|releases| releases.borrow().get(&release_id).cloned())
}

#[update]
fn update_release(id: String, version: String, features: String, wasm_file: Vec<u8>) -> String {
    let chunks = chunk_wasm_file(&wasm_file); // Chunk the wasm file
    let wasm_hash = hash_wasm_file(&wasm_file); // Hash the wasm file
    for chunk in chunks {
        // Upload each chunk using the `upload_chunk` method
    }
    let release = Release {
        id: id.clone(),
        version,
        features,
        wasm_file,
        wasm_hash,
    };
    RELEASES.with(|releases| {
        releases.borrow_mut().insert(id.clone(), release);
    });
    id
}

#[update]
fn delete_release(release_id: String) -> String {
    RELEASES.with(|releases| {
        releases.borrow_mut().remove(&release_id);
    });
    "Release deleted".to_string()
}

#[query]
fn get_all_releases() -> Vec<Release> {
    RELEASES.with(|releases| releases.borrow().values().cloned().collect())
}


#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_and_get_release() {
        let id = "test".to_string();
        let version = "1.0.0".to_string();
        let features = "test features".to_string();
        let wasm_file = vec![1, 2, 3, 4, 5];

        // Test creating a release
        let created_id = create_release(id.clone(), version.clone(), features.clone(), wasm_file.clone());
        assert_eq!(created_id, id);

        // Test getting the created release
        let release = get_release(id.clone()).unwrap();
        assert_eq!(release.id, id);
        assert_eq!(release.version, version);
        assert_eq!(release.features, features);
        assert_eq!(release.wasm_file, wasm_file);
    }

    #[test]
    fn test_update_release() {
        let id = "test".to_string();
        let version = "1.0.0".to_string();
        let features = "test features".to_string();
        let wasm_file = vec![1, 2, 3, 4, 5];

        // Create a release
        create_release(id.clone(), version.clone(), features.clone(), wasm_file.clone());

        // Update the release
        let updated_version = "1.0.1".to_string();
        let updated_id = update_release(id.clone(), updated_version.clone(), features.clone(), wasm_file.clone());
        assert_eq!(updated_id, id);

        // Check that the release was updated
        let release = get_release(id.clone()).unwrap();
        assert_eq!(release.version, updated_version);
    }

    #[test]
    fn test_delete_release() {
        let id = "test".to_string();
        let version = "1.0.0".to_string();
        let features = "test features".to_string();
        let wasm_file = vec![1, 2, 3, 4, 5];

        // Create a release
        create_release(id.clone(), version.clone(), features.clone(), wasm_file.clone());

        // Delete the release
        let message = delete_release(id.clone());
        assert_eq!(message, "Release deleted".to_string());

        // Check that the release was deleted
        let release = get_release(id.clone());
        assert!(release.is_none());
    }

    #[test]
    fn test_get_all_releases() {
        let id1 = "test1".to_string();
        let version1 = "1.0.0".to_string();
        let features1 = "test features 1".to_string();
        let wasm_file1 = vec![1, 2, 3, 4, 5];

        let id2 = "test2".to_string();
        let version2 = "1.0.0".to_string();
        let features2 = "test features 2".to_string();
        let wasm_file2 = vec![6, 7, 8, 9, 10];

        // Create two releases
        create_release(id1.clone(), version1.clone(), features1.clone(), wasm_file1.clone());
        create_release(id2.clone(), version2.clone(), features2.clone(), wasm_file2.clone());

        let releases = get_all_releases();
        assert_eq!(releases.len(), 2);
        assert!(releases.iter().any(|release| release.id == id1));
        assert!(releases.iter().any(|release| release.id == id2));
    }
}