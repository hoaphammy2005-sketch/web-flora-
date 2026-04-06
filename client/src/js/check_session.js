const checkSession = function () {
    let userSession = JSON.parse(localStorage.getItem('user_session'));

    if (userSession) {
        const now = new Date().getTime();
        if (now > userSession.expiry) {
            localStorage.removeItem('user_session');
            window.location.href = 'login.html';
        } else {
            console.log('Phiên còn hợp lệ.');
        }
    } else {
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = './login.html';
        }
    }
}
export { checkSession };
