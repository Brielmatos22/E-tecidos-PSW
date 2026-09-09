import Login from "./components/loginComponent/Login";


export default function App() {
    return (
        <div
            style={{
                boxSizing: "border-box",
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: 0,
                padding: "24px",
                background: "#f1ebe3",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <Login />
        </div>
    );
}
