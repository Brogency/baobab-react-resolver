import 'babel-polyfill';

export function getUser() {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve({
            pk: 1,
            type: 'user',
        }), 300);
    });
}

export function getProfile(userPk) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve({
            pk: 1,
            type: 'profile',
            userPk,
        }), 300);
    });
}

export function getSettings(profilePk) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve({
            pk: 1,
            type: 'settings',
            profilePk,
        }), 300);
    });
}
