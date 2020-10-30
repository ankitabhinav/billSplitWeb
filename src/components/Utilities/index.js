export const checkAuth = () => {
    //let token = localStorage.getItem('billSplitToken');
    let token = false;

    if(!token) {
        return false;
    } else {
        return true;
    }
}