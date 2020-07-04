export function addCookie(cookieName, cookieValue, days) {
    let expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = ";expires=" + date.toUTCString();
    }
    document.cookie = `${cookieName}=${cookieValue}${expires};path=/`;
}

export function getCookie(cookieName) {
    let name = cookieName + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            let value = "";
            value = c.substring(name.length, c.length);
            if (!value || value === "null") return null;
            return value;
        }
    }
    return "";
}

export function removeAllCookies() {
    document.cookie
        .split(";")
        .map(e => e.slice(0, e.indexOf("=")))
        .forEach(cookie => {
            removeCookie(cookie);
        });
}

export function removeCookie(cookieName) {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

export function logOut() {
    removeAllCookies();
};