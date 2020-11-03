export const checkAuth = () => {
    let token = localStorage.getItem('billsplit_user_key');
    //let token = false;

    if(!token) {
        return false;
    } else {
        return true;
    }
}