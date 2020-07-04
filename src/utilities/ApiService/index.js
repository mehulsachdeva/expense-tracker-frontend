import fetch from 'isomorphic-unfetch'

export default class ApiService {
    static post(url, body) {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(r => {
            return r.json()
        }).then(r => {
            if(r.STATUS === "Success")
                return r;
            return Promise.reject(r);
        }).catch(err => {
            Promise.reject(err)
        })
    }
    
    static postWithAuthentication(url, body, token) {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(body)
        }).then(r => {
            return r.json()
        }).then(r => {
            if(r.STATUS === "Success")
                return r;
            return Promise.reject(r);
        }).catch(err => {
            Promise.reject(err)
        })
    }

    static getWithAuthentication(url, token) {
        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            }
        }).then(r => {
            return r.json()
        }).then(r => {
            if(r.STATUS === "Success")
                return r;
            return Promise.reject(r);
        }).catch(err => {
            Promise.reject(err)
        })
    }
}