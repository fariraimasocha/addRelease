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



#[update]
fn create_release(id: String, version: String, features: String, wasm_file: Vec<u8>) -> String {
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

