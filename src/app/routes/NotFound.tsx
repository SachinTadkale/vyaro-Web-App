import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.text}>
        Page not found. Please go back to home.
      </h1>

      <button style={styles.button} onClick={() => navigate("/")}>
        Go to Home
      </button>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #f5f5f5, #e0e0e0)", // simple attraction
    fontFamily: "Arial, sans-serif",
  },
  text: {
    fontSize: "20px",
    marginBottom: "20px",
    color: "#333",
  },
  button: {
    padding: "10px 20px",
    fontSize: "14px",
    cursor: "pointer",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
  },
};

export default PageNotFound;