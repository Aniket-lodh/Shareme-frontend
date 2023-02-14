export const fetchUser = () => {
    return (
        localStorage.getItem("user") !== undefined
        ? localStorage.getItem("user")
        : localStorage.clear()
    );
}