import createTrack from './create_track.js';

export function OpenIDBRequest() {
    let request = indexedDB.open('audioData',5);
    request.onupgradeneeded = function() {
        let db = request.result;
        if (!db.objectStoreNames.contains('files')) {
            let objStore = db.createObjectStore('files',{autoIncrement: true});
        }
    }
    request.onerror = function() {
        console.error("Error", request.error);
    }
    return request;
}

export function updateDb(file,id) {
    let request = OpenIDBRequest();
    request.onsuccess = function() {
        let db = request.result;                                  // IDBDataBase object;
        let transaction = db.transaction('files','readwrite');    // IDBTransaction object;
        let objStore = transaction.objectStore('files');          // IDBObjectStore object;
        let tryPut = objStore.put(file,id);
        tryPut.onsuccess = function () {
            db.close();
            return;
        }
        tryPut.onerror = function() {
            console.log(tryPut.error);
            db.close();
            return;
        }
    }
}

window.onload = function() {
    let request = OpenIDBRequest();
    request.onsuccess = function() {
        let db = request.result;
        let transaction = db.transaction('files','readonly');
        let objStore = transaction.objectStore('files');
        let tryGet = objStore.getAll();
        tryGet.onsuccess = function () {
            let result = tryGet.result;
            result.forEach(file => createTrack(file));
            db.close();
            return;
        }
        tryGet.onerror = function() {
            console.log(tryGet.error);
            db.close();
            return;
        }
    }
}
