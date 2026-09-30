function Input({ className = "", ...props }) {
    return <input className={`app-input ${className}`} {...props} />;
}
export default Input;