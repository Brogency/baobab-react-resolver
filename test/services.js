import 'babel-polyfill';

export function getUser() {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve({
            pk: 1,
            type: 'user',
        }), 500);
    });
}

export function getProfile(userPk) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve({
            pk: 1,
            type: 'profile',
            userPk,
        }), 500);
    });
}
